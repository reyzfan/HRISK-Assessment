import { prisma } from "@/lib/db/prisma";
import {
  buildTrackingClickUrl,
  buildTrackingReportUrl,
  generateTrackingPixelHtml,
} from "@/lib/tracking/token";

export type RenderedCampaignEmail = {
  resultId: string;
  targetName: string;
  targetEmail: string;
  subject: string;
  from: string;
  html: string;
  trackingClickUrl: string;
  trackingReportUrl: string;
};

function getFromAddress(senderName: string) {
  const fallback = "onboarding@resend.dev";
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? fallback;
  return `${senderName} <${fromEmail}>`;
}

export async function renderCampaignEmails(campaignId: string): Promise<RenderedCampaignEmail[]> {
  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId },
    include: {
      emailTemplate: true,
      campaignResults: {
        include: { target: true },
        orderBy: { emailSentAt: "desc" },
      },
    },
  });

  if (!campaign) throw new Error("Campaign not found.");
  if (!campaign.emailTemplate) throw new Error("Campaign has no email template.");

  return campaign.campaignResults.map((result) => {
    const trackingClickUrl = buildTrackingClickUrl(result.token);
    const trackingReportUrl = buildTrackingReportUrl(result.token);
    const trackingPixelHtml = generateTrackingPixelHtml(result.token);
    const reportLinkHtml = `<hr/><p style="font-size:12px;color:#64748b;">If you think this email is suspicious, report it here: <a href="${trackingReportUrl}">Report phishing simulation</a></p>`;
    const html = campaign.emailTemplate!.htmlBody
      .replaceAll("{{TRACKING_LINK}}", trackingClickUrl)
      .replaceAll("{{REPORT_LINK}}", trackingReportUrl)
      .concat(reportLinkHtml)
      .concat(trackingPixelHtml);

    return {
      resultId: result.id,
      targetName: result.target.name,
      targetEmail: result.target.email,
      subject: campaign.emailTemplate!.subject,
      from: getFromAddress(campaign.emailTemplate!.senderName),
      html,
      trackingClickUrl,
      trackingReportUrl,
    };
  });
}

export async function markCampaignSent(campaignId: string) {
  const now = new Date();

  await prisma.campaign.update({
    where: { id: campaignId },
    data: { status: "active" },
  });

  await prisma.campaignResult.updateMany({
    where: { campaignId, emailSentAt: null },
    data: { emailSentAt: now },
  });
}
