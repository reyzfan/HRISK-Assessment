# Code Patterns

## Purpose
This file defines the implementation patterns the agent should follow for this project.
Prefer these patterns over inventing new ones. Fill in each section from the Technical Design document.

## Architecture Pattern
- **Primary pattern:** Feature-based folders (aligned with Next.js App Router)
- **Rule:** Keep domain logic separate from transport/UI concerns. Business logic lives in `src/lib/` — route handlers in `src/app/api/` only call service functions.
- **Rule:** Reuse existing modules before creating new abstractions.

## Data Fetching
- **Primary approach:** Next.js Server Components + Server Actions for data mutations
- **Rule:** Use Server Components for read operations. Use Server Actions for form submissions and mutations.
- **Rule:** Keep fetch logic out of render functions unless the framework explicitly encourages it (RSC is fine).
- **Rule:** Use Prisma client from `src/lib/db/prisma.ts` — never instantiate multiple Prisma clients.

## State Management
- **Server state:** Next.js Server Components (no client-side cache library needed for MVP)
- **Client state:** React useState + useReducer — no external state library for MVP scope
- **Forms:** React Hook Form + Zod validation via `@hookform/resolvers/zod`
- **Rule:** Prefer the simplest working approach for MVP scope. Do not add a state library if the framework's built-in state is sufficient.

## Error Handling
- Normalize errors at service/API boundaries — never let raw exceptions reach the UI.
- Never swallow errors silently; always log or surface them.
- Return user-safe messages in the UI; log developer context server-side.
- Use a consistent error shape across all API responses (see `tech_stack.md` for the canonical pattern).

## Validation
- Validate all external inputs (user forms, API payloads, environment variables) with Zod schemas.
- Apply runtime validation at system boundaries; trust internal types inside those boundaries.
- Keep validation schemas co-located with the relevant API route or form.

## File and Naming Conventions
- **Files:** kebab-case (e.g. `risk-score.ts`, `campaign-builder.tsx`)
- **Components / classes:** PascalCase (e.g. `RiskScoreCard`, `CampaignBuilder`)
- **Functions / variables:** camelCase (e.g. `calculateRiskScore`, `campaignResults`)
- **Constants / env vars:** UPPER_SNAKE_CASE (e.g. `OLLAMA_BASE_URL`, `MAX_RISK_SCORE`)
- **Route folders:** kebab-case (e.g. `src/app/(dashboard)/ai-builder/`, `src/app/training/[token]/`)

## Human Risk Score Algorithm
- Base Score = 50
- Clicked phishing link = +20 points
- Submitted data = +25 points
- Completed training quiz = -15 points
- Quiz passed = -10 points
- Score clamped between 0–100
- Risk levels: Green (0-30), Yellow (31-60), Red (61-100)

## Tracking Pattern
- **Email Open:** Unique 1x1 tracking pixel per target (`<img src="/api/track/open?t=unique_hash" />`)
- **Link Click:** Unique redirect URL per target (`/api/track/click?t=unique_hash`) → redirects to training page
- **Data Submit:** Captured when employee submits form on the simulated phishing page
- **Tokens:** Cryptographic hash (never guessable, never sequential)

## Privacy Rule
- Employee PII (names, emails) must NEVER be sent to any AI API.
- Only aggregate data may be sent to AI: risk scores, department names, scenario types, interaction types.
- AI prompts must be stripped of any identifying information before sending.

## Testing Pattern
- Add unit tests for pure logic and utility functions (risk score calculation, tracking token generation).
- Add integration tests for API contracts and critical data flows (email sending, tracking, quiz submission).
- Add E2E tests only for the top user journeys the PRD marks as must-have.
- Run the test suite after every feature; fix failures before moving on.

## Change Discipline
- Prefer focused, minimal edits over large rewrites.
- Do not introduce new dependencies without checking the existing stack in `tech_stack.md` first.
- Do not change database migrations, infrastructure config, auth flows, or billing code without explicit approval.
- One feature at a time — commit or checkpoint after each working feature.
