// app/(stratum)/product-management/page.tsx
import { Suspense } from "react"

import { getProjectConfig } from "../../../.ai/config"
import { PageHeader } from "./_components/PageHeader"
import { EmptyProductContext } from "./_components/ProductContext"
import { ProductContextSkeleton } from "./_components/ProductContextSkeleton"
import { ProductContextView } from "./_components/ProductContextView"

// Server component to fetch data
async function getProductContextData(projectId: string) {
  const res = await fetch(
    `http://localhost:3009/api/extension/ai-projects/${projectId}/product-context`,
    {
      headers: {
        "Content-Type": "application/json",
        "x-extension-token": process.env.NEXT_PUBLIC_STRATUM_TOKEN || "",
      },
    }
  )

  if (!res.ok) {
    // Handle errors appropriately
    return null
  }

  return res.json()
}

export default async function ProductManagementPage() {
  const config = getProjectConfig()
  console.log("product management page")
  console.log("config", config)
  if (!config) return null
  const productContext = await getProductContextData(config.projectId)

  console.log("productContext", productContext)

  return (
    <div className="container mx-auto space-y-6 py-6">
      <PageHeader
        heading="Product Strategy"
        description="Define and manage your product vision and roadmap"
      />

      <Suspense fallback={<ProductContextSkeleton />}>
        {!productContext ? (
          <EmptyProductContext projectId={config.projectId} />
        ) : (
          <ProductContextView
            initialData={productContext}
            projectId={config.projectId}
          />
        )}
      </Suspense>
    </div>
  )
}
