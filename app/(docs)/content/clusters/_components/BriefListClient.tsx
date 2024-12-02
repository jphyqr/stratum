// app/(docs)/content/_components/BriefListClient.tsx
'use client';
import { Card, CardContent } from "@/components/ui/card";

import { ArticleStatus, Brief, BriefStatus } from "../types";
import { Badge } from "@/components/ui/badge";
export function BriefListClient({ briefs }: { briefs: Brief[] }) {
  if (!briefs.length) {
    return <div>No Briefs</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Content Briefs</h3>
      
      <div className="space-y-3">
        {briefs.map((brief) => (
          <Card key={brief.id}>
            <CardContent className="py-3">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{brief.title}</h4>
                  <Badge variant={getBriefStatusVariant(brief.status)}>
                    {brief.status}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{brief.type}</span>
                  {brief.keyword && (
                    <span>Target: {brief.keyword.term}</span>
                  )}
                </div>
                
                {brief.article && (
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary"
                        style={{ width: `${getArticleProgress(brief.article.status)}%` }}
                      />
                    </div>
                    <span className="text-sm">
                      {getArticleProgress(brief.article.status)}%
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}



function getBriefStatusVariant(status: BriefStatus) {
    switch (status) {
      case 'DRAFT': return 'secondary';
      case 'READY': return 'default';
      case 'IN_PROGRESS': return 'default';
      case 'REVIEW': return 'outline';
      case 'PUBLISHED': return 'default';
      default: return 'secondary';
    }
  }
  
  function getArticleProgress(status: ArticleStatus): number {
    switch (status) {
      case 'DRAFT': return 25;
      case 'REVIEW': return 75;
      case 'PUBLISHED': return 100;
      case 'ARCHIVED': return 100;
      default: return 0;
    }
  }