// app/(dashboard)/projects/[projectId]/_components/SuperPrompts/prompts.ts
import { Bomb, Shovel } from 'lucide-react';
import { SuperPrompt } from '../page';

export const SUPER_PROMPTS: SuperPrompt[] = [
  {
    id: 'fire-in-the-hole',
    title: '1 Message Left',
    description: 'Ensure next response is exhaustive with no follow-up questions',
    category: 'Chat Closers',
    type: 'direct',
    icon: Bomb,
    prompt: `Before I make my final request, please note that this will be my last message in this conversation. Please ensure your response:

1. Is completely self-contained with all necessary code and explanations
2. Makes no assumptions about future messages
3. Includes all relevant code, configurations, and implementation details
4. Provides any necessary error handling or edge cases
5. Does not ask follow-up questions or leave open ends
6. Uses proper TypeScript types and follows our project patterns
7. Conforms to our established layer instructions

My final request is:`
  },
  {
    id: 'context-extractor',
    title: 'Extract Context',
    description: 'Extract key context for a new chat thread',
    category: 'Chat Closers',
    type: 'direct',
    icon: Shovel,
    prompt: `Please analyze our conversation and create a comprehensive context summary that I can use to continue in a new chat. Focus on:

1. Delta Changes from Project Knowledge:
   - New components/features introduced
   - Modified file paths and their changes
   - New patterns or approaches established

2. Active Development Context:
   - Current feature being implemented
   - Outstanding tasks or TODOs
   - Recent decisions and their rationale

3. Technical Direction:
   - Established patterns and conventions
   - Chosen libraries or approaches
   - Current limitations or constraints

4. Implementation Progress:
   - Components completed
   - Components in progress
   - Next steps identified

Please format this as a clear, structured summary that I can paste into a new chat to continue our work.`
  }
];