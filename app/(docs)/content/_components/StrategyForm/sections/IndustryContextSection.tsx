// app/(docs)/content/_components/sections/IndustryContextSection.tsx
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

interface IndustryContextSectionProps {
  form: UseFormReturn<any>
}

export function IndustryContextSection({ form }: IndustryContextSectionProps) {
  const [newTerm, setNewTerm] = useState("")
  const [newConcept, setNewConcept] = useState("")
  const [newTrend, setNewTrend] = useState("")
  
  const terms = form.watch("industryContext.terminology") || []
  const concepts = form.watch("industryContext.concepts") || []
  const trends = form.watch("industryContext.trends") || []

  const addTerm = () => {
    if (newTerm.trim()) {
      form.setValue("industryContext.terminology", [...terms, newTerm.trim()], {
        shouldDirty: true,
      })
      setNewTerm("")
    }
  }

  const removeTerm = (index: number) => {
    const newTerms = terms.filter((_term: string, i: number) => i !== index)
    form.setValue("industryContext.terminology", newTerms, { shouldDirty: true })
  }

  const addConcept = () => {
    if (newConcept.trim()) {
      form.setValue("industryContext.concepts", [...concepts, newConcept.trim()], {
        shouldDirty: true,
      })
      setNewConcept("")
    }
  }

  const removeConcept = (index: number) => {
    const newConcepts = concepts.filter((_concept: string, i: number) => i !== index)
    form.setValue("industryContext.concepts", newConcepts, { shouldDirty: true })
  }

  const addTrend = () => {
    if (newTrend.trim()) {
      form.setValue("industryContext.trends", [...trends, newTrend.trim()], {
        shouldDirty: true,
      })
      setNewTrend("")
    }
  }

  const removeTrend = (index: number) => {
    const newTrends = trends.filter((_trend: string, i: number) => i !== index)
    form.setValue("industryContext.trends", newTrends, { shouldDirty: true })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Industry Context</h3>
        <p className="text-sm text-muted-foreground">
          Define industry-specific terminology and concepts.
        </p>
      </div>

      {/* Terminology */}
      <FormField
        control={form.control}
        name="industryContext.terminology"
        render={() => (
          <FormItem>
            <FormLabel>Industry Terminology</FormLabel>
            <FormDescription>
              Key terms and jargon specific to your industry.
            </FormDescription>
            <div className="space-y-4">
              <div className="flex gap-2">
                <FormControl>
                  <Input
                    placeholder="e.g., API, MVP, ROI"
                    value={newTerm}
                    onChange={(e) => setNewTerm(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addTerm()
                      }
                    }}
                  />
                </FormControl>
                <Button type="button" onClick={addTerm}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {terms.map((term: string, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="flex-1 rounded-md border bg-muted/50 px-3 py-2">
                      {term}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeTerm(index)}
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

      {/* Concepts */}
      <FormField
        control={form.control}
        name="industryContext.concepts"
        render={() => (
          <FormItem>
            <FormLabel>Core Concepts</FormLabel>
            <FormDescription>
              Fundamental concepts that your audience should understand.
            </FormDescription>
            <div className="space-y-4">
              <div className="flex gap-2">
                <FormControl>
                  <Input
                    placeholder="e.g., Continuous Integration, Agile Development"
                    value={newConcept}
                    onChange={(e) => setNewConcept(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addConcept()
                      }
                    }}
                  />
                </FormControl>
                <Button type="button" onClick={addConcept}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {concepts.map((concept: string, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="flex-1 rounded-md border bg-muted/50 px-3 py-2">
                      {concept}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeConcept(index)}
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

      {/* Trends */}
      <FormField
        control={form.control}
        name="industryContext.trends"
        render={() => (
          <FormItem>
            <FormLabel>Industry Trends</FormLabel>
            <FormDescription>
              Current and emerging trends in your industry.
            </FormDescription>
            <div className="space-y-4">
              <div className="flex gap-2">
                <FormControl>
                  <Input
                    placeholder="e.g., AI-driven Development, Low-code Platforms"
                    value={newTrend}
                    onChange={(e) => setNewTrend(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addTrend()
                      }
                    }}
                  />
                </FormControl>
                <Button type="button" onClick={addTrend}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {trends.map((trend: string, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="flex-1 rounded-md border bg-muted/50 px-3 py-2">
                      {trend}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeTrend(index)}
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