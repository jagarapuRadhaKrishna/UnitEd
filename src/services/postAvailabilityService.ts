import { supabase } from '@/integrations/supabase/client';

export const getLocalDateKey = (date = new Date()) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const normalizeDeadlineKey = (deadline?: string | null) => {
  if (!deadline) return null;
  return deadline.slice(0, 10);
};

export const isPostDeadlineReached = (deadline?: string | null, now = new Date()) => {
  const normalizedDeadline = normalizeDeadlineKey(deadline);
  if (!normalizedDeadline) return false;
  return getLocalDateKey(now) > normalizedDeadline;
};

export const syncExpiredPosts = async () => {
  const today = getLocalDateKey();
  const { error } = await supabase
    .from('posts')
    .update({ status: 'closed', updated_at: new Date().toISOString() })
    .eq('status', 'active')
    .not('deadline', 'is', null)
    .lt('deadline', today);

  if (error) {
    console.error('Failed to sync expired posts:', error);
  }
};

export const fetchPostMemberCounts = async (postIds: string[]) => {
  const uniquePostIds = Array.from(new Set(postIds.filter(Boolean)));
  if (uniquePostIds.length === 0) return new Map<string, number>();

  const { data, error } = await supabase.rpc('get_post_member_counts', { post_ids: uniquePostIds });
  if (error) {
    console.error('Failed to fetch post member counts:', error);
    return new Map<string, number>();
  }

  return new Map((data || []).map((row) => [row.post_id, Number(row.accepted_members || 0)]));
};

export const syncPostCurrentMembers = async (postId: string) => {
  const { data: post, error: postError } = await supabase
    .from('posts')
    .select('id, author_id, chatroom_id, current_members, max_members, skill_requirements, status, deadline')
    .eq('id', postId)
    .maybeSingle();

  if (postError) {
    console.error('Failed to load post members:', postError);
    return null;
  }

  if (!post) return null;

  const [
    { data: acceptedApps, error: appsError },
    { data: acceptedInvs, error: invitationsError },
    chatMembersRes,
  ] = await Promise.all([
    supabase
      .from('applications')
      .select('applicant_id')
      .eq('post_id', postId)
      .eq('status', 'accepted'),
    supabase
      .from('invitations')
      .select('invitee_id')
      .eq('post_id', postId)
      .eq('status', 'accepted'),
    post.chatroom_id
      ? supabase.from('chatroom_members').select('user_id').eq('chatroom_id', post.chatroom_id)
      : Promise.resolve({ data: [] as { user_id: string }[], error: null }),
  ]);

  if (appsError || invitationsError || chatMembersRes.error) {
    console.error('Failed to calculate post members:', appsError || invitationsError || chatMembersRes.error);
    return post.current_members ?? 0;
  }

  const memberSet = new Set<string>();
  (acceptedApps || []).forEach((entry: { applicant_id: string }) => memberSet.add(entry.applicant_id));
  (acceptedInvs || []).forEach((entry: { invitee_id: string }) => memberSet.add(entry.invitee_id));
  (chatMembersRes.data || []).forEach((entry: { user_id: string }) => memberSet.add(entry.user_id));

  const membersExcludingAuthor = Math.max(0, memberSet.has(post.author_id) ? memberSet.size - 1 : memberSet.size);
  const requirements = Array.isArray(post.skill_requirements) ? post.skill_requirements : [];
  const requiredMembers =
    post.max_members ??
    requirements.reduce((sum: number, requirement: any) => sum + (requirement.requiredCount || 0), 0);

  let nextStatus = post.status;
  if (requiredMembers > 0 && !isPostDeadlineReached(post.deadline)) {
    if (membersExcludingAuthor >= requiredMembers && post.status === 'active') {
      nextStatus = 'filled';
    } else if (membersExcludingAuthor < requiredMembers && post.status === 'filled') {
      nextStatus = 'active';
    }
  }

  if ((post.current_members ?? 0) !== membersExcludingAuthor || nextStatus !== post.status) {
    const { error: updateError } = await supabase
      .from('posts')
      .update({ current_members: membersExcludingAuthor, status: nextStatus })
      .eq('id', postId);

    if (updateError) {
      console.error('Failed to sync post current members:', updateError);
    }
  }

  return membersExcludingAuthor;
};
