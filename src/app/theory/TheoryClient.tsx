'use client';

import React, { useState } from 'react';
import { ALT_LINUX_THEORY } from '@/lib/theory-data';
import { Button } from '@/components/ui/Button';
import { CodeSnippet } from '@/components/ui/CodeSnippet';
import { Search, ChevronRight, Terminal, ArrowRight, AlertTriangle, Info } from 'lucide-react';
import Link from 'next/link';

// Inline text formatter for **bold** and `code`
function formatInline(text: string): React.ReactNode {
  const regex = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  const segments = text.split(regex);

  return segments.map((seg, idx) => {
    if (seg.startsWith('**') && seg.endsWith('**')) {
      return (
        <strong key={idx} className="font-bold text-white">
          {seg.slice(2, -2)}
        </strong>
      );
    }
    if (seg.startsWith('`') && seg.endsWith('`')) {
      return (
        <code
          key={idx}
          className="bg-zinc-950 text-amber-300 px-1.5 py-0.5 border border-zinc-800 text-[11px] font-mono mx-0.5 rounded-none"
        >
          {seg.slice(1, -1)}
        </code>
      );
    }
    return seg;
  });
}

// Markdown renderer for rich theory pages
function MarkdownContent({ content }: { content: string }) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // 1. Fenced Code Block: ```bash / ```text / ```
    if (trimmed.startsWith('```')) {
      const lang = trimmed.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      const code = codeLines.join('\n').trim();
      elements.push(
        <div key={`code-${i}`} className="my-2.5">
          <CodeSnippet code={code} label={lang ? `Терминал (${lang})` : 'Терминал ALT Linux'} />
        </div>
      );
      continue;
    }

    // 2. Table: lines starting with |
    if (trimmed.startsWith('|')) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        tableLines.push(lines[i].trim());
        i++;
      }
      if (tableLines.length >= 2) {
        const headerRow = tableLines[0]
          .split('|')
          .filter((_, idx, arr) => idx > 0 && idx < arr.length - 1)
          .map(c => c.trim());
        // Skip separator row (tableLines[1])
        const dataRows = tableLines.slice(2).map(rowStr =>
          rowStr
            .split('|')
            .filter((_, idx, arr) => idx > 0 && idx < arr.length - 1)
            .map(c => c.trim())
        );

        elements.push(
          <div
            key={`table-${i}`}
            className="overflow-x-auto my-3 border border-zinc-800 bg-zinc-950/60"
          >
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/90 text-zinc-200">
                  {headerRow.map((h, hIdx) => (
                    <th
                      key={hIdx}
                      className="p-2.5 font-bold border-r border-zinc-800 last:border-r-0"
                    >
                      {formatInline(h)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/80">
                {dataRows.map((r, rIdx) => (
                  <tr key={rIdx} className="hover:bg-zinc-900/40">
                    {r.map((c, cIdx) => (
                      <td
                        key={cIdx}
                        className="p-2.5 border-r border-zinc-800/80 last:border-r-0 text-zinc-300"
                      >
                        {formatInline(c)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
      continue;
    }

    // 3. Blockquote / Alert: lines starting with >
    if (trimmed.startsWith('>')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        quoteLines.push(lines[i].trim().replace(/^>\s*/, ''));
        i++;
      }
      const quoteText = quoteLines.join(' ');
      const isWarn = quoteText.includes('⚠️') || quoteText.toLowerCase().includes('важно');

      elements.push(
        <div
          key={`quote-${i}`}
          className={`p-3 my-3 border flex items-start gap-2.5 text-xs font-mono leading-relaxed ${
            isWarn
              ? 'bg-amber-500/10 border-amber-500/40 text-amber-200'
              : 'bg-zinc-900 border-zinc-700 text-zinc-300'
          }`}
        >
          {isWarn ? (
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          ) : (
            <Info className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
          )}
          <div className="flex-1">{formatInline(quoteText)}</div>
        </div>
      );
      continue;
    }

    // 4. Headings
    if (trimmed.startsWith('## ')) {
      elements.push(
        <h2
          key={`h2-${i}`}
          className="text-base sm:text-lg font-bold text-white font-mono mt-6 mb-2 border-b border-zinc-800 pb-1.5 flex items-center gap-2"
        >
          {formatInline(trimmed.slice(3))}
        </h2>
      );
      i++;
      continue;
    }
    if (trimmed.startsWith('### ')) {
      elements.push(
        <h3
          key={`h3-${i}`}
          className="text-sm font-bold text-zinc-100 font-mono mt-4 mb-1.5 text-white"
        >
          {formatInline(trimmed.slice(4))}
        </h3>
      );
      i++;
      continue;
    }
    if (trimmed.startsWith('#### ')) {
      elements.push(
        <h4
          key={`h4-${i}`}
          className="text-xs font-bold text-zinc-300 font-mono mt-3 mb-1 uppercase tracking-wide"
        >
          {formatInline(trimmed.slice(5))}
        </h4>
      );
      i++;
      continue;
    }
    if (trimmed.startsWith('##### ')) {
      elements.push(
        <h5 key={`h5-${i}`} className="text-xs font-semibold text-zinc-400 font-mono mt-2 mb-1">
          {formatInline(trimmed.slice(6))}
        </h5>
      );
      i++;
      continue;
    }

    // 5. Divider
    if (trimmed === '---') {
      elements.push(<hr key={`hr-${i}`} className="border-zinc-800 my-4" />);
      i++;
      continue;
    }

    // 6. List Items (*, -, •, 1., 2.)
    if (trimmed.startsWith('* ') || trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
      const listContent = trimmed.slice(2);
      elements.push(
        <div
          key={`li-${i}`}
          className="flex items-start gap-2 text-xs font-mono text-zinc-300 pl-2 my-1 leading-relaxed"
        >
          <span className="text-zinc-500 shrink-0">•</span>
          <div>{formatInline(listContent)}</div>
        </div>
      );
      i++;
      continue;
    }

    // 7. Empty line
    if (!trimmed) {
      i++;
      continue;
    }

    // 8. Regular paragraph
    elements.push(
      <p key={`p-${i}`} className="text-xs font-mono text-zinc-300 leading-relaxed my-1.5">
        {formatInline(line)}
      </p>
    );
    i++;
  }

  return <div className="space-y-1">{elements}</div>;
}

export function TheoryClient() {
  const [activeSectionId, setActiveSectionId] = useState<string>(ALT_LINUX_THEORY[0].id);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedModule, setSelectedModule] = useState<
    'all' | 'module-1' | 'module-2' | 'module-3'
  >('all');

  const activeSection = ALT_LINUX_THEORY.find(s => s.id === activeSectionId) || ALT_LINUX_THEORY[0];

  const filteredSections = ALT_LINUX_THEORY.filter(s => {
    if (selectedModule !== 'all' && s.module !== selectedModule) {
      return false;
    }
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.title.toLowerCase().includes(q) ||
      s.summary.toLowerCase().includes(q) ||
      s.content.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="border border-zinc-800 bg-zinc-900/60 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-mono text-xs font-bold bg-white text-zinc-950 px-2 py-0.5">
              ДОКУМЕНТАЦИЯ
            </span>
            <span className="font-mono text-xs text-zinc-400">
              ALT Linux Platform p10 / Справочник по заданиям
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-mono">
            Теоретическая часть: Архитектура и администрирование ALT Linux
          </h1>
          <p className="text-xs text-zinc-400 font-mono mt-1 max-w-3xl leading-relaxed">
            Разделы документации строго соответствуют структуре экзаменационных заданий Модулей 1, 2
            и 3. Здесь собрана вся необходимая теоретическая база для понимания и самостоятельного
            выполнения каждого пункта.
          </p>
        </div>

        <Link href="/">
          <Button variant="outline" className="flex items-center gap-2 shrink-0">
            <span>К экзаменационным модулям</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>

      {/* Main Layout: Sidebar Navigation + Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar */}
        <div className="lg:col-span-4 space-y-3">
          {/* Module Filter Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 p-1 bg-zinc-900/90 border border-zinc-800">
            <button
              type="button"
              onClick={() => setSelectedModule('all')}
              className={`py-1.5 text-xs font-mono transition-colors cursor-pointer text-center ${
                selectedModule === 'all'
                  ? 'bg-zinc-800 text-white font-bold border border-zinc-700'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Все ({ALT_LINUX_THEORY.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedModule('module-1')}
              className={`py-1.5 text-xs font-mono transition-colors cursor-pointer text-center ${
                selectedModule === 'module-1'
                  ? 'bg-zinc-800 text-white font-bold border border-zinc-700'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Модуль 1 (11)
            </button>
            <button
              type="button"
              onClick={() => setSelectedModule('module-2')}
              className={`py-1.5 text-xs font-mono transition-colors cursor-pointer text-center ${
                selectedModule === 'module-2'
                  ? 'bg-zinc-800 text-white font-bold border border-zinc-700'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Модуль 2 (11)
            </button>
            <button
              type="button"
              onClick={() => setSelectedModule('module-3')}
              className={`py-1.5 text-xs font-mono transition-colors cursor-pointer text-center ${
                selectedModule === 'module-3'
                  ? 'bg-zinc-800 text-white font-bold border border-zinc-700'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Модуль 3 (10)
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Поиск по теории (etcnet, OSPF, NAT, RAID...)..."
              className="w-full h-9 bg-zinc-900 border border-zinc-800 px-3 text-xs font-mono text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-400"
            />
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute right-3 top-3 pointer-events-none" />
          </div>

          {/* Section Items */}
          <div className="border border-zinc-800 bg-zinc-900/40 divide-y divide-zinc-800 max-h-[calc(100vh-280px)] overflow-y-auto scrollbar-thin">
            {filteredSections.map(sec => {
              const isActive = sec.id === activeSectionId;
              return (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => setActiveSectionId(sec.id)}
                  className={`w-full text-left p-3 transition-colors cursor-pointer flex items-start justify-between gap-3 ${
                    isActive
                      ? 'bg-zinc-800/90 border-l-2 border-l-white'
                      : 'hover:bg-zinc-900/80 text-zinc-300'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-mono text-[10px] bg-zinc-800 text-zinc-300 px-1.5 py-0.2 border border-zinc-700">
                        {sec.module === 'module-1' ? 'M1' : 'M2'} • №{sec.taskNumber}
                      </span>
                      <span
                        className={`text-xs font-mono font-bold ${
                          isActive ? 'text-white' : 'text-zinc-300'
                        }`}
                      >
                        {sec.title}
                      </span>
                    </div>
                    <p className="text-[11px] font-mono text-zinc-500 line-clamp-2 leading-relaxed">
                      {sec.summary}
                    </p>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 shrink-0 mt-0.5 transition-transform ${
                      isActive ? 'text-white translate-x-0.5' : 'text-zinc-600'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Content Area */}
        <div className="lg:col-span-8">
          <div className="border border-zinc-800 bg-zinc-900/60 p-6 space-y-6">
            {/* Active Section Header */}
            <div className="border-b border-zinc-800 pb-4 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-2 font-mono text-xs text-zinc-400">
                  <span className="text-zinc-300 font-bold">{activeSection.moduleTitle}</span>
                  <span>/</span>
                  <span>Задание №{activeSection.taskNumber} из 11</span>
                  <span>•</span>
                  <span>
                    Раздел {activeSection.number} из {ALT_LINUX_THEORY.length}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white font-mono">
                  {activeSection.title}
                </h2>
                <p className="text-xs font-mono text-zinc-400 mt-1">{activeSection.summary}</p>
              </div>

              {activeSection.taskSlug && (
                <Link href={`/tasks/${activeSection.taskSlug}`} className="shrink-0">
                  <Button variant="outline" className="text-xs font-mono flex items-center gap-1.5">
                    <span>К заданию на стенде</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              )}
            </div>

            {/* Markdown Text Body with inline code snippets and tables */}
            <MarkdownContent content={activeSection.content} />

            {/* Interactive Code Blocks (if additional examples provided) */}
            {activeSection.codeBlocks && activeSection.codeBlocks.length > 0 && (
              <div className="pt-6 border-t border-zinc-800 space-y-4">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-zinc-300" />
                  <span>Дополнительные практические сценарии:</span>
                </h3>

                <div className="space-y-4">
                  {activeSection.codeBlocks.map((cb, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="text-[11px] font-mono text-zinc-400">{cb.label}:</div>
                      <CodeSnippet code={cb.code} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
