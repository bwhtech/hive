<template>
	<MultiSelect
		v-if="multiple"
		v-model:query="query"
		:model-value="(modelValue as string[]) ?? []"
		:options="options"
		:label="label"
		:description="description"
		:error="error"
		:required="required"
		:disabled="disabled"
		:placeholder="placeholder ?? `Select ${doctype}`"
		:loading="loading"
		:filterable="false"
		:empty-text="emptyText"
		@update:model-value="emit('update:modelValue', $event as string[])"
	/>
	<Combobox
		v-else
		v-model:query="query"
		:model-value="(modelValue as string | null) ?? null"
		:options="options"
		:label="label"
		:description="description"
		:error="error"
		:required="required"
		:disabled="disabled"
		:placeholder="placeholder ?? `Select ${doctype}`"
		:loading="loading"
		:filterable="false"
		:empty-text="emptyText"
		trigger="button"
		@update:model-value="emit('update:modelValue', ($event as string | null) ?? null)"
	/>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Combobox, MultiSelect } from 'frappe-ui'
import { useLinkSearch } from '@/composables/useLinkSearch'

/**
 * The single link field for the whole app: a `Combobox` (or `MultiSelect`)
 * backed by `frappe.desk.search.search_link`.
 */
const props = withDefaults(
	defineProps<{
		doctype: string
		modelValue: string | string[] | null
		filters?: Record<string, unknown>
		label?: string
		description?: string
		error?: string
		placeholder?: string
		emptyText?: string
		required?: boolean
		disabled?: boolean
		multiple?: boolean
	}>(),
	{ multiple: false },
)

const emit = defineEmits<{
	'update:modelValue': [value: string | string[] | null]
}>()

const query = ref('')

const { results, loading, search, searchNow } = useLinkSearch({
	doctype: props.doctype,
	filters: () => props.filters,
})

// The picker opens with an unfiltered first page, then follows the query.
searchNow('')
watch(query, (value) => search(value))
watch(
	() => props.filters,
	() => searchNow(query.value),
	{ deep: true },
)

const options = computed(() =>
	results.value.map((row) => ({
		label: row.label,
		value: row.value,
		description: row.description,
	})),
)
</script>
