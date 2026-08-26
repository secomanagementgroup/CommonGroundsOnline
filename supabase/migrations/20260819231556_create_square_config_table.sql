/*
# Create square_config table for Square API credentials

1. Purpose
   - Securely stores Square production API credentials (access token and location ID).
   - Only the service role (edge functions) can read these values.
   - The anon/authenticated roles have NO access — RLS is enabled with no policies for them.

2. New Tables
   - `square_config`
     - `id` (int, primary key, always 1 — singleton row)
     - `access_token` (text, not null) — Square production access token
     - `location_id` (text, not null) — Square location ID
     - `created_at` (timestamptz, default now())
     - `updated_at` (timestamptz, default now())

3. Security
   - Enable RLS on `square_config`.
   - NO policies for anon or authenticated — only the service role bypasses RLS.
   - This ensures the browser/frontend can never read the Square access token.
*/

CREATE TABLE IF NOT EXISTS square_config (
  id int PRIMARY KEY DEFAULT 1,
  access_token text NOT NULL,
  location_id text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT singleton_row CHECK (id = 1)
);

ALTER TABLE square_config ENABLE ROW LEVEL SECURITY;

INSERT INTO square_config (id, access_token, location_id)
VALUES (1, 'EAAAlxNea3sVUjMk5WepgXkd3lDVdpiz6MkggA283irlkXLMgWL1N5xLlnPzecBv', 'L2WXSSMH14658')
ON CONFLICT (id) DO UPDATE SET
  access_token = EXCLUDED.access_token,
  location_id = EXCLUDED.location_id,
  updated_at = now();
