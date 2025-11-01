"use client"

import { useState, useEffect } from "react"
import { ProfileCard } from "@/components/kyc/profile-card"
import { ProfileDetails } from "@/components/kyc/profile-details"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useMockKYCProfiles } from "@/lib/mock-data"
import type { KYCProfile } from "@/lib/types"
import { useLanguage } from "@/components/language-provider"
import { SearchIcon, FilterIcon } from "lucide-react"

export default function KYCPage() {
  const [profiles, setProfiles] = useState(useMockKYCProfiles())
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [riskFilter, setRiskFilter] = useState<string>("all")
  const [selectedProfile, setSelectedProfile] = useState<KYCProfile | null>(null)
  const { t } = useLanguage()

  useEffect(() => {
    setProfiles(useMockKYCProfiles())
  }, [])

  const filteredProfiles = profiles.filter((profile) => {
    const matchesSearch =
      searchQuery === "" ||
      profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.id.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || profile.status === statusFilter
    const matchesRisk = riskFilter === "all" || profile.riskLevel === riskFilter

    return matchesSearch && matchesStatus && matchesRisk
  })

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t.kyc.title}</h1>
        <p className="text-muted-foreground mt-1">{t.kyc.subtitle}</p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t.kyc.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <FilterIcon className="mr-2 h-4 w-4" />
              <SelectValue placeholder={t.kyc.status} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.kyc.allStatus}</SelectItem>
              <SelectItem value="verified">{t.kyc.verified}</SelectItem>
              <SelectItem value="pending">{t.kyc.pending}</SelectItem>
              <SelectItem value="review">{t.kyc.review}</SelectItem>
              <SelectItem value="rejected">{t.kyc.rejected}</SelectItem>
            </SelectContent>
          </Select>
          <Select value={riskFilter} onValueChange={setRiskFilter}>
            <SelectTrigger className="w-[140px]">
              <FilterIcon className="mr-2 h-4 w-4" />
              <SelectValue placeholder={t.kyc.risk} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.kyc.allRisk}</SelectItem>
              <SelectItem value="low">{t.risk.low}</SelectItem>
              <SelectItem value="medium">{t.risk.medium}</SelectItem>
              <SelectItem value="high">{t.risk.high}</SelectItem>
              <SelectItem value="critical">{t.risk.critical}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="text-sm text-muted-foreground">
        {t.kyc.showing} {filteredProfiles.length} {t.kyc.of} {profiles.length} {t.kyc.profiles}
      </div>

      {selectedProfile ? (
        <ProfileDetails profile={selectedProfile} onClose={() => setSelectedProfile(null)} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredProfiles.map((profile) => (
            <ProfileCard key={profile.id} profile={profile} onViewDetails={setSelectedProfile} />
          ))}
        </div>
      )}
    </div>
  )
}
