// app/(stratum)/content/_components/sections/KeywordList.tsx
import { useState } from "react"
import { Plus, X } from "lucide-react"
import { UseFormReturn } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface KeywordListProps {
  name: string
  form: UseFormReturn<any>
  placeholder?: string
  maxItems?: number
}

export function KeywordList({
  name,
  form,
  placeholder = "Add keyword...",
  maxItems = 30,
}: KeywordListProps) {
  const [newKeyword, setNewKeyword] = useState("")
  const keywords = form.watch(name) || []

  const addKeyword = () => {
    if (newKeyword.trim() && keywords.length < maxItems) {
      form.setValue(name, [...keywords, newKeyword.trim()], {
        shouldDirty: true,
      })
      setNewKeyword("")
    }
  }

  const removeKeyword = (index: number) => {
    const newKeywords = keywords.filter((_: string, i: number) => i !== index)
    form.setValue(name, newKeywords, { shouldDirty: true })
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          value={newKeyword}
          onChange={(e) => setNewKeyword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              addKeyword()
            }
          }}
          placeholder={placeholder}
          className="flex-1"
        />
        <Button
          type="button"
          onClick={addKeyword}
          disabled={!newKeyword.trim() || keywords.length >= maxItems}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {keywords.map((keyword: string, index: number) => (
          <div
            key={index}
            className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-sm"
          >
            <span>{keyword}</span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-4 w-4 rounded-full hover:bg-destructive/20"
              onClick={() => removeKeyword(index)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
