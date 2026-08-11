# Artifact Review Checklist 🔍

> **AGENTS:** Do not mark a feature or task as "Complete" until you verify these checks manually or via automated test runs. Provide terminal logs or browser testing results as proof. 
> **HUMANS:** Use this checklist before merging Agent-generated code.

## Code Quality & Safety
- [ ] No `any` types used (or strictly justified with `unknown` and type guards).
- [ ] Protected files/directories (like infrastructure or migrations) were NOT modified without permission.
- [ ] No existing, unrelated tests were deleted or skipped.
- [ ] Component/Function is modular and doesn't violently break established architecture boundaries.
- [ ] Employee PII (names, emails) is NOT sent to any AI API — only risk scores, departments, and scenario types.

## Execution & Testing
- [ ] Application compiles without fatal errors.
- [ ] Linter passes (`npm run lint` or equivalent).
- [ ] Type check passes (`tsc --noEmit` or equivalent).
- [ ] Related Unit/Integration tests pass.
- [ ] UI is decently responsive across Desktop and Mobile viewports (if applicable).
- [ ] Training landing page tested on mobile browser (critical for employee-facing pages).

## Security 🔐
- [ ] No hardcoded secrets, API keys, or tokens anywhere in the diff.
- [ ] `.env` (and any other secret files) are gitignored and were NOT committed.
- [ ] Dependencies audited (`npm audit` or equivalent) — no unaddressed high-severity findings.
- [ ] All user input is validated and sanitized at the boundary (forms, API payloads, URL params).
- [ ] Auth-protected routes and actions were tested while logged out.
- [ ] Rate limiting (or equivalent abuse protection) considered for public endpoints.
- [ ] Tracking tokens are unique per recipient and cannot be guessed (cryptographic hash).
- [ ] Email tracking pixel and click redirect URLs use secure, unguessable tokens.

## Tracking Accuracy
- [ ] Email open tracking pixel fires correctly and records timestamp.
- [ ] Click tracking redirect works and records timestamp before redirecting.
- [ ] Form submit tracking captures data submission event.
- [ ] Human Risk Score updates correctly after each interaction event.

## Artifact Handoff
- [ ] The `MEMORY.md` file was updated with any new architectural decisions made during this task.
- [ ] Any obsolete spec files in the workspace have been marked as resolved or archived.
