import { Badge } from "@/components/ui/badge";
import { ProfileCard } from "@/components/community/profile-card";
import { Link } from "@/lib/i18n/navigation";
import type { ForumTopic } from "@/types/database";

interface TopicRowProps {
  topic: ForumTopic;
  categorySlug: string;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function TopicRow({ topic, categorySlug }: TopicRowProps) {
  return (
    <Link
      href={`/community/forum/topic/${topic.id}`}
      className="flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {topic.is_pinned && (
            <Badge variant="secondary" className="text-[10px]">
              Pinned
            </Badge>
          )}
          {topic.is_locked && (
            <Badge variant="outline" className="text-[10px]">
              Locked
            </Badge>
          )}
          <h3 className="font-medium truncate">{topic.title}</h3>
        </div>
        <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
          {topic.author && <ProfileCard profile={topic.author} />}
          <span>{timeAgo(topic.created_at)}</span>
        </div>
      </div>
      <div className="text-right shrink-0">
        <p className="text-sm font-medium">{topic.reply_count}</p>
        <p className="text-xs text-muted-foreground">replies</p>
      </div>
    </Link>
  );
}
