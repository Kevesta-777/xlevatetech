
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { 
  Plus, 
  RefreshCw, 
  Trash2, 
  Edit, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Globe,
  Activity,
  BarChart3
} from 'lucide-react';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RSSFeed {
  id: string;
  name: string;
  url: string;
  category: string;
  credibility_score: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface FeedHealth {
  id: string;
  feed_id: string;
  status: 'healthy' | 'warning' | 'critical' | 'offline';
  response_time_ms: number;
  last_checked: string;
  error_message?: string;
  total_items: number;
  valid_items: number;
  uptime_percentage: number;
}

interface AdminUser {
  id: string;
  email: string;
  role: 'super_admin' | 'admin' | 'editor' | 'viewer';
  last_login: string;
  mfa_enabled: boolean;
}

interface RSSFeedManagementProps {
  adminUser: AdminUser | null;
}

export const RSSFeedManagement: React.FC<RSSFeedManagementProps> = ({ adminUser }) => {
  const [feeds, setFeeds] = useState<RSSFeed[]>([]);
  const [feedHealth, setFeedHealth] = useState<Record<string, FeedHealth>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newFeed, setNewFeed] = useState({
    name: '',
    url: '',
    category: 'AI Automation',
    credibility_score: 80
  });

  const categories = ['AI Automation', 'Healthcare', 'Finance', 'Real Estate'];

  useEffect(() => {
    loadFeeds();
    loadFeedHealth();
  }, []);

  const loadFeeds = async () => {
    try {
      const { data, error } = await supabase
        .from('rss_feeds')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFeeds(data || []);
    } catch (error) {
      console.error('Error loading RSS feeds:', error);
      toast.error('Failed to load RSS feeds');
    }
  };

  const loadFeedHealth = async () => {
    try {
      const { data, error } = await supabase
        .from('rss_feed_health')
        .select('*');

      if (error) throw error;
      
      const healthMap = (data || []).reduce((acc, health) => {
        acc[health.feed_id] = health as FeedHealth;
        return acc;
      }, {} as Record<string, FeedHealth>);
      
      setFeedHealth(healthMap);
    } catch (error) {
      console.error('Error loading feed health:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addFeed = async () => {
    if (!newFeed.name || !newFeed.url) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const { error } = await supabase
        .from('rss_feeds')
        .insert([{
          name: newFeed.name,
          url: newFeed.url,
          category: newFeed.category,
          credibility_score: newFeed.credibility_score
        }]);

      if (error) throw error;

      toast.success('RSS feed added successfully');
      setShowAddDialog(false);
      setNewFeed({ name: '', url: '', category: 'AI Automation', credibility_score: 80 });
      loadFeeds();
    } catch (error) {
      console.error('Error adding RSS feed:', error);
      toast.error('Failed to add RSS feed');
    }
  };

  const toggleFeed = async (feedId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('rss_feeds')
        .update({ is_active: !isActive })
        .eq('id', feedId);

      if (error) throw error;

      toast.success(`Feed ${!isActive ? 'activated' : 'deactivated'}`);
      loadFeeds();
    } catch (error) {
      console.error('Error toggling feed:', error);
      toast.error('Failed to update feed status');
    }
  };

  const deleteFeed = async (feedId: string) => {
    if (!confirm('Are you sure you want to delete this RSS feed?')) return;

    try {
      const { error } = await supabase
        .from('rss_feeds')
        .delete()
        .eq('id', feedId);

      if (error) throw error;

      toast.success('RSS feed deleted successfully');
      loadFeeds();
    } catch (error) {
      console.error('Error deleting feed:', error);
      toast.error('Failed to delete RSS feed');
    }
  };

  const triggerRSSAggregation = async () => {
    try {
      toast.info('Starting RSS aggregation...');
      
      const { data, error } = await supabase.functions.invoke('rss-aggregator', {
        body: { manual: true }
      });

      if (error) throw error;

      toast.success(`RSS aggregation completed: ${data.processed} feeds processed`);
      loadFeedHealth();
    } catch (error) {
      console.error('Error triggering RSS aggregation:', error);
      toast.error('Failed to trigger RSS aggregation');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'offline':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'critical':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'offline':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>RSS Feed Management</CardTitle>
          <CardDescription>Loading RSS feeds...</CardDescription>
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

  const healthyFeeds = Object.values(feedHealth).filter(h => h.status === 'healthy').length;
  const totalFeeds = feeds.length;
  const healthPercentage = totalFeeds > 0 ? (healthyFeeds / totalFeeds) * 100 : 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                RSS Feed Management
              </CardTitle>
              <CardDescription>
                Manage RSS feeds and monitor their health status
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={triggerRSSAggregation}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Run Aggregation
              </Button>
              <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogTrigger asChild>
                  <Button size="sm" className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Feed
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New RSS Feed</DialogTitle>
                    <DialogDescription>
                      Add a new RSS feed to the content curation system.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="feed-name">Feed Name</Label>
                      <Input
                        id="feed-name"
                        value={newFeed.name}
                        onChange={(e) => setNewFeed(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., McKinsey & Company"
                      />
                    </div>
                    <div>
                      <Label htmlFor="feed-url">RSS URL</Label>
                      <Input
                        id="feed-url"
                        value={newFeed.url}
                        onChange={(e) => setNewFeed(prev => ({ ...prev, url: e.target.value }))}
                        placeholder="https://example.com/rss"
                      />
                    </div>
                    <div>
                      <Label htmlFor="feed-category">Category</Label>
                      <Select
                        value={newFeed.category}
                        onValueChange={(value) => setNewFeed(prev => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="credibility-score">Credibility Score (0-100)</Label>
                      <Input
                        id="credibility-score"
                        type="number"
                        min="0"
                        max="100"
                        value={newFeed.credibility_score}
                        onChange={(e) => setNewFeed(prev => ({ ...prev, credibility_score: parseInt(e.target.value) || 80 }))}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={addFeed}>
                        Add Feed
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Health Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{totalFeeds}</div>
              <div className="text-sm text-blue-700">Total Feeds</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{healthyFeeds}</div>
              <div className="text-sm text-green-700">Healthy Feeds</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{healthPercentage.toFixed(1)}%</div>
              <div className="text-sm text-yellow-700">Health Rate</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {Object.values(feedHealth).reduce((acc, h) => acc + h.total_items, 0)}
              </div>
              <div className="text-sm text-purple-700">Total Items</div>
            </div>
          </div>

          {/* Feed List */}
          <div className="space-y-4">
            {feeds.map((feed) => {
              const health = feedHealth[feed.id];
              
              return (
                <div key={feed.id} className="border rounded-lg p-4 bg-card">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {health ? getStatusIcon(health.status) : <Clock className="h-4 w-4 text-gray-400" />}
                      <div>
                        <h3 className="font-semibold">{feed.name}</h3>
                        <p className="text-sm text-muted-foreground">{feed.url}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {feed.category}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        Score: {feed.credibility_score}
                      </Badge>
                      {health && (
                        <Badge className={getStatusColor(health.status)}>
                          {health.status}
                        </Badge>
                      )}
                      <Switch
                        checked={feed.is_active}
                        onCheckedChange={() => toggleFeed(feed.id, feed.is_active)}
                      />
                    </div>
                  </div>

                  {health && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                      <div className="text-sm">
                        <div className="text-muted-foreground">Response Time</div>
                        <div className="font-medium">{health.response_time_ms}ms</div>
                      </div>
                      <div className="text-sm">
                        <div className="text-muted-foreground">Items Found</div>
                        <div className="font-medium">{health.valid_items}/{health.total_items}</div>
                      </div>
                      <div className="text-sm">
                        <div className="text-muted-foreground">Uptime</div>
                        <div className="font-medium">{health.uptime_percentage.toFixed(1)}%</div>
                      </div>
                      <div className="text-sm">
                        <div className="text-muted-foreground">Last Checked</div>
                        <div className="font-medium">{new Date(health.last_checked).toLocaleTimeString()}</div>
                      </div>
                    </div>
                  )}

                  {health && health.error_message && (
                    <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                      <strong>Error:</strong> {health.error_message}
                    </div>
                  )}

                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteFeed(feed.id)}
                      className="flex items-center gap-2 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                      Delete
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
