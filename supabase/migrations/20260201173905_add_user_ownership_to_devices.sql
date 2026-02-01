/*
  # Add User Ownership to Devices

  1. Changes
    - Add `user_id` column to `devices` table
    - Add foreign key constraint to `auth.users`
    - Update RLS policies to restrict access by user ownership

  2. Security
    - Users can only view their own devices
    - Users can only create devices for themselves
    - Users can only update their own devices
    - Users can only delete their own devices
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'devices' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE devices ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

ALTER TABLE devices ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own devices" ON devices;
DROP POLICY IF EXISTS "Users can create their own devices" ON devices;
DROP POLICY IF EXISTS "Users can update their own devices" ON devices;
DROP POLICY IF EXISTS "Users can delete their own devices" ON devices;

CREATE POLICY "Users can view their own devices"
  ON devices
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own devices"
  ON devices
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own devices"
  ON devices
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own devices"
  ON devices
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

ALTER TABLE sensor_readings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view readings for their devices" ON sensor_readings;
DROP POLICY IF EXISTS "Users can create readings for their devices" ON sensor_readings;

CREATE POLICY "Users can view readings for their devices"
  ON sensor_readings
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM devices
      WHERE devices.id = sensor_readings.device_id
      AND devices.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create readings for their devices"
  ON sensor_readings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM devices
      WHERE devices.id = sensor_readings.device_id
      AND devices.user_id = auth.uid()
    )
  );

ALTER TABLE device_alerts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view alerts for their devices" ON device_alerts;
DROP POLICY IF EXISTS "Users can create alerts for their devices" ON device_alerts;
DROP POLICY IF EXISTS "Users can update alerts for their devices" ON device_alerts;

CREATE POLICY "Users can view alerts for their devices"
  ON device_alerts
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM devices
      WHERE devices.id = device_alerts.device_id
      AND devices.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create alerts for their devices"
  ON device_alerts
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM devices
      WHERE devices.id = device_alerts.device_id
      AND devices.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update alerts for their devices"
  ON device_alerts
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM devices
      WHERE devices.id = device_alerts.device_id
      AND devices.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM devices
      WHERE devices.id = device_alerts.device_id
      AND devices.user_id = auth.uid()
    )
  );