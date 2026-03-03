export interface Resource {
  id: string;
  name: Record<string, string>;
  description: Record<string, string>;
  category: ResourceCategory;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  hours?: Record<string, string>;
  languages_spoken: string[];
  latitude?: number;
  longitude?: number;
  verified: boolean;
}

export type ResourceCategory =
  | "housing"
  | "legal"
  | "food"
  | "health"
  | "education"
  | "employment"
  | "youth"
  | "senior";

export interface CommunityEvent {
  id: string;
  title: Record<string, string>;
  description: Record<string, string>;
  category: string;
  location_name?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  start_time: string;
  end_time?: string;
  languages: string[];
  is_virtual: boolean;
  virtual_link?: string;
  contact_name?: string;
  contact_email?: string;
  image_url?: string;
}

export interface ContactSubmission {
  name: string;
  email?: string;
  phone?: string;
  message: string;
  preferred_language: string;
}
