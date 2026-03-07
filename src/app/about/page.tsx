import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
};

const values = [
  {
    key: "antiDisplacement",
    title: "Anti-Displacement",
    text: "Development must not displace existing residents or businesses. Every project strengthens the community that already exists.",
    color: "border-t-blue-500",
  },
  {
    key: "culturalPlurality",
    title: "Cultural Plurality",
    text: "Gateway's multilingual, multicultural character is our greatest strength. We amplify it, not manage it.",
    color: "border-t-green-500",
  },
  {
    key: "communityGovernance",
    title: "Community Governance",
    text: "Residents make decisions about their own neighborhood. Not advisory. Real power.",
    color: "border-t-amber-500",
  },
  {
    key: "infrastructureDignity",
    title: "Infrastructure as Dignity",
    text: "Childcare, food access, cooling centers, and workforce training are rights, not amenities.",
    color: "border-t-red-500",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight">About Gateway Confluence</h1>
        <p className="mt-3 text-lg text-muted-foreground">Building community power in East Portland&apos;s Gateway district</p>
      </div>

      {/* Mission */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold">Our Mission</h2>
        <p className="text-lg leading-8 text-foreground/90">
          Gateway Confluence is a community-driven initiative to build a transit-centered, culturally plural, economically stable East Portland — where longtime residents can remain, small businesses can thrive without displacement, public space fosters belonging, and infrastructure serves daily life rather than speculative growth.
        </p>
      </section>

      <Separator className="my-10" />

      {/* Values */}
      <section>
        <h2 className="mb-6 text-2xl font-semibold">Our Values</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {values.map(({ key, title, text, color }) => (
            <Card key={key} className={`border-t-4 ${color}`}>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="mt-2 leading-7 text-muted-foreground">
                  {text}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
