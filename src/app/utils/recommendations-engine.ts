// Smart Recommendations Engine for SQC Analysis
// Provides corrective and preventive actions based on detected issues

import { Issue } from "./western-electric-rules";

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: "High" | "Medium" | "Low";
  category: "Corrective" | "Preventive";
  actionItems: string[];
  relatedIssues: string[];
}

/**
 * Generate recommendations based on detected issues
 */
export function generateRecommendations(issues: Issue[]): Recommendation[] {
  const recommendations: Recommendation[] = [];

  // Group issues by impact level
  const highImpact = issues.filter(i => i.impact === "High");
  const mediumImpact = issues.filter(i => i.impact === "Medium");
  const lowImpact = issues.filter(i => i.impact === "Low");

  // Recommendations for Rule 1: Points beyond control limits
  const rule1Issues = issues.filter(i => i.rule.includes("Rule 1"));
  if (rule1Issues.length > 0) {
    recommendations.push({
      id: "rec-1",
      title: "Immediate Process Investigation Required",
      description: "Critical points detected beyond control limits. Immediate action required to identify and eliminate special causes.",
      priority: "High",
      category: "Corrective",
      actionItems: [
        "Stop production and inspect affected batches",
        "Check machine settings and calibration",
        "Verify raw material quality and specifications",
        "Review operator training and procedures",
        "Implement 100% inspection until issue is resolved"
      ],
      relatedIssues: rule1Issues.map(i => i.rule)
    });
  }

  // Recommendations for Rule 2-3: Points beyond 2-sigma or 1-sigma
  const shiftIssues = issues.filter(i => i.rule.includes("Rule 2") || i.rule.includes("Rule 3"));
  if (shiftIssues.length > 0) {
    recommendations.push({
      id: "rec-2",
      title: "Process Mean Shift Detected",
      description: "Process appears to be shifting away from center line. Adjust process parameters to prevent out-of-control conditions.",
      priority: "High",
      category: "Corrective",
      actionItems: [
        "Adjust machine settings to recenter the process",
        "Check for tool wear or equipment degradation",
        "Verify environmental conditions (temperature, humidity)",
        "Review recent changes in raw materials or suppliers",
        "Increase sampling frequency to monitor adjustment"
      ],
      relatedIssues: shiftIssues.map(i => i.rule)
    });
  }

  // Recommendations for Rule 4: Eight points on one side
  const sustainedShift = issues.filter(i => i.rule.includes("Rule 4"));
  if (sustainedShift.length > 0) {
    recommendations.push({
      id: "rec-3",
      title: "Sustained Process Shift",
      description: "Process mean has shifted and is running consistently on one side of target.",
      priority: "Medium",
      category: "Corrective",
      actionItems: [
        "Recalibrate equipment to target specification",
        "Check for new raw material batch or supplier change",
        "Verify measurement system accuracy",
        "Review and adjust process parameters",
        "Consider updating control limits if shift is intentional"
      ],
      relatedIssues: sustainedShift.map(i => i.rule)
    });
  }

  // Recommendations for Rule 5: Trend
  const trendIssues = issues.filter(i => i.rule.includes("Rule 5"));
  if (trendIssues.length > 0) {
    recommendations.push({
      id: "rec-4",
      title: "Process Trend Detected",
      description: "Process is exhibiting a steady trend. Take action before reaching control limits.",
      priority: "Medium",
      category: "Preventive",
      actionItems: [
        "Check for tool wear and replace if necessary",
        "Monitor temperature and humidity trends",
        "Inspect equipment for gradual degradation",
        "Review maintenance schedule and perform preventive maintenance",
        "Check for operator fatigue if shift-dependent"
      ],
      relatedIssues: trendIssues.map(i => i.rule)
    });
  }

  // Recommendations for Rule 6: Low variation
  const stratificationIssues = issues.filter(i => i.rule.includes("Rule 6"));
  if (stratificationIssues.length > 0) {
    recommendations.push({
      id: "rec-5",
      title: "Stratification or Sampling Issue",
      description: "Unusually low variation detected. Verify sampling method and data collection process.",
      priority: "Low",
      category: "Corrective",
      actionItems: [
        "Review sampling procedure for stratification",
        "Ensure samples represent the full process variation",
        "Check if data is being mixed from different sources",
        "Verify measurement system is working properly",
        "Recalculate control limits with proper sampling"
      ],
      relatedIssues: stratificationIssues.map(i => i.rule)
    });
  }

  // Recommendations for Rule 7: Alternating pattern
  const alternatingIssues = issues.filter(i => i.rule.includes("Rule 7"));
  if (alternatingIssues.length > 0) {
    recommendations.push({
      id: "rec-6",
      title: "Systematic Variation Detected",
      description: "Alternating pattern suggests systematic variation or over-adjustment.",
      priority: "Low",
      category: "Corrective",
      actionItems: [
        "Stop making frequent process adjustments",
        "Check for alternating operators or shifts",
        "Verify sampling procedure is consistent",
        "Review automatic control systems for over-adjustment",
        "Train operators on proper adjustment procedures"
      ],
      relatedIssues: alternatingIssues.map(i => i.rule)
    });
  }

  // Recommendations for Rule 8: Mixture pattern
  const mixtureIssues = issues.filter(i => i.rule.includes("Rule 8"));
  if (mixtureIssues.length > 0) {
    recommendations.push({
      id: "rec-7",
      title: "Process Mixture Detected",
      description: "Data suggests mixing of two or more populations. Investigate process sources.",
      priority: "Medium",
      category: "Corrective",
      actionItems: [
        "Identify if multiple machines/operators are being sampled together",
        "Separate data by machine, shift, or operator",
        "Check for multiple raw material sources",
        "Create separate control charts for each population",
        "Standardize processes across all sources"
      ],
      relatedIssues: mixtureIssues.map(i => i.rule)
    });
  }

  // General preventive recommendations
  if (issues.length === 0) {
    recommendations.push({
      id: "rec-8",
      title: "Process is In Control",
      description: "No issues detected. Continue monitoring and maintain current practices.",
      priority: "Low",
      category: "Preventive",
      actionItems: [
        "Continue regular sampling and monitoring",
        "Maintain current machine settings and procedures",
        "Document process parameters for future reference",
        "Schedule routine preventive maintenance",
        "Review control limits periodically for relevance"
      ],
      relatedIssues: []
    });
  } else {
    // Add general preventive recommendations when issues exist
    recommendations.push({
      id: "rec-9",
      title: "Enhance Process Monitoring",
      description: "Strengthen monitoring and control to prevent future issues.",
      priority: "Medium",
      category: "Preventive",
      actionItems: [
        "Increase sampling frequency during unstable periods",
        "Implement real-time SPC monitoring if not already in place",
        "Train all operators on SPC principles and chart interpretation",
        "Establish standard operating procedures for adjustments",
        "Document all process changes and correlate with chart patterns"
      ],
      relatedIssues: []
    });
  }

  // Sort by priority
  const priorityOrder = { "High": 0, "Medium": 1, "Low": 2 };
  return recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
}

