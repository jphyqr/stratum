import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { UseFormReturn } from "react-hook-form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrayInput } from "./ArrayInput"
import { Badge } from "@/components/ui/badge"
import { Info, Palette } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { TailwindConfigGenerator } from "./TailwindConfigGenerator"
import { ColorPaletteSection } from "./ColorPalettePreview"

export const FONT_COMBINATIONS = [
    {
      primary: {
        family: "Inter",
        usage: "Modern, clean interface elements and headlines",
        weights: [400, 500, 600, 700]
      },
      secondary: {
        family: "Open Sans",
        usage: "Highly readable body text",
        weights: [400, 600]
      }
    },
    {
      primary: {
        family: "Roboto",
        usage: "Versatile, professional headlines",
        weights: [400, 500, 700]
      },
      secondary: {
        family: "Nunito Sans",
        usage: "Friendly, approachable body text",
        weights: [400, 600]
      }
    },
    {
      primary: {
        family: "Work Sans",
        usage: "Modern, geometric headlines",
        weights: [500, 600, 700]
      },
      secondary: {
        family: "Source Sans Pro",
        usage: "Clean, neutral body text",
        weights: [400, 600]
      }
    },
    {
      primary: {
        family: "Outfit",
        usage: "Contemporary, tech-focused headlines",
        weights: [500, 600, 700]
      },
      secondary: {
        family: "DM Sans",
        usage: "Modern, minimal body text",
        weights: [400, 500]
      }
    }
  ] as const;

const LOGO_STYLES = [
  { value: "wordmark", label: "Wordmark", description: "Text-based logo (e.g., Google, Visa)" },
  { value: "symbol", label: "Symbol", description: "Iconic mark (e.g., Apple, Twitter)" },
  { value: "combination", label: "Combination", description: "Symbol + text (e.g., Nike, Starbucks)" },
  { value: "emblem", label: "Emblem", description: "Symbol containing text (e.g., BMW, Harvard)" }
] as const

//use fonts from font_combinations
const FONTS = [
  { value: "inter", label: "Inter", description: "Modern, clean sans-serif" },
  { value: "roboto", label: "Roboto", description: "Versatile and readable" },
    { value: "work-sans", label: "Work Sans", description: "Geometric and modern" },
    { value: "outfit", label: "Outfit", description: "Contemporary and tech-focused" },
  {
    value: "open-sans",
    label: "Open Sans",
    description: "Friendly and approachable"
  },
  {
    value: "nunito-sans",
    label: "Nunito Sans",
    description: "Friendly and approachable"
  },
  {
    value: "source-sans-pro",
    label: "Source Sans Pro",
    description: "Clean and neutral"
  },
  {
    value: "dm-sans",
    label: "DM Sans",
    description: "Modern and minimal"
  }
] as const

