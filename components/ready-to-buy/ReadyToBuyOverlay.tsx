"use client";

import { useState } from "react";
import { BuyerInfo, ReadyToBuyData } from "@/types/ready-to-buy";
import BuyerQuestionnaire from "./BuyerQuestionnaire";
import ContractAndWire from "./ContractAndWire";
import Confirmation from "./Confirmation";
import CelebrationOverlay from "./CelebrationOverlay";

interface ReadyToBuyOverlayProps {
  dealId: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  purchasePrice: number;
  onClose: () => void;
}

export default function ReadyToBuyOverlay({
  dealId,
  address,
  city,
  state,
  zip,
  purchasePrice,
  onClose,
}: ReadyToBuyOverlayProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [buyerInfo, setBuyerInfo] = useState<BuyerInfo | null>(null);
  const [submissionData, setSubmissionData] = useState<ReadyToBuyData | null>(null);
  const [celebrating, setCelebrating] = useState(false);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(val);

  const handleQuestionnaireComplete = (info: BuyerInfo) => {
    setBuyerInfo(info);
    setStep(2);
  };

  const handleContractAndWireComplete = (data: {
    signatureDataUrl: string;
    wireImageUrl: string;
  }) => {
    const submission: ReadyToBuyData = {
      dealId,
      buyerInfo: buyerInfo!,
      signatureDataUrl: data.signatureDataUrl,
      signedAt: new Date().toISOString(),
      wireImageUrl: data.wireImageUrl,
    };
    setSubmissionData(submission);
    setCelebrating(true);
  };

  const handleCelebrationComplete = () => {
    setCelebrating(false);
    setStep(3);
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto"
        style={{
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          backgroundColor: "rgba(0,0,0,0.5)",
          animation: "rtbOverlayIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="fixed top-6 right-6 z-[60] w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content container */}
        <div
          className="w-full max-w-5xl mx-auto px-6 py-12"
          style={{
            animation: "rtbContentIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both",
          }}
        >
          {/* Header — hidden on confirmation */}
          {step < 3 && (
            <div className="mb-8">
              <div className="mb-4">
                <h1 className="text-3xl font-bold text-white">Ready to Buy</h1>
                <p className="text-white/60 mt-1">{address}, {city}, {state} {zip}</p>
                <p className="text-2xl font-bold text-white mt-1">{formatCurrency(purchasePrice)}</p>
              </div>

              {/* Progress Steps */}
              <div className="flex items-center gap-2 mt-6">
                {[
                  { num: 1, label: "Buyer Info" },
                  { num: 2, label: "Contract & Wire" },
                  { num: 3, label: "Confirmation" },
                ].map((s, i) => (
                  <div key={s.num} className="flex items-center gap-2">
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      step === s.num
                        ? "bg-white text-black"
                        : step > s.num
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : "bg-white/10 text-white/40"
                    }`}>
                      {step > s.num ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <span className="w-4 text-center">{s.num}</span>
                      )}
                      <span>{s.label}</span>
                    </div>
                    {i < 2 && <div className="w-8 h-px bg-white/20" />}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step Content */}
          {step === 1 && (
            <div className="max-w-2xl">
              <div className="bg-white rounded-2xl shadow-2xl p-6">
                <BuyerQuestionnaire
                  onComplete={handleQuestionnaireComplete}
                  initialData={buyerInfo || undefined}
                />
              </div>
            </div>
          )}

          {step === 2 && buyerInfo && (
            <ContractAndWire
              dealId={dealId}
              propertyAddress={address}
              city={city}
              state={state}
              zip={zip}
              purchasePrice={purchasePrice}
              buyerInfo={buyerInfo}
              onComplete={handleContractAndWireComplete}
              onBack={() => setStep(1)}
            />
          )}

          {step === 3 && submissionData && (
            <div className="bg-white rounded-2xl shadow-2xl p-6">
              <Confirmation
                data={submissionData}
                propertyAddress={`${address}, ${city}, ${state} ${zip}`}
                purchasePrice={purchasePrice}
                onClose={onClose}
              />
            </div>
          )}
        </div>
      </div>

      {/* Celebration Animation */}
      {celebrating && <CelebrationOverlay onComplete={handleCelebrationComplete} />}

      <style>{`
        @keyframes rtbOverlayIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes rtbContentIn {
          0% { opacity: 0; transform: translateY(40px) scale(0.97); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </>
  );
}
