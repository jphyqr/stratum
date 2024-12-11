import { Card, CardContent } from "@/components/ui/card"
import { StoryLineResponse } from "../types"
import { Badge } from "@/components/ui/badge"

// app/(docs)/product-stream/_components/StoryCard.tsx
interface StoryCardProps {
    story: StoryLineResponse
  }
  
  export function StoryCard({ story }: StoryCardProps) {
    return (
      <Card className="mb-2">
        <CardContent className="p-3 space-y-2">
          <div className="flex items-start justify-between">
            <Badge variant="outline" className="mb-2">
              {story.type}
            </Badge>
            <Badge>{story.audience}</Badge>
          </div>
          <div className="space-y-1">
            {story.hooks.map((hook, i) => (
              <p key={i} className="text-sm">{hook}</p>
            ))}
          </div>
          <div className="flex gap-2 text-xs text-muted-foreground mt-2">
            <span>{story.context.impact.length} impacts</span>
            <span>•</span>
            <span>{story.context.metrics.length} metrics</span>
          </div>
        </CardContent>
      </Card>
    )
  }