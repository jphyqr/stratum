import { Suspense } from "react";
import { ClusterCardSkeleton } from "../_components/ClusterCardSkeleton";
import ClusterWrapper from "../_components/ClusterWrapper";
import { makeExtensionRequest } from "@/lib/api";
import { getProjectConfig } from "@/.ai/config";

// app/(docs)/content/cluster/[clusterId]/page.tsx
export default async function ClusterPage(props: { params: Promise<{ clusterId: string }> }) {
    const params = await props.params;

   const config = getProjectConfig();

    const projectId = config?.projectId;
    if(!projectId){
        return null;
    }
    // Fetch cluster data

    console.log('GET cluster data', `/api/extension/ai-projects/${projectId}/content/clusters/${params.clusterId}`);
    return (
      <Suspense fallback={<ClusterCardSkeleton />}>
        <ClusterWrapper 
          promise={makeExtensionRequest(
            `/api/extension/ai-projects/${projectId}/content/clusters/${params.clusterId}`,
            { method: 'GET' }
          )
          }
          projectId={projectId}
        />

      </Suspense>
    );
  }