import { makeExtensionRequest } from "@/lib/api";
import { ClusterPillarView } from "./_components/ClusterPillarView";
import { ClusterViewActions } from "./_components/ClusterViewActions";
import { getProjectConfig } from "@/.ai/config";
import { ClusterWithCounts } from "./page";

// app/(docs)/content/layout.tsx

export interface TargetPersona {
    name: string;
    role: string;
    challenges: string[];
    goals: string[];
    contentPreferences: string[];
  }
export default async function ContentLayout({ children }: { children: React.ReactNode }) {
    
    const config = getProjectConfig();
   if(!config){

         return null;
        }

        

    // Parallel fetch for clusters and personas
    const [clustersResponse, personasResponse] = await Promise.all([
        makeExtensionRequest(
            `/api/extension/ai-projects/${config.projectId}/content/clusters`,
            { method: 'GET' }
        ),
        makeExtensionRequest(
            `/api/extension/ai-projects/${config.projectId}/content/strategy/personas`,
            { method: 'GET' }
        )
    ]);

    if (!clustersResponse.ok || !personasResponse.ok) {
        return null;
    }

    const [clusters, personas] = await Promise.all([
        clustersResponse.json() as Promise<ClusterWithCounts[]>,
        personasResponse.json() as Promise<TargetPersona[]>
    ]);

    if (!clusters) return null;
    return (
      <div className="space-y-6 max-w-[1200px] mx-auto">
        <ClusterViewActions projectId={config.projectId} />
        <ClusterPillarView 
                clusters={clusters}  
                projectId={config.projectId} 
                targetPersonas={personas}
            />
        {children}

      </div>
    );
  }