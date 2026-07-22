
CREATE TABLE public.report_content (
  id integer PRIMARY KEY DEFAULT 1,
  content text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT report_content_singleton CHECK (id = 1)
);

INSERT INTO public.report_content (id, content) VALUES (1, '')
  ON CONFLICT (id) DO NOTHING;

GRANT SELECT ON public.report_content TO anon, authenticated;
GRANT ALL ON public.report_content TO service_role;

ALTER TABLE public.report_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read report_content" ON public.report_content
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admins can update report_content" ON public.report_content
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert report_content" ON public.report_content
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
