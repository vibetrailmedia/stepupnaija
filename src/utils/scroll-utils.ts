/**
 * Utility functions for handling scroll behavior across the platform
 */

/**
 * Smoothly scrolls to the top of the page
 */
export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

/**
 * Smoothly scrolls to a specific element by its ID or data-testid
 */
export const scrollToElement = (selector: string, offset: number = 0) => {
  const element = document.querySelector(selector);
  if (element) {
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    window.scrollTo({
      top: elementPosition - offset,
      behavior: 'smooth'
    });
  }
};

/**
 * Enhanced navigation function that handles page routing and scroll-to-top
 */
export const navigateWithScroll = (navigate: (path: string) => void, path: string) => {
  navigate(path);
  // Scroll to top after a small delay to ensure the page has loaded
  setTimeout(() => {
    scrollToTop();
  }, 100);
};

/**
 * Handler for CTA buttons that need to scroll to top after action
 */
export const handleCTAWithScroll = (action: () => void) => {
  action();
  setTimeout(() => {
    scrollToTop();
  }, 100);
};