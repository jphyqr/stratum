// app/(stratum)/layout.tsx

import { getProjectConfig } from "@/.ai/config"

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

import { DocsNav } from "./_components/docs-nav"

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const config = getProjectConfig()

  return (
    <SidebarProvider>
     <DocsNav projectId={config?.projectId} />
        <main>
        <SidebarTrigger />
         {children}
        </main>
    
    </SidebarProvider>
  )
}
