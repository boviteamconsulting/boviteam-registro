# Quick Start Checklist

Use this to get up and running in < 10 minutes.

## Before Running Locally

- [ ] Node.js 18+ installed (`node --version`)
- [ ] Supabase account created at [supabase.com](https://supabase.com)
- [ ] Supabase project created
- [ ] API keys copied (URL + anon key)
- [ ] `.env.local` file created with keys
- [ ] SQL migration executed in Supabase SQL Editor
- [ ] Email auth enabled in Supabase

## Run Locally

```bash
npm install
npm run dev
```

- [ ] App loads at `http://localhost:3000`
- [ ] Can sign up / log in
- [ ] Can create a client
- [ ] Can create a visit
- [ ] Data appears on home dashboard

## Test on iPhone

- [ ] Open Safari on iPhone
- [ ] Go to `http://YOUR_COMPUTER_IP:3000`
- [ ] Tap Share → Add to Home Screen
- [ ] App installs and works

## Deploy to Vercel (Optional)

- [ ] Code pushed to GitHub
- [ ] GitHub repo connected in Vercel
- [ ] Environment variables added in Vercel
- [ ] App deployed and live
- [ ] CORS added to Supabase settings
- [ ] Works on production domain

## Production Ready

- [ ] Database backed up
- [ ] Email alerts configured
- [ ] Team members have access
- [ ] Documentation shared
- [ ] Data entry workflow tested

## If Stuck

1. Check `.env.local` has correct values
2. Verify Supabase project is active
3. Confirm SQL migration ran
4. Check browser console for errors
5. Restart dev server: `npm run dev`

All done? Start using the app!
