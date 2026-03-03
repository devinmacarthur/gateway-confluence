"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { signInWithPhone, verifyPhoneOtp } from "@/lib/auth/actions";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export function PhoneAuth() {
  const t = useTranslations("auth");
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"phone" | "verify">("phone");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSendCode() {
    setError("");
    setLoading(true);
    const result = await signInWithPhone(phone);
    setLoading(false);

    if (result.error) {
      setError(result.error);
    } else {
      setStep("verify");
    }
  }

  async function handleVerify() {
    setError("");
    setLoading(true);
    const result = await verifyPhoneOtp(phone, code);
    setLoading(false);

    if (result.error) {
      setError(result.error);
    } else {
      router.push("/community");
      router.refresh();
    }
  }

  return (
    <div className="space-y-4">
      {step === "phone" ? (
        <>
          <div className="space-y-2">
            <Label htmlFor="phone">{t("phone")}</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (503) 555-0123"
              className="min-h-[44px]"
            />
            <p className="text-xs text-muted-foreground">{t("phoneHint")}</p>
          </div>
          <Button
            type="button"
            onClick={handleSendCode}
            disabled={loading || !phone}
            className="w-full min-h-[44px]"
          >
            {t("sendCode")}
          </Button>
        </>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">{t("codeSent")}</p>
          <div className="space-y-2">
            <Label htmlFor="otp">{t("verificationCode")}</Label>
            <Input
              id="otp"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="123456"
              maxLength={6}
              className="min-h-[44px]"
            />
          </div>
          <Button
            type="button"
            onClick={handleVerify}
            disabled={loading || code.length < 6}
            className="w-full min-h-[44px]"
          >
            {t("verifyCode")}
          </Button>
        </>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
