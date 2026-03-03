"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createMutualAidPost } from "@/lib/mutual-aid/actions";

export default function NewMutualAidPage() {
  const t = useTranslations("mutualAid");
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await createMutualAidPost(formData);
    setLoading(false);

    if (result?.error) {
      setError(result.error);
    } else if (result?.postId) {
      router.push(`/community/mutual-aid/${result.postId}`);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight mb-8">
        {t("newPost")}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="type">{t("type")}</Label>
          <Select name="type" required defaultValue="request">
            <SelectTrigger id="type" className="min-h-[44px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="request">{t("request")}</SelectItem>
              <SelectItem value="offer">{t("offer")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">{t("postTitle")}</Label>
          <Input
            id="title"
            name="title"
            required
            placeholder={t("titlePlaceholder")}
            className="min-h-[44px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">{t("description")}</Label>
          <Textarea
            id="description"
            name="description"
            required
            placeholder={t("descriptionPlaceholder")}
            rows={5}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="category">{t("category")}</Label>
            <Select name="category" required defaultValue="other">
              <SelectTrigger id="category" className="min-h-[44px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="food">{t("categories.food")}</SelectItem>
                <SelectItem value="housing">{t("categories.housing")}</SelectItem>
                <SelectItem value="transport">{t("categories.transport")}</SelectItem>
                <SelectItem value="childcare">{t("categories.childcare")}</SelectItem>
                <SelectItem value="translation">{t("categories.translation")}</SelectItem>
                <SelectItem value="other">{t("categories.other")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="urgency">{t("urgency")}</Label>
            <Select name="urgency" defaultValue="normal">
              <SelectTrigger id="urgency" className="min-h-[44px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">{t("urgencyLevels.low")}</SelectItem>
                <SelectItem value="normal">{t("urgencyLevels.normal")}</SelectItem>
                <SelectItem value="urgent">{t("urgencyLevels.urgent")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactMethod">{t("contactMethod")}</Label>
          <Input
            id="contactMethod"
            name="contactMethod"
            placeholder={t("contactPlaceholder")}
            className="min-h-[44px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="language">{t("language")}</Label>
          <Select name="language" defaultValue="en">
            <SelectTrigger id="language" className="min-h-[44px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Español</SelectItem>
              <SelectItem value="vi">Tiếng Việt</SelectItem>
              <SelectItem value="zh">中文</SelectItem>
              <SelectItem value="ru">Русский</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" disabled={loading} className="min-h-[44px]">
          {t("submitPost")}
        </Button>
      </form>
    </div>
  );
}
