# Crimson Charm — Personal Inventory & Sales App

A lightweight personal inventory and sales management web application backed by **Google Sheets**, featuring **Gemini 2.5 Flash OCR** for item labels & business cards, **Google Drive** for product photos, **dynamic markup/discount pricing**, **real-time P&L analytics**, an **On-Demand Letterhead Invoice Maker** with **PDF generation & direct mobile/WhatsApp sharing**, a dedicated **Customers database**, and brand styling for **Crimson Charm** (*With Love from ASK Hospitality*).

---

## 🌟 Dual-Mode Architecture

This app runs in two ways:
1. **Direct Google Apps Script Web App**: Paste `Code.gs` and `Index.html` into Apps Script and access via `script.google.com`.
2. **Deployed on Vercel**: Deploy this repository directly to Vercel (`https://*.vercel.app`). The included Serverless Function (`api/proxy.js`) securely bridges the frontend to your Google Sheets backend, overcoming browser CORS and redirect restrictions.

---

## 🚀 Step-by-Step Deployment Guide

### Step 1: Set Up Google Sheet & Backend (`Code.gs`)
1. Create a new Google Sheet at [sheets.new](https://sheets.new) (name it **Crimson Charm Inventory**).
2. Go to **Extensions** → **Apps Script**.
3. Delete any default code in `Code.gs` and copy-paste the entire contents of [`Code.gs`](./Code.gs).
4. *(Optional but recommended)* In the left sidebar, click the `+` next to **Files** → **HTML**, name it `Index`, and paste [`Index.html`](./Index.html).
5. At the top of the Apps Script editor, select the function **`initializeSheets`** from the dropdown and click **Run**. Grant permissions when prompted. (This auto-creates all 8 sheets: *Inventory, Purchases, Sales, P&L, Stockists, Categories, Users, Customers*).
6. Click **Deploy** → **New deployment**.
   - Click the gear icon next to "Select type" and choose **Web app**.
   - **Description**: `Crimson Charm v1.0`
   - **Execute as**: **Me (your-email@gmail.com)**
   - **Who has access**: **Anyone** *(Essential so the Vercel proxy can communicate with it)*
7. Click **Deploy** and copy the **Web app URL** (looks like `https://script.google.com/macros/s/AKfycb.../exec`).

---

### Step 2: Deploy to Vercel

#### Option A: Deploy via GitHub & Vercel Dashboard (Easiest)
1. Push this folder to your GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Crimson Charm Inventory App"
   git branch -M main
   git remote add origin https://github.com/your-username/crimson-charm-inventory.git
   git push -u origin main
   ```
2. Log in to [vercel.com](https://vercel.com) and click **Add New** → **Project**.
3. Import your GitHub repository.
4. Under **Environment Variables**, add:
   - **Key**: `APPS_SCRIPT_URL`
   - **Value**: Your Google Apps Script Web App URL from Step 1.
5. Click **Deploy**. Your app will be live at `https://crimson-charm-inventory.vercel.app`!

#### Option B: Deploy via Vercel CLI
1. Install Vercel CLI (if not already installed):
   ```bash
   npm i -g vercel
   ```
2. Run in this directory:
   ```bash
   vercel
   ```
3. Set the environment variable:
   ```bash
   vercel env add APPS_SCRIPT_URL
   ```
4. Deploy to production:
   ```bash
   vercel --prod
   ```

---

### Step 3: User Authentication & Whitelist Access
The app includes security to prevent unauthorized access:
1. **Google Sheets Whitelist**:
   - The spreadsheet now includes a dedicated **`Users`** tab (`User ID | Email | Password | Name | Role | Status | Last Login | Date Added`).
   - Only emails present on this whitelist with status `Active` can log in.
   - When `initializeSheets` runs, it automatically whitelists your Google account email as **Admin** with initial default password **`admin123`**.
2. **Logging In**:
   - Open the app → Enter your whitelisted Google email & password (or sign in with Google).
   - If both are verified against the Google Sheet, access is granted.
   - Unauthorized emails are instantly blocked with an access denied alert.
3. **Managing Whitelisted Users**:
   - Admins can add or deactivate users directly inside the app in the **More (⚙️) > User Whitelist & Access** tab, or edit the **Users** tab directly in Google Sheets anytime.

---

### Step 4: Configure In-App Settings
Once your Vercel URL opens:
1. Tap the **More (⚙️)** tab in the bottom navigation.
2. In **AI & System Settings**:
   - If you didn't set `APPS_SCRIPT_URL` in Vercel environment variables, paste your Google Apps Script URL into the **Google Apps Script Web App URL** input and tap **Save Backend URL** (it saves securely to your phone's browser storage).
   - Enter your **Gemini API Key** from [aistudio.google.com](https://aistudio.google.com) and tap **Save Key** to enable instant camera OCR for product labels and business cards.
   - Upload your company logo or customize details under **Company Profile & Logo**.

---

## 🧾 On-Demand Letterhead Invoice Maker & Customer Directory

### 1. New Customers Database (`Customers` Sheet)
- Columns: `Customer ID | Name | Mobile | Email | Address | Total Purchases (₹) | Invoices Count | Date Added | Last Purchase Date`.
- Automatically keeps customer purchase history, totals, and invoice counts in sync whenever a sale occurs.
- Browse, search by phone or name, add, edit, or delete customers from the **More (⚙️) > 👥 Customer Directory** screen.

### 2. On-Demand Invoice Generation
- **At Checkout**: Enter customer name, mobile (with optional email & address) while making a sale. Click **"📄 On-Demand Letterhead Invoice"** immediately upon recording.
- **For ANY Past Sale**: Open **Sell (💰) > 📋 Sales & Invoices** to browse all past sales and generate an official letterhead invoice on demand with one click.
- **For Registered Customers**: In **More (⚙️) > 👥 Customer Directory**, click **"📄 Invoice"** on any customer to generate an invoice.

### 3. Executive Letterhead Design
- Built from company logo, **Crimson Charm** header typography, company address, contact info, and tax/retail invoice numbering (`#INV-CC-XXXXXX`).
- Itemized goods breakdown, quantity, unit rates, line totals, and grand total in Indian Rupees (`₹`).
- Exchange policy, terms, authorized signatory line, and official credits: **"With Love from ASK Hospitality"**.

### 4. Direct Mobile Sharing to Customer's Number
- **💬 Send via WhatsApp**: 1-click button opens WhatsApp directly addressed to the customer's mobile number with a pre-formatted receipt summary.
- **📄 Share / Download PDF**: Generates high-fidelity PDF letterhead and opens native mobile share sheet (`navigator.share`) on iOS & Android to share the actual `.pdf` document directly via WhatsApp, Messages, or AirDrop.
- **🖨️ Print Letterhead**: `@media print` optimized for clean vector A4 letterheads or "Save as PDF".
- **📱 SMS Bill & 📧 Email**: Quick SMS text or branded HTML email delivery.

---

## 🛠 Local Development
To run and test the app locally with zero npm dependencies:
```bash
npm start
# App starts at http://localhost:3000
```
If you have set the environment variable locally:
```bash
APPS_SCRIPT_URL="https://script.google.com/macros/s/.../exec" npm start
```

---

## 📂 Project Structure
- [`Code.gs`](./Code.gs): Google Apps Script backend with Google Sheets database operations, Gemini OCR, Drive photos, and JSON API dispatcher.
- [`Index.html`](./Index.html): Mobile-first web app UI with universal runner (auto-switches between native `google.script.run` and `/api/proxy`).
- [`api/proxy.js`](./api/proxy.js): Vercel serverless function proxy forwarding requests to Google Apps Script.
- [`vercel.json`](./vercel.json): Vercel routing configuration.
- [`dev-server.js`](./dev-server.js): Zero-dependency local dev server.
- [`package.json`](./package.json): Project metadata and scripts.

---

*With Love from ASK Hospitality*
