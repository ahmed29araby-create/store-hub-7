-- Allow anyone (including anonymous visitors) to view active organizations
CREATE POLICY "Anyone can view active organizations"
ON public.organizations FOR SELECT
USING (is_active = true);
