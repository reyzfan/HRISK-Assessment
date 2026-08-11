import { NextResponse } from "next/server";
import { z } from "zod";
import { handleError } from "@/lib/api-error";
import { markCampaignSent, renderCampaignEmails } from "@/lib/email/campaign-email";

const sendCampaignSchema = z.object({
  campaignId: z.string().min(1),
  dryRun: z.boolean().default(true),
  testRecipient: z.string().email().optional().or(z.literal("")),
  confirmSendAll: z.boolean().default(false),
});

type ResendEmailResponse = {
  id?: string;
  error?: unknown;
};

async function sendWithResend(email: {
  from: string;
  targetEmail: string;
  subject: string;
  html: string;
}): Promise<ResendEmailResponse> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY is not configured.");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: email.from,
      to: email.targetEmail,
      subject: email.subject,
      html: email.html,
    }),
  });

  const data = (await response.json()) as ResendEmailResponse;
  if (!response.ok) {
    throw new Error(`Resend failed: ${JSON.stringify(data.error ?? data)}`);
  }

  return data;
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const input = sendCampaignSchema.parse(body);
    const emails = await renderCampaignEmails(input.campaignId);
    const mappedEmails = emails.map((email) => ({
      resultId: email.resultId,
      to: email.targetEmail,
      subject: email.subject,
      from: email.from,
      trackingClickUrl: email.trackingClickUrl,
      trackingReportUrl: email.trackingReportUrl,
    }));

    if (input.dryRun) {
      return NextResponse.json({
        dryRun: true,
        testMode: Boolean(input.testRecipient),
        count: emails.length,
        emails: mappedEmails,
      });
    }

    if (input.testRecipient) {
      const firstEmail = emails[0];
      if (!firstEmail) throw new Error("Campaign has no rendered emails.");

      const response = await sendWithResend({
        ...firstEmail,
        targetEmail: input.testRecipient,
      });

      return NextResponse.json({
        dryRun: false,
        testMode: true,
        count: 1,
        sent: [{ resultId: firstEmail.resultId, to: input.testRecipient, resendId: response.id }],
      });
    }

    if (!input.confirmSendAll) {
      return NextResponse.json(
        { error: "Send All requires explicit confirmation. Run Dry Run and Send Test first." },
        { status: 400 }
      );
    }

    const sent = [];
    for (const email of emails) {
      const response = await sendWithResend(email);
      sent.push({ resultId: email.resultId, to: email.targetEmail, resendId: response.id });
    }

    await markCampaignSent(input.campaignId);

    return NextResponse.json({ dryRun: false, testMode: false, count: sent.length, sent });
  } catch (error) {
    return handleError(error);
  }
}
