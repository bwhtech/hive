<template>
	<div class="space-y-2">
		<List v-if="rows.length" :columns="['auto', 'minmax(0,1fr)', 'auto']" divider="inset">
			<ListRow v-for="file in rows" :key="file.name" :value="file.name">
				<ListCell>
					<img
						v-if="isImage(file.file_name)"
						:src="file.file_url"
						:alt="file.file_name"
						class="size-8 rounded-2 object-cover"
					/>
					<span
						v-else
						:class="[fileIcon(file.file_name), 'size-4 text-ink-gray-5']"
						aria-hidden="true"
					/>
				</ListCell>
				<ListCell>
					<a
						:href="file.file_url"
						target="_blank"
						rel="noopener noreferrer"
						class="truncate text-base text-ink-gray-8 hover:underline"
					>
						{{ file.file_name }}
					</a>
				</ListCell>
				<ListCell>
					<div class="flex items-center gap-1.5">
						<Tooltip v-if="file.is_private" text="Private file">
							<span class="lucide-lock size-3.5 text-ink-gray-5" aria-hidden="true" />
						</Tooltip>
						<span class="text-sm tabular-nums text-ink-gray-5">
							{{ formatSize(file.file_size) }}
						</span>
						<Button
							variant="ghost"
							icon="lucide-download"
							:link="file.file_url"
							:download="file.file_name"
							aria-label="Download"
							tooltip="Download"
						/>
						<Button
							v-if="!readOnly"
							variant="ghost"
							theme="red"
							icon="lucide-trash-2"
							aria-label="Remove file"
							tooltip="Remove"
							:loading="files.delete.isLoading(file.name)"
							@click="remove(file)"
						/>
					</div>
				</ListCell>
			</ListRow>
		</List>

		<template v-if="!readOnly">
			<FileUploader
				:doctype="'Hive Task'"
				:docname="taskName"
				:private="isPrivate"
				:validate-file="validateFile"
				@success="onUploaded"
				@failure="onFailed"
			>
				<template #default="{ uploading, progress, openFileSelector }">
					<div
						class="flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-4 border border-dashed px-4 py-5 transition-colors"
						:class="
							dragOver
								? 'border-outline-gray-4 bg-surface-gray-2'
								: 'border-outline-gray-2 hover:border-outline-gray-3'
						"
						role="button"
						tabindex="0"
						@click="uploading || busy ? null : openFileSelector()"
						@keydown.enter.prevent="openFileSelector()"
						@keydown.space.prevent="openFileSelector()"
						@dragover.prevent="dragOver = true"
						@dragleave.prevent="dragOver = false"
						@drop.prevent="onDrop"
					>
						<template v-if="uploading || busy">
							<Spinner class="size-4 text-ink-gray-5" />
							<span class="text-sm text-ink-gray-5">
								{{ uploading ? `Uploading ${progress}%` : 'Uploading…' }}
							</span>
						</template>
						<template v-else>
							<span class="lucide-upload size-5 text-ink-gray-5" aria-hidden="true" />
							<span class="text-sm text-ink-gray-5">
								Drop files here or click to browse
							</span>
						</template>
					</div>
				</template>
			</FileUploader>

			<Switch
				v-model="isPrivate"
				size="sm"
				label="Upload as private"
				description="Private files are only visible to users with permission."
			/>
		</template>

		<p v-else-if="!rows.length" class="text-sm text-ink-gray-5">No attachments</p>
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
	Button,
	FileUploader,
	Spinner,
	Switch,
	Tooltip,
	dialog,
	toast,
	upload,
	useList,
} from 'frappe-ui'
import { List, ListCell, ListRow } from 'frappe-ui/list'
import type { Bool } from '@/types'

interface AttachedFile {
	name: string
	file_name: string
	file_url: string
	file_size: number
	is_private: Bool
}

const props = withDefaults(defineProps<{ taskName: string; readOnly?: boolean }>(), {
	readOnly: false,
})

/** Frappe's own default; anything larger is rejected before the request. */
const MAX_FILE_SIZE_MB = 10
const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024

const isPrivate = ref(false)
const dragOver = ref(false)
/** Set while dropped files upload — `FileUploader` only tracks its own input. */
const busy = ref(false)

