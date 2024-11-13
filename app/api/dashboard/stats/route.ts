// app/api/dashboard/stats/route.ts
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"

export async function GET() {
  const session = await getServerSession()
  
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return NextResponse.json({
    totalProjects: 12,
    activeProjects: 8,
    completedProjects: 4,
    upcomingDeadlines: 3
  })
}