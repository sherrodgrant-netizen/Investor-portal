export type BuyerType = "personal" | "llc";
export type FundingType = "cash" | "hard_money";

export interface BuyerInfo {
  buyerType: BuyerType;
  // Personal
  fullLegalName?: string;
  // LLC
  llcName?: string;
  ein?: string;
  authorizedSignerName?: string;
  // Funding
  fundingType: FundingType;
  lenderName?: string;
  lenderContact?: string;
}

export interface ReadyToBuyData {
  dealId: string;
  buyerInfo: BuyerInfo;
  signatureDataUrl?: string;
  signedAt?: string;
  wireImageUrl?: string;
}
