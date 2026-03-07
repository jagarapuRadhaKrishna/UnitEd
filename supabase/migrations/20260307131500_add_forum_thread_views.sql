CREATE TABLE IF NOT EXISTS public.forum_thread_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid NOT NULL REFERENCES public.forum_threads(id) ON DELETE CASCADE,
  viewer_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  first_viewed_at timestamptz NOT NULL DEFAULT now(),
  last_viewed_at timestamptz NOT NULL DEFAULT now(),
  total_views integer NOT NULL DEFAULT 1,
  UNIQUE (thread_id, viewer_id)
);

CREATE INDEX IF NOT EXISTS forum_thread_views_thread_id_idx
  ON public.forum_thread_views(thread_id);

CREATE INDEX IF NOT EXISTS forum_thread_views_viewer_id_idx
  ON public.forum_thread_views(viewer_id);

ALTER TABLE public.forum_thread_views ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own forum thread views" ON public.forum_thread_views;
CREATE POLICY "Users can view their own forum thread views"
ON public.forum_thread_views
FOR SELECT
TO authenticated
USING (auth.uid() = viewer_id);

DROP POLICY IF EXISTS "Thread authors can view thread viewers" ON public.forum_thread_views;
CREATE POLICY "Thread authors can view thread viewers"
ON public.forum_thread_views
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.forum_threads ft
    WHERE ft.id = forum_thread_views.thread_id
      AND ft.author_id = auth.uid()
  )
);

CREATE OR REPLACE FUNCTION public.register_forum_thread_view(
  p_thread_id uuid,
  p_viewer_id uuid
)
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_unique_viewers bigint;
BEGIN
  INSERT INTO public.forum_thread_views (
    thread_id,
    viewer_id,
    first_viewed_at,
    last_viewed_at,
    total_views
  )
  VALUES (
    p_thread_id,
    p_viewer_id,
    now(),
    now(),
    1
  )
  ON CONFLICT (thread_id, viewer_id)
  DO UPDATE SET
    last_viewed_at = now(),
    total_views = public.forum_thread_views.total_views + 1;

  SELECT COUNT(*)
  INTO v_unique_viewers
  FROM public.forum_thread_views
  WHERE thread_id = p_thread_id;

  UPDATE public.forum_threads
  SET
    view_count = v_unique_viewers,
    updated_at = now()
  WHERE id = p_thread_id;

  RETURN v_unique_viewers;
END;
$$;

GRANT EXECUTE ON FUNCTION public.register_forum_thread_view(uuid, uuid) TO authenticated;
