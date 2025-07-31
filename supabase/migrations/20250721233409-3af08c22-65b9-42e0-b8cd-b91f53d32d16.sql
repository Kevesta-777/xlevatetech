
-- Add more sample posts for better blog content coverage
-- This will provide 8-10 high-quality articles across different categories

-- Add 5 more industry insight posts
INSERT INTO public.posts (title, excerpt, author, category, published_date, is_featured, source_url, slug) VALUES
('Healthcare AI Revolution: 2025 Automation Trends Transforming Patient Care', 'Discover how artificial intelligence is revolutionizing healthcare delivery with advanced automation solutions improving patient outcomes, reducing costs, and streamlining clinical workflows across hospitals and clinics.', 'Dr. Sarah Chen', 'industry-insight', '2025-01-20 10:00:00+00', false, 'https://healthtech.ai/automation-trends-2025', 'healthcare-ai-revolution-2025'),

('Financial Services Automation: Digital Banking Evolution in 2025', 'Explore the cutting-edge automation technologies reshaping financial services, from AI-powered fraud detection to automated compliance systems that are transforming how banks operate and serve customers.', 'Michael Rodriguez', 'industry-insight', '2025-01-19 14:30:00+00', false, 'https://fintech.banking/digital-evolution-2025', 'financial-services-automation-2025'),

('Real Estate Technology Disruption: Smart Property Management Systems', 'Learn how intelligent automation is revolutionizing property management with IoT sensors, predictive maintenance, and AI-driven tenant services that optimize building operations and enhance resident experiences.', 'Jennifer Walsh', 'industry-insight', '2025-01-18 09:15:00+00', false, 'https://proptech.realestate/smart-management-2025', 'real-estate-tech-disruption-2025'),

('Manufacturing 4.0: Industrial Automation and Smart Factory Solutions', 'Discover how Industry 4.0 technologies are transforming manufacturing through advanced robotics, predictive analytics, and connected systems that optimize production efficiency and quality control.', 'David Kim', 'industry-insight', '2025-01-17 16:45:00+00', false, 'https://manufacturing.industry/automation-solutions-2025', 'manufacturing-4-0-smart-factory-2025'),

('Government Digital Transformation: Public Sector Automation Initiatives', 'Examine how government agencies are leveraging automation to improve citizen services, streamline bureaucratic processes, and enhance operational efficiency while maintaining security and compliance.', 'Amanda Thompson', 'industry-insight', '2025-01-16 11:20:00+00', false, 'https://govtech.digital/transformation-2025', 'government-digital-transformation-2025');

-- Add 3 more featured articles for variety
INSERT INTO public.posts (title, excerpt, author, category, published_date, is_featured, source_url, slug) VALUES
('The Future of Work: How Automation is Reshaping Enterprise Operations', 'An in-depth analysis of how intelligent automation is transforming workplace dynamics, employee roles, and organizational structures across industries in 2025 and beyond.', 'Alex Johnson', 'technology', '2025-01-21 08:00:00+00', true, 'https://futureofwork.tech/automation-impact-2025', 'future-of-work-automation-2025'),

('Cybersecurity Automation: Protecting Digital Assets in the AI Age', 'Explore advanced cybersecurity automation tools and strategies that organizations are implementing to protect against evolving threats while maintaining operational efficiency.', 'Maria Santos', 'security', '2025-01-20 13:30:00+00', true, 'https://cybersec.defense/automation-protection-2025', 'cybersecurity-automation-ai-age-2025'),

('Supply Chain Optimization: AI-Driven Logistics and Inventory Management', 'Discover how artificial intelligence and automation are revolutionizing supply chain operations, from demand forecasting to automated inventory management and logistics optimization.', 'Robert Chen', 'automation', '2025-01-19 10:45:00+00', true, 'https://supply-chain.logistics/ai-optimization-2025', 'supply-chain-optimization-ai-2025');

-- Add more resources for the Popular Resources section
INSERT INTO public.resources (title, description, pdf_url, download_count) VALUES
('AI Implementation Checklist for Healthcare Organizations', 'A comprehensive 25-point checklist covering regulatory compliance, staff training, technology integration, and patient privacy considerations for healthcare AI automation projects.', 'https://resources.xlevatetech.com/healthcare-ai-checklist.pdf', 1247),

('Financial Services Automation ROI Calculator', 'Advanced spreadsheet tool for calculating return on investment for banking and finance automation projects, including risk assessment matrices and compliance cost analysis.', 'https://resources.xlevatetech.com/fintech-roi-calculator.xlsx', 892),

('Real Estate Technology Integration Guide', 'Step-by-step implementation guide for property management companies looking to integrate smart building technologies, tenant portals, and automated maintenance systems.', 'https://resources.xlevatetech.com/proptech-integration-guide.pdf', 634),

('Manufacturing Automation Assessment Tool', 'Interactive assessment framework for evaluating current manufacturing processes and identifying optimal automation opportunities with Industry 4.0 technologies.', 'https://resources.xlevatetech.com/manufacturing-assessment.pdf', 453),

('Government Digital Services Playbook', 'Best practices guide for public sector organizations implementing citizen-facing digital services with automation, including accessibility and security requirements.', 'https://resources.xlevatetech.com/govtech-playbook.pdf', 321);
