import { useEffect, useCallback } from 'react';

/**
 * Keyboard Navigation Hook for Nigerian Users
 * 
 * Provides comprehensive keyboard navigation support
 * for users who rely on keyboard-only interaction,
 * including those using assistive technologies.
 */

interface UseKeyboardNavigationOptions {
  enabled?: boolean;
  trapFocus?: boolean;
  container?: React.RefObject<HTMLElement>;
  onEscape?: () => void;
  onEnter?: () => void;
  skipToMainId?: string;
}

export function useKeyboardNavigation(options: UseKeyboardNavigationOptions = {}) {
  const {
    enabled = true,
    trapFocus = false,
    container,
    onEscape,
    onEnter,
    skipToMainId = 'main-content'
  } = options;

  // Get all focusable elements
  const getFocusableElements = useCallback((containerElement?: HTMLElement) => {
    const selector = [
      'button:not([disabled])',
      '[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ].join(', ');

    const scope = containerElement || document;
    return Array.from(scope.querySelectorAll(selector)) as HTMLElement[];
  }, []);

  // Focus management utilities
  const focusFirstElement = useCallback((containerElement?: HTMLElement) => {
    const focusableElements = getFocusableElements(containerElement);
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }
  }, [getFocusableElements]);

  const focusLastElement = useCallback((containerElement?: HTMLElement) => {
    const focusableElements = getFocusableElements(containerElement);
    if (focusableElements.length > 0) {
      focusableElements[focusableElements.length - 1].focus();
    }
  }, [getFocusableElements]);

  const focusNextElement = useCallback((current: HTMLElement, containerElement?: HTMLElement) => {
    const focusableElements = getFocusableElements(containerElement);
    const currentIndex = focusableElements.indexOf(current);
    const nextIndex = (currentIndex + 1) % focusableElements.length;
    focusableElements[nextIndex]?.focus();
  }, [getFocusableElements]);

  const focusPreviousElement = useCallback((current: HTMLElement, containerElement?: HTMLElement) => {
    const focusableElements = getFocusableElements(containerElement);
    const currentIndex = focusableElements.indexOf(current);
    const previousIndex = currentIndex === 0 ? focusableElements.length - 1 : currentIndex - 1;
    focusableElements[previousIndex]?.focus();
  }, [getFocusableElements]);

  // Skip to main content functionality
  const handleSkipToMain = useCallback(() => {
    const mainElement = document.getElementById(skipToMainId);
    if (mainElement) {
      mainElement.focus();
      mainElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [skipToMainId]);

  // Main keyboard event handler
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    const { key, shiftKey, ctrlKey, altKey, target } = event;
    const currentElement = target as HTMLElement;
    const containerElement = container?.current;

    // Skip to main content (Alt + M or Ctrl + /)
    if ((altKey && key === 'm') || (ctrlKey && key === '/')) {
      event.preventDefault();
      handleSkipToMain();
      return;
    }

    // Handle Tab navigation with focus trapping
    if (key === 'Tab' && trapFocus && containerElement) {
      const focusableElements = getFocusableElements(containerElement);
      
      if (focusableElements.length === 0) {
        event.preventDefault();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const currentIndex = focusableElements.indexOf(currentElement);

      if (shiftKey && (currentElement === firstElement || currentIndex === -1)) {
        event.preventDefault();
        lastElement.focus();
      } else if (!shiftKey && (currentElement === lastElement || currentIndex === -1)) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    // Arrow key navigation for grids and lists
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
      const isGrid = currentElement.closest('[role="grid"], [role="gridcell"]');
      const isList = currentElement.closest('[role="list"], [role="listbox"], [role="menu"]');
      
      if (isGrid || isList) {
        event.preventDefault();
        
        switch (key) {
          case 'ArrowDown':
          case 'ArrowRight':
            focusNextElement(currentElement, containerElement);
            break;
          case 'ArrowUp':
          case 'ArrowLeft':
            focusPreviousElement(currentElement, containerElement);
            break;
        }
      }
    }

    // Home/End navigation
    if (key === 'Home' && (ctrlKey || currentElement.closest('[role="grid"], [role="list"]'))) {
      event.preventDefault();
      focusFirstElement(containerElement);
    }

    if (key === 'End' && (ctrlKey || currentElement.closest('[role="grid"], [role="list"]'))) {
      event.preventDefault();
      focusLastElement(containerElement);
    }

    // Escape key handling
    if (key === 'Escape' && onEscape) {
      event.preventDefault();
      onEscape();
    }

    // Enter key handling
    if (key === 'Enter' && onEnter) {
      // Only trigger if not in an input field
      if (!['INPUT', 'TEXTAREA', 'SELECT'].includes(currentElement.tagName)) {
        event.preventDefault();
        onEnter();
      }
    }

    // Space bar for button activation
    if (key === ' ' && currentElement.tagName === 'BUTTON') {
      event.preventDefault();
      currentElement.click();
    }
  }, [
    enabled,
    trapFocus,
    container,
    onEscape,
    onEnter,
    handleSkipToMain,
    getFocusableElements,
    focusFirstElement,
    focusLastElement,
    focusNextElement,
    focusPreviousElement
  ]);

  // Set up keyboard event listeners
  useEffect(() => {
    if (!enabled) return;

    const element = container?.current || document;
    element.addEventListener('keydown', handleKeyDown);

    return () => {
      element.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, container, handleKeyDown]);

  // Focus management functions to return
  return {
    focusFirstElement: () => focusFirstElement(container?.current),
    focusLastElement: () => focusLastElement(container?.current),
    focusNextElement: (current: HTMLElement) => focusNextElement(current, container?.current),
    focusPreviousElement: (current: HTMLElement) => focusPreviousElement(current, container?.current),
    getFocusableElements: () => getFocusableElements(container?.current),
    handleSkipToMain,
  };
}

// Higher-order component to add keyboard navigation to any component
export function withKeyboardNavigation<P extends object>(
  Component: React.ComponentType<P>,
  options: UseKeyboardNavigationOptions = {}
) {
  return function KeyboardNavigationWrapper(props: P) {
    useKeyboardNavigation(options);
    return <Component {...props} />;
  };
}

// Hook for managing focus on route changes
export function useFocusOnRouteChange() {
  useEffect(() => {
    // Focus management for single-page applications
    const handleRouteChange = () => {
      // Focus the main content area
      const mainElement = document.getElementById('main-content') || 
                         document.querySelector('main') ||
                         document.querySelector('[role="main"]');
      
      if (mainElement) {
        // Make it focusable if it isn't already
        if (!mainElement.hasAttribute('tabindex')) {
          mainElement.setAttribute('tabindex', '-1');
        }
        
        mainElement.focus();
        
        // Announce page change to screen readers
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = `Page loaded: ${document.title}`;
        
        document.body.appendChild(announcement);
        
        // Clean up announcement after screen reader has time to read it
        setTimeout(() => {
          document.body.removeChild(announcement);
        }, 1000);
      }
    };

    // Listen for popstate events (browser back/forward)
    window.addEventListener('popstate', handleRouteChange);
    
    // For client-side routing, you might want to trigger this manually
    // when routes change in your routing library
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);
}