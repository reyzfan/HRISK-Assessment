# Product Requirements Document: HumanRisk AI MVP

## Product Overview

**App Name:** HumanRisk AI  
**Tagline:** Next-Gen Social Engineering Simulation & Human Risk Assessment Platform  
**Launch Goal:** Membangun platform alternatif GoPhish yang modern, cerdas dengan AI generator, analitik risiko otomatis, serta edukasi instan untuk karyawan.  
**Target Launch:** 2-3 Minggu  

---

## Who It's For

### Primary User: SecOps / IT Admin (Campaign Manager)
Admin IT dan Keamanan Siber perusahaan yang bertugas menjalankan uji simulasi *social engineering* dan mengukur tingkat kesadaran keamanan karyawan.

**Their Current Pain:**
- GoPhish memiliki UI kaku dan pembuatan template email phishing harus dilakukan secara manual (HTML).
- Mengukur risiko karyawan sangat lambat karena harus mengolah data mentah CSV tanpa *Human Risk Score* otomatis.
- Saat karyawan mengklik email phishing, tidak ada sistem pelatihan instan atau kuis interaktif otomatis.

**What They Need:**
- AI Phishing Generator untuk membuat email simulasi secara instan berdasar skenario.
- Dashboard analitik real-time dengan kalkulasi *Human Risk Score* (0-100).
- Sistem landing page edukasi otomatis + kuis interaktif ketika karyawan mengklik link simulasi.

---

## The Problem We're Solving

Simulasi keamanan siber konvensional seringkali pasif, tidak menarik, dan memerlukan banyak waktu konfigurasi manual. **HumanRisk AI** mengubah pengujian pasif menjadi sistem penilaian risiko aktif & edukasi instan menggunakan AI, tanpa perlu biaya langganan mahal seperti KnowBe4.

---

## User Journey

1. **Setup & Campaign Creation**: Admin memilih/menggunakan AI untuk meng-generate email phishing (misal: "Tagihan HR Urgent") dan memilih grup karyawan target.
2. **Email Delivery & Tracking**: Email simulasi dikirim via SMTP Relay. Setiap interaksi (Buka Email, Klik Link, Submit Data) dicatat secara real-time.
3. **Instant Educational Interception**: Jika karyawan mengklik link phishing, mereka tidak melihat error page kaku, melainkan **Instant Training Landing Page** yang menjelaskan indikator bahaya email tersebut beserta **Kuis Interaktif** 3 pertanyaan.
4. **Analytics & Risk Matrix**: Dashboard Admin langsung memperbarui skor risiko (*Human Risk Score*) karyawan & departemen berdasarkan perilaku interaksi dan hasil kuis.

---

## MVP Features

### Must Have for Launch (P0)

#### 1. AI Phishing Email Generator
- **What:** Modul pembuatan email phishing otomatis menggunakan LLM (Groq / Open Source AI) berdasarkan parameter skenario & tingkat kesulitan.
- **User Story:** Sebagai Admin, saya ingin memasukkan topik kampanye agar AI menghasilkan subjek, body HTML, dan sender name secara otomatis.
- **Success Criteria:**
  - [ ] AI dapat merender preview HTML email dalam < 3 detik.
  - [ ] Tersedia opsi kustomisasi parameter (Tingkat Urgensi, Departemen Target).

#### 2. Interactive Real-time Dashboard & Human Risk Score Matrix
- **What:** Antarmuka statistik visual real-time (Opens, Clicks, Form Submits) dan matriks tingkat risiko karyawan.
- **User Story:** Sebagai Admin, saya ingin melihat grafik performa kampanye dan daftar karyawan berisiko tinggi.
- **Success Criteria:**
  - [ ] Menampilkan grafik *Click Rate*, *Submit Rate*, dan *Completion Rate*.
  - [ ] Kalkulasi otomatis *Human Risk Index* (0 - 100) per karyawan & departemen.

