// app/(docs)/product-stream/_components/ContextExtractor.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

import { Bot } from "lucide-react";

const ENHANCED_EXTRACTOR_PROMPT = `Analyze this development chat history and extract a comprehensive development context snapshot.

Please structure your analysis to capture:

1. Work Items and Development Progress
- Features, APIs, or UI components being developed
- Technical implementation progress
- Key decisions and patterns used
- Dependencies and relationships
- Next steps and pending work

2. Development Session Context
- Active work and focus areas
- Technical decisions made
- Questions raised or pending
- Implementation state (completed/pending/blocked)
- Architectural or pattern decisions

3. Project Health Indicators
- Development velocity (FAST/STEADY/BLOCKED/AT_RISK)
- New risks or challenges identified
- Market readiness updates
- Resource needs and availability
- Technical debt indicators

4. Content Generation Opportunities
- Areas suitable for technical documentation
- Product announcements or updates
- Technical deep dives
- Learning resources or tutorials
- Release notes or updates

Format your response as a JSON object matching this structure:
{
  workItems: Array<{
    title: string;
    type: "FEATURE" | "API" | "UI" | "REFACTOR" | "INTEGRATION" | "DOCUMENTATION" | "TESTING";
    scope: string;
    progress: {
      api: number; // 0-100
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
  }>;
  session: {
    activeWork: string[];
    decisions: string[];
    questions: string[];
    codeState: {
      completed: string[];
      pending: string[];
      blocked: string[];
    };
  };
  health: {
    velocity: "FAST" | "STEADY" | "BLOCKED" | "AT_RISK";
    risks: string[];
    readiness: {
      marketStatus: string;
      launchBlockers: string[];
    };
    resources: {
      needed: string[];
      available: string[];
    };
  };
  stories: Array<{
    type: "INVESTOR_UPDATE" | "BLOG_POST" | "RELEASE_NOTES" | "TECHNICAL_DEEP_DIVE" | "PRODUCT_ANNOUNCEMENT";
    audience: "INVESTORS" | "DEVELOPERS" | "USERS" | "TEAM" | "PUBLIC";
    hooks: string[];
    context: {
      impact: string[];
      metrics: string[];
      learnings: string[];
    };
  }>;
}

Focus on extracting concrete, actionable information that helps track development progress and project health. Be specific about technical details, progress indicators, and development context.`;

// Rest of ContextExtractor component remains the same, just update the EXTRACTOR_PROMPT

export function ContextExtractor() {
  const { toast } = useToast();

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(ENHANCED_EXTRACTOR_PROMPT);
      toast({
        title: "Prompt copied!",
        description: "Paste this into your AI chat to extract development context",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again or copy manually",
        variant: "destructive",
      });
    }
  };

  return (
    <Button 
      onClick={handleCopyPrompt}
      className="w-full"
      size="lg"
    >
      <Bot className="mr-2 h-5 w-5" />
      Copy Context Extractor Prompt
    </Button>
  );
}