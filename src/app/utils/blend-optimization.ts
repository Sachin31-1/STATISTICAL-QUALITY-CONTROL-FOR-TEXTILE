// Blend Optimization Engine for Textile/Yarn Industry
// Suggests optimized material blending ratios based on quality data

export interface BlendComponent {
  name: string;
  currentPercentage: number;
  cost: number; // Cost per unit
  quality: number; // Quality score (0-100)
}

export interface BlendOptimizationResult {
  currentBlend: BlendComponent[];
  optimizedBlend: BlendComponent[];
  expectedImprovement: {
    qualityImprovement: number; // Percentage
    costChange: number; // Percentage (negative = savings)
    variabilityReduction: number; // Percentage
  };
  reasoning: string;
  recommendations: string[];
}

/**
 * Simple blend optimization based on rule-based logic
 * For textile/yarn applications
 */
export function optimizeBlend(
  currentBlend: BlendComponent[],
  targetQuality: number = 80,
  budgetConstraint: number = 100 // Percentage of current cost
): BlendOptimizationResult {
  // Normalize current blend to ensure it sums to 100%
  const totalPercentage = currentBlend.reduce((sum, c) => sum + c.currentPercentage, 0);
  const normalizedCurrent = currentBlend.map(c => ({
    ...c,
    currentPercentage: (c.currentPercentage / totalPercentage) * 100
  }));

  // Calculate current metrics
  const currentQuality = normalizedCurrent.reduce(
    (sum, c) => sum + (c.quality * c.currentPercentage / 100), 0
  );
  const currentCost = normalizedCurrent.reduce(
    (sum, c) => sum + (c.cost * c.currentPercentage / 100), 0
  );

  // Simple optimization logic
  let optimizedBlend = [...normalizedCurrent];

  // Strategy 1: If quality is below target, increase high-quality components
  if (currentQuality < targetQuality) {
    // Sort by quality-to-cost ratio (value)
    const sortedByValue = [...normalizedCurrent].sort(
      (a, b) => (b.quality / b.cost) - (a.quality / a.cost)
    );

    // Increase best value component by 10-15%
    const bestValue = sortedByValue[0];
    const worstValue = sortedByValue[sortedByValue.length - 1];

    optimizedBlend = normalizedCurrent.map(c => {
      if (c.name === bestValue.name) {
        return { ...c, currentPercentage: Math.min(c.currentPercentage + 12, 60) };
      } else if (c.name === worstValue.name) {
        return { ...c, currentPercentage: Math.max(c.currentPercentage - 12, 10) };
      }
      return c;
    });

    // Normalize again
    const total = optimizedBlend.reduce((sum, c) => sum + c.currentPercentage, 0);
    optimizedBlend = optimizedBlend.map(c => ({
      ...c,
      currentPercentage: (c.currentPercentage / total) * 100
    }));
  }

  // Strategy 2: If quality is good but cost is high, optimize for cost
  else if (currentQuality >= targetQuality) {
    // Find components where we can reduce expensive ones without losing too much quality
    const sortedByCost = [...normalizedCurrent].sort((a, b) => b.cost - a.cost);
    const mostExpensive = sortedByCost[0];
    const leastExpensive = sortedByCost[sortedByCost.length - 1];

    // If most expensive has decent percentage, reduce it slightly
    if (mostExpensive.currentPercentage > 20) {
      optimizedBlend = normalizedCurrent.map(c => {
        if (c.name === mostExpensive.name) {
          return { ...c, currentPercentage: c.currentPercentage - 8 };
        } else if (c.name === leastExpensive.name && c.quality >= 70) {
          return { ...c, currentPercentage: c.currentPercentage + 8 };
        }
        return c;
      });

      // Normalize
      const total = optimizedBlend.reduce((sum, c) => sum + c.currentPercentage, 0);
      optimizedBlend = optimizedBlend.map(c => ({
        ...c,
        currentPercentage: (c.currentPercentage / total) * 100
      }));
    }
  }

  // Calculate optimized metrics
  const optimizedQuality = optimizedBlend.reduce(
    (sum, c) => sum + (c.quality * c.currentPercentage / 100), 0
  );
  const optimizedCost = optimizedBlend.reduce(
    (sum, c) => sum + (c.cost * c.currentPercentage / 100), 0
  );

  // Calculate improvements
  const qualityImprovement = ((optimizedQuality - currentQuality) / currentQuality) * 100;
  const costChange = ((optimizedCost - currentCost) / currentCost) * 100;
  const variabilityReduction = Math.abs(qualityImprovement) * 0.3; // Estimated

  // Generate reasoning
  let reasoning = "";
  if (qualityImprovement > 1) {
    reasoning = `By increasing the proportion of high-quality, cost-effective materials and reducing lower-value components, the blend quality can be improved by ${qualityImprovement.toFixed(1)}%.`;
  } else if (costChange < -1) {
    reasoning = `The current blend has good quality. By adjusting proportions slightly, costs can be reduced by ${Math.abs(costChange).toFixed(1)}% while maintaining quality standards.`;
  } else {
    reasoning = "The current blend is already well-optimized. Minor adjustments suggested for consistency.";
  }

  // Generate recommendations
  const recommendations = [];
  if (qualityImprovement > 2) {
    recommendations.push("Implement optimized blend gradually over 2-3 batches to monitor results");
    recommendations.push("Conduct quality tests at each stage to validate improvements");
  }
  if (costChange < -2) {
    recommendations.push("Verify supplier availability for increased component volumes");
    recommendations.push("Calculate ROI based on production volume");
  }
  recommendations.push("Monitor process stability with new blend composition");
  recommendations.push("Update standard operating procedures with new blend ratios");
  recommendations.push("Train operators on new material handling requirements");

  return {
    currentBlend: normalizedCurrent,
    optimizedBlend,
    expectedImprovement: {
      qualityImprovement,
      costChange,
      variabilityReduction
    },
    reasoning,
    recommendations
  };
}

