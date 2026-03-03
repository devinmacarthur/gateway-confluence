import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  const t = useTranslations("about");

  const values = [
    { key: "antiDisplacement", color: "border-t-blue-500" },
    { key: "culturalPlurality", color: "border-t-green-500" },
    { key: "communityGovernance", color: "border-t-amber-500" },
    { key: "infrastructureDignity", color: "border-t-red-500" },
  ] as const;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight">{t("title")}</h1>
        <p className="mt-3 text-lg text-muted-foreground">{t("subtitle")}</p>
      </div>

      {/* Mission */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold">{t("mission")}</h2>
        <p className="text-lg leading-8 text-foreground/90">
          {t("missionText")}
        </p>
      </section>

      <Separator className="my-10" />

      {/* Values */}
      <section>
        <h2 className="mb-6 text-2xl font-semibold">{t("values")}</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {values.map(({ key, color }) => (
            <Card key={key} className={`border-t-4 ${color}`}>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold">{t(key)}</h3>
                <p className="mt-2 leading-7 text-muted-foreground">
                  {t(`${key}Text`)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
