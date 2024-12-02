// app/(docs)/content/_components/KeywordTreeSkeleton.tsx



// app/(docs)/content/_components/BriefListSkeleton.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function BriefListSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-5 w-[100px]" /> {/* "Content Briefs" header */}
      
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="py-3">
              <div className="space-y-3">
                {/* Brief header */}
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-[150px]" /> {/* Title */}
                  <Skeleton className="h-5 w-[80px]" /> {/* Status */}
                </div>
                
                {/* Brief details */}
                <div className="flex items-center gap-4 text-sm">
                  <Skeleton className="h-4 w-[100px]" /> {/* Type */}
                  <Skeleton className="h-4 w-[120px]" /> {/* Target keyword */}
                </div>
                
                {/* Progress or metrics */}
                <div className="flex items-center gap-3">
                  <Skeleton className="h-2 w-full" /> {/* Progress bar */}
                  <Skeleton className="h-4 w-[60px]" /> {/* Percentage */}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function KeywordTreeSkeleton() {
    const renderKeywordItem = (depth = 0) => (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4" /> {/* Expand/collapse icon */}
          <div className="flex-1 flex items-center gap-2">
            <Skeleton className="h-4 flex-1 max-w-[200px]" /> {/* Keyword text */}
            <Skeleton className="h-4 w-16" /> {/* Difficulty */}
          </div>
          <Skeleton className="h-6 w-6" /> {/* Action button */}
        </div>
        
        {depth < 2 && ( // Only show nested items up to 2 levels
          <div className="ml-6 space-y-2">
            {[1, 2].map(i => (
              <div key={i}>{renderKeywordItem(depth + 1)}</div>
            ))}
          </div>
        )}
      </div>
    );
  
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {[1, 2].map(i => (
              <div key={i}>{renderKeywordItem()}</div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }