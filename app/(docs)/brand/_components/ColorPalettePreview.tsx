import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UseFormReturn } from "react-hook-form"
import { cn } from "@/lib/utils"
import { Eye, EyeOff, Sun, Moon, Paintbrush, Wand2, Sparkles, BellIcon } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AIActionButton } from "@/components/ui/ai-action-button"

interface ColorSectionProps {
  form: UseFormReturn<any>;
}

function ColorInput({ 
  label, 
  name, 
  form, 
  description,
  previewClassName 
}: { 
  label: string;
  name: string;
  form: UseFormReturn<any>;
  description?: string;
  previewClassName?: string;
}) {
  const value = form.watch(name);
  
  return (
    <div className="space-y-2">
      <FormLabel>{label}</FormLabel>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      <div className="flex gap-2">
        <div className="flex-grow">
          <FormControl>
            <Input 
              {...form.register(name)}
              placeholder="#000000" 
            />
          </FormControl>
        </div>
        <div className="flex gap-2">
          <Input
            type="color"
            className="w-12 p-1"
            value={value || '#000000'}
            onChange={(e) => form.setValue(name, e.target.value)}
          />
          <div 
            className={cn(
              "w-12 rounded-md border", 
              !value && "bg-muted",
              previewClassName
            )} 
            style={value ? { backgroundColor: value } : undefined}
          />
        </div>
      </div>
    </div>
  );
}

