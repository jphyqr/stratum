// app/(docs)/content/_components/KeywordItemSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";

interface KeywordItemSkeletonProps {
  depth: number;
  showChildren?: boolean;
}

export function KeywordItemSkeleton({ depth, showChildren = true }: KeywordItemSkeletonProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {/* Expand/collapse button skeleton */}
        <Skeleton className="h-6 w-6" />
        
        <div className="flex-1 flex items-center gap-2">
          {/* Keyword text skeleton */}
          <Skeleton className="h-4 w-[120px]" />
          {/* Difficulty skeleton */}
          <Skeleton className="h-4 w-[80px]" />
        </div>
        
        {/* Action button skeleton */}
        <Skeleton className="h-6 w-6" />
      </div>

      {/* Optional nested children */}
      {showChildren && depth < 2 && (
        <div className="ml-6 space-y-2">
          {[1, 2].map((i) => (
            <KeywordItemSkeleton 
              key={i} 
              depth={depth + 1} 
              showChildren={false} 
            />
          ))}
        </div>
      )}
    </div>
  );
}