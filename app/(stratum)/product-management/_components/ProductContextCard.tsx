// _components/ProductContextCard.tsx
"use client"

import { useOptimistic, useState } from "react"

import { ProductContextForm } from "./ProductContextForm/ProductContextForm"

export function ProductContextCard({ context }) {
  const [isEditing, setIsEditing] = useState(false)
  const [optimisticContext, updateOptimisticContext] = useOptimistic(
    context,
    (state, newState) => ({ ...state, ...newState })
  )

  if (isEditing) {
    return (
      <ProductContextForm
        initial={context}
        onSubmit={async (data) => {
          // Optimistically update
          updateOptimisticContext(data)
          setIsEditing(false)

          // Actually save
          await updateProductContext(context.id, data)
        }}
        onCancel={() => setIsEditing(false)}
      />
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{optimisticContext.name}</CardTitle>
          <CardDescription>
            Last updated {formatDate(optimisticContext.updatedAt)}
          </CardDescription>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsEditing(true)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => handleDelete(context.id)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Render context details */}
      </CardContent>
    </Card>
  )
}
