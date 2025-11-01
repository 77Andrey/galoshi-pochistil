"use client"

import { useState, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockAuditLogs } from "@/lib/mock-data"
import { SearchIcon, FilterIcon, DownloadIcon, UserIcon, ActivityIcon } from "lucide-react"

export default function AuditPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [userFilter, setUserFilter] = useState<string>("all")
  const [actionFilter, setActionFilter] = useState<string>("all")

  const users = useMemo(() => {
    const uniqueUsers = new Set(mockAuditLogs.map((log) => log.user))
    return Array.from(uniqueUsers).sort()
  }, [])

  const actions = useMemo(() => {
    const uniqueActions = new Set(mockAuditLogs.map((log) => log.action))
    return Array.from(uniqueActions).sort()
  }, [])

  const filteredLogs = useMemo(() => {
    return mockAuditLogs.filter((log) => {
      const matchesSearch =
        searchQuery === "" ||
        log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.user.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesUser = userFilter === "all" || log.user === userFilter
      const matchesAction = actionFilter === "all" || log.action === actionFilter

      return matchesSearch && matchesUser && matchesAction
    })
  }, [searchQuery, userFilter, actionFilter])

  const handleExport = () => {
    const csv = [
      ["ID", "Timestamp", "User", "Action", "Resource", "Details", "IP Address"].join(","),
      ...filteredLogs.map((log) =>
        [log.id, log.timestamp.toISOString(), log.user, log.action, log.resource, log.details, log.ipAddress].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `audit-log-${new Date().toISOString()}.csv`
    a.click()
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Audit Log</h1>
        <p className="text-muted-foreground mt-1">Complete audit trail of all system activities</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
              <ActivityIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Events</p>
              <p className="text-2xl font-bold">{mockAuditLogs.length.toLocaleString()}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
              <UserIcon className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Users</p>
              <p className="text-2xl font-bold">{users.length}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search audit logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <Select value={userFilter} onValueChange={setUserFilter}>
              <SelectTrigger className="w-[180px]">
                <FilterIcon className="mr-2 h-4 w-4" />
                <SelectValue placeholder="User" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                {users.map((user) => (
                  <SelectItem key={user} value={user}>
                    {user}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-[180px]">
                <FilterIcon className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                {actions.map((action) => (
                  <SelectItem key={action} value={action}>
                    {action}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleExport}>
              <DownloadIcon className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
        <div className="mt-4 text-sm text-muted-foreground">
          Showing {filteredLogs.length.toLocaleString()} of {mockAuditLogs.length.toLocaleString()} events
        </div>
      </Card>

      <Card>
        <div className="border-b border-border bg-muted/50 px-4 py-3">
          <div className="grid grid-cols-12 gap-4 text-xs font-medium text-muted-foreground">
            <div className="col-span-2">Timestamp</div>
            <div className="col-span-2">User</div>
            <div className="col-span-2">Action</div>
            <div className="col-span-2">Resource</div>
            <div className="col-span-3">Details</div>
            <div className="col-span-1">IP Address</div>
          </div>
        </div>
        <div className="max-h-[600px] overflow-auto">
          {filteredLogs.map((log) => (
            <div key={log.id} className="border-b border-border px-4 py-3 hover:bg-muted/50 transition-colors">
              <div className="grid grid-cols-12 gap-4 items-center text-sm">
                <div className="col-span-2 text-xs text-muted-foreground">{log.timestamp.toLocaleString()}</div>
                <div className="col-span-2 flex items-center gap-2">
                  <UserIcon className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs truncate">{log.user}</span>
                </div>
                <div className="col-span-2">
                  <Badge variant="outline" className="text-xs">
                    {log.action}
                  </Badge>
                </div>
                <div className="col-span-2 text-xs font-medium">{log.resource}</div>
                <div className="col-span-3 text-xs text-muted-foreground truncate">{log.details}</div>
                <div className="col-span-1 text-xs font-mono text-muted-foreground">{log.ipAddress}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
