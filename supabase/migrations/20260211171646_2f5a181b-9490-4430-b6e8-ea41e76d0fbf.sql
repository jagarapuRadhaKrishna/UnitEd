
-- Drop and recreate the handle_new_user function to extract ALL registration fields from metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (
    id, email, role, first_name, middle_name, last_name,
    contact_no, gender, skills, profile_picture_url, portfolio,
    roll_number, department, year_of_graduation, experience,
    projects, achievements, resume_url,
    employee_id, designation, date_of_joining, qualification,
    specialization, total_experience, teaching_experience, industry_experience
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    NEW.raw_user_meta_data->>'middle_name',
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    NEW.raw_user_meta_data->>'contact_no',
    NEW.raw_user_meta_data->>'gender',
    CASE 
      WHEN NEW.raw_user_meta_data->'skills' IS NOT NULL 
      THEN ARRAY(SELECT jsonb_array_elements_text(NEW.raw_user_meta_data->'skills'))
      ELSE '{}'::text[]
    END,
    NEW.raw_user_meta_data->>'profile_picture_url',
    NEW.raw_user_meta_data->>'portfolio',
    NEW.raw_user_meta_data->>'roll_number',
    NEW.raw_user_meta_data->>'department',
    CASE 
      WHEN NEW.raw_user_meta_data->>'year_of_graduation' IS NOT NULL 
      THEN (NEW.raw_user_meta_data->>'year_of_graduation')::integer 
      ELSE NULL 
    END,
    NEW.raw_user_meta_data->>'experience',
    COALESCE(NEW.raw_user_meta_data->'projects', '[]'::jsonb),
    COALESCE(NEW.raw_user_meta_data->'achievements', '[]'::jsonb),
    NEW.raw_user_meta_data->>'resume_url',
    NEW.raw_user_meta_data->>'employee_id',
    NEW.raw_user_meta_data->>'designation',
    NEW.raw_user_meta_data->>'date_of_joining',
    NEW.raw_user_meta_data->>'qualification',
    CASE 
      WHEN NEW.raw_user_meta_data->>'specialization' IS NOT NULL 
      THEN ARRAY[NEW.raw_user_meta_data->>'specialization']
      ELSE '{}'::text[]
    END,
    CASE 
      WHEN NEW.raw_user_meta_data->>'total_experience' IS NOT NULL 
      THEN (NEW.raw_user_meta_data->>'total_experience')::integer 
      ELSE NULL 
    END,
    CASE 
      WHEN NEW.raw_user_meta_data->>'teaching_experience' IS NOT NULL 
      THEN (NEW.raw_user_meta_data->>'teaching_experience')::integer 
      ELSE NULL 
    END,
    CASE 
      WHEN NEW.raw_user_meta_data->>'industry_experience' IS NOT NULL 
      THEN (NEW.raw_user_meta_data->>'industry_experience')::integer 
      ELSE NULL 
    END
  );
  RETURN NEW;
END;
$$;

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
