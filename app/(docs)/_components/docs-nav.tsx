'use client'
// app/(docs)/_components/docs-nav.tsx
import { Book, BookOpen, Bookmark } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const docsItems = [
  {
    title: "Introduction",
    url: "/docs",
    icon: BookOpen,
  },
  {
    title: "Getting Started",
    url: "/docs/getting-started",
    icon: Book,
  },
  {
    title: "Guides",
    url: "/docs/guides",
    icon: Bookmark,
  }
]

export function DocsNav() {
  return (
    <Sidebar variant="inset" collapsible="none">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Documentation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {docsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}