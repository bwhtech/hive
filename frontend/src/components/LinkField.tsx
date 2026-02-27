import { useState, useEffect, useCallback, useMemo, useRef } from "react"
import { useFrappeGetCall } from "frappe-react-sdk"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { UnfoldMoreIcon, Cancel01Icon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

interface SearchLinkResult {
  value: string
  description: string
  label?: string
}

interface LinkFieldProps {
  /** Frappe DocType to search */
  doctype: string
  /** Current value (the document name) */
  value: string
  /** Called when value changes */
  onChange: (value: string) => void
  /** Trigger label shown before value, e.g. "Project:" */
  label?: string
  /** Placeholder when no value is selected */
  placeholder?: string
  /** Extra filters passed to search_link */
  filters?: Record<string, unknown>
  /** Max results to show (default 20) */
  pageLength?: number
  /** Additional className for the trigger button */
  className?: string
}

export function LinkField({
  doctype,
  value,
  onChange,
  label,
  placeholder = "All",
  filters,
  pageLength = 20,
  className: triggerClassName,
}: LinkFieldProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  // Ref cache: stores label from dropdown selection for immediate feedback
  const selectedLabelRef = useRef<{ value: string; label: string } | null>(null)

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 200)
    return () => clearTimeout(timer)
  }, [search])

  // Fetch options from search_link API
  const { data } = useFrappeGetCall<{ message: SearchLinkResult[] }>(
    "frappe.desk.search.search_link",
    open
      ? {
          doctype,
          txt: debouncedSearch,
          filters: filters ? JSON.stringify(filters) : undefined,
          page_length: pageLength,
        }
      : undefined,
    open ? undefined : null,
    { revalidateOnFocus: false },
  )

  const options = data?.message ?? []

  /** Prefer label (title field) over description (name) */
  const getOptionLabel = (o: SearchLinkResult) => o.label || o.description || o.value

  // Resolve display label for current value (fires once per unique value, SWR caches)
  const { data: resolveData } = useFrappeGetCall<{ message: SearchLinkResult[] }>(
    "frappe.desk.search.search_link",
    value
      ? {
          doctype,
          txt: value,
          filters: filters ? JSON.stringify(filters) : undefined,
          page_length: 1,
        }
      : undefined,
    value ? `resolve-${doctype}-${value}` : null,
    { revalidateOnFocus: false },
  )

  // Derive displayLabel instead of syncing via useEffect (rerender-derived-state-no-effect)
  const displayLabel = useMemo(() => {
    if (!value) return ""
    // Prefer cached label from dropdown selection (immediate feedback)
    if (selectedLabelRef.current?.value === value) return selectedLabelRef.current.label
    // Fall back to resolved data from API
    if (resolveData?.message?.length) {
      const match = resolveData.message.find((r) => r.value === value)
      if (match) return getOptionLabel(match)
    }
    return ""
  }, [value, resolveData])

  const handleSelect = useCallback(
    (selectedValue: string) => {
      if (selectedValue === value) {
        // Deselect
        selectedLabelRef.current = null
        onChange("")
      } else {
        // Cache label for immediate feedback before re-render
        const option = options.find((o) => o.value === selectedValue)
        selectedLabelRef.current = {
          value: selectedValue,
          label: option ? getOptionLabel(option) : selectedValue,
        }
        onChange(selectedValue)
      }
      setOpen(false)
      setSearch("")
    },
    [value, onChange, options],
  )

  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      selectedLabelRef.current = null
      onChange("")
    },
    [onChange],
  )

  const showValue = displayLabel || value

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "h-9 gap-1.5 rounded-4xl border-input bg-input/30 px-3 font-normal",
              !showValue && "text-muted-foreground",
              triggerClassName,
            )}
          />
        }
      >
        {label && <span className="text-muted-foreground">{label}</span>}
        <span className="truncate max-w-[150px]">{showValue || placeholder}</span>
        {showValue ? (
          <HugeiconsIcon
            icon={Cancel01Icon}
            strokeWidth={2}
            className="size-3.5 text-muted-foreground hover:text-foreground shrink-0"
            onClick={handleClear}
          />
        ) : (
          <HugeiconsIcon
            icon={UnfoldMoreIcon}
            strokeWidth={2}
            className="size-4 text-muted-foreground shrink-0"
          />
        )}
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={`Search ${doctype.replace("Hive ", "").toLowerCase()}...`}
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  data-checked={option.value === value}
                  onSelect={() => handleSelect(option.value)}
                >
                  <span className="truncate">
                    {getOptionLabel(option)}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
