// components/ProductStrategyForm/MetricsList.tsx
'use client';

import {  useFieldArray } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, X, Target } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { MetricsListProps } from '../../types';



export function MetricsList({ control, parentIndex }: MetricsListProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `goals.${parentIndex}.metrics` as const
  });

  return (
    <div className="space-y-4">
      {fields.map((field, index) => (
        <Card key={field.id}>
          <CardContent className="pt-4">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Metric {index + 1}</span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => remove(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid gap-4">
              <FormField
                control={control}
                name={`goals.${parentIndex}.metrics.${index}.name` as const}
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
                name={`goals.${parentIndex}.metrics.${index}.description` as const}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="How is this metric measured?"
                        className="h-20"
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
                  name={`goals.${parentIndex}.metrics.${index}.target` as const}
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
                  name={`goals.${parentIndex}.metrics.${index}.current` as const}
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
            </div>
          </CardContent>
        </Card>
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => append({
          name: '',
          description: '',
          target: '',
          current: ''
        })}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Metric
      </Button>
    </div>
  );
}