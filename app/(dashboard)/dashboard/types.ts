// app/(dashboard)/types.ts
export interface DashboardStats {
    totalProjects: number
    activeProjects: number
    completedProjects: number
    upcomingDeadlines: number
  }
  
  export interface Activity {
    id: string
    type: 'project' | 'task' | 'comment'
    description: string
    date: string
    user: {
      name: string
      image?: string
    }
  }
  