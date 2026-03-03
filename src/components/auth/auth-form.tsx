"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";

interface AuthFormFieldsProps {
  showDisplayName?: boolean;
  showConfirmPassword?: boolean;
}

export function AuthFormFields({
  showDisplayName = false,
  showConfirmPassword = false,
}: AuthFormFieldsProps) {
  const t = useTranslations("auth");

  return (
    <>
      {showDisplayName && (
        <div className="space-y-2">
          <Label htmlFor="displayName">{t("displayName")}</Label>
          <Input
            id="displayName"
            name="displayName"
            required
            minLength={2}
            maxLength={50}
            className="min-h-[44px]"
          />
          <p className="text-xs text-muted-foreground">{t("displayNameHint")}</p>
        </div>
      )}
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
      {showConfirmPassword && (
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
      )}
    </>
  );
}
