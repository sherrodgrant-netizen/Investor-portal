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
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                  <span className="text-5xl">💎</span>
                </div>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Congratulations on being a Diamond Investor!
                </h2>
                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                  You're now part of an exclusive group with access to premium real estate investment opportunities.
                </p>
                <button
                  onClick={() => setCurrentStep(5)}
                  className="bg-black text-white py-4 px-12 rounded-lg font-bold text-lg hover:bg-gray-800 transition-all shadow-lg"
                >
                  Continue
                </button>
              </div>
            )}

            {/* Step 5: Sales Advisor Assignment */}
            {currentStep === 5 && (
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">
                  Meet Your Sales Advisor
                </h2>
                <p className="text-gray-600 mb-8 text-center">
                  Your dedicated point of contact for all investment opportunities
                </p>

                <div className="max-w-xl mx-auto">
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-8 border-2 border-gray-200">
                    {/* Advisor Photo */}
                    <div className="flex justify-center mb-6">
                      <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 ring-4 ring-black shadow-lg">
                        <img
                          src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80"
                          alt="Sarah Johnson"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Advisor Info */}
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">
                        Sarah Johnson
                      </h3>
                      <p className="text-gray-600 font-medium">
                        Senior Investment Advisor
                      </p>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center justify-center gap-3 p-3 bg-white rounded-lg">
                        <span className="text-2xl">📞</span>
                        <a
                          href="tel:+15125550123"
                          className="text-black hover:text-gray-700 font-semibold"
                        >
                          (512) 555-0123
                        </a>
                      </div>
                      <div className="flex items-center justify-center gap-3 p-3 bg-white rounded-lg">
                        <span className="text-2xl">📧</span>
                        <a
                          href="mailto:sarah.johnson@diamondacquisitions.com"
                          className="text-black hover:text-gray-700 font-semibold"
                        >
                          sarah.johnson@diamondacquisitions.com
                        </a>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 border-2 border-black">
                      <p className="text-sm text-gray-700 text-center">
                        <strong className="text-black">Important:</strong> Sarah is your primary point of contact. She'll help you navigate opportunities, answer questions, and guide you through every investment.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <button
                    onClick={handleFinalSubmit}
                    className="bg-black text-white py-4 px-12 rounded-lg font-bold text-lg hover:bg-gray-800 transition-all shadow-lg"
                  >
                    Go to Dashboard
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PandaDoc Modal */}
      {showNdaModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowNdaModal(false)}
        >
          <div
            className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowNdaModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-3xl"
            >
              ×
            </button>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Non-Disclosure Agreement
            </h2>

            {/* Mock NDA Content */}
            <div className="prose max-w-none mb-8">
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Party 1:</strong> Diamond Acquisitions LLC
                </p>
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Party 2:</strong> {firstName} {lastName}
                </p>
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Email:</strong> {email}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Date:</strong> {new Date().toLocaleDateString()}
                </p>
              </div>

              <p className="text-gray-700 mb-4">
                This Non-Disclosure Agreement ("Agreement") is entered into between Diamond Acquisitions LLC and the undersigned party for the purpose of preventing the unauthorized disclosure of Confidential Information.
              </p>

              <h3 className="text-lg font-bold text-gray-900 mb-2">
                1. Definition of Confidential Information
              </h3>
              <p className="text-gray-700 mb-4">
                "Confidential Information" means all information disclosed by Diamond Acquisitions, including but not limited to property details, financial information, investment opportunities, and business strategies.
              </p>

              <h3 className="text-lg font-bold text-gray-900 mb-2">
                2. Obligations
              </h3>
              <p className="text-gray-700 mb-4">
                The receiving party agrees to: (a) hold and maintain the Confidential Information in strict confidence; (b) not disclose the Confidential Information to third parties without prior written consent; (c) use the Confidential Information solely for evaluation of investment opportunities.
              </p>

              <h3 className="text-lg font-bold text-gray-900 mb-2">
                3. Term
              </h3>
              <p className="text-gray-700 mb-4">
                This Agreement shall remain in effect for a period of five (5) years from the date of execution.
              </p>
            </div>

            {/* Signature Section */}
            <div className="border-t-2 border-gray-200 pt-6">
              <p className="text-gray-700 mb-6">
                By clicking "I Agree and Sign" below, you acknowledge that you have read, understood, and agree to be bound by the terms of this Non-Disclosure Agreement.
              </p>

              <button
                onClick={handleNdaComplete}
                className="w-full bg-black text-white py-4 px-8 rounded-lg font-bold text-lg hover:bg-gray-800 transition-all shadow-lg"
              >
                I Agree and Sign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
