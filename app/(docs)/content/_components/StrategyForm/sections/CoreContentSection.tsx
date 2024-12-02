// app/(docs)/content/_components/sections/CoreStrategySection.tsx
import { UseFormReturn } from "react-hook-form"
import {
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
} from "@/components/ui/form"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ContentStrategyFormData } from "../../../types"
import { KeywordList } from "./KeywordList"
import { Badge } from "@/components/ui/badge"

interface CoreStrategySectionProps {
  form: UseFormReturn<ContentStrategyFormData>
}

const TONE_OPTIONS = [
  {
    value: 'technical',
    label: 'Technical',
    description: 'Precise, detailed, focused on implementation'
  },
  {
    value: 'conversational',
    label: 'Conversational',
    description: 'Friendly, approachable, easy to understand'
  },
  {
    value: 'academic',
    label: 'Academic',
    description: 'Research-focused, thorough, analytical'
  },
  {
    value: 'professional',
    label: 'Professional',
    description: 'Business-oriented, clear, authoritative'
  }
]

const EXPERTISE_OPTIONS = [
  {
    value: 'beginner',
    label: 'Beginner',
    description: 'New to the topic, needs foundational knowledge'
  },
  {
    value: 'intermediate',
    label: 'Intermediate',
    description: 'Familiar with basics, ready for deeper insights'
  },
  {
    value: 'advanced',
    label: 'Advanced',
    description: 'Experienced, seeking specific details'
  },
  {
    value: 'expert',
    label: 'Expert',
    description: 'Deep domain knowledge, wants cutting-edge info'
  }
]

export function CoreStrategySection({ form }: CoreStrategySectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Core Strategy</h3>
        <p className="text-sm text-muted-foreground">
          Define your content tone and target expertise level.
        </p>
      </div>

      <FormField
        control={form.control}
        name="contentTone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Content Tone</FormLabel>
            <FormDescription>
              Choose the overall tone for your content.
            </FormDescription>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {TONE_OPTIONS.map((option) => (
                <Card
                  key={option.value}
                  className={cn(
                    "cursor-pointer hover:border-primary transition-colors",
                    field.value === option.value && "border-primary bg-primary/5"
                  )}
                  onClick={() => field.onChange(option.value)}
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col gap-1">
                      <span className="font-medium text-sm">{option.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {option.description}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="expertiseLevel"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Target Expertise Level</FormLabel>
            <FormDescription>
              Select the knowledge level of your target audience.
            </FormDescription>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {EXPERTISE_OPTIONS.map((option) => (
                <Card
                  key={option.value}
                  className={cn(
                    "cursor-pointer hover:border-primary transition-colors",
                    field.value === option.value && "border-primary bg-primary/5"
                  )}
                  onClick={() => field.onChange(option.value)}
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col gap-1">
                      <span className="font-medium text-sm">{option.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {option.description}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </FormItem>
        )}
      />

<FormField
        control={form.control}
        name="targetKeywords"
        render={() => (
          <FormItem>
            <FormLabel>Target Keywords</FormLabel>
            <FormDescription>
              Define your pillar keywords that your content will cluster towards.  
            </FormDescription>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {[
          {
            pillar: "James Clear",
            clusters: [
              "Habits",
              "Motivation",
              "Focus",
              "Life Lessons",
              "Productivity",
            ],
          },
          {
            pillar: "Hubspot",
            clusters: [
              "Content Marketing",
              "Social Media",
              "SEO Basics",
              "Email Campaigns",
              "Brand Awareness",
            ],
          },
          {
            pillar: "Coursera",
            clusters: [
              "AI Development",
              "Cloud Computing",
              "Web3",
              "Cybersecurity",
              "Data Analytics",
            ],
          },
        ].map(({ pillar, clusters }, idx) => (
          <Card key={idx} className="border hover:shadow-lg transition opacity-60">
            <CardContent className="p-4">
              <h4 className="font-medium text-sm mb-2">{pillar}</h4>
              <div className="flex items-center flex-wrap text-xs text-muted-foreground space-y-1">
                {clusters.map((cluster, i) => (
                        <div
                        key={i}
                        className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-sm"
                      >
                  {cluster}
                </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
            <KeywordList
              name="targetKeywords"
              form={form}
              placeholder="e.g., AI Development, Code Generation"
              maxItems={30}
            />
          </FormItem>
        )}
      />
    </div>
  )
}