const BRAND_EXAMPLES: Record<string, {
    company: string;
    colors: {
      primary: {
        hex: string;
        usage: string;
        meaning: string;
      };
    };
    logo?: {
      style: string;
      elements: string[];
      restrictions: string[];
    };
  }> = {
    technical: {
      company: "Vercel",
      colors: {
        primary: { hex: "#000000", usage: "Core brand color", meaning: "Authority and precision" }
      },
      logo: {
        style: "symbol",
        elements: ["Triangle", "Motion", "Speed"],
        restrictions: ["Don't modify proportions", "Maintain minimum clear space"]
      }
    },
    creative: {
      company: "Figma",
      colors: {
        primary: { hex: "#A259FF", usage: "Brand emphasis and CTAs", meaning: "Creativity and innovation" }
      }
    }
  }

  interface VisualIdentitySectionProps {
    form: UseFormReturn<any>
    showColorSuggestions?: boolean
  }

  export default function VisualIdentitySection({ 
    form, 
    showColorSuggestions = false 
  }: VisualIdentitySectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Visual Identity</h3>
        <p className="text-sm text-muted-foreground">Define your brand's visual elements and style guidelines</p>
      </div>

      <div className="grid gap-6">
        {/* Colors */}
        {/* <Card>
          <CardContent className="pt-6">
            <div className="grid gap-8">
              <div>
                <h4 className="text-sm font-medium mb-4">Primary Color</h4>
                <div className="grid gap-4 sm:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="primaryColor.hex"
                    render={({ field }) => (
                      <FormItem className="col-span-1">
                        <FormLabel>Color</FormLabel>
                        <div className="flex gap-2">
                          <FormControl>
                            <Input {...field} placeholder="#000000" />
                          </FormControl>
                          <Input
                            type="color"
                            className="w-12 p-1"
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="primaryColor.usage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Usage</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="When to use this color" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="primaryColor.meaning"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meaning</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="What it represents" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-4">Secondary Color</h4>
                <div className="grid gap-4 sm:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="secondaryColor.hex"
                    render={({ field }) => (
                      <FormItem className="col-span-1">
                        <FormLabel>Color</FormLabel>
                        <div className="flex gap-2">
                          <FormControl>
                            <Input {...field} placeholder="#000000" />
                          </FormControl>
                          <Input
                            type="color"
                            className="w-12 p-1"
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="secondaryColor.usage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Usage</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="When to use this color" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="secondaryColor.meaning"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meaning</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="What it represents" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card> */}
        <ColorPaletteSection form={form} />
        {/* Typography */}
        <Card>
          <CardContent className="pt-6">
            <h4 className="text-sm font-medium mb-4">Typography</h4>
            <div className="grid gap-6 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="typography.fontPrimary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Font</FormLabel>
                    <FormDescription>Main typeface for headings and emphasis</FormDescription>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a font" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {FONTS.map(font => (
                          <SelectItem key={font.value} value={font.value}>
                            <div className="flex flex-col">
                              <span className={`font-${font.value}`}>{font.label}</span>
                              <span className="text-xs text-muted-foreground">{font.description}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="typography.fontSecondary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Secondary Font</FormLabel>
                    <FormDescription>Supporting typeface for body text</FormDescription>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a font" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {FONTS.map(font => (
                          <SelectItem key={font.value} value={font.value}>
                            <div className="flex flex-col">
                              <span className={`font-${font.value}`}>{font.label}</span>
                              <span className="text-xs text-muted-foreground">{font.description}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>


        <Card>
    <CardContent className="pt-6">
      <h4 className="text-sm font-medium mb-4">Apply Configuration</h4>
      <TailwindConfigGenerator form={form} />
    </CardContent>
  </Card>

        {/* Logo Preferences */}
        <Card>
          <CardContent className="pt-6">
            <h4 className="text-sm font-medium mb-4">Logo Preferences</h4>
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="logoPreferences.style"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logo Style</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a style" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {LOGO_STYLES.map(style => (
                          <SelectItem key={style.value} value={style.value}>
                            <div className="flex flex-col">
                              <span className="font-medium">{style.label}</span>
                              <span className="text-xs text-muted-foreground">{style.description}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="logoPreferences.preferences"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Style Preferences</FormLabel>
                      <div className="grid grid-cols-2 gap-4">
                        {['modern', 'minimal', 'technical', 'playful'].map((pref) => (
                          <FormField
                            key={pref}
                            control={form.control}
                            name={`logoPreferences.preferences.${pref}`}
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <FormLabel className="capitalize">{pref}</FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <ArrayInput
                form={form}
                control={form.control}
                name="logoPreferences.elements"
                label="Key Elements"
                template=""
                renderItem={(item, index) => (
                  <FormField
                    control={form.control}
                    name={`logoPreferences.elements.${index}`}
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <Input {...field} placeholder="Visual element to include" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                )}
              />

              <ArrayInput
                form={form}
                control={form.control}
                name="logoPreferences.restrictions"
                label="Restrictions"
                template=""
                renderItem={(item, index) => (
                  <FormField
                    control={form.control}
                    name={`logoPreferences.restrictions.${index}`}
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <Input {...field} placeholder="Usage restriction" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Examples */}
        <Alert>
          <Palette className="h-4 w-4" />
          <AlertDescription>
            <div className="mt-2 space-y-4">
              {Object.entries(BRAND_EXAMPLES).map(([style, example]) => (
                <div key={style} className="space-y-2">
                  <Badge variant="outline">{example.company}</Badge>
                  <div className="grid gap-2 pl-4">
                    {example.colors && (
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: example.colors.primary.hex }}
                        />
                        <span className="text-sm">{example.colors.primary.usage}</span>
                      </div>
                    )}
                    {example.logo && (
                      <div className="text-sm">
                        <p><span className="font-medium">Logo style:</span> {example.logo.style}</p>
                        <p className="text-muted-foreground text-xs mt-1">
                          Key elements: {example.logo.elements.join(", ")}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}