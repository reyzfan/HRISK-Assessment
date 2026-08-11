"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type CampaignTemplateOption = {
  id: string;
  name: string;
  subject: string;
  scenarioType: string;
};

export type CampaignTargetOption = {
  id: string;
  name: string;
  email: string;
  department: string;
};

export function CampaignCreateForm({
  templates,
  targets,
}: {
  templates: CampaignTemplateOption[];
  targets: CampaignTargetOption[];
}) {
  const router = useRouter();
  const [name, setName] = useState("New Security Awareness Campaign");
  const [scenario, setScenario] = useState("HR security awareness test");
  const [templateId, setTemplateId] = useState(templates[0]?.id ?? "");
  const [targetIds, setTargetIds] = useState<string[]>(targets.map((target) => target.id));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const selectedTargets = useMemo(
    () => targets.filter((target) => targetIds.includes(target.id)),
    [targets, targetIds]
  );
  const canCreateCampaign =
    name.trim().length >= 3 &&
    scenario.trim().length >= 3 &&
    Boolean(templateId) &&
    targetIds.length > 0;

  function toggleTarget(targetId: string) {
    setTargetIds((current) =>
      current.includes(targetId)
        ? current.filter((id) => id !== targetId)
        : [...current, targetId]
    );
  }

  async function createCampaign() {
    setError(null);
    setMessage(null);

    if (!canCreateCampaign) {
      setError("Lengkapi campaign name, scenario, template, dan minimal 1 target.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, scenario, templateId, targetIds }),
      });

      const data: unknown = await response.json();
      if (!response.ok) {
        const text = typeof data === "object" && data && "error" in data
          ? String(data.error)
          : "Failed to create campaign.";
        throw new Error(text);
      }

      setMessage("Campaign created with tracking tokens.");
      router.refresh();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Failed to create campaign.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Campaign</CardTitle>
        <CardDescription>
          Choose a template and targets. Tracking tokens are generated automatically.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="campaign-name">Campaign name</Label>
            <Input id="campaign-name" value={name} onChange={(event) => setName(event.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="scenario">Scenario</Label>
            <Input id="scenario" value={scenario} onChange={(event) => setScenario(event.target.value)} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="template">Template</Label>
          <select
            id="template"
            value={templateId}
            onChange={(event) => setTemplateId(event.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {templates.length === 0 && <option value="">No templates available</option>}
            {templates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name} — {template.subject}
              </option>
            ))}
          </select>
          {templates.length === 0 && (
            <p className="text-xs text-muted-foreground">Generate and save an AI template first before creating a campaign.</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <Label>Targets</Label>
            <p className="text-xs text-muted-foreground">Selected: {selectedTargets.length}</p>
          </div>
          <div className="grid max-h-64 gap-2 overflow-auto rounded-md border p-3 md:grid-cols-2">
            {targets.length === 0 ? (
              <p className="text-sm text-muted-foreground">No targets available. Add employee targets first.</p>
            ) : (
              targets.map((target) => (
                <label key={target.id} className="flex cursor-pointer items-start gap-3 rounded-md border p-3 hover:bg-muted/50">
                  <input
                    type="checkbox"
                    checked={targetIds.includes(target.id)}
                    onChange={() => toggleTarget(target.id)}
                    className="mt-1"
                  />
                  <span className="text-sm">
                    <span className="block font-medium">{target.name}</span>
                    <span className="block text-muted-foreground">{target.email}</span>
                    <span className="block text-xs text-muted-foreground">{target.department}</span>
                  </span>
                </label>
              ))
            )}
          </div>
        </div>

        {error && <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
        {message && <p className="rounded-md bg-green-500/10 p-3 text-sm text-green-600">{message}</p>}

        <Button onClick={createCampaign} disabled={loading || !canCreateCampaign}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
          {loading ? "Creating..." : "Create Campaign"}
        </Button>
      </CardContent>
    </Card>
  );
}
