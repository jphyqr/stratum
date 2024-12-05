// types/ai-config.ts
export type Provider = 'anthropic' | 'openai';

export type AnthropicModel = 'claude-3-opus-20240229' | 'claude-3-sonnet-20240229';
export type OpenAIModel = 'gpt-4-turbo-preview' | 'gpt-4' | 'gpt-3.5-turbo';
export type SupportedModel = AnthropicModel | OpenAIModel;

export interface ProviderConfig {
  enabled: boolean;
  apiKey: string | null;
  model: SupportedModel;
  temperature: number;
  maxTokens: number;
}

export type AiFeature = 
  | 'generate-logos'
  | 'enhance-writing' 
  | 'color-suggestions'
  | 'generate-metrics'
  | 'generate-markets'
  | 'enhance-strategy'
  | 'generate-competitors'
  | 'generate-content-strategy'
  | 'generate-initial-clusters'
  | 'generate-single-cluster'
  | 'generate-keywords-for-cluster'
  | 'generate-content-briefs-for-cluster'

export interface FeatureMapping {
  provider: Provider;
  model: SupportedModel;
}

export interface AIConfig {
  providers: {
    anthropic?: ProviderConfig;
    openai?: ProviderConfig;
  };
  features: Record<AiFeature, FeatureMapping>;
  defaultProvider: Provider;
}

export const PROVIDER_MODELS: Record<Provider, SupportedModel[]> = {
  anthropic: ['claude-3-opus-20240229', 'claude-3-sonnet-20240229'],
  openai: ['gpt-4-turbo-preview', 'gpt-4', 'gpt-3.5-turbo']
};

export const FEATURE_CONSTRAINTS: Partial<Record<AiFeature, Provider[]>> = {
  'generate-logos': ['anthropic'], // Anthropic only for SVG generation
};