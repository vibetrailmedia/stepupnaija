import { ReactNode, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface TypographyProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  variant?: 'default' | 'muted' | 'emphasis' | 'caption' | 'lead';
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  align?: 'left' | 'center' | 'right';
  as?: 'p' | 'span' | 'div';
}

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
  level: 1 | 2 | 3 | 4 | 5 | 6;
  variant?: 'default' | 'display' | 'section' | 'card';
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
  gradient?: boolean;
  align?: 'left' | 'center' | 'right';
}

// Enhanced Typography Component
export function Typography({ 
  children, 
  variant = 'default', 
  size = 'base',
  weight = 'normal',
  align = 'left',
  as = 'p',
  className,
  ...props 
}: TypographyProps) {
  const Component = as;
  
  const variantClasses = {
    default: 'text-foreground',
    muted: 'text-muted-foreground',
    emphasis: 'text-foreground font-semibold',
    caption: 'text-muted-foreground text-sm',
    lead: 'text-foreground text-lg leading-relaxed'
  };
  
  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl',
    '5xl': 'text-5xl',
    '6xl': 'text-6xl'
  };
  
  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
    extrabold: 'font-extrabold'
  };
  
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };
  
  return (
    <Component
      className={cn(
        'leading-normal',
        variantClasses[variant],
        sizeClasses[size],
        weightClasses[weight],
        alignClasses[align],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

// Enhanced Heading Component
export function Heading({ 
  children, 
  level, 
  variant = 'default',
  size,
  gradient = false,
  align = 'left',
  className,
  ...props 
}: HeadingProps) {
  const Tag = `h${level}` as const;
  
  const variantClasses = {
    default: 'font-bold text-foreground',
    display: 'font-extrabold text-foreground tracking-tight',
    section: 'font-bold text-foreground tracking-tight',
    card: 'font-semibold text-foreground'
  };
  
  const defaultSizes = {
    1: '4xl',
    2: '3xl',
    3: '2xl',
    4: 'xl',
    5: 'lg',
    6: 'base'
  } as const;
  
  const finalSize = size || defaultSizes[level];
  
  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl',
    '5xl': 'text-5xl',
    '6xl': 'text-6xl'
  };
  
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };
  
  return (
    <Tag
      className={cn(
        'leading-tight mb-4',
        variantClasses[variant],
        sizeClasses[finalSize],
        alignClasses[align],
        gradient && 'bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent',
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}

// Specialized Typography Components
export function DisplayText({ children, className, ...props }: { children: ReactNode } & HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1 
      className={cn(
        'hero-text font-extrabold text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-none tracking-tight',
        className
      )}
      {...props}
    >
      {children}
    </h1>
  );
}

export function SectionHeading({ children, className, ...props }: { children: ReactNode } & HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2 
      className={cn(
        'section-heading font-bold text-2xl sm:text-3xl lg:text-4xl leading-tight tracking-tight mb-6',
        className
      )}
      {...props}
    >
      {children}
    </h2>
  );
}

export function Subheading({ children, className, ...props }: { children: ReactNode } & HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p 
      className={cn(
        'subheading text-lg text-muted-foreground leading-relaxed max-w-3xl',
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}

export function Lead({ children, className, ...props }: { children: ReactNode } & HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p 
      className={cn(
        'text-xl text-muted-foreground leading-relaxed max-w-2xl',
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}

export function BodyText({ children, className, ...props }: { children: ReactNode } & HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p 
      className={cn(
        'text-readable text-base leading-relaxed text-foreground',
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}

export function Caption({ children, className, ...props }: { children: ReactNode } & HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p 
      className={cn(
        'text-caption text-sm text-muted-foreground leading-normal',
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}

export function Code({ children, className, ...props }: { children: ReactNode } & HTMLAttributes<HTMLElement>) {
  return (
    <code 
      className={cn(
        'font-mono text-sm bg-muted px-1.5 py-0.5 rounded border font-medium',
        className
      )}
      {...props}
    >
      {children}
    </code>
  );
}

export function BlockQuote({ children, className, ...props }: { children: ReactNode } & HTMLAttributes<HTMLQuoteElement>) {
  return (
    <blockquote 
      className={cn(
        'border-l-4 border-primary pl-6 py-2 text-lg italic text-muted-foreground leading-relaxed',
        className
      )}
      {...props}
    >
      {children}
    </blockquote>
  );
}

// Responsive Typography Utilities
export function ResponsiveText({ 
  children, 
  mobile, 
  tablet, 
  desktop,
  className,
  ...props 
}: { 
  children: ReactNode;
  mobile?: string;
  tablet?: string;
  desktop?: string;
} & HTMLAttributes<HTMLElement>) {
  return (
    <span 
      className={cn(
        mobile && `text-${mobile}`,
        tablet && `md:text-${tablet}`,
        desktop && `lg:text-${desktop}`,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

// Typography Showcase Component (for development/style guide)
export function TypographyShowcase() {
  return (
    <div className="space-y-8 p-8 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold mb-4">Typography Showcase</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Display Text</h3>
            <DisplayText>The Future of Civic Engagement</DisplayText>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Section Heading</h3>
            <SectionHeading>Building Better Communities</SectionHeading>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Heading Levels</h3>
            <div className="space-y-2">
              <Heading level={1}>Heading Level 1</Heading>
              <Heading level={2}>Heading Level 2</Heading>
              <Heading level={3}>Heading Level 3</Heading>
              <Heading level={4}>Heading Level 4</Heading>
              <Heading level={5}>Heading Level 5</Heading>
              <Heading level={6}>Heading Level 6</Heading>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Body Text</h3>
            <Lead>
              This is a lead paragraph that introduces the main content with slightly larger text.
            </Lead>
            <BodyText>
              This is regular body text optimized for readability. It uses appropriate line height and character width for comfortable reading across all devices.
            </BodyText>
            <Caption>
              This is caption text used for additional information or metadata.
            </Caption>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Typography Variants</h3>
            <div className="space-y-2">
              <Typography variant="default">Default text styling</Typography>
              <Typography variant="muted">Muted text for secondary information</Typography>
              <Typography variant="emphasis">Emphasized text for important content</Typography>
              <Typography variant="lead">Lead text for introductions</Typography>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Code and Quotes</h3>
            <Code>const example = "Hello World";</Code>
            <BlockQuote>
              "The best way to find yourself is to lose yourself in the service of others." - Mahatma Gandhi
            </BlockQuote>
          </div>
        </div>
      </div>
    </div>
  );
}