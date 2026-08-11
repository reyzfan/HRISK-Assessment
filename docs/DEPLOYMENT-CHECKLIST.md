# HumanRisk AI — Deployment & Security Checklist

Gunakan checklist ini sebelum menjalankan pilot test atau deploy ke Vercel.

---

## 1. Secrets & Environment

Pastikan file `.env` / `.env.local` **tidak pernah di-commit**.

Checklist:

- [ ] `.env.example` hanya berisi placeholder, bukan secret asli.
- [ ] `DATABASE_URL` disimpan di dashboard hosting, bukan di kode.
- [ ] `SUPABASE_SERVICE_ROLE_KEY` tidak pernah dipakai di client component.
- [ ] `RESEND_API_KEY` hanya dipakai di server/API route.
- [ ] `GROQ_API_KEY` hanya dipakai di server/API route.
- [ ] `NEXT_PUBLIC_*` hanya dipakai untuk value yang memang aman dilihat browser.

---

## 2. AI Privacy Rules

HumanRisk AI harus menjaga PII karyawan.

Checklist:

- [ ] Nama karyawan tidak dikirim ke cloud AI.
- [ ] Email karyawan tidak dikirim ke cloud AI.
- [ ] Prompt AI hanya berisi scenario, urgency, department, atau data agregat.
- [ ] Ollama lokal menjadi provider utama untuk data sensitif.
- [ ] Groq fallback hanya menerima data yang sudah bebas PII.

---

## 3. Email Sending Safety

Checklist:

- [ ] Selalu jalankan Dry Run sebelum Send Test.
- [ ] Selalu jalankan Send Test ke recipient aman sebelum Send All.
- [ ] Send All hanya aktif setelah user mengetik `SEND ALL`.
- [ ] API `/api/campaigns/send` menolak real send tanpa `confirmSendAll: true`.
- [ ] Resend sender sudah diverifikasi atau memakai test-recipient yang diizinkan.

---

## 4. Tracking Safety

Checklist:

- [ ] Tracking token berbentuk 64 karakter hex dari `crypto.randomBytes(32)`.
- [ ] `/api/track/click` menolak token invalid dan redirect ke `/training/invalid`.
- [ ] `/api/track/report` menolak token invalid dan redirect ke `/reported/invalid`.
- [ ] `/api/track/open` mengabaikan token invalid dan tetap mengembalikan pixel.
- [ ] `NEXT_PUBLIC_APP_URL` benar sesuai environment lokal/production.

---

## 5. Database & Prisma

Checklist:

- [ ] `npx prisma db push` sukses di environment target.
- [ ] `npm run db:seed` hanya dijalankan untuk demo/test, bukan data real tanpa persetujuan.
- [ ] Data dummy tidak bercampur dengan pilot test real.
- [ ] Backup database dilakukan sebelum perubahan schema besar.

---

## 6. Build & Quality Gate

Sebelum deploy:

```powershell
npm run build
```

Checklist:

- [ ] Build sukses.
- [ ] Type check sukses.
- [ ] Lint sukses.
- [ ] Tidak ada error di VS Code Problems.
- [ ] Tidak ada placeholder production seperti `Lorem ipsum`.

---

## 7. Manual E2E Pilot

Ikuti dokumen:

`docs/E2E-TEST-GUIDE.md`

Checklist minimal:

- [ ] AI template berhasil dibuat dan disimpan.
- [ ] Target dummy berhasil dibuat.
- [ ] Campaign berhasil dibuat.
- [ ] Dry Run menghasilkan tracking URL.
- [ ] Send Test hanya mengirim ke 1 test recipient.
- [ ] Click tracking redirect ke training page.
- [ ] Training quiz tersubmit.
- [ ] Dashboard risk score berubah sesuai event.

---

## 8. Vercel Deployment Notes

Checklist:

- [ ] Repository tersambung ke Vercel.
- [ ] Semua environment variables ditambahkan di Vercel Project Settings.
- [ ] `NEXT_PUBLIC_APP_URL` di-set ke domain production.
- [ ] Groq fallback tersedia jika Ollama tidak tersedia di Vercel serverless.
- [ ] Resend sender/recipient sudah valid untuk test production.

Catatan penting:

- Vercel serverless tidak menjalankan Ollama lokal.
- Untuk production free-tier, gunakan Groq fallback tanpa PII.
- Jika harus local AI production, gunakan VPS/container seperti Railway/Render dan pastikan resource cukup.

---

## 9. Go / No-Go

Deploy pilot hanya jika:

- [ ] Semua checklist security utama selesai.
- [ ] Semua P0 flow di E2E guide lolos.
- [ ] Tidak ada secret di repository.
- [ ] Admin memahami batasan Resend dan AI fallback.
- [ ] Pilot hanya memakai dummy users atau pengguna internal yang sudah disetujui.
