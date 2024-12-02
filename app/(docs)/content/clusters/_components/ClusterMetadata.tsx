'use client';

import { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import type { ClusterMetadata } from '../types';

interface ClusterMetadataProps {
  metadata: ClusterMetadata;
  isEditing: boolean;
  onSave: (metadata: ClusterMetadata) => void;
}
const initializeMetadata = (metadata: Partial<ClusterMetadata>): ClusterMetadata => ({
    targetPersonas: metadata.targetPersonas || [],
    supportedGoals: metadata.supportedGoals || [],
    searchIntent: metadata.searchIntent || '',
    competitorContent: {
      urls: metadata.competitorContent?.urls || [],
      analysis: metadata.competitorContent?.analysis || ''
    },
    businessAlignment: {
      productFeatures: metadata.businessAlignment?.productFeatures || [],
      valueProps: metadata.businessAlignment?.valueProps || []
    }
  });


export function ClusterMetadataSection({ metadata: initialMetadata, isEditing, onSave }: ClusterMetadataProps) {
    
    const defaultMetadata: ClusterMetadata = {
        targetPersonas: [],
        supportedGoals: [],
        searchIntent: '',
        competitorContent: {
          urls: [],
          analysis: ''
        },
        businessAlignment: {
          productFeatures: [],
          valueProps: []
        }
      };
    const [metadata, setMetadata] = useState<ClusterMetadata>({
        ...defaultMetadata,
        ...initialMetadata
    });

  const updateMetadata = <K extends keyof ClusterMetadata>(field: K, value: ClusterMetadata[K]) => {
    setMetadata(prev => {
      const updated = { ...prev, [field]: value };
      onSave(updated);
      return updated;
    });
  };
    // For nested updates, create specific handlers
    const updateCompetitorContent = (updates: Partial<ClusterMetadata['competitorContent']>) => {
        updateMetadata('competitorContent', {
          urls: updates.urls ?? metadata.competitorContent.urls,
          analysis: updates.analysis ?? metadata.competitorContent.analysis
        });
      };
    
      const updateBusinessAlignment = (updates: Partial<ClusterMetadata['businessAlignment']>) => {
        updateMetadata('businessAlignment', {
          productFeatures: updates.productFeatures ?? metadata.businessAlignment.productFeatures,
          valueProps: updates.valueProps ?? metadata.businessAlignment.valueProps
        });
      };
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="metadata">
        <AccordionTrigger>Strategic Details</AccordionTrigger>
        <AccordionContent className="space-y-6">
          {isEditing ? (
            <>
              {/* Target Personas */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Target Personas</label>
                <div className="flex flex-wrap gap-2">
                  {metadata.targetPersonas.map((persona, i) => (
                    <div key={i} className="flex items-center gap-1">
                      <Input 
                        value={persona}
                        onChange={(e) => {
                          const newPersonas = [...metadata.targetPersonas];
                          newPersonas[i] = e.target.value;
                          updateMetadata('targetPersonas', newPersonas);
                        }}
                        className="w-40"
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          const newPersonas = metadata.targetPersonas.filter((_, idx) => idx !== i);
                          updateMetadata('targetPersonas', newPersonas);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateMetadata('targetPersonas', [...metadata.targetPersonas, ''])}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Persona
                  </Button>
                </div>
              </div>

              {/* Supported Goals */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Supported Goals</label>
                <div className="flex flex-wrap gap-2">
                  {metadata.supportedGoals.map((goal, i) => (
                    <div key={i} className="flex items-center gap-1">
                      <Input 
                        value={goal}
                        onChange={(e) => {
                          const newGoals = [...metadata.supportedGoals];
                          newGoals[i] = e.target.value;
                          updateMetadata('supportedGoals', newGoals);
                        }}
                        className="w-40"
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          const newGoals = metadata.supportedGoals.filter((_, idx) => idx !== i);
                          updateMetadata('supportedGoals', newGoals);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateMetadata('supportedGoals', [...metadata.supportedGoals, ''])}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Goal
                  </Button>
                </div>
              </div>

              {/* Search Intent */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Search Intent</label>
                <Textarea
                  value={metadata.searchIntent || ''}
                  onChange={(e) => updateMetadata('searchIntent', e.target.value)}
                  placeholder="Describe the search intent this cluster targets..."
                  rows={3}
                />
              </div>

              {/* Competitor Content */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Competitor Content</label>
                <div className="space-y-4">
                  {/* URLs */}
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">URLs</label>
                    <div className="flex flex-wrap gap-2">
                      {metadata.competitorContent?.urls.map((url, i) => (
                        <div key={i} className="flex items-center gap-1">
                          <Input 
                            value={url}
                            onChange={(e) => {
                              const newUrls = [...(metadata.competitorContent?.urls || [])];
                              newUrls[i] = e.target.value;
                              updateMetadata('competitorContent', {
                                ...metadata.competitorContent,
                                urls: newUrls
                              });
                            }}
                            className="w-64"
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              const newUrls = metadata.competitorContent?.urls.filter((_, idx) => idx !== i);
                              updateMetadata('competitorContent', {
                                ...metadata.competitorContent,
                                urls: newUrls || []
                              });
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateCompetitorContent({
                            urls: [...metadata.competitorContent.urls, '']
                          })}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add URL
                      </Button>
                    </div>
                  </div>
                  {/* Analysis */}
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Analysis</label>
                    <Textarea
                      value={metadata.competitorContent?.analysis || ''}
                      onChange={(e) => updateMetadata('competitorContent', {
                        ...metadata.competitorContent,
                        analysis: e.target.value
                      })}
                      placeholder="Analysis of competitor content..."
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* Business Alignment */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Business Alignment</label>
                <div className="space-y-4">
                  {/* Product Features */}
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Product Features</label>
                    <div className="flex flex-wrap gap-2">
                      {metadata.businessAlignment?.productFeatures.map((feature, i) => (
                        <div key={i} className="flex items-center gap-1">
                          <Input 
                            value={feature}
                            onChange={(e) => {
                              const newFeatures = [...(metadata.businessAlignment?.productFeatures || [])];
                              newFeatures[i] = e.target.value;
                              updateMetadata('businessAlignment', {
                                ...metadata.businessAlignment,
                                productFeatures: newFeatures
                              });
                            }}
                            className="w-40"
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              const newFeatures = metadata.businessAlignment?.productFeatures.filter((_, idx) => idx !== i);
                              updateMetadata('businessAlignment', {
                                ...metadata.businessAlignment,
                                productFeatures: newFeatures || []
                              });
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateBusinessAlignment({
                            productFeatures: [...metadata.businessAlignment.productFeatures, '']
                          })}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Feature
                      </Button>
                    </div>
                  </div>
                  {/* Value Props */}
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Value Props</label>
                    <div className="flex flex-wrap gap-2">
                      {metadata.businessAlignment?.valueProps.map((prop, i) => (
                        <div key={i} className="flex items-center gap-1">
                          <Input 
                            value={prop}
                            onChange={(e) => {
                              const newProps = [...(metadata.businessAlignment?.valueProps || [])];
                              newProps[i] = e.target.value;
                              updateMetadata('businessAlignment', {
                                ...metadata.businessAlignment,
                                valueProps: newProps
                              });
                            }}
                            className="w-40"
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              const newProps = metadata.businessAlignment?.valueProps.filter((_, idx) => idx !== i);
                              updateMetadata('businessAlignment', {
                                ...metadata.businessAlignment,
                                valueProps: newProps || []
                              });
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateMetadata('businessAlignment', {
                          ...metadata.businessAlignment,
                          valueProps: [...(metadata.businessAlignment?.valueProps || []), '']
                        })}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Value Prop
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* View Mode */}
              <div className="space-y-6">
                {/* Target Personas */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Target Personas</h4>
                  <div className="flex flex-wrap gap-2">
                    {metadata.targetPersonas.map((persona, i) => (
                      <Badge key={i} variant="secondary">{persona}</Badge>
                    ))}
                  </div>
                </div>

                {/* Supported Goals */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Supported Goals</h4>
                  <div className="flex flex-wrap gap-2">
                    {metadata.supportedGoals.map((goal, i) => (
                      <Badge key={i} variant="secondary">{goal}</Badge>
                    ))}
                  </div>
                </div>

                {/* Search Intent */}
                {metadata.searchIntent && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Search Intent</h4>
                    <p className="text-sm text-muted-foreground">{metadata.searchIntent}</p>
                  </div>
                )}

                {/* Competitor Content */}
                {metadata.competitorContent && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Competitor Content</h4>
                    {metadata.competitorContent.urls.length > 0 && (
                      <div className="space-y-1">
                        <h5 className="text-sm text-muted-foreground">URLs:</h5>
                        <ul className="list-disc list-inside text-sm">
                          {metadata.competitorContent.urls.map((url, i) => (
                            <li key={i}>{url}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {metadata.competitorContent.analysis && (
                      <div className="space-y-1">
                        <h5 className="text-sm text-muted-foreground">Analysis:</h5>
                        <p className="text-sm">{metadata.competitorContent.analysis}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Business Alignment */}
                {metadata.businessAlignment && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Business Alignment</h4>
                    {metadata.businessAlignment.productFeatures.length > 0 && (
                      <div className="space-y-1">
                        <h5 className="text-sm text-muted-foreground">Product Features:</h5>
                        <div className="flex flex-wrap gap-2">
                          {metadata.businessAlignment.productFeatures.map((feature, i) => (
                            <Badge key={i} variant="outline">{feature}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {metadata.businessAlignment.valueProps.length > 0 && (
                      <div className="space-y-1">
                        <h5 className="text-sm text-muted-foreground">Value Props:</h5>
                        <div className="flex flex-wrap gap-2">
                          {metadata.businessAlignment.valueProps.map((prop, i) => (
                            <Badge key={i} variant="outline">{prop}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}