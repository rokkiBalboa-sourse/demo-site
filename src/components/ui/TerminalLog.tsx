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

  const lines = (content || '').split('\n');

  return (
    <div className="w-full border border-zinc-800 bg-zinc-950 text-zinc-200 rounded-none overflow-hidden font-mono">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-zinc-900 border-b border-zinc-800 select-none">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-zinc-400" />
          <span className="text-xs text-zinc-300 font-medium">{title}</span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="px-2 py-0.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
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

      {/* Terminal Content with Line Numbers and colored lines */}
      <div className={`p-3 overflow-auto text-xs leading-relaxed ${maxHeight}`}>
        <div className="table w-full">
          {lines.map((rawLine, idx) => {
            const line = rawLine
              .replace(/\x1b\[[0-9;]*m/g, '')
              .replace(/\\033\[[0-9;]*m/g, '');

            let lineClass = 'text-zinc-300';
            if (/\[\s*FAIL\s*\]|\bFAIL\b/i.test(line)) {
              lineClass = 'text-rose-400 font-medium';
            } else if (/\[\s*OK\s*\]|\bOK\b/i.test(line)) {
              lineClass = 'text-emerald-400 font-medium';
            } else if (line.includes('===') || line.includes('---')) {
              lineClass = 'text-zinc-500 font-bold';
            } else if (line.includes('[!]')) {
              lineClass = 'text-amber-400';
            }

            return (
              <div key={idx} className="table-row hover:bg-zinc-900/60">
                <span className="table-cell pr-4 text-right text-zinc-600 select-none w-8">
                  {idx + 1}
                </span>
                <span className={`table-cell whitespace-pre ${lineClass}`}>
                  {line || ' '}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
