import { NextResponse } from "next/server";
import { handleError } from "@/lib/api-error";
import { isOllamaRunning } from "@/lib/ai/client";
import { prisma } from "@/lib/db/prisma";

type ServiceStatus = {
  name: string;
  configured: boolean;
  reachable: boolean;
  message: string;
};

function hasRealValue(value: string | undefined, placeholder: string) {
  return Boolean(value && value.trim() && value !== placeholder);
}

async function checkDatabase(): Promise<ServiceStatus> {
  const configured = Boolean(process.env.DATABASE_URL);
  if (!configured) {
    return {
      name: "Supabase PostgreSQL",
      configured: false,
      reachable: false,
      message: "DATABASE_URL is missing.",
    };
  }

  try {
    await prisma.campaign.count();
    return {
      name: "Supabase PostgreSQL",
      configured: true,
      reachable: true,
      message: "Database connection is working.",
    };
  } catch {
    return {
      name: "Supabase PostgreSQL",
      configured: true,
      reachable: false,
      message: "Database URL is configured, but connection failed.",
    };
  }
}

async function checkOllama(): Promise<ServiceStatus> {
  const configured = Boolean(process.env.OLLAMA_BASE_URL);
  const reachable = await isOllamaRunning();

  return {
    name: "Ollama Local AI",
    configured,
    reachable,
    message: reachable
      ? "Ollama is running locally."
      : "Ollama is not reachable. Start Ollama or use Groq fallback.",
  };
}

function checkGroq(): ServiceStatus {
  const configured = hasRealValue(process.env.GROQ_API_KEY, "your-groq-key");

  return {
    name: "Groq API Fallback",
    configured,
    reachable: configured,
    message: configured
      ? "Groq API key is configured."
      : "GROQ_API_KEY is missing or still placeholder.",
  };
}

async function checkResend(): Promise<ServiceStatus> {
  const configured = hasRealValue(process.env.RESEND_API_KEY, "your-resend-key");
  if (!configured) {
    return {
      name: "Resend Email",
      configured: false,
      reachable: false,
      message: "RESEND_API_KEY is missing or still placeholder.",
    };
  }

  try {
    const response = await fetch("https://api.resend.com/domains", {
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}` },
      signal: AbortSignal.timeout(8_000),
    });

    return {
      name: "Resend Email",
      configured: true,
      reachable: response.ok,
      message: response.ok
        ? "Resend API key is valid. Sender domain/recipient rules still depend on your Resend account."
        : "Resend API key exists, but Resend rejected the request.",
    };
  } catch {
    return {
      name: "Resend Email",
      configured: true,
      reachable: false,
      message: "Resend API is not reachable from this environment.",
    };
  }
}

export async function GET() {
  try {
    const [database, ollama, resend] = await Promise.all([
      checkDatabase(),
      checkOllama(),
      checkResend(),
    ]);

    return NextResponse.json({
      services: [database, ollama, checkGroq(), resend],
      env: {
        appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "not set",
        supabaseUrlConfigured: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
        resendFromEmail: process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev",
      },
    });
  } catch (error) {
    return handleError(error);
  }
}
