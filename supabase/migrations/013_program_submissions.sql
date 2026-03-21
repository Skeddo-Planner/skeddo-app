-- Migration 013: Program submissions staging table
-- User-submitted programs from unknown providers go here for review
-- before being added to the public directory.

CREATE TABLE IF NOT EXISTS public.program_submissions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  provider        TEXT,
  category        TEXT,
  cost            NUMERIC,
  days            TEXT,
  times           TEXT,
  start_date      DATE,
  end_date        DATE,
  age_min         INTEGER,
  age_max         INTEGER,
  location        TEXT,
  neighbourhood   TEXT,
  registration_url TEXT,
  submitted_by    UUID REFERENCES public.profiles(id),
  submitted_by_name TEXT,
  submitted_by_email TEXT,
  status          TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  reviewed_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.program_submissions ENABLE ROW LEVEL SECURITY;

-- Only service role writes to this table (via API)
-- No user-facing read/write policies needed
