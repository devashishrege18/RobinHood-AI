# Robin-Hood AI

> AI-powered negotiation advisor for farmers, retailers, and small businesses.

Robin-Hood AI levels the playing field by giving everyday people access to expert negotiation strategies — powered by Google Gemini 2.5 Flash. Speak or upload a contract, and get a full risk analysis, market comparison, and ready-to-use negotiation strategy.

---

## Quick Start

### Prerequisites

- Node.js v18+
- Python 3.10+
- Gemini API Key — get one free at [Google AI Studio](https://aistudio.google.com/apikey)

### 1. Clone and Setup Backend

```bash
cd robinhood-ai/backend

# Create virtual environment
python -m venv venv

# Activate (Windows PowerShell)
.\venv\Scripts\Activate.ps1

# Activate (Mac / Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Add your API key — edit backend/.env
# GEMINI_API_KEY=your-actual-key-here
```

### 2. Setup Frontend

```bash
cd robinhood-ai/frontend
npm install
```

### 3. Run Development Servers

**Terminal 1 — Backend:**

```bash
cd robinhood-ai/backend
.\venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 — Frontend:**

```bash
cd robinhood-ai/frontend
npm run dev
```

### 4. Open the App

- Frontend: http://localhost:5173
- API Docs: http://localhost:8000/docs

---

## Project Structure

```
robinhood-ai/
├── frontend/               # React + Vite + TailwindCSS
│   ├── public/
│   │   └── logo.png        # Robin Hood character logo
│   └── src/
│       ├── components/     # VoiceMic, FileUpload, RiskGauge, etc.
│       ├── pages/          # HomePage, NegotiatePage, AboutPage
│       ├── hooks/          # useAnalysis
│       └── services/       # API client
└── backend/                # FastAPI + Gemini
    └── app/
        ├── routers/        # API endpoints
        ├── services/       # Gemini 2.5 Flash integration
        ├── models/         # Pydantic schemas
        └── prompts/        # AI prompt templates
```

---

## How It Works

1. **Speak or Upload** — Describe your deal by voice (Hindi or English) or upload a contract PDF/image
2. **AI Analyzes** — Gemini 2.5 Flash extracts text, fetches market data, identifies risky clauses
3. **See the Risks** — Risk score gauge (0-100), flagged clauses with severity, market price comparison
4. **Get Your Strategy** — Counter-offer suggestion, price reasoning, numbered negotiation talking points

---

## API Reference

### `POST /api/analyze`

Analyze a contract from voice input or uploaded document.

**Request:**
```json
{
  "text": "Company offered me wheat at Rs 2350 per quintal",
  "file_content": "<base64-encoded file>",
  "file_name": "contract.pdf",
  "language": "en"
}
```

**Response:**
```json
{
  "risk_score": 72,
  "risk_level": "high",
  "risks": [...],
  "market_comparison": {...},
  "suggested_price": "2,650",
  "improvement_pct": "+12.77%",
  "price_reasoning": [...],
  "negotiation_points": [...]
}
```

### `GET /api/health`

Health check — returns `{"status": "ok"}`.

---

## Tech Stack

| Layer    | Technology       |
|----------|-----------------|
| Frontend | React + Vite     |
| Styling  | TailwindCSS      |
| Backend  | FastAPI (Python) |
| AI       | Gemini 2.5 Flash |

---

## Hackathon MVP Scope

### Current MVP supports

- Voice and text deal input (Hindi + English)
- Contract document upload (PDF, image)
- AI-powered deal analysis via Gemini 2.5 Flash
- Risk detection with severity scoring
- Fairness scoring against market prices
- Counter-offer generation with price reasoning
- Negotiation strategy recommendations with talking points

### Future roadmap

- Multi-language support (regional Indian languages)
- Live market data integrations (mandi prices, commodity APIs)
- Regional pricing intelligence by district/state
- Contract OCR pipeline for scanned documents
- Bhashini/Sarvam voice support for deeper local language input

---

## License

MIT — Built for the Hackathon.
