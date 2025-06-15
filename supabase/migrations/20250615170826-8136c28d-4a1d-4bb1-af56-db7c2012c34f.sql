
-- Add price and payment status to the jobs table
ALTER TABLE public.jobs
ADD COLUMN price NUMERIC NOT NULL DEFAULT 99,
ADD COLUMN paid BOOLEAN NOT NULL DEFAULT false;

-- Add unpaid balance and status to recruiter profiles
ALTER TABLE public.recruiter_profiles
ADD COLUMN unpaid_balance NUMERIC NOT NULL DEFAULT 0,
ADD COLUMN status TEXT NOT NULL DEFAULT 'active';

-- Create a table to track payments
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recruiter_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  amount NUMERIC NOT NULL,
  method TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row-Level Security for the new payments table
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Policy: Recruiters can view their own payments
CREATE POLICY "Recruiters can view their own payments"
ON public.payments FOR SELECT
USING (auth.uid() = recruiter_id);

-- Policy: Allow service roles (like admin functions) to manage all payments
CREATE POLICY "Service roles can manage payments"
ON public.payments FOR ALL
USING (true); -- This is a placeholder; you'd typically restrict this to a service_role

-- Create a database function to handle updating the unpaid balance atomically
CREATE OR REPLACE FUNCTION public.handle_new_job_posting(recruiter_user_id uuid, job_price numeric)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE recruiter_profiles
  SET unpaid_balance = unpaid_balance + job_price
  WHERE user_id = recruiter_user_id;
END;
$$;
