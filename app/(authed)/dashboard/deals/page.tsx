"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import PropertyMap from "@/components/PropertyMap";

type PropertyType = "All Deals" | "Single Family" | "Multi Family" | "Land" | "Commercial";

interface Deal {
  id: string;
  image: string;
  address: string;
  beds: number;
  baths: number;
  sqft: number;
  yearBuilt: string;
  purchasePrice: number;
  arv: number;
  description: string;
  dropboxLink: string;
  homeType: PropertyType;
  lat: number;
  lng: number;
  county: string;
}

export default function DealsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<PropertyType>("All Deals");
  const [showMap, setShowMap] = useState(false);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch deals from Salesforce API
  useEffect(() => {
    setMounted(true);

    async function fetchDeals() {
      try {
        const res = await fetch("/api/deals");
        const data = await res.json();

        // Transform API response to match our Deal interface
        const transformedDeals: Deal[] = (data.records || []).map((record: any) => ({
          id: record.Id,
          image: record.imageUrl || "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80",
          address: `${record.DACQ_Address__c || ""}, ${record.DACQ_City__c || ""}, ${record.DACQ_State__c || ""} ${record.DACQ_Zip__c || ""}`.trim(),
          beds: parseInt(record.DACQ_Beds__c) || 0,
          baths: parseInt(record.DACQ_Baths__c) || 0,
          sqft: record.DACQ_Sqft__c || 0,
          yearBuilt: record.yearBuilt || "N/A",
          purchasePrice: record.DACQ_Price__c || 0,
          arv: record.DACQ_ARV__c || 0,
          description: "",
          dropboxLink: record.DACQ_Packet_URL__c || "",
          homeType: "Single Family" as PropertyType,
          lat: 32.7767, // Default Dallas coords - will be updated when we have real geocoding
          lng: -96.7970,
          county: record.county || "",
        }));

        setDeals(transformedDeals);
      } catch (error) {
        console.error("Failed to fetch deals:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDeals();
  }, []);

  const categories: PropertyType[] = ["All Deals", "Single Family", "Multi Family", "Land", "Commercial"];

  const filteredDeals = useMemo(() => {
    if (selectedCategory === "All Deals") return deals;
    return deals.filter((deal) => deal.homeType === selectedCategory);
  }, [selectedCategory, deals]);

  const categoryStats = useMemo(() => {
    return {
      "All Deals": deals.length,
      "Single Family": deals.filter((d) => d.homeType === "Single Family").length,
      "Multi Family": deals.filter((d) => d.homeType === "Multi Family").length,
      "Land": deals.filter((d) => d.homeType === "Land").length,
      "Commercial": deals.filter((d) => d.homeType === "Commercial").length,
    };
  }, [deals]);

  const salesAgent = {
    name: "Sarah Johnson",
    email: "sarah.johnson@diamondacquisitions.com",
    phone: "(512) 555-0123",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleMoreInfo = () => {
    setIsModalOpen(true);
  };

  return (
    <div>
      {/* Page Header with animation */}
      <div
        className={`mb-6 transition-all duration-700 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
        }`}
      >
        <h2 className="text-3xl font-bold text-gray-900">Available Deals</h2>
        <p className="text-gray-600 mt-2">
          {filteredDeals.length} {selectedCategory === "All Deals" ? "total" : selectedCategory.toLowerCase()} {filteredDeals.length === 1 ? "property" : "properties"} available
        </p>
      </div>

      {/* Horizontal Filter Bar */}
      <div
        className={`mb-6 transition-all duration-700 delay-100 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {categories.map((category) => {
            const count = categoryStats[category];
            const isActive = selectedCategory === category;
            const hasDeals = count > 0;

            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                disabled={!hasDeals && category !== "All Deals"}
                className={`flex-shrink-0 px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300 transform relative overflow-hidden group ${
                  isActive
                    ? "bg-black text-white shadow-lg scale-105"
                    : hasDeals
                    ? "bg-white text-gray-700 border-2 border-gray-200 hover:border-black hover:shadow-md hover:scale-102"
                    : "bg-gray-100 text-gray-400 border-2 border-gray-200 cursor-not-allowed opacity-50"
                }`}
              >
                {/* Animated background pulse for active category */}
                {isActive && (
                  <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
                )}

                <div className="relative z-10">
                  <div className="font-bold">{category}</div>
                  <div className={`text-xs ${isActive ? "text-gray-200" : "text-gray-500"}`}>
                    {count} {count === 1 ? "deal" : "deals"}
                  </div>
                </div>

                {/* Active indicator */}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Map Section */}
      <div
        className={`mb-8 transition-all duration-700 delay-200 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="bg-white rounded-lg shadow-lg border-2 border-gray-200 overflow-hidden">
          {/* Map Toggle Header */}
          <button
            onClick={() => setShowMap(!showMap)}
            className="w-full px-6 py-4 bg-black text-white flex items-center justify-between hover:bg-gray-800 transition-all duration-300 group"
          >
            <div className="text-left">
              <div className="font-bold text-lg">Deal Locations Map</div>
              <div className="text-sm text-gray-200">
                {showMap ? "Click to hide" : `Click to view ${filteredDeals.length} ${filteredDeals.length === 1 ? "property" : "properties"} on map`}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white bg-opacity-20 px-4 py-2 rounded-full text-sm font-bold">
                {filteredDeals.length} Deals
              </div>
              <span className={`text-2xl transition-transform duration-300 ${showMap ? "rotate-180" : ""}`}>
                ▼
              </span>
            </div>
          </button>

          {/* Map Content */}
          {showMap && (
            <div className="animate-slideDown">
              <PropertyMap
                center={
                  filteredDeals.length > 0
                    ? [
                        filteredDeals.reduce((sum, d) => sum + d.lng, 0) / filteredDeals.length,
                        filteredDeals.reduce((sum, d) => sum + d.lat, 0) / filteredDeals.length,
                      ]
                    : [-97.7431, 30.2672]
                }
                markers={filteredDeals.map((deal) => ({
                  lng: deal.lng,
                  lat: deal.lat,
                  label: deal.address,
                  color: deal.homeType === "Single Family" ? "#000000" : deal.homeType === "Multi Family" ? "#4B5563" : "#9CA3AF",
                }))}
                className="h-80 w-full"
              />
              <div className="px-6 py-4 bg-gray-50 border-t-2 border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-black"></div>
                      <span className="text-gray-700">Single Family</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-gray-600"></div>
                      <span className="text-gray-700">Multi Family</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                      <span className="text-gray-700">Commercial/Land</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    Click markers for property details
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Deals Grid with stagger animation */}
      <div
        className={`transition-all duration-700 delay-300 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        {loading ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-md border border-gray-200">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Loading Deals from Salesforce...</h3>
            <p className="text-gray-600">Connecting to your sandbox</p>
          </div>
        ) : filteredDeals.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-md border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No {selectedCategory} Deals Available</h3>
            <p className="text-gray-600">Check back soon for new opportunities!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDeals.map((deal, index) => (
          <div
            key={deal.id}
            className={`bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{
              transitionDelay: `${index * 100}ms`,
            }}
          >
            {/* Property Image with hover effect */}
            <div className="relative h-48 w-full bg-gray-200 overflow-hidden">
              <Image
                src={deal.image}
                alt={deal.address}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              {/* New badge */}
              <div className="absolute top-3 right-3 bg-black text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                NEW
              </div>
            </div>

            {/* Property Details */}
            <div className="p-5">
              {/* Address */}
              <h3 className="font-semibold text-lg text-gray-900 mb-3 group-hover:text-black transition-colors">
                {deal.address}
              </h3>

              {/* Property Stats */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700">
                    {deal.beds} Beds
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700">
                    {deal.baths} Baths
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700">
                    {deal.sqft.toLocaleString()} sqft
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700">
                    Built {deal.yearBuilt}
                  </span>
                </div>
              </div>

              {/* Purchase Price */}
              <div className="mb-4 pt-3 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Purchase Price</p>
                <p className="text-2xl font-bold text-black">
                  {formatPrice(deal.purchasePrice)}
                </p>
              </div>

              {/* More Info Button */}
              <Link
                href={`/dashboard/deals/${deal.id}`}
                className="block w-full bg-black text-white py-2.5 px-4 rounded-lg font-medium hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-xl text-center"
              >
                Click for More Info
              </Link>
            </div>
          </div>
        ))}
          </div>
        )}
      </div>

      {/* Modal with enhanced animations */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg shadow-2xl max-w-md w-full p-8 relative animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:rotate-90 transition-all duration-300 text-3xl"
            >
              ×
            </button>

            {/* Success Icon Animation */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center animate-bounce">
                <span className="text-3xl">✓</span>
              </div>
            </div>

            {/* Sales Agent Photo with ring animation */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 ring-4 ring-gray-300 animate-pulse">
                  <img
                    src={salesAgent.photo}
                    alt={salesAgent.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-0 right-0 w-8 h-8 bg-gray-400 rounded-full border-4 border-white"></div>
              </div>
            </div>

            {/* Message */}
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 animate-fadeIn">
                Thank You for Your Interest!
              </h3>
              <p className="text-lg text-gray-700 mb-6 animate-fadeIn">
                Your sales agent will contact you shortly with more information.
              </p>

              {/* Agent Info with gradient background */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
                <p className="font-semibold text-gray-900 mb-2">
                  {salesAgent.name}
                </p>
                <p className="text-sm text-gray-600">{salesAgent.email}</p>
                <p className="text-sm text-gray-600">{salesAgent.phone}</p>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full bg-black text-white py-2.5 px-4 rounded-lg font-medium hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(100px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes slideDown {
          from {
            max-height: 0;
            opacity: 0;
          }
          to {
            max-height: 1000px;
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }

        .animate-slideDown {
          animation: slideDown 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
