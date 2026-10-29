import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Info } from "lucide-react";

interface ConstantsTableProps {
  sampleSize?: number;
}

export function ConstantsTable({ sampleSize }: ConstantsTableProps) {
  const constants = [
    { n: 2, A2: 1.880, D3: 0, D4: 3.267, d2: 1.128 },
    { n: 3, A2: 1.023, D3: 0, D4: 2.574, d2: 1.693 },
    { n: 4, A2: 0.729, D3: 0, D4: 2.282, d2: 2.059 },
    { n: 5, A2: 0.577, D3: 0, D4: 2.114, d2: 2.326 },
    { n: 6, A2: 0.483, D3: 0, D4: 2.004, d2: 2.534 },
    { n: 7, A2: 0.419, D3: 0.076, D4: 1.924, d2: 2.704 },
    { n: 8, A2: 0.373, D3: 0.136, D4: 1.864, d2: 2.847 },
    { n: 9, A2: 0.337, D3: 0.184, D4: 1.816, d2: 2.970 },
    { n: 10, A2: 0.308, D3: 0.223, D4: 1.777, d2: 3.078 },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Info className="h-4 w-4" />
          View Constants Table
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Statistical Control Chart Constants</DialogTitle>
          <DialogDescription>
            Standard constants used for calculating control limits based on sample size (n)
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-blue-900 mb-2">How Constants are Used:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <strong>A2</strong>: Used to calculate X-bar chart control limits</li>
              <li>• <strong>D3</strong>: Used to calculate R chart lower control limit (LCL)</li>
              <li>• <strong>D4</strong>: Used to calculate R chart upper control limit (UCL)</li>
              <li>• <strong>d2</strong>: Bias correction factor for range estimation</li>
            </ul>
          </div>

          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-slate-100">
                <tr>
                  <th className="p-3 text-left font-semibold">Sample Size (n)</th>
                  <th className="p-3 text-center font-semibold">A2</th>
                  <th className="p-3 text-center font-semibold">D3</th>
                  <th className="p-3 text-center font-semibold">D4</th>
                  <th className="p-3 text-center font-semibold">d2</th>
                </tr>
              </thead>
              <tbody>
                {constants.map((row) => (
                  <tr
                    key={row.n}
                    className={`border-t transition-colors ${
                      sampleSize === row.n
                        ? "bg-blue-100 font-semibold"
                        : "hover:bg-slate-50"
                    }`}
                  >
                    <td className="p-3">{row.n}</td>
                    <td className="p-3 text-center">{row.A2.toFixed(3)}</td>
                    <td className="p-3 text-center">{row.D3.toFixed(3)}</td>
                    <td className="p-3 text-center">{row.D4.toFixed(3)}</td>
                    <td className="p-3 text-center">{row.d2.toFixed(3)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {sampleSize && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>Your sample size (n = {sampleSize}):</strong> Using constants from row highlighted above
              </p>
            </div>
          )}

          <div className="mt-4 text-xs text-slate-600">
            <p>
              <strong>Note:</strong> These constants are derived from statistical theory and are standardized
              across the quality control industry. Source: Montgomery, D.C. (2013). Statistical Quality Control.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
