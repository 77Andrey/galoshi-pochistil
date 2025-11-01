import type {
  Transaction,
  KYCProfile,
  Investigation,
  AuditLog,
  DashboardMetrics,
  RiskLevel,
  TransactionStatus,
  KYCStatus,
} from "./types"

const countries = [
  "United States",
  "United Kingdom",
  "Germany",
  "France",
  "Japan",
  "Singapore",
  "Switzerland",
  "Canada",
  "Australia",
  "Netherlands",
  "Russia",
  "China",
  "Brazil",
  "Nigeria",
  "India",
]

const names = [
  "John Smith",
  "Emma Wilson",
  "Michael Chen",
  "Sarah Johnson",
  "David Brown",
  "Lisa Anderson",
  "Robert Taylor",
  "Maria Garcia",
  "James Martinez",
  "Jennifer Lee",
  "William Davis",
  "Patricia Rodriguez",
  "Richard Wilson",
  "Linda Moore",
  "Thomas Jackson",
]

const methods = ["Wire Transfer", "ACH", "SWIFT", "Card Payment", "Crypto", "Check"]

const riskLevels: RiskLevel[] = ["low", "medium", "high", "critical"]
const transactionStatuses: TransactionStatus[] = ["pending", "approved", "flagged", "rejected"]
const kycStatuses: KYCStatus[] = ["verified", "pending", "rejected", "review"]

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

function getRiskLevel(score: number): RiskLevel {
  if (score < 30) return "low"
  if (score < 60) return "medium"
  if (score < 85) return "high"
  return "critical"
}

export function generateTransactions(count: number): Transaction[] {
  const transactions: Transaction[] = []
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  for (let i = 0; i < count; i++) {
    const riskScore = Math.floor(Math.random() * 100)
    const riskLevel = getRiskLevel(riskScore)
    const status = riskScore > 70 ? randomItem(["flagged", "rejected"]) : randomItem(transactionStatuses)

    const flags: string[] = []
    if (riskScore > 70) {
      const possibleFlags = [
        "High-risk country",
        "Unusual amount",
        "Velocity check failed",
        "Sanctions list match",
        "PEP match",
      ]
      const flagCount = Math.floor(Math.random() * 3) + 1
      for (let j = 0; j < flagCount; j++) {
        flags.push(randomItem(possibleFlags))
      }
    }

    transactions.push({
      id: `TXN-${String(i + 1).padStart(6, "0")}`,
      timestamp: randomDate(thirtyDaysAgo, now),
      amount: Math.floor(Math.random() * 1000000) + 100,
      currency: randomItem(["USD", "EUR", "GBP", "JPY", "CHF"]),
      sender: randomItem(names),
      receiver: randomItem(names),
      status,
      riskScore,
      riskLevel,
      country: randomItem(countries),
      method: randomItem(methods),
      flags: flags.length > 0 ? flags : undefined,
    })
  }

  return transactions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
}

export function generateKYCProfiles(count: number): KYCProfile[] {
  const profiles: KYCProfile[] = []
  const now = new Date()
  const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)

  for (let i = 0; i < count; i++) {
    const riskScore = Math.floor(Math.random() * 100)
    const riskLevel = getRiskLevel(riskScore)
    const status = riskScore > 70 ? randomItem(["review", "rejected"]) : randomItem(kycStatuses)
    const joinDate = randomDate(oneYearAgo, now)

    const flags: string[] = []
    if (riskScore > 70) {
      const possibleFlags = ["Incomplete documents", "Address mismatch", "PEP", "Sanctions list", "High-risk country"]
      const flagCount = Math.floor(Math.random() * 2) + 1
      for (let j = 0; j < flagCount; j++) {
        flags.push(randomItem(possibleFlags))
      }
    }

    profiles.push({
      id: `KYC-${String(i + 1).padStart(6, "0")}`,
      name: randomItem(names),
      email: `user${i + 1}@example.com`,
      country: randomItem(countries),
      status,
      riskLevel,
      riskScore,
      joinDate,
      lastActivity: randomDate(joinDate, now),
      totalTransactions: Math.floor(Math.random() * 500),
      totalVolume: Math.floor(Math.random() * 10000000),
      documents: [
        {
          type: "ID Document",
          status: randomItem(["verified", "pending", "rejected"]),
          uploadDate: randomDate(joinDate, now),
        },
        {
          type: "Proof of Address",
          status: randomItem(["verified", "pending", "rejected"]),
          uploadDate: randomDate(joinDate, now),
        },
      ],
      flags: flags.length > 0 ? flags : undefined,
    })
  }

  return profiles
}

