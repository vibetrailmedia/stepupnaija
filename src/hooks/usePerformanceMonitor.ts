import { useEffect, useRef } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  domContentLoaded: number;
  firstContentfulPaint?: number;
  largestContentfulPaint?: number;
  firstInputDelay?: number;
  cumulativeLayoutShift?: number;
}

interface UsePerformanceMonitorOptions {
  reportToAnalytics?: boolean;
  logToConsole?: boolean;
}

export function usePerformanceMonitor(options: UsePerformanceMonitorOptions = {}) {
  const { reportToAnalytics = false, logToConsole = true } = options;
  const metricsRef = useRef<PerformanceMetrics | null>(null);

  useEffect(() => {
    // Performance observer for various metrics
    const observePerformance = () => {
      const metrics: PerformanceMetrics = {
        loadTime: 0,
        domContentLoaded: 0,
      };

      // Basic timing metrics
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        metrics.loadTime = navigation.loadEventEnd - navigation.loadEventStart;
        metrics.domContentLoaded = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;
      }

      // Web Vitals metrics
      if ('PerformanceObserver' in window) {
        // First Contentful Paint
        new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];
          metrics.firstContentfulPaint = lastEntry.startTime;
          updateMetrics(metrics);
        }).observe({ type: 'paint', buffered: true });

        // Largest Contentful Paint
        new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];
          metrics.largestContentfulPaint = lastEntry.startTime;
          updateMetrics(metrics);
        }).observe({ type: 'largest-contentful-paint', buffered: true });

        // First Input Delay
        new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1] as PerformanceEventTiming;
          metrics.firstInputDelay = lastEntry.processingStart - lastEntry.startTime;
          updateMetrics(metrics);
        }).observe({ type: 'first-input', buffered: true });

        // Cumulative Layout Shift
        let clsValue = 0;
        new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          }
          metrics.cumulativeLayoutShift = clsValue;
          updateMetrics(metrics);
        }).observe({ type: 'layout-shift', buffered: true });
      }

      metricsRef.current = metrics;
    };

    const updateMetrics = (newMetrics: PerformanceMetrics) => {
      metricsRef.current = newMetrics;

      if (logToConsole) {
        console.group('🚀 Performance Metrics');
        console.log('Load Time:', newMetrics.loadTime, 'ms');
        console.log('DOM Content Loaded:', newMetrics.domContentLoaded, 'ms');
        if (newMetrics.firstContentfulPaint) {
          console.log('First Contentful Paint:', newMetrics.firstContentfulPaint, 'ms');
        }
        if (newMetrics.largestContentfulPaint) {
          console.log('Largest Contentful Paint:', newMetrics.largestContentfulPaint, 'ms');
        }
        if (newMetrics.firstInputDelay) {
          console.log('First Input Delay:', newMetrics.firstInputDelay, 'ms');
        }
        if (newMetrics.cumulativeLayoutShift) {
          console.log('Cumulative Layout Shift:', newMetrics.cumulativeLayoutShift);
        }
        console.groupEnd();
      }

      if (reportToAnalytics) {
        // Send to analytics service
        sendMetricsToAnalytics(newMetrics);
      }
    };

    // Wait for page load
    if (document.readyState === 'complete') {
      observePerformance();
    } else {
      window.addEventListener('load', observePerformance);
      return () => window.removeEventListener('load', observePerformance);
    }
  }, [reportToAnalytics, logToConsole]);

  return metricsRef.current;
}

function sendMetricsToAnalytics(metrics: PerformanceMetrics) {
  // Implementation for sending metrics to analytics service
  // This could be Google Analytics, Custom Analytics, etc.
  if (typeof (window as any).gtag !== 'undefined') {
    // Example: Send to Google Analytics
    (window as any).gtag('event', 'page_performance', {
      custom_parameter_load_time: metrics.loadTime,
      custom_parameter_fcp: metrics.firstContentfulPaint,
      custom_parameter_lcp: metrics.largestContentfulPaint,
      custom_parameter_fid: metrics.firstInputDelay,
      custom_parameter_cls: metrics.cumulativeLayoutShift,
    });
  }

  // Custom analytics endpoint
  fetch('/api/analytics/performance', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      metrics,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    }),
  }).catch(error => {
    console.warn('Failed to send performance metrics:', error);
  });
}

export default usePerformanceMonitor;