/**
 * Suggest blend adjustments based on detected quality issues
 */
export function suggestBlendAdjustment(
  currentBlend: BlendComponent[],
  issueType: "high-variation" | "low-quality" | "cost-reduction"
): string[] {
  const suggestions: string[] = [];

  if (issueType === "high-variation") {
    suggestions.push("Consider using more consistent, premium-grade raw materials");
    suggestions.push("Increase proportion of fibers with lower natural variation");
    suggestions.push("Reduce mixing of materials from different suppliers");
    suggestions.push("Implement stricter raw material inspection criteria");
  } else if (issueType === "low-quality") {
    suggestions.push("Increase proportion of higher-quality fibers (even if more expensive)");
    suggestions.push("Review supplier quality and consider changing sources");
    suggestions.push("Check if lower-quality components can be replaced entirely");
    suggestions.push("Balance quality improvement with acceptable cost increase");
  } else if (issueType === "cost-reduction") {
    suggestions.push("Identify components where lower-cost alternatives exist");
    suggestions.push("Increase volume with key suppliers to negotiate better rates");
    suggestions.push("Consider using more local materials to reduce transport costs");
    suggestions.push("Test if high-cost components can be reduced without quality loss");
  }

  return suggestions;
}

/**
 * Common textile blend presets
 */
export const TEXTILE_BLEND_PRESETS = {
  cottonPolyester: [
    { name: "Cotton", currentPercentage: 60, cost: 2.5, quality: 85 },
    { name: "Polyester", currentPercentage: 40, cost: 1.8, quality: 75 }
  ],
  viscosePolyester: [
    { name: "Viscose", currentPercentage: 55, cost: 2.2, quality: 80 },
    { name: "Polyester", currentPercentage: 45, cost: 1.8, quality: 75 }
  ],
  woolBlend: [
    { name: "Wool", currentPercentage: 70, cost: 4.5, quality: 95 },
    { name: "Acrylic", currentPercentage: 30, cost: 1.5, quality: 65 }
  ],
  premiumCotton: [
    { name: "Supima Cotton", currentPercentage: 50, cost: 3.5, quality: 95 },
    { name: "Pima Cotton", currentPercentage: 30, cost: 2.8, quality: 88 },
    { name: "Regular Cotton", currentPercentage: 20, cost: 2.2, quality: 75 }
  ],
  polyesterNylon: [
    { name: "Polyester", currentPercentage: 70, cost: 1.8, quality: 75 },
    { name: "Nylon", currentPercentage: 30, cost: 2.3, quality: 82 }
  ]
};
