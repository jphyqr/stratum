// _components/ProductContextSkeleton.tsx
export function ProductContextSkeleton() {
    return (
      <div className="space-y-8">
        <div className="rounded-lg border p-6 space-y-8">
          {/* Vision Statement */}
          <div className="space-y-2">
            <div className="h-5 w-32 bg-muted rounded animate-pulse" />
            <div className="h-20 bg-muted rounded animate-pulse" />
            <div className="h-4 w-48 bg-muted/50 rounded animate-pulse" />
          </div>
   
          {/* Mission Statement */}
          <div className="space-y-2">
            <div className="h-5 w-36 bg-muted rounded animate-pulse" />
            <div className="h-20 bg-muted rounded animate-pulse" />
            <div className="h-4 w-52 bg-muted/50 rounded animate-pulse" />
          </div>
   
          {/* Business Model */}
          <div className="space-y-2">
            <div className="h-5 w-40 bg-muted rounded animate-pulse" />
            <div className="h-20 bg-muted rounded animate-pulse" />
            <div className="h-4 w-44 bg-muted/50 rounded animate-pulse" />
          </div>
        </div>
   
        {/* Target Markets Section */}
        <div className="rounded-lg border p-6 space-y-4">
          <div className="h-6 w-40 bg-muted rounded animate-pulse" />
          
          {/* Market Segments */}
          <div className="grid gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-5 w-48 bg-muted rounded animate-pulse" />
                <div className="h-16 bg-muted rounded animate-pulse" />
                <div className="flex gap-2">
                  <div className="h-4 w-20 bg-muted/50 rounded animate-pulse" />
                  <div className="h-4 w-24 bg-muted/50 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
   
        {/* Goals and Metrics */}
        <div className="rounded-lg border p-6 space-y-4">
          <div className="h-6 w-44 bg-muted rounded animate-pulse" />
          
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-12 w-12 bg-muted rounded animate-pulse" />
                <div className="space-y-2 flex-1">
                  <div className="h-5 w-32 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-48 bg-muted/50 rounded animate-pulse" />
                </div>
                <div className="h-8 w-24 bg-muted rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
   
        {/* Save Button Area */}
        <div className="flex justify-end">
          <div className="h-10 w-24 bg-muted rounded animate-pulse" />
        </div>
      </div>
    );
   }