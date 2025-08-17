-- Create leads table for chatbot lead capture
-- Migration: 20250101000000-create-leads-table.sql

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enums for lead management
CREATE TYPE lead_stage AS ENUM ('captured', 'qualified', 'disqualified', 'contacted', 'meeting_booked');
CREATE TYPE lead_source AS ENUM ('form', 'chatbot', 'linkedin', 'email');

-- Create leads table
CREATE TABLE public.leads (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone DEFAULT now(),
  first_name text,
  last_name text,
  email text,
  phone text,
  company_name text,
  industry_sector text,
  location text,
  company_size text,
  website_url text,
  role_title text,
  social_links text,
  pain_points text,
  budget_timeline text,
  notes text,
  score integer,
  stage lead_stage DEFAULT 'captured',
  source lead_source NOT NULL,
  campaign_id uuid,
  last_contacted_at timestamp with time zone,
  calendly_link text,
  opt_out boolean DEFAULT false,
  CONSTRAINT leads_pkey PRIMARY KEY (id)
);

-- Create indexes for better performance
CREATE INDEX idx_leads_email ON public.leads(email);
CREATE INDEX idx_leads_source ON public.leads(source);
CREATE INDEX idx_leads_stage ON public.leads(stage);
CREATE INDEX idx_leads_created_at ON public.leads(created_at);
CREATE INDEX idx_leads_company_name ON public.leads(company_name);

-- Enable Row Level Security
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Allow authenticated users to read leads
CREATE POLICY "Allow authenticated users to read leads" ON public.leads
  FOR SELECT USING (auth.role() = 'authenticated');

-- Allow anonymous users to insert leads (for chatbot)
CREATE POLICY "Allow anonymous users to insert leads" ON public.leads
  FOR INSERT WITH CHECK (true);

-- Allow service role to insert leads (for chatbot)
CREATE POLICY "Allow service role to insert leads" ON public.leads
  FOR INSERT WITH CHECK (auth.role() = 'service_role' OR auth.role() = 'authenticated');

-- Allow service role to update leads
CREATE POLICY "Allow service role to update leads" ON public.leads
  FOR UPDATE USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');

-- Add comments for documentation
COMMENT ON TABLE public.leads IS 'Stores lead information captured from various sources including chatbot';
COMMENT ON COLUMN public.leads.source IS 'Source of the lead: form, chatbot, linkedin, email';
COMMENT ON COLUMN public.leads.stage IS 'Current stage in the lead pipeline';
COMMENT ON COLUMN public.leads.score IS 'Lead score based on engagement and qualification';
COMMENT ON COLUMN public.leads.calendly_link IS 'Calendly link used for this lead'; 