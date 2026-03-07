import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "News & Updates",
};

export default function NewsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight">News &amp; Updates</h1>
        <p className="mt-3 text-lg text-muted-foreground">The latest from Gateway Confluence</p>
      </div>

      {/* Placeholder — blog posts will come from MDX files */}
      <Card className="border-dashed">
        <CardContent className="py-16 text-center">
          <p className="text-lg text-muted-foreground">Articles coming soon. Check back for updates on our community work.</p>
          <Button asChild variant="outline" className="mt-6 min-h-[44px]">
            <Link href="/plan">Read the Strategic Plan</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
