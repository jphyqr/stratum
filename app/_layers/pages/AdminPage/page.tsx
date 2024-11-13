
  // app/_layers/pages/AdminPage/page.tsx
  import { Suspense } from "react"
  import { Metadata } from "next"
  import { APIError } from "@/lib/errors"

  import type { User, PageInfo, SearchParams } from "./types"
import { AdminPageHeader } from "./_components/AdminPageHeader"
import { AdminPageTable } from "./_components/AdminPageTable"
  
  export const metadata: Metadata = {
    title: "Admin Dashboard | User Management",
    description: "Manage users and permissions",
  }
  
  async function getUsers(searchParams: SearchParams): Promise<{
    users: User[]
    pageInfo: PageInfo
  }> {
    const queryString = new URLSearchParams(
      searchParams as Record<string, string>
    ).toString()
    
    const res = await fetch(`/api/users?${queryString}`, {
      next: { tags: ["users"] }
    })
  
    if (!res.ok) {
      throw new APIError(
        "Failed to fetch users",
        res.status
      )
    }
  
    return res.json()
  }
  
  export default async function AdminPage({
    searchParams,
  }: {
    searchParams: SearchParams
  }) {
    const { users, pageInfo } = await getUsers(searchParams)
  
    return (
      <div className="space-y-6 p-6">
        <AdminPageHeader totalUsers={pageInfo.totalItems} />
        
        <Suspense fallback={<div>Loading...</div>}>
          <AdminPageTable 
            users={users} 
            pageInfo={pageInfo}
            searchParams={searchParams}
          />
        </Suspense>
      </div>
    )
  }
  
  export function Error({
    error,
    reset,
  }: {
    error: Error & { digest?: string }
    reset: () => void
  }) {
    return (
      <div className="p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <h2 className="text-lg font-semibold text-red-800">
            Error Loading Users
          </h2>
          <p className="mt-2 text-red-600">
            {error instanceof APIError ? error.message : "An unexpected error occurred"}
          </p>
          <button
            onClick={reset}
            className="mt-4 rounded bg-red-100 px-4 py-2 text-red-700"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }