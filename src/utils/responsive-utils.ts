/**
 * Responsive utility functions for mobile optimization
 */

// Detect mobile devices
export function isMobileDevice(): boolean {
  if (typeof navigator === 'undefined') return false;
  
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

// Detect touch capability
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

// Get viewport dimensions
export function getViewportDimensions() {
  if (typeof window === 'undefined') {
    return { width: 1200, height: 800 };
  }
  
  return {
    width: Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0),
    height: Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
  };
}

// Check if viewport is mobile sized
export function isMobileViewport(): boolean {
  const { width } = getViewportDimensions();
  return width < 768; // Tailwind's md breakpoint
}

// Check if viewport is tablet sized
export function isTabletViewport(): boolean {
  const { width } = getViewportDimensions();
  return width >= 768 && width < 1024; // Between md and lg breakpoints
}

// Get responsive padding based on screen size
export function getResponsivePadding(): string {
  if (isMobileViewport()) {
    return "px-4 py-3";
  }
  if (isTabletViewport()) {
    return "px-6 py-4";
  }
  return "px-8 py-6";
}

// Get responsive text size classes
export function getResponsiveTextSize(size: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl'): string {
  const sizeMap = {
    xs: "text-xs sm:text-sm",
    sm: "text-sm sm:text-base",
    base: "text-base sm:text-lg",
    lg: "text-lg sm:text-xl",
    xl: "text-xl sm:text-2xl",
    '2xl': "text-2xl sm:text-3xl",
    '3xl': "text-3xl sm:text-4xl md:text-5xl"
  };
  
  return sizeMap[size] || sizeMap.base;
}

// Optimize images for mobile
export function getOptimizedImageProps(src: string, alt: string) {
  return {
    src,
    alt,
    loading: 'lazy' as const,
    decoding: 'async' as const,
    className: "w-full h-auto object-cover"
  };
}

// Handle safe area insets for mobile devices
export function getSafeAreaClasses(): string {
  return "pt-safe-area-inset-top pb-safe-area-inset-bottom pl-safe-area-inset-left pr-safe-area-inset-right";
}

// Mobile-optimized button sizes
export function getMobileButtonSize(size: 'sm' | 'md' | 'lg' = 'md'): string {
  const sizes = {
    sm: "px-3 py-2 text-sm min-h-[40px] min-w-[80px]",
    md: "px-4 py-3 text-base min-h-[48px] min-w-[100px]",
    lg: "px-6 py-4 text-lg min-h-[56px] min-w-[120px]"
  };
  
  return `${sizes[size]} touch-manipulation`;
}

// Responsive grid classes
export function getResponsiveGrid(
  mobile: number = 1, 
  tablet: number = 2, 
  desktop: number = 3
): string {
  return `grid grid-cols-${mobile} md:grid-cols-${tablet} lg:grid-cols-${desktop}`;
}

// Calculate optimal font size for mobile
export function getMobileFontSize(baseSize: number): number {
  const { width } = getViewportDimensions();
  
  if (width < 375) {
    return Math.max(baseSize * 0.9, 12); // Minimum 12px
  }
  if (width < 768) {
    return baseSize;
  }
  return baseSize * 1.1; // Slightly larger on tablets+
}

// Mobile-optimized spacing
export function getMobileSpacing(size: 'xs' | 'sm' | 'md' | 'lg' | 'xl'): string {
  const spacingMap = {
    xs: "space-y-2 sm:space-y-3",
    sm: "space-y-3 sm:space-y-4",
    md: "space-y-4 sm:space-y-6",
    lg: "space-y-6 sm:space-y-8",
    xl: "space-y-8 sm:space-y-12"
  };
  
  return spacingMap[size];
}

// Detect if user prefers reduced motion
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Get animation classes based on user preference
export function getAnimationClasses(animation: string): string {
  if (prefersReducedMotion()) {
    return '';
  }
  return animation;
}

// Mobile navigation helpers
export function getMobileNavClasses(): string {
  return "fixed inset-x-0 top-0 z-50 h-screen overflow-y-auto bg-white shadow-lg";
}

// Responsive container classes
export function getResponsiveContainer(): string {
  return "w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8";
}

// Mobile card optimization
export function getMobileCardClasses(): string {
  return "bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow";
}

// Accessibility helpers for mobile
export function getMobileA11yClasses(): string {
  return "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white";
}

// Handle iOS viewport height issues
export function getFullHeightClasses(): string {
  return "h-screen h-[100dvh]";
}