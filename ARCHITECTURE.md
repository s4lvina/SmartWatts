# SmartWatts Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        SMARTWATTS PLATFORM                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    FRONTEND (Next.js)                     │  │
│  │  ┌─────────────────────────────────────────────────────┐ │  │
│  │  │ Dashboard (PMC, Power Curve, Zones, Health Data)   │ │  │
│  │  │ Athletes (Individual activity detail)              │ │  │
│  │  │ Analytics (Trends, comparisons, predictions)       │ │  │
│  │  │ Coach (AI recommendations + document upload)       │ │  │
│  │  │ Settings (Profile, FTP, integrations)              │ │  │
│  │  └─────────────────────────────────────────────────────┘ │  │
│  │                                                           │  │
│  │  Component Stack: React 19 + TypeScript                 │  │
│  │  Styling: Tailwind CSS (dark mode default)              │  │
│  │  Charts: Recharts + Tremor                              │  │
│  │  State: Zustand (if needed)                             │  │
│  └──────────────────────────────────────────────────────────┘  │
│           ▼                                    ▼                 │
│  ┌──────────────────┐              ┌─────────────────────┐    │
│  │ VERCEL HOSTING   │              │ VERCEL EDGE FUNCS   │    │
│  │ (Next.js SSR)    │              │ (Middleware, Auth)  │    │
│  └──────────────────┘              └─────────────────────┘    │
│           ▼                                    ▼                 │
├────────────────────────────────────────────────────────────────┤
│                      BACKEND LAYER                              │
├────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐   │
│  │          SUPABASE (PostgreSQL + Auth + RLS)           │   │
│  │                                                        │   │
│  │  ┌──────────────────────────────────────────────────┐ │   │
│  │  │ TABLES:                                          │ │   │
│  │  │ • profiles (FTP, LTHR, weight, birth_date)     │ │   │
│  │  │ • activities (power, HR, elevation, metrics)    │ │   │
│  │  │ • daily_metrics (HRV, sleep, stress, RPE)      │ │   │
│  │  │ • nutrition_logs (CHO, kcal, hydration)         │ │   │
│  │  │ • pmc_data (pre-calculated CTL, ATL, TSB)       │ │   │
│  │  │                                                  │ │   │
│  │  │ RLS POLICIES: User can only see own data        │ │   │
│  │  │ TRIGGERS: Auto-update timestamps                │ │   │
│  │  │ INDEXES: On profile_id, date ranges, strava_id  │ │   │
│  │  └──────────────────────────────────────────────────┘ │   │
│  │                                                        │   │
│  │  Authentication: Supabase Auth (email/password)       │   │
│  │  Storage: File upload for training docs (if needed)   │   │
│  │                                                        │   │
│  └────────────────────────────────────────────────────────┘   │
│                      ▼                                          │
│  ┌────────────────────────────────────────────────────────┐   │
│  │ GOOGLE GEMINI 1.5 PRO (AI Coach)                      │   │
│  │                                                        │   │
│  │ RAG (Retrieval Augmented Generation):                 │   │
│  │ • Reads last 10 activities + current metrics          │   │
│  │ • Injects uploaded training documents                 │   │
│  │ • Provides contextual coaching                        │   │
│  │                                                        │   │
│  │ Capabilities:                                          │   │
│  │ • Training prescription (intensity, duration)         │   │
│  │ • Nutrition recommendations (CHO/hour calculation)    │   │
│  │ • Recovery strategies (sleep, stress management)      │   │
│  │ • Injury risk assessment                              │   │
│  │ • Periodization planning                              │   │
│  │                                                        │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                  │
└───────────────────────────────────────────────────────────────

```

## Data Flow

### Activity Ingestion Flow
```
Athlete Activity
  ▼
Strava (Future) / Manual Upload / Garmin
  ▼
Parse Power/HR Data
  ▼
Calculate Metrics (NP, IF, TSS, VI, EF)
  ▼
Store in activities table
  ▼
Update PMC calculations (CTL, ATL, TSB)
  ▼
Store in pmc_data table
  ▼
Display in Dashboard
```

### Metric Calculation Pipeline
```
Raw Power Data (1Hz samples)
  ▼
