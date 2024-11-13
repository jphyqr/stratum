// app/layout.tsx
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "next-themes"
import { UserSwitcher } from "./_layers/auth/_components/user-switcher"
import { ClientSessionProvider } from "@/components/shared/client-session-provider"
import "./globals.css";
const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
      <ClientSessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
          >
            {children}
            <UserSwitcher />
            <Toaster />
          </ThemeProvider>
        </ClientSessionProvider>
      </body>
    </html>
  )
}