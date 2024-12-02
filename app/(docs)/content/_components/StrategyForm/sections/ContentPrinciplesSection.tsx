// app/(docs)/content/_components/sections/ContentPrinciplesSection.tsx
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

interface ContentPrinciplesSectionProps {
  form: UseFormReturn<any>
}

export function ContentPrinciplesSection({ form }: ContentPrinciplesSectionProps) {
  const [newPrinciple, setNewPrinciple] = useState("")
  const [newGoal, setNewGoal] = useState("")
  
  const principles = form.watch("contentPrinciples") || []
  const goals = form.watch("educationGoals") || []

  const addPrinciple = () => {
    if (newPrinciple.trim()) {
      form.setValue("contentPrinciples", [...principles, newPrinciple.trim()], {
        shouldDirty: true,
      })
      setNewPrinciple("")
    }
  }

  const removePrinciple = (index: number) => {
    const newPrinciples = principles.filter((_principle: string, i: number) => i !== index)
    form.setValue("contentPrinciples", newPrinciples, { shouldDirty: true })
  }
  const addGoal = () => {
    if (newGoal.trim()) {
      form.setValue("educationGoals", [...goals, newGoal.trim()], {
        shouldDirty: true,
      })
      setNewGoal("")
    }
  }

  const removeGoal = (index: number) => {
    const newGoals = goals.filter((_goal: string, i: number) => i !== index)
    form.setValue("educationGoals", newGoals, { shouldDirty: true })
  }
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Content Principles</h3>
        <p className="text-sm text-muted-foreground">
          Define the guiding principles and goals for your content.
        </p>
      </div>

      <FormField
        control={form.control}
        name="contentPrinciples"
        render={() => (
          <FormItem>
            <FormLabel>Content Principles</FormLabel>
            <FormDescription>
              Core principles that guide your content creation.
            </FormDescription>
            <div className="space-y-4">
              <div className="flex gap-2">
                <FormControl>
                  <Input
                    placeholder="e.g., Show don't tell, Include practical examples"
                    value={newPrinciple}
                    onChange={(e) => setNewPrinciple(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addPrinciple()
                      }
                    }}
                  />
                </FormControl>
                <Button type="button" onClick={addPrinciple}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {principles.map((principle: string, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="flex-1 rounded-md border bg-muted/50 px-3 py-2">
                      {principle}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removePrinciple(index)}
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

      <FormField
        control={form.control}
        name="educationGoals"
        render={() => (
          <FormItem>
            <FormLabel>Education Goals</FormLabel>
            <FormDescription>
              What should readers learn or achieve through your content?
            </FormDescription>
            <div className="space-y-4">
              <div className="flex gap-2">
                <FormControl>
                  <Input
                    placeholder="e.g., Understand key concepts, Master specific skills"
                    value={newGoal}
                    onChange={(e) => setNewGoal(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addGoal()
                      }
                    }}
                  />
                </FormControl>
                <Button type="button" onClick={addGoal}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {goals.map((goal: string, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="flex-1 rounded-md border bg-muted/50 px-3 py-2">
                      {goal}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeGoal(index)}
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