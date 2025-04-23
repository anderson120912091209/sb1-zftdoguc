-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1) Create enums
CREATE TYPE user_goals AS ENUM (
  'exploring', 'early_ideation', 'serious_startup'
);

CREATE TYPE skill_levels AS ENUM (
  'beginner', 'intermediate', 'advanced', 'expert'
);

-- 2) Create profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  skill_level skill_levels DEFAULT 'beginner',
  goal user_goals DEFAULT 'exploring',
  background_text TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

-- 3) Create skills
CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4) Create join table
CREATE TABLE profiles_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(profile_id, skill_id)
);

-- 5) Enable RLS on each table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles_skills ENABLE ROW LEVEL SECURITY;

-- 6) RLS policies for profiles
-- Public can only SELECT profiles where is_public = true
CREATE POLICY "public_profiles_view" ON profiles
  FOR SELECT USING (is_public = true);

-- Users can view their own profiles
CREATE POLICY "users_view_own_profile" ON profiles
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own profile
CREATE POLICY "users_insert_own_profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own profile
CREATE POLICY "users_update_own_profile" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- 7) RLS policies for skills (public)
-- Everyone can view skills
CREATE POLICY "skills_view" ON skills
  FOR SELECT USING (true);

-- 8) RLS policies for profiles_skills
-- Public can view skills for public profiles
CREATE POLICY "public_profiles_skills_view" ON profiles_skills
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = profiles_skills.profile_id
        AND p.is_public = true
    )
  );

-- Users can view their own profile skills
CREATE POLICY "users_view_own_profile_skills" ON profiles_skills
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = profiles_skills.profile_id
        AND p.user_id = auth.uid()
    )
  );

-- Users can insert skills for their own profile
CREATE POLICY "users_insert_own_profile_skills" ON profiles_skills
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = profiles_skills.profile_id
        AND p.user_id = auth.uid()
    )
  );

-- Users can update skills for their own profile
CREATE POLICY "users_update_own_profile_skills" ON profiles_skills
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = profiles_skills.profile_id
        AND p.user_id = auth.uid()
    )
  );

-- Users can delete skills from their own profile
CREATE POLICY "users_delete_own_profile_skills" ON profiles_skills
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = profiles_skills.profile_id
        AND p.user_id = auth.uid()
    )
  );

-- 9) Insert initial skills
INSERT INTO skills (name) VALUES
  ('JavaScript'),
  ('React'),
  ('Node.js'),
  ('Python'),
  ('UI/UX Design'),
  ('Product Management'),
  ('TypeScript'),
  ('Next.js'),
  ('GraphQL'),
  ('SQL'),
  ('NoSQL'),
  ('Docker'),
  ('AWS'),
  ('Firebase'),
  ('DevOps'),
  ('Flutter'),
  ('React Native'),
  ('Swift'),
  ('Kotlin'),
  ('Java'),
  ('C#'),
  ('PHP'),
  ('Ruby'),
  ('Go'),
  ('Rust'),
  ('Digital Marketing'),
  ('SEO'),
  ('Content Writing'),
  ('Business Development'),
  ('Sales')
ON CONFLICT (name) DO NOTHING;

-- 10) Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 11) Create trigger for updated_at timestamp
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column(); 