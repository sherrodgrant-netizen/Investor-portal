"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import PropertyMap from "@/components/PropertyMap";

type PropertyType = "All Deals" | "Single Family" | "Multi Family" | "Land" | "Commercial";

export default function DealsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<PropertyType>("All Deals");
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const deals = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80",
      address: "1234 Maple Street, Austin, TX 78701",
      beds: 4,
      baths: 3,
      sqft: 2400,
      yearBuilt: 2018,
      purchasePrice: 485000,
      arv: 650000,
      description: "Beautiful 4-bedroom home in the heart of Austin. Features modern updates, open floor plan, and a spacious backyard perfect for entertaining. Located in a highly desirable neighborhood with excellent schools.",
      dropboxLink: "https://www.dropbox.com/sh/example1/photos",
      roofAge: 6,
      foundationRepair: false,
      hvacAge: 4,
      homeType: "Single Family" as PropertyType,
      lat: 30.2672,
      lng: -97.7431,
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80",
      address: "5678 Oak Avenue, Dallas, TX 75201",
      beds: 3,
      baths: 2,
      sqft: 1850,
      yearBuilt: 2020,
      purchasePrice: 395000,
      arv: 520000,
      description: "Stunning contemporary home in prime Dallas location. Recently built with energy-efficient features, granite countertops, and hardwood floors throughout. Close to downtown and major highways.",
      dropboxLink: "https://www.dropbox.com/sh/example2/photos",
      roofAge: 4,
      foundationRepair: false,
      hvacAge: 3,
      homeType: "Single Family" as PropertyType,
      lat: 32.7767,
      lng: -96.7970,
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80",
      address: "9012 Pine Boulevard, Houston, TX 77002",
      beds: 5,
      baths: 4,
      sqft: 3200,
      yearBuilt: 2019,
      purchasePrice: 625000,
      arv: 825000,
      description: "Luxurious 5-bedroom estate with high-end finishes. Features include a gourmet kitchen, master suite with spa-like bathroom, and beautifully landscaped grounds. Perfect for growing families.",
      dropboxLink: "https://www.dropbox.com/sh/example3/photos",
      roofAge: 5,
      foundationRepair: true,
      hvacAge: 5,
      homeType: "Single Family" as PropertyType,
      lat: 29.7604,
      lng: -95.3698,
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800&q=80",
      address: "3456 Cedar Lane, San Antonio, TX 78205",
      beds: 3,
      baths: 2.5,
      sqft: 2100,
      yearBuilt: 2021,
      purchasePrice: 425000,
      arv: 550000,
      description: "Modern townhome in vibrant San Antonio neighborhood. Open concept living with designer finishes, smart home features, and a private patio. Walking distance to shops and restaurants.",
      dropboxLink: "https://www.dropbox.com/sh/example4/photos",
      roofAge: 3,
      foundationRepair: false,
      hvacAge: 2,
      homeType: "Multi Family" as PropertyType,
      lat: 29.4241,
      lng: -98.4936,
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
      address: "7890 Birch Court, Fort Worth, TX 76102",
      beds: 4,
      baths: 3.5,
      sqft: 2800,
      yearBuilt: 2022,
      purchasePrice: 550000,
      arv: 720000,
      description: "Brand new construction in sought-after Fort Worth community. Features include quartz countertops, stainless steel appliances, and a spacious master closet. Move-in ready with builder warranty.",
      dropboxLink: "https://www.dropbox.com/sh/example5/photos",
      roofAge: 2,
      foundationRepair: false,
      hvacAge: 1,
      homeType: "Single Family" as PropertyType,
      lat: 32.7555,
      lng: -97.3308,
    },
    {
      id: 6,
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
      address: "2468 Elm Drive, Plano, TX 75023",
      beds: 3,
      baths: 2,
      sqft: 1650,
      yearBuilt: 2017,
      purchasePrice: 365000,
      arv: 475000,
      description: "Charming single-story home in family-friendly Plano. Updated kitchen and bathrooms, large backyard with mature trees, and oversized garage. Excellent Plano schools and close to parks.",
      dropboxLink: "https://www.dropbox.com/sh/example6/photos",
      roofAge: 7,
      foundationRepair: true,
      hvacAge: 8,
      homeType: "Single Family" as PropertyType,
      lat: 33.0198,
      lng: -96.6989,
    },
  ];

  const categories: PropertyType[] = ["All Deals", "Single Family", "Multi Family", "Land", "Commercial"];

  const filteredDeals = useMemo(() => {
    if (selectedCategory === "All Deals") return deals;
    return deals.filter((deal) => deal.homeType === selectedCategory);
  }, [selectedCategory]);

  const categoryStats = useMemo(() => {
    return {
      "All Deals": deals.length,
      "Single Family": deals.filter((d) => d.homeType === "Single Family").length,
      "Multi Family": deals.filter((d) => d.homeType === "Multi Family").length,
      "Land": deals.filter((d) => d.homeType === "Land").length,
      "Commercial": deals.filter((d) => d.homeType === "Commercial").length,
    };
  }, []);

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
                    ? "bg-gradient-to-r from-slate-900 to-blue-900 text-white shadow-lg scale-105"
                    : hasDeals
                    ? "bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-500 hover:shadow-md hover:scale-102"
                    : "bg-gray-100 text-gray-400 border-2 border-gray-200 cursor-not-allowed opacity-50"
                }`}
              >
                {/* Animated background pulse for active category */}
                {isActive && (
                  <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
                )}

                <div className="relative z-10 flex items-center gap-2">
                  <span className="text-lg">
                    {category === "All Deals" && "🏘️"}
                    {category === "Single Family" && "🏠"}
                    {category === "Multi Family" && "🏢"}
                    {category === "Land" && "🌳"}
                    {category === "Commercial" && "🏗️"}
                  </span>
                  <div>
                    <div className="font-bold">{category}</div>
                    <div className={`text-xs ${isActive ? "text-blue-200" : "text-gray-500"}`}>
                      {count} {count === 1 ? "deal" : "deals"}
                    </div>
                  </div>
                </div>

                {/* Active indicator */}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 to-orange-400"></div>
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
            className="w-full px-6 py-4 bg-gradient-to-r from-slate-900 to-blue-900 text-white flex items-center justify-between hover:from-blue-900 hover:to-slate-900 transition-all duration-300 group"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl group-hover:scale-125 transition-transform">
                📍
              </span>
              <div className="text-left">
                <div className="font-bold text-lg">Deal Locations Map</div>
                <div className="text-sm text-blue-200">
                  {showMap ? "Click to hide" : `Click to view ${filteredDeals.length} ${filteredDeals.length === 1 ? "property" : "properties"} on map`}
                </div>
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
                  color: deal.homeType === "Single Family" ? "#3B82F6" : deal.homeType === "Multi Family" ? "#8B5CF6" : "#10B981",
                }))}
                className="h-80"
              />
              <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-slate-50 border-t-2 border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span className="text-gray-700">Single Family</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                      <span className="text-gray-700">Multi Family</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
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
        {filteredDeals.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-md border border-gray-200">
            <div className="text-6xl mb-4">🏚️</div>
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
              <div className="absolute top-3 right-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                NEW
              </div>
            </div>

            {/* Property Details */}
            <div className="p-5">
              {/* Address */}
              <h3 className="font-semibold text-lg text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                {deal.address}
              </h3>

              {/* Property Stats */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex items-center gap-2 group/stat">
                  <span className="text-gray-600 text-sm group-hover/stat:scale-125 transition-transform">
                    🛏️
                  </span>
                  <span className="text-sm text-gray-700">
                    {deal.beds} Beds
                  </span>
                </div>
                <div className="flex items-center gap-2 group/stat">
                  <span className="text-gray-600 text-sm group-hover/stat:scale-125 transition-transform">
                    🚿
                  </span>
                  <span className="text-sm text-gray-700">
                    {deal.baths} Baths
                  </span>
                </div>
                <div className="flex items-center gap-2 group/stat">
                  <span className="text-gray-600 text-sm group-hover/stat:scale-125 transition-transform">
                    📐
                  </span>
                  <span className="text-sm text-gray-700">
                    {deal.sqft.toLocaleString()} sqft
                  </span>
                </div>
                <div className="flex items-center gap-2 group/stat">
                  <span className="text-gray-600 text-sm group-hover/stat:scale-125 transition-transform">
                    📅
                  </span>
                  <span className="text-sm text-gray-700">
                    Built {deal.yearBuilt}
                  </span>
                </div>
              </div>

              {/* Purchase Price */}
              <div className="mb-4 pt-3 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Purchase Price</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-blue-600 bg-clip-text text-transparent">
                  {formatPrice(deal.purchasePrice)}
                </p>
              </div>

              {/* More Info Button */}
              <Link
                href={`/dashboard/deals/${deal.id}`}
                className="block w-full bg-gradient-to-r from-slate-900 to-blue-900 text-white py-2.5 px-4 rounded-lg font-medium hover:from-blue-900 hover:to-slate-900 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-xl text-center"
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
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 ring-4 ring-blue-300 animate-pulse">
                  <img
                    src={salesAgent.photo}
                    alt={salesAgent.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-0 right-0 w-8 h-8 bg-green-500 rounded-full border-4 border-white"></div>
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
              <div className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-lg p-4 mb-6 border border-blue-200">
                <p className="font-semibold text-gray-900 mb-2">
                  {salesAgent.name}
                </p>
                <p className="text-sm text-gray-600">{salesAgent.email}</p>
                <p className="text-sm text-gray-600">{salesAgent.phone}</p>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full bg-gradient-to-r from-slate-900 to-blue-900 text-white py-2.5 px-4 rounded-lg font-medium hover:from-blue-900 hover:to-slate-900 transition-all duration-300 transform hover:scale-105 shadow-md"
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
