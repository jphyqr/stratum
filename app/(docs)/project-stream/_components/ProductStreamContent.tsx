// app/(docs)/product-stream/_components/ProductStreamContent.tsx
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ContextExtractor } from './ContextExtractor';
import { ContextInput } from './ContextInput';
import { ExtractionResult } from '../types';
import { Bot, Boxes } from 'lucide-react';
import { UpdateAnalyzer } from './UpdateAnalyzer';

interface ProductStreamContentProps {
  initialData: any; // This would be your backend data type
}

export function ProductStreamContent({ initialData }: ProductStreamContentProps) {
  const [extractedData, setExtractedData] = useState<ExtractionResult | null>(null);
  const [showAnalyzer, setShowAnalyzer] = useState(false);

  const handleValidExtraction = (data: ExtractionResult) => {
    setExtractedData(data);
    setShowAnalyzer(true);
  };


  const handleAnalysisComplete = (analysis: any) => {
    console.log('Would update with analyzed changes:', analysis);
    // Here you would send the analyzed changes to your backend
    setShowAnalyzer(false);
    setExtractedData(null);
  };

  // Empty state when no data
 // Empty state when no data
 if (!initialData && !extractedData) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Extract Development Context</CardTitle>
          <CardDescription>
            Copy the prompt and paste it into your AI chat to extract structured context from your development discussions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ContextExtractor />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="rounded-full bg-primary/10 p-2">
              <Bot className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>No Updates Yet</CardTitle>
              <CardDescription>
                Paste your AI&apos;s response below to start tracking development context
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ContextInput onValidExtraction={handleValidExtraction} />
        </CardContent>
      </Card>
    </div>
  );
}

  // Show analysis step if we have extracted data
  if (showAnalyzer && extractedData) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <Boxes className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Extracted Context</CardTitle>
                  <CardDescription>
                    Review extracted information and analyze updates
                  </CardDescription>
                </div>
              </div>
              <ContextExtractor />
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Work Items Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Work Items</CardTitle>
              <CardDescription>
                {extractedData.workItems.length} items extracted
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {extractedData.workItems.map((item, i) => (
                  <div key={i} className="border-l-4 border-primary/50 pl-4">
                    <h4 className="font-semibold">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.scope}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Development Session */}
          <Card>
            <CardHeader>
              <CardTitle>Session Context</CardTitle>
              <CardDescription>
                Latest development context
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold">Decisions Made</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    {extractedData.session.decisions.map((decision, i) => (
                      <li key={i}>{decision}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold">Open Questions</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    {extractedData.session.questions.map((question, i) => (
                      <li key={i}>{question}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <UpdateAnalyzer 
          extractedData={extractedData}
          onAnalysisComplete={handleAnalysisComplete}
        />
      </div>
    );
  }


  // Show extracted or loaded data
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <Boxes className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Development Stream</CardTitle>
                  <CardDescription>
                    Current context and progress
                  </CardDescription>
                </div>
              </div>
              <ContextExtractor />
            </div>
          </CardHeader>
        </Card>
        
        {/* Work Items Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Work Items</CardTitle>
            <CardDescription>
              {extractedData?.workItems.length ?? 0} items tracked
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {extractedData?.workItems.map((item, i) => (
                <div key={i} className="border-l-4 border-primary/50 pl-4">
                  <h4 className="font-semibold">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.scope}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Development Session */}
        <Card>
          <CardHeader>
            <CardTitle>Current Session</CardTitle>
            <CardDescription>
              Latest development context
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold">Decisions Made</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground">
                  {extractedData?.session.decisions.map((decision, i) => (
                    <li key={i}>{decision}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold">Open Questions</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground">
                  {extractedData?.session.questions.map((question, i) => (
                    <li key={i}>{question}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Input for new extractions */}
      <Card>
        <CardHeader>
          <CardTitle>Update Context</CardTitle>
          <CardDescription>
            Paste new extraction results to update the development stream
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ContextInput onValidExtraction={handleValidExtraction} />
        </CardContent>
      </Card>
    </div>
  );
}