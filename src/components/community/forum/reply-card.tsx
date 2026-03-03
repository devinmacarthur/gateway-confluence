"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ProfileCard } from "@/components/community/profile-card";
import { ReplyForm } from "./reply-form";
import type { ForumReply } from "@/types/database";

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

interface ReplyCardProps {
  reply: ForumReply;
  topicId: string;
  isLoggedIn: boolean;
  isLocked: boolean;
  depth?: number;
}

export function ReplyCard({
  reply,
  topicId,
  isLoggedIn,
  isLocked,
  depth = 0,
}: ReplyCardProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);

  return (
    <div className={depth > 0 ? "ml-8 border-l-2 border-muted pl-4" : ""}>
      <div className="rounded-lg border p-4">
        <div className="flex items-center justify-between mb-2">
          {reply.author && <ProfileCard profile={reply.author} showRole />}
          <span className="text-xs text-muted-foreground">
            {timeAgo(reply.created_at)}
          </span>
        </div>
        <p className="text-sm leading-7 whitespace-pre-wrap">{reply.body}</p>
        {isLoggedIn && !isLocked && depth === 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 text-xs min-h-[44px]"
            onClick={() => setShowReplyForm(!showReplyForm)}
          >
            Reply
          </Button>
        )}
        {showReplyForm && (
          <div className="mt-3">
            <ReplyForm
              topicId={topicId}
              parentId={reply.id}
              onCancel={() => setShowReplyForm(false)}
            />
          </div>
        )}
      </div>
      {reply.children?.map((child) => (
        <ReplyCard
          key={child.id}
          reply={child}
          topicId={topicId}
          isLoggedIn={isLoggedIn}
          isLocked={isLocked}
          depth={1}
        />
      ))}
    </div>
  );
}
