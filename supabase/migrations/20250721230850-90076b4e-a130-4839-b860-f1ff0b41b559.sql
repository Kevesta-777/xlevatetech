
-- Create posts table for blog content
CREATE TABLE public.posts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  excerpt text NOT NULL,
  slug text NOT NULL UNIQUE,
  category character varying NOT NULL,
  source_url text,
  author character varying NOT NULL,
  published_date timestamp with time zone NOT NULL DEFAULT now(),
  is_featured boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create resources table for downloadable content
CREATE TABLE public.resources (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  pdf_url text NOT NULL,
  download_count integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create newsletter table for subscriptions
CREATE TABLE public.newsletter (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email character varying NOT NULL UNIQUE,
  industry character varying NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter ENABLE ROW LEVEL SECURITY;

-- Create policies for anonymous SELECT on posts and resources
CREATE POLICY "Posts are viewable by everyone" 
  ON public.posts 
  FOR SELECT 
  USING (true);

CREATE POLICY "Resources are viewable by everyone" 
  ON public.resources 
  FOR SELECT 
  USING (true);

-- Admin users can manage posts and resources
CREATE POLICY "Admin users can manage posts" 
  ON public.posts 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM admin_users au 
    WHERE au.email = (auth.jwt() ->> 'email')::text 
    AND au.is_active = true 
    AND au.role IN ('super_admin', 'admin')
  ));

CREATE POLICY "Admin users can manage resources" 
  ON public.resources 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM admin_users au 
    WHERE au.email = (auth.jwt() ->> 'email')::text 
    AND au.is_active = true 
    AND au.role IN ('super_admin', 'admin')
  ));

-- Newsletter requires API key for INSERT (will be handled via Edge Function)
CREATE POLICY "Newsletter can be inserted via API" 
  ON public.newsletter 
  FOR INSERT 
  WITH CHECK (true);

-- Add updated_at trigger for posts
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON public.posts 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resources_updated_at BEFORE UPDATE ON public.resources 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for posts
INSERT INTO public.posts (title, excerpt, slug, category, source_url, author, published_date, is_featured) VALUES
('AI Automation Transforms Healthcare Operations in 2025', 'Leading medical institutions are implementing AI-driven automation systems to streamline patient care workflows and reduce operational costs by up to 40%.', 'ai-automation-healthcare-2025', 'healthcare', 'https://healthtech.com/ai-automation-2025', 'Dr. Sarah Chen', '2025-01-15 10:00:00+00', true),
('Financial Services Embrace Intelligent Process Automation', 'Banks and financial institutions are leveraging intelligent automation to enhance compliance, reduce fraud, and improve customer experience across digital channels.', 'financial-services-intelligent-automation', 'finance', 'https://fintech-news.com/intelligent-automation-2025', 'Michael Rodriguez', '2025-01-10 14:30:00+00', true),
('Real Estate Market Automation Reaches $303B by 2030', 'The real estate automation market is experiencing unprecedented growth, with AI-powered property management and transaction systems leading the transformation.', 'real-estate-automation-market-2030', 'real-estate', 'https://realestate-tech.com/automation-market-2030', 'Lisa Thompson', '2025-01-08 09:15:00+00', false),
('Manufacturing Industry Adopts Predictive Maintenance AI', 'Smart factories are implementing predictive maintenance systems that reduce downtime by 35% and maintenance costs by 25% through advanced AI algorithms.', 'manufacturing-predictive-maintenance-ai', 'industry-insight', 'https://manufacturing-today.com/predictive-ai-2025', 'James Wilson', '2025-01-05 16:20:00+00', true),
('Supply Chain Automation Reduces Costs by 30%', 'Companies implementing end-to-end supply chain automation are seeing significant cost reductions and improved efficiency across their operations.', 'supply-chain-automation-costs', 'industry-insight', 'https://supply-chain-tech.com/automation-savings-2025', 'Emily Davis', '2025-01-03 11:45:00+00', false),
('Customer Service Chatbots Achieve 95% Satisfaction Rate', 'Advanced AI chatbots are revolutionizing customer service with natural language processing and sentiment analysis capabilities.', 'customer-service-chatbots-satisfaction', 'technology', 'https://customer-service-tech.com/chatbots-2025', 'David Park', '2025-01-01 08:30:00+00', false),
('Robotic Process Automation in Government Agencies', 'Government agencies are modernizing their operations with RPA solutions that improve citizen services and reduce processing times by 60%.', 'rpa-government-agencies', 'government', 'https://gov-tech.com/rpa-agencies-2025', 'Maria Garcia', '2024-12-28 13:10:00+00', false),
('Cybersecurity Automation Prevents 80% of Attacks', 'Organizations using automated cybersecurity systems are significantly more effective at preventing and responding to cyber threats.', 'cybersecurity-automation-prevention', 'security', 'https://cybersecurity-news.com/automation-prevention-2025', 'Robert Kim', '2024-12-25 15:25:00+00', false);

-- Insert sample data for resources
INSERT INTO public.resources (title, description, pdf_url, download_count) VALUES
('AI Automation Implementation Guide 2025', 'Comprehensive guide covering best practices, frameworks, and case studies for implementing AI automation in enterprise environments.', '/resources/ai-automation-guide-2025.pdf', 2847),
('ROI Calculator for Business Process Automation', 'Interactive spreadsheet tool to calculate return on investment for various automation initiatives across different industries.', '/resources/roi-calculator-automation.xlsx', 1923),
('Automation Readiness Assessment Checklist', 'Strategic checklist to evaluate organizational readiness for automation implementation including technical, cultural, and process considerations.', '/resources/automation-readiness-checklist.pdf', 3156);
