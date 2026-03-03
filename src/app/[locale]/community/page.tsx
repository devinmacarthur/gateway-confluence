import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/lib/i18n/navigation";

export default function CommunityPage() {
  const t = useTranslations("community");

  const sections = [
    { key: "forum", href: "/community/forum", icon: "M" },
    { key: "mutualAid", href: "/community/mutual-aid", icon: "H" },
    { key: "events", href: "/events", icon: "E" },
  ] as const;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight">{t("title")}</h1>
        <p className="mt-3 text-lg text-muted-foreground">{t("subtitle")}</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        {sections.map(({ key, href, icon }) => (
          <Link key={key} href={href}>
            <Card className="h-full transition-colors hover:bg-muted/50">
              <CardHeader className="pb-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary mb-2">
                  {icon}
                </div>
                <CardTitle className="text-lg">{t(key)}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {t(`${key}Description`)}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
