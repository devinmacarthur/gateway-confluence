import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <div>
            <p className="text-lg font-semibold">Gateway Confluence</p>
            <p className="text-sm text-muted-foreground">Building community power in East Portland</p>
          </div>
          <Separator className="max-w-xs" />
          <p className="text-sm text-muted-foreground">Gateway District, Portland OR 97220</p>
        </div>
      </div>
    </footer>
  );
}
