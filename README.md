# Kuldeep Kumar — AI/ML Engineer Portfolio

A fully content-managed, animated personal portfolio for an AI/ML engineer. It pairs an editorial light-theme design with real-time 3D/particle visuals (Three.js) and a built-in CMS (admin panel) backed by Supabase — so every section's content can be edited live without touching code or redeploying.

- **Live site:** _your Cloudflare URL_ (e.g. `https://kdcodes.pages.dev`)
- **Admin CMS:** `/admin` (Supabase Auth login)

---

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Architecture Overview](#architecture-overview)
4. [Project Structure](#project-structure)
5. [Getting Started](#getting-started)
6. [Environment Variables](#environment-variables)
7. [Database (Supabase) Setup](#database-supabase-setup)
8. [Admin Panel / CMS](#admin-panel--cms)
9. [Contact Form](#contact-form)
10. [Available Scripts](#available-scripts)
11. [Deployment](#deployment)
12. [Security Notes](#security-notes)
13. [License](#license)

---

## Features

- **Editorial light-theme UI** with Instrument Serif / Hanken Grotesk / JetBrains Mono typography.
- **Three.js particle hero** that morphs (scatter → sphere → brain → network → architecture) as you scroll.
- **Neural-map section** — a 3D particle brain with admin-positioned labels and curved connector wires.
- **3D companion robot** (Three.js) in the About and Contact sections whose head tracks the cursor, with a glassmorphism speech bubble.
- **Horizontal-swipe projects** — a scroll-driven pinned track where each editorial card slides in with a scale + subtle 3D rotate, with a progress counter and dots.
- **Skills constellation** — hovering a category orbits its skills (names only) around a central hub in 3D.
- **Expanding-focus "Currently building"** — a row of cards that expand on hover to reveal their highlights.
- **ChatGPT-style vertical sidebar nav** — minimal bars that reveal section names on hover, scroll on click, and auto-hide over the Projects section.
- **Typewriter intro** in the About section.
- **Live CMS** — edit profile, neural-map nodes, projects, skills, ongoing work, social links, and read contact messages from `/admin`.
- **Contact form** that stores messages in Supabase and (optionally) emails you via Web3Forms.
- **Graceful fallback** — if Supabase isn't configured, the site renders from bundled static data so it never breaks.
- **Error boundary** so any runtime error shows a readable message instead of a blank screen.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build tool | Vite 8 |
| Styling | CSS custom properties + inline styles (no UI framework) |
| Animation | Three.js (r128, via CDN), Canvas 2D, custom scroll-driven JS |
| Routing | React Router |
| Backend / DB | Supabase (PostgreSQL + Auth + Row-Level Security) |
| Email (optional) | Web3Forms |
| Icons | lucide-react |
| Hosting | Cloudflare Pages / Workers |

---

## Architecture Overview

```
                         ┌──────────────────────────┐
   Visitor ──────────▶   │  React SPA (Vite build)   │
                         │  - Public portfolio (/)   │
                         │  - Admin CMS (/admin)     │
                         └────────────┬─────────────┘
                                      │  @supabase/supabase-js
                                      ▼
                         ┌──────────────────────────┐
                         │         Supabase          │
                         │  Postgres tables + RLS    │
                         │  Auth (admin login)       │
                         └──────────────────────────┘

   Contact form ──▶ Supabase `messages` table  ──▶ Admin "Messages" tab
                └─▶ Web3Forms (optional email notification)
```

- **Data loading:** `src/data/usePortfolioData.ts` fetches all content from Supabase on load. If Supabase is unconfigured or unreachable, it falls back to the static data in `src/data/portfolio.ts`. This means the public site always renders.
- **Content editing:** The admin panel writes directly to Supabase tables. Public reads are open (RLS `select`); all writes require an authenticated admin session.

---

## Project Structure

```
.
├── index.html                 # HTML shell, fonts, Three.js CDN, meta tags
├── wrangler.jsonc             # Cloudflare Workers static-assets config
├── vercel.json                # (legacy) Vercel SPA rewrite
├── supabase_migration.sql     # Full database schema + RLS policies
├── public/
│   ├── _redirects             # SPA fallback for Cloudflare Pages
│   └── ...                    # static assets (images, favicon)
└── src/
    ├── main.tsx               # React entry
    ├── App.tsx                # Routes: "/" portfolio, "/admin" CMS
    ├── lib/
    │   ├── supabase.ts        # Supabase client (env-var driven)
    │   └── particles.ts       # Shared 3D "brain" point-cloud generator
    ├── data/
    │   ├── portfolio.ts       # Static fallback content + TypeScript types
    │   └── usePortfolioData.ts# Hook: fetch from Supabase or fall back; seedDatabase()
    ├── components/
    │   ├── HeroSection.tsx        # Three.js particle morph hero
    │   ├── AboutSection.tsx       # Typewriter intro + robot + stats
    │   ├── BrainMapSection.tsx    # Particle brain + coordinate labels
    │   ├── ProjectsSection.tsx    # Scroll-driven horizontal swipe
    │   ├── SkillsSection.tsx      # 3D skills constellation
    │   ├── OngoingSection.tsx     # "Currently building" expanding cards
    │   ├── ContactSection.tsx     # Form + social links + footer
    │   ├── Sidebar.tsx            # Vertical section navigation
    │   ├── Robot3D.tsx            # Cursor-tracking 3D robot
    │   ├── NeuralCanvas.tsx       # 2D constellation accent
    │   ├── CursorCloud.tsx        # Global cursor particle trail
    │   └── ErrorBoundary.tsx      # Catches render errors
    └── pages/
        └── AdminPage.tsx      # Tabbed CMS (Supabase Auth gated)
```

---

## Getting Started

### Prerequisites

- **Node.js 20+** (Vite 8 requirement; a `.nvmrc` pins Node 20)
- **npm**
- A **Supabase** project (free tier is fine) — optional for local dev, required for the CMS/contact features

### Install & run

```bash
# 1. Clone
git clone https://github.com/kuldeep2911/portfolio-website.git
cd portfolio-website

# 2. Install dependencies
npm install

# 3. Configure environment (see next section)
cp .env.example .env
#   then fill in your Supabase + Web3Forms values

# 4. Start the dev server
npm run dev
```

Without a `.env`, the site still runs — it just renders the static fallback content and the admin/contact features are inactive.

---

## Environment Variables

Create a `.env` file in the project root (it is **gitignored** — never commit it). See `.env.example`.

| Variable | Required | Description |
|---|---|---|
| `VITE_SUPABASE_URL` | For CMS/contact | Your Supabase project URL, e.g. `https://xxxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | For CMS/contact | Supabase **anon** (public) key — safe for the browser; protected by RLS |
| `VITE_WEB3FORMS_KEY` | Optional | Web3Forms access key to email contact submissions. Without it, messages still save to Supabase |

> All variables are prefixed `VITE_` so Vite exposes them to the client at build time. Only put **publishable/anon** keys here — never a service-role or secret key.

For production, set these same variables in your hosting provider's dashboard (see [Deployment](#deployment)).

---

## Database (Supabase) Setup

### 1. Create the schema

In the Supabase Dashboard → **SQL Editor**, paste and run the entire contents of [`supabase_migration.sql`](./supabase_migration.sql). This creates the tables and Row-Level Security policies.

### Tables

| Table | Purpose |
|---|---|
| `profile` | Name, title, bio, the typed intro lines (`robot_lines`), stat cards (`stats`), contact bubble text |
| `brain_nodes` | Neural-map labels (`label`, `icon`) and their positions (`x`, `y`, `cx`, `cy`, `dur`) |
| `projects` | Project cards (title, description, tags, category, status, links, and the "What it does" highlight texts stored in `bento_texts`) |
| `skills` | Skill categories, each with an `items` array |
| `ongoing_projects` | "Currently building" cards with `highlights` |
| `social_links` | Footer/contact social links (platform, url, handle) |
| `messages` | Contact-form submissions (read in the admin Messages tab) |

### RLS model

- **Public** can `select` all content tables and `insert` into `messages` (so the contact form works).
- **Only authenticated** users can `insert/update/delete` content and read `messages`.

### 2. Create an admin user

In Supabase Dashboard → **Authentication → Users → Add user**, create the email/password you'll use to log into `/admin`.

### 3. Seed initial content

Log into `/admin` → **Setup** tab → **Seed Database**. This pushes the static data from `src/data/portfolio.ts` into your tables (one-time). After that, edit everything live from the admin tabs.

> ⚠️ Re-running "Seed Database" resets content tables back to the static defaults.

---

## Admin Panel / CMS

Visit **`/admin`** and log in with your Supabase Auth credentials. Tabs:

- **About** — profile fields, the typed intro lines, contact bubble text, stat cards.
- **Brain Map** — add/edit neural-map nodes, their icon, and `x/y/cx/cy/dur` coordinates (drive label position + connector curve).
- **Projects** — full CRUD on project cards, tags, links, and the three "What it does" highlight texts (`bento_texts`).
- **Skills** — skill categories and items.
- **Ongoing** — "currently building" cards and highlights.
- **Contact** — social links.
- **Messages** — inbox of contact-form submissions.
- **Setup** — seed/reset the database.

Edits are saved to Supabase and reflected on the public site on next load.

---

## Contact Form

1. Submissions are inserted into the Supabase `messages` table (visible in the admin **Messages** tab).
2. If `VITE_WEB3FORMS_KEY` is set, a notification email is also sent via [Web3Forms](https://web3forms.com). Without it, the message is still saved.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check (`tsc -b`) and build to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

---

## Deployment

The site builds to a static `dist/` folder and can be hosted anywhere. It's configured for **Cloudflare**.

### Cloudflare Pages (recommended → `*.pages.dev`)

1. Cloudflare Dashboard → **Workers & Pages → Create → Pages → Connect to Git**, select this repo.
2. **Project name** → becomes your subdomain (e.g. `kdcodes` → `kdcodes.pages.dev`).
3. Build settings:
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Production branch: `main`
4. Add environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_WEB3FORMS_KEY`) under **Settings → Environment variables**.
5. **Save and Deploy.** Client-side routing (`/admin`) is handled by `public/_redirects`.

### Cloudflare Workers (static assets → `*.workers.dev`)

`wrangler.jsonc` is already configured to deploy `dist/` as static assets with SPA fallback:

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`
- Set the same environment variables in the Worker's settings.

Every push to `main` triggers an automatic redeploy.

---

## Security Notes

- **No secrets in the repo.** Credentials are read only from environment variables. `.env` is gitignored.
- **The Supabase anon key is public by design** — it ships in every client bundle and is safe to expose. Write access is blocked by Row-Level Security; only an authenticated admin can modify data.
- **Never** place a Supabase `service_role` key (or any secret key) in a `VITE_`-prefixed variable — those are bundled into the client.
- All content writes and message reads require a valid Supabase Auth session.

---

## License

Released under the [MIT License](./LICENSE).
