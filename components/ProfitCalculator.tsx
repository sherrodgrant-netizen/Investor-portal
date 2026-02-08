"use client";

import { useState, useMemo, useEffect } from "react";

interface ProfitCalculatorProps {
  purchasePrice: number;
  estimatedRehab: number;
  arv: number;
  arvRange: { min: number; max: number; avg: number };
  annualTaxes: number;
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "flip" | "rental" | null;
}

type CalculatorMode = "flip" | "rental" | null;
type FlipFinancing = "cash" | "hardmoney";

export default function ProfitCalculator({
  purchasePrice: initialPurchasePrice,
  estimatedRehab: initialRehab,
  arv: initialArv,
  arvRange,
  annualTaxes,
  isOpen,
  onClose,
  initialMode = null,
}: ProfitCalculatorProps) {
  // Mode selection (FLIP or RENTAL first)
  const [mode, setMode] = useState<CalculatorMode>(initialMode);

  // Update mode when initialMode changes (e.g. opening from flip/rental button)
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
    }
  }, [isOpen, initialMode]);

  // Shared state
  const [assumedArv, setAssumedArv] = useState(initialArv || arvRange.avg);
  const [rehabCosts, setRehabCosts] = useState(initialRehab);

  // FLIP state
  const [flipFinancing, setFlipFinancing] = useState<FlipFinancing>("cash");
  const [holdingPeriod, setHoldingPeriod] = useState(7);

  // Hard money state (for flips)
  const [hmDownPayment, setHmDownPayment] = useState(10);
  const [hmInterestRate, setHmInterestRate] = useState(12);
  const [hmPoints, setHmPoints] = useState(2);

  // RENTAL / DSCR Loan state
  const [dscrDownPayment, setDscrDownPayment] = useState(25);
  const [dscrInterestRate, setDscrInterestRate] = useState(7.5);
  const [dscrLoanTerm, setDscrLoanTerm] = useState(30);
  const [dscrPoints, setDscrPoints] = useState(1);

  // Rental income/expense state
  const [monthlyRent, setMonthlyRent] = useState(1500);
  const [propertyMgmtPercent, setPropertyMgmtPercent] = useState(10);
  const [maintenancePercent, setMaintenancePercent] = useState(5);
  const [vacancyPercent, setVacancyPercent] = useState(5);
  const [monthlyHoa, setMonthlyHoa] = useState(0);

  // Reset state when modal opens with new data
  useEffect(() => {
    if (isOpen) {
      setAssumedArv(initialArv || arvRange.avg);
      setRehabCosts(initialRehab);
    }
  }, [isOpen, initialArv, arvRange.avg, initialRehab]);

  // Derived values
  const monthlyTaxes = annualTaxes / 12;
  const closingCostsBuy = initialPurchasePrice * 0.02;
  const sellingCosts = assumedArv * 0.05;

  // Holding costs based on ARV
  const monthlyInsurance = (assumedArv * 0.015) / 12;
  const monthlyMisc = (assumedArv * 0.01) / 12;

  // Hard money calculations (for flips)
  const hmLoanAmount = initialPurchasePrice * (1 - hmDownPayment / 100);
  const hmDownDollars = initialPurchasePrice * (hmDownPayment / 100);
  const hmPointsCost = hmLoanAmount * (hmPoints / 100);
  const hmMonthlyInterest = hmLoanAmount * (hmInterestRate / 100 / 12);

  // DSCR Loan calculations (for rentals)
  const totalBasis = initialPurchasePrice + rehabCosts;
  const dscrLoanAmount = totalBasis * (1 - dscrDownPayment / 100);
  const dscrDownDollars = totalBasis * (dscrDownPayment / 100);
  const dscrPointsCost = dscrLoanAmount * (dscrPoints / 100);

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Calculate monthly P&I payment
  function calculateMonthlyPayment(principal: number, annualRate: number, years: number) {
    const monthlyRate = annualRate / 100 / 12;
    const numPayments = years * 12;
    if (monthlyRate === 0) return principal / numPayments;
    return (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
      (Math.pow(1 + monthlyRate, numPayments) - 1);
  }

  const dscrMonthlyPayment = calculateMonthlyPayment(dscrLoanAmount, dscrInterestRate, dscrLoanTerm);

  // Flip calculations
  const flipResults = useMemo(() => {
    const monthlyHoldingBase = monthlyTaxes + monthlyInsurance + monthlyMisc;

    if (flipFinancing === "cash") {
      const frontEndCosts = initialPurchasePrice + closingCostsBuy;
      const totalHolding = monthlyHoldingBase * holdingPeriod;
      const totalProjectCost = frontEndCosts + totalHolding + rehabCosts + sellingCosts;
      const profit = assumedArv - totalProjectCost;
      const totalCashInvested = frontEndCosts + totalHolding + rehabCosts;
      const roi = (profit / totalCashInvested) * 100;
      const annualizedRoi = (roi / holdingPeriod) * 12;
      const profitPerMonth = profit / holdingPeriod;

      return {
        totalCashInvested,
        totalProjectCost,
        profit,
        roi,
        annualizedRoi,
        profitPerMonth,
        monthlyHolding: monthlyHoldingBase,
      };
    } else {
      const frontEndCosts = hmDownDollars + closingCostsBuy + hmPointsCost;
      const monthlyHoldingWithInterest = monthlyHoldingBase + hmMonthlyInterest;
      const totalHolding = monthlyHoldingWithInterest * holdingPeriod;
      const loanPayoff = hmLoanAmount;
      const totalProjectCost = frontEndCosts + totalHolding + rehabCosts + sellingCosts + loanPayoff;
      const profit = assumedArv - totalProjectCost;
      const totalCashInvested = frontEndCosts + totalHolding + rehabCosts;
      const roi = (profit / totalCashInvested) * 100;
      const annualizedRoi = (roi / holdingPeriod) * 12;
      const profitPerMonth = profit / holdingPeriod;

      return {
        totalCashInvested,
        totalProjectCost,
        profit,
        roi,
        annualizedRoi,
        profitPerMonth,
        monthlyHolding: monthlyHoldingWithInterest,
      };
    }
  }, [
    flipFinancing, initialPurchasePrice, closingCostsBuy, monthlyTaxes,
    monthlyInsurance, monthlyMisc, holdingPeriod, rehabCosts,
    sellingCosts, assumedArv, hmDownDollars, hmPointsCost, hmMonthlyInterest, hmLoanAmount,
  ]);

  // Rental calculations (with DSCR loan)
  const rentalResults = useMemo(() => {
    const monthlyExpenses =
      (monthlyRent * propertyMgmtPercent / 100) +
      monthlyTaxes +
      monthlyInsurance +
      (monthlyRent * maintenancePercent / 100) +
      (monthlyRent * vacancyPercent / 100) +
      monthlyHoa +
      dscrMonthlyPayment;

    const noi = (monthlyRent * 12) - ((monthlyExpenses - dscrMonthlyPayment) * 12);
    const cashFlow = monthlyRent - monthlyExpenses;
    const annualCashFlow = cashFlow * 12;

    // Total cash invested = down payment + closing costs + rehab + DSCR points
    const totalCashInvested = dscrDownDollars + closingCostsBuy + rehabCosts + dscrPointsCost;

    const capRate = (noi / totalBasis) * 100;
    const cashOnCash = (annualCashFlow / totalCashInvested) * 100;

    // DSCR calculation
    const dscr = monthlyRent / (dscrMonthlyPayment + monthlyTaxes + monthlyInsurance);

    return {
      monthlyExpenses,
      noi,
      cashFlow,
      annualCashFlow,
      totalCashInvested,
      capRate,
      cashOnCash,
      dscr,
      monthlyPayment: dscrMonthlyPayment,
    };
  }, [
    monthlyRent, propertyMgmtPercent, monthlyTaxes, monthlyInsurance,
    maintenancePercent, vacancyPercent, monthlyHoa, dscrMonthlyPayment,
    totalBasis, dscrDownDollars, closingCostsBuy, rehabCosts, dscrPointsCost,
  ]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      {/* Modal */}
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden flex flex-col border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 pb-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0 bg-black text-white">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Deal Calculator
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-300 hover:text-white hover:bg-gray-800 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 p-6 bg-gray-50">
          {/* Mode Selection - FLIP or RENTAL First - only shown when no initialMode */}
          {mode === null ? (
            <div className="space-y-6">
              <p className="text-gray-600 text-center">What's your strategy for this property?</p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setMode("flip")}
                  className="p-6 bg-white rounded-xl border-2 border-gray-200 hover:border-black hover:shadow-md transition-all duration-200 group"
                >
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-black group-hover:text-white transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <span className="text-lg font-bold text-gray-900 block">FLIP</span>
                  <span className="text-sm text-gray-500 mt-1 block">Buy, Rehab, Sell</span>
                </button>
                <button
                  onClick={() => setMode("rental")}
                  className="p-6 bg-white rounded-xl border-2 border-gray-200 hover:border-black hover:shadow-md transition-all duration-200 group"
                >
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-black group-hover:text-white transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <span className="text-lg font-bold text-gray-900 block">RENTAL</span>
                  <span className="text-sm text-gray-500 mt-1 block">Buy, Hold, Rent</span>
                </button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Purchase</p>
                  <p className="text-lg font-bold text-gray-900">{formatCurrency(initialPurchasePrice)}</p>
                </div>
                <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Rehab</p>
                  <p className="text-lg font-bold text-gray-900">{formatCurrency(initialRehab)}</p>
                </div>
                <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">ARV</p>
                  <p className="text-lg font-bold text-green-600">{formatCurrency(initialArv)}</p>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Back Button */}
              <button
                onClick={() => setMode(null)}
                className="mb-4 text-gray-600 hover:text-gray-900 text-sm flex items-center gap-2 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to strategy selection
              </button>

              {/* ARV Slider */}
              <div className="mb-6 p-4 bg-white rounded-xl border border-gray-200">
                <label className="block text-xs text-gray-500 uppercase tracking-wide mb-2">
                  Assumed Sale Price / ARV
                </label>
                <p className="text-2xl font-bold text-green-600 mb-3">
                  {formatCurrency(assumedArv)}
                </p>
                <input
                  type="range"
                  min={arvRange.min * 0.8}
                  max={arvRange.max * 1.2}
                  step={1000}
                  value={assumedArv}
                  onChange={(e) => setAssumedArv(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{formatCurrency(arvRange.min * 0.8)}</span>
                  <span>{formatCurrency(arvRange.max * 1.2)}</span>
                </div>
              </div>

              {/* Rehab Slider */}
              <div className="mb-6 p-4 bg-white rounded-xl border border-gray-200">
                <label className="block text-xs text-gray-500 uppercase tracking-wide mb-2">
                  Estimated Rehab
                </label>
                <p className="text-2xl font-bold text-gray-900 mb-3">
                  {formatCurrency(rehabCosts)}
                </p>
                <input
                  type="range"
                  min={0}
                  max={initialRehab * 2}
                  step={500}
                  value={rehabCosts}
                  onChange={(e) => setRehabCosts(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                />
              </div>

              {/* Purchase Price & Closing Costs */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-white rounded-xl border border-gray-200">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Purchase Price</p>
                  <p className="text-lg font-bold text-gray-900">{formatCurrency(initialPurchasePrice)}</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-gray-200">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Closing Costs</p>
                  <p className="text-lg font-bold text-gray-900">{formatCurrency(closingCostsBuy)}</p>
                </div>
              </div>

              {/* FLIP MODE */}
              {mode === "flip" && (
                <div className="space-y-4">
                  {/* Financing Toggle */}
                  <div className="mb-6">
                    <label className="block text-xs text-gray-500 uppercase tracking-wide mb-3">Financing</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setFlipFinancing("cash")}
                        className={`py-3 px-4 rounded-full font-semibold text-sm transition-all ${
                          flipFinancing === "cash"
                            ? "bg-black text-white"
                            : "bg-white text-gray-900 border border-gray-300 hover:bg-gray-100"
                        }`}
                      >
                        Cash
                      </button>
                      <button
                        onClick={() => setFlipFinancing("hardmoney")}
                        className={`py-3 px-4 rounded-full font-semibold text-sm transition-all ${
                          flipFinancing === "hardmoney"
                            ? "bg-black text-white"
                            : "bg-white text-gray-900 border border-gray-300 hover:bg-gray-100"
                        }`}
                      >
                        Hard Money
                      </button>
                    </div>
                  </div>

                  {/* Hard Money Inputs */}
                  {flipFinancing === "hardmoney" && (
                    <div className="p-4 bg-white rounded-xl mb-4 space-y-3 border border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-3">Hard Money Terms</h4>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Down Payment %</label>
                          <input
                            type="number"
                            value={hmDownPayment}
                            onChange={(e) => setHmDownPayment(Number(e.target.value))}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Interest Rate %</label>
                          <input
                            type="number"
                            step="0.5"
                            value={hmInterestRate}
                            onChange={(e) => setHmInterestRate(Number(e.target.value))}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Points</label>
                          <input
                            type="number"
                            step="0.5"
                            value={hmPoints}
                            onChange={(e) => setHmPoints(Number(e.target.value))}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <div className="p-2 bg-gray-50 rounded-lg text-center">
                          <p className="text-xs text-gray-500">Loan Amount</p>
                          <p className="font-bold text-gray-900">{formatCurrency(hmLoanAmount)}</p>
                        </div>
                        <div className="p-2 bg-gray-50 rounded-lg text-center">
                          <p className="text-xs text-gray-500">Monthly Interest</p>
                          <p className="font-bold text-gray-900">{formatCurrency(hmMonthlyInterest)}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Flip Analysis */}
                  <div className="p-4 bg-white rounded-xl border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-4">Flip Analysis</h4>

                    {/* Holding Period */}
                    <div className="mb-4">
                      <label className="block text-xs text-gray-500 mb-2">Holding Period (months)</label>
                      <div className="flex flex-wrap gap-2">
                        {[1, 2, 3, 4, 5, 6, 7].map((m) => (
                          <button
                            key={m}
                            onClick={() => setHoldingPeriod(m)}
                            className={`w-10 h-10 rounded-full font-bold transition-all ${
                              holdingPeriod === m
                                ? "bg-black text-white"
                                : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                            }`}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Monthly Costs */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="p-2 bg-gray-50 rounded-lg text-center">
                        <p className="text-xs text-gray-500">Taxes/mo</p>
                        <p className="text-sm font-bold text-gray-900">{formatCurrency(monthlyTaxes)}</p>
                      </div>
                      <div className="p-2 bg-gray-50 rounded-lg text-center">
                        <p className="text-xs text-gray-500">Insurance/mo</p>
                        <p className="text-sm font-bold text-gray-900">{formatCurrency(monthlyInsurance)}</p>
                      </div>
                      <div className="p-2 bg-gray-50 rounded-lg text-center">
                        <p className="text-xs text-gray-500">Misc/mo</p>
                        <p className="text-sm font-bold text-gray-900">{formatCurrency(monthlyMisc)}</p>
                      </div>
                    </div>

                    {/* Selling Costs */}
                    <div className="p-3 bg-gray-50 rounded-lg mb-4 text-sm flex justify-between">
                      <span className="text-gray-600">Selling Costs (5% of ARV)</span>
                      <span className="font-bold text-gray-900">{formatCurrency(sellingCosts)}</span>
                    </div>
                  </div>

                  {/* Flip Results */}
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h4 className="font-bold text-lg mb-4 text-gray-900">Flip Results</h4>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500">Total Cash Invested</p>
                        <p className="text-lg font-bold text-gray-900">{formatCurrency(flipResults.totalCashInvested)}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500">Total Project Cost</p>
                        <p className="text-lg font-bold text-gray-900">{formatCurrency(flipResults.totalProjectCost)}</p>
                      </div>
                    </div>

                    {/* Profit Display */}
                    <div className={`p-6 rounded-xl text-center mb-4 ${
                      flipResults.profit >= 0
                        ? "bg-green-50 border border-green-200"
                        : "bg-red-50 border border-red-200"
                    }`}>
                      <p className="text-sm text-gray-600 mb-1">Estimated Profit</p>
                      <p className={`text-3xl font-bold ${flipResults.profit >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {formatCurrency(flipResults.profit)}
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        {formatCurrency(flipResults.profitPerMonth)}/month over {holdingPeriod} months
                      </p>
                    </div>

                    {/* ROI Display */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 rounded-lg text-center">
                        <p className="text-xs text-gray-500">ROI</p>
                        <p className={`text-2xl font-bold ${flipResults.roi >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {flipResults.roi.toFixed(1)}%
                        </p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg text-center">
                        <p className="text-xs text-gray-500">Annualized ROI</p>
                        <p className={`text-2xl font-bold ${flipResults.annualizedRoi >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {flipResults.annualizedRoi.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* RENTAL MODE */}
              {mode === "rental" && (
                <div className="space-y-4">
                  {/* DSCR Loan Section */}
                  <div className="p-4 bg-white rounded-xl border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-4">DSCR Loan Terms</h4>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Down Payment %</label>
                        <input
                          type="number"
                          value={dscrDownPayment}
                          onChange={(e) => setDscrDownPayment(Number(e.target.value))}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Interest Rate %</label>
                        <input
                          type="number"
                          step="0.125"
                          value={dscrInterestRate}
                          onChange={(e) => setDscrInterestRate(Number(e.target.value))}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Loan Term (years)</label>
                        <select
                          value={dscrLoanTerm}
                          onChange={(e) => setDscrLoanTerm(Number(e.target.value))}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white"
                        >
                          <option value={15}>15 years</option>
                          <option value={20}>20 years</option>
                          <option value={30}>30 years</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Points</label>
                        <input
                          type="number"
                          step="0.5"
                          value={dscrPoints}
                          onChange={(e) => setDscrPoints(Number(e.target.value))}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-200">
                      <div className="p-2 bg-gray-50 rounded-lg text-center">
                        <p className="text-xs text-gray-500">Loan Amount</p>
                        <p className="font-bold text-sm text-gray-900">{formatCurrency(dscrLoanAmount)}</p>
                      </div>
                      <div className="p-2 bg-gray-50 rounded-lg text-center">
                        <p className="text-xs text-gray-500">Down Payment</p>
                        <p className="font-bold text-sm text-gray-900">{formatCurrency(dscrDownDollars)}</p>
                      </div>
                      <div className="p-2 bg-gray-50 rounded-lg text-center">
                        <p className="text-xs text-gray-500">Monthly P&I</p>
                        <p className="font-bold text-sm text-green-600">{formatCurrency(dscrMonthlyPayment)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Rental Income/Expense */}
                  <div className="p-4 bg-white rounded-xl border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-4">Rental Analysis</h4>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Monthly Rent</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                          <input
                            type="number"
                            value={monthlyRent}
                            onChange={(e) => setMonthlyRent(Number(e.target.value))}
                            className="w-full px-3 py-2 pl-7 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Property Mgmt %</label>
                        <input
                          type="number"
                          value={propertyMgmtPercent}
                          onChange={(e) => setPropertyMgmtPercent(Number(e.target.value))}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Maintenance %</label>
                        <input
                          type="number"
                          value={maintenancePercent}
                          onChange={(e) => setMaintenancePercent(Number(e.target.value))}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Vacancy %</label>
                        <input
                          type="number"
                          value={vacancyPercent}
                          onChange={(e) => setVacancyPercent(Number(e.target.value))}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Monthly HOA</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                          <input
                            type="number"
                            value={monthlyHoa}
                            onChange={(e) => setMonthlyHoa(Number(e.target.value))}
                            className="w-full px-3 py-2 pl-7 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Insurance/mo (1.5% ARV)</label>
                        <div className="p-2 bg-gray-50 rounded-lg text-sm text-gray-900">
                          {formatCurrency(monthlyInsurance)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Rental Results */}
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h4 className="font-bold text-lg mb-4 text-gray-900">Rental Returns</h4>

                    {/* Cash Flow Display */}
                    <div className={`p-6 rounded-xl text-center mb-4 ${
                      rentalResults.cashFlow >= 0
                        ? "bg-green-50 border border-green-200"
                        : "bg-red-50 border border-red-200"
                    }`}>
                      <p className="text-sm text-gray-600 mb-1">Monthly Cash Flow</p>
                      <p className={`text-3xl font-bold ${rentalResults.cashFlow >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {formatCurrency(rentalResults.cashFlow)}
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        {formatCurrency(rentalResults.annualCashFlow)}/year
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="p-3 bg-gray-50 rounded-lg text-center">
                        <p className="text-xs text-gray-500">Total Cash Invested</p>
                        <p className="text-lg font-bold text-gray-900">{formatCurrency(rentalResults.totalCashInvested)}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg text-center">
                        <p className="text-xs text-gray-500">Monthly Expenses</p>
                        <p className="text-lg font-bold text-gray-900">{formatCurrency(rentalResults.monthlyExpenses)}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-4 bg-gray-50 rounded-lg text-center">
                        <p className="text-xs text-gray-500">Cap Rate</p>
                        <p className="text-xl font-bold text-gray-900">
                          {rentalResults.capRate.toFixed(1)}%
                        </p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg text-center">
                        <p className="text-xs text-gray-500">Cash-on-Cash</p>
                        <p className={`text-xl font-bold ${rentalResults.cashOnCash >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {rentalResults.cashOnCash.toFixed(1)}%
                        </p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg text-center">
                        <p className="text-xs text-gray-500">DSCR</p>
                        <p className={`text-xl font-bold ${rentalResults.dscr >= 1 ? "text-green-600" : "text-red-600"}`}>
                          {rentalResults.dscr.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {rentalResults.dscr < 1.25 && (
                      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm flex items-start gap-2">
                        <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span className="text-gray-700">
                          Most DSCR lenders require a DSCR of 1.25+. Consider increasing rent or down payment.
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 flex-shrink-0 bg-gray-100">
          <p className="text-xs text-gray-500 text-center">
            Estimates only. Consult with your advisor for detailed analysis.
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// INLINE CALCULATOR — renders calculator content without modal
// ============================================================

interface InlineCalculatorContentProps {
  purchasePrice: number;
  estimatedRehab: number;
  arv: number;
  arvRange: { min: number; max: number; avg: number };
  annualTaxes: number;
  mode: "flip" | "rental";
  onBack: () => void;
}

export function InlineCalculatorContent({
  purchasePrice: initialPurchasePrice,
  estimatedRehab: initialRehab,
  arv: initialArv,
  arvRange,
  annualTaxes,
  mode,
  onBack,
}: InlineCalculatorContentProps) {
  // Shared state
  const [assumedArv, setAssumedArv] = useState(initialArv || arvRange.avg);
  const [rehabCosts, setRehabCosts] = useState(initialRehab);

  // FLIP state
  const [flipFinancing, setFlipFinancing] = useState<FlipFinancing>("cash");
  const [holdingPeriod, setHoldingPeriod] = useState(7);

  // Hard money state
  const [hmDownPayment, setHmDownPayment] = useState(10);
  const [hmInterestRate, setHmInterestRate] = useState(12);
  const [hmPoints, setHmPoints] = useState(2);

  // DSCR Loan state
  const [dscrDownPayment, setDscrDownPayment] = useState(25);
  const [dscrInterestRate, setDscrInterestRate] = useState(7.5);
  const [dscrLoanTerm, setDscrLoanTerm] = useState(30);
  const [dscrPoints, setDscrPoints] = useState(1);

  // Rental income/expense state
  const [monthlyRent, setMonthlyRent] = useState(1500);
  const [propertyMgmtPercent, setPropertyMgmtPercent] = useState(10);
  const [maintenancePercent, setMaintenancePercent] = useState(5);
  const [vacancyPercent, setVacancyPercent] = useState(5);
  const [monthlyHoa, setMonthlyHoa] = useState(0);

  // Derived values
  const monthlyTaxes = annualTaxes / 12;
  const closingCostsBuy = initialPurchasePrice * 0.02;
  const sellingCosts = assumedArv * 0.05;
  const monthlyInsurance = (assumedArv * 0.015) / 12;
  const monthlyMisc = (assumedArv * 0.01) / 12;

  // Hard money calculations
  const hmLoanAmount = initialPurchasePrice * (1 - hmDownPayment / 100);
  const hmDownDollars = initialPurchasePrice * (hmDownPayment / 100);
  const hmPointsCost = hmLoanAmount * (hmPoints / 100);
  const hmMonthlyInterest = hmLoanAmount * (hmInterestRate / 100 / 12);

  // DSCR calculations
  const totalBasis = initialPurchasePrice + rehabCosts;
  const dscrLoanAmount = totalBasis * (1 - dscrDownPayment / 100);
  const dscrDownDollars = totalBasis * (dscrDownPayment / 100);
  const dscrPointsCost = dscrLoanAmount * (dscrPoints / 100);

  function calculateMonthlyPayment(principal: number, annualRate: number, years: number) {
    const monthlyRate = annualRate / 100 / 12;
    const numPayments = years * 12;
    if (monthlyRate === 0) return principal / numPayments;
    return (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
      (Math.pow(1 + monthlyRate, numPayments) - 1);
  }

  const dscrMonthlyPayment = calculateMonthlyPayment(dscrLoanAmount, dscrInterestRate, dscrLoanTerm);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Flip calculations
  const flipResults = useMemo(() => {
    const monthlyHoldingBase = monthlyTaxes + monthlyInsurance + monthlyMisc;

    if (flipFinancing === "cash") {
      const frontEndCosts = initialPurchasePrice + closingCostsBuy;
      const totalHolding = monthlyHoldingBase * holdingPeriod;
      const totalProjectCost = frontEndCosts + totalHolding + rehabCosts + sellingCosts;
      const profit = assumedArv - totalProjectCost;
      const totalCashInvested = frontEndCosts + totalHolding + rehabCosts;
      const roi = (profit / totalCashInvested) * 100;
      const annualizedRoi = (roi / holdingPeriod) * 12;
      const profitPerMonth = profit / holdingPeriod;

      return { totalCashInvested, totalProjectCost, profit, roi, annualizedRoi, profitPerMonth, monthlyHolding: monthlyHoldingBase };
    } else {
      const frontEndCosts = hmDownDollars + closingCostsBuy + hmPointsCost;
      const monthlyHoldingWithInterest = monthlyHoldingBase + hmMonthlyInterest;
      const totalHolding = monthlyHoldingWithInterest * holdingPeriod;
      const loanPayoff = hmLoanAmount;
      const totalProjectCost = frontEndCosts + totalHolding + rehabCosts + sellingCosts + loanPayoff;
      const profit = assumedArv - totalProjectCost;
      const totalCashInvested = frontEndCosts + totalHolding + rehabCosts;
      const roi = (profit / totalCashInvested) * 100;
      const annualizedRoi = (roi / holdingPeriod) * 12;
      const profitPerMonth = profit / holdingPeriod;

      return { totalCashInvested, totalProjectCost, profit, roi, annualizedRoi, profitPerMonth, monthlyHolding: monthlyHoldingWithInterest };
    }
  }, [
    flipFinancing, initialPurchasePrice, closingCostsBuy, monthlyTaxes,
    monthlyInsurance, monthlyMisc, holdingPeriod, rehabCosts,
    sellingCosts, assumedArv, hmDownDollars, hmPointsCost, hmMonthlyInterest, hmLoanAmount,
  ]);

  // Rental calculations
  const rentalResults = useMemo(() => {
    const monthlyExpenses =
      (monthlyRent * propertyMgmtPercent / 100) +
      monthlyTaxes +
      monthlyInsurance +
      (monthlyRent * maintenancePercent / 100) +
      (monthlyRent * vacancyPercent / 100) +
      monthlyHoa +
      dscrMonthlyPayment;

    const noi = (monthlyRent * 12) - ((monthlyExpenses - dscrMonthlyPayment) * 12);
    const cashFlow = monthlyRent - monthlyExpenses;
    const annualCashFlow = cashFlow * 12;
    const totalCashInvested = dscrDownDollars + closingCostsBuy + rehabCosts + dscrPointsCost;
    const capRate = (noi / totalBasis) * 100;
    const cashOnCash = (annualCashFlow / totalCashInvested) * 100;
    const dscr = monthlyRent / (dscrMonthlyPayment + monthlyTaxes + monthlyInsurance);

    return { monthlyExpenses, noi, cashFlow, annualCashFlow, totalCashInvested, capRate, cashOnCash, dscr, monthlyPayment: dscrMonthlyPayment };
  }, [
    monthlyRent, propertyMgmtPercent, monthlyTaxes, monthlyInsurance,
    maintenancePercent, vacancyPercent, monthlyHoa, dscrMonthlyPayment,
    totalBasis, dscrDownDollars, closingCostsBuy, rehabCosts, dscrPointsCost,
  ]);

  return (
    <div className="space-y-4">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="text-gray-600 hover:text-gray-900 text-sm flex items-center gap-2 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to deal
      </button>

      {/* Mode Label */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
          {mode === "flip" ? (
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          )}
        </div>
        <h3 className="text-lg font-bold text-gray-900">
          {mode === "flip" ? "Flip Analysis" : "Rental Analysis"}
        </h3>
      </div>

      {/* ARV Slider */}
      <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
        <label className="block text-xs text-gray-500 uppercase tracking-wide mb-2">
          Assumed Sale Price / ARV
        </label>
        <p className="text-2xl font-bold text-green-600 mb-3">
          {formatCurrency(assumedArv)}
        </p>
        <input
          type="range"
          min={arvRange.min * 0.8}
          max={arvRange.max * 1.2}
          step={1000}
          value={assumedArv}
          onChange={(e) => setAssumedArv(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{formatCurrency(arvRange.min * 0.8)}</span>
          <span>{formatCurrency(arvRange.max * 1.2)}</span>
        </div>
      </div>

      {/* Rehab Slider */}
      <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
        <label className="block text-xs text-gray-500 uppercase tracking-wide mb-2">
          Estimated Rehab
        </label>
        <p className="text-2xl font-bold text-gray-900 mb-3">
          {formatCurrency(rehabCosts)}
        </p>
        <input
          type="range"
          min={0}
          max={initialRehab * 2}
          step={500}
          value={rehabCosts}
          onChange={(e) => setRehabCosts(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
        />
      </div>

      {/* Purchase Price & Closing Costs */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Purchase Price</p>
          <p className="text-lg font-bold text-gray-900">{formatCurrency(initialPurchasePrice)}</p>
        </div>
        <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Closing Costs</p>
          <p className="text-lg font-bold text-gray-900">{formatCurrency(closingCostsBuy)}</p>
        </div>
      </div>

      {/* FLIP MODE */}
      {mode === "flip" && (
        <div className="space-y-4">
          {/* Financing Toggle */}
          <div>
            <label className="block text-xs text-gray-500 uppercase tracking-wide mb-3">Financing</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setFlipFinancing("cash")}
                className={`py-3 px-4 rounded-full font-semibold text-sm transition-all ${
                  flipFinancing === "cash"
                    ? "bg-black text-white"
                    : "bg-white text-gray-900 border border-gray-300 hover:bg-gray-100"
                }`}
              >
                Cash
              </button>
              <button
                onClick={() => setFlipFinancing("hardmoney")}
                className={`py-3 px-4 rounded-full font-semibold text-sm transition-all ${
                  flipFinancing === "hardmoney"
                    ? "bg-black text-white"
                    : "bg-white text-gray-900 border border-gray-300 hover:bg-gray-100"
                }`}
              >
                Hard Money
              </button>
            </div>
          </div>

          {/* Hard Money Inputs */}
          {flipFinancing === "hardmoney" && (
            <div className="p-4 bg-gray-50 rounded-xl space-y-3 border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-3">Hard Money Terms</h4>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Down %</label>
                  <input type="number" value={hmDownPayment} onChange={(e) => setHmDownPayment(Number(e.target.value))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Rate %</label>
                  <input type="number" step="0.5" value={hmInterestRate} onChange={(e) => setHmInterestRate(Number(e.target.value))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Points</label>
                  <input type="number" step="0.5" value={hmPoints} onChange={(e) => setHmPoints(Number(e.target.value))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-2 bg-white rounded-lg text-center">
                  <p className="text-xs text-gray-500">Loan Amount</p>
                  <p className="font-bold text-gray-900">{formatCurrency(hmLoanAmount)}</p>
                </div>
                <div className="p-2 bg-white rounded-lg text-center">
                  <p className="text-xs text-gray-500">Monthly Interest</p>
                  <p className="font-bold text-gray-900">{formatCurrency(hmMonthlyInterest)}</p>
                </div>
              </div>
            </div>
          )}

          {/* Holding Period */}
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
            <label className="block text-xs text-gray-500 mb-2">Holding Period (months)</label>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5, 6, 7].map((m) => (
                <button
                  key={m}
                  onClick={() => setHoldingPeriod(m)}
                  className={`w-10 h-10 rounded-full font-bold transition-all ${
                    holdingPeriod === m
                      ? "bg-black text-white"
                      : "bg-white text-gray-900 hover:bg-gray-200"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Monthly Costs */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2 bg-gray-50 rounded-lg text-center border border-gray-200">
              <p className="text-xs text-gray-500">Taxes/mo</p>
              <p className="text-sm font-bold text-gray-900">{formatCurrency(monthlyTaxes)}</p>
            </div>
            <div className="p-2 bg-gray-50 rounded-lg text-center border border-gray-200">
              <p className="text-xs text-gray-500">Insurance/mo</p>
              <p className="text-sm font-bold text-gray-900">{formatCurrency(monthlyInsurance)}</p>
            </div>
            <div className="p-2 bg-gray-50 rounded-lg text-center border border-gray-200">
              <p className="text-xs text-gray-500">Misc/mo</p>
              <p className="text-sm font-bold text-gray-900">{formatCurrency(monthlyMisc)}</p>
            </div>
          </div>

          {/* Selling Costs */}
          <div className="p-3 bg-gray-50 rounded-lg text-sm flex justify-between border border-gray-200">
            <span className="text-gray-600">Selling Costs (5% of ARV)</span>
            <span className="font-bold text-gray-900">{formatCurrency(sellingCosts)}</span>
          </div>

          {/* Flip Results */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h4 className="font-bold text-lg mb-4 text-gray-900">Flip Results</h4>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Total Cash Invested</p>
                <p className="text-lg font-bold text-gray-900">{formatCurrency(flipResults.totalCashInvested)}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Total Project Cost</p>
                <p className="text-lg font-bold text-gray-900">{formatCurrency(flipResults.totalProjectCost)}</p>
              </div>
            </div>

            {/* Profit */}
            <div className={`p-5 rounded-xl text-center mb-4 ${
              flipResults.profit >= 0 ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
            }`}>
              <p className="text-sm text-gray-600 mb-1">Estimated Profit</p>
              <p className={`text-3xl font-bold ${flipResults.profit >= 0 ? "text-green-600" : "text-red-600"}`}>
                {formatCurrency(flipResults.profit)}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {formatCurrency(flipResults.profitPerMonth)}/month over {holdingPeriod} months
              </p>
            </div>

            {/* ROI */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-gray-50 rounded-lg text-center">
                <p className="text-xs text-gray-500">ROI</p>
                <p className={`text-2xl font-bold ${flipResults.roi >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {flipResults.roi.toFixed(1)}%
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg text-center">
                <p className="text-xs text-gray-500">Annualized ROI</p>
                <p className={`text-2xl font-bold ${flipResults.annualizedRoi >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {flipResults.annualizedRoi.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RENTAL MODE */}
      {mode === "rental" && (
        <div className="space-y-4">
          {/* DSCR Loan Section */}
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-4">DSCR Loan Terms</h4>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Down Payment %</label>
                <input type="number" value={dscrDownPayment} onChange={(e) => setDscrDownPayment(Number(e.target.value))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Interest Rate %</label>
                <input type="number" step="0.125" value={dscrInterestRate} onChange={(e) => setDscrInterestRate(Number(e.target.value))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Loan Term (years)</label>
                <select value={dscrLoanTerm} onChange={(e) => setDscrLoanTerm(Number(e.target.value))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white">
                  <option value={15}>15 years</option>
                  <option value={20}>20 years</option>
                  <option value={30}>30 years</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Points</label>
                <input type="number" step="0.5" value={dscrPoints} onChange={(e) => setDscrPoints(Number(e.target.value))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-200">
              <div className="p-2 bg-white rounded-lg text-center">
                <p className="text-xs text-gray-500">Loan</p>
                <p className="font-bold text-sm text-gray-900">{formatCurrency(dscrLoanAmount)}</p>
              </div>
              <div className="p-2 bg-white rounded-lg text-center">
                <p className="text-xs text-gray-500">Down</p>
                <p className="font-bold text-sm text-gray-900">{formatCurrency(dscrDownDollars)}</p>
              </div>
              <div className="p-2 bg-white rounded-lg text-center">
                <p className="text-xs text-gray-500">P&I/mo</p>
                <p className="font-bold text-sm text-green-600">{formatCurrency(dscrMonthlyPayment)}</p>
              </div>
            </div>
          </div>

          {/* Rental Income/Expense */}
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-4">Rental Analysis</h4>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Monthly Rent</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                  <input type="number" value={monthlyRent} onChange={(e) => setMonthlyRent(Number(e.target.value))} className="w-full px-3 py-2 pl-7 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Mgmt %</label>
                <input type="number" value={propertyMgmtPercent} onChange={(e) => setPropertyMgmtPercent(Number(e.target.value))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Maintenance %</label>
                <input type="number" value={maintenancePercent} onChange={(e) => setMaintenancePercent(Number(e.target.value))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Vacancy %</label>
                <input type="number" value={vacancyPercent} onChange={(e) => setVacancyPercent(Number(e.target.value))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Monthly HOA</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                  <input type="number" value={monthlyHoa} onChange={(e) => setMonthlyHoa(Number(e.target.value))} className="w-full px-3 py-2 pl-7 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Insurance/mo</label>
                <div className="p-2 bg-white rounded-lg text-sm text-gray-900">
                  {formatCurrency(monthlyInsurance)}
                </div>
              </div>
            </div>
          </div>

          {/* Rental Results */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h4 className="font-bold text-lg mb-4 text-gray-900">Rental Returns</h4>

            {/* Cash Flow */}
            <div className={`p-5 rounded-xl text-center mb-4 ${
              rentalResults.cashFlow >= 0 ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
            }`}>
              <p className="text-sm text-gray-600 mb-1">Monthly Cash Flow</p>
              <p className={`text-3xl font-bold ${rentalResults.cashFlow >= 0 ? "text-green-600" : "text-red-600"}`}>
                {formatCurrency(rentalResults.cashFlow)}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {formatCurrency(rentalResults.annualCashFlow)}/year
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 bg-gray-50 rounded-lg text-center">
                <p className="text-xs text-gray-500">Total Cash Invested</p>
                <p className="text-lg font-bold text-gray-900">{formatCurrency(rentalResults.totalCashInvested)}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg text-center">
                <p className="text-xs text-gray-500">Monthly Expenses</p>
                <p className="text-lg font-bold text-gray-900">{formatCurrency(rentalResults.monthlyExpenses)}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-gray-50 rounded-lg text-center">
                <p className="text-xs text-gray-500">Cap Rate</p>
                <p className="text-xl font-bold text-gray-900">{rentalResults.capRate.toFixed(1)}%</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg text-center">
                <p className="text-xs text-gray-500">Cash-on-Cash</p>
                <p className={`text-xl font-bold ${rentalResults.cashOnCash >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {rentalResults.cashOnCash.toFixed(1)}%
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg text-center">
                <p className="text-xs text-gray-500">DSCR</p>
                <p className={`text-xl font-bold ${rentalResults.dscr >= 1 ? "text-green-600" : "text-red-600"}`}>
                  {rentalResults.dscr.toFixed(2)}
                </p>
              </div>
            </div>

            {rentalResults.dscr < 1.25 && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm flex items-start gap-2">
                <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="text-gray-700">
                  Most DSCR lenders require 1.25+. Increase rent or down payment.
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <p className="text-xs text-gray-500 text-center pt-2">
        Estimates only. Consult with your advisor for detailed analysis.
      </p>
    </div>
  );
}
