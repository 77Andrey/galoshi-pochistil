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

export function QuickActions() {
  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Quick Actions</h3>
        <p className="text-sm text-muted-foreground">Common tasks and shortcuts</p>
      </div>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        <Button variant="outline" className="justify-start h-auto py-3">
          <SearchIcon className="mr-3 h-5 w-5 text-orange-600" />
          <div className="text-left">
            <div className="font-medium">New Investigation</div>
            <div className="text-xs text-muted-foreground">Create investigation case</div>
          </div>
        </Button>
        <Button variant="outline" className="justify-start h-auto py-3">
          <ShieldCheckIcon className="mr-3 h-5 w-5 text-blue-600" />
          <div className="text-left">
            <div className="font-medium">Risk Assessment</div>
            <div className="text-xs text-muted-foreground">Run risk calculation</div>
          </div>
        </Button>
        <Button variant="outline" className="justify-start h-auto py-3">
          <FileTextIcon className="mr-3 h-5 w-5 text-green-600" />
          <div className="text-left">
            <div className="font-medium">Generate Report</div>
            <div className="text-xs text-muted-foreground">Export compliance report</div>
          </div>
        </Button>
        <Button variant="outline" className="justify-start h-auto py-3">
          <AlertTriangleIcon className="mr-3 h-5 w-5 text-red-600" />
          <div className="text-left">
            <div className="font-medium">Alert Dashboard</div>
            <div className="text-xs text-muted-foreground">View critical alerts</div>
          </div>
        </Button>
        <Button variant="outline" className="justify-start h-auto py-3">
          <UsersIcon className="mr-3 h-5 w-5 text-purple-600" />
          <div className="text-left">
            <div className="font-medium">Customer Review</div>
            <div className="text-xs text-muted-foreground">Batch KYC review</div>
          </div>
        </Button>
        <Button variant="outline" className="justify-start h-auto py-3">
          <TrendingUpIcon className="mr-3 h-5 w-5 text-indigo-600" />
          <div className="text-left">
            <div className="font-medium">Analytics</div>
            <div className="text-xs text-muted-foreground">View analytics</div>
          </div>
        </Button>
      </div>
    </Card>
  )
}

