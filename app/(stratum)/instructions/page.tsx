// app/(stratum)/brand/page.tsx
import { Suspense } from "react"

import { getProjectConfig } from "../../../.ai/config"
import { ProjectViewer } from "./_components/ProjectViewer"
import { ProjectWorkspaceSkeleton } from "./_components/ProjectWorkspaceSkeleton"

export type PromptCategory = "Chat Closers" | "Openers" | "Utilities"

export interface SuperPrompt {
  id: string
  title: string
  description: string
  prompt: string
  category: PromptCategory
  type: "direct" | "wrapper"
  icon?: React.ComponentType<{ className?: string }>
}
type Complexity = "SIMPLE" | "MODERATE" | "COMPLEX"
type TeamSize = "SOLO" | "SMALL" | "ENTERPRISE"
type MaintenanceBurden = "LOW" | "MEDIUM" | "HIGH"
type ProjectStartType = "NEED_TEMPLATE" | "FRESH_TEMPLATE" | "EXISTING"
export interface Pattern {
  title: string
  humanReadable: string
  aiOptimized: string
  codeExample?: string
  description?: string
  complexity: Complexity
  teamSize: TeamSize
  maintenanceBurden: MaintenanceBurden
  isHighlyRecommended?: boolean
}

export type LayerCategory =
  | "IDEOLOGY"
  | "COMMUNICATION"
  | "ARCHITECTURE"
  | "BUSINESS"
  | "DESIGN"
  | "SEO"
  | "FEATURES"
  | "UTILITIES"
  | "ANALYTICS"
  | "ACCESSIBILITY"
  | "PERFORMANCE"
  | "LIBRARIES"
  | "COMPONENTS"

export type ProjectWithIncludes = {
  id: string
  name: string
  startType: ProjectStartType
  stack: {
    id: string
    name: string
  }
  layers: Array<{
    id: string
    isActive: boolean
    aiOptimizedInstructions: string | null
    baseLayer: {
      id: string
      name: string
      patterns: Pattern[]
      category: LayerCategory
      order: number
    }
    order: number
  }>
  workspaces: Array<{
    id: string
    rootPath: string
    name: string
    lastSync: Date
    isActive: boolean
  }>
}
async function getInstructionData(projectId: string) {
  const res = await fetch(
    `http://localhost:3009/api/extension/ai-projects/${projectId}`,
    {
      headers: {
        "Content-Type": "application/json",
        "x-extension-token": process.env.NEXT_PUBLIC_STRATUM_TOKEN || "",
      },
    }
  )

  if (!res.ok) return null
  return res.json()
}

export default async function InstructionsPage() {
  const config = getProjectConfig()
  if (!config) return null

  const project = await getInstructionData(config.projectId)

  return (
    <div className="container mx-auto space-y-6 py-6">
      {/* <PageHeader
        heading="Brand Guidelines"
        description="Define your brand voice and visual identity"
      /> */}

      <Suspense fallback={<ProjectWorkspaceSkeleton />}>
        {!project ? (
          <div>Project not found</div>
        ) : (
          <p>
            <ProjectViewer project={project} />
          </p>
        )}
      </Suspense>
    </div>
  )
}
