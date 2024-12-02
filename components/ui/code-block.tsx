// components/ui/code-block.tsx
import * as React from "react"
import { cn } from "@/lib/utils"

interface CodeBlockProps extends React.HTMLAttributes<HTMLPreElement> {
  language?: string
  className?: string
  children: React.ReactNode
}

export function CodeBlock({
  language,
  className,
  children,
  ...props
}: CodeBlockProps) {
  return (
    <div className="relative">
      {language && (
        <div className="absolute top-3 right-3">
          <span className="rounded bg-muted px-2 py-1 text-xs text-muted-foreground">
            {language}
          </span>
        </div>
      )}
      <pre
        className={cn(
          "mb-4 mt-6 overflow-x-auto rounded-lg border bg-muted p-4 dark:bg-muted/50",
          className
        )}
        {...props}
      >
        <code className="relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm">
          {children}
        </code>
      </pre>
    </div>
  )
}