// Global error handler to catch unhandled promise rejections and other errors
export function setupGlobalErrorHandlers() {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    
    // Prevent the default behavior which shows errors in console
    event.preventDefault();
    
    // Extract meaningful error information
    let errorMessage = 'An unexpected error occurred';
    if (event.reason instanceof Error) {
      errorMessage = event.reason.message;
    } else if (typeof event.reason === 'string') {
      errorMessage = event.reason;
    }
    
    // Only log significant errors, ignore common development errors
    if (!shouldIgnoreError(errorMessage)) {
      console.warn('Caught unhandled rejection:', errorMessage);
    }
  });

  // Handle general JavaScript errors
  window.addEventListener('error', (event) => {
    console.error('JavaScript error:', event.error);
    
    // Extract error details
    const errorMessage = event.error?.message || event.message || 'Unknown error';
    
    if (!shouldIgnoreError(errorMessage)) {
      console.warn('Caught JavaScript error:', errorMessage);
    }
  });
}

// Helper function to determine if we should ignore certain errors
function shouldIgnoreError(errorMessage: string): boolean {
  const ignoredPatterns = [
    // Common development/testing errors to ignore
    'ResizeObserver loop limit exceeded',
    'Non-Error promise rejection captured',
    'Loading chunk',
    'ChunkLoadError',
    'Loading CSS chunk',
    // Vite HMR related errors
    'Failed to fetch dynamically imported module',
    '[vite]',
    // Network errors that are handled elsewhere
    'NetworkError',
    'fetch',
    // Auth errors that are handled by components
    '401',
    'Unauthorized'
  ];
  
  return ignoredPatterns.some(pattern => 
    errorMessage.toLowerCase().includes(pattern.toLowerCase())
  );
}

// Query error handler specifically for TanStack Query
export function handleQueryError(error: unknown): void {
  if (error instanceof Error) {
    console.error('Query error:', error.message);
    // Don't show UI feedback here to avoid duplicate error messages
    // Individual components should handle their own error states
  }
}

// Mutation error handler for TanStack Query
export function handleMutationError(error: unknown): void {
  if (error instanceof Error) {
    console.error('Mutation error:', error.message);
    // Don't show UI feedback here to avoid duplicate error messages
    // Individual components should handle their own error states
  }
}