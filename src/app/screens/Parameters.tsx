import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, Settings } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Switch } from "../components/ui/switch";
import { useSQC } from "../context/SQCContext";

export function Parameters() {
  const navigate = useNavigate();
  const { sqcData, updateSQCData } = useSQC();
  const [sigmaLevel, setSigmaLevel] = useState(sqcData.sigmaLevel);
  const [highlightOutOfControl, setHighlightOutOfControl] = useState(sqcData.highlightOutOfControl);
  const [autoDetectSampleSize, setAutoDetectSampleSize] = useState(sqcData.autoDetectSampleSize);

  const handleGenerate = () => {
    updateSQCData({
      sigmaLevel,
      highlightOutOfControl,
      autoDetectSampleSize,
    });
    navigate("/results");
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
            Configure Parameters
          </h1>
          <p className="text-lg text-slate-600">
            Set control chart parameters and preferences
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Settings className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle>Control Chart Parameters</CardTitle>
                  <CardDescription>
                    Customize your analysis settings
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Sigma Level */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-3"
              >
                <Label htmlFor="sigmaLevel" className="text-base font-semibold">
                  Sigma Level (Control Limits)
                </Label>
                <Select
                  value={sigmaLevel.toString()}
                  onValueChange={(value) => setSigmaLevel(parseInt(value))}
                >
                  <SelectTrigger
                    id="sigmaLevel"
                    className="w-full focus:ring-2 focus:ring-blue-500 transition-all"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">
                      2σ (95% confidence level)
                    </SelectItem>
                    <SelectItem value="3">
                      3σ (99.7% confidence level) - Standard
                    </SelectItem>
                    <SelectItem value="4">
                      4σ (99.99% confidence level)
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-slate-600">
                  The sigma level determines how sensitive the control chart is to variation.
                  3σ is the industry standard.
                </p>
              </motion.div>

              {/* Highlight Out of Control */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
              >
                <div className="flex-1 mr-4">
                  <Label htmlFor="highlight" className="text-base font-semibold cursor-pointer">
                    Highlight Out-of-Control Points
                  </Label>
                  <p className="text-sm text-slate-600 mt-1">
                    Mark points that fall outside control limits in red
                  </p>
                </div>
                <motion.div
                  whileTap={{ scale: 0.95 }}
                >
                  <Switch
                    id="highlight"
                    checked={highlightOutOfControl}
                    onCheckedChange={setHighlightOutOfControl}
                    className="data-[state=checked]:bg-blue-600"
                  />
                </motion.div>
              </motion.div>

              {/* Auto Detect Sample Size */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
              >
                <div className="flex-1 mr-4">
                  <Label htmlFor="autoDetect" className="text-base font-semibold cursor-pointer">
                    Auto-Detect Sample Size
                  </Label>
                  <p className="text-sm text-slate-600 mt-1">
                    Automatically determine optimal sample size from data
                  </p>
                </div>
                <motion.div
                  whileTap={{ scale: 0.95 }}
                >
                  <Switch
                    id="autoDetect"
                    checked={autoDetectSampleSize}
                    onCheckedChange={setAutoDetectSampleSize}
                    className="data-[state=checked]:bg-blue-600"
                  />
                </motion.div>
              </motion.div>

              {/* Info Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-blue-50 border border-blue-200 rounded-lg p-4"
              >
                <h4 className="font-semibold mb-2 text-blue-900">Current Configuration:</h4>
                <ul className="space-y-1 text-sm text-blue-800">
                  <li>
                    • Sigma Level: <span className="font-semibold">{sigmaLevel}σ</span>
                    {" "}({sigmaLevel === 2 ? "95%" : sigmaLevel === 3 ? "99.7%" : "99.99%"} confidence)
                  </li>
                  <li>
                    • Highlight: <span className="font-semibold">{highlightOutOfControl ? "Enabled" : "Disabled"}</span>
                  </li>
                  <li>
                    • Auto-Detect: <span className="font-semibold">{autoDetectSampleSize ? "Enabled" : "Disabled"}</span>
                  </li>
                </ul>
              </motion.div>

              {/* Action Buttons */}
              <div className="flex justify-between pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => navigate(-1)}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={handleGenerate}
                    className="bg-green-600 hover:bg-green-700 text-lg px-8"
                  >
                    Generate Charts
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
