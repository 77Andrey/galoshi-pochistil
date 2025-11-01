export type RiskLevel = "low" | "medium" | "high" | "critical"
export type TransactionStatus = "pending" | "approved" | "flagged" | "rejected"
export type KYCStatus = "verified" | "pending" | "rejected" | "review"

export interface Transaction {
  id: string
  timestamp: Date
  amount: number
  currency: string
  sender: string
  receiver: string
  status: TransactionStatus
  riskScore: number
  riskLevel: RiskLevel
  country: string
  method: string
  flags?: string[]
}

export interface KYCProfile {
  id: string
  name: string
  email: string
  country: string
  status: KYCStatus
  riskLevel: RiskLevel
  riskScore: number
  joinDate: Date
  lastActivity: Date
  totalTransactions: number
  totalVolume: number
  documents: {
    type: string
    status: string
    uploadDate: Date
  }[]
  flags?: string[]
}

export interface Investigation {
  id: string
  profileId: string
  profileName: string
  type: string
  status: "open" | "in-progress" | "closed"
  priority: "low" | "medium" | "high" | "critical"
  assignee: string
  createdAt: Date
  updatedAt: Date
  description: string
}

export interface AuditLog {
  id: string
  timestamp: Date
  user: string
  action: string
  resource: string
  details: string
  ipAddress: string
}

export interface DashboardMetrics {
  totalTransactions: number
  flaggedTransactions: number
  totalVolume: number
  activeInvestigations: number
  pendingKYC: number
  riskDistribution: {
    low: number
    medium: number
    high: number
    critical: number
  }
  transactionTrend: {
    date: string
    count: number
    volume: number
  }[]
  topRiskCountries: {
    country: string
    count: number
    riskScore: number
  }[]
}
