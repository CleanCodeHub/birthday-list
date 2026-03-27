/*
  # Add Attending Field to RSVPs

  1. Changes
    - Add `attending` boolean field to rsvps table
    - Default to true for existing records
    - Not null constraint

  2. Notes
    - This allows guests to RSVP with yes or no
    - Existing RSVPs will default to attending=true
*/

-- Add attending column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'rsvps' AND column_name = 'attending'
  ) THEN
    ALTER TABLE rsvps ADD COLUMN attending boolean DEFAULT true NOT NULL;
  END IF;
END $$;
