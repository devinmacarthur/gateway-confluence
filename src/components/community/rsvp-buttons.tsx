"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { rsvpToEvent, removeRsvp } from "@/lib/events/actions";
import type { RsvpStatus } from "@/types/database";

interface RsvpButtonsProps {
  eventId: string;
  currentStatus: RsvpStatus | null;
  goingCount: number;
  maybeCount: number;
  isLoggedIn: boolean;
}

export function RsvpButtons({
  eventId,
  currentStatus,
  goingCount,
  maybeCount,
  isLoggedIn,
}: RsvpButtonsProps) {
  const t = useTranslations("rsvp");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<RsvpStatus | null>(currentStatus);
  const [counts, setCounts] = useState({ going: goingCount, maybe: maybeCount });

  async function handleRsvp(newStatus: RsvpStatus) {
    if (!isLoggedIn) {
      router.push("/auth/login");
      return;
    }

    setLoading(true);

    if (status === newStatus) {
      // Toggle off
      await removeRsvp(eventId);
      setCounts((prev) => ({
        ...prev,
        [newStatus]: Math.max(0, prev[newStatus as keyof typeof prev] - 1),
      }));
      setStatus(null);
    } else {
      // Decrease old status count
      if (status === "going" || status === "maybe") {
        setCounts((prev) => ({
          ...prev,
          [status]: Math.max(0, prev[status as keyof typeof prev] - 1),
        }));
      }
      await rsvpToEvent(eventId, newStatus);
      if (newStatus === "going" || newStatus === "maybe") {
        setCounts((prev) => ({
          ...prev,
          [newStatus]: prev[newStatus as keyof typeof prev] + 1,
        }));
      }
      setStatus(newStatus);
    }

    setLoading(false);
    router.refresh();
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Button
          variant={status === "going" ? "default" : "outline"}
          size="sm"
          disabled={loading}
          className="min-h-[44px]"
          onClick={() => handleRsvp("going")}
        >
          {t("going")}
        </Button>
        <Button
          variant={status === "maybe" ? "default" : "outline"}
          size="sm"
          disabled={loading}
          className="min-h-[44px]"
          onClick={() => handleRsvp("maybe")}
        >
          {t("maybe")}
        </Button>
        <Button
          variant={status === "not_going" ? "default" : "outline"}
          size="sm"
          disabled={loading}
          className="min-h-[44px]"
          onClick={() => handleRsvp("not_going")}
        >
          {t("notGoing")}
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">
        {t("attendees", { going: counts.going, maybe: counts.maybe })}
      </p>
    </div>
  );
}
