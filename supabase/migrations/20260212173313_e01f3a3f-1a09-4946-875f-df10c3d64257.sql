-- Drop the existing restrictive INSERT policy on chatrooms
DROP POLICY IF EXISTS "Authenticated users can create chatrooms" ON public.chatrooms;

-- Recreate as a permissive policy
CREATE POLICY "Authenticated users can create chatrooms"
ON public.chatrooms
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

-- Also fix chatroom_members INSERT policy
DROP POLICY IF EXISTS "Users can be added to chatrooms" ON public.chatroom_members;

CREATE POLICY "Users can be added to chatrooms"
ON public.chatroom_members
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);