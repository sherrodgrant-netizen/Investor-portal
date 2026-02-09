"use client";

import { useState, useMemo, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ComparableAverages } from "@/types/deal";
import PropertyMap from "@/components/PropertyMap";
import ProfitCalculator, { InlineCalculatorContent } from "@/components/ProfitCalculator";
import ReadyToBuyOverlay from "@/components/ready-to-buy/ReadyToBuyOverlay";

// Deal type for API response
interface Deal {
  id: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  lat: number;
  lng: number;
  heroImage: string;
  purchasePrice: number;
  description: string;
  dropboxLink: string;
  characteristics: {
    beds: number;
    baths: number;
    halfBaths: number;
    sqft: number;
    yearBuilt: string;
    homeType: string;
    garageSize: string;
    garageAttached: boolean;
    lotSize: string;
  };
  rehab: {
    condition: string;
    roofAge: string;
    roofType: string;
    foundationNotes: string;
    hvacAge: string;
    hvacType: string;
    electricalNotes: string;
    plumbingNotes: string;
    estimatedRehabTotal: number;
  };
  arv: number;
  comparables: any[];
}

export default function DealDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dealId = params.id as string;

  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch deal from API
  useEffect(() => {
    async function fetchDeal() {
      try {
        const res = await fetch(`/api/deals/${dealId}`);
        if (!res.ok) {
          if (res.status === 404) {
            setError("Deal not found");
          } else {
            setError("Failed to load deal");
          }
          return;
        }
        const data = await res.json();
        setDeal(data.deal);
      } catch (err) {
        console.error("Failed to fetch deal:", err);
        setError("Failed to load deal");
      } finally {
        setLoading(false);
      }
    }

    if (dealId) {
      fetchDeal();
    }
  }, [dealId]);

  // Comp-based pricing calculations (uses ARV as fallback if no comparables)
  const compPrices = useMemo(() => {
    if (!deal) {
      return { min: 0, max: 0, avg: 0 };
    }
    // If we have comparables, use them
    if (deal.comparables && deal.comparables.length > 0) {
      const prices = deal.comparables.map((c: any) => c.salePrice);
      return {
        min: Math.min(...prices),
        max: Math.max(...prices),
        avg: Math.round(prices.reduce((sum: number, p: number) => sum + p, 0) / prices.length),
      };
    }
    // Fallback: use ARV with +/- 10% range
    const arv = deal.arv || deal.purchasePrice * 1.3;
    return {
      min: Math.round(arv * 0.9),
      max: Math.round(arv * 1.1),
      avg: Math.round(arv),
    };
  }, [deal]);

  // Enhanced calculator state
  const [assumedSalePrice, setAssumedSalePrice] = useState(0);
  const [closingCostPercent, setClosingCostPercent] = useState(2.0);
  const [rehabConfidence, setRehabConfidence] = useState<
    "conservative" | "realistic" | "aggressive"
  >("realistic");
  const [manualRehabOverride, setManualRehabOverride] = useState<number | null>(
    null
  );
  const [showContractorModal, setShowContractorModal] = useState(false);
  const [showAdvisorModal, setShowAdvisorModal] = useState(false);
  const [showAdvancedCalc, setShowAdvancedCalc] = useState(false);
  const [showReadyToBuy, setShowReadyToBuy] = useState(false);
  const [calcMode, setCalcMode] = useState<"flip" | "rental" | null>(null);
  const [isCalcExpanded, setIsCalcExpanded] = useState(false);
  const [calcContentVisible, setCalcContentVisible] = useState(false);

  // Initialize assumed sale price when deal loads or comp prices are calculated
  useEffect(() => {
    if (compPrices.avg > 0 && assumedSalePrice === 0) {
      setAssumedSalePrice(compPrices.avg);
    }
  }, [compPrices.avg, assumedSalePrice]);

  // Calculate rehab based on confidence
  const calculatedRehab = useMemo(() => {
    if (manualRehabOverride !== null) return manualRehabOverride;
    const baseRehab = deal?.rehab.estimatedRehabTotal || 0;
    switch (rehabConfidence) {
      case "conservative":
        return Math.round(baseRehab * 1.2); // +20%
      case "aggressive":
        return Math.round(baseRehab * 0.85); // -15%
      default:
        return baseRehab;
    }
  }, [deal, rehabConfidence, manualRehabOverride]);

  // Calculate comparable averages
  const comparableAverages = useMemo((): ComparableAverages | null => {
    if (!deal || !deal.comparables || deal.comparables.length === 0) return null;

    const comps = deal.comparables;
    const avg = {
      beds: comps.reduce((sum: number, c: any) => sum + c.beds, 0) / comps.length,
      baths: comps.reduce((sum: number, c: any) => sum + c.baths, 0) / comps.length,
      sqft: Math.round(comps.reduce((sum: number, c: any) => sum + c.sqft, 0) / comps.length),
      yearBuilt: Math.round(
        comps.reduce((sum: number, c: any) => sum + c.yearBuilt, 0) / comps.length
      ),
      garageSize: "Mixed",
      lotSize: "Varies",
      notes: "Averages",
    };

    return avg;
  }, [deal]);

  // Calculate profit range for confidence bar (moved before conditional returns)
  const profitRange = useMemo(() => {
    if (!deal) return { min: 0, max: 0 };
    const conservativeRehab = Math.round(
      (deal.rehab.estimatedRehabTotal || 0) * 1.2
    );
    const aggressiveRehab = Math.round(
      (deal.rehab.estimatedRehabTotal || 0) * 0.85
    );

    const minProfit =
      compPrices.min * (1 - closingCostPercent / 100) -
      deal.purchasePrice -
      conservativeRehab;
    const maxProfit =
      compPrices.max * (1 - closingCostPercent / 100) -
      deal.purchasePrice -
      aggressiveRehab;

    return { min: minProfit, max: maxProfit };
  }, [deal, compPrices, closingCostPercent]);

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Loading Deal...</h2>
        <p className="text-gray-600">Fetching details from Salesforce</p>
      </div>
    );
  }

  if (error || !deal) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{error || "Deal not found"}</h2>
        <Link
          href="/dashboard/deals"
          className="text-black hover:text-gray-700 underline"
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

  // New profit calculation with closing costs
  const calculateProfit = () => {
    if (!deal) return 0;
    const saleProceeds = assumedSalePrice * (1 - closingCostPercent / 100);
    return saleProceeds - deal.purchasePrice - calculatedRehab;
  };

  const getProfitZone = (profit: number) => {
    const dealSpread = compPrices.avg - (deal?.purchasePrice || 0);
    if (profit < dealSpread * 0.1) return "red";
    if (profit < dealSpread * 0.2) return "yellow";
    return "green";
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
          className="inline-flex items-center gap-2 text-black hover:text-gray-700 font-medium transition-colors"
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

            {/* Pictures Button - Links to Dropbox */}
            {deal.dropboxLink && (
              <a
                href={deal.dropboxLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 w-full inline-flex items-center justify-center gap-3 bg-black text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-md"
              >
                <span className="text-xl">📸</span>
                Pictures
              </a>
            )}
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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Roof Age</p>
                  <p className="text-xl font-bold text-gray-900">
                    {deal.rehab.roofAge} yrs
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Foundation</p>
                  <p className="text-xl font-bold text-gray-900">
                    {deal.rehab.foundationNotes}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">HVAC Age</p>
                  <p className="text-xl font-bold text-gray-900">
                    {deal.rehab.hvacAge} yrs
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Additional Info</p>
                  <p className="text-sm text-gray-700">
                    {[deal.rehab.electricalNotes, deal.rehab.plumbingNotes].filter(Boolean).join(". ")}
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
              className="w-full bg-black text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-md"
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
                      Price
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
                      <td className="px-4 py-3 text-gray-700 font-semibold">
                        {formatPrice(comp.salePrice)}
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-xs">
                        {comp.notes}
                      </td>
                    </tr>
                  ))}
                  {/* Averages Row */}
                  {comparableAverages && (
                    <tr className="bg-gray-100 font-bold">
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
                      <td className="px-4 py-3 text-gray-900 font-semibold">
                        {formatPrice(compPrices.avg)}
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
                    {comp.images && comp.images.length > 0 ? (
                      comp.images.map((image: string, idx: number) => (
                        <div
                          key={idx}
                          className="relative h-48 bg-gray-200 rounded-lg overflow-hidden"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={image}
                            alt={`${comp.address} - Photo ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm col-span-3">No photos available</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column - Sticky */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 space-y-4">
            <button
              onClick={() => setShowAdvisorModal(true)}
              className="w-full bg-black text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-800 transition-all"
            >
              Want more info?
            </button>

            {/* Deal Analysis */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Deal Analysis
              </h2>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    setCalcMode("flip");
                    setIsCalcExpanded(true);
                    setTimeout(() => setCalcContentVisible(true), 100);
                  }}
                  className="w-full bg-black text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-gray-800 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-all">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <span>Flip Analysis</span>
                  </div>
                  <svg className="w-5 h-5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <button
                  onClick={() => {
                    setCalcMode("rental");
                    setIsCalcExpanded(true);
                    setTimeout(() => setCalcContentVisible(true), 100);
                  }}
                  className="w-full bg-black text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-gray-800 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-all">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <span>Rental Analysis</span>
                  </div>
                  <svg className="w-5 h-5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Potential Flip Profit */}
            {deal && (() => {
              const estimatedProfit = compPrices.avg - deal.purchasePrice - (deal.rehab.estimatedRehabTotal || 0) - (compPrices.avg * 0.05) - (deal.purchasePrice * 0.02);
              return estimatedProfit > 0 ? (
                <div className="profit-glow bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 text-center cursor-pointer transition-all duration-300 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:border-green-400 active:shadow-[0_0_30px_rgba(16,185,129,0.6),0_0_60px_rgba(16,185,129,0.3)] active:scale-[1.02]">
                  <p className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-1">Estimated Flip Profit</p>
                  <p className="text-3xl font-bold text-green-700">{formatPrice(estimatedProfit)}</p>
                  <p className="text-xs text-gray-500 mt-1">Based on avg comp ARV of {formatPrice(compPrices.avg)}</p>
                </div>
              ) : null;
            })()}

            <button
              onClick={() => setShowReadyToBuy(true)}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-lg font-bold hover:from-green-700 hover:to-emerald-700 transition-all"
            >
              Ready to Buy
            </button>
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
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
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
                className="w-full bg-black text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-all duration-300"
              >
                Request Contractor Contact
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Diamond Advisor Modal (Reusable for both CTAs) */}
      {showAdvisorModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn"
          onClick={() => setShowAdvisorModal(false)}
        >
          <div
            className="bg-white rounded-lg shadow-2xl max-w-md w-full p-8 relative animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowAdvisorModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:rotate-90 transition-all duration-300 text-3xl"
            >
              ×
            </button>

            {/* Success Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center">
                <span className="text-3xl text-white">💎</span>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">
              Your Diamond Advisor Is Ready
            </h3>
            <p className="text-gray-600 mb-6 text-center">
              Let's discuss this opportunity and answer your questions.
            </p>

            {/* Sales Advisor Card */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6 border border-gray-200">
              {/* Advisor Photo */}
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 ring-4 ring-gray-300">
                    <img
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80"
                      alt="Sarah Johnson"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute bottom-0 right-0 w-6 h-6 bg-gray-400 rounded-full border-4 border-white"></div>
                </div>
              </div>

              {/* Advisor Info */}
              <div className="text-center mb-4">
                <p className="font-bold text-gray-900 text-lg">Sarah Johnson</p>
                <p className="text-sm text-gray-600">Senior Investment Advisor</p>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-center justify-center gap-2">
                  <span>📧</span>
                  <a
                    href="mailto:sarah.johnson@diamondacquisitions.com"
                    className="text-black hover:underline"
                  >
                    sarah.johnson@diamondacquisitions.com
                  </a>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span>📞</span>
                  <a
                    href="tel:+15125550123"
                    className="text-black hover:underline"
                  >
                    (512) 555-0123
                  </a>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <a
                href="tel:+15125550123"
                className="block w-full bg-black text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-md text-center"
              >
                📞 Call Now
              </a>
              <a
                href="mailto:sarah.johnson@diamondacquisitions.com"
                className="block w-full bg-gray-800 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 shadow-md text-center"
              >
                📧 Email Advisor
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Modal Animations */}
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

        @keyframes slideInLeft {
          from {
            transform: translateX(-60px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideInRight {
          from {
            transform: translateX(60px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }

        .animate-slideInLeft {
          animation: slideInLeft 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .animate-slideInRight {
          animation: slideInRight 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>

      {/* ====== READY TO BUY OVERLAY ====== */}
      {showReadyToBuy && deal && (
        <ReadyToBuyOverlay
          dealId={dealId}
          address={deal.address}
          city={deal.city}
          state={deal.state}
          zip={deal.zip}
          purchasePrice={deal.purchasePrice}
          onClose={() => setShowReadyToBuy(false)}
        />
      )}

      {/* ====== DEAL ANALYSIS COMPARISON OVERLAY ====== */}
      {isCalcExpanded && calcMode && deal && (
        <div
          className="fixed inset-0 z-50 flex items-stretch animate-fadeIn"
          style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          {/* Close button */}
          <button
            onClick={() => {
              setCalcContentVisible(false);
              setTimeout(() => {
                setIsCalcExpanded(false);
                setCalcMode(null);
              }, 150);
            }}
            className="absolute top-6 right-6 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="w-full h-full grid grid-cols-2 gap-0 p-6 pt-16">
            {/* LEFT SIDE — Deal Data (Purchase Price, Rehab, Comps) */}
            <div className="overflow-y-auto pr-4 animate-slideInLeft" style={{ scrollbarWidth: 'thin' }}>
              <div className="space-y-5 max-w-2xl mx-auto">
                {/* Purchase Price Hero */}
                <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
                  <h3 className="text-sm text-gray-500 uppercase tracking-wide mb-2">Purchase Price</h3>
                  <p className="text-4xl font-bold text-gray-900">{formatPrice(deal.purchasePrice)}</p>
                  <div className="grid grid-cols-5 gap-2 mt-4">
                    <div className="p-2 bg-gray-50 rounded-lg text-center">
                      <p className="text-xs text-gray-500">Beds</p>
                      <p className="text-sm font-bold text-gray-900">{deal.characteristics.beds}</p>
                    </div>
                    <div className="p-2 bg-gray-50 rounded-lg text-center">
                      <p className="text-xs text-gray-500">Baths</p>
                      <p className="text-sm font-bold text-gray-900">{deal.characteristics.baths}</p>
                    </div>
                    <div className="p-2 bg-gray-50 rounded-lg text-center">
                      <p className="text-xs text-gray-500">Sqft</p>
                      <p className="text-sm font-bold text-gray-900">{deal.characteristics.sqft.toLocaleString()}</p>
                    </div>
                    <div className="p-2 bg-gray-50 rounded-lg text-center">
                      <p className="text-xs text-gray-500">Lot</p>
                      <p className="text-sm font-bold text-gray-900">{deal.characteristics.lotSize || "—"}</p>
                    </div>
                    <div className="p-2 bg-gray-50 rounded-lg text-center">
                      <p className="text-xs text-gray-500">Built</p>
                      <p className="text-sm font-bold text-gray-900">{deal.characteristics.yearBuilt || "—"}</p>
                    </div>
                  </div>
                </div>

                {/* Rehab */}
                <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm text-gray-500 uppercase tracking-wide">Rehab Estimate</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getConditionColor(deal.rehab.condition)}`}>
                      {deal.rehab.condition}
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-blue-600 mb-4">{formatPrice(deal.rehab.estimatedRehabTotal)}</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500">Roof Age</p>
                      <p className="text-sm font-bold text-gray-900">{deal.rehab.roofAge} yrs</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500">Foundation</p>
                      <p className="text-sm font-bold text-gray-900">{deal.rehab.foundationNotes}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500">HVAC Age</p>
                      <p className="text-sm font-bold text-gray-900">{deal.rehab.hvacAge} yrs</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500">Additional</p>
                      <p className="text-xs text-gray-700">{[deal.rehab.electricalNotes, deal.rehab.plumbingNotes].filter(Boolean).join(". ")}</p>
                    </div>
                  </div>
                </div>

                {/* Comparables */}
                <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
                  <h3 className="text-sm text-gray-500 uppercase tracking-wide mb-4">Comparables</h3>
                  <div className="space-y-3">
                    {deal.comparables.map((comp) => (
                      <div key={comp.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{comp.address}</p>
                          <p className="text-xs text-gray-500">{comp.beds}bd / {comp.baths}ba / {comp.sqft.toLocaleString()} sqft</p>
                        </div>
                        <p className="text-lg font-bold text-gray-900">{formatPrice(comp.salePrice)}</p>
                      </div>
                    ))}
                    {/* Averages */}
                    <div className="flex items-center justify-between p-3 bg-black text-white rounded-lg">
                      <div>
                        <p className="text-sm font-medium">Average Comp Price</p>
                      </div>
                      <p className="text-lg font-bold">{formatPrice(compPrices.avg)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE — Calculator */}
            <div className="overflow-y-auto pl-4 animate-slideInRight" style={{ scrollbarWidth: 'thin' }}>
              <div className="max-w-2xl mx-auto bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
                <InlineCalculatorContent
                  purchasePrice={deal.purchasePrice}
                  estimatedRehab={deal.rehab?.estimatedRehabTotal || 0}
                  arv={deal.arv || deal.purchasePrice * 1.3}
                  arvRange={compPrices}
                  annualTaxes={Math.round(deal.purchasePrice * 0.02)}
                  mode={calcMode}
                  onBack={() => {
                    setCalcContentVisible(false);
                    setTimeout(() => {
                      setIsCalcExpanded(false);
                      setCalcMode(null);
                    }, 150);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
