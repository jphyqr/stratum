// app/(docs)/product-stream/types.ts

export enum StreamType {
    CORE = 'CORE',
    SUB_PRODUCT = 'SUB_PRODUCT',
    INTEGRATION = 'INTEGRATION',
    PLUGIN = 'PLUGIN',
    EXPERIMENTAL = 'EXPERIMENTAL'
  }
  
  export enum WorkType {
    FEATURE = 'FEATURE',
    API = 'API',
    UI = 'UI',
    REFACTOR = 'REFACTOR',
    INTEGRATION = 'INTEGRATION',
    DOCUMENTATION = 'DOCUMENTATION',
    TESTING = 'TESTING'
  }
  
  export enum Status {
    FAST = 'FAST',
    STEADY = 'STEADY',
    BLOCKED = 'BLOCKED',
    AT_RISK = 'AT_RISK'
  }
  
  export enum StoryType {
    INVESTOR_UPDATE = 'INVESTOR_UPDATE',
    BLOG_POST = 'BLOG_POST',
    RELEASE_NOTES = 'RELEASE_NOTES',
    TECHNICAL_DEEP_DIVE = 'TECHNICAL_DEEP_DIVE',
    PRODUCT_ANNOUNCEMENT = 'PRODUCT_ANNOUNCEMENT'
  }
  
  export enum Audience {
    INVESTORS = 'INVESTORS',
    DEVELOPERS = 'DEVELOPERS',
    USERS = 'USERS',
    TEAM = 'TEAM',
    PUBLIC = 'PUBLIC'
  }
  
  export interface WorkItemProgress {
    api: number; // 0-100
    ui: number; // 0-100
    tests: number; // 0-100
    docs: number; // 0-100
  }
  
  export interface TechnicalContext {
    decisions: string[];
    patterns: string[];
    dependencies: string[];
    architecture: string[];
  }
  
  export interface ExtractedWorkItem {
    title: string;
    type: WorkType;
    scope: string;
    progress: WorkItemProgress;
    context: TechnicalContext;
    nextSteps: string[];
  }
  
  export interface ExtractedDevSession {
    activeWork: string[]; // Work item IDs or titles
    decisions: string[];
    questions: string[];
    codeState: {
      completed: string[];
      pending: string[];
      blocked: string[];
    };
  }
  
  export interface ExtractedHealth {
    velocity: Status;
    risks: string[];
    readiness: {
      marketStatus: string;
      launchBlockers: string[];
    };
    resources: {
      needed: string[];
      available: string[];
    };
  }
  
  export interface ExtractedStoryLine {
    type: StoryType;
    audience: Audience;
    hooks: string[];
    context: {
      impact: string[];
      metrics: string[];
      learnings: string[];
    };
  }
  
  // Main extraction result type
  export interface ExtractionResult {
    workItems: ExtractedWorkItem[];
    session: ExtractedDevSession;
    health: ExtractedHealth;
    stories: ExtractedStoryLine[];
    validation: {
      isValid: boolean;
      errors: string[];
      warnings: string[];
    };
  }


