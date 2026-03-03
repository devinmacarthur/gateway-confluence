import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { localeLabels } from "@/lib/i18n/routing";
import type { Resource } from "@/types/community";

const categoryColors: Record<string, string> = {
  housing: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  legal: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  food: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  health: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  education: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  employment: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  youth: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
  senior: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
};

export function ResourceCard({
  resource,
  locale,
  categoryLabel,
}: {
  resource: Resource;
  locale: string;
  categoryLabel: string;
}) {
  const name = resource.name[locale] || resource.name.en;
  const description = resource.description[locale] || resource.description.en;

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base leading-snug">{name}</CardTitle>
          {resource.verified && (
            <Badge variant="secondary" className="shrink-0 text-xs">
              Verified
            </Badge>
          )}
        </div>
        <Badge className={`w-fit text-xs ${categoryColors[resource.category] || ""}`}>
          {categoryLabel}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {description}
        </p>
        {resource.address && (
          <p className="text-sm">
            <span className="font-medium">Address: </span>
            {resource.address}
          </p>
        )}
        {resource.phone && (
          <p className="text-sm">
            <span className="font-medium">Phone: </span>
            <a href={`tel:${resource.phone}`} className="text-primary hover:underline">
              {resource.phone}
            </a>
          </p>
        )}
        {resource.website && (
          <a
            href={resource.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-sm text-primary hover:underline"
          >
            Visit Website
          </a>
        )}
        <div className="flex flex-wrap gap-1 pt-1">
          {resource.languages_spoken.map((lang) => (
            <Badge key={lang} variant="outline" className="text-xs">
              {localeLabels[lang as keyof typeof localeLabels] || lang}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
