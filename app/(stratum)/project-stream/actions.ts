// app/(docs)/product-stream/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { makeExtensionRequest } from '@/lib/api'
import { StoryStage } from './types'

export async function addBlock(projectId: string, data: any) {
 try {
   const response = await makeExtensionRequest(
     `/api/extension/ai-projects/${projectId}/big-blocks`,
     {
       method: 'POST',
       body: JSON.stringify(data)
     }
   )

   
   revalidatePath('/project-stream')
   return { success: true, data: await response.json() }
 } catch (error) {
   return { success: false, error }
 }
}

export async function updateStream(projectId: string, data: any) {
 try {
   const response = await makeExtensionRequest(
     `/api/extension/ai-projects/${projectId}/product-stream`,
     {
       method: 'POST',
       body: JSON.stringify(data)
     }
   )
   const updatedStream = await response.json()
   revalidatePath('/project-stream')
   return { success: true, data: updatedStream }
 } catch (error) {
   return { success: false, error }
 }
}

export async function deleteStory(projectId: string, storyId: string) {
    try {

        console.log('trying to delete story', storyId)
      const response = await makeExtensionRequest(
        `/api/extension/ai-projects/${projectId}/product-stream/stories/${storyId}`,
        {
          method: 'DELETE'
        }
      );
  
      if (!response.ok) throw new Error('Failed to delete story');
      
      revalidatePath('/product-stream');
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }
  
export async function updateStoryState(
    projectId: string, 
    storyId: string, 
    data: {
      stage?: StoryStage;
      isArchived?: boolean;
      order?: number;
    }
   ) {
    try {
      // If we're updating the order, we need to include the stage for proper ordering
      let updateData = { ...data };
      if (typeof data.order === 'number' && !data.stage) {
        // Get current story to know the stage
        const currentStory = await makeExtensionRequest(
          `/api/extension/ai-projects/${projectId}/product-stream/stories/${storyId}`,
          { method: 'GET' }
        ).then(res => res.json());
        
        updateData.stage = currentStory.stage;
      }
   
      const response = await makeExtensionRequest(
        `/api/extension/ai-projects/${projectId}/product-stream/stories/${storyId}`,
        {
          method: 'PATCH',
          body: JSON.stringify(updateData)
        }
      );
   
      if (!response.ok) throw new Error('Failed to update story');
   
      const updatedStory = await response.json();
      revalidatePath('/product-stream');
      return { success: true, data: updatedStory };
    } catch (error) {
      return { success: false, error };
    }
   }