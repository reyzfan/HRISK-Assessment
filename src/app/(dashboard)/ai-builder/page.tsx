import { AiEmailBuilder } from "@/components/campaign-builder/ai-email-builder";

export default function AiBuilderPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Campaign Builder</h1>
        <p className="text-muted-foreground">
          Generate safe phishing simulation emails with AI and preview them before saving.
        </p>
      </div>
      <AiEmailBuilder />
    </div>
  );
}
