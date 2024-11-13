// components/shared/image-with-fallback.tsx
import { useState } from "react"
import Image from "next/image"
import { ImageOff } from "lucide-react"
import { CustomError } from "@/lib/errors"
import { cn } from "@/lib/utils"

interface ImageWithFallbackProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  onError?: (error: CustomError) => void
}

export function ImageWithFallback({ 
  src, 
  alt, 
  width, 
  height, 
  className,
  onError 
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false)

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const error = new CustomError(`Failed to load image: ${src}`)
    setError(true)
    onError?.(error)
    // Prevent infinite error retries
    e.currentTarget.onerror = null
  }

  if (error) {
    return (
      <div 
        className={cn(
          "flex items-center justify-center bg-gray-100",
          className
        )}
        style={{ width, height }}
      >
        <ImageOff className="h-1/2 w-1/2 text-gray-400" />
      </div>
    )
  }

  return (
    <Image 
      src={src} 
      alt={alt} 
      width={width}
      height={height}
      className={className}
      onError={handleError}
    />
  )
}