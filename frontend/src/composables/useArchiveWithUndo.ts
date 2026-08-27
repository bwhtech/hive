import { toast, useDoctype } from 'frappe-ui'

/** How long the Undo action stays on screen. */
const UNDO_DURATION = 6000

/**
 * Soft-delete: flip `is_archived` and offer an Undo in the toast. Every
 * "delete" in the app goes through this, so nothing is ever really removed.
 */
export function useArchiveWithUndo(doctype: string) {
	const dt = useDoctype<{ name: string; is_archived: 0 | 1 }>(doctype)

	return async function archive(name: string, label: string, onDone?: () => void) {
		try {
			await dt.setValue.submit({ name, is_archived: 1 })
		} catch {
			toast.error(`Could not archive ${label}`)
			return
		}
		onDone?.()
		toast.success(`${label} archived`, {
			duration: UNDO_DURATION,
			action: {
				label: 'Undo',
				onClick: async () => {
					try {
						await dt.setValue.submit({ name, is_archived: 0 })
						onDone?.()
					} catch {
						toast.error(`Could not restore ${label}`)
					}
				},
			},
		})
	}
}
