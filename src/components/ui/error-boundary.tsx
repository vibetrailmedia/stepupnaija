import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, MessageCircle } from 'lucide-react';
import { Button } from './button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

/**
 * Enhanced Error Boundary for Nigerian Users
 * 
 * Provides user-friendly error messages and recovery options
 * when JavaScript errors occur, with Nigerian context.
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Log error for monitoring
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
    
    // In production, send to error monitoring service
    if (process.env.NODE_ENV === 'production') {
      this.reportError(error, errorInfo);
    }
  }

  private reportError = (error: Error, errorInfo: ErrorInfo) => {
    // Report to error monitoring service
    // For Nigerian users, consider offline-first error reporting
    try {
      fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
          url: window.location.href,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
        }),
      }).catch(() => {
        // Store error locally for later reporting if offline
        const offlineErrors = JSON.parse(localStorage.getItem('offline_errors') || '[]');
        offlineErrors.push({
          message: error.message,
          timestamp: new Date().toISOString(),
          url: window.location.href,
        });
        localStorage.setItem('offline_errors', JSON.stringify(offlineErrors.slice(-10))); // Keep last 10
      });
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
    }
  };

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private handleReportIssue = () => {
    const subject = encodeURIComponent('Step Up Naija - Error Report');
    const body = encodeURIComponent(`
Dear Step Up Naija Team,

I encountered an error while using the platform:

Error: ${this.state.error?.message || 'Unknown error'}
Page: ${window.location.href}
Time: ${new Date().toLocaleString()}
Browser: ${navigator.userAgent}

Please look into this issue.

Thank you.
    `);
    
    window.open(`mailto:support@stepupnaija.ng?subject=${subject}&body=${body}`);
  };

  public render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
            {/* Error Icon */}
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" aria-hidden="true" />
            </div>

            {/* Error Title */}
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              Something went wrong
            </h1>

            {/* User-friendly error message */}
            <p className="text-gray-600 mb-6">
              We're sorry, but there was a problem loading this page. 
              This might be due to a temporary technical issue.
            </p>

            {/* Error Actions */}
            <div className="space-y-3">
              <Button
                onClick={this.handleRetry}
                className="w-full flex items-center justify-center gap-2"
                data-testid="button-retry"
              >
                <RefreshCw className="w-4 h-4" aria-hidden="true" />
                Try Again
              </Button>

              <Button
                onClick={this.handleGoHome}
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
                data-testid="button-home"
              >
                <Home className="w-4 h-4" aria-hidden="true" />
                Go to Home
              </Button>

              <Button
                onClick={this.handleReportIssue}
                variant="ghost"
                className="w-full flex items-center justify-center gap-2"
                data-testid="button-report"
              >
                <MessageCircle className="w-4 h-4" aria-hidden="true" />
                Report Issue
              </Button>
            </div>

            {/* Additional help text */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                If this problem persists, please contact our support team at{' '}
                <a 
                  href="mailto:support@stepupnaija.ng" 
                  className="text-green-600 hover:text-green-700 underline"
                >
                  support@stepupnaija.ng
                </a>
              </p>
            </div>

            {/* Debug information (only in development) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4 text-left">
                <summary className="text-sm text-gray-600 cursor-pointer hover:text-gray-800">
                  Technical Details (Development Only)
                </summary>
                <div className="mt-2 p-3 bg-gray-100 rounded text-xs text-gray-700 overflow-auto">
                  <pre>{this.state.error.stack}</pre>
                  {this.state.errorInfo && (
                    <pre className="mt-2 pt-2 border-t border-gray-300">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook for functional components to handle errors
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const handleError = React.useCallback((error: Error) => {
    setError(error);
    console.error('Error handled:', error);
  }, []);

  // Throw error to be caught by Error Boundary
  if (error) {
    throw error;
  }

  return { handleError, resetError };
}

// HOC to wrap components with error boundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode,
  onError?: (error: Error, errorInfo: ErrorInfo) => void
) {
  return function WrappedComponent(props: P) {
    return (
      <ErrorBoundary fallback={fallback} onError={onError}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}