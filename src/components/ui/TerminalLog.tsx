'use client';

import React, { useState, useMemo } from 'react';
import { Copy, Check, Terminal, CheckCircle2, AlertTriangle, Filter } from 'lucide-react';

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
  const [filterMode, setFilterMode] = useState<'all' | 'fail' | 'ok'>('all');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy log', e);
    }
  };

  const lines = useMemo(() => {
    return (content || '').split('\n');
  }, [content]);

  // Statistics
  const okCount = useMemo(() => {
    return lines.filter((l) => /\[\s*OK\s*\]|\[\+\]/i.test(l)).length;
  }, [lines]);

  const failCount = useMemo(() => {
    return lines.filter((l) => /\[\s*FAIL\s*\]|\[\-\]|\bFAIL\b|\bFAILED\b/i.test(l)).length;
  }, [lines]);

  const filteredLinesWithIdx = useMemo(() => {
    return lines
      .map((line, idx) => ({ line, originalIdx: idx + 1 }))
      .filter(({ line }) => {
        if (filterMode === 'fail') {
          return /\[\s*FAIL\s*\]|\[\-\]|\bFAIL\b|\bFAILED\b/i.test(line);
        }
        if (filterMode === 'ok') {
          return /\[\s*OK\s*\]|\[\+\]/i.test(line);
        }
        return true;
      });
  }, [lines, filterMode]);

  return (
    <div className="w-full border border-zinc-800 bg-zinc-950 text-zinc-200 rounded-none overflow-hidden font-mono">
      {/* Terminal Title Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-zinc-900 border-b border-zinc-800 select-none">
        <div className="flex items-center gap-2.5">
          <Terminal className="w-3.5 h-3.5 text-zinc-400" />
          <span className="text-xs text-zinc-200 font-bold">{title}</span>
          <span className="text-[10px] text-zinc-500">({lines.length} строк)</span>

          {/* Quick status badges */}
          {okCount > 0 && (
            <span
              onClick={() => setFilterMode(filterMode === 'ok' ? 'all' : 'ok')}
              title="Нажмите для фильтрации только успешных"
              className={`text-[10px] px-1.5 py-0.5 border cursor-pointer transition-colors flex items-center gap-1 ${
                filterMode === 'ok'
                  ? 'bg-emerald-500 text-zinc-950 border-emerald-400 font-bold'
                  : 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60'
              }`}
            >
              <CheckCircle2 className="w-3 h-3" />
              <span>{okCount} OK</span>
            </span>
          )}

          {failCount > 0 && (
            <span
              onClick={() => setFilterMode(filterMode === 'fail' ? 'all' : 'fail')}
              title="Нажмите для фильтрации только ошибок"
              className={`text-[10px] px-1.5 py-0.5 border cursor-pointer transition-colors flex items-center gap-1 ${
                filterMode === 'fail'
                  ? 'bg-rose-500 text-white border-rose-400 font-bold'
                  : 'bg-rose-950/80 border-rose-500/40 text-rose-300 hover:bg-rose-900/60 animate-pulse'
              }`}
            >
              <AlertTriangle className="w-3 h-3" />
              <span>{failCount} FAIL</span>
            </span>
          )}

          {filterMode !== 'all' && (
            <button
              type="button"
              onClick={() => setFilterMode('all')}
              className="text-[10px] text-zinc-400 hover:text-white underline cursor-pointer"
            >
              Показать все
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-300 font-bold">Скопировано!</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Скопировать лог</span>
            </>
          )}
        </button>
      </div>

      {/* Terminal Content with Line Numbers & Colored Highlights */}
      <div className={`p-3 overflow-auto text-xs leading-relaxed ${maxHeight}`}>
        <div className="table w-full">
          {filteredLinesWithIdx.map(({ line, originalIdx }) => {
            const isFailLine = /\[\s*FAIL\s*\]|\[\-\]|\bFAIL\b|\bFAILED\b/i.test(line);
            const isOkLine = /\[\s*OK\s*\]|\[\+\]/i.test(line);

            let rowClass = 'hover:bg-zinc-900/60';
            if (isFailLine) {
              rowClass = 'bg-rose-950/25 hover:bg-rose-950/40 border-l-2 border-rose-500 pl-1.5 text-rose-100';
            } else if (isOkLine) {
              rowClass = 'hover:bg-emerald-950/15';
            }

            return (
              <div key={originalIdx} className={`table-row transition-colors ${rowClass}`}>
                <span className="table-cell pr-3.5 text-right text-zinc-600 select-none w-8 align-top text-[11px]">
                  {originalIdx}
                </span>
                <span className="table-cell whitespace-pre align-top py-0.5">
                  {renderFormattedLine(line)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/**
 * Format a single line of log with colored badges and keywords
 */
function renderFormattedLine(rawLine: string) {
  // Strip ANSI escape codes
  const line = rawLine
    .replace(/\x1b\[[0-9;]*m/g, '')
    .replace(/\\033\[[0-9;]*m/g, '');

  if (!line.trim()) {
    return <span>&nbsp;</span>;
  }

  // Section headers (=== or ---)
  if (/^(={3,}|-{3,})/.test(line.trim())) {
    return <span className="text-zinc-500 font-bold">{line}</span>;
  }

  // Split line by tags: [ OK ], [ FAIL ], [ WARN ], [ INFO ], [+], [-], [*], [!]
  const parts = line.split(
    /(\[\s*OK\s*\]|\[\s*FAIL\s*\]|\[\s*WARN\s*\]|\[\s*INFO\s*\]|\[\+\]|\[\-\]|\[\*\]|\[\!\])/gi
  );

  return (
    <>
      {parts.map((part, pIdx) => {
        // Tag: [ OK ]
        if (/^\[\s*OK\s*\]$/i.test(part)) {
          return (
            <span
              key={pIdx}
              className="inline-flex items-center font-bold text-emerald-300 bg-emerald-950/90 border border-emerald-500/60 px-1.5 py-0.5 text-[11px] leading-tight mr-1.5 select-none shadow-[0_0_8px_rgba(16,185,129,0.25)] rounded-[2px]"
            >
              [ OK ]
            </span>
          );
        }

        // Tag: [ FAIL ]
        if (/^\[\s*FAIL\s*\]$/i.test(part)) {
          return (
            <span
              key={pIdx}
              className="inline-flex items-center font-bold text-rose-300 bg-rose-950/90 border border-rose-500/60 px-1.5 py-0.5 text-[11px] leading-tight mr-1.5 select-none shadow-[0_0_10px_rgba(244,63,94,0.3)] rounded-[2px]"
            >
              [ FAIL ]
            </span>
          );
        }

        // Tag: [+]
        if (part === '[+]') {
          return (
            <span key={pIdx} className="font-bold text-emerald-400 mr-1 select-none">
              [+]
            </span>
          );
        }

        // Tag: [-]
        if (part === '[-]') {
          return (
            <span key={pIdx} className="font-bold text-rose-400 mr-1 select-none">
              [-]
            </span>
          );
        }

        // Tag: [*]
        if (part === '[*]') {
          return (
            <span key={pIdx} className="font-bold text-cyan-400 mr-1 select-none">
              [*]
            </span>
          );
        }

        // Tag: [!] or [ WARN ]
        if (part === '[!]' || /^\[\s*WARN\s*\]$/i.test(part)) {
          return (
            <span
              key={pIdx}
              className="inline-flex items-center font-bold text-amber-300 bg-amber-950/80 border border-amber-500/50 px-1.5 py-0.5 text-[11px] mr-1.5 select-none rounded-[2px]"
            >
              {part}
            </span>
          );
        }

        // Tag: [ INFO ]
        if (/^\[\s*INFO\s*\]$/i.test(part)) {
          return (
            <span
              key={pIdx}
              className="inline-flex items-center font-bold text-cyan-300 bg-cyan-950/80 border border-cyan-500/50 px-1.5 py-0.5 text-[11px] mr-1.5 select-none rounded-[2px]"
            >
              [ INFO ]
            </span>
          );
        }

        // Other subtext within the line
        return <span key={pIdx}>{formatSubText(part)}</span>;
      })}
    </>
  );
}

/**
 * Highlights individual words like ACTIVE, OK, FAIL inside text
 */
function formatSubText(text: string) {
  // Split by keywords: ACTIVE, INACTIVE, OK, FAIL, FAILED, ERROR
  const subTokens = text.split(/(\bACTIVE\b|\bINACTIVE\b|\bOK\b|\bFAIL\b|\bFAILED\b|\bERROR\b)/g);

  return (
    <>
      {subTokens.map((token, sIdx) => {
        if (token === 'OK' || token === 'ACTIVE') {
          return (
            <span key={sIdx} className="text-emerald-400 font-bold">
              {token}
            </span>
          );
        }

        if (token === 'FAIL' || token === 'FAILED' || token === 'ERROR' || token === 'INACTIVE') {
          return (
            <span key={sIdx} className="text-rose-400 font-bold">
              {token}
            </span>
          );
        }

        return <span key={sIdx} className="text-zinc-200">{token}</span>;
      })}
    </>
  );
}
