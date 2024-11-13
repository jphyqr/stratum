// app/_layers/auth/mock/data.ts
import { User } from "next-auth"

export const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@example.com",
    name: "Admin User",
    image: null,
    role: "ADMIN",
    profileStatus: "ACTIVE",
    isAdmin: true,
    isSuperAdmin: false,
    slug: "admin-user",
  },
  {
    id: "2",
    email: "user@example.com",
    name: "Regular User",
    image: null,
    role: "USER",
    profileStatus: "ACTIVE",
    isAdmin: false,
    isSuperAdmin: false,
    slug: "regular-user",
  },
  {
    id: "3",
    email: "super@example.com",
    name: "Super Admin",
    image: null,
    role: "SUPER_ADMIN",
    profileStatus: "ACTIVE",
    isAdmin: true,
    isSuperAdmin: true,
    slug: "super-admin",
  },
]
