// components/ProductStrategyForm/DynamicList.tsx
import { Control, useFieldArray, FieldArray } from 'react-hook-form';
import { FormLabel, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import { ProductContextFormData, MarketSegment, Competitor } from '../../types';

type CompetitorArrays = 'strengths' | 'weaknesses';
type MarketArrays = 'painPoints' | 'gains';
type ParentPath = 'competitors' | 'targetMarket';

type ParentType<T extends ParentPath> = T extends 'competitors' ? Competitor : MarketSegment;
type ArrayType<T extends ParentPath> = T extends 'competitors' ? CompetitorArrays : MarketArrays;

interface DynamicListProps<T extends ParentPath> {
  control: Control<ProductContextFormData>;
  parentPath: T;
  index: number;
  arrayName: ArrayType<T>;
  label: string;
  description?: string;
  placeholder?: string;
}

export function DynamicList<T extends ParentPath>({
  control,
  parentPath,
  index,
  arrayName,
  label,
  description,
  placeholder
}: DynamicListProps<T>) {
  const { fields, update } = useFieldArray({
    control,
    name: parentPath
  });

  const currentField = fields[index] as unknown as ParentType<T>;
  const currentArray = (currentField?.[arrayName as keyof ParentType<T>] as string[]) || [];

  const handleChange = (newArray: string[]) => {
    if (currentField) {
      const updatedField = {
        ...currentField,
        [arrayName]: newArray
      } as unknown as FieldArray<ProductContextFormData, T>;
      
      update(index, updatedField);
    }
  };

  return (
    <div className="space-y-2">
      <div>
        <FormLabel>{label}</FormLabel>
        {description && (
          <FormDescription>{description}</FormDescription>
        )}
      </div>
      
      <div className="space-y-2">
        {currentArray.map((value, arrayIndex) => (
          <div key={arrayIndex} className="flex gap-2">
            <Input
              value={value}
              onChange={(e) => {
                const newArray = [...currentArray];
                newArray[arrayIndex] = e.target.value;
                handleChange(newArray);
              }}
              placeholder={placeholder}
              className="flex-1"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => {
                const newArray = [...currentArray];
                newArray.splice(arrayIndex, 1);
                handleChange(newArray);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => handleChange([...currentArray, ''])}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add {label}
      </Button>
    </div>
  );
}