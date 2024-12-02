// app/(docs)/product-stream/page.tsx
import { Suspense } from 'react';
import { ProductStreamContent } from './_components/ProductStreamContent';
import { ProductStreamSkeleton } from './_components/ProductStreamSkeleton';

async function getProductStreamData() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return null; // Return null to trigger empty state
}

export default async function ProductStreamPage() {
  const streamData = await getProductStreamData();

  return (
    <div className="container py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Product Stream</h1>
        <p className="text-muted-foreground">
          Extract and manage development context from your AI chats
        </p>
      </div>
      
      <Suspense fallback={<ProductStreamSkeleton />}>
        <ProductStreamContent initialData={streamData} />
      </Suspense>
    </div>
  );
}