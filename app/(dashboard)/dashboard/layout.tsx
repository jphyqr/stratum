// app/(dashboard)/layout.tsx
import { SidebarProvider } from "@/components/ui/sidebar"
import { SideNav } from "./_components/side-nav"
import { TopNav } from "./_components/top-nav"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
    <div className="relative min-h-screen">
      {/* Top Nav - Fixed */}
      <TopNav />
      
      {/* Main Content - Add top padding for fixed nav */}
      <div className="flex h-[calc(100vh-4rem)] pt-14">
        {/* Sidebar - Fixed height, scrollable */}
        <div className="fixed inset-y-14 z-30 hidden w-64 border-r bg-background lg:block">
          <div className="h-full overflow-y-auto py-6 pr-2 pl-4">
            <SideNav />
          </div>
        </div>

        {/* Main Content Area - Scrollable with proper spacing */}
        <main className="flex-1 overflow-y-auto lg:pl-64">
          <div className="container max-w-7xl space-y-4 p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
    </SidebarProvider>
  )
}
