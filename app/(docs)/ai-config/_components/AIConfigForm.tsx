// components/AIConfigForm.tsx
'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { InfoIcon, Shield, Loader2, CheckCircle2, XCircle } from "lucide-react"
import { Slider } from "@/components/ui/slider"

import { cn } from '@/lib/utils'
import { useAIPreferences } from '../useAiConfig'
import { encryptMessage, validatePublicKey } from '@/lib/encryption'

import { Input } from '@/components/ui/input'
import { makeExtensionRequest } from '@/lib/api'
import { KeyGeneration } from './KeyGeneration'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { AiFeature, AIConfig, FeatureMapping, Provider } from '../types'
import { FeatureProviderSelection } from './FeatureProviderSection'

interface ProviderPreferences {
  model: string;
  temperature: number;
  maxTokens: number;
  enabled: boolean;
}



const DEFAULT_CONFIG: AIConfig = {
  providers: {
    anthropic: {
      model: 'claude-3-opus-20240229',
      temperature: 0.7,
      maxTokens: 4096,
      enabled: false,
      apiKey: null
    },
    openai: {
      model: 'gpt-4-turbo-preview',
      temperature: 0.7,
      maxTokens: 4096,
      enabled: false,
      apiKey: null
    }
  },
  features: {
    'generate-logos': { provider: 'anthropic', model: 'claude-3-opus-20240229' },
    'enhance-writing': { provider: 'anthropic', model: 'claude-3-opus-20240229' },
    'color-suggestions': { provider: 'anthropic', model: 'claude-3-opus-20240229' },
    'generate-metrics': { provider: 'anthropic', model: 'claude-3-opus-20240229' },
    'generate-markets': { provider: 'anthropic', model: 'claude-3-opus-20240229' },
    'enhance-strategy': { provider: 'anthropic', model: 'claude-3-opus-20240229' },
    'generate-competitors': { provider: 'anthropic', model: 'claude-3-opus-20240229' },
    'generate-content-strategy': { provider: 'anthropic', model: 'claude-3-opus-20240229' },
    'generate-initial-clusters': { provider: 'anthropic', model: 'claude-3-opus-20240229' },
    'generate-single-cluster': { provider: 'anthropic', model: 'claude-3-opus-20240229' },
    'generate-keywords-for-cluster': { provider: 'anthropic', model: 'claude-3-opus-20240229' },
    'generate-content-briefs-for-cluster': { provider: 'anthropic', model: 'claude-3-opus-20240229' }
  },
  defaultProvider: 'anthropic'
};



interface AIPreferences {
  model: 'claude-3-opus-20240229' | 'claude-3-sonnet-20240229'
  temperature: number
  maxTokens: number
}

interface TestStatuses {
  [provider: string]: {
    status: 'idle' | 'testing' | 'success' | 'error';
    message?: string;
    details?: Record<string, string>;
  };
}
const DEFAULT_PREFERENCES: AIPreferences = {
  model: 'claude-3-opus-20240229',
  temperature: 0.7,
  maxTokens: 4096
}
export const PUBLIC_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY!

export function encryptApiKey(apiKey: string): string {
  return encryptMessage(apiKey, PUBLIC_KEY)
}

