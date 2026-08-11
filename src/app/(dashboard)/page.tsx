import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/db/prisma";
import { getRiskBgColor, getRiskLevel } from "@/lib/risk-score/calculate";
import { buildTrackingClickUrl, buildTrackingPixelUrl, buildTrackingReportUrl } from "@/lib/tracking/token";
import { AlertTriangle, GraduationCap, Mail, MousePointerClick, ShieldCheck, Users } from "lucide-react";

export const dynamic = "force-dynamic";

function percent(value: number, total: number) {
  if (total === 0) return "0%";
  return `${Math.round((value / total) * 100)}%`;
}

export default async function DashboardPage() {
  const [campaigns, targets, results] = await Promise.all([
    prisma.campaign.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.target.findMany({ orderBy: { riskScore: "desc" } }),
    prisma.campaignResult.findMany({
      include: { campaign: true, target: true },
      orderBy: { emailSentAt: "desc" },
    }),
  ]);

  const sent = results.filter((result) => result.emailSentAt).length;
  const opened = results.filter((result) => result.emailOpenedAt).length;
  const clicked = results.filter((result) => result.linkClickedAt).length;
  const reported = results.filter((result) => result.reportedAt).length;
  const trained = results.filter((result) => result.trainingCompletedAt).length;
  const highRisk = targets.filter((target) => target.riskScore > 60).length;

  const departmentScores = targets.reduce<Record<string, { total: number; count: number }>>((acc, target) => {
    acc[target.department] ??= { total: 0, count: 0 };
    acc[target.department].total += target.riskScore;
    acc[target.department].count += 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Real-time overview of campaign tracking, training completion, and human risk scores.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaigns.length}</div>
            <p className="text-xs text-muted-foreground">{sent} emails seeded/sent</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Targets</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{targets.length}</div>
            <p className="text-xs text-muted-foreground">Employees in scope</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Click Rate</CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{percent(clicked, sent)}</div>
            <p className="text-xs text-muted-foreground">Open rate: {percent(opened, sent)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Report Rate</CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{percent(reported, sent)}</div>
            <p className="text-xs text-muted-foreground">{reported} reports</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Risk Employees</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{highRisk}</div>
            <p className="text-xs text-muted-foreground">Training complete: {percent(trained, clicked || sent)}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Human Risk Matrix</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {targets.length === 0 ? (
              <p className="text-sm text-muted-foreground">Run seed data to see risk scores.</p>
            ) : (
              targets.map((target) => (
                <div key={target.id} className="flex items-center justify-between rounded-md border p-3">
                  <div>
                    <p className="font-medium">{target.name}</p>
                    <p className="text-xs text-muted-foreground">{target.department} · {target.position ?? "Employee"}</p>
                  </div>
                  <Badge className={getRiskBgColor(target.riskScore)} variant="outline">
                    {target.riskScore} · {getRiskLevel(target.riskScore)}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Department Risk Matrix</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(departmentScores).map(([department, score]) => {
              const average = Math.round(score.total / score.count);
              return (
                <div key={department}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span>{department}</span>
                    <span>{average}/100</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${average}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Demo Tracking Links</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {results.slice(0, 5).map((result) => (
              <div key={result.id} className="rounded-md border p-3 text-sm">
                <p className="font-medium">{result.target.name} — {result.campaign.name}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Link className="text-primary underline" href={buildTrackingPixelUrl(result.token)} target="_blank">
                    Test open pixel
                  </Link>
                  <Link className="text-primary underline" href={buildTrackingClickUrl(result.token)} target="_blank">
                    Test click → training
                  </Link>
                  <Link className="text-primary underline" href={buildTrackingReportUrl(result.token)} target="_blank">
                    Test report
                  </Link>
                  <Link className="inline-flex items-center gap-1 text-primary underline" href={`/training/${result.token}`} target="_blank">
                    <GraduationCap className="h-3 w-3" /> Open training
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
