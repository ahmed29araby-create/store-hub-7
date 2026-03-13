
-- Attach trigger for auto-creating profiles on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert profiles for existing users who don't have one
INSERT INTO public.profiles (user_id, display_name, email)
SELECT id, COALESCE(raw_user_meta_data->>'display_name', email), email
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM public.profiles)
ON CONFLICT DO NOTHING;

-- Create cart_items table
CREATE TABLE IF NOT EXISTS public.cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (user_id, product_id)
);

ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own cart"
ON public.cart_items FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can add to cart"
ON public.cart_items FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own cart"
ON public.cart_items FOR UPDATE TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can delete from their own cart"
ON public.cart_items FOR DELETE TO authenticated
USING (user_id = auth.uid());

-- Add moderator role to app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'moderator';

-- Create moderator permissions table
CREATE TABLE IF NOT EXISTS public.moderator_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  can_manage_products boolean NOT NULL DEFAULT false,
  can_edit_prices boolean NOT NULL DEFAULT false,
  can_manage_orders boolean NOT NULL DEFAULT false,
  full_control boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (user_id, organization_id)
);

ALTER TABLE public.moderator_permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage moderator permissions"
ON public.moderator_permissions FOR ALL TO authenticated
USING (organization_id = get_user_organization_id(auth.uid()));

CREATE POLICY "Moderators can view their own permissions"
ON public.moderator_permissions FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Super admins can manage all moderator permissions"
ON public.moderator_permissions FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'super_admin'));
