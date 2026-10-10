'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Task, Submission } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Input } from '@/components/ui/Input';
import { CodeSnippet } from '@/components/ui/CodeSnippet';
import { TerminalLog } from '@/components/ui/TerminalLog';
import {
  CheckCircle2,
  AlertCircle,
  Send,
  Terminal,
  HelpCircle,
  BookOpen,
  TerminalSquare,
  Check,
  Copy,
  Server,
  AlertTriangle,
  ExternalLink,
  Activity,
  ArrowRight,
  Settings2,
  FileText,
  Lock,
  Unlock,
  RefreshCw,
  Info,
} from 'lucide-react';
import { analyzeCommandBlock } from '@/lib/command-explainer';
import { Module1AssignmentDispatcher } from './TaskModule1Assignments';
import { Module2AssignmentDispatcher } from './TaskModule2Assignments';

interface TaskSubmitFormProps {
  task: Task;
  initialSubmission: Submission | null;
}

// Helper to extract non-destructive diagnostic verification commands
function extractDiagnosticCommand(commands?: string, title?: string): string {
  if (!commands) {
    const t = (title || '').toLowerCase();
    if (t.includes('имен') || t.includes('hostname')) return 'hostnamectl status';
    if (t.includes('ospf') || t.includes('frr')) return 'vtysh -c "show ip ospf neighbor"';
    if (t.includes('samba') || t.includes('домен')) return 'samba-tool domain level show';
    if (t.includes('raid') || t.includes('mdadm')) return 'cat /proc/mdstat';
    if (t.includes('nfs')) return 'showmount -e localhost';
    if (t.includes('chrony') || t.includes('ntp')) return 'chronyc sources -v';
    if (t.includes('nftables') || t.includes('фаервол')) return 'nft list ruleset';
    if (t.includes('docker')) return 'docker ps';
    if (t.includes('сертификат') || t.includes('гост')) return 'certmgr -list';
    if (t.includes('fail2ban')) return 'fail2ban-client status';
    if (t.includes('dns') || t.includes('bind')) return 'systemctl status bind';
    if (t.includes('dhcp')) return 'systemctl status dhcpd';
    return 'ip -c --br a';
  }

  const lines = commands.split('\n');
  const diagLines: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const isDiag =
      trimmed.startsWith('ip -c --br') ||
      trimmed.startsWith('ip a') ||
      trimmed.startsWith('ip r') ||
      trimmed.startsWith('ip route') ||
      trimmed.startsWith('ping ') ||
      trimmed.startsWith('traceroute ') ||
      trimmed.startsWith('systemctl status') ||
      trimmed.startsWith('systemctl is-active') ||
      trimmed.startsWith('vtysh -c') ||
      trimmed.startsWith('samba-tool domain level') ||
      trimmed.startsWith('samba-tool user list') ||
      trimmed.startsWith('samba-tool group listmembers') ||
      trimmed.startsWith('ss -') ||
      trimmed.startsWith('curl ') ||
      trimmed.startsWith('certmgr -list') ||
      trimmed.startsWith('cryptcp -list') ||
      trimmed.startsWith('csptest ') ||
      trimmed.startsWith('cat /proc/mdstat') ||
      trimmed.startsWith('mdadm --detail') ||
      trimmed.startsWith('chronyc ') ||
      trimmed.startsWith('nft list ruleset') ||
      trimmed.startsWith('docker ps') ||
      trimmed.startsWith('showmount -e') ||
      trimmed.startsWith('fail2ban-client status') ||
      trimmed.startsWith('hostnamectl status') ||
      trimmed.startsWith('id ') ||
      trimmed.startsWith('getent ') ||
      trimmed.startsWith('timedatectl status') ||
      trimmed.startsWith('named-checkconf') ||
      trimmed.startsWith('named-checkzone') ||
      trimmed.startsWith('httpd2 -t') ||
      trimmed.startsWith('nginx -t');

    if (isDiag) {
      diagLines.push(trimmed);
    }
  }

  if (diagLines.length > 0) {
    return diagLines.join('\n');
  }

  const t = (title || '').toLowerCase();
  if (t.includes('имен') || t.includes('hostname')) return 'hostnamectl status';
  if (t.includes('ospf') || t.includes('frr')) return 'vtysh -c "show ip ospf neighbor"';
  if (t.includes('samba') || t.includes('домен')) return 'samba-tool domain level show';
  if (t.includes('raid') || t.includes('mdadm')) return 'cat /proc/mdstat';
  if (t.includes('nfs')) return 'showmount -e localhost';
  if (t.includes('chrony') || t.includes('ntp')) return 'chronyc sources -v';
  if (t.includes('nftables') || t.includes('фаервол')) return 'nft list ruleset';
  if (t.includes('docker')) return 'docker ps';
  if (t.includes('сертификат') || t.includes('гост')) return 'certmgr -list';
  if (t.includes('fail2ban')) return 'fail2ban-client status';
  if (t.includes('dns') || t.includes('bind')) return 'systemctl status bind';
  if (t.includes('dhcp')) return 'systemctl status dhcpd';
  return 'ip -c --br a';
}

// Helper to extract relevant config file paths mentioned in commands or text
function extractTargetFiles(commands?: string, explanation?: string): string[] {
  const text = `${commands || ''} ${explanation || ''}`;
  const regex = /\/(?:etc|var|proc|opt)\/[a-zA-Z0-9_\-\.\/\{\},]+/g;
  const matches = text.match(regex) || [];
  const unique = Array.from(new Set(matches)).filter(
    (p) => !p.endsWith('/...') && p.length > 4 && !p.includes('*')
  );
  return unique.slice(0, 4);
}

