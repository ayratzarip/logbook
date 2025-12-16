import React from 'react';
import { cn } from '@/lib/utils/cn';

export interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  onValueChange?: (value: string) => void;
}

export const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className, value, onValueChange, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('space-y-2', className)}
        role="radiogroup"
        {...props}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<any>, {
              checked: value === (child.props as any).value,
              onValueChange,
            });
          }
          return child;
        })}
      </div>
    );
  }
);

RadioGroup.displayName = 'RadioGroup';

export interface RadioGroupItemProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  label: string;
  checked?: boolean;
  onValueChange?: (value: string) => void;
}

export const RadioGroupItem = React.forwardRef<HTMLInputElement, RadioGroupItemProps>(
  ({ className, value, label, checked, onValueChange, ...props }, ref) => {
    return (
      <label
        className={cn(
          'flex items-center space-x-3 p-3 rounded-xl cursor-pointer',
          'border transition-colors',
          checked
            ? 'border-brand-70 bg-brand-70/10 dark:bg-brand-70/20'
            : 'border-gray-85 dark:border-gray-35 hover:border-brand-70/50',
          className
        )}
      >
        <div
          className={cn(
            "flex h-5 w-5 items-center justify-center rounded-full border border-gray-60",
            checked && "border-brand-70 bg-brand-70"
          )}
        >
          {checked && <div className="h-2.5 w-2.5 rounded-full bg-white" />}
        </div>
        <input
          ref={ref}
          type="radio"
          value={value}
          checked={checked}
          onChange={() => onValueChange?.(value)}
          className="sr-only"
          {...props}
        />
        <span className="text-body font-medium">
          {label}
        </span>
      </label>
    );
  }
);

RadioGroupItem.displayName = 'RadioGroupItem';

