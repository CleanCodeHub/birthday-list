/*
  # Add birthday information table

  1. New Tables
    - `birthday_info`
      - `id` (uuid, primary key) - Unique identifier
      - `birthday_person_name` (text) - Name of the person whose birthday it is
      - `created_at` (timestamptz) - When the record was created
      - `updated_at` (timestamptz) - When the record was last updated
  
  2. Security
    - Enable RLS on `birthday_info` table
    - Add policy for public read access (so guests can see whose birthday it is)
    - Add policy for authenticated users to update (admin only)
  
  3. Initial Data
    - Insert a default record to ensure there's always one row to update
*/

CREATE TABLE IF NOT EXISTS birthday_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  birthday_person_name text NOT NULL DEFAULT 'Birthday Person',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE birthday_info ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read birthday info"
  ON birthday_info FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can update birthday info"
  ON birthday_info FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert default record if none exists
INSERT INTO birthday_info (birthday_person_name)
SELECT 'Birthday Person'
WHERE NOT EXISTS (SELECT 1 FROM birthday_info);
