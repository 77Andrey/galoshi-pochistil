"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Investigation } from "@/lib/types"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/components/language-provider"
import { UserIcon, CalendarIcon, ClockIcon } from "lucide-react"

interface InvestigationCardProps {
  investigation: Investigation
  onViewDetails: (investigation: Investigation) => void
}

function getPriorityBadgeColor(priority: string): string {
  switch (priority) {
    case "low":
      return "bg-green-100 text-green-800 border-green-200"
    case "medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "high":
      return "bg-orange-100 text-orange-800 border-orange-200"
    case "critical":
      return "bg-red-100 text-red-800 border-red-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

function getStatusBadgeColor(status: string): string {
  switch (status) {
    case "open":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "in-progress":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "closed":
      return "bg-gray-100 text-gray-800 border-gray-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

export function InvestigationCard({ investigation, onViewDetails }: InvestigationCardProps) {
  const { t } = useLanguage()
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold">{investigation.type}</h3>
            <p className="text-xs text-muted-foreground font-mono mt-1">{investigation.id}</p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className={cn("text-xs", getStatusBadgeColor(investigation.status))}>
              {investigation.status}
            </Badge>
            <Badge variant="outline" className={cn("text-xs", getPriorityBadgeColor(investigation.priority))}>
              {investigation.priority}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <UserIcon className="h-3.5 w-3.5" />
            <span className="text-xs">{investigation.profileName}</span>
            <span className="text-xs font-mono">({investigation.profileId})</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <CalendarIcon className="h-3.5 w-3.5" />
            <span className="text-xs">{t.investigations.created} {investigation.createdAt.toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <ClockIcon className="h-3.5 w-3.5" />
            <span className="text-xs">{t.investigations.updated} {investigation.updatedAt.toLocaleDateString()}</span>
          </div>
        </div>

        <div className="pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground">{t.investigations.assignedTo}</p>
          <p className="text-sm font-medium">{investigation.assignee}</p>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="w-full bg-transparent"
          onClick={() => onViewDetails(investigation)}
        >
          {t.investigations.viewInvestigation}
        </Button>
      </CardContent>
    </Card>
  )
}
