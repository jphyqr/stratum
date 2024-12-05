// app/(stratum)/content/types.ts
import * as z from "zod"

export const contentStrategySchema = z.object({
    // Core Strategy
    contentTone: z.enum(['technical', 'conversational', 'academic', 'professional']),
    expertiseLevel: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
    contentPillars: z.array(z.string()).min(1, "Add at least one content pillar"),
    targetKeywords: z.array(z.string()).min(1, "Add at least one target keyword"),

    // Content Principles
    contentPrinciples: z.array(z.string()).min(1, "Add at least one content principle"),
    educationGoals: z.array(z.string()).min(1, "Add at least one education goal"),

    // Thought Leadership
    thoughtLeadership: z.object({
        keyPositions: z.array(z.string()),
        uniquePerspectives: z.array(z.string())
    }),

    // Industry Context
    industryContext: z.object({
        terminology: z.array(z.string()),
        concepts: z.array(z.string()),
        trends: z.array(z.string())
    }),

    // Target Personas
    targetPersonas: z.array(z.object({
        name: z.string(),
        role: z.string(),
        challenges: z.array(z.string()),
        goals: z.array(z.string()),
        contentPreferences: z.array(z.string())
    })).min(1, "Add at least one target persona")
})

export type ContentStrategyFormData = z.infer<typeof contentStrategySchema>

export const defaultContentStrategyValues: ContentStrategyFormData = {
    contentTone: 'professional',
    expertiseLevel: 'intermediate',
    contentPillars: [],
    targetKeywords: [],
    contentPrinciples: [],
    educationGoals: [],
    thoughtLeadership: {
        keyPositions: [],
        uniquePerspectives: []
    },
    industryContext: {
        terminology: [],
        concepts: [],
        trends: []
    },
    targetPersonas: []
}

export const EXPERTISE_LEVELS = [
    {
        value: 'beginner',
        label: 'Beginner',
        description: 'New to the topic, needs foundational knowledge'
    },
    {
        value: 'intermediate',
        label: 'Intermediate',
        description: 'Familiar with basics, ready for deeper insights'
    },
    {
        value: 'advanced',
        label: 'Advanced',
        description: 'Experienced, seeking specific details'
    },
    {
        value: 'expert',
        label: 'Expert',
        description: 'Deep domain knowledge, wants cutting-edge info'
    }
]

export const CONTENT_TONES = [
    {
        value: 'technical',
        label: 'Technical',
        description: 'Precise, detailed, focused on implementation'
    },
    {
        value: 'conversational',
        label: 'Conversational',
        description: 'Friendly, approachable, easy to understand'
    },
    {
        value: 'academic',
        label: 'Academic',
        description: 'Research-focused, thorough, analytical'
    },
    {
        value: 'professional',
        label: 'Professional',
        description: 'Business-oriented, clear, authoritative'
    }
]