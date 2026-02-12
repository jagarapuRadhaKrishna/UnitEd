-- Create security definer function to check chatroom membership
CREATE OR REPLACE FUNCTION public.is_chatroom_member(_user_id uuid, _chatroom_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.chatroom_members
    WHERE user_id = _user_id AND chatroom_id = _chatroom_id
  )
$$;

-- Fix chatroom_members SELECT policy using the function
DROP POLICY IF EXISTS "Chatroom members can view members" ON public.chatroom_members;

CREATE POLICY "Chatroom members can view members"
ON public.chatroom_members FOR SELECT
USING (public.is_chatroom_member(auth.uid(), chatroom_id));

-- Fix chatrooms SELECT policy
DROP POLICY IF EXISTS "Members can view their chatrooms" ON public.chatrooms;

CREATE POLICY "Members can view their chatrooms"
ON public.chatrooms FOR SELECT
USING (public.is_chatroom_member(auth.uid(), id));

-- Fix messages SELECT policy
DROP POLICY IF EXISTS "Chatroom members can view messages" ON public.messages;

CREATE POLICY "Chatroom members can view messages"
ON public.messages FOR SELECT
USING (public.is_chatroom_member(auth.uid(), chatroom_id));

-- Fix messages INSERT policy
DROP POLICY IF EXISTS "Chatroom members can send messages" ON public.messages;

CREATE POLICY "Chatroom members can send messages"
ON public.messages FOR INSERT
WITH CHECK (auth.uid() = sender_id AND public.is_chatroom_member(auth.uid(), chatroom_id));

-- Fix chatroom_members INSERT policy
DROP POLICY IF EXISTS "Users can be added to chatrooms" ON public.chatroom_members;

CREATE POLICY "Users can be added to chatrooms"
ON public.chatroom_members FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);