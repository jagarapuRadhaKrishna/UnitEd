
-- =============================================
-- POSTS TABLE
-- =============================================
CREATE TABLE public.posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  purpose text NOT NULL CHECK (purpose IN ('Research Work', 'Projects', 'Hackathons')),
  skill_requirements jsonb NOT NULL DEFAULT '[]'::jsonb,
  author_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'filled', 'closed', 'archived')),
  chatroom_enabled boolean NOT NULL DEFAULT false,
  chatroom_id uuid,
  max_members integer,
  current_members integer NOT NULL DEFAULT 0,
  deadline timestamptz,
  chat_grace_days integer DEFAULT 7,
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active posts" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create posts" ON public.posts FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors can update own posts" ON public.posts FOR UPDATE TO authenticated USING (auth.uid() = author_id) WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors can delete own posts" ON public.posts FOR DELETE TO authenticated USING (auth.uid() = author_id);

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON public.posts FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =============================================
-- APPLICATIONS TABLE
-- =============================================
CREATE TABLE public.applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  applicant_id uuid NOT NULL,
  applied_for_skill text,
  resume text,
  cover_letter text,
  answers jsonb DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'applied' CHECK (status IN ('applied', 'shortlisted', 'accepted', 'rejected', 'withdrawn')),
  is_recommended boolean DEFAULT false,
  match_score numeric,
  applied_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz,
  UNIQUE(post_id, applicant_id)
);

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Applicants can view own applications" ON public.applications FOR SELECT TO authenticated USING (auth.uid() = applicant_id);
CREATE POLICY "Post authors can view applications to their posts" ON public.applications FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.posts WHERE posts.id = applications.post_id AND posts.author_id = auth.uid())
);
CREATE POLICY "Authenticated users can create applications" ON public.applications FOR INSERT TO authenticated WITH CHECK (auth.uid() = applicant_id);
CREATE POLICY "Post authors can update application status" ON public.applications FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.posts WHERE posts.id = applications.post_id AND posts.author_id = auth.uid())
);
CREATE POLICY "Applicants can update own applications" ON public.applications FOR UPDATE TO authenticated USING (auth.uid() = applicant_id) WITH CHECK (auth.uid() = applicant_id);

CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON public.applications FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =============================================
-- INVITATIONS TABLE
-- =============================================
CREATE TABLE public.invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  inviter_id uuid NOT NULL,
  invitee_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'cancelled')),
  seen_at timestamptz,
  responded_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Invitees can view received invitations" ON public.invitations FOR SELECT TO authenticated USING (auth.uid() = invitee_id);
CREATE POLICY "Inviters can view sent invitations" ON public.invitations FOR SELECT TO authenticated USING (auth.uid() = inviter_id);
CREATE POLICY "Post authors can create invitations" ON public.invitations FOR INSERT TO authenticated WITH CHECK (auth.uid() = inviter_id);
CREATE POLICY "Invitees can update invitation status" ON public.invitations FOR UPDATE TO authenticated USING (auth.uid() = invitee_id);
CREATE POLICY "Inviters can cancel invitations" ON public.invitations FOR UPDATE TO authenticated USING (auth.uid() = inviter_id);

-- =============================================
-- CHATROOMS TABLE
-- =============================================
CREATE TABLE public.chatrooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'read_only', 'deleted')),
  expires_at timestamptz,
  deleted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  last_activity timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.chatrooms ENABLE ROW LEVEL SECURITY;

-- =============================================
-- CHATROOM_MEMBERS TABLE
-- =============================================
CREATE TABLE public.chatroom_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chatroom_id uuid NOT NULL REFERENCES public.chatrooms(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  role text NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'member')),
  joined_at timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz,
  UNIQUE(chatroom_id, user_id)
);

ALTER TABLE public.chatroom_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view their chatrooms" ON public.chatrooms FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.chatroom_members WHERE chatroom_members.chatroom_id = chatrooms.id AND chatroom_members.user_id = auth.uid())
);
CREATE POLICY "Chatroom members can view members" ON public.chatroom_members FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.chatroom_members cm WHERE cm.chatroom_id = chatroom_members.chatroom_id AND cm.user_id = auth.uid())
);
CREATE POLICY "Authenticated users can be added to chatrooms" ON public.chatroom_members FOR INSERT TO authenticated WITH CHECK (true);

-- =============================================
-- MESSAGES TABLE
-- =============================================
CREATE TABLE public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chatroom_id uuid NOT NULL REFERENCES public.chatrooms(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL,
  content text NOT NULL,
  type text NOT NULL DEFAULT 'text' CHECK (type IN ('text', 'file', 'system')),
  file_url text,
  file_name text,
  read_by uuid[] DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Chatroom members can view messages" ON public.messages FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.chatroom_members WHERE chatroom_members.chatroom_id = messages.chatroom_id AND chatroom_members.user_id = auth.uid())
);
CREATE POLICY "Chatroom members can send messages" ON public.messages FOR INSERT TO authenticated WITH CHECK (
  auth.uid() = sender_id AND
  EXISTS (SELECT 1 FROM public.chatroom_members WHERE chatroom_members.chatroom_id = messages.chatroom_id AND chatroom_members.user_id = auth.uid())
);

-- =============================================
-- NOTIFICATIONS TABLE
-- =============================================
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  link text,
  read boolean NOT NULL DEFAULT false,
  related_user_id uuid,
  related_post_id uuid,
  related_chatroom_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Authenticated users can create notifications" ON public.notifications FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own notifications" ON public.notifications FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- =============================================
-- FORUM TABLES
-- =============================================
CREATE TABLE public.forum_threads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  category text NOT NULL DEFAULT 'general',
  author_id uuid NOT NULL,
  is_pinned boolean DEFAULT false,
  is_locked boolean DEFAULT false,
  view_count integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.forum_threads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view forum threads" ON public.forum_threads FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create threads" ON public.forum_threads FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors can update own threads" ON public.forum_threads FOR UPDATE TO authenticated USING (auth.uid() = author_id);

CREATE TRIGGER update_forum_threads_updated_at BEFORE UPDATE ON public.forum_threads FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.forum_replies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid NOT NULL REFERENCES public.forum_threads(id) ON DELETE CASCADE,
  author_id uuid NOT NULL,
  content text NOT NULL,
  parent_reply_id uuid REFERENCES public.forum_replies(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.forum_replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view forum replies" ON public.forum_replies FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create replies" ON public.forum_replies FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors can update own replies" ON public.forum_replies FOR UPDATE TO authenticated USING (auth.uid() = author_id);

CREATE TRIGGER update_forum_replies_updated_at BEFORE UPDATE ON public.forum_replies FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX idx_posts_author_id ON public.posts(author_id);
CREATE INDEX idx_posts_status ON public.posts(status);
CREATE INDEX idx_posts_purpose ON public.posts(purpose);
CREATE INDEX idx_applications_post_id ON public.applications(post_id);
CREATE INDEX idx_applications_applicant_id ON public.applications(applicant_id);
CREATE INDEX idx_applications_status ON public.applications(status);
CREATE INDEX idx_invitations_invitee_id ON public.invitations(invitee_id);
CREATE INDEX idx_invitations_inviter_id ON public.invitations(inviter_id);
CREATE INDEX idx_chatroom_members_user_id ON public.chatroom_members(user_id);
CREATE INDEX idx_messages_chatroom_id ON public.messages(chatroom_id);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_read ON public.notifications(user_id, read);
CREATE INDEX idx_forum_threads_category ON public.forum_threads(category);
CREATE INDEX idx_forum_replies_thread_id ON public.forum_replies(thread_id);
