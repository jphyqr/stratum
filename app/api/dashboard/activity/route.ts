// app/api/dashboard/activity/route.ts
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"

export async function GET() {
  const session = await getServerSession()
  
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  await new Promise((resolve) => setTimeout(resolve, 1000))

  return NextResponse.json([
    {
      id: "1",
      type: "project" as const,
      description: "New project created: Website Redesign",
      date: new Date().toISOString(),
      user: {
        name: "John Doe",
        image: null
      }
    },
    {
      id: "2",
      type: "task" as const,
      description: "Task completed: Homepage Design",
      date: new Date().toISOString(),
      user: {
        name: "Jane Smith",
        image: null
      }
    }
  ])
}