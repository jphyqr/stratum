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
import { updateFormSchemaForDefaultTypes,defaultValues } from "../types"

import  NameContextSection  from "./NameContextSection"
import  ValuePropositionSection  from "./ValuePropositionSection"
import  VoiceAndToneSection  from "./VoiceAndToneSection"
import  TerminologySection  from "./TerminologySection"
import  VisualIdentitySection  from "./VisualIdentitySection"
import  WritingGuideSection  from "./WritingGuideSection"
import { useFormProgress } from "./FormProgressCalculator"
import ColorSuggestionsSection from "./ColorSuggestionsSection"
import { LogoGenerator } from "./LogoGenerator"
import CoreBrandIdentity from "./CoreBrandIdentitySection"

interface BrandFormProps {
  initialData?: any
  projectId: string
}

export default function BrandForm({ initialData, projectId }: BrandFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isPending, setIsPending] = useState(false)
  
  const form = useForm({
    resolver: zodResolver(updateFormSchemaForDefaultTypes),
    defaultValues: initialData || defaultValues,
  })

  const progress = useFormProgress(form)

  async function onSubmit(data: any) {
    try {
      setIsPending(true)
      const res = await fetch(
        `http://localhost:3009/api/extension/ai-projects/${projectId}/brand`,
        {
          method: initialData ? 'PATCH' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-extension-token': process.env.NEXT_PUBLIC_STRATUM_TOKEN || '',
          },
          body: JSON.stringify(data),
        }
      )

      if (!res.ok) throw new Error('Failed to save')

      router.refresh()
      toast({ 
        title: "Brand Identity Saved",
        description: "Your brand settings have been updated successfully." 
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save brand settings",
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
              <h2 className="text-lg font-semibold">Brand Identity</h2>
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
        <CoreBrandIdentity form={form} />
        <NameContextSection form={form} />
        <Separator />
        
        <ValuePropositionSection form={form} />
        <Separator />
        
        <VoiceAndToneSection form={form} />
        <Separator />
        
        <TerminologySection form={form} />
        <Separator />
        {progress.shouldShowColorSuggestions && (
  <ColorSuggestionsSection form={form} projectId={projectId} />
)}

        <VisualIdentitySection 
          form={form}
          showColorSuggestions={progress.shouldShowColorSuggestions} 
        />

        <LogoGenerator  form={form}
        projectId={projectId}
        />
        <Separator />
        
        <WritingGuideSection form={form}
        projectId={projectId}
        
        />
      </form>
    </Form>
  )
}