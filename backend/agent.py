import json
import logging
import os
from typing import AsyncGenerator, Any

import httpx

logger = logging.getLogger("agent")

SYSTEM_PROMPT = """You are a world-class business process analyst and AI strategy consultant with deep expertise in digital transformation across all industries. Your analyses are comprehensive, specific, and immediately actionable.

Your role is to:
1. Map the complete business process architecture of any industry
2. Identify AI automation opportunities using a proven 10-lens framework
3. Prioritize opportunities by business impact and implementation feasibility
4. Provide detailed implementation guidance and data strategies

## 10-Lens AI Opportunity Framework

**Lens 1 — Volume & Repetition**: Tasks done repeatedly at scale (hundreds/thousands of times daily or in weekly cycles). High-volume = high automation ROI.

**Lens 2 — Data Richness**: Where the most structured or unstructured data is produced or consumed. Data-rich = AI-ready.

**Lens 3 — Decision Frequency**: Routine judgements made many times per day following defined rules or patterns. Frequent decisions = machine-learnable.

**Lens 4 — Pain & Friction**: Complaints, error clusters, bottlenecks, workarounds, and manual rework. Pain = unmet need for automation.

**Lens 5 — Human Bottleneck**: Processes that can only proceed after a human reviews or approves something, creating queues and delays.

**Lens 6 — Compliance & Auditability**: Regulatory requirements needing documentation, audit trails, and consistent application of rules.

**Lens 7 — Customer Experience**: Touchpoints directly affecting customer satisfaction, response time, and loyalty.

**Lens 8 — Predictive Intelligence**: Areas where forecasting, anomaly detection, or early warning would prevent losses or capture opportunities.

**Lens 9 — Knowledge Management**: Expert knowledge capture, onboarding acceleration, institutional memory, and intelligent search.

**Lens 10 — Resource Optimization**: Complex allocation problems involving people, equipment, budget, inventory, or scheduling.

Always output ONLY valid JSON with no markdown code fences, no commentary before or after. Start your response with { and end with }."""

ANALYSIS_PROMPT = """Analyze the {industry_name} industry (size: {industry_size}). Return ONLY a JSON object — no markdown, no commentary.

JSON schema (keep strings concise so the response fits in one JSON object):

{{
  "industry": {{
    "name": string,
    "size": string,
    "description": string (2 sentences),
    "keyCharacteristics": [string x5]
  }},
  "executiveSummary": string (2 short paragraphs),
  "processMap": [  // exactly 5 items
    {{
      "id": "proc_N",
      "name": string,
      "category": "Core Operations|Support Functions|Management & Strategy|Customer Facing|Compliance & Risk",
      "description": string (1 sentence),
      "department": string,
      "icon": string (single emoji),
      "subProcesses": [  // 2 items each
        {{"id": "sub_N_N", "name": string, "description": string (1 sentence), "frequency": "Daily|Weekly|Monthly|Ad-hoc", "volume": "High|Medium|Low", "currentTechnology": string}}
      ],
      "inputs": [string x2],
      "outputs": [string x2],
      "painPoints": [string x2],
      "connections": ["proc_N"]
    }}
  ],
  "aiUseCases": [  // exactly 6 items
    {{
      "id": "uc_N",
      "title": string,
      "processId": "proc_N",
      "processName": string,
      "subProcessId": "sub_N_N",
      "description": string (2 short sentences),
      "aiTechnology": "Generative AI|ML/Predictive|Computer Vision|NLP|RPA+AI|Optimisation AI",
      "lensesApplied": [  // 2 items
        {{"lens": "Lens N — Name", "rationale": string (1 sentence)}}
      ],
      "dataStrategy": {{
        "dataSources": [string x2],
        "dataTypes": [string x2],
        "dataVolume": "High|Medium|Low",
        "dataQualityRequirements": [string x2],
        "dataGovernance": [string x1],
        "integrationPoints": [string x2]
      }},
      "potentialBenefits": {{
        "efficiency": string (include % or time figure),
        "costReduction": string (include $ figure),
        "qualityImprovement": string (include metric),
        "revenueImpact": string,
        "timeToValue": string (e.g. "4-6 months"),
        "employeeExperience": string (1 sentence)
      }},
      "criticalSuccessFactors": [  // 2 items
        {{"factor": string, "description": string (1 sentence), "risk": "High|Medium|Low"}}
      ],
      "implementationRoadmap": {{
        "phase1": string (Weeks 1-4, key activities),
        "phase2": string (Weeks 5-12),
        "phase3": string (Weeks 13-20),
        "phase4": string (Weeks 21+)
      }},
      "impact": integer 1-10,
      "feasibility": integer 1-10,
      "priority": "High|Medium|Low",
      "priorityRationale": string (1 sentence),
      "estimatedROI": string (e.g. "6-12 months"),
      "complexity": "High|Medium|Low"
    }}
  ],
  "strategicRecommendations": [  // 4 items
    {{"title": string, "recommendation": string (1-2 sentences), "rationale": string (1 sentence), "timeframe": "Short-term (0-6 months)|Medium-term (6-18 months)|Long-term (18+ months)"}}
  ],
  "aiMaturityRoadmap": {{
    "currentState": string (1-2 sentences),
    "year1Goals": string (1-2 sentences),
    "year2Goals": string (1-2 sentences),
    "year3Vision": string (1-2 sentences)
  }}
}}

Rules:
- All content must be specific to {industry_name} at {industry_size} scale — no generic filler
- Metrics in potentialBenefits must be realistic numbers/percentages
- Output MUST be complete valid JSON — close every array and object before finishing

{additional_context}"""


