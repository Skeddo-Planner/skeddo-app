-- Migration 018: Manual cost entries for budget tracking
-- Covers gear, private lessons, transport, extended care, discounts, etc.

CREATE TABLE IF NOT EXISTS public.manual_costs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  kid_id      UUID REFERENCES public.kids(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  amount      NUMERIC NOT NULL,
  category    TEXT CHECK (category IN ('Gear', 'Lessons', 'Transport', 'Extended Care', 'Other')) DEFAULT 'Other',
  date        DATE,
  created_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.manual_costs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "manual_costs_select" ON public.manual_costs
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "manual_costs_insert" ON public.manual_costs
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "manual_costs_update" ON public.manual_costs
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "manual_costs_delete" ON public.manual_costs
  FOR DELETE USING (user_id = auth.uid());
