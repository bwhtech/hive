import {
  useFrappeGetDoc,
  useFrappePostCall,
  useFrappeAuth,
  useFrappeFileUpload,
} from "frappe-react-sdk"
import { useState, useEffect, useRef } from "react"
import { toast } from "sonner"
import { HugeiconsIcon } from "@hugeicons/react"
import { Camera01Icon } from "@hugeicons/core-free-icons"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

export function ProfileSection() {
  const { currentUser } = useFrappeAuth()
  const {
    data: profileData,
    isLoading,
    mutate: mutateProfile,
  } = useFrappeGetDoc<{
    name: string
    first_name: string
    last_name: string
    full_name: string
    user_image: string
  }>("User", currentUser ?? "", currentUser ? undefined : null, {
    revalidateOnFocus: false,
  })
  const { call: setValue, loading: saving } = useFrappePostCall(
    "frappe.client.set_value",
  )
  const { upload } = useFrappeFileUpload()

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    full_name: "",
    user_image: "",
  })
  const initialForm = useRef({
    first_name: "",
    last_name: "",
    full_name: "",
    user_image: "",
  })
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (profileData) {
      const values = {
        first_name: profileData.first_name || "",
        last_name: profileData.last_name || "",
        full_name: profileData.full_name || "",
        user_image: profileData.user_image || "",
      }
      setForm(values)
      initialForm.current = values
    }
  }, [profileData])

  const isDirty =
    form.first_name !== initialForm.current.first_name ||
    form.last_name !== initialForm.current.last_name

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    try {
      await setValue({
        doctype: "User",
        name: currentUser,
        fieldname: {
          first_name: form.first_name,
          last_name: form.last_name,
        },
      })
      await mutateProfile()
      toast.success("Profile updated")
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : "Failed to update profile"
      toast.error(message)
    }
  }

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const res = await upload(file, {
        isPrivate: false,
        doctype: "User",
        docname: currentUser!,
        fieldname: "user_image",
      })
      const fileUrl = (res as { file_url: string }).file_url
      await setValue({
        doctype: "User",
        name: currentUser,
        fieldname: { user_image: fileUrl },
      })
      await mutateProfile()
      toast.success("Profile photo updated")
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : "Failed to upload image"
      toast.error(message)
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const handleRemoveImage = async () => {
    try {
      await setValue({
        doctype: "User",
        name: currentUser,
        fieldname: { user_image: "" },
      })
      await mutateProfile()
      toast.success("Profile photo removed")
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : "Failed to remove image"
      toast.error(message)
    }
  }

  if (isLoading && !profileData) {
    return (
      <div className="p-4 md:p-6 space-y-6">
        <div className="space-y-4">
          <div className="space-y-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-48" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="size-16 rounded-full" />
            <Skeleton className="h-8 w-28 rounded-md" />
          </div>
        </div>
        <div className="space-y-4">
          <div className="space-y-1">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-3 w-56" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Skeleton className="h-9 w-full rounded-md" />
            <Skeleton className="h-9 w-full rounded-md" />
          </div>
          <Skeleton className="h-9 w-full rounded-md" />
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-6 space-y-6">
          {/* Profile Photo */}
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold">Profile Photo</h3>
              <p className="text-xs text-muted-foreground">
                Your profile photo visible to other team members.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative group">
                {form.user_image ? (
                  <img
                    src={form.user_image}
                    alt={form.full_name}
                    className="size-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex size-16 items-center justify-center rounded-full bg-muted text-lg font-medium text-muted-foreground">
                    {(form.full_name || currentUser || "?")[0].toUpperCase()}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <HugeiconsIcon
                    icon={Camera01Icon}
                    strokeWidth={2}
                    className="size-4 text-white"
                  />
                </button>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? <><Spinner className="mr-1.5" /> Uploading...</> : "Change Photo"}
                </Button>
                {form.user_image && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveImage}
                  >
                    Remove
                  </Button>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
          </div>

          {/* Name */}
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold">Name</h3>
              <p className="text-xs text-muted-foreground">
                Your full name is auto-generated from first and last name.
              </p>
            </div>
            <div className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="first_name" className="text-xs">
                    First Name
                  </Label>
                  <Input
                    id="first_name"
                    value={form.first_name}
                    onChange={(e) =>
                      handleChange("first_name", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="last_name" className="text-xs">
                    Last Name
                  </Label>
                  <Input
                    id="last_name"
                    value={form.last_name}
                    onChange={(e) =>
                      handleChange("last_name", e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="full_name" className="text-xs">
                  Full Name
                </Label>
                <Input
                  id="full_name"
                  value={form.full_name}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  Auto-generated from first and last name.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky footer */}
      <div className="flex items-center justify-between border-t border-border px-4 py-3 md:px-6">
        <p
          className={cn(
            "text-xs text-muted-foreground transition-opacity",
            isDirty ? "opacity-100" : "opacity-0",
          )}
        >
          Unsaved changes
        </p>
        <Button onClick={handleSave} disabled={saving || !isDirty}>
          {saving ? <><Spinner className="mr-1.5" /> Saving...</> : "Save"}
        </Button>
      </div>
    </>
  )
}
