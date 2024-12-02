'use client'
import { useState } from 'react'
import { Wand2, Sparkles, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface AIActionButtonProps {
  actionText: string
  provider: 'anthropic' | 'openai'
  model: string
  onClick: () => Promise<void>
  className?: string
  disabled?: boolean
}

export function AIActionButton({
  actionText,
  provider,
  model,
  onClick,
  className,
  disabled = false
}: AIActionButtonProps) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleClick = async () => {
    try {
      setLoading(true)
      await onClick()
      setSuccess(true)
      setTimeout(() => setSuccess(false), 2000) // Reset success state after animation
    } catch (error) {
      // Let error bubble up to parent
      throw error
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      size="lg"
      onClick={handleClick}
      disabled={disabled || loading}
      className={cn(
        'relative min-w-[200px] bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700',
        'group overflow-hidden transition-all duration-300',
        loading && 'cursor-wait',
        success && 'bg-gradient-to-r from-emerald-500 to-emerald-600',
        className
      )}
    >
      <div className="relative flex items-center justify-center gap-2">
        {/* Icon */}
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : success ? (
          <Sparkles className="h-4 w-4 animate-bounce" />
        ) : (
          <Wand2 className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
        )}

        {/* Text Content */}
        <div className="flex flex-col items-start">
          <span className="text-sm font-medium">{actionText}</span>
          <span className="text-xs opacity-90">
            {provider === 'anthropic' ? 'Claude' : 'OpenAI'} • {model.split('-').slice(-2).join(' ')}
          </span>
        </div>

        {/* Loading Progress Bar */}
        {loading && (
          <div className="absolute bottom-0 left-0 h-0.5 w-full bg-violet-200/20">
            <div className="h-full animate-progress-indeterminate bg-violet-200" />
          </div>
        )}

        {/* Success Animation */}
        {success && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-success-scale-up rounded-full bg-white/10 p-8" />
          </div>
        )}
      </div>
    </Button>
  )
}