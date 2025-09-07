import { Suspense, lazy, ComponentType } from 'react';
import { Route, RouteProps } from 'wouter';
import { Skeleton } from '@/components/ui/skeleton';
import ErrorBoundary from './ErrorBoundary';

interface LazyRouteProps extends Omit<RouteProps, 'component'> {
  component: () => Promise<{ default: ComponentType<any> }>;
  fallback?: React.ReactNode;
}

function DefaultLoadingFallback() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header skeleton */}
      <div className="h-16 border-b bg-background">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <Skeleton className="h-8 w-32" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      </div>

      {/* Main content skeleton */}
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="grid gap-6">
          {/* Title */}
          <Skeleton className="h-10 w-64" />
          
          {/* Content grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function LazyRoute({ 
  component: importComponent, 
  fallback = <DefaultLoadingFallback />,
  ...routeProps 
}: LazyRouteProps) {
  const LazyComponent = lazy(importComponent);

  return (
    <Route
      {...routeProps}
      component={() => (
        <ErrorBoundary>
          <Suspense fallback={fallback}>
            <LazyComponent />
          </Suspense>
        </ErrorBoundary>
      )}
    />
  );
}

// Pre-configured lazy routes for common pages
export const createLazyRoute = (importFn: () => Promise<{ default: ComponentType<any> }>) => {
  return lazy(importFn);
};

// Hook for preloading routes
export function usePreloadRoute(importFn: () => Promise<{ default: ComponentType<any> }>) {
  const preload = () => {
    // Preload the component
    importFn();
  };

  return preload;
}

export default LazyRoute;