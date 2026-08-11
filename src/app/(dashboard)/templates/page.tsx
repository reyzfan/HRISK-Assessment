import { Bot, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export default async function TemplatesPage() {
  const templates = await prisma.emailTemplate.findMany({
    include: { campaign: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Email Templates</h1>
        <p className="text-muted-foreground">
          Browse AI-generated and manual phishing simulation templates.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {templates.length === 0 ? (
          <Card>
            <CardContent className="flex h-64 items-center justify-center">
              <p className="text-muted-foreground">No templates yet. Generate one in AI Builder.</p>
            </CardContent>
          </Card>
        ) : (
          templates.map((template) => (
            <Card key={template.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {template.isAiGenerated ? <Bot className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                      {template.name}
                    </CardTitle>
                    <CardDescription>{template.subject}</CardDescription>
                  </div>
                  <Badge variant="secondary">{template.scenarioType}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 text-sm md:grid-cols-2">
                  <div className="rounded-md border p-3">
                    <p className="text-xs text-muted-foreground">Sender</p>
                    <p className="font-medium">{template.senderName}</p>
                  </div>
                  <div className="rounded-md border p-3">
                    <p className="text-xs text-muted-foreground">Attached Campaign</p>
                    <p className="font-medium">{template.campaign?.name ?? "Not attached"}</p>
                  </div>
                </div>
                <div className="max-h-64 overflow-auto rounded-md border bg-white p-4 text-sm text-slate-900">
                  <div dangerouslySetInnerHTML={{ __html: template.htmlBody }} />
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
