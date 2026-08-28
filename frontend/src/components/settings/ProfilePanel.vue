<template>
	<SettingsHeader title="Profile" description="How you appear to the rest of the team." />
	<SettingsBody>
		<div class="flex flex-col gap-8 pt-6">
			<section class="space-y-3">
				<h3 class="text-base font-semibold text-ink-gray-8">Photo</h3>
				<div class="flex items-center gap-4">
					<Avatar size="2xl" :image="form.user_image || undefined" :label="fullName" />
					<FileUploader
						doctype="User"
						:docname="userId"
						fieldname="user_image"
						:validate-file="validateImage"
						@success="onPhotoUploaded"
						@failure="onPhotoFailed"
					>
						<template #default="{ uploading, progress, openFileSelector }">
							<Button
								:label="uploading ? `Uploading ${progress}%` : 'Change photo'"
								:loading="uploading"
								@click="openFileSelector()"
							/>
						</template>
					</FileUploader>
					<Button
						v-if="form.user_image"
						variant="ghost"
						label="Remove"
						@click="removePhoto"
					/>
				</div>
			</section>

			<section class="space-y-3">
				<h3 class="text-base font-semibold text-ink-gray-8">Name</h3>
				<div class="grid gap-3 sm:grid-cols-2">
					<FormControl
						v-model="form.first_name"
						type="text"
						label="First name"
						placeholder="First name"
					/>
					<FormControl
						v-model="form.last_name"
						type="text"
						label="Last name"
						placeholder="Last name"
					/>
					<FormControl
						type="text"
						label="Full name"
						:model-value="fullName"
						disabled
						description="Generated from your first and last name."
					/>
					<FormControl
						v-model="form.designation"
						type="text"
						label="Designation"
						placeholder="e.g. Designer"
						:disabled="!member"
					/>
				</div>
			</section>
		</div>
	</SettingsBody>

	<!-- The footer only appears once something is dirty, per DESIGN.md. -->
	<div
		v-if="dirty"
		class="flex items-center justify-between gap-3 border-t border-outline-gray-1 px-6 py-3"
	>
		<p class="text-sm text-ink-gray-5">Unsaved changes</p>
		<div class="flex gap-2">
			<Button label="Discard" @click="reset" />
			<Button variant="solid" theme="gray" label="Save" :loading="saving" @click="save" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import {
	Avatar,
	Button,
	FileUploader,
	FormControl,
	SettingsBody,
	SettingsHeader,
	toast,
	useDoctype,
} from 'frappe-ui'
import { useSession } from '@/composables/useSession'
import type { HiveMember, SessionUser } from '@/types'

/** Frappe rejects larger avatars long before the browser struggles with them. */
const MAX_PHOTO_BYTES = 5 * 1024 * 1024

/** The profile form writes more of the User doc than the session needs. */
type ProfileUser = SessionUser & { name: string; first_name: string; last_name: string }

const { user, member, userId, reload } = useSession()
const userDoctype = useDoctype<ProfileUser>('User')
const memberDoctype = useDoctype<HiveMember>('Hive Member')

const form = reactive({
	first_name: '',
	last_name: '',
	designation: '',
	user_image: '',
})

const saved = reactive({ ...form })
const saving = ref(false)

function reset() {
	Object.assign(form, saved)
}

watch(
	[user, member],
	([userDoc, memberDoc]) => {
		const values = {
			first_name: (userDoc as Partial<ProfileUser> | null)?.first_name ?? '',
			last_name: (userDoc as Partial<ProfileUser> | null)?.last_name ?? '',
			designation: memberDoc?.designation ?? '',
			user_image: userDoc?.user_image ?? '',
		}
		Object.assign(saved, values)
		Object.assign(form, values)
	},
	{ immediate: true },
)

const fullName = computed(
	() =>
		[form.first_name, form.last_name].filter(Boolean).join(' ') || user.value?.full_name || '',
)

const dirty = computed(
	() =>
		form.first_name !== saved.first_name ||
		form.last_name !== saved.last_name ||
		form.designation !== saved.designation,
)

async function save() {
	if (saving.value) return
	saving.value = true
	try {
		if (form.first_name !== saved.first_name || form.last_name !== saved.last_name) {
			await userDoctype.setValue.submit({
				name: userId.value,
				first_name: form.first_name,
				last_name: form.last_name,
			})
		}
		if (member.value && form.designation !== saved.designation) {
			await memberDoctype.setValue.submit({
				name: userId.value,
				designation: form.designation,
			})
		}
		Object.assign(saved, { ...form })
		reload()
		toast.success('Profile updated')
	} catch (error) {
		toast.error(error instanceof Error ? error.message : 'Could not update your profile')
	} finally {
		saving.value = false
	}
}

function validateImage(file: File): string | void {
	if (!file.type.startsWith('image/')) return 'Pick an image file'
	if (file.size > MAX_PHOTO_BYTES) return 'Images must be under 5 MB'
}

async function setPhoto(url: string) {
	try {
		await userDoctype.setValue.submit({ name: userId.value, user_image: url })
		form.user_image = url
		saved.user_image = url
		reload()
	} catch {
		toast.error('Could not update your photo')
	}
}

function onPhotoUploaded(file: { file_url: string }) {
	setPhoto(file.file_url).then(() => toast.success('Photo updated'))
}

function onPhotoFailed(error: unknown) {
	toast.error(error instanceof Error ? error.message : 'Could not upload the photo')
}

function removePhoto() {
	setPhoto('').then(() => toast.success('Photo removed'))
}
</script>
