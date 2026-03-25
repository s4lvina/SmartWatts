# SmartWatts Deployment Guide

## Vercel Deployment

### Prerequisites
- Vercel account ([vercel.com](https://vercel.com))
- GitHub repository with SmartWatts code
- Environment variables configured

### Steps

1. **Push to GitHub**
```bash
git add .
git commit -m "Initial SmartWatts commit"
git push origin main
```

2. **Connect to Vercel**
- Go to [vercel.com/new](https://vercel.com/new)
- Select your GitHub repository
- Click "Import"

3. **Configure Environment Variables**
In Vercel project settings, add:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

4. **Deploy**
- Click "Deploy"
- Wait for deployment to complete
- Your app is now live!

## Supabase Setup

### Create Project
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Note your:
   - Project URL
   - Anon Key
   - Database password

### Initialize Database
1. Go to SQL Editor in Supabase dashboard
2. Create new query
3. Copy-paste `supabase-schema.sql` contents
4. Click "Run"

### Enable Auth
1. Settings → Authentication
2. Providers → Email
3. Enable "Confirm email"
4. Configure SMTP if needed

## Google Gemini API

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create new project
3. Enable "Generative Language API"
4. Create API key (Credentials)
5. Copy key to `.env.local` and Vercel

## Custom Domain (Optional)

1. Purchase domain (Vercel, Namecheap, etc.)
2. Go to Vercel Project Settings → Domains
3. Add domain and follow DNS setup instructions
4. Wait for SSL certificate (usually 5 mins)

## Monitoring & Analytics

- **Vercel Analytics**: Enabled by default
- **Supbase Logs**: SQL Editor → Query Performance
- **Error Tracking**: Vercel → Monitoring → Errors

## Running Locally

```bash
npm install
npm run dev
```

Access at `http://localhost:3000`

## Production Checklist

- [ ] Environment variables set in Vercel
- [ ] Database RLS policies enabled
- [ ] Auth enabled in Supabase
- [ ] Custom domain configured (optional)
- [ ] Monitoring alerts set up
- [ ] Backup strategy in place
