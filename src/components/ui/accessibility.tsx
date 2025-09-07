import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

/**
 * Accessibility Components for Nigerian Users
 * 
 * Designed to work well with screen readers,
 * keyboard navigation, and assistive technologies
 * commonly used in Nigeria.
 */

// Skip to main content link for screen readers
export function SkipToMain({ href = "#main-content" }: { href?: string }) {
  return (
    <a
      href={href}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-green-600 text-white px-4 py-2 rounded-md font-medium z-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
      data-testid="skip-to-main"
    >
      Skip to main content
    </a>
  );
}

// Screen reader only text
export function ScreenReaderOnly({ children, as: Component = 'span' }: {
  children: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
}) {
  return (
    <Component className="sr-only">
      {children}
    </Component>
  );
}

// Accessible button with proper ARIA attributes
interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  loadingText?: string;
  ariaLabel?: string;
  describedBy?: string;
}

export function AccessibleButton({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  loadingText = 'Loading...',
  ariaLabel,
  describedBy,
  className,
  disabled,
  ...props
}: AccessibleButtonProps) {
  const baseClasses = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-green-600 text-white hover:bg-green-700 focus-visible:outline-green-600",
    secondary: "bg-gray-600 text-white hover:bg-gray-700 focus-visible:outline-gray-600",
    outline: "border-2 border-green-600 text-green-600 hover:bg-green-50 focus-visible:outline-green-600",
    ghost: "text-green-600 hover:bg-green-50 focus-visible:outline-green-600"
  };
  
  const sizes = {
    sm: "px-3 py-2 text-sm min-h-[36px]",
    md: "px-4 py-3 text-base min-h-[44px]",
    lg: "px-6 py-4 text-lg min-h-[48px]"
  };

  return (
    <button
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-describedby={describedBy}
      aria-busy={loading}
      data-testid="accessible-button"
      {...props}
    >
      {loading && (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <ScreenReaderOnly>{loadingText}</ScreenReaderOnly>
        </>
      )}
      {children}
    </button>
  );
}

// Accessible form field with proper labeling
interface AccessibleFieldProps {
  label: string;
  id: string;
  error?: string;
  help?: string;
  required?: boolean;
  children: React.ReactNode;
}

export function AccessibleField({
  label,
  id,
  error,
  help,
  required = false,
  children
}: AccessibleFieldProps) {
  const helpId = help ? `${id}-help` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [helpId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-label="required">
            *
          </span>
        )}
      </label>
      
      {React.cloneElement(children as React.ReactElement, {
        id,
        'aria-describedby': describedBy,
        'aria-invalid': !!error,
        'aria-required': required,
      })}
      
      {help && (
        <div id={helpId} className="text-sm text-gray-600">
          {help}
        </div>
      )}
      
      {error && (
        <div id={errorId} className="text-sm text-red-600" role="alert">
          {error}
        </div>
      )}
    </div>
  );
}

// Accessible modal/dialog component
interface AccessibleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function AccessibleModal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md'
}: AccessibleModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Store the previously focused element
      previousFocusRef.current = document.activeElement as HTMLElement;
      
      // Focus the modal
      modalRef.current?.focus();
      
      // Trap focus within modal
      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          const focusableElements = modalRef.current?.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          
          if (focusableElements && focusableElements.length > 0) {
            const firstElement = focusableElements[0] as HTMLElement;
            const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
            
            if (e.shiftKey && document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        }
        
        if (e.key === 'Escape') {
          onClose();
        }
      };
      
      document.addEventListener('keydown', handleTabKey);
      
      return () => {
        document.removeEventListener('keydown', handleTabKey);
        // Restore focus to previously focused element
        previousFocusRef.current?.focus();
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      aria-describedby={description ? "modal-description" : undefined}
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          ref={modalRef}
          className={cn(
            "relative bg-white rounded-lg shadow-xl transform transition-all w-full",
            sizeClasses[size]
          )}
          tabIndex={-1}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 id="modal-title" className="text-lg font-semibold text-gray-900">
              {title}
            </h2>
            {description && (
              <p id="modal-description" className="mt-1 text-sm text-gray-600">
                {description}
              </p>
            )}
            
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 rounded-md p-1"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Content */}
          <div className="px-6 py-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

// Accessible live region for announcements
export function LiveRegion({ 
  children, 
  politeness = 'polite' 
}: { 
  children: React.ReactNode; 
  politeness?: 'polite' | 'assertive' | 'off';
}) {
  return (
    <div
      aria-live={politeness}
      aria-atomic="true"
      className="sr-only"
    >
      {children}
    </div>
  );
}

// Accessible progress indicator
interface AccessibleProgressProps {
  value: number;
  max?: number;
  label: string;
  showPercentage?: boolean;
  className?: string;
}

export function AccessibleProgress({
  value,
  max = 100,
  label,
  showPercentage = true,
  className
}: AccessibleProgressProps) {
  const percentage = Math.round((value / max) * 100);
  
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">
          {label}
        </span>
        {showPercentage && (
          <span className="text-sm text-gray-600">
            {percentage}%
          </span>
        )}
      </div>
      
      <div
        className="w-full bg-gray-200 rounded-full h-3"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={`${label}: ${percentage}% complete`}
      >
        <div
          className="bg-green-600 h-3 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      <ScreenReaderOnly>
        {label} is {percentage}% complete
      </ScreenReaderOnly>
    </div>
  );
}