"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AuthFormFieldsProps {
  showDisplayName?: boolean;
  showConfirmPassword?: boolean;
}

export function AuthFormFields({
  showDisplayName = false,
  showConfirmPassword = false,
}: AuthFormFieldsProps) {
  return (
    <>
      {showDisplayName && (
        <div className="space-y-2">
          <Label htmlFor="displayName">Display Name</Label>
          <Input
            id="displayName"
            name="displayName"
            required
            minLength={2}
            maxLength={50}
            className="min-h-[44px]"
          />
          <p className="text-xs text-muted-foreground">This is how others will see you. Real names are not required.</p>
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          className="min-h-[44px]"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
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
          <Label htmlFor="confirmPassword">Confirm Password</Label>
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
