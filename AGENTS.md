# AGENTS.md

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This project uses Next.js 16 with App Router.

Before modifying framework-specific code:

* Check current Next.js 16 documentation.
* Follow App Router conventions.
* Prefer Server Components by default.
* Only use Client Components when state, browser APIs, or event handlers are required.
* Respect React 19 and Next.js 16 patterns.

<!-- END:nextjs-agent-rules -->

# FutureStock

FutureStock adalah aplikasi manajemen inventaris dan prediksi stok berbasis AI untuk kebutuhan toko, warung, dan UMKM.

---

# Project Overview

Fitur utama:

* Dashboard Inventaris
* Manajemen Produk
* Manajemen Transaksi
* AI Forecasting
* Dead Stock Detection
* Activity Log
* Analytics Dashboard
* Laporan dan Export Data
* Authentication
* Notification System

---

# Tech Stack

## Frontend

* Next.js 16
* React 19
* TypeScript
* Tailwind CSS v4
* Shadcn UI
* Lucide React
* Framer Motion
* Recharts

## Backend

* Supabase

## Validation

* Zod
* React Hook Form

## State Management

* Zustand

## AI

* Google Gemini API
* @google/genai

---

# Architecture Rules

## 1. Service Layer First

All database access MUST go through services.

Preferred:

```ts
await getProducts();
await createSale();
await getInventoryAnalytics();
```

Avoid:

```ts
const { data } = await supabase
  .from("products")
  .select("*");
```

inside page components.

---

## 2. Server Components by Default

Use Server Components unless:

* useState is needed
* useEffect is needed
* browser APIs are needed
* event handlers are needed

Only then use:

```tsx
"use client";
```

---

## 3. TypeScript Strict

Never use:

```ts
any
```

Prefer:

```ts
unknown
```

or proper interfaces.

Every exported function should have explicit typing.

---

## 4. Reusable Components

If UI appears more than once:

Move it into:

```txt
src/components
```

instead of duplicating code.

---

## Folder Structure

```txt
src/
│
├── app/
│   ├── dashboard/
│   ├── inventaris/
│   ├── produk/
│   ├── transaksi/
│   ├── prediksi-ai/
│   ├── analitik/
│   ├── dead-stock/
│   ├── aktivitas/
│   ├── laporan/
│   ├── pengaturan/
│   └── api/
│
├── components/
│
├── services/
│
├── lib/
│
├── hooks/
│
├── stores/
│
├── types/
│
└── providers/
```

---

# UI Rules

## Dashboard Pages

Every dashboard page should use:

```tsx
<DashboardLayout>
```

as the main layout wrapper.

---

## Panels

Prefer:

```tsx
<GlassPanel>
```

for major dashboard cards and content sections.

---

## Design Language

Theme:

* Modern SaaS Dashboard
* Clean spacing
* Soft shadows
* Glassmorphism elements
* Responsive layout

Avoid:

* Excessive gradients
* Random colors
* Inconsistent spacing

---

# Supabase Rules

Use:

```ts
supabaseAdmin
```

for privileged server operations.

Use:

```ts
createClient()
```

for authenticated user operations.

Never expose:

* service role keys
* private environment variables

to client components.

---

# Database Rules

Tables commonly used:

* products
* sales
* sale_items
* ai_forecasts
* activity_logs

Before creating new tables:

1. Check existing schema.
2. Reuse existing relations whenever possible.
3. Avoid duplicate business entities.

---

# Activity Log Rules

Important user actions should create activity logs:

Examples:

* product create
* product update
* product delete
* sale create
* sale delete
* forecast generate

---

# AI Forecast Rules

Forecasting features should:

* validate historical data first
* handle empty datasets gracefully
* never assume prediction results exist
* always provide fallback UI

---

# Error Handling

Always provide:

* loading state
* empty state
* error state

Use existing conventions:

```txt
loading.tsx
error.tsx
global-error.tsx
```

---

# Performance Rules

Prefer:

* Server Components
* Streaming
* Pagination

Avoid:

* fetching large datasets on client
* unnecessary useEffect fetching
* duplicate queries

---

# Code Style

## Components

PascalCase

Example:

```ts
ProductTable
SalesChart
InventoryOverview
```

---

## Functions

camelCase

Example:

```ts
getProducts
createSale
generateForecast
```

---

## Types

PascalCase

Example:

```ts
Product
Sale
ForecastResult
```

---

# Before Creating New Code

Always check:

1. Existing component already available?
2. Existing service already available?
3. Existing type already available?
4. Existing Supabase query already available?

Reuse before creating new implementations.

---

# Goal

Maintain FutureStock as:

* scalable
* strongly typed
* AI-assisted
* inventory-focused
* production-ready
* consistent across all dashboard modules
  """
