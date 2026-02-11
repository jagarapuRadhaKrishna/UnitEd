
-- Fix overly permissive chatroom_members INSERT policy
DROP POLICY "Authenticated users can be added to chatrooms" ON public.chatroom_members;
CREATE POLICY "Users can be added to chatrooms" ON public.chatroom_members 
  FOR INSERT TO authenticated 
  WITH CHECK (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM public.chatroom_members cm 
    JOIN public.chatrooms c ON c.id = cm.chatroom_id 
    WHERE cm.chatroom_id = chatroom_members.chatroom_id 
    AND cm.user_id = auth.uid() 
    AND cm.role = 'owner'
  ));

-- Fix overly permissive notifications INSERT policy
DROP POLICY "Authenticated users can create notifications" ON public.notifications;
CREATE POLICY "System can create notifications for users" ON public.notifications 
  FOR INSERT TO authenticated 
  WITH CHECK (auth.uid() IS NOT NULL);
