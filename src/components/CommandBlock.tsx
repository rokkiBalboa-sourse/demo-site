"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CommandBlockProps {
  command: string;
}

export default function CommandBlock({ command }: CommandBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy command:", err);
    }
  };

  return (
    <div className="relative my-3 rounded-lg overflow-hidden border border-zinc-800 bg-[#0d0f12] font-mono text-sm text-zinc-300 shadow-xl max-w-full">
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-900 bg-[#16191f]">
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-[#ff5f56] inline-block"></span>
          <span className="w-3 h-3 rounded-full bg-[#ffbd2e] inline-block"></span>
          <span className="w-3 h-3 rounded-full bg-[#27c93f] inline-block"></span>
          <span className="text-xs text-zinc-500 font-sans ml-2 select-none">bash</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-sans text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors focus:outline-none focus:ring-1 focus:ring-zinc-700 cursor-pointer"
          aria-label="Copy command"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-emerald-500 font-medium">Скопировано!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Копировать</span>
            </>
          )}
        </button>
      </div>

      {/* Terminal Content */}
      <div className="p-4 overflow-x-auto whitespace-pre font-mono scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
        <div className="flex items-start">
          <span className="text-emerald-500 select-none mr-3">$</span>
          <code className="text-zinc-200 select-all block text-left w-full break-all whitespace-pre-wrap">{command}</code>
        </div>
      </div>
    </div>
  );
}
