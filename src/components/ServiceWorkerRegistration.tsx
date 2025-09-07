import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export function ServiceWorkerRegistration() {
  const { toast } = useToast();

  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      const registerSW = async () => {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js', {
            scope: '/',
          });

          console.log('Service Worker registered successfully:', registration);

          // Listen for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New content available
                  toast({
                    title: "App Update Available",
                    description: "A new version is available. Refresh to update.",
                    duration: 10000,
                    action: (
                      <button
                        onClick={() => window.location.reload()}
                        className="bg-primary text-primary-foreground px-3 py-1 rounded text-sm"
                      >
                        Refresh
                      </button>
                    ),
                  });
                }
              });
            }
          });

          // Check for updates periodically
          setInterval(() => {
            registration.update();
          }, 60000); // Check every minute

        } catch (error) {
          console.error('Service Worker registration failed:', error);
        }
      };

      registerSW();

      // Listen for messages from service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'SKIP_WAITING') {
          window.location.reload();
        }
      });
    }
  }, [toast]);

  return null;
}

export default ServiceWorkerRegistration;