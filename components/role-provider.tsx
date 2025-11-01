"use client"

import { createContext, useContext, useState, ReactNode } from "react"

export type UserRole = "viewer" | "analyst" | "admin"

interface RoleContextType {
  role: UserRole
  setRole: (role: UserRole) => void
  canView: (permission: string) => boolean
  canEdit: (permission: string) => boolean
  canDelete: (permission: string) => boolean
}

const RoleContext = createContext<RoleContextType | undefined>(undefined)

const rolePermissions = {
  viewer: {
    view: ["transactions", "profiles", "investigations", "audit", "policies"],
    edit: [],
    delete: [],
  },
  analyst: {
    view: ["transactions", "profiles", "investigations", "audit", "policies"],
    edit: ["transactions", "profiles", "investigations"],
    delete: [],
  },
  admin: {
    view: ["transactions", "profiles", "investigations", "audit", "policies"],
    edit: ["transactions", "profiles", "investigations", "policies"],
    delete: ["transactions", "profiles", "investigations"],
  },
}

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>("analyst")

  const canView = (permission: string) => {
    return rolePermissions[role].view.includes(permission)
  }

  const canEdit = (permission: string) => {
    return rolePermissions[role].edit.includes(permission)
  }

  const canDelete = (permission: string) => {
    return rolePermissions[role].delete.includes(permission)
  }

  return (
    <RoleContext.Provider value={{ role, setRole, canView, canEdit, canDelete }}>
      {children}
    </RoleContext.Provider>
  )
}

export function useRole() {
  const context = useContext(RoleContext)
  if (!context) {
    throw new Error("useRole must be used within RoleProvider")
  }
  return context
}

