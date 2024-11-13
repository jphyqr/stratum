// app/(admin)/types.ts
export interface AdminStats {
    totalUsers: number
    activeUsers: number
    totalRevenue: number
    averageEngagement: number
  }
  
  export interface AdminActivity {
    id: string
    action: 'created' | 'updated' | 'deleted'
    resource: string
    user: {
      id: string
      name: string
      email: string
    }
    timestamp: string
  }