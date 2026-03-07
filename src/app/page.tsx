import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { sampleEvents } from "@/lib/sample-data";
import { EventCard } from "@/components/community/event-card";

const stats = [
  { value: "40+", label: "Languages spoken" },
  { value: "50K+", label: "Gateway residents" },
  { value: "500+", label: "Small businesses" },
  { value: "7", label: "Strategic pillars" },
];

export default function HomePage() {
  const upcomingEvents = sampleEvents.slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-primary/5 to-background">
        <div className="mx-auto max-w-5xl px-4 py-20 text-center sm:py-28">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Gateway Confluence
          </h1>
          <p className="mt-3 text-xl font-medium text-primary/80 sm:text-2xl">
            Where Community Roots Run Deep
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            A transit-centered, culturally plural, economically stable community platform for East Portland — where longtime residents can remain, small businesses can thrive, and public space fosters belonging.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="min-h-[44px] text-base">
              <Link href="/plan">Read the Strategic Plan</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="min-h-[44px] text-base"
            >
              <Link href="/get-involved">Get Involved</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b bg-muted/30">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-4 px-4 py-10 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-bold text-primary sm:text-4xl">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Three pillars */}
      <section className="mx-auto max-w-5xl px-4 py-16">
        <div className="grid gap-6 sm:grid-cols-3">
          <Card className="border-t-4 border-t-blue-500">
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold">Our Vision</h2>
              <p className="mt-2 leading-7 text-muted-foreground">
                We envision a community where infrastructure serves daily life rather than speculative growth. A staying community, not a replacement community.
              </p>
            </CardContent>
          </Card>

          <Card className="border-t-4 border-t-green-500">
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold">The Plan</h2>
              <p className="mt-2 leading-7 text-muted-foreground">
                Seven strategic pillars guide our work — from housing security to shared infrastructure. Each one grounded in the lived experience of Gateway residents.
              </p>
            </CardContent>
          </Card>

          <Card className="border-t-4 border-t-amber-500">
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold">
                Join Us
              </h2>
              <p className="mt-2 leading-7 text-muted-foreground">
                Gateway Confluence is built by and for the people who live here. Your voice, your language, your vision matters.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="border-t bg-muted/20">
        <div className="mx-auto max-w-5xl px-4 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Upcoming Events</h2>
            <Button asChild variant="outline" size="sm">
              <Link href="/events">View All</Link>
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Join Us
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            Gateway Confluence is built by and for the people who live here. Your voice, your language, your vision matters.
          </p>
          <Separator className="mx-auto my-6 max-w-xs" />
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="min-h-[44px]">
              <Link href="/get-involved">Get Involved</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="min-h-[44px]">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
