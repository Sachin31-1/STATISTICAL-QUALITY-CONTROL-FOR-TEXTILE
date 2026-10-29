import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Download, FileSpreadsheet, TrendingUp, CheckCircle2, XCircle, Info } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useSQC } from "../context/SQCContext";
import { calculateXbarR, calculateXbarS, calculatePChart, XbarRResults, XbarSResults, PChartResults } from "../utils/sqc-calculations";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { toast } from "sonner";
import { detectIssues, Issue } from "../utils/western-electric-rules";
import { generateTextileRecommendations, Recommendation } from "../utils/recommendations-engine";
import { IssueAnalysisPanel } from "../components/IssueAnalysisPanel";
import { RecommendationsPanel } from "../components/RecommendationsPanel";
import { BlendOptimizationPanel } from "../components/BlendOptimizationPanel";
import { HistoryDashboard } from "../components/HistoryDashboard";

export function Results() {
  const navigate = useNavigate();
  const { sqcData, addToHistory, analysisHistory, clearHistory } = useSQC();
  const [activeTab, setActiveTab] = useState("charts");

  // Calculate results based on chart type
  let xbarRResults: XbarRResults | null = null;
  let xbarSResults: XbarSResults | null = null;
  let pChartResults: PChartResults | null = null;
  let issues: Issue[] = [];
  let recommendations: Recommendation[] = [];

  if (sqcData.chartType === "xbar-r" && sqcData.sampleData.length > 0) {
    xbarRResults = calculateXbarR(sqcData.sampleData, sqcData.sigmaLevel);
    const xbarIssues = detectIssues(xbarRResults.xbarData, "X-bar");
    const rIssues = detectIssues(xbarRResults.rData, "R");
    issues = [...xbarIssues, ...rIssues];
  } else if (sqcData.chartType === "xbar-s" && sqcData.sampleData.length > 0) {
    xbarSResults = calculateXbarS(sqcData.sampleData, sqcData.sigmaLevel);
    const xbarIssues = detectIssues(xbarSResults.xbarData, "X-bar");
    const sIssues = detectIssues(xbarSResults.sData, "S");
    issues = [...xbarIssues, ...sIssues];
  } else if (sqcData.chartType === "p-chart" && sqcData.defectiveData && sqcData.defectiveData.length > 0) {
    pChartResults = calculatePChart(sqcData.defectiveData, sqcData.sigmaLevel);
    issues = detectIssues(pChartResults.pData, "p");
  }

  const results = xbarRResults || xbarSResults || pChartResults;

  // Generate recommendations
  if (issues.length > 0) {
    recommendations = generateTextileRecommendations(issues, sqcData.processType || "general");
  } else {
    recommendations = generateTextileRecommendations([], sqcData.processType || "general");
  }

  // Save to history on mount
  useEffect(() => {
    if (results) {
      addToHistory({
        id: Date.now().toString(),
        date: new Date(),
        fileName: `Analysis_${new Date().toISOString().split('T')[0]}`,
        chartType: sqcData.chartType,
        summary: {
          overallStatus: results.overallStatus,
          inControlPercentage: results.inControlPercentage,
          issuesDetected: issues.length
        },
        data: sqcData
      });
    }
  }, []);

  if (!results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>No Data Available</CardTitle>
            <CardDescription>Please go back and enter your data first.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/data-input")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go to Data Input
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleDownloadReport = () => {
    toast.success("Opening print dialog for PDF export...");
    window.print();
  };

  const handleExportData = () => {
    try {
      let csvContent = "data:text/csv;charset=utf-8,";
      if (xbarRResults) {
        csvContent += "Sample,X-bar Value,X-bar UCL,X-bar CL,X-bar LCL,X-bar Status,R Value,R UCL,R CL,R LCL,R Status\n";
        xbarRResults.xbarData.forEach((d, i) => {
          const r = xbarRResults!.rData[i];
          csvContent += `${d.sample},${d.value},${d.ucl},${d.cl},${d.lcl},${d.outOfControl ? "Out of Control" : "In Control"},${r?.value ?? ""},${r?.ucl ?? ""},${r?.cl ?? ""},${r?.lcl ?? ""},${r?.outOfControl ? "Out of Control" : "In Control"}\n`;
        });
      } else if (xbarSResults) {
        csvContent += "Sample,X-bar Value,X-bar UCL,X-bar CL,X-bar LCL,X-bar Status,S Value,S UCL,S CL,S LCL,S Status\n";
        xbarSResults.xbarData.forEach((d, i) => {
          const s = xbarSResults!.sData[i];
          csvContent += `${d.sample},${d.value},${d.ucl},${d.cl},${d.lcl},${d.outOfControl ? "Out of Control" : "In Control"},${s?.value ?? ""},${s?.ucl ?? ""},${s?.cl ?? ""},${s?.lcl ?? ""},${s?.outOfControl ? "Out of Control" : "In Control"}\n`;
        });
      } else if (pChartResults) {
        csvContent += "Sample,Proportion,UCL,CL,LCL,Status\n";
        pChartResults.pData.forEach((d) => {
          csvContent += `${d.sample},${d.value},${d.ucl},${d.cl},${d.lcl},${d.outOfControl ? "Out of Control" : "In Control"}\n`;
        });
      }
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `sqc_analysis_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Data exported successfully!");
    } catch {
      toast.error("Failed to export data");
    }
  };

  // Custom dot component
  const CustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    if (sqcData.highlightOutOfControl && payload.outOfControl) {
      return (
        <g>
          <motion.circle
            cx={cx}
            cy={cy}
            r={12}
            fill="none"
            stroke="#ef4444"
            strokeWidth={2}
            initial={{ opacity: 0.8, scale: 1 }}
            animate={{ opacity: 0, scale: 1.8 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }}
          />
          <circle cx={cx} cy={cy} r={6} fill="#ef4444" stroke="#dc2626" strokeWidth={2} />
        </g>
      );
    }
    return <circle cx={cx} cy={cy} r={4} fill="#10b981" stroke="#059669" strokeWidth={1.5} />;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const point = payload[0].payload;
      return (
        <div className={`bg-white p-3 border-2 rounded-lg shadow-xl ${point.outOfControl ? "border-red-500" : "border-green-500"}`}>
          <p className="font-bold text-slate-800 mb-1">Sample {label}</p>
          <p className="text-sm">Value: <span className="font-semibold text-blue-600">{point.value.toFixed(4)}</span></p>
          <Badge variant={point.outOfControl ? "destructive" : "default"} className={!point.outOfControl ? "bg-green-600 mt-2" : "mt-2"}>
            {point.outOfControl ? "⚠️ Out of Control" : "✓ In Control"}
          </Badge>
        </div>
      );
    }
    return null;
  };

  const CustomLabel = ({ viewBox, value, label }: any) => {
    const { x, y, width } = viewBox;
    return (
      <text x={x + width + 10} y={y} fill="#475569" fontSize={12} fontWeight="600" textAnchor="start">
        {label}: {value.toFixed(4)}
      </text>
    );
  };

  const renderChart = (data: any[], title: string, description: string, color: string, yLabel: string) => {
    const isPurple = color === "purple";
    const bgBadge = isPurple ? "bg-purple-100" : "bg-emerald-100";
    const textBadge = isPurple ? "text-purple-600" : "text-emerald-600";
    const lineColor = isPurple ? "#8b5cf6" : "#10b981";

    return (
      <Card className="shadow-lg">
        <CardHeader className="border-b bg-slate-50">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 ${bgBadge} rounded-lg flex items-center justify-center`}>
              <TrendingUp className={`h-6 w-6 ${textBadge}`} />
            </div>
            <div>
              <CardTitle className="text-xl">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data} margin={{ top: 20, right: 120, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="sample" label={{ value: "Sample Number", position: "insideBottom", offset: -10 }} stroke="#64748b" />
              <YAxis label={{ value: yLabel, angle: -90, position: "insideLeft" }} stroke="#64748b" domain={['auto', 'auto']} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={data[0]?.ucl} stroke="#ef4444" strokeDasharray="8 4" strokeWidth={2.5} label={<CustomLabel value={data[0]?.ucl} label="UCL" />} />
              <ReferenceLine y={data[0]?.cl} stroke="#3b82f6" strokeWidth={2.5} label={<CustomLabel value={data[0]?.cl} label="CL" />} />
              <ReferenceLine y={data[0]?.lcl} stroke="#ef4444" strokeDasharray="8 4" strokeWidth={2.5} label={<CustomLabel value={data[0]?.lcl} label="LCL" />} />
              <Line type="monotone" dataKey="value" stroke={lineColor} strokeWidth={2.5} dot={<CustomDot />} isAnimationActive animationDuration={1500} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <Button variant="ghost" onClick={() => navigate("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleDownloadReport} className="border-blue-500 text-blue-600 hover:bg-blue-50">
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
            <Button variant="outline" onClick={handleExportData} className="border-green-500 text-green-600 hover:bg-green-50">
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Export Data
            </Button>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Smart Quality Analysis Dashboard</h1>
          <p className="text-lg text-slate-600">
            {sqcData.chartType === "xbar-r" ? "X-bar & R Chart" : sqcData.chartType === "xbar-s" ? "X-bar & S Chart" : "p Chart"} Analysis • {sqcData.sigmaLevel}σ Limits
          </p>
        </motion.div>

        {/* Overall Status Card */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-8">
          <Card className={`border-2 shadow-lg ${results.overallStatus === "in-control" ? "border-green-500 bg-gradient-to-br from-green-50 to-emerald-50" : "border-red-500 bg-gradient-to-br from-red-50 to-orange-50"}`}>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 shadow">
                  <div className="flex items-center gap-2 mb-2">
                    {results.overallStatus === "in-control" ? <CheckCircle2 className="h-5 w-5 text-green-600" /> : <XCircle className="h-5 w-5 text-red-600" />}
                    <h3 className="font-semibold text-slate-700">Status</h3>
                  </div>
                  <Badge variant={results.overallStatus === "in-control" ? "default" : "destructive"} className={results.overallStatus === "in-control" ? "bg-green-600" : ""}>
                    {results.overallStatus === "in-control" ? "In Control" : "Out of Control"}
                  </Badge>
                </div>
                <div className="bg-white rounded-xl p-4 shadow">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold text-slate-700">Confidence</h3>
                  </div>
                  <p className="text-3xl font-bold text-blue-600">{results.confidenceLevel}%</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <h3 className="font-semibold text-slate-700">In Control</h3>
                  </div>
                  <p className="text-3xl font-bold text-green-600">{results.inControlPercentage.toFixed(1)}%</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow">
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle className="h-5 w-5 text-red-600" />
                    <h3 className="font-semibold text-slate-700">Issues</h3>
                  </div>
                  <p className="text-3xl font-bold text-red-600">{issues.length}</p>
                </div>
              </div>
              <div className="mt-4">
                <Progress value={results.inControlPercentage} className="h-3" indicatorClassName={results.overallStatus === "in-control" ? "bg-green-500" : "bg-red-500"} />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="charts">Charts</TabsTrigger>
            <TabsTrigger value="issues">Issues ({issues.length})</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="blend">Blend Optimization</TabsTrigger>
            <TabsTrigger value="history">History ({analysisHistory.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="charts" className="space-y-6">
            {xbarRResults && (
              <>
                {renderChart(xbarRResults.xbarData, "X-bar Chart", "Process mean over time", "purple", "X-bar Value")}
                {renderChart(xbarRResults.rData, "R Chart", "Process variation over time", "green", "Range Value")}
              </>
            )}
            {xbarSResults && (
              <>
                {renderChart(xbarSResults.xbarData, "X-bar Chart", "Process mean over time", "purple", "X-bar Value")}
                {renderChart(xbarSResults.sData, "S Chart", "Standard deviation over time", "green", "Std Dev Value")}
              </>
            )}
            {pChartResults && renderChart(pChartResults.pData, "p Chart", "Proportion defective over time", "green", "Proportion")}
          </TabsContent>

          <TabsContent value="issues">
            <IssueAnalysisPanel issues={issues} />
          </TabsContent>

          <TabsContent value="recommendations">
            <RecommendationsPanel recommendations={recommendations} />
          </TabsContent>

          <TabsContent value="blend">
            <BlendOptimizationPanel />
          </TabsContent>

          <TabsContent value="history">
            <HistoryDashboard history={analysisHistory} onClearHistory={clearHistory} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
