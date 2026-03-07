"use client";

import { Suspense, useState } from "react";
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
import Link from "next/link";
import { signUp } from "@/lib/auth/actions";
import { Alert, AlertDescription } from "@/components/ui/alert";

const languageNames: Record<string, string> = {
  en: "English",
  es: "Español",
  vi: "Tiếng Việt",
  zh: "中文",
  ru: "Русский",
};

export default function SignupPage() {
  return (
    <Suspense>
      <SignupContent />
    </Suspense>
  );
}

function SignupContent() {
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
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      setLoading(false);
      return;
    }

    formData.set("locale", formData.get("preferredLocale") as string || "en");

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
          <h2 className="text-xl font-semibold mb-2">Check Your Email</h2>
          <p className="text-muted-foreground">We sent a confirmation link to your email. Please click it to activate your account.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Sign Up</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <AuthFormFields showDisplayName showConfirmPassword />

          <div className="space-y-2">
            <Label htmlFor="preferredLocale">Preferred Language</Label>
            <Select name="preferredLocale" defaultValue="en">
              <SelectTrigger className="min-h-[44px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(languageNames).map(([key, label]) => (
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
            Sign Up
          </Button>
        </form>

        <OAuthButtons />

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-primary hover:underline">
            Log In
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
