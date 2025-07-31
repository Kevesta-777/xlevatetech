import { useState } from 'react';
import { ExternalLink, AlertTriangle, CheckCircle, Archive, Clock, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { advancedLinkValidator, type LinkValidationResult } from '@/utils/advancedLinkValidator';

interface SmartLinkProps {
  url: string;
  children: React.ReactNode;
  className?: string;
  showValidationStatus?: boolean;
  validateBeforeRedirect?: boolean;
}

export const SmartLink = ({ 
  url, 
  children, 
  className = '', 
  showValidationStatus = true,
  validateBeforeRedirect = true 
}: SmartLinkProps) => {
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<LinkValidationResult | null>(null);
  const { toast } = useToast();

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!validateBeforeRedirect) {
      window.open(url, '_blank', 'noopener,noreferrer');
      return;
    }

    // Check cache first
    const cachedResult = advancedLinkValidator.getCachedResult(url);
    if (cachedResult) {
      handleLinkRedirect(cachedResult);
      return;
    }

    // Validate link before redirect
    setIsValidating(true);
    
    try {
      const result = await advancedLinkValidator.validateUrl(url);
      setValidationResult(result);
      handleLinkRedirect(result);
    } catch (error) {
      toast({
        title: "Validation Error",
        description: "Unable to verify link. Proceeding with caution.",
        variant: "destructive",
        duration: 3000,
      });
      
      // Ask user if they want to proceed anyway
      const proceed = confirm('Unable to verify this link. Open anyway?');
      if (proceed) {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    } finally {
      setIsValidating(false);
    }
  };

  const handleLinkRedirect = (result: LinkValidationResult) => {
    if (result.isValid) {
      // Use redirect URL if available (for moved content)
      const targetUrl = result.redirectUrl || url;
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
      
      toast({
        title: "Link Verified",
        description: "Opening verified source...",
        duration: 2000,
      });
    } else if (result.archiveUrl) {
      // Offer archived version
      const useArchive = confirm(
        'The original article is no longer available. Would you like to view the archived version instead?'
      );
      
      if (useArchive) {
        window.open(result.archiveUrl, '_blank', 'noopener,noreferrer');
        toast({
          title: "Archive Version",
          description: "Opening archived version from Wayback Machine...",
          duration: 3000,
        });
      }
    } else {
      // Link is broken
      toast({
        title: "Link Unavailable",
        description: "This article is no longer available at the source. Please try another article.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  const getValidationIcon = () => {
    if (isValidating) {
      return <Clock className="h-3 w-3 animate-spin text-yellow-400" />;
    }
    
    const cached = advancedLinkValidator.getCachedResult(url);
    if (cached) {
      if (cached.isValid) {
        return <CheckCircle className="h-3 w-3 text-green-400" />;
      } else if (cached.archiveUrl) {
        return <Archive className="h-3 w-3 text-blue-400" />;
      } else {
        return <AlertTriangle className="h-3 w-3 text-red-400" />;
      }
    }
    
    return <Shield className="h-3 w-3 text-gray-400" />;
  };

  const getValidationBadge = () => {
    if (isValidating) {
      return <Badge variant="outline" className="border-yellow-500/50 text-yellow-400 text-xs">Checking</Badge>;
    }
    
    const cached = advancedLinkValidator.getCachedResult(url);
    if (cached) {
      if (cached.isValid) {
        return <Badge variant="outline" className="border-green-500/50 text-green-400 text-xs">Verified</Badge>;
      } else if (cached.archiveUrl) {
        return <Badge variant="outline" className="border-blue-500/50 text-blue-400 text-xs">Archived</Badge>;
      } else {
        return <Badge variant="outline" className="border-red-500/50 text-red-400 text-xs">Unavailable</Badge>;
      }
    }
    
    return null;
  };

  const getDomainInfo = () => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch {
      return 'External Link';
    }
  };

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <Button
        variant="ghost"
        onClick={handleClick}
        disabled={isValidating}
        className="p-0 h-auto text-accent hover:text-accent/80 font-normal inline-flex items-center gap-2"
      >
        {children}
        <ExternalLink className="h-3 w-3" />
        {showValidationStatus && getValidationIcon()}
      </Button>
      
      {showValidationStatus && getValidationBadge()}
      
      {/* Domain info tooltip */}
      <span className="text-xs text-gray-400 hidden md:inline">
        {getDomainInfo()}
      </span>
    </div>
  );
};

interface LinkValidationStatusProps {
  url: string;
  compact?: boolean;
}

export const LinkValidationStatus = ({ url, compact = false }: LinkValidationStatusProps) => {
  const [result, setResult] = useState<LinkValidationResult | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkLink = async () => {
    setIsChecking(true);
    try {
      const validationResult = await advancedLinkValidator.validateUrl(url);
      setResult(validationResult);
    } catch (error) {
      console.error('Link validation failed:', error);
    } finally {
      setIsChecking(false);
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {isChecking ? (
          <Clock className="h-4 w-4 animate-spin text-yellow-400" />
        ) : result ? (
          result.isValid ? (
            <CheckCircle className="h-4 w-4 text-green-400" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-red-400" />
          )
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={checkLink}
            className="text-gray-400 hover:text-white p-1 h-auto"
          >
            <Shield className="h-4 w-4" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {!result && !isChecking && (
        <Button
          variant="outline"
          size="sm"
          onClick={checkLink}
          className="border-white/30 text-white hover:bg-white/10"
        >
          <Shield className="h-4 w-4 mr-2" />
          Verify Link
        </Button>
      )}
      
      {isChecking && (
        <div className="flex items-center gap-2 text-yellow-400">
          <Clock className="h-4 w-4 animate-spin" />
          <span className="text-sm">Validating link...</span>
        </div>
      )}
      
      {result && (
        <Alert className={result.isValid ? 'border-green-500/50' : 'border-red-500/50'}>
          {result.isValid ? (
            <CheckCircle className="h-4 w-4 text-green-400" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-red-400" />
          )}
          <AlertDescription>
            <div className="space-y-1">
              <p className="font-medium">
                {result.isValid ? 'Link Verified' : 'Link Unavailable'}
              </p>
              <p className="text-xs">
                Status: {result.status} | Response: {result.responseTime}ms
              </p>
              {result.archiveUrl && (
                <p className="text-xs">
                  <Archive className="h-3 w-3 inline mr-1" />
                  Archived version available
                </p>
              )}
              <p className="text-xs text-gray-400">
                Checked: {result.lastChecked.toLocaleString()}
              </p>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};