// components/ProductStrategyForm/Competition.tsx
'use client';

import { useState } from 'react';
import { Control, useFieldArray } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ProductContextFormData } from '../../types';
import { Plus, Loader2, Swords, X } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
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
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface CompetitionProps {
  control: Control<ProductContextFormData>;
  projectId: string;
}

interface DeleteCompetitorInfo {
  formIndex: number;
  competitorId: string;
}

export function Competition({ control, projectId }: CompetitionProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [deleteCompetitor, setDeleteCompetitor] = useState<DeleteCompetitorInfo | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "competitors",
    keyName: "_id"
  });

  const handleAddCompetitor = async () => {
    setIsCreating(true);
    try {
      const response = await fetch(`http://localhost:3009/api/extension/ai-projects/${projectId}/competitors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-extension-token': process.env.NEXT_PUBLIC_STRATUM_TOKEN || '',
        },
        body: JSON.stringify({
          name: 'New Competitor',
          description: '',
          strengths: [],
          weaknesses: [],
          differentiation: ''
        })
      });

      if (!response.ok) throw new Error('Failed to create competitor');
      
      const competitor = await response.json();
      append(competitor);
      router.refresh();

      toast({
        title: "Competitor Added",
        description: "Fill in the competitor details and save your changes.",
      });
    } catch (error) {
      console.error('Error adding competitor:', error);
      toast({
        title: "Error",
        description: "Failed to create competitor",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteCompetitor = async (formIndex: number, competitorId: string) => {
    if (!competitorId) {
      toast({
        title: "Error",
        description: "Cannot delete competitor - no ID found",
        variant: "destructive",
      });
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(
        `http://localhost:3009/api/extension/ai-projects/${projectId}/competitors/${competitorId}`,
        {
          method: 'DELETE',
          headers: {
            'x-extension-token': process.env.NEXT_PUBLIC_STRATUM_TOKEN || '',
          }
        }
      );

      if (!response.ok) throw new Error('Failed to delete competitor');

      remove(formIndex);
      setDeleteCompetitor(null);
      router.refresh();

      toast({
        title: "Competitor Deleted",
        description: "The competitor has been removed.",
      });
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Error",
        description: "Failed to delete competitor",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div 
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
    >
      {fields.map((field, index) => (
        <Card key={field._id}>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <Swords className="h-5 w-5 text-primary" />
                <h3 className="font-medium">Competitor {index + 1}</h3>
              </div>
            </div>

            <div className="grid gap-4">
              <FormField
                control={control}
                name={`competitors.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Competitor Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Main Rival Inc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`competitors.${index}.description`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Overview</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe this competitor..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

<div className="space-y-2">
                <FormLabel>Strengths</FormLabel>
                <FormField
                  control={control}
                  name={`competitors.${index}.strengths`}
                  render={({ field }) => {
                    const strengths = field.value || [];
                    return (
                      <div className="space-y-2">
                        {strengths.map((strength: string, strengthIndex: number) => (
                          <div key={strengthIndex} className="flex gap-2">
                            <Input
                              value={strength}
                              onChange={(e) => {
                                const newStrengths = [...strengths];
                                newStrengths[strengthIndex] = e.target.value;
                                field.onChange(newStrengths);
                              }}
                              placeholder="Add a strength"
                              className="flex-1"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                const newStrengths = strengths.filter((_, i) => i !== strengthIndex);
                                field.onChange(newStrengths);
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
                            field.onChange([...strengths, '']);
                          }}
                          className="w-full"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Strength
                        </Button>
                      </div>
                    );
                  }}
                />
              </div>

              {/* Weaknesses Section */}
              <div className="space-y-2">
                <FormLabel>Weaknesses</FormLabel>
                <FormField
                  control={control}
                  name={`competitors.${index}.weaknesses`}
                  render={({ field }) => {
                    const weaknesses = field.value || [];
                    return (
                      <div className="space-y-2">
                        {weaknesses.map((weakness: string, weaknessIndex: number) => (
                          <div key={weaknessIndex} className="flex gap-2">
                            <Input
                              value={weakness}
                              onChange={(e) => {
                                const newWeaknesses = [...weaknesses];
                                newWeaknesses[weaknessIndex] = e.target.value;
                                field.onChange(newWeaknesses);
                              }}
                              placeholder="Add a weakness"
                              className="flex-1"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                const newWeaknesses = weaknesses.filter((_, i) => i !== weaknessIndex);
                                field.onChange(newWeaknesses);
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
                            field.onChange([...weaknesses, '']);
                          }}
                          className="w-full"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Weakness
                        </Button>
                      </div>
                    );
                  }}
                />
              </div>

              <FormField
                control={control}
                name={`competitors.${index}.differentiation`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Our Differentiation</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="How do we differentiate ourselves from this competitor?"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="ghost"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (field.id) {
                    setDeleteCompetitor({
                      formIndex: index,
                      competitorId: field.id
                    });
                  } else {
                    toast({
                      title: "Error",
                      description: "Cannot delete competitor - no database ID found",
                      variant: "destructive",
                    });
                  }
                }}
                className="mt-4"
              >
                Remove Competitor
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleAddCompetitor();
        }}
        disabled={isCreating}
        className="w-full"
      >
        {isCreating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Adding Competitor...
          </>
        ) : (
          <>
            <Plus className="h-4 w-4 mr-2" />
            Add Competitor
          </>
        )}
      </Button>

      <AlertDialog 
        open={!!deleteCompetitor} 
        onOpenChange={() => !isDeleting && setDeleteCompetitor(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Competitor?</AlertDialogTitle>
            <AlertDialogDescription>
              This competitor will be permanently deleted.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (deleteCompetitor) {
                  handleDeleteCompetitor(
                    deleteCompetitor.formIndex,
                    deleteCompetitor.competitorId
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