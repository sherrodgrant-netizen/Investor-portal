"use client";

import { useState } from "react";
import { BuyerInfo } from "@/types/ready-to-buy";
import AssignmentContract from "./AssignmentContract";
import WireUploader from "./WireUploader";

interface ContractAndWireProps {
  dealId: string;
  propertyAddress: string;
  city: string;
  state: string;
  zip: string;
  purchasePrice: number;
  buyerInfo: BuyerInfo;
  onComplete: (data: {
    signatureDataUrl: string;
    wireImageUrl: string;
  }) => void;
  onBack: () => void;
}

export default function ContractAndWire({
  propertyAddress,
  city,
  state,
  zip,
  purchasePrice,
  buyerInfo,
  onComplete,
  onBack,
}: ContractAndWireProps) {
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);
  const [wireImageUrl, setWireImageUrl] = useState<string | null>(null);

  const contractSigned = !!signatureDataUrl;
  const wireUploaded = !!wireImageUrl;
  const canSubmit = contractSigned && wireUploaded;

  const handleSubmit = () => {
    if (!canSubmit || !signatureDataUrl || !wireImageUrl) return;
    onComplete({
      signatureDataUrl,
      wireImageUrl,
    });
  };

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        onClick={onBack}
        className="text-white/60 hover:text-white text-sm flex items-center gap-2 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to buyer info
      </button>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Contract */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <AssignmentContract
            propertyAddress={propertyAddress}
            city={city}
            state={state}
            zip={zip}
            purchasePrice={purchasePrice}
            buyerInfo={buyerInfo}
            onSign={(dataUrl) => setSignatureDataUrl(dataUrl)}
            existingSignature={signatureDataUrl || undefined}
          />
        </div>

        {/* Right: Wire Upload */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <WireUploader
            onUploaded={(imageUrl) => setWireImageUrl(imageUrl)}
          />
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                contractSigned ? "bg-green-500" : "bg-gray-300"
              }`}>
                {contractSigned ? (
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className="text-xs text-white font-bold">1</span>
                )}
              </div>
              <span className={`text-sm ${contractSigned ? "text-green-700 font-medium" : "text-gray-500"}`}>
                Contract Signed
              </span>
            </div>

            <div className="w-8 h-px bg-gray-300" />

            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                wireUploaded ? "bg-green-500" : "bg-gray-300"
              }`}>
                {wireUploaded ? (
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className="text-xs text-white font-bold">2</span>
                )}
              </div>
              <span className={`text-sm ${wireUploaded ? "text-green-700 font-medium" : "text-gray-500"}`}>
                Wire Uploaded
              </span>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
              canSubmit
                ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Submit Purchase
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
