import { createContext } from 'react'

export interface LanguageContextType {
  language: string
  setLanguage: (lang: string) => void
  t: (key: string) => string
  isLoading: boolean
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined)