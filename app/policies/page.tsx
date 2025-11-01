"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { SearchIcon, ShieldCheckIcon, AlertTriangleIcon, DollarSignIcon, MapPinIcon } from "lucide-react"

interface Policy {
  id: string
  name: string
  description: string
  category: string
  enabled: boolean
  riskLevel: string
  lastUpdated: Date
}

const mockPolicies: Policy[] = [
  {
    id: "POL-001",
    name: "High-Value Transaction Alert",
    description: "Flag transactions exceeding $100,000 for manual review",
    category: "Transaction Monitoring",
    enabled: true,
    riskLevel: "high",
    lastUpdated: new Date("2025-01-15"),
  },
  {
    id: "POL-002",
    name: "Sanctions List Screening",
    description: "Automatically screen all customers against OFAC and UN sanctions lists",
    category: "Compliance",
    enabled: true,
    riskLevel: "critical",
    lastUpdated: new Date("2025-01-20"),
  },
  {
    id: "POL-003",
    name: "PEP Detection",
    description: "Identify and flag Politically Exposed Persons for enhanced due diligence",
    category: "KYC",
    enabled: true,
    riskLevel: "high",
    lastUpdated: new Date("2025-01-18"),
  },
  {
    id: "POL-004",
    name: "Velocity Check",
    description: "Flag accounts with more than 10 transactions in 24 hours",
    category: "Fraud Prevention",
    enabled: true,
    riskLevel: "medium",
    lastUpdated: new Date("2025-01-22"),
  },
  {
    id: "POL-005",
    name: "High-Risk Country Monitoring",
    description: "Enhanced monitoring for transactions from high-risk jurisdictions",
    category: "Geographic Risk",
    enabled: true,
    riskLevel: "high",
    lastUpdated: new Date("2025-01-10"),
  },
  {
    id: "POL-006",
    name: "Unusual Pattern Detection",
    description: "ML-based detection of unusual transaction patterns",
    category: "Transaction Monitoring",
    enabled: false,
    riskLevel: "medium",
    lastUpdated: new Date("2025-01-05"),
  },
  {
    id: "POL-007",
    name: "Document Expiry Alert",
    description: "Alert when customer identification documents are about to expire",
    category: "KYC",
    enabled: true,
    riskLevel: "low",
    lastUpdated: new Date("2025-01-25"),
  },
  {
    id: "POL-008",
    name: "Crypto Transaction Monitoring",
    description: "Enhanced monitoring for cryptocurrency-related transactions",
    category: "Transaction Monitoring",
    enabled: true,
    riskLevel: "high",
    lastUpdated: new Date("2025-01-12"),
  },
]

function getCategoryIcon(category: string) {
  switch (category) {
    case "Transaction Monitoring":
      return <DollarSignIcon className="h-4 w-4" />
    case "Compliance":
      return <ShieldCheckIcon className="h-4 w-4" />
    case "KYC":
      return <ShieldCheckIcon className="h-4 w-4" />
    case "Fraud Prevention":
      return <AlertTriangleIcon className="h-4 w-4" />
    case "Geographic Risk":
      return <MapPinIcon className="h-4 w-4" />
    default:
      return <ShieldCheckIcon className="h-4 w-4" />
  }
}

function getRiskBadgeColor(level: string): string {
  switch (level) {
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

export default function PoliciesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [policies, setPolicies] = useState(mockPolicies)

  const filteredPolicies = policies.filter(
    (policy) =>
      searchQuery === "" ||
      policy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      policy.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      policy.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const togglePolicy = (id: string) => {
    setPolicies(policies.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p)))
  }

  const enabledCount = policies.filter((p) => p.enabled).length

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Compliance Policies</h1>
        <p className="text-muted-foreground mt-1">Configure and manage AML/KYC compliance rules</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                <ShieldCheckIcon className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Policies</p>
                <p className="text-2xl font-bold">{enabledCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                <ShieldCheckIcon className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Inactive Policies</p>
                <p className="text-2xl font-bold">{policies.length - enabledCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                <ShieldCheckIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Policies</p>
                <p className="text-2xl font-bold">{policies.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search policies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="space-y-3">
        {filteredPolicies.map((policy) => (
          <Card key={policy.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted mt-1">
                    {getCategoryIcon(policy.category)}
                  </div>
                  <div>
                    <CardTitle className="text-base">{policy.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{policy.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {policy.category}
                      </Badge>
                      <Badge variant="outline" className={`text-xs ${getRiskBadgeColor(policy.riskLevel)}`}>
                        {policy.riskLevel} risk
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Updated {policy.lastUpdated.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Switch checked={policy.enabled} onCheckedChange={() => togglePolicy(policy.id)} />
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}
