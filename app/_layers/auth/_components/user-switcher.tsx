// app/_layers/auth/components/user-switcher.tsx
"use client"

import { useSession } from "next-auth/react"
import { mockUsers } from "../mock/data"

export function UserSwitcher() {
  const { data: session, update } = useSession()

  if (process.env.NODE_ENV === "production") return null

  const switchUser = async (userId: string) => {
    await update({ userId })
  }

  return (
    <div className="fixed bottom-4 left-4 p-4 bg-yellow-100 border-yellow-300 border rounded shadow-lg z-50">
      <h3 className="font-bold mb-2">Mock Auth Controls</h3>
      <select
        value={session?.user?.id || ""}
        onChange={(e) => switchUser(e.target.value)}
        className="w-full p-2 border rounded"
      >
        {mockUsers.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name} ({user.role})
          </option>
        ))}
      </select>
      <div className="mt-2 text-sm">
        Current: {session?.user?.name} ({session?.user?.role})
      </div>
    </div>
  )
}
