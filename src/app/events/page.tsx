import { sampleEvents } from "@/lib/sample-data";
import { EventCard } from "@/components/community/event-card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community Events",
};

export default function EventsPage() {
  const now = new Date();
  const upcoming = sampleEvents.filter(
    (e) => new Date(e.start_time) >= now
  );
  const past = sampleEvents.filter(
    (e) => new Date(e.start_time) < now
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Community Events</h1>
        <p className="mt-3 text-lg text-muted-foreground">Gatherings, workshops, and meetings in Gateway</p>
      </div>

      {/* Upcoming Events */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-semibold">Upcoming</h2>
        {upcoming.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground">
            No upcoming events. Check back soon!
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>

      {/* Past Events */}
      {past.length > 0 && (
        <section>
          <h2 className="mb-6 text-2xl font-semibold text-muted-foreground">
            Past Events
          </h2>
          <div className="grid gap-4 opacity-70 sm:grid-cols-2 lg:grid-cols-3">
            {past.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
