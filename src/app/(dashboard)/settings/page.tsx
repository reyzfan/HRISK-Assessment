import { SettingsStatus } from "@/components/settings/settings-status";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Configure SMTP, AI, and application settings.
        </p>
      </div>
      <SettingsStatus />
    </div>
  );
}
