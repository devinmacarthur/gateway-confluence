"use server";

import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { RsvpStatus, EventRsvp } from "@/types/database";

export async function rsvpToEvent(eventId: string, status: RsvpStatus) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("event_rsvps")
    .upsert(
      { event_id: eventId, user_id: user.id, status },
      { onConflict: "event_id,user_id" }
    );

  if (error) return { error: error.message };
  return { success: true };
}

export async function removeRsvp(eventId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("event_rsvps")
    .delete()
    .eq("event_id", eventId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  return { success: true };
}

export async function getRsvpCounts(
  eventId: string
): Promise<{ going: number; maybe: number }> {
  if (!isSupabaseConfigured()) return { going: 0, maybe: 0 };
  const supabase = await createClient();

  const { data } = await supabase
    .from("event_rsvps")
    .select("status")
    .eq("event_id", eventId);

  const counts = { going: 0, maybe: 0 };
  (data || []).forEach((r: { status: string }) => {
    if (r.status === "going") counts.going++;
    if (r.status === "maybe") counts.maybe++;
  });
  return counts;
}

export async function getUserRsvp(
  eventId: string
): Promise<EventRsvp | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("event_rsvps")
    .select("*")
    .eq("event_id", eventId)
    .eq("user_id", user.id)
    .single();

  return (data as EventRsvp) || null;
}
