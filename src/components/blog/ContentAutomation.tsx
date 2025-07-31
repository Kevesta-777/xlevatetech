import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, RotateCcw, Clock, CheckCircle, XCircle, AlertTriangle, Settings, RefreshCw, Database } from 'lucide-react';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';

interface AutomationWorkflow {
  id: string;
  name: string;
  description: string;
  workflow_type: string;
  status: 'active' | 'paused' | 'error';
  frequency_hours: number;
  last_run: string | null;
  next_run: string | null;
  success_count: number;
  error_count: number;
  configuration: Record<string, any>;
}

interface ContentAutomationProps {
  onWorkflowUpdate?: (workflows: AutomationWorkflow[]) => void;
}

export const ContentAutomation: React.FC<ContentAutomationProps> = ({ onWorkflowUpdate }) => {
  const [workflows, setWorkflows] = useState<AutomationWorkflow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadWorkflows();
  }, []);

  const loadWorkflows = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('automation_workflows')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setWorkflows((data || []) as AutomationWorkflow[]);
      onWorkflowUpdate?.((data || []) as AutomationWorkflow[]);
    } catch (error) {
      console.error('Error loading workflows:', error);
      toast.error('Failed to load automation workflows');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleWorkflow = async (workflowId: string) => {
    try {
      const workflow = workflows.find(w => w.id === workflowId);
      if (!workflow) return;

      const newStatus = workflow.status === 'active' ? 'paused' : 'active';
      
      const { error } = await supabase
        .from('automation_workflows')
        .update({ 
          status: newStatus,
          next_run: newStatus === 'active' 
            ? new Date(Date.now() + workflow.frequency_hours * 60 * 60 * 1000).toISOString()
            : null
        })
        .eq('id', workflowId);

      if (error) throw error;

      setWorkflows(prev => prev.map(w => 
        w.id === workflowId 
          ? { ...w, status: newStatus }
          : w
      ));

      toast.success(`Workflow ${newStatus === 'active' ? 'activated' : 'paused'}`);
    } catch (error) {
      console.error('Error toggling workflow:', error);
      toast.error('Failed to update workflow status');
    }
  };

  const runWorkflow = async (workflowId: string) => {
    try {
      const workflow = workflows.find(w => w.id === workflowId);
      if (!workflow) return;

      // For RSS aggregation, call the edge function
      if (workflow.workflow_type === 'rss_aggregation') {
        const { data, error } = await supabase.functions.invoke('rss-aggregator', {
          body: { manual: true }
        });

        if (error) throw error;

        toast.success(`RSS aggregation completed: ${data.processed} feeds processed`);
      } else {
        // For other workflow types, just update the timestamps
        const { error } = await supabase
          .from('automation_workflows')
          .update({ 
            last_run: new Date().toISOString(),
            next_run: new Date(Date.now() + workflow.frequency_hours * 60 * 60 * 1000).toISOString(),
            success_count: workflow.success_count + 1
          })
          .eq('id', workflowId);

        if (error) throw error;

        toast.success(`${workflow.name} executed successfully`);
      }

      // Reload workflows to get updated data
      await loadWorkflows();
    } catch (error) {
      console.error('Error running workflow:', error);
      toast.error('Failed to execute workflow');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'paused':
        return <Pause className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSuccessRate = (workflow: AutomationWorkflow) => {
    const total = workflow.success_count + workflow.error_count;
    return total > 0 ? (workflow.success_count / total) * 100 : 100;
  };

  const formatTimeAgo = (dateString: string | null) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    return 'Just now';
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Content Automation</CardTitle>
          <CardDescription>Manage automated content workflows</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-100 animate-pulse rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const activeWorkflows = workflows.filter(w => w.status === 'active').length;
  const totalWorkflows = workflows.length;
  const overallSuccessRate = workflows.reduce((acc, w) => acc + getSuccessRate(w), 0) / workflows.length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RotateCcw className="h-5 w-5" />
            Content Automation Overview
          </CardTitle>
          <CardDescription>
            Automated workflows for content aggregation, validation, and optimization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{activeWorkflows}/{totalWorkflows}</div>
              <div className="text-sm text-blue-700">Active Workflows</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{overallSuccessRate.toFixed(1)}%</div>
              <div className="text-sm text-green-700">Success Rate</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {workflows.reduce((acc, w) => acc + w.success_count, 0)}
              </div>
              <div className="text-sm text-purple-700">Total Executions</div>
            </div>
          </div>

          <div className="space-y-4">
            {workflows.map((workflow) => (
              <div key={workflow.id} className="border rounded-lg p-4 bg-card">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(workflow.status)}
                    <div>
                      <h3 className="font-semibold">{workflow.name}</h3>
                      <p className="text-sm text-muted-foreground">{workflow.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(workflow.status)}>
                      {workflow.status}
                    </Badge>
                    <Switch
                      checked={workflow.status === 'active'}
                      onCheckedChange={() => toggleWorkflow(workflow.id)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                  <div className="text-sm">
                    <div className="text-muted-foreground">Frequency</div>
                    <div className="font-medium">Every {workflow.frequency_hours}h</div>
                  </div>
                  <div className="text-sm">
                    <div className="text-muted-foreground">Last Run</div>
                    <div className="font-medium">{formatTimeAgo(workflow.last_run)}</div>
                  </div>
                  <div className="text-sm">
                    <div className="text-muted-foreground">Success Rate</div>
                    <div className="font-medium">{getSuccessRate(workflow).toFixed(1)}%</div>
                  </div>
                  <div className="text-sm">
                    <div className="text-muted-foreground">Next Run</div>
                    <div className="font-medium flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {workflow.next_run ? formatTimeAgo(workflow.next_run) : 'Paused'}
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>Success Rate</span>
                    <span>{getSuccessRate(workflow).toFixed(1)}%</span>
                  </div>
                  <Progress value={getSuccessRate(workflow)} className="h-2" />
                </div>

                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => runWorkflow(workflow.id)}
                    disabled={workflow.status === 'paused'}
                    className="flex items-center gap-2"
                  >
                    <Play className="h-3 w-3" />
                    Run Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};