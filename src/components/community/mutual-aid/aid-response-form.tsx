"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createMutualAidResponse } from "@/lib/mutual-aid/actions";

export function AidResponseForm({ postId }: { postId: string }) {
  const t = useTranslations("mutualAid");
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.set("postId", postId);

    const result = await createMutualAidResponse(formData);
    setLoading(false);

    if (result?.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      (e.target as HTMLFormElement).reset();
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Textarea
        name="message"
        required
        placeholder={t("responsePlaceholder")}
        rows={3}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
      {success && (
        <p className="text-sm text-green-600">{t("responseSent")}</p>
      )}
      <Button type="submit" disabled={loading} size="sm" className="min-h-[44px]">
        {t("sendResponse")}
      </Button>
    </form>
  );
}
