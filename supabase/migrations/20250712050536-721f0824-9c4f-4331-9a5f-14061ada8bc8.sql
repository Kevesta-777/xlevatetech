-- Create conversations table
CREATE TABLE public.conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create messages table
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.conversations(session_id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create knowledge_base table
CREATE TABLE public.knowledge_base (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('services', 'roi', 'implementation')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_base ENABLE ROW LEVEL SECURITY;

-- Create policies for conversations
CREATE POLICY "Users can view their own conversations" 
ON public.conversations 
FOR SELECT 
USING (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Anyone can create conversations" 
ON public.conversations 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update their own conversations" 
ON public.conversations 
FOR UPDATE 
USING (user_id = auth.uid() OR user_id IS NULL);

-- Create policies for messages
CREATE POLICY "Users can view messages from their conversations" 
ON public.messages 
FOR SELECT 
USING (
  session_id IN (
    SELECT session_id FROM public.conversations 
    WHERE user_id = auth.uid() OR user_id IS NULL
  )
);

CREATE POLICY "Anyone can create messages" 
ON public.messages 
FOR INSERT 
WITH CHECK (true);

-- Create policies for knowledge_base (public read access)
CREATE POLICY "Knowledge base is viewable by everyone" 
ON public.knowledge_base 
FOR SELECT 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_conversations_updated_at
BEFORE UPDATE ON public.conversations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample knowledge base data
INSERT INTO public.knowledge_base (question, answer, category) VALUES
('How long does implementation take?', 'Typical timelines: Process automation: 2-4 weeks, Full AI integration: 4-8 weeks. Timeline depends on complexity and current systems.', 'implementation'),
('What ROI can I expect?', 'Most clients see 40-70% efficiency improvements within 3 months. Average cost savings range from $50K-$500K annually depending on scale.', 'roi'),
('Do you work with healthcare?', 'Yes, we specialize in HIPAA-compliant healthcare automation including patient data processing, appointment scheduling, and billing automation.', 'services'),
('What about manufacturing?', 'We help manufacturers with quality control automation, predictive maintenance, inventory management, and production optimization.', 'services'),
('Is this secure?', 'All solutions use enterprise-grade encryption, comply with industry standards (HIPAA, SOC2), and include regular security audits.', 'implementation'),
('What technologies do you use?', 'We leverage AI/ML, RPA tools, custom APIs, cloud platforms (AWS, Azure), and integrate with existing systems like CRM, ERP, and databases.', 'services');