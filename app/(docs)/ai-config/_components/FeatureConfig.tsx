import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "recharts";
import { AiFeature ,AIConfig} from "../types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// components/FeatureConfig.tsx
export function FeatureConfig({ 
    config, 
    onUpdate 
  }: { 
    config: AIConfig;
    onUpdate: (config: AIConfig) => void;
  }) {
    const features: Array<{ id: AiFeature; name: string; group: string }> = [
      { id: 'generate-logos', name: 'Logo Generation', group: 'Brand' },
      { id: 'enhance-writing', name: 'Writing Enhancement', group: 'Brand' },
      { id: 'color-suggestions', name: 'Color Suggestions', group: 'Brand' },
      { id: 'generate-metrics', name: 'Metrics Generation', group: 'Product' },
      { id: 'generate-markets', name: 'Market Analysis', group: 'Product' },
      { id: 'enhance-strategy', name: 'Strategy Enhancement', group: 'Product' },
      { id: 'generate-competitors', name: 'Competitor Analysis', group: 'Product' },
      { id: 'generate-content-strategy', name: 'Content Strategy', group: 'Content' },
        { id: 'generate-initial-clusters', name: 'Content Clusters', group: 'Content' },
        { id: 'generate-single-cluster', name: 'Single Cluster', group: 'Content' },
        { id: 'generate-keywords-for-cluster', name: 'Keywords for Cluster', group: 'Content' },
        { id: 'generate-content-briefs-for-cluster', name: 'Content Briefs for Cluster', group: 'Content' }
    ];
  
    const groupedFeatures = features.reduce((groups, feature) => {
      (groups[feature.group] = groups[feature.group] || []).push(feature);
      return groups;
    }, {} as Record<string, typeof features>);
  
    return (
      <Card>
        <CardHeader>
          <CardTitle>Feature Configuration</CardTitle>
          <CardDescription>
            Select which AI provider to use for each feature
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(groupedFeatures).map(([group, features]) => (
              <div key={group}>
                <h3 className="font-medium mb-4">{group}</h3>
                <div className="grid gap-4">
                  {features.map((feature) => (
                    <div key={feature.id} className="flex items-center justify-between">
                      <Label>{feature.name}</Label>
                      <div className="flex gap-2">
                        <Select
                          value={config.features?.[feature.id]?.provider}
                          onValueChange={(provider: 'anthropic' | 'openai') => 
                            onUpdate({
                              ...config,
                              features: {
                                ...config.features,
                                [feature.id]: {
                                  ...config.features[feature.id],
                                  provider,
                                  model: provider === 'anthropic' ? 
                                    'claude-3-opus-20240229' : 
                                    'gpt-4-turbo-preview'
                                }
                              }
                            })
                          }
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Select provider" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="anthropic">Anthropic</SelectItem>
                            <SelectItem value="openai">OpenAI</SelectItem>
                          </SelectContent>
                        </Select>
  
                        <Select
                          value={config.features?.[feature.id]?.model}
                          onValueChange={(model) => 
                            onUpdate({
                              ...config,
                              features: {
                                ...config.features,
                                [feature.id]: {
                                  ...config.features[feature.id],
                                  model
                                }
                              }
                            })
                          }
                        >
                          <SelectTrigger className="w-48">
                            <SelectValue placeholder="Select model" />
                          </SelectTrigger>
                          <SelectContent>
                            {config.features?.[feature.id]?.provider === 'anthropic' ? (
                              <>
                                <SelectItem value="claude-3-opus-20240229">Claude 3 Opus</SelectItem>
                                <SelectItem value="claude-3-sonnet-20240229">Claude 3 Sonnet</SelectItem>
                              </>
                            ) : (
                              <>
                                <SelectItem value="gpt-4-turbo-preview">GPT-4 Turbo</SelectItem>
                                <SelectItem value="gpt-4">GPT-4</SelectItem>
                              </>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }