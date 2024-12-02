// app/(dashboard)/projects/[projectId]/_components/LayerTimeline.tsx
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Check, Loader2, Trash2, Settings } from "lucide-react";
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

import { Alert, AlertDescription } from "@/components/ui/alert";

import { LayerCategory, Pattern } from "../page";
import { useToast } from "@/hooks/use-toast";

interface LayerTimelineProps {
  layers: Array<{
    id: string;
    isActive: boolean;
    aiOptimizedInstructions: string | null;
    baseLayer: {
      id: string;
      name: string;
      patterns: Pattern[];
      category: LayerCategory;
        order: number;
   
    };
    order: number;
  }>;
  onLayerSelect: (layerName: string) => void;
}

export function LayerTimeline({ layers, onLayerSelect }: LayerTimelineProps) {
  const params = useParams();
  const projectId = params.projectId as string;
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);

  const handleToggleActive = async (layerId: string, currentState: boolean) => {
    setLoading(layerId);
    try {
      const response = await fetch(`/api/user/ai-projects/${projectId}/layers/${layerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isActive: !currentState
        })
      });

      if (!response.ok) throw new Error('Failed to update layer');
      
      router.refresh();
      toast({
        title: "Layer Updated",
        description: `Layer ${currentState ? 'deactivated' : 'activated'} successfully.`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update layer status.",
        variant: "destructive"
      });
    } finally {
      setLoading(null);
    }
  };

  const handleDeleteLayer = async (layerId: string) => {
    setLoading(layerId);
    try {
      const response = await fetch(`/api/user/ai-projects/${projectId}/layers/${layerId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete layer');
      
      router.refresh();
      toast({
        title: "Layer Deleted",
        description: "Layer removed successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete layer.",
        variant: "destructive"
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-4">
      {layers.sort((a, b) => a.baseLayer.order - b.baseLayer.order).map((layer, i) => {
        const isCoreLater = false; // Genesis and Project Knowledge are core
        const isLoading = loading === layer.id;

        return (
          <div 
            key={layer.id} 
            className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
            onClick={() => onLayerSelect(layer.baseLayer.name)}
          >
            <div className="flex items-center gap-3">
              {layer.isActive ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <div className="h-4 w-4 rounded-full border border-muted-foreground" />
              )}
              <span className={layer.isActive ? 'text-foreground' : 'text-muted-foreground'}>
                {layer.baseLayer.name}
              </span>
              {isCoreLater && (
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                  Core Layer
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                 {!isCoreLater&& <Switch
                    checked={layer.isActive}
                    onCheckedChange={() => handleToggleActive(layer.id, layer.isActive)}
                    aria-label="Toggle layer active state"
                  />}



                </>
              )}
            </div>
          </div>
        );
      })}

      {layers.length === 0 && (
        <Alert>
          <AlertDescription>
            No layers configured yet. Start by selecting a layer type above.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}