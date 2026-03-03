"use server";

import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { MutualAidPost } from "@/types/database";

export async function getMutualAidPosts(filters?: {
  type?: string;
  category?: string;
  urgency?: string;
  status?: string;
}): Promise<MutualAidPost[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();

  let query = supabase
    .from("mutual_aid_posts")
    .select("*, author:profiles(*)")
    .order("created_at", { ascending: false });

  if (filters?.type && filters.type !== "all") {
    query = query.eq("type", filters.type);
  }
  if (filters?.category && filters.category !== "all") {
    query = query.eq("category", filters.category);
  }
  if (filters?.urgency && filters.urgency !== "all") {
    query = query.eq("urgency", filters.urgency);
  }
  if (filters?.status) {
    query = query.eq("status", filters.status);
  } else {
    query = query.eq("status", "open");
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as MutualAidPost[];
}

export async function createMutualAidPost(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { data, error } = await supabase
    .from("mutual_aid_posts")
    .insert({
      author_id: user.id,
      type: formData.get("type") as string,
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      category: formData.get("category") as string,
      urgency: (formData.get("urgency") as string) || "normal",
      language: (formData.get("language") as string) || "en",
      contact_method: (formData.get("contactMethod") as string) || null,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };
  return { success: true, postId: data.id };
}

export async function createMutualAidResponse(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase.from("mutual_aid_responses").insert({
    post_id: formData.get("postId") as string,
    author_id: user.id,
    message: formData.get("message") as string,
  });

  if (error) return { error: error.message };
  return { success: true };
}

export async function updatePostStatus(postId: string, status: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("mutual_aid_posts")
    .update({ status })
    .eq("id", postId)
    .eq("author_id", user.id);

  if (error) return { error: error.message };
  return { success: true };
}
