import React from 'react';
import { cn } from '@/lib/utils/cn';

export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange'> {
  value: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, value, onValueChange, min = 0, max = 10, step = 1, ...props }, ref) => {
    const percentage = ((value - min) / (max - min)) * 100;
    
    // Определяем цвет градиента в зависимости от значения
    let gradientColor = '#10b981'; // green
    if (value >= 8) {
      gradientColor = '#ef4444'; // red
    } else if (value >= 4) {
      gradientColor = '#f59e0b'; // orange
    }
    
    return (
      <div className={cn('relative w-full', className)}>
        <input
          ref={ref}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onValueChange?.(Number(e.target.value))}
          className={cn(
            'w-full h-2 appearance-none rounded-lg',
            'bg-gray-90 dark:bg-gray-35',
            'cursor-pointer',
            'focus:outline-none focus:ring-2 focus:ring-brand-70',
            className
          )}
          style={{
            background: `linear-gradient(to right, ${gradientColor} 0%, ${gradientColor} ${percentage}%, var(--gray-90) ${percentage}%, var(--gray-90) 100%)`,
          }}
          {...props}
        />
        <div className="flex justify-between mt-1 text-caption">
          <span>{min}</span>
          <span className="font-semibold text-brand-70">{value}</span>
          <span>{max}</span>
        </div>
      </div>
    );
  }
);

Slider.displayName = 'Slider';

