-- Add knowledge base data for improved AI responses (using correct categories)
INSERT INTO knowledge_base (question, answer, category) VALUES
('What is AI orchestration?', 'AI orchestration coordinates multiple specialized AI agents to complete complex business tasks. For example:
• Agent 1: Data extraction from multiple sources
• Agent 2: Data validation and cleaning  
• Agent 3: Analysis and insight generation
• Agent 4: Report generation and distribution

Typical implementations use 3-7 agents working together. Industries like healthcare, finance, and real estate see 40-60% efficiency gains with orchestrated AI workflows.

Would you like specific examples from your industry?', 'automation'),

('Typical automation costs?', 'Automation project costs vary significantly based on complexity:

**Simple Process Automation:** $5,000 - $15,000
- Single workflow automation
- 1-2 system integrations
- Basic reporting

**Medium Complexity:** $15,000 - $50,000  
- Multiple process automation
- 3-5 system integrations
- Custom dashboards and analytics

**Enterprise Orchestration:** $50,000 - $200,000+
- AI-powered decision making
- Complex multi-system integration
- Advanced analytics and ML

ROI typically achieved within 6-18 months. For accurate estimates tailored to your specific needs, I need to understand your industry, current processes, and existing systems.

What type of processes are you looking to automate?', 'pricing'),

('API integration process?', 'Our proven API integration methodology follows these steps:

**1. System Audit & Discovery (Week 1)**
- Inventory existing systems and databases
- Document current data flows
- Identify integration points and potential conflicts

**2. Integration Architecture Design (Week 2)**
- Map data transformation requirements
- Design secure API connections
- Plan fallback and error handling

**3. Development & Testing (Weeks 3-4)**
- Build custom API connectors
- Implement data validation rules
- Comprehensive testing with your systems

**4. Deployment & Monitoring (Week 5)**
- Staged rollout with monitoring
- Performance optimization
- Team training and documentation

Most clients see initial integrations working within 2-3 weeks, with full deployment in 4-6 weeks.

Which systems are you looking to connect?', 'technical'),

('How many agents are typically needed?', 'The number of AI agents depends on process complexity:

**Simple Workflows:** 1-2 agents
- Single data source processing
- Basic validation and routing

**Standard Business Processes:** 3-5 agents  
- Multi-source data integration
- Business rule validation
- Decision routing and notifications

**Complex Enterprise Workflows:** 5-10+ agents
- Advanced data analysis and ML
- Multi-system orchestration
- Real-time monitoring and optimization

**Healthcare Example:** Patient intake process uses 6 agents:
1. Document extraction (forms, insurance)
2. Data validation and verification
3. Insurance eligibility checking
4. Appointment scheduling
5. Provider notification
6. Follow-up automation

Each agent specializes in one function, making the system more reliable and easier to maintain.

What type of workflow are you considering for automation?', 'automation'),

('ROI calculation methodology?', 'Our ROI calculations use a proven framework:

**Cost Savings Measurement:**
• Labor hours saved × hourly rate
• Error reduction savings (typically 15-30%)
• Compliance and audit cost reductions
• Faster processing time value

**Revenue Impact:**
• Faster customer response times
• Increased transaction capacity
• New service offerings enabled
• Customer retention improvements

**Implementation Costs:**
• Software development and integration
• Training and change management  
• Ongoing maintenance and support
• Infrastructure and licensing

**Typical Results:**
- 200-400% ROI within 18 months
- 40-70% reduction in manual processing time
- 85-95% reduction in processing errors
- Payback period: 6-18 months

Our ROI calculator provides specific estimates based on your inputs. Have you tried our calculator yet?', 'general'),

('Custom quote requirements?', 'For accurate custom quotes, our team needs to understand:

**Business Context:**
- Industry and regulatory requirements
- Current process volume and complexity
- Existing technology stack
- Timeline and urgency

**Technical Requirements:**
- Systems requiring integration
- Data security and compliance needs
- Scalability requirements
- Performance expectations

**Project Scope:**
- Number of processes to automate
- User training requirements
- Ongoing support needs
- Success metrics and KPIs

This information allows us to provide detailed proposals with fixed pricing, timeline guarantees, and clear deliverables.

Ready to discuss your specific requirements? Please email raj.dalal@xlevatetech.com or schedule a consultation to get started.', 'general');

-- Add topic threading support
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS topic VARCHAR(100);
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS topic_tags TEXT[];
ALTER TABLE messages ADD COLUMN IF NOT EXISTS message_type VARCHAR(50) DEFAULT 'general';
ALTER TABLE messages ADD COLUMN IF NOT EXISTS extracted_entities JSONB;

-- Add conversation analytics
CREATE TABLE IF NOT EXISTS conversation_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL,
  question_type VARCHAR(50) NOT NULL,
  response_time_ms INTEGER,
  tokens_used INTEGER,
  escalated BOOLEAN DEFAULT FALSE,
  escalation_reason TEXT,
  user_satisfaction INTEGER CHECK (user_satisfaction >= 1 AND user_satisfaction <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS for conversation analytics
ALTER TABLE conversation_analytics ENABLE ROW LEVEL SECURITY;

-- Create policies for conversation analytics
CREATE POLICY "Analytics viewable by admins" ON conversation_analytics
  FOR SELECT USING (true);

CREATE POLICY "Analytics can be inserted" ON conversation_analytics
  FOR INSERT WITH CHECK (true);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_conversations_topic ON conversations(topic);
CREATE INDEX IF NOT EXISTS idx_messages_type ON messages(message_type);
CREATE INDEX IF NOT EXISTS idx_analytics_session ON conversation_analytics(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_type ON conversation_analytics(question_type);