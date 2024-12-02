// components/ProductStrategyForm/TargetMarket.tsx
'use client';

import { Control, useFieldArray } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl,  FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {  ProductContextFormData } from '../../types';
import { Plus,  Users, Loader2, X } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog";
  interface TargetMarketProps {
    control: Control<ProductContextFormData>;
    projectId: string;
  }
  
  interface DeleteSegmentInfo {
    formIndex: number;
    segmentId: string;
  }
  

  // Add type to preserve database ID

  
  interface DeleteSegmentInfo {
    formIndex: number;
    segmentId: string;  // Changed from segment: MarketSegment
  }
  
  export function TargetMarket({ control, projectId }: TargetMarketProps) {
    const { toast } = useToast();
    const router = useRouter();
    const [isCreating, setIsCreating] = useState(false);
    const [deleteSegment, setDeleteSegment] = useState<DeleteSegmentInfo | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
  
    const { fields, append, remove } = useFieldArray({
      control,
      name: "targetMarket",
      keyName: "_id"
    });

    console.log(fields);
  
    const handleAddSegment = async () => {
      setIsCreating(true);
      try {
        const response = await fetch(`http://localhost:3009/api/extension/ai-projects/${projectId}/market-segments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-extension-token': process.env.NEXT_PUBLIC_STRATUM_TOKEN || '',
          },
          body: JSON.stringify({
            name: 'New Market Segment',
            description: '',
            priority: 1,
            painPoints: [],
            gains: []
          })
        });
  
        if (!response.ok) throw new Error('Failed to create segment');
        
        const segment = await response.json();
        append(segment);
        
        // Update the available segments in ValueProps
        router.refresh();
  
        toast({
          title: "Segment Added",
          description: "Fill in the segment details and save your changes.",
        });
      } catch (error) {
        console.error(error);
        toast({
          title: "Error",
          description: "Failed to create segment",
          variant: "destructive",
        });
      } finally {
        setIsCreating(false);
      }
    };
  

    const handleDeleteSegment = async (formIndex: number, segmentId: string) => {
        if (!segmentId) {
          toast({
            title: "Error",
            description: "Cannot delete segment - no ID found",
            variant: "destructive",
          });
          return;
        }
    
        setIsDeleting(true);
        try {
          const response = await fetch(
            `http://localhost:3009/api/extension/ai-projects/${projectId}/market-segments/${segmentId}`,
            {
              method: 'DELETE',
              headers: {
                'x-extension-token': process.env.NEXT_PUBLIC_STRATUM_TOKEN || '',
              }
            }
          );
    
          if (!response.ok) throw new Error('Failed to delete segment');
    
          remove(formIndex);
          setDeleteSegment(null);
          router.refresh();
    
          toast({
            title: "Segment Deleted",
            description: "The market segment and its related value propositions have been removed.",
          });
        } catch (error) {
          console.error('Delete error:', error);
          toast({
            title: "Error",
            description: "Failed to delete segment",
            variant: "destructive",
          });
        } finally {
          setIsDeleting(false);
        }
      };
    ;

  return (
    <div className="space-y-4">
       {fields.map((field, index) => (
      <Card key={field._id}>  {/* Use form's internal ID for React key */}
          <CardContent className="pt-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <h3 className="font-medium">Market Segment {index + 1}</h3>

              </div>

            </div>

            <div className="grid gap-4">
              <FormField
                control={control}
                name={`targetMarket.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Segment Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Independent Developers" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`targetMarket.${index}.description`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe this market segment..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

  {/* Pain Points Section */}
  <div className="space-y-2">
                <FormLabel>Pain Points</FormLabel>
                <FormField
                  control={control}
                  name={`targetMarket.${index}.painPoints`}
                  render={({ field }) => {
                    const painPoints = field.value || [];
                    return (
                      <div className="space-y-2">
                        {painPoints.map((pain: string, painIndex: number) => (
                          <div key={painIndex} className="flex gap-2">
                            <Input
                              value={pain}
                              onChange={(e) => {
                                const newPains = [...painPoints];
                                newPains[painIndex] = e.target.value;
                                field.onChange(newPains);
                              }}
                              placeholder="Add a pain point"
                              className="flex-1"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                const newPains = painPoints.filter((_, i) => i !== painIndex);
                                field.onChange(newPains);
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            field.onChange([...painPoints, '']);
                          }}
                          className="w-full"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Pain Point
                        </Button>
                      </div>
                    );
                  }}
                />
              </div>

              {/* Gains Section */}
              <div className="space-y-2">
                <FormLabel>Gains</FormLabel>
                <FormField
                  control={control}
                  name={`targetMarket.${index}.gains`}
                  render={({ field }) => {
                    const gains = field.value || [];
                    return (
                      <div className="space-y-2">
                        {gains.map((gain: string, gainIndex: number) => (
                          <div key={gainIndex} className="flex gap-2">
                            <Input
                              value={gain}
                              onChange={(e) => {
                                const newGains = [...gains];
                                newGains[gainIndex] = e.target.value;
                                field.onChange(newGains);
                              }}
                              placeholder="Add a gain"
                              className="flex-1"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                const newGains = gains.filter((_, i) => i !== gainIndex);
                                field.onChange(newGains);
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            field.onChange([...gains, '']);
                          }}
                          className="w-full"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Gain
                        </Button>
                      </div>
                    );
                  }}
                />
              </div>


<Button
              type="button"
              variant="ghost"
              onClick={() => {
                if (field.id) {
                  setDeleteSegment({
                    formIndex: index,
                    segmentId: field.id
                  });
                } else {
                  toast({
                    title: "Error",
                    description: "Cannot delete segment - no database ID found",
                    variant: "destructive",
                  });
                }
              }}
              className="mt-4"
            >
              Remove Segment
            </Button>
            </div>
          </CardContent>
        </Card>
      ))}

<Button
        type="button"
        variant="outline"
        onClick={handleAddSegment}
        disabled={isCreating}
        className="w-full"
      >
        {isCreating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Adding Segment...
          </>
        ) : (
          <>
            <Plus className="h-4 w-4 mr-2" />
            Add Market Segment
          </>
        )}
      </Button>

      <AlertDialog 
        open={!!deleteSegment} 
        onOpenChange={() => !isDeleting && setDeleteSegment(null)}
      >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Market Segment?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete this market segment and all associated value propositions.
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 hover:bg-red-700"
            onClick={() => {
              if (deleteSegment) {
                handleDeleteSegment(
                  deleteSegment.formIndex,
                  deleteSegment.segmentId
                );
              }
            }}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}