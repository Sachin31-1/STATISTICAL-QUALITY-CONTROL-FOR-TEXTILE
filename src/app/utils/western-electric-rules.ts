// Western Electric Rules for detecting out-of-control patterns
// Reference: Statistical Quality Control Handbook (Western Electric, 1956)

export interface Issue {
  rule: string;
  description: string;
  possibleCause: string;
  impact: "High" | "Medium" | "Low";
  affectedSamples: number[];
  chartType: string;
}

export interface DataPoint {
  sample: number;
  value: number;
  ucl: number;
  cl: number;
  lcl: number;
  outOfControl: boolean;
}

/**
 * Rule 1: One point beyond the 3-sigma control limits
 */
function detectRule1(data: DataPoint[]): Issue | null {
  const outOfControlPoints = data.filter(d => d.outOfControl);

  if (outOfControlPoints.length > 0) {
    return {
      rule: "Rule 1: Point Beyond Control Limits",
      description: `${outOfControlPoints.length} point(s) beyond 3-sigma control limits detected`,
      possibleCause: "Special cause variation - machine malfunction, operator error, defective raw material, or measurement error",
      impact: "High",
      affectedSamples: outOfControlPoints.map(p => p.sample),
      chartType: "all"
    };
  }

  return null;
}

/**
 * Rule 2: Two out of three consecutive points beyond 2-sigma (same side)
 */
function detectRule2(data: DataPoint[]): Issue | null {
  const twoSigmaUpper = data.map(d => d.cl + (d.ucl - d.cl) * (2/3));
  const twoSigmaLower = data.map(d => d.cl - (d.cl - d.lcl) * (2/3));

  const affectedSamples: number[] = [];

  for (let i = 0; i <= data.length - 3; i++) {
    const window = data.slice(i, i + 3);
    const aboveCount = window.filter((d, idx) => d.value > twoSigmaUpper[i + idx]).length;
    const belowCount = window.filter((d, idx) => d.value < twoSigmaLower[i + idx]).length;

    if (aboveCount >= 2 || belowCount >= 2) {
      affectedSamples.push(...window.map(d => d.sample));
    }
  }

  if (affectedSamples.length > 0) {
    return {
      rule: "Rule 2: Two of Three Points Beyond 2-Sigma",
      description: "Two out of three consecutive points beyond 2-sigma limit on same side",
      possibleCause: "Process shift, tool wear, or gradual change in process parameters",
      impact: "High",
      affectedSamples: [...new Set(affectedSamples)],
      chartType: "all"
    };
  }

  return null;
}

/**
 * Rule 3: Four out of five consecutive points beyond 1-sigma (same side)
 */
function detectRule3(data: DataPoint[]): Issue | null {
  const oneSigmaUpper = data.map(d => d.cl + (d.ucl - d.cl) * (1/3));
  const oneSigmaLower = data.map(d => d.cl - (d.cl - d.lcl) * (1/3));

  const affectedSamples: number[] = [];

  for (let i = 0; i <= data.length - 5; i++) {
    const window = data.slice(i, i + 5);
    const aboveCount = window.filter((d, idx) => d.value > oneSigmaUpper[i + idx]).length;
    const belowCount = window.filter((d, idx) => d.value < oneSigmaLower[i + idx]).length;

    if (aboveCount >= 4 || belowCount >= 4) {
      affectedSamples.push(...window.map(d => d.sample));
    }
  }

  if (affectedSamples.length > 0) {
    return {
      rule: "Rule 3: Four of Five Points Beyond 1-Sigma",
      description: "Four out of five consecutive points beyond 1-sigma limit on same side",
      possibleCause: "Sustained process shift, environmental change, or systematic variation",
      impact: "Medium",
      affectedSamples: [...new Set(affectedSamples)],
      chartType: "all"
    };
  }

  return null;
}

/**
 * Rule 4: Eight consecutive points on one side of center line
 */
function detectRule4(data: DataPoint[]): Issue | null {
  const affectedSamples: number[] = [];

  for (let i = 0; i <= data.length - 8; i++) {
    const window = data.slice(i, i + 8);
    const allAbove = window.every(d => d.value > d.cl);
    const allBelow = window.every(d => d.value < d.cl);

    if (allAbove || allBelow) {
      affectedSamples.push(...window.map(d => d.sample));
    }
  }

  if (affectedSamples.length > 0) {
    return {
      rule: "Rule 4: Eight Points on One Side",
      description: "Eight consecutive points on one side of center line",
      possibleCause: "Process mean shift, new raw material batch, or calibration drift",
      impact: "Medium",
      affectedSamples: [...new Set(affectedSamples)],
      chartType: "all"
    };
  }

  return null;
}

/**
 * Rule 5: Six consecutive points steadily increasing or decreasing (trend)
 */
