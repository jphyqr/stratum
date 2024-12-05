// app/(docs)/product-stream/_components/StreamCard.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProductStreamResponse } from "../types";

interface StreamCardProps {
  stream: ProductStreamResponse;
}

export function StreamCard({ stream }: StreamCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Development Stream</CardTitle>
          <div className="flex gap-2">
            <Badge>
              {stream._count.workItems} Items
            </Badge>
            <Badge variant="secondary">
              {stream._count.sessions} Sessions
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form>
          <div className="space-y-4">
            <Button 
              formAction={async () => {
                'use server'
                // TODO: implement
              }}
              type="submit"
            >
              Mark Complete
            </Button>
            <Button 
              formAction={async () => {
                'use server'
                // TODO: implement
              }}
              type="submit"
            >
              Squash Selected
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}