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
          'border-2 transition-colors',
          checked
            ? 'border-primary bg-primary/10 dark:bg-primary/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-primary/50',
          className
        )}
      >
        <input
          ref={ref}
          type="radio"
          value={value}
          checked={checked}
          onChange={() => onValueChange?.(value)}
          className="w-4 h-4 text-primary focus:ring-primary focus:ring-2"
          {...props}
        />
        <span className="text-sm text-text-primary dark:text-white font-medium">
          {label}
        </span>
      </label>
    );
  }
);

RadioGroupItem.displayName = 'RadioGroupItem';

