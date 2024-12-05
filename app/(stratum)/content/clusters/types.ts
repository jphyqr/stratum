// types/content.ts

export enum ClusterStatus {
    DRAFT = 'DRAFT',
    ACTIVE = 'ACTIVE',
    COMPLETED = 'COMPLETED',
    ARCHIVED = 'ARCHIVED'
  }
  
  export enum KeywordLevel {
    TOP_LEVEL = 'TOP_LEVEL',
    MID_TAIL = 'MID_TAIL',
    LONG_TAIL = 'LONG_TAIL'
  }
  
  export enum KeywordStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED'
  }
  
  export enum BriefType {
    PILLAR = 'PILLAR',
    SUPPORTING = 'SUPPORTING',
    SPECIFIC = 'SPECIFIC'
  }
  
  export enum BriefStatus {
    DRAFT = 'DRAFT',
    READY = 'READY',
    IN_PROGRESS = 'IN_PROGRESS',
    REVIEW = 'REVIEW',
    PUBLISHED = 'PUBLISHED'
  }
  
  export enum ArticleStatus {
    DRAFT = 'DRAFT',
    REVIEW = 'REVIEW',
    PUBLISHED = 'PUBLISHED',
    ARCHIVED = 'ARCHIVED'
  }
  
  export interface ClusterMetadata {
    targetPersonas: string[];
    supportedGoals: string[];
    searchIntent: string;
    competitorContent: {
      urls: string[];
      analysis: string;
    };
    businessAlignment: {
      productFeatures: string[];
      valueProps: string[];
    };
  }
  
  export interface BriefOutline {
    sections: {
      title: string;
      keyPoints: string[];
      targetKeyword?: string;
      estimatedWords?: number;
    }[];
    targetWordCount: number;
    targetReadingLevel: string;
    keyTakeaways: string[];
  }
  
  export interface BriefGuidelines {
    tone: string;
    targetAudience: {
      level: string;
      background: string[];
      painPoints: string[];
    };
    contentGoals: string[];
    requiredElements: {
      type: 'image' | 'code' | 'quote' | 'callout';
      description: string;
    }[];
    seoRequirements: {
      primaryKeyword: string;
      secondaryKeywords: string[];
      internalLinkingTargets?: string[];
    };
    style: {
      voice: string;
      formatting: string[];
      avoid: string[];
    };
  }
  
  export interface Cluster {
    id: string;
    projectId: string;
    strategyId: string;
    name: string;
    description: string;
    status: ClusterStatus;
    difficulty: number;
    priority: number;
    metadata: ClusterMetadata;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface Keyword {
    id: string;
    term: string;
    clusterId: string;
    parentId: string | null;
    level: KeywordLevel;
    searchVolume: number | null;
    difficulty: number | null;
    status: KeywordStatus;
    children: Keyword[];
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface Brief {
    id: string;
    clusterId: string;
    keywordId: string;
    title: string;
    type: BriefType;
    status: BriefStatus;
    outline: BriefOutline;
    guidelines: BriefGuidelines;
    article: Article | null;
    keyword: Keyword;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface Article {
    id: string;
    clusterId: string | null;
    briefId: string;
    title: string;
    content: string;
    status: ArticleStatus;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
  }