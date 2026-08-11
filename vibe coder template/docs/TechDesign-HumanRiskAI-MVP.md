# Technical Design Document: HumanRisk AI MVP

## How We'll Build It

### Recommended Approach: Next.js + Supabase + Ollama (Local AI)

**Primary Recommendation: Next.js 14 (App Router) + Supabase + Ollama**
- **Why it's perfect for you:**
  1. **Next.js + Vercel** = Push-to-deploy, tidak perlu setup server. Free tier cukup untuk MVP.
  2. **Supabase** = Database, Auth, dan API otomatis dalam satu platform. Free tier sangat generous.
  3. **Ollama (Local AI)** = Data sensitif karyawan TIDAK keluar ke cloud AI. Semua diproses lokal di komputer Anda.
  4. **Tailwind CSS + Shadcn UI** = Komponen UI modern siap pakai, tidak perlu desain dari nol.
- **What it costs:** $0 (semua free tier)
- **Time to learn:** ~1-2 hari untuk memahami flow dasar (AI assistant akan membantu setiap langkah)
- **Limitations to know:** Ollama membutuhkan RAM minimal 8GB untuk model Llama 3. Supabase free tier = 500MB database, 50K auth users. Vercel free tier = 100GB bandwidth/bulan.

### Alternative Options Comparison

| Approach | Pros | Cons | Cost | Best For |
|----------|------|----------|
| **Next.js + Supabase + Ollama** (Recommended) | Full-stack, local AI = data aman, deploy mudah, free tier besar | Perlu install Ollama lokal, butuh RAM 8GB+ | $0 | Keamanan data sensitif, kontrol penuh |
| **Next.js + Supabase + Groq API** | AI super cepat, tidak perlu hardware kuat | Data terenkripsi tapi lewat cloud Groq | $0 (free tier) | Jika tidak masalah data lewat cloud |
| **Bolt.new / Lovable (No-code AI)** | Full visual, AI generate semua, zero coding | Sulit kustomisasi tracking & email, terbatas integrasi | $0-20/bulan | App sederhana tanpa logic kompleks |

> **⚠️ Catatan Penting:** Karena Anda memilih "no-code only" dan prioritas "works perfectly", pendekatan terbaik adalah menggunakan **VS Code + Copilot/Claude** sebagai AI coding assistant yang menulis semua kode untuk Anda. Anda hanya perlu menjalankan perintah, mereview hasil, dan testing. Tools seperti Bolt.new/Lovable terlalu terbatas untuk logic tracking email & kalkulasi risk score yang dibutuhkan HumanRisk AI.

---

## Project Setup Checklist

