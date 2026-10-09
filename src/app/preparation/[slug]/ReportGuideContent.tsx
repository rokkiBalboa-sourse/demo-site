'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Terminal,
  Copy,
  Check,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  FileText,
  ShieldAlert,
  Sparkles,
  Maximize2,
  X,
  ExternalLink,
  ChevronRight,
  Info,
  Send,
  Eye,
} from 'lucide-react';

interface StepItem {
  number: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  tip?: string;
  badge?: string;
}

export function ReportGuideContent() {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string; title: string } | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2500);
  };

  const steps: StepItem[] = [
    {
      number: '01',
      title: 'Переход в консоль Proxmox VE (Shell)',
      description:
        'Для загрузки отчёта нам нужно выполнить скрипт проверки вашей выполненной работы. Для его выполнения переходим в режим просмотра "Server View" (левый верхний угол интерфейса Proxmox), выбираем узел "pve" и переходим в раздел "Shell".',
      imageSrc: '/instr/11.png',
      imageAlt: 'Proxmox VE - Server View -> pve -> Shell',
      tip: 'Убедитесь, что в дереве слева выбран именно узел "pve", а не отдельная виртуальная машина.',
      badge: 'Proxmox GUI',
    },
    {
      number: '02',
      title: 'Копирование и запуск скрипта проверки',
      description:
        'Переходим к 3 этапу на странице задания на сайте и копируем команду проверочного скрипта (кнопка копирования в блоке этапа). Возвращаемся в Proxmox VE, вставляем скрипт в консоль Shell и жмём Enter. Ожидаем полного завершения работы скрипта.',
      imageSrc: '/instr/22.png',
      imageAlt: 'Копирование скрипта со страницы задания и запуск в Proxmox Shell',
      tip: 'Не прерывайте работу скрипта. Дождитесь появления итоговых строк проверки и возврата строки приглашения root@pve:~#.',
      badge: 'Запуск скрипта',
    },
    {
      number: '03',
      title: 'Копирование логов проверки из консоли',
      description:
        'После полного завершения работы скрипта выделяем весь сгенерированный вывод в окне Shell от начальной строчки до конца и копируем его (Ctrl+Shift+C или правой кнопкой мыши -> Копировать).',
      imageSrc: '/instr/33.png',
      imageAlt: 'Выделение и копирование полного лога выполнения проверки в Proxmox Shell',
      tip: 'Важно скопировать весь лог целиком — от стартовой метки проверки до финального статуса, без пропусков.',
      badge: 'Сбор логов',
    },
    {
      number: '04',
      title: 'Вставка логов в форму отчёта на сайте',
      description:
        'Возвращаемся на сайт к странице текущего задания, переходим к блоку "Этап 4. Отчёт о выполнении" и вставляем скопированные логи в поле ввода консольного вывода проверки.',
      imageSrc: '/instr/44.png',
      imageAlt: 'Вставка скопированных логов проверки в форму на сайте задания',
      tip: 'После вставки поле автоматически отобразит количество строк и форматированный вывод.',
      badge: 'Этап 4: Лог',
    },
    {
      number: '05',
      title: 'Ответы на вопросы теста и отправка на проверку',
      description:
        'Переходим к "Этапу 5. Контрольные вопросы", внимательно читаем вопросы и выбираем правильные варианты ответов. После заполнения нажимаем кнопку "Отправить отчёт на проверку".',
      imageSrc: '/instr/55.png',
      imageAlt: 'Выбор вариантов ответов на вопросы и отправка отчёта преподавателю',
      tip: 'После отправки отчёт поступит в журнал преподавателя со статусом "НА ПРОВЕРКЕ". При необходимости работу можно будет пересдать.',
      badge: 'Этап 5: Сдача',
    },
  ];

  const fixCommands = `timedatectl set-ntp true
chronyc -a makestep
systemctl restart systemd-timesyncd`;

  const fallbackDateCmd = `date -s "$(curl -sI https://google.com | grep -i '^Date:' | cut -d' ' -f2-)" && hwclock --systohc`;

  return (
    <div className="space-y-8 font-mono">
      {/* Lightbox / Zoom Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setSelectedImage(null)}
        >
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div className="text-xs text-zinc-300 font-bold flex items-center gap-2">
              <Eye className="w-4 h-4 text-emerald-400" />
              <span>{selectedImage.title}</span>
            </div>
            <button
              onClick={() => setSelectedImage(null)}
              className="text-zinc-400 hover:text-white p-1 rounded bg-zinc-900 border border-zinc-800 flex items-center gap-1.5 text-xs px-2.5 py-1"
            >
              <span>Закрыть</span>
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center p-2 overflow-auto my-2">
            <div
              className="relative max-w-full max-h-[82vh] border border-zinc-700 bg-zinc-950 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="max-w-full max-h-[82vh] object-contain rounded-sm"
              />
            </div>
          </div>

          <div className="text-center text-[11px] text-zinc-500 pt-2 border-t border-zinc-900">
            Нажмите в любом месте или кнопку «Закрыть» для возврата к инструкции
          </div>
        </div>
      )}

      {/* Intro Overview Card */}
      <div className="border border-zinc-800 bg-zinc-900/60 p-6 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-zinc-800">
          <FileText className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">
            Пошаговый регламент сдачи и проверки заданий
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
          Для каждого практического задания на портале предусмотрена автоматизированная процедура самопроверки стенда.
          Следуйте пяти простым шагам ниже, чтобы корректно снять логи настроек с вашего гипервизора Proxmox VE и отправить отчёт преподавателю.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="bg-zinc-950 border border-zinc-800 p-3 space-y-1">
            <div className="text-[11px] text-emerald-400 font-bold uppercase">1. Запуск в pve Shell</div>
            <div className="text-xs text-zinc-400">Скрипт запускается только на главном узле Proxmox VE</div>
          </div>
          <div className="bg-zinc-950 border border-zinc-800 p-3 space-y-1">
            <div className="text-[11px] text-cyan-400 font-bold uppercase">2. Полный лог вывода</div>
            <div className="text-xs text-zinc-400">Копируйте результат выполнения скрипта целиком</div>
          </div>
          <div className="bg-zinc-950 border border-zinc-800 p-3 space-y-1">
            <div className="text-[11px] text-amber-400 font-bold uppercase">3. Тест и отправка</div>
            <div className="text-xs text-zinc-400">Ответьте на теоретические вопросы и нажмите Отправить</div>
          </div>
        </div>
      </div>

      {/* STEPS LIST */}
      <div className="space-y-8">
        {steps.map((step, idx) => (
          <section
            key={step.number}
            className="border border-zinc-800 bg-zinc-900/60 p-6 space-y-5 relative overflow-hidden"
          >
            {/* Step Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800">
              <div className="flex items-start sm:items-center gap-3">
                <span className="font-bold text-base px-2.5 py-1 bg-white text-zinc-950 shadow-sm shrink-0">
                  ШАГ {step.number}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white tracking-wide">
                  {step.title}
                </h3>
              </div>
              {step.badge && (
                <span className="self-start sm:self-auto text-[11px] font-bold bg-zinc-800 border border-zinc-700 text-zinc-300 px-2 py-0.5">
                  {step.badge}
                </span>
              )}
            </div>

            {/* Step Description */}
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              {step.description}
            </p>

            {/* Screenshot Container with Click-to-Zoom */}
            <div className="space-y-2">
              <div
                className="group relative border border-zinc-800 bg-black overflow-hidden cursor-pointer hover:border-emerald-500/60 transition-colors shadow-xl"
                onClick={() =>
                  setSelectedImage({
                    src: step.imageSrc,
                    alt: step.imageAlt,
                    title: `Шаг ${step.number}: ${step.title}`,
                  })
                }
              >
                <div className="relative w-full aspect-[2560/1400] max-h-[520px]">
                  <img
                    src={step.imageSrc}
                    alt={step.imageAlt}
                    className="w-full h-full object-cover sm:object-contain group-hover:scale-[1.01] transition-transform duration-300"
                    loading="lazy"
                  />
                </div>

                {/* Hover overlay hint */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-bold pointer-events-none">
                  <div className="bg-zinc-950/90 border border-zinc-700 px-3 py-1.5 rounded flex items-center gap-2 shadow-lg">
                    <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Нажмите для увеличения изображения (2560×1400)</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-zinc-500 px-1">
                <span>{step.imageAlt}</span>
                <span className="flex items-center gap-1 text-zinc-400 hover:text-white cursor-pointer"
                  onClick={() =>
                    setSelectedImage({
                      src: step.imageSrc,
                      alt: step.imageAlt,
                      title: `Шаг ${step.number}: ${step.title}`,
                    })
                  }
                >
                  <Maximize2 className="w-3 h-3" />
                  <span>Открыть оригинал</span>
                </span>
              </div>
            </div>

            {/* Tip / Callout */}
            {step.tip && (
              <div className="border border-emerald-500/30 bg-emerald-950/20 p-3.5 flex items-start gap-3 text-xs text-zinc-300">
                <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-bold text-emerald-300 block">Подсказка:</span>
                  <span className="leading-relaxed">{step.tip}</span>
                </div>
              </div>
            )}
          </section>
        ))}
      </div>

      {/* SECTION: SSL CERTIFICATE ERROR RESOLUTION */}
      <section className="border-2 border-amber-500/50 bg-amber-950/20 p-6 space-y-5 shadow-[0_0_25px_rgba(245,158,11,0.15)]">
        <div className="flex items-start sm:items-center gap-3 pb-3 border-b border-amber-500/30">
          <div className="w-9 h-9 rounded bg-amber-900/60 border border-amber-500/60 flex items-center justify-center shrink-0 text-amber-300">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-amber-300 uppercase tracking-wide">
              Внимание: решение частой ошибки «certificate is not yet valid»
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Что делать, если curl выдаёт ошибку проверки SSL-сертификата при запуске скрипта
            </p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
          Если на вашей виртуальной машине или хосте <code className="text-amber-300 bg-black/60 px-1 py-0.5">pve</code> при запуске скрипта проверки возникает ошибка, как показано ниже — это означает, что <strong>на машине сбито системное время или дата</strong> (часы отстают от реального времени).
        </p>

        {/* Terminal Error Snippet Box */}
        <div className="border border-zinc-800 bg-black p-4 space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800 text-[11px] text-zinc-500">
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-rose-400" />
              <span className="text-rose-400 font-bold uppercase">Пример ошибки в консоли Proxmox Shell</span>
            </div>
          </div>
          <pre className="text-[11px] font-mono text-zinc-300 leading-relaxed overflow-x-auto whitespace-pre">
{`-bash: bash~: command not found
curl: (60) SSL certificate problem: certificate is not yet valid
More details here: https://curl.se/docs/sslcerts.html
 
curl failed to verify the legitimacy of the server and therefore could not
establish a secure connection to it. To learn more about this situation and
how to fix it, please visit the web page mentioned above.
root@pve:~# curl -sSL https://exam.sudostudy.dev/scripts/m1_t1.sh | bash
curl: (60) SSL certificate problem: certificate is not yet valid
More details here: https://curl.se/docs/sslcerts.html
 
curl failed to verify the legitimacy of the server and therefore could not
establish a secure connection to it.`}
          </pre>
        </div>

        {/* Solution Step 1: NTP Sync Commands */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Команды для исправления времени (выполнить в Shell на узле pve):</span>
          </div>

          <div className="border border-zinc-800 bg-zinc-950 p-4 space-y-2 relative">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80">
              <span className="text-[11px] text-zinc-400">Синхронизация службы времени NTP:</span>
              <button
                type="button"
                onClick={() => copyToClipboard(fixCommands, 'ntp-fix')}
                className="text-[11px] flex items-center gap-1.5 text-zinc-300 hover:text-white bg-zinc-900 border border-zinc-700 px-2 py-0.5 rounded transition"
              >
                {copiedCmd === 'ntp-fix' ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400 font-bold">Скопировано!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Скопировать команды</span>
                  </>
                )}
              </button>
            </div>
            <pre className="text-xs text-emerald-400 overflow-x-auto font-bold leading-relaxed">
{fixCommands}
            </pre>
          </div>
        </div>

        {/* Alternative sync command */}
        <div className="border border-zinc-800 bg-zinc-950 p-4 space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80">
            <span className="text-[11px] text-zinc-400">
              Быстрая синхронизация точного времени через интернет (одной строкой):
            </span>
            <button
              type="button"
              onClick={() => copyToClipboard(fallbackDateCmd, 'date-fix')}
              className="text-[11px] flex items-center gap-1.5 text-zinc-300 hover:text-white bg-zinc-900 border border-zinc-700 px-2 py-0.5 rounded transition"
            >
              {copiedCmd === 'date-fix' ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">Скопировано!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Скопировать</span>
                </>
              )}
            </button>
          </div>
          <pre className="text-xs text-cyan-300 overflow-x-auto leading-relaxed">
{fallbackDateCmd}
          </pre>
        </div>

        {/* Temporary bypass tip */}
        <div className="bg-zinc-950 border border-zinc-800 p-3.5 text-xs text-zinc-300 space-y-1.5">
          <div className="font-bold text-zinc-200">
            Экстренный обход (флаг -k):
          </div>
          <p className="text-zinc-400 leading-relaxed">
            Если на стенде нет доступа к внешним NTP-серверам, можно запустить команду с ключом <code className="text-emerald-300 bg-zinc-900 px-1 py-0.5">-k</code> (<code className="text-emerald-300 bg-zinc-900 px-1 py-0.5">curl -ksSL ... | bash</code>), чтобы пропустить валидацию даты сертификата.
          </p>
        </div>

        <div className="pt-2 text-xs text-amber-300 font-bold flex items-center gap-2">
          <ArrowRight className="w-4 h-4" />
          <span>После синхронизации времени повторно скопируйте и выполните проверочный скрипт.</span>
        </div>
      </section>
    </div>
  );
}
