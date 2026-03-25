// User Profile
export interface Profile {
  id: string;
  ftp: number; // Functional Threshold Power in watts
  lthr: number; // Lactate Threshold Heart Rate
  weight: number; // kg
  birth_date: string;
  created_at: string;
  updated_at: string;
}

// Training Activity
export interface Activity {
  id: string;
  profile_id: string;
  strava_id?: string;
  name: string;
  type: 'ride' | 'run' | 'swim' | 'other';
  start_date: string;
  elapsed_time: number; // seconds
  moving_time: number; // seconds
  distance: number; // meters
  total_elevation_gain: number; // meters
  weighted_average_power?: number; // NP in watts
  average_power?: number; // watts
  tss?: number; // Training Stress Score
  if?: number; // Intensity Factor (0-1)
  vi?: number; // Variability Index
  ef?: number; // Efficiency Factor
  hr_avg?: number; // Average heart rate
  hr_max?: number; // Max heart rate
  watts_data?: number[]; // JSONB: time-series power data
  created_at: string;
}

// Daily Metrics
export interface DailyMetrics {
  id: string;
  profile_id: string;
  date: string;
  hrv?: number; // Heart Rate Variability (ms)
  sleep_score?: number; // 0-100
  sleep_hours?: number;
  rpe?: number; // Rate of Perceived Exertion (1-10)
  weight?: number; // kg
  stress_level?: number; // 1-10
  created_at: string;
}

// Nutrition Log
export interface NutritionLog {
  id: string;
  activity_id: string;
  cho_grams_per_hour?: number; // Carbohydrates g/h
  total_kcal?: number;
  hydration_liters?: number;
  created_at: string;
}

// PMC Data (calculated metrics)
export interface PMCData {
  date: string;
  ctl: number; // Fitness (42-day exponential avg)
  atl: number; // Fatigue (7-day exponential avg)
  tsb: number; // Form (CTL - ATL)
}

// Power Curve Data
export interface PowerCurveData {
  duration: string; // '1s', '5s', '1min', '5min', '20min', 'ftp', '60min'
  watts: number;
}