- [ ] **Day 1 — Accounts:**
  - [ ] Buat akun [GitHub](https://github.com) (untuk simpan kode)
  - [ ] Buat akun [Supabase](https://supabase.com) (database + auth)
  - [ ] Buat akun [Vercel](https://vercel.com) (hosting/deploy)
  - [ ] Buat akun [Groq](https://console.groq.com) (AI API — fallback jika Ollama belum siap)
  - [ ] Buat akun [Resend](https://resend.com) (SMTP email — free 3,000/bulan)
- [ ] **Day 1 — Install Software:**
  - [ ] Install [VS Code](https://code.visualstudio.com) + GitHub Copilot extension
  - [ ] Install [Node.js](https://nodejs.org) LTS version
  - [ ] Install [Ollama](https://ollama.ai) → jalankan `ollama pull llama3` (untuk local AI)
  - [ ] Install [Git](https://git-scm.com)
- [ ] **Day 2 — Initialize Project:**
  - [ ] Minta AI assistant: "Buat project Next.js 14 baru dengan Tailwind CSS, Shadcn UI, Prisma, dan Supabase untuk HumanRisk AI"
  - [ ] Push ke GitHub → connect ke Vercel → deploy "Hello World" pertama

---

## Project Structure

```
humanrisk-ai/
├── src/
│   ├── app/                    # Halaman & routing (Next.js App Router)
│   │   ├── (auth)/             # Login, Register, Forgot Password
│   │   ├── (dashboard)/        # Admin Dashboard (protected)
│   │   ├── page.tsx        # Dashboard utama — Risk Matrix & Charts
│   │   ├── campaigns/      # Campaign list & detail
│   │   ├── targets/        # Kelola target/karyawan
│   │   ├── templates/      # Email template library
│   │   ├── settings/       # SMTP & AI config
│   │   └── ai-builder/     # AI Campaign Builder
│   │   ├── api/                # API routes (backend logic)
│   │   ├── ai/             # AI generate email & risk score
│   │   ├── campaigns/      # Campaign CRUD
│   │   ├── track/          # Email open & click tracking
│   │   └── smtp/           # Email sending
│   │   └── training/           # Training landing page (untuk karyawan)
│   │       └── [token]/        # Dynamic token per target
│   ├── components/             # Reusable UI components
│   │   ├── ui/                 # Shadcn UI base components
│   │   ├── charts/             # Recharts wrapper components
│   │   ├── campaign-builder/   # AI campaign builder form
│   │   └── training/           # Quiz & educational components
│   ├── lib/                    # Helper functions
│   │   ├── ai/                 # Ollama client & Groq fallback
│   │   ├── db/                 # Prisma client & queries
│   │   ├── email/              # Nodemailer / Resend sender
│   │   ├── tracking/           # Pixel & URL tracking logic
│   │   └── risk-score/         # Human Risk Score calculation
│   └── styles/                 # Global CSS + Tailwind config
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── seed.ts                 # Demo data seeder
├── public/                     # Static assets (images, icons)
├── docs/                       # PRD, TechDesign, Research
├── .env.local                  # Secret keys (JANGAN commit ke GitHub!)
├── .env.example                # Template env vars (aman untuk commit)
├── package.json                # Dependencies
└── README.md                   # Project documentation
```

---

## Building Your Features

### Feature 1: AI Phishing Email Generator
- **Complexity:** Medium
- **Build prompt:** "Create an AI campaign builder page in Next.js that lets admin input: scenario topic, urgency level, target department. Send the prompt to Ollama (local Llama 3) API to generate: email subject, HTML body, sender name. Show a live preview of the generated email. If Ollama is unavailable, fallback to Groq API. Use Tailwind CSS and Shadcn UI for the form."
- **Data sensitivity:** Hanya skenario & parameter yang dikirim ke AI. **Data karyawan TIDAK dikirim ke AI.**
- **Test it by:** Masukkan "Tagihan HR Urgent" → klik Generate → preview email muncul < 10 detik.

### Feature 2: Interactive Real-time Dashboard & Human Risk Score Matrix
- **Complexity:** Medium-Hard
- **Build prompt:** "Create an admin dashboard with: (1) Campaign overview cards showing total sent, open rate, click rate, submit rate, (2) Human Risk Score table per employee with color-coded risk levels (green 0-30, yellow 31-60, red 61-100), (3) Department-level risk matrix chart using Recharts. Data comes from Supabase. Use Tailwind CSS + Shadcn UI. Make it responsive for desktop."
- **Risk Score Algorithm (sederhana):**
  - Base Score = 50
  - Clicked phishing link = +20 points
  - Submitted data = +25 points
  - Completed training quiz = -15 points
  - Quiz passed = -10 points
  - Score clamped between 0-100
- **Test it by:** Buat 5 test karyawan → kirim kampanye → klik beberapa link → lihat dashboard update.

### Feature 3: Automated Instant Training Landing Page + Interactive Quiz
- **Complexity:** Medium
- **Build prompt:** "Create a mobile-friendly training landing page at /training/[token] that: (1) Explains the phishing indicators the employee missed, (2) Shows a 3-question interactive quiz with immediate feedback, (3) Saves quiz results to Supabase and updates the employee's Human Risk Score. The page should be responsive and work perfectly on mobile phones. Use Tailwind CSS."
- **Test it by:** Klik link tracking simulasi → redirect ke training page → isi kuis → cek hasil di database.

### Feature 4: AI Chatbot Karyawan (v2-ready)
- **Complexity:** Hard
- **Build prompt:** "Create a floating AI chatbot widget on the training page that answers employee questions about phishing and security awareness. Use Ollama (local) as the AI backend. The chatbot should only answer security-related questions and refuse unrelated topics. Store chat history in Supabase."
- **Data sensitivity:** Chat tidak mengandung PII. Semua diproses via Ollama (lokal).
- **Test it by:** Tanya "Apa itu phishing?" → chatbot jawab dengan benar. Tanya "Resep masakan?" → chatbot tolak.

### Feature 5: AI Training Recommendation
- **Complexity:** Medium
- **Build prompt:** "Create an AI recommendation engine that analyzes an employee's risk score and phishing interaction history, then suggests specific training modules. Use Ollama to generate recommendations. Display recommendations on the admin dashboard per employee."
- **Data sensitivity:** Hanya risk score & tipe interaksi yang dikirim ke AI. **Nama/email karyawan TIDAK dikirim.**
- **Test it by:** Karyawan dengan risk score 80 → AI rekomendasikan "Advanced Phishing Recognition Training".

---

## Database & Data Storage

**Recommended:** Supabase (PostgreSQL) — free tier: 500MB, 50K auth users, unlimited API requests.

### Core Data Tables

```
users (admin accounts)
├── id, email, name, role, created_at

targets (employees being tested)
├── id, email, name, department, position, risk_score, created_at

campaigns (phishing simulation campaigns)
├── id, name, scenario, status, smtp_config_id, created_by, created_at

campaign_results (tracking per target per campaign)
├── id, campaign_id, target_id, token, 
├── email_sent_at, email_opened_at, link_clicked_at, data_submitted_at,
├── training_completed_at, quiz_score, risk_score_delta

email_templates (AI-generated + manual)
├── id, name, subject, html_body, sender_name, scenario_type, is_ai_generated

training_quizzes (quiz questions per scenario)
├── id, scenario_type, question, options_json, correct_answer, explanation

smtp_configs (sending profiles)
├── id, name, host, port, username, from_address, provider
```

> **Privacy Rule:** Kolom sensitif (email, nama karyawan) TIDAK PERNAH dikirim ke AI API. Hanya `risk_score`, `department`, dan `scenario_type` yang boleh diproses oleh AI.

---

## AI Features

### AI Architecture: Dual-Mode (Local + Cloud Fallback)

| Use Case | Provider | Data Sent | Privacy Level |
|----------|-----------|---------------|
| Generate phishing email | **Ollama (Local)** | Skenario, urgensi, departemen | ✅ Aman — tidak keluar jaringan |
| Human Risk Score calculation | **Ollama (Local)** | Risk score, tipe interaksi (tanpa nama) | ✅ Aman — tidak keluar jaringan |
| AI Chatbot karyawan | **Ollama (Local)** | Pertanyaan keamanan (tanpa PII) | ✅ Aman — tidak keluar jaringan |
| Training recommendation | **Ollama (Local)** | Risk score, department (tanpa nama) | ✅ Aman — tidak keluar jaringan |
| **Fallback** (jika Ollama down) | **Groq API** | Skenario & score saja (tanpa PII) | ⚠️ Cloud — data terenkripsi tapi lewat internet |

### Fallback Behavior
```
IF Ollama is running:
  → Use Ollama (local) for all AI tasks
ELSE IF Groq API key is configured:
  → Use Groq API (cloud) — strip PII before sending
ELSE:
  → Show error: "AI service unavailable. Please start Ollama or configure Groq API key."
  → Allow manual template creation as fallback
```

### Ollama Setup Guide
1. Download Ollama dari https://ollama.ai
2. Install dan jalankan: `ollama pull llama3`
3. Ollama berjalan di `http://localhost:11434`
4. Cek status: buka browser ke `http://localhost:11434/api/tags`

---

## AI Assistance Strategy

### Which AI Tool for What

| Task | Best AI Tool | Example Prompt |
|------|--------------|----------------|
| Planning architecture | Claude / ChatGPT | "Design database schema for phishing simulation platform with tracking" |
| Writing code | VS Code + Copilot | "Implement email tracking pixel route in Next.js API" |
| Fixing bugs | ChatGPT / Claude | "Error: [paste error]. How to fix in Next.js + Supabase?" |
| UI/Design | v0.dev / Claude | "Create admin dashboard with risk matrix, charts, and campaign cards" |
| Database schema | Claude | "Generate Prisma schema for User, Campaign, Target, Result tables" |
| Testing | ChatGPT | "How to test email tracking with Nodemailer + Resend?" |

---

## Deployment Plan

### Recommended: Vercel (Managed Hosting)

1. **Connect:** Push code ke GitHub → Import repository di Vercel
2. **Environment Variables:** Tambahkan di Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `GROQ_API_KEY`
   - `RESEND_API_KEY`
   - `OLLAMA_BASE_URL` (jika deploy di VPS)
3. **Deploy:** Otomatis setiap `git push` ke branch `main`

### ⚠️ Ollama + Vercel Limitation
- **Vercel (serverless) tidak bisa menjalankan Ollama.**
- **Solusi MVP:** Jalankan Ollama lokal + akses app dari localhost untuk development.
- **Solusi Production:** Deploy app di VPS (Railway/Render free tier) atau gunakan Groq API sebagai fallback di production.

### Alternative Deployment Options

| Platform | Free Tier | Ollama Support | Difficulty |
|----------|-----------|----------------|------------|
| **Vercel** (Recommended) | ✅ Generous | ❌ Serverless | Easy |
| **Railway** | ✅ $5 credit | ✅ Bisa run Ollama | Medium |
| **Render** | ✅ Free tier | ✅ Bisa run Docker | Medium |
| **Local (localhost)** | ✅ Unlimited | ✅ Full support | Easy (dev only) |

---

## Cost Breakdown

### Development Phase (Free Tiers)

| Service | Free Tier | Notes |
|---------|-----------|-------|
| VS Code + Copilot | ✅ Free (Copilot trial) | AI menulis semua kode |
| GitHub | ✅ Free | Simpan kode |
| Vercel | ✅ 100GB bandwidth | Hosting & deploy |
| Supabase | ✅ 500MB DB, 50K users | Database + Auth |
| Ollama | ✅ Free (local) | Local AI — no API cost |
| Groq API | ✅ Free tier | Fallback AI (cloud) |
| Resend | ✅ 3,000 emails/bulan | SMTP email delivery |
| **Total** | **$0/bulan** | Cukup untuk MVP |

### After Launch (Estimate)

| Service | Expected Cost | When |
|---------|---------------|------|
| Vercel Pro | $0 (free tier cukup untuk < 10K users) | Jika traffic naik |
| Supabase Pro | $0 (free tier cukup untuk < 500MB data) | Jika data besar |
| Resend | $0 (free: 3K emails/bulan) | Jika > 3K emails/bulan → $20/bulan |
| Ollama | $0 (local) | Selalu gratis |

---

## Common Challenges & Solutions

| Problem | Solution |
|---------|----------|
| **"Saya stuck, tidak tahu harus apa"** | Copy-paste error message ke ChatGPT/Claude + kode terkait. Minta: "Explain in simple terms and fix it." |
| **"Ollama tidak jalan"** | Cek: `ollama list` → pastikan `llama3` sudah di-download. Fallback: gunakan Groq API key. |
| **"Email tidak terkirim"** | Cek Resend dashboard → pastikan domain terverifikasi. Test dengan email sendiri dulu. |
| **"Tracking tidak akurat"** | Cek: pixel image URL harus unik per target. Test: buka email → cek Supabase `campaign_results` table. |
| **"Deploy gagal"** | Cek: semua environment variables sudah ditambahkan di Vercel? Cek build logs di Vercel dashboard. |
| **"Database error"** | Jalankan `npx prisma migrate reset` → `npx prisma db push` → `npx prisma seed` |

---

## Step-by-Step Implementation Roadmap

### Week 1 — Foundation & Setup
- Day 1-2: Install semua software, buat akun, initialize Next.js project
- Day 3-4: Setup Supabase + Prisma schema, Auth admin (login/register)
- Day 5-7: Deploy "Hello World" ke Vercel, test Ollama connection

### Week 2-3 — Core Features
- Day 8-10: AI Campaign Builder (form + Ollama integration + email preview)
- Day 11-14: Email sending (Resend) + Tracking pixel + Click tracking
- Day 15-18: Training Landing Page + Quiz Engine (mobile-first)

### Week 4-5 — Analytics & Polish
- Day 19-22: Dashboard + Risk Score calculation + Charts (Recharts)
- Day 23-25: AI Chatbot + Training Recommendation
- Day 26-28: Testing end-to-end, UI polish, bug fixes

### Week 6 — Launch
- Day 29-30: Final testing, deploy production, dokumentasi

---

## Success Checklist

- [ ] Semua akun dibuat, dev environment siap, limitations dipahami, budget $0 dikonfirmasi
- [ ] Hanya mengikuti fitur PRD; testing setiap selesai 1 fitur; bertanya AI saat stuck
- [ ] Sebelum launch: semua fitur P0 bekerja, tested di mobile, basic error handling
- [ ] Ollama berjalan lokal, data sensitif TIDAK keluar ke cloud AI
- [ ] Email tracking 100% akurat (open, click, submit)
- [ ] Human Risk Score terkalkulasi otomatis

**You'll know it's working when:** Kampanye phishing terkirim tanpa error, tracking akurat, karyawan bisa akses training quiz dari HP, dan dashboard menampilkan risk score otomatis.

---

## Maintenance

- **Dependencies:** Jalankan `npm update` sebulan sekali. Cek changelog sebelum major update.
- **Ollama:** Update model secara berkala → `ollama pull llama3` untuk versi terbaru.
- **Supabase:** Monitor penggunaan di dashboard. Upgrade jika mendekati limit free tier.
- **Monthly review:** Cek Vercel analytics, Supabase usage, dan Resend email quota.
- **Update AGENTS.md** (Part 4) seiring bertambahnya fitur dan skala.

---

## Open Questions

| # | Question | Status |
|---|----------|--------|
| 1 | Apakah akan deploy di VPS (Railway/Render) atau tetap Vercel + Groq fallback untuk production? | TBD |
| 2 | Model Ollama mana yang akan digunakan? (Llama 3 8B = RAM 8GB, Llama 3 70B = RAM 40GB+) | TBD — default Llama 3 8B |
| 3 | Apakah perlu multi-language support (Bahasa Indonesia + English) untuk email template? | TBD |
| 4 | Berapa jumlah target karyawan maksimal yang diharapkan per kampanye? (Mempengaruhi SMTP quota) | TBD |

---
*Technical Design for: HumanRisk AI | Approach: Next.js + Supabase + Ollama (Local AI) | Est. time to MVP: 1-2 months | Est. cost: $0/month*

---
## Handoff Context
<!-- Machine-readable summary for the next workflow step. Do not delete; the next prompt in the workflow reads this block. -->
- Stage: techdesign
- App name: HumanRisk AI
- User level: A
- Target platform: web
- Budget: Free / Open-source
- Timeline: 1-2 bulan
- Chosen stack: Next.js 14 + Tailwind CSS + Shadcn UI + Supabase + Prisma + Ollama (Local AI) + Groq (Fallback) + Resend SMTP + Vercel
- AI coding tool: VS Code + GitHub Copilot
- Source files: research-soceng.md → PRD-HumanRiskAI-MVP.md → TechDesign-HumanRiskAI-MVP.md
---
