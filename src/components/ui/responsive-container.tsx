import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ResponsiveContainerProps {
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  padding?: "none" | "sm" | "md" | "lg";
}

export function ResponsiveContainer({ 
  children, 
  className, 
  size = "lg",
  padding = "md" 
}: ResponsiveContainerProps) {
  const sizeClasses = {
    sm: "max-w-2xl",
    md: "max-w-4xl", 
    lg: "max-w-7xl",
    xl: "max-w-screen-2xl",
    full: "max-w-full"
  };

  const paddingClasses = {
    none: "",
    sm: "px-2 sm:px-3 lg:px-4",
    md: "px-3 sm:px-4 lg:px-6 xl:px-8",
    lg: "px-4 sm:px-6 lg:px-8 xl:px-12"
  };

  return (
    <div className={cn(
      "mx-auto w-full",
      sizeClasses[size],
      paddingClasses[padding],
      className
    )}>
      {children}
    </div>
  );
}