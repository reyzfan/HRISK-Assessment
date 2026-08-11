# Deep Research Document: HumanRisk AI (Next-Gen Social Engineering & Human Risk Assessment Platform)

> **Document Status:** Finalized Research Draft  
> **Workspace Reference:** `gophish-master/` (Reference code, read-only/unmodified)  
> **Target File Name:** `research-soceng.md`

---

## 1. Project Name
**HumanRisk AI** — Next-Gen Web-Based Social Engineering & Human Risk Assessment Platform.

---

## 2. Core Concept
HumanRisk AI adalah platform simulasi *social engineering* dan pengujian risiko manusia modern yang dirancang untuk menggantikan alur kerja *phishing simulation* konvensional seperti GoPhish. Platform ini mengkombinasikan:
- **AI-Powered Phishing Campaign Builder**: Pembuatan template email phishing otomatis menggunakan LLM (Open Source / Free-tier API) berdasarkan skenario dunia nyata (misal: Notifikasi HR, Tagihan Palsu, Urgent Security Update).
- **Interactive Real-time Analytics & Human Risk Matrix**: Dashboard visual interaktif untuk SecOps Admin yang menampilkan metrik *Click-Rate*, *Submit-Rate*, serta kalkulasi *Human Risk Score* otomatis per karyawan dan per departemen.
- **Automated Instant Training & Interactive Quiz**: Ketika karyawan mengklik tautan simulasi phishing, mereka langsung diarahkan ke landing page edukasi interaktif dengan kuis singkat untuk meningkatkan kesadaran keamanan secara instan.
- **Zero-Config & Modern Responsive UI**: Antarmuka berbasis web modern (Tailwind CSS/Next.js atau React/Node.js) yang responsif untuk tampilan Desktop Admin dan Mobile Karyawan.

---

## 3. Target Users
1. **IT / SecOps Admins & Campaign Managers (Primary Users)**:
   - Membutuhkan kemudahan dalam membuat, mengelola, dan memantau kampanye simulasi phishing.
   - Membutuhkan laporan analitik risiko yang tajam dan otomatis tanpa harus mengolah CSV secara manual.
2. **Karyawan Perusahaan secara Umum (End Users / Targets)**:
   - Menerima simulasi email phishing secara periodik.
   - Mengakses landing page edukasi & kuis interaktif dari perangkat laptop/desktop maupun *smartphone* (Mobile-friendly UI).

---

## 4. Technical Decisions & Architecture
### Recommended Tech Stack (Open Source & Free Tier Friendly)
- **Frontend**: Next.js 14+ (App Router) / React dengan Tailwind CSS + Shadcn UI / Lucide Icons.
- **Backend**: Node.js (TypeScript) dengan Express / Next.js Server Actions / FastAPI.
- **Database**: PostgreSQL (via Supabase Free Tier) atau SQLite/Prisma ORM untuk kemudahan lokal.
- **AI Engine**: Groq API (Llama 3 / Mixtral Free Tier) atau Ollama (Local AI) untuk pembuatan template email & analisis tingkat risiko.
- **Email Delivery (SMTP)**: Nodemailer terintegrasi dengan SMTP Relay gratis (Resend Free Tier, Brevo, SendGrid, atau SMTP internal).
- **Tracking Engine**: Pixel tracking unik per target (`<img src="/track/open?id=xyz"/>`) & URL redirect tracking (`/track/click?id=xyz`).

### Core Design Rules
- Folder `gophish-master/` tetap dipertahankan sebagai referensi struktur data GoPhish (Campaign, Result, Template, Page, SMTP Profile) dan **tidak akan diubah**.
- Tampilan Admin dioptimalkan untuk Layar Desktop (Dashboard charts, Risk Matrix, Campaign Builder).
- Tampilan Landing Page Training & Kuis dioptimalkan untuk Layar Mobile & Desktop.

---

## 5. Competitor Insights & Gap Analysis

| Fitur / Dimensi | GoPhish (Baseline) | KnowBe4 | PhishInsight / CanIPhish | **HumanRisk AI (Proposed)** |
| :--- | :--- | :--- | :--- | :--- |
| **UI / UX** | Klasik, kaku, dated Bootstrap UI | Kompleks, butuh training admin | Modern tapi berbayar | **Ultra-modern, clean, intuitif & responsif** |
| **Email Template Generation** | Manual HTML editing | Template library terbatas | Template library bawaan | **AI Auto-Generator (Skenario + Konteks Lokal)** |
| **Instant Training & Quiz** | Hanya Landing Page Statis | Ada (Modul terpisah) | Terbatas | **Otomatis Redirect ke Landing Page Edukasi + Kuis** |
| **Risk Scoring** | Tidak ada (hanya raw stats) | Ada (Kompleks) | Ada | **Otomatis (Human Risk Score Index 0-100)** |
| **Setup Complexity** | Butuh Binary/Go/Config JSON | SaaS Enterprise (Mahal) | SaaS Free/Paid | **Zero-Config Web App / Single Docker Command** |

### Key Gaps to Exploit:
1. GoPhish tidak memiliki AI generator untuk email phishing; membuat template terasa lambat dan manual.
2. GoPhish tidak memberikan skor risiko perilaku (*Human Risk Score*); hanya menyediakan statistik klik mentah.
3. GoPhish tidak memiliki alur pembelajaran interaktif langsung (instant micro-learning quiz) saat target terjebak.

---

## 6. Budget & Timeline

### Budget Breakdown (Free / Open Source Focus)
- **Hosting / Deployment**: Vercel / Render / Railway (Free Tier) - **$0**
- **Database**: Supabase / Neon PostgreSQL (Free Tier) - **$0**
- **AI LLM API**: Groq API / HuggingFace Free Tier / Ollama Local - **$0**
- **SMTP Service**: Resend (3,000 emails/month free) atau Brevo (300/day free) - **$0**
- **Total Initial Budget**: **$0 (100% Free / Open Source)**

### 2-3 Week Development Roadmap
- **Minggu 1: Scaffolding & Core Architecture**
  - Setup Next.js + Tailwind CSS + Prisma/PostgreSQL DB schema (User, Group, Template, Campaign, Result, TrainingQuiz).
  - Implementasi Auth Admin & Layout Dashboard utama.
- **Minggu 2: AI Engine, Tracking Engine & Campaign Builder**
  - Integrasi AI Prompt untuk Auto-Generate Phishing Emails.
  - Implementasi Tracking Pixel (Email Open) & Redirect Link (Click & Form Submit).
  - Implementasi Instant Educational Landing Page + Quiz Engine.
- **Minggu 3: Analytics, Risk Scoring & Polishing**
  - Algoritma Kalkulasi Human Risk Score (berdasarkan histori klik/submit vs kuis lulus).
  - Interactive Dashboard Risk Matrix & Charts (Recharts / Chart.js).
  - Testing, UI/UX polish, dan penyiapan dokumentasi deployment.

---

## Handoff Context
<!-- Machine-readable summary for the next workflow step. Do not delete; the next prompt in the workflow reads this block. -->
- Stage: research
- App name: HumanRisk AI
- User level: A
- Target platform: web
- Budget: Free / Open-source
- Timeline: Beberapa minggu (2-3 weeks)
- Source files: research-soceng.md
---
