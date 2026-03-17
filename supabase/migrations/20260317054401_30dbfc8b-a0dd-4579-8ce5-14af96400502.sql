
-- Fix the overly permissive notifications INSERT policy
DROP POLICY IF EXISTS "Authenticated users can create notifications" ON public.notifications;

CREATE POLICY "Authenticated users can create notifications for super admins"
ON public.notifications FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = notifications.user_id
    AND user_roles.role = 'super_admin'::app_role
  )
);
