import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { UseFormReturn } from "react-hook-form"

const BRAND_ARCHETYPES = [
  { value: "creator", label: "Creator", description: "Innovative and artistic" },
  { value: "sage", label: "Sage", description: "Intelligent and analytical" },
  { value: "explorer", label: "Explorer", description: "Adventurous and pioneering" },
  { value: "ruler", label: "Ruler", description: "Controlling and stable" },
  { value: "caregiver", label: "Caregiver", description: "Nurturing and generous" },
  { value: "innocent", label: "Innocent", description: "Optimistic and honest" }
] as const

interface NameContextSectionProps {
  form: UseFormReturn<any>
}

export default function NameContextSection({ form }: NameContextSectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Brand Name Context</h3>
        <p className="text-sm text-muted-foreground">
          Define the meaning and variations of your brand name
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4">
            <FormField
              control={form.control}
              name="nameContext.meaning"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name Meaning</FormLabel>
                  <FormDescription>
                    Story or meaning behind your brand name
                  </FormDescription>
                  <FormControl>
                    <Input {...field} placeholder="The inspiration and story behind your name" />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <h4 className="text-sm font-medium">Name Variations</h4>
              
              <FormField
                control={form.control}
                name="nameContext.variations.shortForm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Form</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Abbreviated or short version" />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nameContext.variations.trademark"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trademark Format</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Official trademark format" />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nameContext.variations.pronunciation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pronunciation</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="How to pronounce the name" />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="nameContext.brandArchetype"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand Archetype</FormLabel>
                  <FormDescription>
                    The fundamental character your brand embodies
                  </FormDescription>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a brand archetype" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {BRAND_ARCHETYPES.map(archetype => (
                        <SelectItem key={archetype.value} value={archetype.value}>
                          <div className="flex flex-col">
                            <span className="font-medium">{archetype.label}</span>
                            <span className="text-xs text-muted-foreground">
                              {archetype.description}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}