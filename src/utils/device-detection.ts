/**
 * Device Detection and Cross-Device Utilities for Nigerian Users
 * 
 * Helps optimize the experience across different devices
 * commonly used in Nigeria, from budget Android phones
 * to desktop computers.
 */

interface DeviceInfo {
  type: 'mobile' | 'tablet' | 'desktop';
  os: 'android' | 'ios' | 'windows' | 'macos' | 'linux' | 'unknown';
  browser: 'chrome' | 'firefox' | 'safari' | 'edge' | 'opera' | 'unknown';
  screenSize: 'small' | 'medium' | 'large' | 'xlarge';
  touchCapable: boolean;
  orientation: 'portrait' | 'landscape';
  connectionType: 'slow' | 'moderate' | 'fast' | 'unknown';
}

// Detect device type
export function getDeviceType(): DeviceInfo['type'] {
  const userAgent = navigator.userAgent.toLowerCase();
  const screenWidth = window.innerWidth;
  
  // Mobile devices (common in Nigeria)
  if (/android|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent)) {
    return 'mobile';
  }
  
  // iPad and Android tablets
  if (/ipad|android.*tablet/i.test(userAgent) || screenWidth >= 768) {
    return screenWidth < 1024 ? 'tablet' : 'desktop';
  }
  
  return 'desktop';
}

// Detect operating system
export function getOperatingSystem(): DeviceInfo['os'] {
  const userAgent = navigator.userAgent.toLowerCase();
  
  if (/android/i.test(userAgent)) return 'android';
  if (/iphone|ipad|ipod/i.test(userAgent)) return 'ios';
  if (/windows/i.test(userAgent)) return 'windows';
  if (/macintosh|mac os x/i.test(userAgent)) return 'macos';
  if (/linux/i.test(userAgent)) return 'linux';
  
  return 'unknown';
}

// Detect browser
export function getBrowser(): DeviceInfo['browser'] {
  const userAgent = navigator.userAgent.toLowerCase();
  
  // Chrome (most common in Nigeria)
  if (/chrome/i.test(userAgent) && !/edge|opr/i.test(userAgent)) return 'chrome';
  if (/firefox/i.test(userAgent)) return 'firefox';
  if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) return 'safari';
  if (/edge/i.test(userAgent)) return 'edge';
  if (/opr|opera/i.test(userAgent)) return 'opera';
  
  return 'unknown';
}

// Detect screen size category
export function getScreenSize(): DeviceInfo['screenSize'] {
  const width = window.innerWidth;
  
  if (width < 640) return 'small';    // Mobile phones
  if (width < 1024) return 'medium';  // Large phones, small tablets
  if (width < 1440) return 'large';   // Tablets, small laptops
  return 'xlarge';                    // Desktop, large laptops
}

// Detect touch capability
export function isTouchDevice(): boolean {
  return 'ontouchstart' in window || 
         navigator.maxTouchPoints > 0 || 
         (window as any).DocumentTouch && document instanceof (window as any).DocumentTouch;
}

// Detect orientation
export function getOrientation(): DeviceInfo['orientation'] {
  return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
}

// Detect connection speed (important for Nigerian users)
export function getConnectionType(): DeviceInfo['connectionType'] {
  // @ts-ignore - Navigator connection is experimental
  const connection = navigator?.connection || navigator?.mozConnection || navigator?.webkitConnection;
  
  if (!connection) return 'unknown';
  
  const { effectiveType, downlink, rtt } = connection;
  
  // Conservative thresholds for Nigerian networks
  if (effectiveType === '4g' && downlink > 10 && rtt < 150) return 'fast';
  if (effectiveType === '4g' || (effectiveType === '3g' && downlink > 2)) return 'moderate';
  return 'slow';
}

// Get complete device information
export function getDeviceInfo(): DeviceInfo {
  return {
    type: getDeviceType(),
    os: getOperatingSystem(),
    browser: getBrowser(),
    screenSize: getScreenSize(),
    touchCapable: isTouchDevice(),
    orientation: getOrientation(),
    connectionType: getConnectionType()
  };
}

