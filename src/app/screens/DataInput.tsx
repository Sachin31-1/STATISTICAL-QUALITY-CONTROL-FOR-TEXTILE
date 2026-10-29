import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, Upload, Table as TableIcon, Plus, Trash2, Info } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/ui/tooltip";
import { useSQC } from "../context/SQCContext";
import { toast } from "sonner";
import { ConstantsTable } from "../components/ConstantsTable";
import { FileUpload } from "../components/FileUpload";
import { FileValidationResult } from "../utils/file-upload";

export function DataInput() {
  const navigate = useNavigate();
  const { sqcData, updateSQCData } = useSQC();
  const [numSamples, setNumSamples] = useState(sqcData.numSamples);
  const [sampleSize, setSampleSize] = useState(sqcData.sampleSize);
  const [sampleData, setSampleData] = useState<number[][]>(
    sqcData.sampleData.length > 0
      ? sqcData.sampleData
      : Array(numSamples).fill(null).map(() => Array(sampleSize).fill(0))
  );
  const [defectiveData, setDefectiveData] = useState<{ defectives: number; sampleSize: number }[]>(
    sqcData.defectiveData && sqcData.defectiveData.length > 0
      ? sqcData.defectiveData
      : Array(numSamples).fill(null).map(() => ({ defectives: 0, sampleSize: 50 }))
  );

  const isXbarR = sqcData.chartType === "xbar-r";
  const isXbarS = sqcData.chartType === "xbar-s";
  const isPChart = sqcData.chartType === "p-chart";
  const isVariableChart = isXbarR || isXbarS;

  useEffect(() => {
    if (isVariableChart) {
      setSampleData(
        Array(numSamples).fill(null).map((_, i) =>
          sampleData[i]?.slice(0, sampleSize) ||
          Array(sampleSize).fill(0)
        )
      );
    } else if (isPChart) {
      setDefectiveData(
        Array(numSamples).fill(null).map((_, i) =>
          defectiveData[i] || { defectives: 0, sampleSize: 50 }
        )
      );
    }
  }, [numSamples, sampleSize]);

  const handleFileProcessed = (result: FileValidationResult) => {
    if (result.isValid) {
      if (result.data && isVariableChart) {
        setSampleData(result.data);
        setNumSamples(result.data.length);
        setSampleSize(result.data[0].length);
        toast.success(`File uploaded successfully! ${result.data.length} samples loaded.`);
      } else if (result.defectiveData && isPChart) {
        setDefectiveData(result.defectiveData);
        setNumSamples(result.defectiveData.length);
        toast.success(`File uploaded successfully! ${result.defectiveData.length} samples loaded.`);
      }
    }
  };

  const handleCellChange = (sampleIndex: number, obsIndex: number, value: string) => {
    const newData = [...sampleData];
    newData[sampleIndex][obsIndex] = parseFloat(value) || 0;
    setSampleData(newData);
  };

  const handleDefectiveChange = (sampleIndex: number, field: "defectives" | "sampleSize", value: string) => {
    const newData = [...defectiveData];
    newData[sampleIndex][field] = parseInt(value) || 0;
    setDefectiveData(newData);
  };

  const generateSampleData = () => {
    if (isVariableChart) {
      const newData = Array(numSamples).fill(null).map(() =>
        Array(sampleSize).fill(null).map(() =>
          parseFloat((Math.random() * 20 + 90).toFixed(2))
        )
      );
      setSampleData(newData);
      toast.success("Sample data generated!");
    } else if (isPChart) {
      const newData = Array(numSamples).fill(null).map(() => {
        const n = Math.floor(Math.random() * 50 + 50);
        return {
          sampleSize: n,
          defectives: Math.floor(Math.random() * n * 0.1),
        };
      });
      setDefectiveData(newData);
      toast.success("Sample data generated!");
    }
  };

  const handleNext = () => {
    if (isVariableChart) {
      // Validate data
      const hasValidData = sampleData.some(sample =>
        sample.some(val => val !== 0)
      );
      if (!hasValidData) {
        toast.error("Please enter some data before proceeding");
        return;
      }
      updateSQCData({
        sampleData,
        numSamples,
        sampleSize,
      });
    } else if (isPChart) {
      const hasValidData = defectiveData.some(d => d.defectives > 0 || d.sampleSize > 0);
      if (!hasValidData) {
        toast.error("Please enter some data before proceeding");
        return;
      }
      updateSQCData({
        defectiveData,
        numSamples,
      });
    }
    navigate("/parameters");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            Data Input
          </h1>
          <p className="text-lg text-slate-600">
            {isVariableChart ? "Enter your variable data" : "Enter your attribute data"}
            {" - "}
            <span className="font-semibold">
              {isXbarR ? "X-bar & R Chart" : isXbarS ? "X-bar & S Chart" : "p Chart"}
            </span>
          </p>
        </motion.div>

        {/* Smart Constants Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Info className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-900 mb-1">
                    Smart Control Limit Calculation
                  </h3>
                  <p className="text-sm text-blue-800 mb-3">
                    Control limits are automatically calculated using industry-standard statistical constants (A2, D3, D4, d2) 
                    based on your sample size. No manual calculations needed!
                  </p>
                  <ConstantsTable sampleSize={sampleSize} />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="max-w-6xl mx-auto">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Input Your Data</CardTitle>
                  <CardDescription>
                    Manually enter data or upload a file
                  </CardDescription>
                </div>
                <Button
                  onClick={generateSampleData}
                  variant="outline"
                  className="border-blue-500 text-blue-600 hover:bg-blue-50"
                >
                  Generate Sample Data
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="manual" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="manual" className="flex items-center gap-2">
                    <TableIcon className="h-4 w-4" />
                    Manual Entry
                  </TabsTrigger>
                  <TabsTrigger value="upload" className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Upload File
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="manual" className="space-y-6">
                  {/* Configuration */}
                  <div className="grid md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg border-2 border-slate-200">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Label htmlFor="numSamples">Number of Samples (k)</Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 text-slate-400 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs text-xs">
                                The number of subgroups or samples collected over time.
                                Typically 20-25 samples for establishing control limits.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Input
                        id="numSamples"
                        type="number"
                        min="2"
                        max="50"
                        value={numSamples}
                        onChange={(e) => setNumSamples(parseInt(e.target.value) || 2)}
                        className="mt-1 focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                      <p className="text-xs text-slate-500 mt-1">Recommended: 20-25 samples</p>
                    </div>
                    {isXbarR && (
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Label htmlFor="sampleSize">Sample Size (n)</Label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-4 w-4 text-slate-400 cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-xs text-xs">
                                  Number of observations in each sample. This determines which
                                  statistical constants (A2, D3, D4) are used for calculations.
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <Input
                          id="sampleSize"
                          type="number"
                          min="2"
                          max="10"
                          value={sampleSize}
                          onChange={(e) => setSampleSize(parseInt(e.target.value) || 2)}
                          className="mt-1 focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                        <p className="text-xs text-slate-500 mt-1">Constants auto-fetched for n={sampleSize}</p>
                      </div>
                    )}
                  </div>

                  {isXbarR && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-sm text-blue-800">
                        <strong>💡 Tip:</strong> Enter measurements separated by tabs or paste from Excel.
                        Each row represents one sample.
                      </p>
                    </div>
                  )}

                  {/* Data Table */}
                  <div className="overflow-x-auto border rounded-lg shadow-sm">
                    {isXbarR ? (
                      <table className="w-full text-sm">
                        <thead className="bg-slate-100">
                          <tr>
                            <th className="p-3 text-left font-semibold">Sample #</th>
                            {Array(sampleSize).fill(null).map((_, i) => (
                              <th key={i} className="p-3 text-center font-semibold">
                                Obs {i + 1}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {sampleData.slice(0, numSamples).map((sample, sampleIndex) => (
                            <motion.tr
                              key={sampleIndex}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: sampleIndex * 0.05 }}
                              className="border-t hover:bg-blue-50 transition-colors"
                            >
                              <td className="p-3 font-medium">Sample {sampleIndex + 1}</td>
                              {sample.slice(0, sampleSize).map((value, obsIndex) => (
                                <td key={obsIndex} className="p-2">
                                  <Input
                                    type="number"
                                    step="0.01"
                                    value={value}
                                    onChange={(e) => handleCellChange(sampleIndex, obsIndex, e.target.value)}
                                    className="w-20 text-center focus:ring-2 focus:ring-blue-500 transition-all"
                                  />
                                </td>
                              ))}
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <table className="w-full text-sm">
                        <thead className="bg-slate-100">
                          <tr>
                            <th className="p-3 text-left font-semibold">Sample #</th>
                            <th className="p-3 text-center font-semibold">Sample Size</th>
                            <th className="p-3 text-center font-semibold">Number of Defectives</th>
                            <th className="p-3 text-center font-semibold">Proportion</th>
                          </tr>
                        </thead>
                        <tbody>
                          {defectiveData.slice(0, numSamples).map((data, index) => (
                            <motion.tr
                              key={index}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: index * 0.05 }}
                              className="border-t hover:bg-green-50 transition-colors"
                            >
                              <td className="p-3 font-medium">Sample {index + 1}</td>
                              <td className="p-2">
                                <Input
                                  type="number"
                                  min="1"
                                  value={data.sampleSize}
                                  onChange={(e) => handleDefectiveChange(index, "sampleSize", e.target.value)}
                                  className="w-24 text-center focus:ring-2 focus:ring-green-500 transition-all"
                                />
                              </td>
                              <td className="p-2">
                                <Input
                                  type="number"
                                  min="0"
                                  max={data.sampleSize}
                                  value={data.defectives}
                                  onChange={(e) => handleDefectiveChange(index, "defectives", e.target.value)}
                                  className="w-24 text-center focus:ring-2 focus:ring-green-500 transition-all"
                                />
                              </td>
                              <td className="p-3 text-center font-medium">
                                {data.sampleSize > 0
                                  ? ((data.defectives / data.sampleSize) * 100).toFixed(2) + "%"
                                  : "0%"}
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="upload" className="space-y-6">
                  <FileUpload
                    chartType={isVariableChart ? "variable" : "attribute"}
                    onFileProcessed={handleFileProcessed}
                  />
                </TabsContent>
              </Tabs>

              {/* Action Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => navigate(-1)}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>

                <Button
                  onClick={handleNext}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}