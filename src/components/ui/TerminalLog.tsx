'use client';

import React, { useState } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';

interface TerminalLogProps {
  content: string;
  maxHeight?: string;
  title?: string;
}

export function TerminalLog({
  content,
  maxHeight = 'max-h-96',
  title = 'proxmox-pve-audit.log',
}: TerminalLogProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy log', e);
    }
  };

  const lines = content.split('\n');

  return (
    <div className="w-full border border-zinc-800 bg-zinc-950 text-zinc-200 rounded-none overflow-hidden">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-zinc-900 border-b border-zinc-800 select-none">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-zinc-400" />
          <span className="font-mono text-xs text-zinc-300 font-medium">{title}</span>
          <span className="text-[10px] font-mono text-zinc-500">({lines.length} lines)</span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="px-2 py-0.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 text-[11px] font-mono flex items-center gap-1 transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-white" />
              <span>Скопировано</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Скопировать всё</span>
            </>
          )}
        </button>
      </div>

      {/* Terminal Content with Line Numbers */}
      <div className={`p-3 overflow-auto font-mono text-xs leading-relaxed ${maxHeight}`}>
        <div className="table w-full">
          {lines.map((line, idx) => {
            // Highlight prefixes like [*], [+], [!], [2026-...
            let lineClass = 'text-zinc-300';
            if (line.includes('[+]')) lineClass = 'text-zinc-100 font-medium';
            if (line.includes('[!]')) lineClass = 'text-zinc-300 font-semibold underline decoration-zinc-500';
            if (line.includes('===') || line.includes('---')) lineClass = 'text-zinc-500';

            return (
              <div key={idx} className="table-row hover:bg-zinc-900/60">
                <span className="table-cell pr-4 text-right text-zinc-600 select-none w-8">
                  {idx + 1}
                </span>
                <span className={`table-cell whitespace-pre ${lineClass}`}>{line || ' '}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
