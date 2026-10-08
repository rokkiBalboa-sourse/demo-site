import React, { InputHTMLAttributes, forwardRef } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  isMono?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', isMono = false, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`flex h-9 w-full rounded-none border border-zinc-800 bg-zinc-900/90 px-3 py-1.5 text-xs text-zinc-100 shadow-none transition-colors placeholder:text-zinc-500 focus-visible:outline-none focus-visible:border-zinc-400 focus-visible:ring-1 focus-visible:ring-zinc-400 disabled:cursor-not-allowed disabled:opacity-50 ${
          isMono ? 'font-mono' : 'font-sans'
        } ${className}`}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
