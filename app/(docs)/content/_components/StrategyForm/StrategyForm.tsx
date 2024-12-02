// app/(docs)/content/_components/ContentStrategyForm.tsx
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Loader2 } from "lucide-react"
import { useState } from "react"


import { makeExtensionRequest } from "@/lib/api"

import { 
  contentStrategySchema, 
  defaultContentStrategyValues,
  ContentStrategyFormData 
} from "../../types"
import { useFormProgress } from "./useFormProgress"
import { ThoughtLeadershipSection } from "./sections/ThoughtLeadershipSection"
import { IndustryContextSection } from "./sections/IndustryContextSection"
import { CoreStrategySection } from "./sections/CoreContentSection"
import { TargetAudienceSection } from "./sections/TargetAudienceSection"
import { ContentPrinciplesSection } from "./sections/ContentPrinciplesSection"

interface ContentStrategyFormProps {
  initialData?: ContentStrategyFormData
  projectId: string
}

export function ContentStrategyForm({ initialData, projectId }: ContentStrategyFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isPending, setIsPending] = useState(false)
  
  const form = useForm<ContentStrategyFormData>({
    resolver: zodResolver(contentStrategySchema),
    defaultValues: initialData || defaultContentStrategyValues,
  })

  const progress = useFormProgress(form)

  async function onSubmit(data: ContentStrategyFormData) {
    try {
      setIsPending(true)
      
      await makeExtensionRequest(
        `/api/extension/ai-projects/${projectId}/content/strategy`,
        {
          method: initialData ? 'PATCH' : 'POST',
          body: JSON.stringify(data),
        }
      );

      router.refresh()
      toast({ 
        title: "Content Strategy Saved",
        description: "Your content strategy has been updated successfully." 
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save content strategy",
        variant: "destructive",
      })
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="relative space-y-8">
        {/* Sticky Header */}
        <div className="sticky top-0 z-50 -mx-6 bg-background/95 px-6 pb-4 pt-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center justify-between border-b pb-4">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold">Content Strategy</h2>
              <div className="text-sm text-muted-foreground">
                {progress.total}% Complete
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending || !form.formState.isDirty}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </div>
          <Progress value={progress.total} className="mt-4 h-2" />
          <div className="grid grid-cols-3 gap-2 mt-2">
            {Object.entries(progress.sections).map(([name, complete]) => (
              <div key={name} className="flex items-center gap-2 text-sm text-muted-foreground">
                {complete ? "✓" : "○"} {name}
              </div>
            ))}
          </div>
        </div>

        {/* Form Sections */}
        <CoreStrategySection form={form} />
        <Separator />
        
        <ContentPrinciplesSection form={form} />
        <Separator />
        
        <TargetAudienceSection form={form} />
        <Separator />
        
        <IndustryContextSection form={form} />
        <Separator />
        
        <ThoughtLeadershipSection form={form} />
      </form>
    </Form>
  );
}