-- Migration: Add Strava OAuth columns to profiles table
-- Created: 2026-03-25

-- Add Strava authentication columns to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS strava_id BIGINT UNIQUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS strava_access_token TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS strava_refresh_token TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS strava_token_expires_at TIMESTAMPTZ;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS profiles_strava_id_idx ON profiles(strava_id);

-- Add comment for documentation
COMMENT ON COLUMN profiles.strava_id IS 'Strava athlete ID for OAuth authentication';
COMMENT ON COLUMN profiles.strava_access_token IS 'Strava OAuth access token (sensitive)';
COMMENT ON COLUMN profiles.strava_refresh_token IS 'Strava OAuth refresh token for token rotation (sensitive)';
COMMENT ON COLUMN profiles.strava_token_expires_at IS 'Timestamp when Strava access token expires';

-- Update RLS policies if needed (optional)
-- Make sure the policy allows the app to update Strava fields:
-- ALTER POLICY profiles_update_policy ON profiles 
-- USING (auth.uid()::text = id OR auth.role() = 'service_role');
