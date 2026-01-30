"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

export default function DealsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

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
    },
  ];

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
        className={`mb-8 transition-all duration-700 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
        }`}
      >
        <h2 className="text-3xl font-bold text-gray-900">Available Deals</h2>
        <p className="text-gray-600 mt-2">
          Browse current investment opportunities
        </p>
      </div>

      {/* Deals Grid with stagger animation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {deals.map((deal, index) => (
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
              <div className="absolute top-3 right-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                NEW
              </div>
            </div>

            {/* Property Details */}
            <div className="p-5">
              {/* Address */}
              <h3 className="font-semibold text-lg text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">
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
                <p className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-purple-600 bg-clip-text text-transparent">
                  {formatPrice(deal.purchasePrice)}
                </p>
              </div>

              {/* More Info Button */}
              <button
                onClick={handleMoreInfo}
                className="w-full bg-gradient-to-r from-slate-900 to-purple-900 text-white py-2.5 px-4 rounded-lg font-medium hover:from-purple-900 hover:to-slate-900 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-xl"
              >
                Click for More Info
              </button>
            </div>
          </div>
        ))}
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
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 ring-4 ring-purple-300 animate-pulse">
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
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 mb-6 border border-purple-200">
                <p className="font-semibold text-gray-900 mb-2">
                  {salesAgent.name}
                </p>
                <p className="text-sm text-gray-600">{salesAgent.email}</p>
                <p className="text-sm text-gray-600">{salesAgent.phone}</p>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full bg-gradient-to-r from-slate-900 to-purple-900 text-white py-2.5 px-4 rounded-lg font-medium hover:from-purple-900 hover:to-slate-900 transition-all duration-300 transform hover:scale-105 shadow-md"
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

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}
