// app/types/next-auth.d.ts
import { DefaultSession, DefaultUser } from "next-auth"

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string
      role: 'USER' | 'ADMIN' | 'SUPER_ADMIN'
      profileStatus: 'PENDING' | 'ACTIVE' | 'SUSPENDED'
      isAdmin: boolean
      isSuperAdmin: boolean
      slug?: string | null
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    role: 'USER' | 'ADMIN' | 'SUPER_ADMIN'
    profileStatus: 'PENDING' | 'ACTIVE' | 'SUSPENDED'
    isAdmin: boolean
    isSuperAdmin: boolean
    slug?: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: 'USER' | 'ADMIN' | 'SUPER_ADMIN'
    profileStatus: 'PENDING' | 'ACTIVE' | 'SUSPENDED'
    isAdmin: boolean
    isSuperAdmin: boolean
    slug?: string | null
  }
}
