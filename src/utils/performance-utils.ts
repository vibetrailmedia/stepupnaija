/**
 * Performance Utilities for Nigerian Users
 * Optimized for slower connections and mobile devices
 */

// Connection quality detection
export function getConnectionQuality(): 'excellent' | 'good' | 'moderate' | 'slow' | 'unknown' {
  // @ts-ignore - Navigator connection is experimental but widely supported
  const connection = navigator?.connection || navigator?.mozConnection || navigator?.webkitConnection;
  
  if (!connection) return 'unknown';
  
  const { effectiveType, downlink, rtt } = connection;
  
  // Nigerian network context - be more conservative with classifications
  if (effectiveType === '4g' && downlink > 15 && rtt < 100) return 'excellent';
  if (effectiveType === '4g' && downlink > 5) return 'good';
  if (effectiveType === '3g' || (effectiveType === '4g' && downlink < 5)) return 'moderate';
  if (effectiveType === '2g' || rtt > 1000) return 'slow';
  
  return 'unknown';
}

// Data usage estimation
export function estimateDataUsage() {
  let estimatedUsage = 0;
  
  // Estimate based on loaded resources
  if (typeof performance !== 'undefined') {
    const resources = performance.getEntriesByType('resource');
    resources.forEach(resource => {
      // @ts-ignore
      estimatedUsage += resource.transferSize || 0;
    });
  }
  
  return {
    bytes: estimatedUsage,
    mb: Math.round(estimatedUsage / 1024 / 1024 * 100) / 100,
    kb: Math.round(estimatedUsage / 1024 * 100) / 100,
  };
}

// Preload critical resources for better performance
export function preloadCriticalResources() {
  const criticalResources = [
    // Preload critical fonts
    { href: '/fonts/inter.woff2', as: 'font', type: 'font/woff2' },
    // Preload hero images for landing page
    { href: '/assets/hero-bg.webp', as: 'image' },
  ];

  criticalResources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource.href;
    link.as = resource.as;
    if (resource.type) link.type = resource.type;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
}

// Lazy load non-critical resources
export function lazyLoadResource(src: string, type: 'image' | 'script' | 'style'): Promise<void> {
  return new Promise((resolve, reject) => {
    let element: HTMLElement;
    
    switch (type) {
      case 'image':
        element = new Image();
        (element as HTMLImageElement).src = src;
        break;
      case 'script':
        element = document.createElement('script');
        (element as HTMLScriptElement).src = src;
        document.head.appendChild(element);
        break;
      case 'style':
        element = document.createElement('link');
        (element as HTMLLinkElement).rel = 'stylesheet';
        (element as HTMLLinkElement).href = src;
        document.head.appendChild(element);
        break;
      default:
        reject(new Error('Unsupported resource type'));
        return;
    }
    
    element.onload = () => resolve();
    element.onerror = () => reject(new Error(`Failed to load ${src}`));
  });
}

// Progressive enhancement for slower connections
export function shouldUseProgressiveEnhancement(): boolean {
  const quality = getConnectionQuality();
  const dataUsage = estimateDataUsage();
  
  // Use progressive enhancement for slower connections or high data usage
  return quality === 'slow' || quality === 'moderate' || dataUsage.mb > 10;
}

// Optimize images based on connection
export function getOptimizedImageSettings() {
  const quality = getConnectionQuality();
  
  switch (quality) {
    case 'slow':
      return { quality: 30, format: 'webp', maxWidth: 640 };
    case 'moderate':
      return { quality: 50, format: 'webp', maxWidth: 1024 };
    case 'good':
      return { quality: 75, format: 'webp', maxWidth: 1920 };
    case 'excellent':
      return { quality: 85, format: 'webp', maxWidth: 2560 };
    default:
      return { quality: 60, format: 'webp', maxWidth: 1024 };
  }
}

// Resource priority hints for better loading
export function setResourcePriority(url: string, priority: 'high' | 'low' | 'auto' = 'auto') {
  if (typeof document === 'undefined') return;
  
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = url;
  link.setAttribute('fetchpriority', priority);
  document.head.appendChild(link);
}

// Bundle splitting detection and loading
export function loadChunkWhenNeeded(chunkName: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `/assets/js/${chunkName}.js`;
    script.async = true;
    
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error(`Failed to load chunk: ${chunkName}`));
    
    document.head.appendChild(script);
  });
}

// Critical resource detection
export function getCriticalResources(): string[] {
  return [
    // Critical CSS
    '/assets/css/critical.css',
    // Main JavaScript bundle
    '/assets/js/main.js',
    // Primary fonts
    '/fonts/inter-var.woff2',
    // Logo and hero images
    '/assets/img/logo.webp',
  ];
}

// Performance budget checker
export function checkPerformanceBudget(): {
  passed: boolean;
  metrics: {
    totalSize: number;
    loadTime: number;
    budgets: {
      maxSize: number;
      maxLoadTime: number;
    };
  };
} {
  const dataUsage = estimateDataUsage();
  const loadTime = performance.timing ? 
    performance.timing.loadEventEnd - performance.timing.navigationStart : 0;
  
  // Conservative budgets for Nigerian users
  const budgets = {
    maxSize: 2 * 1024 * 1024, // 2MB max
    maxLoadTime: 5000, // 5 seconds max
  };
  
  const passed = dataUsage.bytes <= budgets.maxSize && loadTime <= budgets.maxLoadTime;
  
  if (!passed) {
    console.warn('🚨 Performance budget exceeded:', {
      size: `${dataUsage.mb}MB / ${budgets.maxSize / 1024 / 1024}MB`,
      loadTime: `${loadTime}ms / ${budgets.maxLoadTime}ms`
    });
  }
  
  return {
    passed,
    metrics: {
      totalSize: dataUsage.bytes,
      loadTime,
      budgets,
    }
  };
}