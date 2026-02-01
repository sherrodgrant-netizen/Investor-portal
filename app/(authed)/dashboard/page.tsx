"use client";

import { useEffect, useState } from "react";

// Metro and County Data Structure
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
    "Chambers County",
    "Liberty County",
    "Waller County",
    "Austin County",
  ],
};

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);

  // Investment Preferences State
  const [selectedCounties, setSelectedCounties] = useState<string[]>([]);
  const [expandedMetros, setExpandedMetros] = useState<string[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [assetClass, setAssetClass] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [capitalType, setCapitalType] = useState("");
  const [investSolo, setInvestSolo] = useState("");
  const [openToJV, setOpenToJV] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [notificationPref, setNotificationPref] = useState("");

  // Mock properties data
  const propertiesBought = [
    {
      id: 1,
      propertyType: "Single Family",
      location: "Travis County, TX",
      purchasePrice: 485000,
      closeDate: "2024-01-15",
      status: "Closed",
    },
    {
      id: 2,
      propertyType: "Small Multifamily",
      location: "Dallas County, TX",
      purchasePrice: 825000,
      closeDate: "2024-03-22",
      status: "Closed",
    },
    {
      id: 3,
      propertyType: "Single Family",
      location: "Harris County, TX",
      purchasePrice: 395000,
      closeDate: "2024-06-10",
      status: "Under Contract",
    },
  ];

  const totalPropertiesBought = propertiesBought.filter(
    (p) => p.status === "Closed"
  ).length;

  // Achievement levels
  const achievements = [
    {
      name: "First Property Bought",
      count: 1,
      icon: "🌟",
      unlocked: totalPropertiesBought >= 1,
    },
    {
      name: "3 Properties Bought",
      count: 3,
      icon: "🏆",
      unlocked: totalPropertiesBought >= 3,
    },
    {
      name: "5 Properties Bought",
      count: 5,
      icon: "💎",
      unlocked: totalPropertiesBought >= 5,
    },
    {
      name: "10 Properties Bought",
      count: 10,
      icon: "⭐",
      unlocked: totalPropertiesBought >= 10,
    },
    {
      name: "20 Properties Bought (King)",
      count: 20,
      icon: "👑",
      unlocked: totalPropertiesBought >= 20,
    },
  ];

  const assetClassOptions = [
    "Single Family",
    "Small Multifamily (2-10)",
    "Large Multifamily (10+)",
    "Storage",
    "Land",
    "Commercial",
  ];

  const capitalTypeOptions = [
    "Cash",
    "Hard money",
    "Conventional",
    "Seller finance",
    "JV / Partners",
  ];

  const priceRangeOptions = [
    "Under $250k",
    "Under $500k",
    "Under $1M",
    "$1M+",
    "No limit",
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleMetro = (metro: string) => {
    setExpandedMetros((prev) =>
      prev.includes(metro) ? prev.filter((m) => m !== metro) : [...prev, metro]
    );
  };

  const selectEntireMetro = (metro: string) => {
    const counties = METRO_COUNTIES[metro as keyof typeof METRO_COUNTIES];
    const allSelected = counties.every((c) => selectedCounties.includes(c));

    if (allSelected) {
      // Deselect all counties in this metro
      setSelectedCounties((prev) => prev.filter((c) => !counties.includes(c)));
    } else {
      // Select all counties in this metro
      setSelectedCounties((prev) => [
        ...prev.filter((c) => !counties.includes(c)),
        ...counties,
      ]);
    }
  };

  const toggleCounty = (county: string) => {
    setSelectedCounties((prev) =>
      prev.includes(county)
        ? prev.filter((c) => c !== county)
        : [...prev, county]
    );
  };

  const removeCounty = (county: string) => {
    setSelectedCounties((prev) => prev.filter((c) => c !== county));
  };

  const isMetroFullySelected = (metro: string) => {
    const counties = METRO_COUNTIES[metro as keyof typeof METRO_COUNTIES];
    return counties.every((c) => selectedCounties.includes(c));
  };

  const isMetroPartiallySelected = (metro: string) => {
    const counties = METRO_COUNTIES[metro as keyof typeof METRO_COUNTIES];
    return (
      counties.some((c) => selectedCounties.includes(c)) &&
      !isMetroFullySelected(metro)
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleSavePreferences = () => {
    // TODO: Save preferences to Salesforce API
    const preferences = {
      counties: selectedCounties,
      assetClass,
      priceRange,
      capitalType,
      investSolo,
      openToJV,
      additionalNotes,
      notificationPref,
    };
    console.log("Saving to Salesforce:", preferences);
    alert("Preferences saved! (Salesforce API integration pending)");
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div
        className={`transition-all duration-700 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
        }`}
      >
        <h2 className="text-3xl font-bold text-gray-900">
          Investor Dashboard
        </h2>
        <p className="text-gray-600 mt-2">
          Manage your investment preferences and track your portfolio
        </p>
      </div>

      {/* Investment Preferences Section */}
      <div
        className={`bg-white rounded-lg shadow-md p-6 border border-gray-200 transition-all duration-700 delay-100 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">
            Investment Preferences
          </h3>
          <span className="text-3xl">⚙️</span>
        </div>

        <div className="space-y-6">
          {/* County Preferences with Metro Dropdown */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              County Preferences
            </label>

            {/* Dropdown Trigger */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-left flex items-center justify-between"
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

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-96 overflow-y-auto">
                  {Object.entries(METRO_COUNTIES).map(([metro, counties]) => (
                    <div key={metro} className="border-b border-gray-200 last:border-b-0">
                      {/* Metro Header */}
                      <div className="flex items-center justify-between p-3 hover:bg-gray-50">
                        <div className="flex items-center gap-2 flex-1">
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
                          <span className="font-semibold text-gray-900">
                            {metro}
                          </span>
                          {isMetroPartiallySelected(metro) && (
                            <span className="text-xs text-blue-600">
                              (partial)
                            </span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => selectEntireMetro(metro)}
                          className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                            isMetroFullySelected(metro)
                              ? "bg-blue-600 text-white"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                        >
                          {isMetroFullySelected(metro)
                            ? "Deselect All"
                            : "Select All"}
                        </button>
                      </div>

                      {/* Counties List */}
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
                                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                              />
                              <span className="text-sm text-gray-700">
                                {county}
                              </span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Selected Counties Pills */}
            {selectedCounties.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {selectedCounties.map((county) => (
                  <div
                    key={county}
                    className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-sm font-medium"
                  >
                    <span>{county}</span>
                    <button
                      onClick={() => removeCounty(county)}
                      className="text-blue-600 hover:text-blue-800 font-bold"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Asset Class Preference */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Asset Class Preference
            </label>
            <select
              value={assetClass}
              onChange={(e) => setAssetClass(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="">Select asset class...</option>
              {assetClassOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* Purchase Price Range */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Purchase Price Range
            </label>
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
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
              Capital Type
            </label>
            <select
              value={capitalType}
              onChange={(e) => setCapitalType(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="">Select capital type...</option>
              {capitalTypeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* Partner Information */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Do you invest solo or with partners?
              </label>
              <select
                value={investSolo}
                onChange={(e) => setInvestSolo(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="">Select...</option>
                <option value="solo">Solo</option>
                <option value="partners">With Partners</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Are you open to joint ventures or equity splits?
              </label>
              <select
                value={openToJV}
                onChange={(e) => setOpenToJV(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="">Select...</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Anything else we should know about what you're looking for?
            </label>
            <textarea
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              rows={4}
              placeholder="Share any additional preferences or requirements..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Notification Preferences */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Notification Preferences
            </label>
            <select
              value={notificationPref}
              onChange={(e) => setNotificationPref(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="">Select notification preference...</option>
              <option value="matched">
                Only receive deals that match my criteria
              </option>
              <option value="all">Receive all deals</option>
            </select>
          </div>

          {/* Save Button */}
          <div className="pt-4">
            <button
              onClick={handleSavePreferences}
              className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-900 transition-all shadow-md hover:shadow-lg"
            >
              Save Preferences
            </button>
          </div>
        </div>
      </div>

      {/* Properties Bought Section */}
      <div
        className={`bg-white rounded-lg shadow-md p-6 border border-gray-200 transition-all duration-700 delay-200 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">
            Properties Bought
          </h3>
          <span className="text-3xl">🏘️</span>
        </div>

        {propertiesBought.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">No properties bought yet</p>
            <p className="text-sm mt-2">
              Start browsing available deals to begin your journey!
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Property Type
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    County
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Purchase Price
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Close Date
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {propertiesBought.map((property) => (
                  <tr
                    key={property.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-4 font-medium text-gray-900">
                      {property.propertyType}
                    </td>
                    <td className="py-4 px-4 text-gray-700">
                      {property.location}
                    </td>
                    <td className="py-4 px-4 text-gray-900 font-semibold">
                      {formatPrice(property.purchasePrice)}
                    </td>
                    <td className="py-4 px-4 text-gray-700">
                      {new Date(property.closeDate).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          property.status === "Closed"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {property.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Achievement Bar */}
      <div
        className={`bg-gradient-to-r from-slate-900 to-blue-900 rounded-lg shadow-lg p-6 text-white transition-all duration-700 delay-300 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold">Achievements</h3>
          <span className="text-3xl">🏆</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {achievements.map((achievement, index) => (
            <div
              key={achievement.name}
              className={`bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 text-center border-2 transition-all duration-500 ${
                achievement.unlocked
                  ? "border-yellow-400 scale-100 hover:scale-105"
                  : "border-gray-500 opacity-40 grayscale"
              }`}
              style={{
                transitionDelay: `${400 + index * 100}ms`,
              }}
            >
              <div className="text-5xl mb-2">{achievement.icon}</div>
              <p className="text-xs font-semibold mb-1">{achievement.name}</p>
              {achievement.unlocked ? (
                <p className="text-xs text-green-300">✓ Unlocked</p>
              ) : (
                <p className="text-xs text-gray-400">Locked</p>
              )}
            </div>
          ))}
        </div>

        {/* Progress Summary */}
        <div className="mt-6 pt-6 border-t border-white border-opacity-20">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm">
              {totalPropertiesBought} of 20 properties
            </span>
            <span className="text-sm font-semibold">
              {Math.round((totalPropertiesBought / 20) * 100)}%
            </span>
          </div>
          <div className="w-full bg-white bg-opacity-20 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-full rounded-full transition-all duration-1000"
              style={{
                width: `${(totalPropertiesBought / 20) * 100}%`,
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