/**
 * Generate specific recommendations for textile/yarn industry
 */
export function generateTextileRecommendations(
  issues: Issue[],
  processType: "spinning" | "weaving" | "dyeing" | "general" = "general"
): Recommendation[] {
  const baseRecommendations = generateRecommendations(issues);
  const textileRecommendations: Recommendation[] = [];

  const hasHighImpact = issues.some(i => i.impact === "High");

  if (hasHighImpact) {
    // Textile-specific high-priority recommendations
    if (processType === "spinning") {
      textileRecommendations.push({
        id: "tex-1",
        title: "Spinning Process Quality Check",
        description: "Critical variation detected in spinning process. Check yarn quality parameters.",
        priority: "High",
        category: "Corrective",
        actionItems: [
          "Check fiber blend consistency and mixing ratios",
          "Verify spindle speed and tension settings",
          "Inspect drafting system for proper alignment",
          "Check roving quality and twist uniformity",
          "Monitor humidity and temperature in spinning area"
        ],
        relatedIssues: issues.filter(i => i.impact === "High").map(i => i.rule)
      });
    } else if (processType === "weaving") {
      textileRecommendations.push({
        id: "tex-2",
        title: "Weaving Process Inspection",
        description: "Quality variation in weaving process requires immediate attention.",
        priority: "High",
        category: "Corrective",
        actionItems: [
          "Check warp and weft tension uniformity",
          "Inspect shuttle/rapier mechanism for consistency",
          "Verify loom speed and beat-up force",
          "Check yarn quality and sizing parameters",
          "Monitor reed and heald frame alignment"
        ],
        relatedIssues: issues.filter(i => i.impact === "High").map(i => i.rule)
      });
    }
  }

  // Blend optimization recommendation
  if (issues.length > 0) {
    textileRecommendations.push({
      id: "tex-3",
      title: "Consider Blend Optimization",
      description: "Quality variations may be improved through optimized material blending.",
      priority: "Medium",
      category: "Preventive",
      actionItems: [
        "Review current fiber blend ratios",
        "Analyze cost vs quality trade-offs",
        "Consider using blend optimization tool",
        "Test alternative blend compositions",
        "Document results and update standard blends"
      ],
      relatedIssues: []
    });
  }

  return [...textileRecommendations, ...baseRecommendations];
}
