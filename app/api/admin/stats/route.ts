// app/api/admin/stats/route.ts
// app/api/dashboard/stats/route.ts
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/options"

export async function GET() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return NextResponse.json({
    totalUsers: 156,
    activeUsers: 89,
    totalRevenue: 15600,
    averageEngagement: 76,
  })
}

