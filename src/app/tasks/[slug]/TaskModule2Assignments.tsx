import React from 'react';
import { ExternalLink, CheckCircle2, AlertTriangle, Terminal, Shield, Network, Clock, Server, Globe, HardDrive, FolderSync, Cpu, Container, Lock, Layers } from 'lucide-react';
import { Task } from '@/lib/types';
import Link from 'next/link';

interface TaskProps {
  task: Task;
}

export function VideoBanner({ url }: { url: string }) {
  return (
    <div className="border border-emerald-500/30 bg-emerald-500/10 p-3.5 flex items-start justify-between gap-3 flex-wrap">
      <div className="flex items-start gap-2.5">
        <span className="text-lg">📺</span>
        <div className="space-y-1">
          <div className="font-bold text-xs text-emerald-300 uppercase tracking-wider">
            Видео-разбор выполнения задания
          </div>
          <p className="text-zinc-300 text-xs">
            Видео-разбор выполнения задания доступен по ссылке:
          </p>
        </div>
      </div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition-colors shrink-0 font-mono"
      >
        <span>Смотреть видео-разбор</span>
        <ExternalLink className="w-3.5 h-3.5" />
      </a>
    </div>
  );
}

// ==========================================
// MODULE 2 - TASK 1: Samba AD DC & HQ-CLI
// ==========================================
export function Task1Module2Assignment({ task }: TaskProps) {
  const videoUrl = task.video_url || 'https://docker.sudostudy.dev/s/BTRAdw9Ewsczk7d';

  return (
    <div className="bg-zinc-950 p-5 border border-zinc-800 space-y-5 font-mono text-xs text-zinc-300 leading-relaxed">
      {/* Video Banner */}
      <VideoBanner url={videoUrl} />

      {/* Preliminary Note Callout: FRR Routing Update */}
      <div className="border border-amber-500/50 bg-amber-950/25 p-4 space-y-2.5">
        <div className="flex items-center gap-2 text-amber-300 font-bold uppercase text-[11px] tracking-wider">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Важное предварительное пояснение: Обновление FRR на маршрутизаторах</span>
        </div>
        <p className="text-zinc-300 text-xs leading-relaxed">
          Перед началом выполнения заданий Модуля №2 необходимо внести правки в работу стенда, а именно обновить конфигурацию динамической маршрутизации FRR на маршрутизаторах <strong className="text-white">HQ-RTR</strong> и <strong className="text-white">BR-RTR</strong>.
        </p>
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-zinc-400">Необходимы шаги с 1 по 3 из:</span>
          <Link
            href="/tasks/m1-task-7"
            className="inline-flex items-center gap-1 text-amber-300 hover:text-amber-200 underline font-bold"
          >
            <span>Модуль №1 Задание №7 (Динамическая маршрутизация FRR)</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
        <div className="bg-zinc-950/90 border border-zinc-800 p-2.5 text-[11px] text-zinc-300 space-y-1">
          <div className="text-zinc-400 text-[10px] uppercase font-bold">Команды проверки после обновления:</div>
          <code className="text-emerald-300 block">systemctl restart network && systemctl restart frr</code>
          <code className="text-zinc-400 block">vtysh -c &quot;show ip ospf neighbor&quot;</code>
        </div>
      </div>

      {/* Task Description */}
      <div className="space-y-1.5">
        <div className="text-white font-bold uppercase tracking-wider text-[11px] flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span>Описание задачи:</span>
        </div>
        <p className="text-zinc-300 leading-relaxed">
          В данном задании на сервере филиала (<strong className="text-white">BR-SRV</strong>) развёртывается первичный контроллер домена Active Directory на базе <strong className="text-white">Samba DC</strong> для доменной зоны <code className="text-amber-300 bg-zinc-900 px-1 border border-zinc-800 font-bold">au-team.irpo</code>.
        </p>
        <p className="text-zinc-300 leading-relaxed">
          Затем выполняется ввод клиентской графической станции <strong className="text-white">HQ-CLI</strong> в созданный домен, массовое создание учетных записей <code className="text-sky-300 font-bold">hquser1</code>–<code className="text-sky-300 font-bold">hquser5</code>, объединение их в доменную группу <code className="text-amber-300 font-bold">hq</code> и настройка гранулярного делегирования прав через ролевую модель <strong className="text-white">libnss-role</strong> и <code className="text-zinc-200 bg-zinc-900 px-1 border border-zinc-800 font-bold">/etc/sudoers</code> (разрешён запуск строго команд <code className="text-emerald-300">cat</code>, <code className="text-emerald-300">grep</code>, <code className="text-emerald-300">id</code>).
        </p>
      </div>

      {/* Target Nodes Grid */}
      <div className="space-y-2 pt-2 border-t border-zinc-800/80">
        <div className="text-white font-bold uppercase tracking-wider text-[11px]">
          Узлы выполнения и распределение ролей:
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-zinc-900/70 border border-zinc-800 p-3 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-300 text-xs">BR-SRV</span>
              <span className="text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 border border-zinc-700">Сервер</span>
            </div>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              Первичный контроллер домена (Samba DC, встроенный DNS, Kerberos KDC, доменные пользователи и группа hq).
            </p>
          </div>

          <div className="bg-zinc-900/70 border border-zinc-800 p-3 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sky-300 text-xs">HQ-RTR</span>
              <span className="text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 border border-zinc-700">Роутер</span>
            </div>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              Перенаправление DNS-сервера в конфигурации DHCP (dnsmasq) на новый контроллер домена BR-SRV (192.168.3.10).
            </p>
          </div>

          <div className="bg-zinc-900/70 border border-zinc-800 p-3 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-300 text-xs">HQ-CLI</span>
              <span className="text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 border border-zinc-700">Клиент</span>
            </div>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              Ввод в домен через Центр управления системой (acc), привязка ролей libnss-role (wheel) и белый список sudo.
            </p>
          </div>
        </div>
      </div>

      {/* Key Parameters Matrix */}
      <div className="space-y-2 pt-2 border-t border-zinc-800/80">
        <div className="text-white font-bold uppercase tracking-wider text-[11px]">
          Ключевые параметры домена и реквизиты:
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
          <div className="bg-zinc-900/90 border border-zinc-800 p-2">
            <span className="text-zinc-500 block text-[10px]">Realm домена</span>
            <span className="font-bold text-amber-300">AU-TEAM.IRPO</span>
          </div>
          <div className="bg-zinc-900/90 border border-zinc-800 p-2">
            <span className="text-zinc-500 block text-[10px]">NetBIOS Domain</span>
            <span className="font-bold text-amber-300">AU-TEAM</span>
          </div>
          <div className="bg-zinc-900/90 border border-zinc-800 p-2">
            <span className="text-zinc-500 block text-[10px]">Server Role</span>
            <span className="font-bold text-white">dc</span>
          </div>
          <div className="bg-zinc-900/90 border border-zinc-800 p-2">
            <span className="text-zinc-500 block text-[10px]">DNS Backend</span>
            <span className="font-bold text-white">SAMBA_INTERNAL</span>
          </div>
          <div className="bg-zinc-900/90 border border-zinc-800 p-2">
            <span className="text-zinc-500 block text-[10px]">Пароль Administrator</span>
            <span className="font-bold text-emerald-300">P@ssw0rd</span>
          </div>
          <div className="bg-zinc-900/90 border border-zinc-800 p-2">
            <span className="text-zinc-500 block text-[10px]">Доменная группа</span>
            <span className="font-bold text-sky-300">hq</span>
          </div>
          <div className="bg-zinc-900/90 border border-zinc-800 p-2">
            <span className="text-zinc-500 block text-[10px]">Пользователи</span>
            <span className="font-bold text-sky-300">hquser1 - hquser5</span>
          </div>
          <div className="bg-zinc-900/90 border border-zinc-800 p-2">
            <span className="text-zinc-500 block text-[10px]">Пароль пользователей</span>
            <span className="font-bold text-emerald-300">P@ssw0rd</span>
          </div>
        </div>
      </div>

      {/* Theory Callouts */}
      <div className="space-y-3 pt-2 border-t border-zinc-800/80">
        <div className="text-white font-bold uppercase tracking-wider text-[11px]">
          1. Теоретическая справка: компоненты и подсистемы
        </div>

        <div className="bg-zinc-900/70 border border-zinc-800 p-4 space-y-2">
          <div className="text-white font-bold flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
            <span>Что объединяет в себе Samba 4 AD DC?</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs text-zinc-300">
            <div className="bg-zinc-950 p-2.5 border border-zinc-800 space-y-1">
              <strong className="text-white block">• Сервер каталогов LDAP</strong>
              <span className="text-zinc-400 text-[11px]">Иерархическая база данных объектов (пользователи, группы, компьютеры).</span>
            </div>
            <div className="bg-zinc-950 p-2.5 border border-zinc-800 space-y-1">
              <strong className="text-white block">• Kerberos KDC</strong>
              <span className="text-zinc-400 text-[11px]">Центр выдачи билетов TGT/TGS для сквозной безопасной аутентификации.</span>
            </div>
            <div className="bg-zinc-950 p-2.5 border border-zinc-800 space-y-1">
              <strong className="text-white block">• Samba Internal DNS</strong>
              <span className="text-zinc-400 text-[11px]">Встроенный DNS-сервер для служебных записей SRV, A и CNAME.</span>
            </div>
            <div className="bg-zinc-950 p-2.5 border border-zinc-800 space-y-1">
              <strong className="text-white block">• Сетевой каталог SYSVOL</strong>
              <span className="text-zinc-400 text-[11px]">Служба хранения и репликации групповых политик GPO.</span>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900/70 border border-zinc-800 p-4 space-y-2">
          <div className="text-white font-bold flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
            <span>Ролевая модель libnss-role и roleadd в ALT Linux</span>
          </div>
          <p className="text-zinc-300 leading-relaxed text-xs">
            В дистрибутивах ALT Linux для сопоставления доменных групп Active Directory с локальными системными группами (например, привилегированной группой <code className="text-white font-bold">wheel</code>) используется механизм <code className="text-amber-300 font-bold">libnss-role</code>.
          </p>
          <div className="bg-zinc-950 p-2.5 border border-zinc-800 text-[11px] text-zinc-300 space-y-1">
            <div>Команда <code className="text-emerald-300 font-bold">roleadd hq wheel</code> сообщает системе:</div>
            <div className="text-zinc-400 italic">
              «Члены доменной группы hq при успешной аутентификации на машине автоматически наделяются правами локальной группы wheel».
            </div>
          </div>
          <p className="text-zinc-300 text-xs">
            Запись <code className="text-white font-bold">WHEEL_USERS ALL=(ALL:ALL) /bin/cat, /bin/grep, /usr/bin/id</code> в <code className="text-zinc-200">/etc/sudoers</code> жестко ограничивает выполнение команд через sudo только указанным белым списком.
          </p>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// MODULE 2 - TASK 2: RAID 0 Storage
// ==========================================
export function Task2Module2Assignment({ task }: TaskProps) {
  const videoUrl = task.video_url || 'https://docker.sudostudy.dev/s/BTRAdw9Ewsczk7d';

  return (
    <div className="bg-zinc-950 p-5 border border-zinc-800 space-y-5 font-mono text-xs text-zinc-300 leading-relaxed">
      <VideoBanner url={videoUrl} />

      <div className="space-y-1.5">
        <div className="text-white font-bold uppercase tracking-wider text-[11px] flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-emerald-400" />
          <span>Описание задачи:</span>
        </div>
        <p className="text-zinc-300">
          В данном задании на сервере центрального офиса (<strong className="text-white">HQ-SRV</strong>) на базе двух дополнительных виртуальных дисков размером по 1 Гб (<code className="text-amber-300 font-bold">/dev/sdb</code> и <code className="text-amber-300 font-bold">/dev/sdc</code>) настраивается высокопроизводительный программный дисковый массив уровня <strong className="text-white">RAID 0 (stripe)</strong>.
        </p>
        <p className="text-zinc-300">
          Массив форматируется в файловую систему <code className="text-white font-bold">ext4</code>, сохраняется в файле конфигурации <code className="text-zinc-200 bg-zinc-900 px-1 border border-zinc-800">/etc/mdadm.conf</code> и настраивается на постоянное автоматическое монтирование в точку <code className="text-emerald-300 font-bold">/raid</code> при загрузке системы через <code className="text-zinc-200 bg-zinc-900 px-1 border border-zinc-800">/etc/fstab</code>.
        </p>
      </div>

      <div className="space-y-2 pt-2 border-t border-zinc-800/80">
        <div className="text-white font-bold uppercase tracking-wider text-[11px]">
          Сравнение характеристик RAID 0:
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-zinc-900/70 border border-zinc-800 p-3 space-y-1">
            <span className="text-zinc-500 text-[10px] block">Итоговая ёмкость</span>
            <span className="text-emerald-300 font-bold text-sm">~2 Гб</span>
            <p className="text-zinc-400 text-[11px]">Суммирование объёма двух дисков (1 Гб + 1 Гб).</p>
          </div>
          <div className="bg-zinc-900/70 border border-zinc-800 p-3 space-y-1">
            <span className="text-zinc-500 text-[10px] block">Скорость ввода/вывода</span>
            <span className="text-sky-300 font-bold text-sm">x2 Скорость</span>
            <p className="text-zinc-400 text-[11px]">Параллельная запись блоков данных на оба накопителя.</p>
          </div>
          <div className="bg-zinc-900/70 border border-zinc-800 p-3 space-y-1">
            <span className="text-zinc-500 text-[10px] block">Отказоустойчивость</span>
            <span className="text-rose-400 font-bold text-sm">0% (Отсутствует)</span>
            <p className="text-zinc-400 text-[11px]">Отказ хотя бы одного диска приводит к потере всех данных.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// MODULE 2 - TASK 3: NFS Server & Client
// ==========================================
export function Task3Module2Assignment({ task }: TaskProps) {
  const videoUrl = task.video_url || 'https://docker.sudostudy.dev/s/BTRAdw9Ewsczk7d';

  return (
    <div className="bg-zinc-950 p-5 border border-zinc-800 space-y-5 font-mono text-xs text-zinc-300 leading-relaxed">
      <VideoBanner url={videoUrl} />

      <div className="space-y-1.5">
        <div className="text-white font-bold uppercase tracking-wider text-[11px] flex items-center gap-2">
          <FolderSync className="w-4 h-4 text-emerald-400" />
          <span>Описание задачи:</span>
        </div>
        <p className="text-zinc-300">
          На сервере центрального офиса (<strong className="text-white">HQ-SRV</strong>) развёртывается служба сетевой файловой системы <strong className="text-white">NFS (nfs-server)</strong>. В качестве экспортируемого ресурса используется каталог на дисковом массиве: <code className="text-emerald-300 font-bold">/raid/nfs</code>.
        </p>
        <p className="text-zinc-300">
          Доступ на чтение и запись (<code className="text-white">rw</code>) предоставляется исключительно клиентской подсети <code className="text-amber-300 font-bold">192.168.2.0/27</code>. На рабочей станции <strong className="text-white">HQ-CLI</strong> настраивается постоянное автомонтирование в <code className="text-sky-300 font-bold">/mnt/nfs</code> с опцией ядра <code className="text-white font-bold">_netdev</code>.
        </p>
      </div>
    </div>
  );
}

// ==========================================
// MODULE 2 - TASK 4: Chrony Time Server
// ==========================================
export function Task4Module2Assignment({ task }: TaskProps) {
  const videoUrl = task.video_url || 'https://docker.sudostudy.dev/s/BTRAdw9Ewsczk7d';

  return (
    <div className="bg-zinc-950 p-5 border border-zinc-800 space-y-5 font-mono text-xs text-zinc-300 leading-relaxed">
      <VideoBanner url={videoUrl} />

      <div className="space-y-1.5">
        <div className="text-white font-bold uppercase tracking-wider text-[11px] flex items-center gap-2">
          <Clock className="w-4 h-4 text-emerald-400" />
          <span>Описание задачи:</span>
        </div>
        <p className="text-zinc-300">
          На пограничном маршрутизаторе провайдера (<strong className="text-white">ISP</strong>) настраивается сервер точного сетевого времени на базе сервиса <strong className="text-white">chrony</strong>.
        </p>
        <p className="text-zinc-300">
          Маршрутизатор синхронизируется с вышестоящими серверами пула <code className="text-white">pool.ntp.org</code> и объявляет себя доверенным локальным источником 5-го стратума (<code className="text-emerald-300 font-bold">local stratum 5</code>) через подсистему <code className="text-amber-300 font-bold">control chrony server</code>. Все внутренние узлы (HQ-SRV, BR-RTR, BR-SRV, HQ-CLI) перенаправляются на синхронизацию с <code className="text-sky-300 font-bold">172.16.1.1</code>.
        </p>
      </div>
    </div>
  );
}

// ==========================================
// MODULE 2 - TASK 5: Ansible Automation
// ==========================================
export function Task5Module2Assignment({ task }: TaskProps) {
  const videoUrl = task.video_url || 'https://docker.sudostudy.dev/s/BTRAdw9Ewsczk7d';

  return (
    <div className="bg-zinc-950 p-5 border border-zinc-800 space-y-5 font-mono text-xs text-zinc-300 leading-relaxed">
      <VideoBanner url={videoUrl} />

      <div className="space-y-1.5">
        <div className="text-white font-bold uppercase tracking-wider text-[11px] flex items-center gap-2">
          <Cpu className="w-4 h-4 text-emerald-400" />
          <span>Описание задачи:</span>
        </div>
        <p className="text-zinc-300">
          На сервере филиала (<strong className="text-white">BR-SRV</strong>) развёртывается управляющий узел <strong className="text-white">Ansible</strong>. На целевых машинах (HQ-RTR, BR-RTR, HQ-CLI) предварительно включается служба OpenSSH на защищённом порту <code className="text-amber-300 font-bold">2026</code>.
        </p>
        <p className="text-zinc-300">
          С помощью утилиты <code className="text-white font-bold">sshpass</code>, отключения проверки ключей <code className="text-emerald-300 font-bold">host_key_checking = False</code> в <code className="text-zinc-200">ansible.cfg</code> и файла инвентаря <code className="text-zinc-200">/etc/ansible/hosts</code> проверяется успешная связь со всеми хостами через модуль ping (<code className="text-emerald-400 font-bold">SUCCESS =&gt; pong</code>).
        </p>
      </div>
    </div>
  );
}

// ==========================================
// MODULE 2 - TASK 6: Docker Web App
// ==========================================
export function Task6Module2Assignment({ task }: TaskProps) {
  const videoUrl = task.video_url || 'https://docker.sudostudy.dev/s/BTRAdw9Ewsczk7d';

  return (
    <div className="bg-zinc-950 p-5 border border-zinc-800 space-y-5 font-mono text-xs text-zinc-300 leading-relaxed">
      <VideoBanner url={videoUrl} />

      <div className="space-y-1.5">
        <div className="text-white font-bold uppercase tracking-wider text-[11px] flex items-center gap-2">
          <Container className="w-4 h-4 text-emerald-400" />
          <span>Описание задачи:</span>
        </div>
        <p className="text-zinc-300">
          На сервере филиала (<strong className="text-white">BR-SRV</strong>) с помощью <strong className="text-white">Docker</strong> и <strong className="text-white">Docker Compose v2</strong> развёртывается двухзвенный стек контейнеров: веб-приложение и СУБД <strong className="text-white">MariaDB</strong>.
        </p>
        <p className="text-zinc-300">
          Образы импортируются из tar-архивов с диска <code className="text-white font-bold">Additional.iso</code>. База данных сохраняется в именованный том <code className="text-emerald-300 font-bold">db_data</code>. Основной контейнер приложения публикуется на порту <code className="text-sky-300 font-bold">8080:8000</code> и строго именуется <code className="text-amber-300 font-bold">tespapp</code> (с опечаткой по регламенту).
        </p>
      </div>
    </div>
  );
}

// ==========================================
// MODULE 2 - TASK 7: Apache + MariaDB LAMP
// ==========================================
export function Task7Module2Assignment({ task }: TaskProps) {
  const videoUrl = task.video_url || 'https://docker.sudostudy.dev/s/BTRAdw9Ewsczk7d';

  return (
    <div className="bg-zinc-950 p-5 border border-zinc-800 space-y-5 font-mono text-xs text-zinc-300 leading-relaxed">
      <VideoBanner url={videoUrl} />

      <div className="space-y-1.5">
        <div className="text-white font-bold uppercase tracking-wider text-[11px] flex items-center gap-2">
          <Globe className="w-4 h-4 text-emerald-400" />
          <span>Описание задачи:</span>
        </div>
        <p className="text-zinc-300">
          На сервере центрального офиса (<strong className="text-white">HQ-SRV</strong>) развёртывается веб-стек <strong className="text-white">LAMP</strong> (метапакет <code className="text-white font-bold">lamp-server</code>: служба <code className="text-amber-300 font-bold">httpd2</code>, СУБД MariaDB, PHP).
        </p>
        <p className="text-zinc-300">
          Файлы сайта (<code className="text-zinc-200">index.php</code>, <code className="text-zinc-200">logo.png</code>) и дамп базы <code className="text-zinc-200">dump.sql</code> импортируются с подключаемого диска Additional.iso. В СУБД создаётся база данных <code className="text-sky-300 font-bold">webdb</code> и пользователь <code className="text-emerald-300 font-bold">web</code> (<code className="text-emerald-300">P@ssw0rd</code>).
        </p>
      </div>
    </div>
  );
}

// ==========================================
// MODULE 2 - TASK 8: Static DNAT (nftables)
// ==========================================
export function Task8Module2Assignment({ task }: TaskProps) {
  const videoUrl = task.video_url || 'https://docker.sudostudy.dev/s/BTRAdw9Ewsczk7d';

  return (
    <div className="bg-zinc-950 p-5 border border-zinc-800 space-y-5 font-mono text-xs text-zinc-300 leading-relaxed">
      <VideoBanner url={videoUrl} />

      <div className="space-y-1.5">
        <div className="text-white font-bold uppercase tracking-wider text-[11px] flex items-center gap-2">
          <Network className="w-4 h-4 text-emerald-400" />
          <span>Описание задачи:</span>
        </div>
        <p className="text-zinc-300">
          На пограничных маршрутизаторах <strong className="text-white">HQ-RTR</strong> и <strong className="text-white">BR-RTR</strong> настраивается статическая трансляция сетевых адресов назначения (<strong className="text-white">Destination NAT / Port Forwarding</strong>) с помощью подсистемы <strong className="text-white">nftables</strong>.
        </p>
        <p className="text-zinc-300">
          HQ-RTR пробрасывает внешний порт <code className="text-amber-300 font-bold">8080</code> на порт 80 HQ-SRV и порт <code className="text-amber-300 font-bold">2026</code> на SSH сервера. BR-RTR пробрасывает порты <code className="text-sky-300 font-bold">&#123; 8080, 2026 &#125;</code> на сервер BR-SRV. Правила фиксируются в <code className="text-zinc-200">/etc/nftables/nftables.nft</code>.
        </p>
      </div>
    </div>
  );
}

// ==========================================
// MODULE 2 - TASK 9: Nginx Reverse Proxy
// ==========================================
export function Task9Module2Assignment({ task }: TaskProps) {
  const videoUrl = task.video_url || 'https://docker.sudostudy.dev/s/BTRAdw9Ewsczk7d';

  return (
    <div className="bg-zinc-950 p-5 border border-zinc-800 space-y-5 font-mono text-xs text-zinc-300 leading-relaxed">
      <VideoBanner url={videoUrl} />

      <div className="space-y-1.5">
        <div className="text-white font-bold uppercase tracking-wider text-[11px] flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-400" />
          <span>Описание задачи:</span>
        </div>
        <p className="text-zinc-300">
          На пограничном маршрутизаторе провайдера (<strong className="text-white">ISP</strong>) развёртывается высокопроизводительный обратный прокси-сервер <strong className="text-white">Nginx</strong> на стандартном порту 80.
        </p>
        <p className="text-zinc-300">
          Запросы к <code className="text-amber-300 font-bold">web.au-team.irpo</code> перенаправляются на сервер HQ-SRV через HQ-RTR:8080 (с базовой аутентификацией), а запросы к <code className="text-sky-300 font-bold">docker.au-team.irpo</code> — на контейнер BR-SRV через BR-RTR:8080.
        </p>
      </div>
    </div>
  );
}

// ==========================================
// MODULE 2 - TASK 10: Nginx HTTP Basic Auth
// ==========================================
export function Task10Module2Assignment({ task }: TaskProps) {
  const videoUrl = task.video_url || 'https://docker.sudostudy.dev/s/BTRAdw9Ewsczk7d';

  return (
    <div className="bg-zinc-950 p-5 border border-zinc-800 space-y-5 font-mono text-xs text-zinc-300 leading-relaxed">
      <VideoBanner url={videoUrl} />

      <div className="space-y-1.5">
        <div className="text-white font-bold uppercase tracking-wider text-[11px] flex items-center gap-2">
          <Lock className="w-4 h-4 text-emerald-400" />
          <span>Описание задачи:</span>
        </div>
        <p className="text-zinc-300">
          На маршрутизаторе <strong className="text-white">ISP</strong> настраивается механизм парольной защиты <strong className="text-white">HTTP Basic Authentication (auth_basic)</strong> для сайта <code className="text-amber-300 font-bold">web.au-team.irpo</code>.
        </p>
        <p className="text-zinc-300">
          С помощью пакета <code className="text-white font-bold">apache2-htpasswd</code> создаётся файл <code className="text-zinc-200">/etc/nginx/.htpasswd</code> для пользователя <code className="text-emerald-300 font-bold">WEB</code> с паролем <code className="text-emerald-300 font-bold">P@ssw0rd</code>.
        </p>
      </div>
    </div>
  );
}

// ==========================================
// MODULE 2 - TASK 11: Yandex Browser
// ==========================================
export function Task11Module2Assignment({ task }: TaskProps) {
  const videoUrl = task.video_url || 'https://docker.sudostudy.dev/s/BTRAdw9Ewsczk7d';

  return (
    <div className="bg-zinc-950 p-5 border border-zinc-800 space-y-5 font-mono text-xs text-zinc-300 leading-relaxed">
      <VideoBanner url={videoUrl} />

      <div className="space-y-1.5">
        <div className="text-white font-bold uppercase tracking-wider text-[11px] flex items-center gap-2">
          <Globe className="w-4 h-4 text-emerald-400" />
          <span>Описание задачи:</span>
        </div>
        <p className="text-zinc-300">
          На графическую рабочую станцию центрального офиса (<strong className="text-white">HQ-CLI</strong>) устанавливается отечественный веб-обозреватель <strong className="text-white">«Яндекс Браузер»</strong> (<code className="text-emerald-300 font-bold">yandex-browser-stable</code>) из репозиториев ALT Linux.
        </p>
      </div>

      <div className="border border-sky-500/40 bg-sky-950/20 p-3.5 space-y-1.5">
        <div className="text-sky-300 font-bold uppercase text-[11px] tracking-wider">
          Требование экспертов к отчету:
        </div>
        <ul className="text-zinc-300 text-xs space-y-1">
          <li>1. Текстовый вывод команды: <code className="text-white bg-zinc-900 px-1 border border-zinc-800">rpm -qa | grep yandex-browser</code></li>
          <li>2. Скриншот окна Яндекс Браузера со страницей «О программе» или открытым сайтом <code className="text-white">http://web.au-team.irpo/</code>.</li>
        </ul>
      </div>
    </div>
  );
}

// ==========================================
// DISPATCHER FOR MODULE 2
// ==========================================
export function Module2AssignmentDispatcher({ task }: TaskProps) {
  switch (task.id) {
    case 'm2-task-1':
      return <Task1Module2Assignment task={task} />;
    case 'm2-task-2':
      return <Task2Module2Assignment task={task} />;
    case 'm2-task-3':
      return <Task3Module2Assignment task={task} />;
    case 'm2-task-4':
      return <Task4Module2Assignment task={task} />;
    case 'm2-task-5':
      return <Task5Module2Assignment task={task} />;
    case 'm2-task-6':
      return <Task6Module2Assignment task={task} />;
    case 'm2-task-7':
      return <Task7Module2Assignment task={task} />;
    case 'm2-task-8':
      return <Task8Module2Assignment task={task} />;
    case 'm2-task-9':
      return <Task9Module2Assignment task={task} />;
    case 'm2-task-10':
      return <Task10Module2Assignment task={task} />;
    case 'm2-task-11':
      return <Task11Module2Assignment task={task} />;
    default:
      return null;
  }
}
