// components/ProductStrategyForm/MetricsSection.tsx
'use client';

import { useState } from 'react';
import { Control, useFieldArray } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {  ProductContextFormData } from '../../types';
import { Plus, Minus, Loader2, Target } from 'lucide-react';
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
//import { useRouter } from "next/navigation";

interface MetricsSectionProps {
  control: Control<ProductContextFormData>;
  goalId: string;
  goalIndex: number;
  projectId: string;
}

interface DeleteMetricInfo {
  metricIndex: number;
  metricId: string;
}

export default function MetricsSection({ control, goalId, goalIndex, projectId }: MetricsSectionProps) {
  const { toast } = useToast();
  //const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [isDeletingMetric, setIsDeletingMetric] = useState(false);
  const [deleteMetric, setDeleteMetric] = useState<DeleteMetricInfo | null>(null);

  // Use useFieldArray for metrics
  const { fields, append, remove } = useFieldArray({
    control,
    name: `goals.${goalIndex}.metrics`,
    keyName: "_id"
  });

  const handleAddMetric = async () => {
    setIsCreating(true);
    try {
      const response = await fetch(
        `http://localhost:3009/api/extension/ai-projects/${projectId}/goals/${goalId}/metrics`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-extension-token': process.env.NEXT_PUBLIC_STRATUM_TOKEN || '',
          },
          body: JSON.stringify({
            name: 'New Metric',
            description: '',
            target: '',
            current: ''
          })
        }
      );

      if (!response.ok) throw new Error('Failed to create metric');
      const metric = await response.json();
      append(metric);

      toast({
        title: "Metric Added",
        description: "Fill in the metric details.",
      });
    } catch (error) {
      console.error('Error adding metric:', error);
      toast({
        title: "Error",
        description: "Failed to create metric",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteMetric = async (metricIndex: number, metricId: string) => {
    setIsDeletingMetric(true);
    try {
      const response = await fetch(
        `http://localhost:3009/api/extension/ai-projects/${projectId}/goals/${goalId}/metrics/${metricId}`,
        {
          method: 'DELETE',
          headers: {
            'x-extension-token': process.env.NEXT_PUBLIC_STRATUM_TOKEN || '',
          }
        }
      );

      if (!response.ok) throw new Error('Failed to delete metric');
      
      remove(metricIndex);
      setDeleteMetric(null);

      toast({
        title: "Metric Deleted",
        description: "The metric has been removed.",
      });
    } catch (error) {
      console.error('Error deleting metric:', error);
      toast({
        title: "Error",
        description: "Failed to delete metric",
        variant: "destructive",
      });
    } finally {
      setIsDeletingMetric(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Title and Add Button */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-muted-foreground" />
          <FormLabel className="text-base font-medium">Success Metrics</FormLabel>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleAddMetric();
          }}
          disabled={isCreating}
        >
          {isCreating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adding...
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Add Metric
            </>
          )}
        </Button>
      </div>

      {/* Metrics List */}
      <div className="space-y-4">
        {fields.map((field, index) => (
          <Card key={field._id}>
            <CardContent className="pt-4">
              <div className="grid gap-4">
                <FormField
                  control={control}
                  name={`goals.${goalIndex}.metrics.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Metric Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., Monthly Active Users"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name={`goals.${goalIndex}.metrics.${index}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="How is this metric measured?"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name={`goals.${goalIndex}.metrics.${index}.target`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target Value</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., 100,000"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name={`goals.${goalIndex}.metrics.${index}.current`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Value</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., 50,000"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (field.id) {
                      setDeleteMetric({
                        metricIndex: index,
                        metricId: field.id
                      });
                    }
                  }}
                >
                  <Minus className="h-4 w-4 mr-2" />
                  Remove Metric
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog 
        open={!!deleteMetric} 
        onOpenChange={() => !isDeletingMetric && setDeleteMetric(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Metric?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this metric.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingMetric}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (deleteMetric) {
                  handleDeleteMetric(
                    deleteMetric.metricIndex,
                    deleteMetric.metricId
                  );
                }
              }}
              disabled={isDeletingMetric}
            >
              {isDeletingMetric ? (
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