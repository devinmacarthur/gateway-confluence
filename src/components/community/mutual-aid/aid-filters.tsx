"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function AidFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`?${params.toString()}`);
  }

  const currentType = searchParams.get("type") || "all";

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex gap-1">
        {["all", "offer", "request"].map((type) => (
          <Button
            key={type}
            variant={currentType === type ? "default" : "outline"}
            size="sm"
            className="min-h-[44px]"
            onClick={() => updateFilter("type", type)}
          >
            {type === "all" ? "All" : type === "offer" ? "Offer" : "Request"}
          </Button>
        ))}
      </div>

      <Select
        defaultValue={searchParams.get("category") || "all"}
        onValueChange={(v) => updateFilter("category", v)}
      >
        <SelectTrigger className="w-40 min-h-[44px]">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="food">Food</SelectItem>
          <SelectItem value="housing">Housing</SelectItem>
          <SelectItem value="transport">Transportation</SelectItem>
          <SelectItem value="childcare">Childcare</SelectItem>
          <SelectItem value="translation">Translation</SelectItem>
          <SelectItem value="other">Other</SelectItem>
        </SelectContent>
      </Select>

      <Select
        defaultValue={searchParams.get("urgency") || "all"}
        onValueChange={(v) => updateFilter("urgency", v)}
      >
        <SelectTrigger className="w-36 min-h-[44px]">
          <SelectValue placeholder="Urgency" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="low">Low</SelectItem>
          <SelectItem value="normal">Normal</SelectItem>
          <SelectItem value="urgent">Urgent</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
