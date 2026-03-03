"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createReply } from "@/lib/forum/actions";

interface ReplyFormProps {
  topicId: string;
  parentId?: string;
  onCancel?: () => void;
}

export function ReplyForm({ topicId, parentId, onCancel }: ReplyFormProps) {
  const t = useTranslations("forum");
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.set("topicId", topicId);
    if (parentId) formData.set("parentId", parentId);

    const result = await createReply(formData);
    setLoading(false);

    if (result?.error) {
      setError(result.error);
    } else {
      (e.target as HTMLFormElement).reset();
      onCancel?.();
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Textarea
        name="body"
        required
        placeholder={t("replyPlaceholder")}
        rows={3}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex gap-2">
        <Button type="submit" disabled={loading} size="sm" className="min-h-[44px]">
          {t("postReply")}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="min-h-[44px]"
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
