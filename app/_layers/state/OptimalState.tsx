// app/_layers/state/OptimalState.tsx
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// 1. Define types for your state
interface User {
  name: string
  preferences: {
    theme: "light" | "dark"
    notifications: boolean
  }
}

interface FormData {
  firstName: string
  lastName: string
  email: string
}

export function OptimalState() {
  // 2. Type your state with interfaces
  const [user, setUser] = useState<User>({
    name: "John",
    preferences: { theme: "light", notifications: true }
  })

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: ""
  })

  // 3. Type your event handlers
  const updateTheme = () => {
    setUser(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        theme: prev.preferences.theme === "light" ? "dark" : "light"
      }
    }))
  }

  // 4. Generic type for form updates
  const updateFormData = <K extends keyof FormData>(
    field: K,
    value: FormData[K]
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // 5. Async state with TypeScript
  interface ApiResponse {
    status: string
    data: string[]
  }

  const [items, setItems] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchItems = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch("/api/items")
      const data: ApiResponse = await response.json()
      setItems(data.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  // 6. Effect with proper typing and cleanup
  useEffect(() => {
    const timer = setInterval(() => {
      setItems(prev => [...prev, `Item ${prev.length + 1}`])
    }, 2000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="space-y-6 p-4">
      {/* User Preferences Example */}
      <div className="rounded-lg border p-4">
        <h3 className="text-lg font-medium">User Preferences</h3>
        <div className="mt-2">
          <p>Current theme: {user.preferences.theme}</p>
          <Button onClick={updateTheme} className="mt-2">
            Toggle Theme
          </Button>
        </div>
      </div>

      {/* Form Data Example */}
      <div className="rounded-lg border p-4">
        <h3 className="text-lg font-medium">Form Data</h3>
        <div className="mt-2 space-y-4">
          <Input
            value={formData.firstName}
            onChange={(e) => updateFormData("firstName", e.target.value)}
            placeholder="First Name"
          />
          <Input
            value={formData.lastName}
            onChange={(e) => updateFormData("lastName", e.target.value)}
            placeholder="Last Name"
          />
          <Input
            value={formData.email}
            onChange={(e) => updateFormData("email", e.target.value)}
            placeholder="Email"
          />
        </div>
        <div className="mt-2">
          <pre className="rounded bg-gray-100 p-2">
            {JSON.stringify(formData, null, 2)}
          </pre>
        </div>
      </div>

      {/* Async State Example */}
      <div className="rounded-lg border p-4">
        <h3 className="text-lg font-medium">Async State</h3>
        <div className="mt-2">
          <Button 
            onClick={fetchItems}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Fetch Items"}
          </Button>
          {error && (
            <p className="mt-2 text-red-500">{error}</p>
          )}
          <ul className="mt-2 space-y-1">
            {items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}