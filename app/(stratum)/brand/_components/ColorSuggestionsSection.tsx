import { useState } from "react"
import { UseFormReturn } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { FONT_COMBINATIONS } from "./VisualIdentitySection"
import { AIActionButton } from "@/components/ui/ai-action-button"
import { DEFAULT_DESIGN_TEMPLATES } from "../types"
export interface BrandColorPalette {
    hex: string;
    usage: string;
    meaning: string;
  }
export interface DesignSuggestion {
    name: string;
    description: string;
    colors: {
      primary: BrandColorPalette;
      secondary: BrandColorPalette;
      accent: BrandColorPalette;
      muted: BrandColorPalette;
      ai: BrandColorPalette;
      surface: SurfaceColors;
    };
    fonts: {
      primary: FontConfig;
      secondary: FontConfig;
    };
  }
  export interface SurfaceColors {
    background: string;
    foreground: string;
    card: string;
    cardForeground: string;
  }
  
  export interface FontConfig {
    family: ValidFonts;
    usage: string;
  }
  export type ValidFonts = typeof FONT_COMBINATIONS[number]['primary']['family'] | 
                        typeof FONT_COMBINATIONS[number]['secondary']['family'];

  
// Component


function PreviewCard({ suggestion }: { suggestion: DesignSuggestion}) {
  const { colors, fonts } = suggestion

  return (
    <div className={`w-full aspect-video bg-white rounded-lg overflow-hidden shadow-sm border border-border/50 scale-90`} >
      <div className="h-12">
        <div className="flex items-center h-full px-4 gap-2">
          <div className="h-6 w-6 rounded-md" style={{ backgroundColor: colors.secondary.hex }} />
          <div className="h-2 w-24 rounded-full bg-white/20" />
        </div>
      </div>
      <div className="p-4 space-y-4">
        <div className="space-y-2">
          <div 
            className="h-6 w-3/4 rounded" 
            style={{ 
              backgroundColor: colors.primary.hex,
              fontFamily: fonts.primary.family 
            }}
          />
          <div 
            className="h-2 w-full rounded bg-gray-200"
            style={{ fontFamily: fonts.secondary.family }}
          />
        </div>
        <div className="space-y-2">
          <div 
            className="h-8 w-32 rounded" 
            style={{ 
              backgroundColor: colors.secondary.hex,
              fontFamily: fonts.primary.family 
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default function DesignSuggestionsSection({ form, projectId }: { form: UseFormReturn<any>, projectId: string }) {
  const [suggestions, setSuggestions] = useState<DesignSuggestion[]>(DEFAULT_DESIGN_TEMPLATES as DesignSuggestion[])
  const [isLoading, setIsLoading] = useState(false)

  async function generateSuggestions() {
    setIsLoading(true)
    try {
      const brand = form.getValues()
      const res = await fetch(
        `http://localhost:3009/api/extension/ai-projects/${projectId}/brand/color-suggestions`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json',

            'x-extension-token': process.env.NEXT_PUBLIC_STRATUM_TOKEN || '',
           },
          body: JSON.stringify({ brand })
        }
      )
      if (!res.ok) throw new Error('Failed to generate suggestions')
      const data = await res.json()
      setSuggestions([...data.suggestions, ...DEFAULT_DESIGN_TEMPLATES])
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  function applySuggestion(suggestion: DesignSuggestion) {
    // Apply all colors

    console.log('suggestion', suggestion)
    form.setValue('colors', {
      primary: suggestion.colors.primary,
      secondary: suggestion.colors.secondary,
      accent: suggestion.colors.accent,
      muted: suggestion.colors.muted,
      ai: suggestion.colors.ai,
      surface: suggestion.colors.surface
    }, { shouldDirty: true });
  
    // Apply fonts with proper case handling
    const normalizeFont = (font: string) => font.toLowerCase().replace(/\s+/g, '-');
  
    const primaryFont = FONT_COMBINATIONS.find(
      combo => normalizeFont(combo.primary.family) === normalizeFont(suggestion.fonts.primary.family)
    )?.primary.family || 'Inter';
  
    const secondaryFont = FONT_COMBINATIONS.find(
      combo => normalizeFont(combo.secondary.family) === normalizeFont(suggestion.fonts.secondary.family)
    )?.secondary.family || 'Open Sans';
  
    // Apply fonts
    form.setValue('typography', {
      fontPrimary: normalizeFont(primaryFont),
      fontSecondary: normalizeFont(secondaryFont),
      usage: {
        primary: suggestion.fonts.primary.usage,
        secondary: suggestion.fonts.secondary.usage
      }
    }, { shouldDirty: true });
  
    // Apply theme metadata
    form.setValue('theme', {
      name: suggestion.name,
      description: suggestion.description
    }, { shouldDirty: true });
  
    // Update form state to reflect changes
    form.setValue('colorSystem', {
      generated: true,
      timestamp: new Date().toISOString(),
      variant: suggestion.name
    }, { shouldDirty: true });
  }
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium">Design Suggestions</h4>
          <p className="text-sm text-muted-foreground">Select a template or generate custom palletes based on your current brand context</p>
        </div>
        {/* <Button onClick={generateSuggestions} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate Suggestions'
          )}
        </Button> */}

        <AIActionButton
  actionText="Generate Brand Templates"
  provider="anthropic"
  model="claude-3-opus-20240229"
  onClick={generateSuggestions}
/>
      </div>
<div>
    Selected Variant: {form.getValues('colorSystem.variant')}
</div>
      {suggestions.length > 0 && (
        <div className="grid gap-6 md:grid-cols-3">
          {suggestions.map((suggestion, index) => (
            <Card 
              key={index}
              className={`cursor-pointer hover:border-primary transition-all ${form.getValues('colorSystem.variant') === suggestion.name ? 'border-primary' : 'border-border/50'}`}
              onClick={() => applySuggestion(suggestion)}
            >
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <PreviewCard
                
                  suggestion={suggestion} />
                  <div>
                    <h5 className="font-medium">{suggestion.name}</h5>
                    <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                    <div className="mt-2 text-xs text-muted-foreground">
                      <div>Primary Font: {suggestion.fonts.primary.family}</div>
                      <div>Secondary Font: {suggestion.fonts.secondary.family}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}