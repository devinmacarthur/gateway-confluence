"use client";

import { Link, usePathname } from "@/lib/i18n/navigation";
import type { PlanSectionMeta } from "@/types/plan";

const statusColors = {
  draft: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  review: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  adopted: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
};

export function PlanNav({ sections }: { sections: PlanSectionMeta[] }) {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {sections.map((section) => {
        const href = `/plan/${section.slug}`;
        const isActive = pathname === href;

        return (
          <Link
            key={section.slug}
            href={href}
            className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition-colors min-h-[44px] ${
              isActive
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
              {section.section}
            </span>
            <span className="flex-1">{section.title}</span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs ${statusColors[section.status]}`}
            >
              {section.status}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
