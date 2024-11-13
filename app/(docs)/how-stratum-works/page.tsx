// app/(docs)/how-stratum-works/page.tsx
'use client'
// import { Metadata } from "next"
import { AuthorCard } from "@/components/shared/author-card"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info } from "lucide-react"
import { StratumSetup } from "../_components/setup-guide"

// export const metadata: Metadata = {
//   title: "How Stratum Works | Building Better Next.js Apps",
//   description: "A deep dive into Stratum's layer system and how it helps developers build better Next.js applications with AI assistance.",
//   openGraph: {
//     type: "article",
//     title: "How Stratum Works | Building Better Next.js Apps",
//     description: "A deep dive into Stratum's layer system and how it helps developers build better Next.js applications with AI assistance.",
//     authors: ["John Hashem"],
//     publishedTime: "2024-12-11T00:00:00.000Z",
//   },
//   twitter: {
//     card: "summary_large_image",
//     title: "How Stratum Works",
//     description: "A deep dive into Stratum's layer system",
//     creator: "@johnhashem",
//   },
// }

const author = {
  name: "John Hashem",
  role: "Full Stack Developer",
  bio: "Building modern web applications with Next.js and AI. Creator of Stratum and core contributor to TNDevs.",
  avatar: "/john-hashem.jpg", // We'll need your avatar
  twitter: "https://twitter.com/johnhashem",
  github: "https://github.com/jphyqr",
  linkedin: "https://linkedin.com/in/johnhashem",
  company: {
    name: "TNDevs",
    url: "https://tndevs.com"
  }
}

export default function StratumGuide() {
    return (
      <article className="mx-auto max-w-4xl space-y-12 py-8">
        {/* Header Section */}
        <header className="space-y-4">
          <h1 className="text-4xl font-bold">How Stratum Works</h1>
          <p className="text-xl text-muted-foreground">
            Understanding how Stratum uses your documentation to power AI-assisted development
          </p>
        </header>
  
        <AuthorCard {...author} />
  
        <section id="stratum-setup" className="space-y-6">
        <h2 className="text-3xl font-semibold">Setting Up Stratum</h2>
        <StratumSetup />
      </section>


        {/* Developer Documentation Section */}
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold">How Stratum Uses This Page</h2>
          <p className="text-lg text-muted-foreground">
            This page serves two purposes: it provides documentation for developers using Stratum,
            and it contains structured content that Stratum uses to understand your application.
          </p>
          
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Live Instructions</AlertTitle>
            <AlertDescription>
              The content in the Application Context section below is used by Stratum to understand
              your application. You can modify this content to provide custom instructions and context
              for AI-assisted development.
            </AlertDescription>
          </Alert>
  
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">How It Works</h3>
            <ul className="list-disc space-y-2 pl-6">
              <li>Stratum extracts content from sections marked with specific IDs</li>
              <li>This content is used to provide context when generating code</li>
              <li>You can add additional documentation pages that Stratum will read</li>
              <li>The more context you provide, the better the AI assistance</li>
            </ul>
          </div>
        </section>
  
        <Separator />
  
        {/* Stratum Instructions Section */}
        <section id="stratum-instructions" className="space-y-6">
          <h2 className="text-3xl font-semibold">Application Context</h2>
          <div className="prose prose-gray max-w-none">
            <p>
              This application is built using Next.js 14 with the App Router. It follows
              a layer-based architecture pattern where functionality is organized into
              distinct, composable layers.
            </p>
  
            <h3>Core Principles</h3>
            <ul>
              <li>Each route group represents a distinct section of the application</li>
              <li>Components are co-located with their routes when specific to that route</li>
              <li>Shared components live in the root components directory</li>
              <li>Authentication is handled via Next-Auth with role-based access</li>
            </ul>
  
            <h3>Key Features</h3>
            <ul>
              <li>Role-based authorization (User, Admin, SuperAdmin)</li>
              <li>Server-side rendering with streaming</li>
              <li>Optimistic updates for better UX</li>
              <li>Content management system integration ready</li>
            </ul>
  
            <h3>Architectural Decisions</h3>
            <ul>
              <li>Uses server components by default</li>
              <li>Client components are marked explicitly with use client</li>
              <li>Data fetching happens at the page level</li>
              <li>Components are structured for maximum reusability</li>
            </ul>
          </div>
        </section>
  
        <Separator />
  
        {/* Implementation Guide Section */}
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold">Customizing Instructions</h2>
          <p>
            To customize how Stratum understands your application:
          </p>
          <ol className="list-decimal space-y-2 pl-6">
            <li>Modify the content in the Application Context section above</li>
            <li>Add additional documentation pages with the stratum-instructions ID</li>
            <li>Use the provided components to maintain consistent structure</li>
            <li>Keep instructions clear and specific to your applications needs</li>
          </ol>
        </section>
      </article>
    )
  }