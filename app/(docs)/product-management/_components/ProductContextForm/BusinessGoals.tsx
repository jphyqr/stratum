// components/ProductStrategyForm/BusinessGoals.tsx
'use client';

import { useState } from 'react';
import { Control, useFieldArray } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {  ProductContextFormData } from '../../types';
import { Plus,  Loader2, TrendingUp } from 'lucide-react';
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
import MetricsSection from './MetricsSection';

interface BusinessGoalsProps {
  control: Control<ProductContextFormData>;
  projectId: string;
}

interface DeleteGoalInfo {
  formIndex: number;
  goalId: string;
}



export function BusinessGoals({ control, projectId }: BusinessGoalsProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [deleteGoal, setDeleteGoal] = useState<DeleteGoalInfo | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "goals",
    keyName: "_id"  // Use different key for form management
  });






  
  const handleAddGoal = async () => {
    setIsCreating(true);
    try {
      const response = await fetch(`http://localhost:3009/api/extension/ai-projects/${projectId}/goals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-extension-token': process.env.NEXT_PUBLIC_STRATUM_TOKEN || '',
        },
        body: JSON.stringify({
          name: 'New Business Goal',
          description: '',
          timeframe: '',
        
        })
      });

      if (!response.ok) throw new Error('Failed to create goal');
      
      const goal = await response.json();
      console.log('Created goal:', goal);
      append(goal);
      router.refresh();

      toast({
        title: "Goal Added",
        description: "Fill in the goal details and save your changes.",
      });
    } catch (error) {
      console.error('Error adding goal:', error);
      toast({
        title: "Error",
        description: "Failed to create goal",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteGoal = async (formIndex: number, goalId: string) => {
    if (!goalId) {
      toast({
        title: "Error",
        description: "Cannot delete goal - no ID found",
        variant: "destructive",
      });
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(
        `http://localhost:3009/api/extension/ai-projects/${projectId}/goals/${goalId}`,
        {
          method: 'DELETE',
          headers: {
            'x-extension-token': process.env.NEXT_PUBLIC_STRATUM_TOKEN || '',
          }
        }
      );

      if (!response.ok) throw new Error('Failed to delete goal');

      remove(formIndex);
      setDeleteGoal(null);
      router.refresh();

      toast({
        title: "Goal Deleted",
        description: "The goal and its metrics have been removed.",
      });
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Error",
        description: "Failed to delete goal",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div 
    onSubmit={(e) => e.preventDefault()}
    className="space-y-4">
      {fields.map((field, index) => (
        <Card key={field._id}>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h3 className="font-medium">Business Goal {index + 1}</h3>
              </div>
            </div>

            <div className="grid gap-4">
              <FormField
                control={control}
                name={`goals.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Goal Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., Achieve Market Leadership"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`goals.${index}.description`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the goal in detail..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`goals.${index}.timeframe`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Timeframe</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., Q4 2024"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

                 {/* Replace the metrics section with the new component */}
            {field.id && (
              <MetricsSection
                control={control}
                goalId={field.id}
                goalIndex={index}
                projectId={projectId}
              />
            )}

              <Button
                type="button"
                variant="ghost"
                onClick={(e) => {
                    e.preventDefault();  // Prevent form propagation
                    e.stopPropagation();
                    if (field.id) {
                      setDeleteGoal({
                        formIndex: index,
                        goalId: field.id
                      });
                    } else {
                      toast({
                        title: "Error",
                        description: "Cannot delete goal - no database ID found",
                        variant: "destructive",
                      });
                    }
                  }}
                className="mt-4"
              >
                Remove Goal
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={(e) => {
            e.preventDefault();  // Prevent form propagation
            e.stopPropagation();
            handleAddGoal();
          }}
        disabled={isCreating}
        className="w-full"
      >
        {isCreating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Adding Goal...
          </>
        ) : (
          <>
            <Plus className="h-4 w-4 mr-2" />
            Add Business Goal
          </>
        )}
      </Button>

      <AlertDialog 
        open={!!deleteGoal} 
        onOpenChange={() => !isDeleting && setDeleteGoal(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Business Goal?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this goal and all its metrics.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={(e) => {
                e.preventDefault();  // Prevent form propagation
                e.stopPropagation();
                if (deleteGoal) {
                  handleDeleteGoal(
                    deleteGoal.formIndex,
                    deleteGoal.goalId
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