// components/ProductStrategyForm/CoreStrategy.tsx
"use client"

import { Building, Lightbulb, Target } from "lucide-react"

import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Control } from "react-hook-form"
import { ProductContextFormData } from "../../types"

interface CoreStrategyProps {
  control: Control<ProductContextFormData>
}

export function CoreStrategy({ control }: CoreStrategyProps) {
  return (
    <div className="grid gap-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="mt-1">
              <Lightbulb className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <FormField
                control={control}
                name="vision"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vision Statement</FormLabel>
                    <FormDescription>
                      What impact do you want your product to have on the world?
                    </FormDescription>
                    <FormControl>
                      <Textarea
                        placeholder="Example: To revolutionize how developers build software by making AI accessible and practical"
                        className="min-h-[100px]"
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

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="mt-1">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <FormField
                control={control}
                name="mission"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mission Statement</FormLabel>
                    <FormDescription>
                      How will you achieve this vision? What is your core
                      purpose?
                    </FormDescription>
                    <FormControl>
                      <Textarea
                        placeholder="Example: To provide intelligent development tools that understand context and enhance productivity"
                        className="min-h-[100px]"
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

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="mt-1">
              <Building className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <FormField
                control={control}
                name="businessModel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Model</FormLabel>
                    <FormDescription>
                      How will your product create and capture value?
                    </FormDescription>
                    <FormControl>
                      <Textarea
                        placeholder="Example: Freemium SaaS model with enterprise features and usage-based pricing"
                        className="min-h-[100px]"
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
    </div>
  )
}
