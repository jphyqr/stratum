// app/(docs)/product-stream/schemas.ts
import { z } from 'zod';

export const workProgressSchema = z.object({
  api: z.number().min(0).max(100),
  ui: z.number().min(0).max(100),
  tests: z.number().min(0).max(100),
  docs: z.number().min(0).max(100)
});

export const technicalContextSchema = z.object({
  decisions: z.array(z.string()),
  patterns: z.array(z.string()),
  dependencies: z.array(z.string()),
  architecture: z.array(z.string())
});

export const workItemUpdateSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  type: z.enum(['FEATURE', 'API', 'UI', 'REFACTOR', 'INTEGRATION', 'DOCUMENTATION', 'TESTING']),
  scope: z.string(),
  progress: workProgressSchema,
  context: technicalContextSchema,
  nextSteps: z.array(z.string())
});

export const productStreamUpdateSchema = z.object({
  type: z.enum(['CREATE', 'UPDATE']),
  timestamp: z.string().datetime(),
  data: z.object({
    workItems: z.array(workItemUpdateSchema),
    session: z.object({
      activeWork: z.array(z.string()),
      decisions: z.array(z.string()),
      questions: z.array(z.string()),
      codeState: z.object({
        completed: z.array(z.string()),
        pending: z.array(z.string()),
        blocked: z.array(z.string())
      })
    }),
    health: z.object({
      velocity: z.enum(['FAST', 'STEADY', 'BLOCKED', 'AT_RISK']),
      risks: z.array(z.string()),
      readiness: z.object({
        marketStatus: z.string(),
        launchBlockers: z.array(z.string())
      }),
      resources: z.object({
        needed: z.array(z.string()),
        available: z.array(z.string())
      })
    }),
    stories: z.array(z.object({
      type: z.enum(['INVESTOR_UPDATE', 'BLOG_POST', 'RELEASE_NOTES', 'TECHNICAL_DEEP_DIVE', 'PRODUCT_ANNOUNCEMENT']),
      audience: z.enum(['INVESTORS', 'DEVELOPERS', 'USERS', 'TEAM', 'PUBLIC']),
      hooks: z.array(z.string()),
      context: z.object({
        impact: z.array(z.string()),
        metrics: z.array(z.string()),
        learnings: z.array(z.string())
      })
    }))
  })
});