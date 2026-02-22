from typing import ClassVar

import frappe
from frappe.search.sqlite_search import SQLiteSearch


class HiveSearch(SQLiteSearch):
	INDEX_NAME = "hive_search.db"

	INDEX_SCHEMA: ClassVar[dict] = {
		"text_fields": ["title", "content"],
		"metadata_fields": ["doctype", "name", "project", "status", "priority"],
		"tokenizer": "unicode61 remove_diacritics 2",
	}

	INDEXABLE_DOCTYPES: ClassVar[dict] = {
		"Hive Project": {
			"fields": [
				"name",
				{"title": "title"},
				{"content": "description"},
				"modified",
				"status",
			],
			"filters": {},
		},
		"Hive Task": {
			"fields": [
				"name",
				{"title": "title"},
				{"content": "description"},
				"modified",
				"status",
				"priority",
				"project",
			],
			"filters": {},
		},
	}

	def get_search_filters(self):
		user = frappe.session.user
		if user == "Administrator":
			return {}

		roles = frappe.get_roles(user)
		if "System Manager" in roles:
			return {}

		return {}

	def prepare_document(self, doc):
		# Fill in missing description with title before base class validation
		config = self.doc_configs.get(getattr(doc, "doctype", None))
		if config:
			content_field = config.get("content_field")
			if content_field and not getattr(doc, content_field, None):
				setattr(doc, content_field, getattr(doc, config.get("title_field", "name"), "") or "")

		return super().prepare_document(doc)
