
-- 1. Add payment_method to subscription_requests
ALTER TABLE public.subscription_requests ADD COLUMN IF NOT EXISTS payment_method text NOT NULL DEFAULT 'vodafone_cash';

-- 2. Add max_products to subscription_packages
ALTER TABLE public.subscription_packages ADD COLUMN IF NOT EXISTS max_products integer NOT NULL DEFAULT 15;

-- Update existing packages with product limits
UPDATE public.subscription_packages SET max_products = 15 WHERE sort_order = 1;
UPDATE public.subscription_packages SET max_products = 25 WHERE sort_order = 2;
UPDATE public.subscription_packages SET max_products = 30 WHERE sort_order = 3;
UPDATE public.subscription_packages SET max_products = 50 WHERE sort_order = 4;
UPDATE public.subscription_packages SET max_products = 75 WHERE sort_order = 5;
UPDATE public.subscription_packages SET max_products = 100 WHERE sort_order = 6;
UPDATE public.subscription_packages SET max_products = 150 WHERE sort_order = 7;
UPDATE public.subscription_packages SET max_products = 200 WHERE sort_order = 8;

-- 3. Add subscription tracking to organizations
ALTER TABLE public.organizations ADD COLUMN IF NOT EXISTS subscription_status text NOT NULL DEFAULT 'inactive';
ALTER TABLE public.organizations ADD COLUMN IF NOT EXISTS subscription_end_date timestamp with time zone;
ALTER TABLE public.organizations ADD COLUMN IF NOT EXISTS subscription_package_id uuid REFERENCES public.subscription_packages(id);
ALTER TABLE public.organizations ADD COLUMN IF NOT EXISTS subscription_start_date timestamp with time zone;

-- 4. Create offers table
CREATE TABLE IF NOT EXISTS public.offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subtitle text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  icon text NOT NULL DEFAULT '🎉',
  bg_color text NOT NULL DEFAULT '#FFF8E1',
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Super admins can manage offers" ON public.offers FOR ALL TO authenticated USING (has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Authenticated can view active offers" ON public.offers FOR SELECT TO authenticated USING (is_active = true);

-- Insert default offers
INSERT INTO public.offers (title, subtitle, description, icon, bg_color, sort_order) VALUES
  ('عرض الباقة المميزة', 'ترقية مجانية لمدة شهرين', 'احصل على ترقية مجانية لمدة شهرين عند الاشتراك في الباقة السنوية! وفر أكثر واستمتع بمساحة تخزين أكبر ومزايا حصرية لفريقك.', '👑', '#FFF8E1', 1),
  ('عرض التجديد المبكر', 'شهر مجاني عند التجديد قبل انتهاء الاشتراك', 'جدد اشتراكك قبل انتهائه واحصل على شهر إضافي مجاناً! لا تفوت هذا العرض الحصري لعملائنا الأوفياء. استمر بالاستفادة من كل المزايا بدون انقطاع.', '🔥', '#FFFFFF', 2),
  ('عرض الانطلاقة', 'خصم 30% على أول اشتراك', 'ابدأ رحلتك معنا واحصل على خصم 30% على أول اشتراك! فرصة رائعة لتجربة جميع مميزات المنصة بسعر مميز. العرض محدود المدة.', '🚀', '#F0F8FF', 3);

-- 5. Create chat_messages table
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL,
  sender_id uuid NOT NULL,
  sender_type text NOT NULL DEFAULT 'company',
  message text,
  image_url text,
  whatsapp_number text,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their conversation messages" ON public.chat_messages FOR SELECT TO authenticated
  USING (
    conversation_id = get_user_organization_id(auth.uid())
    OR has_role(auth.uid(), 'super_admin')
  );

CREATE POLICY "Users can send messages" ON public.chat_messages FOR INSERT TO authenticated
  WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Super admins can manage all messages" ON public.chat_messages FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'super_admin'));

-- 6. Create offer_sends table
CREATE TABLE IF NOT EXISTS public.offer_sends (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  offer_id uuid NOT NULL REFERENCES public.offers(id) ON DELETE CASCADE,
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.offer_sends ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Super admins can manage offer sends" ON public.offer_sends FOR ALL TO authenticated USING (has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Company admins can view their offers" ON public.offer_sends FOR SELECT TO authenticated USING (organization_id = get_user_organization_id(auth.uid()));

-- Enable realtime for chat_messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
