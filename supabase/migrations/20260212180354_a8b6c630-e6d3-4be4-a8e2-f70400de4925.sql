-- Fix: Add missing inviter (Pavan) to chatroom
INSERT INTO public.chatroom_members (chatroom_id, user_id, role)
VALUES ('ca0bb52c-574b-4ce2-b987-5c64d39ce61a', '9dcf8b27-8b7a-407b-810b-24e63a9e9454', 'owner')
ON CONFLICT DO NOTHING;