function ColorPalettePreview({ form }: { form: UseFormReturn<any> }) {
  const [showDark, setShowDark] = useState(false);
  const values = form.getValues();
 
  return (
    <div className="space-y-6">
      {/* Header with Light/Dark Toggle */}
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">Color System Preview</h4>
        <button
          onClick={() => setShowDark(!showDark)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          {showDark ? (
            <>
              <Moon className="h-4 w-4" /> Dark Mode
            </>
          ) : (
            <>
              <Sun className="h-4 w-4" /> Light Mode
            </>
          )}
        </button>
      </div>
 
      {/* Preview Canvas */}
      <div className={cn(
        "rounded-lg p-6 border transition-colors duration-200",
        showDark ? "bg-zinc-950 border-zinc-800" : "bg-white border-zinc-200"
      )}>
        <div className="space-y-8">
          {/* Brand Colors Section */}
          <div className="space-y-3">
            <h5 className={cn(
              "text-xs font-medium",
              showDark ? "text-zinc-400" : "text-zinc-500"
            )}>Brand Colors</h5>
            <div className="grid gap-4 md:grid-cols-2">
              <ColorPreviewCard
                title="Primary"
                color={values.colors.primary?.hex}
                usage={values.colors.primary?.usage}
                darkMode={showDark}
              />
              <ColorPreviewCard
                title="Secondary"
                color={values.colors.secondary?.hex}
                usage={values.colors.secondary?.usage}
                darkMode={showDark}
              />
            </div>
          </div>
 
          {/* Action Colors Section */}
          <div className="space-y-3">
            <h5 className={cn(
              "text-xs font-medium",
              showDark ? "text-zinc-400" : "text-zinc-500"
            )}>Action Colors</h5>
            <div className="grid gap-4 md:grid-cols-3">
              <ColorPreviewCard
                title="Accent"
                color={values.colors.accent?.hex}
                usage={values.colors.accent?.usage}
                darkMode={showDark}
              />
              <ColorPreviewCard
                title="AI"
                color={values.colors.ai?.hex}
                usage="AI-powered features"
                darkMode={showDark}
                icon={<Sparkles className="h-4 w-4" />}
              />
              <ColorPreviewCard
                title="Muted"
                color={values.colors.muted?.hex}
                usage={values.colors.muted?.usage}
                darkMode={showDark}
              />
            </div>
          </div>
 
          {/* UI Examples Section */}
          <div className="space-y-3">
            <h5 className={cn(
              "text-xs font-medium",
              showDark ? "text-zinc-400" : "text-zinc-500"
            )}>UI Examples</h5>
            <div className="grid gap-6">
              {/* Buttons Row */}
              <div className="flex flex-wrap gap-3">
                <button
                  className={cn(
                    "px-4 py-2 rounded-md text-white transition-colors",
                    "hover:opacity-90 active:opacity-100"
                  )}
                  style={{ backgroundColor: values.colors.primary?.hex }}
                >
                  Primary Button
                </button>
                <button
                  className={cn(
                    "px-4 py-2 rounded-md text-white transition-colors",
                    "hover:opacity-90 active:opacity-100"
                  )}
                  style={{ backgroundColor: values.colors.accent?.hex }}
                >
                  Accent Button
                </button>
                <button
                  className={cn(
                    "px-4 py-2 rounded-md text-white transition-colors",
                    "hover:opacity-90 active:opacity-100",
                    "flex items-center gap-2"
                  )}
                  style={{ backgroundColor: values.colors.ai?.hex }}
                >
                  <Wand2 className="h-4 w-4" />
                  AI Action
                </button>
                <button
                  className={cn(
                    "px-4 py-2 rounded-md border transition-colors",
                    showDark ? "border-zinc-800" : "border-zinc-200",
                  )}
                  style={{ 
                    backgroundColor: values.colors.muted?.hex,
                    color: showDark ? 'white' : 'black'
                  }}
                >
                  Secondary Button
                </button>
              </div>
 
              {/* Card Examples */}
              <div className="grid gap-4 md:grid-cols-2">
                <div
                  className={cn(
                    "rounded-lg p-4 border",
                    showDark ? "border-zinc-800" : "border-zinc-200"
                  )}
                  style={{ 
                    backgroundColor: values.colors.surface?.background,
                    color: values.colors.surface?.foreground 
                  }}
                >
                  <h6 className="text-sm font-medium mb-2">Background Surface</h6>
                  <p className="text-sm opacity-80">Content on background surface with proper contrast.</p>
                </div>
                <div
                  className={cn(
                    "rounded-lg p-4 border shadow-sm",
                    showDark ? "border-zinc-800" : "border-zinc-200"
                  )}
                  style={{ 
                    backgroundColor: values.colors.surface?.card,
                    color: values.colors.surface?.cardForeground 
                  }}
                >
                  <h6 className="text-sm font-medium mb-2">Card Surface</h6>
                  <p className="text-sm opacity-80">Content on card surface with proper contrast.</p>
                </div>
              </div>
 
              {/* Alert Examples */}
              <div className="space-y-3">
                <div 
                  className={cn(
                    "rounded-lg p-4 border flex items-center gap-3",
                    showDark ? "bg-zinc-900" : "bg-zinc-50"
                  )}
                  style={{ borderColor: values.colors.primary?.hex }}
                >
                  <div 
                    className="h-8 w-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: values.colors.primary?.hex }}
                  >
                    <BellIcon className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h6 className="text-sm font-medium">Notification Example</h6>
                    <p className="text-sm opacity-80">Using primary color for emphasis</p>
                  </div>
                </div>
                <div 
                  className={cn(
                    "rounded-lg p-4 border flex items-center gap-3",
                  )}
                  style={{ 
                    backgroundColor: values.colors.ai?.hex + '10',
                    borderColor: values.colors.ai?.hex
                  }}
                >
                  <div 
                    className="h-8 w-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: values.colors.ai?.hex }}
                  >
                    <Wand2 className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h6 className="text-sm font-medium">AI Feature Card</h6>
                    <p className="text-sm opacity-80">Using AI accent color for AI features</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
 }


 function ColorPreviewCard({ 
  title, 
  color, 
  meaning,
  usage,
  darkMode,
  icon
}: { 
  title: string;
  color?: string;
  meaning?: string;
  usage?: string;
  darkMode: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div 
        className={cn(
          "rounded-lg p-4 transition-colors",
          !color && (darkMode ? "bg-zinc-900" : "bg-zinc-100")
        )}
        style={color ? { backgroundColor: color } : undefined}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <p className={cn(
              "font-medium",
              color ? "text-white" : darkMode ? "text-zinc-400" : "text-zinc-600"
            )}>
              {title}
            </p>
          </div>
          {color && (
            <code className="text-xs text-white/70 font-mono">
              {color}
            </code>
          )}
        </div>
      </div>
      {(meaning || usage) && (
        <div className="px-1 space-y-1">
          {usage && (
            <p className="text-xs text-muted-foreground">
              <span className="font-medium">Usage:</span> {usage}
            </p>
          )}
          {meaning && (
            <p className="text-xs text-muted-foreground">
              <span className="font-medium">Meaning:</span> {meaning}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
 
export function ColorPaletteSection({ form }: ColorSectionProps) {

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Paintbrush className="h-4 w-4" />
          Color Palette
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="colors">
          <TabsList>
            <TabsTrigger value="colors">Colors</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="colors" className="space-y-6">
            {/* Brand Colors */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Brand Colors</h4>
              <div className="grid gap-6 md:grid-cols-2">
                <ColorInput
                  label="Primary"
                  name="colors.primary.hex"
                  form={form}
                  description="Main brand color for key elements"
                />
                <ColorInput
                  label="Secondary"
                  name="colors.secondary.hex"
                  form={form}
                  description="Supporting brand color"
                />
              </div>
            </div>

            {/* Action Colors */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Action Colors</h4>
              <div className="grid gap-6 md:grid-cols-3">
                <ColorInput
                  label="Accent"
                  name="colors.accent.hex"
                  form={form}
                  description="High-contrast interactive elements"
                />
                <ColorInput
                  label="AI"
                  name="colors.ai.hex"
                  form={form}
                  description="AI-powered features"
                />
                <ColorInput
                  label="Muted"
                  name="colors.muted.hex"
                  form={form}
                  description="Subtle backgrounds and borders"
                />
              </div>
            </div>

            {/* Surface Colors */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Surface Colors</h4>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <ColorInput
                    label="Background"
                    name="colors.surface.background"
                    form={form}
                    description="Page background"
                  />
                  <ColorInput
                    label="Foreground"
                    name="colors.surface.foreground"
                    form={form}
                    description="Text on background"
                  />
                </div>
                <div className="space-y-4">
                  <ColorInput
                    label="Card"
                    name="colors.surface.card"
                    form={form}
                    description="Card background"
                  />
                  <ColorInput
                    label="Card Foreground"
                    name="colors.surface.cardForeground"
                    form={form}
                    description="Text on cards"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preview">
            <ThemePreview form={form} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}



function ThemePreview({ 
  form, 

}: { 
  form: UseFormReturn<any>;

}) {
  const [darkMode, setShowDark] = useState(false);
  const [view, setView] = useState<'landing' | 'dashboard'>('landing');
  const colors = form.watch('colors');
  const theme = form.watch('theme');

  return (
    <div className="space-y-4">
      {/* View Toggle */}
      <div className="flex gap-2">
        <Button
          variant={view === 'landing' ? 'default' : 'outline'}
          onClick={() => setView('landing')}
          size="sm"
        >
          Landing Page
        </Button>
        <Button
          variant={view === 'dashboard' ? 'default' : 'outline'}
          onClick={() => setView('dashboard')}
          size="sm"
        >
          Dashboard
        </Button>
      </div>

      {/* Preview Container */}
      <div className="rounded-lg border bg-background overflow-hidden">
        <div className="h-[600px] overflow-y-auto">
          {view === 'landing' ? (
            <LandingPreview colors={colors} darkMode={darkMode} />
          ) : (
            <DashboardPreview colors={colors} darkMode={darkMode} />
          )}
        </div>
      </div>
    </div>
  );
}

function LandingPreview({ colors, darkMode }: { colors: any['colors']; darkMode: boolean }) {
  return (
    <div className="min-h-full">
      {/* Hero Section */}
      <section 
        className="px-6 py-20"
        style={{ backgroundColor: colors.surface.background }}
      >
        <div className="max-w-5xl mx-auto space-y-8">
          <h1 
            className="text-4xl md:text-6xl font-bold text-center"
            style={{ color: colors.primary.hex }}
          >
            Your Product Tagline
          </h1>
          <p 
            className="text-xl text-center max-w-2xl mx-auto"
            style={{ color: colors.surface.foreground }}
          >
            A compelling description of your product that draws users in and explains the value proposition clearly.
          </p>
          <div className="flex justify-center gap-4">
            <Button
              size="lg"
              style={{ backgroundColor: colors.primary.hex }}
            >
              Get Started
            </Button>
            <Button 
              style={{ backgroundColor: colors.ai.hex }}
            
              onClick={() => {}}
            >
              <Wand2 className="h-5 w-5" />
              Try AI Features
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section 
        className="px-6 py-20"
        style={{ backgroundColor: colors.surface.card }}
      >
        <div className="max-w-5xl mx-auto space-y-12">
          <h2 
            className="text-3xl font-bold text-center"
            style={{ color: colors.surface.cardForeground }}
          >
            Key Features
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div 
                key={i}
                className="rounded-lg p-6"
                style={{ backgroundColor: colors.muted.hex + '20' }}
              >
                <div 
                  className="w-12 h-12 rounded-lg mb-4 flex items-center justify-center"
                  style={{ backgroundColor: colors.accent.hex }}
                >
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h3 
                  className="text-lg font-semibold mb-2"
                  style={{ color: colors.surface.cardForeground }}
                >
                  Feature {i}
                </h3>
                <p 
                  className="text-sm"
                  style={{ color: colors.surface.cardForeground + '99' }}
                >
                  Description of this amazing feature and how it benefits users.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        className="px-6 py-20"
        style={{ 
          background: `linear-gradient(to bottom right, ${colors.primary.hex}, ${colors.secondary.hex})`
        }}
      >
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-bold text-white">
            Ready to Get Started?
          </h2>
          <p className="text-white/80">
            Join thousands of satisfied users today.
          </p>
          <Button
            size="lg"
            style={{ backgroundColor: colors.accent.hex }}
          >
            Sign Up Now
          </Button>
        </div>
      </section>
    </div>
  );
}

function DashboardPreview({ colors, darkMode }: { colors: any['colors']; darkMode: boolean }) {
  return (
    <div className="min-h-full grid grid-cols-[280px_1fr]">
      {/* Sidebar */}
      <div 
        className="p-4 border-r"
        style={{ 
          backgroundColor: colors.surface.card,
          borderColor: colors.muted.hex + '40'
        }}
      >
        {/* Navigation Items */}
        {['Dashboard', 'Analytics', 'Settings'].map(item => (
          <div
            key={item}
            className="px-4 py-2 rounded-md mb-1"
            style={{ 
              backgroundColor: item === 'Dashboard' ? colors.primary.hex + '20' : 'transparent',
              color: item === 'Dashboard' ? colors.primary.hex : colors.surface.cardForeground
            }}
          >
            {item}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div 
        className="p-6"
        style={{ backgroundColor: colors.surface.background }}
      >
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-6">
            {['Total Users', 'Revenue', 'Active'].map(stat => (
              <div
                key={stat}
                className="p-6 rounded-lg"
                style={{ 
                  backgroundColor: colors.surface.card,
                  borderColor: colors.muted.hex + '40'
                }}
              >
                <h3 
                  className="text-sm font-medium mb-2"
                  style={{ color: colors.surface.cardForeground + '80' }}
                >
                  {stat}
                </h3>
                <p 
                  className="text-2xl font-bold"
                  style={{ color: colors.surface.cardForeground }}
                >
                  {Math.floor(Math.random() * 10000)}
                </p>
              </div>
            ))}
          </div>

          {/* Content Card */}
          <div
            className="rounded-lg p-6"
            style={{ 
              backgroundColor: colors.surface.card,
              borderColor: colors.muted.hex + '40'
            }}
          >
            {/* Card content */}
          </div>
        </div>
      </div>
    </div>
  );
}