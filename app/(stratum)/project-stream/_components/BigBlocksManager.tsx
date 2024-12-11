// app/(stratum)/product-stream/_components/BigBlocksManager.tsx
"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { makeExtensionRequest } from "@/lib/api"
import type { BigBlockResponse } from "../types/blocks"

interface BigBlocksManagerProps {
  initialData: BigBlockResponse[] | null;
  projectId: string;
}

export function BigBlocksManager({ initialData, projectId }: BigBlocksManagerProps) {
  const [blocks, setBlocks] = useState<BigBlockResponse[]>(initialData || [])
  const [isCreating, setIsCreating] = useState(false)
  const [newBlock, setNewBlock] = useState({ name: "", description: "" })

  const createBlock = async () => {
    try {
      setIsCreating(true)
      const res = await makeExtensionRequest(
        `/api/extension/ai-projects/${projectId}/big-blocks`,
        {
          method: "POST",
          body: JSON.stringify({
            ...newBlock,
            order: blocks.length
          })
        }
      )

      if (!res.ok) throw new Error("Failed to create block")
      
      const block = await res.json()
      setBlocks([...blocks, block])
      setNewBlock({ name: "", description: "" })
      toast({
        title: "Block created",
        description: "New block has been added successfully"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create block",
        variant: "destructive"
      })
    } finally {
      setIsCreating(false)
    }
  }

  const deleteBlock = async (blockId: string) => {
    try {
      const res = await makeExtensionRequest(
        `/api/extension/ai-projects/${projectId}/big-blocks/${blockId}`,
        { method: "DELETE" }
      )

      if (!res.ok) throw new Error("Failed to delete block")
      
      setBlocks(blocks.filter(b => b.id !== blockId))
      toast({
        title: "Block deleted",
        description: "Block has been removed successfully"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete block",
        variant: "destructive"
      })
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Big Blocks</CardTitle>
          <CardDescription>
            Create and manage organizational blocks for your streams
          </CardDescription>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Block
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Block</DialogTitle>
              <DialogDescription>
                Add a new organizational block for your development streams
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newBlock.name}
                  onChange={e => setNewBlock({ ...newBlock, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newBlock.description}
                  onChange={e => setNewBlock({ ...newBlock, description: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                onClick={createBlock} 
                disabled={isCreating || !newBlock.name}
              >
                Create Block
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {blocks.map(block => (
            <Card key={block.id}>
              <CardHeader>
                <CardTitle>{block.name}</CardTitle>
                {block.description && (
                  <CardDescription>{block.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="flex justify-between">
                  <div className="space-x-2">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => deleteBlock(block.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
