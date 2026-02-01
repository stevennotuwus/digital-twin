/*
  # IoT Digital Twin Dashboard Schema

  1. New Tables
    - `devices`
      - `id` (uuid, primary key)
      - `name` (text) - Device name
      - `type` (text) - Device type (temperature, humidity, pressure, etc.)
      - `status` (text) - Device status (online, offline, warning, error)
      - `location` (text) - Physical location of device
      - `last_seen` (timestamptz) - Last communication timestamp
      - `metadata` (jsonb) - Additional device information
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `sensor_readings`
      - `id` (uuid, primary key)
      - `device_id` (uuid, foreign key to devices)
      - `metric_name` (text) - Name of the metric (temperature, humidity, etc.)
      - `value` (numeric) - Sensor reading value
      - `unit` (text) - Unit of measurement
      - `timestamp` (timestamptz) - Reading timestamp
      - `created_at` (timestamptz)
    
    - `device_alerts`
      - `id` (uuid, primary key)
      - `device_id` (uuid, foreign key to devices)
      - `severity` (text) - Alert severity (info, warning, critical)
      - `message` (text) - Alert message
      - `resolved` (boolean) - Whether alert is resolved
      - `created_at` (timestamptz)
      - `resolved_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access (demo purposes)
    
  3. Indexes
    - Index on device_id for sensor_readings
    - Index on timestamp for sensor_readings
    - Index on device_id for device_alerts
*/

-- Create devices table
CREATE TABLE IF NOT EXISTS devices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL,
  status text NOT NULL DEFAULT 'offline',
  location text,
  last_seen timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create sensor_readings table
CREATE TABLE IF NOT EXISTS sensor_readings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id uuid NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  metric_name text NOT NULL,
  value numeric NOT NULL,
  unit text NOT NULL,
  timestamp timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create device_alerts table
CREATE TABLE IF NOT EXISTS device_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id uuid NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  severity text NOT NULL,
  message text NOT NULL,
  resolved boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  resolved_at timestamptz
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_sensor_readings_device_id ON sensor_readings(device_id);
CREATE INDEX IF NOT EXISTS idx_sensor_readings_timestamp ON sensor_readings(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_device_alerts_device_id ON device_alerts(device_id);

-- Enable Row Level Security
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE sensor_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_alerts ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (for demo purposes)
CREATE POLICY "Allow public read access to devices"
  ON devices FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert to devices"
  ON devices FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public update to devices"
  ON devices FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public read access to sensor_readings"
  ON sensor_readings FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert to sensor_readings"
  ON sensor_readings FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public read access to device_alerts"
  ON device_alerts FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert to device_alerts"
  ON device_alerts FOR INSERT
  TO anon
  WITH CHECK (true);

-- Insert sample IoT devices
INSERT INTO devices (name, type, status, location) VALUES
  ('Temperature Sensor 01', 'temperature', 'online', 'Server Room A'),
  ('Humidity Sensor 01', 'humidity', 'online', 'Server Room A'),
  ('Pressure Sensor 01', 'pressure', 'online', 'Manufacturing Floor'),
  ('Temperature Sensor 02', 'temperature', 'warning', 'Server Room B'),
  ('Vibration Sensor 01', 'vibration', 'online', 'Manufacturing Floor'),
  ('Air Quality Sensor 01', 'air_quality', 'offline', 'Office Space'),
  ('Power Monitor 01', 'power', 'online', 'Data Center'),
  ('Water Flow Sensor 01', 'flow', 'online', 'Cooling System')
ON CONFLICT DO NOTHING;

-- Insert sample sensor readings for the last hour
INSERT INTO sensor_readings (device_id, metric_name, value, unit, timestamp)
SELECT 
  d.id,
  CASE 
    WHEN d.type = 'temperature' THEN 'temperature'
    WHEN d.type = 'humidity' THEN 'humidity'
    WHEN d.type = 'pressure' THEN 'pressure'
    WHEN d.type = 'vibration' THEN 'vibration'
    WHEN d.type = 'air_quality' THEN 'aqi'
    WHEN d.type = 'power' THEN 'watts'
    WHEN d.type = 'flow' THEN 'flow_rate'
  END,
  CASE 
    WHEN d.type = 'temperature' THEN 20 + (random() * 10)
    WHEN d.type = 'humidity' THEN 40 + (random() * 30)
    WHEN d.type = 'pressure' THEN 1000 + (random() * 50)
    WHEN d.type = 'vibration' THEN random() * 5
    WHEN d.type = 'air_quality' THEN 50 + (random() * 100)
    WHEN d.type = 'power' THEN 1000 + (random() * 500)
    WHEN d.type = 'flow' THEN 10 + (random() * 20)
  END,
  CASE 
    WHEN d.type = 'temperature' THEN '°C'
    WHEN d.type = 'humidity' THEN '%'
    WHEN d.type = 'pressure' THEN 'hPa'
    WHEN d.type = 'vibration' THEN 'mm/s'
    WHEN d.type = 'air_quality' THEN 'AQI'
    WHEN d.type = 'power' THEN 'W'
    WHEN d.type = 'flow' THEN 'L/min'
  END,
  now() - (interval '1 minute' * generate_series(0, 60))
FROM devices d
WHERE d.status != 'offline'
ON CONFLICT DO NOTHING;

-- Insert sample alerts
INSERT INTO device_alerts (device_id, severity, message, resolved)
SELECT 
  id,
  'warning',
  'Temperature threshold exceeded',
  false
FROM devices
WHERE type = 'temperature' AND status = 'warning'
ON CONFLICT DO NOTHING;