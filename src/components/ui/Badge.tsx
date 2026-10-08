import React from 'react';

export type BadgeVariant = 'pending' | 'reviewed' | 'rejected' | 'neutral' | 'default';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  let variantStyles = 'bg-zinc-900 text-zinc-300 border-zinc-800';

  if (variant === 'pending') {
    variantStyles =
      'bg-zinc-900/90 text-zinc-300 border-zinc-700 font-medium';
  } else if (variant === 'reviewed') {
    variantStyles =
      'bg-emerald-950/80 text-emerald-300 border-emerald-500 shadow-[0_0_14px_rgba(16,185,129,0.45)] ring-1 ring-emerald-500/50 font-bold tracking-wider';
  } else if (variant === 'rejected') {
    variantStyles =
      'bg-amber-950/80 text-amber-300 border-amber-500 shadow-[0_0_14px_rgba(245,158,11,0.45)] ring-1 ring-amber-500/50 font-bold tracking-wider';
  } else if (variant === 'neutral') {
    variantStyles = 'bg-zinc-950 text-zinc-500 border-zinc-800';
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-xs font-mono border rounded-none tracking-wide select-none ${variantStyles} ${className}`}
    >
      {children}
    </span>
  );
}
