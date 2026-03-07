"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const languageOptions = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "vi", label: "Vietnamese" },
  { value: "zh", label: "Chinese" },
  { value: "ru", label: "Russian" },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // In production, this would submit to Supabase
    // For now, just show success message
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <div className="mb-4 text-4xl">&#10003;</div>
        <h1 className="text-2xl font-bold">Thank you! Your message has been sent. We&apos;ll get back to you soon.</h1>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Contact Us</h1>
        <p className="mt-3 text-lg text-muted-foreground">We&apos;d love to hear from you</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter your name"
                  required
                  className="min-h-[44px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  className="min-h-[44px]"
                />
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="(503) 555-0123"
                  className="min-h-[44px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Preferred Language</Label>
                <Select name="language" defaultValue="en">
                  <SelectTrigger className="min-h-[44px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languageOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Your Message</Label>
              <Textarea
                id="message"
                name="message"
                placeholder="How can we help? Share your ideas, questions, or concerns..."
                rows={5}
                required
              />
            </div>

            <Button type="submit" size="lg" className="min-h-[44px]">
              Contact Us
            </Button>
          </form>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div>
                <h3 className="font-semibold">Office Hours</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Community meetings are held monthly. Check the Events page for dates and locations.
                </p>
              </div>
              <div>
                <h3 className="font-semibold">Direct Email</h3>
                <a
                  href="mailto:info@gatewayconfluence.org"
                  className="text-sm text-primary hover:underline"
                >
                  info@gatewayconfluence.org
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