#### 3. Automated Instant Training Landing Page + Interactive Quiz
- **What:** Landing page edukasi yang muncul saat link phishing diklik, dilengkapi kuis interaktif 3 soal.
- **User Story:** Sebagai Karyawan yang terjebak, saya ingin langsung mempelajari kesalahan saya dan mengisi kuis singkat dari perangkat mobile/desktop.
- **Success Criteria:**
  - [ ] Redirect otomatis dari link tracking ke halaman edukasi.
  - [ ] Kuis interaktif dapat diisi dan hasilnya langsung disimpan ke database.

---

## Out of Scope (Not in MVP)
- **Active Directory / LDAP Sync**: Disimpan untuk v2 (MVP menggunakan CSV Import / Manual Add User).
- **SMS / WhatsApp Phishing (Smishing)**: Disimpan untuk v2 (MVP fokus pada Email Phishing).
- **Multi-tenant SaaS Billing**: Disimpan untuk v2 (MVP fokus pada Single Organization / On-Premise / Self-Hosted).

---

## How We'll Know It's Working

### Launch Success Metrics (First 30 Days)
| Metric | Target | Measure |
|--------|--------|---------|
| Successful Campaign Executions | > 5 Kampanye | Total kampanye yang terkirim tanpa error |
| Detection & Tracking Accuracy | 100% | Ketepatan pencatatan Open, Click, Submit |
| Training Quiz Completion Rate | > 80% | Persentase karyawan yang menyelesaikan kuis setelah mengklik link |

---

## Look & Feel

**Design Vibe:** Modern, Dark/Light Cyber-Security, Clean, Responsive.

**Key Screens/Pages:**
1. **Admin Dashboard**: Overview metrik, Human Risk Matrix, Campaign status.
2. **AI Campaign Builder**: Form pembuat email AI, penerima target, dan konfigurasi SMTP.
3. **Mobile-Friendly Training Page**: Halaman jebakan edukasi & kuis interaktif untuk karyawan.

---

## Technical Considerations

- **Platform**: Web App Responsive (Desktop untuk Admin Dashboard, Mobile-First untuk Training Landing Page karyawan).
- **Stack**: Next.js 14+ (App Router), Tailwind CSS, PostgreSQL (Supabase/Prisma), Groq/Ollama AI API, Nodemailer/Resend SMTP.
- **Performance**: Dashboard load < 2 detik; Redirect tracking < 500ms.
- **Security**: Hash token acak per penerima email (`/track/click?t=unique_hash`).

---

## Budget & Constraints

- **Budget:** $0 (Free-tier services: Vercel, Supabase, Groq API, Resend Free Tier).
- **Timeline:** 2 - 3 Minggu.
- **Reference Folder:** `gophish-master/` (Read-only reference).

---

## Quality Standards

- Tidak menggunakan *placeholder text* ("Lorem Ipsum") dalam produksi.
- Semua link tracking dan kuis harus berfungsi penuh end-to-end.
- Tampilan training page wajib diuji secara teliti di browser HP/Mobile.

---

## Definition of Done for MVP

- [ ] Seluruh fitur P0 (AI Generator, Tracking Dashboard, Instant Training + Kuis) berfungsi normal.
- [ ] Pengiriman email simulasi dan pelacakan click/open berjalan 100% akurat.
- [ ] Tampilan UI Admin & Karyawan responsif dan bebas bug kritis.
- [ ] Aplikasi siap dijalankan secara lokal atau di-deploy ke hosting gratis.

---
*Document created: 2026-08-08*  
*Status: Ready for Technical Design*

---
## Handoff Context
<!-- Machine-readable summary for the next workflow step. Do not delete; the next prompt in the workflow reads this block. -->
- Stage: prd
- App name: HumanRisk AI
- User level: A
- Target platform: web
- Budget: Free / Open-source
- Timeline: Beberapa minggu (2-3 weeks)
- Source files: research-soceng.md → PRD-HumanRiskAI-MVP.md
---
