"use client"

// app/(stratum)/roadmap/_components/EmptyRoadmap.tsx
import { Milestone } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface EmptyRoadmapProps {
  projectId: string
}

export function EmptyRoadmap({ projectId }: EmptyRoadmapProps) {
  return (
    <Card className="flex flex-col items-center justify-center space-y-4 p-8">
      <CardHeader className="space-y-4 text-center">
        <Milestone className="h-12 w-12 text-muted-foreground" />
        <div>
          <CardTitle className="text-2xl">Create Your Roadmap</CardTitle>
          <CardDescription className="text-base">
            Define your MVP vision and track key milestones to launch.
          </CardDescription>
        </div>
      </CardHeader>
      <CardFooter>
        <Button
          size="lg"
          onClick={async () => {
            try {
              await fetch(
                `http://localhost:3009/api/extension/ai-projects/${projectId}/roadmap`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "x-extension-token":
                      process.env.NEXT_PUBLIC_STRATUM_TOKEN || "",
                  },
                  body: JSON.stringify({
                    vision: "Your Roadmap Vision",
                    targetDate: new Date(
                      Date.now() + 90 * 24 * 60 * 60 * 1000
                    ).toISOString(), // 90 days from now
                  }),
                }
              )
              window.location.reload()
            } catch (error) {
              console.error("Failed to create roadmap:", error)
            }
          }}
        >
          Create Roadmap
        </Button>
      </CardFooter>
    </Card>
  )
}
