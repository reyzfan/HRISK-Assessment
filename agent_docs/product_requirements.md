# Product Requirements

> Quick-reference version of the PRD. Keep it short and current.

## Product Summary
- **Product:** HumanRisk AI
- **One-liner:** AI-powered social engineering simulation platform with automated risk scoring and instant employee training
- **Target users:** SecOps / IT Admins (primary — campaign managers), Employees (end users — training recipients)

## User Stories

### Admin Stories
- As a SecOps Admin, I want to input a campaign topic so that AI generates the email subject, HTML body, and sender name automatically.
- As a SecOps Admin, I want to see campaign performance charts and a list of high-risk employees on the dashboard.
- As a SecOps Admin, I want the Human Risk Score to be calculated automatically per employee and per department based on interaction behavior.

### Employee Stories
- As an Employee who clicked a phishing link, I want to immediately learn what indicators I missed and take a short quiz on my phone or desktop.
- As an Employee, I want the training page to be clear, mobile-friendly, and easy to complete.

## Feature List (MoSCoW)

### Must Have
- [ ] AI Phishing Email Generator — Ollama (local) / Groq (fallback) generates email subject, HTML body, sender name from scenario parameters; live HTML preview in < 3 seconds; customization options for urgency level and target department
- [ ] Interactive Real-time Dashboard & Human Risk Score Matrix — campaign overview cards (sent, open rate, click rate, submit rate); per-employee risk score with color coding (green 0-30, yellow 31-60, red 61-100); department-level risk matrix chart (Recharts)
- [ ] Automated Instant Training Landing Page + Interactive Quiz — automatic redirect from tracking link to training page; phishing indicators explanation; 3-question interactive quiz with immediate feedback; results saved to Supabase and risk score updated

### Should Have
- [ ] AI Chatbot for employees (v2-ready — security Q&A only, Ollama-powered)
- [ ] AI Training Recommendation engine (analyzes risk score + interaction history, suggests training modules)

### Could Have
- [ ] CSV Import / Manual Add for target employees
- [ ] Multi-language support (Bahasa Indonesia + English) for email templates

### Won't Have (this version)
- Active Directory / LDAP Sync (v2)
- SMS / WhatsApp Phishing / Smishing (v2)
- Multi-tenant SaaS Billing (v2)

## Success Metrics
- Successful Campaign Executions: > 5 campaigns without error in first 30 days
- Detection & Tracking Accuracy: 100% — all Open, Click, Submit events recorded correctly
- Training Quiz Completion Rate: > 80% of employees who click the link complete the quiz

## Out of Scope
- Active Directory / LDAP Sync — saved for v2, MVP uses CSV Import / Manual Add
- SMS / WhatsApp Phishing (Smishing) — saved for v2, MVP focuses on email phishing only
- Multi-tenant SaaS Billing — saved for v2, MVP is single-organization / on-premise / self-hosted
- Any feature not listed in the Must Have or Should Have sections above
