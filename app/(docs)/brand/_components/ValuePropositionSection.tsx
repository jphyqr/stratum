import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { UseFormReturn } from "react-hook-form"
import { Textarea } from "@/components/ui/textarea"

const EXAMPLES = [
  {
    company: "Stripe",
    proposition: "For <target>businesses of all sizes</target> who need <product>payment processing</product>, we are a <category>financial technology platform</category> that <benefit>simplifies online payments</benefit>. Unlike others, we <differentiator>provide developer-first solutions with superior documentation</differentiator>."
  },
  {
    company: "Notion",
    proposition: "For <target>teams and individuals</target> who need <product>workspace organization</product>, we are a <category>productivity platform</category> that <benefit>unifies notes, docs, and projects</benefit>. Unlike others, we <differentiator>offer infinitely flexible building blocks</differentiator>."
  }
]

export default function ValuePropositionSection({ form }: { form: UseFormReturn<any> }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Value Proposition</h3>
        <p className="text-sm text-muted-foreground">Define your core value proposition and market positioning</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="valueProposition.target"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Audience</FormLabel>
                      <FormDescription>Who will use your product?</FormDescription>
                      <FormControl>
                        <Input {...field} placeholder="e.g., Small business owners" />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="valueProposition.category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormDescription>Your product category/market</FormDescription>
                      <FormControl>
                        <Input {...field} placeholder="e.g., E-commerce platform" />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="valueProposition.benefit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Key Benefit</FormLabel>
                    <FormDescription>The main value you deliver</FormDescription>
                    <FormControl>
                      <Textarea {...field} placeholder="e.g., Simplifies online payments with a single integration" />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="valueProposition.differentiator"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Key Differentiator</FormLabel>
                    <FormDescription>What makes you unique?</FormDescription>
                    <FormControl>
                      <Textarea {...field} placeholder="e.g., Developer-first approach with superior documentation" />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          <h4 className="text-sm font-medium">Examples</h4>
          <div className="grid gap-4 sm:grid-cols-2">
            {EXAMPLES.map((example) => (
              <Card key={example.company} className="bg-muted/50">
                <CardContent className="pt-6">
                  <h5 className="text-sm font-medium mb-2">{example.company}</h5>
                  <p 
                    className="text-sm text-muted-foreground"
                    dangerouslySetInnerHTML={{ 
                      __html: example.proposition
                        .replace(/<target>/g, '<span class="font-bold">')
                        .replace(/<\/target>/g, '</span>')
                        .replace(/<product>/g, '<span class="font-bold">')
                        .replace(/<\/product>/g, '</span>')
                        .replace(/<category>/g, '<span class="font-bold">')
                        .replace(/<\/category>/g, '</span>')
                        .replace(/<benefit>/g, '<span class="font-bold">')
                        .replace(/<\/benefit>/g, '</span>')
                        .replace(/<differentiator>/g, '<span class="font-bold">')
                        .replace(/<\/differentiator>/g, '</span>')
                    }} 
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}