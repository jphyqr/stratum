// app/(docs)/product-stream/_components/ProductStreamBoard.tsx
"use client"

import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd"
import { startTransition, useOptimistic, useState } from "react"
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Inbox, Plus } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { StreamUpdateInput } from "./StreamUpdateInput"
import { BacklogColumn } from "./BacklogColumn"
import { toast } from "@/hooks/use-toast"
import { makeExtensionRequest } from "@/lib/api"
import { useRouter } from "next/navigation"
import type { 
  ProductStreamResponse, 
  BigBlockResponse, 
  ExtractionResult,
  CompleteAnalysis,
  ProductStreamUpdate,
  WorkItemResponse,
  DevSessionResponse,
  ProjectHealthResponse,
  StoryLineResponse,
  WorkItemUpdate,
  DevSessionUpdate,
  ProjectHealthUpdate,
  StoryLineUpdate
} from "../types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { z } from "zod"
import { addBlock, updateStream } from "../actions"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "recharts"
import { StoryView } from "./StoryView"
import { Badge } from "@/components/ui/badge"

interface ProductStreamBoardProps {
  stream: ProductStreamResponse | null
  blocks: BigBlockResponse[]
  projectId: string
}

interface OptimisticUpdate {
 workItems?: WorkItemUpdate[];
 sessions?: DevSessionUpdate[];
 health?: ProjectHealthUpdate[];
 stories?: StoryLineUpdate[];
}
interface BlockOptimisticUpdate {
    type: 'add' | 'remove';
    block: BigBlockResponse;
  }
