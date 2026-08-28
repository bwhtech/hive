/** Strip tags from stored rich text so it can go in a one-line preview. */
export function stripHtml(html: string | null | undefined): string {
	if (!html) return ''
	const el = document.createElement('div')
	el.innerHTML = html
	return (el.textContent || '').replace(/\s+/g, ' ').trim()
}

export function truncate(text: string, max: number): string {
	if (text.length <= max) return text
	return `${text.slice(0, max - 1).trimEnd()}…`
}

export function initials(name: string | null | undefined): string {
	if (!name) return ''
	return name
		.split(/\s+/)
		.filter(Boolean)
		.map((part) => part[0])
		.join('')
		.toUpperCase()
		.slice(0, 2)
}

/** `true` when the editor produced markup but no actual content. */
export function isEmptyHtml(html: string | null | undefined): boolean {
	return stripHtml(html).length === 0 && !/<(img|iframe|video)\b/i.test(html || '')
}
