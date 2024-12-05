// app/(stratum)/roadmap/_components/RoadmapForm/RoadmapForm.tsx
"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Milestone } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"

import { MilestoneList } from "./MilestoneList"

const formSchema = z.object({
  vision: z.string().min(10, "Vision must be at least 10 characters"),
  targetDate: z.string(),
})

interface RoadmapFormData {
  vision: string
  targetDate: string
  milestones: Array<{
    id: string
    name: string
    description: string
    status: "PLANNED" | "IN_PROGRESS" | "COMPLETED"
    order: number
  }>
}

interface RoadmapFormProps {
  initialData: RoadmapFormData
  projectId: string
}

export function RoadmapForm({ initialData, projectId }: RoadmapFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()

  const form = useForm<RoadmapFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vision: initialData.vision,
      targetDate: new Date(initialData.targetDate).toISOString().split("T")[0],
    },
  })

  const completedMilestones = initialData.milestones.filter(
    (m) => m.status === "COMPLETED"
  ).length

  const progress =
    (completedMilestones / Math.max(initialData.milestones.length, 1)) * 100

  async function onSubmit(data: RoadmapFormData) {
    try {
      const res = await fetch(
        `http://localhost:3009/api/extension/ai-projects/${projectId}/roadmap`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "x-extension-token": process.env.NEXT_PUBLIC_STRATUM_TOKEN || "",
          },
          body: JSON.stringify({
            vision: data.vision,
            targetDate: new Date(data.targetDate).toISOString(),
          }),
        }
      )

      if (!res.ok) throw new Error("Failed to save")

      startTransition(() => {
        router.refresh()
      })

      toast({
        title: "Roadmap Updated! 🎉",
        description: "Your changes have been saved.",
      })
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Failed to save roadmap",
        variant: "destructive",
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Progress Bar */}
        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-sm font-medium leading-none">MVP Progress</h2>
              <p className="text-sm text-muted-foreground">
                {completedMilestones} of {initialData.milestones.length}{" "}
                milestones completed
              </p>
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
                  "Save Changes"
                )}
              </Button>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="grid gap-8">
          {/* Core Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Milestone className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">MVP Details</h2>
            </div>

            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="vision"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vision</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="What are we building and why?"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="targetDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Launch Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Milestones */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Milestones</h2>
            </div>
            <MilestoneList
              projectId={projectId}
              initialMilestones={initialData.milestones}
            />
          </div>
        </div>
      </form>
    </Form>
  )
}
