"use client";

import { useMemo, useState } from "react";
import { Bot, Loader2, Save, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { GeneratedEmail } from "@/lib/ai/email-generator";

type GenerateResponse = {
  email: GeneratedEmail;
  provider: "ollama" | "groq";
};

const urgencyLabels = {
  low: "Low — calm and informational",
  medium: "Medium — important but not panic-driven",
  high: "High — urgent simulation tone",
};

export function AiEmailBuilder() {
  const [scenario, setScenario] = useState("Tagihan HR Urgent");
  const [urgency, setUrgency] = useState<"low" | "medium" | "high">("medium");
  const [department, setDepartment] = useState("Human Resources");
  const [generated, setGenerated] = useState<GenerateResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const canGenerate = scenario.trim().length >= 3 && department.trim().length >= 2;

  const templateName = useMemo(() => {
    if (!generated) return "";
    return `${generated.email.scenarioType} — ${generated.email.subject}`.slice(0, 110);
  }, [generated]);

  async function generateEmail() {
    setError(null);
    setSavedMessage(null);

    if (!canGenerate) {
      setError("Isi scenario minimal 3 karakter dan department minimal 2 karakter.");
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch("/api/ai/generate-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario, urgency, department }),
      });

      const data: unknown = await response.json();

      if (!response.ok) {
        const message = typeof data === "object" && data && "error" in data
          ? String(data.error)
          : "Failed to generate email.";
        throw new Error(message);
      }

      setGenerated(data as GenerateResponse);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Failed to generate email.");
    } finally {
      setIsGenerating(false);
    }
  }

  async function saveTemplate() {
    if (!generated) return;

    setError(null);
    setSavedMessage(null);
    setIsSaving(true);

    try {
      const response = await fetch("/api/ai/save-template", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: templateName,
          ...generated.email,
        }),
      });

      const data: unknown = await response.json();

      if (!response.ok) {
        const message = typeof data === "object" && data && "error" in data
          ? String(data.error)
          : "Failed to save template.";
        throw new Error(message);
      }

      setSavedMessage("Template saved to database.");
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Failed to save template.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            <CardTitle>Campaign Prompt</CardTitle>
          </div>
          <CardDescription>
            Only scenario, urgency, and department are sent to AI. No employee PII is used.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="scenario">Scenario topic</Label>
            <Input
              id="scenario"
              value={scenario}
              onChange={(event) => setScenario(event.target.value)}
              placeholder="Example: Tagihan HR Urgent"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="urgency">Urgency level</Label>
            <select
              id="urgency"
              value={urgency}
              onChange={(event) => setUrgency(event.target.value as "low" | "medium" | "high")}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {Object.entries(urgencyLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Target department</Label>
            <Input
              id="department"
              value={department}
              onChange={(event) => setDepartment(event.target.value)}
              placeholder="Example: Finance"
            />
          </div>

          {error && (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}

          {savedMessage && (
            <div className="rounded-md border border-green-500/30 bg-green-500/10 px-3 py-2 text-sm text-green-600">
              {savedMessage}
            </div>
          )}

          <Button onClick={generateEmail} disabled={isGenerating || !canGenerate} className="w-full">
            {isGenerating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            {isGenerating ? "Generating..." : "Generate Email"}
          </Button>
          <p className="text-xs text-muted-foreground">
            Jika Ollama lokal tidak aktif, sistem otomatis mencoba Groq fallback tanpa mengirim PII.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Email Preview</CardTitle>
          <CardDescription>
            Review the generated subject, sender, and HTML body before saving.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {generated ? (
            <div className="space-y-4">
              <div className="rounded-md border bg-muted/40 p-4">
                <p className="text-sm text-muted-foreground">Provider</p>
                <p className="font-medium uppercase">{generated.provider}</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-md border p-4">
                  <p className="text-sm text-muted-foreground">Subject</p>
                  <p className="font-medium">{generated.email.subject}</p>
                </div>
                <div className="rounded-md border p-4">
                  <p className="text-sm text-muted-foreground">Sender</p>
                  <p className="font-medium">{generated.email.senderName}</p>
                </div>
              </div>

              <div className="rounded-md border bg-white p-6 text-slate-900 shadow-sm">
                <div dangerouslySetInnerHTML={{ __html: generated.email.htmlBody }} />
              </div>

              <Button onClick={saveTemplate} disabled={isSaving} variant="secondary">
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                {isSaving ? "Saving..." : "Save Template"}
              </Button>
            </div>
          ) : (
            <div className="flex h-[420px] items-center justify-center rounded-md border border-dashed">
              <div className="max-w-sm text-center text-muted-foreground">
                <Sparkles className="mx-auto mb-3 h-8 w-8" />
                <p>Fill in the campaign prompt and click Generate Email.</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
