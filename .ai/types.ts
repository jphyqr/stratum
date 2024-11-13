// File and Config Types
      export interface KeyFile {
        id?: string;  // Optional for single files, required for arrays
        path: string;
        lastSync: string;
      }
      
      // All possible config file types
      export type ConfigFileType = 
        | 'package'
        | 'schema'
        | 'nextconfig'
        | 'tsconfig'
        | 'env'
        | 'tailwind'
        | 'middleware'
        | 'auth'
        | 'faq'
        | 'about'
        | `config_${string}`; // For dynamic config names
      
      export interface Project {
        id: string;
        name: string;
        lastSynced: string;
        keyFiles: {
          [K in ConfigFileType]?: KeyFile | KeyFile[];  // Support both single and multiple files
        };
      }
      
      export interface AIConfig {
        version: string;
        projects: {
          [key: string]: Project;
        };
      }
      
      // File Selection Types
      export type FileSelectionType = 
        | 'package'
        | 'schema'
        | 'config'
        | 'env'
        | 'nextconfig';
      
      export interface FileSelection {
        fileId: FileSelectionType;
        path: string;
        content: string;
      }
      
      // Helper type for normalized files
      export interface NormalizedFile {
        fileId: ConfigFileType;
        path: string;
        content: string;
      }
      
      // Layer Configuration
      export interface LayerConfig {
        id: string;
        type: 'system' | 'project' | 'pattern' | 'domain';
        order: number;
        instructions: string;
        isActive: boolean;
        metadata?: {
          [key: string]: any;
        };
      }
      
      // Extended Project Configuration
      export interface ProjectConfig extends Project {
        layers?: LayerConfig[];
        customTokens?: string[];
        contextNotes?: string;
      }
      
      // Utility types for config manipulation
      export type ConfigFileMap = {
        [K in ConfigFileType]?: KeyFile | KeyFile[];
      };
      
      export type ProjectMap = {
        [key: string]: Project;
      };
      