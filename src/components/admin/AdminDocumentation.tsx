
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { FileText, BookOpen, Shield, Settings, Users, BarChart3, Globe, ChevronRight, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface AdminUser {
  id: string;
  email: string;
  role: 'super_admin' | 'admin' | 'editor' | 'viewer';
  last_login: string;
  mfa_enabled: boolean;
}

interface AdminDocumentationProps {
  adminUser: AdminUser | null;
}

interface DocSection {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  content: string;
  subsections?: DocSection[];
}

const documentationSections: DocSection[] = [
  {
    id: 'overview',
    title: 'Admin Overview',
    icon: BookOpen,
    content: `# Admin User Guide

## Getting Started
This guide covers all administrative functions available in the Xlevate Tech admin portal.

## Access Requirements
- Valid admin account with appropriate role (admin or super_admin)
- Active session with MFA if enabled
- Authorized IP address (if IP whitelist is configured)

## Dashboard Overview
The admin dashboard provides real-time insights into:
- System performance metrics
- RSS feed health monitoring
- Content analytics
- User engagement data
- Security events

## Navigation
Use the left sidebar to navigate between different admin sections:
- Dashboard: Overview and key metrics
- Content Management: Blog and content tools
- RSS Management: Feed configuration and monitoring
- Analytics: Detailed performance data
- Performance: Advanced performance analytics
- System Health: Technical monitoring
- User Management: User administration
- Security: Security monitoring and logs
- Settings: System configuration

## Data Privacy
All admin data is protected by Row Level Security (RLS) policies and requires proper authentication. No sensitive admin data is accessible to public users.`
  },
  {
    id: 'rss-management',
    title: 'RSS Feed Management',
    icon: Globe,
    content: `# RSS Feed Management Guide

## Overview
The RSS Management section allows administrators to configure, monitor, and manage RSS feeds for content aggregation.

## Key Features

### Adding RSS Feeds
1. Navigate to RSS Management tab
2. Click "Add Feed" button
3. Enter feed URL, name, and category
4. Configure update frequency
5. Set credibility scoring parameters

### Feed Health Monitoring
- Real-time status indicators (healthy, warning, error)
- Response time tracking
- Content validation metrics
- Last update timestamps

### Content Curation
- Manual content aggregation
- Category management
- Content filtering rules
- Duplicate detection

### Feed Configuration
- Update intervals (1-24 hours)
- Content parsing rules
- Error handling preferences
- Notification settings

## Best Practices
- Monitor feed health regularly
- Update feed URLs when sources change
- Set appropriate update frequencies
- Review content quality periodically

## Troubleshooting
- Check feed URL validity
- Verify network connectivity
- Review parsing errors in logs
- Contact source publishers for persistent issues`
  },
  {
    id: 'analytics',
    title: 'Analytics & Performance',
    icon: BarChart3,
    content: `# Analytics & Performance Guide

## Dashboard Metrics
The analytics dashboard provides comprehensive insights into system performance and user engagement.

### Key Performance Indicators
- **Total Conversations**: Number of user interactions
- **Average Response Time**: System response performance
- **Total Messages**: Message volume metrics
- **Escalation Rate**: Issues requiring manual intervention

### Performance Analytics
- Real-time performance metrics
- Response time monitoring
- System resource utilization
- Error rate tracking

### User Engagement Analytics
- Page view statistics
- User interaction patterns
- Content engagement metrics
- Session duration analysis

### RSS Feed Analytics
- Feed health status
- Content parsing success rates
- Update frequency metrics
- Source reliability scores

## Data Visualization
- Line charts for trend analysis
- Bar charts for comparative metrics
- Pie charts for distribution analysis
- Real-time status indicators

## Reporting Features
- Automated daily/weekly reports
- Custom date range analysis
- Export capabilities (CSV, PDF)
- Alert configuration for anomalies

## Performance Optimization
- Database query optimization
- Caching strategy monitoring
- Resource usage alerts
- Scaling recommendations`
  },
  {
    id: 'content-management',
    title: 'Content Management',
    icon: FileText,
    content: `# Content Management Guide

## Overview
The Content Management system provides tools for curating, moderating, and optimizing blog content.

## Content Sources
### RSS Feed Content
- Automated aggregation from configured feeds
- Content parsing and formatting
- Duplicate detection and removal
- Quality scoring algorithms

### Manual Content Creation
- Direct content creation interface
- Rich text editor with formatting options
- SEO optimization tools
- Publication scheduling

## Content Moderation
### Quality Control
- Content review workflows
- Fact-checking tools
- Source verification
- Editorial guidelines enforcement

### SEO Optimization
- Meta tag management
- Keyword optimization
- Image alt-text configuration
- Schema markup implementation

## Link Management
### Smart Link Validation
- Real-time link health checking
- Automatic 404 detection
- Fallback content suggestions
- Source reliability monitoring

### Citation System
- Automated source attribution
- Reference management
- Academic citation formatting
- Source credibility scoring

## Publishing Workflow
1. Content ingestion (RSS or manual)
2. Quality assessment
3. SEO optimization
4. Editorial review
5. Publication scheduling
6. Performance monitoring

## Content Analytics
- Article performance metrics
- Engagement tracking
- Social sharing statistics
- Search ranking monitoring`
  },
  {
    id: 'security',
    title: 'Security & Monitoring',
    icon: Shield,
    content: `# Security & Monitoring Guide

## Security Features
The admin system implements comprehensive security measures to protect sensitive data and prevent unauthorized access.

### Authentication & Authorization
- Multi-factor authentication (MFA)
- Role-based access control (RBAC)
- Session management and timeout
- IP address whitelisting

### Audit Logging
- Complete admin action tracking
- Security event monitoring
- Failed login attempt logging
- Data access auditing

### Session Security
- Secure session tokens
- Automatic session expiration
- Concurrent session management
- Logout on suspicious activity

## Monitoring Features
### Security Events
- Login attempts and failures
- Privilege escalation attempts
- Unusual access patterns
- Data export activities

### System Health
- Server resource monitoring
- Database performance tracking
- API response time monitoring
- Error rate alerting

### Real-time Alerts
- Security incident notifications
- Performance degradation alerts
- System failure warnings
- Maintenance requirement notices

## Security Best Practices
- Regular password updates
- MFA enablement for all admin accounts
- Regular security audit reviews
- Incident response procedures

## Compliance & Privacy
- GDPR compliance measures
- Data retention policies
- Privacy by design principles
- Regular security assessments`
  },
  {
    id: 'user-management',
    title: 'User Management',
    icon: Users,
    content: `# User Management Guide

## Admin User Administration
Manage admin accounts, roles, and permissions within the system.

### User Roles
- **Super Admin**: Full system access and user management
- **Admin**: Standard administrative functions
- **Editor**: Content management and moderation
- **Viewer**: Read-only access to dashboards

### Account Management
- Create new admin accounts
- Modify user roles and permissions
- Enable/disable user accounts
- Reset passwords and MFA settings

### Permission Management
- Role-based access control
- Feature-specific permissions
- Resource access restrictions
- Time-based access controls

## Public User Analytics
### Engagement Metrics
- User behavior analysis
- Content interaction tracking
- Session duration monitoring
- Conversion rate analysis

### Privacy Compliance
- Anonymous data collection
- GDPR compliance measures
- Data retention policies
- User consent management

## Security Administration
### Account Security
- MFA enforcement policies
- Password complexity requirements
- Session timeout configuration
- Account lockout policies

### Access Monitoring
- Login activity tracking
- Failed authentication logging
- Suspicious activity detection
- Access pattern analysis

## Reporting & Analytics
- User activity reports
- Security event summaries
- Performance metrics
- Compliance audit trails`
  },
  {
    id: 'technical',
    title: 'Technical Architecture',
    icon: Settings,
    content: `# Technical Architecture Guide

## System Overview
The Xlevate Tech blog and admin system is built with a modern, secure architecture that separates public content from administrative functions.

## Technology Stack
- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Backend**: Supabase (PostgreSQL, Edge Functions, Authentication)
- **Real-time**: Supabase Realtime for live updates
- **Charts**: Recharts for data visualization
- **Performance**: Web Vitals monitoring

## Database Schema
### Core Tables
- \`rss_feeds\`: RSS feed configuration and management
- \`rss_content_cache\`: Cached RSS content with expiration
- \`rss_feed_health\`: Feed health monitoring and status
- \`admin_users\`: Admin user accounts and roles
- \`admin_audit_log\`: Security and action auditing
- \`blog_performance_metrics\`: Performance tracking
- \`user_engagement_analytics\`: Public user behavior tracking

### Security Tables
- \`admin_sessions\`: Secure admin session management
- \`admin_security_events\`: Security event monitoring

## Security Architecture
### Data Isolation
- **Row Level Security (RLS)**: All admin data protected by RLS policies
- **Role-based Access**: Admin users have specific roles
- **Public Data Isolation**: No admin data accessible to public users
- **Secure Authentication**: Supabase Auth with MFA support

### Performance Optimization
- **Caching**: RSS content cached for 6-hour intervals
- **Real-time Updates**: Live feed health monitoring
- **Optimized Queries**: Efficient database queries with indexing
- **CDN Ready**: Static assets optimized for delivery

## Deployment & Monitoring
- Production-ready Supabase hosting
- Automated backup and recovery
- Real-time health monitoring
- Performance analytics and alerting

## API Architecture
- RESTful API design
- Edge function implementation
- Rate limiting and security
- Error handling and logging`
  }
];

export const AdminDocumentation: React.FC<AdminDocumentationProps> = ({ adminUser }) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSections = documentationSections.filter(section =>
    section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeContent = documentationSections.find(section => section.id === activeSection)?.content || '';

  const renderMarkdown = (content: string) => {
    // Simple markdown rendering for headers and lists
    return content.split('\n').map((line, index) => {
      if (line.startsWith('# ')) {
        return <h1 key={index} className="text-2xl font-bold mt-6 mb-4">{line.substring(2)}</h1>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={index} className="text-xl font-semibold mt-5 mb-3">{line.substring(3)}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={index} className="text-lg font-medium mt-4 mb-2">{line.substring(4)}</h3>;
      }
      if (line.startsWith('- ')) {
        return <li key={index} className="ml-4 mb-1">{line.substring(2)}</li>;
      }
      if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={index} className="font-semibold mb-2">{line.substring(2, line.length - 2)}</p>;
      }
      if (line.includes('`') && line.includes('`')) {
        const parts = line.split('`');
        return (
          <p key={index} className="mb-2">
            {parts.map((part, i) => 
              i % 2 === 1 ? <code key={i} className="bg-muted px-1 rounded text-sm">{part}</code> : part
            )}
          </p>
        );
      }
      if (line.trim() === '') {
        return <div key={index} className="h-2" />;
      }
      return <p key={index} className="mb-2">{line}</p>;
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Admin Documentation</h2>
        <p className="text-muted-foreground">
          Comprehensive guides and technical documentation for administrators
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Documentation
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search docs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[600px]">
              <div className="p-4 space-y-1">
                {filteredSections.map((section) => (
                  <Button
                    key={section.id}
                    variant={activeSection === section.id ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveSection(section.id)}
                  >
                    <section.icon className="h-4 w-4 mr-2" />
                    {section.title}
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Main Content Area */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {React.createElement(
                documentationSections.find(s => s.id === activeSection)?.icon || FileText,
                { className: "h-5 w-5" }
              )}
              {documentationSections.find(s => s.id === activeSection)?.title || 'Documentation'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px]">
              <div className="prose prose-sm max-w-none">
                {renderMarkdown(activeContent)}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" 
              onClick={() => setActiveSection('rss-management')}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Globe className="h-4 w-4" />
              RSS Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Learn how to configure and monitor RSS feeds for content aggregation
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setActiveSection('analytics')}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <BarChart3 className="h-4 w-4" />
              Analytics Guide
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Understand performance metrics and user engagement analytics
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setActiveSection('security')}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Shield className="h-4 w-4" />
              Security & Monitoring
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Security features, monitoring tools, and best practices
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
