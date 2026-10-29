import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { History, FileText, CheckCircle2, XCircle, Trash2, Eye } from "lucide-react";
import { AnalysisHistory } from "../context/SQCContext";
import { motion } from "motion/react";
import { format } from "date-fns";
import { Alert, AlertDescription } from "./ui/alert";

interface HistoryDashboardProps {
  history: AnalysisHistory[];
  onClearHistory: () => void;
  onViewAnalysis?: (entry: AnalysisHistory) => void;
}

export function HistoryDashboard({ history, onClearHistory, onViewAnalysis }: HistoryDashboardProps) {
  if (history.length === 0) {
    return (
      <Card className="border-slate-300">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
              <History className="h-6 w-6 text-slate-400" />
            </div>
            <div>
              <CardTitle className="text-xl">Analysis History</CardTitle>
              <CardDescription>No previous analyses found</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-slate-500">
            <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Your analysis history will appear here</p>
            <p className="text-sm mt-1">Complete an analysis to start building your history</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-300 shadow-lg">
      <CardHeader className="bg-slate-50 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <History className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">Analysis History</CardTitle>
              <CardDescription>{history.length} previous analysis</CardDescription>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onClearHistory}
            className="text-red-600 border-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-3">
          {history.map((entry, idx) => (
            <HistoryCard
              key={entry.id}
              entry={entry}
              index={idx}
              onView={onViewAnalysis}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function HistoryCard({ entry, index, onView }: { entry: AnalysisHistory; index: number; onView?: (entry: AnalysisHistory) => void }) {
  const chartTypeLabels = {
    "xbar-r": "X-bar & R Chart",
    "xbar-s": "X-bar & S Chart",
    "p-chart": "p Chart"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`bg-white p-4 rounded-lg border-2 shadow ${
        entry.summary.overallStatus === "in-control"
          ? "border-green-200 hover:border-green-400"
          : "border-red-200 hover:border-red-400"
      } transition-all cursor-pointer`}
      onClick={() => onView?.(entry)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {entry.summary.overallStatus === "in-control" ? (
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
          ) : (
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="h-5 w-5 text-red-600" />
            </div>
          )}
          <div>
            <h4 className="font-semibold text-slate-800">{entry.fileName}</h4>
            <p className="text-xs text-slate-500">
              {format(new Date(entry.date), "PPpp")}
            </p>
          </div>
        </div>
        <Badge
          variant={entry.summary.overallStatus === "in-control" ? "default" : "destructive"}
          className={entry.summary.overallStatus === "in-control" ? "bg-green-600" : ""}
        >
          {entry.summary.overallStatus === "in-control" ? "In Control" : "Out of Control"}
        </Badge>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-3">
        <div className="bg-slate-50 p-2 rounded">
          <p className="text-xs text-slate-600 mb-1">Chart Type</p>
          <p className="text-sm font-semibold text-slate-800">
            {entry.chartType ? chartTypeLabels[entry.chartType] : "N/A"}
          </p>
        </div>
        <div className="bg-green-50 p-2 rounded">
          <p className="text-xs text-slate-600 mb-1">In Control</p>
          <p className="text-sm font-semibold text-green-700">
            {entry.summary.inControlPercentage.toFixed(1)}%
          </p>
        </div>
        <div className="bg-red-50 p-2 rounded">
          <p className="text-xs text-slate-600 mb-1">Issues</p>
          <p className="text-sm font-semibold text-red-700">
            {entry.summary.issuesDetected}
          </p>
        </div>
      </div>

      {onView && (
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={(e) => {
            e.stopPropagation();
            onView(entry);
          }}
        >
          <Eye className="h-4 w-4 mr-2" />
          View Details
        </Button>
      )}
    </motion.div>
  );
}
