'use client'
// app/(dashboard)/_components/top-nav.tsx

import { SidebarTrigger } from "@/components/ui/sidebar"
import { UserNav } from "./user-nav"

export function TopNav() {
  return (
    <header className="fixed top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <SidebarTrigger />
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="flex items-center space-x-2">
            <UserNav />
          </div>
        </div>
      </div>
    </header>
  )
}