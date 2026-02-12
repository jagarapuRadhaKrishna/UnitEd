-- Create chatroom for already-accepted Python application
DO $$
DECLARE
  new_chatroom_id uuid;
BEGIN
  -- Create the chatroom
  INSERT INTO public.chatrooms (post_id, status)
  VALUES ('7cb499b0-b889-4a01-b9c1-1edead04424b', 'active')
  RETURNING id INTO new_chatroom_id;

  -- Add post author (owner)
  INSERT INTO public.chatroom_members (chatroom_id, user_id, role)
  VALUES (new_chatroom_id, '9dcf8b27-8b7a-407b-810b-24e63a9e9454', 'owner');

  -- Add accepted applicant (member)
  INSERT INTO public.chatroom_members (chatroom_id, user_id, role)
  VALUES (new_chatroom_id, '4f009b9a-7b8a-46e7-9705-93aa28085f2a', 'member');

  -- Update post with chatroom reference
  UPDATE public.posts
  SET chatroom_id = new_chatroom_id, chatroom_enabled = true
  WHERE id = '7cb499b0-b889-4a01-b9c1-1edead04424b';

  -- Add welcome system message
  INSERT INTO public.messages (chatroom_id, sender_id, content, type)
  VALUES (new_chatroom_id, '9dcf8b27-8b7a-407b-810b-24e63a9e9454', 'Welcome to the Python project chatroom! 🎉', 'system');
END $$;