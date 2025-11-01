"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboardIcon,
  ActivityIcon,
  UserCheckIcon,
  SearchIcon,
  FileTextIcon,
  ShieldCheckIcon,
  MenuIcon,
  UserIcon,
  ShieldCheck,
  EyeIcon,
  LanguagesIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useKeyboardShortcuts } from "@/lib/hooks/use-keyboard-shortcuts"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRole } from "@/components/role-provider"
import { useLanguage } from "@/components/language-provider"

export function Navigation() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { role, setRole } = useRole()
  const { language, setLanguage, t } = useLanguage()
  useKeyboardShortcuts()

  const navigation = [
    { name: t.nav.overview, href: "/", icon: LayoutDashboardIcon, shortcut: "g o" },
    { name: t.nav.monitoring, href: "/monitoring", icon: ActivityIcon, shortcut: "g m" },
    { name: t.nav.kyc, href: "/kyc", icon: UserCheckIcon, shortcut: "g k" },
    { name: t.nav.investigations, href: "/investigations", icon: SearchIcon, shortcut: "g i" },
    { name: t.nav.policies, href: "/policies", icon: ShieldCheckIcon, shortcut: "g p" },
    { name: t.nav.audit, href: "/audit", icon: FileTextIcon, shortcut: "g a" },
  ]

  const roleIcons = {
    viewer: EyeIcon,
    analyst: UserIcon,
    admin: ShieldCheck,
  }

  const RoleIcon = roleIcons[role]

  return (
    <nav
      className={cn(
        "flex flex-col border-r border-border bg-card transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-foreground text-background">
              <span className="font-mono text-sm font-bold">FF</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold leading-none">Financial Fortresses</span>
              <span className="text-xs text-muted-foreground">Ops Console</span>
            </div>
          </div>
        )}
        <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(!isCollapsed)} className="h-8 w-8">
          <MenuIcon className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 space-y-1 p-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground",
              )}
              title={isCollapsed ? item.name : undefined}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {!isCollapsed && (
                <>
                  <span className="flex-1">{item.name}</span>
                  <kbd className="hidden rounded border border-border bg-muted px-1.5 py-0.5 text-xs font-mono text-muted-foreground lg:inline-block">
                    {item.shortcut}
                  </kbd>
                </>
              )}
            </Link>
          )
        })}
      </div>

      {!isCollapsed && (
        <div className="border-t border-border p-4 space-y-4">
          <div>
            <p className="text-xs text-muted-foreground mb-2 font-medium">Role</p>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="w-full">
                <RoleIcon className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="viewer">
                  <div className="flex items-center gap-2">
                    <EyeIcon className="h-4 w-4" />
                    <span>Viewer</span>
                  </div>
                </SelectItem>
                <SelectItem value="analyst">
                  <div className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4" />
                    <span>Analyst</span>
                  </div>
                </SelectItem>
                <SelectItem value="admin">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4" />
                    <span>Admin</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2 font-medium">Language</p>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-full">
                <LanguagesIcon className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">🇬🇧</span>
                    <span>English</span>
                  </div>
                </SelectItem>
                <SelectItem value="ru">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">🇷🇺</span>
                    <span>Русский</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="text-xs text-muted-foreground">
            <p className="mb-1 font-medium">Keyboard Shortcuts</p>
            <p>
              <kbd className="rounded border border-border bg-muted px-1 py-0.5 font-mono">/</kbd> Search
            </p>
            <p>
              <kbd className="rounded border border-border bg-muted px-1 py-0.5 font-mono">g</kbd> + key to navigate
            </p>
          </div>
        </div>
      )}
    </nav>
  )
}
