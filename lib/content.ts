import { makeExtensionRequest } from "./api";

// lib/content/checkPrerequisites.ts
export async function checkContentPrerequisites(projectId: string) {

    const res = await makeExtensionRequest(
       
        `/api/extension/ai-projects/${projectId}/content/prerequisites`,
        {
            method: 'GET',

        }
    )


    if (!res.ok) {
      throw new Error('Failed to check prerequisites');
    }
  
    const data = await res.json();
    return {
        hasBrand: data.hasBrand,
        hasProductStrategy: data.hasProductStrategy,
        hasContentStrategy: data.hasContentStrategy,
        missingFields: data.missingFields
      };
  }