// app/(docs)/_components/docs-nav.tsx
'use client'

import { useEffect, useState } from "react"
import { Book, BookCopy, BookOpen, Bookmark, Code, Earth, FileText, Globe, LayoutDashboard, LucideIcon, Map, Network, Settings, Wand } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { makeExtensionRequest } from "@/lib/api"
import { useParams } from "next/navigation"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

type ContentState = {
  hasStrategy: boolean;
  hasClusters: boolean;
};

type RequiredState = keyof ContentState | null;

interface ContentItem {
  title: string;
  url: string;
  icon: LucideIcon;
  requiredState: RequiredState;
}
// Base items always shown
const baseItems = [
  {
    title: "App Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Setup Guide",
    url: "/how-stratum-works",
    icon: Bookmark,
  },
  {
    title: "Architecture",
    url: "/architecture",
    icon: BookOpen,
  },
  {
    title: "Product Management",
    url: "/product-management",
    icon: Book,
  },
  {
    title: "Roadmap",
    url: "/roadmap",
    icon: Map,
  },
  {
    title: "Project Stream",
    url: "/project-stream",
    icon: Wand,
  },
  {
    title: "Brand",
    url: "/brand",
    icon: Earth
  },
  {
    title: "Content",
    url: "/content",
    icon: BookCopy,
  },
  {
    title: "Instructions",
    url: "/instructions",
    icon: Code,
  },
  {
    title: 'AI Config',
    url: '/ai-config',
    icon: Settings,
  }
]

// Dynamic content items based on state
const contentItems = [
  {
    title: "Content Strategy",
    url: "/content",
    icon: BookCopy,
    requiredState: null // Always shown
  },
  {
    title: "Content Clusters",
    url: "/content/clusters",
    icon: Network,
    requiredState: "hasStrategy"
  },
  {
    title: "Articles",
    url: "/content/articles",
    icon: FileText,
    requiredState: "hasClusters"
  }
]

export function DocsNav({ projectId }: { projectId?: string }) {
  const params = useParams()
  const [contentState, setContentState] = useState({
    hasStrategy: false,
    hasClusters: false
  })

  useEffect(() => {
    const checkContentState = async () => {

      if (!projectId) {
        return}

      try {
        const [strategyRes, clustersRes] = await Promise.all([
          makeExtensionRequest(`/api/extension/ai-projects/${projectId}/content/strategy`),
          makeExtensionRequest(`/api/extension/ai-projects/${projectId}/content/clusters`)
        ])

        const strategy = await strategyRes.json()
        const clusters = await clustersRes.json()

        setContentState({
          hasStrategy: !!strategy,
          hasClusters: clusters?.length > 0
        })
      } catch (error) {
        console.error('Failed to check content state:', error)
      }
    }

    checkContentState()
  }, [params.projectId])



  return (
    <Sidebar variant="inset" collapsible="none">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Documentation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {baseItems.filter(item => item.title !== "Content").map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              
       {contentState.hasStrategy?     <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      <BookCopy className="h-4 w-4" />
                      <span>Content Strategy</span>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                    {contentState.hasStrategy && (
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild>
                            <a href="/content">
                              <Globe className="h-4 w-4" />
                              <span>Strategy</span>
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      )}
                      {contentState.hasStrategy && (
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild>
                            <a href="/content/clusters">
                              <Network className="h-4 w-4" />
                              <span>Clusters</span>
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      )}
                      {contentState.hasClusters && (
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild>
                            <a href="/content/articles">
                              <FileText className="h-4 w-4" />
                              <span>Articles</span>
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      )}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              :
              <SidebarMenuItem key='content'>
              <SidebarMenuButton asChild>
                <a href="/content">
                  <Globe className="h-4 w-4" />
                  <span>Content Strategy</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>    
}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}