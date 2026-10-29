import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Layers, TrendingUp, DollarSign, Target } from "lucide-react";
import { BlendComponent, BlendOptimizationResult, optimizeBlend, TEXTILE_BLEND_PRESETS } from "../utils/blend-optimization";
import { motion, AnimatePresence } from "motion/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

export function BlendOptimizationPanel() {
  const [selectedPreset, setSelectedPreset] = useState<string>("cottonPolyester");
  const [optimizationResult, setOptimizationResult] = useState<BlendOptimizationResult | null>(null);

  const handleOptimize = () => {
    const presetKey = selectedPreset as keyof typeof TEXTILE_BLEND_PRESETS;
    const currentBlend = TEXTILE_BLEND_PRESETS[presetKey];
    const result = optimizeBlend(currentBlend, 80, 100);
    setOptimizationResult(result);
  };

  return (
    <Card className="border-purple-500 shadow-lg">
      <CardHeader className="bg-purple-50 border-b">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
            <Layers className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl">Blend Optimization</CardTitle>
            <CardDescription>Optimize yarn/material blending ratios for quality and cost</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-700">Select Blend Type:</label>
            <Select value={selectedPreset} onValueChange={setSelectedPreset}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cottonPolyester">Cotton-Polyester (60/40)</SelectItem>
                <SelectItem value="viscosePolyester">Viscose-Polyester (55/45)</SelectItem>
                <SelectItem value="woolBlend">Wool-Acrylic (70/30)</SelectItem>
                <SelectItem value="premiumCotton">Premium Cotton Blend</SelectItem>
                <SelectItem value="polyesterNylon">Polyester-Nylon (70/30)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleOptimize}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            <Target className="mr-2 h-4 w-4" />
            Optimize Blend
          </Button>

          <AnimatePresence>
            {optimizationResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                {/* Current vs Optimized */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-slate-100 p-4 rounded-lg">
                    <h4 className="font-semibold text-slate-800 mb-3">Current Blend</h4>
                    <div className="space-y-2">
                      {optimizationResult.currentBlend.map((component, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm">
                          <span className="text-slate-700">{component.name}</span>
                          <span className="font-semibold text-slate-800">{component.currentPercentage.toFixed(1)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-500">
                    <h4 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Optimized Blend
                    </h4>
                    <div className="space-y-2">
                      {optimizationResult.optimizedBlend.map((component, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm">
                          <span className="text-slate-700">{component.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-purple-800">{component.currentPercentage.toFixed(1)}%</span>
                            {Math.abs(component.currentPercentage - optimizationResult.currentBlend[idx].currentPercentage) > 0.5 && (
                              <Badge variant="outline" className="text-xs">
                                {component.currentPercentage > optimizationResult.currentBlend[idx].currentPercentage ? "↑" : "↓"}
                                {Math.abs(component.currentPercentage - optimizationResult.currentBlend[idx].currentPercentage).toFixed(1)}%
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Expected Improvements */}
                <div className="grid md:grid-cols-3 gap-4">
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    className="bg-green-50 p-4 rounded-lg border border-green-200"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                        <TrendingUp className="h-4 w-4 text-white" />
                      </div>
                      <h5 className="font-semibold text-slate-700">Quality</h5>
                    </div>
                    <p className="text-2xl font-bold text-green-600">
                      {optimizationResult.expectedImprovement.qualityImprovement > 0 ? "+" : ""}
                      {optimizationResult.expectedImprovement.qualityImprovement.toFixed(1)}%
                    </p>
                    <p className="text-xs text-slate-600 mt-1">Improvement</p>
                  </motion.div>

                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-blue-50 p-4 rounded-lg border border-blue-200"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                        <DollarSign className="h-4 w-4 text-white" />
                      </div>
                      <h5 className="font-semibold text-slate-700">Cost</h5>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">
                      {optimizationResult.expectedImprovement.costChange > 0 ? "+" : ""}
                      {optimizationResult.expectedImprovement.costChange.toFixed(1)}%
                    </p>
                    <p className="text-xs text-slate-600 mt-1">Change</p>
                  </motion.div>

                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-purple-50 p-4 rounded-lg border border-purple-200"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                        <Target className="h-4 w-4 text-white" />
                      </div>
                      <h5 className="font-semibold text-slate-700">Variability</h5>
                    </div>
                    <p className="text-2xl font-bold text-purple-600">
                      -{optimizationResult.expectedImprovement.variabilityReduction.toFixed(1)}%
                    </p>
                    <p className="text-xs text-slate-600 mt-1">Reduction</p>
                  </motion.div>
                </div>

                {/* Reasoning */}
                <div className="bg-slate-50 p-4 rounded-lg border-l-4 border-purple-500">
                  <h5 className="font-semibold text-slate-800 mb-2">Analysis:</h5>
                  <p className="text-sm text-slate-700">{optimizationResult.reasoning}</p>
                </div>

                {/* Recommendations */}
                <div className="bg-white p-4 rounded-lg border border-slate-200">
                  <h5 className="font-semibold text-slate-800 mb-3">Implementation Steps:</h5>
                  <ul className="space-y-2">
                    {optimizationResult.recommendations.map((rec, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-start gap-2 text-sm text-slate-600"
                      >
                        <div className="w-5 h-5 bg-purple-100 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs text-purple-600 font-semibold">{idx + 1}</span>
                        </div>
                        <span>{rec}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!optimizationResult && (
            <div className="text-center py-8 text-slate-500">
              <Layers className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Select a blend type and click "Optimize Blend" to see recommendations</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
