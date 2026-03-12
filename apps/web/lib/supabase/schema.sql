-- FITCORE Supabase Database Schema

-- 1. Profiles (Users)
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  email text NOT NULL,
  display_name text,
  role text DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  target_goal text CHECK (target_goal IN ('diet', 'muscle', 'maintenance')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. InBody Logs (체성분 기록)
CREATE TABLE public.inbody_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  weight_kg numeric NOT NULL,
  muscle_mass_kg numeric NOT NULL,
  body_fat_percentage numeric NOT NULL,
  measured_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Workout Logs (운동 세션 기록)
CREATE TABLE public.workout_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  exercise_name text NOT NULL, -- ex: '바벨 데드리프트'
  status text DEFAULT 'in_progress', -- 'in_progress', 'completed'
  started_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  completed_at timestamp with time zone
);

-- 4. Workout Sets (운동 세부 세트)
CREATE TABLE public.workout_sets (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  workout_log_id uuid REFERENCES public.workout_logs(id) ON DELETE CASCADE NOT NULL,
  set_number integer NOT NULL,
  weight_kg numeric NOT NULL,
  reps integer NOT NULL,
  is_completed boolean DEFAULT false NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Nutrition Logs (영양 식단 기록)
CREATE TABLE public.nutrition_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  meal_type text NOT NULL, -- 'breakfast', 'lunch', 'dinner', 'snack'
  food_name text NOT NULL,
  image_url text,
  calories numeric NOT NULL,
  carbs_g numeric NOT NULL,
  protein_g numeric NOT NULL,
  fat_g numeric NOT NULL,
  logged_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set Row Level Security (RLS) policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inbody_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nutrition_logs ENABLE ROW LEVEL SECURITY;

-- Example policy for profiles: Users can read and update their own profile
CREATE POLICY "Users can view own profile." ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Note: Ensure to create trigger to automatically insert into profiles on auth.users insert.
