
-- Ladder state (single row)
CREATE TABLE public.ladder_state (
  id integer PRIMARY KEY DEFAULT 1,
  orders_count integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT ladder_state_singleton CHECK (id = 1)
);
INSERT INTO public.ladder_state (id, orders_count) VALUES (1, 0);

GRANT SELECT ON public.ladder_state TO anon, authenticated;
GRANT ALL ON public.ladder_state TO service_role;
ALTER TABLE public.ladder_state ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read ladder_state" ON public.ladder_state FOR SELECT TO anon, authenticated USING (true);

-- Processed payment orders (idempotency)
CREATE TABLE public.processed_orders (
  order_id text PRIMARY KEY,
  processed_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.processed_orders TO service_role;
ALTER TABLE public.processed_orders ENABLE ROW LEVEL SECURITY;
-- No policies: only service_role (webhook) may read/write.
