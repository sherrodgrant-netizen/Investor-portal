# Investor Portal

A modern web application for real estate investors to browse deals, analyze properties, submit offers, and manage their buy box preferences. Built with Next.js 16.1.6, TypeScript, and Tailwind CSS.

## Features

### Public Pages
- **Home Page**: Landing page with request access form
- **Login**: Secure authentication for approved investors
- **Request Access**: Form for new investors to request portal access

### Authenticated Dashboard
- **Available Deals**: Browse investment opportunities with filtering and sorting
- **Deal Details**: Comprehensive property analysis including:
  - Property specifications and characteristics
  - Interactive map with 2-mile radius visualization
  - Rehab details (condition, HVAC/roof age, foundation/electrical/plumbing notes)
  - Comparable properties with table, map, and photo galleries
  - Profit calculator with editable ARV and rehab estimates
  - Dropbox link for property photos
- **Documents**: Access important documents and resources
- **Gamification**: Track investment activity with points and achievements

### API Integration (Ready for Salesforce)
- Authentication endpoints
- Deal fetching with filtering
- Offer submission
- Event tracking

## Getting Started

### Prerequisites
- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd investor-portal
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:
- `NEXT_PUBLIC_MAPBOX_TOKEN` (optional): For interactive property maps - get free token at [https://account.mapbox.com](https://account.mapbox.com/access-tokens/)
- `SF_*` variables: Your Salesforce credentials (required for production)
- `SESSION_SECRET`: Random string for session encryption

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
/app
  /(public)          # Public-facing pages (home, login, request access)
  /(authed)          # Authenticated pages (dashboard, deals, documents)
  /api               # API routes
    /auth            # Authentication endpoints
    /deals           # Deal data endpoints
    /offers          # Offer submission
    /events          # Event tracking
/components          # Reusable React components
  /PropertyMap.tsx   # Mapbox GL map component
/lib                 # Utility functions and data
  /auth.ts           # Session management
  /mockDeals.ts      # Mock data (replace with API calls)
  /salesforce/       # Salesforce integration framework
  /validators.ts     # Zod schemas for validation
/types               # TypeScript type definitions
  /deal.ts           # Deal, Comparable, PropertyCharacteristics types
```

## Integrating with Salesforce API

The application currently uses mock data from `/lib/mockDeals.ts`. To integrate with your Salesforce org:

### 1. Update Salesforce Connection
Edit `/lib/salesforce/client.ts` and `/lib/salesforce/queries.ts` to implement actual Salesforce API calls using your credentials from `.env.local`.

### 2. Replace Mock Data in Deal Details
In `/app/(authed)/dashboard/deals/[id]/page.tsx`, replace:
```typescript
import { getDealById } from "@/lib/mockDeals";
const deal = getDealById(dealId);
```

With a server-side fetch:
```typescript
import { soql } from "@/lib/salesforce/queries";

const deal = await soql(`
  SELECT Id, Name, DACQ_Address__c, DACQ_City__c, DACQ_State__c,
         DACQ_Price__c, DACQ_ARV__c, DACQ_Beds__c, DACQ_Baths__c,
         DACQ_Sqft__c, DACQ_Year_Built__c, DACQ_Lot_Size__c,
         DACQ_Garage_Size__c, DACQ_HVAC_Age__c, DACQ_Roof_Age__c,
         DACQ_Foundation_Notes__c, DACQ_Electrical_Notes__c,
         DACQ_Plumbing_Notes__c, DACQ_Condition__c,
         DACQ_Rehab_Estimate__c, DACQ_Hero_Image__c,
         DACQ_Description__c, DACQ_Latitude__c, DACQ_Longitude__c,
         DACQ_Dropbox_Link__c
  FROM ${SF_OBJ_DEAL}
  WHERE Id = '${dealId}'
  LIMIT 1
`);
```

### 3. Map Salesforce Fields to Deal Types
The `Deal` interface in `/types/deal.ts` defines the expected structure. Map your Salesforce custom fields to match this structure in your API responses.

### 4. Implement Comparables Data
Add Salesforce queries to fetch comparable properties based on the subject property's location, size, and characteristics. Update the `comparables` array in your API response.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_MAPBOX_TOKEN` | No | Mapbox access token for interactive maps. Maps show static fallback if not provided. |
| `SF_OBJ_DEAL` | Yes* | Salesforce custom object API name for deals (default: `DACQ_Deal__c`) |
| `SF_USERNAME` | Yes* | Salesforce username |
| `SF_PASSWORD` | Yes* | Salesforce password |
| `SF_SECURITY_TOKEN` | Yes* | Salesforce security token |
| `SF_LOGIN_URL` | Yes* | Salesforce login URL (default: `https://login.salesforce.com`) |
| `SESSION_SECRET` | Yes | Random secret for encrypting session cookies |

*Required for production with Salesforce integration

## Tech Stack

- **Framework**: Next.js 16.1.6 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Maps**: Mapbox GL JS
- **Validation**: Zod
- **Authentication**: Cookie-based sessions
- **CRM**: Salesforce (integration ready)

## Development

### Building for Production
```bash
npm run build
npm run start
```

### Type Checking
```bash
npm run type-check
```

### Linting
```bash
npm run lint
```

## Contributing

When adding new features:
1. Follow the existing TypeScript patterns and type definitions
2. Use Zod schemas for all API validation
3. Keep mock data structure in sync with Salesforce field mapping
4. Test with both mock data and real Salesforce data
5. Ensure responsive design works on mobile and desktop

## License

Proprietary - All rights reserved
