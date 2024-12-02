// app/(docs)/roadmap/_components/RoadmapForm/MilestoneList.tsx
"use client"

import { useState } from "react"
import {
  DragEndEvent,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { MilestoneItem } from "./MilestoneListItem"

export interface Milestone {
  id: string
  name: string
  description: string
  status: "PLANNED" | "IN_PROGRESS" | "COMPLETED"
  order: number
}

interface MilestoneListProps {
  projectId: string
  initialMilestones: Milestone[]
}

export function MilestoneList({
  projectId,
  initialMilestones,
}: MilestoneListProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [milestones, setMilestones] = useState<Milestone[]>(initialMilestones)
  const [isCreating, setIsCreating] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const updateMilestone = (updatedMilestone: Milestone) => {
    setMilestones(current => 
      current.map(m => 
        m.id === updatedMilestone.id ? updatedMilestone : m
      )
    )
  }

  const deleteMilestone = (id: string) => {
    setMilestones(current => current.filter(m => m.id !== id))
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = milestones.findIndex((m) => m.id === active.id)
      const newIndex = milestones.findIndex((m) => m.id === over.id)
      
      const newMilestones = arrayMove(milestones, oldIndex, newIndex)
      setMilestones(newMilestones)

      try {
        const res = await fetch(
          `http://localhost:3009/api/extension/ai-projects/${projectId}/roadmap/milestones/reorder`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-extension-token": process.env.NEXT_PUBLIC_STRATUM_TOKEN || "",
            },
            body: JSON.stringify({
              milestoneIds: newMilestones.map((m) => m.id),
            }),
          }
        )

        if (!res.ok) throw new Error("Failed to reorder milestones")
        
        // Refresh after successful reorder
        router.refresh()
      } catch (error) {
        console.error(error)
        // Revert to old order on error
        setMilestones(milestones)
        toast({
          title: "Error",
          description: "Failed to reorder milestones",
          variant: "destructive",
        })
      }
    }
  }

  async function handleAddMilestone() {
    setIsCreating(true)
    try {
      const res = await fetch(
        `http://localhost:3009/api/extension/ai-projects/${projectId}/roadmap/milestones`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-extension-token": process.env.NEXT_PUBLIC_STRATUM_TOKEN || "",
          },
          body: JSON.stringify({
            name: "New Milestone",
            description: "",
            status: "PLANNED",
          }),
        }
      )

      if (!res.ok) throw new Error("Failed to create milestone")

      const newMilestone = await res.json()
      
      // Update local state immediately
      setMilestones(current => [...current, newMilestone])
      
      // Refresh server state
      router.refresh()

      toast({
        title: "Milestone Added",
        description: "Fill in the milestone details to get started.",
      })
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Failed to create milestone",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="space-y-4">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={milestones}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {milestones.map((milestone) => (
              <MilestoneItem
                key={milestone.id}
                milestone={milestone}
                projectId={projectId}
                onUpdate={updateMilestone}
                onDelete={deleteMilestone}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <Button
        type="button"
        variant="outline"
        onClick={handleAddMilestone}
        disabled={isCreating}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Milestone
      </Button>
    </div>
  )
}