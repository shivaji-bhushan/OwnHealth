# Own Health (Web3 AI Healthcare Web Application)

> **Decentralized, AI-powered healthcare platform bridging patients and clinicians with biomarker lab analysis, natural lifestyle protocols, instant WhatsApp doctor triage, and dual-chain blockchain record immutability.**

---

## 🌟 Key Architecture & Highlights

1. **AI Lab Report & Pathology Analysis Pipeline**
   - Ingests blood work, metabolic panels, and pathology lab reports (PDF, PNG, JPG, or raw clinical text).
   - Extracts biometrics (**Fasting Glucose, HbA1c, Total Cholesterol, HDL, LDL, Triglycerides, Blood Pressure, Vitamin D3, Creatinine, Hemoglobin**).
   - Evaluates metrics against standard clinical pathology thresholds and renders **3-tier interactive visual progress meters (Low, Normal, High/Critical)**.
   - Calculates a global **Patient Health Score (0-100)**.

2. **Natural Recommendations & Lifestyle Cures**
   - Synthesizes non-pharmacological, evidence-based lifestyle therapies:
     - **Specific Yoga Asanas:** Mandukasana, Paschimottanasana, Ardha Matsyendrasana, Viparita Karani with step-by-step execution, duration, target biomarkers, and precautions.
     - **Tailored Dietary Protocols:** Whole-food nutrition to incorporate, inflammatory items to eliminate, key micronutrients (Magnesium Glycinate, Berberine, Omega-3), and meal cadence.
     - **Circadian Rhythm Alignment:** Optimal wake/sleep timing, morning photon trigger, and digital sunset cutoff.
     - **Pranayama & Stress Reduction:** Nadi Shodhana (Alternate Nostril Breathing), box breathing, and physiological sighs.
   - Prominently displays the mandatory medical disclaimer:
     *"AI-generated recommendations are for lifestyle management only and do not replace professional clinical advice."*

3. **Emergency "Contact Doctor" Action & WhatsApp Dispatch**
   - Prominent, visible **"Contact Doctor"** action on the patient report view.
   - Triggers automated WhatsApp alert dispatch to the doctor's phone formatted per specification:
     ```
     ⚠️ Urgent Patient Alert: [Patient Name/Phone] has requested a review for an abnormal lab report. Critical Markers: [List]. View full report: [Direct Doctor Portal URL]
     ```
   - Features a **Live Simulated WhatsApp Phone Feed** overlay allowing instant end-to-end evaluation.

4. **Web3 Multi-Chain Record Immutability**
   - **IPFS Decentralized Storage:** Pins raw reports and analysis metadata to IPFS via Pinata or cryptographic multihash CID generation.
   - **Ethereum Sepolia Testnet:** Anchors `(bytes32 patientHash, string ipfsCID, uint256 timestamp)` into the `OwnHealthRegistry` Solidity smart contract.
   - **Stellar Testnet Horizon:** Logs the calculated health score and verification memo (`OH:S<score>:<reportId>`) via `@stellar/stellar-sdk`.
   - **Verifiable Proof Badge:** Visual multi-chain badge with clickable links to IPFS Gateway, Sepolia Etherscan, and Stellar Expert Explorer.

5. **Doctor Command Center & Triage Queue**
   - Real-time queue of incoming patient consultations and critical alerts.
   - Comprehensive patient telemetry: Contact details, original report download, anomalies breakdown with visual meters, AI diagnostic summary, and doctor clinical review notes.
   - Direct one-click WhatsApp response link (`wa.me`) to message the patient back directly.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 14 (App Router), React 18, Tailwind CSS, Lucide Icons
- **Backend / APIs:** Next.js Server Route Handlers, Node.js
- **Database & Auth:** Prisma ORM, SQLite (`file:./dev.db`) with instant PostgreSQL/Supabase compatibility, Phone OTP authentication, and JWT sessions (`jose`)
- **LLM Pipeline:** Multi-provider support (OpenAI GPT-4o, Anthropic Claude, Google Gemini) with built-in zero-downtime clinical rule-based engine fallback
- **Web3 & Storage:**
  - IPFS (Pinata API / Public Gateways)
  - Ethereum Sepolia Testnet (`ethers.js` + Solidity Smart Contract `OwnHealthRegistry.sol`)
  - Stellar Testnet Horizon (`@stellar/stellar-sdk`)
- **Messaging:** Twilio WhatsApp Business API / Meta WhatsApp Cloud API + interactive live simulator

---

## 📂 Project Directory Structure

