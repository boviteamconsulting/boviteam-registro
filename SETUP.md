# Setup Instructions - Boviteam Registro Visite

Complete guide to set up and run the app locally and in production.

## Local Development (5 minutes)

### Step 1: Install Node.js
- Download [Node.js 18+](https://nodejs.org)
- Verify: `node --version` and `npm --version`

### Step 2: Clone and Install Dependencies

```bash
cd ~/Desktop/boviteam-registro
npm install
```

### Step 3: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose a name, password, and region (pick EU if in Europe)
4. Wait for project to initialize (2-3 min)

### Step 4: Get API Keys

1. In Supabase dashboard, go to **Settings → API**
2. Find and copy:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon/public** key (long string starting with `eyJhbGc...`)

### Step 5: Create Environment File

Create `.env.local` in project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE
```

Replace with your actual values from step 4.

### Step 6: Initialize Database

1. In Supabase, go to **SQL Editor**
2. Click "New Query"
3. Open `supabase/migrations/001_init_schema.sql` from the project
4. Copy the entire SQL file content
5. Paste into Supabase SQL Editor
6. Click "Run"

You should see confirmation messages.

### Step 7: Enable Email Auth

In Supabase dashboard:
1. Go to **Auth → Providers**
2. Make sure "Email" is enabled (it should be by default)

### Step 8: Start Dev Server

```bash
npm run dev
```

App will be available at `http://localhost:3000`

### Step 9: Create Test Account

1. Go to `http://localhost:3000`
2. Sign up with any email/password
3. Check your email for confirmation link
4. Confirm signup

### Step 10: Start Using

- Create a client
- Log a visit
- Browse data on home dashboard

## Production Deployment

### Option A: Deploy to Vercel (Easiest)

#### Requirements
- GitHub account
- Vercel account (free)

#### Steps

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit: Boviteam Registro Visite"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/boviteam-registro.git
git push -u origin main
```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Select "Import Git Repository"
   - Find your `boviteam-registro` repo
   - Click "Import"

3. **Set Environment Variables**
   - In Vercel project settings → Environment Variables
   - Add:
     ```
     NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
     ```
   - Click "Deploy"

4. **Update Supabase CORS Settings** (important!)
   - In Supabase: **Settings → API**
   - Add your Vercel URL to "Allowed origins"
   - Example: `https://boviteam-registro.vercel.app`

Your app is now live! Share the Vercel URL with team members.

### Option B: Self-Hosted (Docker/Linux)

#### Requirements
- Ubuntu server or similar
- Docker installed
- Domain name (optional but recommended)

#### Steps

1. **Build the app**
```bash
npm run build
```

2. **Create Dockerfile**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

3. **Build and push to server**
```bash
docker build -t boviteam-registro .
docker tag boviteam-registro your-registry/boviteam-registro:latest
docker push your-registry/boviteam-registro:latest
```

4. **Run on server**
```bash
docker run -d \
  -e NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY \
  -p 3000:3000 \
  your-registry/boviteam-registro:latest
```

## Add Custom Domain (Optional)

### With Vercel
1. In Vercel project → Settings → Domains
2. Add your domain
3. Follow DNS setup instructions
4. Takes 24h to fully propagate

### With Self-Hosted
Use Nginx reverse proxy:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Test on iPhone

### Local Network
1. Find your computer IP: `ipconfig getifaddr en0` (macOS)
2. On iPhone: Open Safari
3. Go to `http://YOUR_COMPUTER_IP:3000`
4. Tap Share → Add to Home Screen
5. Name it "Boviteam"
6. Tap "Add"

### Production (via Vercel/Custom Domain)
1. Open Safari on iPhone
2. Go to your app URL
3. Tap Share → Add to Home Screen
4. Done!

The app works offline. Data syncs when you reconnect.

## Troubleshooting

### "Cannot find module supabase"
- Run `npm install` again
- Delete `node_modules` and run `npm install`

### "Missing environment variables"
- Check `.env.local` exists in project root
- Verify keys are correct (copy-paste from Supabase)
- Restart dev server: `npm run dev`

### "Supabase connection error"
- Check internet connection
- Verify Supabase project is running
- Check API keys in `.env.local`
- In Supabase, go to **Settings → Project Settings** to confirm project is active

### "Auth not working"
- Enable Email provider in Supabase: **Auth → Providers → Email (toggle On)**
- Check email inbox for confirmation link
- Confirm email before logging in

### "Database tables don't exist"
- Make sure you ran the SQL migration in Supabase SQL Editor
- Go to **SQL Editor → All Queries** to check history
- Run migration again if needed

## Backup & Recovery

### Backup Data

```bash
# Backup via Supabase CLI
supabase db pull

# Or manually export from Supabase
# Settings → Backups → Download latest backup
```

### Restore Data

```bash
# Restore via Supabase CLI
supabase db push
```

## Updates & Maintenance

### Update Dependencies
```bash
npm update
npm audit
```

### Deploy Updates
```bash
# Local development
git add .
git commit -m "Update: feature description"
git push

# Vercel auto-deploys on push
# Self-hosted: rebuild and push Docker image
```

## Security Notes

- Keep `.env.local` in `.gitignore` (already done)
- Never commit API keys to version control
- Use Supabase RLS (Row Level Security) policies in production
- Update dependencies regularly
- Use HTTPS in production (automatic with Vercel)

## Support

For Supabase issues: [supabase.com/docs](https://supabase.com/docs)
For Next.js issues: [nextjs.org/docs](https://nextjs.org/docs)

## Next Steps

1. Customize app branding in `tailwind.config.ts`
2. Add more fields to clients/visits if needed
3. Set up automated backups in Supabase
4. Consider adding Sentry for error tracking
5. Add analytics (Vercel Analytics or similar)
