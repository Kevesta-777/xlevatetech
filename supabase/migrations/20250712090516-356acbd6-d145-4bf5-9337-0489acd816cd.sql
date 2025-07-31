-- Optimize RLS policies by caching auth.uid() result
ALTER POLICY "Users can update their own conversations" ON public.conversations
USING ((user_id = (auth.uid())));

ALTER POLICY "Users can view their own conversations" ON public.conversations
USING ((user_id = (auth.uid())));

-- Also optimize the messages policy for better performance
ALTER POLICY "Users can view messages from their conversations" ON public.messages
USING ((session_id IN ( 
  SELECT conversations.session_id
  FROM conversations
  WHERE ((conversations.user_id = (auth.uid())) OR (conversations.user_id IS NULL))
)));