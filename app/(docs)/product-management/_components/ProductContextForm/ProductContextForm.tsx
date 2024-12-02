// _components/ProductContextForm.tsx
"use client"

import { useEffect, useMemo, useTransition } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Rocket, Swords, Target, TrendingUp, Users } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button" // Changed this import
import {
  Form,

} from "@/components/ui/form"
import { Progress } from "@/components/ui/progress"

import {  ProductContextFormData } from "../../types"
import { ValueProps } from "./ValueProps"
import { Separator } from "@/components/ui/separator"
import { TargetMarket } from "./TargetMarket"
import { CoreStrategy } from "./CoreStrategy"
import { Competition } from "./Competition"
import { BusinessGoals } from "./BusinessGoals"

const metricSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  description: z.string(),
  target: z.string(),
  current: z.string()
});

const businessGoalSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  description: z.string(),
  timeframe: z.string(),
  metrics: z.array(metricSchema)
});

const valuePropositionSchema = z.object({
  id: z.string().optional(),
  benefit: z.string().min(1, "Benefit is required"),
  description: z.string(),
  segmentId: z.string().optional() // Make segmentId optional in schema
});

const marketSegmentSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  description: z.string(),
  priority: z.number().min(1).max(3),
  painPoints: z.array(z.string()).default([]), // Add defaults
  gains: z.array(z.string()).default([])
});

const competitorSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  description: z.string(),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  differentiation: z.string()
});

const formSchema = z.object({
  vision: z.string().min(10, "Vision must be at least 10 characters"),
  mission: z.string().min(10, "Mission must be at least 10 characters"),
  businessModel: z.string().min(10, "Business model must be at least 10 characters"),
  targetMarket: z.array(marketSegmentSchema),
  valueProps: z.array(valuePropositionSchema),
  goals: z.array(businessGoalSchema),
  competitors: z.array(competitorSchema)
});

interface ProductStrategyFormProps {
  initialData?: ProductContextFormData
  projectId: string
}

export function ProductContextForm({
  initialData,
  projectId,
}: ProductStrategyFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()

  console.log('Initial data:', initialData);
  const form = useForm<ProductContextFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      vision: "",
      mission: "",
      businessModel: "",
      targetMarket: [],
      valueProps: [],
      goals: [],
      competitors: [],
    },
  });
  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      console.log('Form updated:', { value, name, type });
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  const formProgress = useMemo(() => {
    const values = form.getValues()
    const sections = [
      // Core strategy (30%)
      {
        weight: 0.3,
        complete: !!(values.vision && values.mission && values.businessModel),
      },
      // Target market (20%)
      {
        weight: 0.2,
        complete: values.targetMarket.length > 0,
      },
      // Value props (20%)
      {
        weight: 0.2,
        complete: values.valueProps.length > 0,
      },
      // Goals (20%)
      {
        weight: 0.2,
        complete: values.goals.length > 0,
      },
      // Competition (10%)
      {
        weight: 0.1,
        complete: values.competitors?.length > 0,
      },
    ]

    return (
      sections.reduce(
        (acc, section) => acc + (section.complete ? section.weight : 0),
        0
      ) * 100
    )
  }, [form.watch()])

  async function onSubmit(data: ProductContextFormData) {
    console.log('Submit triggered with data:', data);
    console.log('Goals in submit:', data.goals);
    try {
      const res = await fetch(
        `http://localhost:3009/api/extension/ai-projects/${projectId}/product-context`,
        {
          method: initialData ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
            "x-extension-token": process.env.NEXT_PUBLIC_STRATUM_TOKEN || "",
          },
          body: JSON.stringify(data),
        }
      )

      if (!res.ok) {
        console.error('Response not OK:', await res.text()); // Add this
        throw new Error("Failed to save");
      }

      startTransition(() => {
        router.refresh()
      })

      toast({
        title: "Strategy Saved! 🎉",
        description: "Your product strategy has been updated.",
      })
    } catch (error) {
      console.error('Submit error:', error) // Enhance error logging
      toast({
        title: "Error",
        description: "Failed to save product strategy",
        variant: "destructive",
      })
    }
  }
  return (
    <Form {...form}>
      <form
          onSubmit={async (e) => {
            e.preventDefault();
            console.log('Form submit event triggered');
            const isValid = await form.trigger(); // Check form validity
            console.log('Form is valid:', isValid);
            if (isValid) {
              const values = form.getValues();
              console.log('Form values:', values);
              onSubmit(values);
            }
          }} 
      className="space-y-8">
        {/* Progress Bar */}
        <div className="sticky top-0 z-10 bg-background pb-2 pt-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium">
              Strategy Completion: {Math.round(formProgress)}%
            </span>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button
  type="button"
  disabled={isPending || !form.formState.isDirty}
  onClick={async (e) => {
    e.preventDefault();
    console.log('Submit button clicked');
    const isValid = await form.trigger();
    console.log('Form is valid:', isValid);

        // Add these to see validation errors
        const formState = form.formState;
        console.log('Form errors:', formState.errors);
        
        // Get current values to compare against schema
        const currentValues = form.getValues();
        console.log('Current form values:', currentValues);
    if (isValid) {
      const values = form.getValues();
      onSubmit(values);
    }
  }}
>
  {isPending ? (
    <>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Saving...
    </>
  ) : (
    <>{initialData ? "Update Strategy" : "Save Strategy"}</>
  )}
</Button>
            </div>
          </div>
          <Progress value={formProgress} className="h-2" />
        </div>

        <div className="grid gap-8">
          {/* Core Strategy */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Rocket className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Core Strategy</h2>
            </div>
            <CoreStrategy control={form.control} />
          </div>

          <Separator />

          {/* Target Market */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Target Market</h2>
            </div>
            <TargetMarket
            projectId={projectId}
            control={form.control} />
          </div>

          <Separator />

          {/* Value Props */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Value Propositions</h2>
            </div>
            <ValueProps
              control={form.control}
              marketSegments={form.watch("targetMarket")}
            />
          </div>

          <Separator />

          {/* Business Goals */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Business Goals</h2>
            </div>
            <BusinessGoals control={form.control} projectId={projectId} />
          </div>

          <Separator />

          {/* Competition */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Swords className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Competition</h2>
            </div>
            <Competition control={form.control} 
             projectId={projectId}
            />
          </div>
        </div>
      </form>
    </Form>
  )
}
