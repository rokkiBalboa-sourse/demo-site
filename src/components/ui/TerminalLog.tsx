'use client';

import React, { useState } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';

interface TerminalLogProps {
  content: string;
  maxHeight?: string;
  title?: string;
  className?: string;
}

export function TerminalLog({
  content,
  maxHeight = 'max-h-96',
  title = 'proxmox-pve-audit.log',
  className = '',
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

  const renderLineContent = (line: string) => {
    if (!line.trim()) return <span>&nbsp;</span>;

    if (line.includes('===') || line.includes('---')) {
      return <span className="text-cyan-400 font-bold tracking-wide">{line}</span>;
    }

    if (/\[\s*OK\s*\]/i.test(line) || /\[\s*FAIL\s*\]/i.test(line)) {
      const parts = line.split(/(\[\s*OK\s*\]|\[\s*FAIL\s*\])/gi);
      return (
        <span>
          {parts.map((part, i) => {
            if (/\[\s*OK\s*\]/i.test(part)) {
              return (
                <span
                  key={i}
                  className="text-emerald-300 font-bold bg-emerald-950/80 border border-emerald-500/40 px-1.5 py-0.5 rounded text-[11px] shadow-[0_0_8px_rgba(16,185,129,0.25)]"
                >
                  {part}
                </span>
              );
            }
            if (/\[\s*FAIL\s*\]/i.test(part)) {
              return (
                <span
                  key={i}
                  className="text-rose-300 font-bold bg-rose-950/80 border border-rose-500/40 px-1.5 py-0.5 rounded text-[11px] shadow-[0_0_8px_rgba(244,63,94,0.25)]"
                >
                  {part}
                </span>
              );
            }
            return (
              <span key={i} className="text-zinc-200">
                {part}
              </span>
            );
          })}
        </span>
      );
    }

    if (line.includes('[!]')) {
      return <span className="text-amber-300">{line}</span>;
    }

    if (/^\s*\d+\.\s+/.test(line)) {
      return <span className="text-zinc-100 font-bold">{line}</span>;
    }

    return <span className="text-zinc-300">{line}</span>;
  };

  return (
    <div className={`w-full border border-zinc-800 bg-zinc-950 text-zinc-200 overflow-hidden font-mono ${className}`}>
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

      {/* Terminal Content with Line Numbers and colored tokens */}
      <div className={`p-3 overflow-auto text-xs leading-relaxed ${maxHeight}`}>
        <div className="table w-full">
          {lines.map((rawLine, idx) => {
            const line = rawLine.replace(/\x1b\[[0-9;]*m/g, '').replace(/\\033\[[0-9;]*m/g, '');

            return (
              <div key={idx} className="table-row hover:bg-zinc-900/60">
                <span className="table-cell pr-4 text-right text-zinc-600 select-none w-8 font-mono text-[11px]">
                  {idx + 1}
                </span>
                <span className="table-cell whitespace-pre font-mono">
                  {renderLineContent(line)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
