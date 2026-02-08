"use client";

import { useCallback, useState } from "react";
import { GoogleMap, useJsApiLoader, Marker, Circle } from "@react-google-maps/api";

interface PropertyMapProps {
  center: [number, number]; // [lng, lat]
  markers?: Array<{ lng: number; lat: number; label?: string; color?: string }>;
  radius?: number; // in miles, for subject property radius
  className?: string;
}

const containerStyle = {
  width: "100%",
  height: "100%",
};

export default function PropertyMap({
  center,
  markers = [],
  radius,
  className = "",
}: PropertyMapProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apiKey || "",
  });

  const onLoad = useCallback((map: google.maps.Map) => {
    // Fit bounds to show all markers if multiple
    if (markers.length > 1) {
      const bounds = new google.maps.LatLngBounds();
      markers.forEach((marker) => {
        bounds.extend({ lat: marker.lat, lng: marker.lng });
      });
      map.fitBounds(bounds, 50);
    }
    setMap(map);
  }, [markers]);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Google Maps center is { lat, lng } format
  const mapCenter = { lat: center[1], lng: center[0] };

  // Fallback when no API key
  if (!apiKey) {
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
            Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to enable maps
          </p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className={`bg-gray-100 flex items-center justify-center ${className}`}>
        <p className="text-red-500">Error loading map</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className={`bg-gray-100 flex items-center justify-center ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
      </div>
    );
  }

  return (
    <div className={className}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={14}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          zoomControl: true,
        }}
      >
        {/* Render markers */}
        {markers.map((marker, idx) => (
          <Marker
            key={idx}
            position={{ lat: marker.lat, lng: marker.lng }}
            title={marker.label}
            icon={
              marker.color
                ? {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 10,
                    fillColor: marker.color,
                    fillOpacity: 1,
                    strokeColor: "#ffffff",
                    strokeWeight: 2,
                  }
                : undefined
            }
          />
        ))}

        {/* Render radius circle if specified */}
        {radius && (
          <Circle
            center={mapCenter}
            radius={radius * 1609.34} // Convert miles to meters
            options={{
              fillColor: "#3B82F6",
              fillOpacity: 0.15,
              strokeColor: "#3B82F6",
              strokeWeight: 2,
              strokeOpacity: 0.8,
            }}
          />
        )}
      </GoogleMap>
    </div>
  );
}
