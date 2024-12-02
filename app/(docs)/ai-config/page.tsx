// app/(docs)/ai-config/page.tsx

import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { 
  Sparkles, 
  Palette, 
  Brain, 
  Settings, 
  Shield, 
  ExternalLink 
} from 'lucide-react'
import { AIConfigForm } from './_components/AIConfigForm'
import { getProjectConfig } from '@/.ai/config'

export default async function AIConfigPage() {

    const config = getProjectConfig();
    if (!config) return null;
  return (
    <div className="container max-w-5xl py-6 space-y-12">
      {/* Hero Section */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">AI Configuration</h1>
        <p className="text-xl text-muted-foreground">
          Configure and customize how AI enhances your development workflow
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Key Features */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">AI-Powered Features</h2>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="font-medium">Smart Brand Generation</h3>
                    <p className="text-sm text-muted-foreground">
                      Generate brand guidelines, voice, and tone based on your input
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Palette className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="font-medium">Logo & Visual Identity</h3>
                    <p className="text-sm text-muted-foreground">
                      Create SVG logos and color schemes that match your brand
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="font-medium">Writing Enhancement</h3>
                    <p className="text-sm text-muted-foreground">
                      Improve content guidelines and documentation
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Setup */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Quick Setup Guide</h2>
              <ol className="space-y-3 list-decimal list-inside text-sm">
                <li>Choose an AI provider (we recommend Claude)</li>
                <li>Get an API key from your provider</li>
                <li>Configure your environment variables</li>
                <li>Optional: Customize model parameters</li>
              </ol>
              <div className="flex gap-2">
                <Button asChild variant="outline">
                  <Link href="#setup">
                    View Setup Guide
                    <Settings className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="setup" className="space-y-6">
        <TabsList>
          <TabsTrigger value="setup">Setup</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="providers">Providers</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="setup" className="space-y-6">
          <AIConfigForm  projectId={config.projectId} />
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Environment Setup</h3>
              <div className="space-y-4">
                <p>Add these variables to your <code>.env.local</code> file:</p>
                <pre className="bg-muted p-4 rounded-lg text-sm">
                  {`# AI Configuration
ANTHROPIC_API_KEY=your-key-here
AI_TEMPERATURE=0.7 # Optional
AI_MAX_TOKENS=4096 # Optional`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Security Best Practices</h3>
                </div>
                <ul className="space-y-3 list-disc list-inside text-sm">
                  <li>Never commit API keys to version control</li>
                  <li>Use environment variables for sensitive data</li>
                  <li>Rotate API keys periodically</li>
                  <li>Set appropriate usage limits in your provider's console</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="providers" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">Anthropic Claude</h3>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Recommended for its strong understanding of development contexts and ability to generate high-quality SVG.
                  </p>
                  <Button asChild variant="outline">
                    <Link href="https://console.anthropic.com" target="_blank">
                      Get Started with Claude
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">Coming Soon</h3>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Support for additional AI providers is planned for future releases.
                  </p>
                  <ul className="text-sm space-y-2">
                    <li>OpenAI GPT-4</li>
                    <li>Google Gemini</li>
                    <li>Custom API endpoints</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Advanced Configuration</h3>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Fine-tune the AI behavior by adjusting these parameters:
                </p>
                {/* Add your advanced settings form here */}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Resources Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Additional Resources</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Link href="https://docs.anthropic.com/claude/docs" target="_blank">
            <Card className="hover:bg-muted/50 transition-colors">
              <CardContent className="pt-6">
                <h3 className="font-medium">Claude Documentation</h3>
                <p className="text-sm text-muted-foreground">
                  Learn more about Claude's capabilities and best practices
                </p>
              </CardContent>
            </Card>
          </Link>
          {/* Add more resource cards */}
        </div>
      </div>
    </div>
  )
}