def _ollama_base() -> str:
    return os.environ.get("OLLAMA_BASE_URL", "http://127.0.0.1:11434").rstrip("/")


def _ollama_model() -> str:
    return os.environ.get("OLLAMA_MODEL", "llama3.2").strip()


def _ollama_num_predict() -> int:
    raw = os.environ.get("OLLAMA_NUM_PREDICT", "8192").strip()
    try:
        return max(512, min(65536, int(raw)))
    except ValueError:
        return 8192


def active_llm_provider() -> str:
    """Use OpenAI-compatible HTTP API when OPENAI_API_KEY is set; else Ollama."""
    return "openai" if os.environ.get("OPENAI_API_KEY", "").strip() else "ollama"


def _openai_base() -> str:
    return os.environ.get("OPENAI_BASE_URL", "https://api.openai.com/v1").rstrip("/")


def _openai_model() -> str:
    return os.environ.get("OPENAI_MODEL", "gpt-4o-mini").strip()


def _openai_max_tokens() -> int:
    return min(_ollama_num_predict(), 16384)


def _model_base(name: str) -> str:
    return name.split(":", 1)[0].lower()


async def _fetch_installed_model_names(client: httpx.AsyncClient, base: str) -> list[str]:
    try:
        r = await client.get(f"{base}/api/tags")
        r.raise_for_status()
        data = r.json()
        out: list[str] = []
        for m in data.get("models", []) or []:
            n = m.get("name") or m.get("model")
            if n and isinstance(n, str):
                out.append(n)
        return out
    except Exception as e:
        logger.warning("Could not list Ollama models: %s", e)
        return []


def _resolve_ollama_model(preferred: str, installed: list[str]) -> str | None:
    """
    Map a short name like 'llama3.2' to an installed tag like 'llama3.2:latest'.
    If nothing matches, return the first installed model.
    """
    if not installed:
        return None
    inst_lower = {n: n for n in installed}

    def find_for_pref(p: str) -> str | None:
        p = p.strip()
        if not p:
            return None
        if p in inst_lower:
            return inst_lower[p]
        base = _model_base(p)
        for name in installed:
            if _model_base(name) == base:
                return name
        return None

    # 1) User / default preference
    hit = find_for_pref(preferred)
    if hit:
        return hit

    # 2) Common defaults (first that exists on disk)
    for cand in (
        "llama3.2",
        "llama3.1",
        "llama3",
        "mistral",
        "qwen2.5",
        "phi3",
        "gemma2",
        "tinyllama",
    ):
        hit = find_for_pref(cand)
        if hit:
            return hit

    return installed[0]


