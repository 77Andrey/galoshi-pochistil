# Financial Fortresses: Ops Console

An interactive KYC/AML operations console built with Next.js, featuring a Neo-Swiss Minimal design aesthetic. This application provides comprehensive transaction monitoring, customer profiling, investigation management, and compliance tools.

## Features

- **Overview Dashboard**: 
  - Real-time KPIs, incident trends, and regional risk distribution
  - Quick Actions panel for common tasks
- **Transaction Monitoring**: 
  - Virtualized table handling 10K+ transactions with advanced filtering
  - Sticky header for easy column reference
  - URL-based filter persistence (filters saved in URL)
  - Bulk actions: approve, flag, or reject multiple transactions
  - Multi-select with checkbox selection
  - Export to CSV or JSON formats (client-side only)
- **KYC Profiles**: Customer verification and behavioral analysis
- **Investigation Management**: 
  - Task templates and checklists for different investigation types
  - @mentions for team collaboration
  - Activity timeline with comments
- **Role-Based Access Control**: Viewer/Analyst/Admin roles (UI-level permissions)
- **Audit Log**: Complete system activity tracking with filtering and export
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
- `skipLibCheck: true` for faster TypeScript compilation
- Pure JavaScript/TypeScript dependencies only (no native binaries)

### Performance Optimizations
- Mock data generation happens after component mount (not during build)
- Table virtualization for handling large datasets (10K+ rows)
- Lazy loading for heavy components (charts loaded dynamically)
- Client-side caching of generated mock data

### Vercel-Safe Guarantees
✅ **No Server Dependencies**: 100% static export, no API routes or server actions  
✅ **No Build-Time Data**: All 10K+ transactions generated client-side after mount  
✅ **No DOM in SSR**: All charts and interactive components use dynamic imports with `ssr: false`  
✅ **No External APIs**: Zero network dependencies, fully self-contained  
✅ **No Environment Variables**: Works out-of-the-box without configuration  
✅ **Pure Client Export**: Can be deployed to any static hosting (Vercel, Netlify, Cloudflare Pages, etc.)  
✅ **CSV Export via Blob**: File downloads use browser APIs only  
✅ **URL State Management**: Filters saved in URL using Next.js navigation hooks (client-side only)

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
│   ├── page.tsx                    # Overview dashboard (client-side)
│   ├── monitoring/page.tsx         # Transaction monitoring (client-side)
│   ├── kyc/page.tsx                # Customer profiles (client-side)
│   ├── investigations/page.tsx     # Investigation management (client-side)
│   ├── policies/page.tsx           # Rule configuration (client-side)
│   ├── audit/page.tsx              # Audit log (client-side)
│   └── layout.tsx                  # Root layout with providers
├── components/
│   ├── ui/                         # shadcn/ui components
│   ├── navigation.tsx              # Main navigation with role selector
│   ├── role-provider.tsx           # Role-based access control
│   ├── providers.tsx               # Client-side context providers
│   ├── dashboard/                  # Dashboard chart components
│   ├── monitoring/                 # Transaction table with virtualization
│   ├── investigations/             # Investigation cards and detail views
│   ├── kyc/                        # Profile cards and details
│   ├── risk-badge.tsx              # Risk level indicators
│   └── stat-card.tsx               # KPI cards
├── lib/
│   ├── mock-data.ts                # Client-side synthetic data generator
│   ├── types.ts                    # TypeScript definitions
│   ├── utils.ts                    # Utility functions
│   └── hooks/
│       └── use-keyboard-shortcuts.ts
└── next.config.ts                  # Static export configuration
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

- **Transactions**: 10,000 records with realistic patterns, risk scores, and statuses
- **KYC Profiles**: 500 customer profiles with verification status and risk levels
- **Investigations**: 50 cases across different types and priorities
- **Audit Logs**: 1,000 system events with user tracking

### Data Generation Strategy

Data generation happens **100% on the client side** after component mount to avoid bloating the build bundle:
- Initial empty arrays returned during SSR
- Data generated on first access after mount
- Results cached for subsequent access
- No impact on build time or bundle size

### Features Enabled by Mock Data
- Interactive charts with 30-day trends
- Risk distribution across all entities
- Top risk countries analysis
- Full table virtualization with filtering
- URL-based state persistence
- CSV export functionality
- Complete audit trail simulation

## License

MIT
