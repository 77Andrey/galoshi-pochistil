"use client"

import { useState } from "react"
import { ProfileCard } from "@/components/kyc/profile-card"
import { ProfileDetails } from "@/components/kyc/profile-details"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockKYCProfiles } from "@/lib/mock-data"
import type { KYCProfile } from "@/lib/types"
import { SearchIcon, FilterIcon } from "lucide-react"

export default function KYCPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [riskFilter, setRiskFilter] = useState<string>("all")
  const [selectedProfile, setSelectedProfile] = useState<KYCProfile | null>(null)

  const filteredProfiles = mockKYCProfiles.filter((profile) => {
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
        <h1 className="text-3xl font-bold tracking-tight">KYC Profiles</h1>
        <p className="text-muted-foreground mt-1">Manage and review customer verification profiles</p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <FilterIcon className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="review">Review</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Select value={riskFilter} onValueChange={setRiskFilter}>
            <SelectTrigger className="w-[140px]">
              <FilterIcon className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Risk" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Risk</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="text-sm text-muted-foreground">
        Showing {filteredProfiles.length} of {mockKYCProfiles.length} profiles
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
