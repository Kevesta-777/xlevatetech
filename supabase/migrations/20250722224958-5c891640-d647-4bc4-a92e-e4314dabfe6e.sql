-- Create chat_logs table for storing chatbot conversation data
CREATE TABLE public.chat_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL,
  name VARCHAR,
  industry VARCHAR,
  needs TEXT,
  transcript JSONB DEFAULT '[]'::jsonb,
  consent_given BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.chat_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for chat logs
CREATE POLICY "Anyone can create chat logs" 
ON public.chat_logs 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admin users can view chat logs" 
ON public.chat_logs 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM admin_users au 
  WHERE au.email = auth.jwt()->>'email' 
  AND au.is_active = true
));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_chat_logs_updated_at
BEFORE UPDATE ON public.chat_logs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();