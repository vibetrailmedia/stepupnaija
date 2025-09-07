/**
 * Testing Utilities for Cross-Device Compatibility
 * 
 * Comprehensive testing helpers for ensuring Step Up Naija
 * works well across devices commonly used in Nigeria.
 */

interface TestConfig {
  device: 'mobile' | 'tablet' | 'desktop';
  connection: 'slow' | 'moderate' | 'fast';
  browser: 'chrome' | 'firefox' | 'safari' | 'edge';
  accessibility: boolean;
  offline: boolean;
}

interface PerformanceMetrics {
  loadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  totalBlockingTime: number;
}

// Test configurations for Nigerian context
export const TEST_CONFIGURATIONS: TestConfig[] = [
  // Most common: Budget Android phone with Chrome on slow connection
  {
    device: 'mobile',
    connection: 'slow',
    browser: 'chrome',
    accessibility: false,
    offline: false
  },
  
  // Common: Standard smartphone with moderate connection
  {
    device: 'mobile',
    connection: 'moderate',
    browser: 'chrome',
    accessibility: false,
    offline: false
  },
  
  // Office setting: Desktop with fast connection
  {
    device: 'desktop',
    connection: 'fast',
    browser: 'chrome',
    accessibility: false,
    offline: false
  },
  
  // Accessibility test: Screen reader simulation
  {
    device: 'desktop',
    connection: 'moderate',
    browser: 'chrome',
    accessibility: true,
    offline: false
  },
  
  // Offline scenario: Common in Nigeria
  {
    device: 'mobile',
    connection: 'slow',
    browser: 'chrome',
    accessibility: false,
    offline: true
  },
  
  // Tablet in landscape (sometimes used in Nigerian schools/offices)
  {
    device: 'tablet',
    connection: 'moderate',
    browser: 'safari',
    accessibility: false,
    offline: false
  }
];

// Performance testing utilities
export class PerformanceTester {
  private metrics: PerformanceMetrics = {
    loadTime: 0,
    firstContentfulPaint: 0,
    largestContentfulPaint: 0,
    cumulativeLayoutShift: 0,
    firstInputDelay: 0,
    totalBlockingTime: 0
  };

  startTest() {
    // Clear any existing metrics
    this.metrics = {
      loadTime: 0,
      firstContentfulPaint: 0,
      largestContentfulPaint: 0,
      cumulativeLayoutShift: 0,
      firstInputDelay: 0,
      totalBlockingTime: 0
    };

    // Set up performance observers
    this.setupPerformanceObservers();
    
    console.log('🚀 Performance test started for Nigerian device context');
  }

  private setupPerformanceObservers() {
    if ('PerformanceObserver' in window) {
      // First Contentful Paint
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fcp = entries.find(entry => entry.name === 'first-contentful-paint');
        if (fcp) {
          this.metrics.firstContentfulPaint = fcp.startTime;
        }
      }).observe({ type: 'paint', buffered: true });

      // Largest Contentful Paint
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) {
          this.metrics.largestContentfulPaint = lastEntry.startTime;
        }
      }).observe({ type: 'largest-contentful-paint', buffered: true });

      // Cumulative Layout Shift
      let clsValue = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          // @ts-ignore
          if (!entry.hadRecentInput) {
            // @ts-ignore
            clsValue += entry.value;
          }
        }
        this.metrics.cumulativeLayoutShift = clsValue;
      }).observe({ type: 'layout-shift', buffered: true });

      // First Input Delay
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const firstInput = entries[0] as PerformanceEventTiming;
        if (firstInput) {
          this.metrics.firstInputDelay = firstInput.processingStart - firstInput.startTime;
        }
      }).observe({ type: 'first-input', buffered: true });
    }
  }

  getResults(): PerformanceMetrics & { grade: string; recommendations: string[] } {
    // Calculate load time
    if (performance.timing) {
      this.metrics.loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
    }

    // Grading based on Nigerian network conditions
    const grade = this.calculateGrade();
    const recommendations = this.generateRecommendations();

    return {
      ...this.metrics,
      grade,
      recommendations
    };
  }

  private calculateGrade(): string {
    const { loadTime, firstContentfulPaint, largestContentfulPaint, cumulativeLayoutShift, firstInputDelay } = this.metrics;

    let score = 100;

    // Load time scoring (more lenient for Nigerian connections)
    if (loadTime > 5000) score -= 30;
    else if (loadTime > 3000) score -= 20;
    else if (loadTime > 2000) score -= 10;

    // FCP scoring
    if (firstContentfulPaint > 3000) score -= 20;
    else if (firstContentfulPaint > 2000) score -= 10;

    // LCP scoring
    if (largestContentfulPaint > 4000) score -= 20;
    else if (largestContentfulPaint > 2500) score -= 10;

    // CLS scoring
    if (cumulativeLayoutShift > 0.25) score -= 20;
    else if (cumulativeLayoutShift > 0.1) score -= 10;

    // FID scoring
    if (firstInputDelay > 300) score -= 20;
    else if (firstInputDelay > 100) score -= 10;

    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }

  private generateRecommendations(): string[] {
    const recommendations: string[] = [];
    const { loadTime, firstContentfulPaint, largestContentfulPaint, cumulativeLayoutShift, firstInputDelay } = this.metrics;

    if (loadTime > 3000) {
      recommendations.push('Optimize bundle size for Nigerian mobile connections');
      recommendations.push('Enable compression and caching for static assets');
    }

    if (firstContentfulPaint > 2000) {
      recommendations.push('Inline critical CSS to improve initial paint');
      recommendations.push('Optimize font loading strategy');
    }

    if (largestContentfulPaint > 2500) {
      recommendations.push('Optimize image loading and compression');
      recommendations.push('Implement lazy loading for below-the-fold content');
    }

    if (cumulativeLayoutShift > 0.1) {
      recommendations.push('Add explicit dimensions to images and videos');
      recommendations.push('Reserve space for dynamic content');
    }

    if (firstInputDelay > 100) {
      recommendations.push('Optimize JavaScript execution time');
      recommendations.push('Use code splitting to reduce main thread blocking');
    }

    return recommendations;
  }
}

// Accessibility testing utilities
export class AccessibilityTester {
  private issues: string[] = [];

  runAccessibilityAudit() {
    this.issues = [];
    console.log('♿ Running accessibility audit for Nigerian users');

    this.checkKeyboardNavigation();
    this.checkScreenReaderSupport();
    this.checkColorContrast();
    this.checkTouchTargets();
    this.checkLanguageSupport();

    return {
      passed: this.issues.length === 0,
      issues: this.issues,
      score: Math.max(0, 100 - (this.issues.length * 10))
    };
  }

  private checkKeyboardNavigation() {
    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) {
      this.issues.push('No focusable elements found - keyboard navigation may be impossible');
    }

    // Check for skip links
    const skipLinks = document.querySelectorAll('a[href="#main"], a[href="#content"]');
    if (skipLinks.length === 0) {
      this.issues.push('No skip links found - screen reader users may have difficulty navigating');
    }
  }

  private checkScreenReaderSupport() {
    // Check for ARIA labels and roles
    const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
    
    interactiveElements.forEach((element, index) => {
      const hasLabel = element.hasAttribute('aria-label') || 
                      element.hasAttribute('aria-labelledby') ||
                      element.querySelector('label') ||
                      element.textContent?.trim();

      if (!hasLabel) {
        this.issues.push(`Interactive element ${index + 1} lacks proper labeling for screen readers`);
      }
    });

    // Check for live regions
    const liveRegions = document.querySelectorAll('[aria-live]');
    if (liveRegions.length === 0) {
      this.issues.push('No live regions found - dynamic content changes may not be announced');
    }
  }

  private checkColorContrast() {
    // Basic color contrast check (would need more sophisticated implementation in real app)
    const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div, a, button');
    
    // This is a simplified check - in production, you'd use a proper contrast calculation
    textElements.forEach((element) => {
      const style = window.getComputedStyle(element);
      const backgroundColor = style.backgroundColor;
      const color = style.color;
      
      // Simplified check for common problematic combinations
      if (backgroundColor === 'rgb(255, 255, 255)' && color === 'rgb(200, 200, 200)') {
        this.issues.push('Low contrast detected - text may be difficult to read');
      }
    });
  }

  private checkTouchTargets() {
    // Check minimum touch target sizes (important for Nigerian mobile users)
    const interactiveElements = document.querySelectorAll('button, a, input[type="button"], input[type="submit"]');
    
    interactiveElements.forEach((element, index) => {
      const rect = element.getBoundingClientRect();
      const minSize = 44; // Minimum recommended touch target size
      
      if (rect.width < minSize || rect.height < minSize) {
        this.issues.push(`Touch target ${index + 1} is too small (${Math.round(rect.width)}x${Math.round(rect.height)}px) - should be at least ${minSize}x${minSize}px`);
      }
    });
  }

  private checkLanguageSupport() {
    // Check for language declarations (important for Nigerian multilingual context)
    const htmlElement = document.documentElement;
    if (!htmlElement.hasAttribute('lang')) {
      this.issues.push('No language declaration found - screen readers may have difficulty with pronunciation');
    }

    // Check for alternative text on images
    const images = document.querySelectorAll('img');
    images.forEach((img, index) => {
      if (!img.hasAttribute('alt')) {
        this.issues.push(`Image ${index + 1} lacks alt text - screen readers cannot describe it`);
      }
    });
  }
}

