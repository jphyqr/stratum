// app/(stratum)/roadmap/_components/RoadmapForm/MilestoneItem.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSortable, UseSortableArguments } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, Loader2 } from "lucide-react"

import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

import { Milestone } from "./MilestoneList"

interface MilestoneItemProps {
  milestone: {
    id: string
    name: string
    description: string
    status: "PLANNED" | "IN_PROGRESS" | "COMPLETED"
  }
  projectId: string
  onUpdate: (milestone: Milestone) => void
  onDelete: (id: string) => void
}

export function MilestoneItem({
  milestone,
  projectId,
  onUpdate,
  onDelete,
}: MilestoneItemProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [name, setName] = useState(milestone.name)
  const [description, setDescription] = useState(milestone.description)
  const [status, setStatus] = useState(milestone.status)

  const sortableConfig: UseSortableArguments = {
    id: milestone.id,
    data: {
      type: "milestone",
      milestone,
    },
    resizeObserverConfig: {
      disabled: false,
    },
  }

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable(sortableConfig)

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  async function handleSave() {
    try {
      const res = await fetch(
        `http://localhost:3009/api/extension/ai-projects/${projectId}/roadmap/milestones/${milestone.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "x-extension-token": process.env.NEXT_PUBLIC_STRATUM_TOKEN || "",
          },
          body: JSON.stringify({
            name,
            description,
            status,
          }),
        }
      )

      if (!res.ok) throw new Error("Failed to update milestone")

      // Update local state immediately
      onUpdate({
        ...milestone,
        name,
        description,
        status,
      } as Milestone)

      setIsEditing(false)

      // Refresh server state
      router.refresh()

      toast({
        title: "Milestone Updated",
        description: "Your changes have been saved.",
      })
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Failed to update milestone",
        variant: "destructive",
      })
    }
  }

  async function handleDelete() {
    setIsDeleting(true)
    try {
      const res = await fetch(
        `http://localhost:3009/api/extension/ai-projects/${projectId}/roadmap/milestones/${milestone.id}`,
        {
          method: "DELETE",
          headers: {
            "x-extension-token": process.env.NEXT_PUBLIC_STRATUM_TOKEN || "",
          },
        }
      )

      if (!res.ok) throw new Error("Failed to delete milestone")

      // Update local state immediately
      onDelete(milestone.id)

      setShowDelete(false)

      // Refresh server state
      router.refresh()

      toast({
        title: "Milestone Deleted",
        description: "The milestone has been removed.",
      })
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Failed to delete milestone",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }
  return (
    <>
      <Card
        ref={setNodeRef}
        style={style}
        className={`${isDragging ? "ring-2 ring-primary" : ""}`}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <button
              className="mt-1 cursor-move touch-none"
              {...attributes}
              {...listeners}
            >
              <GripVertical className="h-5 w-5 text-muted-foreground" />
            </button>

            <div className="flex-1 space-y-4">
              {isEditing ? (
                <>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Milestone name"
                  />
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe this milestone..."
                    className="resize-none"
                  />
                  <Select
                    value={status}
                    onValueChange={(
                      value: "PLANNED" | "IN_PROGRESS" | "COMPLETED"
                    ) => setStatus(value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PLANNED">
                        <span className="inline-flex items-center">
                          <span className="mr-2 h-2 w-2 rounded-full bg-slate-300" />
                          Planned
                        </span>
                      </SelectItem>
                      <SelectItem value="IN_PROGRESS">
                        <span className="inline-flex items-center">
                          <span className="mr-2 h-2 w-2 rounded-full bg-blue-400" />
                          In Progress
                        </span>
                      </SelectItem>
                      <SelectItem value="COMPLETED">
                        <span className="inline-flex items-center">
                          <span className="mr-2 h-2 w-2 rounded-full bg-green-400" />
                          Completed
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{milestone.name}</h3>
                    <div
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        status === "COMPLETED"
                          ? "bg-green-100 text-green-700"
                          : status === "IN_PROGRESS"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {status
                        .split("_")
                        .map(
                          (word) => word.charAt(0) + word.slice(1).toLowerCase()
                        )
                        .join(" ")}
                    </div>
                  </div>
                  {milestone.description && (
                    <p className="text-sm text-muted-foreground">
                      {milestone.description}
                    </p>
                  )}
                </>
              )}

              <div className="flex items-center gap-2">
                {isEditing ? (
                  <>
                    <Button type="button" size="sm" onClick={handleSave}>
                      Save
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setName(milestone.name)
                        setDescription(milestone.description)
                        setStatus(milestone.status)
                        setIsEditing(false)
                      }}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowDelete(true)}
                    >
                      Delete
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Milestone?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this milestone. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
