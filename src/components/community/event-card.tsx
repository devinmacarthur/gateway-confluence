import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import type { CommunityEvent } from "@/types/community";

const languageLabels: Record<string, string> = {
  en: "English",
  es: "Spanish",
  vi: "Vietnamese",
  zh: "Chinese",
  ru: "Russian",
};

function formatEventDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function EventCard({
  event,
}: {
  event: CommunityEvent;
}) {
  const title = event.title.en;
  const description = event.description.en;

  return (
    <Link href={`/events/${event.id}`}>
      <Card className="h-full transition-colors hover:bg-muted/50">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <time dateTime={event.start_time}>
              {formatEventDate(event.start_time)}
            </time>
            {event.is_virtual && (
              <Badge variant="secondary" className="text-xs">
                Virtual
              </Badge>
            )}
          </div>
          <CardTitle className="text-base leading-snug">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {description}
          </p>
          {event.location_name && (
            <p className="mt-2 text-sm font-medium">{event.location_name}</p>
          )}
          <div className="mt-3 flex flex-wrap gap-1">
            {event.languages.map((lang) => (
              <Badge key={lang} variant="outline" className="text-xs">
                {languageLabels[lang] || lang}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
