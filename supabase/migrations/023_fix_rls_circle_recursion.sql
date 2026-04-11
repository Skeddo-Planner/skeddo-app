/**
 * Migration 023: Fix RLS recursion between profiles, circles, and circle_memberships
 *
 * ROOT CAUSE: Migration 016 added a profiles SELECT policy that queries
 * circle_memberships, which has a SELECT policy that queries circles,
 * which has a SELECT policy that queries circle_memberships — creating
 * an infinite RLS evaluation loop. Postgres returns HTTP 500 instead of data.
 *
 * FIX: Use SECURITY DEFINER functions to bypass RLS in policy subqueries,
 * breaking the recursion chain while preserving the same access logic.
 *
 * Must be applied to BOTH staging and production Supabase projects.
 */

-- ============================================================
-- 1. Helper function: get all circle IDs a user can access
--    (bypasses RLS to break circles <-> circle_memberships recursion)
-- ============================================================
CREATE OR REPLACE FUNCTION public.get_user_circle_ids(uid UUID)
RETURNS SETOF UUID
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
STABLE
AS $func$
  SELECT cm.circle_id FROM public.circle_memberships cm
  WHERE cm.user_id = uid AND cm.status IN ('approved', 'pending')
  UNION
  SELECT c.id FROM public.circles c WHERE c.created_by = uid
$func$;

-- ============================================================
-- 2. Helper function: get all user IDs visible via circle membership
--    (bypasses RLS to break profiles <-> circle_memberships recursion)
-- ============================================================
CREATE OR REPLACE FUNCTION public.get_circle_member_ids(uid UUID)
RETURNS SETOF UUID
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
STABLE
AS $func$
  SELECT DISTINCT cm2.user_id
  FROM public.circle_memberships cm2
  WHERE cm2.circle_id IN (
    SELECT cm1.circle_id FROM public.circle_memberships cm1
    WHERE cm1.user_id = uid
  )
  UNION
  SELECT cm3.user_id
  FROM public.circle_memberships cm3
  WHERE cm3.circle_id IN (
    SELECT c.id FROM public.circles c WHERE c.created_by = uid
  )
$func$;

-- ============================================================
-- 3. Fix profiles SELECT policy (was recursive via circle_memberships)
-- ============================================================
DROP POLICY IF EXISTS "Users can read own and circle member profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;

CREATE POLICY "Users can read own and circle member profiles"
  ON public.profiles FOR SELECT
  USING (
    auth.uid() = id
    OR id IN (SELECT public.get_circle_member_ids(auth.uid()))
  );

-- ============================================================
-- 4. Fix circles SELECT policy (was recursive via circle_memberships)
-- ============================================================
DROP POLICY IF EXISTS "circles_select" ON public.circles;
CREATE POLICY "circles_select" ON public.circles FOR SELECT
  USING (
    created_by = auth.uid()
    OR id IN (SELECT public.get_user_circle_ids(auth.uid()))
  );

-- ============================================================
-- 5. Fix circle_memberships SELECT policy (was recursive via circles)
-- ============================================================
DROP POLICY IF EXISTS "memberships_select" ON public.circle_memberships;
CREATE POLICY "memberships_select" ON public.circle_memberships FOR SELECT
  USING (
    user_id = auth.uid()
    OR circle_id IN (SELECT public.get_user_circle_ids(auth.uid()))
  );

-- ============================================================
-- 6. Fix circle_memberships DELETE policy (also referenced circles)
-- ============================================================
DROP POLICY IF EXISTS "memberships_delete" ON public.circle_memberships;
CREATE POLICY "memberships_delete" ON public.circle_memberships FOR DELETE
  USING (
    user_id = auth.uid()
    OR circle_id IN (SELECT public.get_user_circle_ids(auth.uid()))
  );

-- ============================================================
-- 7. Fix circle_memberships UPDATE policy (also referenced circles)
-- ============================================================
DROP POLICY IF EXISTS "memberships_update" ON public.circle_memberships;
CREATE POLICY "memberships_update" ON public.circle_memberships FOR UPDATE
  USING (
    user_id = auth.uid()
    OR circle_id IN (SELECT public.get_user_circle_ids(auth.uid()))
  );
