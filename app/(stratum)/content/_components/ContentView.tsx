// app/(stratum)/content/_components/ContentView.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { makeExtensionRequest } from "@/lib/api"

import { EmptyContentStrategy } from "./EmptyContentStrategy"
import { ContentStrategyForm } from "./StrategyForm/StrategyForm"

interface ContentViewProps {
  strategy: any
  clusters: any[]
  projectId: string
  prerequisites: {
    hasBrand: boolean
    hasProductStrategy: boolean
    missingFields: string[]
  }
}

export function ContentView({
  strategy,
  clusters,
  projectId,
  prerequisites,
}: ContentViewProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentStrategy, setCurrentStrategy] = useState(strategy)
  const router = useRouter()
  async function generateStrategy() {
    setIsGenerating(true)
    try {
      const res = await makeExtensionRequest(
        `/api/extension/ai-projects/${projectId}/content/strategy/generate`,
        {
          method: "POST",
        }
      )
      const data = await res.json()

      const parsedStrategy = {
        ...data,
        thoughtLeadership: data.thoughtLeadership
          ? JSON.parse(data.thoughtLeadership)
          : null,
        industryContext: data.industryContext
          ? JSON.parse(data.industryContext)
          : null,
        targetPersonas: data.targetPersonas
          ? JSON.parse(data.targetPersonas)
          : [],
      }
      router.refresh()
      setCurrentStrategy(parsedStrategy)
    } catch (error) {
      console.error("Failed to generate strategy:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  if (!currentStrategy) {
    return (
      <EmptyContentStrategy
        projectId={projectId}
        prerequisites={prerequisites}
        onGenerate={generateStrategy}
        isGenerating={isGenerating}
      />
    )
  }

  return (
    <div className="space-y-8">
      <div className="rounded-lg border p-6">
        <h2 className="mb-4 text-lg font-semibold">Content Strategy</h2>
        <ContentStrategyForm
          initialData={currentStrategy}
          projectId={projectId}
        />
      </div>
    </div>
  )
}
