// app/(stratum)/product-stream/page.tsx
import { Suspense } from "react"

import { ProductStreamContent } from "./_components/ProductStreamContent"
import { ProductStreamSkeleton } from "./_components/ProductStreamSkeleton"
import { getProjectConfig } from "@/.ai/config"
import { makeExtensionRequest } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ProductStreamResponse } from "./types"
import { StreamCard } from "./_components/StreamCard"

async function getProductStreamData(projectId: string): Promise<ProductStreamResponse[] | null> {
  // Simulate API delay
  const res = await makeExtensionRequest<ProductStreamResponse[]>(
    `/api/extension/ai-projects/${projectId}/product-stream`,
    { method: 'GET' },
 
  );


  if (!res.ok) return null
  return res.json()
}

export default async function ProductStreamPage() {
  const config = getProjectConfig()
  
  if (!config) {
    return null
  }

  const projectId = config.projectId

  if(!projectId) {  
    return null
  }
  const streamData = await getProductStreamData(config.projectId);
  if (!streamData) return null;

  return (
    <div className="container py-6">
      <Suspense fallback={<ProductStreamSkeleton />}>
        <ProductStreamContent 
          initialData={streamData} 
          projectId={config.projectId} 
        />
      </Suspense>


    </div>
  );
}


