// app/(stratum)/roadmap/page.tsx
import { Suspense } from "react"

import { getProjectConfig } from "../../../.ai/config"
import { EmptyRoadmap } from "./_components/EmptyRoadmap"
import { PageHeader } from "./_components/PageHeader"
import { RoadmapSkeleton } from "./_components/RoadmapSkeleton"
import { RoadmapView } from "./_components/RoadmapView"

async function getRoadmapData(projectId: string) {
  const res = await fetch(
    `http://localhost:3009/api/extension/ai-projects/${projectId}/roadmap`,
    {
      headers: {
        "Content-Type": "application/json",
        "x-extension-token": process.env.NEXT_PUBLIC_STRATUM_TOKEN || "",
      },
    }
  )

  if (!res.ok) {
    return null
  }

  return res.json()
}

export default async function RoadmapPage() {
  const config = getProjectConfig()
  if (!config) return null

  const roadmap = await getRoadmapData(config.projectId)

  return (
    <div className="container mx-auto space-y-6 py-6">
      <PageHeader
        heading="Project Roadmap"
        description="Plan and track your MVP milestones"
      />

      <Suspense fallback={<RoadmapSkeleton />}>
        {!roadmap ? (
          <EmptyRoadmap projectId={config.projectId} />
        ) : (
          <RoadmapView initialData={roadmap} projectId={config.projectId} />
        )}
      </Suspense>
    </div>
  )
}
