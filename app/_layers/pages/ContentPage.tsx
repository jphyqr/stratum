// app/_layers/pages/ContentPage.tsx
import { Suspense } from "react"
import { Metadata, ResolvingMetadata } from "next"
import { notFound } from "next/navigation"
import Image from "next/image"
import { 
  NotFoundError, 
  APIError, 
  isNotFoundError, 
  toCustomError, 
  CustomError
} from "@/lib/errors"

interface BlogPost {
  slug: string
  title: string
  description: string
  content: string
  author: {
    name: string
    avatar: string
  }
  publishedAt: string
  tags: string[]
  ogImage?: string
}

interface GenerateMetadataProps {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
  { params }: GenerateMetadataProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  try {
    const post = await getPost(params.slug)
    const previousImages = (await parent).openGraph?.images || []

    return {
      title: post.title,
      description: post.description,
      authors: [{ name: post.author.name }],
      openGraph: {
        title: post.title,
        description: post.description,
        type: "article",
        publishedTime: post.publishedAt,
        authors: [post.author.name],
        images: post.ogImage 
          ? [post.ogImage, ...previousImages]
          : previousImages,
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description: post.description,
        images: post.ogImage ? [post.ogImage] : [],
      },
    }
  } catch (error) {
    const customError = toCustomError(error)
    
    if (isNotFoundError(customError)) {
      return {
        title: "Post Not Found",
        description: "The requested blog post could not be found.",
      }
    }
    
    return {
      title: "Error",
      description: "There was an error loading this post.",
    }
  }
}

async function getPost(slug: string): Promise<BlogPost> {
  try {
    const res = await fetch(`${process.env.API_URL}/posts/${slug}`, {
      next: { 
        revalidate: 3600,
        tags: [`post-${slug}`],
      },
    })

    if (!res.ok) {
      if (res.status === 404) {
        throw new NotFoundError(`Post with slug ${slug} not found`)
      }
      throw new APIError(
        "Failed to fetch post",
        res.status,
        res.headers.get("x-error-code") || undefined
      )
    }

    const post: BlogPost = await res.json()
    return post
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof APIError) {
      throw error
    }
    throw new APIError("Unknown error occurred", 500)
  }
}

interface PostContentProps {
  post: BlogPost
  onError?: (error: CustomError) => void
}

function PostContent({ post, onError }: PostContentProps) {

  onError?.(new APIError("An error occurred"))
  return (
    <article className="prose prose-gray mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold">{post.title}</h1>
        <div className="mt-4 flex items-center justify-center gap-2">
          <Image
            src={post.author.avatar}
            alt={post.author.name}
            width={40}
            height={40}
            className="rounded-full"
          />
          <span>{post.author.name}</span>
          <span>•</span>
          <time dateTime={post.publishedAt}>
            {new Date(post.publishedAt).toLocaleDateString()}
          </time>
        </div>
      </div>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  )
}

function PostSkeleton() {
  return (
    <div className="mx-auto max-w-2xl animate-pulse">
      <div className="space-y-4">
        <div className="h-8 w-3/4 rounded bg-gray-200" />
        <div className="h-4 w-1/2 rounded bg-gray-200" />
        <div className="h-64 w-full rounded bg-gray-200" />
      </div>
    </div>
  )
}

export default async function BlogPostPage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  let post: BlogPost

  try {
    post = await getPost(params.slug)
  } catch (error) {
    if (isNotFoundError(error)) notFound()
    throw error // Will be caught by error.tsx
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <Suspense fallback={<PostSkeleton />}>
        <PostContent post={post} />
      </Suspense>
    </main>
  )
}

export function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const customError = toCustomError(error)
  
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4">
      <h2 className="text-lg font-semibold text-red-800">
        {customError.message}
      </h2>
      <p className="mt-2 text-red-600">
        {customError.status === 503 
          ? "The service is temporarily unavailable"
          : "Please try refreshing the page"}
      </p>
      <button
        onClick={reset}
        className="mt-4 rounded bg-red-100 px-4 py-2 text-red-700"
      >
        Try again
      </button>
    </div>
  )
}