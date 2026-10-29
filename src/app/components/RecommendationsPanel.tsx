import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Badge } from "./ui/badge";
import { Lightbulb, CheckSquare, AlertCircle } from "lucide-react";
import { Recommendation } from "../utils/recommendations-engine";
import { motion } from "motion/react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";

interface RecommendationsProps {
  recommendations: Recommendation[];
}

export function RecommendationsPanel({ recommendations }: RecommendationsProps) {
  const highPriority = recommendations.filter(r => r.priority === "High");
  const mediumPriority = recommendations.filter(r => r.priority === "Medium");
  const lowPriority = recommendations.filter(r => r.priority === "Low");

  return (
    <Card className="border-blue-500 shadow-lg">
      <CardHeader className="bg-blue-50 border-b">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
            <Lightbulb className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl">Smart Recommendations</CardTitle>
            <CardDescription>{recommendations.length} actionable recommendation(s)</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <Accordion type="multiple" className="space-y-3">
          {highPriority.length > 0 && (
            <>
              <div className="font-bold text-red-700 mb-2">High Priority</div>
              {highPriority.map((rec) => (
                <RecommendationCard key={rec.id} recommendation={rec} />
              ))}
            </>
          )}

          {mediumPriority.length > 0 && (
            <>
              <div className="font-bold text-orange-700 mb-2 mt-4">Medium Priority</div>
              {mediumPriority.map((rec) => (
                <RecommendationCard key={rec.id} recommendation={rec} />
              ))}
            </>
          )}

          {lowPriority.length > 0 && (
            <>
              <div className="font-bold text-blue-700 mb-2 mt-4">Low Priority</div>
              {lowPriority.map((rec) => (
                <RecommendationCard key={rec.id} recommendation={rec} />
              ))}
            </>
          )}
        </Accordion>
      </CardContent>
    </Card>
  );
}

function RecommendationCard({ recommendation }: { recommendation: Recommendation }) {
  const priorityColors = {
    High: "bg-red-500",
    Medium: "bg-orange-500",
    Low: "bg-blue-500"
  };

  const categoryIcons = {
    Corrective: AlertCircle,
    Preventive: CheckSquare
  };

  const Icon = categoryIcons[recommendation.category];

  return (
    <AccordionItem value={recommendation.id} className="border rounded-lg bg-white shadow">
      <AccordionTrigger className="px-4 hover:no-underline">
        <div className="flex items-center gap-3 text-left">
          <Icon className="h-5 w-5 text-blue-600 flex-shrink-0" />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-slate-800">{recommendation.title}</h4>
              <Badge className={`${priorityColors[recommendation.priority]} text-white text-xs`}>
                {recommendation.priority}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {recommendation.category}
              </Badge>
            </div>
            <p className="text-sm text-slate-600">{recommendation.description}</p>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-4">
        <div className="space-y-3 mt-2">
          <div>
            <h5 className="font-semibold text-slate-700 mb-2">Action Items:</h5>
            <ul className="space-y-2">
              {recommendation.actionItems.map((item, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-start gap-2 text-sm text-slate-600"
                >
                  <div className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs text-blue-600 font-semibold">{idx + 1}</span>
                  </div>
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          {recommendation.relatedIssues.length > 0 && (
            <div className="bg-slate-50 p-3 rounded">
              <p className="text-xs font-semibold text-slate-700 mb-1">Related Issues:</p>
              <p className="text-xs text-slate-600">{recommendation.relatedIssues.join(", ")}</p>
            </div>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
