// app/(stratum)/product-stream/_components/ContextInput.tsx
"use client"

import { useCallback, useEffect, useState } from "react"
import { AlertCircle, CheckCircle2, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

import { ExtractionResult } from "../types"

interface ContextInputProps {
  onValidExtraction: (data: ExtractionResult) => void
}

export function ContextInput({ onValidExtraction }: ContextInputProps) {
  const [input, setInput] = useState("")
  const [validation, setValidation] = useState<{
    isValid: boolean
    summary?: {
      workItems: number
      decisions: number
      questions: number
      stories: number
    }
    errors: string[]
  }>({ isValid: false, errors: [] })

  const validateAndParseInput = useCallback(
    (text: string) => {
      try {
        // Remove any potential prefixes/suffixes from Claude
        const jsonStart = text.indexOf("{")
        const jsonEnd = text.lastIndexOf("}")
        if (jsonStart === -1 || jsonEnd === -1) {
          throw new Error("No valid JSON object found")
        }

        const jsonStr = text.slice(jsonStart, jsonEnd + 1)
        const parsed = JSON.parse(jsonStr) as ExtractionResult

        // Validate structure
        const summary = {
          workItems: parsed.workItems?.length ?? 0,
          decisions: parsed.session?.decisions?.length ?? 0,
          questions: parsed.session?.questions?.length ?? 0,
          stories: parsed.stories?.length ?? 0,
        }

        const errors: string[] = []

        if (!parsed.workItems?.length) {
          errors.push("No work items found")
        }
        if (!parsed.session?.decisions?.length) {
          errors.push("No decisions found")
        }

        setValidation({
          isValid: errors.length === 0,
          summary,
          errors,
        })

        if (errors.length === 0) {
          onValidExtraction(parsed)
        }
      } catch (err) {
        setValidation({
          isValid: false,
          errors: [(err as Error).message],
        })
      }
    },
    [onValidExtraction]
  )

  // Debounced validation
  useEffect(() => {
    const timer = setTimeout(() => {
      if (input.trim()) {
        validateAndParseInput(input)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [input, validateAndParseInput])

  return (
    <Card className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Paste Extraction Result</h3>
        {validation.summary && (
          <div className="flex items-center gap-2">
            {validation.isValid ? (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : (
              <AlertCircle className="h-5 w-5 text-yellow-500" />
            )}
            <span className="text-sm text-muted-foreground">
              Found: {validation.summary.workItems} items,{" "}
              {validation.summary.decisions} decisions
            </span>
          </div>
        )}
      </div>

      <div className="relative">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="min-h-[400px] w-full rounded-md border border-input bg-background p-3 font-mono text-sm"
          placeholder="Paste the extracted JSON here..."
        />

        {validation.errors.length > 0 && (
          <div className="mt-2 text-sm text-red-500">
            {validation.errors.map((error, i) => (
              <div key={i} className="flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={() => setInput("")}
          disabled={!input}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Clear
        </Button>
        <Button
          onClick={() => validateAndParseInput(input)}
          disabled={!input || !validation.isValid}
        >
          Generate Updates
        </Button>
      </div>
    </Card>
  )
}
