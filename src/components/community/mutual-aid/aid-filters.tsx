"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function AidFilters() {
  const t = useTranslations("mutualAid");
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`?${params.toString()}`);
  }

  const currentType = searchParams.get("type") || "all";

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex gap-1">
        {["all", "offer", "request"].map((type) => (
          <Button
            key={type}
            variant={currentType === type ? "default" : "outline"}
            size="sm"
            className="min-h-[44px]"
            onClick={() => updateFilter("type", type)}
          >
            {type === "all" ? t("all") : type === "offer" ? t("offer") : t("request")}
          </Button>
        ))}
      </div>

      <Select
        defaultValue={searchParams.get("category") || "all"}
        onValueChange={(v) => updateFilter("category", v)}
      >
        <SelectTrigger className="w-40 min-h-[44px]">
          <SelectValue placeholder={t("category")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("all")}</SelectItem>
          <SelectItem value="food">{t("categories.food")}</SelectItem>
          <SelectItem value="housing">{t("categories.housing")}</SelectItem>
          <SelectItem value="transport">{t("categories.transport")}</SelectItem>
          <SelectItem value="childcare">{t("categories.childcare")}</SelectItem>
          <SelectItem value="translation">{t("categories.translation")}</SelectItem>
          <SelectItem value="other">{t("categories.other")}</SelectItem>
        </SelectContent>
      </Select>

      <Select
        defaultValue={searchParams.get("urgency") || "all"}
        onValueChange={(v) => updateFilter("urgency", v)}
      >
        <SelectTrigger className="w-36 min-h-[44px]">
          <SelectValue placeholder={t("urgency")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("all")}</SelectItem>
          <SelectItem value="low">{t("urgencyLevels.low")}</SelectItem>
          <SelectItem value="normal">{t("urgencyLevels.normal")}</SelectItem>
          <SelectItem value="urgent">{t("urgencyLevels.urgent")}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
