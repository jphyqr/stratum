import { Card, CardContent, CardHeader } from "@/components/ui/card";

// app/(stratum)/product-stream/_components/BigBlocksSkeleton.tsx
export function BigBlocksSkeleton() {
    return (
      <Card>
        <CardHeader>
          <div className="space-y-2">
            <div className="h-5 w-40 rounded-md bg-muted animate-pulse" />
            <div className="h-4 w-60 rounded-md bg-muted animate-pulse" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map(i => (
              <Card key={i}>
                <CardHeader>
                  <div className="h-5 w-32 rounded-md bg-muted animate-pulse" />
                </CardHeader>
                <CardContent>
                  <div className="h-20 rounded-md bg-muted animate-pulse" />
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }