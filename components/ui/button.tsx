import React from "react";
import { cn } from "@/lib/utils/cn";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-2xl font-semibold transition-all disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 active:scale-95";

    const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
      primary: "bg-brand-70 text-white hover:opacity-90 focus-visible:ring-brand-70/40",
      secondary:
        "bg-gray-90 text-gray-0 hover:bg-gray-85 dark:bg-gray-35 dark:text-gray-100 focus-visible:ring-gray-60/30",
      ghost:
        "bg-transparent text-gray-35 hover:bg-gray-90/50 dark:text-gray-90 dark:hover:bg-gray-5/40 focus-visible:ring-gray-60/30",
    };

    const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
      sm: "min-h-[40px] px-3 text-sm",
      md: "min-h-[48px] px-4 text-base",
      lg: "min-h-[56px] px-6 text-base",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

