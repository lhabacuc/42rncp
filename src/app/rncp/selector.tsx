import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { AppLocale } from "@/lib/i18n";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { FortyTwoTitle } from "@/types/forty-two";
import { translateRncpTitle } from "./translations";

interface MainSelectorProps {
  locale: AppLocale;
  titles: FortyTwoTitle[];
  activeTitle: FortyTwoTitle;
  setActiveTitle: (title: FortyTwoTitle) => void;
}

function MainSelector({
  locale,
  titles,
  activeTitle,
  setActiveTitle,
}: MainSelectorProps) {
  return (
    <div className="hidden w-full grid-cols-4 gap-4 lg:grid">
      {titles.map((title) => {
        const translatedTitle = translateRncpTitle(title.title, locale);
        const isActive = activeTitle.title === title.title;
        return (
        <Button
          key={title.title}
          value={title.title}
          variant={isActive ? "default" : "secondary"}
          className="relative flex h-[104px] items-center justify-between gap-3 overflow-hidden px-4 py-3 text-left transition-transform hover:-translate-y-0.5"
          data-state={isActive ? "active" : "inactive"}
          onClick={() => setActiveTitle(title)}
          aria-label={`${
            locale === "pt" ? "Selecionar título" : "Select title"
          } ${translatedTitle}`}
        >
          <h2 className="line-clamp-2 max-h-[44px] flex-1 text-left text-balance">
            {translatedTitle}
          </h2>
          <Badge
            variant={
              isActive ? "secondary" : "default"
            }
            className="absolute top-0 left-0 rounded-none rounded-tl-md rounded-br-md"
          >
            {title.type === "rncp-6" ? "RNCP 6" : "RNCP 7"}
          </Badge>
        </Button>
        );
      })}
    </div>
  );
}

interface MobileSelectorProps {
  locale: AppLocale;
  titles: FortyTwoTitle[];
  setActiveTitle: (title: FortyTwoTitle) => void;
}

function MobileSelector({ locale, titles, setActiveTitle }: MobileSelectorProps) {
  return (
    <div className="lg:hidden">
      <Select
        defaultValue={"0"}
        onValueChange={(index) =>
          setActiveTitle(titles[Number.parseInt(index)])
        }
      >
        <SelectTrigger
          aria-label={locale === "pt" ? "Selecionar um título" : "Select a title"}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>RNCP 6</SelectLabel>
            {titles.map((title, index) => {
              if (title.type !== "rncp-6") {
                return null;
              }

              return (
                <SelectItem
                  key={title.title}
                  value={index.toString()}
                >
                  <h2>{translateRncpTitle(title.title, locale)}</h2>
                </SelectItem>
              );
            })}
          </SelectGroup>

          <SelectGroup>
            <SelectLabel>RNCP 7</SelectLabel>
            {titles.map((title, index) => {
              if (title.type !== "rncp-7") {
                return null;
              }

              return (
                <SelectItem
                  key={title.title}
                  value={index.toString()}
                >
                  {translateRncpTitle(title.title, locale)}
                </SelectItem>
              );
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

export interface TitleSelectorProps {
  locale: AppLocale;
  titles: FortyTwoTitle[];
  activeTitle: FortyTwoTitle;
  setActiveTitle: (title: FortyTwoTitle) => void;
}

export function TitleSelector({
  locale,
  titles,
  activeTitle,
  setActiveTitle,
}: TitleSelectorProps) {
  return (
    <>
      <MainSelector
        locale={locale}
        titles={titles}
        activeTitle={activeTitle}
        setActiveTitle={setActiveTitle}
      />
      <MobileSelector
        locale={locale}
        titles={titles}
        setActiveTitle={setActiveTitle}
      />
    </>
  );
}
