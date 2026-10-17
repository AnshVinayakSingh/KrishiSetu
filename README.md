# KrishiSetu (कृषिसेतु)
## AI-Powered Smart Agriculture, Farmer Assistance and Direct Marketplace Platform

> **Hindi Tagline:** “परंपरागत खेती से स्मार्ट खेती तक।”  
> **English Tagline:** “Bridging Farmers to Smarter Agriculture.”

---

### Overview
**KrishiSetu** is an agricultural decision-support and direct marketplace platform designed to bridge traditional farming practices with accessible modern technology for Indian small and marginal farmers.

---

### Core Architecture & Modules

1. **AI Voice-First & Text Farmer Assistant (`/assistant`)**
   - Original animated Indian farmer mascot avatar with `idle`, `listening`, `thinking`, and `speaking` states.
   - Speech-to-Text via Web Speech API (`SpeechRecognition`) with mic permissions and live audio wave visualizer.
   - Text-to-Speech via `window.speechSynthesis` with instant audio cancellation.
   - Server-side `/api/assistant` fallback with verified agronomic knowledge base in Devanagari Hindi and English.

2. **Crop Disease Detection (`/disease-detection`)**
   - Image upload, drag-and-drop, and camera capture.
   - Pre-seeded test library for instant demonstration (Yellow Stripe Rust, Potato Late Blight, Rice Bacterial Blight).
   - Server-side `/api/disease-detection` with confidence ratings, cellular lesion signatures, organic treatments (Neemastra/Jeevamrit), and safe chemical dosages.

3. **What-If Farming Decision Simulator (`/simulator`)**
   - Dynamic comparison of farming choices:
     - Harvest today vs Harvest after 15/60 days.
     - Flood irrigation vs Drip irrigation (55% PMKSY subsidy).
     - Chemical fertilizer vs Organic compost.
   - Interactive sliders for acreage (1-25 acres), mandi rates, expected price surge, and storage fees.
   - Computes net margin, water conserved (Lakh Liters), labor man-days, and risk score.

4. **Direct Farmer-Buyer Marketplace (`/marketplace`)**
   - Search & filter crop lots by variety, district, and quality grade (A/B/C).
   - "Post Crop Lot" form with validation.
   - Negotiation Engine: Accept, Counter-offer, or Reject buyer bids.
   - Direct live demo chat between farmer and verified food processor/mill.

5. **Smart Profit & Sell Advisor (`/profit-advisor`)**
   - Compares 3 selling channels: Local APMC Mandi vs Direct Farm-Gate Buyer vs Cold Storage Holding.
   - Mathematical deduction of diesel freight, mandi cess (1.5%), loading/unloading, and storage fees.
   - Shows true net profit in hand.

6. **Satellite Crop Monitoring & Smart Irrigation (`/satellite-monitoring`)**
   - Multi-spectral Sentinel-2 NDVI canopy vigour mapping (0.1 to 0.9 scale).
   - Sowing date and growth stage tracker.
   - ESP32 IoT Soil Moisture Node telemetry (`/api/sensor-data`).
   - Strict Safety Protocol: Irrigation pump activation requires explicit two-step farmer confirmation.

7. **Agricultural Weather & Spraying Advisory (`/weather`)**
   - 7-day micro-climate outlook with precipitation probability bars.
   - Spraying condition window analysis (favorable vs unfavorable).
   - Severe weather alerts (rain warnings).

8. **Government Schemes & Subsidies (`/schemes`)**
   - Official details for PM-KISAN (₹6,000/yr), PMFBY Fasal Bima, PMKSY Drip Subsidy (up to 55%), SMAM Mechanization, and KCC (4% crop loans).
   - Interactive 30-second "Am I Eligible?" quiz.
   - Document checklist and direct official portal links.

9. **Nearby Fertilizer Shops & Input Directory (`/services`)**
   - Directory of IFFCO centers, private dealers, and soil testing labs.
   - Price comparison table for subsidized Urea (₹266.50/45kg bag), DAP (₹1350), NPK, and MOP.
   - "Report Incorrect Price / Overcharging" action modal.

10. **Multilingual Video Learning Hub (`/learning`)**
    - Curated video masterclasses from ICAR and State Agricultural Universities.
    - Categories: Water Management, Organic Farming, Crop Cultivation, Soil Health.
    - Interactive video modal player and bookmarking.

11. **Location-Based Community Radar (`/community`)**
    - Local farmer reports on pest sightings, canal water release, and mandi arrivals.
    - 1-vote-per-user helpful voting engine.
    - "Post Field Alert" submission form.

12. **Farm & Profile Settings (`/settings`)**
    - Switch between Farmer and Buyer roles.
    - Landholding size, soil type, and irrigation system configuration.
    - Instant bilingual language switch (Hindi Devanagari / English).

---

### Design System & Visual Palette
- **Forest Green:** `#14532D`
- **Deep Agricultural Green:** `#123B2A`
- **Secondary Green:** `#228B52`
- **Fresh Sprout Green:** `#86B96B`
- **Warm Cream Background:** `#F8F7F0`
- **Surface White:** `#FFFFFF`
- **Warm Accent Amber:** `#E9B949`
- **Minimalist, glassy, and animative** aesthetic with backdrop blur (`backdrop-blur-md`), zero horizontal scroll, fully clickable phone (`tel:18001801551`), email (`mailto:support@krishisetu.in`), and responsive mobile drawer.

---

### Setup & Development

```bash
# Navigate to the project directory
cd C:\Users\Anil\.gemini\antigravity\scratch\krishisetu

# Install dependencies
npm install

# Run the development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
