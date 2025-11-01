"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { Investigation } from "@/lib/types"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/components/language-provider"
import { UserIcon, CalendarIcon, ClockIcon, CheckIcon, XIcon, UserPlusIcon } from "lucide-react"

interface InvestigationDetailProps {
  investigation: Investigation
  onClose: () => void
}

interface Task {
  id: string
  description: string
  completed: boolean
  assignedTo?: string
}

interface Comment {
  id: string
  user: string
  text: string
  mentions: string[]
  timestamp: Date
}

const investigationTemplates = {
  "AML Alert": [
    "Review transaction history",
    "Verify customer identity",
    "Check sanctions lists",
    "Document findings",
  ],
  "Fraud Detection": [
    "Verify account owner",
    "Review recent transactions",
    "Contact customer",
    "Escalate if confirmed",
  ],
  "KYC Review": [
    "Verify documents",
    "Cross-reference databases",
    "Review risk profile",
    "Approve or request more info",
  ],
  "Sanctions Check": [
    "Search global watchlists",
    "Verify entity details",
    "Document match/no-match",
    "Report findings",
  ],
  "PEP Investigation": [
    "Verify PEP status",
    "Assess risk level",
    "Review business relationship",
    "Document decision",
  ],
}

export function InvestigationDetail({ investigation, onClose }: InvestigationDetailProps) {
  const { t } = useLanguage()
  const [tasks, setTasks] = useState<Task[]>(
    investigationTemplates[investigation.type as keyof typeof investigationTemplates]?.map(
      (desc, idx) => ({
        id: `task-${idx}`,
        description: desc,
        completed: false,
      }),
    ) || [],
  )
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "comment-1",
      user: investigation.assignee,
      text: `Started investigation on ${investigation.profileName}. Initial risk assessment indicates @alice @bob should review.`,
      mentions: ["alice", "bob"],
      timestamp: new Date(),
    },
  ])
  const [newComment, setNewComment] = useState("")
  const [mentionSuggestions] = useState([
    "alice",
    "bob",
    "carol",
    "david",
    "emma",
  ])

  const handleTaskToggle = (taskId: string) => {
    setTasks(
      tasks.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)),
    )
  }

  const handleCommentAdd = () => {
    if (!newComment.trim()) return
    const mentions = mentionSuggestions.filter((user) => newComment.includes(`@${user}`))
    const comment: Comment = {
      id: `comment-${comments.length + 1}`,
      user: investigation.assignee,
      text: newComment,
      mentions,
      timestamp: new Date(),
    }
    setComments([...comments, comment])
    setNewComment("")
  }

  const getPriorityBadgeColor = (priority: string): string => {
    switch (priority) {
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

  const getStatusBadgeColor = (status: string): string => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "in-progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "closed":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold">{investigation.type}</h1>
            <Badge variant="outline" className={cn("text-xs", getStatusBadgeColor(investigation.status))}>
              {investigation.status}
            </Badge>
            <Badge variant="outline" className={cn("text-xs", getPriorityBadgeColor(investigation.priority))}>
              {investigation.priority}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground font-mono">{investigation.id}</p>
        </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <XIcon className="h-4 w-4 mr-2" />
              {t.investigations.close}
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">{t.investigations.profile}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <UserIcon className="h-4 w-4" />
                    <span>{investigation.profileName}</span>
                  </div>
                  <div className="text-xs font-mono text-muted-foreground">
                    {investigation.profileId}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">{t.investigations.timeline}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CalendarIcon className="h-4 w-4" />
                    <span className="text-xs">{t.investigations.created} {investigation.createdAt.toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <ClockIcon className="h-4 w-4" />
                    <span className="text-xs">{t.investigations.updated} {investigation.updatedAt.toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">{t.investigations.assignedTo}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <UserPlusIcon className="h-4 w-4" />
                    <span>{investigation.assignee}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t.investigations.description}</CardTitle>
            </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{investigation.description}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t.investigations.taskChecklist}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-3 p-3 border border-border rounded hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => handleTaskToggle(task.id)}
              >
                <div
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded border",
                    task.completed
                      ? "bg-green-100 border-green-300"
                      : "border-border bg-background",
                  )}
                >
                  {task.completed && <CheckIcon className="h-3 w-3 text-green-800" />}
                </div>
                <span
                  className={cn(
                    "text-sm flex-1",
                    task.completed && "line-through text-muted-foreground",
                  )}
                >
                  {task.description}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t.investigations.commentsActivity}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="border-l-2 border-border pl-4 space-y-1">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">{comment.user}</span>
                  <span className="text-xs text-muted-foreground">
                    {comment.timestamp.toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {comment.text.split(/(@\w+)/g).map((part, idx) => {
                    if (part.startsWith("@")) {
                      return (
                        <span key={idx} className="text-blue-600 font-medium">
                          {part}
                        </span>
                      )
                    }
                    return part
                  })}
                </p>
                {comment.mentions.length > 0 && (
                  <div className="flex gap-1 mt-1">
                    {comment.mentions.map((mention) => (
                      <Badge key={mention} variant="outline" className="text-xs">
                        @{mention}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="border-t border-border pt-4 space-y-2">
              <Textarea
                placeholder={t.investigations.addCommentPlaceholder}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[80px]"
              />
              <Button size="sm" onClick={handleCommentAdd}>
                {t.investigations.addComment}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

