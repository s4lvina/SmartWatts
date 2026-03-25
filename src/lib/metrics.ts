/**
 * TrainingPeaks Metrics Calculations
 * Core engine for cycling performance analysis
 */

/**
 * Normalized Power (NP)
 * Smooths 30-second windows and raises to 4th power for perceptual effort
 */
export function calculateNormalizedPower(powerData: number[], windowSize: number = 30): number {
  if (!powerData || powerData.length === 0) return 0;

  const smoothed = [];
  for (let i = 0; i < powerData.length - windowSize; i++) {
    const window = powerData.slice(i, i + windowSize);
    const avg = window.reduce((a, b) => a + b, 0) / window.length;
    smoothed.push(avg);
  }

  if (smoothed.length === 0) return 0;

  const fourthPowerSum = smoothed.reduce((sum, power) => sum + Math.pow(power, 4), 0);
  const np = Math.pow(fourthPowerSum / smoothed.length, 1 / 4);

  return Math.round(np);
}

/**
 * Intensity Factor (IF)
 * NP divided by FTP (Functional Threshold Power)
 */
export function calculateIntensityFactor(np: number, ftp: number): number {
  if (ftp === 0) return 0;
  return Math.round((np / ftp) * 100) / 100;
}

/**
 * Training Stress Score (TSS)
 * Duration (hours) × IF × NP / FTP × 100
 */
export function calculateTSS(
  durationSeconds: number,
  np: number,
  ftp: number
): number {
  const durationHours = durationSeconds / 3600;
  const if_ = calculateIntensityFactor(np, ftp);
  const tss = durationHours * if_ * np / ftp * 100;

  return Math.round(tss);
}

/**
 * Variability Index (VI)
 * NP divided by average power
 */
export function calculateVariabilityIndex(np: number, avgPower: number): number {
  if (avgPower === 0) return 0;
  return Math.round((np / avgPower) * 100) / 100;
}

/**
 * Efficiency Factor (EF)
 * NP divided by average heart rate
 */
export function calculateEfficiencyFactor(np: number, avgHR: number): number {
  if (avgHR === 0) return 0;
  return Math.round((np / avgHR) * 100) / 100;
}

/**
 * CTL (Chronic Training Load) - Fitness
 * 42-day exponential weighted average of TSS
 */
export function calculateCTL(tssHistory: number[], currentTSS: number): number {
  // Last 42 days, weighting more recent days
  const lambda = 1 / 42;
  const recentDays = tssHistory.slice(-42);

  let ctlSum = 0;
  recentDays.forEach((tss, i) => {
    const weight = Math.exp(-(42 - i) * lambda);
    ctlSum += tss * weight;
  });

  const weight = Math.exp(0);
  ctlSum += currentTSS * weight;

  return Math.round(ctlSum * 100) / 100;
}

/**
 * ATL (Acute Training Load) - Fatigue
 * 7-day exponential weighted average of TSS
 */
export function calculateATL(tssHistory: number[], currentTSS: number): number {
  const lambda = 1 / 7;
  const recentDays = tssHistory.slice(-7);

  let atlSum = 0;
  recentDays.forEach((tss, i) => {
    const weight = Math.exp(-(7 - i) * lambda);
    atlSum += tss * weight;
  });

  const weight = Math.exp(0);
  atlSum += currentTSS * weight;

  return Math.round(atlSum * 100) / 100;
}

/**
 * TSB (Training Stress Balance) - Form
 * CTL - ATL = indicates readiness/fatigue
 * Positive = ready for hard work
 * Negative = accumulating fatigue
 */
export function calculateTSB(ctl: number, atl: number): number {
  return Math.round((ctl - atl) * 100) / 100;
}

/**
 * CHO (Carbohydrate) Requirements for Recovery
 * Based on energy expenditure and body weight
 */
export function calculateCHORequirement(energyKJ: number, bodyWeightKg: number): number {
  // General recommendation: 1-1.2g/kg body weight for 1.5-2.5 hour rides
  // 60-90g/hour for efforts > 2.5 hours
  const baseRequirement = bodyWeightKg * 1.1;
  const perHourRequirement = Math.min(baseRequirement, 90);
  
  return Math.round(perHourRequirement * 10) / 10;
}
