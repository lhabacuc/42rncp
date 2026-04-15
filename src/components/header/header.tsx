import { auth } from "@/auth";
import { getRequestLocale } from "@/lib/i18n";
import { MainNav } from "./nav/main-nav";
import { MobileNav } from "./nav/mobile-nav";
import { getNavLinks } from "./nav/links";
import ThemeToggle from "./theme-toggle";
import UserMenu from "./user-menu/user-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import GitHub from "../icons/GitHub";
import LanguageToggle from "./language-toggle";

export async function Header() {
  const session = await auth();
  const locale = await getRequestLocale();
  const navLinks = getNavLinks(locale);

  return (
    <header className="@container sticky top-0 z-50 flex w-full items-start justify-center border-border/40 border-b bg-background md:bg-background/95 md:backdrop-blur-md md:supports-backdrop-filter:bg-background/60">
      <div className="flex h-14 @max-[1400px]:w-full @min-[1400px]:w-[1400px] p-4">
        <MainNav
          session={session}
          links={navLinks}
        />
        <MobileNav
          session={session}
          links={navLinks}
          locale={locale}
        />

        <div className="ml-auto flex items-center gap-x-4">
          <Button
            asChild
            variant="secondary"
            size="sm"
            className="hidden md:flex"
          >
            <Link
              href="https://github.com/lucas-ht/42calculator"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GitHub className="mr-2 size-6" />
              {locale === "pt" ? "Dar estrela no GitHub" : "Star on GitHub"}
            </Link>
          </Button>

          <LanguageToggle locale={locale} />
          <ThemeToggle />
          <UserMenu session={session} />
        </div>
      </div>
    </header>
  );
}

export default Header;
