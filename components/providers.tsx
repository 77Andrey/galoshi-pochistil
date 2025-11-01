"use client"

import { ReactNode } from "react"
import { RoleProvider } from "@/components/role-provider"
import { LanguageProvider } from "@/components/language-provider"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <RoleProvider>{children}</RoleProvider>
    </LanguageProvider>
  )
}

