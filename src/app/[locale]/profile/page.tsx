import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Link } from "@/lib/i18n/navigation";
import { localeLabels, type Locale } from "@/lib/i18n/routing";

export default async function ProfilePage() {
  const t = await getTranslations("profile");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?returnTo=/profile");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    redirect("/auth/login");
  }

  const initials = profile.display_name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
        <Button asChild variant="outline" className="min-h-[44px]">
          <Link href="/profile/edit">{t("edit")}</Link>
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-lg">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">{profile.display_name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary">{t(`role.${profile.role}`)}</Badge>
                {profile.neighborhood && (
                  <span className="text-sm text-muted-foreground">
                    {profile.neighborhood}
                  </span>
                )}
              </div>
            </div>
          </div>

          {profile.bio && (
            <>
              <p className="text-muted-foreground leading-7">{profile.bio}</p>
              <Separator className="my-4" />
            </>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            {profile.languages?.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-1">{t("languages")}</p>
                <div className="flex flex-wrap gap-1">
                  {profile.languages.map((lang: string) => (
                    <Badge key={lang} variant="outline">
                      {localeLabels[lang as Locale] || lang}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {profile.interests?.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-1">{t("interests")}</p>
                <div className="flex flex-wrap gap-1">
                  {profile.interests.map((interest: string) => (
                    <Badge key={interest} variant="outline">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Separator className="my-4" />
          <p className="text-xs text-muted-foreground">
            {t("memberSince")}{" "}
            {new Date(profile.created_at).toLocaleDateString()}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
