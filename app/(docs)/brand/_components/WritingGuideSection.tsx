import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { UseFormReturn } from "react-hook-form"
import { ArrayInput } from "./ArrayInput"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info, Loader2, Sparkles } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

const WRITING_EXAMPLES = {
  technical: {
    company: "Stripe",
    headlines: {
      style: "Direct and benefit-focused",
      examples: [
        "Accept payments in minutes",
        "Scale globally with one integration",
        "Process payments securely"
      ]
    },
    paragraphs: {
      maxLength: 300,
      style: "Clear, technical, with code examples"
    }
  },
  consumer: {
    company: "Airbnb",
    headlines: {
      style: "Inspiring and experiential",
      examples: [
        "Live like a local",
        "Find unique stays",
        "Experience the world"
      ]
    },
    paragraphs: {
      maxLength: 200,
      style: "Warm, descriptive, story-driven"
    }
  }
}




  

   export default function WritingGuideSection({ form, projectId }: { form: UseFormReturn<any>, projectId: string }) {
        const [isEnhancing, setIsEnhancing] = useState(false);

        async function enhanceGuidelines() {
            setIsEnhancing(true);
            try {
              const brand = form.getValues();
              const res = await fetch(
                `http://localhost:3009/api/extension/ai-projects/${projectId}/brand/enhance-writing`,
                {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json',
                    'x-extension-token': process.env.NEXT_PUBLIC_STRATUM_TOKEN || '',

                   },
                  body: JSON.stringify({ brand })
                }
              );
              
              if (!res.ok) throw new Error('Failed to enhance guidelines');
              
              const guidelines = await res.json();
              
              // Update form with enhanced guidelines
              form.setValue('writingGuide.headlines.style', guidelines.headlines.style, { shouldDirty: true });
              form.setValue('writingGuide.headlines.examples', guidelines.headlines.examples, { shouldDirty: true });
              form.setValue('writingGuide.paragraphs.style', guidelines.paragraphs.style, { shouldDirty: true });
              form.setValue('writingGuide.paragraphs.maxLength', guidelines.paragraphs.maxLength, { shouldDirty: true });
              // ... update other fields
              
            } catch (error) {
              console.error(error);
            } finally {
              setIsEnhancing(false);
            }
          }
        return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Writing Guidelines</h3>
        <p className="text-sm text-muted-foreground">Define your content style and formatting rules</p>
      </div>

      <Button 
          variant="outline"
          onClick={enhanceGuidelines}
          disabled={isEnhancing}
        >
          {isEnhancing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enhancing...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Enhance Guidelines
            </>
          )}
        </Button>

      <div className="grid gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="writingGuide.headlines.style"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Headline Style</FormLabel>
                    <FormDescription>Describe your headline writing approach</FormDescription>
                    <FormControl>
                      <Input {...field} placeholder="e.g., Clear and direct with active verbs" />
                    </FormControl>
                  </FormItem>
                )}
              />

              <ArrayInput
                form={form}
                control={form.control}
                name="writingGuide.headlines.examples"
                label="Headline Examples"
                template=""
                renderItem={(item, index) => (
                  <FormField
                    control={form.control}
                    name={`writingGuide.headlines.examples.${index}`}
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <Input {...field} placeholder="Example headline" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="writingGuide.paragraphs.style"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Paragraph Style</FormLabel>
                    <FormDescription>Describe your body text approach</FormDescription>
                    <FormControl>
                      <Input {...field} placeholder="e.g., Conversational with technical clarity" />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="writingGuide.paragraphs.maxLength"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum Paragraph Length (words)</FormLabel>
                    <FormControl>
                      <Slider
                        min={50}
                        max={500}
                        step={25}
                        value={[field.value]}
                        onValueChange={([value]) => field.onChange(value)}
                      />
                    </FormControl>
                    <div className="text-sm text-muted-foreground text-right">
                      {field.value} words
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h4 className="text-sm font-medium mb-4">Formatting Preferences</h4>
            <div className="space-y-4">
              {['lists', 'tables', 'codeBlocks'].map((format) => (
                <FormField
                  key={format}
                  control={form.control}
                  name={`writingGuide.formatting.${format}`}
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <FormLabel className="capitalize">Use {format}</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <div className="mt-2 space-y-4">
              {Object.entries(WRITING_EXAMPLES).map(([style, example]) => (
                <div key={style} className="space-y-2">
                  <h5 className="font-medium">{example.company} Writing Style:</h5>
                  <div className="pl-4 space-y-2">
                    <p className="text-sm">
                      <span className="text-muted-foreground">Headlines:</span> {example.headlines.style}
                    </p>
                    <div className="text-sm pl-4">
                      {example.headlines.examples.map((ex, i) => (
                        <p key={i} className="text-muted-foreground">&bull; {ex}</p>
                      ))}
                    </div>
                    <p className="text-sm">
                      <span className="text-muted-foreground">Paragraphs:</span> {example.paragraphs.style}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}