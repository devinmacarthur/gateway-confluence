import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function HomePage() {
  const t = useTranslations("home");

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-primary/5 to-background">
        <div className="mx-auto max-w-5xl px-4 py-20 text-center sm:py-28">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            {t("hero.title")}
          </h1>
          <p className="mt-3 text-xl text-primary/80 font-medium sm:text-2xl">
            {t("hero.subtitle")}
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            {t("hero.description")}
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="min-h-[44px] text-base">
              <Link href="/plan">{t("cta.readPlan")}</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="min-h-[44px] text-base"
            >
              <Link href="/plan/executive-summary">{t("cta.getInvolved")}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Three pillars */}
      <section className="mx-auto max-w-5xl px-4 py-16">
        <div className="grid gap-6 sm:grid-cols-3">
          <Card className="border-t-4 border-t-blue-500">
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold">{t("sections.vision")}</h2>
              <p className="mt-2 text-muted-foreground leading-7">
                {t("sections.visionText")}
              </p>
            </CardContent>
          </Card>

          <Card className="border-t-4 border-t-green-500">
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold">{t("sections.plan")}</h2>
              <p className="mt-2 text-muted-foreground leading-7">
                {t("sections.planText")}
              </p>
            </CardContent>
          </Card>

          <Card className="border-t-4 border-t-amber-500">
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold">
                {t("sections.community")}
              </h2>
              <p className="mt-2 text-muted-foreground leading-7">
                {t("sections.communityText")}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
