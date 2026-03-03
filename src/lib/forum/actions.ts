"use server";

import { createClient } from "@/lib/supabase/server";
import type { ForumCategory, ForumTopic, ForumReply } from "@/types/database";

export async function getForumCategories(): Promise<ForumCategory[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("forum_categories")
    .select("*")
    .order("sort_order");
  if (error) throw error;
  return data || [];
}

export async function getTopicsByCategory(
  categorySlug: string,
  cursor?: string,
  limit = 20
) {
  const supabase = await createClient();

  // Get category
  const { data: category } = await supabase
    .from("forum_categories")
    .select("*")
    .eq("slug", categorySlug)
    .single();

  if (!category) return { category: null, topics: [], nextCursor: null };

  // Get topics
  let query = supabase
    .from("forum_topics")
    .select("*, author:profiles(*)")
    .eq("category_id", category.id)
    .order("is_pinned", { ascending: false })
    .order("last_activity_at", { ascending: false })
    .limit(limit + 1);

  if (cursor) {
    query = query.lt("last_activity_at", cursor);
  }

  const { data: topics } = await query;

  const hasMore = (topics?.length || 0) > limit;
  const trimmed = topics?.slice(0, limit) || [];
  const nextCursor = hasMore
    ? trimmed[trimmed.length - 1]?.last_activity_at
    : null;

  return {
    category,
    topics: trimmed as ForumTopic[],
    nextCursor,
  };
}

export async function getTopic(topicId: string) {
  const supabase = await createClient();

  const { data: topic } = await supabase
    .from("forum_topics")
    .select("*, author:profiles(*), category:forum_categories(*)")
    .eq("id", topicId)
    .single();

  if (!topic) return { topic: null, replies: [] };

  const { data: replies } = await supabase
    .from("forum_replies")
    .select("*, author:profiles(*)")
    .eq("topic_id", topicId)
    .order("created_at", { ascending: true });

  // Build one-level threading
  const topLevel: ForumReply[] = [];
  const childMap = new Map<string, ForumReply[]>();

  for (const reply of (replies || []) as ForumReply[]) {
    if (reply.parent_id) {
      const children = childMap.get(reply.parent_id) || [];
      children.push(reply);
      childMap.set(reply.parent_id, children);
    } else {
      topLevel.push(reply);
    }
  }

  for (const reply of topLevel) {
    reply.children = childMap.get(reply.id) || [];
  }

  return { topic: topic as ForumTopic, replies: topLevel };
}

export async function createTopic(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const categorySlug = formData.get("categorySlug") as string;
  const { data: category } = await supabase
    .from("forum_categories")
    .select("id")
    .eq("slug", categorySlug)
    .single();

  if (!category) return { error: "Category not found" };

  const { data, error } = await supabase
    .from("forum_topics")
    .insert({
      category_id: category.id,
      author_id: user.id,
      title: formData.get("title") as string,
      body: formData.get("body") as string,
      language: (formData.get("language") as string) || "en",
    })
    .select("id")
    .single();

  if (error) return { error: error.message };
  return { success: true, topicId: data.id };
}

export async function createReply(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase.from("forum_replies").insert({
    topic_id: formData.get("topicId") as string,
    parent_id: (formData.get("parentId") as string) || null,
    author_id: user.id,
    body: formData.get("body") as string,
  });

  if (error) return { error: error.message };
  return { success: true };
}
