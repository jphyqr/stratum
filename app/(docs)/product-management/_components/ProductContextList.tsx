// _components/ProductContextList.tsx
import { getProductContexts } from "@/lib/api/product-contexts"

import { ProductContextCard } from "./ProductContextCard"

export async function ProductContextList() {
  const contexts = await getProductContexts()

  return (
    <div className="grid gap-6">
      {contexts.map((context) => (
        <ProductContextCard key={context.id} context={context} />
      ))}
    </div>
  )
}
