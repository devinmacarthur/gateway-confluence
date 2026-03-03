"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { updateProfile } from "@/lib/profile/actions";
import { createClient, isSupabaseConfiguredClient } from "@/lib/supabase/client";
import { localeLabels, type Locale } from "@/lib/i18n/routing";
import type { Profile } from "@/types/database";

export default function EditProfilePage() {
  const t = useTranslations("profile");
  const locale = useLocale();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      if (!isSupabaseConfiguredClient()) {
        router.push("/auth/login");
        return;
      }
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/login");
        return;
      }
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      setProfile(data);
      setLoading(false);
    }
    loadProfile();
  }, [router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await updateProfile(formData);
    setLoading(false);

    if (result?.error) {
      setError(result.error);
    } else {
      setSuccess(true);
    }
  }

  if (loading || !profile) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle>{t("edit")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">{t("title")}</Label>
              <Input
                id="displayName"
                name="displayName"
                defaultValue={profile.display_name}
                required
                className="min-h-[44px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">{t("bio")}</Label>
              <Textarea
                id="bio"
                name="bio"
                defaultValue={profile.bio}
                placeholder={t("bioPlaceholder")}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="neighborhood">{t("neighborhood")}</Label>
              <Input
                id="neighborhood"
                name="neighborhood"
                defaultValue={profile.neighborhood}
                placeholder={t("neighborhoodPlaceholder")}
                className="min-h-[44px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="interests">{t("interests")}</Label>
              <Input
                id="interests"
                name="interests"
                defaultValue={profile.interests?.join(", ")}
                placeholder={t("interestsPlaceholder")}
                className="min-h-[44px]"
              />
            </div>

            <div className="space-y-2">
              <Label>{t("languages")}</Label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(localeLabels).map(([key, label]) => (
                  <label
                    key={key}
                    className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm cursor-pointer has-[:checked]:bg-primary/10 has-[:checked]:border-primary"
                  >
                    <input
                      type="checkbox"
                      name="languages"
                      value={key}
                      defaultChecked={profile.languages?.includes(key)}
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert>
                <AlertDescription>{t("updated")}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-3">
              <Button type="submit" disabled={loading} className="min-h-[44px]">
                {t("save")}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="min-h-[44px]"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
