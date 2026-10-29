import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Download, FileSpreadsheet, RefreshCw, CheckCircle2, XCircle, Info, TrendingUp } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { useSQC } from "../context/SQCContext";
import { calculateXbarR, calculatePChart, XbarRResults, PChartResults } from "../utils/sqc-calculations";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Dot } from "recharts";
import { toast } from "sonner";
import { ChartLegend } from "../components/ChartLegend";

export function Results() {
  const navigate = useNavigate();
  const { sqcData } = useSQC();

  // Calculate results based on chart type
  let xbarRResults: XbarRResults | null = null;
  let pChartResults: PChartResults | null = null;

  if (sqcData.chartType === "xbar-r" && sqcData.sampleData.length > 0) {
    xbarRResults = calculateXbarR(sqcData.sampleData, sqcData.sigmaLevel);
  } else if (sqcData.chartType === "p-chart" && sqcData.defectiveData && sqcData.defectiveData.length > 0) {
    pChartResults = calculatePChart(sqcData.defectiveData, sqcData.sigmaLevel);
  }

  const results = xbarRResults || pChartResults;

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
    toast.success("Report downloaded successfully! (Demo)");
  };

  const handleExportData = () => {
    toast.success("Data exported successfully! (Demo)");
  };

  // Custom dot component for out-of-control points with pulse animation
  const CustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    
    if (sqcData.highlightOutOfControl && payload.outOfControl) {
      return (
        <g>
          {/* Pulsing ring */}
          <motion.circle
            cx={cx}
            cy={cy}
            r={12}
            fill="none"
            stroke="#ef4444"
            strokeWidth={2}
            initial={{ opacity: 0.8, scale: 1 }}
            animate={{ opacity: 0, scale: 1.8 }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              ease: "easeOut"
            }}
          />
          {/* Main dot */}
          <circle
            cx={cx}
            cy={cy}
            r={6}
            fill="#ef4444"
            stroke="#dc2626"
            strokeWidth={2}
            filter="url(#glow)"
          />
        </g>
      );
    }
    
    return (
      <circle
        cx={cx}
        cy={cy}
        r={4}
        fill="#10b981"
        stroke="#059669"
        strokeWidth={1.5}
      />
    );
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const point = payload[0].payload;
      const isOutOfControl = point.outOfControl;
      
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`bg-white p-4 border-2 rounded-lg shadow-xl ${
            isOutOfControl ? "border-red-500" : "border-green-500"
          }`}
        >
          <p className="font-bold text-slate-800 mb-2 text-base">Sample {label}</p>
          <div className="space-y-1">
            <p className="text-sm text-slate-600">
              Value: <span className="font-semibold text-blue-600">{point.value.toFixed(4)}</span>
            </p>
            <p className="text-sm text-slate-600">
              UCL: <span className="font-semibold">{point.ucl.toFixed(4)}</span>
            </p>
            <p className="text-sm text-slate-600">
              CL: <span className="font-semibold">{point.cl.toFixed(4)}</span>
            </p>
            <p className="text-sm text-slate-600">
              LCL: <span className="font-semibold">{point.lcl.toFixed(4)}</span>
            </p>
          </div>
          <div className="mt-2 pt-2 border-t">
            <Badge
              variant={isOutOfControl ? "destructive" : "default"}
              className={!isOutOfControl ? "bg-green-600" : ""}
            >
              {isOutOfControl ? "⚠️ Out of Control" : "✓ In Control"}
            </Badge>
          </div>
        </motion.div>
      );
    }
    return null;
  };

  // Custom label component for control limits
  const CustomLabel = ({ viewBox, value, label }: any) => {
    const { x, y, width } = viewBox;
    return (
      <text
        x={x + width + 10}
        y={y}
        fill="#475569"
        fontSize={12}
        fontWeight="600"
        textAnchor="start"
      >
        {label}: {value.toFixed(4)}
      </text>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100">
      {/* SVG Filter for glow effect */}
      <svg width="0" height="0">
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
      </svg>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleDownloadReport}
              className="border-blue-500 text-blue-600 hover:bg-blue-50"
            >
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
            <Button
              variant="outline"
              onClick={handleExportData}
              className="border-green-500 text-green-600 hover:bg-green-50"
            >
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Export Data
            </Button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            Analysis Results
          </h1>
          <p className="text-lg text-slate-600">
            {sqcData.chartType === "xbar-r" ? "X-bar & R Chart Analysis" : "p Chart Analysis"}
            {" • "}
            <span className="font-semibold">
              {sqcData.sigmaLevel}σ Control Limits ({results.confidenceLevel}% Confidence)
            </span>
          </p>
        </motion.div>

        {/* Overall Process Significance - Enhanced */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8"
        >
          <Card className={`border-2 shadow-lg ${
            results.overallStatus === "in-control" 
              ? "border-green-500 bg-gradient-to-br from-green-50 to-emerald-50" 
              : "border-red-500 bg-gradient-to-br from-red-50 to-orange-50"
          }`}>
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <motion.div
                    animate={results.overallStatus === "out-of-control" ? {
                      scale: [1, 1.1, 1],
                    } : {}}
                    transition={{
                      repeat: results.overallStatus === "out-of-control" ? Infinity : 0,
                      duration: 1.5,
                    }}
                  >
                    {results.overallStatus === "in-control" ? (
                      <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                        <CheckCircle2 className="h-10 w-10 text-white" />
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                        <XCircle className="h-10 w-10 text-white" />
                      </div>
                    )}
                  </motion.div>
                  <div>
                    <CardTitle className="text-2xl mb-1">Overall Process Significance</CardTitle>
                    <CardDescription className="text-base">
                      Statistical process control analysis summary
                    </CardDescription>
                  </div>
                </div>
                <Badge
                  variant={results.overallStatus === "in-control" ? "default" : "destructive"}
                  className={`text-base px-6 py-2 ${
                    results.overallStatus === "in-control" 
                      ? "bg-green-600 hover:bg-green-700" 
                      : ""
                  }`}
                >
                  {results.overallStatus === "in-control" 
                    ? "✓ Process In Control" 
                    : "⚠ Process Out of Control"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-xl p-5 shadow-md border border-slate-200"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Info className="h-5 w-5 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-slate-700">Confidence Level</h3>
                  </div>
                  <p className="text-4xl font-bold text-blue-600 mb-1">
                    {results.confidenceLevel}%
                  </p>
                  <p className="text-sm text-slate-600">
                    Based on {sqcData.sigmaLevel}σ control limits
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white rounded-xl p-5 shadow-md border border-slate-200"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-slate-700">In-Control Points</h3>
                  </div>
                  <p className="text-4xl font-bold text-green-600 mb-1">
                    {results.inControlPercentage.toFixed(1)}%
                  </p>
                  <p className="text-sm text-slate-600">
                    Points within control limits
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white rounded-xl p-5 shadow-md border border-slate-200"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <XCircle className="h-5 w-5 text-red-600" />
                    </div>
                    <h3 className="font-semibold text-slate-700">Out-of-Control Points</h3>
                  </div>
                  <p className="text-4xl font-bold text-red-600 mb-1">
                    {(100 - results.inControlPercentage).toFixed(1)}%
                  </p>
                  <p className="text-sm text-slate-600">
                    Points outside control limits
                  </p>
                </motion.div>
              </div>

              {/* Process Stability Progress Bar */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mb-6 p-5 bg-white rounded-xl shadow-md border border-slate-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    Process Stability Index
                  </h3>
                  <span className="text-2xl font-bold text-slate-700">
                    {results.inControlPercentage.toFixed(1)}%
                  </span>
                </div>
                <Progress 
                  value={results.inControlPercentage} 
                  className="h-4"
                  indicatorClassName={results.overallStatus === "in-control" ? "bg-green-500" : "bg-red-500"}
                />
                <div className="flex justify-between text-xs text-slate-500 mt-2">
                  <span>Unstable (0%)</span>
                  <span>Target (100%)</span>
                </div>
              </motion.div>

              {/* Insight Text */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className={`p-5 bg-white rounded-xl border-l-4 ${
                  results.overallStatus === "in-control" 
                    ? "border-green-500" 
                    : "border-red-500"
                } shadow-md`}
              >
                <h3 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
                  <Info className="h-5 w-5 text-blue-600" />
                  Statistical Insight
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  {results.overallStatus === "in-control" ? (
                    <>
                      <span className="font-bold text-green-600">{results.inControlPercentage.toFixed(1)}%</span> of samples fall within the established control limits.
                      The process demonstrates <span className="font-semibold">statistical stability and predictability</span>.
                      Continue routine monitoring to maintain these quality standards. The {results.confidenceLevel}% confidence level
                      indicates a robust control system.
                    </>
                  ) : (
                    <>
                      <span className="font-bold text-red-600">{(100 - results.inControlPercentage).toFixed(1)}%</span> of samples exceed control limits,
                      indicating <span className="font-semibold">special cause variation</span> in the process.
                      <span className="font-bold"> Immediate investigation required.</span> Review recent process changes,
                      operator procedures, material quality, and equipment calibration. Take corrective action before continuing production.
                    </>
                  )}
                </p>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Charts */}
        {xbarRResults && (
          <>
            {/* X-bar Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mb-6"
            >
              <Card className="shadow-lg">
                <CardHeader className="border-b bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">X-bar Chart (Process Mean)</CardTitle>
                      <CardDescription className="text-sm">
                        Monitors the central tendency of the process over time
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9, duration: 1 }}
                  >
                    <ResponsiveContainer width="100%" height={450}>
                      <LineChart data={xbarRResults.xbarData} margin={{ top: 20, right: 120, left: 20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis
                          dataKey="sample"
                          label={{ value: "Sample Number", position: "insideBottom", offset: -10, style: { fontWeight: 600 } }}
                          stroke="#64748b"
                        />
                        <YAxis
                          label={{ value: "X-bar Value (Process Mean)", angle: -90, position: "insideLeft", style: { fontWeight: 600 } }}
                          stroke="#64748b"
                          domain={['auto', 'auto']}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <ReferenceLine
                          y={xbarRResults.xbarUCL}
                          stroke="#ef4444"
                          strokeDasharray="8 4"
                          strokeWidth={2.5}
                          label={<CustomLabel value={xbarRResults.xbarUCL} label="UCL" />}
                        />
                        <ReferenceLine
                          y={xbarRResults.xbarCL}
                          stroke="#3b82f6"
                          strokeWidth={2.5}
                          label={<CustomLabel value={xbarRResults.xbarCL} label="CL" />}
                        />
                        <ReferenceLine
                          y={xbarRResults.xbarLCL}
                          stroke="#ef4444"
                          strokeDasharray="8 4"
                          strokeWidth={2.5}
                          label={<CustomLabel value={xbarRResults.xbarLCL} label="LCL" />}
                        />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="#8b5cf6"
                          strokeWidth={2.5}
                          dot={<CustomDot />}
                          name="Sample Mean"
                          isAnimationActive={true}
                          animationDuration={1500}
                          animationEasing="ease-in-out"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>

            {/* R Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="mb-6"
            >
              <Card className="shadow-lg">
                <CardHeader className="border-b bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">R Chart (Process Variation)</CardTitle>
                      <CardDescription className="text-sm">
                        Monitors the range and variability within samples
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.0, duration: 1 }}
                  >
                    <ResponsiveContainer width="100%" height={450}>
                      <LineChart data={xbarRResults.rData} margin={{ top: 20, right: 120, left: 20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis
                          dataKey="sample"
                          label={{ value: "Sample Number", position: "insideBottom", offset: -10, style: { fontWeight: 600 } }}
                          stroke="#64748b"
                        />
                        <YAxis
                          label={{ value: "Range Value (R)", angle: -90, position: "insideLeft", style: { fontWeight: 600 } }}
                          stroke="#64748b"
                          domain={['auto', 'auto']}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <ReferenceLine
                          y={xbarRResults.rUCL}
                          stroke="#ef4444"
                          strokeDasharray="8 4"
                          strokeWidth={2.5}
                          label={<CustomLabel value={xbarRResults.rUCL} label="UCL" />}
                        />
                        <ReferenceLine
                          y={xbarRResults.rCL}
                          stroke="#3b82f6"
                          strokeWidth={2.5}
                          label={<CustomLabel value={xbarRResults.rCL} label="CL" />}
                        />
                        <ReferenceLine
                          y={xbarRResults.rLCL}
                          stroke="#ef4444"
                          strokeDasharray="8 4"
                          strokeWidth={2.5}
                          label={<CustomLabel value={xbarRResults.rLCL} label="LCL" />}
                        />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="#10b981"
                          strokeWidth={2.5}
                          dot={<CustomDot />}
                          name="Range"
                          isAnimationActive={true}
                          animationDuration={1500}
                          animationEasing="ease-in-out"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}

        {pChartResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mb-6"
          >
            <Card className="shadow-lg">
              <CardHeader className="border-b bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">p Chart (Proportion Defective)</CardTitle>
                    <CardDescription className="text-sm">
                      Monitors the proportion of defective items in samples
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9, duration: 1 }}
                >
                  <ResponsiveContainer width="100%" height={450}>
                    <LineChart data={pChartResults.pData} margin={{ top: 20, right: 120, left: 20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis
                        dataKey="sample"
                        label={{ value: "Sample Number", position: "insideBottom", offset: -10, style: { fontWeight: 600 } }}
                        stroke="#64748b"
                      />
                      <YAxis
                        label={{ value: "Proportion Defective", angle: -90, position: "insideLeft", style: { fontWeight: 600 } }}
                        stroke="#64748b"
                        tickFormatter={(value) => (value * 100).toFixed(1) + "%"}
                        domain={['auto', 'auto']}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <ReferenceLine
                        y={pChartResults.pUCL}
                        stroke="#ef4444"
                        strokeDasharray="8 4"
                        strokeWidth={2.5}
                        label={<CustomLabel value={pChartResults.pUCL} label="UCL" />}
                      />
                      <ReferenceLine
                        y={pChartResults.pCL}
                        stroke="#3b82f6"
                        strokeWidth={2.5}
                        label={<CustomLabel value={pChartResults.pCL} label="CL" />}
                      />
                      <ReferenceLine
                        y={pChartResults.pLCL}
                        stroke="#ef4444"
                        strokeDasharray="8 4"
                        strokeWidth={2.5}
                        label={<CustomLabel value={pChartResults.pLCL} label="LCL" />}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#10b981"
                        strokeWidth={2.5}
                        dot={<CustomDot />}
                        name="Proportion"
                        isAnimationActive={true}
                        animationDuration={1500}
                        animationEasing="ease-in-out"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Chart Legend */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="mb-8"
        >
          <ChartLegend type={sqcData.chartType!} />
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex justify-center gap-4 pb-8"
        >
          <Button
            onClick={() => navigate("/data-input")}
            size="lg"
            variant="outline"
            className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8"
          >
            <RefreshCw className="mr-2 h-5 w-5" />
            Re-analyze with New Data
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
