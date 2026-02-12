-- Create storage bucket for chat files (images, documents)
INSERT INTO storage.buckets (id, name, public) VALUES ('chat-files', 'chat-files', true)
ON CONFLICT (id) DO NOTHING;

-- Allow chatroom members to upload files
CREATE POLICY "Authenticated users can upload chat files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'chat-files' AND auth.uid() IS NOT NULL);

-- Allow anyone to view chat files (public bucket)
CREATE POLICY "Chat files are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'chat-files');

-- Allow users to delete their own uploads
CREATE POLICY "Users can delete own chat files"
ON storage.objects FOR DELETE
USING (bucket_id = 'chat-files' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow authenticated users to create chatrooms (needed for auto-creation on accept)
CREATE POLICY "Authenticated users can create chatrooms"
ON public.chatrooms FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Allow chatroom owners to update chatrooms
CREATE POLICY "Members can update chatrooms"
ON public.chatrooms FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM chatroom_members
  WHERE chatroom_members.chatroom_id = chatrooms.id
  AND chatroom_members.user_id = auth.uid()
));