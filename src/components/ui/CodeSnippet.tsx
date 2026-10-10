'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeSnippetProps {
  code: string;
  label?: string;
}

export function CodeSnippet({ code, label }: CodeSnippetProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  return (
    <div className="w-full">
      {label && (
        <div className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1.5 flex items-center justify-between">
          <span>{label}</span>
          <span className="text-[11px] text-zinc-400">Proxmox VE Terminal</span>
        </div>
      )}
      <div className="relative bg-zinc-950 text-zinc-100 border border-zinc-800 p-3 font-mono text-xs sm:text-sm overflow-hidden group">
        <div className="flex items-start gap-2 overflow-x-auto pr-28 select-text scrollbar-thin">
          <span className="text-zinc-500 select-none font-mono mt-0.5">$</span>
          <pre className="whitespace-pre font-mono text-zinc-100 m-0 p-0 leading-relaxed select-text">
            {code}
          </pre>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="absolute right-2 top-2 px-2.5 py-1 bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer select-none backdrop-blur-sm z-10"
          title="Скопировать команду"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-white" />
              <span>Скопировано</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Копировать</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
