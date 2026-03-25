# SmartWatts - FAQ & Troubleshooting

## Setup & Installation

### Q: I'm getting "Module not found" errors
**A:** Run `npm install` to ensure all dependencies are installed:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Q: Port 3000 is already in use
**A:** Use a different port:
```bash
npm run dev -- -p 3001
# Then visit http://localhost:3001
```

### Q: How do I get Supabase URL and Keys?
**A:** 
1. Go to [supabase.com](https://supabase.com) → Create account/login
2. Create new project → Wait for setup (~2 min)
3. Go to **Settings** → **API** 
4. Copy `Project URL` and `Anon Public Key`
5. Paste into `.env.local`

### Q: Where do I get Gemini API Key?
**A:**
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create new project
3. Search for "Generative Language API" → Enable
4. Go to **Credentials** → **Create API Key**
5. Copy and paste into `.env.local`

---

## Database Issues

### Q: "Supabase connection refused" error
**A:** 
- Check `.env.local` has correct URL
- Verify you copied the URL (not just project name)
- Check internet connection
- Try restarting dev server

### Q: RLS policy error "You do not have permission"
**A:**
- Ensure you ran all SQL from `supabase-schema.sql`
- Check user is authenticated via Supabase Auth
- Verify RLS policies exist in Database → Policies

### Q: API Key denied/403 error
**A:**
- Double-check `.env.local` has correct Supabase anon key
- Don't use the SERVICE_ROLE key (only for server-side)
- Check API hasn't been rate limited

---

## Development

### Q: How do I add a new metric to the dashboard?
**A:**
1. Add calculation function to `src/lib/metrics.ts`
2. Add TypeScript type to `src/types/index.ts`
3. Create component (or use `<MetricCard>`) in `src/components/`
4. Import in `src/app/page.tsx` and add to dashboard

Example:
```typescript
// 1. Calculate in metrics.ts
export function calculateCustomMetric(input: number): number {
  return input * 2;
}

// 2. Use in component
import { calculateCustomMetric } from '@/lib/metrics';

// 3. Display
<MetricCard label="Custom" value={calculateCustomMetric(100)} unit="points" />
```

### Q: How do I change the dark theme colors?
**A:** Edit `tailwind.config.ts`:
```typescript
colors: {
  strava: '#fc4c02',        // Your accent color
  'tp-blue': '#0066cc',     // Alternative accent
  'dark-bg': '#0a0a0a',     // Background (darker/lighter)
  'dark-card': '#1a1a1a',   // Card background
}
```

### Q: Can I use a different database?
**A:** Yes, but you'll need to:
1. Update connection string in `src/lib/supabase.ts`
2. Adapt RLS policies (Supabase-specific feature)
3. Use your own auth system

---

## Deployment

### Q: How do I deploy to production?
**A:** See `DEPLOYMENT.md` for complete guide:
```bash
git add .
git commit -m "Deploy"
git push origin main
# (Vercel auto-deploys on push)
```

### Q: How do I add a custom domain?
**A:** 
1. Buy domain (Vercel, Namecheap, etc)
2. Vercel → Project → Settings → Domains
3. Add domain + follow DNS instructions
4. SSL certificate auto-generates in ~5 min

### Q: Can I self-host instead of Vercel?
**A:** Yes:
- Frontend: Docker, Render, Railway, Heroku
- Backend: Keep Supabase (or self-host PostgreSQL)
- Use environment variables for API keys

---

## Performance

### Q: Dashboard is loading slowly
**A:**
- Check browser DevTools → Network tab
- Look for slow API calls
- Reduce mock data array sizes for testing
- Consider caching PMC data with Redis (future)

### Q: Recharts charts are laggy
**A:**
- Reduce number of data points
- Use `shouldSetResponsiveValue` optimization
- Consider Visx instead for heavy datasets

---

## AI Coach

### Q: Gemini API returns "quota exceeded"
**A:**
- Free tier has limits
- Upgrade to paid plan or wait for quota reset
- Check Google Cloud console for usage

### Q: Coach recommendations seem generic
**A:**
- Currently using base prompts (no RAG yet)
- Future: Add document ingestion for personalized coaching
- See `ROADMAP.md` → Phase 6

---

## Data Import/Export

### Q: How do I import my Strava activities?
**A:** 
- Currently not implemented (See `ROADMAP.md` → Phase 2)
- Workaround: Export from Strava as CSV, manually upload
- Coming: Auto-sync via Strava OAuth

### Q: Can I export my data?
**A:**
- Use Supabase Data API (or UI export)
- Or query directly: `SELECT * FROM activities WHERE profile_id = ...`
- Future: Add export UI in Settings

---

## Common Errors

### "TypeError: Cannot read property 'map' of undefined"
**A:** Data not loaded yet. Add loading state:
```typescript
if (!data) return <div>Loading...</div>;
return data.map(...);
```

### "NEXT_PUBLIC variables not showing in browser"
**A:** 
- Must start with `NEXT_PUBLIC_` to be exposed
- Restart dev server after changing env vars
- Check `.env.local` (not `.env`)

### Tailwind classes not applying
**A:**
- Check class name is in `tailwind.config.ts` `content` glob
- Restart dev server
- Clear `.next/` cache: `rm -rf .next/`

---

## Getting Help

### Documentation
- **setup**: `QUICK_START.md`
- **features**: `README.md`
- **architecture**: `ARCHITECTURE.md`
- **deployment**: `DEPLOYMENT.md`
- **files**: `FILE_MANIFEST.md`
- **future**: `ROADMAP.md`

### Community
- Supabase Docs: https://supabase.com/docs
- Next.js Docs: https://nextjs.org/docs
- Recharts Docs: https://recharts.org
- Tailwind Docs: https://tailwindcss.com/docs

### Debug Tips
1. Check browser console for JS errors
2. Check Supabase dashboard for data
3. Verify `.env.local` values match API dashboards
4. Restart dev server after any config changes
5. Clear browser cache (F12 → Network → Disable cache)

---

## Still stuck?

1. **Check the docs** - Most issues are covered
2. **Search GitHub Issues** - Others may have same problem
3. **Read error messages carefully** - They indicate the problem
4. **Restart everything** - Dev server, browser, db connection
5. **Ask for help** - Post minimal code example + error message

Good luck! 🚀🚴‍♂️
