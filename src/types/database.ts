export interface Profile {
  id: string;
  display_name: string;
  bio: string;
  neighborhood: string;
  interests: string[];
  languages: string[];
  role: "member" | "moderator" | "admin";
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ForumCategory {
  id: string;
  slug: string;
  name: Record<string, string>;
  description: Record<string, string>;
  sort_order: number;
  icon: string | null;
  created_at: string;
}

export interface ForumTopic {
  id: string;
  category_id: string;
  author_id: string;
  title: string;
  body: string;
  language: string;
  is_pinned: boolean;
  is_locked: boolean;
  reply_count: number;
  last_activity_at: string;
  created_at: string;
  updated_at: string;
  author?: Profile;
  category?: ForumCategory;
}

export interface ForumReply {
  id: string;
  topic_id: string;
  parent_id: string | null;
  author_id: string;
  body: string;
  created_at: string;
  updated_at: string;
  author?: Profile;
  children?: ForumReply[];
}

export type MutualAidType = "offer" | "request";
export type MutualAidUrgency = "low" | "normal" | "urgent";
export type MutualAidStatus = "open" | "fulfilled" | "closed";
export type MutualAidCategory =
  | "food"
  | "housing"
  | "transport"
  | "childcare"
  | "translation"
  | "other";

export interface MutualAidPost {
  id: string;
  author_id: string;
  type: MutualAidType;
  title: string;
  description: string;
  category: MutualAidCategory;
  urgency: MutualAidUrgency;
  status: MutualAidStatus;
  language: string;
  contact_method: string | null;
  response_count: number;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
  author?: Profile;
}

export interface MutualAidResponse {
  id: string;
  post_id: string;
  author_id: string;
  message: string;
  created_at: string;
  author?: Profile;
}

export type RsvpStatus = "going" | "maybe" | "not_going";

export interface EventRsvp {
  id: string;
  event_id: string;
  user_id: string;
  status: RsvpStatus;
  created_at: string;
  updated_at: string;
}
