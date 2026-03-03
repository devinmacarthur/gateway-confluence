"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export async function signUp(formData: FormData) {
  const supabase = await createClient();
  const headersList = await headers();
  const origin = headersList.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const locale = (formData.get("locale") as string) || "en";

  const { error } = await supabase.auth.signUp({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: {
      data: {
        display_name: formData.get("displayName") as string,
        preferred_locale: locale,
      },
      emailRedirectTo: `${origin}/${locale}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function signIn(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });

  if (error) {
    return { error: error.message };
  }

  const returnTo = (formData.get("returnTo") as string) || "/community";
  redirect(returnTo);
}

export async function signInWithGoogle(locale: string, returnTo: string = "/community") {
  const supabase = await createClient();
  const headersList = await headers();
  const origin = headersList.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const prefix = locale === "en" ? "" : `/${locale}`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}${prefix}/auth/callback?returnTo=${encodeURIComponent(returnTo)}`,
    },
  });

  if (error || !data.url) {
    return { error: error?.message || "OAuth failed" };
  }

  redirect(data.url);
}

export async function signInWithPhone(phone: string) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({ phone });

  if (error) {
    return { error: error.message };
  }
  return { success: true };
}

export async function verifyPhoneOtp(phone: string, token: string) {
  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: "sms",
  });

  if (error) {
    return { error: error.message };
  }
  return { success: true };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function resetPassword(email: string, locale: string) {
  const supabase = await createClient();
  const headersList = await headers();
  const origin = headersList.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const prefix = locale === "en" ? "" : `/${locale}`;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}${prefix}/auth/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }
  return { success: true };
}

export async function updatePassword(newPassword: string) {
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: newPassword });

  if (error) {
    return { error: error.message };
  }
  return { success: true };
}
