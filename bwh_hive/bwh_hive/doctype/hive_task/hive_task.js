// Copyright (c) 2026, BWH Studios and contributors
// For license information, please see license.txt

// Minimal agent desk UX (specs/v2 §E.10). Approve/Changes/Merge buttons come online
// in Phases 3–4; for now we surface the agent state and quick links.
frappe.ui.form.on("Hive Task", {
	refresh(frm) {
		if (!frm.doc.agent_status) {
			return;
		}

		const colors = {
			Queued: "gray",
			Provisioning: "blue",
			"Spec In Progress": "blue",
			"Spec Created": "orange",
			"Spec Approved": "blue",
			Implementing: "blue",
			"PR Ready": "green",
			"Changes Requested": "orange",
			Merged: "green",
			Cancelled: "gray",
			Failed: "red",
		};

		let banner = __("Agent: {0}", [frm.doc.agent_status]);
		if (frm.doc.agent_last_error) {
			banner += ` — ${frappe.utils.escape_html(frm.doc.agent_last_error)}`;
		}
		frm.dashboard.add_indicator(banner, colors[frm.doc.agent_status] || "gray");

		// Spec review → approval (specs/v2 04-phase-3). Approving dispatches implementation.
		if (frm.doc.agent_status === "Spec Created") {
			frm.add_custom_button(__("Approve Spec"), () => {
				frappe.prompt(
					[
						{
							fieldname: "note",
							fieldtype: "Small Text",
							label: __("Note (optional)"),
						},
					],
					(values) => {
						frm.call("approve_spec", { note: values.note }).then(() => {
							frappe.show_alert({
								message: __("Spec approved — implementation starting."),
								indicator: "green",
							});
							frm.reload_doc();
						});
					},
					__("Approve Spec"),
					__("Approve")
				);
			}).addClass("btn-primary");
		}

		// PR review → request changes / mark merged (specs/v2 05-phase-4 §B.9).
		if (frm.doc.agent_status === "PR Ready") {
			frm.add_custom_button(__("Request Changes"), () => {
				frappe.prompt(
					[
						{
							fieldname: "body",
							fieldtype: "Small Text",
							label: __("Review comments"),
							reqd: 1,
						},
					],
					(values) => {
						const comments = [{ author: frappe.session.user, body: values.body }];
						frm.call("request_agent_changes", {
							comments: JSON.stringify(comments),
						}).then(() => {
							frappe.show_alert({
								message: __("Changes requested — agent is iterating."),
								indicator: "blue",
							});
							frm.reload_doc();
						});
					},
					__("Request Changes"),
					__("Send to Agent")
				);
			}).addClass("btn-primary");

			frm.add_custom_button(__("Mark Merged"), () => {
				frappe.confirm(
					__("Confirm the PR is merged on GitHub. This marks the task Merged."),
					() => {
						frm.call("mark_agent_merged").then(() => {
							frappe.show_alert({
								message: __("Task marked Merged."),
								indicator: "green",
							});
							frm.reload_doc();
						});
					}
				);
			});
		}

		// Failed → recovery affordances (specs/v2 06-phase-5 step 9).
		if (frm.doc.agent_status === "Failed") {
			frm.add_custom_button(__("Retry"), () => {
				frappe.confirm(
					__(
						"Tear down the old box (if any) and re-provision a fresh box for this task?"
					),
					() => {
						frm.call("retry_agent").then(() => {
							frappe.show_alert({
								message: __("Retry queued — provisioning a fresh box."),
								indicator: "blue",
							});
							frm.reload_doc();
						});
					}
				);
			}).addClass("btn-primary");

			frm.add_custom_button(__("Tear Down Now"), () => {
				frappe.confirm(
					__("Deprovision this box now instead of waiting for the grace sweep?"),
					() => {
						frm.call("teardown_agent_now").then(() => {
							frappe.show_alert({
								message: __("Teardown requested."),
								indicator: "orange",
							});
							frm.reload_doc();
						});
					}
				);
			});
		}

		// Any non-terminal agent task can be cancelled (specs/v2 06-phase-5 step 2).
		const TERMINAL = ["Merged", "Cancelled", "Failed"];
		if (!TERMINAL.includes(frm.doc.agent_status)) {
			frm.add_custom_button(__("Cancel Agent Task"), () => {
				frappe.confirm(__("Cancel this agent task? The box will be torn down."), () => {
					frm.call("cancel_agent").then(() => {
						frappe.show_alert({
							message: __("Task cancelled — box being torn down."),
							indicator: "gray",
						});
						frm.reload_doc();
					});
				});
			});
		}

		const open = (url) => url && window.open(url, "_blank");
		if (frm.doc.agent_code_url) {
			frm.add_custom_button(
				__("Open Code (spec)"),
				() => open(frm.doc.agent_code_url),
				__("Agent")
			);
		}
		if (frm.doc.agent_site_url) {
			frm.add_custom_button(
				__("Open Site"),
				() => open(frm.doc.agent_site_url),
				__("Agent")
			);
		}
		if (frm.doc.pr_link) {
			frm.add_custom_button(__("Open PR"), () => open(frm.doc.pr_link), __("Agent"));
		}
	},
});
