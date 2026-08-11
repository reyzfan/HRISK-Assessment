"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  explanation: string;
};

export function QuizForm({ token, questions }: { token: string; questions: QuizQuestion[] }) {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ score: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);
  const isComplete = answeredCount === questions.length;

  async function submitQuiz() {
    setError(null);

    if (!isComplete) {
      setError(`Jawab semua pertanyaan terlebih dahulu (${answeredCount}/${questions.length} terjawab).`);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/training/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, answers }),
      });

      const data: unknown = await response.json();
      if (!response.ok) {
        const message = typeof data === "object" && data && "error" in data
          ? String(data.error)
          : "Gagal menyimpan hasil kuis.";
        throw new Error(message);
      }

      const typed = data as { score: number; total: number };
      setResult({ score: typed.score, total: typed.total });
      router.refresh();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Gagal menyimpan hasil kuis.");
    } finally {
      setLoading(false);
    }
  }

  if (result) {
    const passed = result.score >= Math.ceil(result.total * 0.67);

    return (
      <Card className="border-green-500/30 bg-green-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600">
            <CheckCircle2 className="h-5 w-5" />
            Training selesai
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-2xl bg-background p-4 text-center">
            <p className="text-sm text-muted-foreground">Skor Anda</p>
            <p className="mt-1 text-4xl font-bold text-green-600">
              {result.score}/{result.total}
            </p>
            <p className="mt-2 text-sm font-medium">
              {passed ? "Bagus — Anda memahami indikator phishing utama." : "Training selesai — ulangi tips di atas agar lebih siap."}
            </p>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Hasil kuis sudah disimpan. Dashboard admin akan diperbarui otomatis saat halaman direfresh.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="sticky top-0 z-10 rounded-xl border bg-background/95 p-3 shadow-sm backdrop-blur">
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="font-medium">Progress kuis</span>
          <span className="text-muted-foreground">{answeredCount}/{questions.length} terjawab</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${questions.length ? (answeredCount / questions.length) * 100 : 0}%` }}
          />
        </div>
      </div>

      {questions.map((question, index) => (
        <Card key={question.id} className="overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-start gap-3 text-base leading-6">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm text-primary">
                {index + 1}
              </span>
              {question.question}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {question.options.map((option, optionIndex) => {
              const selected = answers[question.id] === optionIndex;

              return (
                <label
                  key={option}
                  className={`flex min-h-14 cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${
                    selected ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                  }`}
                >
                  <input
                    type="radio"
                    name={question.id}
                    value={optionIndex}
                    checked={selected}
                    onChange={() => setAnswers((current) => ({ ...current, [question.id]: optionIndex }))}
                    className="mt-1 h-4 w-4"
                  />
                  <span className="text-sm leading-6">{option}</span>
                </label>
              );
            })}
            <div className="flex gap-2 rounded-xl bg-muted/50 p-3 text-xs leading-5 text-muted-foreground">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
              <span>Tip: {question.explanation}</span>
            </div>
          </CardContent>
        </Card>
      ))}

      {error && <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}

      <Button onClick={submitQuiz} disabled={loading || !isComplete} className="h-12 w-full text-base">
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {loading ? "Menyimpan..." : isComplete ? "Kirim Jawaban" : `Lengkapi jawaban (${answeredCount}/${questions.length})`}
      </Button>
    </div>
  );
}
