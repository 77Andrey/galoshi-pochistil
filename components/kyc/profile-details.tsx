"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { KYCProfile } from "@/lib/types"
import { cn } from "@/lib/utils"
import { XIcon, CheckCircleIcon, XCircleIcon, ClockIcon } from "lucide-react"

interface ProfileDetailsProps {
  profile: KYCProfile
  onClose: () => void
}

function getStatusBadgeColor(status: string): string {
  switch (status) {
    case "verified":
      return "bg-green-100 text-green-800 border-green-200"
    case "pending":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "rejected":
      return "bg-red-100 text-red-800 border-red-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case "verified":
      return <CheckCircleIcon className="h-4 w-4 text-green-600" />
    case "pending":
      return <ClockIcon className="h-4 w-4 text-blue-600" />
    case "rejected":
      return <XCircleIcon className="h-4 w-4 text-red-600" />
    default:
      return null
  }
}

export function ProfileDetails({ profile, onClose }: ProfileDetailsProps) {
  return (
    <Card>
      <CardHeader className="border-b border-border">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{profile.name}</CardTitle>
            <p className="text-sm text-muted-foreground font-mono mt-1">{profile.id}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <XIcon className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold mb-3">Personal Information</h3>
            <div className="space-y-2 text-sm">
              <div>
                <p className="text-muted-foreground">Email</p>
                <p className="font-medium">{profile.email}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Country</p>
                <p className="font-medium">{profile.country}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Join Date</p>
                <p className="font-medium">{profile.joinDate.toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Last Activity</p>
                <p className="font-medium">{profile.lastActivity.toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3">Risk Assessment</h3>
            <div className="space-y-2 text-sm">
              <div>
                <p className="text-muted-foreground">Status</p>
                <Badge variant="outline" className={cn("mt-1", getStatusBadgeColor(profile.status))}>
                  {profile.status}
                </Badge>
              </div>
              <div>
                <p className="text-muted-foreground">Risk Level</p>
                <Badge variant="outline" className={cn("mt-1", getStatusBadgeColor(profile.riskLevel))}>
                  {profile.riskLevel}
                </Badge>
              </div>
              <div>
                <p className="text-muted-foreground">Risk Score</p>
                <p className="font-medium font-mono">{profile.riskScore}/100</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-3">Transaction Activity</h3>
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Total Transactions</p>
                <p className="text-2xl font-bold mt-1">{profile.totalTransactions.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Total Volume</p>
                <p className="text-2xl font-bold mt-1">${(profile.totalVolume / 1000000).toFixed(2)}M</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-3">Documents</h3>
          <div className="space-y-2">
            {profile.documents.map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-border rounded">
                <div className="flex items-center gap-3">
                  {getStatusIcon(doc.status)}
                  <div>
                    <p className="text-sm font-medium">{doc.type}</p>
                    <p className="text-xs text-muted-foreground">Uploaded {doc.uploadDate.toLocaleDateString()}</p>
                  </div>
                </div>
                <Badge variant="outline" className={cn("text-xs", getStatusBadgeColor(doc.status))}>
                  {doc.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {profile.flags && profile.flags.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-3">Flags</h3>
            <div className="flex flex-wrap gap-2">
              {profile.flags.map((flag, index) => (
                <Badge key={index} variant="outline" className="bg-red-50 text-red-700 border-red-200">
                  {flag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-4 border-t border-border">
          <Button className="flex-1">Approve Profile</Button>
          <Button variant="outline" className="flex-1 bg-transparent">
            Request More Info
          </Button>
          <Button variant="destructive" className="flex-1">
            Reject Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
