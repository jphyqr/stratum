// middleware.ts
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {

    console.log("Middleware", {
      token: req.nextauth?.token,
      cookies: req.cookies,
      sessionCookie: req.cookies.get('stratum-7d9cae-session')
    })
    const token = req.nextauth.token
    const path = req.nextUrl.pathname


    console.log("Token", token)
    console.log("Path", path)
    // Admin routes require admin/superadmin
    if (path.startsWith("/admin")) {
      if (!token?.isAdmin && !token?.isSuperAdmin) {
        return NextResponse.redirect(new URL("/auth/login", req.url))
      }

      // Some routes might be superadmin only
      if (path.startsWith("/admin/settings") && !token?.isSuperAdmin) {
        return NextResponse.redirect(new URL("/admin", req.url))
      }
    }

    // Dashboard requires authentication
    if (path === "/dashboard" || path.startsWith("/dashboard/")) {
      console.log("Dashboard", token)
      if (!token) {
        return NextResponse.redirect(new URL("/login", req.url))
      }

      // Additional checks for specific dashboard sections
      if (path.startsWith("/dashboard/billing") && token.profileStatus !== "ACTIVE") {
        return NextResponse.redirect(new URL("/dashboard", req.url))
      }
    }

    // Docs might have some protected sections
    if (path.startsWith("/docs/private") && !token) {
      return NextResponse.redirect(new URL("/login", req.url))
    }

    // Prevent authenticated users from accessing auth pages
    if (path.startsWith("/auth/") && token) {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        console.log("Authorized", token)
        // Allow public routes
        if (
          req.nextUrl.pathname.startsWith("/_next") ||
          req.nextUrl.pathname.startsWith("/api/auth") ||
          req.nextUrl.pathname === "/" ||
          req.nextUrl.pathname.startsWith("/blog") ||
          req.nextUrl.pathname.startsWith("/docs")
        ) {
          return true
        }

        // Require token for protected routes
        return !!token
      },
    },

    cookies: {
      sessionToken: {
        name: `stratum-7d9cae-session`
      }
    }
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
}