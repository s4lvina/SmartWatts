# SmartWatts - Documentation Index

Welcome to **SmartWatts**, the AI-powered cycling performance analytics platform.

## 🚀 Getting Started (Choose Your Path)

### ⚡ Fast Track (5 minutes)
→ **[QUICK_START.md](QUICK_START.md)** - Install, configure, run

### 📚 Full Documentation
→ **[README.md](README.md)** - Complete feature guide + tech stack

### ✨ What Was Created
→ **[CREATED_SUMMARY.md](CREATED_SUMMARY.md)** - Full changelog of this build

---

## 📖 Documentation By Topic

### Setup & Installation
- **[QUICK_START.md](QUICK_START.md)** - 5-minute setup guide
- **[setup.sh](setup.sh)** - Automated setup script
- **[.env.example](.env.example)** - Environment variable template

### Understanding the Project
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System design, data flow, APIs
- **[FILE_MANIFEST.md](FILE_MANIFEST.md)** - Complete file directory
- **[ROADMAP.md](ROADMAP.md)** - Feature timeline (Phases 1-7)

### Deployment & DevOps
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Deploy to Vercel & Supabase
- **[vercel.json](vercel.json)** - Vercel configuration

### Troubleshooting
- **[FAQ.md](FAQ.md)** - Common questions & solutions

---

## 🎯 Quick Navigation

### I want to...

**Start coding**
→ [QUICK_START.md](QUICK_START.md)

**Deploy to production**
→ [DEPLOYMENT.md](DEPLOYMENT.md)

**Understand the system**
→ [ARCHITECTURE.md](ARCHITECTURE.md)

**See what was built**
→ [CREATED_SUMMARY.md](CREATED_SUMMARY.md)

**Fix a problem**
→ [FAQ.md](FAQ.md)

**Find a file**
→ [FILE_MANIFEST.md](FILE_MANIFEST.md)

**Check the roadmap**
→ [ROADMAP.md](ROADMAP.md)

---

## 📁 Project Structure

```
SmartWatts/
├── src/
│   ├── app/              Dashboard & pages
│   ├── components/       React components
│   ├── lib/              Business logic
│   ├── hooks/            Custom hooks
│   ├── types/            TypeScript definitions
│   └── stores/           Global state (Zustand)
├── public/               Static assets
├── supabase-schema.sql   Database schema
├── README.md             Full documentation
├── QUICK_START.md        5-minute setup
├── DEPLOYMENT.md         Production guide
├── ARCHITECTURE.md       System design
├── FAQ.md                Q&A
├── ROADMAP.md            Feature timeline
├── FILE_MANIFEST.md      File listing
├── CREATED_SUMMARY.md    What was built
├── setup.sh              Setup automation
├── package.json          Dependencies
└── .env.example          Environment template
```

---

## 🔧 Core Technologies

| Component | Technology |
|-----------|-----------|
| Frontend | Next.js 15 + React 19 + TypeScript |
| Styling | Tailwind CSS (dark mode) |
| Database | PostgreSQL (Supabase) |
| Charts | Recharts + Tremor |
| AI | Google Gemini 1.5 Pro |
| Hosting | Vercel (frontend) + Supabase (backend) |

---

## ✅ Features Implemented

### Dashboard
- [x] PMC Chart (CTL/ATL/TSB)
- [x] Power Duration Curve
- [x] Zone Distribution (power & HR)
- [x] Metric Cards with trends
- [x] AI Coach panel

### Calculations
- [x] Normalized Power (NP)
- [x] Intensity Factor (IF)
- [x] Training Stress Score (TSS)
- [x] Variability Index (VI)
- [x] Efficiency Factor (EF)
- [x] Fitness (CTL) & Fatigue (ATL)
- [x] Form (TSB)

### Infrastructure
- [x] Next.js App Router
- [x] PostgreSQL with RLS security
- [x] Vercel deployment ready
- [x] TypeScript types everywhere
- [x] Responsive dark theme
- [x] API endpoints
- [x] Custom React hooks

---

## 🚀 First Steps

```bash
# 1. Install
npm install

# 2. Configure
cp .env.example .env.local
# Edit with your API keys

# 3. Setup database
# Run supabase-schema.sql in Supabase

# 4. Run!
npm run dev
# Visit http://localhost:3000
```

---

## 📚 Documentation Detail

### README.md
Main project documentation with features, tech stack, calculations, and installation.

### QUICK_START.md
The absolute fastest way to get the app running (5 minutes).

### DEPLOYMENT.md
Step-by-step guide to deploy to production on Vercel with Supabase.

### ARCHITECTURE.md
Deep dive into system architecture, data flow, component structure, and scaling.

### FAQ.md
Q&A section covering setup, development, deployment, and common issues.

### ROADMAP.md
Full feature roadmap across 7 phases, from current MVP to mobile + team features.

### FILE_MANIFEST.md
Complete inventory of all files and what they do.

### CREATED_SUMMARY.md  
Comprehensive list of everything that was created in this build.

---

## 💡 Tips

✅ **Start with**: `QUICK_START.md`  
✅ **Understand with**: `ARCHITECTURE.md`  
✅ **Deploy with**: `DEPLOYMENT.md`  
✅ **Problem-solve with**: `FAQ.md`  
✅ **Plan with**: `ROADMAP.md`  

---

## 🎓 Learning Resources

### Official Docs
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Guide](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Recharts](https://recharts.org)

### Cycling Performance
- [TrainingPeaks Help](https://help.trainingpeaks.com/)
- [Coggan Power Zones](https://www.trainright.com/calculating-your-zones/)
- [Friel Heart Rate Zones](https://www.trainingpeaks.com/blog/)

---

## 🆘 Need Help?

1. **Use Ctrl+F** to search this index
2. **Check [FAQ.md](FAQ.md)** for common issues
3. **Read [ARCHITECTURE.md](ARCHITECTURE.md)** to understand design
4. **Review [FILE_MANIFEST.md](FILE_MANIFEST.md)** to find code
5. **See [ROADMAP.md](ROADMAP.md)** for upcoming features

---

## 📊 Project Status

**Status**: ✅ MVP Complete  
**Dashboard**: ✅ Working  
**Calculations**: ✅ Implemented  
**Database**: ✅ Schema created  
**API**: ✅ Framework ready  
**Documentation**: ✅ Comprehensive  

**Ready to**: Install → Configure → Deploy

---

*SmartWatts - AI-powered cycling performance analytics*  
*Built with Next.js 15, Supabase, Gemini AI, running on Vercel*  
*For cyclists who obsess about data. ⚡🚴*

---

**👉 Start here: [QUICK_START.md](QUICK_START.md)**
