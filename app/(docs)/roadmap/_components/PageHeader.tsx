// app/(docs)/roadmap/_components/PageHeader.tsx
import { HTMLAttributes } from "react"

interface PageHeaderProps extends HTMLAttributes<HTMLDivElement> {
  heading: string
  description?: string
}

export function PageHeader({
  heading,
  description,
  children,
  ...props
}: PageHeaderProps) {
  return (
    <div className="flex justify-between items-start" {...props}>
      <div className="space-y-0.5">
        <h1 className="text-2xl font-bold tracking-tight">{heading}</h1>
        {description && (
          <p className="text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {children}
    </div>
  )
}