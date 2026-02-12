-- Drop existing SELECT policy
DROP POLICY IF EXISTS "Members can view their chatrooms" ON public.chatrooms;

-- Create a broader SELECT policy: members OR post author can view
CREATE POLICY "Members or post authors can view chatrooms"
ON public.chatrooms
FOR SELECT
TO authenticated
USING (
  is_chatroom_member(auth.uid(), id)
  OR EXISTS (
    SELECT 1 FROM posts WHERE posts.id = chatrooms.post_id AND posts.author_id = auth.uid()
  )
  OR EXISTS (
    SELECT 1 FROM invitations 
    WHERE invitations.post_id = chatrooms.post_id 
    AND (invitations.inviter_id = auth.uid() OR invitations.invitee_id = auth.uid())
    AND invitations.status = 'accepted'
  )
);