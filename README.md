# 🏹 RobinHood AI

> **AI-powered negotiation advisor for farmers, retailers, and small businesses.**

RobinHood AI levels the playing field by giving everyday people access to expert negotiation strategies — powered by Google's Gemini 2.5 Flash.

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18+
- **Python** 3.10+
- **Gemini API Key** — get one free at [Google AI Studio](https://aistudio.google.com/apikey)

### 1. Clone & Setup Backend

```bash
cd robinhood-ai/backend

# Create virtual environment
python -m venv venv

# Activate (Windows PowerShell)
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Set your API key
# Edit .env and replace 'your-gemini-api-key-here' with your actual key
```

### 2. Setup Frontend

```bash
cd robinhood-ai/frontend

# Install dependencies
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

- **Frontend:** http://localhost:5173
- **API Docs:** http://localhost:8000/docs

---

## 📁 Project Structure

```
robinhood-ai/
├── frontend/          # React + Vite + TailwindCSS
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Route pages
│   │   ├── hooks/        # Custom React hooks
│   │   ├── services/     # API client
│   │   └── utils/        # Helpers
│   └── ...
├── backend/           # FastAPI + Gemini
│   ├── app/
│   │   ├── routers/      # API endpoints
│   │   ├── services/     # Gemini integration
│   │   ├── models/       # Pydantic schemas
│   │   └── prompts/      # AI prompt templates
│   └── ...
└── README.md
```

---

## 🛠 Tech Stack

| Layer    | Technology         |
| -------- | ------------------ |
| Frontend | React + Vite       |
| Styling  | TailwindCSS        |
| Backend  | FastAPI (Python)   |
| AI       | Gemini 2.5 Flash   |
| Deploy   | Localhost           |

---

## 📝 API

### `POST /api/negotiate`

Send deal details, receive AI-powered negotiation advice.

### `GET /api/health`

Health check endpoint.

See full API docs at http://localhost:8000/docs when running.

---

## 📄 License

MIT — Built with ❤️ for the Hackathon.
