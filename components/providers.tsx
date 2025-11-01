"use client"

import { ReactNode } from "react"
import { RoleProvider } from "@/components/role-provider"

export function Providers({ children }: { children: ReactNode }) {
  return <RoleProvider>{children}</RoleProvider>
}

