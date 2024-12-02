import { Button } from "@/components/ui/button"
import { FormField, FormItem, FormLabel, FormDescription, FormControl } from "@/components/ui/form"
import { X } from "lucide-react"
import { Control, useFieldArray, UseFormReturn } from "react-hook-form"

interface ArrayInputProps<T> {
  control: Control<any>
  name: string
  label: string
  description?: string
  form: UseFormReturn<any>
  template: T
  renderItem: (
    item: T, 
    index: number,
    updateField: (index: number, key: keyof T, value: any) => void
  ) => React.ReactNode
}

export function ArrayInput<T extends string | Record<string, any>>({
  control,
  name,
  label,
  description,
  form,
  template,
  renderItem,
}: ArrayInputProps<T>) {
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  })

  const updateField = (index: number, key: keyof T, value: any) => {
    const currentFields = form.getValues(name)
    const updatedFields = [...currentFields]
    
    if (typeof template === 'string') {
      updatedFields[index] = value
    } else {
      updatedFields[index] = {
        ...updatedFields[index],
        [key]: value
      }
    }
    
    form.setValue(name, updatedFields, { shouldDirty: true })
  }

  return (
    <FormField
      control={control}
      name={name}
      render={() => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          {description && <FormDescription>{description}</FormDescription>}
          <div className="space-y-2">
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-start gap-2">
                  {renderItem(field as T, index, updateField)}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button 
              type="button" 
              onClick={() => append(template)}
              className="mt-2"
            >
              Add Item
            </Button>
          </div>
        </FormItem>
      )}
    />
  )
}