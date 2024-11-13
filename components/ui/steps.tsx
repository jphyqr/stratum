// components/ui/steps.tsx
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import React from "react"

interface StepsProps {
  children: React.ReactNode
  activeStep: number
  className?: string
}

interface StepProps {
  children: React.ReactNode
  title: string
}

export function Steps({ children, activeStep, className }: StepsProps) {
  const steps = React.Children.toArray(children) as React.ReactElement<StepProps>[]
  
  return (
    <div className={cn("space-y-8", className)}>
      <nav aria-label="Progress">
        <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
          {steps.map((step, index) => {
            const isCurrent = activeStep === index + 1
            const isComplete = activeStep > index + 1
            
            return (
              <li key={step.props.title} className="md:flex-1">
                <div className="group flex flex-col border-l-4 border-muted py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                  <span className="text-sm font-medium">
                    <span className="flex items-center gap-2">
                      {isComplete ? (
                        <Check className="h-4 w-4 text-primary" />
                      ) : (
                        <span className={cn(
                          "flex h-4 w-4 items-center justify-center rounded-full text-xs",
                          isCurrent 
                            ? "bg-primary text-primary-foreground" 
                            : "border border-muted bg-background"
                        )}>
                          {index + 1}
                        </span>
                      )}
                      <span className={cn(
                        isCurrent 
                          ? "text-foreground" 
                          : isComplete 
                            ? "text-primary" 
                            : "text-muted-foreground"
                      )}>
                        {step.props.title}
                      </span>
                    </span>
                  </span>
                </div>
              </li>
            )
          })}
        </ol>
      </nav>
      <div className="mt-8">
        {steps[activeStep - 1]}
      </div>
    </div>
  )
}

export function Step({ children }: StepProps) {
  return <div className="space-y-4">{children}</div>
}