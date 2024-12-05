import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AIPreferences } from './types'

interface AIPreferencesStore {
  preferences: AIPreferences
  updatePreferences: (prefs: Partial<AIPreferences>) => void
}

const DEFAULT_PREFERENCES: AIPreferences = {
  model: 'claude-3-opus-20240229',
  temperature: 0.7,
  maxTokens: 4096
}

export const useAIPreferences = create<AIPreferencesStore>()(
  persist(
    (set) => ({
      preferences: DEFAULT_PREFERENCES,
      updatePreferences: (prefs) => set((state) => ({
        preferences: { ...state.preferences, ...prefs }
      }))
    }),
    { name: 'ai-preferences' }
  )
)