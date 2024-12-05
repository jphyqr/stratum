import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { UseFormReturn } from "react-hook-form"
import { ArrayInput } from "./ArrayInput"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"

const TERMINOLOGY_EXAMPLES = {
  technical: {
    company: "Stripe",
    preferred: [
      { use: "integrate", insteadOf: "connect", context: "When referring to API implementation" },
      { use: "authenticate", insteadOf: "login", context: "API authentication process" }
    ],
    prohibited: [
      { word: "simple", reason: "Oversimplifies technical complexity" },
      { word: "just", reason: "Minimizes implementation effort" }
    ]
  },
  consumer: {
    company: "Airbnb",
    preferred: [
      { use: "host", insteadOf: "owner", context: "When referring to property providers" },
      { use: "experience", insteadOf: "tour", context: "When describing activities" }
    ],
    prohibited: [
      { word: "cheap", reason: "Negative connotation for value" },
      { word: "rules", reason: "Use 'guidelines' or 'policies' instead" }
    ]
  }
}

export default function TerminologySection({ form }: { form: UseFormReturn<any> }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Terminology</h3>
        <p className="text-sm text-muted-foreground">Define your brand's language preferences and restrictions</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardContent className="pt-6">
            <h4 className="text-sm font-medium mb-4">Preferred Terms</h4>
            <ArrayInput
              form={form}
              control={form.control}
              name="preferredTerms"
              label="Preferred Terms"
              template={{ use: "", insteadOf: "", context: "" }}
              renderItem={(item, index) => (
                <div className="grid grid-cols-3 gap-4 w-full">
                  <FormField
                    control={form.control}
                    name={`preferredTerms.${index}.use`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} placeholder="Use this term" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`preferredTerms.${index}.insteadOf`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} placeholder="Instead of" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`preferredTerms.${index}.context`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} placeholder="Usage context" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              )}
            />

            <Alert className="mt-6">
              <Info className="h-4 w-4" />
              <AlertDescription>
                <div className="mt-2 space-y-4">
                  {Object.entries(TERMINOLOGY_EXAMPLES).map(([style, example]) => (
                    <div key={style} className="space-y-2">
                      <Badge variant="outline">{example.company}</Badge>
                      <div className="grid gap-2 pl-4">
                        {example.preferred.map((term, i) => (
                          <div key={i} className="text-sm">
                            <span className="font-medium">Use "{term.use}"</span>
                            <span className="text-muted-foreground"> instead of "</span>
                            <span className="text-muted-foreground">{term.insteadOf}"</span>
                            <p className="text-xs text-muted-foreground mt-1">{term.context}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h4 className="text-sm font-medium mb-4">Prohibited Terms</h4>
            <ArrayInput
              form={form}
              control={form.control}
              name="prohibitedTerms"
              label="Prohibited Terms"
              template={{ word: "", reason: "" }}
              renderItem={(item, index) => (
                <div className="grid grid-cols-2 gap-4 w-full">
                  <FormField
                    control={form.control}
                    name={`prohibitedTerms.${index}.word`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} placeholder="Term to avoid" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`prohibitedTerms.${index}.reason`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} placeholder="Reason to avoid" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              )}
            />

            <Alert className="mt-6">
              <Info className="h-4 w-4" />
              <AlertDescription>
                <div className="mt-2 grid gap-4">
                  {Object.entries(TERMINOLOGY_EXAMPLES).map(([style, example]) => (
                    <div key={style} className="space-y-2">
                      <Badge variant="outline">{example.company}</Badge>
                      <div className="grid gap-2 pl-4">
                        {example.prohibited.map((term, i) => (
                          <div key={i} className="text-sm">
                            <span className="font-medium">Avoid "{term.word}"</span>
                            <p className="text-xs text-muted-foreground mt-1">{term.reason}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}