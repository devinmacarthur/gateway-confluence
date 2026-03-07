import Link from "next/link";
import { getAllPlanSections } from "@/lib/mdx/get-plan-sections";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Strategic Plan",
};

const priorityIcons: Record<string, string> = {
  critical: "!!",
  high: "!",
  medium: "-",
  low: "~",
};

const statusColors = {
  draft: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  review: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  adopted:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
};

export default async function PlanPage() {
  const sections = await getAllPlanSections("en");

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Strategic Plan</h1>
        <p className="mt-3 text-lg text-muted-foreground">A community-driven roadmap for Gateway&apos;s future</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {sections.map((section) => (
          <Link key={section.slug} href={`/plan/${section.slug}`}>
            <Card className="h-full transition-colors hover:bg-muted/50">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {section.section}
                  </span>
                  <CardTitle className="text-lg">{section.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${statusColors[section.status]}`}
                  >
                    {section.status}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {priorityIcons[section.priority]} {section.priority} priority
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
