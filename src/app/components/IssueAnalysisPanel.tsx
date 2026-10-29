import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Badge } from "./ui/badge";
import { AlertTriangle, TrendingDown, Activity } from "lucide-react";
import { Issue } from "../utils/western-electric-rules";
import { motion } from "motion/react";

interface IssueAnalysisProps {
  issues: Issue[];
}

export function IssueAnalysisPanel({ issues }: IssueAnalysisProps) {
  if (issues.length === 0) {
    return (
      <Card className="border-green-500 bg-green-50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Activity className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-xl">No Issues Detected</CardTitle>
              <CardDescription>Process is stable with no pattern violations</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-slate-700">
            All Western Electric Rules passed. The process is exhibiting normal variation within statistical control limits.
            Continue monitoring to maintain this performance.
          </p>
        </CardContent>
      </Card>
    );
  }

  const highImpact = issues.filter(i => i.impact === "High");
  const mediumImpact = issues.filter(i => i.impact === "Medium");
  const lowImpact = issues.filter(i => i.impact === "Low");

  return (
    <Card className="border-red-500 shadow-lg">
      <CardHeader className="bg-red-50 border-b">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
          </motion.div>
          <div>
            <CardTitle className="text-xl">Issue Analysis</CardTitle>
            <CardDescription>{issues.length} pattern violation(s) detected</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {highImpact.length > 0 && (
            <div>
              <h3 className="font-bold text-red-700 mb-3 flex items-center gap-2">
                <TrendingDown className="h-5 w-5" />
                High Impact Issues ({highImpact.length})
              </h3>
              <div className="space-y-3">
                {highImpact.map((issue, idx) => (
                  <IssueCard key={idx} issue={issue} />
                ))}
              </div>
            </div>
          )}

          {mediumImpact.length > 0 && (
            <div>
              <h3 className="font-bold text-orange-700 mb-3 flex items-center gap-2">
                <TrendingDown className="h-5 w-5" />
                Medium Impact Issues ({mediumImpact.length})
              </h3>
              <div className="space-y-3">
                {mediumImpact.map((issue, idx) => (
                  <IssueCard key={idx} issue={issue} />
                ))}
              </div>
            </div>
          )}

          {lowImpact.length > 0 && (
            <div>
              <h3 className="font-bold text-yellow-700 mb-3 flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Low Impact Issues ({lowImpact.length})
              </h3>
              <div className="space-y-3">
                {lowImpact.map((issue, idx) => (
                  <IssueCard key={idx} issue={issue} />
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function IssueCard({ issue }: { issue: Issue }) {
  const impactColors = {
    High: "bg-red-500",
    Medium: "bg-orange-500",
    Low: "bg-yellow-500"
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white p-4 rounded-lg border-l-4 border-red-500 shadow"
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-slate-800">{issue.rule}</h4>
        <Badge className={`${impactColors[issue.impact]} text-white`}>
          {issue.impact}
        </Badge>
      </div>
      <p className="text-sm text-slate-700 mb-2">{issue.description}</p>
      <div className="bg-slate-50 p-3 rounded mt-2">
        <p className="text-sm font-semibold text-slate-700 mb-1">Possible Cause:</p>
        <p className="text-sm text-slate-600">{issue.possibleCause}</p>
      </div>
      <div className="mt-2">
        <p className="text-xs text-slate-500">
          Affected samples: {issue.affectedSamples.slice(0, 10).join(", ")}
          {issue.affectedSamples.length > 10 && ` ... and ${issue.affectedSamples.length - 10} more`}
        </p>
      </div>
    </motion.div>
  );
}