export function generateInvestigations(count: number): Investigation[] {
  const investigations: Investigation[] = []
  const now = new Date()
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)

  const types = ["AML Alert", "Fraud Detection", "KYC Review", "Sanctions Check", "PEP Investigation"]
  const assignees = ["Alice Cooper", "Bob Smith", "Carol White", "David Lee", "Emma Brown"]

  for (let i = 0; i < count; i++) {
    const createdAt = randomDate(sixtyDaysAgo, now)
    const status = randomItem(["open", "in-progress", "closed"] as const)

    investigations.push({
      id: `INV-${String(i + 1).padStart(6, "0")}`,
      profileId: `KYC-${String(Math.floor(Math.random() * 100) + 1).padStart(6, "0")}`,
      profileName: randomItem(names),
      type: randomItem(types),
      status,
      priority: randomItem(["low", "medium", "high", "critical"] as const),
      assignee: randomItem(assignees),
      createdAt,
      updatedAt: randomDate(createdAt, now),
      description: `Investigation triggered by automated risk assessment. Requires manual review and verification.`,
    })
  }

  return investigations.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

export function generateAuditLogs(count: number): AuditLog[] {
  const logs: AuditLog[] = []
  const now = new Date()
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  const users = ["admin@ff.com", "analyst1@ff.com", "analyst2@ff.com", "compliance@ff.com"]
  const actions = [
    "Approved transaction",
    "Flagged transaction",
    "Updated KYC profile",
    "Created investigation",
    "Closed investigation",
    "Updated policy",
    "Exported report",
  ]
  const resources = ["Transaction", "KYC Profile", "Investigation", "Policy", "Report"]

  for (let i = 0; i < count; i++) {
    logs.push({
      id: `LOG-${String(i + 1).padStart(8, "0")}`,
      timestamp: randomDate(sevenDaysAgo, now),
      user: randomItem(users),
      action: randomItem(actions),
      resource: randomItem(resources),
      details: `Action performed on ${randomItem(resources)} #${Math.floor(Math.random() * 10000)}`,
      ipAddress: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    })
  }

  return logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
}

export function generateDashboardMetrics(transactions: Transaction[], profiles: KYCProfile[]): DashboardMetrics {
  const flaggedTransactions = transactions.filter((t) => t.status === "flagged" || t.status === "rejected").length
  const totalVolume = transactions.reduce((sum, t) => sum + t.amount, 0)
  const pendingKYC = profiles.filter((p) => p.status === "pending" || p.status === "review").length

  const riskDistribution = {
    low: transactions.filter((t) => t.riskLevel === "low").length,
    medium: transactions.filter((t) => t.riskLevel === "medium").length,
    high: transactions.filter((t) => t.riskLevel === "high").length,
    critical: transactions.filter((t) => t.riskLevel === "critical").length,
  }

  // Generate 30-day trend
  const transactionTrend = []
  const now = new Date()
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
    const dateStr = date.toISOString().split("T")[0]
    const dayTransactions = transactions.filter((t) => {
      const txDate = new Date(t.timestamp).toISOString().split("T")[0]
      return txDate === dateStr
    })
    transactionTrend.push({
      date: dateStr,
      count: dayTransactions.length,
      volume: dayTransactions.reduce((sum, t) => sum + t.amount, 0),
    })
  }

  // Top risk countries
  const countryRisks = new Map<string, { count: number; totalRisk: number }>()
  transactions.forEach((t) => {
    const existing = countryRisks.get(t.country) || { count: 0, totalRisk: 0 }
    countryRisks.set(t.country, {
      count: existing.count + 1,
      totalRisk: existing.totalRisk + t.riskScore,
    })
  })

  const topRiskCountries = Array.from(countryRisks.entries())
    .map(([country, data]) => ({
      country,
      count: data.count,
      riskScore: Math.round(data.totalRisk / data.count),
    }))
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 5)

  return {
    totalTransactions: transactions.length,
    flaggedTransactions,
    totalVolume,
    activeInvestigations: Math.floor(Math.random() * 20) + 5,
    pendingKYC,
    riskDistribution,
    transactionTrend,
    topRiskCountries,
  }
}

