"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface PropertyMapProps {
  center: [number, number]; // [lng, lat]
  markers?: Array<{ lng: number; lat: number; label?: string; color?: string }>;
  radius?: number; // in miles, for subject property radius
  className?: string;
}

export default function PropertyMap({
  center,
  markers = [],
  radius,
  className = "",
}: PropertyMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  useEffect(() => {
    if (!token || !mapContainer.current || map.current) return;

    mapboxgl.accessToken = token;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: center,
      zoom: 13,
    });

    // Add markers
    markers.forEach((marker) => {
      const el = document.createElement("div");
      el.className = "w-6 h-6 rounded-full border-2 border-white shadow-lg";
      el.style.backgroundColor = marker.color || "#3B82F6";

      new mapboxgl.Marker(el)
        .setLngLat([marker.lng, marker.lat])
        .setPopup(
          marker.label
            ? new mapboxgl.Popup({ offset: 25 }).setText(marker.label)
            : undefined
        )
        .addTo(map.current!);
    });

    // Add radius circle if specified
    if (radius && map.current) {
      map.current.on("load", () => {
        const radiusInMeters = radius * 1609.34; // Convert miles to meters
        const steps = 64;
        const coordinates: [number, number][] = [];

        for (let i = 0; i < steps; i++) {
          const angle = (i / steps) * 2 * Math.PI;
          const dx = radiusInMeters * Math.cos(angle);
          const dy = radiusInMeters * Math.sin(angle);

          const lat =
            center[1] + (dy / 111320); // 1 degree latitude ≈ 111.32 km
          const lng =
            center[0] + (dx / (111320 * Math.cos((center[1] * Math.PI) / 180)));

          coordinates.push([lng, lat]);
        }
        coordinates.push(coordinates[0]); // Close the circle

        map.current!.addSource("radius", {
          type: "geojson",
          data: {
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: [coordinates],
            },
            properties: {},
          },
        });

        map.current!.addLayer({
          id: "radius",
          type: "fill",
          source: "radius",
          paint: {
            "fill-color": "#3B82F6",
            "fill-opacity": 0.15,
          },
        });

        map.current!.addLayer({
          id: "radius-outline",
          type: "line",
          source: "radius",
          paint: {
            "line-color": "#3B82F6",
            "line-width": 2,
            "line-dasharray": [2, 2],
          },
        });
      });
    }

    // Fit bounds to show all markers
    if (markers.length > 1 && map.current) {
      const bounds = new mapboxgl.LngLatBounds();
      markers.forEach((marker) => {
        bounds.extend([marker.lng, marker.lat]);
      });
      map.current.fitBounds(bounds, { padding: 50 });
    }

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [center, markers, radius, token]);

  // Fallback when no token
  if (!token) {
    return (
      <div
        className={`bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center ${className}`}
      >
        <div className="text-center p-8">
          <div className="text-gray-400 mb-2">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
              />
            </svg>
          </div>
          <p className="text-gray-600 font-medium">Map Unavailable</p>
          <p className="text-sm text-gray-500 mt-1">
            Set NEXT_PUBLIC_MAPBOX_TOKEN to enable maps
          </p>
        </div>
      </div>
    );
  }

  return <div ref={mapContainer} className={className} />;
}
