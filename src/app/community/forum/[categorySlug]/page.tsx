import { notFound } from "next/navigation";
import { getTopicsByCategory } from "@/lib/forum/actions";
import { TopicRow } from "@/components/community/forum/topic-row";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function CategoryTopicsPage({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}) {
  const { categorySlug } = await params;

  const { category, topics } = await getTopicsByCategory(categorySlug);

  if (!category) notFound();

  const categoryName = category.name.en;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="text-sm text-muted-foreground mb-1">
            <Link
              href="/community/forum"
              className="hover:text-foreground transition-colors"
            >
              Discussion Forum
            </Link>
            {" / "}
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{categoryName}</h1>
        </div>
        <Button asChild className="min-h-[44px]">
          <Link href={`/community/forum/${categorySlug}/new`}>
            New Topic
          </Link>
        </Button>
      </div>

      {topics.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">
          No topics yet. Be the first to start a conversation!
        </p>
      ) : (
        <div className="space-y-2">
          {topics.map((topic) => (
            <TopicRow
              key={topic.id}
              topic={topic}
              categorySlug={categorySlug}
            />
          ))}
        </div>
      )}
    </div>
  );
}
