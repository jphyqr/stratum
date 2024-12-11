// app/(stratum)/_components/docs-nav.tsx
"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import {
  Book,
  BookCopy,
  Bookmark,
  BookOpen,
  Code,
  Earth,
  FileText,
  GanttChart,
  Globe,
  Home,
  LayoutDashboard,
  Lightbulb,
  LucideIcon,
  Map,
  Network,
  Settings,
  Wand,
} from "lucide-react"

import { makeExtensionRequest } from "@/lib/api"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
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
import { ContextExtractor } from "../project-stream/_components/ContextExtractor"

type ContentState = {
  hasStrategy: boolean
  hasClusters: boolean
}

type RequiredState = keyof ContentState | null

interface ContentItem {
  title: string
  url: string
  icon: LucideIcon
  requiredState: RequiredState
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
    icon: Earth,
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
    title: "AI Config",
    url: "/ai-config",
    icon: Settings,
  },
]

// Dynamic content items based on state
const contentItems = [
  {
    title: "Content Strategy",
    url: "/content",
    icon: BookCopy,
    requiredState: null, // Always shown
  },
  {
    title: "Content Clusters",
    url: "/content/clusters",
    icon: Network,
    requiredState: "hasStrategy",
  },
  {
    title: "Articles",
    url: "/content/articles",
    icon: FileText,
    requiredState: "hasClusters",
  },
]

export function DocsNav({ projectId }: { projectId?: string }) {
  const params = useParams()
  const [contentState, setContentState] = useState({
    hasStrategy: false,
    hasClusters: false,
  })

  useEffect(() => {
    const checkContentState = async () => {
      if (!projectId) {
        return
      }

      try {
        const [strategyRes, clustersRes] = await Promise.all([
          makeExtensionRequest(
            `/api/extension/ai-projects/${projectId}/content/strategy`
          ),
          makeExtensionRequest(
            `/api/extension/ai-projects/${projectId}/content/clusters`
          ),
        ])

        const strategy = await strategyRes.json()
        const clusters = await clustersRes.json()

        setContentState({
          hasStrategy: !!strategy,
          hasClusters: clusters?.length > 0,
        })
      } catch (error) {
        console.error("Failed to check content state:", error)
      }
    }

    checkContentState()
  }, [params.projectId])

  return (
    <Sidebar variant='sidebar' collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
         
          <SidebarGroupContent>
            <SidebarMenu>






            <Collapsible defaultOpen className="group/myapp">
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton>
                        
                        <span>My App</span>
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                    
                          <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild>
                              <a href="/">
                                <Home className="h-4 w-4" />
                                <span>Home</span>
                              </a>
                            </SidebarMenuSubButton>
                            <SidebarMenuSubButton asChild>
                              <a href="/dashboard">
                                <LayoutDashboard className="h-4 w-4" />
                                <span>Dashboard</span>
                              </a>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                    
                      
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>



                <Collapsible defaultOpen className="group/setup">
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton>
                        
                        <span>Stratum</span>
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                    
                          <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild>
                              <a href="/how-stratum-works">
                                <Home className="h-4 w-4" />
                                <span>Setup Guide</span>
                              </a>
                            </SidebarMenuSubButton>
                            <SidebarMenuSubButton asChild>
                              <a href="/ai-config">
                                <Settings className="h-4 w-4" />
                                <span>AI Config</span>
                              </a>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                    
                      
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>

                <Collapsible defaultOpen className="group/product">
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton>
                        
                        <span>Product</span>
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                    
                          <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild>
                              <a href="/product-management">
                                <Lightbulb className="h-4 w-4" />
                                <span>Product Vision</span>
                              </a>
                            </SidebarMenuSubButton>
                           
                          </SidebarMenuSubItem>

                          <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild>
                              <a href="/brand">
                                <Earth className="h-4 w-4" />
                                <span>Brand Design</span>
                              </a>
                            </SidebarMenuSubButton>
                           
                          </SidebarMenuSubItem>

                          {contentState.hasStrategy?
                          null:
                          <SidebarMenuSubItem>

                      
                          <SidebarMenuSubButton asChild>
                              <a href="/content">
                                <BookCopy className="h-4 w-4" />
                                <span>Content Strategy</span>
                              </a>
                            </SidebarMenuSubButton>
                           
                          </SidebarMenuSubItem>
}
                          <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild>
                              <a href="/roadmap">
                                <GanttChart className="h-4 w-4" />
                                <span>Roadmap</span>
                              </a>
                            </SidebarMenuSubButton>
                           
                          </SidebarMenuSubItem>
                      
                          <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild>
                              <a href="/project-stream">
                                <Wand className="h-4 w-4" />
                                <span>Project Stream</span>
                              </a>
                            </SidebarMenuSubButton>
                           
                          </SidebarMenuSubItem>
                      </SidebarMenuSub>

                      
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>

                {contentState.hasStrategy ? (
                <Collapsible defaultOpen className="group/collapsible">
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
              ) : null}



                <Collapsible defaultOpen className="group/output">
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton>
                        
                        <span>Prompts</span>
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                    
                          <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild>
                              <a href="/instructions">
                                <Code className="h-4 w-4" />
                                <span>Optimized Instructions</span>
                              </a>
                            </SidebarMenuSubButton>
                           
                          </SidebarMenuSubItem>
                          <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild>
                           <ContextExtractor/>
                            </SidebarMenuSubButton>
                           
                          </SidebarMenuSubItem>

                      </SidebarMenuSub>

                      <SidebarMenuSub>
                    



                </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>







            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
