// app/(admin)/admin/page.tsx
import { Suspense } from "react"
import { Metadata } from "next"
import { getServerSession } from "next-auth"
import { notFound, redirect } from "next/navigation"
import { APIError } from "@/lib/errors"
import { AdminOverview } from "./_components/admin-overview"
import type { AdminStats } from "./types"
import { authOptions } from "@/app/api/auth/[...nextauth]/options"
import { headers } from "next/headers"

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "System administration and monitoring",
}

console.log('ADMIN PAGE')
async function getAdminStats(): Promise<AdminStats> {
    const headersList =  await headers()
  
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/admin/stats`, {
        headers: {
            'Cookie': headersList.get('cookie') ?? '',
          },
          next: { 
            revalidate: 30,
            tags: ["admin-activity"]
          }
    })
  
    if (!res.ok) {
      throw new APIError(
        "Failed to fetch admin stats",
        res.status
      )
    }


    return res.json()
  }

function AdminOverviewSkeleton() {
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

export default async function AdminPage() {
  const session = await getServerSession(authOptions)
  console.log('ADMIN PAGE SESSION', session)
  if (!session) {
    redirect('/auth/login')
  }

  if (!session.user.isAdmin) {
    notFound()
  }

  return (
    <div className="space-y-8 p-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Admin Dashboard
        </h2>
        <p className="text-muted-foreground">
          System overview and management
        </p>
      </div>

      <Suspense fallback={<AdminOverviewSkeleton />}>
        <AdminStatsSection />
      </Suspense>
    </div>
  )
}

// Separate component for streaming
async function AdminStatsSection() {
  const stats = await getAdminStats()
  return <AdminOverview stats={stats} />
}