import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export default async function ReportedPage({ params }: { params: { token: string } }) {
  const result = await prisma.campaignResult.findUnique({
    where: { token: params.token },
    include: { campaign: true },
  });

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/30 px-4 py-10">
      <div className="mx-auto max-w-xl">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-500/10 text-green-600">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <CardTitle>Email reported successfully</CardTitle>
            <CardDescription>
              {result
                ? `Thank you for reporting the simulated campaign: ${result.campaign.name}`
                : "Thank you. If this was a valid simulation link, the report has been recorded."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-center text-sm text-muted-foreground">
            <p>
              Reporting suspicious emails is the safest response. Your human risk score is updated positively for this action.
            </p>
            <Button asChild>
              <Link href="/">Back to dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
