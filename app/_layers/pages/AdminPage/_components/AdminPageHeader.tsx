// app/_layers/pages/AdminPage/_components/AdminPageHeader.tsx
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

interface AdminPageHeaderProps {
  totalUsers: number
}

export function AdminPageHeader({ totalUsers }: AdminPageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">Users</h2>
        <p className="text-muted-foreground">
          Manage {totalUsers} users and their permissions
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>
    </div>
  )
}