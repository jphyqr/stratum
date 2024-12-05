// app/(stratum)/content/_components/EmptyContentStrategy.tsx
import { Loader2, Plus } from "lucide-react"

import { AIActionButton } from "@/components/ui/ai-action-button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

interface EmptyContentStrategyProps {
  projectId: string
  prerequisites: {
    hasBrand: boolean
    hasProductStrategy: boolean
    missingFields: string[]
  }
  onGenerate: () => Promise<void>
  isGenerating: boolean
}

export function EmptyContentStrategy({
  prerequisites,
  onGenerate,
  isGenerating,
}: EmptyContentStrategyProps) {
  if (!prerequisites.hasBrand || !prerequisites.hasProductStrategy) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Missing Required Information</AlertTitle>
        <AlertDescription>
          Before creating your content strategy, please complete:
          <ul className="ml-4 mt-2 list-disc">
            {prerequisites.missingFields.map((field) => (
              <li key={field}>{field}</li>
            ))}
          </ul>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="rounded-lg border border-dashed p-8 text-center">
      <h3 className="mb-2 font-semibold">No Content Strategy Yet</h3>
      <p className="mb-4 text-muted-foreground">
        Generate a content strategy based on your brand and product context
      </p>
      <AIActionButton
        actionText="Generate Content Strategy"
        provider="anthropic"
        model="claude-3-opus-20240229"
        onClick={onGenerate}
      />
    </div>
  )
}
