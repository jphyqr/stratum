// app/(docs)/product-stream/_components/StoryView.tsx
"use client"

import { startTransition, useState } from "react"
import { useOptimistic } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { StoryLineResponse, StoryStage, StoryType, Audience } from "../types"
import { Archive, Loader2Icon, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { deleteStory, updateStoryState } from "../actions"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"

interface StoryViewProps {
 stories: StoryLineResponse[]
 projectId: string
}

interface StoryCardProps {
 story: StoryLineResponse
}

const ARCHIVE_ID = 'archive-drop-zone';
const DELETE_ID = 'delete-drop-zone';

const PIPELINE_STAGES = [

 StoryStage.OPPORTUNITY,
 StoryStage.IN_BRIEF,
 StoryStage.IN_PROGRESS, 
 StoryStage.REVIEW,
 StoryStage.COMPLETE
] as const;

function StoryCard({ story }: StoryCardProps) {
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
           <p key={i} className="text-sm text-muted-foreground">{hook}</p>
         ))}
       </div>
       <div className="flex gap-2 text-xs text-muted-foreground mt-2">
         <span>{story.context.impact.length} impacts</span>
         <span>•</span>
         <span>{story.context.metrics.length} metrics</span>
         <span>•</span>
         <span>{story.context.learnings.length} learnings</span>
       </div>
     </CardContent>
   </Card>
 )
}

async function updateStoryStage(
 projectId: string, 
 storyId: string, 
 stage: StoryStage
) {
 // TODO: Implement server action
 return { success: true }
}

