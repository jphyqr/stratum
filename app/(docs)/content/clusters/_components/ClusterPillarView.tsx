// app/(docs)/content/_components/ClusterPillarView.tsx
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { PillarCard } from './PillarCard';

import { ClusterWithCounts } from '../page';
import { SelectedClusterWrapper } from './SelectedClusterWrapper';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { usePathname, useRouter } from 'next/navigation';
import { TargetPersona } from '../layout';
import { Accordion, AccordionContent, AccordionItem } from '@/components/ui/accordion';
import { AccordionTrigger } from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';


interface ClusterPillarViewProps {
  clusters: ClusterWithCounts[];
  projectId: string;
    targetPersonas: TargetPersona[]
}
const MAX_PILLARS = 6;

export function ClusterPillarView({ clusters, projectId, targetPersonas }: ClusterPillarViewProps) {
    const router = useRouter();
    const [gridWidth, setGridWidth] = useState(0);
    const pathname = usePathname();
    const currentClusterId = pathname.match(/\/content\/clusters\/([^\/]+)$/)?.[1] || null;
    console.log('currentClusterId', currentClusterId);
    const handlePillarSelect = (clusterId: string) => {
      router.push(`/content/clusters/${clusterId}`);
    };

    useEffect(() => {
        // Update grid width after the component mounts
        const updateGridWidth = () => {
          const gridElement = document.querySelector('.grid');
          if (gridElement) {
            setGridWidth(gridElement.clientWidth);
          }
        };
    
        updateGridWidth();
        window.addEventListener('resize', updateGridWidth);
    
        return () => {
          window.removeEventListener('resize', updateGridWidth);
        };
      }, []);
    return (
        <div className="space-y-16"> {/* Increased spacing */}
      
          <div className="relative">

{StrategyEducation()}
      
            {/* Connection Lines with better curves */}
            <svg 
  className="absolute  left-0 w-full h-24" // Added border to see bounds
  style={{ zIndex: 0 }}
            >
 {gridWidth > 0 &&
            clusters.map((cluster, index) => {
              const cardWidth = gridWidth / clusters.length; // Width per card
              const startX = gridWidth / 2; // Center point for the starting position
              const startY = 0; // Top of SVG
              const endX = cardWidth * index + cardWidth / 2; // Center of each card
              const endY = 100; // Bottom of SVG

              // Control points for the curve
              const controlX1 = startX;
              const controlY1 = endY / 3;
              const controlX2 = endX;
              const controlY2 = (endY / 3) * 2;

              return (
                <path
                  key={cluster.id}
                  d={`M ${startX},${startY} C ${controlX1},${controlY1} ${controlX2},${controlY2} ${endX},${endY}`}
                  fill="none"
                  stroke="#6b7280"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  className="opacity-50"
                />
              );
            })}
            </svg>
      
            {/* Pillars Grid */}
            <div className="relative">
            <div         className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-4 px-4 pt-24 justify-center"
            >
  {clusters.map((cluster) => (
    <PillarCard
      key={cluster.id}
      cluster={cluster}
      isSelected={cluster.id === currentClusterId}
      onSelect={() => handlePillarSelect(cluster.id)}
    />
  ))}
</div>



    {/* Space for Funnel SVG */}
    <div >
      <svg className="w-full h-24">
        {clusters.map((_, index) => {
          const cardWidth = gridWidth / clusters.length; // Dynamically calculate based on grid width
          const startX = cardWidth * index + cardWidth / 2; // Center of each card
          const startY = 0; // Starting point below cards
          const endX = gridWidth / 2; // Center of the target user card
          const endY = 80; // Bottom of SVG (funnel target point)
          const controlX1 = startX;
          const controlY1 = (startY + endY) / 2;
          const controlX2 = endX;
          const controlY2 = (startY + endY) / 2;

          return (
            <path
              key={index}
              d={`M ${startX},${startY} C ${controlX1},${controlY1} ${controlX2},${controlY2} ${endX},${endY}`}
              fill="none"
              stroke="#6b7280"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              className="opacity-50"
            />
          );
        })}
      </svg>
    
    
{/* Target Personas Row */}
<div className="mt-8">
  <div className="flex gap-6 justify-center overflow-x-auto pb-4 px-4 snap-x">
    {targetPersonas.map((persona, index) => (
      <Card 
        key={index} 
        className="w-[300px] flex-shrink-0 snap-start bg-primary/5 hover:bg-primary/10 transition-all"
      >
        <CardContent className="p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xl">
              👤
            </div>
            <div>
              <h3 className="font-medium">{persona.name}</h3>
              <p className="text-sm text-muted-foreground">{persona.role}</p>
            </div>
          </div>
          <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="targetPersonas">
          <AccordionTrigger className='flex w-full justify-between text-xs'>Challenges <ChevronDown/></AccordionTrigger>
          <AccordionContent className="space-y-6">
          {/* Challenges */}
          <>
          <div className="space-y-2 mb-4">
            <h4 className="text-sm font-medium text-primary flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-destructive/50" />
              Challenges
            </h4>
            <ul className="space-y-1 text-sm text-muted-foreground pl-3">
              {persona.challenges.map((challenge, i) => (
                <li key={i}>{challenge}</li>
              ))}
            </ul>
          </div>

          {/* Goals */}
          <div className="space-y-2 mb-4">
            <h4 className="text-sm font-medium text-primary flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/50" />
              Goals
            </h4>
            <ul className="space-y-1 text-sm text-muted-foreground pl-3">
              {persona.goals.map((goal, i) => (
                <li key={i}>{goal}</li>
              ))}
            </ul>
          </div>

          {/* Content Preferences */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-primary">Content Preferences</h4>
            <div className="flex flex-wrap gap-2">
              {persona.contentPreferences.map((pref, i) => (
                <span 
                  key={i} 
                  className="text-xs px-2 py-1 bg-muted/20 rounded-full text-muted-foreground"
                >
                  {pref}
                </span>
              ))}
            </div>
          </div>
</>
            </AccordionContent>
            </AccordionItem>
            </Accordion>

        </CardContent>
      </Card>
    ))}
  </div>

  {/* Optional scroll indicators if content overflows */}
  {targetPersonas.length > 3 && (
    <div className="flex justify-center mt-4 gap-1">
      {targetPersonas.map((_, i) => (
        <div 
          key={i} 
          className="w-1.5 h-1.5 rounded-full bg-primary/20"
        />
      ))}
    </div>
  )}
</div>
    
    </div>




    </div>


          </div>

</div>
          
    
      );
}




function StrategyEducation() {
    return (
      <div className="grid grid-cols-3 gap-6">
        <Card className="bg-muted/5 hover:bg-muted/10 transition-all">
          <CardContent className="p-6">
            <div className="flex flex-col h-full">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  📚
                </div>
                <h3 className="font-medium">Example Strategies</h3>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-primary">James Clear</div>
                  <div className="flex flex-wrap gap-2">
                    {['Habits', 'Motivation', 'Focus', 'Life Lessons', 'Productivity'].map((pill) => (
                      <span key={pill} className="text-xs px-2 py-1 bg-muted/20 rounded-full">
                        {pill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-primary">HubSpot</div>
                  <div className="flex flex-wrap gap-2">
                    {['Content Marketing', 'Social Media', 'SEO', 'Email', 'Brand'].map((pill) => (
                      <span key={pill} className="text-xs px-2 py-1 bg-muted/20 rounded-full">
                        {pill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
  
        <Card className="bg-primary/5 hover:bg-primary/10 transition-all">
          <CardContent className="p-6">
            <div className="flex flex-col h-full">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  🎯
                </div>
                <h3 className="font-medium">Content Strategy</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Build strategic content pillars that:
              </p>
              <ul className="mt-4 space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                  Attract target audience at every stage
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                  Support natural content progression
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                  Build topical authority
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
  
        <Card className="bg-muted/5 hover:bg-muted/10 transition-all">
          <CardContent className="p-6">
            <div className="flex flex-col h-full">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  🚀
                </div>
                <h3 className="font-medium">Next Steps</h3>
              </div>
              <div className="relative mt-4">
                <div className="absolute left-2 top-0 bottom-0 w-px bg-muted/50" />
                <div className="space-y-4 pl-6">
                  <div>
                    <div className="text-sm font-medium">Keywords</div>
                    <p className="text-xs text-muted-foreground">Strategic keyword trees for each pillar</p>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Briefs</div>
                    <p className="text-xs text-muted-foreground">Content briefs targeting different funnel stages</p>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Articles</div>
                    <p className="text-xs text-muted-foreground">SEO-optimized content that converts</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }