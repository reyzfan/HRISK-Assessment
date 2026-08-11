"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, RefreshCw, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type ServiceStatus = {
  name: string;
  configured: boolean;
  reachable: boolean;
  message: string;
};

type SettingsStatusResponse = {
  services: ServiceStatus[];
  env: {
    appUrl: string;
    supabaseUrlConfigured: boolean;
    resendFromEmail: string;
  };
};

export function SettingsStatus() {
  const [status, setStatus] = useState<SettingsStatusResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadStatus() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/settings/status", { cache: "no-store" });
      const data: unknown = await response.json();

      if (!response.ok) {
        const message = typeof data === "object" && data && "error" in data
          ? String(data.error)
          : "Failed to load settings status.";
        throw new Error(message);
      }

      setStatus(data as SettingsStatusResponse);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Failed to load settings status.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadStatus();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Service Health</h2>
          <p className="text-sm text-muted-foreground">
            Check database, AI, and email configuration without exposing secrets.
          </p>
        </div>
        <Button variant="secondary" onClick={loadStatus} disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
          Refresh
        </Button>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="grid gap-4 md:grid-cols-2">
        {status?.services.map((service) => (
          <Card key={service.name}>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle className="text-base">{service.name}</CardTitle>
                  <CardDescription>{service.message}</CardDescription>
                </div>
                {service.reachable ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-yellow-600" />
                )}
              </div>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Badge variant={service.configured ? "secondary" : "destructive"}>
                {service.configured ? "Configured" : "Missing config"}
              </Badge>
              <Badge variant={service.reachable ? "secondary" : "outline"}>
                {service.reachable ? "Reachable" : "Not reachable"}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {status && (
        <Card>
          <CardHeader>
            <CardTitle>Environment Summary</CardTitle>
            <CardDescription>Safe values only. Secrets are never displayed.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><strong>App URL:</strong> {status.env.appUrl}</p>
            <p><strong>Supabase URL:</strong> {status.env.supabaseUrlConfigured ? "configured" : "missing"}</p>
            <p><strong>Resend From:</strong> {status.env.resendFromEmail}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
