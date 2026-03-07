CREATE OR REPLACE FUNCTION public.get_public_landing_stats()
RETURNS TABLE (
  total_users BIGINT,
  total_students BIGINT,
  total_faculty BIGINT,
  completed_projects BIGINT
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    (SELECT COUNT(*) FROM public.profiles),
    (SELECT COUNT(*) FROM public.profiles WHERE role = 'student'),
    (SELECT COUNT(*) FROM public.profiles WHERE role = 'faculty'),
    (SELECT COUNT(*) FROM public.posts WHERE status IN ('filled', 'closed', 'archived'));
$$;

GRANT EXECUTE ON FUNCTION public.get_public_landing_stats() TO anon;
GRANT EXECUTE ON FUNCTION public.get_public_landing_stats() TO authenticated;
