-- Migration 010: Multi-Parent Access
-- Child-centric access model — multiple adults can share management of a child's schedule.

-- ─── 1. child_access: junction table (replaces "household" concept) ───

CREATE TABLE IF NOT EXISTS public.child_access (
  child_id   UUID REFERENCES public.kids(id) ON DELETE CASCADE,
  user_id    UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  role       TEXT CHECK (role IN ('creator', 'member')) DEFAULT 'member',
  invited_by UUID REFERENCES public.profiles(id),
  joined_at  TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (child_id, user_id)
);

ALTER TABLE public.child_access ENABLE ROW LEVEL SECURITY;

-- Users can see child_access rows for children they have access to
CREATE POLICY "child_access_select" ON public.child_access
  FOR SELECT USING (
    user_id = auth.uid()
    OR child_id IN (SELECT child_id FROM public.child_access WHERE user_id = auth.uid())
  );

-- Users can insert child_access (invite acceptance handled via API with service role)
CREATE POLICY "child_access_insert" ON public.child_access
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Only creators or the person who invited can delete access
CREATE POLICY "child_access_delete" ON public.child_access
  FOR DELETE USING (
    -- The creator of the child can remove anyone
    EXISTS (
      SELECT 1 FROM public.child_access ca
      WHERE ca.child_id = child_access.child_id
        AND ca.user_id = auth.uid()
        AND ca.role = 'creator'
    )
    -- Or the person who invited this member can remove them
    OR invited_by = auth.uid()
    -- Or the user can remove themselves
    OR user_id = auth.uid()
  );


-- ─── 2. child_invite: single-use invite links ───

CREATE TABLE IF NOT EXISTS public.child_invite (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id    UUID REFERENCES public.kids(id) ON DELETE CASCADE,
  created_by  UUID REFERENCES public.profiles(id),
  invite_code TEXT UNIQUE NOT NULL,
  status      TEXT CHECK (status IN ('active', 'used', 'expired', 'revoked')) DEFAULT 'active',
  expires_at  TIMESTAMPTZ NOT NULL,
  used_by     UUID REFERENCES public.profiles(id),
  used_at     TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.child_invite ENABLE ROW LEVEL SECURITY;

-- Users can see invites they created or for children they have access to
CREATE POLICY "child_invite_select" ON public.child_invite
  FOR SELECT USING (
    created_by = auth.uid()
    OR child_id IN (SELECT child_id FROM public.child_access WHERE user_id = auth.uid())
  );

-- Users can create invites for children they have access to
CREATE POLICY "child_invite_insert" ON public.child_invite
  FOR INSERT WITH CHECK (
    child_id IN (SELECT child_id FROM public.child_access WHERE user_id = auth.uid())
  );

-- Users can update invites they created (revoke)
CREATE POLICY "child_invite_update" ON public.child_invite
  FOR UPDATE USING (created_by = auth.uid());


-- ─── 3. activity_log: change history for transparency ───

CREATE TABLE IF NOT EXISTS public.activity_log (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID REFERENCES public.user_programs(id) ON DELETE CASCADE,
  child_id   UUID REFERENCES public.kids(id) ON DELETE CASCADE,
  user_id    UUID REFERENCES public.profiles(id),
  user_name  TEXT,
  action     TEXT CHECK (action IN ('added', 'updated', 'removed', 'restored', 'status_changed')),
  details    JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

-- Users can see activity logs for children they have access to
CREATE POLICY "activity_log_select" ON public.activity_log
  FOR SELECT USING (
    child_id IN (SELECT child_id FROM public.child_access WHERE user_id = auth.uid())
  );

-- Users can insert activity logs for children they have access to
CREATE POLICY "activity_log_insert" ON public.activity_log
  FOR INSERT WITH CHECK (
    child_id IN (SELECT child_id FROM public.child_access WHERE user_id = auth.uid())
  );


-- ─── 4. Add attribution columns to user_programs ───

ALTER TABLE public.user_programs
  ADD COLUMN IF NOT EXISTS added_by      UUID REFERENCES public.profiles(id),
  ADD COLUMN IF NOT EXISTS added_by_name TEXT;


-- ─── 5. Update RLS on kids table — allow shared access ───

-- Drop existing restrictive policies and recreate with shared access
DROP POLICY IF EXISTS "Users can view own kids" ON public.kids;
DROP POLICY IF EXISTS "Users can insert own kids" ON public.kids;
DROP POLICY IF EXISTS "Users can update own kids" ON public.kids;
DROP POLICY IF EXISTS "Users can delete own kids" ON public.kids;

CREATE POLICY "Users can view own and shared kids" ON public.kids
  FOR SELECT USING (
    user_id = auth.uid()
    OR id IN (SELECT child_id FROM public.child_access WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can insert own kids" ON public.kids
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own and shared kids" ON public.kids
  FOR UPDATE USING (
    user_id = auth.uid()
    OR id IN (SELECT child_id FROM public.child_access WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can delete own kids" ON public.kids
  FOR DELETE USING (user_id = auth.uid());


-- ─── 6. Update RLS on user_programs — allow shared access via kid assignments ───

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own programs" ON public.user_programs;
DROP POLICY IF EXISTS "Users can insert own programs" ON public.user_programs;
DROP POLICY IF EXISTS "Users can update own programs" ON public.user_programs;
DROP POLICY IF EXISTS "Users can delete own programs" ON public.user_programs;

CREATE POLICY "Users can view own and shared programs" ON public.user_programs
  FOR SELECT USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.child_access ca
      WHERE ca.user_id = auth.uid()
        AND ca.child_id = ANY(user_programs.kid_ids)
    )
  );

CREATE POLICY "Users can insert own programs" ON public.user_programs
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own and shared programs" ON public.user_programs
  FOR UPDATE USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.child_access ca
      WHERE ca.user_id = auth.uid()
        AND ca.child_id = ANY(user_programs.kid_ids)
    )
  );

CREATE POLICY "Users can delete own programs" ON public.user_programs
  FOR DELETE USING (user_id = auth.uid());


-- ─── 7. Seed child_access for existing kids (current owners become creators) ───

INSERT INTO public.child_access (child_id, user_id, role, joined_at)
SELECT id, user_id, 'creator', created_at
FROM public.kids
ON CONFLICT (child_id, user_id) DO NOTHING;


-- ─── 8. Backfill added_by on existing user_programs ───

UPDATE public.user_programs
SET added_by = user_id
WHERE added_by IS NULL;
