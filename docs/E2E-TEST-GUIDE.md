# HumanRisk AI — End-to-End Test Guide

Panduan ini dipakai untuk memverifikasi alur utama MVP dari awal sampai akhir:

`AI template → campaign → test send → tracking click/open/report → training quiz → dashboard update`

> Tujuan utama: memastikan fitur inti **works perfectly** sebelum deployment.

---

## 1. Prasyarat

Pastikan project sudah bisa build:

- `npm install` sudah dijalankan
- `.env` atau `.env.local` sudah berisi konfigurasi yang dibutuhkan
- Database Supabase/PostgreSQL sudah aktif
- Prisma schema sudah dipush ke database
- Data seed/demo tersedia

Minimal environment variable yang perlu dicek:

| Variable | Tujuan | Wajib untuk |
|---|---|---|
| `DATABASE_URL` | Koneksi Prisma ke PostgreSQL | Semua flow database |
| `NEXT_PUBLIC_APP_URL` | Base URL tracking link | Email tracking |
| `RESEND_API_KEY` | Kirim email via Resend | Real/test email send |
| `RESEND_FROM_EMAIL` | Sender email | Real/test email send |
| `OLLAMA_BASE_URL` | Local AI endpoint | AI generation lokal |
| `GROQ_API_KEY` | Fallback cloud AI | AI fallback jika Ollama mati |

> Privacy rule: jangan kirim nama/email karyawan ke cloud AI. AI hanya boleh menerima scenario, urgency, department, risk score, atau data agregat.

---

## 2. Start Local App

Jalankan app secara lokal:

```powershell
npm run dev
```

Buka browser:

```text
http://localhost:3000
```

Jika app gagal start:

1. Cek terminal error.
2. Pastikan `DATABASE_URL` benar.
3. Jalankan build check:

```powershell
npm run build
```

---

## 3. Health Check Settings

Buka:

```text
http://localhost:3000/settings
```

Cek status service:

| Service | Expected |
|---|---|
| Supabase PostgreSQL | Configured + Reachable |
| Ollama Local AI | Reachable jika Ollama aktif |
| Groq API Fallback | Configured jika pakai fallback |
| Resend Email | Configured + Reachable jika API key valid |

Jika Ollama belum aktif:

```powershell
ollama serve
```

Lalu pastikan model sudah ada:

```powershell
ollama pull llama3
```

---

## 4. Test AI Email Generator

Buka:

```text
http://localhost:3000/ai-builder
```

Gunakan input contoh:

| Field | Value |
|---|---|
| Scenario | HR urgent payroll update |
| Department | Finance |
| Urgency | High |

Expected result:

- AI menghasilkan subject email
- AI menghasilkan sender name
- AI menghasilkan HTML/body email
- Preview email tampil normal
- Tidak ada data PII yang dikirim ke AI

Jika AI gagal:

- Pastikan Ollama hidup, atau
- Pastikan `GROQ_API_KEY` tersedia untuk fallback

---

## 5. Save Template

Setelah email AI berhasil dibuat:

1. Simpan template.
2. Buka halaman:

```text
http://localhost:3000/templates
```

Expected result:

- Template baru muncul di daftar
- Subject dan body sesuai hasil AI
- Template bisa dipilih saat membuat campaign

---

## 6. Prepare Targets

Buka:

```text
http://localhost:3000/targets
```

Tambahkan minimal 3 target test:

| Name | Email | Department |
|---|---|---|
| Alice Test | email-test-1@example.com | Finance |
| Bob Test | email-test-2@example.com | HR |
| Charlie Test | email-test-3@example.com | IT |

> Untuk real email test, gunakan email yang aman/diizinkan Resend. Jangan gunakan email karyawan asli saat pengujian awal.

Expected result:

- Target tersimpan
- Risk score awal sekitar 50
- Target muncul saat membuat campaign

---

## 7. Create Campaign

Buka:

```text
http://localhost:3000/campaigns
```

Buat campaign baru:

| Field | Value |
|---|---|
| Name | Finance Payroll Simulation |
| Scenario | HR payroll phishing simulation |
| Template | Pilih template hasil AI |
| Targets | Pilih target test |

Expected result:

- Campaign dibuat dengan status `draft`
- Campaign punya daftar target
- Setiap target punya tracking token unik

---

## 8. Dry Run Campaign Send

Di halaman `Campaigns`, jalankan send dengan mode dry run.

Expected result:

- Tidak ada email sungguhan terkirim
- Sistem menampilkan jumlah email yang akan dikirim
- Tracking URL dibuat untuk tiap target
- Tidak ada error dari API `/api/campaigns/send`

Checklist:

- [ ] Count email sesuai jumlah target
- [ ] Subject benar
- [ ] Tracking click URL tersedia
- [ ] Tracking report URL tersedia

---

## 9. Safe Test Email Send

