import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { BarChart3, PieChart, ArrowLeft, TrendingUp } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { useSQC } from "../context/SQCContext";

export function ChartSelection() {
  const navigate = useNavigate();
  const { updateSQCData } = useSQC();

  const handleChartSelection = (chartType: "xbar-r" | "xbar-s" | "p-chart") => {
    updateSQCData({ chartType });
    navigate("/data-input");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100">
      <div className="container mx-auto px-4 py-12">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            Select Chart Type
          </h1>
          <p className="text-lg text-slate-600">
            Choose the appropriate control chart for your data type
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
              className="cursor-pointer transition-all duration-300 hover:shadow-2xl hover:border-blue-500 border-2 h-full group"
              onClick={() => handleChartSelection("xbar-r")}
            >
              <CardHeader>
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="h-10 w-10 text-blue-600" />
                </div>
                <CardTitle className="text-2xl text-center">X-bar & R Chart</CardTitle>
                <CardDescription className="text-center text-base">
                  For Variable Data (Continuous)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2 text-slate-700">Best For:</h3>
                    <ul className="space-y-2 text-sm text-slate-600">
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 mt-1.5" />
                        <span>Small sample sizes (2-10)</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 mt-1.5" />
                        <span>Range-based variation</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-center text-blue-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                      Select Chart
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                      </motion.div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
              className="cursor-pointer transition-all duration-300 hover:shadow-2xl hover:border-purple-500 border-2 h-full group"
              onClick={() => handleChartSelection("xbar-s")}
            >
              <CardHeader>
                <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="h-10 w-10 text-purple-600" />
                </div>
                <CardTitle className="text-2xl text-center">X-bar & S Chart</CardTitle>
                <CardDescription className="text-center text-base">
                  For Variable Data (Standard Dev)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2 text-slate-700">Best For:</h3>
                    <ul className="space-y-2 text-sm text-slate-600">
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mr-2 mt-1.5" />
                        <span>Larger sample sizes (10+)</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mr-2 mt-1.5" />
                        <span>Precise variation analysis</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-center text-purple-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                      Select Chart
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                      </motion.div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
              className="cursor-pointer transition-all duration-300 hover:shadow-2xl hover:border-green-500 border-2 h-full group"
              onClick={() => handleChartSelection("p-chart")}
            >
              <CardHeader>
                <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <PieChart className="h-10 w-10 text-green-600" />
                </div>
                <CardTitle className="text-2xl text-center">p Chart</CardTitle>
                <CardDescription className="text-center text-base">
                  For Attribute Data (Pass/Fail)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2 text-slate-700">Best For:</h3>
                    <ul className="space-y-2 text-sm text-slate-600">
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2 mt-1.5" />
                        <span>Defect rates & proportions</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2 mt-1.5" />
                        <span>Quality inspection data</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-center text-green-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                      Select Chart
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                      </motion.div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-12 text-center"
        >
          <Card className="max-w-2xl mx-auto bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <p className="text-sm text-slate-700">
                <span className="font-semibold">💡 Tip:</span> Not sure which chart to use?
                Variable data uses measurements you can calculate (like averages),
                while attribute data counts things that either pass or fail inspection.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
