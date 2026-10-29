// Statistical Quality Control calculation utilities

// Constants for control chart factors
const D3_FACTORS: { [key: number]: number } = {
  2: 0,
  3: 0,
  4: 0,
  5: 0,
  6: 0,
  7: 0.076,
  8: 0.136,
  9: 0.184,
  10: 0.223,
};

const D4_FACTORS: { [key: number]: number } = {
  2: 3.267,
  3: 2.574,
  4: 2.282,
  5: 2.114,
  6: 2.004,
  7: 1.924,
  8: 1.864,
  9: 1.816,
  10: 1.777,
};

const A2_FACTORS: { [key: number]: number } = {
  2: 1.88,
  3: 1.023,
  4: 0.729,
  5: 0.577,
  6: 0.483,
  7: 0.419,
  8: 0.373,
  9: 0.337,
  10: 0.308,
};

// Constants for S chart (Standard Deviation Chart)
const A3_FACTORS: { [key: number]: number } = {
  2: 2.659,
  3: 1.954,
  4: 1.628,
  5: 1.427,
  6: 1.287,
  7: 1.182,
  8: 1.099,
  9: 1.032,
  10: 0.975,
};

const B3_FACTORS: { [key: number]: number } = {
  2: 0,
  3: 0,
  4: 0,
  5: 0,
  6: 0.030,
  7: 0.118,
  8: 0.185,
  9: 0.239,
  10: 0.284,
};

const B4_FACTORS: { [key: number]: number } = {
  2: 3.267,
  3: 2.568,
  4: 2.266,
  5: 2.089,
  6: 1.970,
  7: 1.882,
  8: 1.815,
  9: 1.761,
  10: 1.716,
};

export interface XbarRResults {
  xbarData: { sample: number; value: number; ucl: number; cl: number; lcl: number; outOfControl: boolean }[];
  rData: { sample: number; value: number; ucl: number; cl: number; lcl: number; outOfControl: boolean }[];
  xbarCL: number;
  xbarUCL: number;
  xbarLCL: number;
  rCL: number;
  rUCL: number;
  rLCL: number;
  overallStatus: "in-control" | "out-of-control";
  inControlPercentage: number;
  confidenceLevel: number;
}

export interface XbarSResults {
  xbarData: { sample: number; value: number; ucl: number; cl: number; lcl: number; outOfControl: boolean }[];
  sData: { sample: number; value: number; ucl: number; cl: number; lcl: number; outOfControl: boolean }[];
  xbarCL: number;
  xbarUCL: number;
  xbarLCL: number;
  sCL: number;
  sUCL: number;
  sLCL: number;
  overallStatus: "in-control" | "out-of-control";
  inControlPercentage: number;
  confidenceLevel: number;
}

export interface PChartResults {
  pData: { sample: number; value: number; ucl: number; cl: number; lcl: number; outOfControl: boolean }[];
  pCL: number;
  pUCL: number;
  pLCL: number;
  overallStatus: "in-control" | "out-of-control";
  inControlPercentage: number;
  confidenceLevel: number;
}

export function calculateXbarR(
  data: number[][],
  sigmaLevel: number = 3
): XbarRResults {
  const n = data[0]?.length || 0;
  const k = data.length;

  // Calculate X-bar for each sample
  const xbars = data.map((sample) =>
    sample.reduce((sum, val) => sum + val, 0) / sample.length
  );

  // Calculate Range for each sample
  const ranges = data.map((sample) => Math.max(...sample) - Math.min(...sample));

  // Calculate X-bar-bar (average of X-bars)
  const xbarbar = xbars.reduce((sum, val) => sum + val, 0) / k;

  // Calculate R-bar (average of Ranges)
  const rbar = ranges.reduce((sum, val) => sum + val, 0) / k;

  // Get factors
  const A2 = A2_FACTORS[n] || 0.577;
  const D3 = D3_FACTORS[n] || 0;
  const D4 = D4_FACTORS[n] || 2.114;

  // Calculate control limits for X-bar chart
  const xbarCL = xbarbar;
  const xbarUCL = xbarbar + A2 * rbar * (sigmaLevel / 3);
  const xbarLCL = xbarbar - A2 * rbar * (sigmaLevel / 3);

  // Calculate control limits for R chart
  const rCL = rbar;
  const rUCL = D4 * rbar * (sigmaLevel / 3);
  const rLCL = D3 * rbar * (sigmaLevel / 3);

  // Create data points with out-of-control detection
  const xbarData = xbars.map((value, index) => ({
    sample: index + 1,
    value,
    ucl: xbarUCL,
    cl: xbarCL,
    lcl: xbarLCL,
    outOfControl: value > xbarUCL || value < xbarLCL,
  }));

  const rData = ranges.map((value, index) => ({
    sample: index + 1,
    value,
    ucl: rUCL,
    cl: rCL,
    lcl: rLCL,
    outOfControl: value > rUCL || value < rLCL,
  }));

  // Calculate overall status
  const totalPoints = xbarData.length + rData.length;
  const outOfControlPoints =
    xbarData.filter((d) => d.outOfControl).length +
    rData.filter((d) => d.outOfControl).length;
  const inControlPercentage = ((totalPoints - outOfControlPoints) / totalPoints) * 100;

  const overallStatus =
    outOfControlPoints > 0 ? "out-of-control" : "in-control";

  // Confidence level based on sigma
  const confidenceLevel = sigmaLevel === 2 ? 95 : sigmaLevel === 3 ? 99.7 : 99.99;

  return {
    xbarData,
    rData,
    xbarCL,
    xbarUCL,
    xbarLCL,
    rCL,
    rUCL,
    rLCL,
    overallStatus,
    inControlPercentage,
    confidenceLevel,
  };
}

