"use client"

import { useState, useEffect } from "react"
import { InvestigationCard } from "@/components/investigations/investigation-card"
import { InvestigationDetail } from "@/components/investigations/investigation-detail"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useMockInvestigations } from "@/lib/mock-data"
import type { Investigation } from "@/lib/types"
import { useLanguage } from "@/components/language-provider"
import { SearchIcon, FilterIcon, PlusIcon } from "lucide-react"

export default function InvestigationsPage() {
  const [investigations, setInvestigations] = useState(useMockInvestigations())
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [selectedInvestigation, setSelectedInvestigation] = useState<Investigation | null>(null)
  const { t } = useLanguage()

  useEffect(() => {
    setInvestigations(useMockInvestigations())
  }, [])

  const filteredInvestigations = investigations.filter((investigation) => {
    const matchesSearch =
      searchQuery === "" ||
      investigation.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      investigation.profileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      investigation.type.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || investigation.status === statusFilter
    const matchesPriority = priorityFilter === "all" || investigation.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t.investigations.title}</h1>
          <p className="text-muted-foreground mt-1">{t.investigations.subtitle}</p>
        </div>
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" />
          {t.investigations.newInvestigation}
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t.investigations.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <FilterIcon className="mr-2 h-4 w-4" />
              <SelectValue placeholder={t.investigations.status} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.investigations.allStatus}</SelectItem>
              <SelectItem value="open">{t.investigations.open}</SelectItem>
              <SelectItem value="in-progress">{t.investigations.inProgress}</SelectItem>
              <SelectItem value="closed">{t.investigations.closed}</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[140px]">
              <FilterIcon className="mr-2 h-4 w-4" />
              <SelectValue placeholder={t.investigations.priority} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.investigations.allPriority}</SelectItem>
              <SelectItem value="low">{t.risk.low}</SelectItem>
              <SelectItem value="medium">{t.risk.medium}</SelectItem>
              <SelectItem value="high">{t.risk.high}</SelectItem>
              <SelectItem value="critical">{t.risk.critical}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {!selectedInvestigation && (
        <div className="text-sm text-muted-foreground">
          {t.investigations.showing} {filteredInvestigations.length} {t.investigations.of} {investigations.length} {t.investigations.investigations}
        </div>
      )}

      {selectedInvestigation ? (
        <InvestigationDetail
          investigation={selectedInvestigation}
          onClose={() => setSelectedInvestigation(null)}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredInvestigations.map((investigation) => (
            <InvestigationCard
              key={investigation.id}
              investigation={investigation}
              onViewDetails={setSelectedInvestigation}
            />
          ))}
        </div>
      )}
    </div>
  )
}
