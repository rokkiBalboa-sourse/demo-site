import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export function Logo({ size = 'md', showSubtitle = true }: LogoProps) {
  let iconSize = 'w-6 h-6';
  let titleSize = 'text-base';

  if (size === 'sm') {
    iconSize = 'w-5 h-5';
    titleSize = 'text-sm';
  } else if (size === 'lg') {
    iconSize = 'w-8 h-8';
    titleSize = 'text-xl';
  }

  return (
    <div className="flex items-center gap-2.5 select-none">
      {/* Visual Terminal & Network Icon */}
      <div
        className={`${iconSize} bg-white text-zinc-950 flex items-center justify-center font-mono font-black border border-white shrink-0`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="square"
          strokeLinejoin="miter"
          className="w-4 h-4"
        >
          <polyline points="4 17 10 11 4 5" />
          <line x1="12" y1="19" x2="20" y2="19" />
        </svg>
      </div>

      {/* Brand Text */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className={`font-mono font-bold tracking-tight text-white ${titleSize}`}>
            SUDO<span className="text-zinc-400">STUDY</span>
          </span>
        </div>
        {showSubtitle && (
          <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider hidden sm:block">
            Платформа отчётности
          </span>
        )}
      </div>
    </div>
  );
}
