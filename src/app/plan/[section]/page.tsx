import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import {
  getPlanSection,
  getAllPlanSections,
  getPlanSlugs,
} from "@/lib/mdx/get-plan-sections";
import { mdxComponents } from "@/lib/mdx/mdx-components";
import { PlanNav } from "@/components/plan/plan-nav";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ section: string }>;
}): Promise<Metadata> {
  const { section: slug } = await params;

  try {
    const section = await getPlanSection(slug, "en");
    return { title: section.title };
  } catch {
    return { title: "Not Found" };
  }
}

export default async function PlanSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section: slug } = await params;

  const slugs = await getPlanSlugs();
  if (!slugs.includes(slug)) {
    notFound();
  }

  const section = await getPlanSection(slug, "en");
  const allSections = await getAllPlanSections("en");

  const currentIndex = allSections.findIndex((s) => s.slug === slug);
  const prevSection = currentIndex > 0 ? allSections[currentIndex - 1] : null;
  const nextSection =
    currentIndex < allSections.length - 1
      ? allSections[currentIndex + 1]
      : null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="flex gap-8">
        {/* Sidebar */}
        <aside className="hidden w-72 shrink-0 lg:block">
          <div className="sticky top-20">
            <h2 className="mb-4 px-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Table of Contents
            </h2>
            <PlanNav sections={allSections} />
          </div>
        </aside>

        {/* Content */}
        <article className="min-w-0 flex-1">
          {section.fallback && (
            <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800 dark:border-yellow-800 dark:bg-yellow-950/20 dark:text-yellow-300">
              This section has not yet been translated into your language. Showing English version.
            </div>
          )}

          <div className="mb-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link
                href="/plan"
                className="hover:text-foreground transition-colors"
              >
                Strategic Plan
              </Link>
              <span>/</span>
              <span>Section {section.section}</span>
            </div>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              {section.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              {section.lastUpdated && (
                <span>
                  Last updated: {section.lastUpdated}
                </span>
              )}
              {section.authors.length > 0 && (
                <span>{section.authors.join(", ")}</span>
              )}
            </div>
          </div>

          <Separator className="mb-8" />

          <div className="prose-custom">
            <MDXRemote source={section.content} components={mdxComponents} />
          </div>

          {/* Prev/Next navigation */}
          <Separator className="my-8" />
          <div className="flex justify-between gap-4">
            {prevSection ? (
              <Button asChild variant="outline" className="min-h-[44px]">
                <Link href={`/plan/${prevSection.slug}`}>
                  &larr; {prevSection.title}
                </Link>
              </Button>
            ) : (
              <div />
            )}
            {nextSection ? (
              <Button asChild variant="outline" className="min-h-[44px]">
                <Link href={`/plan/${nextSection.slug}`}>
                  {nextSection.title} &rarr;
                </Link>
              </Button>
            ) : (
              <div />
            )}
          </div>
        </article>
      </div>
    </div>
  );
}
