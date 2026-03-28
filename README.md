# Boviteam Registro Visite

Mobile-first PWA for managing farm visit records. Built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Features

- **Client Management**: Create, edit, and manage client profiles
- **Visit Register**: Log and track farm visits with categories, outcomes, and follow-up actions
- **Mobile-First Design**: Optimized for iPhone and Safari with PWA support
- **Shared Data**: Real-time synchronization via Supabase
- **Quick Actions**: Fast data entry on mobile with minimal required fields
- **Visit History**: Complete visit timeline per client
- **Filtering & Search**: Find clients and visits by name, zone, category, status
- **Status Tracking**: Track visits as open, closed, or cancelled
- **Boviteam Branding**: Professional design with brand colors and typography

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth (simple email/password)
- **PWA**: next-pwa for installability
- **Fonts**: League Spartan (headings), Montserrat (body)

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (free tier OK)

### 1. Clone and Install

```bash
cd boviteam-registro
npm install
```

### 2. Set Up Supabase

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings → API Keys and copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon/public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Go to SQL Editor and run the migration:
   - Copy contents of `supabase/migrations/001_init_schema.sql`
   - Paste and execute in SQL Editor

### 3. Environment Variables

Create `.env.local` in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
boviteam-registro/
├── app/                       # Next.js App Router
│   ├── layout.tsx            # Root layout with Header
│   ├── page.tsx              # Home/Dashboard
│   ├── globals.css           # Global styles
│   ├── clienti/              # Client pages
│   │   ├── page.tsx          # List clients
│   │   ├── new/page.tsx      # Create client
│   │   └── [id]/             # Client detail & edit
│   └── visite/               # Visit pages
│       ├── page.tsx          # List visits
│       ├── new/page.tsx      # Create visit
│       └── [id]/             # Visit detail & edit
├── components/               # Reusable components
│   ├── Header.tsx
│   ├── FormCliente.tsx
│   ├── FormVisita.tsx
│   └── Badges.tsx
├── lib/                      # Utilities & API
│   ├── supabase.ts          # Supabase client
│   ├── types.ts             # TypeScript types
│   ├── clienti.ts           # Client queries
│   └── visite.ts            # Visit queries
├── public/                   # Static assets & PWA
│   └── manifest.json        # PWA manifest
├── supabase/
│   └── migrations/          # Database migrations
└── tailwind.config.ts       # Tailwind configuration
```

## Data Model

### Clienti (Clients)

```
- id (UUID, Primary Key)
- intestazione_cliente (Required, Unique) - Business name
- referente (Optional) - Contact person
- telefono (Optional)
- email (Optional)
- indirizzo (Optional)
- comune (Optional) - Municipality
- provincia (Optional) - Province
- zona (Optional) - Zone/Area
- note_cliente (Optional)
- data_creazione (Auto)
- cliente_attivo (Default: true)
```

### Visite (Visits)

```
- id (UUID, Primary Key)
- cliente_id (UUID, Foreign Key) - Reference to client
- data_visita (Optional) - Visit date
- ora_visita (Optional) - Visit time
- categoria (Optional) - One of: grossista, genetica, alimentazione, consulenza
- esito_visita (Optional) - Outcome
- note_visita (Optional) - Notes
- prossima_azione (Optional) - Next action
- data_prossimo_contatto (Optional) - Follow-up date
- stato_visita (Optional) - One of: aperta, conclusa, annullata
- data_modifica (Auto) - Last modified
- ultima_modifica_da (Optional) - Modified by
```

## Usage

### Create Client

1. Tap "Nuovo Cliente" on home
2. Enter business name (required)
3. Fill optional fields as needed
4. Tap "Crea"

### Log Visit

1. From home: Tap "Nuova Visita"
2. Or from client profile: Tap "Nuova Visita"
3. Select client (pre-filled if from profile)
4. Fill date, time, category, outcome
5. Add notes, next action, follow-up date
6. Set status (Open/Closed/Cancelled)
7. Tap "Crea"

### Edit Visit

1. Open visit from list or client profile
2. Tap "Modifica"
3. Update fields
4. Tap "Aggiorna"

### Cancel Visit

Visit is marked as "annullata" (cancelled) but kept in history.
- From visit detail page: Tap "Annulla"
- Or change status to "annullata" from dropdown

### Search & Filter

**Clients:**
- Search by name
- Filter by zone
- Show active/all

**Visits:**
- Filter by client
- Filter by category
- Filter by status
- Filter by date

### Home Dashboard

Shows:
- Today's visits
- Upcoming follow-ups
- Recently added visits

## Deployment

### Vercel (Recommended)

```bash
# Push code to GitHub
git add .
git commit -m "Initial commit"
git push origin main

# Deploy on Vercel
# Connect GitHub repo at vercel.com
# Add environment variables in Settings → Environment Variables
```

### Manual Deployment

```bash
npm run build
npm start
```

## PWA Installation

### iPhone/iOS
1. Open Safari
2. Tap Share icon (bottom)
3. Tap "Add to Home Screen"
4. Name it "Boviteam"
5. Tap "Add"

### Android
1. Open Chrome
2. Tap menu (3 dots)
3. Tap "Install app"
4. Confirm

The app works offline with service worker caching. Data syncs when reconnected.

## Branding

Colors:
- Primary Green: `#1E6B3A`
- Burgundy Accent: `#8B1A1A`
- Neutral Gray: `#9B9588`
- Cream BG: `#F7F5F0`
- White: `#FFFFFF`

Fonts:
- Headings: League Spartan
- Body: Montserrat

## Development Notes

- All forms auto-save on success with confirmation
- Visit "annullata" status preserves records (doesn't delete)
- One client supports unlimited visits
- Client profile shows visit history newest to oldest
- Click-to-call and click-to-email work on mobile (from client page)
- No complex permissions system—first version focuses on usability

## Extending

To add features:
1. Update data types in `lib/types.ts`
2. Add database migration if needed
3. Create API functions in `lib/`
4. Add components as needed
5. Create pages in `app/`

Keep it simple. Avoid unnecessary abstractions.

## License

Boviteam - All rights reserved.

## Support

For issues or feedback, contact Boviteam.
