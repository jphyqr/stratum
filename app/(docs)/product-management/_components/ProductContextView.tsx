// _components/ProductContextView.tsx
"use client"

import { ProductContext } from "../types"
import { ProductContextForm } from "./ProductContextForm/ProductContextForm"

interface ProductContextViewProps {
  initialData: ProductContext
  projectId: string
}

export function ProductContextView({
  initialData,
  projectId,
}: ProductContextViewProps) {
  // Transform API data to form data format
  const formData = {
    vision: initialData.vision,
    mission: initialData.mission,
    businessModel: initialData.businessModel,
    targetMarket: initialData.targetMarket,
    valueProps: initialData.valueProps,
    goals: initialData.goals,
    competitors: initialData.competitors
  };

  return (
    <div className="space-y-6">
      <ProductContextForm
        initialData={formData}
        projectId={projectId}
      />
    </div>
  )
}
