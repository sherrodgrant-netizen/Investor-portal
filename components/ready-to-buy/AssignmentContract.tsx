"use client";

import { useState } from "react";
import { BuyerInfo } from "@/types/ready-to-buy";
import SignaturePad from "./SignaturePad";

interface AssignmentContractProps {
  propertyAddress: string;
  city: string;
  state: string;
  zip: string;
  purchasePrice: number;
  buyerInfo: BuyerInfo;
  onSign: (signatureDataUrl: string) => void;
  existingSignature?: string;
}

export default function AssignmentContract({
  propertyAddress,
  city,
  state,
  zip,
  purchasePrice,
  buyerInfo,
  onSign,
  existingSignature,
}: AssignmentContractProps) {
  const [assignmentFee, setAssignmentFee] = useState(5000);
  const [closingDate, setClosingDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split("T")[0];
  });
  const [signed, setSigned] = useState(!!existingSignature);
  const [signatureUrl, setSignatureUrl] = useState(existingSignature || "");

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(val);

  const buyerDisplayName =
    buyerInfo.buyerType === "llc"
      ? `${buyerInfo.llcName} (EIN: ${buyerInfo.ein})`
      : buyerInfo.fullLegalName || "";

  const signerName =
    buyerInfo.buyerType === "llc"
      ? buyerInfo.authorizedSignerName
      : buyerInfo.fullLegalName;

  const totalPrice = purchasePrice + assignmentFee;

  const handleSign = (dataUrl: string) => {
    setSignatureUrl(dataUrl);
    setSigned(true);
    onSign(dataUrl);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">Assignment Contract</h3>
        {signed && (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-200">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Signed
          </span>
        )}
      </div>

      {/* Contract Document */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5 text-sm text-gray-700 leading-relaxed max-h-[500px] overflow-y-auto" style={{ scrollbarWidth: "thin" }}>
        <div className="text-center border-b border-gray-200 pb-4">
          <h4 className="text-lg font-bold text-gray-900 uppercase tracking-wide">
            Assignment of Real Estate Purchase Agreement
          </h4>
          <p className="text-xs text-gray-500 mt-1">
            Date: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

        <p>
          This Assignment of Real Estate Purchase Agreement (&ldquo;Assignment&rdquo;) is entered into as of the date signed below,
          by and between:
        </p>

        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <p><strong>Assignor:</strong> Diamond Acquisitions LLC (&ldquo;Assignor&rdquo;)</p>
          <p><strong>Assignee:</strong> {buyerDisplayName} (&ldquo;Assignee&rdquo;)</p>
        </div>

        <p><strong>RECITALS</strong></p>

        <p>
          WHEREAS, Assignor has entered into a Real Estate Purchase Agreement (the &ldquo;Original Agreement&rdquo;)
          for the purchase of the property located at:
        </p>

        <div className="bg-gray-50 rounded-lg p-4">
          <p className="font-semibold text-gray-900">{propertyAddress}</p>
          <p className="text-gray-600">{city}, {state} {zip}</p>
        </div>

        <p>
          WHEREAS, the original purchase price under the Original Agreement is{" "}
          <strong>{formatCurrency(purchasePrice)}</strong>; and
        </p>

        <p>
          WHEREAS, Assignor desires to assign all rights, title, and interest in and to the Original Agreement
          to Assignee, and Assignee desires to accept such assignment;
        </p>

        <p><strong>AGREEMENT</strong></p>

        <p>NOW, THEREFORE, in consideration of the mutual covenants and agreements set forth herein, the parties agree as follows:</p>

        <ol className="list-decimal pl-6 space-y-3">
          <li>
            <strong>Assignment.</strong> Assignor hereby assigns, transfers, and conveys to Assignee all of
            Assignor&apos;s rights, title, and interest in and to the Original Agreement for the property described above.
          </li>
          <li>
            <strong>Assignment Fee.</strong> In consideration of this Assignment, Assignee shall pay Assignor an
            assignment fee of:
            <div className="mt-2 flex items-center gap-3">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                <input
                  type="number"
                  value={assignmentFee}
                  onChange={(e) => setAssignmentFee(Number(e.target.value))}
                  disabled={signed}
                  className="w-32 px-3 py-2 pl-7 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>
              <span className="text-xs text-gray-500">
                (Total to buyer: {formatCurrency(totalPrice)})
              </span>
            </div>
          </li>
          <li>
            <strong>Closing Date.</strong> The closing of the transaction shall occur on or before:
            <div className="mt-2">
              <input
                type="date"
                value={closingDate}
                onChange={(e) => setClosingDate(e.target.value)}
                disabled={signed}
                className="px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
              />
            </div>
          </li>
          <li>
            <strong>Assumption of Obligations.</strong> Assignee hereby assumes all obligations of the Buyer
            under the Original Agreement, including but not limited to the obligation to pay the purchase price
            and to close the transaction in accordance with the terms thereof.
          </li>
          <li>
            <strong>Earnest Money.</strong> Assignee shall deposit earnest money as required under the Original
            Agreement within three (3) business days of the execution of this Assignment.
          </li>
          <li>
            <strong>Representations.</strong> Assignee represents that they have reviewed the Original Agreement
            and understand all terms and conditions contained therein. Assignee acknowledges that the property
            is being sold &ldquo;AS-IS&rdquo; with no warranties or guarantees by Assignor.
          </li>
          <li>
            <strong>Governing Law.</strong> This Assignment shall be governed by and construed in accordance
            with the laws of the State of {state}.
          </li>
        </ol>

        <div className="border-t border-gray-200 pt-4 mt-6">
          <p className="font-semibold mb-3">IN WITNESS WHEREOF, the parties have executed this Assignment as of the date written below.</p>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Assignor</p>
              <p className="font-semibold">Diamond Acquisitions LLC</p>
              <div className="border-b border-gray-300 pb-1 italic text-gray-400 text-xs">
                Pre-signed by Assignor
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Assignee</p>
              <p className="font-semibold">{signerName}</p>
              {signed && signatureUrl ? (
                <div className="border-b border-gray-300 pb-1">
                  <img src={signatureUrl} alt="Buyer signature" className="h-12 object-contain" />
                </div>
              ) : (
                <div className="border-b border-gray-300 pb-1 italic text-gray-400 text-xs">
                  Pending signature
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Signature Area */}
      {!signed && (
        <div>
          <p className="text-sm text-gray-600 mb-3">
            By signing below, you agree to the terms of this Assignment Contract.
          </p>
          <SignaturePad onSign={handleSign} />
        </div>
      )}
    </div>
  );
}
