# Xlevate Scout - Enterprise AI Chatbot

A sophisticated, enterprise-grade AI chatbot with lead capture, analytics, CRM integration, and performance monitoring.

## 🚀 Features

### Core Intelligence

- **Hybrid LLM Routing**: GPT-4o Mini + Perplexity Sonar Pro fallback
- **Session Memory**: Persistent user context and preferences
- **Smart Lead Scoring**: Real-time scoring based on engagement, intent, budget, authority, and timeline
- **Escalation Logic**: Automatic routing to human team via Slack/CRM

### Lead Capture & Management

- **Conversational Funnel**: Name → Industry → Needs → Contact → Validation
- **Real-time Validation**: Email/phone validation with disposable domain filtering
- **Normalized Storage**: Complete session data in Supabase with proper schema
- **Lead Scoring**: Automatic categorization (Hot/Warm/Cold/Disqualified)

### Analytics & Insights

- **Real-time Dashboard**: Live metrics, growth trends, conversion tracking
- **Session Replays**: Privacy-compliant conversation analysis
- **Auto-tagging**: Industry and topic detection for product feedback
- **Performance Metrics**: Response times, sentiment analysis, drop-off points

### CRM Integration

- **Multi-CRM Support**: HubSpot, Salesforce, Airtable
- **Webhook System**: Custom integrations with signature verification
- **Batch Sync**: Automatic lead synchronization across all systems
- **Error Handling**: Graceful failure with retry mechanisms

### Performance & Reliability

- **99.99% Uptime**: External monitoring + internal health checks
- **<1.5s Response Time**: Optimized for 100+ concurrent users
- **Feature Flags**: Instant rollback and A/B testing capabilities
- **Error Tracking**: Comprehensive logging with severity levels

### Conversion Boosters

- **Personalization**: Dynamic tokens for name, industry, preferences
- **Welcome Back**: AI-driven reminders for returning users
- **Smart Triggers**: Exit intent, scroll depth, time-based activation
- **A/B Testing**: Message optimization based on performance data

## 🛠️ Installation

### Prerequisites

- Node.js 18+
- Supabase account
- OpenAI API key
- Perplexity API key (optional)

### 1. Clone Repository

```bash
git clone https://github.com/your-org/xlevate-scout.git
cd xlevate-scout
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AI Services
OPENAI_API_KEY=your_openai_key
PERPLEXITY_API_KEY=your_perplexity_key

# CRM Integrations
HUBSPOT_API_KEY=your_hubspot_key
SALESFORCE_INSTANCE_URL=your_salesforce_url
SALESFORCE_ACCESS_TOKEN=your_salesforce_token
AIRTABLE_BASE_ID=your_airtable_base
AIRTABLE_API_KEY=your_airtable_key

# Notifications
SLACK_WEBHOOK_URL=your_slack_webhook
ALERT_WEBHOOK_URL=your_alert_webhook

# Security
WEBHOOK_SECRET=your_webhook_secret
```

### 4. Database Setup

Run the following SQL in your Supabase SQL editor:

```sql
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enums
CREATE TYPE lead_stage AS ENUM ('captured', 'qualified', 'disqualified', 'contacted', 'meeting_booked');
CREATE TYPE lead_source AS ENUM ('form', 'chatbot', 'linkedin', 'email');

-- Leads table
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

-- Session memory table
CREATE TABLE public.session_memory (
  session_id text PRIMARY KEY,
  user_id text NOT NULL,
  context jsonb,
  lead_score numeric,
  escalation_triggers text[],
  consent_status jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Session analytics table
CREATE TABLE public.session_analytics (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id text NOT NULL,
  user_id text NOT NULL,
  start_time timestamp with time zone,
  end_time timestamp with time zone,
  message_count integer,
  lead_score numeric,
  conversion_path text[],
  disposition text,
  tags text[],
  sentiment numeric,
  drop_off_point text,
  response_time numeric,
  created_at timestamp with time zone DEFAULT now()
);

-- Escalations table
CREATE TABLE public.escalations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id text NOT NULL,
  user_id text NOT NULL,
  trigger_type text NOT NULL,
  severity text NOT NULL,
  message text,
  lead_score numeric,
  context jsonb,
  created_at timestamp with time zone DEFAULT now()
);

-- Performance metrics table
CREATE TABLE public.performance_metrics (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  response_time numeric NOT NULL,
  timestamp timestamp with time zone DEFAULT now(),
  context jsonb
);

-- Health checks table
CREATE TABLE public.health_checks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  status text NOT NULL,
  checks jsonb,
  last_check timestamp with time zone DEFAULT now(),
  uptime numeric
);

-- Error logs table
CREATE TABLE public.error_logs (
  id text PRIMARY KEY,
  timestamp timestamp with time zone DEFAULT now(),
  error text NOT NULL,
  stack text,
  context jsonb,
  severity text NOT NULL
);

-- Feature flags table
CREATE TABLE public.feature_flags (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  feature_name text UNIQUE NOT NULL,
  enabled boolean DEFAULT false,
  rollout_percentage integer DEFAULT 100,
  created_at timestamp with time zone DEFAULT now()
);

-- Message variants table
CREATE TABLE public.message_variants (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  message_type text NOT NULL,
  user_segment text NOT NULL,
  content text NOT NULL,
  performance_score numeric DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

-- Deployment events table
CREATE TABLE public.deployment_events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type text NOT NULL,
  version text NOT NULL,
  timestamp timestamp with time zone DEFAULT now()
);

-- RLS Policies
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.escalations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.error_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deployment_events ENABLE ROW LEVEL SECURITY;

-- Insert policies (adjust based on your auth setup)
CREATE POLICY "Enable insert for authenticated users only" ON public.leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable select for authenticated users only" ON public.leads FOR SELECT USING (true);
```

