
-- Allow any authenticated user to insert notifications for any user (needed for company admins sending to super admins and vice versa)
DROP POLICY IF EXISTS "Authenticated users can create notifications for super admins" ON public.notifications;

CREATE POLICY "Authenticated users can create notifications"
ON public.notifications
FOR INSERT
TO authenticated
WITH CHECK (true);
