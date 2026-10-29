import React, { createContext, useContext, useState, ReactNode } from "react";

export type ChartType = "xbar-r" | "xbar-s" | "p-chart" | null;

export interface AnalysisHistory {
  id: string;
  date: Date;
  fileName: string;
  chartType: ChartType;
  summary: {
    overallStatus: "in-control" | "out-of-control";
    inControlPercentage: number;
    issuesDetected: number;
  };
  data: SQCData;
}

export interface SQCData {
  chartType: ChartType;
  sampleData: number[][];
  defectiveData?: { defectives: number; sampleSize: number }[];
  sampleSize: number;
  numSamples: number;
  sigmaLevel: number;
  highlightOutOfControl: boolean;
  autoDetectSampleSize: boolean;
  processType?: "spinning" | "weaving" | "dyeing" | "general";
}

interface SQCContextType {
  sqcData: SQCData;
  updateSQCData: (data: Partial<SQCData>) => void;
  resetData: () => void;
  analysisHistory: AnalysisHistory[];
  addToHistory: (entry: AnalysisHistory) => void;
  clearHistory: () => void;
}

const defaultData: SQCData = {
  chartType: null,
  sampleData: [],
  defectiveData: [],
  sampleSize: 5,
  numSamples: 10,
  sigmaLevel: 3,
  highlightOutOfControl: true,
  autoDetectSampleSize: true,
  processType: "general",
};

const SQCContext = createContext<SQCContextType | undefined>(undefined);

export const SQCProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [sqcData, setSQCData] = useState<SQCData>(defaultData);
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisHistory[]>([]);

  const updateSQCData = (data: Partial<SQCData>) => {
    setSQCData((prev) => ({ ...prev, ...data }));
  };

  const resetData = () => {
    setSQCData(defaultData);
  };

  const addToHistory = (entry: AnalysisHistory) => {
    setAnalysisHistory((prev) => [entry, ...prev]);
  };

  const clearHistory = () => {
    setAnalysisHistory([]);
  };

  return (
    <SQCContext.Provider value={{ sqcData, updateSQCData, resetData, analysisHistory, addToHistory, clearHistory }}>
      {children}
    </SQCContext.Provider>
  );
};

export const useSQC = () => {
  const context = useContext(SQCContext);
  if (!context) {
    throw new Error("useSQC must be used within SQCProvider");
  }
  return context;
};
