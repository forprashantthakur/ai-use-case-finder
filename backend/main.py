import json
from pathlib import Path

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

from agent import AIUseCaseAgent, _ollama_base, _ollama_model
from models import AnalysisRequest

# Always resolve .env relative to this file so it works regardless of cwd
load_dotenv(dotenv_path=Path(__file__).parent / ".env")

app = FastAPI(
    title="AI Use Case Finder API",
    description="Identifies AI automation opportunities in any industry using a 10-lens framework (Ollama / local LLM)",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def mark_ollama_backend(request, call_next):
    response = await call_next(request)
    response.headers["X-AI-Use-Case-Finder-Engine"] = "ollama"
    return response


@app.get("/api/health")
async def health():
    base = _ollama_base()
    model = _ollama_model()
    ollama_ok = False
    installed: list[str] = []
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            r = await client.get(f"{base}/api/tags")
            ollama_ok = r.status_code == 200
            if ollama_ok:
                data = r.json()
                for m in data.get("models", []) or []:
                    n = m.get("name") or m.get("model")
                    if n and isinstance(n, str):
                        installed.append(n)
    except Exception:
        ollama_ok = False

    return {
        "status": "healthy" if ollama_ok else "degraded",
        "llm": "ollama",
        "engine_version": "2.1",
        "ollama_base_url": base,
        "ollama_model_preference": model,
        "ollama_reachable": ollama_ok,
        "ollama_models_installed": len(installed),
        "ollama_models": installed[:20],
    }


@app.post("/api/analyze")
async def analyze_industry(request: AnalysisRequest):
    agent = AIUseCaseAgent()

    async def generate():
        try:
            async for chunk in agent.analyze(
                industry_name=request.industry_name,
                industry_size=request.industry_size,
                additional_context=request.additional_context or "",
            ):
                yield f"data: {json.dumps(chunk)}\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'type': 'error', 'message': str(e)})}\n\n"
        finally:
            yield "data: [DONE]\n\n"

    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
            "X-AI-Use-Case-Finder-Engine": "ollama",
        },
    )
