// components/ProductStrategyForm/ValueProps.tsx
'use client';

import { Control, useFieldArray } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProductContextFormData, MarketSegment } from '../../types';
import { Plus } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface ValuePropsProps {
  control: Control<ProductContextFormData>;
  marketSegments: MarketSegment[];
}

export function ValueProps({ control, marketSegments }: ValuePropsProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "valueProps"
  });

  // Filter out segments without IDs and ensure IDs are strings
  const validSegments = marketSegments.filter((segment): segment is MarketSegment & { id: string } => {
    return typeof segment.id === 'string';
  });

  return (
    <div className="space-y-4">
      {fields.map((field, index) => (
        <Card key={field.id}>
          <CardContent className="pt-6">
            <div className="grid gap-4">
              <FormField
                control={control}
                name={`valueProps.${index}.benefit`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Value Proposition</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., Increased Developer Productivity"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`valueProps.${index}.description`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe how this creates value..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`valueProps.${index}.segmentId`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Segment</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value || undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select market segment" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {validSegments.map((segment) => (
                          <SelectItem key={segment.id} value={segment.id}>
                            {segment.name || 'Unnamed Segment'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="button"
              variant="ghost"
              onClick={() => remove(index)}
              className="mt-4"
            >
              Remove Value Proposition
            </Button>
          </CardContent>
        </Card>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={() => append({
          benefit: '',
          description: '',
          segmentId: ''
        })}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Value Proposition
      </Button>
    </div>
  );
}