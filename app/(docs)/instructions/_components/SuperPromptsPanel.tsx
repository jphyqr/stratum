// app/(dashboard)/projects/[projectId]/_components/SuperPrompts/SuperPromptsPanel.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { CheckCircle2, Copy } from "lucide-react";
import { SUPER_PROMPTS } from './prompts';
import { motion } from "framer-motion";
import { useToast } from '@/hooks/use-toast';
import { PromptCategory, SuperPrompt } from '../page';

export function SuperPromptsPanel() {
  const { toast } = useToast();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Group prompts by category
  const promptsByCategory = SUPER_PROMPTS.reduce((acc, prompt) => {
    if (!acc[prompt.category]) {
      acc[prompt.category] = [];
    }
    acc[prompt.category].push(prompt);
    return acc;
  }, {} as Record<PromptCategory, SuperPrompt[]>);

  const handleCopy = async (prompt: SuperPrompt) => {
    await navigator.clipboard.writeText(prompt.prompt);
    setCopiedId(prompt.id);
    
    toast({
      title: "Prompt Copied",
      description: "Ready to use in your chat",
    });

    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Super Prompts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(promptsByCategory).map(([category, prompts]) => (
          <div key={category} className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">{category}</h3>
            <div className="grid gap-3">
              {prompts.map((prompt) => {
                const Icon = prompt.icon;
                return (
                  <Card 
                    key={prompt.id}
                    className="cursor-pointer hover:bg-accent transition-colors"
                    onClick={() => handleCopy(prompt)}
                  >
                    <CardContent className="p-4 flex items-start gap-4">
                      {Icon && <Icon className="w-4 h-4 mt-1 text-muted-foreground" />}
                      <div className="flex-1 space-y-1">
                        <p className="font-medium text-sm">{prompt.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {prompt.description}
                        </p>
                      </div>
                      <motion.div
                        initial={false}
                        animate={{ scale: copiedId === prompt.id ? 0.8 : 1 }}
                      >
                        {copiedId === prompt.id ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4 text-muted-foreground" />
                        )}
                      </motion.div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}