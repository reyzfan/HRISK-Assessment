"use client";

import { useState } from "react";
import { Loader2, MailCheck, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type SendResponse = {
  dryRun: boolean;
  testMode?: boolean;
  count: number;
  emails?: Array<{ to: string; subject: string; trackingClickUrl: string; trackingReportUrl?: string }>;
  sent?: Array<{ to: string; resendId?: string }>;
};

export function CampaignSendActions({ campaignId }: { campaignId: string }) {
  const [loading, setLoading] = useState<"dry" | "test" | "send" | null>(null);
  const [testRecipient, setTestRecipient] = useState("");
  const [sendAllConfirmation, setSendAllConfirmation] = useState("");
  const [result, setResult] = useState<SendResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const sendAllConfirmed = sendAllConfirmation.trim().toUpperCase() === "SEND ALL";

  async function sendCampaign(dryRun: boolean, recipient?: string) {
    setError(null);
    setResult(null);
    setLoading(dryRun ? "dry" : recipient ? "test" : "send");

    try {
      const response = await fetch("/api/campaigns/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignId,
          dryRun,
          testRecipient: recipient ?? "",
          confirmSendAll: !dryRun && !recipient && sendAllConfirmed,
        }),
      });

      const data: unknown = await response.json();
      if (!response.ok) {
        const message = typeof data === "object" && data && "error" in data
          ? String(data.error)
          : "Failed to send campaign.";
        throw new Error(message);
      }

      setResult(data as SendResponse);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Failed to send campaign.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="space-y-3">
      <div className="grid gap-2 md:grid-cols-[1fr_auto_auto]">
        <Input
          type="email"
          placeholder="Test recipient allowed by Resend"
          value={testRecipient}
          onChange={(event) => setTestRecipient(event.target.value)}
        />
        <Button variant="secondary" onClick={() => sendCampaign(true)} disabled={loading !== null}>
          {loading === "dry" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MailCheck className="mr-2 h-4 w-4" />}
          Dry Run
        </Button>
        <Button variant="secondary" onClick={() => sendCampaign(false, testRecipient)} disabled={loading !== null || !testRecipient}>
          {loading === "test" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
          Send Test
        </Button>
      </div>

      <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3">
        <div className="grid gap-2 md:grid-cols-[1fr_auto]">
          <Input
            placeholder="Type SEND ALL to unlock real send"
            value={sendAllConfirmation}
            onChange={(event) => setSendAllConfirmation(event.target.value)}
            aria-label="Send all confirmation phrase"
          />
          <Button variant="destructive" onClick={() => sendCampaign(false)} disabled={loading !== null || !sendAllConfirmed}>
            {loading === "send" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
            Send All
          </Button>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Safety first: run Dry Run and Send Test before Send All. Real send emails every campaign target.
        </p>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {result && (
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          <p className="font-medium">
            {result.dryRun ? "Dry run ready" : result.testMode ? "Test email sent" : "Campaign sent"}: {result.count} emails
          </p>
          {result.emails && (
            <ul className="mt-2 space-y-1 text-muted-foreground">
              {result.emails.slice(0, 5).map((email) => (
                <li key={email.to}>
                  {email.to} — {email.subject}
                </li>
              ))}
            </ul>
          )}
          {result.sent && (
            <ul className="mt-2 space-y-1 text-muted-foreground">
              {result.sent.map((email) => (
                <li key={email.to}>{email.to} — Resend ID: {email.resendId ?? "created"}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
