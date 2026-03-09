import { GatewayMapLoader } from "@/components/map/gateway-map-loader";
import { Card, CardContent } from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Map - Gateway Confluence",
  description: "Interactive map of the Gateway Confluence region in East Portland",
};

const legendItems = [
  { color: "#1e3a5f", label: "Gateway Core Neighborhoods", style: "solid" },
  { color: "#6b8cae", label: "Greater Gateway Area", style: "dashed" },
  { color: "#e74c3c", label: "School District Boundaries", style: "dashed" },
  { color: "#3498db", label: "Education", dot: true },
  { color: "#9b59b6", label: "Legal Services", dot: true },
  { color: "#2ecc71", label: "Food Access", dot: true },
  { color: "#e74c3c", label: "Health", dot: true },
  { color: "#f39c12", label: "Housing", dot: true },
  { color: "#1abc9c", label: "Employment", dot: true },
  { color: "#e67e22", label: "Youth Services", dot: true },
  { color: "#34495e", label: "Senior Services", dot: true },
];

export default function MapPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Gateway Confluence Region</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          An interactive map of the neighborhoods, school districts, and community resources
          that make up the Gateway Confluence region in East Portland.
        </p>
      </div>

      <GatewayMapLoader />

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold">Gateway Core</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              9 neighborhoods forming the heart of the Gateway district: Hazelwood, Mill Park,
              Parkrose, Parkrose Heights, Argay Terrace, Glenfair, Russell, Woodland Park, and Wilkes.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold">School Districts</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Four school districts serve Gateway families: David Douglas, Parkrose,
              Reynolds, and Centennial — each bringing unique strengths to the community.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold">Community Resources</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              8 community organizations providing services from healthcare and food access
              to legal aid, youth programs, and employment support.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Legend */}
      <Card className="mt-6">
        <CardContent className="pt-6">
          <h3 className="mb-3 font-semibold">Map Legend</h3>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {legendItems.map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-sm">
                {item.dot ? (
                  <span
                    className="inline-block h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                ) : (
                  <span
                    className="inline-block h-0.5 w-5 shrink-0"
                    style={{
                      backgroundColor: item.color,
                      borderTop: item.style === "dashed" ? `2px dashed ${item.color}` : undefined,
                    }}
                  />
                )}
                <span className="text-muted-foreground">{item.label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
