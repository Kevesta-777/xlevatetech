import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, BarChart3, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface Resource {
  id: string;
  title: string;
  description: string;
  pdf_url: string;
  download_count: number;
}

export const PopularResources = () => {
  const { data: resources = [], isLoading } = useQuery({
    queryKey: ['popular-resources'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .order('download_count', { ascending: false })
        .limit(3);
      
      if (error) throw error;
      return data || [];
    }
  });

  const getResourceIcon = (title: string) => {
    if (title.toLowerCase().includes('calculator') || title.toLowerCase().includes('roi')) {
      return <BarChart3 className="h-6 w-6 text-primary" />;
    } else if (title.toLowerCase().includes('checklist') || title.toLowerCase().includes('assessment')) {
      return <CheckCircle className="h-6 w-6 text-primary" />;
    } else {
      return <FileText className="h-6 w-6 text-primary" />;
    }
  };

  const handleDownload = async (resource: Resource) => {
    // Increment download count
    try {
      await supabase
        .from('resources')
        .update({ download_count: resource.download_count + 1 })
        .eq('id', resource.id);
      
      // Trigger file download
      const link = document.createElement('a');
      link.href = resource.pdf_url;
      link.download = resource.title;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading resource:', error);
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Popular Resources</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-muted rounded mb-2" />
              <div className="h-3 bg-muted rounded w-3/4 mb-2" />
              <div className="h-8 bg-muted rounded" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
          <Download className="h-5 w-5 text-primary" />
          Popular Resources
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Essential guides and tools for automation success
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {resources.map((resource, index) => (
          <motion.div
            key={resource.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group"
          >
            <div className="flex items-start gap-3 p-4 rounded-lg border border-border bg-background/50 hover:bg-background/80 transition-colors">
              <div className="flex-shrink-0 mt-1">
                {getResourceIcon(resource.title)}
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground text-sm leading-tight mb-2 group-hover:text-primary transition-colors">
                  {resource.title}
                </h3>
                
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                  {resource.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <Button
                    size="sm"
                    onClick={() => handleDownload(resource)}
                    className="text-xs h-8 px-3 bg-primary hover:bg-primary/90"
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Download
                  </Button>
                  
                  <span className="text-xs text-muted-foreground text-center">
                    {resource.download_count.toLocaleString()} downloads
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        
        {resources.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No resources available yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};