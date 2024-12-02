// app/(docs)/content/_components/KeywordItem.tsx
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronDown, X } from "lucide-react";
import { Keyword } from '../types';

interface KeywordItemProps {
  keyword: Keyword & { children: Keyword[] };
  clusterId: string;
  depth: number;
}

export function KeywordItem({ keyword, clusterId, depth }: KeywordItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = keyword.children.length > 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {hasChildren && (
          <Button
            variant="ghost"
            size="sm"
            className="p-1"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 
              <ChevronDown className="h-4 w-4" /> : 
              <ChevronRight className="h-4 w-4" />
            }
          </Button>
        )}
        <div className="flex-1 flex items-center gap-2">
          <span>{keyword.term}</span>
          {keyword.difficulty && (
            <span className="text-xs text-muted-foreground">
              Difficulty: {keyword.difficulty}
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="opacity-0 group-hover:opacity-100"
          onClick={() => {/* Handle delete */}}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {isExpanded && hasChildren && (
        <div className="ml-6 space-y-2">
          {keyword.children.map((child: Keyword) => (
            <KeywordItem
              key={child.id}
              keyword={child as Keyword & { children: Keyword[] }}
              clusterId={clusterId}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}