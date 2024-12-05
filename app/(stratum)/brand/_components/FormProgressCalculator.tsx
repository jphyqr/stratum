import { useMemo } from "react"
import { UseFormReturn } from "react-hook-form"

interface Section {
  name: string
  weight: number
  validate: (values: any) => boolean
}

const FORM_SECTIONS: Section[] = [
  {
    name: "Brand Identity",
    weight: 0.15,
    validate: (values) => !!(
      values.name?.trim() && 
      values.tagline?.trim() && 
      values.description?.trim() &&
      values.nameContext?.meaning &&
      values.nameContext?.brandArchetype
    )
  },
  {
    name: "Value Proposition",
    weight: 0.15,
    validate: (values) => !!(
      values.valueProposition?.target &&
      values.valueProposition?.product &&
      values.valueProposition?.category &&
      values.valueProposition?.benefit &&
      values.valueProposition?.differentiator
    )
  },
  {
    name: "Voice & Tone",
    weight: 0.15,
    validate: (values) => !!(
      values.voiceTraits?.length > 0 &&
      values.voiceExamples?.length > 0 &&
      values.tonalityRules?.length > 0
    )
  },
  {
    name: "Terminology",
    weight: 0.15,
    validate: (values) => !!(
      values.preferredTerms?.length > 0 &&
      values.prohibitedTerms?.length > 0
    )
  },
  {
    name: "Visual Identity",
    weight: 0.25,
    validate: (values) => !!(
      values.primaryColor?.hex &&
      values.primaryColor?.usage &&
      values.secondaryColor?.hex &&
      values.secondaryColor?.usage &&
      values.logoPreferences?.style &&
      values.fontPrimary &&
      values.fontSecondary
    )
  },
  {
    name: "Writing Guidelines",
    weight: 0.15,
    validate: (values) => !!(
      values.writingGuide?.headlines?.style &&
      values.writingGuide?.headlines?.examples?.length > 0 &&
      values.writingGuide?.paragraphs?.style &&
      values.writingGuide?.paragraphs?.maxLength
    )
  }
]

export function useFormProgress(form: UseFormReturn<any>) {
  return useMemo(() => {
    const values = form.getValues()
    const progress = FORM_SECTIONS.reduce((acc, section) => {
      const sectionComplete = section.validate(values)
      return {
        total: acc.total + (sectionComplete ? section.weight : 0),
        sections: {
          ...acc.sections,
          [section.name]: sectionComplete
        }
      }
    }, { total: 0, sections: {} as Record<string, boolean> })

    return {
      total: Math.round(progress.total * 100),
      sections: progress.sections,
      shouldShowColorSuggestions: progress.total >= 0.6 // 60% completion threshold
    }
  }, [form.watch()])
}