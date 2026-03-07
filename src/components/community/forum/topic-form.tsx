"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { createTopic } from "@/lib/forum/actions";

interface TopicFormProps {
  categorySlug: string;
}

export function TopicForm({ categorySlug }: TopicFormProps) {
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
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          required
          placeholder="What would you like to discuss?"
          className="min-h-[44px]"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="body">Body</Label>
        <Textarea
          id="body"
          name="body"
          required
          placeholder="Share your thoughts, questions, or ideas..."
          rows={6}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="language">Language</Label>
        <Select name="language" defaultValue="en">
          <SelectTrigger className="min-h-[44px] w-48">
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
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Button type="submit" disabled={loading} className="min-h-[44px]">
        Post Topic
      </Button>
    </form>
  );
}
