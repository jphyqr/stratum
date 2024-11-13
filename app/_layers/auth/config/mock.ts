// app/_layers/auth/config/mock.ts
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { mockUsers } from "../mock/data"

export const mockAuthConfig: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "mock-auth",
      name: "Mock Auth",
      credentials: {
        userId: { label: "User ID", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.userId) {
          return mockUsers[0] // Default to first user (admin)
        }
        return mockUsers.find(user => user.id === credentials.userId) || null
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    jwt: async ({ token, user, trigger, session }) => {
      if (user) {
        token.id = user.id
        token.name = user.name
        token.email = user.email
        token.picture = user.image
        token.role = user.role
        token.profileStatus = user.profileStatus
        token.isAdmin = user.isAdmin
        token.isSuperAdmin = user.isSuperAdmin
        token.slug = user.slug
      }

      if (trigger === "update" && session?.userId) {
        const newUser = mockUsers.find(u => u.id === session.userId)
        if (newUser) {
            token.id = newUser.id
            token.name = newUser.name
            token.email = newUser.email
            token.picture = newUser.image
            token.role = newUser.role
            token.profileStatus = newUser.profileStatus
            token.isAdmin = newUser.isAdmin
            token.isSuperAdmin = newUser.isSuperAdmin
            token.slug = newUser.slug
        }
      }

      return token
    },
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.id,
        name: token.name,
        email: token.email,
        image: token.picture,
        role: token.role,
        profileStatus: token.profileStatus,
        isAdmin: token.isAdmin,
        isSuperAdmin: token.isSuperAdmin,
        slug: token.slug,
      },
    }),
  },
}
