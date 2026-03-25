# SmartWatts - Complete File Manifest

## Project Root Files
```
.env.local              → Environment variables (DO NOT commit)
.env.example            → Template for .env.local
.eslintrc.json          → ESLint configuration
.gitignore              → Git ignore patterns
next.config.js          → Next.js configuration
package.json            → Dependencies & scripts
postcss.config.js       → PostCSS configuration
tailwind.config.ts      → Tailwind CSS configuration
tsconfig.json           → TypeScript configuration
vercel.json             → Vercel deployment config
setup.sh                → Automated setup script
```

## Documentation
```
README.md               → Main project documentation
QUICK_START.md          → 5-minute setup guide
DEPLOYMENT.md           → Deploy to production (Vercel)
ARCHITECTURE.md         → System design & data flow
ROADMAP.md              → Feature roadmap & timeline
```

## Database
```
supabase-schema.sql     → Complete PostgreSQL schema
                         Tables: profiles, activities, daily_metrics, 
                         nutrition_logs, pmc_data
```

## Source Code: `/src`

### App Router: `/src/app`
```
layout.tsx              → Root HTML layout
providers.tsx           → Context providers wrapper
page.tsx                → Dashboard main page (with mock data)
globals.css             → Global Tailwind styles & animations
api/
  └── metrics/
      └── route.ts      → POST endpoint: calculate metrics from power data
```

### Components: `/src/components`
```
MetricCard.tsx          → KPI card (displays: label, value, unit, trend)
PMCChart.tsx            → Performance Management Chart (CTL/ATL/TSB)
PowerDurationCurve.tsx  → Power vs Duration (logarithmic scale)
ZoneDistribution.tsx    → Bar chart: time in power/HR zones
Navigation.tsx          → Header with navigation menu
Footer.tsx              → Footer with links & legal
index.ts                → Export all components

Styling: Dark mode (bg-dark: #0a0a0a), Strava orange (#fc4c02)
```

### Libraries: `/src/lib`
```
supabase.ts             → Supabase client initialization
metrics.ts              → TrainingPeaks calculations
                         • calculateNormalizedPower(powerData)
                         • calculateIntensityFactor(np, ftp)
                         • calculateTSS(duration, np, ftp)
                         • calculateVariabilityIndex(np, avgPower)
                         • calculateCTL/ATL/TSB(tssHistory)
                         • calculateCHORequirement(energy, weight)

coach.ts                → Google Gemini AI integration
                         • getCoachAnalysis(athleteProfile)
                         • analyzeTrainingDocument(content)
                         • generateTrainingPlan(goals, weeks, ctl)

utils.ts                → Helper functions
                         • formatDate, formatTime, formatDistance
                         • getZoneColor, getZoneName
                         • getTrendPercentage, clsx
```

### Hooks: `/src/hooks`
```
useSupabase.ts          → Custom React hooks
                         • useProfile() → Fetch user FTP/LTHR/weight
                         • useActivities(limit) → Recent rides
                         • useDailyMetrics(daysBack) → Health data
```

### Types: `/src/types`
```
index.ts                → TypeScript interfaces
                         • Profile, Activity, DailyMetrics
                         • NutritionLog, PMCData, PowerCurveData
```

### State: `/src/stores`
```
(Empty - Ready for Zustand/state management)
```

### Public Assets: `/public`
```
(Empty - Add logos, favicons, images here)
```

## Key Features Implemented

✅ **Core Dashboard**
  - PMC Chart (multi-line area chart with CTL, ATL, TSB)
  - Metric Cards (KPIs with trends)
  - Power Duration Curve
  - Zone distribution (power & HR)
  
✅ **Calculations Engine**
  - Normalized Power (NP) calculation
  - Intensity Factor (IF)
  - Training Stress Score (TSS)
  - Variability Index (VI)
  - Efficiency Factor (EF)
  - PMC metrics (CTL, ATL, TSB)
  - CHO recovery requirements
  
✅ **Database Schema**
  - 5 tables with RLS (Row Level Security)
  - Indexes on common queries
  - Triggers for auto-update timestamps
  - Support for power time-series data (JSONB)
  
✅ **UI Components**
  - Dark mode theme (Tailwind)
  - Responsive design (mobile-friendly)
  - Recharts integration
  - Navigation & Footer
  
✅ **API Infrastructure**
  - Metrics calculation endpoint
  - Coach AI framework
  - Supabase integration
  
✅ **Configuration**
  - Environment setup templates
  - Vercel deployment config
  - TypeScript strict mode
  - ESLint rules

## Missing/Future Features

⏳ **Data Sources**
  - Strava OAuth integration
  - Garmin Connect sync
  - CSV import

⏳ **AI Coach**
  - Document ingestion (RAG)
  - Real training prescriptions
  - Implement coach API endpoints

⏳ **Advanced Features**
  - Structured training plans
  - Peak prediction models
  - Team dashboards
  - Social features

⏳ **Mobile**
  - React Native app
  - Offline capability
  - Push notifications

## File Count Summary

- **Total files**: ~25
- **Components**: 7
- **Utility modules**: 5
- **Documentation**: 5
- **Configuration**: 10

## Getting Started

1. **Install**: `npm install`
2. **Configure**: Copy `.env.example` → `.env.local`, fill in API keys
3. **Database**: Run `supabase-schema.sql` in Supabase SQL Editor
4. **Run**: `npm run dev`
5. **View**: Open http://localhost:3000

## Build & Deploy

```bash
# Build for production
npm run build

# Start production server
npm start

# Deploy to Vercel
vercel deploy
```

See `DEPLOYMENT.md` for step-by-step Cloud deployment.

---

**Project Status**: MVP Dashboard Complete ✅
**Next Priority**: Strava Integration
**Estimated features timeline**: See `ROADMAP.md`
