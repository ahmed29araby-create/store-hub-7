-- Create favorites table for customers
CREATE TABLE public.favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (user_id, product_id)
);

-- Enable RLS
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Users can view their own favorites
CREATE POLICY "Users can view their own favorites"
ON public.favorites FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- Users can add favorites
CREATE POLICY "Users can add favorites"
ON public.favorites FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

-- Users can remove their own favorites
CREATE POLICY "Users can delete their own favorites"
ON public.favorites FOR DELETE TO authenticated
USING (user_id = auth.uid());

-- Super admins can manage all favorites
CREATE POLICY "Super admins can manage all favorites"
ON public.favorites FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'super_admin'));