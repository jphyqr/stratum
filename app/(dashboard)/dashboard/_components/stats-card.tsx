// app/(dashboard)/_components/stats-cards.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardStats } from "../types"

interface StatsCardsProps {
  data: DashboardStats
}

export function StatsCards({ data }: StatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.totalProjects}</div>
        </CardContent>
      </Card>
      {/* Other stat cards */}
    </div>
  )
}
