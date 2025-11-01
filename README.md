# Financial Fortresses: Ops Console

An interactive KYC/AML operations console built with Next.js, featuring a Neo-Swiss Minimal design aesthetic. This application provides comprehensive transaction monitoring, customer profiling, investigation management, and compliance tools.

## Features

- **Overview Dashboard**: Real-time KPIs, incident trends, and regional risk distribution
- **Transaction Monitoring**: Virtualized table handling 10-20K transactions with advanced filtering
- **KYC Profiles**: Customer verification and behavioral analysis
- **Investigation Management**: Kanban-style workflow for compliance cases
- **Policy Engine**: Rule configuration and management
- **Audit Log**: Complete system activity tracking
- **Keyboard Shortcuts**: Efficient navigation (/ for search, g+key for pages)

## Technology Stack

- **Framework**: Next.js 15 (App Router) with TypeScript
- **Styling**: Tailwind CSS v4 with shadcn/ui components
- **Charts**: Recharts for lightweight data visualization
- **Data**: Client-side synthetic mock data generation

## Why This Build Succeeds on Vercel

This project is specifically configured for reliable deployment on Vercel:

### Static Export Configuration
- `output: 'export'` in next.config.ts enables static site generation
- `images: { unoptimized: true }` removes server-side image optimization dependency
- No server-side features (API routes, server actions, route handlers)

### No Required Environment Variables
- All functionality works without ENV configuration
- Mock data generated entirely on the client side
- No external API dependencies

### Client-Side Only DOM Operations
- Charts and virtualized tables use dynamic imports with `ssr: false`
- All DOM-dependent code runs only in client components
- No `window` or `document` references in server components

### Build Configuration
- TypeScript errors don't block builds (`ignoreBuildErrors: true`)
- ESLint warnings don't fail deployment (`ignoreDuringBuilds: true`)
- Pure JavaScript/TypeScript dependencies only (no native binaries)

### Performance Optimizations
- Mock data generation happens after component mount (not during build)
- Table virtualization for handling large datasets
- Lazy loading for heavy components

## Getting Started

### Installation

\`\`\`bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
\`\`\`

### Deployment to Vercel

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Import the project in Vercel dashboard
3. Vercel will automatically detect Next.js and use the correct build settings
4. Deploy! No additional configuration needed.

Alternatively, use the Vercel CLI:

\`\`\`bash
npm install -g vercel
vercel
\`\`\`

## Project Structure

\`\`\`
├── app/
│   ├── page.tsx                 # Overview dashboard
│   ├── monitoring/              # Transaction monitoring
│   ├── kyc/                     # Customer profiles
│   ├── investigations/          # Investigation management
│   ├── policies/                # Rule configuration
│   └── audit/                   # Audit log
├── components/
│   ├── ui/                      # shadcn/ui components
│   ├── navigation.tsx           # Main navigation
│   ├── risk-badge.tsx           # Risk level indicators
│   └── stat-card.tsx            # KPI cards
├── lib/
│   ├── mock-data.ts             # Synthetic data generator
│   └── hooks/
│       └── use-keyboard-shortcuts.ts
└── next.config.ts               # Static export configuration
\`\`\`

## Keyboard Shortcuts

- `/` - Focus search input
- `g` + `o` - Navigate to Overview
- `g` + `m` - Navigate to Monitoring
- `g` + `k` - Navigate to KYC Profiles
- `g` + `i` - Navigate to Investigations
- `g` + `p` - Navigate to Policies
- `g` + `a` - Navigate to Audit Log

## Design System

### Colors
- **Background**: #fafafa (light gray)
- **Foreground**: #0a0a0a (near black)
- **Risk Levels**:
  - Low: #10b981 (emerald)
  - Medium: #f59e0b (amber)
  - High: #ef4444 (red)
  - Critical: #dc2626 (dark red)

### Typography
- **Sans**: Geist (primary interface font)
- **Mono**: Geist Mono (code and data display)

### Layout
- Generous whitespace and padding
- Subtle grid background pattern
- Thin borders (1px) with gray dividers
- Compact, information-dense tables

## Mock Data

All data is synthetically generated using a seeded random number generator for deterministic results:

- **Transactions**: 10,000+ records with realistic patterns
- **Customers**: 1,000+ profiles with KYC status
- **Investigations**: 100+ cases across different statuses
- **Audit Logs**: 500+ system events
- **Rules**: 8 pre-configured compliance rules

Data generation happens on the client side after component mount to avoid bloating the build bundle.

## License

MIT
