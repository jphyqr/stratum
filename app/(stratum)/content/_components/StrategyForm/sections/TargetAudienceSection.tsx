// app/(stratum)/content/_components/sections/TargetAudienceSection.tsx
import { useState } from "react"
import { Plus, X } from "lucide-react"
import { UseFormReturn } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

interface TargetAudienceSectionProps {
  form: UseFormReturn<any>
}

interface NewListItem {
  personaIndex: number
  type: "challenges" | "goals" | "preferences"
  value: string
}

export function TargetAudienceSection({ form }: TargetAudienceSectionProps) {
  // Track new items with persona index
  const [newItem, setNewItem] = useState<NewListItem>({
    personaIndex: 0,
    type: "challenges",
    value: "",
  })

  const personas = form.watch("targetPersonas") || []

  const addPersona = () => {
    const currentPersonas = form.watch("targetPersonas") || []
    form.setValue(
      "targetPersonas",
      [
        ...currentPersonas,
        {
          name: "",
          role: "",
          challenges: [],
          goals: [],
          contentPreferences: [],
        },
      ],
      { shouldDirty: true }
    )
  }

  const removePersona = (index: number) => {
    const newPersonas = personas.filter(
      (_persona: any, i: number) => i !== index
    )
    form.setValue("targetPersonas", newPersonas, { shouldDirty: true })
  }

  const addListItem = (
    personaIndex: number,
    listType: "challenges" | "goals" | "preferences"
  ) => {
    if (newItem.personaIndex !== personaIndex || newItem.type !== listType)
      return

    const value = newItem.value.trim()
    if (!value) return

    const fieldName =
      listType === "preferences" ? "contentPreferences" : listType
    const currentList =
      form.watch(`targetPersonas.${personaIndex}.${fieldName}`) || []

    form.setValue(
      `targetPersonas.${personaIndex}.${fieldName}`,
      [...currentList, value],
      { shouldDirty: true }
    )

    setNewItem({
      personaIndex,
      type: listType,
      value: "",
    })
  }

  const removeListItem = (
    personaIndex: number,
    listType: string,
    itemIndex: number
  ) => {
    const fieldName =
      listType === "preferences" ? "contentPreferences" : listType
    const currentList = form.watch(
      `targetPersonas.${personaIndex}.${fieldName}`
    )
    const newList = currentList.filter(
      (_item: string, i: number) => i !== itemIndex
    )

    form.setValue(`targetPersonas.${personaIndex}.${fieldName}`, newList, {
      shouldDirty: true,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-medium">Target Audience</h3>
          <p className="text-sm text-muted-foreground">
            Define your audience personas and their needs.
          </p>
        </div>
        <Button type="button" onClick={addPersona}>
          <Plus className="mr-2 h-4 w-4" />
          Add Persona
        </Button>
      </div>

      <div className="space-y-6">
        {personas.map((persona: any, index: number) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <FormField
                control={form.control}
                name={`targetPersonas.${index}.name`}
                render={({ field }) => (
                  <FormItem className="mr-4 flex-1">
                    <FormControl>
                      <Input
                        placeholder="Persona Name (e.g., Technical Lead Sara)"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removePersona(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name={`targetPersonas.${index}.role`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role/Position</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Senior Developer" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Challenges */}
              <div className="space-y-2">
                <FormLabel>Challenges</FormLabel>
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g., Keeping up with new technologies"
                    value={
                      newItem.personaIndex === index &&
                      newItem.type === "challenges"
                        ? newItem.value
                        : ""
                    }
                    onChange={(e) =>
                      setNewItem({
                        personaIndex: index,
                        type: "challenges",
                        value: e.target.value,
                      })
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addListItem(index, "challenges")
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={() => addListItem(index, "challenges")}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {persona.challenges?.map(
                    (challenge: string, challengeIndex: number) => (
                      <div
                        key={challengeIndex}
                        className="flex items-center gap-2"
                      >
                        <div className="flex-1 rounded-md border bg-muted/50 px-3 py-2">
                          {challenge}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            removeListItem(index, "challenges", challengeIndex)
                          }
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Goals */}
              <div className="space-y-2">
                <FormLabel>Goals</FormLabel>
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g., Improve team productivity"
                    value={
                      newItem.personaIndex === index && newItem.type === "goals"
                        ? newItem.value
                        : ""
                    }
                    onChange={(e) =>
                      setNewItem({
                        personaIndex: index,
                        type: "goals",
                        value: e.target.value,
                      })
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addListItem(index, "goals")
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={() => addListItem(index, "goals")}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {persona.goals?.map((goal: string, goalIndex: number) => (
                    <div key={goalIndex} className="flex items-center gap-2">
                      <div className="flex-1 rounded-md border bg-muted/50 px-3 py-2">
                        {goal}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          removeListItem(index, "goals", goalIndex)
                        }
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Content Preferences */}
              <div className="space-y-2">
                <FormLabel>Content Preferences</FormLabel>
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g., Detailed technical tutorials"
                    value={
                      newItem.personaIndex === index &&
                      newItem.type === "preferences"
                        ? newItem.value
                        : ""
                    }
                    onChange={(e) =>
                      setNewItem({
                        personaIndex: index,
                        type: "preferences",
                        value: e.target.value,
                      })
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addListItem(index, "preferences")
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={() => addListItem(index, "preferences")}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {persona.contentPreferences?.map(
                    (preference: string, preferenceIndex: number) => (
                      <div
                        key={preferenceIndex}
                        className="flex items-center gap-2"
                      >
                        <div className="flex-1 rounded-md border bg-muted/50 px-3 py-2">
                          {preference}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            removeListItem(
                              index,
                              "preferences",
                              preferenceIndex
                            )
                          }
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
