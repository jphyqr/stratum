'use client'
// app/(admin)/_components/admin-nav.tsx
import { 
    Users, 
    Settings, 
    BarChart, 
    FileText,
    Shield 
  } from "lucide-react"
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
import { useSession } from "next-auth/react"
  
  const adminItems = [
    {
      title: "Stratum",
      url: "/how-stratum-works",
      icon: BarChart,
    },
    {
      title: "Overview",
      url: "/admin",
      icon: BarChart,
    },
    {
      title: "Users",
      url: "/admin/users",
      icon: Users,
    },
    {
      title: "Settings",
      url: "/admin/settings",
      icon: Settings,
      superAdminOnly: true,
    },
    {
      title: "Content",
      url: "/admin/content",
      icon: FileText,
    }
  ]
  
  export function AdminNav() {
    const { data: session } = useSession()
    
    const filteredItems = adminItems.filter(item => 
      !item.superAdminOnly || session?.user.isSuperAdmin
    )
  
    return (
      <Sidebar collapsible="icon" className="border-none  mt-14  ">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>
              <Shield className="mr-2 h-4 w-4" />
              Admin
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredItems.map((item) => (
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