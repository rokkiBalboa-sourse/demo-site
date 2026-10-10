import React from 'react';
import { ExternalLink, CheckCircle2, AlertTriangle, Shield, Network, Clock, Server, Globe, HardDrive, Printer, Activity, Terminal, Lock, Archive, Key } from 'lucide-react';
import { Task } from '@/lib/types';

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

export function VimCheatsheet() {
  return (
    <div className="border border-sky-500/30 bg-sky-950/20 p-3 text-xs text-zinc-300 space-y-1 font-mono">
      <div className="text-sky-300 font-bold text-[11px] uppercase tracking-wider flex items-center gap-1.5">
        <span>📝</span>
        <span>Памятка по работе в текстовом редакторе Vim</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] pt-1">
        <div>• Вход в режим вставки: клавиша <kbd className="text-amber-300 bg-zinc-900 px-1 border border-zinc-700">i</kbd></div>
        <div>• Выход в командный режим: клавиша <kbd className="text-amber-300 bg-zinc-900 px-1 border border-zinc-700">Esc</kbd></div>
        <div>• Сохранить и выйти: команда <kbd className="text-emerald-300 bg-zinc-900 px-1 border border-zinc-700">:wq</kbd> + Enter</div>
      </div>
    </div>
  );
}

// ==========================================
// MODULE 3 - TASK 1: Import Users Samba DC
// ==========================================
export function Task1Module3Assignment({ task }: TaskProps) {
  const videoUrl = task.video_url || 'https://docker.sudostudy.dev/s/BTRAdw9Ewsczk7d';

  return (
    <div className="bg-zinc-950 p-5 border border-zinc-800 space-y-5 font-mono text-xs text-zinc-300 leading-relaxed">
      <VideoBanner url={videoUrl} />

      <div className="space-y-1.5">
        <div className="text-white font-bold uppercase tracking-wider text-[11px] flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span>Описание задачи:</span>
        </div>
        <p className="text-zinc-300">
          В данном задании на контроллере домена (<strong className="text-white">BR-SRV</strong>) выполняется автоматизированный импорт пользователей из файла <code className="text-amber-300 font-bold bg-zinc-900 px-1 border border-zinc-800">Users.csv</code>, находящегося на подключаемом компакт-диске <code className="text-sky-300 font-bold">Additional.iso</code>.
        </p>
        <p className="text-zinc-300">
          Скрипт формирует логины пользователей в формате <code className="text-amber-300 font-bold">фамилия.первая_буква_имени</code> в нижнем регистре (например, <code className="text-sky-300">ivanov.i</code>), задаёт пароль <code className="text-emerald-300 font-bold">P@ssw0rd1</code>, заполняет атрибуты учетных записей (имя, фамилия, должность, телефон), автоматически создаёт подразделения (OU) и перемещает пользователей в соответствующие подразделения.
        </p>
      </div>

      <div className="space-y-2 pt-2 border-t border-zinc-800/80">
        <div className="text-white font-bold uppercase tracking-wider text-[11px]">
          Узлы выполнения:
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-zinc-900/70 border border-zinc-800 p-3 space-y-1">
            <span className="font-bold text-amber-300 block">BR-SRV (Контроллер домена)</span>
            <span className="text-zinc-400 text-[11px]">Монтирование диска Additional.iso, нормализация кодировки через iconv, написание и выполнение скрипта import.sh.</span>
          </div>
          <div className="bg-zinc-900/70 border border-zinc-800 p-3 space-y-1">
            <span className="font-bold text-emerald-300 block">HQ-CLI (Рабочая станция)</span>
            <span className="text-zinc-400 text-[11px]">Проверка интерактивного входа через GUI под созданным пользователем (ivanov.i / P@ssw0rd1).</span>
          </div>
        </div>
      </div>

      <div className="space-y-2 pt-2 border-t border-zinc-800/80">
        <div className="text-white font-bold uppercase tracking-wider text-[11px]">
          Ключевые параметры импорта:
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
          <div className="bg-zinc-900/90 border border-zinc-800 p-2">
            <span className="text-zinc-500 block text-[10px]">Формат логина</span>
            <span className="font-bold text-sky-300">fam.n (lowercase)</span>
          </div>
          <div className="bg-zinc-900/90 border border-zinc-800 p-2">
            <span className="text-zinc-500 block text-[10px]">Пароль учетных записей</span>
            <span className="font-bold text-emerald-300">P@ssw0rd1</span>
          </div>
          <div className="bg-zinc-900/90 border border-zinc-800 p-2">
            <span className="text-zinc-500 block text-[10px]">Разделитель полей CSV</span>
            <span className="font-bold text-amber-300">IFS=&apos;;&apos;</span>
          </div>
          <div className="bg-zinc-900/90 border border-zinc-800 p-2">
            <span className="text-zinc-500 block text-[10px]">Каталог монтирования</span>
            <span className="font-bold text-white">/mnt/</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// MODULE 3 - TASK 2: GOST CA & HTTPS Nginx
// ==========================================
export function Task2Module3Assignment({ task }: TaskProps) {
  const videoUrl = task.video_url || 'https://docker.sudostudy.dev/s/BTRAdw9Ewsczk7d';

  return (
    <div className="bg-zinc-950 p-5 border border-zinc-800 space-y-5 font-mono text-xs text-zinc-300 leading-relaxed">
      <VideoBanner url={videoUrl} />
      <VimCheatsheet />

      <div className="space-y-1.5">
        <div className="text-white font-bold uppercase tracking-wider text-[11px] flex items-center gap-2">
          <Lock className="w-4 h-4 text-emerald-400" />
          <span>Описание задачи:</span>
        </div>
        <p className="text-zinc-300">
          В данном задании на узле <strong className="text-white">ISP</strong> настраивается Центр сертификации с использованием отечественных криптографических алгоритмов ГОСТ (<code className="text-amber-300 font-bold">openssl-gost-engine</code>).
        </p>
        <p className="text-zinc-300">
          Выпускаются сертификаты со сроком действия ровно <strong className="text-white">30 дней</strong> для доменных имён <code className="text-sky-300 font-bold">web.au-team.irpo</code> и <code className="text-sky-300 font-bold">docker.au-team.irpo</code>. Реверсивный прокси-сервер Nginx переводится на протокол HTTPS (порт 443) с ГОСТ-шифрованием. На рабочей станции <strong className="text-white">HQ-CLI</strong> устанавливается СКЗИ КриптоПро CSP, импортируется корневой сертификат и проверяется защищённый доступ без предупреждений безопасности.
        </p>
      </div>

      <div className="space-y-2 pt-2 border-t border-zinc-800/80">
        <div className="text-white font-bold uppercase tracking-wider text-[11px]">
          Матрица параметров сертификатов ГОСТ:
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
          <div className="bg-zinc-900/90 border border-zinc-800 p-2">
            <span className="text-zinc-500 block text-[10px]">Алгоритм ключей</span>
            <span className="font-bold text-emerald-300">gost2012_256</span>
          </div>
          <div className="bg-zinc-900/90 border border-zinc-800 p-2">
            <span className="text-zinc-500 block text-[10px]">Параметры CA / Серверов</span>
            <span className="font-bold text-amber-300">TCB (CA) / A (Servers)</span>
          </div>
          <div className="bg-zinc-900/90 border border-zinc-800 p-2">
            <span className="text-zinc-500 block text-[10px]">Срок действия CA</span>
            <span className="font-bold text-white">90 дней</span>
          </div>
          <div className="bg-zinc-900/90 border border-zinc-800 p-2">
            <span className="text-zinc-500 block text-[10px]">Срок действия серверов</span>
            <span className="font-bold text-amber-300">30 дней (-days 30)</span>
          </div>
          <div className="bg-zinc-900/90 border border-zinc-800 p-2">
            <span className="text-zinc-500 block text-[10px]">CN Корневого УЦ</span>
            <span className="font-bold text-sky-300 text-[10px]">ROOT-CA.AU-TEAM.IRPO</span>
          </div>
          <div className="bg-zinc-900/90 border border-zinc-800 p-2">
            <span className="text-zinc-500 block text-[10px]">Порт Nginx</span>
            <span className="font-bold text-emerald-300">443 ssl</span>
          </div>
          <div className="bg-zinc-900/90 border border-zinc-800 p-2">
            <span className="text-zinc-500 block text-[10px]">ssl_ciphers</span>
            <span className="font-bold text-sky-300 text-[10px]">GOST2012-GOST8912-GOST8912</span>
          </div>
          <div className="bg-zinc-900/90 border border-zinc-800 p-2">
            <span className="text-zinc-500 block text-[10px]">Криптопровайдер</span>
            <span className="font-bold text-white">КриптоПро CSP КС1</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// MODULE 3 - TASK 3: OpenVPN Tunnel & OSPF
// ==========================================
export function Task3Module3Assignment({ task }: TaskProps) {
  const videoUrl = task.video_url || 'https://docker.sudostudy.dev/s/BTRAdw9Ewsczk7d';

  return (
    <div className="bg-zinc-950 p-5 border border-zinc-800 space-y-5 font-mono text-xs text-zinc-300 leading-relaxed">
      <VideoBanner url={videoUrl} />
      <VimCheatsheet />

      <div className="space-y-1.5">
        <div className="text-white font-bold uppercase tracking-wider text-[11px] flex items-center gap-2">
          <Network className="w-4 h-4 text-emerald-400" />
          <span>Описание задачи:</span>
        </div>
        <p className="text-zinc-300">
          В данном задании базовый незашифрованный туннель GRE между маршрутизаторами <strong className="text-white">HQ-RTR</strong> и <strong className="text-white">BR-RTR</strong> заменяется на защищённый шифрованный туннель на базе <strong className="text-white">OpenVPN</strong> с использованием статического ключа шифрования (Static Key) и шифра <code className="text-amber-300 font-bold">AES-256-CBC</code>.
        </p>
        <p className="text-zinc-300">
          Интерфейс старого туннеля <code className="text-rose-400">gre1</code> удаляется, а в конфигурации службы динамической маршрутизации FRR (OSPF) интерфейс переключается на <code className="text-emerald-300 font-bold">tun0</code>, восстанавливая связность и обмен маршрутами между офисами.
        </p>
      </div>

      <div className="space-y-2 pt-2 border-t border-zinc-800/80">
        <div className="text-white font-bold uppercase tracking-wider text-[11px]">
          Параметры OpenVPN туннеля:
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
          <div className="bg-zinc-900/90 border border-zinc-800 p-2">
            <span className="text-zinc-500 block text-[10px]">Тип туннеля</span>
            <span className="font-bold text-sky-300">dev tun0 (L3 IP)</span>
          </div>
          <div className="bg-zinc-900/90 border border-zinc-800 p-2">
            <span className="text-zinc-500 block text-[10px]">Шифрование</span>
            <span className="font-bold text-amber-300">AES-256-CBC</span>
          </div>
          <div className="bg-zinc-900/90 border border-zinc-800 p-2">
            <span className="text-zinc-500 block text-[10px]">IP HQ-RTR (Server)</span>
            <span className="font-bold text-emerald-300">192.168.5.1</span>
          </div>
          <div className="bg-zinc-900/90 border border-zinc-800 p-2">
            <span className="text-zinc-500 block text-[10px]">IP BR-RTR (Client)</span>
            <span className="font-bold text-emerald-300">192.168.5.2</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// MODULE 3 - TASK 4: nftables Firewall
// ==========================================
export function Task4Module3Assignment({ task }: TaskProps) {
  const videoUrl = task.video_url || 'https://docker.sudostudy.dev/s/BTRAdw9Ewsczk7d';

  return (
    <div className="bg-zinc-950 p-5 border border-zinc-800 space-y-5 font-mono text-xs text-zinc-300 leading-relaxed">
      <VideoBanner url={videoUrl} />

      <div className="space-y-1.5">
        <div className="text-white font-bold uppercase tracking-wider text-[11px] flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span>Описание задачи:</span>
        </div>
        <p className="text-zinc-300">
          В данном задании на пограничных маршрутизаторах <strong className="text-white">HQ-RTR</strong> и <strong className="text-white">BR-RTR</strong> настраивается межсетевой экран на базе <strong className="text-white">nftables</strong>.
        </p>
        <p className="text-zinc-300">
          В конфигурационный файл добавляется таблица <code className="text-amber-300 font-bold">inet filter</code> с цепочкой <code className="text-amber-300 font-bold">input</code>, разрешающей прохождение сетевых протоколов (DNS, HTTP, HTTPS, NTP, ICMP, GRE, OSPF, UDP 500), доступ из внутренних доверенных офисных подсетей и установленные соединения, а весь остальной входящий IPv4-трафик со стороны внешней сети сбрасывается (<code className="text-rose-400 font-bold">ip version 4 drop</code>).
        </p>
      </div>

      <div className="space-y-2 pt-2 border-t border-zinc-800/80">
        <div className="text-white font-bold uppercase tracking-wider text-[11px]">
          Политика фильтрации цепочки filter input:
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
          <div className="bg-zinc-900/80 border border-zinc-800 p-2.5 space-y-1">
            <span className="text-emerald-400 font-bold block">✓ Разрешённые службы и протоколы:</span>
            <ul className="text-zinc-400 space-y-0.5 text-[10px]">
              <li>• UDP 53 (DNS) | TCP 80 (HTTP) | TCP 443 (HTTPS)</li>
              <li>• TCP 123 (NTP) | UDP 500 (ISAKMP/IKE)</li>
              <li>• ct state &#123;established, related&#125; accept</li>
              <li>• IP протоколы: gre (47), icmp (1), ospf (89)</li>
            </ul>
          </div>
          <div className="bg-zinc-900/80 border border-zinc-800 p-2.5 space-y-1">
            <span className="text-sky-400 font-bold block">✓ Доверенные подсети и действие по умолчанию:</span>
            <ul className="text-zinc-400 space-y-0.5 text-[10px]">
              <li>• 192.168.100.0/27 (Серверный сегмент HQ-SRV)</li>
              <li>• 192.168.200.0/28 (Клиентский сегмент HQ-CLI)</li>
              <li>• 192.168.30.0/28 (Сегмент филиала BR-SRV)</li>
              <li className="text-rose-400 font-bold pt-1">• Запрет внешнего трафика: ip version 4 drop;</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// MODULE 3 - TASK 5: Print Server CUPS
// ==========================================
export function Task5Module3Assignment({ task }: TaskProps) {
  const videoUrl = task.video_url || 'https://docker.sudostudy.dev/s/BTRAdw9Ewsczk7d';

  return (
    <div className="bg-zinc-950 p-5 border border-zinc-800 space-y-5 font-mono text-xs text-zinc-300 leading-relaxed">
      <VideoBanner url={videoUrl} />
      <VimCheatsheet />

      <div className="space-y-1.5">
        <div className="text-white font-bold uppercase tracking-wider text-[11px] flex items-center gap-2">
          <Printer className="w-4 h-4 text-emerald-400" />
          <span>Описание задачи:</span>
        </div>
        <p className="text-zinc-300">
          В данном задании на сервере центрального офиса (<strong className="text-white">HQ-SRV</strong>) настраивается служба печати <strong className="text-white">CUPS</strong> и модуль виртуального PDF-принтера <strong className="text-white">cups-pdf</strong>.
        </p>
        <p className="text-zinc-300">
          В конфигурационном файле разрешается удалённый доступ к принтерам и администрированию, после чего на клиентской машине <strong className="text-white">HQ-CLI</strong> через графическую панель параметров печати выполняется поиск и подключение опубликованного сетевого принтера.
        </p>
      </div>

      <div className="space-y-2 pt-2 border-t border-zinc-800/80">
        <div className="text-white font-bold uppercase tracking-wider text-[11px]">
          Ключевые директивы /etc/cups/cupsd.conf:
        </div>
        <div className="bg-zinc-900/90 border border-zinc-800 p-3 space-y-1.5 text-[11px]">
          <div><code className="text-emerald-300 font-bold">Listen 192.168.1.10:631</code> — привязка демона к сетевому IP-адресу сервера</div>
          <div><code className="text-sky-300 font-bold">&lt;Location /&gt; Allow all &lt;/Location&gt;</code> — общий доступ клиентов к очередям печати</div>
          <div><code className="text-amber-300 font-bold">&lt;Location /admin&gt; Allow all &lt;/Location&gt;</code> — доступ к веб-консоли администрирования</div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// MODULE 3 - TASK 6: Centralized rsyslog
// ==========================================
export function Task6Module3Assignment({ task }: TaskProps) {
  const videoUrl = task.video_url || 'https://docker.sudostudy.dev/s/BTRAdw9Ewsczk7d';

  return (
    <div className="bg-zinc-950 p-5 border border-zinc-800 space-y-5 font-mono text-xs text-zinc-300 leading-relaxed">
      <VideoBanner url={videoUrl} />
      <VimCheatsheet />

      <div className="space-y-1.5">
        <div className="text-white font-bold uppercase tracking-wider text-[11px] flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span>Описание задачи:</span>
        </div>
        <p className="text-zinc-300">
          В данном задании на сервере главного офиса (<strong className="text-white">HQ-SRV</strong>) настраивается централизованный приём системных журналов с помощью <strong className="text-white">rsyslog</strong>.
        </p>
        <p className="text-zinc-300">
          На клиентских узлах (<strong className="text-white">HQ-RTR, BR-RTR, BR-SRV</strong>) включается пересылка событий из <code className="text-sky-300 font-bold">systemd-journald</code> в rsyslog с фильтром важности не ниже warning (<code className="text-amber-300 font-bold">*.warn @192.168.1.10</code>). Приходящие логи на сервере автоматически сохраняются в поддиректории <code className="text-emerald-300 font-bold">/opt/%HOSTNAME%/</code>. Сам сервер изолирован от записи собственных логов в эти каталоги. Для архивации журналов настраивается <strong className="text-white">logrotate</strong> с еженедельным запуском через cron.
        </p>
      </div>

      <div className="space-y-2 pt-2 border-t border-zinc-800/80">
        <div className="text-white font-bold uppercase tracking-wider text-[11px]">
          Схема логирования и ротации:
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
          <div className="bg-zinc-900/80 border border-zinc-800 p-2.5 space-y-1">
            <span className="text-amber-400 font-bold block">Клиенты (HQ-RTR, BR-RTR, BR-SRV):</span>
            <span className="text-zinc-400 block text-[10px]">ForwardToSyslog=yes, MaxLevelSyslog=warning, *.warn @192.168.1.10</span>
          </div>
          <div className="bg-zinc-900/80 border border-zinc-800 p-2.5 space-y-1">
            <span className="text-emerald-400 font-bold block">Сервер сбора и ротации (HQ-SRV):</span>
            <span className="text-zinc-400 block text-[10px]">Шаблон /opt/%HOSTNAME%/%PROGRAMNAME%.log, отключен imuxsock, logrotate weekly minsize 10M</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// MODULE 3 - TASK 7: Monitoring Prometheus & Grafana
// ==========================================
export function Task7Module3Assignment({ task }: TaskProps) {
  const videoUrl = task.video_url || 'https://docker.sudostudy.dev/s/BTRAdw9Ewsczk7d';

  return (
    <div className="bg-zinc-950 p-5 border border-zinc-800 space-y-5 font-mono text-xs text-zinc-300 leading-relaxed">
      <VideoBanner url={videoUrl} />
      <VimCheatsheet />

      <div className="space-y-1.5">
        <div className="text-white font-bold uppercase tracking-wider text-[11px] flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          <span>Описание задачи:</span>
        </div>
        <p className="text-zinc-300">
          В данном задании на сервере главного офиса (<strong className="text-white">HQ-SRV</strong>) развёртывается стек мониторинга на базе <strong className="text-white">Prometheus</strong>, агентов <strong className="text-white">Node Exporter</strong> и системы визуализации <strong className="text-white">Grafana</strong>.
        </p>
        <p className="text-zinc-300">
          На контроллере домена (<strong className="text-white">BR-SRV</strong>) создаётся DNS-запись CNAME <code className="text-amber-300 font-bold">mon</code> для перенаправления на <code className="text-sky-300 font-bold">hq-srv.au-team.irpo</code>. На сервере HQ-SRV настраивается сбор метрик с серверов HQ-SRV (порт 9100) и BR-SRV (порт 9100), в Grafana подключается источник данных Prometheus, импортируется дашборд <code className="text-emerald-300 font-bold">1860</code>, а пароль администратора меняется на <code className="text-emerald-300 font-bold">P@ssw0rd</code>.
        </p>
      </div>

      <div className="space-y-2 pt-2 border-t border-zinc-800/80">
        <div className="text-white font-bold uppercase tracking-wider text-[11px]">
          Сетевые порты и URL сервисов:
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
          <div className="bg-zinc-900/90 border border-zinc-800 p-2">
            <span className="text-zinc-500 block text-[10px]">Веб-консоль Grafana</span>
            <span className="font-bold text-emerald-300">порт 3000</span>
          </div>
          <div className="bg-zinc-900/90 border border-zinc-800 p-2">
            <span className="text-zinc-500 block text-[10px]">Сервер Prometheus</span>
            <span className="font-bold text-sky-300">порт 9090</span>
          </div>
          <div className="bg-zinc-900/90 border border-zinc-800 p-2">
            <span className="text-zinc-500 block text-[10px]">Агент Node Exporter</span>
            <span className="font-bold text-amber-300">порт 9100</span>
          </div>
          <div className="bg-zinc-900/90 border border-zinc-800 p-2">
            <span className="text-zinc-500 block text-[10px]">Дашборд ID</span>
            <span className="font-bold text-white">1860</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// MODULE 3 - TASK 8: Ansible Inventory BR-SRV
// ==========================================
export function Task8Module3Assignment({ task }: TaskProps) {
  const videoUrl = task.video_url || 'https://docker.sudostudy.dev/s/BTRAdw9Ewsczk7d';

  return (
    <div className="bg-zinc-950 p-5 border border-zinc-800 space-y-5 font-mono text-xs text-zinc-300 leading-relaxed">
      <VideoBanner url={videoUrl} />

      <div className="space-y-1.5">
        <div className="text-white font-bold uppercase tracking-wider text-[11px] flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span>Описание задачи:</span>
        </div>
        <p className="text-zinc-300">
          В данном задании на сервере управления <strong className="text-white">BR-SRV</strong> настраивается автоматизированная инвентаризация сетевых узлов <strong className="text-white">HQ-SRV</strong> и <strong className="text-white">HQ-CLI</strong> с помощью инструмента автоматизации <strong className="text-white">Ansible</strong>.
        </p>
        <p className="text-zinc-300">
          Плейбук <code className="text-amber-300 font-bold">get_hostname_address.yml</code> копируется с диска Additional.iso. При выполнении плейбук опрашивает целевые машины через сбор фактов <code className="text-sky-300 font-bold">gather_facts: true</code> и сохраняет отчёты в формате <code className="text-emerald-300 font-bold">.yml</code> в каталог <code className="text-white bg-zinc-900 px-1 border border-zinc-800">/etc/ansible/PC-INFO/</code> с именами компьютеров, фиксируя имя хоста (Hostname) и его сетевой IP-адрес (IP_Address).
        </p>
      </div>

      <div className="space-y-2 pt-2 border-t border-zinc-800/80">
        <div className="text-white font-bold uppercase tracking-wider text-[11px]">
          Структура сформированных отчетов:
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
          <div className="bg-zinc-900/90 border border-zinc-800 p-2.5">
            <span className="text-amber-300 block font-bold">/etc/ansible/PC-INFO/hq-srv.yml</span>
            <code className="text-zinc-400 block text-[10px] pt-1">Hostname: hq-srv<br />IP_Address: 192.168.1.10</code>
          </div>
          <div className="bg-zinc-900/90 border border-zinc-800 p-2.5">
            <span className="text-sky-300 block font-bold">/etc/ansible/PC-INFO/hq-cli.yml</span>
            <code className="text-zinc-400 block text-[10px] pt-1">Hostname: hq-cli<br />IP_Address: 192.168.2.10</code>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// MODULE 3 - TASK 9: Fail2ban SSH HQ-SRV
// ==========================================
export function Task9Module3Assignment({ task }: TaskProps) {
  const videoUrl = task.video_url || 'https://docker.sudostudy.dev/s/BTRAdw9Ewsczk7d';

  return (
    <div className="bg-zinc-950 p-5 border border-zinc-800 space-y-5 font-mono text-xs text-zinc-300 leading-relaxed">
      <VideoBanner url={videoUrl} />

      <div className="space-y-1.5">
        <div className="text-white font-bold uppercase tracking-wider text-[11px] flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span>Описание задачи:</span>
        </div>
        <p className="text-zinc-300">
          В данном задании на сервере главного офиса (<strong className="text-white">HQ-SRV</strong>) настраивается система предотвращения вторжений <strong className="text-white">Fail2ban</strong> для защиты службы OpenSSH, работающей на нестандартном порту <code className="text-amber-300 font-bold">2026</code>.
        </p>
        <p className="text-zinc-300">
          Для считывания событий журнала используется модуль интеграции с systemd (<code className="text-sky-300 font-bold">python3-module-systemd</code>). При обнаружении 3 неудачных попыток аутентификации подряд IP-адрес клиента автоматически блокируется на 1 минуту (<code className="text-rose-400 font-bold">bantime = 1m</code>).
        </p>
      </div>

      <div className="space-y-2 pt-2 border-t border-zinc-800/80">
        <div className="text-white font-bold uppercase tracking-wider text-[11px]">
          Параметры джейла /etc/fail2ban/jail.d/sshd.conf:
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
          <div className="bg-zinc-900/90 border border-zinc-800 p-2">
            <span className="text-zinc-500 block text-[10px]">Порт службы</span>
            <span className="font-bold text-amber-300">port = 2026</span>
          </div>
          <div className="bg-zinc-900/90 border border-zinc-800 p-2">
            <span className="text-zinc-500 block text-[10px]">Бэкенд логов</span>
            <span className="font-bold text-sky-300">backend = systemd</span>
          </div>
          <div className="bg-zinc-900/90 border border-zinc-800 p-2">
            <span className="text-zinc-500 block text-[10px]">Порог попыток</span>
            <span className="font-bold text-white">maxretry = 3</span>
          </div>
          <div className="bg-zinc-900/90 border border-zinc-800 p-2">
            <span className="text-zinc-500 block text-[10px]">Время бана</span>
            <span className="font-bold text-rose-400">bantime = 1m</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// MODULE 3 - TASK 10: Cyber Backup 17.4
// ==========================================
export function Task10Module3Assignment({ task }: TaskProps) {
  const videoUrl = task.video_url || 'https://docker.sudostudy.dev/s/BTRAdw9Ewsczk7d';

  return (
    <div className="bg-zinc-950 p-5 border border-zinc-800 space-y-5 font-mono text-xs text-zinc-300 leading-relaxed">
      <VideoBanner url={videoUrl} />
      <VimCheatsheet />

      <div className="space-y-1.5">
        <div className="text-white font-bold uppercase tracking-wider text-[11px] flex items-center gap-2">
          <Archive className="w-4 h-4 text-emerald-400" />
          <span>Описание задачи:</span>
        </div>
        <p className="text-zinc-300">
          В данном задании на сервере главного офиса (<strong className="text-white">HQ-SRV</strong>) развёртывается сервер управления отечественной системы резервного копирования <strong className="text-white">«Кибер Бэкап»</strong> (версия 17.4) со встроенным агентом для Linux и модулем резервного копирования СУБД MySQL/MariaDB.
        </p>
        <p className="text-zinc-300">
          На клиентской машине (<strong className="text-white">HQ-CLI</strong>) устанавливается <strong className="text-white">Узел хранения (Storage Node)</strong>. В веб-консоли создаётся организация <code className="text-sky-300 font-bold">irpo</code>, учетная запись администратора <code className="text-sky-300 font-bold">irpoadmin</code> (пароль <code className="text-emerald-300 font-bold">P@ssw0rd</code>), настраивается хранилище <code className="text-amber-300 font-bold">backup_dir</code> в каталоге <code className="text-zinc-100">/backup</code> и выполняются два плана резервного копирования: системной директории <code className="text-zinc-100">/etc</code> (<code className="text-emerald-300">etc_backup</code>) и базы данных MariaDB (<code className="text-emerald-300">webdb_backup</code>).
        </p>
      </div>

      <div className="space-y-2 pt-2 border-t border-zinc-800/80">
        <div className="text-white font-bold uppercase tracking-wider text-[11px]">
          Ключевые реквизиты и параметры «Кибер Бэкап»:
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
          <div className="bg-zinc-900/90 border border-zinc-800 p-2">
            <span className="text-zinc-500 block text-[10px]">Веб-порт консоли</span>
            <span className="font-bold text-emerald-300">9877 (HTTPS)</span>
          </div>
          <div className="bg-zinc-900/90 border border-zinc-800 p-2">
            <span className="text-zinc-500 block text-[10px]">Организация</span>
            <span className="font-bold text-sky-300">irpo</span>
          </div>
          <div className="bg-zinc-900/90 border border-zinc-800 p-2">
            <span className="text-zinc-500 block text-[10px]">Администратор</span>
            <span className="font-bold text-amber-300">irpoadmin / P@ssw0rd</span>
          </div>
          <div className="bg-zinc-900/90 border border-zinc-800 p-2">
            <span className="text-zinc-500 block text-[10px]">Планы защиты</span>
            <span className="font-bold text-white text-[10px]">etc_backup, webdb_backup</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// DISPATCHER FOR MODULE 3
// ==========================================
export function Module3AssignmentDispatcher({ task }: TaskProps) {
  switch (task.id) {
    case 'm3-task-1':
      return <Task1Module3Assignment task={task} />;
    case 'm3-task-2':
      return <Task2Module3Assignment task={task} />;
    case 'm3-task-3':
      return <Task3Module3Assignment task={task} />;
    case 'm3-task-4':
      return <Task4Module3Assignment task={task} />;
    case 'm3-task-5':
      return <Task5Module3Assignment task={task} />;
    case 'm3-task-6':
      return <Task6Module3Assignment task={task} />;
    case 'm3-task-7':
      return <Task7Module3Assignment task={task} />;
    case 'm3-task-8':
      return <Task8Module3Assignment task={task} />;
    case 'm3-task-9':
      return <Task9Module3Assignment task={task} />;
    case 'm3-task-10':
      return <Task10Module3Assignment task={task} />;
    default:
      return null;
  }
}
