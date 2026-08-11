import { ShieldAlert, Smartphone, CheckCircle2, Eye, Link2, LockKeyhole, MessageCircleWarning } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QuizForm, type QuizQuestion } from "@/components/training/quiz-form";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

type TrainingPageProps = {
  params: { token: string };
};

export default async function TrainingPage({ params }: TrainingPageProps) {
  const result = await prisma.campaignResult.findUnique({
    where: { token: params.token },
    include: {
      campaign: { include: { emailTemplate: true } },
      target: true,
    },
  });

  if (!result) {
    return (
      <main className="min-h-screen bg-background px-4 py-8">
        <div className="mx-auto max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>Training link tidak valid</CardTitle>
              <CardDescription>
                Token tidak ditemukan. Hubungi admin keamanan jika Anda merasa ini keliru.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </main>
    );
  }

  const scenarioType = result.campaign.emailTemplate?.scenarioType ?? result.campaign.scenario;
  const quizzes = await prisma.trainingQuiz.findMany({
    where: { scenarioType },
    orderBy: { createdAt: "asc" },
  });

  const questions: QuizQuestion[] = quizzes.map((quiz) => ({
    id: quiz.id,
    question: quiz.question,
    options: JSON.parse(quiz.optionsJson) as string[],
    explanation: quiz.explanation,
  }));

  const completed = Boolean(result.trainingCompletedAt);

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-muted/40 px-4 py-6 sm:py-10">
      <div className="mx-auto max-w-3xl space-y-5 sm:space-y-6">
        <div className="rounded-3xl border bg-card/80 px-5 py-7 text-center shadow-sm sm:px-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500/10 text-yellow-600">
            <ShieldAlert className="h-9 w-9" />
          </div>
          <Badge variant="secondary" className="mb-3">Micro-training keamanan</Badge>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Ini adalah simulasi phishing</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
            Anda mengklik tautan simulasi dari kampanye: <strong>{result.campaign.name}</strong>. Tidak apa-apa — gunakan 2 menit ini untuk mengenali tanda bahaya sebelum kejadian asli.
          </p>
        </div>

        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Indikator yang perlu diperhatikan</CardTitle>
            <CardDescription>
              Empat pemeriksaan cepat sebelum membuka tautan dari email.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="grid gap-3 text-sm sm:grid-cols-2">
              <li className="flex gap-3 rounded-xl border bg-background p-3">
                <Eye className="mt-0.5 h-5 w-5 shrink-0 text-yellow-600" />
                <span>Periksa apakah email memakai rasa urgensi berlebihan untuk menekan Anda.</span>
              </li>
              <li className="flex gap-3 rounded-xl border bg-background p-3">
                <Link2 className="mt-0.5 h-5 w-5 shrink-0 text-yellow-600" />
                <span>Arahkan kursor ke link dan pastikan domainnya resmi sebelum membuka.</span>
              </li>
              <li className="flex gap-3 rounded-xl border bg-background p-3">
                <LockKeyhole className="mt-0.5 h-5 w-5 shrink-0 text-yellow-600" />
                <span>Jangan pernah memasukkan password, OTP, atau data sensitif dari link email.</span>
              </li>
              <li className="flex gap-3 rounded-xl border bg-background p-3">
                <MessageCircleWarning className="mt-0.5 h-5 w-5 shrink-0 text-yellow-600" />
                <span>Jika ragu, verifikasi lewat channel resmi perusahaan.</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-primary" />
              <CardTitle>Kuis Singkat</CardTitle>
            </div>
            <CardDescription>
              Jawab semua pertanyaan. Hasilnya langsung tersimpan dan membantu menurunkan risk score setelah training.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {completed ? (
              <div className="rounded-md border border-green-500/30 bg-green-500/5 p-4 text-green-700">
                <div className="flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="h-5 w-5" />
                  Training sudah selesai
                </div>
                <p className="mt-2 text-sm">Skor kuis: {result.quizScore ?? 0}/{questions.length}</p>
              </div>
            ) : questions.length > 0 ? (
              <QuizForm token={params.token} questions={questions} />
            ) : (
              <p className="text-sm text-muted-foreground">Kuis belum tersedia untuk skenario ini.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
