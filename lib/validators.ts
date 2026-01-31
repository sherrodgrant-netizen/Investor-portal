import { z } from "zod";

export const RequestAccessSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(7),
  company: z.string().optional(),
  fundingType: z.enum(["cash", "hml", "loc", "other"]).optional(),
  preferredArea: z.string().optional(),
  message: z.string().optional(),
});

export const OfferSchema = z.object({
  dealId: z.string().min(1),
  offerAmount: z.number().positive(),
  earnestMoney: z.number().positive(),
  closeDate: z.string().min(10), // YYYY-MM-DD
  fundingType: z.enum(["cash", "hml", "loc", "other"]),
  inspectionDays: z.number().int().min(0).max(30),
  notes: z.string().optional(),
  status: z.enum(["draft", "submitted"]).default("submitted"),
});

export const BuyBoxSchema = z.object({
  counties: z.array(z.string()).default([]),
  cities: z.array(z.string()).default([]),
  zips: z.string().optional(),
  propertyTypes: z.array(z.string()).default([]),
  bedsMin: z.number().int().min(0).default(0),
  bathsMin: z.number().int().min(0).default(0),
  priceMin: z.number().min(0).optional(),
  priceMax: z.number().min(0).optional(),
  rehabTolerance: z.enum(["light", "moderate", "heavy"]).optional(),
  strategy: z.array(z.string()).default([]),
  notes: z.string().optional(),
});

export const EventSchema = z.object({
  eventType: z.enum([
    "login",
    "deal_viewed",
    "deal_saved",
    "deal_unsaved",
    "offer_draft_started",
    "offer_submitted",
    "packet_downloaded",
    "buy_box_updated",
    "advisor_request_sent",
    "document_downloaded",
  ]),
  dealId: z.string().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});
