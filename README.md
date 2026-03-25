# SmartWatts - Performance Cycling SaaS

An AI-powered cycling training analytics platform that combines the metrics rigor of **TrainingPeaks**, the visualization excellence of **VeloViewer**, and cutting-edge AI coaching.

## 🎯 Features

### Performance Metrics (TrainingPeaks Engine)
- **NP (Normalized Power)**: 30-second smoothed power calculation
- **IF (Intensity Factor)**: Effort intensity relative to FTP
- **TSS (Training Stress Score)**: Comprehensive training load assessment
- **VI (Variability Index)**: Power consistency measurement
- **PMC (Performance Management Chart)**: CTL, ATL, TSB visualization
- **Power Duration Curve**: Peak power analysis across all durations

### Visualizations (VeloViewer Style)
- Multi-line PMC charts with CTL, ATL, TSB trends
- Power duration curves (logarithmic scale)
- Zone distribution (power zones Z1-Z7 Coggan, HR zones)
- Activity heatmaps and yearly summaries
- Performance comparison (current vs historical)

### AI Coach (Gemini Integration)
- Training prescription based on TSB and fatigue levels
- Nutrition recommendations (CHO/hour, glycogen replenishment)
- PDF document ingestion for RAG-based knowledge base
- Injury risk assessment
- Recovery recommendations

### Health & Wellness
- HRV (Heart Rate Variability) tracking
- Sleep quality and duration monitoring
- Stress level assessment
- Body weight tracking

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 15 (App Router), TypeScript, Tailwind CSS |
| **Backend** | Supabase (PostgreSQL), Vercel Functions |
| **Database** | PostgreSQL with RLS (Row Level Security) |
| **Visualization** | Recharts, Tremor.so |
| **AI/ML** | Vercel AI SDK + Google Gemini 1.5 Pro |
| **Hosting** | Vercel (edge functions), Supabase |

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm/pnpm
- Supabase account ([supabase.com](https://supabase.com))
- Vercel account ([vercel.com](https://vercel.com))
- Google Cloud API key (Gemini) ([console.cloud.google.com](https://console.cloud.google.com))

### Setup

1. **Clone and Install**
```bash
cd SmartWatts
npm install
```

2. **Environment Configuration**
Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

3. **Database Setup**
- Go to Supabase dashboard
- Create a new PostgreSQL project
- Open SQL editor and paste contents of `supabase-schema.sql`
- Run to create tables, indexes, and RLS policies

4. **Start Development Server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📊 Database Schema

### Tables
- **profiles**: User FTP, LTHR, weight, birth date
- **activities**: Training data (power, HR, duration, elevation)
- **daily_metrics**: HRV, sleep, RPE, stress
- **nutrition_logs**: Post-ride recovery nutrition
- **pmc_data**: Pre-calculated PMC metrics (CTL, ATL, TSB)

See `supabase-schema.sql` for full schema definition.

## 🚀 Core Calculations

### Normalized Power (NP)
```
NP = (mean(P^4))^(1/4)
```
where P is 30-second smoothed power.

### Training Stress Score (TSS)
```
TSS = (Duration [hours] × IF × NP / FTP) × 100
```

### PMC Metrics
- **CTL** (Fitness): 42-day exponential weighted average
- **ATL** (Fatigue): 7-day exponential weighted average  
- **TSB** (Form): CTL - ATL

## 🤖 AI Coach Features

The Gemini AI reads:
- Last 10 completed activities
- Current CTL, ATL, TSB status
- Health metrics (HRV, sleep, stress)

Provides:
- Training recommendations based on TSB
- Nutritional recovery prescriptions
- Injury risk warnings
- Workload analysis and periodization

## 📈 Roadmap

- [ ] Strava/Garmin integration
- [ ] Structured training plans (blocks/phases)
- [ ] Advanced peak prediction
- [ ] Social/team features
- [ ] Mobile app (React Native)
- [ ] Advanced heatmap visualization (Mapbox)
- [ ] Wearable integrations (Apple Watch, Garmin)

## 📝 License

MIT

---

**Built for cyclists who obsess about data.** 🚴‍♂️⚡
