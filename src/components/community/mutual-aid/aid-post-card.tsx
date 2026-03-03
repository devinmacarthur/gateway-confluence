import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ProfileCard } from "@/components/community/profile-card";
import { Link } from "@/lib/i18n/navigation";
import type { MutualAidPost } from "@/types/database";

const urgencyColors = {
  low: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  normal: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  urgent: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function AidPostCard({ post }: { post: MutualAidPost }) {
  return (
    <Link href={`/community/mutual-aid/${post.id}`}>
      <Card className="h-full transition-colors hover:bg-muted/50">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={post.type === "offer" ? "default" : "secondary"}>
              {post.type === "offer" ? "Offer" : "Request"}
            </Badge>
            <span
              className={`rounded-full px-2 py-0.5 text-xs ${urgencyColors[post.urgency]}`}
            >
              {post.urgency}
            </span>
            <Badge variant="outline" className="text-xs">
              {post.category}
            </Badge>
          </div>
          <h3 className="font-semibold mt-1">{post.title}</h3>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {post.description}
          </p>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            {post.author && <ProfileCard profile={post.author} />}
            <div className="flex items-center gap-3">
              <span>{post.response_count} responses</span>
              <span>{timeAgo(post.created_at)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
