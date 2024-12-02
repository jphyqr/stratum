import path from 'path';
import { AIConfig } from './types';
import { readFileSync } from 'fs';

export default {
  version: "1.0.0",
  workspace: {
    rootPath: "/Users/johnhashem/workspace/stratum",
    name: "stratum",
    lastSync: "2024-11-15T01:26:37.351Z"
  },
  projects: {
    default: {
      id: "cm3ejl8g7004j13a8zm6i9mbh",
      name: "Main Project",
      lastSynced: "2024-11-15T01:26:37.351Z",
      keyFiles: {
        "package": {
          path: "package.json",
          lastSync: "2024-11-15T01:26:37.351Z"
        },
      "middleware": {
          path: "middleware.ts",
          lastSync: "2024-11-15T01:26:37.351Z"
        },
      "tsconfig": {
          path: "tsconfig.json",
          lastSync: "2024-11-15T01:26:37.351Z"
        },
      "nextconfig": {
          path: "next.config.ts",
          lastSync: "2024-11-15T01:26:37.351Z"
        },
      "tailwind": {
          path: "tailwind.config.ts",
          lastSync: "2024-11-15T01:26:37.351Z"
        },
      "env": {
          path: ".env.example",
          lastSync: "2024-11-15T01:26:37.351Z"
        },
      "auth": {
          path: "app/api/auth/[...nextauth]/options.ts",
          lastSync: "2024-11-15T01:26:37.351Z"
        },
      "example-state": {
          path: "app/_layers/state/OptimalState.tsx",
          lastSync: "2024-11-15T01:26:37.351Z"
        },
      "example-forms": {
          path: "app/_layers/forms/OptimalForm.tsx",
          lastSync: "2024-11-15T01:26:37.351Z"
        },
      "example-data": {
          path: "app/_layers/data/OptimalTable.tsx",
          lastSync: "2024-11-15T01:26:37.351Z"
        },
      "example-pages": [
          {
            id: "1",
            path: "app/_layers/pages/ContentPage.tsx",
            lastSync: "2024-11-15T01:26:37.351Z"
          },
          {
            id: "2",
            path: "app/_layers/pages/InteractivePage.tsx",
            lastSync: "2024-11-15T01:26:37.351Z"
          },
          {
            id: "3",
            path: "app/_layers/pages/AdminPage/page.tsx",
            lastSync: "2024-11-15T01:26:37.351Z"
          },
          {
            id: "4",
            path: "app/_layers/pages/AdminPage/_components/AdminPageTable.tsx",
            lastSync: "2024-11-15T01:26:37.351Z"
          },
          {
            id: "5",
            path: "app/_layers/pages/AdminPage/_components/AdminPageHeader.tsx",
            lastSync: "2024-11-15T01:26:37.351Z"
          }
        ],
      "about": {
          path: "app/(marketing)/about/page.tsx",
          lastSync: "2024-11-15T01:26:37.351Z"
        },
      "faq": {
          path: "app/(marketing)/faq/page.tsx",
          lastSync: "2024-11-15T01:26:37.351Z"
        },
      "architecture": {
          path: "app/(docs)/architecture/page.tsx",
          lastSync: "2024-11-15T01:26:37.351Z"
        }  // Use the generated config here instead of mapping again

      }
    }
  }
} satisfies AIConfig;


export function getProjectConfig() {
  try {
    // Read from .ai/config.ts
    const configPath = path.join(process.cwd(), '.ai', 'config.ts');
    const configContent = readFileSync(configPath, 'utf-8');
    
    // Extract the object from the TypeScript file
    const configMatch = configContent.match(/export default ({[\s\S]*?}) satisfies AIConfig;/);
    if (!configMatch) {
      throw new Error('Invalid config file format');
    }

    // Parse the object
    const config: AIConfig = eval(`(${configMatch[1]})`);
    
    return {
      projectId: config.projects.default.id
    };
  } catch (error) {
    console.error('Failed to read project config:', error);
    return null;
  }
}
