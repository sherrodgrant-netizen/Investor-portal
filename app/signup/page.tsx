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
  const [priceRange, setPriceRange] = useState("");
  const [capitalTypes, setCapitalTypes] = useState<string[]>([]);
  const [investSolo, setInvestSolo] = useState("");
  const [openToJV, setOpenToJV] = useState("");
  const [notificationPref, setNotificationPref] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");

  // Step 3: NDA
  const [ndaSigned, setNdaSigned] = useState(false);
  const [showNdaModal, setShowNdaModal] = useState(false);

  // Options
  const assetClassOptions = [
    "SFH",
    "Small Multifamily",
    "Large Multifamily",
    "Storage",
    "Land",
    "Commercial",
  ];

  const priceRangeOptions = [
    "Under $250k",
    "Under $500k",
    "Under $1M",
    "$1M+",
    "No limit",
  ];

  const capitalTypeOptions = [
    "Cash",
    "Hard Money",
    "Conventional",
    "Seller Finance",
    "JV / Partners",
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
      priceRange !== "" &&
      capitalTypes.length > 0 &&
      investSolo !== "" &&
      openToJV !== "" &&
      notificationPref !== "" &&
      additionalNotes.trim() !== ""
    );
  }, [
    selectedCounties,
    assetClasses,
    priceRange,
    capitalTypes,
    investSolo,
    openToJV,
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
                              <div className="flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100">
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => toggleMetro(metro)}
                                    className="text-gray-500 hover:text-gray-700"
                                  >
                                    <svg
                                      className={`w-4 h-4 transition-transform ${
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
                                  </button>
                                  <span className="font-semibold text-gray-900">{metro}</span>
                                  {isMetroPartiallySelected(metro) && (
                                    <span className="text-xs text-black">(partial)</span>
                                  )}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => selectEntireMetro(metro)}
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
                    <select
                      value={priceRange}
                      onChange={(e) => setPriceRange(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white text-gray-900"
                    >
                      <option value="">Select price range...</option>
                      {priceRangeOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
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

                  {/* Open to JV */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Are you open to joint ventures or equity splits? <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={openToJV}
                      onChange={(e) => setOpenToJV(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white text-gray-900"
                    >
                      <option value="">Select...</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
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
                      <option value="matched">Only receive deals that match my criteria</option>
                      <option value="all">Receive all deals</option>
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
              <div className="relative text-center py-16 px-4 overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-200 rounded-full opacity-20 animate-pulse"></div>
                  <div className="absolute top-20 right-20 w-16 h-16 bg-yellow-300 rounded-full opacity-30 animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                  <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-yellow-100 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="absolute bottom-10 right-1/3 w-20 h-20 bg-yellow-200 rounded-full opacity-25 animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                </div>

                {/* Main Content */}
                <div className="relative z-10">
                  {/* Animated Diamond Icon */}
                  <div className="mb-8 flex justify-center">
                    <div className="relative">
                      {/* Glow Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 rounded-full blur-2xl opacity-50 animate-pulse"></div>
                      {/* Main Diamond */}
                      <div className="relative w-32 h-32 bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-2xl animate-bounce">
                        <span className="text-7xl">💎</span>
                      </div>
                      {/* Sparkles */}
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center animate-ping">
                        <span className="text-2xl">✨</span>
                      </div>
                      <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-white rounded-full flex items-center justify-center animate-ping" style={{ animationDelay: '0.15s' }}>
                        <span className="text-xl">⭐</span>
                      </div>
                    </div>
                  </div>

                  {/* Success Message */}
                  <div className="mb-4">
                    <div className="inline-block bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-6 py-2 rounded-full font-bold text-sm uppercase tracking-wide mb-6 shadow-lg">
                      🎉 NDA Successfully Signed
                    </div>
                  </div>

                  <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
                    Congratulations!
                    <br />
                    <span className="bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700 bg-clip-text text-transparent">
                      You're a Diamond Investor
                    </span>
                  </h2>

                  <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                    Welcome to an exclusive community of elite real estate investors with access to premium opportunities.
                  </p>

                  {/* Benefits Grid */}
                  <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
                    <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border-2 border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
                      <div className="text-4xl mb-3">🏆</div>
                      <h3 className="font-bold text-gray-900 mb-2">Exclusive Deals</h3>
                      <p className="text-sm text-gray-600">First access to premium investment opportunities</p>
                    </div>
                    <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border-2 border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
                      <div className="text-4xl mb-3">👥</div>
                      <h3 className="font-bold text-gray-900 mb-2">Personal Advisor</h3>
                      <p className="text-sm text-gray-600">Dedicated support from experienced professionals</p>
                    </div>
                    <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border-2 border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
                      <div className="text-4xl mb-3">📊</div>
                      <h3 className="font-bold text-gray-900 mb-2">Advanced Analytics</h3>
                      <p className="text-sm text-gray-600">Real-time insights and market analysis tools</p>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => setCurrentStep(5)}
                    className="bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white py-5 px-16 rounded-xl font-black text-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 shadow-lg"
                  >
                    Meet Your Advisor →
                  </button>

                  <p className="text-sm text-gray-500 mt-6">
                    Next: Get introduced to your dedicated sales advisor
                  </p>
                </div>
              </div>
            )}

            {/* Step 5: Sales Advisor Assignment */}
            {currentStep === 5 && (
              <div className="relative py-12 px-4">
                {/* Decorative Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-50 rounded-lg"></div>

                <div className="relative z-10">
                  {/* Header */}
                  <div className="text-center mb-12">
                    <div className="inline-block bg-black text-white px-6 py-2 rounded-full font-bold text-sm uppercase tracking-wide mb-6">
                      ✨ Your Personal Team
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                      Meet Your Sales Advisor
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                      Your dedicated expert who will guide you through every investment opportunity
                    </p>
                  </div>

                  {/* Advisor Card */}
                  <div className="max-w-2xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-4 border-black">
                      {/* Card Header */}
                      <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white px-8 py-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-300 mb-1">Welcome to the team,</p>
                            <p className="text-2xl font-bold">{firstName}!</p>
                          </div>
                          <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                            <span className="text-2xl">💎</span>
                          </div>
                        </div>
                      </div>

                      {/* Advisor Profile */}
                      <div className="p-8 md:p-10">
                        {/* Photo & Welcome Message */}
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
                          {/* Photo */}
                          <div className="flex-shrink-0">
                            <div className="relative">
                              <div className="w-36 h-36 rounded-2xl overflow-hidden bg-gray-200 ring-4 ring-yellow-400 shadow-xl">
                                <img
                                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80"
                                  alt="Sarah Johnson"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                                <span className="text-white text-xs font-bold">✓</span>
                              </div>
                            </div>
                          </div>

                          {/* Info */}
                          <div className="flex-1 text-center md:text-left">
                            <h3 className="text-3xl font-black text-gray-900 mb-2">
                              Sarah Johnson
                            </h3>
                            <p className="text-gray-600 font-semibold mb-4 text-lg">
                              Senior Investment Advisor
                            </p>
                            <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-2 border-yellow-400 rounded-lg p-4 mb-4">
                              <p className="text-sm text-gray-800 italic">
                                "Hi {firstName}! I'm thrilled to be your advisor. I'll be reaching out soon to discuss your investment goals and show you our current opportunities. Let's build wealth together!"
                              </p>
                            </div>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">8+ Years Experience</span>
                              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">$50M+ Deals Closed</span>
                              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">200+ Happy Investors</span>
                            </div>
                          </div>
                        </div>

                        {/* Contact Methods */}
                        <div className="grid md:grid-cols-2 gap-4 mb-8">
                          <a
                            href="tel:+15125550123"
                            className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 rounded-xl hover:border-black hover:shadow-lg transition-all group"
                          >
                            <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                              <span className="text-2xl">📞</span>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 font-semibold">Call Direct</p>
                              <p className="text-black font-bold">(512) 555-0123</p>
                            </div>
                          </a>
                          <a
                            href="mailto:sarah.johnson@diamondacquisitions.com"
                            className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 rounded-xl hover:border-black hover:shadow-lg transition-all group"
                          >
                            <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                              <span className="text-2xl">📧</span>
                            </div>
                            <div className="overflow-hidden">
                              <p className="text-xs text-gray-500 font-semibold">Email</p>
                              <p className="text-black font-bold text-sm truncate">sarah.johnson@diamondacquisitions.com</p>
                            </div>
                          </a>
                        </div>

                        {/* Important Notice */}
                        <div className="bg-gradient-to-r from-black to-gray-900 text-white rounded-xl p-6 mb-8">
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-xl">⭐</span>
                            </div>
                            <div>
                              <h4 className="font-bold text-lg mb-2">Your VIP Support</h4>
                              <p className="text-sm text-gray-200 leading-relaxed">
                                Sarah is your primary point of contact for everything. She'll personally notify you of new deals matching your preferences, answer all your questions, and guide you through the entire investment process from start to finish.
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* What Happens Next */}
                        <div className="bg-gray-50 rounded-xl p-6 mb-8 border-2 border-gray-200">
                          <h4 className="font-bold text-gray-900 mb-4 text-lg">🚀 What Happens Next</h4>
                          <div className="space-y-3">
                            <div className="flex items-start gap-3">
                              <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs">1</div>
                              <p className="text-sm text-gray-700"><strong>Within 24 hours:</strong> Sarah will send you a personalized welcome email</p>
                            </div>
                            <div className="flex items-start gap-3">
                              <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs">2</div>
                              <p className="text-sm text-gray-700"><strong>This week:</strong> You'll receive deals matching your investment preferences</p>
                            </div>
                            <div className="flex items-start gap-3">
                              <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs">3</div>
                              <p className="text-sm text-gray-700"><strong>Ongoing:</strong> Track your investments and opportunities in your dashboard</p>
                            </div>
                          </div>
                        </div>

                        {/* CTA Button */}
                        <button
                          onClick={handleFinalSubmit}
                          className="w-full bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white py-5 px-8 rounded-xl font-black text-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 shadow-lg flex items-center justify-center gap-3"
                        >
                          <span>Enter Your Dashboard</span>
                          <span className="text-2xl">→</span>
                        </button>

                        <p className="text-center text-sm text-gray-500 mt-4">
                          You're all set! Start exploring investment opportunities now.
                        </p>
                      </div>
                    </div>
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
                  <h2 className="text-xl font-bold">Non-Disclosure Agreement</h2>
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
                <div className="text-center mb-8 pb-6 border-b-2 border-gray-200">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    NON-DISCLOSURE AGREEMENT
                  </h1>
                  <p className="text-sm text-gray-500">Document ID: NDA-{new Date().getFullYear()}-{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}</p>
                </div>

                {/* Party Information */}
                <div className="mb-8 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border-2 border-gray-300">
                  <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wide mb-4">Agreement Between</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Disclosing Party</p>
                      <p className="font-bold text-gray-900">Diamond Acquisitions LLC</p>
                      <p className="text-sm text-gray-600">123 Investment Blvd, Suite 100</p>
                      <p className="text-sm text-gray-600">Austin, TX 78701</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Receiving Party</p>
                      <p className="font-bold text-gray-900">{firstName} {lastName}</p>
                      <p className="text-sm text-gray-600">{email}</p>
                      <p className="text-sm text-gray-600">{phone}</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-300">
                    <p className="text-xs text-gray-500">Effective Date</p>
                    <p className="font-semibold text-gray-900">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                </div>

                {/* Agreement Content */}
                <div className="space-y-6 mb-8 text-gray-700 leading-relaxed">
                  <p className="text-base">
                    This Non-Disclosure Agreement ("<strong>Agreement</strong>") is entered into between Diamond Acquisitions LLC ("<strong>Disclosing Party</strong>") and the undersigned party ("<strong>Receiving Party</strong>") for the purpose of preventing the unauthorized disclosure of Confidential Information as defined below.
                  </p>

                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <span className="bg-black text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">1</span>
                      Definition of Confidential Information
                    </h3>
                    <p className="pl-9">
                      "<strong>Confidential Information</strong>" means all information, whether written, oral, electronic, or visual, disclosed by the Disclosing Party to the Receiving Party, including but not limited to:
                    </p>
                    <ul className="pl-9 mt-2 space-y-1 list-disc list-inside">
                      <li>Property details, addresses, and financial information</li>
                      <li>Investment opportunities and deal structures</li>
                      <li>Business strategies, plans, and methodologies</li>
                      <li>Client and investor information</li>
                      <li>Any other proprietary or sensitive business information</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <span className="bg-black text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">2</span>
                      Obligations of Receiving Party
                    </h3>
                    <p className="pl-9 mb-2">The Receiving Party agrees to:</p>
                    <ul className="pl-9 space-y-1 list-disc list-inside">
                      <li>Hold and maintain the Confidential Information in strict confidence</li>
                      <li>Not disclose the Confidential Information to any third parties without prior written consent</li>
                      <li>Use the Confidential Information solely for the purpose of evaluating investment opportunities</li>
                      <li>Protect the Confidential Information using the same degree of care used to protect their own confidential information</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <span className="bg-black text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">3</span>
                      Term and Termination
                    </h3>
                    <p className="pl-9">
                      This Agreement shall remain in effect for a period of <strong>five (5) years</strong> from the date of execution. The obligations of confidentiality shall survive the termination of this Agreement and continue indefinitely.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <span className="bg-black text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">4</span>
                      Remedies
                    </h3>
                    <p className="pl-9">
                      The Receiving Party acknowledges that any breach of this Agreement may cause irreparable harm to the Disclosing Party and that monetary damages may be inadequate. The Disclosing Party shall be entitled to seek equitable relief, including injunction and specific performance.
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
