# Diamond Acquisitions Investor Portal

A Next.js investor portal for Diamond Acquisitions LLC, providing accredited investors with access to off-market real estate deals, deal analysis tools, document management, and communication with sales advisors.

**Live URL**: Deployed on Vercel
**Tech Stack**: Next.js 16.1.6 (App Router), TypeScript 5, Tailwind CSS 4, React 19, Mapbox GL JS, Zod validation

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Environment Variables](#environment-variables)
3. [Project Structure](#project-structure)
4. [Authentication & Sessions](#authentication--sessions)
5. [Route Map](#route-map)
6. [API Endpoints](#api-endpoints)
7. [Salesforce Integration](#salesforce-integration)
8. [Signup Flow (5 Steps)](#signup-flow-5-steps)
9. [Dashboard Pages](#dashboard-pages)
10. [Data Models & Types](#data-models--types)
11. [Third-Party Integrations](#third-party-integrations)
12. [What Needs Salesforce Integration](#what-needs-salesforce-integration)
13. [Production Readiness Checklist](#production-readiness-checklist)

---

## Getting Started

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linter
npm run lint
```

The app runs on `http://localhost:3000` by default.

---

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NEXT_PUBLIC_MAPBOX_TOKEN` | No | — | Mapbox access token for interactive maps. Falls back to static UI if missing. |
| `SF_OBJ_DEAL` | Yes (prod) | `DACQ_Deal__c` | Salesforce custom object API name for deals |
| `SF_OBJ_ENGAGEMENT` | No | `DACQ_Investor_Engagement__c` | Salesforce custom object for event/engagement tracking |
| `SF_CONTACT_STATUS_FIELD` | No | `DACQ_Investor_Status__c` | Contact field name for investor approval status |
| `SF_USERNAME` | Yes (prod) | — | Salesforce API username |
| `SF_PASSWORD` | Yes (prod) | — | Salesforce API password |
| `SF_SECURITY_TOKEN` | Yes (prod) | — | Salesforce security token |
| `SF_LOGIN_URL` | Yes (prod) | `https://login.salesforce.com` | Salesforce login endpoint (use `https://test.salesforce.com` for sandbox) |
| `SESSION_SECRET` | Yes | — | Random secret string for session encryption |
| `SESSION_COOKIE_NAME` | No | `dacq_portal_session` | Name of the HTTP-only session cookie |

---

## Project Structure

```
investor-portal/
├── app/
│   ├── page.tsx                          # Root — redirects to /access
│   ├── layout.tsx                        # Root layout (global styles, metadata)
│   │
│   ├── login/
│   │   └── page.tsx                      # Login page (email + password)
│   │
│   ├── signup/
│   │   └── page.tsx                      # 5-step signup wizard
│   │
│   ├── (public)/                         # Public route group (no auth required)
│   │   ├── access/
│   │   │   └── page.tsx                  # Landing page — Sign In / Sign Up buttons
│   │   └── request-access/
│   │       └── page.tsx                  # Legacy access request form
│   │
│   ├── (authed)/                         # Protected route group (auth required)
│   │   ├── layout.tsx                    # Auth wrapper — logout button
│   │   └── dashboard/
│   │       ├── layout.tsx                # Dashboard header + navigation bar
│   │       ├── page.tsx                  # Main dashboard (profile, preferences, achievements)
│   │       ├── deals/
│   │       │   ├── page.tsx              # Available deals grid + map
│   │       │   └── [id]/
│   │       │       └── page.tsx          # Individual deal detail + profit calculator
│   │       ├── documents/
│   │       │   └── page.tsx              # Signed documents list
│   │       └── settings/
│   │           └── page.tsx              # Email notification preferences
│   │
│   └── api/
│       ├── auth/
│       │   ├── login/route.ts            # POST — authenticate user
│       │   └── logout/route.ts           # POST — clear session
│       ├── me/route.ts                   # GET  — current user info
│       ├── deals/route.ts                # GET  — fetch deals from Salesforce
│       ├── events/route.ts               # POST — track user engagement events
│       └── request-access/route.ts       # POST — create Contact in Salesforce
│
├── components/
│   └── PropertyMap.tsx                   # Mapbox GL interactive map component
│
├── lib/
│   ├── auth.ts                           # Session management (get/set/clear/require)
│   ├── mockDeals.ts                      # Mock deal data (2 sample deals)
│   ├── validators.ts                     # Zod schemas for API validation
│   └── salesforce/
│       └── queries.ts                    # Salesforce SOQL queries + CRUD helpers
│
├── types/
│   └── deal.ts                           # TypeScript interfaces for deals, comps, rehab
│
├── public/                               # Static assets (images)
├── tailwind.config.ts
├── tsconfig.json
├── next.config.ts
└── package.json
```

---

## Authentication & Sessions

### How It Works

Sessions are stored as Base64-encoded JSON in an HTTP-only cookie.

**File**: `lib/auth.ts`

**Cookie name**: `dacq_portal_session` (configurable via `SESSION_COOKIE_NAME`)

**Session shape**:
```typescript
type Session = {
  contactId: string;  // Salesforce Contact ID
  email: string;
}
```

### Key Functions

| Function | Description |
|----------|-------------|
| `getSession()` | Reads and decodes the session cookie. Returns `Session \| null`. |
| `requireSession()` | Same as `getSession()` but throws `"UNAUTHENTICATED"` if no session. Used in protected API routes. |
| `setSession(session)` | Encodes session and sets HTTP-only cookie. Max age: 7 days. Secure in production. |
| `clearSession()` | Deletes the session cookie (sets maxAge to 0). |

### Cookie Settings
- `httpOnly: true` — not accessible via JavaScript
- `sameSite: 'lax'`
- `secure: true` in production only
- `path: '/'`
- `maxAge: 604800` (7 days)

### Current Limitations (Needs Salesforce Integration)
- **Login currently accepts any credentials** — returns a mock session. The Salesforce developer needs to implement actual credential validation against Contact records.
- **No server-side middleware** enforcing auth on protected routes — currently relies on client-side checks. Should add Next.js middleware to redirect unauthenticated users.
- **No session refresh mechanism** — sessions expire after 7 days with no renewal.

---

## Route Map

### Public Routes (No Auth)

| Route | Page | Description |
|-------|------|-------------|
| `/` | Redirect | Redirects to `/access` |
| `/access` | Landing | Sign In and Sign Up buttons |
| `/login` | Login | Email/password form |
| `/signup` | Signup | 5-step registration wizard |
| `/request-access` | Request Form | Legacy access request (creates Contact in SF) |

### Protected Routes (Auth Required)

| Route | Page | Description |
|-------|------|-------------|
| `/dashboard` | Main Dashboard | Investor profile, preferences, properties bought, achievements |
| `/dashboard/deals` | Available Deals | Filterable deal grid with map |
| `/dashboard/deals/[id]` | Deal Detail | Full property analysis, comps, profit calculator |
| `/dashboard/documents` | Documents | List of signed documents (NDA, agreements, etc.) |
| `/dashboard/settings` | Settings | Email notification preferences (scope + frequency) |

### Navigation Bar Order
`Dashboard` > `Available Deals` > `Docs` > `Settings`

---

## API Endpoints

### `POST /api/auth/login`

Authenticate a user and create a session.

**Request body**:
```json
{
  "email": "investor@example.com",
  "password": "password123"
}
```

**Success response** (200):
```json
{
  "success": true,
  "user": {
    "contactId": "003XXXXXXXXXXXXXXX",
    "email": "investor@example.com"
  }
}
```

**Error responses**: 400 (missing fields), 500 (server error)

**SALESFORCE TODO**: Currently accepts any credentials. Needs to validate email/password against Salesforce Contact records. The `contactId` returned should be the real Salesforce Contact ID.

---

### `POST /api/auth/logout`

Clear the user session.

**Request body**: None

**Response** (200): `{ "success": true }`

---

### `GET /api/me`

Get the currently authenticated user's info.

**Headers**: Requires valid session cookie

**Response** (200):
```json
{
  "user": {
    "contactId": "003XXXXXXXXXXXXXXX",
    "email": "investor@example.com"
  }
}
```

**Error**: 401 if not authenticated

---

### `GET /api/deals`

Fetch published investment deals.

**Query params**:
- `limit` (optional, default: 24)

**SOQL Query used**:
```sql
SELECT Id, Name, DACQ_Address__c, DACQ_City__c, DACQ_State__c, DACQ_Zip__c,
       DACQ_Price__c, DACQ_Beds__c, DACQ_Baths__c, DACQ_Sqft__c,
       DACQ_ARV__c, DACQ_Rehab_Estimate__c, DACQ_Spread__c, DACQ_Packet_URL__c
FROM DACQ_Deal__c
WHERE DACQ_Published__c = true
ORDER BY DACQ_Published_Date__c DESC
LIMIT 24
```

**Response** (200):
```json
{
  "records": [
    {
      "Id": "a01XXXXXXXXXXXXXXX",
      "Name": "123 Main St",
      "DACQ_Address__c": "123 Main St",
      "DACQ_City__c": "Austin",
      "DACQ_State__c": "TX",
      "DACQ_Zip__c": "78701",
      "DACQ_Price__c": 285000,
      "DACQ_Beds__c": 3,
      "DACQ_Baths__c": 2,
      "DACQ_Sqft__c": 1850,
      "DACQ_ARV__c": 385000,
      "DACQ_Rehab_Estimate__c": 35000,
      "DACQ_Spread__c": 65000,
      "DACQ_Packet_URL__c": "https://dropbox.com/..."
    }
  ]
}
```

**Error**: 401 (unauthorized), 500 (SF query failure)

---

### `POST /api/events`

Track user engagement events for analytics.

**Request body**:
```json
{
  "eventType": "deal_viewed",
  "dealId": "a01XXXXXXXXXXXXXXX",
  "metadata": {
    "source": "deals_list",
    "time_on_page": 45
  }
}
```

**Valid event types**:
- `login`
- `deal_viewed`
- `deal_saved`
- `deal_unsaved`
- `offer_draft_started`
- `offer_submitted`
- `packet_downloaded`
- `buy_box_updated`
- `advisor_request_sent`
- `document_downloaded`

**Salesforce object created** (`DACQ_Investor_Engagement__c`):

| SF Field | Value |
|----------|-------|
| `DACQ_Contact__c` | session.contactId |
| `DACQ_Deal__c` | dealId (if provided) |
| `DACQ_Event_Type__c` | eventType |
| `DACQ_Timestamp__c` | ISO 8601 timestamp |
| `DACQ_Metadata__c` | JSON stringified metadata |
| `DACQ_Source__c` | `"portal"` |

**Response** (200): `{ "ok": true }`

---

### `POST /api/request-access`

Create a new Contact in Salesforce when someone requests portal access.

**Request body** (validated with Zod):
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "5125551234",
  "company": "Doe Investments LLC",
  "fundingType": "cash",
  "preferredArea": "Austin Metro",
  "message": "Interested in SFH deals under $300k"
}
```

**Required fields**: firstName, lastName, email, phone

**Optional fields**: company, fundingType, preferredArea, message

**fundingType options**: `"cash"`, `"hml"` (hard money), `"loc"` (line of credit), `"other"`

**Salesforce Contact created**:

| SF Field | Value |
|----------|-------|
| `FirstName` | firstName |
| `LastName` | lastName |
| `Email` | email |
| `Phone` | phone |
| `Company` | company |
| `DACQ_Investor_Status__c` | `"pending_access"` |

**Response** (200): `{ "ok": true, "contactId": "003XXXXXXXXXXXXXXX" }`

---

## Salesforce Integration

### Current State

The Salesforce integration layer is **scaffolded but uses mock/stub functions**. All SF calls log to console and return placeholder data.

**File**: `lib/salesforce/queries.ts`

### Helper Functions Available

```typescript
// Execute raw SOQL query
soql(query: string): Promise<{ records: any[] }>

// Create a new Salesforce record
createSObject(objectType: string, data: Record<string, any>): Promise<{ id: string }>

// Update an existing record
updateSObject(objectType: string, id: string, data: Record<string, any>): Promise<void>

// Query a single record by ID
querySObject(objectType: string, id: string, fields: string[]): Promise<Record<string, any>>
```

### Custom Objects Required in Salesforce

#### `DACQ_Deal__c` (Investment Deal)

| Field API Name | Type | Description |
|----------------|------|-------------|
| `DACQ_Address__c` | Text | Street address |
| `DACQ_City__c` | Text | City |
| `DACQ_State__c` | Text | State abbreviation |
| `DACQ_Zip__c` | Text | ZIP code |
| `DACQ_Price__c` | Currency | Purchase price |
| `DACQ_Beds__c` | Number | Bedroom count |
| `DACQ_Baths__c` | Number | Bathroom count |
| `DACQ_Sqft__c` | Number | Square footage |
| `DACQ_ARV__c` | Currency | After-repair value |
| `DACQ_Rehab_Estimate__c` | Currency | Estimated rehab cost |
| `DACQ_Spread__c` | Currency | Profit spread (ARV - Price - Rehab) |
| `DACQ_Packet_URL__c` | URL | Dropbox/download link for deal packet |
| `DACQ_Published__c` | Checkbox | Whether deal is visible to investors |
| `DACQ_Published_Date__c` | DateTime | When deal was published (used for sort order) |

**Additional fields needed for Deal Detail page** (not yet in SOQL query):

| Field API Name | Type | Description |
|----------------|------|-------------|
| `DACQ_Description__c` | Long Text Area | Full property description |
| `DACQ_Hero_Image__c` | URL | Main property photo URL |
| `DACQ_Latitude__c` | Number(10,7) | Latitude for map |
| `DACQ_Longitude__c` | Number(10,7) | Longitude for map |
| `DACQ_Year_Built__c` | Number | Year property was built |
| `DACQ_Lot_Size__c` | Text | Lot size (e.g., "0.18 acres") |
| `DACQ_Garage_Size__c` | Text | Garage description (e.g., "2-Car") |
| `DACQ_Garage_Attached__c` | Checkbox | Whether garage is attached |
| `DACQ_Home_Type__c` | Picklist | SFR, Condo, Townhome, Multi-Family |
| `DACQ_Half_Baths__c` | Number | Half bathroom count |
| `DACQ_Condition__c` | Picklist | Turn Key, Fair, Needs Work |
| `DACQ_HVAC_Age__c` | Number | HVAC system age in years |
| `DACQ_Roof_Age__c` | Number | Roof age in years |
| `DACQ_Foundation_Notes__c` | Text Area | Foundation condition notes |
| `DACQ_Electrical_Notes__c` | Text Area | Electrical system notes |
| `DACQ_Plumbing_Notes__c` | Text Area | Plumbing system notes |
| `DACQ_Dropbox_Link__c` | URL | Link to full property packet |

#### `DACQ_Investor_Engagement__c` (Event Tracking)

| Field API Name | Type | Description |
|----------------|------|-------------|
| `DACQ_Contact__c` | Lookup(Contact) | The investor who triggered the event |
| `DACQ_Deal__c` | Lookup(DACQ_Deal__c) | Optional — the deal associated with the event |
| `DACQ_Event_Type__c` | Picklist | Event type (see valid event types in /api/events section) |
| `DACQ_Timestamp__c` | DateTime | When the event occurred |
| `DACQ_Metadata__c` | Long Text Area | JSON blob with additional event context |
| `DACQ_Source__c` | Text | Always `"portal"` for portal events |

#### Contact (Standard Object — Custom Fields)

| Field API Name | Type | Description |
|----------------|------|-------------|
| `DACQ_Investor_Status__c` | Picklist | `"pending_access"`, `"approved"`, `"active"`, etc. |

#### Contact — Signup Preference Fields (Need to be created)

These fields correspond to the data collected in signup Step 2 and the dashboard preferences form:

| Field API Name (suggested) | Type | Description |
|----------------------------|------|-------------|
| `DACQ_Preferred_Counties__c` | Long Text Area | JSON array of selected county names |
| `DACQ_Asset_Class__c` | Picklist (Multi-Select) | SFH, Small Multifamily, Large Multifamily, Storage, Land, Commercial |
| `DACQ_Price_Range__c` | Picklist | Under $250k, Under $500k, Under $1M, $1M+, No limit |
| `DACQ_Capital_Type__c` | Picklist | Cash, Hard Money, Conventional, Seller Finance, JV/Partners |
| `DACQ_Solo_Or_Partners__c` | Picklist | Solo, With Partners |
| `DACQ_Open_To_JV__c` | Checkbox | Open to JV/equity splits |
| `DACQ_Notification_Pref__c` | Picklist | Only matched deals, All deals |
| `DACQ_Additional_Notes__c` | Long Text Area | Free text notes from investor |
| `DACQ_Email_Scope__c` | Picklist | all, counties |
| `DACQ_Email_Frequency__c` | Picklist | daily, weekly |
| `DACQ_Email_Counties__c` | Long Text Area | JSON array of counties for email filtering |

#### Comparable Properties (Need to be created)

Comparables can be implemented as either:

**Option A**: Child object `DACQ_Comparable__c` with lookup to `DACQ_Deal__c`

| Field API Name | Type | Description |
|----------------|------|-------------|
| `DACQ_Deal__c` | Master-Detail(DACQ_Deal__c) | Parent deal |
| `DACQ_Comp_Address__c` | Text | Comparable address |
| `DACQ_Comp_Beds__c` | Number | Bedrooms |
| `DACQ_Comp_Baths__c` | Number | Bathrooms |
| `DACQ_Comp_Sqft__c` | Number | Square footage |
| `DACQ_Comp_Year_Built__c` | Number | Year built |
| `DACQ_Comp_Sale_Price__c` | Currency | Sale price |
| `DACQ_Comp_Garage__c` | Text | Garage size |
| `DACQ_Comp_Lot_Size__c` | Text | Lot size |
| `DACQ_Comp_Notes__c` | Text Area | Notes about the comp |
| `DACQ_Comp_Latitude__c` | Number(10,7) | Latitude |
| `DACQ_Comp_Longitude__c` | Number(10,7) | Longitude |
| `DACQ_Comp_Images__c` | Long Text Area | JSON array of image URLs |

**Option B**: Store comparables as JSON in a Long Text Area on the Deal object

#### How Comparables Drive the Profit Calculator

This is a critical data flow that the Salesforce developer must understand:

1. **Comparables table** — The portal displays a grid of comparable properties for each deal. Each comp has: Address, Beds, Baths, Sqft, Year, Garage, Lot Size, **Sale Price**, and Notes. The bottom row auto-calculates averages across all comps.

2. **Sale Price is the key field** — The `DACQ_Comp_Sale_Price__c` on each comparable is what powers the Profit Calculator sidebar. The portal calculates:
   - **Lowest comp sale price** = slider minimum
   - **Highest comp sale price** = slider maximum
   - **Average comp sale price** = slider default starting position

3. **Assumed Sale Price slider** — The investor slides between the lowest and highest comp prices to model different sale scenarios. This directly affects the projected profit calculation:
   ```
   Profit = Assumed Sale Price × (1 - Closing Cost %) - Purchase Price - Rehab Estimate
   ```

4. **Profit Confidence Range** — The profit range bar uses the lowest comp price with conservative rehab (+20%) as the worst case, and the highest comp price with aggressive rehab (-15%) as the best case.

**What this means for Salesforce**: Every deal MUST have comparable properties with accurate `DACQ_Comp_Sale_Price__c` values for the profit calculator to work. Without comps, the calculator has no price range to display. The Salesforce team should ensure that when a deal is published (`DACQ_Published__c = true`), it has at least 2-3 comparables with sale prices populated.

---

## Signup Flow (5 Steps)

**File**: `app/signup/page.tsx`

All state is managed client-side in a single page component with step tracking.

### Step 1: Basic Information
Collects: First Name, Last Name, Email, Phone

Validation: All required, non-empty

### Step 2: Investment Preferences
Collects:
- **Location Preferences**: Multi-select county picker grouped by metro area (DFW, Austin, San Antonio, Houston). Users can select entire metros or individual counties.
- **Asset Class**: SFH, Small Multifamily, Large Multifamily, Storage, Land, Commercial
- **Purchase Price Range**: Under $250k, Under $500k, Under $1M, $1M+, No limit
- **Capital Type**: Cash, Hard Money, Conventional, Seller Finance, JV/Partners
- **Solo or Partners**: Solo / With Partners
- **Open to JV/Equity Splits**: Yes / No
- **Notification Preference**: Only matched deals / All deals
- **Additional Notes**: Free text

**SALESFORCE TODO**: All of these preference fields need corresponding custom fields on the Contact object. Wire up the signup submission to save them. See the suggested field names in the Salesforce Integration section above.

### Step 3: NDA Signing
- Displays a summary of the user's entered information
- "Review & Sign NDA" button opens a modal with the full NDA text
- User reads and clicks "I Agree and Sign"
- Success state shown after signing

**PANDADOC TODO**: Currently a mock modal. Production should embed PandaDoc's signing widget or redirect to a PandaDoc signing URL. The signed document should be stored and linked to the Contact in Salesforce.

### Step 4: Congratulations
- Animated welcome screen
- Shows benefits of being a "Diamond Investor"
- CTA to meet their sales advisor

### Step 5: Sales Advisor Assignment
- Shows assigned advisor (currently hardcoded: Sarah Johnson)
- Advisor contact info (phone, email)
- "What Happens Next" timeline
- "Enter Your Dashboard" button redirects to `/dashboard`

**SALESFORCE TODO**: Advisor assignment should be dynamic. Query the Contact's assigned advisor from Salesforce and display their real info.

---

## Dashboard Pages

### Main Dashboard (`/dashboard`)

**Sections**:
1. **Investor Profile** — Name, email, phone, assigned advisor card with photo and contact info
2. **Investment Preferences** — Editable form matching signup Step 2 fields. Has "Save Preferences" button that should persist to Contact in Salesforce.
3. **Properties Bought** — Table with columns: Type, County, Purchase Price, Close Date, Status (Closed / Under Contract)
4. **Achievement Bar** — Gamification: unlock badges at 1, 3, 5, 10, 20 properties purchased. Visual badges with progress bar.

**SALESFORCE TODO**:
- Profile data should pull from the Contact record
- Preferences should read/write to Contact custom fields
- Properties bought should query closed deals associated with the Contact (junction object or related list)
- Achievement counts should be calculated from actual purchase history

### Available Deals (`/dashboard/deals`)

**Sections**:
1. **Filter bar** — Categories: All, Single Family, Multi Family, Land, Commercial (with counts per category)
2. **Map view** (collapsible) — Mapbox map with color-coded markers per property type, includes legend
3. **Deal cards grid** — 3-column responsive grid, each card shows: property image, "NEW" badge, address, bed/bath/sqft/year, purchase price, "Click for More Info" CTA

**SALESFORCE TODO**: Replace hardcoded 6-deal array with the `/api/deals` endpoint. Map SF field names to the card component's expected props.

### Deal Detail (`/dashboard/deals/[id]`)

**Sections**:
1. **Hero** — Split layout: property image (left) + Mapbox map with 2-mile radius circle (right)
2. **Property Header** — Full address + quick stats (beds, baths, sqft, year)
3. **Property Description** — Full text description
4. **Characteristics Grid** — Beds, full baths, half baths, sqft, year built, home type, garage size/attached, lot size
5. **Rehab Section** — Condition pill (color-coded), HVAC age, roof age, foundation/electrical/plumbing notes, estimated rehab total, contractor CTA
6. **Comparables** — Data table (address, beds, baths, sqft, year, garage, lot, notes) with averages row + map showing subject (red marker) vs comps (blue markers) + photo galleries per comp (6 photos each)
7. **Profit Calculator** (sticky sidebar):
   - Purchase price (read-only, from deal)
   - Assumed sale price slider (range based on comp low/avg/high)
   - Closing costs slider (1.5% - 3.0%)
   - Rehab confidence selector (Conservative +20%, Realistic, Aggressive -15%)
   - Manual rehab override input
   - Live-calculated profit display with color coding (green > $50k, yellow $20-50k, red < $20k)
   - Confidence range bar showing min/max profit scenarios

**SALESFORCE TODO**:
- Deal detail data needs expanded SOQL query (see additional fields table above)
- Comparables need their own related object or JSON storage
- Deal images need to be hosted (Salesforce Files, S3, or CDN)
- The mock data currently in `lib/mockDeals.ts` shows the exact shape the UI expects

### Documents (`/dashboard/documents`)

Displays a table of signed documents.

**Columns**: Document name (with type icon), Type (NDA/Contract/Form), Date Signed, Status badge, Download button

**Currently hardcoded** with 6 sample documents:
1. NDA - Signed 2024-01-15
2. Investment Agreement - Signed 2024-02-03
3. Property Purchase Agreement (Maple Street) - Signed 2024-02-18
4. Investor Accreditation Form - Signed 2024-01-10
5. Operating Agreement - Signed 2024-03-05
6. Tax Information W-9 - Signed 2024-01-12

**SALESFORCE TODO**:
- Query documents from Salesforce (ContentDocument/ContentVersion linked to Contact, or a custom object)
- Download links should point to actual files
- PandaDoc integration for NDA status tracking

### Settings (`/dashboard/settings`)

**Email Notification Preferences**:
- **Email Scope**: Radio selection — "All Available Deals" or "Selected Counties Only"
  - If counties selected, shows a multi-select grid of 8 Texas counties: Travis, Williamson, Hays, Bastrop, Caldwell, Burnet, Bell, Comal
- **Email Frequency**: Radio selection — "Daily" (8 AM CST) or "Weekly" (Monday 8 AM CST)
- **Current Selection Summary** box showing active preferences
- **Save button** with loading state and success confirmation

**SALESFORCE TODO**:
- Persist selections to Contact fields (`DACQ_Email_Scope__c`, `DACQ_Email_Frequency__c`, `DACQ_Email_Counties__c`)
- These preferences should drive email automation (Marketing Cloud or Salesforce Flow)
- County list should match counties available in deals data

---

## Data Models & Types

### Deal (`types/deal.ts`)

```typescript
interface Deal {
  id: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  heroImage: string;          // URL to main property photo
  description: string;        // Full property description
  characteristics: {
    beds: number;
    baths: number;
    halfBaths: number;
    sqft: number;
    yearBuilt: number;
    homeType: "SFR" | "Condo" | "Townhome" | "Multi-Family";
    garageSize: string;       // e.g., "2-Car"
    garageAttached: boolean;
    lotSize: string;          // e.g., "0.18 acres"
  };
  rehab: {
    condition: "Turn Key" | "Fair" | "Needs Work";
    hvacAge: number;          // years
    roofAge: number;          // years
    foundationNotes: string;
    electricalNotes: string;
    plumbingNotes: string;
    estimatedRehabTotal: number;
  };
  purchasePrice: number;
  arv: number;                // After-repair value
  lat: number;
  lng: number;
  comparables: Comparable[];
  dropboxLink?: string;       // Deal packet download URL
}

interface Comparable {
  id: string;
  address: string;
  beds: number;
  baths: number;
  sqft: number;
  yearBuilt: number;
  garageSize: string;
  lotSize: string;
  salePrice: number;
  notes: string;
  lat: number;
  lng: number;
  images: string[];           // 6 interior/exterior photos
}
```

### Validation Schemas (`lib/validators.ts`)

Uses Zod for runtime validation on all API endpoints:

- **RequestAccessSchema** — Validates `/api/request-access` body
- **EventSchema** — Validates `/api/events` body
- **OfferSchema** — Validates deal offers (not yet implemented in UI)
- **BuyBoxSchema** — Validates investor preferences (not yet implemented)

---

## Third-Party Integrations

### Mapbox GL JS
- **Status**: Fully implemented with graceful fallback
- **Component**: `components/PropertyMap.tsx`
- **Props**: `center` (lng/lat), `markers` (array with lng/lat/label/color), `radius` (miles), `className`
- **Features**: Interactive maps, custom colored markers, radius circles, popup labels, auto-fit bounds
- **Used on**: Deals listing page (all deals), Deal detail page (subject + radius, comps map)
- **Fallback**: Shows static placeholder UI when `NEXT_PUBLIC_MAPBOX_TOKEN` is not set

### PandaDoc
- **Status**: Planned — currently mocked with styled modal
- **Where**: Signup Step 3 (NDA signing)
- **Integration needed**: Embed PandaDoc signing widget or use API to create signing sessions, then store signed document reference on the Contact in Salesforce

### Salesforce
- **Status**: Framework scaffolded — stubs return mock data
- **Where**: All API routes, deal data, user data, event tracking
- **See**: [Salesforce Integration](#salesforce-integration) section above for full field mapping

---

## What Needs Salesforce Integration

Prioritized list of everything the Salesforce developer needs to connect:

### Priority 1 — Authentication
- [ ] Implement real login validation in `POST /api/auth/login` — verify email/password against Contact records
- [ ] Return the real Salesforce Contact ID as `contactId` in the session
- [ ] Add Next.js middleware to protect `/dashboard/*` routes server-side

### Priority 2 — Deal Data
- [ ] Ensure `DACQ_Deal__c` custom object exists with all fields listed above
- [ ] Wire up `GET /api/deals` to return real published deals
- [ ] Add additional deal fields for detail page (description, rehab info, lat/lng, images)
- [ ] Create related object or field for comparables data
- [ ] Host deal images in Salesforce Files, S3, or CDN and expose URLs

### Priority 3 — User Preferences (Signup + Dashboard + Settings)
- [ ] Create custom fields on Contact for all signup Step 2 preferences (see field table above)
- [ ] Wire up signup flow to create Contact with preferences on completion
- [ ] Wire up dashboard preferences form to read/write Contact fields via API
- [ ] Wire up Settings page email preferences to Contact fields

### Priority 4 — Documents
- [ ] Integrate PandaDoc for NDA signing during signup
- [ ] Store signed document references in Salesforce (ContentDocument or custom object)
- [ ] Query signed documents for the Documents page
- [ ] Provide real download URLs

### Priority 5 — Event Tracking & Analytics
- [ ] Create `DACQ_Investor_Engagement__c` object with fields listed above
- [ ] Verify `POST /api/events` correctly creates engagement records
- [ ] Build Salesforce reports/dashboards on engagement data

### Priority 6 — Email Automation
- [ ] Use Settings preferences (scope + frequency) to drive email sends
- [ ] Build email automation in Marketing Cloud or Salesforce Flow
- [ ] Daily: new deals matching investor's scope at 8 AM CST
- [ ] Weekly: digest of all new deals from past week, every Monday 8 AM CST

### Priority 7 — Advisor Assignment
- [ ] Create advisor lookup/assignment field on Contact
- [ ] Return real advisor info for signup Step 5 and dashboard profile card
- [ ] Advisor fields needed: name, title, phone, email, photo URL

---

## Design System

- **Color scheme**: Black and white primary, with color accents only in specific components (profit calculator, rehab condition pills, achievement badges)
- **All pages**: Use `"use client"` directive (client components)
- **Animations**: Stagger animations with `mounted` state and CSS transitions
- **Responsive**: Mobile-first with `md:` breakpoints
- **Forms**: Controlled React components with inline validation

---

## Production Readiness Checklist

- [ ] Replace all mock/stub Salesforce functions in `lib/salesforce/queries.ts` with real API calls
- [ ] Implement real authentication against Salesforce Contact records
- [ ] Add Next.js middleware for server-side route protection
- [ ] Integrate PandaDoc for NDA signing
- [ ] Replace mock deal data (`lib/mockDeals.ts`) with Salesforce queries
- [ ] Set up error logging and monitoring (Sentry, Datadog, etc.)
- [ ] Add rate limiting to API routes
- [ ] Implement session refresh mechanism
- [ ] Add React error boundaries
- [ ] Configure CORS and CSP headers
- [ ] Set all environment variables in Vercel dashboard
- [ ] Test against Salesforce sandbox before production
- [ ] Load test with expected concurrent user count

---

## License

Proprietary - All rights reserved. Diamond Acquisitions LLC.
