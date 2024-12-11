// app/(stratum)/product-stream/types.ts

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






export interface WorkProgressItem {
  api: number; // 0-100
  ui: number; // 0-100
  tests: number; // 0-100
  docs: number; // 0-100
}




export interface ProductStreamUpdate {
  id: string|null;
  timestamp: string;
  workItems: WorkItemUpdate[];
  session: DevSessionUpdate;
  health: ProjectHealthUpdate;
  stories: StoryLineUpdate[];
}

export interface WorkItemUpdate {
  title: string;
  type: WorkType;
  scope: string;
  progress: WorkProgressItem;
  bigBlockId: string | null; // Add this

  context: TechnicalContext;
  nextSteps: string[];
}

export interface DevSessionUpdate {
  activeWork: string[];
  decisions: string[];
  questions: string[];
  bigBlockId: string | null; // Add this

  codeState: {
    completed: string[];
    pending: string[];
    blocked: string[];
  };
}

export interface ProjectHealthUpdate {
  velocity: Status;
  risks: string[];
  bigBlockId: string | null; // Add this

  readiness: {
    marketStatus: string;
    launchBlockers: string[];
  };
  resources: {
    needed: string[];
    available: string[];
  };
}

export interface StoryLineUpdate {
  type: StoryType;
  audience: Audience;
  bigBlockId: string | null; // Add this
  stage?: StoryStage;  // Optional for creation
  isArchived: boolean; // Optional for creation,
  hooks: string[];
  context: {
    impact: string[];
    metrics: string[];
    learnings: string[];
  };
}


export enum StoryStage {
  OPPORTUNITY = 'OPPORTUNITY',
  IN_BRIEF = 'IN_BRIEF',
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEW = 'REVIEW',
  COMPLETE = 'COMPLETE'
}


// Individual analysis section type
export interface AnalysisSection<T> {
  title: string;
  type: 'NEW' | 'UPDATE';
  confidence: number;
  data: T;
  changes?: Array<{
    field: string;
    oldValue: any;
    newValue: any;
    confidence: number;
  }>;
}

// Full analysis result
export interface CompleteAnalysis {
  workItems: Array<AnalysisSection<WorkItemUpdate>>;
  session: AnalysisSection<DevSessionUpdate>;
  health: AnalysisSection<ProjectHealthUpdate>;
  stories: Array<AnalysisSection<StoryLineUpdate>>;
}

// Status of the analysis
export interface AnalysisStatus {
  isAnalyzing: boolean;
  workItemsFound: number;
  decisionsFound: number;
  storiesFound: number;
  errors: string[];
  warnings: string[];
}

// Props for the analyzer component
export interface UpdateAnalyzerProps {
  extractedData: ExtractionResult;
  existingData?: {
    workItems: WorkItemUpdate[];
    session: DevSessionUpdate;
    health: ProjectHealthUpdate;
    stories: StoryLineUpdate[];
  };
  onAnalysisComplete: (analysis: CompleteAnalysis) => void;
  onAnalysisError?: (errors: string[]) => void;
}



export interface BigBlockResponse {
  id: string;
  name: string;
  description?: string;
  order: number;
  streamId?: string;
  projectId: string;
  workItems: any[];
  healthUpdates: any[];
  stories: any[];
  createdAt: string;
  updatedAt: string;
}


export interface ProductStreamResponse {
  id: string;
  projectId: string;
  timestamp: string;
  createdAt: string;
  updatedAt: string;
  workItems: WorkItemResponse[];
  sessions: DevSessionResponse[];
  health: ProjectHealthResponse[];
  stories: StoryLineResponse[];
  _count: {
    workItems: number;
    sessions: number;
    stories: number;
  };
}

export interface WorkItemResponse {
  id: string;
  streamId: string;
  bigBlockId: string | null; // Add this
  order: number;
  title: string;
  type: WorkType;
  scope: string;
  progress: {
    api: number;
    ui: number;
    tests: number;
    docs: number;
  };
  context: {
    decisions: string[];
    patterns: string[];
    dependencies: string[];
    architecture: string[];
  };
  nextSteps: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DevSessionResponse {
  id: string;
  streamId: string;
  activeWork: string[];
  bigBlockId: string | null; // Add this

  decisions: string[];
  questions: string[];
  codeState: {
    completed: string[];
    pending: string[];
    blocked: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface ProjectHealthResponse {
  id: string;
  streamId: string;
  velocity: Status;
  bigBlockId: string | null; // Add this

  risks: string[];
  readiness: {
    marketStatus: string;
    launchBlockers: string[];
  };
  resources: {
    needed: string[];
    available: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface StoryLineResponse {
  id: string;
  streamId: string;
  type: StoryType;
  isArchived: boolean;
  bigBlockId: string | null; // Add this
  stage: StoryStage;  // Add this
  order: number;
  audience: Audience;
  hooks: string[];
  context: {
    impact: string[];
    metrics: string[];
    learnings: string[];
  };
  createdAt: string;
  updatedAt: string;
}