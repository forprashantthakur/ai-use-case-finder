import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HomePage from "./pages/Home";
import AnalysisPage from "./pages/Analysis";
import { useAnalysis } from "./hooks/useAnalysis";

export default function App() {
  const [submitted, setSubmitted] = useState(false);
  const [industryName, setIndustryName] = useState("");
  const [industrySize, setIndustrySize] = useState("");
  const analysis = useAnalysis();

  const handleSubmit = (name: string, size: string, context?: string) => {
    setIndustryName(name);
    setIndustrySize(size);
    setSubmitted(true);
    analysis.analyze(name, size, context);
  };

  const handleReset = () => {
    setSubmitted(false);
    setIndustryName("");
    setIndustrySize("");
    analysis.reset();
  };

  return (
    <div className="min-h-screen bg-[#0a0a18]">
      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <HomePage onSubmit={handleSubmit} />
          </motion.div>
        ) : (
          <motion.div
            key="analysis"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <AnalysisPage
              industryName={industryName}
              industrySize={industrySize}
              analysis={analysis}
              onReset={handleReset}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
