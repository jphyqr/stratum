// app/(stratum)/layout.tsx

import { getProjectConfig } from "@/.ai/config"

import { SidebarProvider } from "@/components/ui/sidebar"

import { DocsNav } from "./_components/docs-nav"

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const config = getProjectConfig()

  return (
    <SidebarProvider>
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        <DocsNav projectId={config?.projectId} />
        <main className="relative py-6 lg:gap-10 lg:py-8">
          <div className="mx-auto w-full min-w-0">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  )
}
