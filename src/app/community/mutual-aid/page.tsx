import { getMutualAidPosts } from "@/lib/mutual-aid/actions";
import { AidPostCard } from "@/components/community/mutual-aid/aid-post-card";
import { AidFilters } from "@/components/community/mutual-aid/aid-filters";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function MutualAidPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; category?: string; urgency?: string; status?: string }>;
}) {
  const filters = await searchParams;

  const posts = await getMutualAidPosts(filters);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mutual Aid Board</h1>
          <p className="text-muted-foreground mt-1">Neighbors helping neighbors in Gateway</p>
        </div>
        <Button asChild className="min-h-[44px]">
          <Link href="/community/mutual-aid/new">New Post</Link>
        </Button>
      </div>

      <div className="mb-6">
        <AidFilters />
      </div>

      {posts.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">
          No posts yet. Create one to offer help or request support!
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {posts.map((post) => (
            <AidPostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
