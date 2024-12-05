// app/(stratum)/content/_components/ContentList.tsx
import { useState } from "react"
import { Plus, X } from "lucide-react"
import { useFieldArray, UseFormReturn } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface ContentListProps {
  name: string
  form: UseFormReturn<any>
  placeholder?: string
  maxItems?: number
}

export function ContentList({
  name,
  form,
  placeholder = "Add item...",
  maxItems = 10,
}: ContentListProps) {
  const [newItem, setNewItem] = useState("")
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name,
  })

  const handleAdd = () => {
    if (newItem.trim() && fields.length < maxItems) {
      append(newItem.trim())
      setNewItem("")
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              handleAdd()
            }
          }}
          placeholder={placeholder}
          className="flex-1"
        />
        <Button
          type="button"
          onClick={handleAdd}
          disabled={!newItem.trim() || fields.length >= maxItems}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2">
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-2">
            <div className="flex-1 rounded-md border bg-muted/50 px-3 py-2">
              {field.value}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => remove(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
