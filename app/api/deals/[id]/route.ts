import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { soql, getContentVersionIds } from "@/lib/salesforce/queries";

// Known address coordinates lookup (fallback when Geocoding API is unavailable)
const KNOWN_ADDRESSES: Record<string, { lat: number; lng: number }> = {
  "7614 southwestern": { lat: 32.8567534, lng: -96.7760378 },
  "7614 southwestern blvd": { lat: 32.8567534, lng: -96.7760378 },
};

// Try to match address against known coordinates
function lookupKnownAddress(address: string): { lat: number; lng: number } | null {
  const normalized = address.toLowerCase().trim();
  for (const [key, coords] of Object.entries(KNOWN_ADDRESSES)) {
    if (normalized.includes(key)) {
      return coords;
    }
  }
  return null;
}

// Geocode an address using Google Maps Geocoding API
async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  // First try known addresses lookup
  const known = lookupKnownAddress(address);
  if (known) {
    console.log("Found known address:", address, "->", known);
    return known;
  }

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey || !address) return null;

  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "OK" && data.results && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      return { lat: location.lat, lng: location.lng };
    }
    console.log("Geocoding failed:", data.status);
    return null;
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireSession();

    const { id } = await params;
    const obj = process.env.SF_OBJ_DEAL || "Opportunity";

    // Query single Opportunity by ID with all fields needed for detail page
    const r: any = await soql(`
      SELECT Id, Name,
             Property_Address__Street__s, Property_Address__City__s,
             Property_Address__StateCode__s, Property_Address__PostalCode__s,
             Property_Address__Latitude__s, Property_Address__Longitude__s,
             Amount, Bedroomsp__c, Bathroomsp__c, Halfbaths__c, Sq_Ft_Total__c,
             ARV__c, Estimated_Rehab_Cost__c, URL__c, Image_1__c,
             County__c, Year_Built__c, Lot_Size__c,
             Roof_Type__c, Roof__c, Foundation_Type__c, Foundation__c,
             Cooling_Type__c, Heating_Type__c, HVAC__c, Condition_of_Property__c,
             Marketing_Description__c, Property_Type__c,
             Number_of_Garages__c, Garage_Type__c,
             StageName, CreatedDate
      FROM ${obj}
      WHERE Id = '${id}'
      LIMIT 1
    `);

    if (!r.records || r.records.length === 0) {
      return NextResponse.json({ error: "Deal not found" }, { status: 404 });
    }

    const record = r.records[0];

    // Fetch images attached to this deal (Opportunity)
    const dealImageIds = await getContentVersionIds(record.Id);
    const dealImages = dealImageIds.map((vId: string) => `/api/sf-image/${vId}`);
    console.log("Deal images found:", dealImages.length);

    // Fetch comparables linked to this deal from Comparable__c
    const compsResult: any = await soql(`
      SELECT Id, Name, Address__c, Bed__c, Baths__c, Square_Footage__c,
             Year_Built__c, Garage_Size__c, Lot_Size_SQFT__c, Sales_Price__c,
             Notes_Maybe_pics__c
      FROM Comparable__c
      WHERE Deal__c = '${id}'
      ORDER BY CreatedDate DESC
    `);

    // Fetch images and geocode each comparable
    const comparables = await Promise.all(
      (compsResult.records || []).map(async (comp: any) => {
        // Get ContentVersion IDs for images attached to this comparable
        const versionIds = await getContentVersionIds(comp.Id);
        const images = versionIds.map((vId: string) => `/api/sf-image/${vId}`);

        // Geocode the comparable address
        const compAddress = comp.Address__c || comp.Name || "";
        let compLat = 32.77;
        let compLng = -96.80;

        if (compAddress) {
          const geocoded = await geocodeAddress(compAddress);
          if (geocoded) {
            compLat = geocoded.lat;
            compLng = geocoded.lng;
            console.log("Geocoded comp:", compAddress, "->", compLat, compLng);
          }
        }

        return {
          id: comp.Id,
          address: compAddress,
          beds: comp.Bed__c || 0,
          baths: comp.Baths__c || 0,
          sqft: comp.Square_Footage__c || 0,
          yearBuilt: comp.Year_Built__c || 0,
          garageSize: comp.Garage_Size__c || "N/A",
          lotSize: comp.Lot_Size_SQFT__c ? `${comp.Lot_Size_SQFT__c} sqft` : "N/A",
          salePrice: comp.Sales_Price__c || 0,
          notes: comp.Notes_Maybe_pics__c || "",
          lat: compLat,
          lng: compLng,
          images,
        };
      })
    );

    // Build full address for geocoding
    const streetAddress = record.Property_Address__Street__s || record.Name?.split(",")[0] || "";
    const city = record.Property_Address__City__s || "";
    const state = record.Property_Address__StateCode__s || "TX";
    const zip = record.Property_Address__PostalCode__s || "";
    const fullAddress = `${streetAddress}, ${city}, ${state} ${zip}`.trim();

    // Get coordinates - prefer Salesforce data, fall back to geocoding
    let lat = record.Property_Address__Latitude__s;
    let lng = record.Property_Address__Longitude__s;

    if (!lat || !lng) {
      const geocoded = await geocodeAddress(fullAddress);
      if (geocoded) {
        lat = geocoded.lat;
        lng = geocoded.lng;
        console.log("Geocoded address:", fullAddress, "->", lat, lng);
      } else {
        // Final fallback to Dallas center
        lat = 32.7767;
        lng = -96.7970;
      }
    }

    // Transform to app's expected format
    const deal = {
      id: record.Id,
      address: streetAddress,
      city,
      state,
      zip,
      lat,
      lng,
      heroImage: dealImages[0] || record.Image_1__c || "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80",
      images: dealImages,
      purchasePrice: record.Amount || 0,
      description: record.Marketing_Description__c || "Investment opportunity - contact your advisor for details.",
      dropboxLink: record.URL__c || "",
      characteristics: {
        beds: parseInt(record.Bedroomsp__c) || 0,
        baths: parseInt(record.Bathroomsp__c) || 0,
        halfBaths: record.Halfbaths__c || 0,
        sqft: record.Sq_Ft_Total__c || 0,
        yearBuilt: record.Year_Built__c || "N/A",
        homeType: record.Property_Type__c || "Single Family",
        garageSize: record.Number_of_Garages__c ? `${record.Number_of_Garages__c} Car` : "N/A",
        garageAttached: record.Garage_Type__c === "Attached",
        lotSize: record.Lot_Size__c || "N/A",
      },
      rehab: {
        condition: record.Condition_of_Property__c || "Fair",
        roofAge: record.Roof__c || "Unknown",
        roofType: record.Roof_Type__c || "Unknown",
        foundationNotes: record.Foundation__c || record.Foundation_Type__c || "Unknown",
        hvacAge: record.HVAC__c || "Unknown",
        hvacType: record.Cooling_Type__c || record.Heating_Type__c || "Unknown",
        electricalNotes: "",
        plumbingNotes: "",
        estimatedRehabTotal: record.Estimated_Rehab_Cost__c || 0,
      },
      arv: record.ARV__c || 0,
      comparables,
    };

    return NextResponse.json({ deal });
  } catch (error) {
    console.error("Deal detail API error:", error);
    if (error instanceof Error && error.message === "UNAUTHENTICATED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
