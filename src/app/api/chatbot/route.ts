import { searchKnowledge } from "@/lib/chatbot/knowledge";
import { getRequestLocale } from "@/lib/i18n";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

type ChatBody = {
  message?: string;
};

type OpenAIChatResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
};

function sanitizeModelOutput(content: string): string {
  return content
    .replace(/<think>[\s\S]*?<\/think>/gi, "")
    .trim();
}

function buildContext(matches: Awaited<ReturnType<typeof searchKnowledge>>): string {
  if (matches.length === 0) {
    return "No contextual data found.";
  }

  return matches
    .map((match, index) => {
      return `Source ${index + 1} (${match.source}):\n${match.text}`;
    })
    .join("\n\n---\n\n");
}

async function generateWithG4F(
  locale: "pt" | "en",
  message: string,
  matches: Awaited<ReturnType<typeof searchKnowledge>>,
): Promise<{ answer: string; engine: "groq" | "g4f" } | null> {
  const groqApiKey = process.env.GROQ_API_KEY?.trim();
  if (groqApiKey) {
    const groqModel = process.env.GROQ_MODEL?.trim() || "qwen/qwen3-32b";
    const groqBaseUrl =
      process.env.GROQ_BASE_URL?.trim() || "https://api.groq.com/openai/v1";
    const context = buildContext(matches);

    const systemPrompt =
      locale === "pt"
        ? "Você é um assistente da plataforma 42calculator. Responda em português europeu. Use apenas o contexto fornecido e seja objetivo. Se faltar informação, diga claramente que não encontrou no contexto."
        : "You are the 42calculator assistant. Answer in English. Use only the provided context and stay concise. If information is missing, clearly say it was not found in context.";

    const groqResponse = await fetch(
      `${groqBaseUrl.replace(/\/$/, "")}/chat/completions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${groqApiKey}`,
        },
        body: JSON.stringify({
          model: groqModel,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `Question:\n${message}\n\nContext:\n${context}` },
          ],
          temperature: 0.2,
          max_completion_tokens: 4096,
          top_p: 1,
          stream: false,
          reasoning_effort: "none",
        }),
        signal: AbortSignal.timeout(20_000),
      },
    );

    if (groqResponse.ok) {
      const data = (await groqResponse.json()) as OpenAIChatResponse;
      const content = data.choices?.[0]?.message?.content?.trim();
      if (content) {
        return { answer: sanitizeModelOutput(content), engine: "groq" };
      }
    }
  }

  const baseUrl = process.env.G4F_BASE_URL?.trim();
  if (!baseUrl) {
    return null;
  }

  const model = process.env.G4F_MODEL?.trim() || "qwen/qwen3-32b";
  const apiKey = process.env.G4F_API_KEY?.trim();
  const context = buildContext(matches);

  const systemPrompt =
    locale === "pt"
      ? "Você é um assistente da plataforma 42calculator. Responda em português europeu. Use apenas o contexto fornecido e seja objetivo. Se faltar informação, diga claramente que não encontrou no contexto."
      : "You are the 42calculator assistant. Answer in English. Use only the provided context and stay concise. If information is missing, clearly say it was not found in context.";

  const response = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Question:\n${message}\n\nContext:\n${context}` },
      ],
    }),
    signal: AbortSignal.timeout(20_000),
  });

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as OpenAIChatResponse;
  const content = data.choices?.[0]?.message?.content?.trim();
  return content
    ? { answer: sanitizeModelOutput(content), engine: "g4f" }
    : null;
}

export async function POST(request: Request) {
  const session = await auth();
  if (session == null) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const locale = await getRequestLocale();

  let body: ChatBody;
  try {
    body = (await request.json()) as ChatBody;
  } catch {
    return NextResponse.json(
      { error: "Invalid body." },
      { status: 400 },
    );
  }

  const message = body.message?.trim();
  if (!message) {
    return NextResponse.json(
      { error: "Message is required." },
      { status: 400 },
    );
  }

  const matches = await searchKnowledge(message);
  let answer: string | null = null;
  let engine: "groq" | "g4f" | null = null;

  try {
    const aiAnswer = await generateWithG4F(locale, message, matches);
    if (aiAnswer) {
      answer = aiAnswer.answer;
      engine = aiAnswer.engine;
    }
  } catch {
    answer = null;
    engine = null;
  }

  if (!answer || !engine) {
    return NextResponse.json(
      {
        error:
          locale === "pt"
            ? "IA indisponível no momento. Tente novamente em instantes."
            : "AI is currently unavailable. Please try again shortly.",
      },
      { status: 503 },
    );
  }

  return NextResponse.json({
    answer,
    engine,
    sources: matches.map((item) => item.source),
  });
}
