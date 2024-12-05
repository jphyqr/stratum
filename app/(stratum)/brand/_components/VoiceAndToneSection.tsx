import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form"
import { Card, CardContent } from "@/components/ui/card"
import { UseFormReturn } from "react-hook-form"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useState } from "react"

const BRAND_VOICES = [
  {
    brand: "Stripe",
    trait: { name: "Technical Authority", application: "Clear, precise, developer-focused communication" },
    examples: {
      welcome: "Start accepting payments in minutes with our powerful API",
      error: "The API request encountered an error. Here's how to fix it:",
      success: "Your integration is complete. You're ready to accept payments",
      feature: "Process payments programmatically with our new Payments API"
    }
  },
  {
    brand: "Airbnb",
    trait: { name: "Warm & Inclusive", application: "Friendly, welcoming, community-focused" },
    examples: {
      welcome: "Find your place in the world",
      error: "Oops! Something's not quite right. Let's try that again",
      success: "You're all set! Your stay is confirmed",
      feature: "Discover unique stays and experiences"
    }
  },
  {
    brand: "Nike",
    trait: { name: "Motivational", application: "Bold, empowering, action-oriented" },
    examples: {
      welcome: "Your journey starts here. Just do it.",
      error: "Let's push through this setback together",
      success: "Victory! Your order is confirmed",
      feature: "Push your limits with our latest innovation"
    }
  },
  {
    brand: "Shopify",
    trait: { name: "Empowering Merchant", application: "Supporting entrepreneurs with clear guidance" },
    examples: {
      welcome: "Your business journey begins here",
      error: "We noticed something needs attention",
      success: "Great! Your store is ready for customers",
      feature: "Grow your business with our new sales tools"
    }
  },
  {
    brand: "Slack",
    trait: { name: "Friendly Professional", application: "Informal but reliable workplace communication" },
    examples: {
      welcome: "Let's get your team talking",
      error: "Hang tight - we're looking into this",
      success: "You're ready to collaborate!",
      feature: "Connect your tools and keep everyone in sync"
    }
  },
  {
    brand: "GitHub",
    trait: { name: "Developer Community", application: "Technical yet collaborative and inclusive" },
    examples: {
      welcome: "Join millions of developers building better software together",
      error: "Looking for that repository? Let's get you back on track",
      success: "Merged successfully! Your code is now live",
      feature: "Automate your workflow with our new Actions"
    }
  },
  {
    brand: "Notion",
    trait: { name: "Productivity Partner", application: "Simple, clear, and encouraging" },
    examples: {
      welcome: "Your workspace is ready for anything",
      error: "That didn't save quite right - let's try again",
      success: "Perfect! Your page is ready to share",
      feature: "Transform how you organize with our new database views"
    }
  },
  {
    brand: "Discord",
    trait: { name: "Playful Community", application: "Fun, engaging, and user-focused" },
    examples: {
      welcome: "Your corner of Discord awaits!",
      error: "Oops, hit a snag! Let's fix that",
      success: "Level up! Your server is ready to go",
      feature: "Make your server even better with our new tools"
    }
  }
]

interface VoiceAndToneSectionProps {
  form: UseFormReturn<any>
}

export default function VoiceAndToneSection({ form }: VoiceAndToneSectionProps) {
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null)
  const [isCustom, setIsCustom] = useState(false)

  const handleBrandSelect = (voice: typeof BRAND_VOICES[0]) => {
    setSelectedBrand(voice.brand)
    setIsCustom(false)
    
    // Update form with selected brand's voice
    form.setValue('voiceTraits', [{
      name: voice.trait.name,
      application: voice.trait.application
    }], { shouldDirty: true })

    // Update examples
    form.setValue('voiceExamples', [
      { context: 'welcome', text: voice.examples.welcome },
      { context: 'error', text: voice.examples.error },
      { context: 'success', text: voice.examples.success },
      { context: 'feature', text: voice.examples.feature }
    ], { shouldDirty: true })
  }

  const handleCustomSelect = () => {
    setSelectedBrand(null)
    setIsCustom(true)
    
    // Reset form for custom input
    form.setValue('voiceTraits', [{
      name: '',
      application: ''
    }], { shouldDirty: true })

    form.setValue('voiceExamples', [
      { context: 'welcome', text: '' },
      { context: 'error', text: '' },
      { context: 'success', text: '' },
      { context: 'feature', text: '' }
    ], { shouldDirty: true })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Voice & Tone</h3>
        <p className="text-sm text-muted-foreground">Choose your brand's voice from popular examples or create your own</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {BRAND_VOICES.map((voice) => (
          <Card
            key={voice.brand}
            className={cn(
              "cursor-pointer hover:border-primary transition-colors",
              selectedBrand === voice.brand && "border-primary bg-primary/5"
            )}
            onClick={() => handleBrandSelect(voice)}
          >
            <CardContent className="p-4">
              <div className="flex flex-col gap-2">
                <span className="font-medium text-sm">{voice.brand}</span>
                <span className="text-xs text-muted-foreground">{voice.trait.name}</span>
              </div>
            </CardContent>
          </Card>
        ))}

        <Card 
          className={cn(
            "cursor-pointer hover:border-primary transition-colors",
            isCustom && "border-primary bg-primary/5"
          )}
          onClick={handleCustomSelect}
        >
          <CardContent className="p-4">
            <div className="flex flex-col gap-2">
              <span className="font-medium text-sm">Custom Voice</span>
              <span className="text-xs text-muted-foreground">Define your own</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {isCustom && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="voiceTraits.0.name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Voice Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., Professional & Friendly" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="voiceTraits.0.application"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Application</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., Clear and approachable communication" />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6">
        <Card>
          <CardContent className="pt-6">
            <h4 className="text-sm font-medium mb-4">Voice Examples</h4>
            <div className="grid gap-4">
              {['welcome', 'error', 'success', 'feature'].map((context, index) => (
                <FormField
                  key={context}
                  control={form.control}
                  name={`voiceExamples.${index}.text`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="capitalize">{context} Message</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}