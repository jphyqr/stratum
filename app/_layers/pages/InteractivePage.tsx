// app/_layers/pages/InteractivePage.tsx
import { Suspense, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader2 } from "lucide-react"
import { notFound, useRouter } from "next/navigation"
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { APIError, ValidationError } from "@/lib/errors"

// 1. Strong typing for data
interface UserProfile {
  id: string
  name: string
  email: string
  preferences: {
    notifications: boolean
    theme: "light" | "dark"
  }
}

// 2. Form schema with validation
const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  notifications: z.boolean(),
})

type ProfileFormValues = z.infer<typeof profileSchema>

// 3. Loading states component
function LoadingCard() {
  return (
    <Card>
      <CardHeader>
        <div className="h-7 w-40 animate-pulse rounded bg-gray-200" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
          <div className="h-9 w-full animate-pulse rounded bg-gray-200" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
          <div className="h-9 w-full animate-pulse rounded bg-gray-200" />
        </div>
      </CardContent>
    </Card>
  )
}

// 4. Main interactive component
function ProfileForm({ 
  initialData 
}: { 
  initialData: UserProfile 
}) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: initialData.name,
      email: initialData.email,
      notifications: initialData.preferences.notifications,
    },
  })

  // 5. Optimistic updates with error handling
  const onSubmit = async (data: ProfileFormValues) => {
    try {
      setIsSaving(true)
      setSaveError(null)

      // Optimistic update
      router.refresh()

      await saveProfile(data)

    } catch (error) {
      if (error instanceof ValidationError) {
        // Handle validation errors
        Object.entries(error.fields || {}).forEach(([field, messages]) => {
          form.setError(field as keyof ProfileFormValues, {
            message: messages[0]
          })
        })
      } else if (error instanceof APIError) {
        setSaveError(error.message)
      } else {
        setSaveError("An unexpected error occurred")
      }
      // Revert optimistic update
      router.refresh()
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notifications"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="!mt-0">
                    Enable notifications
                  </FormLabel>
                </FormItem>
              )}
            />

            {saveError && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-500">
                {saveError}
              </div>
            )}

            <Button 
              type="submit" 
              disabled={isSaving || !form.formState.isDirty}
            >
              {isSaving && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

// 6. Main page component with data fetching
interface PageProps {
  params: { id: string }
}

export default async function SettingsPage({ params }: PageProps) {
  const data = await getProfile(params.id)

  return (
    <div className="space-y-6 p-6">
      <Suspense fallback={<LoadingCard />}>
        <ProfileForm initialData={data} />
      </Suspense>
    </div>
  )
}

// 7. Data fetching with error handling
async function getProfile(id: string): Promise<UserProfile> {
  const res = await fetch(`/api/users/${id}/profile`)
  
  if (!res.ok) {
    if (res.status === 404) {
      notFound()
    }
    throw new APIError(
      "Failed to load profile",
      res.status
    )
  }

  return res.json()
}

// 8. Save profile with proper error handling
async function saveProfile(data: ProfileFormValues): Promise<void> {
  const res = await fetch('/api/profile', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const error = await res.json()
    
    if (res.status === 400) {
      throw new ValidationError(
        "Invalid form data",
        error.fields
      )
    }
    
    throw new APIError(
      error.message || "Failed to save profile",
      res.status
    )
  }
}