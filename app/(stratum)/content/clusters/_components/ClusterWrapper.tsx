import { Suspense } from "react"

import { makeExtensionRequest } from "@/lib/api"

import { ClusterWithCounts } from "../page"
import { BriefList } from "./BriefList"
import { ClusterCard } from "./ClusterCard"
import { KeywordTree } from "./KeywordTree"
import { BriefListSkeleton, KeywordTreeSkeleton } from "./KeywordTreeSkeleton"

// app/(stratum)/content/_components/ClusterWrapper.tsx
export default async function ClusterWrapper({
  promise,
  projectId,
}: {
  promise: Promise<Response>
  projectId: string
}) {
  const cluster = (await promise.then((res) => res.json())) as ClusterWithCounts

  return (
    <ClusterCard cluster={cluster} projectId={projectId}>
      <Suspense fallback={<KeywordTreeSkeleton />}>
        {cluster._count.keywords == 0 ? (
          <div>Generate Keywords</div>
        ) : (
          <KeywordTree
            promise={makeExtensionRequest(
              `/api/extension/ai-projects/${projectId}/content/clusters/${cluster.id}/keywords`,
              { method: "GET" }
            )}
            clusterId={cluster.id}
            showTree={cluster._count.keywords > 0}
          />
        )}
      </Suspense>

      <Suspense fallback={<BriefListSkeleton />}>
        {cluster._count.briefs == 0 ? (
          <div>Generate Briefs</div>
        ) : (
          <BriefList
            promise={makeExtensionRequest(
              `/api/extension/ai-projects/${projectId}/content/clusters/${cluster.id}/briefs`,
              { method: "GET" }
            )}
            showTree={cluster._count.keywords > 0 && cluster._count.briefs > 0}
          />
        )}
      </Suspense>
    </ClusterCard>
  )
}