const files = useList<AttachedFile>({
	doctype: 'File',
	fields: ['name', 'file_name', 'file_url', 'file_size', 'is_private'],
	filters: () => ({
		attached_to_doctype: 'Hive Task',
		attached_to_name: props.taskName,
	}),
	orderBy: 'creation desc',
	limit: 50,
})

const rows = computed(() => files.data ?? [])

const IMAGE_EXTENSIONS = new Set(['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'avif'])

const EXTENSION_ICONS: Record<string, string> = {
	pdf: 'lucide-file-text',
	doc: 'lucide-file-text',
	docx: 'lucide-file-text',
	txt: 'lucide-file-text',
	md: 'lucide-file-text',
	xls: 'lucide-file-spreadsheet',
	xlsx: 'lucide-file-spreadsheet',
	csv: 'lucide-file-spreadsheet',
	mp4: 'lucide-file-video',
	mov: 'lucide-file-video',
	webm: 'lucide-file-video',
	avi: 'lucide-file-video',
	mp3: 'lucide-file-audio',
	wav: 'lucide-file-audio',
	flac: 'lucide-file-audio',
	ogg: 'lucide-file-audio',
	zip: 'lucide-file-archive',
	rar: 'lucide-file-archive',
	'7z': 'lucide-file-archive',
	gz: 'lucide-file-archive',
	tar: 'lucide-file-archive',
	js: 'lucide-file-code',
	ts: 'lucide-file-code',
	tsx: 'lucide-file-code',
	jsx: 'lucide-file-code',
	py: 'lucide-file-code',
	html: 'lucide-file-code',
	css: 'lucide-file-code',
	json: 'lucide-file-code',
	vue: 'lucide-file-code',
}

function extension(fileName: string): string {
	return fileName.split('.').pop()?.toLowerCase() ?? ''
}

function isImage(fileName: string): boolean {
	return IMAGE_EXTENSIONS.has(extension(fileName))
}

function fileIcon(fileName: string): string {
	return EXTENSION_ICONS[extension(fileName)] ?? 'lucide-file'
}

function formatSize(bytes: number): string {
	if (!bytes) return '0 B'
	if (bytes < 1024) return `${bytes} B`
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function validateFile(file: File): string | null {
	if (file.size > MAX_FILE_SIZE) {
		return `"${file.name}" is larger than ${MAX_FILE_SIZE_MB}MB.`
	}
	return null
}

function onUploaded() {
	files.reload()
	toast.success('File uploaded')
}

function onFailed(error: unknown) {
	toast.error(error instanceof Error ? error.message : 'Failed to upload file')
}

/**
 * `FileUploader` owns a single hidden input, so a drag-and-drop of one or more
 * files goes straight through `upload()` with the same options.
 */
async function onDrop(event: DragEvent) {
	dragOver.value = false
	if (props.readOnly || busy.value) return
	const dropped = Array.from(event.dataTransfer?.files ?? [])
	if (!dropped.length) return

	const tooLarge = dropped.filter((file) => file.size > MAX_FILE_SIZE)
	if (tooLarge.length) {
		toast.error(`${tooLarge.length} file(s) exceed the ${MAX_FILE_SIZE_MB}MB limit.`)
		return
	}

	busy.value = true
	try {
		for (const file of dropped) {
			await upload(file, {
				private: isPrivate.value,
				doctype: 'Hive Task',
				docname: props.taskName,
			})
		}
		files.reload()
		toast.success(dropped.length === 1 ? 'File uploaded' : `${dropped.length} files uploaded`)
	} catch (error) {
		toast.error(error instanceof Error ? error.message : 'Failed to upload file')
	} finally {
		busy.value = false
	}
}

function remove(file: AttachedFile) {
	dialog.danger({
		title: 'Remove attachment?',
		message: `"${file.file_name}" will be deleted permanently.`,
		confirmLabel: 'Remove',
		onConfirm: async () => {
			try {
				await files.delete.submit({ name: file.name })
				files.reload()
				toast.success('File removed')
			} catch {
				toast.error('Failed to remove file')
			}
		},
	})
}
</script>
