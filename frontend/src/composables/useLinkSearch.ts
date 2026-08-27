import { ref, type Ref } from 'vue'
import { call, debounce } from 'frappe-ui'

export interface LinkOption {
	value: string
	label: string
	description?: string
}

interface SearchLinkResult {
	value: string
	label?: string
	description?: string
}

interface UseLinkSearchOptions {
	doctype: string
	filters?: () => Record<string, unknown> | undefined
	pageLength?: number
	/** Extra fields to show as the row's secondary text. */
	referenceDoctype?: string
}

/**
 * Wraps `frappe.desk.search.search_link` for `LinkPicker`. Debounced, and
 * self-cancelling: a slow response for an old query never overwrites a newer
 * one.
 */
export function useLinkSearch(options: UseLinkSearchOptions) {
	const results: Ref<LinkOption[]> = ref([])
	const loading = ref(false)
	let latest = 0

	async function run(query: string) {
		const token = ++latest
		loading.value = true
		try {
			const data = await call<SearchLinkResult[]>('frappe.desk.search.search_link', {
				doctype: options.doctype,
				txt: query ?? '',
				filters: options.filters?.() ?? {},
				page_length: options.pageLength ?? 20,
				reference_doctype: options.referenceDoctype,
			})
			if (token !== latest) return
			results.value = (data ?? []).map((row) => ({
				value: row.value,
				label: row.label || row.value,
				description: row.description,
			}))
		} catch {
			if (token === latest) results.value = []
		} finally {
			if (token === latest) loading.value = false
		}
	}

	const search = debounce(run, 250)

	return { results, loading, search, searchNow: run }
}
