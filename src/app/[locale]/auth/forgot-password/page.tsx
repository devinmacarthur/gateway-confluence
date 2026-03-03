"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "@/lib/i18n/navigation";
import { resetPassword } from "@/lib/auth/actions";

export default function ForgotPasswordPage() {
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
    const email = formData.get("email") as string;

    const result = await resetPassword(email, locale);
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
          <p className="text-muted-foreground">{t("resetSent")}</p>
          <Button asChild variant="outline" className="mt-6 min-h-[44px]">
            <Link href="/auth/login">{t("login")}</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">{t("resetPassword")}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t("email")}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              className="min-h-[44px]"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button
            type="submit"
            disabled={loading}
            className="w-full min-h-[44px]"
          >
            {t("sendResetLink")}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          <Link href="/auth/login" className="text-primary hover:underline">
            {t("login")}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
