"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);

  // Investment Preferences State
  const [locations, setLocations] = useState<string[]>([]);
  const [locationInput, setLocationInput] = useState("");
  const [assetClasses, setAssetClasses] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState("");
  const [capitalTypes, setCapitalTypes] = useState<string[]>([]);
  const [investSolo, setInvestSolo] = useState("");
  const [openToJV, setOpenToJV] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [notificationPref, setNotificationPref] = useState("all");

  // Mock properties data
  const propertiesBought = [
    {
      id: 1,
      propertyType: "Single Family",
      location: "Austin, TX",
      purchasePrice: 485000,
      closeDate: "2024-01-15",
      status: "Closed",
    },
    {
      id: 2,
      propertyType: "Small Multifamily",
      location: "Dallas, TX",
      purchasePrice: 825000,
      closeDate: "2024-03-22",
      status: "Closed",
    },
    {
      id: 3,
      propertyType: "Single Family",
      location: "Houston, TX",
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

  const addLocation = () => {
    if (locationInput.trim() && !locations.includes(locationInput.trim())) {
      setLocations([...locations, locationInput.trim()]);
      setLocationInput("");
    }
  };

  const removeLocation = (location: string) => {
    setLocations(locations.filter((l) => l !== location));
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleSavePreferences = () => {
    // TODO: Save preferences to backend
    alert("Preferences saved! (Backend integration pending)");
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
          {/* Location Preferences */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Location Preferences
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addLocation();
                  }
                }}
                placeholder="Search cities or counties..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={addLocation}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {locations.map((location) => (
                <div
                  key={location}
                  className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-sm font-medium"
                >
                  <span>{location}</span>
                  <button
                    onClick={() => removeLocation(location)}
                    className="text-blue-600 hover:text-blue-800 font-bold"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Asset Class Preferences */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Asset Class Preferences (Multi-select)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {assetClassOptions.map((assetClass) => (
                <button
                  key={assetClass}
                  onClick={() => toggleAssetClass(assetClass)}
                  className={`px-4 py-2.5 rounded-lg border-2 font-medium transition-all ${
                    assetClasses.includes(assetClass)
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                  }`}
                >
                  {assetClass}
                </button>
              ))}
            </div>
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
              Capital Type (Multi-select)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {capitalTypeOptions.map((capitalType) => (
                <button
                  key={capitalType}
                  onClick={() => toggleCapitalType(capitalType)}
                  className={`px-4 py-2.5 rounded-lg border-2 font-medium transition-all ${
                    capitalTypes.includes(capitalType)
                      ? "border-green-500 bg-green-50 text-green-700"
                      : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                  }`}
                >
                  {capitalType}
                </button>
              ))}
            </div>
          </div>

          {/* Partner Information */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Do you invest solo or with partners?
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="investSolo"
                    value="solo"
                    checked={investSolo === "solo"}
                    onChange={(e) => setInvestSolo(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-gray-700">Solo</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="investSolo"
                    value="partners"
                    checked={investSolo === "partners"}
                    onChange={(e) => setInvestSolo(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-gray-700">With Partners</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Are you open to joint ventures or equity splits?
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="openToJV"
                    value="yes"
                    checked={openToJV === "yes"}
                    onChange={(e) => setOpenToJV(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-gray-700">Yes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="openToJV"
                    value="no"
                    checked={openToJV === "no"}
                    onChange={(e) => setOpenToJV(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-gray-700">No</span>
                </label>
              </div>
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
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="notificationPref"
                  value="matched"
                  checked={notificationPref === "matched"}
                  onChange={(e) => setNotificationPref(e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-gray-700">
                  Only receive deals that match my criteria
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="notificationPref"
                  value="all"
                  checked={notificationPref === "all"}
                  onChange={(e) => setNotificationPref(e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-gray-700">Receive all deals</span>
              </label>
            </div>
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
                    Location
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
