import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function CommunityPage() {
  const sections = [
    {
      title: "Discussion Forum",
      description: "Join conversations about neighborhood issues, share ideas, and connect with fellow Gateway residents.",
      href: "/community/forum",
      icon: "M",
    },
    {
      title: "Mutual Aid",
      description: "Offer help or request support. From food and housing to translation and childcare.",
      href: "/community/mutual-aid",
      icon: "H",
    },
    {
      title: "Events",
      description: "Find community gatherings, workshops, and meetings happening in Gateway.",
      href: "/events",
      icon: "E",
    },
  ] as const;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Community Hub</h1>
        <p className="mt-3 text-lg text-muted-foreground">Connect, share, and support your neighbors in Gateway</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        {sections.map(({ title, description, href, icon }) => (
          <Link key={href} href={href}>
            <Card className="h-full transition-colors hover:bg-muted/50">
              <CardHeader className="pb-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary mb-2">
                  {icon}
                </div>
                <CardTitle className="text-lg">{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
