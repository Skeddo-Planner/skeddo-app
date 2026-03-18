-- Skeddo Initial Schema
-- Run this in the Supabase SQL Editor at:
-- https://supabase.com/dashboard/project/kjlsnlzcammvbdbqpiwp/sql/new
-- ============================================================

-- 1. PROFILES — extends Supabase auth.users
-- ============================================================
create table public.profiles (
  id          uuid        primary key references auth.users (id) on delete cascade,
  email       text,
  display_name text,
  created_at  timestamptz default now(),
  onboarded   boolean     default false
);

alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);


-- 2. KIDS — children belonging to a user
-- ============================================================
create table public.kids (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null references public.profiles (id) on delete cascade,
  name        text        not null,
  age         integer,
  notes       text,
  created_at  timestamptz default now()
);

alter table public.kids enable row level security;

create policy "Users can read own kids"
  on public.kids for select
  using (auth.uid() = user_id);

create policy "Users can insert own kids"
  on public.kids for insert
  with check (auth.uid() = user_id);

create policy "Users can update own kids"
  on public.kids for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own kids"
  on public.kids for delete
  using (auth.uid() = user_id);


-- 3. USER_PROGRAMS — programs a user has added to their tracker
-- ============================================================
create table public.user_programs (
  id                uuid        primary key default gen_random_uuid(),
  user_id           uuid        not null references public.profiles (id) on delete cascade,
  name              text        not null,
  provider          text,
  category          text,
  status            text        default 'Exploring'
                                check (status in ('Enrolled', 'Waitlist', 'Exploring')),
  cost              numeric     default 0,
  days              text,
  times             text,
  start_date        date,
  end_date          date,
  season_type       text,
  age_min           integer,
  age_max           integer,
  location          text,
  neighbourhood     text,
  registration_url  text,
  notes             text,
  kid_ids           uuid[]      default '{}',
  created_at        timestamptz default now()
);

alter table public.user_programs enable row level security;

create policy "Users can read own programs"
  on public.user_programs for select
  using (auth.uid() = user_id);

create policy "Users can insert own programs"
  on public.user_programs for insert
  with check (auth.uid() = user_id);

create policy "Users can update own programs"
  on public.user_programs for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own programs"
  on public.user_programs for delete
  using (auth.uid() = user_id);


-- 4. PROGRAM_KID_ASSIGNMENTS — join table for future normalization
-- ============================================================
create table public.program_kid_assignments (
  program_id  uuid not null references public.user_programs (id) on delete cascade,
  kid_id      uuid not null references public.kids (id) on delete cascade,
  primary key (program_id, kid_id)
);

alter table public.program_kid_assignments enable row level security;

-- Users can manage assignments for their own programs
create policy "Users can read own assignments"
  on public.program_kid_assignments for select
  using (
    exists (
      select 1 from public.user_programs
      where user_programs.id = program_kid_assignments.program_id
        and user_programs.user_id = auth.uid()
    )
  );

create policy "Users can insert own assignments"
  on public.program_kid_assignments for insert
  with check (
    exists (
      select 1 from public.user_programs
      where user_programs.id = program_kid_assignments.program_id
        and user_programs.user_id = auth.uid()
    )
  );

create policy "Users can delete own assignments"
  on public.program_kid_assignments for delete
  using (
    exists (
      select 1 from public.user_programs
      where user_programs.id = program_kid_assignments.program_id
        and user_programs.user_id = auth.uid()
    )
  );


-- 5. AUTO-CREATE PROFILE ON SIGNUP
-- ============================================================
-- This trigger fires whenever a new user is created in auth.users
-- and inserts a matching row into public.profiles.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
