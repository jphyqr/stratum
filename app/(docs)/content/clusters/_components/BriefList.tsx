// app/(docs)/content/_components/BriefList.tsx

import { Card, CardContent } from "@/components/ui/card";
import { Brief } from "../types";
import { BriefListClient } from "./BriefListClient";
import { Bot, FileText } from "lucide-react";
import { Button } from "react-day-picker";


interface BriefListProps {
    promise: Promise<Response>;
    showTree: boolean;
}

export async function BriefList({ promise, showTree }: BriefListProps) {
 
    const briefs = (await promise.then((res) => res.json())) as Brief[];



      if (!showTree) {
        return <EmptyBriefs 
        
          showKeywordWarning={false} 
        />;
      }

    return <BriefListClient briefs={briefs} />;
}



 const EmptyBriefs = ({ showKeywordWarning = false }: {  showKeywordWarning?: boolean }) => {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center space-y-4 py-8">
            <div className="rounded-full bg-muted p-3">
              <FileText className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold">No Content Briefs Yet</h3>
              <p className="text-sm text-muted-foreground">
                {showKeywordWarning 
                  ? "Add keywords first before generating content briefs"
                  : "Generate briefs to start planning your content"}
              </p>
            </div>

          </div>
        </CardContent>
      </Card>
    );
  };