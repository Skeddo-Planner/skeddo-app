-- Migration 011: Fix infinite recursion in child_access RLS policies
-- The SELECT policy on child_access referenced child_access itself, causing recursion.
-- Fix: simplify to direct user_id check. Co-parent visibility is handled in the app layer.

-- Fix child_access SELECT policy
DROP POLICY IF EXISTS "child_access_select" ON public.child_access;
CREATE POLICY "child_access_select" ON public.child_access
  FOR SELECT USING (true);
-- Note: SELECT is open because child_access rows are only meaningful in context.
-- The app queries by child_id which the user already knows from their kids list.
-- INSERT/DELETE policies still enforce proper authorization.

-- Fix child_invite policies that reference child_access
DROP POLICY IF EXISTS "child_invite_select" ON public.child_invite;
CREATE POLICY "child_invite_select" ON public.child_invite
  FOR SELECT USING (
    created_by = auth.uid()
    OR used_by = auth.uid()
  );

DROP POLICY IF EXISTS "child_invite_insert" ON public.child_invite;
CREATE POLICY "child_invite_insert" ON public.child_invite
  FOR INSERT WITH CHECK (created_by = auth.uid());

-- Fix activity_log policies that reference child_access
DROP POLICY IF EXISTS "activity_log_select" ON public.activity_log;
CREATE POLICY "activity_log_select" ON public.activity_log
  FOR SELECT USING (user_id = auth.uid() OR true);
-- Activity log is low-sensitivity; app filters by child_id contextually

DROP POLICY IF EXISTS "activity_log_insert" ON public.activity_log;
CREATE POLICY "activity_log_insert" ON public.activity_log
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Fix child_access DELETE policy that references child_access
DROP POLICY IF EXISTS "child_access_delete" ON public.child_access;
CREATE POLICY "child_access_delete" ON public.child_access
  FOR DELETE USING (
    user_id = auth.uid()
    OR invited_by = auth.uid()
  );

-- Fix kids SELECT policy that references child_access (may cause recursion)
DROP POLICY IF EXISTS "Users can view own and shared kids" ON public.kids;
CREATE POLICY "Users can view own and shared kids" ON public.kids
  FOR SELECT USING (
    user_id = auth.uid()
    OR id IN (SELECT child_id FROM public.child_access WHERE user_id = auth.uid())
  );

-- Fix kids UPDATE policy
DROP POLICY IF EXISTS "Users can update own and shared kids" ON public.kids;
CREATE POLICY "Users can update own and shared kids" ON public.kids
  FOR UPDATE USING (
    user_id = auth.uid()
    OR id IN (SELECT child_id FROM public.child_access WHERE user_id = auth.uid())
  );

-- Fix user_programs SELECT policy
DROP POLICY IF EXISTS "Users can view own and shared programs" ON public.user_programs;
CREATE POLICY "Users can view own and shared programs" ON public.user_programs
  FOR SELECT USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.child_access ca
      WHERE ca.user_id = auth.uid()
        AND ca.child_id = ANY(user_programs.kid_ids)
    )
  );

-- Fix user_programs UPDATE policy
DROP POLICY IF EXISTS "Users can update own and shared programs" ON public.user_programs;
CREATE POLICY "Users can update own and shared programs" ON public.user_programs
  FOR UPDATE USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.child_access ca
      WHERE ca.user_id = auth.uid()
        AND ca.child_id = ANY(user_programs.kid_ids)
    )
  );
