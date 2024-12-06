// app/(stratum)/content/_components/ClusterViewActions.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"

import { makeExtensionRequest } from "@/lib/api"
import { AIActionButton } from "@/components/ui/ai-action-button"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { NewClusterForm } from "./NewClusterForm"

interface ClusterViewActionsProps {
  projectId: string
}

export function ClusterViewActions({ projectId }: ClusterViewActionsProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [showNewClusterForm, setShowNewClusterForm] = useState(false)
  const router = useRouter()

  async function generateClusters() {
    setIsGenerating(true)
    try {
      const response = await makeExtensionRequest(
        `/api/extension/ai-projects/${projectId}/content/clusters/generate-initial-clusters`,
        {
          method: "POST",
        }
      )

      if (!response.ok) throw new Error("Failed to generate clusters")

      // No need to manage state, just refresh the page
      router.refresh()
    } catch (error) {
      console.error("Failed to generate clusters:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold">Content Clusters</h2>
      <Button onClick={() => setShowNewClusterForm(true)}>
        <Plus className="mr-2 h-4 w-4" />
        New Cluster
      </Button>
      <AIActionButton
        actionText="Generate Cluster Ideas"
        provider="anthropic"
        model="claude-3-opus-20240229"
        onClick={generateClusters}
        disabled={isGenerating}
      />
      <Dialog open={showNewClusterForm} onOpenChange={setShowNewClusterForm}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Cluster</DialogTitle>
          </DialogHeader>
          <NewClusterForm
            projectId={projectId}
            onClose={() => setShowNewClusterForm(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
