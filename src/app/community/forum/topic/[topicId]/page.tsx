import { notFound } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { getTopic } from "@/lib/forum/actions";
import { ProfileCard } from "@/components/community/profile-card";
import { ReplyCard } from "@/components/community/forum/reply-card";
import { ReplyForm } from "@/components/community/forum/reply-form";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default async function TopicDetailPage({
  params,
}: {
  params: Promise<{ topicId: string }>;
}) {
  const { topicId } = await params;

  const { topic, replies } = await getTopic(topicId);
  if (!topic) notFound();

  let isLoggedIn = false;
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    isLoggedIn = !!data.user;
  }

  const categoryName =
    topic.category?.name?.en || "";

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="text-sm text-muted-foreground mb-4">
        <Link
          href="/community/forum"
          className="hover:text-foreground transition-colors"
        >
          Discussion Forum
        </Link>
        {categoryName && (
          <>
            {" / "}
            <Link
              href={`/community/forum/${topic.category?.slug}`}
              className="hover:text-foreground transition-colors"
            >
              {categoryName}
            </Link>
          </>
        )}
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          {topic.is_pinned && <Badge variant="secondary">Pinned</Badge>}
          {topic.is_locked && <Badge variant="outline">Locked</Badge>}
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{topic.title}</h1>
        <div className="mt-3 flex items-center gap-3 text-sm text-muted-foreground">
          {topic.author && <ProfileCard profile={topic.author} showRole />}
          <span>{timeAgo(topic.created_at)}</span>
        </div>
      </div>

      <div className="rounded-lg border p-6 mb-8">
        <p className="leading-7 whitespace-pre-wrap">{topic.body}</p>
      </div>

      <Separator className="my-8" />

      <h2 className="text-xl font-semibold mb-6">
        {`${topic.reply_count} replies`}
      </h2>

      {replies.length === 0 ? (
        <p className="py-8 text-center text-muted-foreground">
          No replies yet. Be the first to respond!
        </p>
      ) : (
        <div className="space-y-4">
          {replies.map((reply) => (
            <ReplyCard
              key={reply.id}
              reply={reply}
              topicId={topicId}
              isLoggedIn={isLoggedIn}
              isLocked={topic.is_locked}
            />
          ))}
        </div>
      )}

      <Separator className="my-8" />

      {isLoggedIn && !topic.is_locked ? (
        <ReplyForm topicId={topicId} />
      ) : !isLoggedIn ? (
        <p className="text-center text-muted-foreground">
          <Link
            href="/auth/login"
            className="text-primary hover:underline"
          >
            Log in to join the conversation
          </Link>
        </p>
      ) : null}
    </div>
  );
}
