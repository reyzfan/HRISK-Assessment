# AGENTS.md — Master Plan for HumanRisk AI

<!--
Single source of truth for every AI coding assistant on this project.
Keep it lean — details live in the Context Files at the bottom. Update Current State and Roadmap as you build.
-->

## Project Overview & Stack
**App:** HumanRisk AI
**Overview:** Next-Gen Social Engineering Simulation & Human Risk Assessment Platform — an alternative to GoPhish with AI-powered phishing email generation, real-time analytics with automated Human Risk Score (0-100), and instant educational landing pages with interactive quizzes for employees who click simulated phishing links.
**Stack:** Next.js 14 (App Router) + Tailwind CSS + Shadcn UI + Supabase (PostgreSQL) + Prisma ORM + Ollama (Local AI, Llama 3) + Groq API (fallback) + Resend SMTP + Vercel
**Critical Constraints:** Free-tier only ($0 budget), mobile-first training pages, PII never sent to AI APIs, tracking pixel & URL redirect must be 100% accurate, `gophish-master/` folder is read-only reference

## Setup & Commands
Execute these commands for standard development workflows. Do not invent new package manager commands.
- **Setup:** `npm install`
- **Development:** `npm run dev`
- **Testing:** `npm test`
- **Linting & Formatting:** `npm run lint`
- **Build:** `npm run build`
- **Database Push:** `npx prisma db push`
- **Database Seed:** `npx prisma db seed`
- **Database Reset:** `npx prisma migrate reset`

## Protected Areas 🛡️
Do NOT modify these without explicit human approval:
- **Secrets:** NEVER commit `.env` files or hardcode API keys, tokens, or passwords. Use environment variables (see `.env.example`) and ask the human to set them up.
- **Infrastructure:** `infrastructure/`, Dockerfiles, and deployment workflows (`.github/workflows/`).
- **Database Migrations:** Existing migration files in `prisma/migrations/`.
- **Third-Party Integrations:** SMTP (Resend), Supabase Auth, and AI API configurations.
- **Reference Code:** `gophish-master/` is read-only — do NOT modify it.

## Coding Conventions
- **Formatting:** ESLint + Prettier — no warnings in new code
- **Architecture:** Feature-based folders (mirrors Next.js App Router structure)
- **Testing:** All new utilities get unit tests. Core user flows get integration tests.
- **Type Safety:** Use strict typing. Avoid `any`; define precise interfaces or use `unknown`.

## How I Should Think 🧠
1. **Understand Intent First:** Identify what the user actually needs before answering. Keep explanations simple and plain — the user is a vibe-coder, not a developer.
2. **Ask If Unsure:** If critical information is missing, ask ONE specific question before proceeding.
3. **Plan Before Coding:** Propose a brief step-by-step plan and wait for approval before changing more than one file. (If your tool has a plan/reflect mode, use it.)
4. **Execute Incrementally:** Build one feature at a time. Prefer refactoring over rewriting large blocks.
5. **Verify After Changes:** Run tests/linters or manual checks after each logical change; fix failures before moving on (see `REVIEW-CHECKLIST.md`).
6. **Explain Simply:** When recommending something, explain what it does in plain language and briefly mention alternatives.
7. **Remember in Files:** Write state and decisions to `MEMORY.md` instead of relying on chat history.
8. **Use Subagents If Available:** If your tool supports subagents or parallel agents, assign roles and require a plan before edits.

## What NOT To Do ⛔
- Do NOT delete files without explicit confirmation.
- Do NOT modify database schemas without a backup plan.
- Do NOT add features not in the current phase.
- Do NOT skip tests for "simple" changes.
- Do NOT bypass failing tests or pre-commit hooks.
- Do NOT use deprecated libraries or patterns.
- Do NOT send PII (employee names, emails) to AI APIs — only risk scores, departments, and scenario types.
- Do NOT modify anything in `gophish-master/` — it is a read-only reference.
- Do NOT add SMS/WhatsApp phishing, LDAP sync, or multi-tenant billing — those are v2.

## Engineering Constraints 🏗️
- **Type Safety:** The `any` type is forbidden — use `unknown` with type guards. All function parameters and returns are typed. Validate external input with a runtime schema (Zod).
- **Architectural Sovereignty:** Route/UI layers handle request/response ONLY. Business logic lives in services/core modules (under `src/lib/`). No database calls from route handlers.
- **Library Governance:** Check `package.json` before suggesting new dependencies. Prefer native APIs over libraries. Use the data-fetching approach specified in `agent_docs/tech_stack.md`.
- **Clear Communication:** State issues briefly and fix them — no apology loops or filler. If context is missing, ask ONE specific clarifying question. Keep explanations simple for vibe-coder level.
- **Workflow Discipline:** Pre-commit hooks must pass before commits (or ask before bypassing). If verification fails, fix it before continuing.
- **Privacy:** Employee PII (names, emails) must NEVER be sent to any AI API. Only aggregate data (risk scores, departments, scenario types) may be processed by AI.

## Current State 📍
**Last Updated:** 2026-08
**Working On:** Phase 2 core MVP is locally testable; polish, real email test, and deployment next
**Recently Completed:** Reported event tracking, safe Resend test-recipient flow, campaign creation form/API, Targets CRUD, templates page, settings health checks, tracking open/click, mobile training quiz, live dashboard metrics/risk matrix
**Blocked By:** AI generation needs Ollama running locally or a real Groq API key; real Resend sending needs verified sender/allowed recipient setup

## Roadmap 🗺️

### Phase 1: Foundation
- [x] Initialize Next.js 14 project with Tailwind CSS, Shadcn UI, Prisma
- [x] Set up Supabase database + Prisma schema (users, targets, campaigns, campaign_results, email_templates, training_quizzes, smtp_configs)
- [x] Configure admin auth (Supabase Auth — login/register)
- [ ] Deploy "Hello World" to Vercel

### Phase 2: Core Features
- [x] AI Phishing Email Generator — form with scenario/urgency/department, Ollama integration, live HTML preview, Groq fallback
- [x] Interactive Real-time Dashboard & Human Risk Score Matrix — campaign overview cards, per-employee risk score (color-coded 0-100), department risk matrix chart (basic bars)
- [x] Automated Instant Training Landing Page + Interactive Quiz — /training/[token] route, phishing indicators explanation, 3-question quiz, results saved to Supabase, risk score updated

### Phase 3: Polish
- [ ] Error handling across all flows
- [ ] Mobile responsiveness verification (training page must work on phones)
- [ ] Performance pass (dashboard < 2s load, redirect < 500ms)

### Phase 4: Launch
- [ ] Security pass (see `REVIEW-CHECKLIST.md`)
- [ ] Deploy to production (Vercel + Groq fallback for AI)
- [ ] End-to-end testing: campaign send → tracking → training → dashboard

## Context Files 📚
Load these only when needed — progressive disclosure keeps context lean:
- `agent_docs/tech_stack.md` — Stack details, libraries, setup commands
- `agent_docs/code_patterns.md` — Architecture and code style rules
- `agent_docs/project_brief.md` — Product vision and conventions
- `agent_docs/product_requirements.md` — Feature list and user stories
- `agent_docs/testing.md` — Test strategy and commands
- `MEMORY.md` — Session memory: decisions, known issues, active goal
- `REVIEW-CHECKLIST.md` — Definition of done before marking work complete
- `specs/` — Feature specs and handoff notes created during the build
