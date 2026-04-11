-- Allow co-parents to delete programs assigned to shared kids.
-- Previously only the creator (user_id = auth.uid()) could delete.
-- Now any parent with child_access to a kid in kid_ids can also delete.

DROP POLICY IF EXISTS "Users can delete own programs" ON public.user_programs;
CREATE POLICY "Users can delete own and shared programs" ON public.user_programs
  FOR DELETE USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.child_access ca
      WHERE ca.user_id = auth.uid()
        AND ca.child_id = ANY(user_programs.kid_ids)
    )
  );

-- Enable realtime for user_programs so co-parent changes are broadcast.
-- This may already be enabled; DO block handles the duplicate case gracefully.
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.user_programs;
EXCEPTION WHEN duplicate_object THEN
  NULL; -- already added
END $$;
