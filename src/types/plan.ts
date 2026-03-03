export interface PlanSection {
  slug: string;
  title: string;
  section: number;
  status: "draft" | "review" | "adopted";
  lastUpdated: string;
  authors: string[];
  priority: "critical" | "high" | "medium" | "low";
  relatedSections: string[];
  content: string;
  fallback: boolean;
  locale: string;
}

export interface PlanSectionMeta {
  slug: string;
  title: string;
  section: number;
  status: "draft" | "review" | "adopted";
  priority: "critical" | "high" | "medium" | "low";
}
