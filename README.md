# AI Use Case Finder

A Progressive Web App that maps any industry's business process architecture and identifies AI automation opportunities using a **10-lens framework**. The backend uses **[Ollama](https://ollama.com)** so you can run **free, open-weight models** locally (no cloud API key).

---

## What It Does

1. **Takes input**: Industry name + organisation size
2. **Runs a local LLM** (via Ollama) that:
   - Maps the process architecture for that industry
   - Applies 10 analytical lenses to identify AI opportunities
   - Scores each use case by Impact (1–10) and Feasibility (1–10)
   - Generates data strategy, ROI-style estimates, and implementation roadmaps
3. **Delivers a dashboard** with:
   - Executive summary + industry KPIs
   - Interactive process map (ReactFlow)
   - Filterable/sortable AI use case cards
   - Impact vs Feasibility priority matrix
   - AI maturity roadmap + strategic recommendations
   - Export to PDF (print) or JSON

---

## The 10 AI Opportunity Lenses

| # | Lens | What it catches |
|---|------|----------------|
| 1 | Volume & Repetition | Tasks done at scale, 100×/day or more |
| 2 | Data Richness | Where most structured/unstructured data flows |
| 3 | Decision Frequency | Routine judgements made many times a day |
| 4 | Pain & Friction | Errors, bottlenecks, complaints, workarounds |
| 5 | Human Bottleneck | Queues waiting for human review or approval |
| 6 | Compliance & Auditability | Regulatory documentation requirements |
| 7 | Customer Experience | Touchpoints affecting satisfaction and loyalty |
| 8 | Predictive Intelligence | Areas needing forecasting or anomaly detection |
| 9 | Knowledge Management | Expert knowledge capture and transfer |
| 10 | Resource Optimisation | Complex allocation of people, budget, inventory |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + Vite |
| Backend | FastAPI (Python) |
| LLM | Ollama — open models (e.g. Llama, Mistral, Qwen) |
| Streaming | Server-Sent Events (SSE) |

---

## Setup

### Prerequisites

- **Python 3.10+**
- **Node.js 18+**
- **[Ollama](https://ollama.com)** installed and running

### 1. Install a model

```powershell
ollama pull llama3.2
```

For better JSON quality on weaker hardware, try smaller models; for richer output, try e.g. `qwen2.5:7b-instruct` or `mistral` (see [Ollama library](https://ollama.com/library)).

### 2. Backend environment (optional)

```powershell
cd "c:\Prashant\Cursor\AI Use case finder\backend"
Copy-Item .env.example .env
```

Edit `backend\.env` if needed:

- `OLLAMA_BASE_URL` — default `http://127.0.0.1:11434`
- `OLLAMA_MODEL` — default `llama3.2` (must match a pulled model)
- `OLLAMA_NUM_PREDICT` — max new tokens (default `8192`)

Install dependencies:

```powershell
pip install -r requirements.txt
```

Start the API:

```powershell
uvicorn main:app --reload --port 8001
```

Or run `.\start-backend.ps1` in the `backend` folder (same port).

Check health: http://localhost:8001/api/health — JSON must include `"llm": "ollama"`.  
(Port **8001** avoids clashes with an old Anthropic-based server that may still be on **8000**.)

### 3. Frontend

```powershell
cd "c:\Prashant\Cursor\AI Use case finder\frontend"
npm install
npm run dev
```

Open **http://localhost:5173**

---

## Usage

1. Enter an **industry** and **organisation size**
2. Click **Generate AI Use Case Analysis**
3. Wait while the local model streams JSON (CPU runs can take several minutes)
4. Explore the tabs and use **Export** for PDF or JSON

---

## Deploy the frontend on Vercel

**Important:** Vercel only hosts the **React (Vite) app**. It cannot run **FastAPI** or **Ollama**. You must run the API (+ Ollama) on a **VPS, home server, or a host like Railway/Fly.io/Render** with a **public HTTPS URL**, then point the UI at it.

1. Push this repo to GitHub (or GitLab / Bitbucket).
2. In [Vercel](https://vercel.com) → **Add New Project** → import the repo.  
   The repo root `vercel.json` builds `frontend/` and publishes `frontend/dist`.
3. **Environment variables** (Vercel → Project → Settings → Environment Variables):
   - `VITE_API_URL` = your API base URL, **no trailing slash**, e.g. `https://api.yourdomain.com`  
     (must expose `/api/health` and `/api/analyze` with **CORS** allowed for your Vercel domain; the backend already uses `allow_origins=["*"]`).
4. Redeploy after adding env vars.

Local dev is unchanged: leave `VITE_API_URL` unset so requests use the Vite proxy to `localhost:8001`.

---

## Notes

- **No API fees** — everything runs on your machine via Ollama
- Smaller models may occasionally truncate or break JSON; the backend attempts repair; using a larger instruct model and/or increasing `OLLAMA_NUM_PREDICT` helps
- If analysis fails, confirm `ollama serve` is running and `ollama list` shows your chosen model
