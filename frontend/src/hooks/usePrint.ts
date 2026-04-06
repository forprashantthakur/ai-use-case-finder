import { useCallback, useRef } from "react";
import type { AnalysisResult } from "../types";

export function usePrint() {
  const frameRef = useRef<HTMLIFrameElement | null>(null);

  const exportPDF = useCallback((result: AnalysisResult, rootElement: HTMLElement) => {
    // Build a self-contained HTML document for the print iframe
    // We grab the rendered PrintView HTML + all stylesheets
    const printContainer = rootElement.querySelector("#print-view");
    if (!printContainer) return;

    const html = printContainer.innerHTML;

    // Collect all <style> and <link rel="stylesheet"> from the parent
    const styleNodes = Array.from(document.querySelectorAll("style, link[rel='stylesheet']"))
      .map(node => node.outerHTML)
      .join("\n");

    const printDoc = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>AI Use Case Analysis — ${result.industry.name}</title>
  ${styleNodes}
  <style>
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    body { margin: 0; padding: 0; background: #fff; }
    @page { size: A4; margin: 0; }
  </style>
</head>
<body>
  ${html}
</body>
</html>`;

    // Create/reuse a hidden iframe
    if (!frameRef.current) {
      const iframe = document.createElement("iframe");
      iframe.style.position = "fixed";
      iframe.style.top = "-9999px";
      iframe.style.left = "-9999px";
      iframe.style.width = "210mm";
      iframe.style.height = "297mm";
      iframe.style.border = "none";
      document.body.appendChild(iframe);
      frameRef.current = iframe;
    }

    const frame = frameRef.current;
    const frameDoc = frame.contentDocument || frame.contentWindow?.document;
    if (!frameDoc) return;

    frameDoc.open();
    frameDoc.write(printDoc);
    frameDoc.close();

    // Wait for fonts/images to load then print
    frame.onload = () => {
      setTimeout(() => {
        frame.contentWindow?.focus();
        frame.contentWindow?.print();
      }, 300);
    };
  }, []);

  return { exportPDF };
}
