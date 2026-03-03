import { getTranslations, getLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { sampleEvents } from "@/lib/sample-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Link } from "@/lib/i18n/navigation";
import { localeLabels } from "@/lib/i18n/routing";
import { getRsvpCounts, getUserRsvp } from "@/lib/events/actions";
import { RsvpButtons } from "@/components/community/rsvp-buttons";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { Metadata } from "next";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const event = sampleEvents.find((e) => e.id === id);
  return { title: event?.title.en || "Event" };
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const t = await getTranslations("events");
  const locale = await getLocale();

  const event = sampleEvents.find((e) => e.id === id);
  if (!event) notFound();

  const title = event.title[locale] || event.title.en;
  const description = event.description[locale] || event.description.en;

  // RSVP data
  let user = null;
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;
  }
  const counts = await getRsvpCounts(id);
  const userRsvp = await getUserRsvp(id);

  // Build iCal data
  const icalStart = new Date(event.start_time)
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
  const icalEnd = event.end_time
    ? new Date(event.end_time)
        .toISOString()
        .replace(/[-:]/g, "")
        .replace(/\.\d{3}/, "")
    : icalStart;
  const icalUrl = `data:text/calendar;charset=utf-8,BEGIN:VCALENDAR%0AVERSION:2.0%0ABEGIN:VEVENT%0ADTSTART:${icalStart}%0ADTEND:${icalEnd}%0ASUMMARY:${encodeURIComponent(title)}%0ALOCATION:${encodeURIComponent(event.address || "")}%0ADESCRIPTION:${encodeURIComponent(description)}%0AEND:VEVENT%0AEND:VCALENDAR`;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/events">&larr; {t("title")}</Link>
        </Button>
      </div>

      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {event.is_virtual ? (
          <Badge variant="secondary">Virtual</Badge>
        ) : (
          <Badge variant="secondary">In Person</Badge>
        )}
        {event.languages.map((lang) => (
          <Badge key={lang} variant="outline">
            {localeLabels[lang as keyof typeof localeLabels] || lang}
          </Badge>
        ))}
      </div>

      <Separator className="my-6" />

      <div className="grid gap-6 sm:grid-cols-2">
        <Card>
          <CardContent className="pt-6 space-y-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {t("when")}
              </p>
              <p className="font-medium">{formatDate(event.start_time)}</p>
              {event.end_time && (
                <p className="text-sm text-muted-foreground">
                  to {formatDate(event.end_time)}
                </p>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {t("where")}
              </p>
              {event.is_virtual ? (
                <p className="font-medium">
                  Virtual Event
                  {event.virtual_link && (
                    <a
                      href={event.virtual_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-primary hover:underline"
                    >
                      Join Link
                    </a>
                  )}
                </p>
              ) : (
                <>
                  {event.location_name && (
                    <p className="font-medium">{event.location_name}</p>
                  )}
                  {event.address && (
                    <p className="text-sm text-muted-foreground">
                      {event.address}
                    </p>
                  )}
                </>
              )}
            </div>
            {(event.contact_name || event.contact_email) && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t("contact")}
                </p>
                {event.contact_name && (
                  <p className="font-medium">{event.contact_name}</p>
                )}
                {event.contact_email && (
                  <a
                    href={`mailto:${event.contact_email}`}
                    className="text-sm text-primary hover:underline"
                  >
                    {event.contact_email}
                  </a>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <div>
          <p className="leading-7 text-foreground/90">{description}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild variant="outline" className="min-h-[44px]">
              <a href={icalUrl} download={`${event.id}.ics`}>
                {t("addToCalendar")}
              </a>
            </Button>
          </div>
        </div>
      </div>

      <Separator className="my-8" />

      <RsvpButtons
        eventId={id}
        currentStatus={userRsvp?.status || null}
        goingCount={counts.going}
        maybeCount={counts.maybe}
        isLoggedIn={!!user}
      />
    </div>
  );
}
