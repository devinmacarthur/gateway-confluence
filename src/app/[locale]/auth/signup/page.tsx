"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AuthFormFields } from "@/components/auth/auth-form";
import { OAuthButtons } from "@/components/auth/oauth-buttons";
import { Link } from "@/lib/i18n/navigation";
import { signUp } from "@/lib/auth/actions";
import { localeLabels, type Locale } from "@/lib/i18n/routing";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function SignupPage() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    // Validate passwords match
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    if (password !== confirmPassword) {
      setError(t("errors.passwordMismatch"));
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError(t("errors.weakPassword"));
      setLoading(false);
      return;
    }

    formData.set("locale", formData.get("preferredLocale") as string || locale);

    const result = await signUp(formData);
    setLoading(false);

    if (result?.error) {
      setError(result.error);
    } else {
      setSuccess(true);
    }
  }

  if (success) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <h2 className="text-xl font-semibold mb-2">{t("checkEmail")}</h2>
          <p className="text-muted-foreground">{t("confirmEmail")}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">{t("signup")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <AuthFormFields showDisplayName showConfirmPassword />

          <div className="space-y-2">
            <Label htmlFor="preferredLocale">{t("preferredLanguage")}</Label>
            <Select name="preferredLocale" defaultValue={locale}>
              <SelectTrigger className="min-h-[44px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(localeLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full min-h-[44px]"
          >
            {t("signup")}
          </Button>
        </form>

        <OAuthButtons />

        <p className="text-center text-sm text-muted-foreground">
          {t("haveAccount")}{" "}
          <Link href="/auth/login" className="text-primary hover:underline">
            {t("login")}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
