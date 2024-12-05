// app/(stratum)/brand/page.tsx
import { Suspense } from "react"

import { getProjectConfig } from "../../../.ai/config"
import { BrandSkeleton } from "./_components/BrandSkeleton"
import { BrandView } from "./_components/BrandView"
import { EmptyBrand } from "./_components/EmptyBrand"
import { PageHeader } from "./_components/PageHeader"

async function getBrandData(projectId: string) {
  const res = await fetch(
    `http://localhost:3009/api/extension/ai-projects/${projectId}/brand`,
    {
      headers: {
        "Content-Type": "application/json",
        "x-extension-token": process.env.NEXT_PUBLIC_STRATUM_TOKEN || "",
      },
    }
  )

  if (!res.ok) return null
  return res.json()
}

export default async function BrandPage() {
  const config = getProjectConfig()
  if (!config) return null

  const brand = await getBrandData(config.projectId)

  return (
    <div className="container mx-auto space-y-6 py-6">
      <PageHeader
        heading="Brand Guidelines"
        description="Define your brand voice and visual identity"
      />

      <Suspense fallback={<BrandSkeleton />}>
        {!brand ? (
          <EmptyBrand projectId={config.projectId} />
        ) : (
          <BrandView initialData={brand} projectId={config.projectId} />
        )}
      </Suspense>
    </div>
  )
}
