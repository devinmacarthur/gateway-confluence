"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { FeatureCollection } from "geojson";

/* eslint-disable @typescript-eslint/no-explicit-any */

interface GatewayMapProps {
  className?: string;
}

export function GatewayMap({ className }: GatewayMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapObjRef = useRef<L.Map | null>(null);
  const [ready, setReady] = useState(false);
  const [layers, setLayers] = useState({
    neighborhoods: true,
    schoolDistricts: false,
    resources: true,
    portland: false,
  });

  useEffect(() => {
    if (!mapRef.current || mapObjRef.current) return;

    const map = L.map(mapRef.current, {
      center: [45.515, -122.5228],
      zoom: 12,
      scrollWheelZoom: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
    }).addTo(map);

    const centerIcon = L.divIcon({
      html: '<div style="background:#1e3a5f;color:white;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:14px;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);">GC</div>',
      className: "",
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
    L.marker([45.5267, -122.5558], { icon: centerIcon })
      .addTo(map)
      .bindPopup("<strong>Gateway Confluence Center</strong><br>1708 NE 106th Ave");

    mapObjRef.current = map;
    setReady(true);

    return () => {
      map.remove();
      mapObjRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapObjRef.current || !ready) return;
    const map = mapObjRef.current;

    const layerGroups: Record<string, L.LayerGroup> = {};

    async function loadLayers() {
      // Neighborhood boundaries
      const nbhRes = await fetch("/gateway-neighborhoods.geojson");
      const nbhData: FeatureCollection = await nbhRes.json();
      layerGroups.neighborhoods = L.geoJSON(nbhData as any, {
        style: (feature: any) => ({
          color: feature?.properties?.zone === "core" ? "#1e3a5f" : "#6b8cae",
          weight: feature?.properties?.zone === "core" ? 3 : 2,
          fillColor: feature?.properties?.zone === "core" ? "#1e3a5f" : "#6b8cae",
          fillOpacity: feature?.properties?.zone === "core" ? 0.15 : 0.05,
          dashArray: feature?.properties?.zone === "core" ? "" : "5,5",
        }),
        onEachFeature: (feature: any, layer: any) => {
          if (feature.properties) {
            layer.bindPopup(
              `<strong>${feature.properties.name}</strong><br>Zone: ${feature.properties.zone === "core" ? "Gateway Core" : "Greater Gateway"}`
            );
            layer.bindTooltip(feature.properties.name, {
              permanent: false,
              direction: "center",
              className: "neighborhood-label",
            });
          }
        },
      });
      if (layers.neighborhoods) layerGroups.neighborhoods.addTo(map);

      // School districts
      const sdRes = await fetch("/gateway-school-districts.geojson");
      const sdData: FeatureCollection = await sdRes.json();
      const sdColors: Record<string, string> = {
        "David Douglas School District 40": "#e74c3c",
        "Parkrose School District 3": "#2ecc71",
        "Reynolds School District 7": "#f39c12",
        "Centennial School District 28J": "#9b59b6",
      };
      layerGroups.schoolDistricts = L.geoJSON(sdData as any, {
        style: (feature: any) => ({
          color: sdColors[feature?.properties?.name] || "#666",
          weight: 3,
          fillColor: sdColors[feature?.properties?.name] || "#666",
          fillOpacity: 0.08,
          dashArray: "8,4",
        }),
        onEachFeature: (feature: any, layer: any) => {
          if (feature.properties) {
            layer.bindPopup(`<strong>${feature.properties.name}</strong>`);
            layer.bindTooltip(feature.properties.name, {
              permanent: false,
              direction: "center",
            });
          }
        },
      });
      if (layers.schoolDistricts) layerGroups.schoolDistricts.addTo(map);

      // All Portland neighborhoods (faint background)
      const pdxRes = await fetch("/portland-neighborhoods.geojson");
      const pdxData: FeatureCollection = await pdxRes.json();
      layerGroups.portland = L.geoJSON(pdxData as any, {
        style: () => ({
          color: "#999",
          weight: 1,
          fillColor: "#ccc",
          fillOpacity: 0.02,
        }),
        onEachFeature: (feature: any, layer: any) => {
          if (feature.properties) {
            layer.bindTooltip(feature.properties.name, {
              permanent: false,
              direction: "center",
            });
          }
        },
      });
      if (layers.portland) layerGroups.portland.addTo(map);

      // Resource markers
      const resources = [
        { name: "IRCO", lat: 45.5267, lng: -122.5558, cat: "education" },
        { name: "El Programa Hispano", lat: 45.4972, lng: -122.6377, cat: "legal" },
        { name: "Oregon Food Bank", lat: 45.5689, lng: -122.6278, cat: "food" },
        { name: "Wallace Medical", lat: 45.5189, lng: -122.5367, cat: "health" },
        { name: "Home Forward", lat: 45.5222, lng: -122.6763, cat: "housing" },
        { name: "WorkSystems", lat: 45.5167, lng: -122.5256, cat: "employment" },
        { name: "SEI Youth", lat: 45.5567, lng: -122.6718, cat: "youth" },
        { name: "East Portland CC", lat: 45.5156, lng: -122.5558, cat: "senior" },
      ];
      const catColors: Record<string, string> = {
        education: "#3498db", legal: "#9b59b6", food: "#2ecc71", health: "#e74c3c",
        housing: "#f39c12", employment: "#1abc9c", youth: "#e67e22", senior: "#34495e",
      };
      layerGroups.resources = L.layerGroup();
      resources.forEach((r) => {
        L.circleMarker([r.lat, r.lng], {
          radius: 8,
          fillColor: catColors[r.cat] || "#666",
          color: "white",
          weight: 2,
          fillOpacity: 0.9,
        })
          .bindPopup(`<strong>${r.name}</strong><br><em>${r.cat}</em>`)
          .addTo(layerGroups.resources);
      });
      if (layers.resources) layerGroups.resources.addTo(map);
    }

    loadLayers();

    return () => {
      Object.values(layerGroups).forEach((lg) => {
        if (map.hasLayer(lg)) map.removeLayer(lg);
      });
    };
  }, [ready, layers]);

  const toggleLayer = (key: keyof typeof layers) => {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className={className}>
      <div className="mb-4 flex flex-wrap gap-2">
        {[
          { key: "neighborhoods" as const, label: "Gateway Neighborhoods", color: "#1e3a5f" },
          { key: "schoolDistricts" as const, label: "School Districts", color: "#e74c3c" },
          { key: "resources" as const, label: "Community Resources", color: "#2ecc71" },
          { key: "portland" as const, label: "All Portland", color: "#999" },
        ].map(({ key, label, color }) => (
          <button
            key={key}
            onClick={() => toggleLayer(key)}
            className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
              layers[key]
                ? "border-foreground/20 bg-foreground/5 text-foreground"
                : "border-muted text-muted-foreground opacity-50"
            }`}
          >
            <span
              className="inline-block h-3 w-3 rounded-full"
              style={{ backgroundColor: color, opacity: layers[key] ? 1 : 0.3 }}
            />
            {label}
          </button>
        ))}
      </div>
      <div
        ref={mapRef}
        className="h-[500px] w-full rounded-lg border sm:h-[600px]"
      />
    </div>
  );
}
