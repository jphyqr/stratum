// app/(docs)/content/_components/ClusterCardSkeleton.tsx
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ClusterCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        {/* Title skeleton */}
        <Skeleton className="h-8 w-[200px]" />
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Description skeleton */}
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[80%]" />
        
        {/* Keywords section skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-[100px]" /> {/* "Keywords" header */}
          <div className="space-y-2">
            {/* Keyword items */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" /> {/* Icon */}
                <Skeleton className="h-4 flex-1" /> {/* Keyword text */}
              </div>
            ))}
          </div>
        </div>

        {/* Briefs section skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-[80px]" /> {/* "Briefs" header */}
          <div className="space-y-2">
            {/* Brief items */}
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" /> {/* Icon */}
                <Skeleton className="h-4 flex-1" /> {/* Brief text */}
              </div>
            ))}
          </div>
        </div>

        {/* Stats skeleton */}
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-[100px]" /> {/* Priority */}
          <Skeleton className="h-4 w-[100px]" /> {/* Difficulty */}
        </div>
      </CardContent>
    </Card>
  );
}