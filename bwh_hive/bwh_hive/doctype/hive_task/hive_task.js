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
