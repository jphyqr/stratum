// app/(stratum)/product-stream/_components/ProductStreamContent.tsx
"use client"

import { useState } from "react"
import { Bot, Boxes, ChevronRight } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { CompleteAnalysis, ExtractionResult, ProductStreamResponse, ProductStreamUpdate } from "../types"
import { ContextExtractor } from "./ContextExtractor"
import { ContextInput } from "./ContextInput"
import { UpdateAnalyzer } from "./UpdateAnalyzer"
import { validateStreamUpdate } from "../utils/validation"
import { makeExtensionRequest } from "@/lib/api"
import { toast } from "@/hooks/use-toast"
import { z } from "zod"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { StreamUpdateInput } from "./StreamUpdateInput"
import { init } from "next/dist/compiled/webpack/webpack"
import { useRouter } from "next/navigation"

interface ProductStreamContentProps {
  initialData: ProductStreamResponse[] // This would be your backend data type
  projectId: string
}

export function ProductStreamContent({
  initialData,
  projectId,
}: ProductStreamContentProps) {
  const [extractedData, setExtractedData] = useState<ExtractionResult | null>(
    null
  )
  const [showAnalyzer, setShowAnalyzer] = useState(false)
  const [isCreating, setIsCreating] = useState(false);

const router = useRouter()

  const [selectedStreamId, setSelectedStreamId] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleValidExtraction = (data: ExtractionResult) => {
    setExtractedData(data)
    setShowAnalyzer(true)
  }

  const handleAnalysisComplete = async (analysis: CompleteAnalysis) => {
    setIsCreating(true);
    
    // Convert from CompleteAnalysis to ProductStreamInput format
    const streamUpdate: ProductStreamUpdate = {
      id: selectedStreamId,
      timestamp: new Date().toISOString(),
      workItems: analysis.workItems.map(item => ({
        title: item.data.title,
        type: item.data.type,
        scope: item.data.scope,
        progress: item.data.progress,
        context: item.data.context,
        nextSteps: item.data.nextSteps
      })),
      session: {
        activeWork: analysis.session.data.activeWork,
        decisions: analysis.session.data.decisions,
        questions: analysis.session.data.questions,
        codeState: analysis.session.data.codeState
      },
      health: {
        velocity: analysis.health.data.velocity,
        risks: analysis.health.data.risks,
        readiness: analysis.health.data.readiness,
        resources: analysis.health.data.resources
      },
      stories: analysis.stories.map(story => ({
        type: story.data.type,
        audience: story.data.audience,
        hooks: story.data.hooks,
        context: story.data.context
      }))
    };
  
    try {
      const response = await makeExtensionRequest(
        `/api/extension/ai-projects/${projectId}/product-stream`,
        {
          method: 'POST',
          body: JSON.stringify(streamUpdate)
        }
      );
  
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create product stream');
      }
  
      toast({
        title: "Success!",
        description: "Development context has been saved",
      });
  
      setShowAnalyzer(false);
      setExtractedData(null);
      router.refresh()
      
    } catch (error) {
      console.error('Creation error:', error);
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: (
            <div className="mt-2">
              {error.errors.map((e, i) => (
                <div key={i} className="text-sm">
                  {e.path.join('.')}: {e.message}
                </div>
              ))}
            </div>
          ),
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to save development context",
          variant: "destructive",
        });
      }
    } finally {
      setIsCreating(false);
    }
  };
 // Stream Management Section
 function StreamRow({ stream }: { stream: ProductStreamResponse }) {
  return (
    <Collapsible className="w-full">
      <div className="flex items-center justify-between space-x-4 rounded-md border p-4">
        <div className="flex items-center space-x-4">
          <CollapsibleTrigger>
            <Button variant="ghost" size="sm">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CollapsibleTrigger>
          <div>
            <h4 className="font-semibold">Development Stream {stream.id}</h4>
            <p className="text-sm text-muted-foreground">
              Last updated: {new Date(stream.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge>{stream._count.workItems} Items</Badge>
          <Badge variant="secondary">{stream._count.sessions} Sessions</Badge>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => setSelectedStreamId(stream.id)}
          >
            Select for Updates
          </Button>
        </div>
      </div>
      <CollapsibleContent className="space-y-2">
        <Card>
          <CardContent className="pt-6">
            <Accordion type="single" collapsible>
              <AccordionItem value="work-items">
                <AccordionTrigger>Work Items</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {stream.workItems.map((item) => (
                      <div key={item.id} className="border-l-4 border-primary/50 pl-4">
                        <h5 className="font-semibold">{item.title}</h5>
                        <p className="text-sm text-muted-foreground">{item.scope}</p>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="sessions">
                <AccordionTrigger>Development Sessions</AccordionTrigger>
                <AccordionContent>
                  {stream.sessions.map((session) => (
                    <div key={session.id} className="space-y-2">
                      <h5 className="font-medium">Decisions</h5>
                      <ul className="list-disc pl-5 text-sm">
                        {session.decisions.map((d, i) => (
                          <li key={i}>{d}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  )
}

// Extraction Section
function ExtractionSection() {
  return (
<Sheet>
  <SheetTrigger asChild>
    <Button >
      Input Context
    </Button>
  </SheetTrigger>
  <SheetContent className="w-[800px] sm:max-w-none overflow-y-auto">
    <SheetHeader>
      <SheetTitle>Update Development Stream</SheetTitle>
    </SheetHeader>
    <div className="mt-6">
      <StreamUpdateInput
        selectedStreamId={selectedStreamId}
        onAnalysisComplete={handleAnalysisComplete}
        streams={initialData}
      />
    </div>
  </SheetContent>
</Sheet>
  )
}

return (
  <div className="space-y-8">
    {/* Streams Section - Always Visible */}
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Development Streams</h2>
        <ExtractionSection />
      </div>
      <div className="space-y-4">
        {initialData.map((stream) => (
          <StreamRow key={stream.id} stream={stream} />
        ))}
      </div>
    </section>
  </div>
)
}