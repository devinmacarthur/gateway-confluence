import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/i18n/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "News & Updates",
};

export default function NewsPage() {
  const t = useTranslations("news");

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight">{t("title")}</h1>
        <p className="mt-3 text-lg text-muted-foreground">{t("subtitle")}</p>
      </div>

      {/* Placeholder — blog posts will come from MDX files */}
      <Card className="border-dashed">
        <CardContent className="py-16 text-center">
          <p className="text-lg text-muted-foreground">{t("noArticles")}</p>
          <Button asChild variant="outline" className="mt-6 min-h-[44px]">
            <Link href="/plan">Read the Strategic Plan</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
