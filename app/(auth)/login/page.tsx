// app/(auth)/login/page.tsx
import { Metadata } from "next"

import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
}

export default function LoginPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Choose your sign in method
          </p>
        </div>
        <Button 
          className="w-full" 
          onClick={() => signIn("mock-auth")}
        >
          Sign In
        </Button>
      </div>
    </div>
  )
}