function detectRule5(data: DataPoint[]): Issue | null {
  const affectedSamples: number[] = [];

  for (let i = 0; i <= data.length - 6; i++) {
    const window = data.slice(i, i + 6);

    let increasing = true;
    let decreasing = true;

    for (let j = 0; j < window.length - 1; j++) {
      if (window[j].value >= window[j + 1].value) increasing = false;
      if (window[j].value <= window[j + 1].value) decreasing = false;
    }

    if (increasing || decreasing) {
      affectedSamples.push(...window.map(d => d.sample));
    }
  }

  if (affectedSamples.length > 0) {
    return {
      rule: "Rule 5: Trend of Six Points",
      description: "Six consecutive points steadily increasing or decreasing",
      possibleCause: "Tool wear, temperature drift, gradual equipment degradation, or operator fatigue",
      impact: "Medium",
      affectedSamples: [...new Set(affectedSamples)],
      chartType: "all"
    };
  }

  return null;
}

/**
 * Rule 6: Fifteen consecutive points within 1-sigma (both sides)
 */
function detectRule6(data: DataPoint[]): Issue | null {
  const oneSigmaUpper = data.map(d => d.cl + (d.ucl - d.cl) * (1/3));
  const oneSigmaLower = data.map(d => d.cl - (d.cl - d.lcl) * (1/3));

  const affectedSamples: number[] = [];

  for (let i = 0; i <= data.length - 15; i++) {
    const window = data.slice(i, i + 15);
    const allWithinOneSigma = window.every((d, idx) =>
      d.value > oneSigmaLower[i + idx] && d.value < oneSigmaUpper[i + idx]
    );

    if (allWithinOneSigma) {
      affectedSamples.push(...window.map(d => d.sample));
    }
  }

  if (affectedSamples.length > 0) {
    return {
      rule: "Rule 6: Fifteen Points Within 1-Sigma",
      description: "Fifteen consecutive points within 1-sigma of center line",
      possibleCause: "Stratification, mixed populations, or incorrect sampling method",
      impact: "Low",
      affectedSamples: [...new Set(affectedSamples)],
      chartType: "all"
    };
  }

  return null;
}

/**
 * Rule 7: Fourteen consecutive alternating points up and down
 */
function detectRule7(data: DataPoint[]): Issue | null {
  const affectedSamples: number[] = [];

  for (let i = 0; i <= data.length - 14; i++) {
    const window = data.slice(i, i + 14);

    let alternating = true;
    for (let j = 0; j < window.length - 2; j++) {
      const firstDiff = window[j + 1].value - window[j].value;
      const secondDiff = window[j + 2].value - window[j + 1].value;

      if (firstDiff * secondDiff >= 0) {
        alternating = false;
        break;
      }
    }

    if (alternating) {
      affectedSamples.push(...window.map(d => d.sample));
    }
  }

  if (affectedSamples.length > 0) {
    return {
      rule: "Rule 7: Fourteen Alternating Points",
      description: "Fourteen consecutive points alternating up and down",
      possibleCause: "Systematic sampling error, over-adjustment, or alternating operators",
      impact: "Low",
      affectedSamples: [...new Set(affectedSamples)],
      chartType: "all"
    };
  }

  return null;
}

/**
 * Rule 8: Eight consecutive points beyond 1-sigma (both sides)
 */
function detectRule8(data: DataPoint[]): Issue | null {
  const oneSigmaUpper = data.map(d => d.cl + (d.ucl - d.cl) * (1/3));
  const oneSigmaLower = data.map(d => d.cl - (d.cl - d.lcl) * (1/3));

  const affectedSamples: number[] = [];

  for (let i = 0; i <= data.length - 8; i++) {
    const window = data.slice(i, i + 8);
    const allBeyondOneSigma = window.every((d, idx) =>
      d.value > oneSigmaUpper[i + idx] || d.value < oneSigmaLower[i + idx]
    );

    if (allBeyondOneSigma) {
      affectedSamples.push(...window.map(d => d.sample));
    }
  }

  if (affectedSamples.length > 0) {
    return {
      rule: "Rule 8: Eight Points Beyond 1-Sigma",
      description: "Eight consecutive points beyond 1-sigma on either side",
      possibleCause: "Mixture of two populations, bimodal distribution, or inconsistent process",
      impact: "Medium",
      affectedSamples: [...new Set(affectedSamples)],
      chartType: "all"
    };
  }

  return null;
}

/**
 * Apply all Western Electric Rules to detect issues
 */
export function detectIssues(data: DataPoint[], chartType: string): Issue[] {
  const issues: Issue[] = [];

  const rule1 = detectRule1(data);
  const rule2 = detectRule2(data);
  const rule3 = detectRule3(data);
  const rule4 = detectRule4(data);
  const rule5 = detectRule5(data);
  const rule6 = detectRule6(data);
  const rule7 = detectRule7(data);
  const rule8 = detectRule8(data);

  if (rule1) issues.push({ ...rule1, chartType });
  if (rule2) issues.push({ ...rule2, chartType });
  if (rule3) issues.push({ ...rule3, chartType });
  if (rule4) issues.push({ ...rule4, chartType });
  if (rule5) issues.push({ ...rule5, chartType });
  if (rule6) issues.push({ ...rule6, chartType });
  if (rule7) issues.push({ ...rule7, chartType });
  if (rule8) issues.push({ ...rule8, chartType });

  return issues;
}
