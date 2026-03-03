"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ResourceCard } from "@/components/community/resource-card";
import { sampleResources, resourceCategories } from "@/lib/sample-data";

export default function ResourcesPage() {
  const t = useTranslations("resources");
  const locale = useLocale();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");

  const filtered = sampleResources.filter((r) => {
    const name = (r.name[locale] || r.name.en || "").toLowerCase();
    const desc = (r.description[locale] || r.description.en || "").toLowerCase();
    const matchesSearch =
      !search || name.includes(search.toLowerCase()) || desc.includes(search.toLowerCase());
    const matchesCategory = category === "all" || r.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">{t("title")}</h1>
        <p className="mt-3 text-lg text-muted-foreground">{t("subtitle")}</p>
      </div>

      {/* Search and Filter */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row">
        <Input
          placeholder={t("searchPlaceholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="min-h-[44px] sm:max-w-sm"
        />
        <div className="flex flex-wrap gap-2">
          <Button
            variant={category === "all" ? "default" : "outline"}
            size="sm"
            className="min-h-[44px]"
            onClick={() => setCategory("all")}
          >
            {t("allCategories")}
          </Button>
          {resourceCategories.map((cat) => (
            <Button
              key={cat}
              variant={category === cat ? "default" : "outline"}
              size="sm"
              className="min-h-[44px]"
              onClick={() => setCategory(cat)}
            >
              {t(`categories.${cat}`)}
            </Button>
          ))}
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">
          {t("noResults")}
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((resource) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              locale={locale}
              categoryLabel={t(`categories.${resource.category}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
