# Project Brief

- **Product vision:** Next-Gen Social Engineering Simulation & Human Risk Assessment Platform — replacing GoPhish with AI-powered phishing generation, automated risk scoring, and instant employee training
- **Target Audience:** SecOps / IT Admins (Campaign Managers) who run phishing simulations and measure employee security awareness; Employees who receive simulated phishing emails and complete instant training

## Conventions
- **Naming:** kebab-case for files, PascalCase for React components, camelCase for functions/variables
- **File Structure:** Feature-based folders following Next.js App Router — pages in `src/app/`, shared components in `src/components/`, business logic in `src/lib/`
- **Reference:** `gophish-master/` is read-only reference for understanding GoPhish data models (Campaign, Result, Template, Page, SMTP Profile) — do NOT modify it

## Key Principles
- Ship the simplest possible solution that solves the user story.
- If a simpler integration exists (e.g. Supabase Auth instead of custom auth, Shadcn UI instead of hand-built components), use it.
- Free-tier only — $0 budget. Never suggest paid services when free alternatives exist.
- Privacy first — employee PII never leaves the system or goes to AI APIs.
- Mobile-first for the training/quiz landing page (employees open emails on phones).
- Desktop-optimized for the admin dashboard.
