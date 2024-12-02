import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronDown } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { AiFeature, Provider, FeatureMapping, PROVIDER_MODELS, FEATURE_CONSTRAINTS, SupportedModel } from '../types'

const FEATURES: Record<AiFeature, { name: string, description: string }> = {
  'generate-logos': { name: 'Logo Generation', description: 'Generate SVG brand logos' },
  'enhance-writing': { name: 'Writing Enhancement', description: 'Improve brand copy' },
  'color-suggestions': { name: 'Color Suggestions', description: 'Generate brand colors' },
  'generate-metrics': { name: 'Metrics Generation', description: 'Suggest KPIs' },
  'generate-markets': { name: 'Market Analysis', description: 'Generate segments' },
  'enhance-strategy': { name: 'Strategy Enhancement', description: 'Improve product strategy' },
  'generate-competitors': { name: 'Competitor Analysis', description: 'Generate insights' },
  'generate-content-strategy': { name: 'Content Strategy', description: 'Generate Content Strategy' },
  'generate-initial-clusters': { name: 'Content Clusters', description: 'Generate Content Clusters' },
    'generate-single-cluster': { name: 'Single Cluster', description: 'Generate Single Cluster' },
    'generate-keywords-for-cluster': { name: 'Keywords for Cluster', description: 'Generate Keywords for Cluster' },
    'generate-content-briefs-for-cluster': { name: 'Content Briefs for Cluster', description: 'Generate Content Briefs for Cluster' }
}

export function FeatureProviderSelection({ 
  config,
  onUpdate,
  enabledProviders
}: { 
  config: Record<AiFeature, FeatureMapping>,
  onUpdate: (newConfig: Record<AiFeature, FeatureMapping>) => void,
  enabledProviders: Provider[]
}) {
  const updateFeatureProvider = (feature: AiFeature, provider: Provider) => {
    onUpdate({
      ...config,
      [feature]: {
        provider,
        model: PROVIDER_MODELS[provider][0]
      }
    })
  }

  const updateFeatureModel = (feature: AiFeature, model: SupportedModel) => {
    onUpdate({
      ...config,
      [feature]: {
        ...config[feature],
        model
      }
    })
  }

  const isProviderAllowed = (feature: AiFeature, provider: Provider) =>
    !FEATURE_CONSTRAINTS[feature] || FEATURE_CONSTRAINTS[feature]?.includes(provider)

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Features</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {Object.entries(FEATURES).map(([feature, details]) => {
            const currentConfig = config[feature as AiFeature]
            const currentProvider = currentConfig?.provider
            const currentModel = currentConfig?.model

            return (
              <AccordionItem key={feature} value={feature}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-4">
                      <span className="font-medium">{details.name}</span>
                      {currentProvider && (
                        <span className="text-sm text-muted-foreground">
                          {currentProvider === 'anthropic' ? 'Claude' : 'OpenAI'} • {currentModel?.split('-').slice(-2).join(' ')}
                        </span>
                      )}
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-2">
                    <p className="text-sm text-muted-foreground">{details.description}</p>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        {enabledProviders.map(provider => (
                          isProviderAllowed(feature as AiFeature, provider) && (
                            <Button
                              key={provider}
                              size="sm"
                              variant={currentProvider === provider ? 'default' : 'outline'}
                              onClick={() => updateFeatureProvider(feature as AiFeature, provider)}
                            >
                              {provider === 'anthropic' ? 'Claude' : 'OpenAI'}
                            </Button>
                          )
                        ))}
                      </div>
                      
                      {currentProvider && (
                        <div className="flex gap-2">
                          {PROVIDER_MODELS[currentProvider].map(model => (
                            <Button
                              key={model}
                              size="sm"
                              variant={currentModel === model ? 'default' : 'outline'}
                              onClick={() => updateFeatureModel(feature as AiFeature, model)}
                            >
                              {model.split('-').slice(-2).join(' ')}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>
      </CardContent>
    </Card>
  )
}