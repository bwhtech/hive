import frappe


def on_user_invitation_update(doc: "frappe.types.Document", method: str) -> None:
	"""Auto-create Hive Member when a User Invitation is accepted."""
	if doc.status != "Accepted" or not doc.email:
		return

	user = frappe.db.get_value("User", {"email": doc.email}, "name")
	if not user:
		return

	if frappe.db.exists("Hive Member", user):
		return

	member_type = "Team"
	if doc.invited_to_role and "Hive Client" in (doc.invited_to_role or ""):
		member_type = "Client"
	elif hasattr(doc, "role") and doc.role == "Hive Client":
		member_type = "Client"

	member = frappe.new_doc("Hive Member")
	member.user = user
	member.type = member_type
	member.is_active = 1

	# Auto-assign client if the invitation was sent from a client context
	if member_type == "Client" and getattr(doc, "hive_client", None):
		member.client = doc.hive_client

	member.insert(ignore_permissions=True)