const MODELS = [
  {
    id: 'claude-3-opus-20240229',
    name: 'Claude 3 Opus',
    description: 'Most capable model, best for complex tasks',
    recommended: true
  },
  {
    id: 'claude-3-sonnet-20240229',
    name: 'Claude 3 Sonnet',
    description: 'Faster and more cost-effective',
    recommended: false
  }
] as const
export const PROVIDERS = [
  {
    id: 'anthropic',
    name: 'Anthropic Claude',
    description: 'Recommended for most features',
    keyPlaceholder: 'ant-...',
    docsUrl: 'https://console.anthropic.com',
    models: [
      {
        id: 'claude-3-opus-20240229',
        name: 'Claude 3 Opus',
        description: 'Most capable model, best for complex tasks'
      },
      {
        id: 'claude-3-sonnet-20240229',
        name: 'Claude 3 Sonnet',
        description: 'Faster and more cost-effective'
      }
    ]
  },
  {
    id: 'openai',
    name: 'OpenAI',
    description: 'GPT-4 and GPT-3.5 models',
    keyPlaceholder: 'sk-...',
    docsUrl: 'https://platform.openai.com/api-keys',
    models: [
      {
        id: 'gpt-4-turbo-preview',
        name: 'GPT-4 Turbo',
        description: 'Latest GPT-4 model with larger context'
      },
      {
        id: 'gpt-4',
        name: 'GPT-4',
        description: 'Most capable GPT-4 model'
      },
      {
        id: 'gpt-3.5-turbo',
        name: 'GPT-3.5 Turbo',
        description: 'Faster and more cost-effective'
      }
    ]
  }
] as const;
interface APIKeyState {
  value: string;
  isChanged: boolean;
}

const DEFAULT_FEATURES: Record<AiFeature, FeatureMapping> = {
  'generate-logos': { provider: 'anthropic', model: 'claude-3-opus-20240229' },
  'enhance-writing': { provider: 'anthropic', model: 'claude-3-opus-20240229' },
  'color-suggestions': { provider: 'anthropic', model: 'claude-3-opus-20240229' },
  'generate-metrics': { provider: 'anthropic', model: 'claude-3-opus-20240229' },
  'generate-markets': { provider: 'anthropic', model: 'claude-3-opus-20240229' },
  'enhance-strategy': { provider: 'anthropic', model: 'claude-3-opus-20240229' },
  'generate-competitors': { provider: 'anthropic', model: 'claude-3-opus-20240229' },
  'generate-content-strategy': { provider: 'anthropic', model: 'claude-3-opus-20240229' },
  'generate-initial-clusters': { provider: 'anthropic', model: 'claude-3-opus-20240229' },
  'generate-single-cluster': { provider: 'anthropic', model: 'claude-3-opus-20240229' },
  'generate-keywords-for-cluster': { provider: 'anthropic', model: 'claude-3-opus-20240229' },
  'generate-content-briefs-for-cluster': { provider: 'anthropic', model: 'claude-3-opus-20240229' }
};
export type ProviderId = typeof PROVIDERS[number]['id'];
export type ModelId = typeof PROVIDERS[number]['models'][number]['id'];

