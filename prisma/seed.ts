import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { generateTrackingToken } from "../src/lib/tracking/token";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: "admin@humanrisk.local" },
    update: {},
    create: {
      email: "admin@humanrisk.local",
      name: "Demo Admin",
      role: "admin",
    },
  });

  const smtp = await prisma.smtpConfig.upsert({
    where: { id: "demo-smtp" },
    update: {},
    create: {
      id: "demo-smtp",
      name: "Demo Resend SMTP",
      host: "smtp.resend.com",
      port: 587,
      username: "resend",
      fromAddress: "security@example.com",
      provider: "resend",
    },
  });

  const campaign = await prisma.campaign.upsert({
    where: { id: "demo-campaign" },
    update: { status: "active" },
    create: {
      id: "demo-campaign",
      name: "Demo HR Urgent Invoice Campaign",
      scenario: "Tagihan HR Urgent",
      status: "active",
      createdById: admin.id,
      smtpConfigId: smtp.id,
    },
  });

  await prisma.emailTemplate.upsert({
    where: { id: "demo-template" },
    update: {},
    create: {
      id: "demo-template",
      name: "Demo HR Urgent Template",
      subject: "Tindakan Diperlukan: Konfirmasi Dokumen HR",
      htmlBody:
        "<p>Halo,</p><p>Tim HR membutuhkan konfirmasi dokumen internal Anda.</p><p><a href=\"{{TRACKING_LINK}}\">Buka dokumen</a></p>",
      senderName: "Human Resources",
      scenarioType: "hr-urgent",
      isAiGenerated: true,
      campaignId: campaign.id,
    },
  });

  const targets = [
    { email: "andi.demo@example.com", name: "Andi Demo", department: "Finance", position: "Staff" },
    { email: "sari.demo@example.com", name: "Sari Demo", department: "HR", position: "Manager" },
    { email: "budi.demo@example.com", name: "Budi Demo", department: "IT", position: "Engineer" },
    { email: "maya.demo@example.com", name: "Maya Demo", department: "Sales", position: "Account Executive" },
    { email: "rina.demo@example.com", name: "Rina Demo", department: "Finance", position: "Analyst" },
  ];

  for (const targetInput of targets) {
    const target = await prisma.target.upsert({
      where: { email: targetInput.email },
      update: targetInput,
      create: targetInput,
    });

    const existing = await prisma.campaignResult.findFirst({
      where: { campaignId: campaign.id, targetId: target.id },
    });

    if (!existing) {
      await prisma.campaignResult.create({
        data: {
          campaignId: campaign.id,
          targetId: target.id,
          token: generateTrackingToken(),
          emailSentAt: new Date(),
        },
      });
    }
  }

  const questions = [
    {
      id: "quiz-hr-urgent-1",
      question: "Apa tanda mencurigakan dari email simulasi ini?",
      optionsJson: JSON.stringify([
        "Nada mendesak yang menekan penerima untuk segera klik",
        "Menggunakan tanda tangan email",
        "Email memiliki paragraf pendek",
        "Email dikirim pada hari kerja",
      ]),
      correctAnswer: 0,
      explanation: "Penyerang sering memakai tekanan waktu agar korban tidak berpikir kritis.",
    },
    {
      id: "quiz-hr-urgent-2",
      question: "Apa tindakan paling aman sebelum membuka link HR?",
      optionsJson: JSON.stringify([
        "Langsung login agar cepat selesai",
        "Forward ke semua teman kerja",
        "Verifikasi lewat channel resmi HR atau portal internal",
        "Balas email dengan password",
      ]),
      correctAnswer: 2,
      explanation: "Selalu verifikasi permintaan sensitif lewat channel resmi.",
    },
    {
      id: "quiz-hr-urgent-3",
      question: "Informasi apa yang tidak boleh diberikan lewat link email mencurigakan?",
      optionsJson: JSON.stringify([
        "Password atau kode OTP",
        "Nama departemen umum",
        "Jam kerja kantor",
        "Judul dokumen publik",
      ]),
      correctAnswer: 0,
      explanation: "Password dan OTP adalah kredensial sensitif dan tidak boleh dibagikan.",
    },
  ];

  for (const quiz of questions) {
    await prisma.trainingQuiz.upsert({
      where: { id: quiz.id },
      update: quiz,
      create: {
        ...quiz,
        scenarioType: "hr-urgent",
      },
    });
  }

  console.log("Seed completed. Demo campaign and tracking tokens are ready.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
