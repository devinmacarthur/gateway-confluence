"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { updatePostStatus } from "@/lib/mutual-aid/actions";

export function StatusToggle({ postId }: { postId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleStatusChange(status: string) {
    setLoading(true);
    await updatePostStatus(postId, status);
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        disabled={loading}
        className="min-h-[44px]"
        onClick={() => handleStatusChange("fulfilled")}
      >
        Mark as Fulfilled
      </Button>
      <Button
        variant="ghost"
        size="sm"
        disabled={loading}
        className="min-h-[44px]"
        onClick={() => handleStatusChange("closed")}
      >
        Close Post
      </Button>
    </div>
  );
}
