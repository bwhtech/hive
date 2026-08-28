"""Drop the columns and Singles rows left behind by the agent orchestration removal.

The agent fields were deleted from the Hive Task / Hive Project / Hive Settings DocType
JSON, which leaves their columns orphaned in the database (Frappe never drops a column on
its own). Runs in post_model_sync so the schema change has already landed and the fields
are definitely gone from the DocType.

Hive Settings is a Single, so its values live as rows in `tabSingles`, not as columns.
"""

import frappe

TASK_FIELDS = (
	"agent_status",
	"agent_dev_box",
	"agent_box_slug",
	"agent_control_url",
	"agent_control_token",
	"agent_site_url",
	"agent_code_url",
	"agent_spec_path",
	"agent_branch",
	"agent_last_error",
	"agent_box_torn_down",
)

PROJECT_FIELDS = (
	"agent_enabled",
	"github_pat",
	"agent_template_slug",
	"target_app_name",
	"target_app_repo",
	"target_app_branch",
	"skills_repo_override",
	"agent_spec_prompt",
	"agent_implement_prompt",
	"agent_changes_prompt",
)

SETTINGS_FIELDS = (
	"agent_orchestration_enabled",
	"benchspace_api_url",
	"benchspace_api_key",
	"benchspace_api_secret",
	"agent_callback_api_key",
	"agent_callback_api_secret",
	"default_agent_template_slug",
	"skills_repo",
	"anthropic_api_key",
	"claude_code_oauth_token",
	"agent_spec_prompt",
	"agent_implement_prompt",
	"agent_changes_prompt",
	"max_concurrent_agent_boxes",
	"provisioning_timeout_minutes",
	"spec_timeout_minutes",
	"implement_timeout_minutes",
	"idle_teardown_hours",
	"failed_teardown_grace_hours",
	"notifications_enabled",
	"telegram_bot_token",
	"telegram_default_chat_id",
)

AGENT_BOT_ROLE = "Agent Bot"
AGENT_BOT_USER = "agent@hive.local"


def execute():
	_drop_columns("Hive Task", TASK_FIELDS)
	_drop_columns("Hive Project", PROJECT_FIELDS)
	_clear_single("Hive Settings", SETTINGS_FIELDS)
	_clear_secrets()
	_drop_agent_bot_role()


def _drop_columns(doctype: str, fieldnames) -> None:
	table = f"tab{doctype}"
	if not frappe.db.table_exists(doctype):
		return

	existing = set(frappe.db.get_table_columns(doctype))
	orphaned = [f for f in fieldnames if f in existing]
	if not orphaned:
		return

	drops = ", ".join(f"DROP COLUMN `{f}`" for f in orphaned)
	frappe.db.sql_ddl(f"ALTER TABLE `{table}` {drops}")


def _clear_single(doctype: str, fieldnames) -> None:
	"""Single doctype values live in tabSingles rows, so there is no column to drop."""
	frappe.db.delete("Singles", {"doctype": doctype, "field": ("in", list(fieldnames))})


def _clear_secrets() -> None:
	"""Password fields keep their value in __Auth, keyed by the fieldname."""
	all_fields = set(SETTINGS_FIELDS) | set(TASK_FIELDS) | set(PROJECT_FIELDS)
	frappe.db.sql(
		"""DELETE FROM `__Auth`
		WHERE doctype IN ('Hive Settings', 'Hive Task', 'Hive Project')
		AND fieldname IN %(fields)s""",
		{"fields": tuple(all_fields)},
	)


def _drop_agent_bot_role() -> None:
	"""Remove the bot role installed by the old install.py `_ensure_agent_bot`.

	The `agent@hive.local` User is left in place — deleting a User cascades into links
	(ToDo, Comment, ...) and an orphaned disabled bot user is harmless.
	"""
	if not frappe.db.exists("Role", AGENT_BOT_ROLE):
		return

	frappe.db.delete("Has Role", {"role": AGENT_BOT_ROLE})
	frappe.delete_doc("Role", AGENT_BOT_ROLE, ignore_permissions=True, force=True)
