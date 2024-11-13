// app/(dashboard)/page.tsx
import { Suspense } from "react"
import { Metadata } from "next"
import { getServerSession } from "next-auth"
import { notFound } from "next/navigation"
import { APIError } from "@/lib/errors"
import { ActivityFeed } from "./_components/activity-feed"
import { DashboardStats, Activity } from "./types"
import { StatsCards } from "./_components/stats-card"
import { headers } from 'next/headers'

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your personalized dashboard overview",
}

async function getStats(): Promise<DashboardStats> {
    const headersList =  await headers()
  
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/dashboard/stats`, {
      headers: {
        'Cookie': headersList.get('cookie') ?? '',
      },
      next: { 
        revalidate: 60,
        tags: ["dashboard-stats"]
      }
    })
  
    if (!response.ok) {
      throw new APIError(
        "Failed to fetch dashboard stats",
        response.status
      )
    }
  
    return response.json()
  }

  async function getActivity(): Promise<Activity[]> {
    const headersList =  await headers()
  
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/dashboard/activity`, {
      headers: {
        'Cookie': headersList.get('cookie') ?? '',
      },
      next: { 
        revalidate: 30,
        tags: ["dashboard-activity"]
      }
    })
  
    if (!response.ok) {
      throw new APIError(
        "Failed to fetch activity",
        response.status
      )
    }
  
    return response.json()
  }
function StatsCardsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="rounded-lg border p-6">
          <div className="space-y-3">
            <div className="h-5 w-1/2 animate-pulse rounded bg-gray-200" />
            <div className="h-8 w-1/3 animate-pulse rounded bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  )
}

function ActivityFeedSkeleton() {
  return (
    <div className="space-y-8">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
          <div className="space-y-2">
            <div className="h-4 w-48 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default async function DashboardPage() {
  const session = await getServerSession()
  if (!session) notFound()

  return (
    <div className="space-y-8 p-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Welcome back, {session.user.name}
        </h2>
        <p className="text-muted-foreground">
          Here is an overview of your dashboard
        </p>
      </div>

      <Suspense fallback={<StatsCardsSkeleton />}>
        <StatsSection />
      </Suspense>

      <Suspense fallback={<ActivityFeedSkeleton />}>
        <ActivitySection />
      </Suspense>
    </div>
  )
}

// Separate components for streaming
async function StatsSection() {
  const stats = await getStats()
  return <StatsCards data={stats} />
}

async function ActivitySection() {
  const activity = await getActivity()
  return <ActivityFeed items={activity} />
}