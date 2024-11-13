import { Activity } from "../types"

interface ActivityFeedProps {
  items: Activity[]
}

export function ActivityFeed({ items }: ActivityFeedProps) {
  return (
    <div className="space-y-8">
      {items.map((item) => (
        <div key={item.id} className="flex items-center">
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium">{item.description}</p>
            <p className="text-sm text-muted-foreground">
              {new Date(item.date).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
