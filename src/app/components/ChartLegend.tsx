import { Card, CardContent } from "../components/ui/card";

interface ChartLegendProps {
  type: "xbar-r" | "p-chart";
}

export function ChartLegend({ type }: ChartLegendProps) {
  return (
    <Card className="bg-slate-50 border-slate-200">
      <CardContent className="pt-4">
        <h3 className="font-semibold text-sm text-slate-700 mb-3">Legend</h3>
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-blue-600"></div>
            <span className="text-slate-600">Sample Data</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-red-500 border-t-2 border-dashed border-red-500"></div>
            <span className="text-slate-600">Control Limits (UCL/LCL)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-blue-500"></div>
            <span className="text-slate-600">Center Line (CL)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500 ring-2 ring-red-300"></div>
            <span className="text-slate-600">Out-of-Control Point</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <span className="text-slate-600">In-Control Point</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
