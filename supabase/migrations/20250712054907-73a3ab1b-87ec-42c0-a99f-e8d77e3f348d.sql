-- Update the check constraint to allow more categories
ALTER TABLE knowledge_base DROP CONSTRAINT IF EXISTS knowledge_base_category_check;

ALTER TABLE knowledge_base ADD CONSTRAINT knowledge_base_category_check 
CHECK (category = ANY (ARRAY[
  'services', 'roi', 'implementation', 'company', 'support', 'pricing', 
  'technical', 'compliance', 'benefits', 'getting-started', 'industry', 'general'
]));

-- Insert comprehensive knowledge base entries for enhanced chatbot
INSERT INTO knowledge_base (question, answer, category) VALUES
('What industries do you serve?', 'We specialize in financial services, healthcare, and real estate automation. Our solutions are designed for compliance-heavy teams, operational leaders, and businesses looking to eliminate manual processes.', 'services'),
('Where are you located?', 'Xlevate Tech is based in Chicago, serving clients nationwide. We offer both remote and on-site consultation depending on project needs.', 'company'),
('How do I contact support?', 'For urgent matters, email raj.dalal@xlevatetech.com. For general inquiries, use our contact form or schedule a 15-min discovery call via our calendar link.', 'support'),
('What is your response time?', 'We typically respond within 2 business hours during weekdays. For existing project clients, response time is within 1 hour during business hours.', 'support'),
('Do you offer free consultations?', 'Yes! We offer a free 15-minute discovery call to assess your automation needs and determine if we''re a good fit for your project.', 'services'),
('What are your hours of operation?', 'Our standard business hours are Monday-Friday, 9:00 AM - 6:00 PM CST. We''re available for urgent client matters outside these hours.', 'company'),
('How much do your services cost?', 'Our pricing varies based on project scope and complexity. Implementation costs typically range from $15,000-$150,000 depending on your needs. Schedule a consultation for a detailed quote.', 'pricing'),
('What is your typical ROI?', 'Our clients typically see 160-210% ROI within 12 months. Time savings range from 35-70% and error reduction of 40-80% depending on the industry and process complexity.', 'roi'),
('How long does implementation take?', 'Most automation projects take 4-12 weeks from start to finish. This includes discovery, design, development, testing, and deployment phases.', 'implementation'),
('Do you provide training?', 'Yes, we include comprehensive training for your team as part of every implementation. We also provide documentation and ongoing support for 90 days post-launch.', 'services'),
('What platforms do you work with?', 'We work with Zapier, Make.com, custom Python/RPA solutions, QuickBooks, Salesforce, EHR systems, and most major business platforms. We can integrate almost any system.', 'technical'),
('Are your solutions HIPAA compliant?', 'Yes, we specialize in HIPAA, FINRA, and SOC2-compliant automation solutions. All our healthcare implementations include proper encryption and audit trails.', 'compliance'),
('Can you help with data migration?', 'Absolutely! We offer comprehensive data migration services including Excel to modern platforms (AppFolio, Yardi), data cleanup, and tenant balance reconciliation.', 'services'),
('Do you offer ongoing support?', 'Yes, we provide 90 days of included support post-implementation, with optional ongoing maintenance packages available for long-term optimization and updates.', 'support'),
('automation benefits', 'Automation delivers 40-70% time savings, 30-50% error reduction, 24/7 operational capacity, and measurable ROI within 90 days. Perfect for eliminating repetitive manual tasks.', 'benefits'),
('getting started automation', 'Start with our free ROI calculator to estimate savings, then schedule a 15-min discovery call. We''ll assess your processes and create a custom automation roadmap.', 'getting-started'),
('healthcare automation', 'We specialize in patient intake automation, billing processes, compliance reporting, and EHR integrations. Our healthcare clients see average 72% error reduction and HIPAA compliance.', 'industry'),
('real estate automation', 'Our real estate solutions include lease processing automation, tenant management, financial reporting, and property data migrations. Typical results: 67% faster document handling.', 'industry'),
('financial services automation', 'We automate compliance reporting, client onboarding, data validation, and financial workflows. Financial clients typically achieve 58% faster processing and regulatory compliance.', 'industry');