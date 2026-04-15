import { isDevelopment, signIn } from "@/auth";
import FortyTwo from "@/components/icons/FortyTwo";
import { Button } from "@/components/ui/button";
import { getRequestLocale } from "@/lib/i18n";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DraftingCompass } from "lucide-react";

export async function SignIn() {
  const locale = await getRequestLocale();

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>{locale === "pt" ? "Bem-vindo" : "Welcome"}</CardTitle>
        <CardDescription>
          {locale === "pt"
            ? "Aceda à calculadora com a sua conta da 42."
            : "Access the calculator with your 42 account."}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center space-y-4">
        <form
          action={async () => {
            "use server";
            await signIn("42", { redirectTo: "/calculator" });
          }}
          className="w-full"
        >
          <Button
            variant="secondary"
            className="w-full"
          >
            <FortyTwo className="mr-4 h-6" />
            {locale === "pt" ? "Entrar com 42" : "Sign in with 42"}
          </Button>
        </form>

        {isDevelopment && (
          <form
            action={async () => {
              "use server";
              await signIn("credentials", { redirectTo: "/calculator" });
            }}
            className="w-full"
          >
            <Button
              variant="secondary"
              className="w-full"
            >
              <DraftingCompass className="mr-2 h-6" />
              {locale === "pt" ? "Entrar como desenvolvedor" : "Developer sign in"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

export default SignIn;
