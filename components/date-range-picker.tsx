"use client"

import { useState } from "react"
import { CalendarIcon, XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card } from "@/components/ui/card"

interface DateRangePickerProps {
  value?: { start: Date | null; end: Date | null }
  onChange: (range: { start: Date | null; end: Date | null }) => void
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const [open, setOpen] = useState(false)

  const formatDate = (date: Date | null) => {
    if (!date) return ""
    return date.toISOString().split("T")[0]
  }

  const handleStartChange = (dateStr: string) => {
    const date = dateStr ? new Date(dateStr) : null
    onChange({ start: date, end: value?.end || null })
  }

  const handleEndChange = (dateStr: string) => {
    const date = dateStr ? new Date(dateStr) : null
    onChange({ start: value?.start || null, end: date })
  }

  const handleClear = () => {
    onChange({ start: null, end: null })
  }

  const quickSelects = [
    { label: "Last 7 days", days: 7 },
    { label: "Last 30 days", days: 30 },
    { label: "Last 90 days", days: 90 },
    { label: "Last year", days: 365 },
  ]

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[280px] justify-start text-left font-normal">
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value?.start && value?.end
            ? `${formatDate(value.start)} - ${formatDate(value.end)}`
            : value?.start
              ? `From ${formatDate(value.start)}`
              : value?.end
                ? `Until ${formatDate(value.end)}`
                : "Select date range"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Card className="p-4">
          <div className="space-y-4">
            <div className="grid gap-2">
              <label className="text-xs font-medium text-muted-foreground">Start Date</label>
              <Input
                type="date"
                value={formatDate(value?.start || null)}
                onChange={(e) => handleStartChange(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <label className="text-xs font-medium text-muted-foreground">End Date</label>
              <Input
                type="date"
                value={formatDate(value?.end || null)}
                onChange={(e) => handleEndChange(e.target.value)}
              />
            </div>
            <div className="border-t border-border pt-4">
              <p className="text-xs font-medium text-muted-foreground mb-2">Quick Select</p>
              <div className="grid gap-1">
                {quickSelects.map((quick) => (
                  <Button
                    key={quick.label}
                    variant="ghost"
                    size="sm"
                    className="justify-start"
                    onClick={() => {
                      const end = new Date()
                      const start = new Date()
                      start.setDate(start.getDate() - quick.days)
                      onChange({ start, end })
                      setOpen(false)
                    }}
                  >
                    {quick.label}
                  </Button>
                ))}
              </div>
            </div>
            {(value?.start || value?.end) && (
              <Button variant="outline" size="sm" onClick={handleClear} className="w-full">
                <XIcon className="mr-2 h-4 w-4" />
                Clear
              </Button>
            )}
          </div>
        </Card>
      </PopoverContent>
    </Popover>
  )
}

