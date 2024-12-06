// app/(stratum)/content/_components/SelectedClusterWrapper.tsx
import { makeExtensionRequest } from "@/lib/api"

import { BriefList } from "./BriefList"
import { ClusterCard } from "./ClusterCard"
import { KeywordTree } from "./KeywordTree"

interface SelectedClusterWrapperProps {
  clusterId: string
  projectId: string
}

export async function SelectedClusterWrapper({
  clusterId,
  projectId,
}: SelectedClusterWrapperProps) {
  // Fetch all data in parallel
  const [clusterResponse, keywordsResponse, briefsResponse] = await Promise.all(
    [
      makeExtensionRequest(
        `/api/extension/ai-projects/${projectId}/content/clusters/${clusterId}`,
        { method: "GET" }
      ),
      makeExtensionRequest(
        `/api/extension/ai-projects/${projectId}/content/clusters/${clusterId}/keywords`,
        { method: "GET" }
      ),
      makeExtensionRequest(
        `/api/extension/ai-projects/${projectId}/content/clusters/${clusterId}/briefs`,
        { method: "GET" }
      ),
    ]
  )

  if (!clusterResponse.ok) return null

  const [cluster, keywords, briefs] = await Promise.all([
    clusterResponse.json(),
    keywordsResponse.json(),
    briefsResponse.json(),
  ])

  return (
    <div className="mx-auto max-w-3xl">
      <ClusterCard cluster={cluster} projectId={projectId}>
        <KeywordTree keywords={keywords} clusterId={clusterId} />
        <BriefList briefs={briefs} />
      </ClusterCard>
    </div>
  )
}
