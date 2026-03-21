-- Migration 014: Circles — Full Feature
-- Parent groups for sharing kids' activity schedules.

-- ─── 1. circles ───
CREATE TABLE IF NOT EXISTS public.circles (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  emoji       TEXT DEFAULT '👨‍👩‍👧‍👦',
  created_by  UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  invite_code TEXT UNIQUE NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.circles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "circles_select" ON public.circles
  FOR SELECT USING (
    id IN (SELECT circle_id FROM public.circle_memberships WHERE user_id = auth.uid() AND status = 'approved')
    OR created_by = auth.uid()
  );

CREATE POLICY "circles_insert" ON public.circles
  FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "circles_update" ON public.circles
  FOR UPDATE USING (created_by = auth.uid());

CREATE POLICY "circles_delete" ON public.circles
  FOR DELETE USING (created_by = auth.uid());


-- ─── 2. circle_memberships ───
CREATE TABLE IF NOT EXISTS public.circle_memberships (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  circle_id  UUID REFERENCES public.circles(id) ON DELETE CASCADE,
  user_id    UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  role       TEXT CHECK (role IN ('owner', 'member')) DEFAULT 'member',
  status     TEXT CHECK (status IN ('pending', 'approved', 'removed')) DEFAULT 'pending',
  joined_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE (circle_id, user_id)
);

ALTER TABLE public.circle_memberships ENABLE ROW LEVEL SECURITY;

-- Members can see other members of circles they belong to
CREATE POLICY "memberships_select" ON public.circle_memberships
  FOR SELECT USING (
    user_id = auth.uid()
    OR circle_id IN (SELECT circle_id FROM public.circle_memberships WHERE user_id = auth.uid() AND status = 'approved')
    -- Owners can see pending requests
    OR circle_id IN (SELECT id FROM public.circles WHERE created_by = auth.uid())
  );

CREATE POLICY "memberships_insert" ON public.circle_memberships
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Owners can update memberships (approve/remove), members can update own
CREATE POLICY "memberships_update" ON public.circle_memberships
  FOR UPDATE USING (
    user_id = auth.uid()
    OR circle_id IN (SELECT id FROM public.circles WHERE created_by = auth.uid())
  );

CREATE POLICY "memberships_delete" ON public.circle_memberships
  FOR DELETE USING (
    user_id = auth.uid()
    OR circle_id IN (SELECT id FROM public.circles WHERE created_by = auth.uid())
  );


-- ─── 3. shared_activities ───
CREATE TABLE IF NOT EXISTS public.shared_activities (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  circle_id          UUID REFERENCES public.circles(id) ON DELETE CASCADE,
  shared_by          UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  shared_by_name     TEXT,
  child_name         TEXT,
  activity_name      TEXT NOT NULL,
  provider_name      TEXT,
  directory_entry_id INT REFERENCES public.directory_programs(id) ON DELETE SET NULL,
  program_id         UUID REFERENCES public.user_programs(id) ON DELETE SET NULL,
  schedule_info      TEXT,
  age_group          TEXT,
  registration_url   TEXT,
  shared_at          TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.shared_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "shared_activities_select" ON public.shared_activities
  FOR SELECT USING (
    circle_id IN (SELECT circle_id FROM public.circle_memberships WHERE user_id = auth.uid() AND status = 'approved')
  );

CREATE POLICY "shared_activities_insert" ON public.shared_activities
  FOR INSERT WITH CHECK (
    shared_by = auth.uid()
    AND circle_id IN (SELECT circle_id FROM public.circle_memberships WHERE user_id = auth.uid() AND status = 'approved')
  );

CREATE POLICY "shared_activities_delete" ON public.shared_activities
  FOR DELETE USING (shared_by = auth.uid());


-- ─── 4. activity_flags ───
CREATE TABLE IF NOT EXISTS public.activity_flags (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shared_activity_id  UUID REFERENCES public.shared_activities(id) ON DELETE CASCADE,
  flagged_by          UUID REFERENCES public.profiles(id),
  reason              TEXT,
  status              TEXT CHECK (status IN ('open', 'resolved')) DEFAULT 'open',
  flagged_at          TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.activity_flags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "flags_select" ON public.activity_flags
  FOR SELECT USING (
    shared_activity_id IN (
      SELECT id FROM public.shared_activities WHERE circle_id IN (
        SELECT circle_id FROM public.circle_memberships WHERE user_id = auth.uid() AND status = 'approved'
      )
    )
  );

CREATE POLICY "flags_insert" ON public.activity_flags
  FOR INSERT WITH CHECK (flagged_by = auth.uid());


-- ─── 5. bookmarks ───
CREATE TABLE IF NOT EXISTS public.circle_bookmarks (
  user_id             UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  shared_activity_id  UUID REFERENCES public.shared_activities(id) ON DELETE CASCADE,
  bookmarked_at       TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, shared_activity_id)
);

ALTER TABLE public.circle_bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "bookmarks_select" ON public.circle_bookmarks
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "bookmarks_insert" ON public.circle_bookmarks
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "bookmarks_delete" ON public.circle_bookmarks
  FOR DELETE USING (user_id = auth.uid());


-- ─── 6. referrals ───
CREATE TABLE IF NOT EXISTS public.referrals (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id      UUID REFERENCES public.profiles(id),
  referred_id      UUID REFERENCES public.profiles(id),
  referral_code    TEXT UNIQUE NOT NULL,
  circle_id        UUID REFERENCES public.circles(id) ON DELETE SET NULL,
  status           TEXT CHECK (status IN ('pending', 'converted', 'expired')) DEFAULT 'pending',
  reward_months    INT DEFAULT 1,
  created_at       TIMESTAMPTZ DEFAULT now(),
  reward_expires_at TIMESTAMPTZ,
  converted_at     TIMESTAMPTZ
);

ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "referrals_select" ON public.referrals
  FOR SELECT USING (referrer_id = auth.uid() OR referred_id = auth.uid());

CREATE POLICY "referrals_insert" ON public.referrals
  FOR INSERT WITH CHECK (referrer_id = auth.uid());

CREATE POLICY "referrals_update" ON public.referrals
  FOR UPDATE USING (referrer_id = auth.uid());


-- ─── Indexes ───
CREATE INDEX IF NOT EXISTS idx_circle_memberships_user ON public.circle_memberships (user_id);
CREATE INDEX IF NOT EXISTS idx_circle_memberships_circle ON public.circle_memberships (circle_id);
CREATE INDEX IF NOT EXISTS idx_shared_activities_circle ON public.shared_activities (circle_id);
CREATE INDEX IF NOT EXISTS idx_referrals_code ON public.referrals (referral_code);
