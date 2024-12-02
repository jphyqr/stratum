// _components/EmptyProductContext.tsx
'use client'

import { Button } from "@/components/ui/button";

import { useState, useTransition } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export function EmptyProductContext({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [isPending, startTransition] = useTransition();
 const { toast } = useToast();
  async function createNewStrategy() {
setCreating(true);
 
    try {
      const res = await fetch(`http://localhost:3009/api/extension/ai-projects/${projectId}/product-context`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-extension-token': process.env.NEXT_PUBLIC_STRATUM_TOKEN || '',
        },
        body: JSON.stringify({
          vision: 'Your company vision',
          mission: 'Your company mission',
          businessModel: 'Your business model',
          targetMarket: [{
            name: 'Target market name',
            description: 'Target market description',
            priority: 1,
            painPoints: ['Pain point 1'],
            gains: ['Gain 1'],
          }],
        })
      });
 
      if (!res.ok) throw new Error('Failed to save');
 
      startTransition(() => {
        router.refresh();
      });
 
      toast({
        title: 'Success',
        description: 'Product strategy saved'
      });
    } catch (error) {
     console.log(error);
      toast({
        title: 'Error',
        description: 'Failed to save product strategy',
        variant: 'destructive'
      });
    }
  }
  return (
    <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg">
      <div className="max-w-md text-center space-y-4">
        <h3 className="text-lg font-semibold">No Product Strategy Defined</h3>
        <p className="text-muted-foreground">
          Define your product vision, mission, and strategy to help guide development.
        </p>

      
        <Button 
          disabled={creating||isPending}
          onClick={createNewStrategy}
        >
        {creating ? 'Creating...' : 'Create Product Strategy'}
        </Button>
      </div>
    </div>
  );
}
