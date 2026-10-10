import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function Card({ children, className = '', title, subtitle, action }: CardProps) {
  return (
    <div className={`border border-zinc-800 bg-zinc-900/50 p-5 rounded-none ${className}`}>
      {(title || subtitle || action) && (
        <div className="flex items-start justify-between pb-3 mb-4 border-b border-zinc-800">
          <div>
            {title && (
              <h3 className="text-sm font-bold text-zinc-100 font-mono tracking-tight">{title}</h3>
            )}
            {subtitle && <p className="text-xs text-zinc-400 font-mono mt-0.5">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
