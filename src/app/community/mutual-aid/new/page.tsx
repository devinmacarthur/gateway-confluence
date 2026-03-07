"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
        New Post
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Select name="type" required defaultValue="request">
            <SelectTrigger id="type" className="min-h-[44px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="request">Request</SelectItem>
              <SelectItem value="offer">Offer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            required
            placeholder="What do you need or what can you offer?"
            className="min-h-[44px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            required
            placeholder="Provide details so people can understand how to help or what you're offering..."
            rows={5}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select name="category" required defaultValue="other">
              <SelectTrigger id="category" className="min-h-[44px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="food">Food</SelectItem>
                <SelectItem value="housing">Housing</SelectItem>
                <SelectItem value="transport">Transportation</SelectItem>
                <SelectItem value="childcare">Childcare</SelectItem>
                <SelectItem value="translation">Translation</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="urgency">Urgency</Label>
            <Select name="urgency" defaultValue="normal">
              <SelectTrigger id="urgency" className="min-h-[44px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactMethod">Contact Method</Label>
          <Input
            id="contactMethod"
            name="contactMethod"
            placeholder="How should people reach you? (optional)"
            className="min-h-[44px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="language">Language</Label>
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
          Submit Post
        </Button>
      </form>
    </div>
  );
}
