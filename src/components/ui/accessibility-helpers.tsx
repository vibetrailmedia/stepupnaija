import { ReactNode, forwardRef } from 'react';
import { cn } from '@/lib/utils';

// Screen reader only text component
export function ScreenReaderOnly({ children }: { children: ReactNode }) {
  return (
    <span className="sr-only">
      {children}
    </span>
  );
}

// Skip to main content link
export function SkipToMain() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium z-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      Skip to main content
    </a>
  );
}

// Accessible button with loading state
interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  ({ loading, loadingText, children, variant = 'primary', size = 'md', className, disabled, ...props }, ref) => {
    const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation";
    
    const variantClasses = {
      primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 border-2 border-blue-600",
      secondary: "bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500 border-2 border-gray-600",
      outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500",
      ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-500"
    };
    
    const sizeClasses = {
      sm: "px-3 py-2 text-sm min-h-[36px]",
      md: "px-4 py-2.5 text-base min-h-[44px]",
      lg: "px-6 py-3 text-lg min-h-[52px]"
    };

    return (
      <button
        ref={ref}
        className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
        disabled={disabled || loading}
        aria-disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <>
            <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
            <ScreenReaderOnly>{loadingText || 'Loading...'}</ScreenReaderOnly>
          </>
        )}
        {!loading && children}
      </button>
    );
  }
);

AccessibleButton.displayName = 'AccessibleButton';

// Accessible form field with proper labeling
interface AccessibleFormFieldProps {
  label: string;
  id: string;
  required?: boolean;
  error?: string;
  helpText?: string;
  children: ReactNode;
}

export function AccessibleFormField({ 
  label, 
  id, 
  required, 
  error, 
  helpText, 
  children 
}: AccessibleFormFieldProps) {
  const errorId = error ? `${id}-error` : undefined;
  const helpId = helpText ? `${id}-help` : undefined;
  
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
      
      <div className="relative">
        {children}
      </div>
      
      {helpText && (
        <p id={helpId} className="text-sm text-gray-600">
          {helpText}
        </p>
      )}
      
      {error && (
        <p 
          id={errorId} 
          className="text-sm text-red-600 flex items-center"
          role="alert"
          aria-live="polite"
        >
          <span className="mr-1">⚠️</span>
          {error}
        </p>
      )}
    </div>
  );
}

// Mobile-optimized card component
interface MobileCardProps {
  children: ReactNode;
  className?: string;
  clickable?: boolean;
  onClick?: () => void;
}

export function MobileCard({ children, className, clickable, onClick }: MobileCardProps) {
  const Component = clickable ? 'button' : 'div';
  
  return (
    <Component
      className={cn(
        "bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6",
        clickable && "hover:shadow-md transition-shadow cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 touch-manipulation",
        className
      )}
      onClick={onClick}
    >
      {children}
    </Component>
  );
}

// Progress indicator with accessibility
interface AccessibleProgressProps {
  value: number;
  max?: number;
  label: string;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function AccessibleProgress({ 
  value, 
  max = 100, 
  label, 
  showValue = true, 
  size = 'md' 
}: AccessibleProgressProps) {
  const percentage = Math.min((value / max) * 100, 100);
  
  const sizeClasses = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4"
  };
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        {showValue && (
          <span className="text-sm text-gray-600">
            {value}/{max}
          </span>
        )}
      </div>
      
      <div className="relative">
        <div 
          className={cn(
            "w-full bg-gray-200 rounded-full overflow-hidden",
            sizeClasses[size]
          )}
        >
          <div
            className="bg-blue-600 h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${percentage}%` }}
            role="progressbar"
            aria-valuenow={value}
            aria-valuemin={0}
            aria-valuemax={max}
            aria-label={`${label}: ${value} of ${max}`}
          />
        </div>
        
        <ScreenReaderOnly>
          {`Progress: ${percentage.toFixed(0)}% complete`}
        </ScreenReaderOnly>
      </div>
    </div>
  );
}

// Mobile-friendly tooltip
interface MobileTooltipProps {
  content: string;
  children: ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
}

export function MobileTooltip({ content, children, side = 'top' }: MobileTooltipProps) {
  return (
    <div className="group relative inline-block">
      {children}
      <div 
        className={cn(
          "absolute z-50 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-200 pointer-events-none",
          "max-w-xs w-max",
          side === 'top' && "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
          side === 'bottom' && "top-full left-1/2 transform -translate-x-1/2 mt-2",
          side === 'left' && "right-full top-1/2 transform -translate-y-1/2 mr-2",
          side === 'right' && "left-full top-1/2 transform -translate-y-1/2 ml-2"
        )}
        role="tooltip"
      >
        {content}
        {/* Arrow */}
        <div 
          className={cn(
            "absolute w-2 h-2 bg-gray-900 transform rotate-45",
            side === 'top' && "top-full left-1/2 -translate-x-1/2 -mt-1",
            side === 'bottom' && "bottom-full left-1/2 -translate-x-1/2 -mb-1",
            side === 'left' && "left-full top-1/2 -translate-y-1/2 -ml-1",
            side === 'right' && "right-full top-1/2 -translate-y-1/2 -mr-1"
          )}
        />
      </div>
    </div>
  );
}

// High contrast mode detector and indicator
export function HighContrastIndicator() {
  return (
    <div className="sr-only" aria-live="polite">
      <span className="high-contrast:not-sr-only">
        High contrast mode is enabled
      </span>
    </div>
  );
}

// Focus management for modals and dialogs
export function useFocusManagement() {
  const trapFocus = (element: HTMLElement) => {
    const focusableElements = element.querySelectorAll(
      'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    element.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => {
      element.removeEventListener('keydown', handleTabKey);
    };
  };

  return { trapFocus };
}