30-second Rolling Window Average (smoothing)
  ▼
Raise to 4th Power (perceptual effort weighting)
  ▼
Mean of 4th Powers
  ▼
Take 4th Root = Normalized Power (NP)
  ▼
NP / FTP = Intensity Factor (IF)
  ▼
Duration × IF × NP / FTP × 100 = TSS
  ▼
Store metrics in activities table
```

### PMC Calculation Pipeline
```
Daily TSS values (last 42 days)
  ▼
Apply exponential weighting (λ = 1/42)
  ▼
Sum weighted values = CTL (Fitness)
  ▼
Apply exponential weighting (λ = 1/7) to last 7 days
  ▼
Sum weighted values = ATL (Fatigue)
  ▼
CTL - ATL = TSB (Form)
  ▼
Store in pmc_data table daily
  ▼
Visualize in PMC Chart
```

## Component Architecture

### Smart Components (with data fetching)
- Dashboard (fetches PMC, activities, metrics)
- ActivityList (fetches user activities)
- HealthPanel (fetches daily metrics)

### Presentational Components (props-based)
- MetricCard (displays single KPI)
- PMCChart (Recharts wrapper)
- PowerDurationCurve (Recharts wrapper)
- ZoneDistribution (Recharts wrapper)
- Navigation (static header)
- Footer (static footer)

### Custom Hooks
- `useProfile()` → Fetches user FTP, LTHR, weight
- `useActivities(limit)` → Fetches recent activities
- `useDailyMetrics(daysBack)` → Fetches health metrics

## API Routes

### POST /api/metrics/calculate
Calculates metrics from raw data
```json
Request: {
  powerData: number[],
  averagePower: number,
  hrAverage: number,
  elapsedTime: number,
  ftp: number
}

Response: {
  np: number,
  if: number,
  tss: number,
  vi: number,
  ef: number
}
```

### POST /api/coach/analyze (Future)
Gets AI coaching recommendations
```json
Request: {
  athleteProfile: {...},
  recentActivities: [...],
  currentMetrics: {...}
}

Response: {
  training_recommendation: string,
  nutrition: string,
  recovery: string,
  risk_assessment: string
}
```

## Security Considerations

### Row Level Security (RLS)
Every table enforces:
```sql
CREATE POLICY "Users can only see their own data"
  ON public.activities
  FOR SELECT
  USING (profile_id = auth.uid());
```

### Environment Variables
- `NEXT_PUBLIC_*`: Safe to expose in browser
- Regular env vars: Only server-side

### API Keys
- Supabase Anon Key: Limited permissions via RLS
- Gemini API Key: Server-side only

## Scaling Considerations

### Current Limitations
- Metric calculations in real-time (compute-intensive)
- No caching layer yet
- No pagination on activity lists

### Future Optimizations
1. **Pre-calculation**: Compute metrics on write, not read
2. **Redis Cache**: Cache PMC data, frequently accessed profiles
3. **Database Indexes**: On profile_id, date ranges (already in place)
4. **Pagination**: Implement cursor-based pagination for activities
5. **API Rate Limiting**: Protect Gemini API from abuse
6. **CDN**: Cache static assets (Vercel default)

## Testing Strategy

### Unit Tests (Jest)
- Metric calculations
- Utility functions
- Component rendering

### Integration Tests (Playwright)
- End-to-end dashboard flow
- Supabase data operations
- API routes

### Performance Tests
- Dashboard load time < 2s
- API response time < 500ms
- Chart rendering performance

## Deployment Pipeline

```
Git push to main
  ▼
GitHub Actions trigger
  ▼
Run tests & linting
  ▼
Build Next.js app
  ▼
Deploy to Vercel (automatic)
  ▼
Health checks
  ▼
Production live
```

## Monitoring & Observability

- **Vercel Analytics**: Built-in performance monitoring
- **Error Tracking**: Optional Sentry integration
- **Database Logs**: Supabase query performance
- **Custom Logging**: Console logs in functions

---

## References

- **TrainingPeaks Metrics**: https://help.trainingpeaks.com/
- **Coggan Power Zones**: Training intensity relative to FTP
- **Polar HR Zones**: Heart rate zones by Friel method
