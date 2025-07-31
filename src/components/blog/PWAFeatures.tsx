import { useState, useEffect } from 'react';
import { Smartphone, Wifi, Download, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface PWACapability {
  name: string;
  supported: boolean;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const PWAFeatures = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [capabilities, setCapabilities] = useState<PWACapability[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    checkPWACapabilities();
    setupPWAEventListeners();
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const checkPWACapabilities = () => {
    const pwaPapabilities: PWACapability[] = [
      {
        name: 'Offline Support',
        supported: 'serviceWorker' in navigator,
        description: 'Works offline with cached content',
        icon: Wifi
      },
      {
        name: 'App Installation',
        supported: 'standalone' in window.navigator || window.matchMedia('(display-mode: standalone)').matches,
        description: 'Can be installed as a native app',
        icon: Smartphone
      },
      {
        name: 'Background Sync',
        supported: 'serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype,
        description: 'Sync data when connection is restored',
        icon: Download
      },
      {
        name: 'Web Share',
        supported: 'share' in navigator,
        description: 'Native sharing capabilities',
        icon: Share
      }
    ];

    setCapabilities(pwaPapabilities);
  };

  const setupPWAEventListeners = () => {
    // Online/Offline detection
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // PWA install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });

    // Check if app is already installed
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    // Check for standalone mode (installed PWA)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }
  };

  const handleOnline = () => {
    setIsOnline(true);
    toast({
      title: "Connection Restored",
      description: "You're back online. Syncing latest content...",
      duration: 3000,
    });
  };

  const handleOffline = () => {
    setIsOnline(false);
    toast({
      title: "Offline Mode",
      description: "No internet connection. Cached content is available.",
      duration: 5000,
    });
  };

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      toast({
        title: "Installation Not Available",
        description: "The app is already installed or installation is not supported on this device.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      toast({
        title: "App Installing",
        description: "Xlevate Tech Automation Hub is being installed...",
        duration: 3000,
      });
    }
    
    setDeferredPrompt(null);
  };

  const handleWebShare = async () => {
    if ('share' in navigator) {
      try {
        await navigator.share({
          title: '2025 Automation Intelligence Hub',
          text: 'Latest automation insights and market data from Xlevate Tech',
          url: window.location.href
        });
        
        toast({
          title: "Shared Successfully",
          description: "Content shared via native share dialog.",
          duration: 2000,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      toast({
        title: "Share Not Supported",
        description: "Native sharing is not available on this device.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Smartphone className="h-5 w-5 text-accent" />
          Progressive Web App Features
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Connection Status */}
        <div className="mb-6 p-3 rounded-lg bg-white/5">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-white font-medium">
              {isOnline ? 'Online' : 'Offline Mode'}
            </span>
            <Badge variant="outline" className={isOnline ? 'border-green-500/50 text-green-400' : 'border-red-500/50 text-red-400'}>
              {isOnline ? 'Connected' : 'Cached Content Available'}
            </Badge>
          </div>
          {!isOnline && (
            <p className="text-sm text-gray-400 mt-2">
              You can still browse previously loaded content and use core features.
            </p>
          )}
        </div>

        {/* PWA Capabilities */}
        <div className="space-y-4 mb-6">
          <h4 className="text-white font-medium">Available Features</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {capabilities.map((capability, index) => (
              <div key={index} className="flex items-start gap-3 p-3 border border-white/10 rounded-lg">
                <capability.icon className={`h-5 w-5 mt-0.5 ${capability.supported ? 'text-green-400' : 'text-gray-400'}`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-medium text-sm">{capability.name}</span>
                    <Badge 
                      variant="outline" 
                      className={capability.supported ? 'border-green-500/50 text-green-400' : 'border-gray-500/50 text-gray-400'}
                    >
                      {capability.supported ? 'Available' : 'Not Supported'}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-400">{capability.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {!isInstalled && deferredPrompt && (
            <Button
              onClick={handleInstallClick}
              className="w-full bg-accent hover:bg-accent/80 text-black font-medium"
            >
              <Download className="h-4 w-4 mr-2" />
              Install App
            </Button>
          )}
          
          {isInstalled && (
            <div className="text-center p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <Smartphone className="h-6 w-6 text-green-400 mx-auto mb-2" />
              <p className="text-green-400 font-medium text-sm">App Successfully Installed</p>
              <p className="text-xs text-gray-400 mt-1">You can now use the app offline and receive push notifications</p>
            </div>
          )}

          {capabilities.find(c => c.name === 'Web Share')?.supported && (
            <Button
              onClick={handleWebShare}
              variant="outline"
              className="w-full border-white/30 text-white hover:bg-white/10"
            >
              <Share className="h-4 w-4 mr-2" />
              Share via Native Dialog
            </Button>
          )}
        </div>

        {/* PWA Benefits */}
        <div className="mt-6 p-4 bg-accent/10 rounded-lg">
          <h4 className="text-white font-medium mb-2">PWA Benefits</h4>
          <ul className="space-y-1 text-sm text-gray-300">
            <li>• Fast loading with service worker caching</li>
            <li>• Works offline with essential features</li>
            <li>• App-like experience on mobile devices</li>
            <li>• Automatic updates in the background</li>
            <li>• Reduced data usage with intelligent caching</li>
            <li>• Native device integration where supported</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};