import { Button } from "@/components/ui/button";
import { getRequestLocale } from "@/lib/i18n";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default async function AuthErrorPage() {
  const locale = await getRequestLocale();

  return (
    <main className="container flex grow items-start justify-center p-4 md:p-12 lg:p-24">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle tag="h1">
            {locale === "pt" ? "Algo deu errado" : "Something went wrong"}
          </CardTitle>
          <CardDescription>
            {locale === "pt"
              ? "Houve um problema ao tentar autenticar."
              : "There was a problem when trying to authenticate."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <Button
            variant="secondary"
            asChild
          >
            <Link href="/">{locale === "pt" ? "Voltar ao início" : "Go back home"}</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
