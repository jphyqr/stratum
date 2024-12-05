// app/(stratum)/content/_components/PillarCard.tsx
"use client"

import { Card, CardContent } from "@/components/ui/card"

import { ClusterWithCounts } from "../page"

interface PillarCardProps {
  cluster: ClusterWithCounts
  isSelected: boolean
  onSelect: () => void
}

export function PillarCard({ cluster, isSelected, onSelect }: PillarCardProps) {
  return (
    <Card
      className={`h-24 cursor-pointer transition-all hover:shadow-sm ${
        isSelected
          ? "bg-primary/5 ring-2 ring-primary"
          : "bg-muted/30 hover:bg-muted/50"
      } `}
      onClick={onSelect}
    >
      <CardContent className="flex h-full items-center justify-center p-3">
        <h4 className="line-clamp-3 break-words text-center text-sm font-medium">
          {cluster.name}
        </h4>
      </CardContent>
    </Card>
  )
}
