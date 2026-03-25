-- SmartWatts Supabase Schema
-- Performance Cycling Analytics Database

-- Create custom types
CREATE TYPE activity_type AS ENUM ('ride', 'run', 'swim', 'other');

-- Profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  ftp INTEGER DEFAULT 300,
  lthr INTEGER DEFAULT 160,
  "weight" DECIMAL(5,2) DEFAULT 70,
  birth_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Activities table
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  strava_id BIGINT,
  "name" VARCHAR(255) NOT NULL,
  "type" activity_type DEFAULT 'ride',
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  elapsed_time INTEGER, -- seconds
  moving_time INTEGER, -- seconds
  distance DECIMAL(10, 2), -- meters
  total_elevation_gain DECIMAL(10, 2), -- meters
  weighted_average_power INTEGER, -- NP in watts
  average_power INTEGER, -- watts
  tss DECIMAL(8, 2), -- Training Stress Score
  "if" DECIMAL(4, 2), -- Intensity Factor
  vi DECIMAL(4, 2), -- Variability Index
  ef DECIMAL(6, 2), -- Efficiency Factor
  hr_avg INTEGER, -- Average heart rate
  hr_max INTEGER, -- Max heart rate
  watts_data JSONB, -- Time-series power data
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Daily metrics table
CREATE TABLE daily_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  "date" DATE NOT NULL,
  hrv INTEGER, -- Heart Rate Variability (ms)
  sleep_score INTEGER, -- 0-100
  sleep_hours DECIMAL(4, 2),
  rpe INTEGER, -- Rate of Perceived Exertion (1-10)
  "weight" DECIMAL(5, 2), -- kg
  stress_level INTEGER, -- 1-10
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(profile_id, date)
);

-- Nutrition logs table
CREATE TABLE nutrition_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id UUID NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  cho_grams_per_hour DECIMAL(5, 2), -- Carbohydrates g/h
  total_kcal INTEGER,
  hydration_liters DECIMAL(4, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- PMC (Performance Management Chart) data table
CREATE TABLE pmc_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  "date" DATE NOT NULL,
  ctl DECIMAL(8, 2), -- Fitness (42-day exponential avg)
  atl DECIMAL(8, 2), -- Fatigue (7-day exponential avg)
  tsb DECIMAL(8, 2), -- Form (CTL - ATL)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(profile_id, date)
);

-- Create indexes for better query performance
CREATE INDEX idx_activities_profile_id ON activities(profile_id);
CREATE INDEX idx_activities_start_date ON activities(start_date DESC);
CREATE INDEX idx_activities_strava_id ON activities(strava_id);
CREATE INDEX idx_daily_metrics_profile_id ON daily_metrics(profile_id);
CREATE INDEX idx_daily_metrics_date ON daily_metrics(date DESC);
CREATE INDEX idx_pmc_data_profile_id ON pmc_data(profile_id);
CREATE INDEX idx_pmc_data_date ON pmc_data(date DESC);

-- Row Level Security (RLS) Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrition_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE pmc_data ENABLE ROW LEVEL SECURITY;

-- Profiles RLS
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Activities RLS
CREATE POLICY "Users can view their own activities"
  ON activities FOR SELECT
  USING (profile_id = auth.uid());

CREATE POLICY "Users can create activities"
  ON activities FOR INSERT
  WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Users can update their own activities"
  ON activities FOR UPDATE
  USING (profile_id = auth.uid());

-- Daily Metrics RLS
CREATE POLICY "Users can view their own daily metrics"
  ON daily_metrics FOR SELECT
  USING (profile_id = auth.uid());

CREATE POLICY "Users can insert daily metrics"
  ON daily_metrics FOR INSERT
  WITH CHECK (profile_id = auth.uid());

-- PMC Data RLS
CREATE POLICY "Users can view their own PMC data"
  ON pmc_data FOR SELECT
  USING (profile_id = auth.uid());

CREATE POLICY "Users can insert PMC data"
  ON pmc_data FOR INSERT
  WITH CHECK (profile_id = auth.uid());

-- Nutrition Logs RLS
CREATE POLICY "Users can view nutrition logs for their activities"
  ON nutrition_logs FOR SELECT
  USING (
    activity_id IN (
      SELECT id FROM activities WHERE profile_id = auth.uid()
    )
  );

-- Functions and Triggers
CREATE OR REPLACE FUNCTION update_activity_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_activity_updated_at
  BEFORE UPDATE ON activities
  FOR EACH ROW
  EXECUTE FUNCTION update_activity_updated_at();

CREATE TRIGGER trigger_profile_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_activity_updated_at();

CREATE TRIGGER trigger_daily_metrics_updated_at
  BEFORE UPDATE ON daily_metrics
  FOR EACH ROW
  EXECUTE FUNCTION update_activity_updated_at();
