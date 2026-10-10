'use client';

import React, { useState } from 'react';
import {
  DownloadCloud,
  HardDrive,
  Cpu,
  Monitor,
  Key,
  Copy,
  Check,
  AlertTriangle,
  Info,
  Terminal,
  Activity,
  Play,
  CheckCircle2,
  Settings,
  RefreshCw,
  FileCode,
  Network,
  ExternalLink,
} from 'lucide-react';

function CopyButton({ text, label = 'Копировать' }: { text: string; label?: string }) {
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

export function StandInstallationContent() {
  return (
    <div className="space-y-6 font-mono text-xs">
      {/* MEGA HIGH-VISIBILITY DOWNLOAD CTA BUTTON (ОТДЕЛЬНАЯ КНОПКА ДЛЯ СКАЧИВАНИЯ) */}
      <div className="p-1 rounded bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 shadow-[0_0_28px_rgba(16,185,129,0.35)] transition">
        <a
          href="https://docker.sudostudy.dev/s/jyta52m4nDy7DCp"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-zinc-950 hover:bg-zinc-900 border border-emerald-500/40 transition group cursor-pointer"
        >
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <DownloadCloud className="w-7 h-7 text-emerald-400" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="bg-emerald-400 text-zinc-950 text-[10px] font-black uppercase px-2 py-0.5 tracking-wider">
                  СКАЧАТЬ СТЕНД
                </span>
              </div>
              <div className="text-sm sm:text-base font-bold text-white tracking-tight">
                Архив DemoExam_2026.7z + Установщик VMware Workstation
              </div>
              <div className="text-xs text-zinc-400">
                Все файлы для работы уже загружены на диск — нажмите, чтобы перейти к скачиванию
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 px-5 py-3 bg-emerald-500 group-hover:bg-emerald-400 text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-sm shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.4)] transition">
            <span>Скачать стенд</span>
            <ExternalLink className="w-4 h-4" />
          </div>
        </a>
      </div>

      {/* IMPORTANT VERSION NOTE (ПОМАРКА) */}
      <div className="border border-amber-500/40 bg-amber-500/10 p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1 text-amber-200">
          <div className="font-bold text-xs uppercase tracking-wide text-amber-300">
            Обратите внимание: отличие видео и скачанного стенда
          </div>
          <p className="text-xs leading-relaxed text-amber-200/90">
            Виртуальный стенд в видеоролике и состав машин в скачанном архиве могут немного
            отличаться по списку и наименованию виртуальных машин. Это абсолютно нормально: на видео
            показан процесс развертывания на примере более ранней версии стенда, тогда как в архиве
            находится актуальная редакция под текущую спецификацию экзамена.
          </p>
        </div>
      </div>

      {/* STEP 1: PREPARATION & REQUIREMENTS */}
      <section className="border border-zinc-800 bg-zinc-900/60 p-6 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-zinc-800">
          <HardDrive className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">
            Шаг 1. Подготовка файлов и системные требования
          </h2>
        </div>

        <p className="text-zinc-300 leading-relaxed">
          Для развертывания полноценного стенда Proxmox VE на домашнем компьютере или ноутбуке
          потребуются следующие компоненты (все они доступны по ссылке на облачный диск выше):
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-zinc-800 bg-zinc-950/80 p-4 space-y-2.5">
            <div className="text-white font-bold text-xs flex items-center gap-2">
              <Cpu className="w-4 h-4 text-amber-400" />
              <span>Минимальные требования к домашнему ПК:</span>
            </div>
            <ul className="space-y-1.5 text-zinc-300 text-[11px] list-disc list-inside">
              <li>
                <strong className="text-white">Процессор:</strong> от 4 ядер с обязательной
                поддержкой аппаратной виртуализации (Intel VT-x / AMD-V), включенной в BIOS/UEFI.
              </li>
              <li>
                <strong className="text-white">Оперативная память (RAM):</strong> от 16 ГБ
                (рекомендуется выделить виртуальной машине стенда не менее 12–14 ГБ).
              </li>
              <li>
                <strong className="text-white">Накопитель:</strong> от 60 ГБ свободного места
                (настоятельно рекомендуется скоростной SSD или NVMe накопитель).
              </li>
            </ul>
          </div>

          <div className="border border-zinc-800 bg-zinc-950/80 p-4 space-y-2.5">
            <div className="text-white font-bold text-xs flex items-center gap-2">
              <DownloadCloud className="w-4 h-4 text-sky-400" />
              <span>Необходимые дистрибутивы и файлы:</span>
            </div>
            <ul className="space-y-2 text-zinc-300 text-[11px]">
              <li className="flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <div>
                  <strong className="text-white">VMware Workstation Pro</strong> (версии 17+ или
                  25H2) — дистрибутив размещен в облачной папке стенда.
                </div>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <div>
                  <strong className="text-white">Архиватор 7-Zip</strong> — для корректной
                  распаковки архива без повреждения файлов виртуальных дисков.
                </div>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <div>
                  <strong className="text-white">Архив стенда:</strong>{' '}
                  <a
                    href="https://docker.sudostudy.dev/s/jyta52m4nDy7DCp"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-300 font-bold underline hover:text-amber-200"
                  >
                    DemoExam.7z
                  </a>{' '}
                  (~15 ГБ в архиве).
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* STEP 2: IMPORT & HARDWARE SETTINGS */}
      <section className="border border-zinc-800 bg-zinc-900/60 p-6 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-zinc-800">
          <Settings className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">
            Шаг 2. Импорт и настройка виртуальной машины в VMware Workstation
          </h2>
        </div>

        <div className="space-y-3 text-zinc-300 leading-relaxed">
          <p>
            1. Распакуйте скачанный архив{' '}
            <code className="text-white font-bold bg-zinc-950 px-1 border border-zinc-800">
              DemoExam.7z
            </code>{' '}
            с помощью 7-Zip в отдельную постоянную папку на быстром SSD (например,{' '}
            <code className="text-zinc-200">D:\VMs\DemoExam\</code>).
          </p>
          <p>
            2. Запустите VMware Workstation и нажмите кнопку{' '}
            <strong className="text-white">«Open a Virtual Machine»</strong> (или через верхнее меню{' '}
            <em>File → Open</em>).
          </p>
          <p>
            3. Перейдите в распакованную папку и выберите файл виртуальной машины{' '}
            <code className="text-amber-300 font-bold bg-zinc-950 px-1.5 py-0.5 border border-zinc-800">
              DemoExam.vmx
            </code>
            .
          </p>
        </div>

        {/* Hardware checklist */}
        <div className="border border-zinc-800 bg-zinc-950 p-4 space-y-3">
          <div className="text-white font-bold text-xs flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-400" />
            <span>Параметры оборудования (Edit virtual machine settings):</span>
          </div>

          <div className="space-y-2 text-zinc-300 text-[11px]">
            <div className="bg-zinc-900/80 border border-zinc-800 p-2.5 flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
              <div>
                <strong className="text-white">Memory (Оперативная память):</strong> выделите 16 ГБ
                (или максимум доступного объема, но не менее 12 ГБ).
              </div>
            </div>

            <div className="bg-zinc-900/80 border border-zinc-800 p-2.5 flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
              <div>
                <strong className="text-white">Processors (Процессоры):</strong> выделите 4–6 ядер.
              </div>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/30 p-2.5 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
              <div className="text-amber-200">
                <strong className="text-amber-300 uppercase">Критически важный параметр:</strong>{' '}
                обязательно включите флаг{' '}
                <strong className="text-white underline">
                  ☑ Virtualize Intel VT-x/EPT or AMD-V/RVI
                </strong>
                . Без включенной вложенной виртуализации гипервизор Proxmox внутри машины не сможет
                запустить вложенные операционные системы!
              </div>
            </div>

            <div className="bg-zinc-900/80 border border-zinc-800 p-2.5 flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
              <div>
                <strong className="text-white">Network Adapter (Сетевой адаптер):</strong>{' '}
                установите в режим <strong className="text-white">NAT</strong>, чтобы Proxmox
                получал доступ в Интернет и IP-адрес через встроенный DHCP-сервер VMware.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STEP 3: LAUNCH & MANDATORY IP RECONFIGURATION */}
      <section className="border border-zinc-800 bg-zinc-900/60 p-6 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-zinc-800">
          <Network className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">
            Шаг 3. Первый запуск Proxmox VE и обязательная смена IP-адреса
          </h2>
        </div>

        <p className="text-zinc-300 leading-relaxed">
          Нажмите <strong className="text-emerald-400">«Power on this virtual machine»</strong> и
          дождитесь окончания загрузки Linux.
        </p>

        {/* Mandatory IP Change Warning */}
        <div className="border border-red-500/40 bg-red-500/10 p-3.5 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-red-200">
            <div className="font-bold text-xs uppercase tracking-wide text-red-300">
              Внимание: обязательная смена IP-адреса стенда!
            </div>
            <p className="text-xs leading-relaxed text-red-200/90">
              Поскольку вы разворачиваете стенд на новом ПК, IP-адрес из образа автора не совпадает
              с вашей локальной подсетью VMware NAT. Вам необходимо <strong>ОБЯЗАТЕЛЬНО</strong>{' '}
              получить новый IP-адрес через DHCP и зафиксировать его в файле конфигурации сети,
              чтобы в дальнейшем не запрашивать IP заново при каждой перезагрузке.
            </p>
          </div>
        </div>

        {/* Commands walkthrough */}
        <div className="space-y-3 pt-2">
          {/* Substep 3.1: Console login */}
          <div className="border border-zinc-800 bg-zinc-950 p-3.5 space-y-2">
            <div className="text-white font-bold text-xs">3.1. Вход в консоль Proxmox VE:</div>
            <p className="text-zinc-400">
              Кликните внутри окна виртуальной машины и авторизуйтесь под суперпользователем:
            </p>
            <div className="flex flex-wrap gap-3">
              <div className="bg-zinc-900 border border-zinc-800 px-2.5 py-1 flex items-center gap-2">
                <span className="text-zinc-400">Логин:</span>
                <code className="text-white font-bold">root</code>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 px-2.5 py-1 flex items-center gap-2">
                <span className="text-zinc-400">Пароль:</span>
                <code className="text-white font-bold">toor</code>
              </div>
            </div>
          </div>

          {/* Substep 3.2: DHCP request */}
          <div className="border border-zinc-800 bg-zinc-950 p-3.5 space-y-2">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="text-white font-bold text-xs">
                3.2. Получение нового IP-адреса через DHCP:
              </div>
              <CopyButton text="dhclient" />
            </div>
            <p className="text-zinc-400">
              Запрашиваем актуальный IP-адрес из вашей локальной подсети VMware:
            </p>
            <div className="bg-zinc-900 px-3 py-1.5 border border-zinc-800 text-emerald-300 font-mono text-xs">
              dhclient
            </div>
          </div>

          {/* Substep 3.3: View acquired IP */}
          <div className="border border-zinc-800 bg-zinc-950 p-3.5 space-y-2">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="text-white font-bold text-xs">
                3.3. Просмотр полученного IP-адреса:
              </div>
              <CopyButton text="ip -c --br a show vmbr0" />
            </div>
            <p className="text-zinc-400">
              Смотрим, какой IP-адрес был выдан сетевому мосту{' '}
              <code className="text-zinc-200">vmbr0</code>:
            </p>
            <div className="bg-zinc-900 px-3 py-1.5 border border-zinc-800 text-emerald-300 font-mono text-xs">
              ip -c --br a show vmbr0
            </div>
            <p className="text-zinc-500 text-[11px]">
              Запомните этот IP-адрес (например,{' '}
              <code className="text-zinc-300">192.168.237.133</code> или похожий из вашей подсети).
            </p>
          </div>

          {/* Substep 3.4: Fix IP in config */}
          <div className="border border-zinc-800 bg-zinc-950 p-3.5 space-y-2">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="text-white font-bold text-xs">
                3.4. Закрепление IP-адреса в конфигурационном файле:
              </div>
              <CopyButton text="nano /etc/network/interfaces" />
            </div>
            <p className="text-zinc-400">
              Открываем файл сетевых настроек Proxmox, чтобы в дальнейшем адрес не слетал и не
              приходилось вводить dhclient по новой:
            </p>
            <div className="bg-zinc-900 px-3 py-1.5 border border-zinc-800 text-emerald-300 font-mono text-xs">
              nano /etc/network/interfaces
            </div>
            <p className="text-zinc-300 text-[11px] leading-relaxed">
              В блоке <code className="text-amber-300">iface vmbr0 inet static</code> меняем
              значение <code className="text-white">address</code> на ваш свежеполученный IP-адрес,
              а параметр <code className="text-white">gateway</code> — на шлюз вашей подсети (как
              правило, с оканчивающимся на .2, например{' '}
              <code className="text-zinc-300">192.168.x.2</code>).
            </p>
            <div className="text-zinc-500 text-[11px]">
              Для сохранения в nano: нажмите{' '}
              <kbd className="px-1 bg-zinc-800 border border-zinc-700 text-white rounded">
                Ctrl+O
              </kbd>
              , затем{' '}
              <kbd className="px-1 bg-zinc-800 border border-zinc-700 text-white rounded">
                Enter
              </kbd>
              , для выхода —{' '}
              <kbd className="px-1 bg-zinc-800 border border-zinc-700 text-white rounded">
                Ctrl+X
              </kbd>
              .
            </div>
          </div>

          {/* Substep 3.5: Restart network */}
          <div className="border border-zinc-800 bg-zinc-950 p-3.5 space-y-2">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="text-white font-bold text-xs">
                3.5. Перезапуск сетевой службы и контрольная проверка:
              </div>
              <CopyButton text="systemctl restart networking.service && ip a show vmbr0" />
            </div>
            <p className="text-zinc-400">
              Перезапускаем сеть и убеждаемся, что закрепленный адрес корректно отображается:
            </p>
            <div className="bg-zinc-900 px-3 py-2 border border-zinc-800 text-emerald-300 font-mono text-xs space-y-1">
              <div>systemctl restart networking.service</div>
              <div>ip a show vmbr0</div>
            </div>
            <p className="text-zinc-300 text-[11px]">
              После успешного перезапуска сетевой службы можно переходить к подключению через
              веб-интерфейс!
            </p>
          </div>
        </div>
      </section>

      {/* STEP 4: WEB INTERFACE LOGIN */}
      <section className="border border-zinc-800 bg-zinc-900/60 p-6 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-zinc-800">
          <Monitor className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">
            Шаг 4. Вход в веб-интерфейс Proxmox VE
          </h2>
        </div>

        <div className="space-y-3 text-zinc-300 leading-relaxed">
          <p>
            1. Откройте любой веб-браузер на вашем основном компьютере (Chrome, Firefox,
            Яндекс.Браузер).
          </p>
          <p>
            2. Введите в адресную строку URL с портом <strong className="text-white">:8006</strong>:
          </p>
          <div className="bg-zinc-950 px-3.5 py-2 border border-zinc-800 font-mono text-xs text-amber-300 font-bold inline-block">
            https://&lt;ВАШ_НОВЫЙ_IP&gt;:8006/
          </div>
          <p className="text-zinc-400 text-[11px]">
            Браузер выдаст предупреждение о самоподписанном SSL-сертификате — нажмите{' '}
            <strong className="text-white">«Дополнительно»</strong> (или «Подробнее») и выберите{' '}
            <strong className="text-white">«Перейти на сайт...»</strong>.
          </p>
          <p>3. В окне авторизации Proxmox введите учетные данные:</p>
          <div className="flex flex-wrap gap-4 text-xs pt-1">
            <div className="bg-zinc-900 border border-zinc-800 px-3 py-2 flex items-center gap-2">
              <span className="text-zinc-400">User name:</span>
              <code className="text-white font-bold">root</code>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 px-3 py-2 flex items-center gap-2">
              <span className="text-zinc-400">Password:</span>
              <code className="text-white font-bold">toor</code>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 px-3 py-2 flex items-center gap-2">
              <span className="text-zinc-400">Realm:</span>
              <code className="text-zinc-300">Linux PAM standard authentication</code>
            </div>
          </div>
        </div>
      </section>

      {/* STEP 5: VERIFICATION */}
      <section className="border border-zinc-800 bg-zinc-900/60 p-6 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-zinc-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">
            Шаг 5. Проверка доступности внешнего Интернета
          </h2>
        </div>

        <p className="text-zinc-300 leading-relaxed">
          Чтобы убедиться, что гипервизор Proxmox имеет полноценный доступ в сеть для скачивания
          пакетов и обновлений, открываем консоль ноды (
          <strong className="text-white">pve → Shell</strong>) и выполняем диагностическую команду:
        </p>

        <div className="border border-zinc-800 bg-zinc-950 p-4 space-y-3">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="text-white font-bold text-xs">Проверочная команда:</span>
            <CopyButton text="ping -c 4 ya.ru" />
          </div>
          <div className="bg-zinc-900 px-3 py-2 border border-zinc-800 text-emerald-300 font-mono text-xs">
            ping -c 4 ya.ru
          </div>

          <div className="bg-emerald-950/30 border border-emerald-500/30 p-3 space-y-1.5">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Что должны увидеть в выводе консоли:</span>
            </div>
            <div className="bg-zinc-950 border border-zinc-800 p-2 text-emerald-300 font-mono text-xs font-bold">
              4 packets transmitted, 4 received, 0% packet loss
            </div>
            <p className="text-zinc-300 text-[11px] leading-relaxed">
              Успешное прохождение 4 пакетов без потерь подтверждает, что маршрутизация,
              DNS-резолвинг и сетевой мост гипервизора работают корректно. Стенд готов к выполнению
              экзаменационных заданий!
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
