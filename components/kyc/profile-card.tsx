"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { KYCProfile, KYCStatus, RiskLevel } from "@/lib/types"
import { cn } from "@/lib/utils"
import { UserIcon, MailIcon, MapPinIcon, CalendarIcon, TrendingUpIcon } from "lucide-react"

interface ProfileCardProps {
  profile: KYCProfile
  onViewDetails: (profile: KYCProfile) => void
}

function getStatusBadgeColor(status: KYCStatus): string {
  switch (status) {
    case "verified":
      return "bg-green-100 text-green-800 border-green-200"
    case "pending":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "review":
      return "bg-orange-100 text-orange-800 border-orange-200"
    case "rejected":
      return "bg-red-100 text-red-800 border-red-200"
  }
}

function getRiskBadgeColor(level: RiskLevel): string {
  switch (level) {
    case "low":
      return "bg-green-100 text-green-800 border-green-200"
    case "medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "high":
      return "bg-orange-100 text-orange-800 border-orange-200"
    case "critical":
      return "bg-red-100 text-red-800 border-red-200"
  }
}

export function ProfileCard({ profile, onViewDetails }: ProfileCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
              <UserIcon className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-semibold">{profile.name}</h3>
              <p className="text-xs text-muted-foreground font-mono">{profile.id}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className={cn("text-xs", getStatusBadgeColor(profile.status))}>
              {profile.status}
            </Badge>
            <Badge variant="outline" className={cn("text-xs", getRiskBadgeColor(profile.riskLevel))}>
              {profile.riskLevel}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MailIcon className="h-3.5 w-3.5" />
            <span className="truncate text-xs">{profile.email}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPinIcon className="h-3.5 w-3.5" />
            <span className="text-xs">{profile.country}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <CalendarIcon className="h-3.5 w-3.5" />
            <span className="text-xs">{profile.joinDate.toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <TrendingUpIcon className="h-3.5 w-3.5" />
            <span className="text-xs">{profile.totalTransactions} txns</span>
          </div>
        </div>

        {profile.flags && profile.flags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {profile.flags.slice(0, 2).map((flag, index) => (
              <Badge key={index} variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                {flag}
              </Badge>
            ))}
            {profile.flags.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{profile.flags.length - 2} more
              </Badge>
            )}
          </div>
        )}

        <Button variant="outline" size="sm" className="w-full bg-transparent" onClick={() => onViewDetails(profile)}>
          View Details
        </Button>
      </CardContent>
    </Card>
  )
}