```
ownhealth/
├── contracts/
│   └── OwnHealthRegistry.sol      # Solidity smart contract for Sepolia testnet
├── prisma/
│   └── schema.prisma              # Prisma schema (User, LabReport, AnalysisResult, ConsultationAlert)
├── scripts/
│   └── seed.js                    # Database seed script with demo patient, doctor & reports
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/              # send-otp, verify-otp, me, logout
│   │   │   ├── reports/           # upload, list, [id]
│   │   │   └── alerts/            # notify-doctor, list, [id]
│   │   ├── login/page.tsx         # Phone OTP login with 1-click patient/doctor demos
│   │   ├── patient/
│   │   │   ├── dashboard/page.tsx # Patient telemetry, biomarker meters, lifestyle cures
│   │   │   └── upload/page.tsx    # Drag-and-drop uploader + multi-stage pipeline animation
│   │   ├── doctor/
│   │   │   └── dashboard/page.tsx # Triage queue, comprehensive patient view, notes, WhatsApp reply
│   │   ├── globals.css            # Medical UI styling & custom gauges
│   │   ├── layout.tsx             # Root layout with Navbar, WhatsApp simulator, Footer
│   │   └── page.tsx               # High-converting clinical landing page
│   ├── components/
│   │   ├── Navbar.tsx             # Navigation with role switcher & live alert counter
│   │   ├── Footer.tsx             # Platform links, Web3 explorers & disclaimer
│   │   ├── BiomarkerMeter.tsx     # Visual status card with 3-tier progress bar (Low/Normal/High)
│   │   ├── BlockchainProofBadge.tsx # Web3 proof badge (IPFS CID, Sepolia Tx, Stellar Tx)
│   │   ├── LifestyleCureCard.tsx  # Yoga Asanas, Nutrition, Circadian Sleep, Pranayama
│   │   ├── ContactDoctorModal.tsx # WhatsApp emergency dispatch modal
│   │   ├── WhatsAppSimulator.tsx  # Interactive live WhatsApp phone feed
│   │   └── SampleReportsModal.tsx # 1-click clinical presets (Metabolic, Cardio, Wellness)
│   ├── lib/
│   │   ├── prisma.ts              # Database singleton
│   │   ├── auth.ts                # JWT session management & cookie helpers
│   │   ├── llm/
│   │   │   ├── prompts.ts         # Clinical extraction prompts & JSON schema
│   │   │   └── analyzer.ts        # OpenAI / Claude / Gemini / clinical rule-engine
│   │   ├── web3/
│   │   │   ├── ipfs.ts            # Pinata IPFS upload & multihash CID generator
│   │   │   ├── sepolia.ts         # Ethereum Sepolia smart contract anchor & ABI
│   │   │   └── stellar.ts         # Stellar testnet score memo transaction logger
│   │   ├── alerts/
│   │   │   └── whatsapp.ts        # WhatsApp alert formatting & Twilio dispatch
│   │   └── samples/
│   │       └── labReports.ts      # Preloaded realistic clinical diagnostic panels
│   └── types/
│       └── index.ts               # Complete TypeScript interfaces
├── .env.example                   # Full environment variable configuration guide
├── .env                           # Ready-to-run local development environment
└── package.json
```

---

## 🚀 Quickstart Guide

### 1. Prerequisites
- Node.js v18+ or v20+ (Node v24 supported)

### 2. Install Dependencies
```bash
npm install
```

### 3. Initialize Database & Seed Demo Data
```bash
npx prisma db push
node scripts/seed.js
```
*(Pre-populates sample patient Alex Patel, doctor Dr. Sarah Jenkins, and a verified metabolic lab report!)*

### 4. Start Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🔑 Demo Accounts (Instant 1-Click Access)

On the `/login` page or using the header role switcher:
- **Patient Account:**
  - Name: **Alex Patel**
  - Phone: `+15551234567`
  - Demo OTP: `123456`
- **Doctor Account:**
  - Name: **Dr. Sarah Jenkins, MD** (Cardiologist & Metabolic Lead)
  - Phone: `+15550198234`
  - Demo OTP: `123456`

---

## ⚙️ Environment Variables (`.env.example`)

| Variable | Description |
|---|---|
| `DATABASE_URL` | SQLite (`file:./dev.db`) or PostgreSQL (`postgresql://...`) |
| `JWT_SECRET` | 32+ character key for secure sessions |
| `DEMO_OTP` | Default OTP code for instant testing (`123456`) |
| `OPENAI_API_KEY` | OpenAI GPT-4o API Key (optional, clinical engine active by default) |
| `GEMINI_API_KEY` | Google Gemini API Key (optional) |
| `PINATA_JWT` / `PINATA_API_KEY` | Pinata IPFS pinning credentials (optional) |
| `NEXT_PUBLIC_IPFS_GATEWAY` | IPFS gateway URL (`https://gateway.pinata.cloud/ipfs`) |
| `SEPOLIA_RPC_URL` | Sepolia Ethereum RPC URL (`https://rpc.sepolia.org`) |
| `SEPOLIA_PRIVATE_KEY` | Ethereum wallet private key for on-chain anchoring |
| `SEPOLIA_CONTRACT_ADDRESS` | Deployed `OwnHealthRegistry` contract address |
| `STELLAR_SECRET_KEY` | Stellar Testnet secret key (`S...`) |
| `STELLAR_HORIZON_URL` | Stellar Horizon testnet endpoint (`https://horizon-testnet.stellar.org`) |
| `TWILIO_ACCOUNT_SID` | Twilio Account SID for live WhatsApp dispatch |
| `TWILIO_AUTH_TOKEN` | Twilio Auth Token |
| `TWILIO_WHATSAPP_NUMBER` | Twilio WhatsApp sender number (`whatsapp:+14155238886`) |
| `DOCTOR_WHATSAPP_NUMBER` | Attending Doctor WhatsApp recipient phone number |
