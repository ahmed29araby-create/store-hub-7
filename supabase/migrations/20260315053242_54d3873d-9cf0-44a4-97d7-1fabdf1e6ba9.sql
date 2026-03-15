
CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  is_visible boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage their org categories"
  ON public.categories FOR ALL
  TO authenticated
  USING (organization_id = get_user_organization_id(auth.uid()));

CREATE POLICY "Anyone can view categories of active orgs"
  ON public.categories FOR SELECT
  TO anon, authenticated
  USING (EXISTS (
    SELECT 1 FROM organizations
    WHERE organizations.id = categories.organization_id
    AND organizations.is_active = true
  ));

CREATE POLICY "Super admins can manage all categories"
  ON public.categories FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'super_admin'::app_role));
