import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import type { ForumCategory } from "@/types/database";

interface CategoryCardProps {
  category: ForumCategory;
  topicCount?: number;
}

export function CategoryCard({ category, topicCount }: CategoryCardProps) {
  const name = category.name.en;
  const description = category.description.en;

  return (
    <Link href={`/community/forum/${category.slug}`}>
      <Card className="h-full transition-colors hover:bg-muted/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
          {topicCount !== undefined && (
            <p className="mt-2 text-xs text-muted-foreground">
              {topicCount} topics
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
