// app/(admin)/_components/admin-overview.tsx
import { AdminStats } from "../types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface AdminOverviewProps {
  stats: AdminStats
}

export function AdminOverview({ stats }: AdminOverviewProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalUsers}</div>
        </CardContent>
      </Card>
      {/* Other admin stats */}
    </div>
  )
}