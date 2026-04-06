import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Download, FileJson, FileText, Loader2, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { AnalysisResult } from "../types";
import PrintView from "./PrintView";
import { usePrint } from "../hooks/usePrint";

interface ExportButtonProps {
  result: AnalysisResult;
}

export default function ExportButton({ result }: ExportButtonProps) {
  const [open, setOpen] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const printContainerRef = useRef<HTMLDivElement>(null);
  const { exportPDF } = usePrint();

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleExportJSON = () => {
    setOpen(false);
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ai-use-cases-${result.industry.name.toLowerCase().replace(/\s+/g, "-")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    setOpen(false);
    setPdfLoading(true);

    // Allow React to render the hidden PrintView, then trigger print
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const container = printContainerRef.current;
        if (container) {
          exportPDF(result, container);
        }
        // Reset loading state after a brief delay
        setTimeout(() => setPdfLoading(false), 1500);
      });
    });
  };

  // Hidden print container — always rendered so the DOM is ready
  const printPortal = createPortal(
    <div
      ref={printContainerRef}
      style={{ position: "absolute", top: -99999, left: -99999, width: 900, pointerEvents: "none" }}
      aria-hidden="true"
    >
      <PrintView result={result} />
    </div>,
    document.body
  );

  return (
    <>
      {printPortal}

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setOpen(v => !v)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg glass-card text-slate-400 hover:text-white hover:bg-white/8 transition-all text-sm font-medium"
          title="Export analysis"
        >
          {pdfLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          <span className="hidden sm:inline">Export</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-52 glass-card rounded-xl overflow-hidden shadow-2xl border border-white/12 z-50"
            >
              <div className="p-1">
                <button
                  onClick={handleExportPDF}
                  disabled={pdfLoading}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/8 transition-colors text-left disabled:opacity-50"
                >
                  <div className="w-7 h-7 rounded-lg bg-rose-500/15 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-3.5 h-3.5 text-rose-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">Download PDF</div>
                    <div className="text-xs text-slate-500">Full report, all sections</div>
                  </div>
                </button>

                <button
                  onClick={handleExportJSON}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/8 transition-colors text-left"
                >
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/15 flex items-center justify-center flex-shrink-0">
                    <FileJson className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">Download JSON</div>
                    <div className="text-xs text-slate-500">Raw data for integrations</div>
                  </div>
                </button>
              </div>

              <div className="px-4 py-2 border-t border-white/8">
                <p className="text-xs text-slate-600">
                  PDF: browser opens print dialog → Save as PDF
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
