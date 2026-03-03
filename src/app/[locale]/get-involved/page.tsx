import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "@/lib/i18n/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Get Involved",
};

export default function GetInvolvedPage() {
  const t = useTranslations("getInvolved");

  const ways = [
    { key: "volunteer", icon: "V" },
    { key: "attend", icon: "A" },
    { key: "share", icon: "S" },
    { key: "spread", icon: "W" },
  ] as const;

  const workingGroups = [
    { key: "housing", color: "bg-blue-500" },
    { key: "business", color: "bg-green-500" },
    { key: "space", color: "bg-amber-500" },
    { key: "safety", color: "bg-red-500" },
    { key: "governance", color: "bg-purple-500" },
    { key: "culture", color: "bg-pink-500" },
    { key: "infrastructure", color: "bg-teal-500" },
  ] as const;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight">{t("title")}</h1>
        <p className="mt-3 text-lg text-muted-foreground">{t("subtitle")}</p>
      </div>

      {/* Ways to Get Involved */}
      <div className="mb-12 grid gap-6 sm:grid-cols-2">
        {ways.map(({ key, icon }) => (
          <Card key={key}>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                  {icon}
                </div>
                <CardTitle className="text-lg">{t(key)}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="leading-7 text-muted-foreground">
                {t(`${key}Text`)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator className="my-10" />

      {/* Working Groups */}
      <section>
        <h2 className="mb-6 text-2xl font-semibold text-center">
          {t("workingGroups")}
        </h2>
        <div className="flex flex-wrap justify-center gap-3">
          {workingGroups.map(({ key, color }) => (
            <Badge
              key={key}
              variant="outline"
              className="px-4 py-2 text-sm font-medium"
            >
              <span className={`mr-2 inline-block h-2.5 w-2.5 rounded-full ${color}`} />
              {t(key)}
            </Badge>
          ))}
        </div>
      </section>

      <Separator className="my-10" />

      {/* CTA */}
      <div className="text-center">
        <p className="mb-6 text-lg text-muted-foreground">
          {t("ctaText")}
        </p>
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button asChild size="lg" className="min-h-[44px]">
            <Link href="/contact">{t("volunteer")}</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="min-h-[44px]">
            <Link href="/events">{t("attend")}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
