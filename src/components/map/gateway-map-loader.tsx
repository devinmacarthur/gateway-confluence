"use client";

import dynamic from "next/dynamic";

const GatewayMap = dynamic(
  () => import("@/components/map/gateway-map").then((mod) => mod.GatewayMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-[500px] w-full animate-pulse rounded-lg bg-muted sm:h-[600px]" />
    ),
  }
);

export function GatewayMapLoader() {
  return <GatewayMap />;
}