// Client-side data generation - call after mount to avoid SSR issues
let _mockTransactions: Transaction[] | null = null
let _mockKYCProfiles: KYCProfile[] | null = null
let _mockInvestigations: Investigation[] | null = null
let _mockAuditLogs: AuditLog[] | null = null
let _mockDashboardMetrics: DashboardMetrics | null = null

export function getMockData() {
  if (typeof window === "undefined") {
    // Return empty data for SSR
    return {
      transactions: [],
      kycProfiles: [],
      investigations: [],
      auditLogs: [],
      dashboardMetrics: {
        totalTransactions: 0,
        flaggedTransactions: 0,
        totalVolume: 0,
        activeInvestigations: 0,
        pendingKYC: 0,
        riskDistribution: { low: 0, medium: 0, high: 0, critical: 0 },
        transactionTrend: [],
        topRiskCountries: [],
      },
    }
  }

  if (!_mockTransactions) {
    _mockTransactions = generateTransactions(10000)
    _mockKYCProfiles = generateKYCProfiles(500)
    _mockInvestigations = generateInvestigations(50)
    _mockAuditLogs = generateAuditLogs(1000)
    _mockDashboardMetrics = generateDashboardMetrics(_mockTransactions, _mockKYCProfiles)
  }

  return {
    transactions: _mockTransactions,
    kycProfiles: _mockKYCProfiles,
    investigations: _mockInvestigations,
    auditLogs: _mockAuditLogs,
    dashboardMetrics: _mockDashboardMetrics!,
  }
}

// Export functions for individual data access
export function useMockTransactions() {
  if (typeof window === "undefined") return []
  if (!_mockTransactions) _mockTransactions = generateTransactions(10000)
  return _mockTransactions
}

export function useMockKYCProfiles() {
  if (typeof window === "undefined") return []
  if (!_mockKYCProfiles) _mockKYCProfiles = generateKYCProfiles(500)
  return _mockKYCProfiles
}

export function useMockInvestigations() {
  if (typeof window === "undefined") return []
  if (!_mockInvestigations) _mockInvestigations = generateInvestigations(50)
  return _mockInvestigations
}

export function useMockAuditLogs() {
  if (typeof window === "undefined") return []
  if (!_mockAuditLogs) _mockAuditLogs = generateAuditLogs(1000)
  return _mockAuditLogs
}

export function useMockDashboardMetrics() {
  if (typeof window === "undefined")
    return {
      totalTransactions: 0,
      flaggedTransactions: 0,
      totalVolume: 0,
      activeInvestigations: 0,
      pendingKYC: 0,
      riskDistribution: { low: 0, medium: 0, high: 0, critical: 0 },
      transactionTrend: [],
      topRiskCountries: [],
    }
  if (!_mockTransactions || !_mockKYCProfiles) {
    _mockTransactions = generateTransactions(10000)
    _mockKYCProfiles = generateKYCProfiles(500)
  }
  if (!_mockDashboardMetrics) {
    _mockDashboardMetrics = generateDashboardMetrics(_mockTransactions, _mockKYCProfiles)
  }
  return _mockDashboardMetrics
}
