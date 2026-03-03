import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function DataPoint({
  source,
  children,
}: {
  source: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="my-6 border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20">
      <CardContent className="pt-4">
        <p className="text-lg font-semibold">{children}</p>
        <p className="mt-1 text-sm text-muted-foreground">Source: {source}</p>
      </CardContent>
    </Card>
  );
}

export function Strategy({
  priority,
  timeline,
  partners,
  children,
}: {
  priority: "high" | "medium" | "low";
  timeline: string;
  partners?: string[];
  children: React.ReactNode;
}) {
  const priorityColors = {
    high: "border-l-red-500 bg-red-50/50 dark:bg-red-950/20",
    medium: "border-l-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/20",
    low: "border-l-green-500 bg-green-50/50 dark:bg-green-950/20",
  };

  return (
    <Card className={`my-6 border-l-4 ${priorityColors[priority]}`}>
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="rounded-full bg-primary/10 px-2 py-0.5 font-medium capitalize">
            {priority} priority
          </span>
          <span className="text-muted-foreground">{timeline}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm dark:prose-invert max-w-none">
          {children}
        </div>
        {partners && partners.length > 0 && (
          <div className="mt-3 text-sm text-muted-foreground">
            Partners: {partners.join(", ")}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function ProgressTracker({
  metric,
  target,
  current,
}: {
  metric: string;
  target: number;
  current: number;
}) {
  const percentage = Math.round((current / target) * 100);

  return (
    <div className="my-6 rounded-lg border p-4">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-medium capitalize">
          {metric.replace(/-/g, " ")}
        </span>
        <span className="text-muted-foreground">
          {current} / {target} ({percentage}%)
        </span>
      </div>
      <div className="h-3 w-full rounded-full bg-muted">
        <div
          className="h-3 rounded-full bg-primary transition-all"
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
}

export function CommunityVoice({
  attribution,
  children,
}: {
  attribution?: string;
  children: React.ReactNode;
}) {
  return (
    <blockquote className="my-6 border-l-4 border-l-primary/30 bg-muted/50 p-4 italic">
      <div className="text-base">{children}</div>
      {attribution && (
        <footer className="mt-2 text-sm text-muted-foreground not-italic">
          &mdash; {attribution}
        </footer>
      )}
    </blockquote>
  );
}

export function ActionItem({
  responsible,
  deadline,
  children,
}: {
  responsible: string;
  deadline?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="my-4 flex items-start gap-3 rounded-lg border p-4">
      <div className="mt-0.5 h-5 w-5 shrink-0 rounded border-2 border-primary/50" />
      <div className="flex-1">
        <div className="font-medium">{children}</div>
        <div className="mt-1 flex flex-wrap gap-3 text-sm text-muted-foreground">
          <span>Responsible: {responsible}</span>
          {deadline && <span>Deadline: {deadline}</span>}
        </div>
      </div>
    </div>
  );
}

export function Timeline({
  items,
}: {
  items: { date: string; title: string; description?: string }[];
}) {
  return (
    <div className="my-6 space-y-4">
      {items.map((item, i) => (
        <div key={i} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="h-3 w-3 rounded-full bg-primary" />
            {i < items.length - 1 && <div className="w-0.5 flex-1 bg-border" />}
          </div>
          <div className="pb-4">
            <p className="text-sm font-medium text-muted-foreground">
              {item.date}
            </p>
            <p className="font-semibold">{item.title}</p>
            {item.description && (
              <p className="mt-1 text-sm text-muted-foreground">
                {item.description}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export function PartnerCard({
  name,
  role,
  children,
}: {
  name: string;
  role: string;
  children?: React.ReactNode;
}) {
  return (
    <Card className="my-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{name}</CardTitle>
        <p className="text-sm text-muted-foreground">{role}</p>
      </CardHeader>
      {children && (
        <CardContent>
          <p className="text-sm">{children}</p>
        </CardContent>
      )}
    </Card>
  );
}

export const mdxComponents = {
  DataPoint,
  Strategy,
  ProgressTracker,
  CommunityVoice,
  ActionItem,
  Timeline,
  PartnerCard,
  hr: () => <Separator className="my-8" />,
  h1: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="mt-8 mb-4 text-3xl font-bold tracking-tight" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="mt-6 mb-3 text-2xl font-semibold tracking-tight" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="mt-4 mb-2 text-xl font-semibold" {...props}>
      {children}
    </h3>
  ),
  p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="mb-4 leading-7 text-foreground/90" {...props}>
      {children}
    </p>
  ),
  ul: ({ children, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="mb-4 ml-6 list-disc space-y-1" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="mb-4 ml-6 list-decimal space-y-1" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="leading-7" {...props}>
      {children}
    </li>
  ),
  strong: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <strong className="font-semibold text-foreground" {...props}>
      {children}
    </strong>
  ),
};
