// app/(stratum)/content/_components/ClusterCard.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, MoreVertical, Pencil, Save, X } from "lucide-react"

import { makeExtensionRequest } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
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
import { ClusterMetadata } from "../types"
import { ClusterMetadataSection } from "./ClusterMetadata"

interface ClusterCardProps {
  cluster: ClusterWithCounts
  projectId: string
  children: React.ReactNode // For the streamed content
}

export function ClusterCard({
  cluster,
  projectId,
  children,
}: ClusterCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(cluster.name)
  const [description, setDescription] = useState(cluster.description)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const router = useRouter()
  const [metadata, setMetadata] = useState<ClusterMetadata>(
    typeof cluster.metadata === "string"
      ? JSON.parse(cluster.metadata)
      : cluster.metadata
  )
  const hasContent = cluster._count.keywords > 0 || cluster._count.briefs > 0

  const handleSave = async () => {
    await makeExtensionRequest(
      `/api/extension/ai-projects/${projectId}/content/clusters/${cluster.id}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          name,
          description,
          metadata, // Send as object, the JSON.stringify of the whole body will stringify it once
        }),
      }
    )
    setIsEditing(false)
    router.refresh()
  }

  const handleCancel = () => {
    setName(cluster.name)
    setDescription(cluster.description)
    setIsEditing(false)
  }
  const [isDeleting, setIsDeleting] = useState(false)
  const handleDelete = async () => {
    if (isDeleting) return
    setIsDeleting(true)
    if (hasContent) {
      await makeExtensionRequest(
        `/api/extension/ai-projects/${projectId}/content/clusters/${cluster.id}/archive`,
        { method: "POST" }
      )
    } else {
      await makeExtensionRequest(
        `/api/extension/ai-projects/${projectId}/content/clusters/${cluster.id}/delete`,
        { method: "DELETE" }
      )
    }
    setShowDeleteDialog(false)
    setIsDeleting(false)
    router.push(`/projects/${projectId}/content/clusters`)
  }

  return (
    <Card>
      <CardHeader className="relative">
        {isEditing ? (
          <div className="space-y-4">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Cluster name"
              className="text-lg font-semibold"
            />
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe this content cluster..."
              className="resize-none text-muted-foreground"
              rows={3}
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSave} className="gap-2">
                <Save className="h-4 w-4" />
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold">{cluster.name}</h3>
              <p className="mt-1 text-muted-foreground">
                {cluster.description}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              {hasContent ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
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
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent>
        <ClusterMetadataSection
          metadata={metadata}
          isEditing={isEditing}
          onSave={setMetadata}
        />
        {children}
      </CardContent>

      {/* Delete Dialog */}
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
    </Card>
  )
}
