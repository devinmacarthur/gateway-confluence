import { useTranslations } from "next-intl";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  const t = useTranslations("common.footer");

  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <div>
            <p className="text-lg font-semibold">{t("copyright")}</p>
            <p className="text-sm text-muted-foreground">{t("tagline")}</p>
          </div>
          <Separator className="max-w-xs" />
          <p className="text-sm text-muted-foreground">{t("address")}</p>
        </div>
      </div>
    </footer>
  );
}