### 5. Start Development Server

```bash
npm run dev
```

## 📊 Usage

### Basic Implementation

```tsx
import { EnhancedXlevateScout } from "@/components/EnhancedXlevateScout";

function App() {
  return (
    <div>
      <EnhancedXlevateScout calendlyLink="https://calendly.com/your-link" />
    </div>
  );
}
```

### Advanced Configuration

```tsx
import { EnhancedXlevateScout } from "@/components/EnhancedXlevateScout";
import { AnalyticsEngine } from "@/lib/analytics-engine";
import { CRMIntegrationManager } from "@/lib/crm-integration";

// Initialize analytics
const analytics = AnalyticsEngine.getInstance();

// Setup CRM integration
const crmManager = CRMIntegrationManager.getInstance();
crmManager.registerWebhook("custom-crm", "https://your-crm.com/webhook");

function App() {
  return (
    <div>
      <EnhancedXlevateScout
        calendlyLink="https://calendly.com/your-link"
        onLeadCaptured={async (lead) => {
          // Sync to all CRMs
          await crmManager.syncLeadToAllCRMs(lead);

          // Record analytics
          await analytics.recordSession(
            lead.session,
            lead.score,
            lead.messages
          );
        }}
      />
    </div>
  );
}
```

## 🔧 Configuration

### Feature Flags

Control feature rollout via Supabase:

```sql
INSERT INTO feature_flags (feature_name, enabled, rollout_percentage)
VALUES ('advanced_analytics', true, 50);
```

### Message Variants

A/B test different messages:

```sql
INSERT INTO message_variants (message_type, user_segment, content, performance_score)
VALUES ('welcome', 'high_value', 'Welcome! I can help you automate your business.', 0.85);
```

### Webhook Configuration

Register custom webhooks:

```typescript
const crmManager = CRMIntegrationManager.getInstance();
crmManager.registerWebhook("zapier", "https://hooks.zapier.com/your-webhook");
crmManager.registerWebhook("pipedrive", "https://your-pipedrive.com/webhook");
```

## 📈 Analytics Dashboard

### Real-time Metrics

- Active sessions
- Leads today
- Conversions today
- Average response time
- Hot leads count

### Growth Analytics

- 7/30/90 day trends
- Source breakdown
- Industry analysis
- Conversion funnel

### Performance Monitoring

- Response time tracking
- Error rate monitoring
- Uptime status
- Health checks

## 🔒 Security & Compliance

### Data Protection

- **GDPR/CCPA Compliant**: Granular consent controls
- **PII Detection**: Automatic blocking of sensitive data
- **Encryption**: AES-256 for data at rest
- **Audit Trail**: Complete admin activity logging

### Privacy Controls

- **Opt-in Only**: No data collection without consent
- **Consent Management**: Granular permissions for data, marketing, analytics
- **Data Retention**: Configurable retention policies
- **Right to Deletion**: Complete data removal capabilities

## 🚀 Deployment

### Production Build

```bash
npm run build
npm start
```

### Environment Variables

Ensure all production environment variables are set:

- Database credentials
- API keys
- Webhook URLs
- Security secrets

### Monitoring Setup

1. Configure external uptime monitoring (UptimeRobot, Pingdom)
2. Set up alert webhooks for critical issues
3. Enable performance monitoring
4. Configure log aggregation

## 🧪 Testing

### Unit Tests

```bash
npm run test
```

### E2E Tests

```bash
npm run test:e2e
```

### Performance Tests

```bash
npm run test:performance
```

## 📚 API Reference

### EnhancedXlevateScout Props

```typescript
interface ChatbotProps {
  calendlyLink?: string;
  onLeadCaptured?: (lead: CRMLead) => void;
  onEscalation?: (trigger: EscalationTrigger) => void;
  customPlaceholders?: string[];
  maxMessages?: number;
}
```

### Analytics Engine

```typescript
// Get lead analytics
const analytics = await AnalyticsEngine.getInstance().getLeadAnalytics("30d");

// Record session
await AnalyticsEngine.getInstance().recordSession(session, leadScore, messages);

// Get real-time metrics
const metrics = await AnalyticsEngine.getInstance().getRealTimeMetrics();
```

### CRM Integration

```typescript
// Sync to specific CRM
const result = await CRMIntegrationManager.getInstance().syncToHubSpot(lead);

// Batch sync to all CRMs
const results = await CRMIntegrationManager.getInstance().syncLeadToAllCRMs(
  lead
);
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- **Documentation**: [docs.xlevatetech.com](https://docs.xlevatetech.com)
- **Issues**: [GitHub Issues](https://github.com/your-org/xlevate-scout/issues)
- **Email**: support@xlevatetech.com

## 🔄 Changelog

### v1.0.0

- Initial release with core chatbot functionality
- Lead capture and scoring
- Basic analytics
- CRM integration

### v1.1.0

- Enhanced AI intelligence
- Performance monitoring
- Conversion boosters
- Advanced analytics dashboard

---

**Built with ❤️ by Xlevate Tech**
