// app/(docs)/product-stream/_components/StreamUpdateInput.tsx
"use client"

import { memo, useCallback, useEffect, useMemo, useState } from "react"
import { Bot, CheckCircle2, XCircle } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CompleteAnalysis, ExtractionResult, ProductStreamResponse } from "../types"
import { validateStreamUpdate } from "../utils/validation"

interface StreamUpdateInputProps {
  isCreating: boolean;  
  onAnalysisComplete: (analysis: CompleteAnalysis) => Promise<void>;
  stream: ProductStreamResponse | null
}

// app/(docs)/product-stream/_components/StreamUpdateInput.tsx
export function StreamUpdateInput({ 
    isCreating, 
    onAnalysisComplete,
    stream 
  }: StreamUpdateInputProps) {
    const [input, setInput] = useState("")
    const [analyzedData, setAnalyzedData] = useState<CompleteAnalysis | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [validation, setValidation] = useState<{
      isValid: boolean
      summary?: {
        workItems: number
        decisions: number
        stories: number
      }
      errors: string[]
    }>({ isValid: false, errors: [] })
  

    const convertToAnalysis = (extracted: ExtractionResult): CompleteAnalysis => ({
        workItems: extracted.workItems.map(item => ({
          title: item.title,
          type: "NEW",
          confidence: 0.95,
          data: {
            title: item.title,
            type: item.type,
            scope: item.scope,
            progress: item.progress,
            context: item.context,
            nextSteps: item.nextSteps
          }
        })),
        session: {
          title: "Development Session",
          type: "NEW",
          confidence: 0.9,
          data: {
            activeWork: extracted.session.activeWork,
            decisions: extracted.session.decisions,
            questions: extracted.session.questions,
            codeState: extracted.session.codeState
          }
        },
        health: {
          title: "Project Health",
          type: "NEW",
          confidence: 0.85,
          data: {
            velocity: extracted.health.velocity,
            risks: extracted.health.risks,
            readiness: extracted.health.readiness,
            resources: extracted.health.resources
          }
        },
        stories: extracted.stories.map(story => ({
          title: "Content Opportunity",
          type: "NEW",
          confidence: 0.9,
          data: {
            type: story.type,
            audience: story.audience,
            hooks: story.hooks,
            context: story.context
          }
        }))
      });

   
    const analyzeInput = useCallback((text: string) => {
      try {
        const jsonStart = text.indexOf('{')
        const jsonEnd = text.lastIndexOf('}')
        if (jsonStart === -1 || jsonEnd === -1) {
          throw new Error('No valid JSON object found')
        }
        
        const jsonStr = text.slice(jsonStart, jsonEnd + 1)
        const parsed = JSON.parse(jsonStr) as ExtractionResult
        
        // Validate and create summary
        const summary = {
          workItems: parsed.workItems?.length ?? 0,
          decisions: parsed.session?.decisions?.length ?? 0,
          stories: parsed.stories?.length ?? 0
        }
  
        const errors: string[] = []
        
        if (!parsed.workItems?.length) {
          errors.push('No work items found')
        }
        if (!parsed.session?.decisions?.length) {
          errors.push('No decisions found')
        }
  
        if (errors.length === 0) {
            const analysis = convertToAnalysis(parsed)
            setAnalyzedData(analysis)
            setValidation({
              isValid: true, // Set this explicitly
              summary,
              errors: []
            })
          } else {
            setValidation({
              isValid: false,
              summary,
              errors
            })
          }

        setValidation({
          isValid: errors.length == 0? true : false,
          summary,
          errors
        })
        console.log('Setting validation:', { isValid: true, summary, errors: [] });


        console.log('Validation:', validation)
  
      } catch (err) {
        setValidation({
          isValid: false,
          errors: [(err as Error).message]
        })
      }
    }, [])
  
    // Auto-analyze (but don't submit) when valid JSON is pasted
    const handlePaste = useCallback((e: React.ClipboardEvent) => {
        const text = e.clipboardData.getData('text')
        setInput(text)
        if (text.trim()) {
          analyzeInput(text.trim())
        }
      }, [analyzeInput])

      const canSubmit = Boolean(analyzedData && validation.isValid);

      const submitButton = useMemo(() => (
        console.log('Validation:', validation),
        console.log('Analyzed Data:', analyzedData),
        
        <Button
          onClick={() => analyzedData && onAnalysisComplete(analyzedData)}
          disabled={!analyzedData || !validation.isValid}
        >
          Update Stream
        </Button>
       ), [analyzedData, validation.isValid, onAnalysisComplete]);
       

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Development Context</h3>
          
              <p className="text-sm text-muted-foreground">
                Will create new work items, decisions, and stories
              </p>
           
          </div>
        </div>
  
        <ScrollArea className="h-[200px] rounded-md border">
          <textarea
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
             
            }}
            onPaste={handlePaste}
            placeholder="Paste extracted JSON here..."
            className="min-h-full w-full resize-none border-0 bg-transparent p-4 font-mono text-sm focus:outline-none"
            disabled={isProcessing}
          />
        </ScrollArea>
  
        {/* Analysis Results */}
      {/* Analysis Results */}
<Card>
 <CardHeader>
   <CardTitle>Analysis Results</CardTitle>
   <div className="flex gap-2">
     <Badge variant="outline">
       {validation.summary?.workItems ?? 0} Items
     </Badge>
     <Badge variant="outline">
       {validation.summary?.decisions ?? 0} Decisions  
     </Badge>
     <Badge variant="outline">
       {validation.summary?.stories ?? 0} Stories
     </Badge>
   </div>
 </CardHeader>
 <CardContent>
   <ScrollArea className="h-[200px]">
     {analyzedData ? (
       <div className="space-y-4">
         {analyzedData.workItems.map((item, i) => (
           <div key={i} className="border-l-4 border-primary/50 pl-4">
             <h4 className="font-semibold">{item.data.title}</h4>
             <p className="text-sm text-muted-foreground">
               {item.data.scope}
             </p>
           </div>
         ))}
       </div>
     ) : (
       <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
         Paste extracted JSON to see analysis
       </div>
     )}
   </ScrollArea>
 </CardContent>
 <CardFooter className="flex justify-end gap-2">
   <Button
     variant="outline"
     onClick={() => {
       setInput("")
       setAnalyzedData(null)
       setValidation({ isValid: false, errors: [] })
     }}
     disabled={!analyzedData}
   >
     Clear
   </Button>

   {submitButton}
 </CardFooter>
</Card>
  
        {/* Validation Errors */}
        {validation.errors.length > 0 && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              {validation.errors.map((error, i) => (
                <div key={i} className="text-sm">{error}</div>
              ))}
            </AlertDescription>
          </Alert>
        )}
      </div>
    )
  }