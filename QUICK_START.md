# SmartWatts - Quick Start Guide

## 5 Minutes to Running SmartWatts

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment Variables
Copy `.env.example` to `.env.local` and fill in:
```bash
cp .env.example .env.local
```

Then edit `.env.local` with:
- **Supabase URL** & **Anon Key** (from [supabase.com](https://supabase.com))
- **Gemini API Key** (from [console.cloud.google.com](https://console.cloud.google.com))

### 3. Initialize Supabase
1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Go to **SQL Editor** → **New Query**
4. Copy all content from `supabase-schema.sql`
5. Click **Run**
6. Copy your **Project URL** and **Anon Key** to `.env.local`

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🚀

---

## Project Structure

```
SmartWatts/
├── src/
│   ├── app/           Dashboard & pages
│   ├── components/    Reusable UI components
│   ├── lib/          Utilities & calculations
│   ├── hooks/        Custom React hooks
│   └── types/        TypeScript interfaces
├── public/           Static assets
├── supabase-schema.sql  Database setup
├── package.json
└── README.md
```

---

## Dashboard Features

### 📊 Current Metrics
- **CTL (Fitness)**: 42-day training load average
- **ATL (Fatigue)**: Recent 7-day training load
- **TSB (Form)**: Readiness indicator (CTL - ATL)
- **FTP**: Functional Threshold Power

### 📈 Charts
- **PMC Chart**: Multi-line graph showing CTL, ATL, TSB trends
- **Power Duration Curve**: Peak power at different durations
- **Zone Distribution**: Time spent in power/HR zones

### 🤖 AI Coach
- Training recommendations based on current form
- Recovery nutrition guidance
- Injury risk assessment

---

## Customization

### Dark Theme Colors
Edit `tailwind.config.ts`:
```javascript
colors: {
  strava: '#fc4c02',      // Orange accent
  'tp-blue': '#0066cc',   // TrainingPeaks blue
  'dark-bg': '#0a0a0a',   // Main background
  'dark-card': '#1a1a1a', // Card background
}
```

### Add New Metrics
1. Create calculation in `src/lib/metrics.ts`
2. Add type to `src/types/index.ts`
3. Create component in `src/components/`
4. Import and use in `src/app/page.tsx`

---

## Next Steps

1. **Strava Integration** → Automatically fetch your rides
2. **Training Plans** → AI-generated periodized workouts
3. **Mobile App** → Track on the go
4. **Wearable Sync** → Apple Watch & Garmin integration

See `ROADMAP.md` for full feature timeline.

---

## Troubleshooting

**Port 3000 already in use?**
```bash
npm run dev -- -p 3001
```

**Supabase connection error?**
- Check `.env.local` has correct URL and keys
- Verify RLS is enabled on tables
- Check network connectivity

**Gemini API errors?**
- Verify API key is valid
- Check API is enabled in Google Cloud Console
- Ensure you have quota available

---

## Support

- **Documentation**: See `README.md`
- **Deployment**: See `DEPLOYMENT.md`
- **Database**: See `supabase-schema.sql`
- **Roadmap**: See `ROADMAP.md`

Happy training! 🚴‍♂️⚡
