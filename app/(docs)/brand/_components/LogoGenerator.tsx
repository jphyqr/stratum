import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Clock4, Download, InfoIcon, Loader2 } from "lucide-react"

import { useState } from "react"
import { Button } from "@/components/ui/button"

import { UseFormReturn } from "react-hook-form"
import { cn } from "@/lib/utils"
import { isReadyForLogoGeneration } from "../types"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
interface LogoVariation {
  name: string
  description: string
  favicon: string
  fullLogo: string
  wordmark: string
}

function LogoPreviewCard({ 
  logo, 
  onDownload 
}: { 
  logo: LogoVariation
  onDownload: (type: 'favicon' | 'fullLogo' | 'wordmark') => void 
}) {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="text-sm">{logo.name}</CardTitle>
        <p className="text-xs text-muted-foreground">{logo.description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="full" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="full">Full Logo</TabsTrigger>
            <TabsTrigger value="favicon">Favicon</TabsTrigger>
            <TabsTrigger value="wordmark">Wordmark</TabsTrigger>
          </TabsList>
          
          {['full', 'favicon', 'wordmark'].map((type) => (
            <TabsContent key={type} value={type} className="mt-4">
              <div className="relative group">
                <div className="aspect-video bg-muted rounded-lg p-8 flex items-center justify-center">
                  <div 
                    className={cn(
                      "w-full h-full flex items-center justify-center",
                      type === 'favicon' && "max-w-[64px]"
                    )}
                    dangerouslySetInnerHTML={{ 
                      __html: logo[type === 'full' ? 'fullLogo' : type === 'favicon' ? 'favicon' : 'wordmark'] 
                    }} 
                  />
                </div>
                <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => onDownload(type as any)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}

export function LogoPreviewSection({ 
  variations,
  onDownload
}: { 
  variations: LogoVariation[]
  onDownload: (variation: LogoVariation, type: 'favicon' | 'fullLogo' | 'wordmark') => void
}) {
  const [selectedStyle, setSelectedStyle] = useState<'light' | 'dark'>('light')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Logo Variations</h3>
        <RadioGroup
          value={selectedStyle}
          onValueChange={(value) => setSelectedStyle(value as 'light' | 'dark')}
          className="flex items-center space-x-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="light" id="light" />
            <Label htmlFor="light">Light</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="dark" id="dark" />
            <Label htmlFor="dark">Dark</Label>
          </div>
        </RadioGroup>
      </div>

      <div className={cn(
        "grid gap-6 md:grid-cols-3",
        selectedStyle === 'dark' && "bg-slate-900 p-6 rounded-lg"
      )}>
        {variations.map((logo, index) => (
          <LogoPreviewCard
            key={index}
            logo={logo}
            onDownload={(type) => onDownload(logo, type)}
          />
        ))}
      </div>
    </div>
  )
}



interface LogoVariation {
  name: string
  description: string
  favicon: string
  fullLogo: string
  wordmark: string
}

export function LogoGenerator({ form, projectId }: { form: UseFormReturn<any>, projectId: string }) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [logoVariations, setLogoVariations] = useState<LogoVariation[]>([])
  const [error, setError] = useState<string | null>(null)

  // Check if ready for logo generation
  const brandData = form.getValues()
  const { ready, missingFields } = isReadyForLogoGeneration(brandData)
  function downloadSVG(svg: string, filename: string) {
    const blob = new Blob([svg], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
  async function generateLogos() {
    setIsGenerating(true)
    setError(null)
    
    try {
      const res = await fetch(
        `http://localhost:3009/api/extension/ai-projects/${projectId}/brand/generate-logos`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json',
            'x-extension-token': process.env.NEXT_PUBLIC_STRATUM_TOKEN || '',

            
          },
          body: JSON.stringify({ brand: form.getValues() })
        }
      )
      
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to generate logos')
      }

      const data = await res.json()
      setLogoVariations(data.logos)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to generate logos')
      console.error(error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium">Logo Generator</h4>
          <p className="text-sm text-muted-foreground">Generate SVG logos based on your brand</p>
        </div>
        <Button 
          onClick={generateLogos} 
          disabled={isGenerating || !ready}
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Logos...
            </>
          ) : (
            'Generate Logos'
          )}
        </Button>
      </div>

      {!ready && (
        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>Complete brand details first</AlertTitle>
          <AlertDescription>
            <p>The following information is needed before generating logos:</p>
            <ul className="list-disc list-inside mt-2">
              {missingFields.map((field) => (
                <li key={field} className="text-muted-foreground">{field}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {isGenerating && (
        <Alert>
          <Clock4 className="h-4 w-4 animate-pulse" />
          <AlertTitle>Generating Your Logos</AlertTitle>
          <AlertDescription>
            This process may take up to a minute as we carefully craft your logo variations.
            Each logo will be optimized for different use cases including favicons and full logos.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Generation Failed</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {logoVariations.length > 0 && (
        <LogoPreviewSection
          variations={logoVariations}
          onDownload={(logo, type) => {
            const svg = type === 'fullLogo' ? logo.fullLogo : 
                       type === 'favicon' ? logo.favicon : 
                       logo.wordmark
            downloadSVG(svg, `${logo.name}-${type}.svg`)
          }}
        />
      )}
    </div>
  )
}