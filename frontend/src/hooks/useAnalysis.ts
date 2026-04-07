import { useState, useCallback } from "react";
import { apiUrl, getApiBase } from "../config";
import { normalizeAnalysisResult } from "../utils/normalizeAnalysis";
import type { AnalysisResult, AnalysisStatus } from "../types";

export interface UseAnalysisReturn {
  status: AnalysisStatus;
  result: AnalysisResult | null;
  streamText: string;
  statusMessage: string;
  error: string | null;
  analyze: (industryName: string, industrySize: string, additionalContext?: string) => Promise<void>;
  reset: () => void;
}

export function useAnalysis(): UseAnalysisReturn {
  const [status, setStatus] = useState<AnalysisStatus>("idle");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [streamText, setStreamText] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setStatus("idle");
    setResult(null);
    setStreamText("");
    setStatusMessage("");
    setError(null);
  }, []);

  const analyze = useCallback(
    async (industryName: string, industrySize: string, additionalContext = "") => {
      setStatus("loading");
      setResult(null);
      setStreamText("");
      setError(null);
      setStatusMessage("Starting analysis...");

      try {
        const healthRes = await fetch(apiUrl("/api/health"));
        if (!healthRes.ok) {
          throw new Error(`Backend not reachable (${healthRes.status}). Is uvicorn running on port 8001?`);
        }
        const health = (await healthRes.json()) as {
          llm?: string;
          engine_version?: string;
          ollama_reachable?: boolean;
          ollama_base_url?: string;
          ollama_models_installed?: number;
          ollama_models?: string[];
        };
        if (health.llm !== "ollama") {
          throw new Error(
            "Wrong API on port 8001: this UI expects the Ollama backend (health must show \"llm\": \"ollama\"). " +
              "Stop any old server (Ctrl+C), open a terminal in the project, then run:\n\n" +
              '  cd "c:\\Prashant\\Cursor\\AI Use case finder\\backend"\n' +
              "  .\\start-backend.ps1\n\n" +
              "Or: uvicorn main:app --reload --port 8001\n\n" +
              "Verify http://localhost:8001/api/health shows llm: ollama and engine_version: 2.1."
          );
        }
        if (health.engine_version !== "2.1") {
          throw new Error(
            "This UI needs the latest backend (health must include engine_version: \"2.1\"). " +
              "Restart uvicorn from the project backend folder on port 8001."
          );
        }
        if (health.ollama_reachable === false) {
          const base = health.ollama_base_url ?? "http://127.0.0.1:11434";
          throw new Error(
            "Cannot reach Ollama. Open the Ollama app so it is running in the background, then run:\n\n" +
              "  ollama pull llama3.2\n\n" +
              `The API is using OLLAMA_BASE_URL=${base}. If Ollama runs elsewhere, set that in backend/.env and restart the API.`
          );
        }
        if (health.ollama_reachable && (health.ollama_models_installed ?? 0) === 0) {
          throw new Error(
            "Ollama is running but no models are installed.\n\n" +
              "In PowerShell run:\n  ollama pull llama3.2\n\n" +
              "Then confirm with:\n  ollama list"
          );
        }

        const response = await fetch(apiUrl("/api/analyze"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            industry_name: industryName,
            industry_size: industrySize,
            additional_context: additionalContext,
          }),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.detail || `Server error: ${response.status}`);
        }

        if (!response.body) throw new Error("No response body");

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let doneReceived = false;
        let streamDeliveredResult = false;

        while (!doneReceived) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const data = line.slice(6).trim();
            if (data === "[DONE]") {
              doneReceived = true;
              break;
            }

            let parsed: unknown;
            try {
              parsed = JSON.parse(data);
            } catch (parseErr) {
              // Skip malformed SSE chunks
              continue;
            }

            if (typeof parsed !== "object" || parsed === null || !("type" in parsed)) {
              continue;
            }

            const event = parsed as {
              type: string;
              message?: string;
              content?: string;
              data?: AnalysisResult;
            };

            if (event.type === "status") {
              setStatusMessage(event.message ?? "");
            } else if (event.type === "stream") {
              setStreamText((prev: string) => prev + (event.content ?? ""));
            } else if (event.type === "result") {
              if (event.data) {
                streamDeliveredResult = true;
                setResult(normalizeAnalysisResult(event.data));
                setStatus("success");
              } else {
                throw new Error("Analysis completed but returned no data. Please try again.");
              }
            } else if (event.type === "error") {
              throw new Error(event.message || "Analysis failed");
            }
          }
        }
        // Avoid clobbering success: React may not have flushed setStatus("success") yet, so use a flag
        if (!streamDeliveredResult) {
          setStatus((prev) => {
            if (prev === "loading") {
              setError("Analysis stream ended without delivering results. Please try again.");
              return "error";
            }
            return prev;
          });
        }
      } catch (err) {
        let msg = err instanceof Error ? err.message : "An unexpected error occurred";
        const isNetworkFail =
          /failed to fetch|networkerror|load failed/i.test(msg) || err instanceof TypeError;
        if (isNetworkFail) {
          const base = getApiBase();
          const parts = [
            "The browser could not reach the API (offline server, wrong URL, CORS, or blocked mixed content).",
          ];
          if (typeof window !== "undefined" && window.location.protocol === "https:") {
            parts.push(
              "Pages on https cannot call http:// APIs. Set VITE_API_URL to an https:// API origin in Vercel and redeploy."
            );
          }
          if (!base) {
            parts.push(
              "VITE_API_URL is not set in this build. In Vercel → Settings → Environment Variables, set it to your public API origin only (e.g. https://xxx.up.railway.app), then redeploy."
            );
          } else {
            parts.push(`This build uses API base: ${base}`);
            parts.push(`Test in a new tab: ${base}/api/health — it should return JSON.`);
          }
          msg = parts.join("\n\n");
        }
        if (/claude|anthropic|not_found_error.*model/i.test(msg)) {
          msg +=
            "\n\nThis error comes from Anthropic (Claude), not Ollama. An old backend is still running — see the message above about restarting uvicorn from backend/.";
        }
        setError(msg);
        setStatus("error");
      }
    },
    []
  );

  return { status, result, streamText, statusMessage, error, analyze, reset };
}