// app/(docs)/instructions/_components/ProjectViewer.tsx
'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertCircle, Bot, Check, Code2, Copy, ExternalLink, FileJson, FileText, FlaskConical, GitBranch, Layers, Sparkles, Wand2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { InstructionDialog } from './InstructionDialog';

import { SuperPromptsPanel } from './SuperPromptsPanel';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import { ProjectWithIncludes } from '../page';
import { useToast } from '@/hooks/use-toast';
import { LayerTimeline } from './LayerTimeline';

interface ProjectViewerProps {
  project: ProjectWithIncludes;
}
interface ParsedFile {
  path: string;
  content: string;
  analysis?: {
    rules?: string[];
  };
}
export function ProjectViewer({ project }: ProjectViewerProps) {
  const { toast } = useToast();
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null);
  const [highlightedLayerId, setHighlightedLayerId] = useState<string | null>(null);

  const [parsedFiles, setParsedFiles] = useState<ParsedFile[]>([]);
  const [showCompiledInstructions, setShowCompiledInstructions] = useState(false);
const [compiledInstructions, setCompiledInstructions] = useState('');

const parseProjestFiles = (instructions: string): ParsedFile[] => {
  try {
    const files: ParsedFile[] = [];
    
    const pathContentPattern = /<path>(.*?)<\/path>[\s\S]*?<content>(?:\<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/content>/g;
    
    // Pattern 2: Match source_file/implementation style
    const sourceFilePattern = /<source_file>(.*?)<\/source_file>[\s\S]*?<implementation>(?:\<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/implementation>/g;
    
    // Find all matches for path/content style
    const pathContentMatches = instructions.matchAll(pathContentPattern);
    for (const match of pathContentMatches) {
      const [_, path, content] = match;
      if (path && content) {
        files.push({
          path: path.trim(),
          content: content.trim(),
        });
      }
    }

    // Find all matches for source_file/implementation style
    const sourceFileMatches = instructions.matchAll(sourceFilePattern);
    for (const match of sourceFileMatches) {
      const [_, path, content] = match;
      if (path && content) {
        files.push({
          path: path.trim(),
          content: content.trim(),
        });
      }
    }

    // Remove duplicates (in case same file is defined multiple ways)
    const uniqueFiles = files.filter((file, index, self) =>
      index === self.findIndex((f) => f.path === file.path)
    );

    // Sort files by path
    return uniqueFiles.sort((a, b) => a.path.localeCompare(b.path));

  } catch (error) {
    console.error('Error parsing project files:', error);
    return [];
  }
};

// Optional: Add analysis rules if needed
const parseFileRules = (instructions: string): Record<string, string[]> => {
  const rules: Record<string, string[]> = {};
  
  // Match file paths and their associated rules
  const rulePattern = /<path>(.*?)<\/path>[\s\S]*?<analysis>[\s\S]*?<rule>(.*?)<\/rule>/g;
  const matches = instructions.matchAll(rulePattern);
  
  for (const match of matches) {
    const [_, path, rule] = match;
    if (path && rule) {
      if (!rules[path]) rules[path] = [];
      rules[path].push(rule.trim());
    }
  }
  
  return rules;
};


  const compileInstructions = () => {
    try {
      // Compile instructions from active layers
      const activeLayers = project.layers
        .filter(layer => layer.isActive && layer.aiOptimizedInstructions)
        .sort((a, b) => a.baseLayer.order - b.baseLayer.order);
  
      const instructions = `<?xml version="1.0" encoding="UTF-8"?>
<instructions timestamp="${new Date().toISOString()}">
  ${activeLayers.map(layer => `
  <layer id="${layer.id}" type="${layer.baseLayer.category}" order="${layer.baseLayer.order}">
    <metadata>
      <name>${layer.baseLayer.name}</name>
    </metadata>
    <content>
      ${layer.aiOptimizedInstructions}
    </content>
  </layer>`).join('\n')}
</instructions>`;
  
      setCompiledInstructions(instructions);

          // Parse files using our new parser
       // Parse files
       const files = parseProjestFiles(instructions);
    
       // Optionally get rules
       const rules = parseFileRules(instructions);
       
       // Combine files and rules
       const filesWithRules = files.map(file => ({
         ...file,
         analysis: rules[file.path] ? { rules: rules[file.path] } : undefined
       }));
       
       setParsedFiles(filesWithRules);

    } catch (error) {
      toast({
        title: "Compilation Failed",
        description: "Failed to compile instructions. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleCopyInstructions = async () => {
    await navigator.clipboard.writeText(compiledInstructions);
    toast({
      title: "Copied",
      description: "Instructions copied to clipboard",
    });
  };

  const handleCompileInstructions = async () => {
    setIsCompiling(true);
    try {
      // Compile instructions from active layers
      const activeLayers = project.layers
        .filter(layer => layer.isActive && layer.aiOptimizedInstructions)
        .sort((a, b) => a.order - b.order);
  
      const instructions = `<?xml version="1.0" encoding="UTF-8"?>
  <instructions timestamp="${new Date().toISOString()}">
    ${activeLayers.map(layer => `
    <layer id="${layer.id}" type="${layer.baseLayer.category}" order="${layer.order}">
      <metadata>
        <name>${layer.baseLayer.name}</name>
     
      </metadata>
      <content>
        ${layer.aiOptimizedInstructions}
      </content>
    </layer>`).join('\n  ')}
  </instructions>`;
  
      setCompiledInstructions(instructions);
      setShowCompiledInstructions(true);
      

      // Parse files using our new parser
      const files = parseProjestFiles(instructions);
      setParsedFiles(files);
  
console.log(files)


      toast({
        title: "Instructions Compiled",
        description: "Your AI instructions have been updated with the latest changes.",
      });
    } catch (error) {
      toast({
        title: "Compilation Failed",
        description: "Failed to compile instructions. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCompiling(false);
    }
  };


  useEffect(() => { compileInstructions(); }, [project.layers]);




  const [activeView, setActiveView] = useState<'instructions' | 'files' | 'insights' | 'experimental'>('instructions');
  const [isCompiling, setIsCompiling] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const activeWorkspace = project.workspaces.find(w => w.isActive);
  const completedLayers = project.layers.map(l => l.baseLayer.name);

  // Calculate completion and status
  const stats = useMemo(() => {
    const total = project.layers.length;
    const configured = project.layers.filter(l => l.aiOptimizedInstructions).length;
    return {
      progress: total > 0 ? (configured / total) * 100 : 0,
      activeLayers: project.layers.filter(l => l.isActive).length,
      totalLayers: total
    };
  }, [project.layers]);


  const handleLayerSelect = (layerName: string) => {
    setSelectedLayer(layerName);
    setActiveView('instructions'); // Switch to instructions view to show layer component

    const selectedLayer = project.layers.find(l => l.baseLayer.name === layerName);
    if (selectedLayer) {
      setHighlightedLayerId(selectedLayer.id);
      

    }
  };
  const handleOpenVSCode = useCallback(async () => {
    if (!activeWorkspace) return;
    
    const openInVSCode = async () => {
      try {
        const uris = [
          `vscode://file${activeWorkspace.rootPath}`,
          `vscode://tndevs/open/${encodeURIComponent(activeWorkspace.rootPath)}`,
          `vscode://vscode.open-folder/${encodeURIComponent(activeWorkspace.rootPath)}`
        ];
  
        for (const uri of uris) {
          try {
            window.open(uri);
            await new Promise(resolve => setTimeout(resolve, 1000));
            return true;
          } catch (e) {
            console.log('URI failed:', uri, e);
          }
        }
        return false;
      } catch (error) {
        console.error('Failed to open VS Code:', error);
        return false;
      }
    };
  
    const success = await openInVSCode();
    
    if (!success) {
      toast({
        title: "Opening Project",
        description: "If VS Code doesn't open automatically, copy the path and open it manually:",
        action: (
          <div className="mt-2 flex flex-col gap-2">
            <code className="p-2 bg-secondary rounded text-sm">
              {activeWorkspace.rootPath}
            </code>
            <Button 
              onClick={() => {
                navigator.clipboard.writeText(activeWorkspace.rootPath);
                toast({
                  title: "Path Copied",
                  description: "Project path copied to clipboard"
                });
              }}
              size="sm"
            >
              Copy Path
            </Button>
          </div>
        ),
        duration: 10000,
      });
    }
  }, [activeWorkspace, toast]);




  interface InstructionsViewProps {
    compiledInstructions: string;
    handleCopyInstructions: () => void;
    highlightedLayerId: string | null;  // Add this prop
  }

  function InstructionsView({ 
    compiledInstructions, 
    handleCopyInstructions,
    highlightedLayerId  // Accept the prop
  }: InstructionsViewProps) {


    useEffect(() => {
      if (highlightedLayerId) {
        // Small delay to ensure the DOM is ready
        setTimeout(() => {
          const element = document.querySelector(`[data-layer-id="${highlightedLayerId}"]`);
          if (element) {
            element.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center'
            });
          }
        }, 100);
      }
    }, [highlightedLayerId]);
        // Split instructions into layers and wrap each with a data attribute
        const formattedInstructions = useMemo(() => {
          return compiledInstructions.split(/<layer/).map((part, index) => {
            if (index === 0) return part;
      
            const layerIdMatch = part.match(/id="([^"]+)"/);
            const layerId = layerIdMatch ? layerIdMatch[1] : '';
            
            return (
              <div 
                key={layerId}
                data-layer-id={layerId}
                className={cn(
                  "transition-colors duration-300",
                  highlightedLayerId === layerId && "bg-primary/10 -mx-4 px-4 py-2 rounded"
                )}
              >
                <pre className="text-sm font-mono whitespace-pre-wrap">
                  {'<layer' + part}
                </pre>
              </div>
            );
          });
        }, [compiledInstructions, highlightedLayerId]);
        return (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={handleCopyInstructions}>
                <Copy className="h-4 w-4 mr-2" />
                Copy Instructions
              </Button>
            </div>
            <ScrollArea className="h-[calc(100vh-32rem)] w-full rounded-md border bg-muted">
              <div className="p-4">
                {formattedInstructions}
              </div>
            </ScrollArea>
          </div>
        );
  }
  
  function ProjectFilesView({ parsedFiles }: { 
    parsedFiles: Array<{
      path: string;
      content: string;
      analysis?: {
        rules?: string[];
      };
    }>;
  }) {
    return (
      <ScrollArea className="h-[calc(100vh-32rem)]">
        <Accordion type="single" collapsible className="w-full">
          {parsedFiles.map((file, index) => (
            <AccordionItem key={index} value={file.path}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span className="font-mono text-sm">{file.path}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <ScrollArea className="h-[300px] w-full rounded-md border bg-muted">
                    <pre className="p-4 text-sm font-mono">{file.content}</pre>
                  </ScrollArea>
                  {file.analysis?.rules?.length&&file.analysis?.rules?.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Implementation Rules:</h4>
                      <ul className="list-disc pl-4 space-y-1">
                        {file.analysis.rules.map((rule, ruleIndex) => (
                          <li key={ruleIndex} className="text-sm text-muted-foreground">
                            {rule}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </ScrollArea>
    );
  }
  

  return (
    <>
      <Dialog open={showInstructions} onOpenChange={setShowInstructions}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Open Project in VS Code</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>If VS Code did not open automatically, you can:</p>
            <ol className="list-decimal ml-4 space-y-2">
              <li>Open VS Code manually</li>
              <li>Open the command palette (Cmd/Ctrl + Shift + P)</li>
              <li>Type TNDevs: Open Project</li>
              <li>Enter this path: <code className="bg-muted p-1 rounded">{activeWorkspace?.rootPath}</code></li>
            </ol>
          </div>
        </DialogContent>
      </Dialog>
      <InstructionDialog 
  open={showCompiledInstructions}
  onOpenChange={setShowCompiledInstructions}
  instructions={compiledInstructions}
/>
      <div className="grid grid-cols-12 gap-6 h-[calc(100vh-8rem)]">
        {/* Main Content Area */}
        <div className="col-span-8 space-y-6">
          {/* Project Header */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  {project.name}
                </CardTitle>
                <CardDescription>
                  {stats.activeLayers} active layers · {stats.progress.toFixed(0)}% configured
                </CardDescription>
              </div>
              <div className="flex gap-2">
                {activeWorkspace ? (
                  <Button 
                    variant="outline"
                    onClick={handleOpenVSCode}
                    className="gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Open in VS Code
                  </Button>
                ) : null}
                {/* <Button 
                  onClick={handleCompileInstructions}
                  disabled={isCompiling}
                  className="gap-2"
                >
                  <Wand2 className="h-4 w-4" />
                  {isCompiling ? 'Compiling...' : 'Compile Instructions'}
                </Button> */}
              </div>
            </CardHeader>
          </Card>

          {/* View Selector Cards */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { id: 'instructions', icon: Code2, label: 'Instructions' },
              { id: 'files', icon: FileJson, label: 'Project Files' },
              { id: 'insights', icon: Sparkles, label: 'AI Insights' },
              { id: 'experimental', icon: FlaskConical, label: 'Experiments' }
            ].map(view => (
              <Card 
                key={view.id}
                className={`cursor-pointer transition-all ${
                  activeView === view.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setActiveView(view.id as any)}
              >
                <CardContent className="pt-6 text-center">
                  <view.icon className="h-8 w-8 mb-2 mx-auto" />
                  <p className="font-medium">{view.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Dynamic Content Area */}
          <Card className="flex-1">
  <CardContent className="p-6">
    {!activeWorkspace ? (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No Active Workspace</AlertTitle>
        <AlertDescription>
          Open this project in VS Code to continue configuration.
        </AlertDescription>
      </Alert>
    ) : (
      <>
        { activeView === 'instructions' ? (
          <InstructionsView 
            compiledInstructions={compiledInstructions}
            handleCopyInstructions={handleCopyInstructions}
            highlightedLayerId={highlightedLayerId}
          />
        ) : activeView === 'files' ? (
          <ProjectFilesView parsedFiles={parsedFiles} />
        ) : (
          <div className="space-y-4">
            Other Views To Be Implemented
          </div>
        )}
      </>
    )}
  </CardContent>
</Card>
        </div>

        {/* Right Sidebar */}
        <div className="col-span-4 space-y-6">
          {/* Layer Timeline */}
          <Card>
          <CardHeader>
            <CardTitle>Layer Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <LayerTimeline 
              layers={project.layers}
              onLayerSelect={handleLayerSelect}
            />
          </CardContent>
        </Card>
          {/* AI Assistant */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                AI Assistant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Ask me anything about your project layers...
              </p>
            </CardContent>
          </Card>

          <SuperPromptsPanel />
        </div>
      </div>
    </>
  );
}