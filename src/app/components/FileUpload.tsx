import { useState } from "react";
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle2, X } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { Badge } from "./ui/badge";
import { validateAndParseFile, FileValidationResult } from "../utils/file-upload";
import { motion, AnimatePresence } from "motion/react";

interface FileUploadProps {
  chartType: "variable" | "attribute";
  onFileProcessed: (result: FileValidationResult) => void;
}

export function FileUpload({ chartType, onFileProcessed }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationResult, setValidationResult] = useState<FileValidationResult | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      await processFile(file);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const processFile = async (file: File) => {
    setIsProcessing(true);
    setValidationResult(null);

    try {
      const result = await validateAndParseFile(file, chartType);
      setValidationResult(result);

      if (result.isValid) {
        onFileProcessed(result);
      }
    } catch (error) {
      setValidationResult({
        isValid: false,
        errors: [error instanceof Error ? error.message : "Unknown error occurred"],
        warnings: [],
        fileName: file.name
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const clearResult = () => {
    setValidationResult(null);
  };

  return (
    <div className="space-y-4">
      <Card
        className={`border-2 border-dashed transition-all duration-300 ${
          isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-slate-300 hover:border-slate-400"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <motion.div
              animate={{
                scale: isDragging ? 1.1 : 1,
                rotate: isDragging ? 5 : 0
              }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mb-4">
                <Upload className="h-8 w-8 text-blue-600" />
              </div>
            </motion.div>

            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              {isDragging ? "Drop file here" : "Upload Data File"}
            </h3>

            <p className="text-sm text-slate-600 mb-4">
              Drag and drop or click to browse
            </p>

            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileSelect}
              disabled={isProcessing}
            />

            <Button
              onClick={() => document.getElementById("file-upload")?.click()}
              disabled={isProcessing}
              className="mb-4"
            >
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              {isProcessing ? "Processing..." : "Select File"}
            </Button>

            <div className="flex gap-2 text-xs text-slate-500">
              <Badge variant="outline">CSV</Badge>
              <Badge variant="outline">Excel (.xlsx)</Badge>
              <Badge variant="outline">Max 10MB</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <AnimatePresence>
        {validationResult && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Alert
              variant={validationResult.isValid ? "default" : "destructive"}
              className={validationResult.isValid ? "border-green-500 bg-green-50" : ""}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-2">
                  {validationResult.isValid ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-5 w-5 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <div className="font-semibold mb-1">
                      {validationResult.isValid ? "File Validated Successfully" : "Validation Failed"}
                    </div>
                    <AlertDescription>
                      <div className="text-sm font-medium mb-2">
                        File: {validationResult.fileName}
                      </div>
                      {validationResult.errors.length > 0 && (
                        <div className="space-y-1 mb-2">
                          <div className="font-semibold text-red-700">Errors:</div>
                          {validationResult.errors.map((error, idx) => (
                            <div key={idx} className="text-sm">• {error}</div>
                          ))}
                        </div>
                      )}
                      {validationResult.warnings.length > 0 && (
                        <div className="space-y-1">
                          <div className="font-semibold text-yellow-700">Warnings:</div>
                          {validationResult.warnings.map((warning, idx) => (
                            <div key={idx} className="text-sm">• {warning}</div>
                          ))}
                        </div>
                      )}
                      {validationResult.isValid && (
                        <div className="mt-2 text-sm text-green-700">
                          Data successfully imported and ready to analyze!
                        </div>
                      )}
                    </AlertDescription>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearResult}
                  className="ml-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-4">
          <h4 className="font-semibold text-sm text-slate-800 mb-2">
            Expected File Format:
          </h4>
          <div className="text-sm text-slate-600 space-y-1">
            {chartType === "variable" ? (
              <>
                <p>• Each row = one sample</p>
                <p>• Each column = one measurement within the sample</p>
                <p>• All values must be numeric</p>
                <p>• Example: 5 samples with 3 measurements each → 5 rows × 3 columns</p>
              </>
            ) : (
              <>
                <p>• Two columns: [defectives, sampleSize]</p>
                <p>• Or three columns: [sample#, defectives, sampleSize]</p>
                <p>• All values must be numeric and non-negative</p>
                <p>• Defectives cannot exceed sample size</p>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
