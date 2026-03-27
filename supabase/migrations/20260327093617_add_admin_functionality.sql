/*
  # Add Admin Functionality to RSVP System

  1. Changes to Tables
    - Add UPDATE and DELETE policies to `rsvps` table for authenticated users
    - Authenticated users (admins) can modify and delete any RSVP

  2. Security
    - Only authenticated users can update or delete RSVPs
    - Public users (anon) can still insert and view RSVPs
    - Admin authentication is handled through Supabase Auth

  3. Important Notes
    - Admin users must be created through Supabase Auth
    - The frontend will handle the admin login flow
    - Regular guests still have public access for viewing and submitting
*/

-- Add policy for authenticated users to update any RSVP
CREATE POLICY "Authenticated users can update RSVPs"
  ON rsvps
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Add policy for authenticated users to delete any RSVP
CREATE POLICY "Authenticated users can delete RSVPs"
  ON rsvps
  FOR DELETE
  TO authenticated
  USING (true);