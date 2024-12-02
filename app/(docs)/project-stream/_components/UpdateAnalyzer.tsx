// app/(docs)/product-stream/_components/UpdateAnalyzer.tsx
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  AlertCircle, 
  CheckCircle2, 
  GitMerge, 
  Plus, 
  RefreshCw, 
  Activity,
  BookOpen,
  Brain,
  Clock
} from 'lucide-react';
import { 
  ExtractionResult, 
  WorkType, 
  Status,
  StoryType 
} from '../types';

interface AnalysisSection {
  title: string;
  type: 'NEW' | 'UPDATE';
  confidence: number;
  changes?: any;
  data?: any;
}

interface CompleteAnalysis {
  workItems: AnalysisSection[];
  session: AnalysisSection;
  health: AnalysisSection;
  stories: AnalysisSection[];
}

export function UpdateAnalyzer({ 
  extractedData, 
  onAnalysisComplete 
}: { 
  extractedData: ExtractionResult;
  onAnalysisComplete: (analysis: CompleteAnalysis) => void;
}) {
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<CompleteAnalysis | null>(null);

  const analyzeUpdates = () => {
    setAnalyzing(true);
    
    // For now, treat everything as new
    setTimeout(() => {
      const analysisResult: CompleteAnalysis = {
        workItems: extractedData.workItems.map(item => ({
          title: item.title,
          type: 'NEW',
          confidence: 0.95,
          data: item
        })),
        session: {
          title: 'Development Session',
          type: 'NEW',
          confidence: 0.9,
          data: extractedData.session
        },
        health: {
          title: 'Project Health',
          type: 'NEW',
          confidence: 0.85,
          data: extractedData.health
        },
        stories: extractedData.stories.map(story => ({
          title: story.type,
          type: 'NEW',
          confidence: 0.9,
          data: story
        }))
      };

      setAnalysis(analysisResult);
      setAnalyzing(false);
    }, 1500);
  };

  const renderAnalysisCard = (
    section: AnalysisSection,
    icon: React.ReactNode,
    children: React.ReactNode
  ) => (
    <Card className="border border-muted">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 mb-4">
            {icon}
            <h3 className="font-semibold">{section.title}</h3>
            <Badge variant={section.type === 'NEW' ? 'default' : 'secondary'}>
              {section.type === 'NEW' ? (
                <Plus className="mr-1 h-3 w-3" />
              ) : (
                <GitMerge className="mr-1 h-3 w-3" />
              )}
              {section.type}
            </Badge>
            <Badge 
              variant={section.confidence > 0.8 ? "default" : "destructive"}
              className="h-6"
            >
              {section.confidence > 0.8 ? (
                <CheckCircle2 className="mr-1 h-3 w-3" />
              ) : (
                <AlertCircle className="mr-1 h-3 w-3" />
              )}
              {Math.round(section.confidence * 100)}%
            </Badge>
          </div>
        </div>
        {children}
      </CardContent>
    </Card>
  );

  if (!analysis) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Analyze Updates</CardTitle>
          <CardDescription>
            Analyze extracted context for updates and new content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={analyzeUpdates} 
            disabled={analyzing}
            className="w-full"
          >
            {analyzing ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Analyzing Changes
              </>
            ) : (
              <>
                <Brain className="mr-2 h-4 w-4" />
                Analyze Context
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Context Analysis</CardTitle>
        <CardDescription>
          Review extracted context before applying updates
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Work Items */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Work Items</h3>
            {analysis.workItems.map((item, index) => (
              renderAnalysisCard(
                item,
                <Clock className="h-4 w-4 text-muted-foreground" />,
                <div className="space-y-2 text-sm">
                  <p className="text-muted-foreground">{item.data.scope}</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="font-medium">Progress:</span>
                      <div className="ml-4">
                        <div>API: {item.data.progress.api}%</div>
                        <div>UI: {item.data.progress.ui}%</div>
                        <div>Tests: {item.data.progress.tests}%</div>
                      </div>
                    </div>
                    <div>
                      <span className="font-medium">Next Steps:</span>
                      <ul className="ml-4 list-disc">
                        {item.data.nextSteps.map((step: string, i: number) => (
                          <li key={i}>{step}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )
            ))}
          </div>

          {/* Session Context */}
          {renderAnalysisCard(
            analysis.session,
            <Brain className="h-4 w-4 text-muted-foreground" />,
            <div className="space-y-4 text-sm">
              <div>
                <span className="font-medium">Active Work:</span>
                <ul className="ml-4 list-disc">
                  {analysis.session.data.activeWork.map((work: string, i: number) => (
                    <li key={i}>{work}</li>
                  ))}
                </ul>
              </div>
              <div>
                <span className="font-medium">Decisions:</span>
                <ul className="ml-4 list-disc">
                  {analysis.session.data.decisions.map((decision: string, i: number) => (
                    <li key={i}>{decision}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Project Health */}
          {renderAnalysisCard(
            analysis.health,
            <Activity className="h-4 w-4 text-muted-foreground" />,
            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-medium">Velocity:</span>
                <Badge>{analysis.health.data.velocity}</Badge>
              </div>
              <div>
                <span className="font-medium">Risks:</span>
                <ul className="ml-4 list-disc">
                  {analysis.health.data.risks.map((risk: string, i: number) => (
                    <li key={i}>{risk}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Content Generation */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Content Opportunities</h3>
            {analysis.stories.map((story, index) => (
              renderAnalysisCard(
                story,
                <BookOpen className="h-4 w-4 text-muted-foreground" />,
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{story.data.audience}</Badge>
                    <Badge variant="outline">{story.data.type}</Badge>
                  </div>
                  <div>
                    <span className="font-medium">Key Hooks:</span>
                    <ul className="ml-4 list-disc">
                      {story.data.hooks.map((hook: string, i: number) => (
                        <li key={i}>{hook}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={analyzeUpdates}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Re-analyze
          </Button>
          <Button onClick={() => onAnalysisComplete(analysis)}>
            Apply All Updates
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}