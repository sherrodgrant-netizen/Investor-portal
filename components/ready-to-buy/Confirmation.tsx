"use client";

import Link from "next/link";
import { ReadyToBuyData } from "@/types/ready-to-buy";

interface ConfirmationProps {
  data: ReadyToBuyData;
  propertyAddress: string;
  purchasePrice: number;
  onClose?: () => void;
}

export default function Confirmation({ data, propertyAddress, purchasePrice, onClose }: ConfirmationProps) {
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(val);

  const buyerName =
    data.buyerInfo.buyerType === "llc"
      ? data.buyerInfo.llcName
      : data.buyerInfo.fullLegalName;

  return (
    <div className="max-w-2xl mx-auto text-center space-y-8 py-8">
      {/* Success Icon */}
      <div className="flex justify-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Purchase Submitted</h2>
        <p className="text-gray-600">
          Your purchase is being processed. Our team will review your submission and reach out shortly.
        </p>
      </div>

      {/* Summary Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 text-left space-y-4">
        <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-3">Submission Summary</h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Property</p>
            <p className="text-sm font-semibold text-gray-900">{propertyAddress}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Purchase Price</p>
            <p className="text-sm font-semibold text-gray-900">{formatCurrency(purchasePrice)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Buyer</p>
            <p className="text-sm font-semibold text-gray-900">{buyerName}</p>
            <p className="text-xs text-gray-500 capitalize">{data.buyerInfo.buyerType === "llc" ? "LLC" : "Personal"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Funding</p>
            <p className="text-sm font-semibold text-gray-900 capitalize">
              {data.buyerInfo.fundingType === "hard_money" ? "Hard Money" : "Cash"}
            </p>
            {data.buyerInfo.lenderName && (
              <p className="text-xs text-gray-500">{data.buyerInfo.lenderName}</p>
            )}
          </div>
        </div>

        {/* Contract Status */}
        <div className="bg-green-50 rounded-xl p-4 flex items-center gap-3 border border-green-200">
          <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm font-semibold text-green-800">Assignment Contract Signed</p>
            <p className="text-xs text-green-600">
              {data.signedAt ? `Signed on ${new Date(data.signedAt).toLocaleDateString()}` : "Signed"}
            </p>
          </div>
        </div>

        {/* Wire Status */}
        {data.wireImageUrl && (
          <div className="rounded-xl p-4 flex items-center gap-3 border bg-blue-50 border-blue-200">
            <svg className="w-5 h-5 flex-shrink-0 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-blue-800">Wire Confirmation Uploaded</p>
              <p className="text-xs text-gray-600">Our team will review and verify your wire transfer.</p>
            </div>
          </div>
        )}
      </div>

      {/* Next Steps */}
      <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6 text-left">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">What happens next?</h3>
        <ol className="space-y-3">
          <li className="flex items-start gap-3">
            <span className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
            <p className="text-sm text-gray-700">Our team reviews your signed contract and wire confirmation</p>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
            <p className="text-sm text-gray-700">Once everything is approved all docs get sent to title</p>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
            <p className="text-sm text-gray-700">You receive closing documents for final review and signature</p>
          </li>
        </ol>
      </div>

      {/* Actions */}
      <div className="flex gap-4 justify-center">
        {onClose ? (
          <button
            onClick={onClose}
            className="px-6 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-all"
          >
            Back to Deal
          </button>
        ) : (
          <Link
            href="/dashboard/deals"
            className="px-6 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-all"
          >
            Back to Deals
          </Link>
        )}
      </div>
    </div>
  );
}