export function StoryView({ stories: initialStories, projectId }: StoryViewProps) {
    const [showArchived, setShowArchived] = useState(false);
    const [isUpdating, setIsUpdating] = useState<string | null>(null); // Track which story is updating
    const [storyToDelete, setStoryToDelete] = useState<StoryLineResponse | null>(null);
 
 const [optimisticStories, addOptimisticStory] = useOptimistic
   <StoryLineResponse[],
   { type: 'move'; story: StoryLineResponse; stage: StoryStage }
   | { type: 'move'; story: StoryLineResponse; stage: StoryStage; newOrder: number }
   | { type: 'archive'; storyId: string; archived: boolean }
   | { type: 'reorder'; storyId: string; newOrder: number }
   | { type: 'delete'; storyId: string }
 >(initialStories, (state, update) => {
    switch (update.type) {
        case 'move':
          return state.map(s => 
            s.id === update.story.id 
              ? { ...s, stage: update.stage }
              : s
          );
        case 'archive':
          return state.map(s =>
            s.id === update.storyId
              ? { ...s, archived: true }
              : s
          );
          case 'reorder':
            return state.map(s =>
              s.id === update.storyId
                ? { ...s, order: update.newOrder }
                : s
            );
        case 'delete':
          return state.filter(s => s.id !== update.storyId);
        default:
          return state;
      }
 });

 const handleArchive = async (story: StoryLineResponse) => {
    setIsUpdating(story.id);
    
    startTransition(() => {
      addOptimisticStory({ 
        type: 'archive', 
        storyId: story.id, 
        archived: true 
      });
    });
  
    try {
      const result = await updateStoryState(projectId, story.id, { 
        isArchived: true 
      });
  
      if (!result.success) throw new Error('Failed to archive story');
    } catch (error) {
      // Revert optimistic update
      startTransition(() => {
        addOptimisticStory({ 
          type: 'archive', 
          storyId: story.id, 
          archived: false 
        });
      });
      toast({ description: 'Failed to archive story', variant: 'destructive' });
    } finally {
      setIsUpdating(null);
    }
  };
  
  const handleDelete = async (story: StoryLineResponse) => {
    setIsUpdating(story.id);
  
    startTransition(() => {
      addOptimisticStory({
        type: 'delete',
        storyId: story.id
      });
    });
  
    try {
      const result = await deleteStory(projectId, story.id);
      if (!result.success) throw new Error('Failed to delete story');
      toast({ description: 'Story deleted' });
    } catch (error) {
      // Revert optimistic delete
     // setStories(initialStories);
      toast({ description: 'Failed to delete story', variant: 'destructive' });
    } finally {
      setIsUpdating(null);
    }
  };

 const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
  
    const story = optimisticStories.find(s => s.id === draggableId);
    if (!story) return;
  
    setIsUpdating(story.id);
  
    try {


  
      // Case 1: Dragging within archive - do nothing
      if (source.droppableId === 'ARCHIVED' && destination.droppableId === 'ARCHIVED') {
        return;
      }
  

      if (destination.droppableId === DELETE_ID) {
        setStoryToDelete(story);
        return;
      }
      // Case 2: Dragging to archive
      if (destination.droppableId === ARCHIVE_ID || destination.droppableId === 'ARCHIVED') {
        await handleArchive(story);
        return;
      }
      // Case 3: Dragging from archive back to a stage
      if (story.isArchived && destination.droppableId !== 'ARCHIVED') {
        const storiesInStage = optimisticStories.filter(
          s => s.stage === destination.droppableId && !s.isArchived
        );
        const newOrder = storiesInStage.length;
  
        startTransition(() => {
          addOptimisticStory({ 
            type: 'archive', 
            storyId: story.id, 
            archived: false 
          });
          addOptimisticStory({
            type: 'move',
            story,
            stage: destination.droppableId as StoryStage,
            newOrder
          });
        });
  
        const result = await updateStoryState(projectId, story.id, {
          isArchived: false,
          stage: destination.droppableId as StoryStage,
          order: newOrder
        });
  
        if (!result.success) throw new Error('Failed to unarchive story');
        return;
      }
  
      // Case 4: Regular stage movement
      if (
        destination.droppableId === source.droppableId && 
        destination.index === source.index
      ) {
        return;
      }
  
      const newStage = destination.droppableId as StoryStage;
      
      startTransition(() => {
        addOptimisticStory({
          type: 'move',
          story,
          stage: newStage,
          newOrder: destination.index
        });
      });
  
      const result = await updateStoryState(projectId, story.id, {
        stage: newStage,
        order: destination.index
      });
  
      if (!result.success) throw new Error('Failed to update story');
  
    } catch (error) {
      toast({ 
        description: error instanceof Error ? error.message : 'Operation failed', 
        variant: 'destructive' 
      });
    } finally {
      setIsUpdating(null);
    }
  };

 // Group stories by type for the grid view
 const internalStories = optimisticStories.filter(
   s => s.audience === Audience.TEAM || s.type === StoryType.TECHNICAL_DEEP_DIVE
 );
 const externalStories = optimisticStories.filter(
   s => s.type === StoryType.BLOG_POST || s.type === StoryType.TECHNICAL_DEEP_DIVE
 );
 const stakeholderStories = optimisticStories.filter(
   s => s.type === StoryType.INVESTOR_UPDATE || s.type === StoryType.PRODUCT_ANNOUNCEMENT
 );

   // Helper to sort stories by order
   const getSortedStories = (stage: StoryStage | 'ARCHIVED') => {
    if (stage === 'ARCHIVED') {
      return optimisticStories
        .filter(s => s.isArchived)
        .sort((a, b) => a.order - b.order);
    }
    
    return optimisticStories
      .filter(s => s.stage === stage && !s.isArchived)
      .sort((a, b) => a.order - b.order);
  };

 return (
   <div className="h-full space-y-6">
      <DragDropContext onDragEnd={handleDragEnd}>
      <DeleteConfirmDialog 
       open={!!storyToDelete}
       onOpenChange={(open) => !open && setStoryToDelete(null)}
       onConfirm={async () => {
         if (!storyToDelete) return;
        await handleDelete(storyToDelete);
       }}
       onArchiveInstead={async () => {
         if (!storyToDelete) return;
         await handleArchive(storyToDelete);
       }}
     />
     {/* Top Grid: Story Type Categories */}
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
       <Card>
       <CardHeader>
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-4">
      <CardTitle>Content Pipeline</CardTitle>

    </div>
    <Button size="sm">New Story</Button>
  </div>
</CardHeader>
         <CardContent>
           <p className="text-muted-foreground">Team memos and documentation</p>
         </CardContent>
       </Card>

       <Card>
         <CardHeader>
           <CardTitle className="flex items-center justify-between">
             External Content
             <Badge variant="secondary">{externalStories.length}</Badge>
           </CardTitle>
         </CardHeader>
         <CardContent>
           <p className="text-muted-foreground">Blog posts and technical articles</p>
         </CardContent>
       </Card>

       <Card>
         <CardHeader>
           <CardTitle className="flex items-center justify-between">
             Stakeholder Updates
             <Badge variant="secondary">{stakeholderStories.length}</Badge>
           </CardTitle>
         </CardHeader>
         <CardContent>
           <p className="text-muted-foreground">Investor and product announcements</p>
         </CardContent>
       </Card>
     </div>

     {/* Pipeline Board */}
     <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <CardTitle>Content Pipeline</CardTitle>
              <Droppable droppableId={ARCHIVE_ID}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    onClick={() => setShowArchived(prev => !prev)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-1.5 rounded-md cursor-pointer transition-colors",
                      snapshot.isDraggingOver ? "bg-muted" : "hover:bg-muted/50",
                      showArchived && "bg-muted"
                    )}
                  >
                    <Archive className="h-4 w-4" />
                    <span className="text-sm">Archive</span>
                    {getSortedStories('ARCHIVED').length > 0 && (
                      <Badge variant="secondary">
                        {getSortedStories('ARCHIVED').length}
                      </Badge>
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
              <Droppable droppableId={DELETE_ID}>
               {(provided, snapshot) => (
                 <div
                   ref={provided.innerRef}
                   {...provided.droppableProps}
                   className={cn(
                     "flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors",
                     snapshot.isDraggingOver && "bg-destructive/10"
                   )}
                 >
                   <Trash2 className="h-4 w-4 text-destructive" />
                   <span className="text-sm text-destructive">Delete</span>
                   {provided.placeholder}
                 </div>
               )}
             </Droppable>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {[
                    ...(showArchived ? ['ARCHIVED'] : []),
              ...PIPELINE_STAGES,
          
            ].map((stage) => (
              <Droppable key={stage} droppableId={stage}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="w-80 flex-shrink-0"
                  >
                    <div className={cn(
                      "border rounded-lg p-4 h-[500px]",
                      stage === 'ARCHIVED' && "bg-muted",
                      snapshot.isDraggingOver && "border-primary"
                    )}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium">
                          {stage === 'ARCHIVED' ? 'Archived' : stage}
                        </h3>
                        <Badge variant="secondary">
                          {getSortedStories(stage as StoryStage | 'ARCHIVED').length}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        {getSortedStories(stage as StoryStage | 'ARCHIVED')
                          .map((story, index) => (
                            <Draggable
                              key={story.id}
                              draggableId={story.id}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={cn(
                                    "transition-opacity",
                                    snapshot.isDragging && "opacity-50",
                                    isUpdating === story.id && "opacity-50"
                                  )}
                                >
                                  <StoryCard story={story} />
                                </div>
                              )}
                            </Draggable>
                          ))}
                        {provided.placeholder}
                      </div>
                    </div>
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </CardContent>
      </Card>
     </DragDropContext>
   </div>
 )
}






interface DeleteDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: () => Promise<void>
    onArchiveInstead: () => Promise<void>
   }
   
   function DeleteConfirmDialog({ open, onOpenChange, onConfirm, onArchiveInstead }: DeleteDialogProps) {
    const [isDeleting, setIsDeleting] = useState(false);
   
    const handleDelete = async () => {
      setIsDeleting(true);
      await onConfirm();
      setIsDeleting(false);
      onOpenChange(false);
    };
   
    const handleArchive = async () => {
      setIsDeleting(true);
      await onArchiveInstead();
      setIsDeleting(false);
      onOpenChange(false);
    };
   
    return (
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Story</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Would you like to archive this story instead?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <Button 
              variant="outline" 
              onClick={handleArchive}
              disabled={isDeleting}
            >
              Archive Instead
            </Button>
            <AlertDialogAction 
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" /> : 
                <Trash2 className="mr-2 h-4 w-4" />
              }
              Delete Story
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
   }