// Device-specific optimizations
export function getOptimizationSettings(deviceInfo: DeviceInfo) {
  const settings = {
    // Image quality based on device and connection
    imageQuality: 75,
    // Animation preferences
    reduceMotion: false,
    // Touch target sizes
    minTouchTarget: 44,
    // Font size adjustments
    baseFontSize: 16,
    // Caching strategy
    cacheStrategy: 'moderate' as 'aggressive' | 'moderate' | 'minimal'
  };

  // Optimize for mobile devices
  if (deviceInfo.type === 'mobile') {
    settings.minTouchTarget = 48; // Larger touch targets for mobile
    settings.baseFontSize = 14; // Slightly smaller base font
    
    // Further optimize for slow connections
    if (deviceInfo.connectionType === 'slow') {
      settings.imageQuality = 40;
      settings.cacheStrategy = 'aggressive';
      settings.reduceMotion = true;
    }
  }

  // Optimize for small screens (common budget phones in Nigeria)
  if (deviceInfo.screenSize === 'small') {
    settings.baseFontSize = 14;
    settings.imageQuality = Math.min(settings.imageQuality, 60);
  }

  // Optimize for older devices (reduce animations)
  if (deviceInfo.browser === 'unknown' || deviceInfo.os === 'unknown') {
    settings.reduceMotion = true;
    settings.imageQuality = Math.min(settings.imageQuality, 50);
  }

  return settings;
}

// Check for specific device capabilities
export function getDeviceCapabilities() {
  return {
    // Storage capabilities
    localStorage: typeof localStorage !== 'undefined',
    sessionStorage: typeof sessionStorage !== 'undefined',
    indexedDB: typeof indexedDB !== 'undefined',
    
    // Network capabilities
    onlineStatus: 'onLine' in navigator,
    connectionInfo: 'connection' in navigator,
    
    // Media capabilities
    webp: checkWebPSupport(),
    avif: checkAVIFSupport(),
    
    // Modern JS features
    es6Modules: 'noModule' in HTMLScriptElement.prototype,
    serviceWorker: 'serviceWorker' in navigator,
    
    // Performance APIs
    performanceObserver: 'PerformanceObserver' in window,
    intersectionObserver: 'IntersectionObserver' in window,
    
    // Security features
    httpsOnly: location.protocol === 'https:',
    
    // Payment capabilities (for Nigerian payment integration)
    paymentRequest: 'PaymentRequest' in window,
    
    // Notification capabilities
    notifications: 'Notification' in window,
    pushManager: 'serviceWorker' in navigator && 'PushManager' in window
  };
}

// Check WebP support
function checkWebPSupport(): boolean {
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
}

// Check AVIF support
function checkAVIFSupport(): boolean {
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
}

// Responsive breakpoints commonly used in Nigeria
export const BREAKPOINTS = {
  // Budget smartphones (common in Nigeria)
  small: '320px',
  // Standard smartphones
  medium: '640px',
  // Tablets and phablets
  large: '1024px',
  // Desktop and laptops
  xlarge: '1440px',
  // Large desktop screens
  xxlarge: '1920px'
} as const;

// Common device presets for testing
export const DEVICE_PRESETS = {
  // Budget Android phones (very common in Nigeria)
  budgetAndroid: {
    width: 360,
    height: 640,
    pixelRatio: 1.5,
    userAgent: 'Mozilla/5.0 (Linux; Android 8.1; SM-J260G) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36'
  },
  
  // Mid-range smartphones
  standardPhone: {
    width: 375,
    height: 667,
    pixelRatio: 2,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
  },
  
  // Tablets (sometimes used in Nigerian offices)
  tablet: {
    width: 768,
    height: 1024,
    pixelRatio: 2,
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
  },
  
  // Desktop computers (offices, cyber cafes)
  desktop: {
    width: 1920,
    height: 1080,
    pixelRatio: 1,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  }
} as const;

// Performance monitoring for different devices
export function logDevicePerformance() {
  const deviceInfo = getDeviceInfo();
  const capabilities = getDeviceCapabilities();
  
  console.group('📱 Device Information for Step Up Naija');
  console.log('Device Type:', deviceInfo.type);
  console.log('Operating System:', deviceInfo.os);
  console.log('Browser:', deviceInfo.browser);
  console.log('Screen Size:', deviceInfo.screenSize);
  console.log('Connection:', deviceInfo.connectionType);
  console.log('Touch Capable:', deviceInfo.touchCapable);
  console.log('Orientation:', deviceInfo.orientation);
  console.log('WebP Support:', capabilities.webp);
  console.log('Service Worker:', capabilities.serviceWorker);
  console.groupEnd();
  
  return { deviceInfo, capabilities };
}