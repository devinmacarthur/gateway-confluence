"use client";

import { useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";

type RealtimeCallback = (payload: {
  eventType: string;
  new: Record<string, unknown>;
  old: Record<string, unknown>;
}) => void;

export function useRealtime(
  table: string,
  filter: string | null,
  callback: RealtimeCallback
) {
  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return;

    const supabase = createBrowserClient(url, key);

    const channelName = `${table}-${filter || "all"}-${Date.now()}`;

    let channel;
    if (filter) {
      channel = supabase
        .channel(channelName)
        .on(
          "postgres_changes" as never,
          { event: "*", schema: "public", table, filter },
          callback
        )
        .subscribe();
    } else {
      channel = supabase
        .channel(channelName)
        .on(
          "postgres_changes" as never,
          { event: "*", schema: "public", table },
          callback
        )
        .subscribe();
    }

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, filter, callback]);
}
