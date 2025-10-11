/*
  # Bird Observation Tracker Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key)
      - `name` (text, not null) - Profile name for the user
      - `created_at` (timestamptz) - When the profile was created
    
    - `observation_sessions`
      - `id` (uuid, primary key)
      - `profile_id` (uuid, foreign key to profiles)
      - `start_time` (timestamptz, not null) - When the observation session started
      - `end_time` (timestamptz, nullable) - When the session ended (null if ongoing)
      - `location_lat` (numeric, not null) - Latitude of observation location
      - `location_lng` (numeric, not null) - Longitude of observation location
      - `created_at` (timestamptz) - Record creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp
    
    - `observations`
      - `id` (uuid, primary key)
      - `session_id` (uuid, foreign key to observation_sessions)
      - `bird_species` (text, not null) - Bird species name or identifier
      - `count` (integer, not null) - Number of birds observed
      - `is_custom` (boolean, default false) - Whether this is a custom bird entry
      - `created_at` (timestamptz) - When the observation was recorded

  2. Security
    - Enable RLS on all tables
    - All tables are accessible to everyone (public app, no auth required)
    - Policies allow all operations for public access since this is a local-first app
    
  3. Indexes
    - Index on profile_id for faster session lookups
    - Index on session_id for faster observation queries
    - Index on start_time for sorting sessions

  4. Important Notes
    - This schema supports offline-first architecture
    - Data will be synced with IndexedDB for offline access
    - No authentication required as this is a children's educational app
    - Multiple profiles supported on same device
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create observation_sessions table
CREATE TABLE IF NOT EXISTS observation_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  start_time timestamptz NOT NULL,
  end_time timestamptz,
  location_lat numeric NOT NULL,
  location_lng numeric NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create observations table
CREATE TABLE IF NOT EXISTS observations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES observation_sessions(id) ON DELETE CASCADE,
  bird_species text NOT NULL,
  count integer NOT NULL DEFAULT 0,
  is_custom boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_sessions_profile_id ON observation_sessions(profile_id);
CREATE INDEX IF NOT EXISTS idx_sessions_start_time ON observation_sessions(start_time DESC);
CREATE INDEX IF NOT EXISTS idx_observations_session_id ON observations(session_id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE observation_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE observations ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (local-first app, no authentication)
CREATE POLICY "Allow all operations on profiles"
  ON profiles FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on observation_sessions"
  ON observation_sessions FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on observations"
  ON observations FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);