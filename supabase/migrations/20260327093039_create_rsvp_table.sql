/*
  # Birthday Party RSVP System

  1. New Tables
    - `rsvps`
      - `id` (uuid, primary key) - Unique identifier for each RSVP
      - `name` (text, required) - Name of the person RSVPing
      - `adults` (integer, default 0) - Number of adults attending
      - `kids` (integer, default 0) - Number of kids attending
      - `comment` (text, optional) - Optional comment or message
      - `created_at` (timestamptz) - When the RSVP was submitted

  2. Security
    - Enable RLS on `rsvps` table
    - Add policy for anyone to insert RSVPs (public access for submitting)
    - Add policy for anyone to read RSVPs (public access for viewing summary)

  3. Important Notes
    - Public access is enabled since guests don't need authentication to RSVP
    - All guests can see the RSVP list and summary
*/

CREATE TABLE IF NOT EXISTS rsvps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  adults integer DEFAULT 0,
  kids integer DEFAULT 0,
  comment text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit an RSVP
CREATE POLICY "Anyone can submit RSVP"
  ON rsvps
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anyone to view RSVPs
CREATE POLICY "Anyone can view RSVPs"
  ON rsvps
  FOR SELECT
  TO anon
  USING (true);