export function AIConfigForm({projectId}: {projectId: string}) {
  const [config, setConfig] = useState<AIConfig>(DEFAULT_CONFIG);
  const [apiKeys, setApiKeys] = useState<Record<string, APIKeyState>>(() => {
    return Object.entries(config.providers).reduce((acc, [provider, cfg]) => ({
      ...acc,
      [provider]: {
        value: cfg.apiKey || '',
        isChanged: false
      }
    }), {});
  });
  
  const [testStatuses, setTestStatuses] = useState<TestStatuses>({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const [featureConfig, setFeatureConfig] = useState<Record<AiFeature, FeatureMapping>>(
    DEFAULT_FEATURES
  );
  const [keyVerification, setKeyVerification] = useState<{
    status: 'idle' | 'verifying' | 'success' | 'error';
    message?: string;
  }>({ status: 'idle' });
  const enabledProviders = Object.entries(config.providers)
  .filter(([_, cfg]) => cfg?.enabled)
  .map(([provider]) => provider as Provider);


  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await makeExtensionRequest(
          `/api/extension/ai-projects/${projectId}/ai-config`,
          { method: 'GET' }
        );

        if (!response.ok) {
          throw new Error('Failed to load configuration');
        }

        const data = await response.json();
        
        console.log('Loaded config:', data);
        if (data.providers) {
          const savedKeys: Record<string, APIKeyState> = {};
          const savedConfig = { ...DEFAULT_CONFIG };
        
          Object.entries(data.providers).forEach(([provider, providerConfig]: [string, any]) => {
            if (providerConfig.enabled) {
              // Add keys for this provider
              savedKeys[provider] = {
                value: providerConfig.apiKey || '',
                isChanged: false
              };
        
              // Update config for this provider
              savedConfig.providers[provider as keyof typeof savedConfig.providers] = {
                model: providerConfig.model,
                apiKey: providerConfig.apiKey,
                temperature: providerConfig.temperature,
                maxTokens: providerConfig.maxTokens,
                enabled: true
              };
            }
          });
        
          setApiKeys(savedKeys);
          setConfig(savedConfig);
          setFeatureConfig(data.features || DEFAULT_FEATURES);

        }
      } catch (error) {
        console.error('Error loading config:', error);
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, [projectId]);


  const handleApiKeyChange = (provider: string, newValue: string) => {
    setApiKeys(prev => ({
      ...prev,
      [provider]: {
        value: newValue,
        isChanged: true
      }
    }));
  };
  const verifyKeys = async () => {
    setKeyVerification({ status: 'verifying' });
    try {
      const response = await makeExtensionRequest(
        `/api/extension/tool/stratum/verify-keys`,
        { method: 'POST' },
        { publicKey: process.env.NEXT_PUBLIC_ENCRYPTION_KEY }
      );
  
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Verification failed');
      }
  
      setKeyVerification({ 
        status: 'success', 
        message: 'Encryption keys verified successfully' 
      });
    } catch (error) {
      setKeyVerification({ 
        status: 'error', 
        message: error instanceof Error ? error.message : 'Verification failed' 
      });
    }
  };
// components/AIConfigForm.tsx
const saveConfig = async () => {
  setSaving(true);
  try {
    const publicKey = process.env.NEXT_PUBLIC_ENCRYPTION_KEY!;
    const encryptedConfig: AIConfig = {
      providers: {},
      features: featureConfig,
      defaultProvider: 'anthropic'
    };

    // Process each provider
    for (const provider of PROVIDERS) {
      const providerId = provider.id as keyof AIConfig['providers'];
      const apiKey = apiKeys[providerId];
      const providerPreferences = config.providers[providerId];

      if (providerPreferences?.enabled) {
        let encryptedKey = apiKey.isChanged ? 
          encryptMessage(apiKey.value, publicKey) : 
          apiKey.value;

        encryptedConfig.providers[providerId] = {
          enabled: true,
          apiKey: encryptedKey,
          model: providerPreferences.model,
          temperature: providerPreferences.temperature,
          maxTokens: providerPreferences.maxTokens
        };
      }
    }

    const response = await makeExtensionRequest(
      `/api/extension/ai-projects/${projectId}/ai-config`,
      { method: 'PATCH' },
      encryptedConfig
    );

    if (!response.ok) throw new Error('Failed to save configuration');

  } catch (error) {
    console.error('Error saving config:', error);
  } finally {
    setSaving(false);
  }
};
  const testIntegration = async (provider: string) => {
    setTestStatuses(prev => ({
      ...prev,
      [provider]: { status: 'testing' }
    }));
    
    try {
      const response = await makeExtensionRequest(
        `/api/extension/ai-projects/${projectId}/test-integration`,
        { method: 'POST' },
        { provider }
      );

      const data = await response.json();
      
      setTestStatuses(prev => ({
        ...prev,
        [provider]: {
          status: data.success ? 'success' : 'error',
          message: data.message || data.error,
          details: data.details
        }
      }));
    } catch (error) {
      setTestStatuses(prev => ({
        ...prev,
        [provider]: {
          status: 'error',
          message: error instanceof Error ? error.message : 'Test failed'
        }
      }));
    }
  };


  const updateProviderConfig = (provider: keyof typeof config.providers, updates: Partial<ProviderPreferences>) => {
    setConfig(prev => ({
      ...prev,
      providers: {
        ...prev.providers,
        [provider]: {
          ...prev.providers[provider]!,
          ...updates
        }
      }
    }));
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }


  return (
    <div className="space-y-6">
      {/* API Key Configuration */}

<KeyGeneration projectId={projectId} />
      <Card>
      <CardHeader>
        <CardTitle>Encryption Setup</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium">
              Verify encryption configuration before saving API keys
            </p>
            <p className="text-sm text-muted-foreground">
              This ensures your API keys will be properly encrypted
            </p>
          </div>
          <Button 
            variant="outline"
            onClick={verifyKeys}
            disabled={keyVerification.status === 'verifying'}
          >
            {keyVerification.status === 'verifying' ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              'Verify Keys'
            )}
          </Button>
        </div>

        {keyVerification.status === 'success' && (
          <Alert className="mt-4">
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Keys Verified</AlertTitle>
            <AlertDescription>
              Encryption is properly configured
            </AlertDescription>
          </Alert>
        )}

        {keyVerification.status === 'error' && (
          <Alert variant="destructive" className="mt-4">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Verification Failed</AlertTitle>
            <AlertDescription>
              {keyVerification.message}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">API Keys</h3>
        <p className="text-sm text-muted-foreground">
          Configure your AI provider keys. Keys are encrypted before storage and only used
          for direct API calls.
        </p>
        
        <div className="space-y-4">




        <h3 className="text-lg font-medium">API Providers</h3>
        



        {PROVIDERS.map((provider) => (
          <Card key={provider.id}>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{provider.name}</h4>
                  <Switch
                    checked={config.providers[provider.id as keyof typeof config.providers]?.enabled || false}
                    onCheckedChange={(enabled) => 
                      updateProviderConfig(provider.id as keyof typeof config.providers, { enabled })
                    }
                  />
                </div>

                {config.providers[provider.id as keyof typeof config.providers]?.enabled && (
                  <>
                    <div className="space-y-4">
                      {/* API Key input */}
                      <div className="flex gap-2">
                      <Input
  type="password"
  placeholder={provider.keyPlaceholder}
  value={apiKeys[provider.id]?.value || ''}
  onChange={(e) => handleApiKeyChange(provider.id, e.target.value)}
  className="flex-1"
/>
                        <Button
                          variant="outline"
                          onClick={() => testIntegration(provider.id)}
                          disabled={!apiKeys[provider.id]}
                        >
                          Test
                        </Button>
                      </div>

                      {/* Model selection */}
                      <Select
                        value={config.providers[provider.id as keyof typeof config.providers]?.model}
                        onValueChange={(model) => 
                          updateProviderConfig(provider.id as keyof typeof config.providers, { model })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a model" />
                        </SelectTrigger>
                        <SelectContent>
                          {provider.models.map((model) => (
                            <SelectItem key={model.id} value={model.id}>
                              <div className="flex flex-col">
                                <span>{model.name}</span>
                                <span className="text-xs text-muted-foreground">
                                  {model.description}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {/* Test status */}
                      {testStatuses[provider.id] && testStatuses[provider.id].status !== 'idle' && (
                        <Alert variant={testStatuses[provider.id].status === 'success' ? 'default' : 'destructive'}>
                          <AlertTitle>
                            {testStatuses[provider.id].status === 'success' ? 'Success' : 'Error'}
                          </AlertTitle>
                          <AlertDescription>
                            {testStatuses[provider.id].message}
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      </div>

      <FeatureProviderSelection
  config={featureConfig}
  onUpdate={setFeatureConfig}
  enabledProviders={enabledProviders}
/>

      {/* Save Button */}
      <Button
        className="w-full"
        onClick={saveConfig}
        disabled={saving || !apiKeys.anthropic}
      >
        {saving ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving Configuration...
          </>
        ) : (
          'Save Configuration'
        )}
      </Button>


    </div>
  )
}