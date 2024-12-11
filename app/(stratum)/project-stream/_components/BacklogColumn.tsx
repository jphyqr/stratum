// app/(docs)/product-stream/_components/BacklogColumn.tsx
"use client"

import { Droppable, Draggable } from "@hello-pangea/dnd"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ProductStreamResponse } from "../types"
import { Inbox } from "lucide-react"

interface BacklogColumnProps {
  stream: ProductStreamResponse | null
}

export function BacklogColumn({ stream }: BacklogColumnProps) {
  // Filter for items that don't have a bigBlockId

  if (!stream) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-muted-foreground">No items yet</p>
      </div>
    );
  }
  const backlogItems = stream.workItems.filter(item => !item.bigBlockId)

  return (
    <div className="h-full flex flex-col">

      {/* Droppable Area */}
      <Droppable droppableId="backlog">
        {(provided) => (
          <ScrollArea className="flex-1">
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="p-4 space-y-3"
            >
              {backlogItems.map((item, index) => (
                <Draggable
                  key={item.id}
                  draggableId={item.id}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="group"
                    >
                      <Card className={`
                        ${snapshot.isDragging ? 'ring-2 ring-primary' : ''}
                        ${snapshot.isDragging ? 'shadow-lg' : 'shadow-sm'}
                        transition-all
                      `}>
                        <CardContent className="p-3 space-y-2">
                          <div className="flex items-start justify-between">
                            <h4 className="font-medium text-sm">{item.title}</h4>
                            <Badge variant="outline" className="text-xs">
                              {item.type}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {item.scope}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            {/* Progress indicators */}
                            <div className="flex items-center gap-1">
                              <span>API: {item.progress.api}%</span>
                              <span>UI: {item.progress.ui}%</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          </ScrollArea>
        )}
      </Droppable>
    </div>
  )
}