// Cross-device testing utilities
export class CrossDeviceTester {
  async testConfiguration(config: TestConfig): Promise<{
    config: TestConfig;
    performance: PerformanceMetrics & { grade: string; recommendations: string[] };
    accessibility: { passed: boolean; issues: string[]; score: number };
    screenshot?: string;
  }> {
    console.log(`🧪 Testing configuration:`, config);

    // Simulate device characteristics
    this.simulateDevice(config);

    // Run performance test
    const performanceTester = new PerformanceTester();
    performanceTester.startTest();

    // Wait for page to load completely
    await this.waitForPageLoad();

    const performance = performanceTester.getResults();

    // Run accessibility test
    const accessibilityTester = new AccessibilityTester();
    const accessibility = accessibilityTester.runAccessibilityAudit();

    return {
      config,
      performance,
      accessibility
    };
  }

  private simulateDevice(config: TestConfig) {
    // This would typically be done with browser dev tools or testing frameworks
    // Here we're just logging what would happen
    console.log(`Simulating ${config.device} device with ${config.connection} connection`);
    
    if (config.offline) {
      console.log('Simulating offline conditions');
    }
    
    if (config.accessibility) {
      console.log('Enabling accessibility testing mode');
    }
  }

  private async waitForPageLoad(): Promise<void> {
    return new Promise((resolve) => {
      if (document.readyState === 'complete') {
        resolve();
      } else {
        window.addEventListener('load', () => resolve());
      }
    });
  }
}

// Nigerian-specific test cases
export const NIGERIAN_TEST_CASES = [
  {
    name: 'Lagos office worker on desktop',
    description: 'Fast connection, desktop browser, during work hours',
    config: { device: 'desktop', connection: 'fast', browser: 'chrome', accessibility: false, offline: false }
  },
  {
    name: 'Student on budget Android phone',
    description: 'Slow mobile data, limited data plan',
    config: { device: 'mobile', connection: 'slow', browser: 'chrome', accessibility: false, offline: false }
  },
  {
    name: 'Rural area with intermittent connection',
    description: 'Frequent disconnections, need for offline functionality',
    config: { device: 'mobile', connection: 'slow', browser: 'chrome', accessibility: false, offline: true }
  },
  {
    name: 'Elderly user with accessibility needs',
    description: 'Screen reader, keyboard navigation, high contrast',
    config: { device: 'desktop', connection: 'moderate', browser: 'chrome', accessibility: true, offline: false }
  },
  {
    name: 'Cyber cafe user',
    description: 'Shared computer, moderate connection, time pressure',
    config: { device: 'desktop', connection: 'moderate', browser: 'firefox', accessibility: false, offline: false }
  }
] as const;

// Export test runner
export async function runNigerianCompatibilityTests() {
  console.log('🇳🇬 Running Nigerian compatibility tests for Step Up Naija');
  
  const tester = new CrossDeviceTester();
  const results = [];

  for (const testCase of NIGERIAN_TEST_CASES) {
    console.log(`\n📋 Testing: ${testCase.name}`);
    console.log(`Description: ${testCase.description}`);
    
    try {
      const result = await tester.testConfiguration(testCase.config);
      results.push({
        testCase: testCase.name,
        result
      });
      
      console.log(`✅ Performance Grade: ${result.performance.grade}`);
      console.log(`♿ Accessibility Score: ${result.accessibility.score}/100`);
    } catch (error) {
      console.error(`❌ Test failed for ${testCase.name}:`, error);
      results.push({
        testCase: testCase.name,
        error: error.message
      });
    }
  }

  return results;
}