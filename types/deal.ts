export type PropertyCondition = "Turn Key" | "Fair" | "Needs Work";

export type HomeType = "SFR" | "Condo" | "Townhome" | "Multi-Family";

export interface PropertyCharacteristics {
  beds: number;
  baths: number;
  halfBaths: number;
  sqft: number;
  yearBuilt: number;
  homeType: HomeType;
  garageSize: string; // e.g., "2-car"
  garageAttached: boolean;
  lotSize: string; // e.g., "7,500 sqft" or "0.17 acres"
}

export interface RehabInfo {
  condition: PropertyCondition;
  hvacAge: number;
  roofAge: number;
  foundationNotes: string;
  electricalNotes: string;
  plumbingNotes: string;
  estimatedRehabTotal: number;
}

export interface Comparable {
  id: string;
  address: string;
  beds: number;
  baths: number;
  sqft: number;
  yearBuilt: number;
  garageSize: string;
  lotSize: string;
  salePrice: number; // Comparable sale price
  notes: string;
  lat: number;
  lng: number;
  images: string[]; // 6 interior photos
}

export interface Deal {
  id: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  heroImage: string;
  description: string;
  characteristics: PropertyCharacteristics;
  rehab: RehabInfo;
  purchasePrice: number;
  arv: number;
  lat: number;
  lng: number;
  comparables: Comparable[];
  dropboxLink?: string;
}

export interface ComparableAverages {
  beds: number;
  baths: number;
  sqft: number;
  yearBuilt: number;
  garageSize: string;
  lotSize: string;
  notes: string;
}
