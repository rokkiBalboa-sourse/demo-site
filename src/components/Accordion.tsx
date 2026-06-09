"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  level?: 1 | 2;
  badge?: string;
}

export function AccordionItem({
  title,
  children,
  defaultOpen = false,
  level = 1,
  badge,
}: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  // Different styles based on level for deep hierarchical nesting
  const buttonStyles =
    level === 1
      ? "w-full flex items-center justify-between p-5 text-left bg-[#13151a] hover:bg-[#181b22] border border-zinc-800/80 rounded-xl transition-all cursor-pointer group shadow-md"
      : "w-full flex items-center justify-between p-4 text-left bg-[#191b22]/50 hover:bg-[#1e222b] border border-zinc-800/40 rounded-lg transition-all cursor-pointer group shadow-sm";

  const titleStyles =
    level === 1
      ? "text-lg font-bold text-zinc-100 group-hover:text-emerald-400 transition-colors flex items-center gap-3"
      : "text-base font-semibold text-zinc-200 group-hover:text-emerald-400 transition-colors flex items-center gap-2";

  const contentContainerStyles =
    level === 1
      ? "mt-2 p-5 bg-[#0f1115]/30 border border-zinc-900 rounded-xl"
      : "mt-1.5 p-4 bg-[#14161d]/40 border border-zinc-900/50 rounded-lg";

  return (
    <div className={level === 1 ? "mb-4" : "mb-3"}>
      <button
        onClick={toggleOpen}
        className={buttonStyles}
        aria-expanded={isOpen}
      >
        <span className={titleStyles}>
          {level === 1 && (
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          )}
          <span>{title}</span>
          {badge && (
            <span className="ml-2 px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {badge}
            </span>
          )}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-zinc-400 group-hover:text-zinc-200 transition-transform duration-300 ease-out ${
            isOpen ? "transform rotate-180 text-emerald-400" : ""
          }`}
        />
      </button>

      {/* Smooth height animation container */}
      <div
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 pointer-events-none"
        }`}
      >
        <div className="overflow-hidden">
          <div className={contentContainerStyles}>{children}</div>
        </div>
      </div>
    </div>
  );
}
