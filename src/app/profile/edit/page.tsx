"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { updateProfile } from "@/lib/profile/actions";
import { createClient, isSupabaseConfiguredClient } from "@/lib/supabase/client";
import type { Profile } from "@/types/database";

const languageNames: Record<string, string> = {
  en: "English",
  es: "Español",
  vi: "Tiếng Việt",
  zh: "中文",
  ru: "Русский",
};

export default function EditProfilePage() {
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
          <CardTitle>Edit Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Profile</Label>
              <Input
                id="displayName"
                name="displayName"
                defaultValue={profile.display_name}
                required
                className="min-h-[44px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                defaultValue={profile.bio}
                placeholder="Tell the community a bit about yourself..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="neighborhood">Neighborhood</Label>
              <Input
                id="neighborhood"
                name="neighborhood"
                defaultValue={profile.neighborhood}
                placeholder="e.g. Gateway, Hazelwood, Parkrose"
                className="min-h-[44px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="interests">Interests</Label>
              <Input
                id="interests"
                name="interests"
                defaultValue={profile.interests?.join(", ")}
                placeholder="e.g. gardening, cooking, housing advocacy"
                className="min-h-[44px]"
              />
            </div>

            <div className="space-y-2">
              <Label>Languages</Label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(languageNames).map(([key, label]) => (
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
                <AlertDescription>Profile updated successfully.</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-3">
              <Button type="submit" disabled={loading} className="min-h-[44px]">
                Save Changes
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
