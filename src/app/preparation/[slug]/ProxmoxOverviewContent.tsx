'use client';

import React, { useState } from 'react';
import {
  Server,
  Layers,
  Cpu,
  Box,
  Key,
  Copy,
  Check,
  AlertTriangle,
  Info,
  RotateCcw,
  Play,
  Maximize2,
  X,
  Monitor,
  Camera,
  ExternalLink,
  Terminal,
} from 'lucide-react';

interface ScreenshotCardProps {
  src: string;
  alt: string;
  onExpand: (src: string, alt: string) => void;
}

function ScreenshotCard({ src, alt, onExpand }: ScreenshotCardProps) {
  return (
    <div
      onClick={() => onExpand(src, alt)}
      className="my-3 group relative border border-zinc-800 bg-zinc-950 rounded-sm overflow-hidden cursor-zoom-in transition hover:border-zinc-600"
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="w-full h-auto object-contain max-h-[500px] transition group-hover:opacity-95"
      />
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition bg-zinc-900/90 border border-zinc-700 px-2 py-1 text-[11px] font-mono text-zinc-200 flex items-center gap-1 shadow-md">
        <Maximize2 className="w-3 h-3" />
        <span>Увеличить</span>
      </div>
    </div>
  );
}

function CopyableText({ text }: { text: string }) {
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
      className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-mono rounded cursor-pointer transition"
      title="Нажмите для копирования"
    >
      <code>{text}</code>
      {copied ? (
        <Check className="w-3 h-3 text-emerald-400" />
      ) : (
        <Copy className="w-3 h-3 text-zinc-400" />
      )}
    </button>
  );
}

