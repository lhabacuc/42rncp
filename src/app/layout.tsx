import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import ChatbotWidget from "@/components/chatbot/chatbot-widget";
import { auth } from "@/auth";
import { getRequestLocale } from "@/lib/i18n";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import "@/globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { VercelToolbar } from "@vercel/toolbar/next";
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import type React from "react";
import { StrictMode } from "react";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "42calculator",
  description: "A calculator for the 42 curriculum",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getRequestLocale();
  const session = await auth();
  const shouldInjectToolbar = process.env.NODE_ENV === "development";
  return (
    <html
      lang={locale}
      suppressHydrationWarning
    >
      <head>
        <link
          rel="icon"
          href="/favicon.ico"
          sizes="any"
        />
      </head>
      <body
        suppressHydrationWarning
        className={cn(
          "flex min-h-screen flex-col bg-[length:100px_100px] bg-[url('/hero-pattern.svg')] bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <StrictMode>
            <Header />
            {children}
            <Footer />
            {session != null && <ChatbotWidget locale={locale} />}
          </StrictMode>
        </ThemeProvider>

        <Analytics />
        <SpeedInsights />
        {shouldInjectToolbar && <VercelToolbar />}
      </body>
    </html>
  );
}
