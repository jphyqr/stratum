// app/(stratum)/brand/_components/BrandView.tsx
"use client"

import BrandForm from "./BrandForm"

interface BrandViewProps {
  initialData: any
  projectId: string
}

export function BrandView({ initialData, projectId }: BrandViewProps) {
  return (
    <div className="space-y-6">
      <BrandForm initialData={initialData} projectId={projectId} />
    </div>
  )
}
