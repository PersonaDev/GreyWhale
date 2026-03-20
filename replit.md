# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Payments**: Stripe (checkout sessions)
- **Email**: Resend (lead notifications)
- **Frontend**: React + Vite + Tailwind CSS + wouter routing

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   ├── api-server/         # Express API server (Stripe, leads, contact)
│   └── agency-site/        # GreyWhale agency website (React + Vite)
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts (single workspace package)
│   └── src/                # Individual .ts scripts
├── pnpm-workspace.yaml     # pnpm workspace config
├── tsconfig.base.json      # Shared TS options
├── tsconfig.json           # Root TS project references
└── package.json            # Root package with hoisted devDeps
```

## Agency Site (GreyWhale)

Creative web agency site for the Greater Sacramento area. Services: web design, branding, social media, outreach.

### Pages
- **Home** (`/`) — Interactive fill-in-the-blank sentence with dropdown selectors for role, service, location, and plan. "Get Started" creates a lead and navigates to checkout.
- **Portfolio** (`/portfolio`) — Project showcase with borderless rounded cards
- **About** (`/about`) — Asymmetric two-column editorial layout
- **Checkout** (`/checkout`) — Plan summary + Stripe payment button. Shows plan features and project details. Falls back to contact form if Stripe not configured.
- **Checkout Success** (`/checkout/success`) — Payment confirmation page
- **Contact** (`/contact`) — Contact form (name, email, phone, message) that submits lead info and sends email notification
- **Industries Hub** (`/for`) — Grid of all 10 niche landing pages
- **Niche Pages** (`/for/:niche`) — 10 SEO landing pages targeting local business types: dentists, barbershops, tattoo-shops, restaurants, auto-shops, coffee-shops, med-spas, fitness-studios, plumbers, real-estate-agents. Each has 7 sections: Hero, Problem (3 pain points), Demo (browser mockup), Features (6 items), Comparison, Pricing, Sentence Builder + "We also work with" links.

### Shared Components
- `src/components/Reveal.tsx` — IntersectionObserver scroll reveal (used in Home + all niche pages)
- `src/components/SentenceBuilder.tsx` — Self-contained sentence builder with all dropdowns, modals, state, and handleGetStarted logic. Accepts `initialRole` prop for niche pre-selection.

### Niche Data
- `src/pages/niche/data.ts` — Full data for all 10 niches (headline, pain points, features, demo card, SEO, rolePreset)
- `src/pages/niche/NicheTemplate.tsx` — Shared 7-section template component

### Design
- White background, Inter font, gray (#c0c0c0) surrounding text, black bold underlined dropdown words
- Desktop: inline dropdown slides down; Mobile: slide-up bottom sheet
- Plan modal: always slide-up with 3 cards; Premium has animated spinning black glow border
- Font-semibold/medium instead of font-bold for polish
- `@assets` alias → `attached_assets/` directory

### Pricing (one-time setup fees)
- Essential: $499 + $69/month
- Growth: $999 + $99/month
- Premium: $2,499 + $149/month
- E-commerce and booking sites auto-upgrade from Essential to Growth

## API Server

### Routes
- `GET /api/healthz` — Health check
- `POST /api/leads` — Create a lead (role, service, location, plan)
- `PATCH /api/leads/:id` — Update lead fields
- `POST /api/stripe/checkout` — Create Stripe checkout session (leadId, plan, successUrl, cancelUrl)
- `POST /api/stripe/webhook` — Handle Stripe webhook events (checkout.session.completed → marks lead as paid)
- `POST /api/contact` — Submit contact form (leadId, name, email, phone, message)

### Database Schema (leads table)
- id, role, service, location, plan, name, email, phone, message, status, stripe_session_id, created_at, updated_at
- Statuses: `started` (lead created), `paid` (Stripe payment completed), `submitted` (contact form submitted)

### Environment Variables
- `DATABASE_URL` — PostgreSQL connection (auto-provisioned)
- `STRIPE_SECRET_KEY` — Stripe API key
- `STRIPE_PUBLISHABLE_KEY` — Stripe publishable key (frontend)
- `STRIPE_WEBHOOK_SECRET` — Stripe webhook signing secret
- `RESEND_API_KEY` — Resend email API key
- `NOTIFY_EMAIL` — Email address for lead notifications

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references.

- **Always typecheck from the root** — run `pnpm run typecheck`
- **`emitDeclarationOnly`** — only emit `.d.ts` files during typecheck
- **Project references** — when package A depends on package B, A's `tsconfig.json` must list B in its `references` array

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly`

## Development

- `pnpm --filter @workspace/api-server run dev` — API server on port 8080
- `pnpm --filter @workspace/agency-site run dev` — Frontend dev server
- `pnpm --filter @workspace/db run push` — Push schema to database
- Frontend API calls proxy through `/api-server/api` in dev mode
