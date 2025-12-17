import React, { useEffect } from 'react';
import { cn } from '@/lib/utils/cn';
import { Button } from './button';

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  children,
}) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={() => onOpenChange(false)}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" />
      
      {/* Dialog */}
      <div
        className={cn(
          'relative z-50 w-full max-w-md mx-4',
          'bg-gray-100 dark:bg-gray-5',
          'rounded-2xl shadow-xl',
          'p-6'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <h2 className="text-h1 text-gray-0 dark:text-gray-100 mb-2">
            {title}
          </h2>
        )}
        {description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {description}
          </p>
        )}
        {children}
      </div>
    </div>
  );
};

export interface DialogContentProps {
  children: React.ReactNode;
  className?: string;
}

export const DialogContent: React.FC<DialogContentProps> = ({ children, className }) => {
  return <div className={cn('mt-4', className)}>{children}</div>;
};

export interface DialogFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const DialogFooter: React.FC<DialogFooterProps> = ({ children, className }) => {
  return (
    <div className={cn('flex justify-end gap-2 mt-6', className)}>
      {children}
    </div>
  );
};

