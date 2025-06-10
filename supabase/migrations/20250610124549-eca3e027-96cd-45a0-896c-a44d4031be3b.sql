
-- Create companies table
CREATE TABLE public.companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  website TEXT,
  location TEXT,
  industry TEXT,
  size TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create jobs table
CREATE TABLE public.jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT,
  salary_min INTEGER,
  salary_max INTEGER,
  location TEXT,
  job_type TEXT CHECK (job_type IN ('full-time', 'part-time', 'contract', 'internship')) DEFAULT 'full-time',
  experience_level TEXT CHECK (experience_level IN ('entry', 'mid', 'senior', 'executive')) DEFAULT 'mid',
  status TEXT CHECK (status IN ('active', 'paused', 'closed')) DEFAULT 'active',
  posted_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  views INTEGER DEFAULT 0,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create applications table
CREATE TABLE public.applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE NOT NULL,
  candidate_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status TEXT CHECK (status IN ('pending', 'reviewed', 'interview', 'accepted', 'rejected')) DEFAULT 'pending',
  cover_letter TEXT,
  cv_url TEXT,
  applied_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(job_id, candidate_id)
);

-- Create user_points table for gamification
CREATE TABLE public.user_points (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  points INTEGER DEFAULT 0,
  total_earned INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT CHECK (type IN ('info', 'success', 'warning', 'error')) DEFAULT 'info',
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create job_alerts table
CREATE TABLE public.job_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  keywords TEXT,
  location TEXT,
  job_type TEXT,
  salary_min INTEGER,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_alerts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for companies
CREATE POLICY "Anyone can view companies" ON public.companies FOR SELECT USING (true);
CREATE POLICY "Admins and recruiters can manage companies" ON public.companies 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND user_type IN ('admin', 'recruteur')
    )
  );

-- RLS Policies for jobs
CREATE POLICY "Anyone can view active jobs" ON public.jobs 
  FOR SELECT USING (status = 'active' OR posted_by = auth.uid());
CREATE POLICY "Recruiters can manage their jobs" ON public.jobs 
  FOR ALL USING (posted_by = auth.uid());
CREATE POLICY "Admins can manage all jobs" ON public.jobs 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND user_type = 'admin'
    )
  );

-- RLS Policies for applications
CREATE POLICY "Users can view their own applications" ON public.applications 
  FOR SELECT USING (candidate_id = auth.uid());
CREATE POLICY "Recruiters can view applications for their jobs" ON public.applications 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.jobs 
      WHERE id = job_id AND posted_by = auth.uid()
    )
  );
CREATE POLICY "Users can create applications" ON public.applications 
  FOR INSERT WITH CHECK (candidate_id = auth.uid());
CREATE POLICY "Users can update their applications" ON public.applications 
  FOR UPDATE USING (candidate_id = auth.uid());
CREATE POLICY "Recruiters can update applications for their jobs" ON public.applications 
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.jobs 
      WHERE id = job_id AND posted_by = auth.uid()
    )
  );

-- RLS Policies for user_points
CREATE POLICY "Users can view their own points" ON public.user_points 
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update their own points" ON public.user_points 
  FOR ALL USING (user_id = auth.uid());

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications 
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update their own notifications" ON public.notifications 
  FOR UPDATE USING (user_id = auth.uid());

-- RLS Policies for job_alerts
CREATE POLICY "Users can manage their own job alerts" ON public.job_alerts 
  FOR ALL USING (user_id = auth.uid());

-- Function to update job views
CREATE OR REPLACE FUNCTION public.increment_job_views(job_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.jobs 
  SET views = views + 1, updated_at = NOW()
  WHERE id = job_id;
END;
$$;

-- Function to award points to users
CREATE OR REPLACE FUNCTION public.award_points(user_id UUID, points_amount INTEGER, reason TEXT DEFAULT '')
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_points (user_id, points, total_earned)
  VALUES (user_id, points_amount, points_amount)
  ON CONFLICT (user_id)
  DO UPDATE SET 
    points = user_points.points + points_amount,
    total_earned = user_points.total_earned + points_amount,
    updated_at = NOW();
END;
$$;

-- Trigger to award points for profile completion
CREATE OR REPLACE FUNCTION public.handle_profile_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Award points for completing profile fields
  IF OLD.first_name IS NULL AND NEW.first_name IS NOT NULL THEN
    PERFORM public.award_points(NEW.id, 50, 'First name added');
  END IF;
  
  IF OLD.last_name IS NULL AND NEW.last_name IS NOT NULL THEN
    PERFORM public.award_points(NEW.id, 50, 'Last name added');
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_profile_update
  AFTER UPDATE ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.handle_profile_update();

-- Insert some sample data for testing
INSERT INTO public.companies (name, description, location, industry, size) VALUES
('TechCorp Maroc', 'Leading technology company in Morocco', 'Casablanca', 'Technology', '100-500'),
('Digital Agency', 'Creative digital solutions agency', 'Rabat', 'Marketing', '50-100'),
('Innovation Labs', 'Research and development company', 'Marrakech', 'Technology', '50-100'),
('StartupTech', 'Growing startup in fintech', 'Casablanca', 'Fintech', '10-50');
