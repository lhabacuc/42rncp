"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { AppLocale } from "@/lib/i18n";
import { Bot, MessageCircle, X } from "lucide-react";
import { useState } from "react";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

export default function ChatbotWidget({ locale }: { locale: AppLocale }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      text:
        locale === "pt"
          ? "Sou o assistente RNCP/42. Pergunta sobre RNCP 6, RNCP 7, projetos, especialidades e equivalências."
          : "I am the RNCP/42 assistant. Ask about RNCP 6, RNCP 7, projects, specialties, and equivalences.",
    },
  ]);

  const send = async () => {
    const content = value.trim();
    if (!content || loading) {
      return;
    }

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      text: content,
    };
    setMessages((prev) => [...prev, userMessage]);
    setValue("");
    setLoading(true);

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content }),
      });

      if (!response.ok) {
        throw new Error("chatbot request failed");
      }

      const data = (await response.json()) as { answer: string };
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          text: data.answer,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          text:
            locale === "pt"
              ? "Falha ao responder agora. Tente novamente."
              : "Failed to answer right now. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed right-4 bottom-4 z-50">
      {open ? (
        <div className="flex h-[520px] w-[350px] flex-col rounded-lg border bg-background shadow-2xl">
          <div className="flex items-center justify-between border-b px-3 py-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Bot className="size-4" />
              {locale === "pt" ? "Assistente 42" : "42 Assistant"}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
              aria-label={locale === "pt" ? "Fechar chatbot" : "Close chatbot"}
            >
              <X className="size-4" />
            </Button>
          </div>

          <ScrollArea className="flex-1 px-3 py-2">
            <div className="space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={
                    message.role === "user"
                      ? "ml-8 rounded-md bg-primary/10 px-3 py-2 text-sm"
                      : "mr-8 rounded-md bg-muted px-3 py-2 text-sm"
                  }
                >
                  <p className="whitespace-pre-wrap">{message.text}</p>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="flex gap-2 border-t p-3">
            <Input
              value={value}
              onChange={(event) => setValue(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  void send();
                }
              }}
              placeholder={
                locale === "pt"
                  ? "Pergunte sobre RNCP, projetos, 42..."
                  : "Ask about RNCP, projects, 42..."
              }
            />
            <Button
              onClick={() => void send()}
              disabled={loading}
            >
              {locale === "pt" ? "Enviar" : "Send"}
            </Button>
          </div>
        </div>
      ) : (
        <Button
          size="icon"
          className="h-12 w-12 rounded-full shadow-xl"
          onClick={() => setOpen(true)}
          aria-label={locale === "pt" ? "Abrir chatbot" : "Open chatbot"}
        >
          <MessageCircle className="size-5" />
        </Button>
      )}
    </div>
  );
}