export function ProxmoxOverviewContent() {
  const [expandedImage, setExpandedImage] = useState<{ src: string; alt: string } | null>(null);

  return (
    <div className="space-y-8 font-mono text-xs">
      {/* Lightbox Modal */}
      {expandedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setExpandedImage(null)}
        >
          <div
            className="relative max-w-6xl max-h-[92vh] flex flex-col items-center bg-zinc-950 border border-zinc-800 p-2 rounded shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between pb-2 px-2 border-b border-zinc-800 mb-2">
              <span className="text-xs text-zinc-300 font-mono">{expandedImage.alt}</span>
              <button
                type="button"
                onClick={() => setExpandedImage(null)}
                className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <img
              src={expandedImage.src}
              alt={expandedImage.alt}
              className="max-h-[82vh] w-auto object-contain rounded"
            />
          </div>
        </div>
      )}

      {/* SECTION 1: ЧТО ТАКОЕ PROXMOX VE */}
      <section className="border border-zinc-800 bg-zinc-900/60 p-6 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-zinc-800">
          <Server className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">
            1. Что такое Proxmox VE?
          </h2>
        </div>

        <p className="text-zinc-300 leading-relaxed text-xs">
          <strong>Proxmox Virtual Environment (Proxmox VE)</strong> — платформа виртуализации
          корпоративного уровня с открытым исходным кодом, объединяющая технологии{' '}
          <strong className="text-white">KVM</strong> (Kernel-based Virtual Machine) и{' '}
          <strong className="text-white">LXC</strong> (Linux Containers). Гипервизор работает на
          базе операционной системы <strong className="text-white">Debian</strong>, что относит его
          ко второму типу — между аппаратным обеспечением и Proxmox VE находится слой ОС. Это
          позволяет гибко управлять ресурсами сервера, создавая виртуальные машины и контейнеры
          через единый веб-интерфейс или командную строку.
        </p>

        <div className="border border-zinc-800 bg-zinc-950/80 p-4 space-y-3">
          <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wide flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-zinc-400" />
            <span>Назначение Proxmox VE</span>
          </h3>
          <p className="text-zinc-300 leading-relaxed">
            Основная цель Proxmox VE — упростить масштабирование IT-инфраструктуры без необходимости
            модернизации оборудования. Платформа поддерживает кластеризацию, что обеспечивает
            отказоустойчивость и высокую доступность за счёт объединения нескольких серверов в
            единую систему. Например, живая миграция виртуальных машин между узлами кластера
            выполняется без прерывания их работы — уникальная функция, редко встречающаяся у
            конкурентов.
          </p>

          <div className="pt-2">
            <span className="text-[11px] text-zinc-400 font-bold uppercase block mb-2">
              Архитектура Proxmox VE базируется на трёх ключевых компонентах:
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="border border-zinc-800 bg-zinc-900/80 p-3 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>KVM</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Обеспечивает полную аппаратную виртуализацию, поддерживая запуск различных ОС,
                  включая Windows и Linux.
                </p>
              </div>

              <div className="border border-zinc-800 bg-zinc-900/80 p-3 space-y-1">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
                  <Box className="w-3.5 h-3.5" />
                  <span>LXC</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Контейнерная виртуализация, которая минимизирует накладные расходы на изоляцию
                  процессов.
                </p>
              </div>

              <div className="border border-zinc-800 bg-zinc-900/80 p-3 space-y-1">
                <div className="flex items-center gap-1.5 text-sky-400 font-bold text-xs">
                  <Layers className="w-3.5 h-3.5" />
                  <span>QEMU</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Эмулятор, расширяющий возможности KVM для работы с разнообразными аппаратными
                  конфигурациями.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800/80 p-3 text-[11px] text-zinc-400 leading-relaxed">
            В отличие от гипервизоров первого типа (VMware ESXi, Microsoft Hyper-V), Proxmox VE не
            требует строгого соответствия аппаратному Compatibility List (HCL). Это даёт свободу
            выбора оборудования, но накладывает ответственность за стабильность конфигурации на
            администратора.
          </div>
        </div>
      </section>

      {/* SECTION 2: ПОДКЛЮЧЕНИЕ К ИНТЕРФЕЙСУ И АВТОРИЗАЦИЯ */}
      <section className="border border-zinc-800 bg-zinc-900/60 p-6 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-zinc-800">
          <Monitor className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">
            2. Подключение к веб-интерфейсу и авторизация
          </h2>
        </div>

        <p className="text-zinc-300 leading-relaxed">
          Познакомимся с самим интерфейсом программы. В графическую оболочку вы попадаете
          посредством перехода по IP-адресу вашего сервера, который вам назначил Proxmox (например,
          192.168.195.136).
        </p>

        {/* Port Callout */}
        <div className="border border-sky-500/30 bg-sky-500/10 p-3.5 flex items-start gap-3">
          <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-sky-200">
            <div className="font-bold text-xs text-sky-300">
              Вводим в строку браузера адрес с портом 8006:
            </div>
            <div className="bg-zinc-950 px-3 py-1.5 border border-sky-500/30 inline-block font-mono text-xs text-white">
              https://ВАШ_IP_АДРЕС:8006/
            </div>
            <p className="text-[11px] text-sky-200/90 leading-relaxed">
              Обратите внимание, что в конце обязательно указан порт <strong>:8006</strong>, без
              него вы не попадёте в GUI!
            </p>
          </div>
        </div>

        {/* SSL Warning */}
        <div className="space-y-3">
          <p className="text-zinc-300 leading-relaxed">
            Нас предупреждает браузер о незащищённом подключении — это нормально, так как тестовый
            стенд использует самоподписанный SSL-сертификат. Нажимаем кнопку{' '}
            <strong className="text-white">«Подробнее»</strong> (или «Дополнительные») и затем на
            ссылку <strong className="text-white">«Перейти на сайт…»</strong>:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ScreenshotCard
              src="/img/1.png"
              alt="Предупреждение безопасности браузера (шаг 1)"
              onExpand={(src, alt) => setExpandedImage({ src, alt })}
            />
            <ScreenshotCard
              src="/img/2.png"
              alt="Переход на сайт Proxmox (шаг 2)"
              onExpand={(src, alt) => setExpandedImage({ src, alt })}
            />
          </div>
        </div>

        {/* Auth Credentials Card */}
        <div className="border border-zinc-800 bg-zinc-950 p-4 space-y-3">
          <div className="flex items-center gap-2 text-zinc-200 font-bold">
            <Key className="w-4 h-4 text-amber-400" />
            <span>Окно авторизации Proxmox VE</span>
          </div>

          <p className="text-zinc-300">
            После перехода открывается форма входа. Вводим учетные данные стенда:
          </p>

          <div className="flex flex-wrap gap-4 text-xs">
            <div className="bg-zinc-900 border border-zinc-800 px-3 py-2 flex items-center gap-2">
              <span className="text-zinc-400">Логин:</span>
              <CopyableText text="root" />
            </div>
            <div className="bg-zinc-900 border border-zinc-800 px-3 py-2 flex items-center gap-2">
              <span className="text-zinc-400">Пароль:</span>
              <CopyableText text="toor" />
            </div>
          </div>

          <ScreenshotCard
            src="/img/3.png"
            alt="Окно авторизации Proxmox VE"
            onExpand={(src, alt) => setExpandedImage({ src, alt })}
          />

          {/* Note on VM credentials */}
          <div className="border border-amber-500/30 bg-amber-500/10 p-3 space-y-2">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-[11px] uppercase tracking-wide">
              <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Важное примечание по авторизации на узлах стенда:</span>
            </div>
            <div className="space-y-1.5 text-zinc-300 text-[11px] leading-relaxed">
              <p>
                • В дальнейшем для входа в операционную систему на всех виртуальных машинах стенда
                (ISP, HQ-RTR, HQ-SRV, BR-RTR, BR-SRV и др.) по умолчанию используются эти же учетные
                данные суперпользователя: логин <CopyableText text="root" /> и пароль{' '}
                <CopyableText text="toor" />.
              </p>
              <p>
                • Исключение: на клиентском хосте <strong className="text-white">HQ-CLI</strong>{' '}
                дополнительно настроена стандартная учетная запись пользователя с логином{' '}
                <CopyableText text="user" /> и паролем <CopyableText text="resu" />.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: ВЫБОР РЕЖИМА POOL VIEW */}
      <section className="border border-zinc-800 bg-zinc-900/60 p-6 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-zinc-800">
          <Layers className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">
            3. Режим сортировки «Pool View»
          </h2>
        </div>

        <p className="text-zinc-300 leading-relaxed">
          В графической оболочке отображаются все наши виртуальные машины, с которыми мы будем
          работать, а также вкладки для их сортировки. Мы сразу переключаемся на режим{' '}
          <strong className="text-white">«Pool View»</strong>, (выподающий список под логотипом
          &quot;Proxmox&quot;) в котором стенды сгруппированы по экзаменационным модулям:{' '}
          <code className="text-amber-300 font-bold bg-zinc-900 px-1 border border-zinc-800">
            Module1
          </code>
          ,{' '}
          <code className="text-amber-300 font-bold bg-zinc-900 px-1 border border-zinc-800">
            Module2
          </code>{' '}
          и{' '}
          <code className="text-amber-300 font-bold bg-zinc-900 px-1 border border-zinc-800">
            Module3
          </code>{' '}
          (названия могут незначительно отличаться, но суть остаётся прежней).
        </p>

        <ScreenshotCard
          src="/img/5.png"
          alt="Сортировка виртуальных машин в режиме Pool View"
          onExpand={(src, alt) => setExpandedImage({ src, alt })}
        />
      </section>

      {/* SECTION 4: ОСНОВНЫЕ РАЗДЕЛЫ УПРАВЛЕНИЯ ВМ */}
      <section className="border border-zinc-800 bg-zinc-900/60 p-6 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-zinc-800">
          <Server className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">
            4. Основные разделы для работы с виртуальной машиной
          </h2>
        </div>

        <p className="text-zinc-300 leading-relaxed">
          Мы выбираем первую ВМ и нам открывается набор разделов для работы с машиной. Основные 3
          раздела, с которыми мы будем работать: <strong className="text-white">«Console»</strong>,{' '}
          <strong className="text-white">«Hardware»</strong> и{' '}
          <strong className="text-white">«Snapshots»</strong>.
        </p>

        <ScreenshotCard
          src="/img/6-1.png"
          alt="Панель разделов виртуальной машины"
          onExpand={(src, alt) => setExpandedImage({ src, alt })}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          <div className="border border-zinc-800 bg-zinc-950/80 p-3.5 space-y-1.5">
            <div className="text-emerald-400 font-bold text-xs flex items-center gap-1.5">
              <Monitor className="w-3.5 h-3.5" />
              <span>«Console» (noVNC)</span>
            </div>
            <p className="text-[11px] text-zinc-300 leading-relaxed">
              Это монитор вашей машины, в нём мы будем выполнять всю основную работу. Консоль noVNC
              ограничена функционалом — в ней можно вводить команды с клавиатуры, но нет прямой
              вставки из буфера обмена (для вставки используется консоль xterm.js).
            </p>
          </div>

          <div className="border border-zinc-800 bg-zinc-950/80 p-3.5 space-y-1.5">
            <div className="text-amber-400 font-bold text-xs flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" />
              <span>«Hardware»</span>
            </div>
            <p className="text-[11px] text-zinc-300 leading-relaxed">
              Раздел аппаратных параметров ВМ. В нём находятся все характеристики и подключения:
              CPU, RAM, HDD, сетевые интерфейсы (Network Devices) и виртуальные адаптеры.
            </p>
          </div>

          <div className="border border-zinc-800 bg-zinc-950/80 p-3.5 space-y-1.5">
            <div className="text-sky-400 font-bold text-xs flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5" />
              <span>«Snapshots»</span>
            </div>
            <p className="text-[11px] text-zinc-300 leading-relaxed">
              Список ваших «точек сохранения». Вы можете сделать снапшот перед сложными изменениями,
              а при совершении ошибки — быстро откатиться назад к стабильному состоянию.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 5: РАБОТА СО СНАПШОТАМИ */}
      <section className="border border-zinc-800 bg-zinc-900/60 p-6 space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-zinc-800">
          <Camera className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">
            5. Работа со снапшотами (Snapshots)
          </h2>
        </div>

        {/* 5.1 Rollback */}
        <div className="border border-zinc-800 bg-zinc-950/80 p-4 space-y-3">
          <div className="flex items-center gap-2 text-white font-bold text-xs">
            <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
            <span>Откат к стартовому состоянию («exstart»)</span>
          </div>

          <p className="text-zinc-300 leading-relaxed">
            Перед началом работы обязательно нужно загрузить стартовый снапшот. Для этого переходим
            в раздел <strong className="text-white">«Snapshots»</strong>, выбираем снапшот с именем{' '}
            <code className="text-emerald-300 font-bold bg-zinc-900 px-1 border border-zinc-800">
              exstart
            </code>
            , нажимаем кнопку <strong className="text-white">Rollback</strong> и подтверждаем выбор
            кнопкой <strong className="text-white">Yes</strong>.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <ScreenshotCard
              src="/img/7.png"
              alt="Выбор раздела Snapshots и снапшота exstart"
              onExpand={(src, alt) => setExpandedImage({ src, alt })}
            />
            <ScreenshotCard
              src="/img/8.png"
              alt="Подтверждение отката Rollback"
              onExpand={(src, alt) => setExpandedImage({ src, alt })}
            />
          </div>
        </div>

        {/* 5.2 Take snapshot */}
        <div className="border border-zinc-800 bg-zinc-950/80 p-4 space-y-3">
          <div className="flex items-center gap-2 text-white font-bold text-xs">
            <Camera className="w-3.5 h-3.5 text-amber-400" />
            <span>Создание собственного снапшота</span>
          </div>

          <p className="text-zinc-300 leading-relaxed">
            Для создания новой контрольной точки нажмите кнопку{' '}
            <strong className="text-white">Take Snapshot</strong>, задайте имя снапшота и описание
            (по желанию), после чего дождитесь завершения его создания:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <ScreenshotCard
              src="/img/7.png"
              alt="Кнопка Take Snapshot в меню Snapshots"
              onExpand={(src, alt) => setExpandedImage({ src, alt })}
            />
            <ScreenshotCard
              src="/img/9.png"
              alt="Окно параметров создания снапшота"
              onExpand={(src, alt) => setExpandedImage({ src, alt })}
            />
          </div>
        </div>
      </section>

      {/* SECTION 6: ЗАПУСК ВМ И ВЫБОР КОНСОЛИ */}
      <section className="border border-zinc-800 bg-zinc-900/60 p-6 space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-zinc-800">
          <Play className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">
            6. Запуск ВМ и использование консолей (noVNC / xterm.js)
          </h2>
        </div>

        {/* Start VM */}
        <div className="space-y-3">
          <p className="text-zinc-300 leading-relaxed">
            Для запуска виртуальной машины выберите её в списке слева, перейдите в раздел{' '}
            <strong className="text-white">«Console»</strong> и нажмите кнопку{' '}
            <strong className="text-emerald-400">«Start»</strong>:
          </p>

          <ScreenshotCard
            src="/img/6.png"
            alt="Запуск виртуальной машины кнопкой Start"
            onExpand={(src, alt) => setExpandedImage({ src, alt })}
          />
        </div>

        {/* xterm.js */}
        <div className="space-y-3 pt-3 border-t border-zinc-800">
          <div className="text-zinc-200 font-bold text-xs flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-sky-400" />
            <span>Использование копирования и вставки через консоль xterm.js</span>
          </div>

          <p className="text-zinc-300 leading-relaxed">
            Для использования возможности копирования и вставки в правом верхнем углу нажимаем на
            стрелку возле кнопки <strong className="text-white">«Console»</strong> и выбираем{' '}
            <strong className="text-sky-300">xterm.js</strong>:
          </p>

          <ScreenshotCard
            src="/img/10.png"
            alt="Выпадающий список Console и выбор xterm.js"
            onExpand={(src, alt) => setExpandedImage({ src, alt })}
          />

          <p className="text-zinc-300 leading-relaxed">
            У нас открывается отдельное окно, в котором полностью повторяются все действия, что и в
            noVNC, но доступен стандартный буфер обмена операционной системы:
          </p>

          <ScreenshotCard
            src="/img/11.png"
            alt="Окно консоли xterm.js с поддержкой буфера обмена"
            onExpand={(src, alt) => setExpandedImage({ src, alt })}
          />

          {/* Warning on xterm.js stability */}
          <div className="border border-amber-500/40 bg-amber-500/10 p-3.5 flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-amber-200">
              <span className="font-bold uppercase tracking-wider text-[11px] text-amber-300">
                Внимание! Особенность работы в xterm.js:
              </span>
              <p className="text-[11px] leading-relaxed">
                Работа в{' '}
                <code className="text-white font-bold bg-zinc-900 px-1 border border-zinc-800">
                  xterm.js
                </code>{' '}
                не всегда стабильна — могут возникать артефакты символов и графические баги в
                полноэкранных текстовых редакторах (например, Nano или Vim). Если таковые
                наблюдаются, настоятельно рекомендуется переключиться обратно и продолжить работу в{' '}
                <strong className="text-white">noVNC</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
