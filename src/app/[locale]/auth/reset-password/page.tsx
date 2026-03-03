"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "@/lib/i18n/navigation";
import { updatePassword } from "@/lib/auth/actions";

export default function ResetPasswordPage() {
  const t = useTranslations("auth");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
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

    const result = await updatePassword(password);
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
          <p className="text-muted-foreground">{t("passwordUpdated")}</p>
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
        <CardTitle className="text-center">{t("newPassword")}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">{t("password")}</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              className="min-h-[44px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              minLength={8}
              className="min-h-[44px]"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button
            type="submit"
            disabled={loading}
            className="w-full min-h-[44px]"
          >
            {t("resetPassword")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
