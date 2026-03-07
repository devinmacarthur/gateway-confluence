"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthFormFields } from "@/components/auth/auth-form";
import { OAuthButtons } from "@/components/auth/oauth-buttons";
import { PhoneAuth } from "@/components/auth/phone-auth";
import Link from "next/link";
import { signIn } from "@/lib/auth/actions";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") || "/community";
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.set("returnTo", returnTo);

    const result = await signIn(formData);
    setLoading(false);

    if (result?.error) {
      setError(result.error);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Log In</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="email">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="email" className="min-h-[44px]">
              Email
            </TabsTrigger>
            <TabsTrigger value="phone" className="min-h-[44px]">
              Phone
            </TabsTrigger>
          </TabsList>

          <TabsContent value="email" className="space-y-4 pt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <AuthFormFields />
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
              <Button
                type="submit"
                disabled={loading}
                className="w-full min-h-[44px]"
              >
                Log In
              </Button>
            </form>
            <div className="text-center text-sm">
              <Link
                href="/auth/forgot-password"
                className="text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          </TabsContent>

          <TabsContent value="phone" className="pt-4">
            <PhoneAuth />
          </TabsContent>
        </Tabs>

        <OAuthButtons />

        <p className="text-center text-sm text-muted-foreground">
          {"Don't have an account?"}{" "}
          <Link href="/auth/signup" className="text-primary hover:underline">
            Sign Up
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
