"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

// Metro counties structure
const METRO_COUNTIES = {
  "DFW Metroplex": [
    "Dallas County",
    "Tarrant County",
    "Collin County",
    "Denton County",
    "Rockwall County",
    "Kaufman County",
    "Ellis County",
    "Johnson County",
    "Parker County",
    "Wise County",
    "Hood County",
  ],
  "Austin Metro": [
    "Travis County",
    "Williamson County",
    "Hays County",
    "Bastrop County",
    "Caldwell County",
  ],
  "San Antonio Metro": [
    "Bexar County",
    "Comal County",
    "Guadalupe County",
    "Wilson County",
    "Medina County",
    "Kendall County",
    "Atascosa County",
  ],
  "Houston Metro": [
    "Harris County",
    "Fort Bend County",
    "Montgomery County",
    "Brazoria County",
    "Galveston County",
    "Liberty County",
    "Chambers County",
    "Waller County",
    "Austin County",
  ],
};

export default function SignUpPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Basic Information
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Step 2: Investment Preferences
  const [selectedCounties, setSelectedCounties] = useState<string[]>([]);
  const [expandedMetros, setExpandedMetros] = useState<string[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [assetClasses, setAssetClasses] = useState<string[]>([]);
  const [priceMin, setPriceMin] = useState(10000);
  const [priceMax, setPriceMax] = useState(500000);
  const [capitalTypes, setCapitalTypes] = useState<string[]>([]);
  const [investSolo, setInvestSolo] = useState("");
  const [notificationPref, setNotificationPref] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");

  // Step 3: NDA
  const [ndaSigned, setNdaSigned] = useState(false);
  const [showNdaModal, setShowNdaModal] = useState(false);

  // Options
  const assetClassOptions = [
    "Single Family Home (1-4)",
    "Multifamily",
    "Commercial",
    "Land",
    "Storage",
  ];

  const formatPrice = (val: number, isMax = false) => {
    if (isMax && val >= 1000000) return "$1M+";
    if (val >= 1000000) return `$${(val / 1000000).toFixed(val % 1000000 === 0 ? 0 : 1)}M`;
    return `$${(val / 1000).toFixed(0)}k`;
  };

  const capitalTypeOptions = [
    "Cash",
    "Hard Money",
    "Private Money",
  ];

  // Validation
  const step1Complete = useMemo(() => {
    return (
      firstName.trim() !== "" &&
      lastName.trim() !== "" &&
      email.trim() !== "" &&
      phone.trim() !== ""
    );
  }, [firstName, lastName, email, phone]);

  const step2Complete = useMemo(() => {
    return (
      selectedCounties.length > 0 &&
      assetClasses.length > 0 &&
      priceMin < priceMax &&
      capitalTypes.length > 0 &&
      investSolo !== "" &&
      notificationPref !== "" &&
      additionalNotes.trim() !== ""
    );
  }, [
    selectedCounties,
    assetClasses,
    priceMin,
    priceMax,
    capitalTypes,
    investSolo,
    notificationPref,
    additionalNotes,
  ]);

  // County selection helpers
  const toggleMetro = (metro: string) => {
    setExpandedMetros((prev) =>
      prev.includes(metro) ? prev.filter((m) => m !== metro) : [...prev, metro]
    );
  };

  const toggleCounty = (county: string) => {
    setSelectedCounties((prev) =>
      prev.includes(county)
        ? prev.filter((c) => c !== county)
        : [...prev, county]
    );
  };

  const selectEntireMetro = (metro: string) => {
    const counties = METRO_COUNTIES[metro as keyof typeof METRO_COUNTIES];
    const allSelected = counties.every((c) => selectedCounties.includes(c));

    if (allSelected) {
      setSelectedCounties((prev) => prev.filter((c) => !counties.includes(c)));
    } else {
      setSelectedCounties((prev) => [
        ...new Set([...prev, ...counties]),
      ]);
    }
  };

  const isMetroFullySelected = (metro: string) => {
    const counties = METRO_COUNTIES[metro as keyof typeof METRO_COUNTIES];
    return counties.every((c) => selectedCounties.includes(c));
  };

  const isMetroPartiallySelected = (metro: string) => {
    const counties = METRO_COUNTIES[metro as keyof typeof METRO_COUNTIES];
    const someSelected = counties.some((c) => selectedCounties.includes(c));
    const allSelected = counties.every((c) => selectedCounties.includes(c));
    return someSelected && !allSelected;
  };

  const removeCounty = (county: string) => {
    setSelectedCounties((prev) => prev.filter((c) => c !== county));
  };

  const toggleAssetClass = (assetClass: string) => {
    setAssetClasses((prev) =>
      prev.includes(assetClass)
        ? prev.filter((a) => a !== assetClass)
        : [...prev, assetClass]
    );
  };

  const toggleCapitalType = (capitalType: string) => {
    setCapitalTypes((prev) =>
      prev.includes(capitalType)
        ? prev.filter((c) => c !== capitalType)
        : [...prev, capitalType]
    );
  };

  const handleSignNda = () => {
    // In production, this would open PandaDoc modal
    setShowNdaModal(true);
  };

  const handleNdaComplete = () => {
    setNdaSigned(true);
    setShowNdaModal(false);
    setCurrentStep(4);
  };

  const handleFinalSubmit = async () => {
    // Create account and redirect to dashboard
    router.push("/dashboard");
  };

  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        {[1, 2, 3, 4, 5].map((step) => (
          <div key={step} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                currentStep >= step
                  ? "bg-black text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {step}
            </div>
            {step < 5 && (
              <div
                className={`h-1 w-12 md:w-24 transition-all ${
                  currentStep > step ? "bg-black" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <div className="text-center mt-4">
        <p className="text-sm text-gray-600 font-medium">
          Step {currentStep} of 5
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-black text-white shadow-lg">
        <div className="px-6 py-4 flex items-center gap-3">
          <Image
            src="/diamond logo.svg"
            alt="Diamond Acquisitions"
            width={40}
            height={40}
            className="w-10 h-10 brightness-0 invert"
          />
          <h1 className="text-xl font-semibold">
            Diamond Acquisitions – Investor Portal
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          {renderStepIndicator()}

          <div className="bg-white rounded-lg shadow-xl p-8 border border-gray-200">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Create Your Account
                </h2>
                <p className="text-gray-600 mb-8">
                  Let's start with some basic information
                </p>

                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white text-gray-900"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white text-gray-900"
                        placeholder="Smith"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white text-gray-900"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white text-gray-900"
                      placeholder="(555) 123-4567"
                    />
                  </div>

                </div>

                <div className="mt-8 flex justify-between">
                  <Link
                    href="/login"
                    className="text-gray-600 hover:text-black font-medium"
                  >
                    ← Back to Login
                  </Link>
                  <button
                    onClick={() => setCurrentStep(2)}
                    disabled={!step1Complete}
                    className="bg-black text-white py-3 px-8 rounded-lg font-semibold hover:bg-gray-800 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Investment Preferences */}
            {currentStep === 2 && (
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Investment Preferences
                </h2>
                <p className="text-gray-600 mb-8">
                  Help us match you with the right opportunities
                </p>

                <div className="space-y-6">
                  {/* Counties */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Location Preferences <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white text-left flex items-center justify-between"
                      >
                        <span className="text-gray-700">
                          {selectedCounties.length === 0
                            ? "Select counties or metros..."
                            : `${selectedCounties.length} county(ies) selected`}
                        </span>
                        <svg
                          className={`w-5 h-5 transition-transform ${
                            dropdownOpen ? "rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>

                      {dropdownOpen && (
                        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-96 overflow-y-auto">
                          {Object.entries(METRO_COUNTIES).map(([metro, counties]) => (
                            <div key={metro} className="border-b border-gray-200 last:border-b-0">
                              <div
                                onClick={() => toggleMetro(metro)}
                                className="flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 cursor-pointer"
                              >
                                <div className="flex items-center gap-2">
                                  <svg
                                    className={`w-4 h-4 transition-transform text-gray-500 ${
                                      expandedMetros.includes(metro) ? "rotate-90" : ""
                                    }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M9 5l7 7-7 7"
                                    />
                                  </svg>
                                  <span className="font-semibold text-gray-900">{metro}</span>
                                  {isMetroPartiallySelected(metro) && (
                                    <span className="text-xs text-black">(partial)</span>
                                  )}
                                </div>
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); selectEntireMetro(metro); }}
                                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                                    isMetroFullySelected(metro)
                                      ? "bg-black text-white"
                                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                  }`}
                                >
                                  {isMetroFullySelected(metro) ? "Deselect All" : "Select All"}
                                </button>
                              </div>

                              {expandedMetros.includes(metro) && (
                                <div className="bg-gray-50 px-3 py-2">
                                  {counties.map((county) => (
                                    <label
                                      key={county}
                                      className="flex items-center gap-2 py-2 px-3 hover:bg-white rounded cursor-pointer"
                                    >
                                      <input
                                        type="checkbox"
                                        checked={selectedCounties.includes(county)}
                                        onChange={() => toggleCounty(county)}
                                        className="w-4 h-4 text-black rounded focus:ring-2 focus:ring-gray-500"
                                      />
                                      <span className="text-sm text-gray-700">{county}</span>
                                    </label>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {selectedCounties.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {selectedCounties.map((county) => (
                          <div
                            key={county}
                            className="flex items-center gap-2 bg-gray-100 text-gray-800 px-3 py-1.5 rounded-full text-sm font-medium"
                          >
                            <span>{county}</span>
                            <button
                              onClick={() => removeCounty(county)}
                              className="text-black hover:text-gray-700 font-bold"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Asset Class */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Asset Class <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {assetClassOptions.map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => toggleAssetClass(option)}
                          className={`py-3 px-4 rounded-lg font-medium transition-all ${
                            assetClasses.includes(option)
                              ? "bg-black text-white shadow-md"
                              : "bg-white text-gray-700 border-2 border-gray-200 hover:border-black"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Purchase Price Range <span className="text-red-500">*</span>
                    </label>
                    <div className="bg-white border border-gray-300 rounded-lg p-5">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-bold text-green-700">{formatPrice(priceMin)}</span>
                        <span className="text-sm text-gray-400">to</span>
                        <span className="text-lg font-bold text-green-700">{formatPrice(priceMax, true)}</span>
                      </div>
                      <div className="relative h-2 mb-2">
                        <div className="absolute inset-0 bg-gray-200 rounded-full" />
                        <div
                          className="absolute h-full bg-green-500 rounded-full"
                          style={{
                            left: `${((priceMin - 10000) / 990000) * 100}%`,
                            right: `${100 - ((priceMax - 10000) / 990000) * 100}%`,
                          }}
                        />
                        <input
                          type="range"
                          min={10000}
                          max={1000000}
                          step={10000}
                          value={priceMin}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            if (val < priceMax) setPriceMin(val);
                          }}
                          style={{ zIndex: priceMin > 900000 ? 5 : 3 }}
                          className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-green-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:pointer-events-auto"
                        />
                        <input
                          type="range"
                          min={10000}
                          max={1000000}
                          step={10000}
                          value={priceMax}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            if (val > priceMin) setPriceMax(val);
                          }}
                          style={{ zIndex: 4 }}
                          className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-green-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:pointer-events-auto"
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>$10k</span>
                        <span>$250k</span>
                        <span>$500k</span>
                        <span>$750k</span>
                        <span>$1M+</span>
                      </div>
                    </div>
                  </div>

                  {/* Capital Type */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Capital Type <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {capitalTypeOptions.map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => toggleCapitalType(option)}
                          className={`py-3 px-4 rounded-lg font-medium transition-all ${
                            capitalTypes.includes(option)
                              ? "bg-black text-white shadow-md"
                              : "bg-white text-gray-700 border-2 border-gray-200 hover:border-black"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Invest Solo */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Do you invest solo or with partners? <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={investSolo}
                      onChange={(e) => setInvestSolo(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white text-gray-900"
                    >
                      <option value="">Select...</option>
                      <option value="solo">Solo</option>
                      <option value="partners">With Partners</option>
                    </select>
                  </div>

                  {/* Notification Preference */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Notification Preferences <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={notificationPref}
                      onChange={(e) => setNotificationPref(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white text-gray-900"
                    >
                      <option value="">Select notification preference...</option>
                      <option value="matched">Only receive deals in my counties selected</option>
                      <option value="all">All deals</option>
                    </select>
                  </div>

                  {/* Additional Notes */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Anything else we should know about what you're looking for?{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={additionalNotes}
                      onChange={(e) => setAdditionalNotes(e.target.value)}
                      rows={4}
                      placeholder="Share any additional preferences or requirements..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent resize-none"
                    />
                  </div>
                </div>

                <div className="mt-8 flex justify-between">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="text-gray-600 hover:text-black font-medium"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => setCurrentStep(3)}
                    disabled={!step2Complete}
                    className="bg-black text-white py-3 px-8 rounded-lg font-semibold hover:bg-gray-800 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: NDA Signing */}
            {currentStep === 3 && (
              <div>
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl">📄</span>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Sign the NDA
                  </h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    Before accessing our premium investment opportunities, we need you to review and sign our Non-Disclosure Agreement. This protects both parties and ensures confidentiality.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-8 border-2 border-gray-200 mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Your Information
                  </h3>
                  <div className="space-y-2 text-gray-700">
                    <p>
                      <strong>Name:</strong> {firstName} {lastName}
                    </p>
                    <p>
                      <strong>Email:</strong> {email}
                    </p>
                    <p>
                      <strong>Date:</strong> {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {!ndaSigned ? (
                  <>
                    <p className="text-gray-600 mb-6 text-center">
                      Click the button below to review and sign the NDA using PandaDoc
                    </p>
                    <button
                      onClick={handleSignNda}
                      className="w-full bg-black text-white py-4 px-8 rounded-lg font-bold text-lg hover:bg-gray-800 transition-all shadow-lg"
                    >
                      Review & Sign NDA
                    </button>
                  </>
                ) : (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl text-white">✓</span>
                    </div>
                    <p className="text-green-600 font-semibold text-lg">
                      NDA Successfully Signed!
                    </p>
                  </div>
                )}

                <div className="mt-8 flex justify-between">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="text-gray-600 hover:text-black font-medium"
                  >
                    ← Back
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Confirmation */}
            {currentStep === 4 && (
              <div className="-m-8 overflow-hidden">
                {/* Hero Banner */}
                <div className="bg-black text-white py-14 px-8 text-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-5">
                    <Image
                      src="/DIAMOND_LOGO_TRANSPARENT2.png"
                      alt=""
                      width={400}
                      height={400}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 invert"
                    />
                  </div>
                  <div className="relative z-10">
                    <Image
                      src="/DIAMOND_ACQUISITIONS_CROPPED.png"
                      alt="Diamond Acquisitions"
                      width={220}
                      height={60}
                      className="mx-auto mb-6"
                    />
                    <h2 className="text-4xl md:text-5xl font-black mb-3 tracking-tight">
                      Congratulations, {firstName}
                    </h2>
                    <p className="text-gray-400 text-lg">
                      You now have full access to the Diamond Acquisitions investor platform.
                    </p>
                  </div>
                </div>

                {/* 3 Feature Cards */}
                <div className="p-8">
                  <div className="grid md:grid-cols-3 gap-5 max-w-3xl mx-auto mb-10">
                    <div className="p-5 rounded-lg border border-gray-200 hover:border-black transition-colors">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">Meet Your Advisor</h3>
                      <p className="text-sm text-gray-500">A dedicated advisor assigned to guide your investments</p>
                    </div>
                    <div className="p-5 rounded-lg border border-gray-200 hover:border-black transition-colors">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">Exclusive Deals</h3>
                      <p className="text-sm text-gray-500">Off-market properties matched to your criteria</p>
                    </div>
                    <div className="p-5 rounded-lg border border-gray-200 hover:border-black transition-colors">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">Advanced Calculation Tools</h3>
                      <p className="text-sm text-gray-500">Flip, rental, and DSCR analysis at your fingertips</p>
                    </div>
                  </div>

                  <div className="text-center">
                    <button
                      onClick={() => setCurrentStep(5)}
                      className="bg-black text-white py-3 px-10 rounded-lg font-semibold hover:bg-gray-800 transition-all"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Sales Advisor Assignment */}
            {currentStep === 5 && (
              <div className="-m-8 overflow-hidden">
                <div className="bg-black py-8 px-8 text-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-5">
                    <Image
                      src="/DIAMOND_LOGO_TRANSPARENT2.png"
                      alt=""
                      width={300}
                      height={300}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 invert"
                    />
                  </div>
                  <div className="relative z-10">
                    <Image
                      src="/DIAMOND_ACQUISITIONS_CROPPED.png"
                      alt="Diamond Acquisitions"
                      width={180}
                      height={50}
                      className="mx-auto mb-3"
                    />
                    <h2 className="text-3xl font-bold text-white mb-2">
                      Your Sales Advisor
                    </h2>
                    <p className="text-gray-400">
                      Your point of contact for all investment opportunities
                    </p>
                  </div>
                </div>

                <div className="p-8">

                <div className="max-w-sm mx-auto text-center mb-10">
                  <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-200 mx-auto mb-4">
                    <img
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80"
                      alt="Sarah Johnson"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Sarah Johnson</h3>
                  <p className="text-sm text-gray-500 mb-4">Senior Investment Advisor</p>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p>(512) 555-0123</p>
                    <p>sarah.johnson@diamondacquisitions.com</p>
                  </div>
                </div>

                <div className="max-w-md mx-auto bg-gray-50 rounded-lg p-4 mb-10 border border-gray-200 text-center">
                  <p className="text-sm text-gray-700">
                    {(() => {
                      const now = new Date();
                      const ct = new Date(now.toLocaleString("en-US", { timeZone: "America/Chicago" }));
                      const hour = ct.getHours();
                      return hour < 18
                        ? "Your sales advisor will reach out within the next hour on the next steps."
                        : "Your sales advisor will reach out by 10:00 AM tomorrow on the next steps.";
                    })()}
                  </p>
                </div>

                <div className="text-center">
                  <button
                    onClick={handleFinalSubmit}
                    className="bg-black text-white py-3 px-10 rounded-lg font-semibold hover:bg-gray-800 transition-all"
                  >
                    Enter Your Dashboard
                  </button>
                </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PandaDoc-Style NDA Modal */}
      {showNdaModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
          onClick={() => setShowNdaModal(false)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden relative flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* PandaDoc-style Header */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white px-8 py-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📄</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold">Affiliated Business Agreement and Disclosure</h2>
                  <p className="text-sm text-gray-300">Diamond Acquisitions LLC</p>
                </div>
              </div>
              <button
                onClick={() => setShowNdaModal(false)}
                className="text-gray-300 hover:text-white text-3xl transition-colors"
              >
                ×
              </button>
            </div>

            {/* Status Bar */}
            <div className="bg-yellow-50 border-b-2 border-yellow-200 px-8 py-3">
              <div className="flex items-center gap-2">
                <span className="text-yellow-600 text-lg">⚠️</span>
                <p className="text-sm font-semibold text-yellow-800">
                  Action Required: Please review and sign this document to continue
                </p>
              </div>
            </div>

            {/* Document Content */}
            <div className="flex-1 overflow-y-auto px-8 py-6 bg-gray-50">
              <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-10 border border-gray-200">
                {/* Document Header */}
                <div className="text-center mb-8 pb-6 border-b-2 border-gray-900">
                  <h1 className="text-3xl font-black text-gray-900 mb-1">DIAMOND</h1>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">ACQUISITIONS</h2>
                  <h3 className="text-lg font-bold text-gray-900 mt-4">
                    AFFILIATED BUSINESS AGREEMENT AND DISCLOSURE
                  </h3>
                  <p className="text-sm text-gray-500 mt-2">Document ID: NDA-{new Date().getFullYear()}-{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}</p>
                </div>

                {/* Intro */}
                <div className="mb-8 text-gray-700 leading-relaxed">
                  <p>
                    By placing their signature at the bottom of this document, the undersigned real estate investor
                    (&ldquo;<strong>Investor</strong>&rdquo;) confirms their agreement, acknowledgement, and understanding of the disclosure
                    provided below.
                  </p>
                </div>

                {/* Agreement Content */}
                <div className="space-y-6 mb-8 text-gray-700 leading-relaxed">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <span className="bg-black text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">1</span>
                      Affiliated Entities
                    </h3>
                    <p className="pl-9">
                      Investor acknowledges that a relationship and common ownership exists between Diamond Acquisitions and DACQ Inc.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <span className="bg-black text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">2</span>
                      Investment Information Disclaimer
                    </h3>
                    <p className="pl-9">
                      Investor acknowledges that Diamond Acquisitions is actively engaged in investment real estate transactions. It is the sole and absolute responsibility of the Investor to diligently conduct their own research and investigation with regards to any potential real property purchase. Any information provided by an associate, representative, independent contractor, or employee of Diamond Acquisitions is intended for informational purposes only and should not be solely relied upon for making purchase or sale decisions as information provided may not be accurate. Information pertaining to real estate is constantly evolving. Investing is speculative in nature and involves risk of loss.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <span className="bg-black text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">3</span>
                      No Agency &amp; Indemnification
                    </h3>
                    <p className="pl-9">
                      Investor acknowledges that no representative, associate, independent contractor, or employee of Diamond Acquisitions shall act on behalf of the Investor in any capacity. The Investor is solely responsible for conducting its own due diligence in all business dealings. Furthermore, the Investor acknowledges that if it was introduced to Diamond Acquisitions by a third-party, it shall defend, indemnify, and hold Diamond Acquisitions harmless from any claims by third parties for compensation or otherwise arising from any transaction between the Investor and Diamond Acquisitions.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <span className="bg-black text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">4</span>
                      AS-IS Condition
                    </h3>
                    <p className="pl-9">
                      Investor is completely aware that purchases are made AS-IS. Due to the conditions of the transactions, the seller and DACQ Inc. will have zero knowledge about the current property condition. The property condition is solely the Investor&apos;s responsibility to determine.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <span className="bg-black text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">5</span>
                      Property Access
                    </h3>
                    <p className="pl-9">
                      Investor further realizes Diamond Acquisitions may or may not have title to the property. Diamond Acquisitions may have a contract on the property to purchase on a later date. Investor WILL NOT ACCESS properties without written permission by a Diamond Acquisitions associate or representative.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <span className="bg-black text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">6</span>
                      Non-Solicitation
                    </h3>
                    <p className="pl-9">
                      The Investor agrees that, during the term of this Agreement and for a period of two (2) years thereafter, it shall not, directly or indirectly, solicit, induce, or encourage any employee or independent contractor of Diamond Acquisitions to terminate his or her employment or contractual relationship with Diamond Acquisitions, or to accept employment or a contractual relationship with any other person or entity.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <span className="bg-black text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">7</span>
                      Confidentiality of Communications
                    </h3>
                    <p className="pl-9">
                      Investor acknowledges that any email or electronic message, and the information contained therein, is intended solely for the designated recipient. Investor recognizes that the information shared in such electronic communications may be legally privileged and confidential. The transmission of such information is done in trust, exclusively for the purpose of delivering it to the intended recipient. Investor is strictly prohibited from reproducing, disseminating, or forwarding the contents of any electronic transmission received from any associate of Diamond Acquisitions without obtaining written consent from Diamond Acquisitions.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <span className="bg-black text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">8</span>
                      Intellectual Property
                    </h3>
                    <p className="pl-9">
                      Investor agrees that all rights, title, and interest in and to any intellectual property, including but not limited to patents, trademarks, copyrights, trade secrets, and any other proprietary rights, related to the Confidential Information shall remain solely with Diamond Acquisitions. Nothing in this Agreement shall be construed as granting any license or rights to the Investor to use the intellectual property of Diamond Acquisitions, except as expressly authorized in writing by Diamond Acquisitions.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <span className="bg-black text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">9</span>
                      Remedies for Breach
                    </h3>
                    <p className="pl-9">
                      In the event of a breach or threatened breach of this Agreement by the Investor, Diamond Acquisitions shall be entitled to seek injunctive relief, as well as any other legal or equitable remedies available, without the necessity of posting a bond or proving actual damages. The Investor agrees to indemnify and hold harmless Diamond Acquisitions from any losses, damages, or expenses, including reasonable attorneys&apos; fees, incurred by Diamond Acquisitions as a result of any breach of this Agreement by the Investor.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <span className="bg-black text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">10</span>
                      Liquidated Damages
                    </h3>
                    <p className="pl-9">
                      In the event that the Investor breaches the non-disclosure, non-circumvention, or non-solicitation obligations set forth in this Agreement and such breach is proven by a court of competent jurisdiction, the Investor shall pay Diamond Acquisitions liquidated damages in the amount of <strong>$20,000</strong> as a reasonable estimate of Diamond Acquisitions&apos; damages resulting from such breach.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <span className="bg-black text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">11</span>
                      Electronic Signatures
                    </h3>
                    <p className="pl-9">
                      Investor acknowledges and recognizes that electronic signatures shall carry the same legal weight and effect as traditional handwritten signatures, as outlined in the Uniform Electronic Transactions Act. Investor also acknowledges their right to withdraw consent for the use of electronic signatures at any time, for any reason.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <span className="bg-black text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">12</span>
                      Settlement Agent
                    </h3>
                    <p className="pl-9">
                      Investor realizes that the title, escrow, and/or settlement agent is Diamond Acquisitions&apos; choice.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <span className="bg-black text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">13</span>
                      Risk Acknowledgement
                    </h3>
                    <p className="pl-9">
                      Investor acknowledges and comprehends that real estate investing entails inherent uncertainties and potential for substantial loss. Real estate investment is speculative in nature and necessitates thorough evaluation of its appropriateness in light of Investor&apos;s financial condition. Investor should exercise their own acumen and discernment, and not solely rely on information provided by Diamond Acquisitions as a substitution for independent judgment when making decisions about real estate investments.
                    </p>
                  </div>
                </div>

                {/* Signature Section */}
                <div className="border-t-4 border-gray-900 pt-8 mt-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Electronic Signature</h3>
                  <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-5 mb-6">
                    <p className="text-sm text-gray-800 leading-relaxed">
                      <strong className="text-yellow-800">⚠️ Important:</strong> By clicking "I Agree and Sign" below, you acknowledge that you have read, understood, and agree to be legally bound by all terms and conditions of this Non-Disclosure Agreement. Your electronic signature has the same legal effect as a handwritten signature.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-300">
                      <p className="text-xs text-gray-500 mb-2">Signer Name</p>
                      <p className="font-bold text-gray-900 text-lg">{firstName} {lastName}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-300">
                      <p className="text-xs text-gray-500 mb-2">Signature Date</p>
                      <p className="font-bold text-gray-900 text-lg">{new Date().toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-white border-2 border-dashed border-gray-400 rounded-lg mb-6">
                    <p className="text-xs text-gray-500 mb-2">Electronic Signature</p>
                    <p className="text-3xl text-gray-900 italic" style={{ fontFamily: 'cursive' }}>{firstName} {lastName}</p>
                    <p className="text-xs text-gray-400 mt-2">IP Address: 192.168.1.xxx | Timestamp: {new Date().toISOString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Action Bar */}
            <div className="bg-white border-t-2 border-gray-200 px-8 py-5 flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                Awaiting your signature
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowNdaModal(false)}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleNdaComplete}
                  className="px-8 py-3 bg-gradient-to-r from-gray-900 to-black text-white rounded-lg font-bold text-lg hover:from-gray-800 hover:to-gray-900 transition-all shadow-lg flex items-center gap-2"
                >
                  <span>✓</span> I Agree and Sign
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
