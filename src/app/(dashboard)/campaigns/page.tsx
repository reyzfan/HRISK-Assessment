import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/db/prisma";
import { CampaignSendActions } from "@/components/campaign-builder/campaign-send-actions";
import { CampaignCreateForm } from "@/components/campaign-builder/campaign-create-form";
import type { Prisma } from "@prisma/client";

type CampaignWithRelations = Prisma.CampaignGetPayload<{
  include: {
    emailTemplate: true;
    campaignResults: { include: { target: true } };
  };
}>;

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function CampaignsPage() {
  const [campaigns, templates, targets] = await Promise.all([
    prisma.campaign.findMany({
      include: {
        emailTemplate: true,
        campaignResults: { include: { target: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.emailTemplate.findMany({
      where: { campaignId: null },
      orderBy: { createdAt: "desc" },
    }),
    prisma.target.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
        <p className="text-muted-foreground">
          Manage campaigns and test the send flow before sending real emails.
        </p>
      </div>

      <CampaignCreateForm templates={templates} targets={targets} />

      <section className="space-y-4" aria-label="Campaign list">
        {campaigns.length === 0 ? (
          <Card>
            <CardContent className="flex h-64 items-center justify-center">
              <p className="text-muted-foreground">No campaigns yet. Run npm run db:seed to add demo data.</p>
            </CardContent>
          </Card>
        ) : (
          campaigns.map((campaign: CampaignWithRelations) => {
            const sent = campaign.campaignResults.filter((result) => result.emailSentAt).length;
            const clicked = campaign.campaignResults.filter((result) => result.linkClickedAt).length;
            const trained = campaign.campaignResults.filter((result) => result.trainingCompletedAt).length;

            return (
              <Card key={campaign.id}>
                <CardHeader>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <CardTitle>{campaign.name}</CardTitle>
                      <CardDescription>{campaign.scenario}</CardDescription>
                    </div>
                    <Badge variant="secondary">{campaign.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid gap-3 md:grid-cols-4">
                    <div className="rounded-md border p-3">
                      <p className="text-xs text-muted-foreground">Targets</p>
                      <p className="text-xl font-bold">{campaign.campaignResults.length}</p>
                    </div>
                    <div className="rounded-md border p-3">
                      <p className="text-xs text-muted-foreground">Sent</p>
                      <p className="text-xl font-bold">{sent}</p>
                    </div>
                    <div className="rounded-md border p-3">
                      <p className="text-xs text-muted-foreground">Clicked</p>
                      <p className="text-xl font-bold">{clicked}</p>
                    </div>
                    <div className="rounded-md border p-3">
                      <p className="text-xs text-muted-foreground">Trained</p>
                      <p className="text-xl font-bold">{trained}</p>
                    </div>
                  </div>

                  {campaign.emailTemplate ? (
                    <div className="rounded-md border p-4">
                      <p className="text-sm font-medium">Template: {campaign.emailTemplate.name}</p>
                      <p className="text-sm text-muted-foreground">Subject: {campaign.emailTemplate.subject}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No email template attached.</p>
                  )}

                  <CampaignSendActions campaignId={campaign.id} />
                </CardContent>
              </Card>
            );
          })
        )}
      </section>
    </div>
  );
}