function InlineCopyButton({ text, label = 'Копировать' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="px-2 py-0.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-[11px] flex items-center gap-1.5 border border-zinc-700 transition font-mono cursor-pointer shrink-0"
    >
      {copied ? (
        <>
          <Check className="w-3 h-3 text-emerald-400" />
          <span className="text-emerald-400 font-bold">Скопировано</span>
        </>
      ) : (
        <>
          <Copy className="w-3 h-3 text-zinc-400" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
}

function Task2StepContent({ stepNumber }: { stepNumber: number }) {
  if (stepNumber === 1) {
    return (
      <div className="space-y-4 font-mono text-xs">
        {/* Open config */}
        <div className="bg-zinc-950/80 border border-zinc-800 p-3.5 space-y-2">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="text-zinc-300 font-bold">
              1. Открываем конфигурационный файл сетевых параметров ядра:
            </span>
            <InlineCopyButton text="vim /etc/net/sysctl.conf" />
          </div>
          <div className="bg-zinc-900 px-3 py-1.5 border border-zinc-800 text-emerald-300 font-mono text-xs">
            vim /etc/net/sysctl.conf
          </div>
        </div>

        {/* Vim memo */}
        <div className="bg-zinc-900/50 border border-zinc-800/80 p-3.5 space-y-2.5">
          <div className="flex items-center gap-2 text-amber-300 font-bold uppercase tracking-wider text-[11px]">
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>Памятка по работе в текстовом редакторе Vim:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-zinc-300">
            <div className="bg-zinc-950/80 border border-zinc-800 p-2 flex items-center gap-2">
              <kbd className="px-1.5 py-0.5 bg-zinc-800 border border-zinc-700 text-white font-bold text-[11px] rounded">
                i
              </kbd>
              <span className="text-zinc-300">Вход в режим редактирования (Insert)</span>
            </div>
            <div className="bg-zinc-950/80 border border-zinc-800 p-2 flex items-center gap-2">
              <kbd className="px-1.5 py-0.5 bg-zinc-800 border border-zinc-700 text-white font-bold text-[11px] rounded">
                Esc
              </kbd>
              <span className="text-zinc-300">Выход в командный режим (Normal)</span>
            </div>
            <div className="bg-zinc-950/80 border border-zinc-800 p-2 flex items-center gap-2">
              <kbd className="px-1.5 py-0.5 bg-zinc-800 border border-zinc-700 text-white font-bold text-[11px] rounded">
                :wq
              </kbd>
              <span className="text-zinc-300">Сохранить изменения и выйти</span>
            </div>
            <div className="bg-zinc-950/80 border border-zinc-800 p-2 flex items-center gap-2">
              <kbd className="px-1.5 py-0.5 bg-zinc-800 border border-zinc-700 text-white font-bold text-[11px] rounded">
                :q!
              </kbd>
              <span className="text-zinc-300">Выход без сохранения изменений</span>
            </div>
          </div>
        </div>

        {/* Parameter change */}
        <div className="bg-zinc-950/80 border border-zinc-800 p-3.5 space-y-2">
          <div className="text-zinc-300">
            Находим следующую строчку и меняем значение с <code className="text-red-400">0</code> на{' '}
            <code className="text-emerald-400 font-bold">1</code>:
          </div>
          <div className="bg-zinc-900 px-3 py-1.5 border border-zinc-800 text-amber-300 font-mono text-xs font-bold">
            net.ipv4.ip_forward = 1
          </div>
        </div>

        {/* Fast alternative */}
        <div className="bg-zinc-900/60 border border-zinc-800 p-3.5 space-y-2">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] uppercase font-bold">
                Быстрый способ
              </span>
              <span className="text-zinc-300 font-medium">Как сделать это одной командой без редактора:</span>
            </div>
            <InlineCopyButton text='echo "net.ipv4.ip_forward = 1" >> /etc/net/sysctl.conf' />
          </div>
          <div className="bg-zinc-950 px-3 py-2 border border-zinc-800 text-zinc-200 font-mono text-xs">
            echo &quot;net.ipv4.ip_forward = 1&quot; &gt;&gt; /etc/net/sysctl.conf
          </div>
        </div>

        {/* Network restart */}
        <div className="bg-zinc-950/80 border border-zinc-800 p-3.5 space-y-2">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="text-zinc-300">
              Перезапускаем сетевую подсистему, чтобы ALT Linux применил новые системные параметры:
            </span>
            <InlineCopyButton text="systemctl restart network" />
          </div>
          <div className="bg-zinc-900 px-3 py-1.5 border border-zinc-800 text-emerald-300 font-mono text-xs">
            systemctl restart network
          </div>
        </div>
      </div>
    );
  }

  if (stepNumber === 2) {
    const nftConfigCode = `#!/usr/sbin/nft -f
flush ruleset
table ip nat {
    chain postrouting {
        type nat hook postrouting priority srcnat;
        oifname "enp7s1" masquerade
    }
}`;

    const configBreakdown = [
      {
        line: '#!/usr/sbin/nft -f',
        title: 'Шебанг сценария',
        desc: 'Указывает ядру Linux, что файл является исполняемым сценарием правил nftables.',
      },
      {
        line: 'flush ruleset',
        title: 'Сброс правил',
        desc: 'Очищает текущую таблицу в оперативной памяти перед загрузкой, чтобы правила не задваивались при повторном запуске.',
      },
      {
        line: 'table ip nat { ... }',
        title: 'Объявление таблицы',
        desc: 'Создаёт таблицу для протокола IPv4 с именем nat.',
      },
      {
        line: 'chain postrouting { ... }',
        title: 'Цепочка пост-маршрутизации',
        desc: 'Срабатывает в самый последний момент — когда маршрутизатор уже определил выходной интерфейс для пакета.',
      },
      {
        line: 'type nat hook postrouting priority srcnat;',
        title: 'Привязка хука ядра',
        desc: 'Привязывает цепочку к стандартному хуку ядра postrouting для подмены адреса источника (srcnat).',
      },
      {
        line: 'oifname "enp7s1" masquerade',
        title: 'Правило маскировки (NAT)',
        desc: 'Для всего трафика, уходящего через внешний интерфейс enp7s1 (Outbound Interface Name), включает динамическую маскировку IP на адрес интерфейса.',
      },
    ];

    return (
      <div className="space-y-5 font-mono text-xs">
        {/* Intro */}
        <div className="bg-zinc-900/60 border border-zinc-800 p-3.5 text-zinc-300 leading-relaxed">
          В ALT Linux современным стандартом управления правилами трансляции и фильтрации является{' '}
          <strong className="text-white">nftables</strong> (пришёл на замену устаревшему iptables).
        </div>

        {/* 2.1 */}
        <div className="border border-zinc-800 bg-zinc-950/80 p-4 space-y-2.5">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="font-bold text-amber-300 text-xs">2.1. Установка пакетов</span>
            </div>
            <InlineCopyButton text="apt-get update && apt-get install nftables nano -y" />
          </div>
          <p className="text-zinc-400">
            Обновляем кэш репозиториев и устанавливаем пакет <code className="text-zinc-200">nftables</code> и текстовый редактор <code className="text-zinc-200">nano</code>:
          </p>
          <div className="bg-zinc-900 px-3 py-2 border border-zinc-800 text-emerald-300 font-mono text-xs">
            apt-get update &amp;&amp; apt-get install nftables nano -y
          </div>
        </div>

        {/* 2.2 */}
        <div className="border border-zinc-800 bg-zinc-950/80 p-4 space-y-4">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="font-bold text-amber-300 text-xs">2.2. Создание файла с правилами трансляции (NAT)</span>
            </div>
            <InlineCopyButton text="nano /etc/nftables/nftables.nft" />
          </div>

          <p className="text-zinc-400">
            Создаём конфигурационный файл правил <code className="text-zinc-200">/etc/nftables/nftables.nft</code>:
          </p>
          <div className="bg-zinc-900 px-3 py-2 border border-zinc-800 text-zinc-200 font-mono text-xs">
            nano /etc/nftables/nftables.nft
          </div>

          {/* Warning */}
          <div className="border border-amber-500/40 bg-amber-500/10 p-3 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-amber-200 leading-relaxed text-[11px]">
              <strong className="text-amber-300 uppercase">Важно:</strong> Если в файле присутствует любая другая предварительная конфигурация, полностью её удалите перед вставкой!
            </div>
          </div>

          {/* Code block */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-zinc-300">
                Вставляем следующий текст конфигурации:
              </span>
              <InlineCopyButton text={nftConfigCode} label="Копировать конфигурацию" />
            </div>
            <div className="bg-zinc-900/90 border border-zinc-800 p-3.5 text-zinc-200 font-mono text-xs leading-relaxed overflow-x-auto">
              <pre className="whitespace-pre">{nftConfigCode}</pre>
            </div>
          </div>

          {/* Line by line breakdown */}
          <div className="space-y-2 pt-2 border-t border-zinc-800">
            <div className="text-zinc-300 font-bold uppercase tracking-wider text-[11px] flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
              <span>Разбор каждой строчки конфигурации:</span>
            </div>
            <div className="space-y-2">
              {configBreakdown.map((item, idx) => (
                <div key={idx} className="bg-zinc-900/60 border border-zinc-800/80 p-2.5 space-y-1">
                  <div className="flex items-baseline justify-between gap-2 flex-wrap">
                    <code className="text-amber-300 font-bold text-xs bg-zinc-950 px-1.5 py-0.5 border border-zinc-800">
                      {item.line}
                    </code>
                    <span className="text-[10px] text-zinc-400 font-semibold">{item.title}</span>
                  </div>
                  <p className="text-zinc-300 text-[11px] leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 2.3 */}
        <div className="border border-zinc-800 bg-zinc-950/80 p-4 space-y-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-amber-300 text-xs">2.3. Запуск и добавление в автозагрузку</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-zinc-300">
                Чтобы правила не слетели после перезагрузки машины на экзамене, настраиваем автозапуск службы:
              </span>
              <InlineCopyButton text="systemctl enable --now nftables" />
            </div>
            <div className="bg-zinc-900 px-3 py-2 border border-zinc-800 text-emerald-300 font-mono text-xs">
              systemctl enable --now nftables
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-zinc-800/80">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-zinc-300">
                Принудительно очищаем текущие правила и загружаем наш файл:
              </span>
              <InlineCopyButton text={"nft flush ruleset\nnft -f /etc/nftables/nftables.nft"} />
            </div>
            <div className="bg-zinc-900 px-3 py-2 border border-zinc-800 text-emerald-300 font-mono text-xs space-y-1">
              <div>nft flush ruleset</div>
              <div>nft -f /etc/nftables/nftables.nft</div>
            </div>
          </div>

          {/* What does -f do */}
          <div className="bg-sky-500/10 border border-sky-500/30 p-3 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            <div className="text-sky-200 text-[11px] leading-relaxed">
              <strong className="text-sky-300">Что делает ключ nft -f?</strong>
              <p className="mt-0.5">
                Ключ <code className="text-white font-bold bg-zinc-900 px-1 border border-zinc-700">-f</code> (file) компилирует и мгновенно загружает набор правил из указанного текстового файла прямо в ядро Linux.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (stepNumber === 3) {
    const expectedNftRuleset = `table ip nat {
    chain postrouting {
        type nat hook postrouting priority srcnat; policy accept;
        oifname "enp7s1" masquerade
    }
}`;

    return (
      <div className="space-y-4 font-mono text-xs">
        <div className="bg-zinc-900/60 border border-zinc-800 p-3.5 text-zinc-300 leading-relaxed">
          На демонстрационном экзамене обязательно убедитесь, что всё применилось:
        </div>

        {/* Verification 1 */}
        <div className="border border-zinc-800 bg-zinc-950/80 p-4 space-y-3">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="font-bold text-amber-300 text-xs">
              1. Проверяем статус правил в ядре:
            </span>
            <InlineCopyButton text="nft list ruleset" />
          </div>
          <div className="bg-zinc-900 px-3 py-2 border border-zinc-800 text-emerald-300 font-mono text-xs">
            nft list ruleset
          </div>
          <div className="bg-emerald-950/30 border border-emerald-500/30 p-3 space-y-2">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Что должны увидеть:</span>
            </div>
            <div className="bg-zinc-950/90 border border-zinc-800 p-2.5 text-emerald-300 font-mono text-xs overflow-x-auto">
              <pre className="whitespace-pre leading-relaxed">{expectedNftRuleset}</pre>
            </div>
            <p className="text-zinc-300 text-[11px] leading-relaxed">
              Консоль выведет блок <code className="text-white font-bold bg-zinc-900 px-1 border border-zinc-800">table ip nat</code> ровно с теми строками, которые мы внесли в файл. Если вывод пустой — файл не применился через <code className="text-white bg-zinc-900 px-1 border border-zinc-800">nft -f</code>.
            </p>
          </div>
        </div>

        {/* Verification 2 */}
        <div className="border border-zinc-800 bg-zinc-950/80 p-4 space-y-3">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="font-bold text-amber-300 text-xs">
              2. Проверяем статус пересылки пакетов:
            </span>
            <InlineCopyButton text="sysctl net.ipv4.ip_forward" />
          </div>
          <div className="bg-zinc-900 px-3 py-2 border border-zinc-800 text-emerald-300 font-mono text-xs">
            sysctl net.ipv4.ip_forward
          </div>
          <div className="bg-emerald-950/30 border border-emerald-500/30 p-3 space-y-1.5">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Что должны увидеть:</span>
            </div>
            <div className="bg-zinc-950 border border-zinc-800 p-2 text-emerald-300 font-mono text-xs font-bold">
              net.ipv4.ip_forward = 1
            </div>
          </div>
        </div>

        {/* Verification 3 */}
        <div className="border border-zinc-800 bg-zinc-950/80 p-4 space-y-3">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="font-bold text-amber-300 text-xs">
              3. Проверяем доступность внешнего Интернета:
            </span>
            <InlineCopyButton text="ping -c 4 ya.ru" />
          </div>
          <div className="bg-zinc-900 px-3 py-2 border border-zinc-800 text-emerald-300 font-mono text-xs">
            ping -c 4 ya.ru
          </div>
          <div className="bg-emerald-950/30 border border-emerald-500/30 p-3 space-y-1.5">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Что должны увидеть:</span>
            </div>
            <div className="bg-zinc-950 border border-zinc-800 p-2 text-emerald-300 font-mono text-xs">
              4 packets transmitted, 4 received, 0% packet loss
            </div>
            <p className="text-zinc-300 text-[11px] leading-relaxed">
              Это подтверждает, что интерфейс <code className="text-white font-bold bg-zinc-900 px-1 border border-zinc-800">enp7s1</code> получил IP по DHCP и DNS-резолвинг работает штатно.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

function Task3StepContent({ stepNumber }: { stepNumber: number }) {
  if (stepNumber === 1) {
    return (
      <div className="space-y-4 font-mono text-xs">
        <div className="bg-zinc-900/60 border border-zinc-800 p-3.5 text-zinc-300 leading-relaxed">
          На обоих серверах создаётся пользователь <strong className="text-white">sshuser</strong> с идентификатором <code className="text-amber-300 font-bold">2026</code> и беспарольным sudo.
        </div>

        {/* Notice */}
        <div className="border border-sky-500/30 bg-sky-500/10 p-3 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
          <div className="text-sky-200 text-[11px] leading-relaxed">
            <strong className="text-sky-300 uppercase">Команды идентичны для обоих серверов:</strong>
            <p className="mt-0.5">
              Выполните приведённый блок последовательно сначала на узле <strong className="text-white">HQ-SRV</strong>, а затем на узле <strong className="text-white">BR-SRV</strong>.
            </p>
          </div>
        </div>

        {/* Substeps */}
        <div className="space-y-3">
          <div className="border border-zinc-800 bg-zinc-950/80 p-3.5 space-y-2">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-zinc-300 font-bold">
                1. Создаем пользователя sshuser с явным указанием UID 2026:
              </span>
              <InlineCopyButton text="useradd -u 2026 sshuser" />
            </div>
            <div className="bg-zinc-900 px-3 py-1.5 border border-zinc-800 text-emerald-300 font-mono text-xs">
              useradd -u 2026 sshuser
            </div>
          </div>

          <div className="border border-zinc-800 bg-zinc-950/80 p-3.5 space-y-2">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-zinc-300 font-bold">
                2. Назначаем пароль P@ssw0rd в неинтерактивном режиме:
              </span>
              <InlineCopyButton text='echo "sshuser:P@ssw0rd" | chpasswd' />
            </div>
            <div className="bg-zinc-900 px-3 py-1.5 border border-zinc-800 text-emerald-300 font-mono text-xs">
              echo &quot;sshuser:P@ssw0rd&quot; | chpasswd
            </div>
          </div>

          <div className="border border-zinc-800 bg-zinc-950/80 p-3.5 space-y-2">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-zinc-300 font-bold">
                3. Добавляем пользователя в административную группу wheel:
              </span>
              <InlineCopyButton text="usermod -aG wheel sshuser" />
            </div>
            <div className="bg-zinc-900 px-3 py-1.5 border border-zinc-800 text-emerald-300 font-mono text-xs">
              usermod -aG wheel sshuser
            </div>
          </div>

          <div className="border border-zinc-800 bg-zinc-950/80 p-3.5 space-y-2">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-zinc-300 font-bold">
                4. Разрешаем группе wheel выполнять любые команды через sudo без ввода пароля:
              </span>
              <InlineCopyButton text='echo "WHEEL_USERS ALL=(ALL:ALL) NOPASSWD: ALL" > /etc/sudoers.d/sshuser' />
            </div>
            <div className="bg-zinc-900 px-3 py-1.5 border border-zinc-800 text-emerald-300 font-mono text-xs">
              echo &quot;WHEEL_USERS ALL=(ALL:ALL) NOPASSWD: ALL&quot; &gt; /etc/sudoers.d/sshuser
            </div>
          </div>

          <div className="border border-zinc-800 bg-zinc-950/80 p-3.5 space-y-2">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-zinc-300 font-bold">
                5-7. Проверяем вход, статус суперпользователя и выходим:
              </span>
              <InlineCopyButton text={"su -l sshuser\nsudo id\nexit"} />
            </div>
            <div className="bg-zinc-900 px-3 py-2 border border-zinc-800 text-emerald-300 font-mono text-xs space-y-1">
              <div>su -l sshuser</div>
              <div>sudo id</div>
              <div>exit</div>
            </div>
          </div>
        </div>

        {/* What does su -l do */}
        <div className="bg-sky-500/10 border border-sky-500/30 p-3.5 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
          <div className="text-sky-200 text-[11px] leading-relaxed">
            <strong className="text-sky-300">Что делает su -l sshuser?</strong>
            <p className="mt-0.5 text-zinc-300">
              Параметр <code className="text-white font-bold bg-zinc-900 px-1 border border-zinc-700">-l</code> (или просто дефис <code className="text-white font-bold bg-zinc-900 px-1 border border-zinc-700">-</code>) запускает полноценную <strong>login-оболочку</strong>: переходит в домашний каталог пользователя (<code className="text-amber-300">/home/sshuser</code>) и подгружает все его системные переменные окружения.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (stepNumber === 2) {
    return (
      <div className="space-y-4 font-mono text-xs">
        <div className="bg-zinc-900/60 border border-zinc-800 p-3.5 text-zinc-300 leading-relaxed">
          На маршрутизаторах создаётся пользователь <strong className="text-white">net_admin</strong> с правами суперпользователя.
        </div>

        {/* Warning Callout */}
        <div className="border border-amber-500/40 bg-amber-500/10 p-3.5 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-amber-200 text-[11px] leading-relaxed">
            <strong className="text-amber-300 uppercase">Важно для маршрутизаторов:</strong>
            <p className="mt-0.5">
              На сетевых/маршрутизаторных сборках ALT Linux утилита <code className="text-white font-bold bg-zinc-900 px-1 border border-zinc-700">sudo</code> часто отсутствует по умолчанию. Поэтому перед настройкой прав обязательно устанавливаем пакет <code className="text-white font-bold bg-zinc-900 px-1 border border-zinc-700">sudo</code>.
            </p>
          </div>
        </div>

        {/* Notice */}
        <div className="border border-sky-500/30 bg-sky-500/10 p-3 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
          <div className="text-sky-200 text-[11px] leading-relaxed">
            <strong className="text-sky-300 uppercase">Команды идентичны для обоих маршрутизаторов:</strong>
            <p className="mt-0.5">
              Выполните приведённый блок последовательно сначала на узле <strong className="text-white">HQ-RTR</strong>, а затем на узле <strong className="text-white">BR-RTR</strong>.
            </p>
          </div>
        </div>

        {/* Substeps */}
        <div className="space-y-3">
          <div className="border border-zinc-800 bg-zinc-950/80 p-3.5 space-y-2">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-zinc-300 font-bold">
                1. Создаем пользователя net_admin:
              </span>
              <InlineCopyButton text="useradd net_admin" />
            </div>
            <div className="bg-zinc-900 px-3 py-1.5 border border-zinc-800 text-emerald-300 font-mono text-xs">
              useradd net_admin
            </div>
          </div>

          <div className="border border-zinc-800 bg-zinc-950/80 p-3.5 space-y-2">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-zinc-300 font-bold">
                2. Назначаем пароль P@ssw0rd:
              </span>
              <InlineCopyButton text='echo "net_admin:P@ssw0rd" | chpasswd' />
            </div>
            <div className="bg-zinc-900 px-3 py-1.5 border border-zinc-800 text-emerald-300 font-mono text-xs">
              echo &quot;net_admin:P@ssw0rd&quot; | chpasswd
            </div>
          </div>

          <div className="border border-zinc-800 bg-zinc-950/80 p-3.5 space-y-2">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-zinc-300 font-bold">
                3. Добавляем пользователя в группу wheel:
              </span>
              <InlineCopyButton text="usermod -aG wheel net_admin" />
            </div>
            <div className="bg-zinc-900 px-3 py-1.5 border border-zinc-800 text-emerald-300 font-mono text-xs">
              usermod -aG wheel net_admin
            </div>
          </div>

          <div className="border border-zinc-800 bg-zinc-950/80 p-3.5 space-y-2">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-zinc-300 font-bold">
                4. Обновляем репозитории и устанавливаем пакет sudo:
              </span>
              <InlineCopyButton text="apt-get update && apt-get install sudo -y" />
            </div>
            <div className="bg-zinc-900 px-3 py-1.5 border border-zinc-800 text-emerald-300 font-mono text-xs">
              apt-get update &amp;&amp; apt-get install sudo -y
            </div>
          </div>

          <div className="border border-zinc-800 bg-zinc-950/80 p-3.5 space-y-2">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-zinc-300 font-bold">
                5. Разрешаем беспарольный sudo для администраторов:
              </span>
              <InlineCopyButton text='echo "WHEEL_USERS ALL=(ALL:ALL) NOPASSWD: ALL" > /etc/sudoers.d/net_admin' />
            </div>
            <div className="bg-zinc-900 px-3 py-1.5 border border-zinc-800 text-emerald-300 font-mono text-xs">
              echo &quot;WHEEL_USERS ALL=(ALL:ALL) NOPASSWD: ALL&quot; &gt; /etc/sudoers.d/net_admin
            </div>
          </div>

          <div className="border border-zinc-800 bg-zinc-950/80 p-3.5 space-y-2">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-zinc-300 font-bold">
                6-8. Входим под net_admin, проверяем привилегии и выходим:
              </span>
              <InlineCopyButton text={"su -l net_admin\nsudo id\nexit"} />
            </div>
            <div className="bg-zinc-900 px-3 py-2 border border-zinc-800 text-emerald-300 font-mono text-xs space-y-1">
              <div>su -l net_admin</div>
              <div>sudo id</div>
              <div>exit</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (stepNumber === 3) {
    return (
      <div className="space-y-4 font-mono text-xs">
        <div className="bg-zinc-900/60 border border-zinc-800 p-3.5 text-zinc-300 leading-relaxed space-y-1.5">
          <p className="font-bold text-white">
            При выполнении команды <code className="text-amber-300">sudo id</code> под учётными записями <code className="text-amber-300">sshuser</code> и <code className="text-amber-300">net_admin</code>:
          </p>
          <ul className="list-disc list-inside space-y-1 text-zinc-300 text-[11px]">
            <li>Система <strong className="text-emerald-400">НЕ должна</strong> запрашивать ввод пароля.</li>
            <li>В консоли должен отобразиться идентификатор суперпользователя: <code className="text-emerald-300">uid=0(root) gid=0(root) groups=0(root)...</code></li>
          </ul>
        </div>

        {/* Verification 1: Servers */}
        <div className="border border-zinc-800 bg-zinc-950/80 p-4 space-y-3">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="font-bold text-amber-300 text-xs">
              1. Проверка на серверах (HQ-SRV, BR-SRV):
            </span>
            <InlineCopyButton text={"id sshuser\nsu -l sshuser -c \"sudo id\""} />
          </div>
          <div className="bg-zinc-900 px-3 py-2 border border-zinc-800 text-emerald-300 font-mono text-xs space-y-1">
            <div>id sshuser</div>
            <div>su -l sshuser -c &quot;sudo id&quot;</div>
          </div>
          <div className="bg-emerald-950/30 border border-emerald-500/30 p-3 space-y-1.5">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Что должны увидеть:</span>
            </div>
            <div className="bg-zinc-950 border border-zinc-800 p-2 text-emerald-300 font-mono text-xs space-y-1">
              <div>uid=2026(sshuser) gid=2026(sshuser) groups=2026(sshuser),10(wheel)</div>
              <div>uid=0(root) gid=0(root) groups=0(root)</div>
            </div>
            <p className="text-zinc-300 text-[11px] leading-relaxed">
              Команда <code className="text-white font-bold bg-zinc-900 px-1 border border-zinc-800">id sshuser</code> возвращает точный <strong className="text-white">UID 2026</strong>, а вызов <code className="text-white font-bold bg-zinc-900 px-1 border border-zinc-800">sudo id</code> срабатывает мгновенно без запроса пароля.
            </p>
          </div>
        </div>

        {/* Verification 2: Routers */}
        <div className="border border-zinc-800 bg-zinc-950/80 p-4 space-y-3">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="font-bold text-amber-300 text-xs">
              2. Проверка на маршрутизаторах (HQ-RTR, BR-RTR):
            </span>
            <InlineCopyButton text={"id net_admin\nsu -l net_admin -c \"sudo id\""} />
          </div>
          <div className="bg-zinc-900 px-3 py-2 border border-zinc-800 text-emerald-300 font-mono text-xs space-y-1">
            <div>id net_admin</div>
            <div>su -l net_admin -c &quot;sudo id&quot;</div>
          </div>
          <div className="bg-emerald-950/30 border border-emerald-500/30 p-3 space-y-1.5">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Что должны увидеть:</span>
            </div>
            <div className="bg-zinc-950 border border-zinc-800 p-2 text-emerald-300 font-mono text-xs space-y-1">
              <div>groups=...(wheel)...</div>
              <div>uid=0(root) gid=0(root) groups=0(root)</div>
            </div>
            <p className="text-zinc-300 text-[11px] leading-relaxed">
              Пользователь входит в группу <code className="text-white font-bold bg-zinc-900 px-1 border border-zinc-800">wheel(10)</code>, права суперпользователя через sudo работают без запроса пароля.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export function TaskSubmitForm({ task, initialSubmission }: TaskSubmitFormProps) {
  const router = useRouter();
  const [logOutput, setLogOutput] = useState(initialSubmission?.log_output || '');
  const [answers, setAnswers] = useState<Record<string, string>>(
    initialSubmission?.answers || {}
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [copiedDiag, setCopiedDiag] = useState<number | null>(null);

  const isPending = initialSubmission?.status === 'pending';
  const isReviewed = initialSubmission?.status === 'reviewed';
  const isRejected = initialSubmission?.status === 'rejected';

  // Оценка от 3 до 5 (положительная оценка):
  const hasPassingScore =
    initialSubmission?.score !== null &&
    initialSubmission?.score !== undefined &&
    initialSubmission.score >= 3;

  // Если студент получил оценку от 5 до 3, повторное прохождение заблокировано,
  // кроме случая, когда преподаватель явно открыл доступ на пересдачу (allow_retake)
  const isRetakeBlocked = hasPassingScore && !initialSubmission?.allow_retake;
  const isRetakeAllowedByTeacher = hasPassingScore && Boolean(initialSubmission?.allow_retake);

  // Разрешено редактирование, если нет сдачи, статус 'rejected' или включен режим пересдачи (при условии отсутствия блокировки)
  const [isRetaking, setIsRetaking] = useState(false);
  const canEdit = (!initialSubmission || isRejected || (isRetaking && !isRetakeBlocked)) && !isRetakeBlocked;

  const handleCopyDiag = async (stepNum: number, diagCmd: string) => {
    try {
      await navigator.clipboard.writeText(diagCmd);
      setCopiedDiag(stepNum);
      setTimeout(() => setCopiedDiag(null), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    if (!canEdit) return;
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!canEdit || isRetakeBlocked) {
      setError(
        `Задание уже сдано с положительной оценкой (${initialSubmission?.score}). Повторное прохождение заблокировано. Пересдача возможна только по согласованию с преподавателем.`
      );
      return;
    }

    if (!logOutput.trim()) {
      setError('Пожалуйста, вставьте вывод скрипта проверки из консоли');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId: task.id,
          logOutput,
          answers,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Ошибка при отправке отчёта');
      }

      setSuccessMessage(
        isRejected
          ? 'Исправленный отчёт успешно отправлен на повторную проверку!'
          : 'Отчёт успешно сохранён и передан на проверку преподавателю!'
      );
      setIsRetaking(false);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Произошла непредвиденная ошибка');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* SELF-STUDY BANNER */}
      <div className="border border-emerald-500/40 bg-emerald-500/10 p-4 flex items-start gap-3.5">
        <BookOpen className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-1 font-mono text-xs">
          <div className="font-bold text-emerald-300 uppercase tracking-wide flex items-center gap-2">
            <span>Режим осознанного обучения и практикума ALT Linux</span>
          </div>
          <p className="text-zinc-300 leading-relaxed">
            Для каждого шага задания ниже приведён <strong>полный разбор команд, функций и флагов</strong>.
            Не копируйте команды вслепую: изучайте таблицы параметров, разбирайтесь в логике работы подсистем ОС и контролируйте правильность настройки встроенными командами самопроверки.
          </p>
        </div>
      </div>

      {/* SECTION: TASK ASSIGNMENT SPECIFICATION */}
      {task.assignment && (
        <section className="border border-zinc-800 bg-zinc-900/60 p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-zinc-800 gap-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold bg-white text-zinc-950 px-2 py-0.5">
                ЗАДАНИЕ
              </span>
              <h2 className="text-sm font-bold uppercase tracking-wider text-white font-mono flex items-center gap-2">
                <FileText className="w-4 h-4 text-zinc-300" />
                <span>
                  {task.id === 'm1-task-3'
                    ? '3. Локальные учётные записи и sudo'
                    : task.id === 'm1-task-2'
                    ? '2. Доступ к сети Интернет на ISP'
                    : task.id === 'm1-task-1'
                    ? '1. Базовая настройка устройств и адресация'
                    : `${task.task_number}. ${task.title}`}
                </span>
              </h2>
            </div>
            <span className="text-[11px] font-mono text-zinc-400">
              Спецификация и требования демонстрационного экзамена
            </span>
          </div>

          {task.id === 'm1-task-2' ? (
            <div className="bg-zinc-950 p-5 border border-zinc-800 space-y-4 font-mono text-xs text-zinc-300 leading-relaxed">
              {/* Video Review Callout */}
              <div className="border border-emerald-500/30 bg-emerald-500/10 p-3.5 flex items-start justify-between gap-3 flex-wrap">
                <div className="flex items-start gap-2.5">
                  <span className="text-lg">📺</span>
                  <div className="space-y-1">
                    <div className="font-bold text-xs text-emerald-300 uppercase tracking-wider">
                      Видео-разбор задания
                    </div>
                    <p className="text-zinc-300 text-xs">
                      Видео-разбор выполнения задания доступен по ссылке:
                    </p>
                  </div>
                </div>
                <a
                  href="https://docker.sudostudy.dev/s/BTRAdw9Ewsczk7d"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition-colors shrink-0"
                >
                  <span>Смотреть видео-разбор</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="space-y-1.5">
                <div className="text-white font-bold uppercase tracking-wider text-[11px]">
                  Описание задачи:
                </div>
                <p className="text-zinc-300">
                  В данном задании настраивается интернет-провайдер (ISP). Его задача — принимать трафик из локальных сетей офисов (HQ и BR) и выпускать их в глобальную сеть через динамическую трансляцию адресов (NAT / Masquerade).
                </p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-zinc-800/80">
                <div className="text-white font-bold uppercase tracking-wider text-[11px]">
                  Место выполнения:
                </div>
                <p className="text-zinc-300 flex items-center gap-2">
                  <span>Все команды выполняются на виртуальной машине</span>
                  <span className="bg-zinc-900 border border-zinc-800 px-2 py-0.5 font-bold text-amber-300">
                    ISP (isp.au-team.irpo)
                  </span>
                </p>
              </div>

              <div className="space-y-3 pt-2 border-t border-zinc-800/80">
                <div className="text-white font-bold uppercase tracking-wider text-[11px]">
                  1. Теоретическая справка: что мы настраиваем и зачем?
                </div>

                <div className="bg-zinc-900/70 border border-zinc-800 p-3.5 space-y-1.5">
                  <div className="text-white font-bold flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                    <span>Зачем нужен ip_forward = 1?</span>
                  </div>
                  <p className="text-zinc-300 leading-relaxed">
                    По умолчанию ядро Linux настроено как обычный компьютер: если на его сетевую карту приходит пакет, адресованный не ему, ядро его просто отбрасывает. Включение директивы <code className="text-zinc-100 bg-zinc-950 px-1 border border-zinc-800 font-bold">net.ipv4.ip_forward = 1</code> сообщает ядру: <em>«Ты теперь маршрутизатор, пересылай транзитные пакеты между разными интерфейсами»</em>.
                  </p>
                </div>

                <div className="bg-zinc-900/70 border border-zinc-800 p-3.5 space-y-1.5">
                  <div className="text-white font-bold flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                    <span>Зачем нужен NAT Masquerade?</span>
                  </div>
                  <p className="text-zinc-300 leading-relaxed">
                    Сети наших офисов (172.16.1.0/28, 172.16.2.0/28, 192.168.x.x) относятся к приватным диапазонам{' '}
                    <a
                      href="https://datatracker.ietf.org/doc/html/rfc1918"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white underline hover:text-zinc-200 inline-flex items-center gap-1 font-bold"
                    >
                      <span>RFC 1918</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>. В открытом Интернете эти адреса не маршрутизируются. Механизм Masquerade («Маскарад») подменяет обратный серый адрес пакета на реальный IP-адрес внешнего интерфейса <code className="text-zinc-100 bg-zinc-950 px-1 border border-zinc-800 font-bold">enp7s1</code>, полученный от магистрального провайдера. Когда из Интернета приходит ответ, ISP возвращает пакет обратно нужному офисному серверу.
                  </p>
                </div>
              </div>
            </div>
          ) : task.id === 'm1-task-3' ? (
            <div className="bg-zinc-950 p-5 border border-zinc-800 space-y-4 font-mono text-xs text-zinc-300 leading-relaxed">
              {/* Video Review Callout */}
              <div className="border border-emerald-500/30 bg-emerald-500/10 p-3.5 flex items-start justify-between gap-3 flex-wrap">
                <div className="flex items-start gap-2.5">
                  <span className="text-lg">📺</span>
                  <div className="space-y-1">
                    <div className="font-bold text-xs text-emerald-300 uppercase tracking-wider">
                      Видео-разбор задания
                    </div>
                    <p className="text-zinc-300 text-xs">
                      Видео-разбор выполнения задания доступен по ссылке:
                    </p>
                  </div>
                </div>
                <a
                  href="https://docker.sudostudy.dev/s/BTRAdw9Ewsczk7d"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition-colors shrink-0"
                >
                  <span>Смотреть видео-разбор</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="space-y-1.5">
                <div className="text-white font-bold uppercase tracking-wider text-[11px]">
                  Описание задачи:
                </div>
                <p className="text-zinc-300">
                  В данном задании настраиваются системные административные пользователи на серверах и маршрутизаторах с правом выполнения команд суперпользователя (sudo) без ввода пароля.
                </p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-zinc-800/80">
                <div className="text-white font-bold uppercase tracking-wider text-[11px]">
                  Место выполнения:
                </div>
                <p className="text-zinc-300 flex items-center gap-2 flex-wrap">
                  <span>Команды выполняются на виртуальных машинах:</span>
                  <span className="bg-zinc-900 border border-zinc-800 px-2 py-0.5 font-bold text-amber-300">HQ-SRV</span>
                  <span className="bg-zinc-900 border border-zinc-800 px-2 py-0.5 font-bold text-amber-300">BR-SRV</span>
                  <span className="bg-zinc-900 border border-zinc-800 px-2 py-0.5 font-bold text-sky-300">HQ-RTR</span>
                  <span className="bg-zinc-900 border border-zinc-800 px-2 py-0.5 font-bold text-sky-300">BR-RTR</span>
                </p>
              </div>

              <div className="space-y-3 pt-2 border-t border-zinc-800/80">
                <div className="text-white font-bold uppercase tracking-wider text-[11px]">
                  1. Теоретическая справка: как работает безопасность в ALT Linux
                </div>

                <div className="bg-zinc-900/70 border border-zinc-800 p-3.5 space-y-1.5">
                  <div className="text-white font-bold flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                    <span>1. Что такое UID (-u 2026)?</span>
                  </div>
                  <p className="text-zinc-300 leading-relaxed">
                    В Linux операционная система различает пользователей не по их текстовым логинам, а по уникальным числовым идентификаторам — UID (User Identifier). По заданию требуется назначить конкретный UID 2026. Параметр <code className="text-zinc-100 bg-zinc-950 px-1 border border-zinc-800 font-bold">-u</code> принудительно задаёт этот номер при создании пользователя.
                  </p>
                </div>

                <div className="bg-zinc-900/70 border border-zinc-800 p-3.5 space-y-1.5">
                  <div className="text-white font-bold flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                    <span>2. Зачем нужна утилита chpasswd?</span>
                  </div>
                  <p className="text-zinc-300 leading-relaxed">
                    Команда passwd в консоли требует интерактивного ввода и повторного подтверждения пароля. Конструкция <code className="text-zinc-100 bg-zinc-950 px-1 border border-zinc-800 font-bold">echo &quot;user:pass&quot; | chpasswd</code> позволяет задать пароль в одну строчку без лишних диалогов, что критически экономит время на экзамене.
                  </p>
                </div>

                <div className="bg-zinc-900/70 border border-zinc-800 p-3.5 space-y-1.5">
                  <div className="text-white font-bold flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                    <span>3. Что такое группа wheel?</span>
                  </div>
                  <p className="text-zinc-300 leading-relaxed">
                    В дистрибутивах семейства ALT Linux (как и в RHEL/CentOS) исторически используется системная группа wheel. Члены этой группы наделяются правом повышать свои привилегии до root. Флаг <code className="text-zinc-100 bg-zinc-950 px-1 border border-zinc-800 font-bold">-aG</code> в usermod расшифровывается как:
                    <br />
                    • <strong className="text-white">-a (append)</strong> — добавить в группу, не удаляя пользователя из остальных его групп;
                    <br />
                    • <strong className="text-white">-G (supplementary Group)</strong> — указать дополнительную группу.
                  </p>
                </div>

                <div className="bg-zinc-900/70 border border-zinc-800 p-3.5 space-y-1.5">
                  <div className="text-white font-bold flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                    <span>4. Почему каталог /etc/sudoers.d/, а не файл /etc/sudoers?</span>
                  </div>
                  <p className="text-zinc-300 leading-relaxed">
                    Вместо небезопасного прямого редактирования основного файла /etc/sudoers принято создавать отдельные файлы в каталоге /etc/sudoers.d/. Директива <code className="text-zinc-100 bg-zinc-950 px-1 border border-zinc-800 font-bold">WHEEL_USERS ALL=(ALL:ALL) NOPASSWD: ALL</code> означает:
                    <br />
                    • <strong className="text-white">WHEEL_USERS</strong> — все участники группы wheel;
                    <br />
                    • <strong className="text-white">ALL=(ALL:ALL)</strong> — на всех хостах, от имени любого пользователя и любой группы;
                    <br />
                    • <strong className="text-white">NOPASSWD: ALL</strong> — запуск любых команд через sudo без запроса пароля.
                  </p>
                </div>
              </div>
            </div>
          ) : task.module_id === 'module-2' ? (
            <Module2AssignmentDispatcher task={task} />
          ) : (
            <Module1AssignmentDispatcher task={task} />
          )}
        </section>
      )}

      {/* Legacy theory fallback if present and no assignment */}
      {!task.assignment && task.theory && task.theory.length > 0 && (
        <section className="border border-zinc-800 bg-zinc-900/60 p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-zinc-800 gap-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold bg-white text-zinc-950 px-2 py-0.5">
                ЭТАП 1
              </span>
              <h2 className="text-sm font-bold uppercase tracking-wider text-white font-mono flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-zinc-300" />
                <span>Теоретические сведения и архитектура решения</span>
              </h2>
            </div>
          </div>

          <div className="space-y-4">
            {task.theory.map((item, idx) => (
              <div key={idx} className="bg-zinc-900 border border-zinc-800 p-4 space-y-2">
                <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wide">
                  {item.title}
                </h3>
                <p className="text-xs text-zinc-300 font-mono leading-relaxed">{item.explanation}</p>
                {item.details && item.details.length > 0 && (
                  <ul className="list-disc list-inside text-xs font-mono text-zinc-400 space-y-1 pl-1 pt-1">
                    {item.details.map((d, dIdx) => (
                      <li key={dIdx}>{d}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SECTION 2: STEP-BY-STEP SPECIFICATIONS & DIAGNOSTIC CHECKS */}
      {task.steps && task.steps.length > 0 && (
        <section className="border border-zinc-800 bg-zinc-900/60 p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-zinc-800 gap-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold bg-white text-zinc-950 px-2 py-0.5">
                ПОРЯДОК НАСТРОЙКИ
              </span>
              <h2 className="text-sm font-bold uppercase tracking-wider text-white font-mono flex items-center gap-2">
                <TerminalSquare className="w-4 h-4 text-zinc-300" />
                <span>Порядок самостоятельной настройки на стенде Proxmox VE</span>
              </h2>
            </div>
            <span className="text-[11px] font-mono text-amber-400 font-medium">
              Самостоятельное выполнение без готовых скриптов
            </span>
          </div>

          <div className="space-y-5">
            {(() => {
              const explainedToolsAcrossSteps = new Set<string>();

              return task.steps.map((st) => {
                const diagCommand = extractDiagnosticCommand(st.commands, st.title);
                const targetFiles = extractTargetFiles(st.commands, st.explanation);

                const allBreakdowns = analyzeCommandBlock(st.commands);
                const commandBreakdowns = allBreakdowns.filter((cmd) => {
                  if (explainedToolsAcrossSteps.has(cmd.binary)) {
                    return false;
                  }
                  explainedToolsAcrossSteps.add(cmd.binary);
                  return true;
                });

                return (
                  <div key={st.step_number} className="border border-zinc-800 bg-zinc-900/90">
                    {/* Step Header */}
                    <div className="flex flex-wrap items-center justify-between bg-zinc-900 px-4 py-2.5 border-b border-zinc-800 gap-2">
                      <div className="flex items-center gap-2 font-mono">
                        <span className="text-xs font-bold text-white bg-zinc-800 px-2 py-0.5 border border-zinc-700">
                          Шаг {st.step_number}
                        </span>
                        <span className="text-xs font-semibold text-zinc-200">{st.title}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-mono text-xs bg-zinc-950 text-zinc-300 border border-zinc-800 px-2.5 py-0.5">
                        <Server className="w-3.5 h-3.5 text-zinc-400" />
                        <span>
                          Целевой узел: <strong className="text-white">{st.node}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Step Body */}
                    <div className="p-4 space-y-4 font-mono text-xs">
                      {/* Technical Requirement */}
                      <div className="space-y-2">
                        <span className="text-zinc-500 uppercase text-[10px] tracking-wider block font-semibold">
                          Техническая задача и параметры:
                        </span>
                        {task.id === 'm1-task-2' ? (
                          <Task2StepContent stepNumber={st.step_number} />
                        ) : task.id === 'm1-task-3' ? (
                          <Task3StepContent stepNumber={st.step_number} />
                        ) : (
                          <p className="text-zinc-200 leading-relaxed bg-zinc-950/60 p-3 border border-zinc-800/80 whitespace-pre-line">
                            {st.explanation}
                          </p>
                        )}
                      </div>

                      {/* Commands Block */}
                      {st.commands && (
                        <div className="space-y-1.5 pt-1">
                          <div className="flex items-center justify-between">
                            <span className="text-zinc-400 uppercase text-[10px] tracking-wider flex items-center gap-1.5 font-semibold">
                              <Terminal className="w-3.5 h-3.5 text-zinc-300" />
                              <span>Выполняемые команды ({st.node}):</span>
                            </span>
                          </div>
                          <CodeSnippet code={st.commands} label={`Команды для узла ${st.node}`} />
                        </div>
                      )}

                      {/* Deep-Dive: Commands, Functions, and Flags Breakdown */}
                      {(() => {
                        if (!commandBreakdowns || commandBreakdowns.length === 0) return null;

                        return (
                          <div className="space-y-3 pt-2">
                            <div className="flex items-center gap-2 border-b border-zinc-800 pb-1.5">
                              <Settings2 className="w-3.5 h-3.5 text-amber-400" />
                              <span className="text-amber-400 uppercase text-[10px] tracking-wider font-bold">
                                Разбор команд, функций и флагов (для осознанного выполнения):
                              </span>
                            </div>

                            <div className="space-y-3">
                              {commandBreakdowns.map((cmd, cIdx) => (
                                <div key={cIdx} className="bg-zinc-950/80 border border-zinc-800 p-3 space-y-2.5">
                                  <div className="flex items-start justify-between gap-2 flex-wrap border-b border-zinc-800/80 pb-2">
                                    <code className="text-[11px] font-mono font-bold text-amber-300 bg-zinc-900 px-2 py-0.5 border border-zinc-800">
                                      {cmd.raw}
                                    </code>
                                    <span className="text-[10px] font-mono text-zinc-400 bg-zinc-900/90 px-1.5 py-0.5 border border-zinc-800">
                                      {cmd.title}
                                    </span>
                                  </div>

                                  <div className="text-[11px] font-mono text-zinc-300 leading-relaxed">
                                    <strong className="text-white">Назначение: </strong>
                                    {cmd.purpose}
                                  </div>

                                  <div className="text-[11px] font-mono text-zinc-400 leading-relaxed bg-zinc-900/40 p-2 border border-zinc-800/60">
                                    <strong className="text-zinc-200">Механизм работы в ОС: </strong>
                                    {cmd.howItWorks}
                                  </div>

                                  {cmd.flags && cmd.flags.length > 0 && (
                                    <div className="space-y-1.5 pt-1">
                                      <span className="text-[10px] font-mono text-zinc-400 uppercase font-semibold block">
                                        Подробный разбор параметров и флагов:
                                      </span>
                                      <div className="overflow-x-auto border border-zinc-800 bg-zinc-900/60">
                                        <table className="w-full text-left text-[11px] font-mono border-collapse">
                                          <thead>
                                            <tr className="border-b border-zinc-800 bg-zinc-900 text-zinc-300">
                                              <th className="p-2 border-r border-zinc-800 w-1/4">Флаг / Аргумент</th>
                                              <th className="p-2 border-r border-zinc-800 w-1/3">Значение и роль</th>
                                              <th className="p-2">Почему именно так</th>
                                            </tr>
                                          </thead>
                                          <tbody className="divide-y divide-zinc-800/80 text-zinc-300">
                                            {cmd.flags.map((f, fIdx) => (
                                              <tr key={fIdx} className="hover:bg-zinc-900/40">
                                                <td className="p-2 border-r border-zinc-800 font-bold text-amber-300 whitespace-nowrap">
                                                  {f.flag}
                                                </td>
                                                <td className="p-2 border-r border-zinc-800 text-zinc-300">
                                                  {f.description}
                                                </td>
                                                <td className="p-2 text-zinc-400">
                                                  {f.whyNeeded}
                                                </td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })()}

                      {/* Target Files / Directories */}
                      {targetFiles.length > 0 && (
                        <div className="space-y-1.5">
                          <span className="text-zinc-500 uppercase text-[10px] tracking-wider block font-semibold">
                            Конфигурационные файлы / каталоги:
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {targetFiles.map((file, fIdx) => (
                              <code
                                key={fIdx}
                                className="px-2 py-0.5 bg-zinc-950 border border-zinc-800 text-zinc-300 text-[11px]"
                              >
                                {file}
                              </code>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Diagnostic Check Command */}
                      {diagCommand && (
                        <div className="space-y-1.5 pt-1">
                          <div className="flex items-center justify-between">
                            <span className="text-zinc-400 uppercase text-[10px] tracking-wider flex items-center gap-1.5 font-semibold">
                              <Activity className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Команда самопроверки и аудита узла ({st.node}):</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopyDiag(st.step_number, diagCommand)}
                              className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[10px] flex items-center gap-1 border border-zinc-700 cursor-pointer font-mono"
                            >
                              {copiedDiag === st.step_number ? (
                                <>
                                  <Check className="w-3 h-3 text-white" />
                                  <span>Скопировано</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Скопировать команду проверки</span>
                                </>
                              )}
                            </button>
                          </div>
                          <div className="bg-zinc-950 p-2.5 border border-zinc-800 text-zinc-300 font-mono text-[11px] overflow-x-auto">
                            <pre className="whitespace-pre leading-relaxed">{diagCommand}</pre>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </section>
      )}

      {/* SECTION 3: AUTOMATED CHECK SCRIPT */}
      <section className="border border-zinc-800 bg-zinc-900/60 p-6 space-y-3">
        <div className="flex items-center gap-2 pb-3 border-b border-zinc-800">
          <span className="font-mono text-xs font-bold bg-white text-zinc-950 px-2 py-0.5">
            ЭТАП 3
          </span>
          <h2 className="text-sm font-bold uppercase tracking-wider text-white font-mono">
            Запуск скрипта автопроверки в консоли
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
          <p className="text-zinc-400">
            После завершения настройки запустите однострочный проверочный скрипт в консоли Proxmox VE (Server View &rarr; pve &rarr; Shell):
          </p>
          <Link
            href="/preparation/report-guide"
            target="_blank"
            className="text-[11px] text-emerald-400 hover:text-emerald-300 underline flex items-center gap-1 shrink-0"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Инструкция по заполнению отчёта</span>
          </Link>
        </div>

        <CodeSnippet code={task.script_command} label="Скрипт проверки задания" />
      </section>

      {/* FORM: QUESTIONS + LOG SUBMISSION */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* SECTION 4: CONSOLE OUTPUT (RAW LOG) */}
        <section className="border border-zinc-800 bg-zinc-900/60 p-6 space-y-3 font-mono">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold bg-white text-zinc-950 px-2 py-0.5">
                ЭТАП 4
              </span>
              <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-zinc-300" />
                <span>Загрузка отчёта из консоли (RAW Terminal Output)</span>
              </h2>
            </div>

            <div className="flex items-center gap-2">
              {!initialSubmission && <span className="text-[11px] text-zinc-500">Без валидации</span>}
              {isPending && (
                <span className="text-[11px] text-amber-400 font-bold flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>На проверке (заблокировано)</span>
                </span>
              )}
              {isReviewed && isRetakeBlocked && (
                <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Оценка: {initialSubmission.score} (пересдача закрыта)</span>
                </span>
              )}
              {isReviewed && isRetakeAllowedByTeacher && (
                <span className="text-[11px] text-cyan-400 font-bold flex items-center gap-1.5">
                  <Unlock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Пересдача разрешена</span>
                </span>
              )}
              {isReviewed && !hasPassingScore && (
                <span className="text-[11px] text-rose-400 font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                  <span>Оценка: {initialSubmission?.score ?? '2'} (доступна пересдача)</span>
                </span>
              )}
              {isRejected && (
                <span className="text-[11px] text-amber-300 font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Доступно исправление</span>
                </span>
              )}
            </div>
          </div>

          <p className="text-xs text-zinc-400">
            {canEdit
              ? 'Выделите весь текст, выведенный скриптом в консоли Proxmox VE (включая результаты проверок и диагностику), и вставьте в текстовое поле ниже:'
              : 'Сохранённый вывод проверки из консоли Proxmox VE:'}
          </p>

          <Textarea
            value={logOutput}
            onChange={(e) => canEdit && setLogOutput(e.target.value)}
            rows={10}
            isMono
            readOnly={!canEdit}
            disabled={!canEdit}
            placeholder="[*] Checking network interface configuration...&#10;[*] Testing reachability... OK&#10;[+] ALL CHECKS COMPLETED: 5/5 points"
            className={`text-xs font-mono bg-zinc-950 border-zinc-800 resize-y ${
              !canEdit
                ? 'opacity-75 cursor-not-allowed text-zinc-300 select-text'
                : 'focus:bg-zinc-900 text-white'
            }`}
            required
          />

          {initialSubmission?.log_output && (
            <div className="mt-4 pt-4 border-t border-zinc-800">
              <div className="text-xs text-zinc-400 mb-1.5">
                Ранее сохранённый лог консоли:
              </div>
              <TerminalLog content={initialSubmission.log_output} maxHeight="max-h-48" />
            </div>
          )}
        </section>

        {/* SECTION 5: CONTROL QUESTIONS (QUIZ) */}
        {task.questions && task.questions.length > 0 && (
          <section className="border border-zinc-800 bg-zinc-900/60 p-6 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-zinc-800">
              <span className="font-mono text-xs font-bold bg-white text-zinc-950 px-2 py-0.5">
                ЭТАП 5
              </span>
              <h2 className="text-sm font-bold uppercase tracking-wider text-white font-mono flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-zinc-300" />
                <span>Контрольные вопросы по заданию (Тест)</span>
              </h2>
            </div>

            <p className="text-xs text-zinc-400 font-mono">
              Выберите правильные варианты ответа на контрольные вопросы в соответствии с выполненной конфигурацией:
            </p>

            <div className="space-y-4">
              {task.questions.map((q, idx) => (
                <div key={q.id} className="border border-zinc-800 p-4 bg-zinc-900 space-y-3">
                  <div className="text-xs font-mono font-medium text-white leading-relaxed">
                    {idx + 1}. {q.text}
                  </div>

                  {q.options && q.options.length > 0 ? (
                    <div className="grid grid-cols-1 gap-2 pt-1 font-mono text-xs">
                      {q.options.map((opt) => {
                        const isSelected = answers[q.id] === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            disabled={!canEdit}
                            onClick={() => canEdit && handleAnswerChange(q.id, opt.id)}
                            className={`w-full p-2.5 border text-left flex items-start gap-3 transition-colors select-none ${
                              !canEdit ? 'cursor-not-allowed' : 'cursor-pointer'
                            } ${
                              isSelected
                                ? 'bg-zinc-800 text-white border-zinc-300 shadow-[0_0_12px_rgba(255,255,255,0.15)] ring-1 ring-zinc-300'
                                : !canEdit
                                ? 'bg-zinc-950/60 text-zinc-500 border-zinc-900 opacity-60'
                                : 'bg-zinc-950/80 text-zinc-300 border-zinc-800/90 hover:border-zinc-700 hover:bg-zinc-900/90'
                            }`}
                          >
                            <span
                              className={`shrink-0 w-5 h-5 flex items-center justify-center font-bold text-[11px] border transition-colors ${
                                isSelected
                                  ? 'bg-white text-zinc-950 border-white'
                                  : 'bg-zinc-900 text-zinc-500 border-zinc-800'
                              }`}
                            >
                              {opt.id}
                            </span>
                            <span className="leading-relaxed flex-1 text-[11px] pt-0.5">{opt.text}</span>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <Input
                      type="text"
                      value={answers[q.id] || ''}
                      onChange={(e) => canEdit && handleAnswerChange(q.id, e.target.value)}
                      placeholder={q.placeholder || 'Ваш ответ...'}
                      readOnly={!canEdit}
                      disabled={!canEdit}
                      className={`text-xs bg-zinc-950 border-zinc-800 text-zinc-100 ${
                        !canEdit ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Error or Success Notice */}
        {error && (
          <div className="p-3 bg-zinc-900 border border-red-700/60 text-xs font-mono text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3 bg-white text-zinc-950 text-xs font-mono font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-zinc-950" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Submit Bar / Lock Status */}
        <div className="border-t border-zinc-800 pt-5">
          {!initialSubmission && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-xs font-mono text-zinc-400">
                Отчёт поступит в журнал преподавателя для рецензирования и выставления баллов.
              </div>
              <Button type="submit" isLoading={isLoading} size="lg" className="flex items-center gap-2 shrink-0">
                <Send className="w-4 h-4" />
                <span>Отправить отчёт на проверку</span>
              </Button>
            </div>
          )}

          {isPending && !isRetaking && (
            <div className="space-y-4">
              <div className="border border-zinc-700 bg-zinc-900/90 p-4.5 flex items-start gap-3.5">
                <div className="w-8 h-8 rounded bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Lock className="w-4 h-4 text-zinc-300" />
                </div>
                <div className="space-y-1.5 font-mono text-xs flex-1">
                  <div className="font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <span>Отчёт отправлен и ожидает проверки преподавателем</span>
                    <span className="bg-zinc-800 text-zinc-300 border border-zinc-700 px-2 py-0.5 text-[10px]">
                      НА ПРОВЕРКЕ
                    </span>
                  </div>
                  <p className="text-zinc-400 leading-relaxed">
                    Вы сдали отчёт {new Date(initialSubmission.submitted_at).toLocaleString('ru-RU')}.
                    Если вам требуется внести исправления в лог или пересдать тест, нажмите кнопку «Пройти повторно / Внести исправления».
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsRetaking(true)}
                  size="lg"
                  className="flex items-center gap-2 border-zinc-700 text-zinc-200 hover:bg-zinc-800 hover:text-white"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Пройти повторно / Внести исправления</span>
                </Button>
              </div>
            </div>
          )}

          {isReviewed && !isRetaking && (
            <div className="space-y-4">
              <div className="border border-emerald-500/50 bg-emerald-950/30 p-4.5 flex items-start gap-3.5 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                <div className="w-8 h-8 rounded bg-emerald-900/50 border border-emerald-500/50 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-4 h-4 text-emerald-300" />
                </div>
                <div className="space-y-1.5 font-mono text-xs flex-1">
                  <div className="font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-2">
                    <span>Отчёт проверен и успешно принят</span>
                    <span className="bg-emerald-400 text-zinc-950 font-bold px-2 py-0.5 text-[10px]">
                      {initialSubmission.score !== null ? `${initialSubmission.score} / ${task.max_score} б.` : 'Зачтено'}
                    </span>
                  </div>
                  <p className="text-zinc-300 leading-relaxed">
                    Работа проверена преподавателем {initialSubmission.reviewed_at ? new Date(initialSubmission.reviewed_at).toLocaleString('ru-RU') : ''}.
                  </p>
                  {initialSubmission.feedback && (
                    <div className="mt-2 p-2.5 bg-black/60 border border-emerald-500/40 text-emerald-200 text-xs">
                      <span className="font-bold block text-emerald-300 mb-0.5">Рецензия преподавателя:</span>
                      <span>{initialSubmission.feedback}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* RETAKE CONTROLS & NOTICES */}
              {isRetakeBlocked && (
                <div className="border border-zinc-800 bg-zinc-950 p-4 flex items-start gap-3.5 font-mono text-xs">
                  <div className="w-8 h-8 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 mt-0.5">
                    <Lock className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <div className="font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <span>Повторное прохождение заблокировано</span>
                      <span className="bg-zinc-800 text-zinc-300 border border-zinc-700 px-2 py-0.5 text-[10px]">
                        ОЦЕНКА {initialSubmission.score}
                      </span>
                    </div>
                    <p className="text-zinc-400 leading-relaxed text-[11px]">
                      Вы уже получили оценку {initialSubmission.score} (от 3 до 5). Повторное прохождение задания для улучшения оценки возможно только по согласованию с преподавателем.
                    </p>
                  </div>
                </div>
              )}

              {isRetakeAllowedByTeacher && (
                <div className="space-y-3">
                  <div className="border border-cyan-500/50 bg-cyan-950/30 p-4 flex items-start gap-3.5 font-mono text-xs">
                    <div className="w-8 h-8 rounded bg-cyan-900/50 border border-cyan-500/50 flex items-center justify-center shrink-0 mt-0.5">
                      <Unlock className="w-4 h-4 text-cyan-300" />
                    </div>
                    <div className="space-y-1.5 flex-1">
                      <div className="font-bold text-cyan-300 uppercase tracking-wider">
                        Преподаватель разрешил пересдачу
                      </div>
                      <p className="text-zinc-300 leading-relaxed text-[11px]">
                        Вам открыт доступ на повторное прохождение задания (текущая оценка: {initialSubmission.score}). Вы можете обновить лог и контрольные вопросы.
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsRetaking(true)}
                      size="lg"
                      className="flex items-center gap-2 border-cyan-600/70 text-cyan-200 hover:bg-cyan-950 hover:text-white"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>Пройти повторно / Внести исправления</span>
                    </Button>
                  </div>
                </div>
              )}

              {!hasPassingScore && (
                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsRetaking(true)}
                    size="lg"
                    className="flex items-center gap-2 border-zinc-700 text-zinc-200 hover:bg-zinc-800 hover:text-white"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Пройти повторно / Пересдать</span>
                  </Button>
                </div>
              )}
            </div>
          )}

          {isRetaking && (
            <div className="space-y-4">
              <div className="border border-cyan-500/50 bg-cyan-950/30 p-4.5 flex items-start gap-3.5">
                <div className="w-8 h-8 rounded bg-cyan-900/50 border border-cyan-500/50 flex items-center justify-center shrink-0 mt-0.5">
                  <RefreshCw className="w-4 h-4 text-cyan-300 animate-spin" />
                </div>
                <div className="space-y-1.5 font-mono text-xs flex-1">
                  <div className="font-bold text-cyan-300 uppercase tracking-wider">
                    Режим перепрохождения / внесения правок
                  </div>
                  <p className="text-zinc-300 leading-relaxed">
                    Вы можете выбрать новые ответы на вопросы и обновить лог проверки в полях выше. При отправке новые ответы будут записаны в систему, а работа снова поступит в журнал преподавателя на проверку.
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsRetaking(false)}
                  size="lg"
                  className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                >
                  Отмена
                </Button>
                <Button
                  type="submit"
                  isLoading={isLoading}
                  size="lg"
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  <Send className="w-4 h-4" />
                  <span>Отправить обновлённый отчёт</span>
                </Button>
              </div>
            </div>
          )}

          {isRejected && (
            <div className="space-y-4">
              <div className="border border-amber-500/50 bg-amber-950/40 p-4.5 flex items-start gap-3.5 shadow-[0_0_18px_rgba(245,158,11,0.2)]">
                <div className="w-8 h-8 rounded bg-amber-900/60 border border-amber-500/60 flex items-center justify-center shrink-0 mt-0.5">
                  <AlertTriangle className="w-4 h-4 text-amber-300" />
                </div>
                <div className="space-y-1.5 font-mono text-xs flex-1">
                  <div className="font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
                    <span>Работа возвращена на доработку</span>
                    <span className="bg-amber-400 text-zinc-950 font-bold px-2 py-0.5 text-[10px]">
                      НА ДОРАБОТКУ
                    </span>
                  </div>
                  <p className="text-zinc-200 leading-relaxed">
                    Администратор отправил отчёт на доработку. Вы можете исправить данные в полях этапов 4 и 5 выше и отправить обновлённый отчёт на повторную проверку.
                  </p>
                  {initialSubmission.feedback && (
                    <div className="mt-2 p-2.5 bg-black/60 border border-amber-500/40 text-amber-200 text-xs">
                      <span className="font-bold block text-amber-300 mb-0.5">Замечание проверяющего:</span>
                      <span>{initialSubmission.feedback}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="text-xs font-mono text-amber-400/90">
                  После отправки статус изменится на «НА ПРОВЕРКЕ» и работа поступит в очередь на повторную проверку.
                </div>

                <Button
                  type="submit"
                  isLoading={isLoading}
                  size="lg"
                  className="flex items-center gap-2 shrink-0 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold border-amber-400 shadow-[0_0_14px_rgba(245,158,11,0.35)]"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Отправить исправленный отчёт</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