export function calculatePChart(
  defectiveData: { defectives: number; sampleSize: number }[],
  sigmaLevel: number = 3
): PChartResults {
  const k = defectiveData.length;

  // Calculate proportion for each sample
  const proportions = defectiveData.map(
    (d) => d.defectives / d.sampleSize
  );

  // Calculate average proportion (p-bar)
  const totalDefectives = defectiveData.reduce(
    (sum, d) => sum + d.defectives,
    0
  );
  const totalInspected = defectiveData.reduce(
    (sum, d) => sum + d.sampleSize,
    0
  );
  const pbar = totalDefectives / totalInspected;

  // Calculate control limits for p chart
  const pCL = pbar;

  // Create data points with individual control limits
  const pData = defectiveData.map((d, index) => {
    const n = d.sampleSize;
    const p = proportions[index];
    const standardError = Math.sqrt((pbar * (1 - pbar)) / n);
    const ucl = Math.min(pbar + (sigmaLevel * standardError), 1);
    const lcl = Math.max(pbar - (sigmaLevel * standardError), 0);

    return {
      sample: index + 1,
      value: p,
      ucl,
      cl: pCL,
      lcl,
      outOfControl: p > ucl || p < lcl,
    };
  });

  // Calculate average UCL and LCL for display
  const avgSampleSize =
    defectiveData.reduce((sum, d) => sum + d.sampleSize, 0) / k;
  const standardError = Math.sqrt((pbar * (1 - pbar)) / avgSampleSize);
  const pUCL = Math.min(pbar + (sigmaLevel * standardError), 1);
  const pLCL = Math.max(pbar - (sigmaLevel * standardError), 0);

  // Calculate overall status
  const outOfControlPoints = pData.filter((d) => d.outOfControl).length;
  const inControlPercentage = ((k - outOfControlPoints) / k) * 100;

  const overallStatus =
    outOfControlPoints > 0 ? "out-of-control" : "in-control";

  // Confidence level based on sigma
  const confidenceLevel = sigmaLevel === 2 ? 95 : sigmaLevel === 3 ? 99.7 : 99.99;

  return {
    pData,
    pCL,
    pUCL,
    pLCL,
    overallStatus,
    inControlPercentage,
    confidenceLevel,
  };
}

export function calculateXbarS(
  data: number[][],
  sigmaLevel: number = 3
): XbarSResults {
  const n = data[0]?.length || 0;
  const k = data.length;

  // Calculate X-bar for each sample
  const xbars = data.map((sample) =>
    sample.reduce((sum, val) => sum + val, 0) / sample.length
  );

  // Calculate Standard Deviation for each sample
  const standardDeviations = data.map((sample) => {
    const mean = sample.reduce((sum, val) => sum + val, 0) / sample.length;
    const variance = sample.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (sample.length - 1);
    return Math.sqrt(variance);
  });

  // Calculate X-bar-bar (average of X-bars)
  const xbarbar = xbars.reduce((sum, val) => sum + val, 0) / k;

  // Calculate S-bar (average of Standard Deviations)
  const sbar = standardDeviations.reduce((sum, val) => sum + val, 0) / k;

  // Get factors
  const A3 = A3_FACTORS[n] || 1.427;
  const B3 = B3_FACTORS[n] || 0;
  const B4 = B4_FACTORS[n] || 2.089;

  // Calculate control limits for X-bar chart
  const xbarCL = xbarbar;
  const xbarUCL = xbarbar + A3 * sbar * (sigmaLevel / 3);
  const xbarLCL = xbarbar - A3 * sbar * (sigmaLevel / 3);

  // Calculate control limits for S chart
  const sCL = sbar;
  const sUCL = B4 * sbar * (sigmaLevel / 3);
  const sLCL = B3 * sbar * (sigmaLevel / 3);

  // Create data points with out-of-control detection
  const xbarData = xbars.map((value, index) => ({
    sample: index + 1,
    value,
    ucl: xbarUCL,
    cl: xbarCL,
    lcl: xbarLCL,
    outOfControl: value > xbarUCL || value < xbarLCL,
  }));

  const sData = standardDeviations.map((value, index) => ({
    sample: index + 1,
    value,
    ucl: sUCL,
    cl: sCL,
    lcl: sLCL,
    outOfControl: value > sUCL || value < sLCL,
  }));

  // Calculate overall status
  const totalPoints = xbarData.length + sData.length;
  const outOfControlPoints =
    xbarData.filter((d) => d.outOfControl).length +
    sData.filter((d) => d.outOfControl).length;
  const inControlPercentage = ((totalPoints - outOfControlPoints) / totalPoints) * 100;

  const overallStatus =
    outOfControlPoints > 0 ? "out-of-control" : "in-control";

  // Confidence level based on sigma
  const confidenceLevel = sigmaLevel === 2 ? 95 : sigmaLevel === 3 ? 99.7 : 99.99;

  return {
    xbarData,
    sData,
    xbarCL,
    xbarUCL,
    xbarLCL,
    sCL,
    sUCL,
    sLCL,
    overallStatus,
    inControlPercentage,
    confidenceLevel,
  };
}
