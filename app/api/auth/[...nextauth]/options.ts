// app/api/auth/[...nextauth]/options.ts
import { NextAuthOptions } from "next-auth"
import { mockAuthConfig } from "@/app/_layers/auth/config/mock"
// import { productionAuthConfig } from "@/app/_layers/auth/config/production"

export const authOptions: NextAuthOptions = 
  process.env.NEXT_PUBLIC_ENABLE_MOCK_AUTH === "true"
    ? mockAuthConfig
    : mockAuthConfig // Change to productionAuthConfig when implementing real auth
