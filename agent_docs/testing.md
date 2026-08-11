# Testing Strategy

## Frameworks
- **Unit Tests:** Vitest (fast, Vite-native, works great with Next.js)
- **Integration Tests:** Vitest + Supabase local test instance
- **E2E Tests:** Playwright (for critical user journeys: campaign send → tracking → training → dashboard)

## Rules & Requirements
- **Coverage:** Aim for 80% code coverage on critical paths (risk score calculation, tracking logic, email sending, quiz submission).
- **Before Commit:** Always run `npm test` before verifying a task is complete.
- **Failures:** NEVER skip tests or mock out assertions to make a pipeline pass without Human approval. If an Agent breaks a test, the Agent must fix it.

## Critical Test Scenarios

### Unit Tests
- Risk score calculation algorithm (base 50, +20 click, +25 submit, -15 quiz complete, -10 quiz pass, clamped 0-100)
- Tracking token generation (unique, unguessable, correct length)
- AI prompt sanitization (PII stripped before sending to AI)
- Email template rendering (HTML preview generation)

### Integration Tests
- Campaign creation → AI email generation → save to database
- Email send via Resend → tracking pixel included → click URL included
- Click tracking → redirect to training page → record timestamp
- Quiz submission → save results → update risk score

### E2E Tests
- Admin creates campaign → sends emails → employee clicks link → completes quiz → dashboard shows updated risk score
- Admin views dashboard → sees correct campaign metrics and risk matrix

## Execution
- Command to run all tests: `npm test`
- Command to run a single test file: `npx vitest run path/to/test.test.ts`
- Command to run E2E tests: `npx playwright test`
- Command to run tests in watch mode: `npx vitest`
