# Tech Stack & Tools

- **Frontend:** Next.js 14 (App Router) with React 18+ and TypeScript
- **Backend:** Next.js API Routes + Server Actions (Node.js runtime)
- **Database:** PostgreSQL via Supabase (Free Tier: 500MB, 50K auth users) with Prisma ORM
- **Styling:** Tailwind CSS + Shadcn UI + Lucide Icons
- **Authentication:** Supabase Auth (email/password for admin accounts)
- **AI Engine:** Ollama (Local — Llama 3 8B, runs at `http://localhost:11434`) with Groq API as cloud fallback
- **Email Delivery:** Resend SMTP (Free Tier: 3,000 emails/month)
- **Charts:** Recharts (for dashboard visualizations)
- **Validation:** Zod (runtime schema validation)
- **Deployment:** Vercel (Free Tier: 100GB bandwidth/month)

## Environment Variables
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# AI
OLLAMA_BASE_URL=http://localhost:11434
GROQ_API_KEY=your-groq-key

# Email
RESEND_API_KEY=your-resend-key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Error Handling Pattern
```typescript
// Canonical error handling for API routes
import { NextResponse } from "next/server";
import { ZodError } from "zod";

type ApiError = {
  error: string;
  details?: unknown;
};

export function handleError(error: unknown): NextResponse<ApiError> {
  if (error instanceof ZodError) {
    return NextResponse.json(
      { error: "Validation failed", details: error.flatten() },
      { status: 400 }
    );
  }

  if (error instanceof Error) {
    // Log developer context server-side, return user-safe message
    console.error("[API Error]", error.message);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { error: "Unexpected error" },
    { status: 500 }
  );
}
```

## AI Client Pattern (Ollama + Groq Fallback)
```typescript
// Dual-mode AI client — always try local Ollama first
async function generatePhishingEmail(prompt: string): Promise<string> {
  try {
    // Try Ollama (local) first
    const response = await fetch(`${process.env.OLLAMA_BASE_URL}/api/generate`, {
      method: "POST",
      body: JSON.stringify({ model: "llama3", prompt, stream: false }),
    });
    if (response.ok) return (await response.json()).response;
  } catch {
    console.warn("Ollama unavailable, falling back to Groq API");
  }

  // Fallback to Groq (cloud) — strip PII before sending
  const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama3-8b-8192",
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!groqResponse.ok) throw new Error("AI service unavailable");
  return (await groqResponse.json()).choices[0].message.content;
}
```

## Styling & Component Examples
```tsx
// Example: Shadcn UI card component with Tailwind CSS
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function RiskScoreCard({ score, name }: { score: number; name: string }) {
  const colorClass =
    score <= 30 ? "text-green-500" : score <= 60 ? "text-yellow-500" : "text-red-500";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${colorClass}`}>{score}</div>
        <p className="text-xs text-muted-foreground">Human Risk Score</p>
      </CardContent>
    </Card>
  );
}
```
