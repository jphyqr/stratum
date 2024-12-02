import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormDescription, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { InfoIcon } from "lucide-react";
import { UseFormReturn } from "react-hook-form";


export default function CoreBrandIdentity({ form }: { form: UseFormReturn<any> }) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-6">
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand Name</FormLabel>
                    <FormDescription>The primary name of your brand</FormDescription>
                    <FormControl>
                      <Input 
                        placeholder="e.g., Stratum" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
  
              <FormField
                control={form.control}
                name="tagline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tagline</FormLabel>
                    <FormDescription>A short, memorable phrase that captures your brand's essence</FormDescription>
                    <FormControl>
                      <Input 
                        placeholder="e.g., Build Better with AI" 
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
                    <FormDescription>A brief explanation of what your brand does</FormDescription>
                    <FormControl>
                      <Textarea 
                        placeholder="e.g., Stratum helps developers build better applications by providing intelligent, reusable AI instruction layers." 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
  
            <Alert>
              <InfoIcon className="h-4 w-4" />
              <AlertDescription>
                These core brand elements will be used throughout your application and documentation.
                Make sure they clearly communicate your product's value and purpose.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    )
  }