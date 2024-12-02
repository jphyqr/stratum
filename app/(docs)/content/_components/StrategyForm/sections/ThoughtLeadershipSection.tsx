// app/(docs)/content/_components/sections/ThoughtLeadershipSection.tsx
import { UseFormReturn } from "react-hook-form"
import {
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
  FormControl,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, X } from "lucide-react"
import { useState } from "react"

interface ThoughtLeadershipSectionProps {
  form: UseFormReturn<any>
}

export function ThoughtLeadershipSection({ form }: ThoughtLeadershipSectionProps) {
  const [newPosition, setNewPosition] = useState("")
  const [newPerspective, setNewPerspective] = useState("")
  
  const positions = form.watch("thoughtLeadership.keyPositions") || []
  const perspectives = form.watch("thoughtLeadership.uniquePerspectives") || []

  const addPosition = () => {
    if (newPosition.trim()) {
      form.setValue("thoughtLeadership.keyPositions", [...positions, newPosition.trim()], {
        shouldDirty: true,
      })
      setNewPosition("")
    }
  }

  const removePosition = (index: number) => {
    const newPositions = positions.filter((_position: string, i: number) => i !== index)
    form.setValue("thoughtLeadership.keyPositions", newPositions, { shouldDirty: true })
  }

  const addPerspective = () => {
    if (newPerspective.trim()) {
      form.setValue("thoughtLeadership.uniquePerspectives", [...perspectives, newPerspective.trim()], {
        shouldDirty: true,
      })
      setNewPerspective("")
    }
  }

  const removePerspective = (index: number) => {
    const newPerspectives = perspectives.filter((_perspective: string, i: number) => i !== index)
    form.setValue("thoughtLeadership.uniquePerspectives", newPerspectives, { shouldDirty: true })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Thought Leadership</h3>
        <p className="text-sm text-muted-foreground">
          Define your unique perspectives and positions in the industry.
        </p>
      </div>

      {/* Key Positions */}
      <FormField
        control={form.control}
        name="thoughtLeadership.keyPositions"
        render={() => (
          <FormItem>
            <FormLabel>Key Positions</FormLabel>
            <FormDescription>
              Core beliefs and stances that define your thought leadership.
            </FormDescription>
            <div className="space-y-4">
              <div className="flex gap-2">
                <FormControl>
                  <Input
                    placeholder="e.g., AI should augment, not replace developers"
                    value={newPosition}
                    onChange={(e) => setNewPosition(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addPosition()
                      }
                    }}
                  />
                </FormControl>
                <Button type="button" onClick={addPosition}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {positions.map((position: string, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="flex-1 rounded-md border bg-muted/50 px-3 py-2">
                      {position}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removePosition(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Unique Perspectives */}
      <FormField
        control={form.control}
        name="thoughtLeadership.uniquePerspectives"
        render={() => (
          <FormItem>
            <FormLabel>Unique Perspectives</FormLabel>
            <FormDescription>
              What sets your viewpoint apart in the industry?
            </FormDescription>
            <div className="space-y-4">
              <div className="flex gap-2">
                <FormControl>
                  <Input
                    placeholder="e.g., Focus on developer experience first"
                    value={newPerspective}
                    onChange={(e) => setNewPerspective(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addPerspective()
                      }
                    }}
                  />
                </FormControl>
                <Button type="button" onClick={addPerspective}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {perspectives.map((perspective: string, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="flex-1 rounded-md border bg-muted/50 px-3 py-2">
                      {perspective}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removePerspective(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}