class AIUseCaseAgent:
    """Runs analysis via Ollama (local) or an OpenAI-compatible HTTP API (cloud)."""

    async def _emit_parsed_result(self, full_response: str) -> AsyncGenerator[dict[str, Any], None]:
        yield {"type": "status", "message": "Parsing results…"}

        logger.info("Raw response length: %d chars", len(full_response))

        cleaned = full_response.strip()
        if cleaned.startswith("```json"):
            cleaned = cleaned[7:]
        if cleaned.startswith("```"):
            cleaned = cleaned[3:]
        if cleaned.endswith("```"):
            cleaned = cleaned[:-3]
        cleaned = cleaned.strip()

        result = None
        parse_error = ""

        try:
            result = json.loads(cleaned)
            logger.info("JSON parsed successfully on first attempt")
        except json.JSONDecodeError as e:
            logger.warning("Direct JSON parse failed: %s — attempting repair", e)
            parse_error = str(e)
            result = self._repair_truncated_json(cleaned)
            if result:
                logger.info("JSON repair succeeded")
            else:
                logger.error("JSON repair also failed")

        if result is None:
            cloud_hint = (
                "Try a stronger OPENAI_MODEL or increase OLLAMA_NUM_PREDICT / max output."
                if active_llm_provider() == "openai"
                else "Try a larger model (e.g. ollama pull qwen2.5:7b-instruct) or increase OLLAMA_NUM_PREDICT."
            )
            yield {
                "type": "error",
                "message": f"Could not parse model output as JSON. {parse_error} {cloud_hint}",
            }
            return

        required_keys = ["industry", "processMap", "aiUseCases"]
        missing = [k for k in required_keys if k not in result]
        if missing:
            logger.error("Result missing keys: %s", missing)
            yield {
                "type": "error",
                "message": f"Analysis incomplete — missing sections: {', '.join(missing)}. Try again or use a stronger model.",
            }
            return

        result.setdefault("executiveSummary", "")
        result.setdefault("strategicRecommendations", [])
        result.setdefault(
            "aiMaturityRoadmap",
            {
                "currentState": "Not assessed",
                "year1Goals": "To be defined",
                "year2Goals": "To be defined",
                "year3Vision": "To be defined",
            },
        )

        logger.info(
            "Delivering result: %d processes, %d use cases",
            len(result.get("processMap", [])),
            len(result.get("aiUseCases", [])),
        )
        yield {"type": "result", "data": result}

    async def _analyze_via_openai(self, prompt: str, industry_name: str) -> AsyncGenerator[dict[str, Any], None]:
        base = _openai_base()
        key = os.environ.get("OPENAI_API_KEY", "").strip()
        model = _openai_model()
        max_tokens = _openai_max_tokens()
        url = f"{base}/chat/completions"

        yield {"type": "status", "message": f"Using cloud model for {industry_name}…"}

        full_response = ""
        try:
            timeout = httpx.Timeout(600.0, connect=30.0)
            async with httpx.AsyncClient(timeout=timeout) as client:
                headers: dict[str, str] = {
                    "Authorization": f"Bearer {key}",
                    "Content-Type": "application/json",
                }
                referer = os.environ.get("OPENROUTER_HTTP_REFERER", "").strip()
                if referer:
                    headers["HTTP-Referer"] = referer
                app_name = os.environ.get("OPENROUTER_APP_NAME", "").strip()
                if app_name:
                    headers["X-Title"] = app_name

                payload: dict[str, Any] = {
                    "model": model,
                    "messages": [
                        {"role": "system", "content": SYSTEM_PROMPT},
                        {"role": "user", "content": prompt},
                    ],
                    "stream": True,
                    "temperature": 0.4,
                    "max_tokens": max_tokens,
                }

                async with client.stream("POST", url, headers=headers, json=payload) as response:
                    if response.status_code >= 400:
                        err_body = (await response.aread()).decode("utf-8", errors="replace")[:800]
                        yield {
                            "type": "error",
                            "message": f"LLM API error ({response.status_code}): {err_body}",
                        }
                        return

                    buf = ""
                    stream_done = False
                    async for text_chunk in response.aiter_text():
                        if stream_done:
                            break
                        buf += text_chunk
                        while "\n" in buf:
                            line, buf = buf.split("\n", 1)
                            line_stripped = line.strip()
                            if not line_stripped.startswith("data:"):
                                continue
                            data = line_stripped[5:].strip()
                            if data == "[DONE]":
                                stream_done = True
                                break
                            try:
                                obj = json.loads(data)
                            except json.JSONDecodeError:
                                continue
                            err = obj.get("error")
                            if err:
                                msg = err.get("message", str(err)) if isinstance(err, dict) else str(err)
                                yield {"type": "error", "message": f"LLM API: {msg}"}
                                return
                            for choice in obj.get("choices") or []:
                                delta = choice.get("delta") or {}
                                piece = delta.get("content") or ""
                                if piece:
                                    full_response += piece
                                    yield {"type": "stream", "content": piece}
                        if stream_done:
                            break
        except httpx.ConnectError:
            logger.exception("OpenAI-compatible API connection failed")
            yield {
                "type": "error",
                "message": f"Cannot reach LLM API at {base}. Check OPENAI_BASE_URL and network.",
            }
            return
        except Exception as e:
            logger.exception("OpenAI-compatible stream failed")
            yield {"type": "error", "message": str(e)}
            return

        async for ev in self._emit_parsed_result(full_response):
            yield ev

    async def analyze(
        self,
        industry_name: str,
        industry_size: str,
        additional_context: str = ""
    ) -> AsyncGenerator[dict[str, Any], None]:

        prompt = ANALYSIS_PROMPT.format(
            industry_name=industry_name,
            industry_size=industry_size,
            additional_context=f"Additional context from user: {additional_context}" if additional_context else ""
        )

        if active_llm_provider() == "openai":
            async for chunk in self._analyze_via_openai(prompt, industry_name):
                yield chunk
            return

        base = _ollama_base()
        preferred = _ollama_model()
        num_predict = _ollama_num_predict()

        yield {"type": "status", "message": f"Connecting to Ollama for {industry_name}…"}

        full_response = ""
        url = f"{base}/api/chat"

        try:
            timeout = httpx.Timeout(600.0, connect=10.0)
            async with httpx.AsyncClient(timeout=timeout) as client:
                installed = await _fetch_installed_model_names(client, base)
                if not installed:
                    yield {
                        "type": "error",
                        "message": (
                            "No models are installed in Ollama. In a terminal run:\n\n"
                            "  ollama pull llama3.2\n\n"
                            "Then try again. See https://ollama.com/library for other models."
                        ),
                    }
                    return

                model = _resolve_ollama_model(preferred, installed)
                if not model:
                    yield {
                        "type": "error",
                        "message": "Could not pick an Ollama model (unexpected).",
                    }
                    return

                if model != preferred:
                    yield {
                        "type": "status",
                        "message": f'Using installed model "{model}" (requested "{preferred}" is not available).',
                    }
                else:
                    yield {"type": "status", "message": f"Using model {model}…"}

                yield {"type": "status", "message": "Mapping industry process architecture…"}

                payload = {
                    "model": model,
                    "messages": [
                        {"role": "system", "content": SYSTEM_PROMPT},
                        {"role": "user", "content": prompt},
                    ],
                    "stream": True,
                    "options": {"num_predict": num_predict, "temperature": 0.4},
                }

                async with client.stream("POST", url, json=payload) as response:
                    if response.status_code == 404:
                        yield {
                            "type": "error",
                            "message": (
                                f'Ollama rejected model "{model}". Installed: {", ".join(installed[:8])}'
                                + ("…" if len(installed) > 8 else "")
                                + ". Set OLLAMA_MODEL in backend/.env to one of these names, or run: ollama pull llama3.2"
                            ),
                        }
                        return
                    response.raise_for_status()

                    buf = b""
                    async for chunk in response.aiter_bytes():
                        buf += chunk
                        while b"\n" in buf:
                            line, buf = buf.split(b"\n", 1)
                            line = line.strip()
                            if not line:
                                continue
                            try:
                                evt = json.loads(line.decode("utf-8", errors="replace"))
                            except json.JSONDecodeError:
                                continue
                            if evt.get("error"):
                                err_txt = str(evt["error"])
                                yield {
                                    "type": "error",
                                    "message": (
                                        f"Ollama: {err_txt}\n\n"
                                        "If the model is missing, run in a terminal:\n"
                                        "  ollama pull llama3.2\n"
                                        "List what you already have:\n"
                                        "  ollama list\n"
                                        "Then set OLLAMA_MODEL in backend/.env to an exact name from that list "
                                        "(e.g. llama3.2:latest) and restart the API."
                                    ),
                                }
                                return
                            piece = (evt.get("message") or {}).get("content") or ""
                            if piece:
                                full_response += piece
                                yield {"type": "stream", "content": piece}
        except httpx.ConnectError as e:
            logger.exception("Ollama connection failed")
            yield {
                "type": "error",
                "message": (
                    f"Cannot reach Ollama at {base}. Install Ollama from https://ollama.com, "
                    "start it, then run: ollama pull llama3.2"
                ),
            }
            return
        except httpx.HTTPStatusError as e:
            logger.exception("Ollama HTTP error")
            yield {
                "type": "error",
                "message": f"Ollama error ({e.response.status_code}): {e.response.text[:500]}",
            }
            return
        except Exception as e:
            logger.exception("Ollama stream failed")
            yield {"type": "error", "message": str(e)}
            return

        async for ev in self._emit_parsed_result(full_response):
            yield ev

    def _repair_truncated_json(self, text: str) -> dict | None:
        stack: list[str] = []
        in_string = False
        escape_next = False
        last_safe_cut = 0

        for i, ch in enumerate(text):
            if escape_next:
                escape_next = False
                continue
            if ch == "\\" and in_string:
                escape_next = True
                continue
            if ch == '"':
                in_string = not in_string
                continue
            if in_string:
                continue

            if ch in ("{", "["):
                stack.append(ch)
            elif ch in ("}", "]"):
                if stack:
                    stack.pop()
                if len(stack) == 2:
                    last_safe_cut = i + 1

        candidate = text[:last_safe_cut].rstrip().rstrip(",").rstrip()

        if not candidate:
            return None

        close_stack: list[str] = []
        in_string = False
        escape_next = False
        for ch in candidate:
            if escape_next:
                escape_next = False
                continue
            if ch == "\\" and in_string:
                escape_next = True
                continue
            if ch == '"':
                in_string = not in_string
                continue
            if in_string:
                continue
            if ch in ("{", "["):
                close_stack.append(ch)
            elif ch in ("}", "]"):
                if close_stack:
                    close_stack.pop()

        for opener in reversed(close_stack):
            candidate += "]" if opener == "[" else "}"

        try:
            return json.loads(candidate)
        except json.JSONDecodeError:
            return None
