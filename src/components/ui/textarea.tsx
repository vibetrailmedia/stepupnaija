import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps extends React.ComponentProps<"textarea"> {
  error?: boolean;
  success?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, success, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          // Base styles with enhanced design
          "flex min-h-[100px] w-full rounded-lg border bg-white/70 backdrop-blur-sm px-4 py-3 text-base transition-smooth",
          "placeholder:text-muted-foreground/70 resize-vertical",
          
          // Focus styles with beautiful ring
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "focus-visible:border-green-500 focus-visible:ring-green-500/20",
          
          // Default border and states
          "border-gray-200 hover:border-gray-300",
          
          // Success state
          success && "border-green-400 bg-green-50/70 focus-visible:border-green-500 focus-visible:ring-green-500/20",
          
          // Error state
          error && "border-red-400 bg-red-50/70 focus-visible:border-red-500 focus-visible:ring-red-500/20",
          
          // Disabled state
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50/70",
          
          // Mobile responsive
          "md:text-sm",
          
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
