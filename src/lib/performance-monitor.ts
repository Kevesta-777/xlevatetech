import { supabase } from '@/integrations/supabase/client';

// Performance Types
export interface PerformanceMetrics {
  responseTime: number;
  uptime: number;
  errorRate: number;
  concurrentUsers: number;
  memoryUsage: number;
  cpuUsage: number;
}

export interface HealthCheck {
  status: 'healthy' | 'degraded' | 'down';
  checks: {
    database: boolean;
    aiService: boolean;
    externalApis: boolean;
    memory: boolean;
    responseTime: boolean;
  };
  lastCheck: Date;
  uptime: number;
}

export interface ErrorLog {
  id: string;
  timestamp: Date;
  error: string;
  stack?: string;
  context: {
    sessionId?: string;
    userId?: string;
    action?: string;
    userAgent?: string;
  };
  severity: 'low' | 'medium' | 'high' | 'critical';
}

// Performance Monitor
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private startTime: Date;
  private errorCount: number = 0;
  private requestCount: number = 0;
  private responseTimes: number[] = [];
  private healthCheckInterval?: NodeJS.Timeout;
  private readonly MAX_RESPONSE_TIME = 1500; // 1.5s
  private readonly MAX_MEMORY_USAGE = 0.8; // 80%
  private readonly MAX_ERROR_RATE = 0.05; // 5%

  private constructor() {
    this.startTime = new Date();
    this.startHealthChecks();
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Response Time Tracking
  async trackResponseTime(startTime: number, endTime: number, context?: { sessionId?: string; action?: string }): Promise<void> {
    const responseTime = endTime - startTime;
    this.responseTimes.push(responseTime);
    this.requestCount++;

    // Keep only last 1000 response times for memory efficiency
    if (this.responseTimes.length > 1000) {
      this.responseTimes.shift();
    }

    // Log slow responses
    if (responseTime > this.MAX_RESPONSE_TIME) {
      await this.logError({
        error: `Slow response time: ${responseTime}ms`,
        context,
        severity: 'medium'
      });
    }

    // Store metrics
    await this.storeMetrics({
      responseTime,
      timestamp: new Date(),
      context
    });
  }

  // Error Tracking
  async trackError(error: Error, context?: { sessionId?: string; userId?: string; action?: string }): Promise<void> {
    this.errorCount++;

    const errorLog: ErrorLog = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      error: error.message,
      stack: error.stack,
      context: {
        sessionId: context?.sessionId,
        userId: context?.userId,
        action: context?.action,
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined
      },
      severity: this.determineErrorSeverity(error)
    };

    await this.logError(errorLog);

    // Alert on critical errors
    if (errorLog.severity === 'critical') {
      await this.sendAlert('Critical error detected', errorLog);
    }
  }

  // Health Checks
  async performHealthCheck(): Promise<HealthCheck> {
    const checks = {
      database: await this.checkDatabase(),
      aiService: await this.checkAIService(),
      externalApis: await this.checkExternalAPIs(),
      memory: await this.checkMemoryUsage(),
      responseTime: await this.checkResponseTime()
    };

    const allHealthy = Object.values(checks).every(check => check);
    const someHealthy = Object.values(checks).some(check => check);

    const status = allHealthy ? 'healthy' : someHealthy ? 'degraded' : 'down';

    const healthCheck: HealthCheck = {
      status,
      checks,
      lastCheck: new Date(),
      uptime: this.getUptime()
    };

    // Store health check
    await this.storeHealthCheck(healthCheck);

    // Alert on degraded/down status
    if (status !== 'healthy') {
      await this.sendAlert(`System status: ${status}`, healthCheck);
    }

    return healthCheck;
  }

  // Get Performance Metrics
  async getPerformanceMetrics(): Promise<PerformanceMetrics> {
    const responseTime = this.getAverageResponseTime();
    const uptime = this.getUptime();
    const errorRate = this.getErrorRate();
    const concurrentUsers = await this.getConcurrentUsers();
    const memoryUsage = await this.getMemoryUsage();
    const cpuUsage = await this.getCPUUsage();

    return {
      responseTime,
      uptime,
      errorRate,
      concurrentUsers,
      memoryUsage,
      cpuUsage
    };
  }

  // Real-time Monitoring
  async getRealTimeStatus(): Promise<{
    status: 'operational' | 'degraded' | 'down';
    metrics: PerformanceMetrics;
    lastIncident?: string;
  }> {
    const metrics = await this.getPerformanceMetrics();
    const healthCheck = await this.performHealthCheck();

    let status: 'operational' | 'degraded' | 'down' = 'operational';

    if (healthCheck.status === 'down' || metrics.errorRate > this.MAX_ERROR_RATE) {
      status = 'down';
    } else if (healthCheck.status === 'degraded' || metrics.responseTime > this.MAX_RESPONSE_TIME) {
      status = 'degraded';
    }

    return {
      status,
      metrics,
      lastIncident: await this.getLastIncident()
    };
  }

  // Feature Flags
  async isFeatureEnabled(feature: string, userId?: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('feature_flags')
        .select('enabled, rollout_percentage')
        .eq('feature_name', feature)
        .single();

      if (error || !data) return false;

      if (!data.enabled) return false;

      // Check rollout percentage
      if (data.rollout_percentage < 100) {
        const hash = userId ? this.hashString(userId) : Math.random();
        return hash <= data.rollout_percentage / 100;
      }

      return true;
    } catch (error) {
      console.error('Feature flag check failed:', error);
      return false; // Default to disabled on error
    }
  }

  // Version Management
  async getCurrentVersion(): Promise<string> {
    return process.env.APP_VERSION || '1.0.0';
  }

  async rollbackVersion(targetVersion: string): Promise<boolean> {
    try {
      // Implement version rollback logic
      console.log(`Rolling back to version: ${targetVersion}`);
      
      // Store rollback event
      await this.storeRollbackEvent(targetVersion);
      
      return true;
    } catch (error) {
      console.error('Version rollback failed:', error);
      return false;
    }
  }

  // Private Methods
  private startHealthChecks(): void {
    this.healthCheckInterval = setInterval(async () => {
      await this.performHealthCheck();
    }, 60000); // Check every minute
  }

  private async checkDatabase(): Promise<boolean> {
    try {
      const startTime = Date.now();
      await supabase.from('health_check').select('count').limit(1);
      const responseTime = Date.now() - startTime;
      
      return responseTime < 1000; // Database should respond within 1s
    } catch (error) {
      return false;
    }
  }

  private async checkAIService(): Promise<boolean> {
    try {
      const response = await fetch('/api/health/ai', { 
        method: 'GET',
        signal: AbortSignal.timeout(5000) // 5s timeout
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  private async checkExternalAPIs(): Promise<boolean> {
    try {
      const apis = [
        'https://api.openai.com/v1/models',
        'https://api.perplexity.ai/health'
      ];

      const results = await Promise.allSettled(
        apis.map(url => fetch(url, { 
          method: 'GET',
          signal: AbortSignal.timeout(3000) // 3s timeout
        }))
      );

      const successfulChecks = results.filter(result => 
        result.status === 'fulfilled' && result.value.ok
      ).length;

      return successfulChecks >= apis.length * 0.5; // At least 50% should be working
    } catch (error) {
      return false;
    }
  }

  private async checkMemoryUsage(): Promise<boolean> {
    if (typeof performance !== 'undefined' && 'memory' in performance) {
      const memory = (performance as any).memory;
      const usage = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
      return usage < this.MAX_MEMORY_USAGE;
    }
    return true; // Can't check memory in browser
  }

  private async checkResponseTime(): Promise<boolean> {
    const avgResponseTime = this.getAverageResponseTime();
    return avgResponseTime < this.MAX_RESPONSE_TIME;
  }

  private getUptime(): number {
    return Date.now() - this.startTime.getTime();
  }

  private getAverageResponseTime(): number {
    if (this.responseTimes.length === 0) return 0;
    return this.responseTimes.reduce((sum, time) => sum + time, 0) / this.responseTimes.length;
  }

  private getErrorRate(): number {
    if (this.requestCount === 0) return 0;
    return this.errorCount / this.requestCount;
  }

  private async getConcurrentUsers(): Promise<number> {
    try {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      const { count } = await supabase
        .from('session_analytics')
        .select('*', { count: 'exact', head: true })
        .gte('start_time', fiveMinutesAgo.toISOString());
      
      return count || 0;
    } catch (error) {
      return 0;
    }
  }

  private async getMemoryUsage(): Promise<number> {
    if (typeof performance !== 'undefined' && 'memory' in performance) {
      const memory = (performance as any).memory;
      return memory.usedJSHeapSize / memory.jsHeapSizeLimit;
    }
    return 0;
  }

  private async getCPUUsage(): Promise<number> {
    // Browser doesn't provide direct CPU usage
    // This would need to be implemented on the server side
    return 0;
  }

  private determineErrorSeverity(error: Error): 'low' | 'medium' | 'high' | 'critical' {
    const message = error.message.toLowerCase();
    
    if (message.includes('timeout') || message.includes('network')) {
      return 'medium';
    }
    
    if (message.includes('database') || message.includes('connection')) {
      return 'high';
    }
    
    if (message.includes('authentication') || message.includes('security')) {
      return 'critical';
    }
    
    return 'low';
  }

  private async logError(errorLog: ErrorLog): Promise<void> {
    try {
      await supabase.from('error_logs').insert({
        id: errorLog.id,
        timestamp: errorLog.timestamp.toISOString(),
        error: errorLog.error,
        stack: errorLog.stack,
        context: errorLog.context,
        severity: errorLog.severity
      });
    } catch (error) {
      console.error('Failed to log error:', error);
    }
  }

  private async storeMetrics(metrics: { responseTime: number; timestamp: Date; context?: any }): Promise<void> {
    try {
      await supabase.from('performance_metrics').insert({
        response_time: metrics.responseTime,
        timestamp: metrics.timestamp.toISOString(),
        context: metrics.context
      });
    } catch (error) {
      console.error('Failed to store metrics:', error);
    }
  }

  private async storeHealthCheck(healthCheck: HealthCheck): Promise<void> {
    try {
      await supabase.from('health_checks').insert({
        status: healthCheck.status,
        checks: healthCheck.checks,
        last_check: healthCheck.lastCheck.toISOString(),
        uptime: healthCheck.uptime
      });
    } catch (error) {
      console.error('Failed to store health check:', error);
    }
  }

  private async sendAlert(message: string, data: any): Promise<void> {
    const webhookUrl = process.env.ALERT_WEBHOOK_URL;
    if (!webhookUrl) return;

    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `🚨 ${message}`,
          data: JSON.stringify(data, null, 2)
        })
      });
    } catch (error) {
      console.error('Failed to send alert:', error);
    }
  }

  private async getLastIncident(): Promise<string | undefined> {
    try {
      const { data } = await supabase
        .from('health_checks')
        .select('status, last_check')
        .neq('status', 'healthy')
        .order('last_check', { ascending: false })
        .limit(1)
        .single();

      return data ? `${data.status} at ${data.last_check}` : undefined;
    } catch (error) {
      return undefined;
    }
  }

  private async storeRollbackEvent(version: string): Promise<void> {
    try {
      await supabase.from('deployment_events').insert({
        event_type: 'rollback',
        version: version,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to store rollback event:', error);
    }
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash) % 100;
  }

  // Cleanup
  destroy(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }
  }
} 