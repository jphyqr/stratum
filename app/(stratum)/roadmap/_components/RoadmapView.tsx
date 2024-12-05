// app/(stratum)/roadmap/_components/RoadmapView.tsx
"use client"

import { Roadmap } from "@prisma/client"

import { RoadmapForm } from "./RoadmapForm/RoadmapForm"

interface RoadmapViewProps {
  initialData: Roadmap & {
    milestones: Array<{
      id: string
      name: string
      description: string
      status: "PLANNED" | "IN_PROGRESS" | "COMPLETED"
      order: number
    }>
  }
  projectId: string
}

export function RoadmapView({ initialData, projectId }: RoadmapViewProps) {
  return (
    <div className="space-y-6">
      <RoadmapForm initialData={initialData} projectId={projectId} />
    </div>
  )
}
