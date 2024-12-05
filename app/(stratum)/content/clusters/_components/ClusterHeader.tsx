// app/(stratum)/content/_components/ClusterHeader.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, MoreVertical, X } from "lucide-react"
import { set } from "zod"

import { makeExtensionRequest } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { CardHeader } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import { ClusterWithCounts } from "../page"

interface ClusterHeaderProps {
  cluster: ClusterWithCounts
  projectId: string
}

export function ClusterHeader({ cluster, projectId }: ClusterHeaderProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(cluster.name)
  const [description, setDescription] = useState(cluster.description)
  const router = useRouter()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const hasContent = cluster._count.keywords > 0 || cluster._count.briefs > 0
  const [isDeleting, setIsDeleting] = useState(false)
  const handleSave = async () => {
    await makeExtensionRequest(
      `/api/extension/ai-projects/${projectId}/content/clusters/${cluster.id}`,
      {
        method: "PATCH",
        body: JSON.stringify({ name, description }),
      }
    )
    setIsEditing(false)
    router.refresh()
  }

  return (
    <>
      <CardHeader className="flex flex-row items-center justify-between space-x-4">
        {isEditing ? (
          <div className="flex-1 space-y-2">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-lg font-semibold"
            />
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="text-muted-foreground"
            />
            <div className="flex gap-2">
              <Button onClick={handleSave}>Save</Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{cluster.name}</h3>
              <p className="text-muted-foreground">{cluster.description}</p>
            </div>
            {hasContent ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onSelect={() => setIsEditing(true)}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive"
                    onSelect={() => setShowDeleteDialog(true)}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                disabled={isDeleting}
                variant="ghost"
                size="icon"
                onClick={() => setShowDeleteDialog(true)}
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <X className="h-4 w-4" />
                )}
              </Button>
            )}
          </>
        )}
      </CardHeader>
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Cluster</DialogTitle>
            <DialogDescription>
              {hasContent ? (
                <>
                  This cluster contains content that will be archived. You can
                  restore this content later from the archives.
                  <ul className="mt-2 list-inside list-disc">
                    <li>{cluster._count.keywords} keywords</li>
                    <li>{cluster._count.briefs} content briefs</li>
                  </ul>
                </>
              ) : (
                "This empty cluster will be permanently deleted. This action cannot be undone."
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              disabled={isDeleting}
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              disabled={isDeleting}
              variant="destructive"
              onClick={handleDelete}
            >
              {isDeleting
                ? "Deleting..."
                : hasContent
                  ? "Archive Cluster"
                  : "Delete Cluster"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
