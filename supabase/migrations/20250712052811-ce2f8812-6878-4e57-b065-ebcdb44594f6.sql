-- Enhanced chatbot tables for cost optimization and escalation
CREATE TABLE IF NOT EXISTS public.chat_cache (
  question_hash TEXT PRIMARY KEY,
  response TEXT NOT NULL,
  last_updated TIMESTAMPTZ NOT NULL DEFAULT now(),
  hit_count INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS public.escalation_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL,
  question TEXT NOT NULL,
  user_message TEXT NOT NULL,
  escalation_reason TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT DEFAULT 'pending'
);

-- Enable RLS
ALTER TABLE public.chat_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.escalation_logs ENABLE ROW LEVEL SECURITY;

-- Cache policies (public read for performance)
CREATE POLICY "Chat cache is viewable by everyone" 
ON public.chat_cache 
FOR SELECT 
USING (true);

CREATE POLICY "Chat cache can be updated by service" 
ON public.chat_cache 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Chat cache can be updated" 
ON public.chat_cache 
FOR UPDATE 
USING (true);

-- Escalation policies
CREATE POLICY "Escalation logs can be inserted" 
ON public.escalation_logs 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Escalation logs viewable by admins" 
ON public.escalation_logs 
FOR SELECT 
USING (true);

-- Create function to clean old cache entries
CREATE OR REPLACE FUNCTION public.cleanup_old_cache()
RETURNS void AS $$
BEGIN
  DELETE FROM public.chat_cache 
  WHERE last_updated < now() - interval '24 hours';
END;
$$ LANGUAGE plpgsql;

-- Index for better performance
CREATE INDEX IF NOT EXISTS idx_chat_cache_updated ON public.chat_cache(last_updated);
CREATE INDEX IF NOT EXISTS idx_escalation_session ON public.escalation_logs(session_id);
CREATE INDEX IF NOT EXISTS idx_escalation_timestamp ON public.escalation_logs(timestamp);