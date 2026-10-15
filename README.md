# Kamakhya Trading Co (KTC) — Wholesale B2B Fashion Catalog

[![Next.js](https://img.shields.io/badge/Next.js-16.3.4-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.8-blue?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Private-red)]()

A high-performance B2B Wholesale Apparel Storefront and Admin Management Portal designed for **Kamakhya Trading Co**, providing direct factory manufacturing rates for boutiques, wholesalers, and retail buyers across India.

---

## 🌐 Live Deployments

The application is configured to run on both **Vercel** and **Netlify**:

| Platform | Deployment URL | Status | Environment |
|---|---|---|---|
| **Vercel** | [wholesale-catalog-ktc8.vercel.app](https://wholesale-catalog-ktc8.vercel.app) | 🟢 **Live & Active** | Next.js 16 Edge / Serverless |
| **Netlify** | [ktcfashion.netlify.app](https://ktcfashion.netlify.app) | 🚀 **Production Configured** | Automated via `netlify.toml` |

> **Note on GitHub About Section:** GitHub repositories only have a single "Website" input field in their metadata sidebar. To represent both platforms, both live deployment URLs are documented here in the README and can be added to the repository's description.

---

## 🌟 Key Features

### 🛍️ Dual-Mode Storefront
- **Wholesale Mode (Default)**: Displays direct mill manufacturing rates, bulk lot pricing, and minimum order quantities (MOQ 25–50 pieces).
- **Retail Sample Mode**: Single-piece pricing for personal buyers and boutique owners inspecting fabric, stitching, and finishing quality.

### 📸 Real Garment Photography & Multi-Source Media
- **Store Owner Photo Management**: Store owners can add product photos directly using device camera capture (`capture="environment"`), file upload from local storage, or by pasting a direct image link.
- **High-Fidelity Garment Previews**: Crisp real-world product photographs with color shade variants and full fabric detail inspection for boutique buyers.

### 🎙️ AI Voice & Natural Language Search
- Smart search engine that extracts pricing constraints and category intents from natural queries (e.g., *"Ethnic under 1000"*, *"Bulk sets below 600"*, *"Free Size"*).
- Integrated **Web Speech API** for voice dictation in Chrome, Edge, and mobile browsers.

### 🤖 Bilingual AI Wholesale Chatbot
- Embedded AI Assistant fluent in **English and Hindi (हिंग्लिश)**.
- Answers buyer inquiries about fabric materials (Chanderi, Georgette, Velvet, Rayon Slub), MOQs, transport logistics, and GST invoicing.
- Text-to-Speech voice synthesis support.

### 📲 WhatsApp B2B Quotations & Order Assembling
- Multi-item **Bulk Purchase Order (PO) Drawer**: Add multiple garments, color variants, and size curves.
- Instant pre-formatted **WhatsApp Proforma Invoices** sent directly to factory dispatch (`+91 63506 26582`).

### 📊 Boutique Margin & Profit ROI Calculator
- Interactive simulations of wholesale cost vs projected retail revenue (50% to 140% margin).
- Pre-configured assortments: *Starter Assortment*, *Festive Super-Lot*, *Bridal Premium*, and *Girls Partywear Special*.

### 👤 Buyer Portal & Restock Requests
- Persistent buyer session with shop name, contact, and city.
- Direct **Urgent Restock Request** pipeline generating factory production priority tickets.

### 🔐 Secure Admin Management Portal
- Protected with PIN and stateless HMAC-signed WhatsApp OTP recovery.
- Full product catalog CRUD operations: title, SKU, wholesale/retail prices, MOQ, fabric, size curves, and color variants.
- **Serverless GitHub Contents API Integration**: Creates, updates, and deletes markdown files by committing directly to the GitHub repository, circumventing read-only filesystem limitations (EROFS) on Netlify/Vercel.

---

## 🏗️ Tech Stack

- **Framework**: [Next.js 16 (Turbopack)](https://nextjs.org/)
- **UI & State**: [React 19](https://react.dev/), `useSyncExternalStore` for external storage reactivity
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Content Storage**: Markdown frontmatter parsed via `gray-matter`
- **Data Persistence**: GitHub REST Contents API + local client state cache fallback
- **AI Assistant**: Conversational bilingual wholesale stylist (Hindi + English) with Web Speech voice recognition and TTS audio playback

---

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/kamakhyatrandingco-design/wholesale-catalog.git
cd wholesale-catalog
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in the required tokens (see [Environment Variables](#environment-variables) below).

### 4. Run development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the storefront, or [http://localhost:3000/admin](http://localhost:3000/admin) for the admin portal.

---

## ⚙️ Environment Variables

| Variable | Description | Default / Example |
|---|---|---|
| `GITHUB_TOKEN` | GitHub Personal Access Token with `Contents: Read & Write` scope | `ghp_...` |
| `GITHUB_REPO_OWNER` | GitHub organization / username | `kamakhyatrandingco-design` |
| `GITHUB_REPO_NAME` | Repository name | `wholesale-catalog` |
| `GITHUB_BRANCH` | Target branch for automated commits | `main` |
| `ADMIN_PIN` | Master Admin PIN for portal login | Configured in private env |
| `ADMIN_SECRET` | Secret salt for stateless HMAC OTP verification | Configured in private env |
| `NEXT_PUBLIC_SHOP_NAME` | Storefront branding display name | `Kamakhya Trading Co` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Factory WhatsApp contact number (with country code) | `916350626582` |
| `GITHUB_CLIENT_ID` | (Optional) GitHub OAuth Client ID | — |
| `GITHUB_CLIENT_SECRET` | (Optional) GitHub OAuth Client Secret | — |

---

## 🚢 Netlify Production Deployment

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/kamakhyatrandingco-design/wholesale-catalog)

1. Click the **Deploy to Netlify** button above or connect `kamakhyatrandingco-design/wholesale-catalog` via the Netlify dashboard.
2. Under **Site configuration > Site details**, set your preferred site subdomain (e.g. `ktcfashion` or your chosen name).
3. In **Site Configuration > Environment Variables**, add:
   - `GITHUB_TOKEN` (fine-grained PAT with Contents read/write)
   - `GITHUB_REPO_OWNER` = `kamakhyatrandingco-design`
   - `GITHUB_REPO_NAME` = `wholesale-catalog`
   - `GITHUB_BRANCH` = `main`
   - `ADMIN_PIN` = your private admin pin
   - `ADMIN_SECRET` = your secret string
4. Trigger deploy. Netlify builds the app via `@netlify/plugin-nextjs` and `.next` publish output.

---

## 🛠️ Verification & Quality Checks

Run linting:
```bash
npm run lint
```

Run production build:
```bash
npm run build
```

---

© 2026 Kamakhya Trading Co. All rights reserved.
