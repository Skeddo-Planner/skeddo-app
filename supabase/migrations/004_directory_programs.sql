-- Skeddo Directory Programs Table
-- Run this in the Supabase SQL Editor at:
-- https://supabase.com/dashboard/project/kjlsnlzcammvbdbqpiwp/sql/new
-- ============================================================
-- This table stores all browsable/discoverable programs (the Discover tab).
-- It replaces the static programs.json file and enables automated refresh
-- from the ActiveNet API (City of Vancouver community centres).

create table public.directory_programs (
  id                serial      primary key,
  name              text        not null,
  provider          text,
  category          text,
  camp_type         text,
  schedule_type     text,
  age_min           integer,
  age_max           integer,
  start_date        date,
  end_date          date,
  days              text,
  start_time        text,
  end_time          text,
  cost              numeric     default 0,
  indoor_outdoor    text,
  neighbourhood     text,
  address           text,
  lat               float,
  lng               float,
  enrollment_status text        default 'Open',
  registration_url  text,
  description       text,
  tags              text[]      default '{}',
  activity_type     text,
  last_updated      timestamptz default now(),
  source            text,       -- e.g., 'activenet-vancouver', 'manual'
  source_id         text,       -- the ActiveNet activity ID (for deduplication)

  constraint directory_programs_source_unique unique (source, source_id)
);

-- Indexes for common queries
create index idx_directory_programs_provider on public.directory_programs (provider);
create index idx_directory_programs_category on public.directory_programs (category);
create index idx_directory_programs_source on public.directory_programs (source);

-- Enable Row Level Security
alter table public.directory_programs enable row level security;

-- Public read access — anyone can browse programs (no auth required)
create policy "Anyone can read directory programs"
  on public.directory_programs for select
  using (true);

-- Only the service role (used by the refresh script) can write
-- No insert/update/delete policies for authenticated users.
-- The service role bypasses RLS, so no explicit write policy is needed.