export function ProductStreamBoard({ 
  stream: initialStream, 
  blocks: initialBlocks, 
  projectId 
}: ProductStreamBoardProps) {
  const router = useRouter()
  const [showNewBlockDialog, setShowNewBlockDialog] = useState(false);



  const [optimisticStream, addOptimisticStream] = useOptimistic<ProductStreamResponse | null, OptimisticUpdate>(
    initialStream,
    (state, updates) => {
      if (!state) return null;
  
      const mockResponse = (item: WorkItemUpdate): WorkItemResponse => ({
        ...item,
        id: crypto.randomUUID(),
        streamId: state.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
  
      const currentCounts = state._count || { workItems: 0, sessions: 0, stories: 0 };
  
      return {
        ...state,
        workItems: [...state.workItems, ...(updates.workItems?.map(mockResponse) || [])],
        sessions: [...state.sessions, ...(updates.sessions?.map(s => ({
          ...s,
          id: crypto.randomUUID(),
          streamId: state.id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })) || [])],
        health: [...state.health, ...(updates.health?.map(h => ({
          ...h,
          id: crypto.randomUUID(),
          streamId: state.id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })) || [])],
        stories: [...state.stories, ...(updates.stories?.map(s => ({
          ...s,
          id: crypto.randomUUID(),
          streamId: state.id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })) || [])],
        _count: {
          workItems: currentCounts.workItems + (updates.workItems?.length || 0),
          sessions: currentCounts.sessions + (updates.sessions?.length || 0),
          stories: currentCounts.stories + (updates.stories?.length || 0)
        }
      };
    }
  );
  const [optimisticBlocks, addOptimisticBlock] = useOptimistic<
  BigBlockResponse[],
  BlockOptimisticUpdate
>(
  initialBlocks,
  (state, update) => {
    switch (update.type) {
      case 'add':
        return [...state, update.block];
      case 'remove':
        return state.filter(b => b.id !== update.block.id);
      default:
        return state;
    }
  }
);
const backlogItems = optimisticStream?.workItems.filter(item => !item.bigBlockId)

  // Board State
  const [stream, setStream] = useState(initialStream)
  const [blocks, setBlocks] = useState(initialBlocks)
  
  // Analysis State
  const [extractedData, setExtractedData] = useState<ExtractionResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  const handleDragEnd = async (result: DropResult) => {
    // ... drag end logic
  }

  const handleAnalysisComplete = async (analysis: CompleteAnalysis) => {
    setIsCreating(true)
    
    const streamUpdate = {
      id: stream?.id || null,
      timestamp: new Date().toISOString(),
      workItems: analysis.workItems.map(item => ({
        title: item.data.title,
        type: item.data.type,
        scope: item.data.scope,
        progress: item.data.progress,
        context: item.data.context,
        nextSteps: item.data.nextSteps
      })),
      session: analysis.session.data,
      health: analysis.health.data,
      stories: analysis.stories.map(story => story.data)
    }
  
    const optimisticUpdate: OptimisticUpdate = {
      workItems: streamUpdate.workItems,
      sessions: [streamUpdate.session],
      health: [streamUpdate.health],
      stories: streamUpdate.stories
    }
  
    try {
      startTransition(() => {
        addOptimisticStream(optimisticUpdate)
      })
      
      const result = await updateStream(projectId, streamUpdate)
      
      if (!result.success) throw new Error('Failed to update stream')
      

            // Update with real server data
    startTransition(() => {
        // Since we got real data back, use it
        setStream(result.data)
      })
      toast({ description: "Development context saved" })
      setExtractedData(null)
    } catch (error) {
      startTransition(() => {
        addOptimisticStream(initialStream as ProductStreamResponse)
      })
      toast({ description: "Failed to save context", variant: "destructive" })
    } finally {
      setIsCreating(false)
    }
  }


  const handleCreateBlock = async (formData: { name: string; description?: string }) => {
   console.log('handleCreateBlock', formData)
   
    const optimisticBlock: BigBlockResponse = {
      id: crypto.randomUUID(),
      name: formData.name,
      description: formData.description,
      order: optimisticBlocks.length,
      projectId,
      workItems: [],
      healthUpdates: [],
      stories: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  
    startTransition(() => {
      addOptimisticBlock({ type: 'add', block: optimisticBlock });
    });
  
    try {
      const result = await addBlock(projectId, {
        ...formData,
        order: blocks.length
      });
      if (!result.success) throw new Error('Failed to create block');
      toast({ description: "Block created" });
    } catch (error) {
      startTransition(() => {
        addOptimisticBlock({ type: 'remove', block: optimisticBlock });
      });
      toast({ description: "Failed to create block", variant: "destructive" });
    }
  };


  if (!initialStream) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto py-10">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Start Development Stream</h1>
          <p className="text-muted-foreground">
            Create your first stream by pasting extracted development context
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create Stream</CardTitle>
            <CardDescription>
              Paste your AI's response to start tracking development context
            </CardDescription>
          </CardHeader>
          <CardContent>
            <StreamUpdateInput
              stream={null}
              onAnalysisComplete={handleAnalysisComplete}
              isCreating={isCreating}
            />
          </CardContent>
        </Card>
      </div>
    );
  }


  return (
    <div className="space-y-4">
      {/* Top Bar with Input Sheet */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Development Board</h1>

        <Sheet>
          <SheetTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Context
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[800px] sm:max-w-none overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Add Development Context</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <StreamUpdateInput
                stream={stream}
                onAnalysisComplete={handleAnalysisComplete}
                isCreating={isCreating}
              />
            </div>
          </SheetContent>
        </Sheet>

        <Dialog open={showNewBlockDialog} onOpenChange={setShowNewBlockDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Column</DialogTitle>
          </DialogHeader>
          <form onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            await handleCreateBlock({
              name: formData.get('name') as string,
              description: formData.get('description') as string
            });
            setShowNewBlockDialog(false);
          }}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" required />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button type="submit">Create Column</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      </div>

      {/* Main Board Area */}
      <Tabs defaultValue="board" className="h-[calc(100vh-8rem)]">
        <TabsList>
          <TabsTrigger value="board">Development Board</TabsTrigger>
          <TabsTrigger value="stories" className="flex items-center gap-2">
    Stories
    {optimisticStream?.stories.length ? (
      <Badge variant="secondary" className="h-5">
        {optimisticStream.stories.length}
      </Badge>
    ) : null}
  </TabsTrigger>
        </TabsList>

        <TabsContent 
          value="board" 
          className="h-full mt-4 border rounded-md"
        >
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="flex h-full">
            {optimisticStream ? (
  <div className="w-80 flex-shrink-0 border-r">
  <div className="p-4 border-b flex items-center justify-between">
  <div className="flex items-center space-x-2">
          <Inbox className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-semibold">Backlog</h3>
          <Badge variant="secondary" className="ml-auto">
            {backlogItems?.length} items
          </Badge>
        </div>
    <Button size="sm" onClick={() => setShowNewBlockDialog(true)}>
      <Plus className="h-4 w-4 mr-2" />
      New Column
    </Button>
  </div>
  <BacklogColumn stream={optimisticStream} />
</div>
) : (
  <div className="w-80 flex-shrink-0 border-r flex items-center justify-center p-4">
    <p className="text-muted-foreground">No stream available</p>
  </div>
)}

  {/* Scrollable blocks area */}
  <div className="flex-1 overflow-x-auto">
    <div className="flex gap-4 p-4 min-w-fit">
      {optimisticBlocks.map((block) => (
        <Droppable key={block.id} droppableId={block.id}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="w-80 flex-shrink-0"
            >
              <div className="border rounded-lg p-4 h-full">
                <h3>{block.name}</h3>
                {provided.placeholder}
              </div>
            </div>
          )}
        </Droppable>
      ))}
    </div>
  </div>
            </div>
          </DragDropContext>
        </TabsContent>

        <TabsContent value="stories" className="h-full mt-4">
        <StoryView 
    stories={optimisticStream?.stories || []}
    projectId={projectId} 
  />
        </TabsContent>
      </Tabs>
    </div>
  )
}