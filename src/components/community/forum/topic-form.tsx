"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { localeLabels } from "@/lib/i18n/routing";
import { createTopic } from "@/lib/forum/actions";

interface TopicFormProps {
  categorySlug: string;
}

export function TopicForm({ categorySlug }: TopicFormProps) {
  const t = useTranslations("forum");
  const locale = useLocale();
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.set("categorySlug", categorySlug);

    const result = await createTopic(formData);
    setLoading(false);

    if (result?.error) {
      setError(result.error);
    } else if (result.topicId) {
      router.push(`/community/forum/topic/${result.topicId}`);
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">{t("topicTitle")}</Label>
        <Input
          id="title"
          name="title"
          required
          placeholder={t("topicTitlePlaceholder")}
          className="min-h-[44px]"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="body">{t("topicBody")}</Label>
        <Textarea
          id="body"
          name="body"
          required
          placeholder={t("topicBodyPlaceholder")}
          rows={6}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="language">{t("language")}</Label>
        <Select name="language" defaultValue={locale}>
          <SelectTrigger className="min-h-[44px] w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(localeLabels).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Button type="submit" disabled={loading} className="min-h-[44px]">
        {t("postTopic")}
      </Button>
    </form>
  );
}
