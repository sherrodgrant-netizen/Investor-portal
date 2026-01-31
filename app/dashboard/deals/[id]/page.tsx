"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function DealDetailPage() {
  const params = useParams();
  const dealId = parseInt(params.id as string);
  const [rehabCost, setRehabCost] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // This would ideally come from a database or API
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
    },
  ];

  const deal = deals.find((d) => d.id === dealId);

  if (!deal) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Deal not found
        </h2>
        <Link
          href="/dashboard/deals"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          Back to Available Deals
        </Link>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Calculate potential profit: (ARV - rehab - purchase price) * 0.98
  const calculateProfit = () => {
    const rehab = parseFloat(rehabCost) || 0;
    const profit = (deal.arv - rehab - deal.purchasePrice) * 0.98;
    return profit;
  };

  const potentialProfit = calculateProfit();

  return (
    <div>
      {/* Back Button */}
      <div
        className={`mb-6 transition-all duration-700 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
        }`}
      >
        <Link
          href="/dashboard/deals"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          <span>←</span> Back to Available Deals
        </Link>
      </div>

      {/* Property Image */}
      <div
        className={`relative h-96 w-full bg-gray-200 rounded-lg overflow-hidden mb-8 shadow-lg transition-all duration-700 delay-100 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <Image
          src={deal.image}
          alt={deal.address}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
      </div>

      {/* Property Header */}
      <div
        className={`mb-8 transition-all duration-700 delay-200 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {deal.address}
        </h1>
        <div className="flex items-center gap-4 text-lg text-gray-600">
          <span>🛏️ {deal.beds} Beds</span>
          <span>•</span>
          <span>🚿 {deal.baths} Baths</span>
          <span>•</span>
          <span>📐 {deal.sqft.toLocaleString()} sqft</span>
          <span>•</span>
          <span>📅 Built {deal.yearBuilt}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div
            className={`bg-white rounded-lg shadow-md p-6 border border-gray-200 transition-all duration-700 delay-300 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Property Description
            </h2>
            <p className="text-gray-700 leading-relaxed">{deal.description}</p>
          </div>

          {/* Property Specifications */}
          <div
            className={`bg-white rounded-lg shadow-md p-6 border border-gray-200 transition-all duration-700 delay-400 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Property Specifications
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Bedrooms</p>
                <p className="text-xl font-bold text-gray-900">{deal.beds}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Bathrooms</p>
                <p className="text-xl font-bold text-gray-900">{deal.baths}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Square Feet</p>
                <p className="text-xl font-bold text-gray-900">
                  {deal.sqft.toLocaleString()}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Year Built</p>
                <p className="text-xl font-bold text-gray-900">
                  {deal.yearBuilt}
                </p>
              </div>
            </div>
          </div>

          {/* Rehab Details */}
          <div
            className={`bg-white rounded-lg shadow-md p-6 border border-gray-200 transition-all duration-700 delay-500 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Rehab Details
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Roof Age</p>
                <p className="text-xl font-bold text-gray-900">
                  {deal.roofAge} {deal.roofAge === 1 ? "year" : "years"}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">HVAC Age</p>
                <p className="text-xl font-bold text-gray-900">
                  {deal.hvacAge} {deal.hvacAge === 1 ? "year" : "years"}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg col-span-2">
                <p className="text-sm text-gray-600 mb-1">
                  Foundation Repair Needed
                </p>
                <p
                  className={`text-xl font-bold ${
                    deal.foundationRepair ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {deal.foundationRepair ? "Yes" : "No"}
                </p>
              </div>
            </div>
          </div>

          {/* Dropbox Link */}
          <div
            className={`bg-white rounded-lg shadow-md p-6 border border-gray-200 transition-all duration-700 delay-600 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Property Photos
            </h2>
            <a
              href={deal.dropboxLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-slate-900 to-blue-900 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-900 hover:to-slate-900 transition-all duration-300 transform hover:scale-105 shadow-md"
            >
              <span>📁</span>
              View Photos on Dropbox
            </a>
          </div>
        </div>

        {/* Right Column - Financial Calculator */}
        <div className="lg:col-span-1">
          <div
            className={`bg-white rounded-lg shadow-md p-6 border border-gray-200 sticky top-8 transition-all duration-700 delay-700 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Profit Calculator
            </h2>

            {/* Financial Breakdown */}
            <div className="space-y-4 mb-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Purchase Price</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatPrice(deal.purchasePrice)}
                </p>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-600 mb-1">
                  After Repair Value (ARV)
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatPrice(deal.arv)}
                </p>
              </div>

              {/* Rehab Cost Input */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <label
                  htmlFor="rehabCost"
                  className="text-sm text-gray-600 mb-2 block"
                >
                  Estimated Rehab Cost
                </label>
                <input
                  id="rehabCost"
                  type="number"
                  value={rehabCost}
                  onChange={(e) => setRehabCost(e.target.value)}
                  placeholder="Enter rehab cost"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-lg font-semibold"
                />
              </div>
            </div>

            {/* Profit Calculation */}
            <div className="border-t border-gray-200 pt-6">
              <div
                className={`p-6 rounded-lg transition-all duration-300 ${
                  potentialProfit > 0
                    ? "bg-gradient-to-r from-green-500 to-emerald-500"
                    : "bg-gradient-to-r from-gray-400 to-gray-500"
                }`}
              >
                <p className="text-sm text-white mb-2">
                  Potential Profit (98% of net)
                </p>
                <p className="text-4xl font-bold text-white">
                  {formatPrice(potentialProfit)}
                </p>
              </div>

              {/* Formula Explanation */}
              <div className="mt-4 p-4 bg-blue-50 rounded-lg text-sm text-gray-600">
                <p className="font-semibold mb-2">Formula:</p>
                <p className="font-mono text-xs">
                  (ARV - Rehab - Purchase Price) × 0.98
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
