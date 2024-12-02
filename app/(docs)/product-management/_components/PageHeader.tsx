// components/PageHeader.tsx
import { cn } from "@/lib/utils"

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
 heading: string
 description?: string
 children?: React.ReactNode
}

export function PageHeader({
 heading,
 description,
 children,
 className,
 ...props
}: PageHeaderProps) {
 return (
   <div className={cn("flex items-center justify-between", className)} {...props}>
     <div className="space-y-1">
       <h1 className="text-2xl font-semibold">{heading}</h1>
       {description && (
         <p className="text-sm text-muted-foreground">{description}</p>
       )}
     </div>
     {children && <div className="flex items-center gap-2">{children}</div>}
   </div>
 )
}