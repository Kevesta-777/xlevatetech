
-- Create RSS feeds management table
CREATE TABLE public.rss_feeds (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  url TEXT NOT NULL UNIQUE,
  category VARCHAR(100) NOT NULL,
  credibility_score INTEGER DEFAULT 80,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create RSS feed health tracking table
CREATE TABLE public.rss_feed_health (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  feed_id UUID REFERENCES public.rss_feeds(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL, -- 'healthy', 'warning', 'critical', 'offline'
  response_time_ms INTEGER,
  last_checked TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  error_message TEXT,
  total_items INTEGER DEFAULT 0,
  valid_items INTEGER DEFAULT 0,
  uptime_percentage DECIMAL(5,2) DEFAULT 100.00
);

-- Create cached RSS content table
CREATE TABLE public.rss_content_cache (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  feed_id UUID REFERENCES public.rss_feeds(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  link TEXT,
  pub_date TIMESTAMP WITH TIME ZONE,
  category VARCHAR(100),
  is_featured BOOLEAN DEFAULT false,
  cached_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '6 hours')
);

-- Create content automation workflows table
CREATE TABLE public.automation_workflows (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  workflow_type VARCHAR(100) NOT NULL, -- 'rss_aggregation', 'link_validation', 'content_optimization'
  status VARCHAR(50) NOT NULL DEFAULT 'active', -- 'active', 'paused', 'error'
  frequency_hours INTEGER NOT NULL DEFAULT 6,
  last_run TIMESTAMP WITH TIME ZONE,
  next_run TIMESTAMP WITH TIME ZONE,
  success_count INTEGER DEFAULT 0,
  error_count INTEGER DEFAULT 0,
  configuration JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create performance metrics table
CREATE TABLE public.blog_performance_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_type VARCHAR(100) NOT NULL, -- 'page_view', 'session', 'engagement', 'conversion'
  metric_name VARCHAR(255) NOT NULL,
  value DECIMAL(10,2) NOT NULL,
  metadata JSONB DEFAULT '{}',
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  date_bucket DATE NOT NULL DEFAULT CURRENT_DATE
);

-- Create user engagement analytics table
CREATE TABLE public.user_engagement_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID,
  page_path VARCHAR(500) NOT NULL,
  action_type VARCHAR(100) NOT NULL, -- 'view', 'click', 'share', 'like', 'scroll'
  element_id VARCHAR(255),
  duration_seconds INTEGER,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.rss_feeds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rss_feed_health ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rss_content_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_engagement_analytics ENABLE ROW LEVEL SECURITY;

-- Public read access for RSS content
CREATE POLICY "RSS feeds are viewable by everyone" ON public.rss_feeds FOR SELECT USING (true);
CREATE POLICY "RSS content cache is viewable by everyone" ON public.rss_content_cache FOR SELECT USING (true);

-- Admin access for management tables
CREATE POLICY "Admin users can manage RSS feeds" ON public.rss_feeds 
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.admin_users au 
    WHERE au.email = (auth.jwt() ->> 'email') 
    AND au.is_active = true
    AND au.role IN ('super_admin', 'admin')
  )
);

CREATE POLICY "Admin users can view RSS feed health" ON public.rss_feed_health 
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.admin_users au 
    WHERE au.email = (auth.jwt() ->> 'email') 
    AND au.is_active = true
  )
);

CREATE POLICY "Admin users can manage automation workflows" ON public.automation_workflows 
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.admin_users au 
    WHERE au.email = (auth.jwt() ->> 'email') 
    AND au.is_active = true
    AND au.role IN ('super_admin', 'admin')
  )
);

CREATE POLICY "Admin users can view performance metrics" ON public.blog_performance_metrics 
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.admin_users au 
    WHERE au.email = (auth.jwt() ->> 'email') 
    AND au.is_active = true
  )
);

CREATE POLICY "Anyone can insert engagement analytics" ON public.user_engagement_analytics 
FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin users can view engagement analytics" ON public.user_engagement_analytics 
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.admin_users au 
    WHERE au.email = (auth.jwt() ->> 'email') 
    AND au.is_active = true
  )
);

-- Insert default RSS feeds
INSERT INTO public.rss_feeds (name, url, category, credibility_score) VALUES
('McKinsey & Company', 'https://www.mckinsey.com/feed', 'AI Automation', 95),
('Deloitte Insights', 'https://www2.deloitte.com/us/en/insights.html', 'Finance', 92),
('Gartner Research', 'https://www.gartner.com/en/newsroom', 'AI Automation', 94),
('Healthcare Finance News', 'https://www.healthcarefinancenews.com', 'Healthcare', 78),
('Modern Healthcare', 'https://www.modernhealthcare.com', 'Healthcare', 80),
('American Banker', 'https://www.americanbanker.com', 'Finance', 79),
('Inman Real Estate', 'https://www.inman.com', 'Real Estate', 72);

-- Insert default automation workflows
INSERT INTO public.automation_workflows (name, description, workflow_type, frequency_hours, next_run) VALUES
('RSS Content Aggregation', 'Automatically fetch and curate content from trusted industry sources', 'rss_aggregation', 6, now() + INTERVAL '1 hour'),
('Link Validation & Health Check', 'Validate external links and update broken link status', 'link_validation', 2, now() + INTERVAL '30 minutes'),
('Market Data Refresh', 'Update automation market statistics and industry benchmarks', 'market_data_refresh', 24, now() + INTERVAL '1 hour'),
('Citation Source Verification', 'Verify citation sources and update credibility scores', 'citation_verification', 168, now() + INTERVAL '1 day'),
('SEO Content Optimization', 'Analyze and optimize content for search engines and readability', 'content_optimization', 12, now() + INTERVAL '2 hours');

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at columns
CREATE TRIGGER update_rss_feeds_updated_at BEFORE UPDATE ON public.rss_feeds 
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_automation_workflows_updated_at BEFORE UPDATE ON public.automation_workflows 
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
