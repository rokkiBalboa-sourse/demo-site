import React, { ButtonHTMLAttributes } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center font-mono font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer rounded-none box-border';

  const hasCustomH = /\bh-\w+/.test(className);
  const hasCustomPx = /\bpx-\w+/.test(className);
  const hasCustomPy = /\bpy-\w+/.test(className);
  const hasCustomText = /\btext-(xs|sm|base|lg|\[.+?\])/.test(className);

  let defaultHeight = 'h-9';
  let defaultPx = 'px-4';
  let defaultPy = 'py-2';
  let defaultText = 'text-xs';

  if (size === 'sm') {
    defaultHeight = 'h-8';
    defaultPx = 'px-3';
    defaultPy = 'py-1.5';
    defaultText = 'text-xs';
  } else if (size === 'lg') {
    defaultHeight = 'h-10';
    defaultPx = 'px-5';
    defaultPy = 'py-2.5';
    defaultText = 'text-sm';
  }

  const sizeStyles = [
    hasCustomH ? '' : defaultHeight,
    hasCustomPx ? '' : defaultPx,
    hasCustomPy ? '' : defaultPy,
    hasCustomText ? '' : defaultText,
  ]
    .filter(Boolean)
    .join(' ');

  let variantStyles = '';
  switch (variant) {
    case 'primary':
      variantStyles = 'bg-white text-zinc-950 hover:bg-zinc-200 border border-white font-semibold';
      break;
    case 'secondary':
      variantStyles = 'bg-zinc-800 text-zinc-100 hover:bg-zinc-700 border border-zinc-700';
      break;
    case 'outline':
      variantStyles =
        'bg-zinc-900/80 text-zinc-300 hover:bg-zinc-800 hover:text-white border border-zinc-800';
      break;
    case 'ghost':
      variantStyles =
        'hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 border border-transparent';
      break;
    case 'danger':
      variantStyles = 'bg-zinc-900 text-zinc-200 hover:bg-zinc-800 border border-zinc-700';
      break;
  }

  return (
    <button
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg
            className="animate-spin h-3.5 w-3.5 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>Загрузка...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}
