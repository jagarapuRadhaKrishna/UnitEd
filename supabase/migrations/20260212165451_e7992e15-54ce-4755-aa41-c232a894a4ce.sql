-- Fix self-referencing RLS on chatroom_members
DROP POLICY IF EXISTS "Chatroom members can view members" ON public.chatroom_members;

CREATE POLICY "Chatroom members can view members"
ON public.chatroom_members FOR SELECT
USING (auth.uid() = user_id OR EXISTS (
  SELECT 1 FROM chatroom_members cm2
  WHERE cm2.chatroom_id = chatroom_members.chatroom_id
  AND cm2.user_id = auth.uid()
));

-- Also fix chatrooms SELECT to allow direct member check
DROP POLICY IF EXISTS "Members can view their chatrooms" ON public.chatrooms;

CREATE POLICY "Members can view their chatrooms"
ON public.chatrooms FOR SELECT
USING (EXISTS (
  SELECT 1 FROM chatroom_members
  WHERE chatroom_members.chatroom_id = chatrooms.id
  AND chatroom_members.user_id = auth.uid()
));