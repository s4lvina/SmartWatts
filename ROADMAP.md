# SmartWatts Development Roadmap

## Phase 1: Core Platform (Current)
- [x] Next.js 15 + TypeScript foundation
- [x] Supabase PostgreSQL database
- [x] Dashboard with PMC chart
- [x] Power Duration Curve
- [x] Zone distribution visualizations
- [x] Metric calculations (NP, IF, TSS, VI, EF)
- [x] Tailwind CSS dark theme
- [x] Basic AI Coach framework

## Phase 2: Data Integration
- [ ] Strava OAuth integration
  - [ ] Fetch activities automatically
  - [ ] Real-time sync webhook
  - [ ] Activity detail parsing
  
- [ ] Garmin Connect integration
  - [ ] Device sync
  - [ ] Advanced metrics (VO2max, training load)
  
- [ ] CSV Import
  - [ ] Manual file upload
  - [ ] TraeningPeaks export format
  - [ ] Strava export format

## Phase 3: Advanced Features
- [ ] Structured Training Plans
  - [ ] Block periodization (Base → Build → Peak)
  - [ ] ATP (Annual Training Plan) builder
  - [ ] Auto-scaling based on form
  
- [ ] Peak Prediction
  - [ ] Predict optimal race date
  - [ ] Form forecast model
  - [ ] Competition recommendation
  
- [ ] Advanced Analytics
  - [ ] Power profiling (by duration)
  - [ ] Pacing analysis
  - [ ] Fatigue index
  - [ ] Recovery metrics

## Phase 4: Team & Social
- [ ] Team dashboards
- [ ] Group activities
- [ ] Leaderboards (local, regional)
- [ ] Social sharing
- [ ] Comments/reactions

## Phase 5: Wearable Integration
- [ ] Apple Watch app
- [ ] Garmin wearable app
- [ ] Real-time HRV monitoring
- [ ] Sleep tracking integration

## Phase 6: AI Enhancements
- [ ] Document ingestion (PDF training books)
- [ ] Custom training plan generation
- [ ] Injury prevention AI
- [ ] Personalized nutrition plans
- [ ] Video analysis (form improvement)

## Phase 7: Mobile App
- [ ] React Native mobile app
- [ ] iOS & Android builds
- [ ] Offline capability
- [ ] Push notifications

---

## High Priority Features

### Strava Integration (Next)
```typescript
// OAuth flow
1. Redirect to Strava auth
2. Get authorization code
3. Exchange for access token
4. Fetch activities from /v3/athlete/activities
5. Store webhook for auto-sync
6. Parse activity data and compute metrics
```

### Custom Training Plans
```typescript
// AI-generated periodization
1. User inputs: Goals, available hours/week, race date
2. AI generates:
   - Weekly structure
   - Intensity distribution
   - Recovery days
   - Key sessions
3. Calendar view with session details
4. Auto-adjust based on actual vs planned
```

### Mobile App
- Use React Native with Expo
- Share most business logic with web version
- Offline mode for local tracking
- Push notifications for coaching tips

---

## Tech Debt & Optimization

- [ ] Performance monitoring (Vercel Analytics)
- [ ] Error tracking (Sentry)
- [ ] Database query optimization
- [ ] Caching strategy (Redis)
- [ ] API rate limiting
- [ ] Component library standardization
- [ ] Testing framework (Jest, Playwright)

---

## Known Limitations

1. **PMC Calculation**: Uses simplified exponential weighting; production should validate against TrainingPeaks algorithm
2. **Power Curve**: Currently mock data; needs real activity computation
3. **Auth**: Placeholder only; implement Supabase auth properly
4. **Coach AI**: Framework only; needs RAG document ingestion setup

---

## Release Timeline

- **Q1 2025**: Core dashboard + basic metrics
- **Q2 2025**: Strava integration + training plans
- **Q3 2025**: Advanced analytics + peak prediction
- **Q4 2025**: Mobile app beta + team features
- **2026**: Full wearable ecosystem + advanced AI

