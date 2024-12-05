// types.ts (or could be in the component file)

import { Control } from "react-hook-form";

   
   export interface ProductContext {
    id: string;
    projectId: string;
    vision: string;
    mission: string;
    businessModel: string;
    targetMarket: MarketSegment[];
    valueProps: ValueProposition[];
    competitors: Competitor[];
    goals: BusinessGoal[];
    updatedAt: Date;
   }
   

export interface Competitor {
    id?: string;
    name: string;
    description: string;
    strengths: string[];
    weaknesses: string[];
    differentiation: string;
  }


  export interface MarketSegment {
    id?: string;
    name: string;
    description: string;
    priority: number;
    painPoints: string[];
    gains: string[];
  }
  
  export interface ValueProposition {
    id?: string;
    benefit: string;
    description: string;
    segmentId: string;
  }
  


  export interface Metric {
    id?: string;
    name: string;
    description: string;
    target: string;
    current: string; // Add this field
  }
  
  export interface BusinessGoal {
    id?: string;
    name: string;
    description: string;
    timeframe: string;
    metrics: Metric[];
  }
  
  export interface Competitor {
    id?: string;
    name: string;
    description: string;
    strengths: string[];
    weaknesses: string[];
    differentiation: string;
  }


   export interface ProductContextFormData {
    vision: string;
    mission: string;
    businessModel: string;
    targetMarket: MarketSegment[];
    valueProps: ValueProposition[];
    goals: BusinessGoal[];
    competitors: Competitor[];
  }



  
  // Add this new interface for the MetricsList component props
export interface MetricsListProps {
    control: Control<ProductContextFormData>;
    parentIndex: number;
  }
  
  // Optional: Add a type helper for nested form fields if needed
  export type NestedKeys<T> = {
    [K in keyof T & (string | number)]: T[K] extends object
      ? `${K}` | `${K}.${NestedKeys<T[K]>}`
      : `${K}`
  }[keyof T & (string | number)];
  
  export type ProductContextFormFields = NestedKeys<ProductContextFormData>;