CREATE OR REPLACE FUNCTION public.get_post_member_counts(post_ids uuid[])
RETURNS TABLE (
  post_id uuid,
  accepted_members bigint
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  WITH requested_posts AS (
    SELECT p.id, p.author_id, p.chatroom_id
    FROM public.posts p
    WHERE p.id = ANY(post_ids)
  ),
  attached_members AS (
    SELECT rp.id AS post_id, a.applicant_id AS user_id
    FROM requested_posts rp
    JOIN public.applications a
      ON a.post_id = rp.id
     AND a.status = 'accepted'

    UNION

    SELECT rp.id AS post_id, i.invitee_id AS user_id
    FROM requested_posts rp
    JOIN public.invitations i
      ON i.post_id = rp.id
     AND i.status = 'accepted'

    UNION

    SELECT rp.id AS post_id, cm.user_id AS user_id
    FROM requested_posts rp
    JOIN public.chatroom_members cm
      ON cm.chatroom_id = rp.chatroom_id
  )
  SELECT
    rp.id AS post_id,
    COUNT(DISTINCT am.user_id) FILTER (
      WHERE am.user_id IS NOT NULL
        AND am.user_id <> rp.author_id
    )::bigint AS accepted_members
  FROM requested_posts rp
  LEFT JOIN attached_members am
    ON am.post_id = rp.id
  GROUP BY rp.id;
$$;

GRANT EXECUTE ON FUNCTION public.get_post_member_counts(uuid[]) TO anon;
GRANT EXECUTE ON FUNCTION public.get_post_member_counts(uuid[]) TO authenticated;
