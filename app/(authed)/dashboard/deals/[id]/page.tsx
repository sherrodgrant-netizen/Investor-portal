"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getDealById } from "@/lib/mockDeals";
import { ComparableAverages } from "@/types/deal";
import PropertyMap from "@/components/PropertyMap";

export default function DealDetailPage() {
  const params = useParams();
  const dealId = params.id as string;
  const deal = getDealById(dealId);

  const [arv, setArv] = useState(deal?.arv || 0);
  const [estimatedRehab, setEstimatedRehab] = useState(
    deal?.rehab.estimatedRehabTotal || 0
  );
  const [showContractorModal, setShowContractorModal] = useState(false);

  // Calculate comparable averages
  const comparableAverages = useMemo((): ComparableAverages | null => {
    if (!deal || deal.comparables.length === 0) return null;

    const comps = deal.comparables;
    const avg = {
      beds: comps.reduce((sum, c) => sum + c.beds, 0) / comps.length,
      baths: comps.reduce((sum, c) => sum + c.baths, 0) / comps.length,
      sqft: Math.round(comps.reduce((sum, c) => sum + c.sqft, 0) / comps.length),
      yearBuilt: Math.round(
        comps.reduce((sum, c) => sum + c.yearBuilt, 0) / comps.length
      ),
      garageSize: "Mixed",
      lotSize: "Varies",
      notes: "Averages",
    };

    return avg;
  }, [deal]);

  if (!deal) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Deal not found</h2>
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

  const calculateProfit = () => {
    return (arv - estimatedRehab - deal.purchasePrice) * 0.98;
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "Turn Key":
        return "bg-green-100 text-green-800 border-green-200";
      case "Fair":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Needs Work":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div>
      {/* Back Link */}
      <div className="mb-6">
        <Link
          href="/dashboard/deals"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          <span>←</span> Back to Available Deals
        </Link>
      </div>

      {/* Hero Section - Split: Image & Map */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Left: Property Image */}
        <div className="relative h-96 lg:h-[500px] bg-gray-200 rounded-lg overflow-hidden shadow-lg">
          <Image
            src={deal.heroImage}
            alt={deal.address}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </div>

        {/* Right: Map with 2-mile radius */}
        <PropertyMap
          center={[deal.lng, deal.lat]}
          markers={[
            { lng: deal.lng, lat: deal.lat, label: "Subject Property", color: "#EF4444" },
          ]}
          radius={2}
          className="h-96 lg:h-[500px] rounded-lg shadow-lg"
        />
      </div>

      {/* Address & Quick Stats */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          {deal.address}
        </h1>
        <p className="text-lg text-gray-600 mb-4">
          {deal.city}, {deal.state} {deal.zip}
        </p>
        <div className="flex flex-wrap items-center gap-6 text-lg text-gray-700">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🛏️</span>
            <span>{deal.characteristics.beds} Beds</span>
          </div>
          <span className="text-gray-300">•</span>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🚿</span>
            <span>
              {deal.characteristics.baths} Baths
              {deal.characteristics.halfBaths > 0 &&
                ` + ${deal.characteristics.halfBaths} Half`}
            </span>
          </div>
          <span className="text-gray-300">•</span>
          <div className="flex items-center gap-2">
            <span className="text-2xl">📐</span>
            <span>{deal.characteristics.sqft.toLocaleString()} sqft</span>
          </div>
          <span className="text-gray-300">•</span>
          <div className="flex items-center gap-2">
            <span className="text-2xl">📅</span>
            <span>Built {deal.characteristics.yearBuilt}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Property Description */}
          <section className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Property Description
            </h2>
            <p className="text-gray-700 leading-relaxed">{deal.description}</p>
          </section>

          {/* Property Characteristics */}
          <section className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Property Characteristics
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Bedrooms</p>
                <p className="text-xl font-bold text-gray-900">
                  {deal.characteristics.beds}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Full Baths</p>
                <p className="text-xl font-bold text-gray-900">
                  {deal.characteristics.baths}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Half Baths</p>
                <p className="text-xl font-bold text-gray-900">
                  {deal.characteristics.halfBaths}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Square Feet</p>
                <p className="text-xl font-bold text-gray-900">
                  {deal.characteristics.sqft.toLocaleString()}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Year Built</p>
                <p className="text-xl font-bold text-gray-900">
                  {deal.characteristics.yearBuilt}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Home Type</p>
                <p className="text-xl font-bold text-gray-900">
                  {deal.characteristics.homeType}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Garage Size</p>
                <p className="text-xl font-bold text-gray-900">
                  {deal.characteristics.garageSize}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Garage Attached</p>
                <p className="text-xl font-bold text-gray-900">
                  {deal.characteristics.garageAttached ? "Yes" : "No"}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Lot Size</p>
                <p className="text-xl font-bold text-gray-900">
                  {deal.characteristics.lotSize}
                </p>
              </div>
            </div>
          </section>

          {/* Rehab Section */}
          <section className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Rehab</h2>

            {/* Condition Pill */}
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">Condition of House</p>
              <div
                className={`inline-block px-4 py-2 rounded-full border font-medium ${getConditionColor(
                  deal.rehab.condition
                )}`}
              >
                {deal.rehab.condition}
              </div>
            </div>

            {/* Rehab Details Grid */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Rehab Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">HVAC Age</p>
                  <p className="text-lg font-bold text-gray-900">
                    {deal.rehab.hvacAge} years
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Roof Age</p>
                  <p className="text-lg font-bold text-gray-900">
                    {deal.rehab.roofAge} years
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg col-span-1 md:col-span-2">
                  <p className="text-sm text-gray-600 mb-1">Foundation</p>
                  <p className="text-sm text-gray-700">
                    {deal.rehab.foundationNotes}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg col-span-1 md:col-span-2">
                  <p className="text-sm text-gray-600 mb-1">Electrical</p>
                  <p className="text-sm text-gray-700">
                    {deal.rehab.electricalNotes}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg col-span-1 md:col-span-2">
                  <p className="text-sm text-gray-600 mb-1">Plumbing</p>
                  <p className="text-sm text-gray-700">
                    {deal.rehab.plumbingNotes}
                  </p>
                </div>
              </div>
            </div>

            {/* Estimated Rehab Total */}
            <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-600 mb-1">Estimated Rehab Total</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatPrice(deal.rehab.estimatedRehabTotal)}
              </p>
            </div>

            {/* Contractor Button */}
            <button
              onClick={() => setShowContractorModal(true)}
              className="w-full bg-gradient-to-r from-slate-900 to-blue-900 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-900 hover:to-slate-900 transition-all duration-300 transform hover:scale-105 shadow-md"
            >
              Work with one of your verified contractors?
            </button>
          </section>

          {/* Comparables Section */}
          <section className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Comparables</h2>

            {/* Comparables Table */}
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      Address
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      Beds
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      Baths
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      Sqft
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      Year
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      Garage
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      Lot Size
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {deal.comparables.map((comp) => (
                    <tr key={comp.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {comp.address}
                      </td>
                      <td className="px-4 py-3 text-gray-700">{comp.beds}</td>
                      <td className="px-4 py-3 text-gray-700">{comp.baths}</td>
                      <td className="px-4 py-3 text-gray-700">
                        {comp.sqft.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-gray-700">{comp.yearBuilt}</td>
                      <td className="px-4 py-3 text-gray-700">{comp.garageSize}</td>
                      <td className="px-4 py-3 text-gray-700">{comp.lotSize}</td>
                      <td className="px-4 py-3 text-gray-600 text-xs">
                        {comp.notes}
                      </td>
                    </tr>
                  ))}
                  {/* Averages Row */}
                  {comparableAverages && (
                    <tr className="bg-blue-50 font-bold">
                      <td className="px-4 py-3 text-gray-900">Averages</td>
                      <td className="px-4 py-3 text-gray-900">
                        {comparableAverages.beds.toFixed(1)}
                      </td>
                      <td className="px-4 py-3 text-gray-900">
                        {comparableAverages.baths.toFixed(1)}
                      </td>
                      <td className="px-4 py-3 text-gray-900">
                        {comparableAverages.sqft.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-gray-900">
                        {comparableAverages.yearBuilt}
                      </td>
                      <td className="px-4 py-3 text-gray-900">
                        {comparableAverages.garageSize}
                      </td>
                      <td className="px-4 py-3 text-gray-900">
                        {comparableAverages.lotSize}
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-xs">
                        {comparableAverages.notes}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Comparables Map */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Subject & Comps Location
              </h3>
              <PropertyMap
                center={[deal.lng, deal.lat]}
                markers={[
                  {
                    lng: deal.lng,
                    lat: deal.lat,
                    label: "Subject",
                    color: "#EF4444",
                  },
                  ...deal.comparables.map((comp) => ({
                    lng: comp.lng,
                    lat: comp.lat,
                    label: comp.address,
                    color: "#3B82F6",
                  })),
                ]}
                className="h-96 rounded-lg shadow-md"
              />
            </div>

            {/* Comparable Photo Galleries */}
            <div className="space-y-8">
              <h3 className="text-lg font-semibold text-gray-900">
                Comparable Condition Photos
              </h3>
              {deal.comparables.map((comp) => (
                <div key={comp.id} className="border-t border-gray-200 pt-6">
                  <h4 className="text-md font-semibold text-gray-800 mb-4">
                    {comp.address}
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {comp.images.map((image, idx) => (
                      <div
                        key={idx}
                        className="relative h-48 bg-gray-200 rounded-lg overflow-hidden"
                      >
                        <Image
                          src={image}
                          alt={`${comp.address} - Photo ${idx + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 50vw, 33vw"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column - Profit Calculator (Sticky) */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 sticky top-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Profit Calculator
            </h2>

            <div className="space-y-4">
              {/* Purchase Price (Read-only) */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Purchase Price</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatPrice(deal.purchasePrice)}
                </p>
              </div>

              {/* ARV (Editable) */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <label
                  htmlFor="arv"
                  className="block text-sm text-gray-600 mb-2"
                >
                  After Repair Value (ARV)
                </label>
                <input
                  id="arv"
                  type="number"
                  value={arv}
                  onChange={(e) => setArv(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-lg font-semibold"
                />
              </div>

              {/* Estimated Rehab (Editable) */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <label
                  htmlFor="rehab"
                  className="block text-sm text-gray-600 mb-2"
                >
                  Estimated Rehab
                </label>
                <input
                  id="rehab"
                  type="number"
                  value={estimatedRehab}
                  onChange={(e) => setEstimatedRehab(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-lg font-semibold"
                />
              </div>
            </div>

            {/* Profit Display */}
            <div className="mt-6 border-t border-gray-200 pt-6">
              <div
                className={`p-6 rounded-lg transition-all duration-300 ${
                  calculateProfit() > 0
                    ? "bg-gradient-to-r from-green-500 to-emerald-500"
                    : "bg-gradient-to-r from-gray-400 to-gray-500"
                }`}
              >
                <p className="text-sm text-white mb-2">
                  Potential Profit (98% of net)
                </p>
                <p className="text-4xl font-bold text-white">
                  {formatPrice(calculateProfit())}
                </p>
              </div>

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

      {/* Contractor Modal */}
      {showContractorModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowContractorModal(false)}
        >
          <div
            className="bg-white rounded-lg shadow-2xl max-w-md w-full p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowContractorModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🛠️</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Verified Contractors
              </h3>
              <p className="text-gray-600 mb-6">
                We'll connect you with one of our verified contractors who can
                provide a detailed estimate for this property.
              </p>
              <button
                onClick={() => setShowContractorModal(false)}
                className="w-full bg-gradient-to-r from-slate-900 to-blue-900 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-900 hover:to-slate-900 transition-all duration-300"
              >
                Request Contractor Contact
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
