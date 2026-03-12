
CREATE TABLE public.store_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL UNIQUE REFERENCES public.organizations(id) ON DELETE CASCADE,
  hero_title text DEFAULT '',
  hero_subtitle text DEFAULT '',
  hero_image_url text DEFAULT '',
  hero_button_text text DEFAULT '',
  categories jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage their org store settings"
ON public.store_settings FOR ALL TO authenticated
USING (organization_id = get_user_organization_id(auth.uid()));

CREATE POLICY "Anyone can view store settings of active orgs"
ON public.store_settings FOR SELECT TO anon, authenticated
USING (EXISTS (
  SELECT 1 FROM organizations
  WHERE organizations.id = store_settings.organization_id
  AND organizations.is_active = true
));

CREATE POLICY "Super admins can manage all store settings"
ON public.store_settings FOR ALL TO authenticated
USING (has_role(auth.uid(), 'super_admin'::app_role));

CREATE TRIGGER update_store_settings_updated_at
  BEFORE UPDATE ON public.store_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
