"use server";

import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types/database";

export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  return data;
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const updates = {
    display_name: formData.get("displayName") as string,
    bio: formData.get("bio") as string,
    neighborhood: formData.get("neighborhood") as string,
    interests: (formData.get("interests") as string)
      ?.split(",")
      .map((s) => s.trim())
      .filter(Boolean) || [],
    languages: formData.getAll("languages") as string[],
  };

  const { error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", user.id);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
