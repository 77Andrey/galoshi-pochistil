"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  AlertTriangleIcon,
  FileTextIcon,
  SearchIcon,
  ShieldCheckIcon,
  TrendingUpIcon,
  UsersIcon,
} from "lucide-react"
import { useLanguage } from "@/components/language-provider"

export function QuickActions() {
  const { t } = useLanguage()
  
  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">{t.dashboard.quickActions}</h3>
        <p className="text-sm text-muted-foreground">{t.dashboard.quickActionsSubtitle}</p>
      </div>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        <Button variant="outline" className="justify-start h-auto py-3">
          <SearchIcon className="mr-3 h-5 w-5 text-orange-600" />
          <div className="text-left">
            <div className="font-medium">{t.quickActions.newInvestigation}</div>
            <div className="text-xs text-muted-foreground">{t.quickActions.newInvestigationDesc}</div>
          </div>
        </Button>
        <Button variant="outline" className="justify-start h-auto py-3">
          <ShieldCheckIcon className="mr-3 h-5 w-5 text-blue-600" />
          <div className="text-left">
            <div className="font-medium">{t.quickActions.riskAssessment}</div>
            <div className="text-xs text-muted-foreground">{t.quickActions.riskAssessmentDesc}</div>
          </div>
        </Button>
        <Button variant="outline" className="justify-start h-auto py-3">
          <FileTextIcon className="mr-3 h-5 w-5 text-green-600" />
          <div className="text-left">
            <div className="font-medium">{t.quickActions.generateReport}</div>
            <div className="text-xs text-muted-foreground">{t.quickActions.generateReportDesc}</div>
          </div>
        </Button>
        <Button variant="outline" className="justify-start h-auto py-3">
          <AlertTriangleIcon className="mr-3 h-5 w-5 text-red-600" />
          <div className="text-left">
            <div className="font-medium">{t.quickActions.alertDashboard}</div>
            <div className="text-xs text-muted-foreground">{t.quickActions.alertDashboardDesc}</div>
          </div>
        </Button>
        <Button variant="outline" className="justify-start h-auto py-3">
          <UsersIcon className="mr-3 h-5 w-5 text-purple-600" />
          <div className="text-left">
            <div className="font-medium">{t.quickActions.customerReview}</div>
            <div className="text-xs text-muted-foreground">{t.quickActions.customerReviewDesc}</div>
          </div>
        </Button>
        <Button variant="outline" className="justify-start h-auto py-3">
          <TrendingUpIcon className="mr-3 h-5 w-5 text-indigo-600" />
          <div className="text-left">
            <div className="font-medium">{t.quickActions.analytics}</div>
            <div className="text-xs text-muted-foreground">{t.quickActions.analyticsDesc}</div>
          </div>
        </Button>
      </div>
    </Card>
  )
}

