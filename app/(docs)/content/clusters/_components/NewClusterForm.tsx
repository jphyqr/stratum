// app/(docs)/content/_components/NewClusterForm.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, X } from "lucide-react";
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { makeExtensionRequest } from '@/lib/api';

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  metadata: z.object({
    targetPersonas: z.array(z.string()),
    supportedGoals: z.array(z.string()),
    searchIntent: z.string(),
    competitorContent: z.object({
      urls: z.array(z.string()),
      analysis: z.string()
    }),
    businessAlignment: z.object({
      productFeatures: z.array(z.string()),
      valueProps: z.array(z.string())
    })
  })
});

type FormValues = z.infer<typeof formSchema>;

interface NewClusterFormProps {
  projectId: string;
  onClose: () => void;
}

export function NewClusterForm({ projectId, onClose }: NewClusterFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const defaultValues: FormValues = {
    name: '',
    description: '',
    metadata: {
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
    }
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const response = await makeExtensionRequest(
        `/api/extension/ai-projects/${projectId}/content/clusters`,
        {
          method: 'POST',
          body: JSON.stringify(data)
        }
      );

      if (!response.ok) {
        throw new Error('Failed to create cluster');
      }

      const newCluster = await response.json();

      toast.success('Cluster created successfully');
      router.push(`/content/clusters/${newCluster.id}`);
      onClose();
    } catch (error) {
      toast.error('Failed to create cluster');
      console.error('Failed to create cluster:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input 
                  placeholder="e.g., Product Strategy" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe the scope of this content pillar..." 
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Target Personas */}
        <FormField
          control={form.control}
          name="metadata.targetPersonas"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Target Personas</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {field.value.map((persona, index) => (
                      <Badge key={index} className="flex items-center gap-1">
                        {persona}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 ml-1"
                          onClick={() => {
                            const newPersonas = field.value.filter((_, i) => i !== index);
                            field.onChange(newPersonas);
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add persona..."
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const input = e.currentTarget;
                          if (input.value) {
                            field.onChange([...field.value, input.value]);
                            input.value = '';
                          }
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="shrink-0"
                      onClick={() => {
                        const input = document.querySelector('input[placeholder="Add persona..."]') as HTMLInputElement;
                        if (input.value) {
                          field.onChange([...field.value, input.value]);
                          input.value = '';
                        }
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Similar fields for other metadata arrays... */}
        
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Cluster'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}