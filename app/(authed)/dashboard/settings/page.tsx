"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [emailScope, setEmailScope] = useState<"all" | "counties">("all");
  const [emailFrequency, setEmailFrequency] = useState<"daily" | "weekly">("daily");
  const [selectedCounties, setSelectedCounties] = useState<string[]>(["Travis County", "Williamson County"]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Available counties in Texas (example list)
  const availableCounties = [
    "Travis County",
    "Williamson County",
    "Hays County",
    "Bastrop County",
    "Caldwell County",
    "Burnet County",
    "Bell County",
    "Comal County",
  ];

  const handleCountyToggle = (county: string) => {
    if (selectedCounties.includes(county)) {
      setSelectedCounties(selectedCounties.filter((c) => c !== county));
    } else {
      setSelectedCounties([...selectedCounties, county]);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSaving(false);
    setSaveSuccess(true);

    // Hide success message after 3 seconds
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">
          Manage your email preferences and notifications for new investment opportunities
        </p>
      </div>

      {/* Email Preferences Card */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        {/* Card Header */}
        <div className="bg-black text-white px-6 py-4">
          <h2 className="text-xl font-bold">Email Notification Preferences</h2>
        </div>

        {/* Card Content */}
        <div className="p-6 space-y-8">
          {/* Success Message */}
          {saveSuccess && (
            <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4 flex items-center gap-3 animate-slideDown">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold">✓</span>
              </div>
              <div>
                <p className="font-semibold text-green-900">Settings saved successfully!</p>
                <p className="text-sm text-green-700">Your email preferences have been updated.</p>
              </div>
            </div>
          )}

          {/* Email Scope Selection */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-4">
              Which deals would you like to receive?
            </label>
            <div className="space-y-3">
              {/* All Deals Option */}
              <button
                onClick={() => setEmailScope("all")}
                className={`w-full p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                  emailScope === "all"
                    ? "border-black bg-gray-50 shadow-md"
                    : "border-gray-200 bg-white hover:border-gray-400"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        emailScope === "all"
                          ? "border-black bg-black"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      {emailScope === "all" && (
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 mb-1">All Available Deals</p>
                    <p className="text-sm text-gray-600">
                      Receive notifications for every new investment opportunity across all locations
                    </p>
                  </div>
                </div>
              </button>

              {/* Selected Counties Option */}
              <button
                onClick={() => setEmailScope("counties")}
                className={`w-full p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                  emailScope === "counties"
                    ? "border-black bg-gray-50 shadow-md"
                    : "border-gray-200 bg-white hover:border-gray-400"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        emailScope === "counties"
                          ? "border-black bg-black"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      {emailScope === "counties" && (
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 mb-1">Selected Counties Only</p>
                    <p className="text-sm text-gray-600">
                      Only receive notifications for deals in specific counties you choose below
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* County Selection (shown only if "counties" is selected) */}
          {emailScope === "counties" && (
            <div className="pl-10 animate-slideDown">
              <label className="block text-sm font-bold text-gray-900 mb-3">
                Select Counties
              </label>
              <div className="grid grid-cols-2 gap-3">
                {availableCounties.map((county) => {
                  const isSelected = selectedCounties.includes(county);
                  return (
                    <button
                      key={county}
                      onClick={() => handleCountyToggle(county)}
                      className={`p-3 rounded-lg border-2 transition-all duration-300 text-left ${
                        isSelected
                          ? "border-black bg-black text-white shadow-md"
                          : "border-gray-200 bg-white text-gray-700 hover:border-gray-400"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                            isSelected
                              ? "border-white bg-white"
                              : "border-gray-300 bg-white"
                          }`}
                        >
                          {isSelected && (
                            <span className="text-black font-bold text-xs">✓</span>
                          )}
                        </div>
                        <span className="font-medium text-sm">{county}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
              {selectedCounties.length === 0 && (
                <p className="text-sm text-red-600 mt-2">
                  ⚠️ Please select at least one county
                </p>
              )}
            </div>
          )}

          {/* Divider */}
          <div className="border-t border-gray-200"></div>

          {/* Email Frequency Selection */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-4">
              How often would you like to receive emails?
            </label>
            <div className="grid grid-cols-2 gap-4">
              {/* Daily Option */}
              <button
                onClick={() => setEmailFrequency("daily")}
                className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                  emailFrequency === "daily"
                    ? "border-black bg-gray-50 shadow-md"
                    : "border-gray-200 bg-white hover:border-gray-400"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        emailFrequency === "daily"
                          ? "border-black bg-black"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      {emailFrequency === "daily" && (
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">Daily</p>
                    <p className="text-sm text-gray-600">
                      Get updates every day with new deals
                    </p>
                  </div>
                </div>
              </button>

              {/* Weekly Option */}
              <button
                onClick={() => setEmailFrequency("weekly")}
                className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                  emailFrequency === "weekly"
                    ? "border-black bg-gray-50 shadow-md"
                    : "border-gray-200 bg-white hover:border-gray-400"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        emailFrequency === "weekly"
                          ? "border-black bg-black"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      {emailFrequency === "weekly" && (
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">Weekly</p>
                    <p className="text-sm text-gray-600">
                      Receive a weekly digest of all new deals
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Current Selection Summary */}
          <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
            <h3 className="font-bold text-gray-900 mb-2 text-sm">Current Selection:</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>
                <span className="font-medium">Email Scope:</span>{" "}
                {emailScope === "all" ? "All Available Deals" : `Selected Counties Only (${selectedCounties.length} selected)`}
              </li>
              <li>
                <span className="font-medium">Frequency:</span>{" "}
                {emailFrequency === "daily" ? "Daily Updates" : "Weekly Digest"}
              </li>
              {emailScope === "counties" && selectedCounties.length > 0 && (
                <li>
                  <span className="font-medium">Counties:</span>{" "}
                  {selectedCounties.join(", ")}
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Card Footer with Save Button */}
        <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Changes will take effect immediately after saving
          </p>
          <button
            onClick={handleSave}
            disabled={isSaving || (emailScope === "counties" && selectedCounties.length === 0)}
            className="bg-black text-white py-3 px-8 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isSaving ? "Saving..." : "Save Preferences"}
          </button>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-6 bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl flex-shrink-0">💡</span>
          <div>
            <p className="font-semibold text-blue-900 mb-1">Email Delivery Times</p>
            <p className="text-sm text-blue-800">
              Daily emails are sent at 8:00 AM CST. Weekly digests are sent every Monday at 8:00 AM CST.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
