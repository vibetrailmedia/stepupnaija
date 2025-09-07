import { useEffect, useRef } from 'react';

interface UseAccessibilityOptions {
  skipLinks?: boolean;
  focusTrap?: boolean;
  announcePageChanges?: boolean;
  keyboardNavigation?: boolean;
}

export function useAccessibility(options: UseAccessibilityOptions = {}) {
  const {
    skipLinks = true,
    focusTrap = false,
    announcePageChanges = true,
    keyboardNavigation = true
  } = options;

  const containerRef = useRef<HTMLElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (skipLinks) {
      addSkipLinks();
    }

    if (announcePageChanges) {
      announcePageChange();
    }

    if (keyboardNavigation) {
      setupKeyboardNavigation();
    }

    return () => {
      removeSkipLinks();
    };
  }, [skipLinks, announcePageChanges, keyboardNavigation]);

  // Focus trap functionality
  useEffect(() => {
    if (focusTrap && containerRef.current) {
      const container = containerRef.current;
      previousFocusRef.current = document.activeElement as HTMLElement;
      
      const focusableElements = container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            }
          } else {
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        }
        
        if (e.key === 'Escape') {
          if (previousFocusRef.current) {
            previousFocusRef.current.focus();
          }
        }
      };

      container.addEventListener('keydown', handleTabKey);
      if (firstElement) firstElement.focus();

      return () => {
        container.removeEventListener('keydown', handleTabKey);
        if (previousFocusRef.current) {
          previousFocusRef.current.focus();
        }
      };
    }
  }, [focusTrap]);

  const addSkipLinks = () => {
    if (document.getElementById('skip-links')) return;

    const skipLinksContainer = document.createElement('div');
    skipLinksContainer.id = 'skip-links';
    skipLinksContainer.className = 'sr-only focus-within:not-sr-only focus-within:absolute focus-within:top-0 focus-within:left-0 focus-within:z-50 focus-within:bg-primary focus-within:text-primary-foreground focus-within:p-2';
    
    const skipLinks = [
      { href: '#main-content', text: 'Skip to main content' },
      { href: '#navigation', text: 'Skip to navigation' },
      { href: '#footer', text: 'Skip to footer' }
    ];

    skipLinks.forEach(link => {
      const skipLink = document.createElement('a');
      skipLink.href = link.href;
      skipLink.textContent = link.text;
      skipLink.className = 'block underline mr-4';
      skipLinksContainer.appendChild(skipLink);
    });

    document.body.insertBefore(skipLinksContainer, document.body.firstChild);
  };

  const removeSkipLinks = () => {
    const skipLinks = document.getElementById('skip-links');
    if (skipLinks) {
      skipLinks.remove();
    }
  };

  const announcePageChange = () => {
    // Create or update live region for page announcements
    let liveRegion = document.getElementById('page-announcements');
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'page-announcements';
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'sr-only';
      document.body.appendChild(liveRegion);
    }

    // Announce page change
    const pageTitle = document.title;
    setTimeout(() => {
      liveRegion!.textContent = `Page loaded: ${pageTitle}`;
    }, 100);
  };

  const setupKeyboardNavigation = () => {
    const handleKeyboardShortcuts = (e: KeyboardEvent) => {
      // Alt + M: Skip to main content
      if (e.altKey && e.key === 'm') {
        e.preventDefault();
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
          mainContent.focus();
          mainContent.scrollIntoView({ behavior: 'smooth' });
        }
      }

      // Alt + N: Skip to navigation
      if (e.altKey && e.key === 'n') {
        e.preventDefault();
        const navigation = document.getElementById('navigation');
        if (navigation) {
          navigation.focus();
          navigation.scrollIntoView({ behavior: 'smooth' });
        }
      }

      // Alt + S: Skip to search
      if (e.altKey && e.key === 's') {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyboardShortcuts);
    return () => document.removeEventListener('keydown', handleKeyboardShortcuts);
  };

  // Function to announce dynamic content changes
  const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  // Function to manage focus for single-page app navigation
  const manageFocus = (element: HTMLElement | null) => {
    if (element) {
      element.focus();
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return {
    containerRef,
    announceToScreenReader,
    manageFocus,
  };
}

export default useAccessibility;