"use client";

import { useState } from "react";
import { BuyerInfo, BuyerType, FundingType } from "@/types/ready-to-buy";

interface BuyerQuestionnaireProps {
  onComplete: (info: BuyerInfo) => void;
  initialData?: BuyerInfo;
}

export default function BuyerQuestionnaire({ onComplete, initialData }: BuyerQuestionnaireProps) {
  const [buyerType, setBuyerType] = useState<BuyerType | null>(initialData?.buyerType || null);
  const [fullLegalName, setFullLegalName] = useState(initialData?.fullLegalName || "");
  const [llcName, setLlcName] = useState(initialData?.llcName || "");
  const [ein, setEin] = useState(initialData?.ein || "");
  const [authorizedSignerName, setAuthorizedSignerName] = useState(initialData?.authorizedSignerName || "");
  const [fundingType, setFundingType] = useState<FundingType | null>(initialData?.fundingType || null);
  const [lenderName, setLenderName] = useState(initialData?.lenderName || "");
  const [lenderContact, setLenderContact] = useState(initialData?.lenderContact || "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!buyerType) {
      newErrors.buyerType = "Please select how you're purchasing";
    }

    if (buyerType === "personal" && !fullLegalName.trim()) {
      newErrors.fullLegalName = "Full legal name is required";
    }

    if (buyerType === "llc") {
      if (!llcName.trim()) newErrors.llcName = "LLC name is required";
      if (!ein.trim()) newErrors.ein = "EIN is required";
      if (!authorizedSignerName.trim()) newErrors.authorizedSignerName = "Authorized signer name is required";
    }

    if (!fundingType) {
      newErrors.fundingType = "Please select how you're funding this purchase";
    }

    if (fundingType === "hard_money") {
      if (!lenderName.trim()) newErrors.lenderName = "Lender name is required";
      if (!lenderContact.trim()) newErrors.lenderContact = "Lender contact info is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    onComplete({
      buyerType: buyerType!,
      fullLegalName: buyerType === "personal" ? fullLegalName : undefined,
      llcName: buyerType === "llc" ? llcName : undefined,
      ein: buyerType === "llc" ? ein : undefined,
      authorizedSignerName: buyerType === "llc" ? authorizedSignerName : undefined,
      fundingType: fundingType!,
      lenderName: fundingType === "hard_money" ? lenderName : undefined,
      lenderContact: fundingType === "hard_money" ? lenderContact : undefined,
    });
  };

  return (
    <div className="space-y-8">
      {/* Question 1: Buyer Type */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">
          Are you purchasing in your personal name or an LLC?
        </h3>
        <p className="text-sm text-gray-500 mb-4">This determines how the assignment contract is drafted.</p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            onClick={() => { setBuyerType("personal"); setErrors((e) => ({ ...e, buyerType: "" })); }}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              buyerType === "personal"
                ? "border-black bg-gray-50 shadow-sm"
                : "border-gray-200 hover:border-gray-400"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                buyerType === "personal" ? "border-black" : "border-gray-300"
              }`}>
                {buyerType === "personal" && <div className="w-2.5 h-2.5 rounded-full bg-black" />}
              </div>
              <div>
                <p className="font-semibold text-gray-900">Personal Name</p>
                <p className="text-xs text-gray-500">Individual buyer</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => { setBuyerType("llc"); setErrors((e) => ({ ...e, buyerType: "" })); }}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              buyerType === "llc"
                ? "border-black bg-gray-50 shadow-sm"
                : "border-gray-200 hover:border-gray-400"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                buyerType === "llc" ? "border-black" : "border-gray-300"
              }`}>
                {buyerType === "llc" && <div className="w-2.5 h-2.5 rounded-full bg-black" />}
              </div>
              <div>
                <p className="font-semibold text-gray-900">LLC / Entity</p>
                <p className="text-xs text-gray-500">Business entity</p>
              </div>
            </div>
          </button>
        </div>
        {errors.buyerType && <p className="text-red-500 text-sm">{errors.buyerType}</p>}

        {/* Personal Name Fields */}
        {buyerType === "personal" && (
          <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Legal Name</label>
              <input
                type="text"
                value={fullLegalName}
                onChange={(e) => { setFullLegalName(e.target.value); setErrors((er) => ({ ...er, fullLegalName: "" })); }}
                placeholder="John Michael Smith"
                className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
              {errors.fullLegalName && <p className="text-red-500 text-xs mt-1">{errors.fullLegalName}</p>}
            </div>
          </div>
        )}

        {/* LLC Fields */}
        {buyerType === "llc" && (
          <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">LLC / Entity Name</label>
              <input
                type="text"
                value={llcName}
                onChange={(e) => { setLlcName(e.target.value); setErrors((er) => ({ ...er, llcName: "" })); }}
                placeholder="Smith Investments LLC"
                className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
              {errors.llcName && <p className="text-red-500 text-xs mt-1">{errors.llcName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">EIN</label>
              <input
                type="text"
                value={ein}
                onChange={(e) => { setEin(e.target.value); setErrors((er) => ({ ...er, ein: "" })); }}
                placeholder="XX-XXXXXXX"
                className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
              {errors.ein && <p className="text-red-500 text-xs mt-1">{errors.ein}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Authorized Signer Name</label>
              <input
                type="text"
                value={authorizedSignerName}
                onChange={(e) => { setAuthorizedSignerName(e.target.value); setErrors((er) => ({ ...er, authorizedSignerName: "" })); }}
                placeholder="John Smith, Managing Member"
                className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
              {errors.authorizedSignerName && <p className="text-red-500 text-xs mt-1">{errors.authorizedSignerName}</p>}
            </div>
          </div>
        )}
      </div>

      {/* Question 2: Funding */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">
          How are you funding this purchase?
        </h3>
        <p className="text-sm text-gray-500 mb-4">Select your source of funds for this transaction.</p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            onClick={() => { setFundingType("cash"); setErrors((e) => ({ ...e, fundingType: "" })); }}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              fundingType === "cash"
                ? "border-black bg-gray-50 shadow-sm"
                : "border-gray-200 hover:border-gray-400"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                fundingType === "cash" ? "border-black" : "border-gray-300"
              }`}>
                {fundingType === "cash" && <div className="w-2.5 h-2.5 rounded-full bg-black" />}
              </div>
              <div>
                <p className="font-semibold text-gray-900">Cash</p>
                <p className="text-xs text-gray-500">All-cash purchase</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => { setFundingType("hard_money"); setErrors((e) => ({ ...e, fundingType: "" })); }}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              fundingType === "hard_money"
                ? "border-black bg-gray-50 shadow-sm"
                : "border-gray-200 hover:border-gray-400"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                fundingType === "hard_money" ? "border-black" : "border-gray-300"
              }`}>
                {fundingType === "hard_money" && <div className="w-2.5 h-2.5 rounded-full bg-black" />}
              </div>
              <div>
                <p className="font-semibold text-gray-900">Hard Money</p>
                <p className="text-xs text-gray-500">Lender-financed</p>
              </div>
            </div>
          </button>
        </div>
        {errors.fundingType && <p className="text-red-500 text-sm">{errors.fundingType}</p>}

        {/* Hard Money Fields */}
        {fundingType === "hard_money" && (
          <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lender Name</label>
              <input
                type="text"
                value={lenderName}
                onChange={(e) => { setLenderName(e.target.value); setErrors((er) => ({ ...er, lenderName: "" })); }}
                placeholder="ABC Capital Lending"
                className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
              {errors.lenderName && <p className="text-red-500 text-xs mt-1">{errors.lenderName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lender Contact Info</label>
              <input
                type="text"
                value={lenderContact}
                onChange={(e) => { setLenderContact(e.target.value); setErrors((er) => ({ ...er, lenderContact: "" })); }}
                placeholder="Email or phone number"
                className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
              {errors.lenderContact && <p className="text-red-500 text-xs mt-1">{errors.lenderContact}</p>}
            </div>
          </div>
        )}
      </div>

      {/* Next Button */}
      <button
        onClick={handleSubmit}
        className="w-full bg-black text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
      >
        Continue to Contract
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
