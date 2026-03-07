import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Get Involved",
};

const ways = [
  { key: "volunteer", title: "Volunteer", text: "Join a working group aligned with one of our seven strategic pillars. We need organizers, translators, researchers, and community connectors.", icon: "V" },
  { key: "attend", title: "Attend a Meeting", text: "Our monthly community meetings are open to everyone. Interpretation is available in Spanish, Vietnamese, Chinese, and Russian. Childcare provided.", icon: "A" },
  { key: "share", title: "Share Your Story", text: "Your experience shapes this plan. Whether you've lived in Gateway for decades or just moved in, your perspective matters.", icon: "S" },
  { key: "spread", title: "Spread the Word", text: "Tell your neighbors about Gateway Confluence. Share our website. Invite someone to a meeting. Community power grows one conversation at a time.", icon: "W" },
];

const workingGroups = [
  { key: "housing", label: "Housing Security", color: "bg-blue-500" },
  { key: "business", label: "Small Business", color: "bg-green-500" },
  { key: "space", label: "Public Space", color: "bg-amber-500" },
  { key: "safety", label: "Community Safety", color: "bg-red-500" },
  { key: "governance", label: "Governance", color: "bg-purple-500" },
  { key: "culture", label: "Cultural Visibility", color: "bg-pink-500" },
  { key: "infrastructure", label: "Shared Infrastructure", color: "bg-teal-500" },
];

export default function GetInvolvedPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Get Involved</h1>
        <p className="mt-3 text-lg text-muted-foreground">Gateway Confluence is built by the people who live here</p>
      </div>

      {/* Ways to Get Involved */}
      <div className="mb-12 grid gap-6 sm:grid-cols-2">
        {ways.map(({ key, title, text, icon }) => (
          <Card key={key}>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                  {icon}
                </div>
                <CardTitle className="text-lg">{title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="leading-7 text-muted-foreground">
                {text}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator className="my-10" />

      {/* Working Groups */}
      <section>
        <h2 className="mb-6 text-2xl font-semibold text-center">
          Working Groups
        </h2>
        <div className="flex flex-wrap justify-center gap-3">
          {workingGroups.map(({ key, label, color }) => (
            <Badge
              key={key}
              variant="outline"
              className="px-4 py-2 text-sm font-medium"
            >
              <span className={`mr-2 inline-block h-2.5 w-2.5 rounded-full ${color}`} />
              {label}
            </Badge>
          ))}
        </div>
      </section>

      <Separator className="my-10" />

      {/* CTA */}
      <div className="text-center">
        <p className="mb-6 text-lg text-muted-foreground">
          Ready to make a difference in Gateway?
        </p>
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button asChild size="lg" className="min-h-[44px]">
            <Link href="/contact">Volunteer</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="min-h-[44px]">
            <Link href="/events">Attend a Meeting</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