Gunakan mode test recipient terlebih dahulu.

Expected result:

- Hanya 1 email terkirim ke test recipient
- Tidak terkirim ke seluruh target
- Response API mencatat `testMode: true`

Jika Resend gagal:

1. Cek `RESEND_API_KEY`.
2. Cek `RESEND_FROM_EMAIL`.
3. Cek apakah domain/sender sudah diverifikasi di Resend.
4. Untuk free mode Resend, pastikan recipient diizinkan.

---

## 10. Tracking Click Flow

Dari email test atau dry run output, buka tracking click URL.

Expected result:

1. API tracking click mencatat `linkClickedAt`.
2. User diarahkan ke:

```text
/training/[token]
```

3. Training page tampil mobile-friendly.
4. Risk score target naik karena link diklik.

Checklist:

- [ ] Redirect berjalan
- [ ] Training page tidak 404
- [ ] Token valid
- [ ] Dashboard berubah setelah refresh

---

## 11. Tracking Open Flow

Buka tracking pixel URL di browser atau cek email client yang memuat image.

Expected result:

- `emailOpenedAt` tercatat di campaign result
- Open hanya dicatat sekali jika sudah pernah terbuka

Catatan:

Beberapa email client memblokir gambar. Jika open tracking tidak muncul, test manual dengan membuka URL pixel langsung.

---

## 12. Report Phishing Flow

Buka report URL untuk target test.

Expected result:

- `reportedAt` tercatat
- Halaman reported/success tampil
- Risk score target turun atau membaik karena report email phishing

Checklist:

- [ ] Report URL valid
- [ ] Database update
- [ ] Dashboard menampilkan perubahan

---

## 13. Training Quiz Flow

Di halaman training:

1. Baca indikator phishing.
2. Jawab 3 pertanyaan quiz.
3. Submit quiz.

Expected result:

- Quiz score tersimpan
- `trainingCompletedAt` terisi
- Risk score diperbarui
- Jika score quiz lulus, risk score turun

Checklist:

- [ ] Feedback quiz jelas
- [ ] Submit tidak double-send
- [ ] Mobile layout nyaman
- [ ] Dashboard update setelah refresh

---

## 14. Dashboard Verification

Buka:

```text
http://localhost:3000/
```

Expected metrics:

| Metric | Expected |
|---|---|
| Total campaigns | Bertambah sesuai campaign dibuat |
| Sent count | Bertambah setelah real send |
| Click rate | Bertambah setelah click tracking |
| Training completion | Bertambah setelah quiz selesai |
| Human Risk Matrix | Warna berubah sesuai risk score |

Checklist:

- [ ] Campaign overview benar
- [ ] Target risk score benar
- [ ] Department risk matrix masuk akal
- [ ] Tidak ada angka NaN/null di UI

---

## 15. Final Build Check

Sebelum menganggap MVP selesai:

```powershell
npm run build
```

Expected result:

- Build sukses
- Type check sukses
- Tidak ada lint error

---

## 16. Definition of Done E2E

MVP dianggap lolos E2E jika:

- [ ] AI template bisa dibuat dan disimpan
- [ ] Target test bisa dibuat
- [ ] Campaign bisa dibuat dari template dan target
- [ ] Dry run send menghasilkan tracking URL
- [ ] Test recipient send aman dan hanya kirim ke 1 email
- [ ] Click tracking redirect ke training page
- [ ] Open tracking tercatat
- [ ] Report phishing tercatat
- [ ] Quiz training tersubmit
- [ ] Human Risk Score berubah sesuai event
- [ ] Dashboard menampilkan metrik akurat
- [ ] `npm run build` sukses

---

## 17. Known Limitations MVP

- Real email sending bergantung pada aturan Resend dan verifikasi sender.
- Open tracking bisa diblokir email client.
- Ollama lokal tidak tersedia di Vercel serverless; production perlu Groq fallback atau VPS/container.
- Multi-tenant, LDAP sync, SMS/WhatsApp phishing, dan billing tidak termasuk MVP.

---

## 18. Troubleshooting Cepat

| Problem | Solusi |
|---|---|
| AI generation gagal | Start Ollama atau set `GROQ_API_KEY` |
| Database gagal | Cek `DATABASE_URL`, jalankan Prisma push/seed |
| Email gagal terkirim | Cek Resend API key, sender, allowed recipient |
| Tracking 404 | Cek token di URL dan campaign result |
| Dashboard angka tidak berubah | Refresh halaman, cek event timestamp di database |
| Build gagal | Baca error pertama di terminal, fix sebelum lanjut |

---

## Next Step Setelah E2E

Jika semua checklist lolos:

1. Polish UI mobile training page.
2. Tambah error/loading state lebih rapi.
3. Deploy ke Vercel dengan Groq fallback.
4. Jalankan pilot test dengan 3-5 akun dummy internal.
