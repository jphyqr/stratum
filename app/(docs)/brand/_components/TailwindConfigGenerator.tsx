import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"
import { UseFormReturn } from "react-hook-form"
import { useState } from "react"
import { Check, Clipboard, Download, EyeIcon } from "lucide-react"
import { hexToHSL } from "@/lib/utils"

interface ConfigGeneratorProps {
  form: UseFormReturn<any>
}

export function TailwindConfigGenerator({ form }: ConfigGeneratorProps) {
  const [showPreview, setShowPreview] = useState(false)
  const [copied, setCopied] = useState(false)

  function generateConfig() {
    const values = form.getValues();
    
    // Safely get color values with defaults
    const colors = {
      primary: hexToHSL(values.primaryColor?.hex),
      secondary: hexToHSL(values.secondaryColor?.hex),
      accent: hexToHSL(values.accentColor?.hex),
      muted: hexToHSL(values.mutedColor?.hex),
      ai: hexToHSL(values.aiColor?.hex),
      surface: {
        background: hexToHSL(values.surface?.background),
        foreground: hexToHSL(values.surface?.foreground),
        card: hexToHSL(values.surface?.card),
        cardForeground: hexToHSL(values.surface?.cardForeground)
      }
    };
  
    const hasColors = values.primaryColor?.hex || values.secondaryColor?.hex;
  
    return `{
    theme: {
      extend: {
        colors: {
          ${hasColors ? `
          primary: {
            DEFAULT: 'hsl(${colors.primary})',
            foreground: 'hsl(var(--primary-foreground))'
          },
          secondary: {
            DEFAULT: 'hsl(${colors.secondary})',
            foreground: 'hsl(var(--secondary-foreground))'
          },` : ''}
          ${values.accentColor?.hex ? `
          accent: {
            DEFAULT: 'hsl(${colors.accent})',
            foreground: 'hsl(var(--accent-foreground))'
          },` : ''}
          ${values.mutedColor?.hex ? `
          muted: {
            DEFAULT: 'hsl(${colors.muted})',
            foreground: 'hsl(var(--muted-foreground))'
          },` : ''}
          ${values.aiColor?.hex ? `
          ai: {
            DEFAULT: 'hsl(${colors.ai})',
            foreground: 'hsl(var(--ai-foreground))'
          },` : ''}
          ${values.surface?.background ? `
          surface: {
            DEFAULT: 'hsl(${colors.surface.background})',
            foreground: 'hsl(${colors.surface.foreground})',
            card: 'hsl(${colors.surface.card})',
            cardForeground: 'hsl(${colors.surface.cardForeground})'
          }` : ''}
        }
      }
    }
  }`
  }
  function downloadConfig() {
    const config = generateConfig()
    const blob = new Blob([config], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'tailwind.config.ts'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  async function copyToClipboard() {
    const config = generateConfig()
    await navigator.clipboard.writeText(config)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          onClick={() => setShowPreview(true)}
        >
          <EyeIcon className="mr-2 h-4 w-4" />
          Preview Config
        </Button>
        <Button 
          variant="outline"
          onClick={copyToClipboard}
        >
          {copied ? (
            <Check className="mr-2 h-4 w-4" />
          ) : (
            <Clipboard className="mr-2 h-4 w-4" />
          )}
          {copied ? 'Copied!' : 'Copy Config'}
        </Button>
        <Button 
          variant="default"
          onClick={downloadConfig}
        >
          <Download className="mr-2 h-4 w-4" />
          Download Config
        </Button>
      </div>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Tailwind Configuration Preview</DialogTitle>
            <DialogDescription>
              Your custom Tailwind configuration with selected colors and fonts
            </DialogDescription>
          </DialogHeader>
          <Card className="p-4 bg-muted/50">
            <pre className="text-xs overflow-auto">
              <code>{generateConfig()}</code>
            </pre>
          </Card>
        </DialogContent>
      </Dialog>
    </div>
  )
}