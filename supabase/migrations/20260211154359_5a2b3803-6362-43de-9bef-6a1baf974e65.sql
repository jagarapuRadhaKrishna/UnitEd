
-- 1. Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'student'),
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', '')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Profiles: allow INSERT for own profile (backup if trigger fails)
CREATE POLICY "Allow users to insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 3. Profiles: allow public SELECT for viewing other users' profiles
DROP POLICY IF EXISTS "Allow access to own profile" ON public.profiles;
CREATE POLICY "Allow authenticated users to view profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

-- 4. Posts: allow authenticated users to insert posts
CREATE POLICY "Allow authenticated users to insert posts"
  ON public.posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

-- 5. Applications: full CRUD for own applications
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Applicants can view own applications"
  ON public.applications FOR SELECT
  TO authenticated
  USING (auth.uid() = applicant_id);

CREATE POLICY "Post authors can view applications to their posts"
  ON public.applications FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.posts WHERE posts.id = applications.post_id AND posts.author_id = auth.uid()
  ));

CREATE POLICY "Applicants can insert applications"
  ON public.applications FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = applicant_id);

CREATE POLICY "Applicants can update own applications"
  ON public.applications FOR UPDATE
  TO authenticated
  USING (auth.uid() = applicant_id);

CREATE POLICY "Post authors can update applications to their posts"
  ON public.applications FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.posts WHERE posts.id = applications.post_id AND posts.author_id = auth.uid()
  ));

-- 6. Invitations: allow insert/update
DROP POLICY IF EXISTS "Allow invitee to see invitation" ON public.invitations;
DROP POLICY IF EXISTS "Allow inviter to see invitation" ON public.invitations;

CREATE POLICY "Users can see own invitations"
  ON public.invitations FOR SELECT
  TO authenticated
  USING (auth.uid() = invitee_id OR auth.uid() = inviter_id);

CREATE POLICY "Inviters can create invitations"
  ON public.invitations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = inviter_id);

CREATE POLICY "Invitees can update invitations"
  ON public.invitations FOR UPDATE
  TO authenticated
  USING (auth.uid() = invitee_id);

CREATE POLICY "Inviters can update own invitations"
  ON public.invitations FOR UPDATE
  TO authenticated
  USING (auth.uid() = inviter_id);

-- 7. Notifications: allow insert and update
CREATE POLICY "System can insert notifications"
  ON public.notifications FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- 8. Messages: allow members to read messages
CREATE POLICY "Members can read messages"
  ON public.messages FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM chatroom_members
    WHERE chatroom_members.chatroom_id = messages.chatroom_id
    AND chatroom_members.user_id = auth.uid()
  ));

-- 9. Chatrooms & members: policies
ALTER TABLE public.chatrooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chatroom_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view chatrooms"
  ON public.chatrooms FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM chatroom_members
    WHERE chatroom_members.chatroom_id = chatrooms.id
    AND chatroom_members.user_id = auth.uid()
  ));

CREATE POLICY "Post authors can create chatrooms"
  ON public.chatrooms FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.posts WHERE posts.id = chatrooms.post_id AND posts.author_id = auth.uid()
  ));

CREATE POLICY "Members can view membership"
  ON public.chatroom_members FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM chatroom_members cm
    WHERE cm.chatroom_id = chatroom_members.chatroom_id
    AND cm.user_id = auth.uid()
  ));

CREATE POLICY "Authenticated can join chatrooms"
  ON public.chatroom_members FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 10. Connection requests: allow update
CREATE POLICY "Receivers can update connection requests"
  ON public.connection_requests FOR UPDATE
  TO authenticated
  USING (auth.uid() = receiver_id);

-- 11. Add updated_at triggers to tables that need them
CREATE TRIGGER set_applications_updated_at
  BEFORE UPDATE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_invitations_updated_at
  BEFORE UPDATE ON public.invitations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_connection_requests_updated_at
  BEFORE UPDATE ON public.connection_requests
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
