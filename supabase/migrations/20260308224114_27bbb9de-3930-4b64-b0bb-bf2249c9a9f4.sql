
-- Add approval_status and trial fields to organizations
ALTER TABLE public.organizations 
  ADD COLUMN IF NOT EXISTS approval_status text NOT NULL DEFAULT 'approved',
  ADD COLUMN IF NOT EXISTS trial_end_date timestamp with time zone,
  ADD COLUMN IF NOT EXISTS trial_months integer DEFAULT 0;

-- Update existing organizations to be approved
UPDATE public.organizations SET approval_status = 'approved' WHERE approval_status = 'approved';
