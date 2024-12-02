// app/(docs)/content/_components/PillarCard.tsx
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { ClusterWithCounts } from "../page";

interface PillarCardProps {
  cluster: ClusterWithCounts;
  isSelected: boolean;
  onSelect: () => void;
}

export function PillarCard({ cluster, isSelected, onSelect }: PillarCardProps) {
  return (
    <Card
      className={`
        cursor-pointer transition-all h-24 hover:shadow-sm
        ${isSelected 
          ? 'ring-2 ring-primary bg-primary/5' 
          : 'bg-muted/30 hover:bg-muted/50'
        }
      `}
      onClick={onSelect}
    >
      <CardContent className="p-3 flex items-center justify-center h-full">
        <h4 className="font-medium text-sm text-center break-words line-clamp-3">
          {cluster.name}
        </h4>
      </CardContent>
    </Card>
  );
}