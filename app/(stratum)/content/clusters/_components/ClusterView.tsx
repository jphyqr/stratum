// app/(stratum)/content/_components/ClusterView.tsx

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import { ClusterWithCounts } from "../page"
import { ClusterPillarView } from "./ClusterPillarView"
import { ClusterViewActions } from "./ClusterViewActions"

interface Prerequisites {
  hasBrand: boolean
  hasProductStrategy: boolean
  missingFields: string[]
  hasContentStrategy: boolean
}

interface ClusterViewProps {
  initialData: ClusterWithCounts[]
  projectId: string
  prerequisites: Prerequisites
}

export function ClusterView({
  initialData,
  projectId,
  prerequisites,
}: ClusterViewProps) {
  if (!prerequisites.hasBrand || !prerequisites.hasProductStrategy) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Missing Required Information</AlertTitle>
        <AlertDescription>
          Before generating content clusters, please complete:
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
    <div className="mx-auto max-w-[1200px] space-y-6">
      <ClusterViewActions projectId={projectId} />
      <ClusterPillarView clusters={initialData} projectId={projectId} />

      {/* <div className="space-y-4">
      {initialData.map((cluster) => (
        <Suspense key={cluster.id} fallback={<ClusterCardSkeleton />}>

         <ClusterWrapper cluster={cluster} projectId={projectId} />
        </Suspense>
      ))}
    </div> */}
    </div>
  )
}
