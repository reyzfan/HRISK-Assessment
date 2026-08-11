# System Memory & Context 🧠
<!--
AGENTS: Update this file after every major milestone, structural change, or resolved bug.
DO NOT delete historical context if it is still relevant. Compress older completed items.
-->

## 🏗️ Active Phase & Goal
**Current Task:** Phase 2 core MVP is locally testable including campaign creation
**Next Steps:**
1. Test real Resend send with verified sender/allowed recipient
2. Test AI generation with Ollama running or a real Groq API key
3. Polish mobile responsiveness and error handling
4. Prepare deployment checklist / Vercel environment variables

## 📂 Architectural Decisions
- 2026-08 — Chose Next.js 14 App Router over Pages Router for better server components and API routes
- 2026-08-08 — Chose Ollama (local Llama 3) as primary AI with Groq API as cloud fallback — keeps employee PII on-premise
- 2026-08 — Chose Supabase over self-hosted PostgreSQL for free-tier managed database + auth in one platform
- 2026-08-08 — Chose Prisma ORM for type-safe database access and schema migrations
- 2026-08-08 — Chose Resend over Nodemailer for simpler SMTP integration with free 3,000 emails/month
- 2026-08-08 — Chose Shadcn UI + Tailwind CSS for modern, accessible components without writing CSS from scratch
- 2026-08-08 — Feature-based folder structure following Next.js App Router conventions
- 2026-08-08 — Prisma 7 requires `@prisma/adapter-pg`; PrismaClient is created with `PrismaPg` and `DATABASE_URL`
- 2026-08-08 — AI email generator returns strict JSON and stores generated templates in `email_templates`
- 2026-08-08 — Supabase Session Pooler works with `sslmode=require&uselibpqcompat=true` for local Node/Prisma adapter seeding
- 2026-08-08 — Demo test flow uses seeded campaign results and dashboard links to trigger open/click/training without real email sending
- 2026-08-08 — Campaign send endpoint supports `dryRun: true` for safe browser testing and `dryRun: false` for Resend API sending
- 2026-08-08 — Settings page exposes safe health checks via `/api/settings/status` without displaying secrets
- 2026-08-09 — Campaign creation duplicates the selected template per campaign and generates unique tracking tokens for selected targets
- 2026-08-09 — Campaign send UI now supports safe one-recipient Resend test mode before Send All
- 2026-08-09 — Reported event added: `reportedAt`, `/api/track/report`, `/reported/[token]`, email report links, dashboard report rate, and risk score reduction

## 🐛 Known Issues & Quirks
- Ollama requires 8GB+ RAM for Llama 3 8B model — if unavailable, use Groq API fallback
- Vercel (serverless) cannot run Ollama — use Groq API in production, Ollama only in local dev
- Supabase free tier = 500MB database, 50K auth users — sufficient for MVP
- Resend free tier = 3,000 emails/month — monitor usage for larger campaigns
- `gophish-master/` folder is read-only reference — do not modify

## 📜 Completed Phases
- [x] Initial scaffold — Next.js 14 + TypeScript + Tailwind + Shadcn UI + all deps
- [x] Database schema creation — Prisma schema with 7 tables (users, targets, campaigns, campaign_results, email_templates, training_quizzes, smtp_configs)
- [x] Auth integration — Supabase Auth login/register pages + middleware
- [x] Dashboard layout — Sidebar nav + mobile nav + placeholder pages for all routes
- [x] Shared utilities — Prisma client, error handler, AI client (Ollama + Groq fallback), risk score calculator, tracking token generator, Supabase server/client helpers
- [x] Phase 2.1 AI Email Generator — `/ai-builder` form, `/api/ai/generate-email`, `/api/ai/save-template`, live HTML preview, save-to-database flow
- [x] Phase 2.2/2.3 Testable tracking + training — `npm run db:seed`, `/api/track/open`, `/api/track/click`, `/training/[token]`, `/api/training/submit`, dashboard live metrics
- [x] Campaign send flow — `/api/campaigns/send`, campaigns page dry-run UI, Resend API integration path
- [x] Settings health checks — `/settings` UI + `/api/settings/status` for Supabase, Ollama, Groq, Resend
- [x] Admin data pages — targets add/edit/reset risk via `/targets` and template library view via `/templates`
- [x] Campaign creation — `/api/campaigns`, create form on `/campaigns`, template selection, target selection, auto tracking tokens
- [x] Safe Resend testing — campaign send supports `testRecipient`, `/campaigns` has Send Test and Send All buttons
- [x] Reported tracking — `/api/track/report`, `/reported/[token]`, `reportedAt`, report rate dashboard metric, risk score reward
