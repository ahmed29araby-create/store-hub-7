
-- Subscription packages table
CREATE TABLE public.subscription_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  name_en text,
  price numeric NOT NULL DEFAULT 0,
  default_price numeric NOT NULL DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  is_popular boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.subscription_packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Super admins can manage all packages"
ON public.subscription_packages FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Anyone can view visible packages"
ON public.subscription_packages FOR SELECT
TO authenticated
USING (is_visible = true);

-- Insert default packages
INSERT INTO public.subscription_packages (name, name_en, price, default_price, sort_order, is_popular) VALUES
('الأساسية', 'Basic', 400, 400, 1, false),
('الأساسية بلس', 'Basic Plus', 600, 600, 2, false),
('المعيارية', 'Standard', 800, 800, 3, false),
('المعيارية بلس', 'Standard Plus', 1000, 1000, 4, true),
('الاحترافية', 'Professional', 1500, 1500, 5, false),
('الاحترافية بلس', 'Pro Plus', 2000, 2000, 6, false),
('الأعمال', 'Business', 2500, 2500, 7, false),
('الأعمال بلس', 'Business Plus', 3000, 3000, 8, false),
('المؤسسية', 'Enterprise', 4000, 4000, 9, false),
('المؤسسية بلس', 'Enterprise Plus', 5000, 5000, 10, false);

-- Subscription requests table
CREATE TABLE public.subscription_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  package_id uuid NOT NULL REFERENCES public.subscription_packages(id),
  amount numeric NOT NULL DEFAULT 0,
  months integer NOT NULL DEFAULT 1,
  phone_number text NOT NULL DEFAULT '',
  receipt_url text,
  status text NOT NULL DEFAULT 'pending',
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.subscription_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Super admins can manage all subscription requests"
ON public.subscription_requests FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Admins can view their org requests"
ON public.subscription_requests FOR SELECT
TO authenticated
USING (organization_id = get_user_organization_id(auth.uid()));

CREATE POLICY "Admins can create requests for their org"
ON public.subscription_requests FOR INSERT
TO authenticated
WITH CHECK (organization_id = get_user_organization_id(auth.uid()));

-- Notifications table
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL DEFAULT 'subscription',
  related_id uuid,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications"
ON public.notifications FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications"
ON public.notifications FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Super admins can manage all notifications"
ON public.notifications FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Authenticated users can create notifications"
ON public.notifications FOR INSERT
TO authenticated
WITH CHECK (true);

-- Platform settings table (for Vodafone Cash number etc.)
CREATE TABLE public.platform_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  value text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Super admins can manage platform settings"
ON public.platform_settings FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Anyone authenticated can view platform settings"
ON public.platform_settings FOR SELECT
TO authenticated
USING (true);

-- Insert default vodafone cash number
INSERT INTO public.platform_settings (key, value) VALUES ('vodafone_cash_number', '+201000000000');

-- Create storage bucket for subscription receipts
INSERT INTO storage.buckets (id, name, public) VALUES ('subscription-receipts', 'subscription-receipts', true);

CREATE POLICY "Authenticated users can upload receipts"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'subscription-receipts');

CREATE POLICY "Anyone can view receipts"
ON storage.objects FOR SELECT
USING (bucket_id = 'subscription-receipts');

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.subscription_requests;
