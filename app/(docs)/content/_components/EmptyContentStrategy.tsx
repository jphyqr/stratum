// app/(docs)/content/_components/EmptyContentStrategy.tsx
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Plus } from "lucide-react";
import { AIActionButton } from "@/components/ui/ai-action-button";

interface EmptyContentStrategyProps {
  projectId: string;
  prerequisites: {
    hasBrand: boolean;
    hasProductStrategy: boolean;
    missingFields: string[];
  };
  onGenerate: () => Promise<void>;
  isGenerating: boolean;
}

export function EmptyContentStrategy({ 
  prerequisites, 
  onGenerate, 
  isGenerating 
}: EmptyContentStrategyProps) {
  if (!prerequisites.hasBrand || !prerequisites.hasProductStrategy) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Missing Required Information</AlertTitle>
        <AlertDescription>
          Before creating your content strategy, please complete:
          <ul className="list-disc ml-4 mt-2">
            {prerequisites.missingFields.map((field) => (
              <li key={field}>{field}</li>
            ))}
          </ul>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="rounded-lg border border-dashed p-8 text-center">
      <h3 className="font-semibold mb-2">No Content Strategy Yet</h3>
      <p className="text-muted-foreground mb-4">
        Generate a content strategy based on your brand and product context
      </p>
      <AIActionButton
  actionText="Generate Content Strategy"
  provider="anthropic"
  model="claude-3-opus-20240229"
  onClick={onGenerate}
/>
    </div>
  );
}