"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { BuyerInfo, ReadyToBuyData } from "@/types/ready-to-buy";
import BuyerQuestionnaire from "@/components/ready-to-buy/BuyerQuestionnaire";
import ContractAndWire from "@/components/ready-to-buy/ContractAndWire";
import Confirmation from "@/components/ready-to-buy/Confirmation";
import CelebrationOverlay from "@/components/ready-to-buy/CelebrationOverlay";

interface DealSummary {
  id: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  purchasePrice: number;
}

export default function ReadyToBuyPage() {
  const { id: dealId } = useParams<{ id: string }>();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [deal, setDeal] = useState<DealSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [buyerInfo, setBuyerInfo] = useState<BuyerInfo | null>(null);
  const [submissionData, setSubmissionData] = useState<ReadyToBuyData | null>(null);
  const [celebrating, setCelebrating] = useState(false);

  useEffect(() => {
    const fetchDeal = async () => {
      try {
        const res = await fetch(`/api/deals/${dealId}`);
        if (!res.ok) throw new Error("Failed to load deal");
        const data = await res.json();
        setDeal({
          id: data.deal.id,
          address: data.deal.address,
          city: data.deal.city,
          state: data.deal.state,
          zip: data.deal.zip,
          purchasePrice: data.deal.purchasePrice,
        });
      } catch (err) {
        console.error("Error loading deal:", err);
      } finally {
        setLoading(false);
      }
    };

    if (dealId) fetchDeal();
  }, [dealId]);

  const handleQuestionnaireComplete = (info: BuyerInfo) => {
    setBuyerInfo(info);
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleContractAndWireComplete = (data: {
    signatureDataUrl: string;
    wireImageUrl: string;
  }) => {
    const submission: ReadyToBuyData = {
      dealId: dealId,
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-gray-600">Deal not found</p>
          <Link href="/dashboard/deals" className="text-black underline font-medium">
            Back to deals
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header — hidden on confirmation step */}
      {step < 3 && (
        <div className="mb-8">
          <Link
            href={`/dashboard/deals/${dealId}`}
            className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1 mb-4 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to deal
          </Link>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Ready to Buy</h1>
              <p className="text-gray-600 mt-1">{deal.address}, {deal.city}, {deal.state} {deal.zip}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(deal.purchasePrice)}
              </p>
            </div>
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
                    ? "bg-black text-white"
                    : step > s.num
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-400"
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
                {i < 2 && <div className="w-8 h-px bg-gray-300" />}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step Content */}
      {step === 1 && (
        <div className="max-w-2xl">
          <BuyerQuestionnaire
            onComplete={handleQuestionnaireComplete}
            initialData={buyerInfo || undefined}
          />
        </div>
      )}

      {step === 2 && buyerInfo && (
        <ContractAndWire
          dealId={dealId}
          propertyAddress={deal.address}
          city={deal.city}
          state={deal.state}
          zip={deal.zip}
          purchasePrice={deal.purchasePrice}
          buyerInfo={buyerInfo}
          onComplete={handleContractAndWireComplete}
          onBack={() => setStep(1)}
        />
      )}

      {step === 3 && submissionData && (
        <Confirmation
          data={submissionData}
          propertyAddress={`${deal.address}, ${deal.city}, ${deal.state} ${deal.zip}`}
          purchasePrice={deal.purchasePrice}
        />
      )}

      {/* Celebration Animation */}
      {celebrating && <CelebrationOverlay onComplete={handleCelebrationComplete} />}
    </div>
  );
}
