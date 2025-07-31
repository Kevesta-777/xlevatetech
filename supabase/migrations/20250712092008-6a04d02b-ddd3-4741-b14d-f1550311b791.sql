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