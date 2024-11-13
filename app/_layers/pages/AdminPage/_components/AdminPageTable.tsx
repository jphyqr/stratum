// app/_layers/pages/AdminPage/_components/AdminPageTable.tsx
import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  MoreHorizontal, 
  ChevronLeft, 
  ChevronRight,
  Loader2,

} from "lucide-react"

import type { User, PageInfo, SearchParams } from "../types"
import { APIError } from "@/lib/errors"

interface AdminPageTableProps {
  users: User[]
  pageInfo: PageInfo
  searchParams: SearchParams
}

// Define specific loading states
type LoadingState = {
    type: 'status' | 'delete' | 'role'
    userId: string
  } | null

export function AdminPageTable({ users, pageInfo, searchParams }: AdminPageTableProps) {
  const router = useRouter()
  const [loading, setLoading] = useState<LoadingState>(null)
  const [error, setError] = useState<string | null>(null)



  const handleStatusUpdate = async (userId: string, newStatus: User['status']) => {
    setError(null)
    setLoading({ type: 'status', userId })

    try {
      const response = await fetch(`/api/users/${userId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (!response.ok) {
        throw new APIError(
          'Failed to update status',
          response.status
        )
      }

      router.refresh()
    } catch (err) {
      if (err instanceof APIError) {
        setError(err.message)
      } else if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('An unexpected error occurred')
      }
      // Optionally revert optimistic update here
    } finally {
      setLoading(null)
    }
  }
  // Update search params and refresh route
  const updateSearch = (updates: Partial<SearchParams>) => {
    const params = new URLSearchParams(searchParams as Record<string, string>)
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })

    router.push(`?${params.toString()}`)
  }

  return (
    <div className="space-y-4">
              {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-500">
          {error}
        </div>
      )}
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search users..."
          value={searchParams.search || ""}
          onChange={(e) => updateSearch({ search: e.target.value })}
          className="max-w-xs"
        />
        <select
          value={searchParams.status || ""}
          onChange={(e) => updateSearch({ status: e.target.value })}
          className="rounded-md border p-2"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[70px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="h-8 w-8 p-0"
                    disabled={loading?.userId === user.id}
                  >
                    {loading?.userId === user.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <MoreHorizontal className="h-4 w-4" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => handleStatusUpdate(
                      user.id,
                      user.status === 'active' ? 'suspended' : 'active'
                    )}
                    disabled={loading?.userId === user.id}
                  >
                    {user.status === 'active' ? 'Suspend' : 'Activate'}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-red-600"
                    disabled={loading?.userId === user.id}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
                <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing {pageInfo.itemsPerPage} of {pageInfo.totalItems} users
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateSearch({ 
              page: String(pageInfo.currentPage - 1) 
            })}
            disabled={pageInfo.currentPage <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateSearch({ 
              page: String(pageInfo.currentPage + 1) 
            })}
            disabled={pageInfo.currentPage >= pageInfo.totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

