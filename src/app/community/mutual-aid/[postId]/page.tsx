import { notFound } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { ProfileCard } from "@/components/community/profile-card";
import { AidResponseForm } from "@/components/community/mutual-aid/aid-response-form";
import { StatusToggle } from "./status-toggle";
import type { MutualAidPost, MutualAidResponse } from "@/types/database";

const urgencyColors = {
  low: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  normal: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  urgent: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
};

const statusColors = {
  open: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  fulfilled: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  closed: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
};

const urgencyLabels: Record<string, string> = {
  low: "Low",
  normal: "Normal",
  urgent: "Urgent",
};

const categoryLabels: Record<string, string> = {
  food: "Food",
  housing: "Housing",
  transport: "Transportation",
  childcare: "Childcare",
  translation: "Translation",
  other: "Other",
};

const statusLabels: Record<string, string> = {
  open: "Open",
  fulfilled: "Fulfilled",
  closed: "Closed",
};

export default async function MutualAidPostPage({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;

  if (!isSupabaseConfigured()) notFound();

  const supabase = await createClient();

  const { data: post } = await supabase
    .from("mutual_aid_posts")
    .select("*, author:profiles(*)")
    .eq("id", postId)
    .single();

  if (!post) notFound();

  const typedPost = post as unknown as MutualAidPost;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthor = user?.id === typedPost.author_id;

  // Only fetch responses if user is author or has responded
  let responses: MutualAidResponse[] = [];
  if (user) {
    const { data } = await supabase
      .from("mutual_aid_responses")
      .select("*, author:profiles(*)")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });
    responses = (data || []) as unknown as MutualAidResponse[];
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/community/mutual-aid">
            &larr; Mutual Aid Board
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-2 flex-wrap mb-3">
        <Badge variant={typedPost.type === "offer" ? "default" : "secondary"}>
          {typedPost.type === "offer" ? "Offer" : "Request"}
        </Badge>
        <span
          className={`rounded-full px-2 py-0.5 text-xs ${urgencyColors[typedPost.urgency]}`}
        >
          {urgencyLabels[typedPost.urgency] || typedPost.urgency}
        </span>
        <Badge variant="outline">{categoryLabels[typedPost.category] || typedPost.category}</Badge>
        <span
          className={`rounded-full px-2 py-0.5 text-xs ${statusColors[typedPost.status]}`}
        >
          {statusLabels[typedPost.status] || typedPost.status}
        </span>
      </div>

      <h1 className="text-3xl font-bold tracking-tight">{typedPost.title}</h1>

      <div className="mt-3 flex items-center gap-3 text-sm text-muted-foreground">
        {typedPost.author && <ProfileCard profile={typedPost.author} />}
        <span>
          {new Date(typedPost.created_at).toLocaleDateString()}
        </span>
      </div>

      <Separator className="my-6" />

      <p className="leading-7 text-foreground/90 whitespace-pre-wrap">
        {typedPost.description}
      </p>

      {typedPost.contact_method && (
        <p className="mt-4 text-sm text-muted-foreground">
          Contact: {typedPost.contact_method}
        </p>
      )}

      {isAuthor && typedPost.status === "open" && (
        <div className="mt-6">
          <StatusToggle postId={typedPost.id} />
        </div>
      )}

      <Separator className="my-8" />

      <h2 className="text-xl font-semibold mb-4">
        Responses ({responses.length})
      </h2>

      {responses.length > 0 ? (
        <div className="space-y-4">
          {responses.map((response) => (
            <Card key={response.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {response.author && (
                    <ProfileCard profile={response.author} />
                  )}
                  <span>
                    {new Date(response.created_at).toLocaleDateString()}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">
                  {response.message}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No responses yet.</p>
      )}

      {user && !isAuthor && typedPost.status === "open" && (
        <div className="mt-6">
          <AidResponseForm postId={typedPost.id} />
        </div>
      )}
    </div>
  );
}
