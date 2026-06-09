# Admin Portal — Plan

## Overview

Expand the existing `inventory-app/` (Vite + React + TypeScript) into a full admin portal for **New House Real Estate**. Goes beyond property CRUD to provide business analytics, builder intelligence, and operational insights.

**Stack:** Vite + React + TypeScript (existing)  
**Theme:** Dark with warm amber/gold accents (existing)  
**Location:** `inventory-app/` (existing project)

---

## Current State

Already built in `inventory-app/`:

| Feature | Status |
|---|---|
| Dark theme with gold accent, DM Sans + Playfair Display | Done |
| Sidebar nav (Dashboard, Builders, Properties) | Done |
| Dashboard with stats grid (total props, total value, builder count, sold rate) + bar chart (avg price by location) + pie chart (property type) + status bars | Done |
| Builders page (list, create modal, delete) | Done |
| Properties page (filterable table, create/edit modal, delete, status badges) | Done |
| API client (all Recomm-API endpoints) | Done |
| Modal + Toast components | Done |

---

## New Pages

### 1. Analytics (`/analytics`)

Deep business intelligence beyond the dashboard overview.

| Section | Chart Type | Data Source | Description |
|---|---|---|---|
| Price Trends | Line chart (multi-series) | `GET /api/properties` | Average price per sqft by property type over time (mocked from property creation dates) |
| Builder Performance | Horizontal bar chart | `GET /api/properties` (grouped by builder) | Each builder's total listings, total value, average price, units sold |
| Location Distribution | Table + treemap/bar | `GET /api/properties` | Properties per city/location, avg price, price range |
| Monthly Activity | Bar chart | `GET /api/properties` (by created_at month) | Properties added per month |
| Price Range Buckets | Histogram | `GET /api/properties` | Count of properties in ranges: <25L, 25-50L, 50L-1Cr, 1-2Cr, 2Cr+ |
| Status Mix | Donut/ring chart | `GET /api/properties` | Available vs Sold vs Under Construction percentages |
| Export | CSV download button | — | Download filtered analytics as CSV |

#### Page Layout

```
┌──────────────────────────────────────────────┐
│  Date Range Filter: [7d] [30d] [90d] [All]   │
├──────────────────────────────────────────────┤
│  ┌──────────────┐  ┌────────────────────────┐│
│  │ Builder Rank  │  │ Price Trends (line)    ││
│  │ (horizontal   │  │                        ││
│  │  bar chart)   │  │                        ││
│  └──────────────┘  └────────────────────────┘│
│                                               │
│  ┌──────────────┐  ┌────────────────────────┐│
│  │ Location     │  │ Monthly Activity (bar)  ││
│  │ Distribution │  │                        ││
│  │ (table+bar)  │  │                        ││
│  └──────────────┘  └────────────────────────┘│
│                                               │
│  ┌──────────────┐  ┌────────────────────────┐│
│  │ Price Buckets│  │ Status Mix             ││
│  │ (histogram)  │  │ (donut chart)         ││
│  └──────────────┘  └────────────────────────┘│
│                                               │
│  [Export CSV]                                  │
└──────────────────────────────────────────────┘
```

### 2. Enhanced Dashboard (`/`)

New widgets added to the existing dashboard:

| Widget | Type | Position |
|---|---|---|
| Monthly call volume (placeholder) | Area/bar chart | Top row |
| Property status breakdown (exists) | Bar chart | Left mid |
| Property type mix (exists) | Pie chart | Right mid |
| Recent activity feed | Timeline list | Bottom left |
| Top performers (builders) | Mini leaderboard | Bottom right |
| Total portfolio value (exists) | Stat card | Stats row |
| Sold rate (exists) | Stat card | Stats row |

### New Stats Cards

| Stat | Formula |
|---|---|
| Avg Price | `total_value / total_properties` |
| Highest Price | `MAX(price)` |
| Most Active Builder | `builder with most properties` |
| Sold % | `(sold_count / total_count) * 100` |

---

## New Dependencies

```json
{
  "@livekit/components-react": "^4",
  "date-fns": "^4",
  "file-saver": "^2",
  "@types/file-saver": "^2"
}
```

`recharts` is already installed.

---

## New Components

```
src/
├── components/
│   ├── Charts/
│   │   ├── PriceTrendChart.tsx       # Multi-line chart
│   │   ├── BuilderBarChart.tsx       # Horizontal bar chart
│   │   ├── LocationTable.tsx         # Table with location stats
│   │   ├── MonthlyBarChart.tsx       # Monthly property additions
│   │   ├── PriceBucketsChart.tsx     # Histogram
│   │   └── StatusDonutChart.tsx      # Donut/ring chart
│   ├── ActivityFeed.tsx              # Recent activity timeline
│   └── ExportButton.tsx              # CSV download button
├── pages/
│   ├── Dashboard.tsx                 # Enhanced with new widgets
│   └── Analytics.tsx                 # NEW: deep analytics page
├── utils/
│   └── analytics.ts                  # Data aggregation helpers
```

---

## Data Aggregation (`utils/analytics.ts`)

Helper functions to transform raw API data into chart-ready datasets:

```typescript
function aggregateByBuilder(properties: Property[]): BuilderStats[]
function aggregateByLocation(properties: Property[]): LocationStats[]
function aggregateByMonth(properties: Property[]): MonthlyStats[]
function aggregateByPriceBucket(properties: Property[]): BucketStats[]
function calculateTrends(properties: Property[]): TrendData
function exportToCSV(data: Record<string, any>[], filename: string): void
```

---

## Sidebar Updates

Add to existing sidebar navigation:

```
🏠 Dashboard
🏗 Builders
🏘 Properties
📊 Analytics      ← NEW
⚙️ Settings       ← NEW (optional placeholder)
```

---

## Implementation Order

1. Create `src/utils/analytics.ts` with data aggregation helpers
2. Create chart components (`PriceTrendChart`, `BuilderBarChart`, `LocationTable`, etc.)
3. Create `Analytics.tsx` page composing all charts
4. Add `/analytics` route to `App.tsx`
5. Add Analytics nav item to `Layout.tsx` sidebar
6. Enhance `Dashboard.tsx` with new widgets (activity feed, call volume placeholder, top builders)
7. Add export functionality (CSV download)
8. Test with live Recomm-API data
