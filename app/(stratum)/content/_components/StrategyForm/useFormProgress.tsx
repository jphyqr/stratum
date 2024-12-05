// app/(stratum)/content/_components/useFormProgress.ts
import { UseFormReturn } from "react-hook-form"

import { ContentStrategyFormData } from "../../types"

export function useFormProgress(form: UseFormReturn<ContentStrategyFormData>) {
  const values = form.getValues()

  const sections = {
    "Core Strategy": !!(values.contentTone && values.expertiseLevel),
    "Content Principles": !!(
      (values.contentPrinciples || []).length > 0 &&
      (values.educationGoals || []).length > 0
    ),
    Audience: !!(
      values.targetPersonas &&
      values.targetPersonas.length > 0 &&
      values.targetPersonas.every(
        (persona) =>
          persona.name &&
          persona.role &&
          (persona.challenges || []).length > 0 &&
          (persona.goals || []).length > 0
      )
    ),
    "Industry Context": !!(
      values.industryContext &&
      ((values.industryContext.terminology || []).length > 0 ||
        (values.industryContext.concepts || []).length > 0 ||
        (values.industryContext.trends || []).length > 0)
    ),
    "Thought Leadership": !!(
      values.thoughtLeadership &&
      ((values.thoughtLeadership.keyPositions || []).length > 0 ||
        (values.thoughtLeadership.uniquePerspectives || []).length > 0)
    ),
  }

  const completedSections = Object.values(sections).filter(Boolean).length
  const total = Math.round(
    (completedSections / Object.keys(sections).length) * 100
  )

  return {
    total,
    sections,
  }
}
