/**
 * Dual-mode AI client — always try local Ollama first, fallback to Groq API.
 * IMPORTANT: Never send PII (employee names, emails) to any AI API.
 * Only send: scenario, urgency, department, risk scores.
 */

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL ?? "http://localhost:11434";
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL = "llama3-8b-8192";
const OLLAMA_MODEL = "llama3";

export type AiProvider = "ollama" | "groq";

interface AiResponse {
  text: string;
  provider: AiProvider;
}

/**
 * Generate text using Ollama (local) with Groq API fallback.
 * Strips any PII from the prompt before sending.
 */
export async function generateAiText(prompt: string): Promise<AiResponse> {
  // Try Ollama (local) first
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: OLLAMA_MODEL, prompt, stream: false }),
      signal: AbortSignal.timeout(30_000), // 30s timeout
    });

    if (response.ok) {
      const data = await response.json();
      return { text: data.response, provider: "ollama" };
    }
  } catch {
    console.warn("[AI] Ollama unavailable, falling back to Groq API");
  }

  // Fallback to Groq (cloud)
  if (!GROQ_API_KEY) {
    throw new Error(
      "AI service unavailable. Please start Ollama or configure GROQ_API_KEY."
    );
  }

  const groqResponse = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
      signal: AbortSignal.timeout(30_000),
    }
  );

  if (!groqResponse.ok) {
    throw new Error("AI service unavailable. Please try again later.");
  }

  const data = await groqResponse.json();
  return {
    text: data.choices[0].message.content,
    provider: "groq",
  };
}

/**
 * Check if Ollama is running locally.
 */
export async function isOllamaRunning(): Promise<boolean> {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`, {
      signal: AbortSignal.timeout(3_000),
    });
    return response.ok;
  } catch {
    return false;
  }
}
