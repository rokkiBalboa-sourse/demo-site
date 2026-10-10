import React from 'react';
import {
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Terminal,
  Shield,
  Network,
  Clock,
  Server,
  Globe,
} from 'lucide-react';
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
            Видео-разбор задания
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
        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition-colors shrink-0"
      >
        <span>Смотреть видео-разбор</span>
        <ExternalLink className="w-3.5 h-3.5" />
      </a>
    </div>
  );
}

// ==========================================
// TASK 1: FQDN & Addressing
// ==========================================
export function Task1Assignment() {
  return (
    <div className="bg-zinc-950 p-5 border border-zinc-800 space-y-4 font-mono text-xs text-zinc-300 leading-relaxed">
      <div className="space-y-2">
        <div className="text-white font-bold uppercase tracking-wider text-[11px]">
          Имена устройств:
        </div>
        <p className="text-zinc-300">
          Настроить FQDN (полное доменное имя) для всех узлов сети согласно топологии в зоне{' '}
          <code className="text-amber-300 font-bold bg-zinc-900 px-1.5 py-0.5 border border-zinc-800">
            .au-team.irpo
          </code>
          :
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
          {[
            'isp.au-team.irpo',
            'hq-rtr.au-team.irpo',
            'hq-srv.au-team.irpo',
            'hq-cli.au-team.irpo',
            'br-rtr.au-team.irpo',
            'br-srv.au-team.irpo',
          ].map(fqdn => (
            <div
              key={fqdn}
              className="bg-zinc-900 border border-zinc-800 px-2.5 py-1 text-zinc-200 font-mono text-[11px] flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
              <span>{fqdn}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-1 pt-2 border-t border-zinc-800/80">
        <div className="text-white font-bold uppercase tracking-wider text-[11px]">
          Адресация IPv4:
        </div>
        <p className="text-zinc-300">
          Использовать исключительно приватные диапазоны{' '}
          <a
            href="https://datatracker.ietf.org/doc/html/rfc1918"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white underline hover:text-zinc-200 inline-flex items-center gap-1 font-bold"
          >
            <span>RFC 1918</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          .
        </p>
      </div>

      <div className="space-y-2 pt-2 border-t border-zinc-800/80">
        <div className="text-white font-bold uppercase tracking-wider text-[11px]">
          Расчет емкости подсетей:
        </div>
        <ul className="space-y-1.5 text-zinc-300">
          <li className="flex items-start gap-2">
            <span className="text-zinc-500">•</span>
            <span>
              <strong className="text-white">VLAN 100 (HQ-SRV):</strong> не более 32 адресов → маска{' '}
              <code className="text-zinc-100 bg-zinc-900 px-1 border border-zinc-800 font-bold">
                /27
              </code>{' '}
              (32 адреса, 30 хостов).
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-zinc-500">•</span>
            <span>
              <strong className="text-white">VLAN 200 (HQ-CLI):</strong> не менее 16 адресов → маска{' '}
              <code className="text-zinc-100 bg-zinc-900 px-1 border border-zinc-800 font-bold">
                /24
              </code>{' '}
              (256 адресов) или{' '}
              <code className="text-zinc-100 bg-zinc-900 px-1 border border-zinc-800 font-bold">
                /28
              </code>{' '}
              (16 адресов).
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-zinc-500">•</span>
            <span>
              <strong className="text-white">VLAN 999 (Управление):</strong> не более 8 адресов →
              маска{' '}
              <code className="text-zinc-100 bg-zinc-900 px-1 border border-zinc-800 font-bold">
                /29
              </code>{' '}
              (8 адресов, 6 хостов).
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-zinc-500">•</span>
            <span>
              <strong className="text-white">Сеть BR-SRV:</strong> не более 16 адресов → маска{' '}
              <code className="text-zinc-100 bg-zinc-900 px-1 border border-zinc-800 font-bold">
                /28
              </code>{' '}
              (16 адресов, 14 хостов).
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-zinc-500">•</span>
            <span>
              <strong className="text-white">Линки ISP:</strong> сеть{' '}
              <code className="text-zinc-100 bg-zinc-900 px-1 border border-zinc-800 font-bold">
                172.16.1.0/28
              </code>{' '}
              (HQ-RTR) и{' '}
              <code className="text-zinc-100 bg-zinc-900 px-1 border border-zinc-800 font-bold">
                172.16.2.0/28
              </code>{' '}
              (BR-RTR).
            </span>
          </li>
        </ul>
      </div>

      <div className="pt-2 border-t border-zinc-800/80 text-zinc-400">
        <strong className="text-zinc-200">Таблица адресации: </strong>
        <span>Сведения об адресах занести в итоговый отчет.</span>
      </div>
    </div>
  );
}

// ==========================================
// TASK 4: Proxmox VLAN Switching
// ==========================================
export function Task4Assignment() {
  return (
    <div className="bg-zinc-950 p-5 border border-zinc-800 space-y-5 font-mono text-xs text-zinc-300 leading-relaxed">
      <div className="space-y-1.5">
        <div className="text-white font-bold uppercase tracking-wider text-[11px]">
          Описание задачи:
        </div>
        <p className="text-zinc-300">
          В данном задании настраивается изоляция сетевого трафика главного офиса (HQ) на уровне
          гипервизора Proxmox VE. Задача — изолировать трафик сервера (VLAN 100) и клиентской машины
          (VLAN 200), а также обеспечить маршрутизацию между ними через единственный сетевой адаптер
          маршрутизатора HQ-RTR (Router-on-a-Stick).
        </p>
      </div>

      <div className="space-y-3 pt-2 border-t border-zinc-800/80">
        <div className="text-white font-bold uppercase tracking-wider text-[11px]">
          1. Как это работает: Access vs Trunk в Proxmox VE
        </div>
        <p className="text-zinc-400">
          В Proxmox VE виртуальные машины подключаются к виртуальным коммутаторам — мостам Linux
          Bridge (vmbr0, vmbr1 и т.д.):
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          <div className="bg-zinc-900/70 border border-zinc-800 p-3.5 space-y-1.5">
            <div className="text-white font-bold flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-sky-400 rounded-full" />
              <span>Режим Access (HQ-SRV и HQ-CLI)</span>
            </div>
            <p className="text-zinc-300 leading-relaxed">
              Номер VLAN указывается прямо в настройках адаптера виртуальной машины. Гипервизор
              автоматически навешивает 802.1Q тег на исходящие пакеты и снимает на входящих. Внутри
              ALT Linux интерфейс (enp7s1) остаётся нетегированным.
            </p>
          </div>

          <div className="bg-zinc-900/70 border border-zinc-800 p-3.5 space-y-1.5">
            <div className="text-white font-bold flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
              <span>Режим Trunk (Маршрутизатор HQ-RTR)</span>
            </div>
            <p className="text-zinc-300 leading-relaxed">
              Поле «Тег VLAN» оставляется <strong className="text-white">пустым</strong>. Гипервизор
              передаёт все кадры (VLAN 100, 200, 999) внутрь ОС роутера как есть, где их разбирают
              саб-интерфейсы vlan100, vlan200, vlan999.
            </p>
          </div>
        </div>
      </div>

      {/* Switching Table */}
      <div className="space-y-2 pt-2 border-t border-zinc-800/80">
        <div className="text-white font-bold uppercase tracking-wider text-[11px] flex items-center justify-between">
          <span>Сведения о коммутации (для внесения в отчёт):</span>
          <span className="text-[10px] text-zinc-500 font-normal">Шаг 2 спецификации</span>
        </div>
        <div className="overflow-x-auto border border-zinc-800">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-900 text-zinc-300 border-b border-zinc-800 text-[11px]">
                <th className="p-2.5 font-bold">Виртуальная машина</th>
                <th className="p-2.5 font-bold">Интерфейс в ОС</th>
                <th className="p-2.5 font-bold">Адаптер Proxmox</th>
                <th className="p-2.5 font-bold">Режим порта</th>
                <th className="p-2.5 font-bold">VLAN (VID)</th>
                <th className="p-2.5 font-bold">Назначение сегмента</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80 text-[11px]">
              <tr className="hover:bg-zinc-900/40">
                <td className="p-2.5 font-bold text-white">HQ-SRV</td>
                <td className="p-2.5 font-mono text-zinc-300">enp7s1</td>
                <td className="p-2.5 font-mono text-amber-300">net0</td>
                <td className="p-2.5">
                  <span className="px-1.5 py-0.5 bg-sky-950 text-sky-300 border border-sky-800 font-bold">
                    Access
                  </span>
                </td>
                <td className="p-2.5 font-mono font-bold text-emerald-400">100</td>
                <td className="p-2.5 text-zinc-300">Серверный сегмент HQ</td>
              </tr>
              <tr className="hover:bg-zinc-900/40">
                <td className="p-2.5 font-bold text-white">HQ-CLI</td>
                <td className="p-2.5 font-mono text-zinc-300">enp7s1</td>
                <td className="p-2.5 font-mono text-amber-300">net0</td>
                <td className="p-2.5">
                  <span className="px-1.5 py-0.5 bg-sky-950 text-sky-300 border border-sky-800 font-bold">
                    Access
                  </span>
                </td>
                <td className="p-2.5 font-mono font-bold text-emerald-400">200</td>
                <td className="p-2.5 text-zinc-300">Клиентский сегмент HQ</td>
              </tr>
              <tr className="hover:bg-zinc-900/40">
                <td className="p-2.5 font-bold text-white">HQ-RTR</td>
                <td className="p-2.5 font-mono text-zinc-300">enp7s2</td>
                <td className="p-2.5 font-mono text-amber-300">net1</td>
                <td className="p-2.5">
                  <span className="px-1.5 py-0.5 bg-amber-950 text-amber-300 border border-amber-800 font-bold">
                    Trunk (802.1Q)
                  </span>
                </td>
                <td className="p-2.5 font-mono font-bold text-amber-300">100, 200, 999</td>
                <td className="p-2.5 text-zinc-300">Агрегированный линк Router-on-a-Stick</td>
              </tr>
              <tr className="hover:bg-zinc-900/40">
                <td className="p-2.5 font-bold text-zinc-400">Управление</td>
                <td className="p-2.5 font-mono text-zinc-500">—</td>
                <td className="p-2.5 font-mono text-zinc-500">—</td>
                <td className="p-2.5">
                  <span className="px-1.5 py-0.5 bg-sky-950 text-sky-300 border border-sky-800 font-bold">
                    Access
                  </span>
                </td>
                <td className="p-2.5 font-mono font-bold text-emerald-400">999</td>
                <td className="p-2.5 text-zinc-300">Сегмент управления (Management)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* GUI Steps checklist */}
      <div className="space-y-2 pt-2 border-t border-zinc-800/80">
        <div className="text-white font-bold uppercase tracking-wider text-[11px]">
          Порядок настройки в Proxmox VE:
        </div>
        <div className="space-y-2 text-zinc-300">
          <div className="bg-zinc-900/50 p-2.5 border border-zinc-800 flex items-start gap-2">
            <span className="text-sky-400 font-bold">1.1.</span>
            <div>
              <strong className="text-white">HQ-SRV:</strong> Вкладка «Оборудование» → дважды клик
              по «Сетевое устройство (net0)» → Тег VLAN:{' '}
              <code className="text-white bg-zinc-950 px-1 border border-zinc-800 font-bold">
                100
              </code>{' '}
              → ОК.
            </div>
          </div>
          <div className="bg-zinc-900/50 p-2.5 border border-zinc-800 flex items-start gap-2">
            <span className="text-sky-400 font-bold">1.2.</span>
            <div>
              <strong className="text-white">HQ-CLI:</strong> Вкладка «Оборудование» → дважды клик
              по «Сетевое устройство (net0)» → Тег VLAN:{' '}
              <code className="text-white bg-zinc-950 px-1 border border-zinc-800 font-bold">
                200
              </code>{' '}
              → ОК.
            </div>
          </div>
          <div className="bg-zinc-900/50 p-2.5 border border-zinc-800 flex items-start gap-2">
            <span className="text-amber-400 font-bold">1.3.</span>
            <div>
              <strong className="text-white">HQ-RTR:</strong> Вкладка «Оборудование» → «Сетевое
              устройство (net1)» (порт enp7s2) → Тег VLAN{' '}
              <strong className="text-rose-400">ОСТАВИТЬ ПУСТЫМ</strong> (режим Trunk) → ОК.
            </div>
          </div>
        </div>
      </div>

      <div className="border border-amber-500/30 bg-amber-500/10 p-3 space-y-1">
        <div className="text-amber-300 font-bold text-[11px] flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Почему на HQ-RTR поле VLAN оставляется пустым?</span>
        </div>
        <p className="text-zinc-300 text-xs">
          Если указать тег, Proxmox отфильтрует остальные сети. Пустое поле превращает виртуальный
          порт в Trunk: гипервизор пропускает фреймы всех тегов (100, 200, 999) внутрь виртуальной
          машины, где ими управляет подсистема etcnet.
        </p>
      </div>
    </div>
  );
}

// ==========================================
// TASK 5: SSH Hardening
// ==========================================
export function Task5Assignment() {
  return (
    <div className="bg-zinc-950 p-5 border border-zinc-800 space-y-5 font-mono text-xs text-zinc-300 leading-relaxed">
      <div className="space-y-1.5">
        <div className="text-white font-bold uppercase tracking-wider text-[11px]">
          Описание задачи:
        </div>
        <p className="text-zinc-300">
          В данном задании настраивается защита службы удалённого администрирования OpenSSH на
          серверах <strong className="text-white">HQ-SRV</strong> и{' '}
          <strong className="text-white">BR-SRV</strong>.
        </p>
      </div>

      <div className="space-y-3 pt-2 border-t border-zinc-800/80">
        <div className="text-white font-bold uppercase tracking-wider text-[11px]">
          1. Теоретическая справка: безопасность OpenSSH в ALT Linux
        </div>

        <div className="border border-amber-500/30 bg-amber-500/10 p-3 space-y-1">
          <div className="text-amber-300 font-bold text-[11px] flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Особенность ALT Linux:</span>
          </div>
          <p className="text-zinc-300 text-xs">
            Конфигурационные файлы демона SSH расположены в каталоге{' '}
            <code className="text-white bg-zinc-950 px-1 border border-zinc-800 font-bold">
              /etc/openssh/
            </code>{' '}
            (файл{' '}
            <code className="text-white bg-zinc-950 px-1 border border-zinc-800 font-bold">
              /etc/openssh/sshd_config
            </code>
            ), в отличие от Debian/Ubuntu, где используется{' '}
            <code className="text-zinc-400">/etc/ssh/</code>.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          <div className="bg-zinc-900/70 border border-zinc-800 p-3.5 space-y-1.5">
            <div className="text-white font-bold flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
              <span>Port 2026</span>
            </div>
            <p className="text-zinc-300 leading-relaxed">
              Смена стандартного порта (по умолчанию 22) на нестандартный. Защищает сервис от
              фонового сканирования ботами в сети.
            </p>
          </div>

          <div className="bg-zinc-900/70 border border-zinc-800 p-3.5 space-y-1.5">
            <div className="text-white font-bold flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
              <span>AllowUsers sshuser</span>
            </div>
            <p className="text-zinc-300 leading-relaxed">
              Строгий белый список пользователей. Доступ разрешён только пользователю{' '}
              <code className="text-white font-bold">sshuser</code>. Попытка входа под root или
              другими отклоняется до проверки пароля.
            </p>
          </div>

          <div className="bg-zinc-900/70 border border-zinc-800 p-3.5 space-y-1.5">
            <div className="text-white font-bold flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
              <span>MaxAuthTries 2</span>
            </div>
            <p className="text-zinc-300 leading-relaxed">
              Максимум 2 попытки ввода пароля подряд. Если пароль неверный 2 раза, SSH-сервер
              принудительно разрывает соединение (защита от брутфорса).
            </p>
          </div>

          <div className="bg-zinc-900/70 border border-zinc-800 p-3.5 space-y-1.5">
            <div className="text-white font-bold flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
              <span>Banner /etc/openssh/ssh_banner</span>
            </div>
            <p className="text-zinc-300 leading-relaxed">
              Текстовый файл с предупреждением{' '}
              <strong className="text-white">&quot;Authorized access only&quot;</strong>,
              отображаемый клиенту до ввода пароля.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2 pt-2 border-t border-zinc-800/80">
        <div className="text-white font-bold uppercase tracking-wider text-[11px]">
          Критерии верификации и негативные проверки:
        </div>
        <div className="space-y-1.5 text-zinc-300">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              <strong className="text-white">Вход по порту 2026:</strong> команда{' '}
              <code className="text-white bg-zinc-900 px-1 border border-zinc-800">
                ssh -p 2026 sshuser@192.168.100.2
              </code>{' '}
              отображает баннер и принимает пароль{' '}
              <code className="text-white font-bold">P@ssw0rd</code>.
            </span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>
              <strong className="text-white">Негативный тест 1 (порт 22):</strong>{' '}
              <code className="text-zinc-300 bg-zinc-900 px-1 border border-zinc-800">
                ssh sshuser@192.168.100.2
              </code>{' '}
              → ошибка <em>Connection refused</em>.
            </span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>
              <strong className="text-white">Негативный тест 2 (root):</strong>{' '}
              <code className="text-zinc-300 bg-zinc-900 px-1 border border-zinc-800">
                ssh -p 2026 root@192.168.100.2
              </code>{' '}
              → отказ <em>Permission denied</em>.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// TASK 6: GRE Tunnel
// ==========================================
export function Task6Assignment() {
  return (
    <div className="bg-zinc-950 p-5 border border-zinc-800 space-y-5 font-mono text-xs text-zinc-300 leading-relaxed">
      <div className="space-y-1.5">
        <div className="text-white font-bold uppercase tracking-wider text-[11px]">
          Описание задачи:
        </div>
        <p className="text-zinc-300">
          В данном задании настраивается виртуальный защищённый канал связи типа «точка-точка»
          (Point-to-Point) между маршрутизаторами центрального офиса (
          <strong className="text-white">HQ-RTR</strong>) и филиала (
          <strong className="text-white">BR-RTR</strong>) через публичную сеть провайдера (ISP).
        </p>
      </div>

      <div className="space-y-3 pt-2 border-t border-zinc-800/80">
        <div className="text-white font-bold uppercase tracking-wider text-[11px]">
          1. Теоретическая справка: протокол GRE и адресация
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          <div className="bg-zinc-900/70 border border-zinc-800 p-3.5 space-y-1.5">
            <div className="text-white font-bold flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
              <span>Что такое GRE?</span>
            </div>
            <p className="text-zinc-300 leading-relaxed">
              GRE (Generic Routing Encapsulation) — протокол туннелирования, инкапсулирующий сетевые
              пакеты внутрь IP (протокол 47). Мы выбираем GRE, потому что он{' '}
              <strong className="text-white">поддерживает передачу Multicast-трафика</strong>, что
              является обязательным требованием для OSPF в Задании №7.
            </p>
          </div>

          <div className="bg-zinc-900/70 border border-zinc-800 p-3.5 space-y-1.5">
            <div className="text-white font-bold flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
              <span>Расчёт адресации туннеля (/30)</span>
            </div>
            <ul className="text-zinc-300 space-y-1">
              <li>
                • Подсеть: <code className="text-white font-bold">10.10.10.0/30</code>
              </li>
              <li>
                • Первый хост (HQ-RTR): <code className="text-amber-300 font-bold">10.10.10.1</code>
              </li>
              <li>
                • Второй хост (BR-RTR): <code className="text-sky-300 font-bold">10.10.10.2</code>
              </li>
              <li>
                • Broadcast: <code className="text-zinc-400">10.10.10.3</code>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="space-y-2 pt-2 border-t border-zinc-800/80">
        <div className="text-white font-bold uppercase tracking-wider text-[11px]">
          2. Параметры etcnet (/etc/net/ifaces/gre1/options):
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-zinc-300">
          <div className="bg-zinc-900/50 p-2.5 border border-zinc-800">
            <strong className="text-white">HQ-RTR (Центральный офис):</strong>
            <ul className="mt-1 space-y-0.5 text-zinc-400 font-mono text-[11px]">
              <li>TYPE=iptun</li>
              <li>TUNTYPE=gre</li>
              <li>
                TUNLOCAL=<span className="text-amber-300 font-bold">172.16.1.2</span>
              </li>
              <li>
                TUNREMOTE=<span className="text-sky-300 font-bold">172.16.2.2</span>
              </li>
              <li>TUNTTL=64</li>
            </ul>
          </div>
          <div className="bg-zinc-900/50 p-2.5 border border-zinc-800">
            <strong className="text-white">BR-RTR (Филиал):</strong>
            <ul className="mt-1 space-y-0.5 text-zinc-400 font-mono text-[11px]">
              <li>TYPE=iptun</li>
              <li>TUNTYPE=gre</li>
              <li>
                TUNLOCAL=<span className="text-sky-300 font-bold">172.16.2.2</span>
              </li>
              <li>
                TUNREMOTE=<span className="text-amber-300 font-bold">172.16.1.2</span>
              </li>
              <li>TUNTTL=64</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// TASK 7: OSPF in FRR
// ==========================================
export function Task7Assignment({ task }: TaskProps) {
  return (
    <div className="bg-zinc-950 p-5 border border-zinc-800 space-y-5 font-mono text-xs text-zinc-300 leading-relaxed">
      {task.video_url && <VideoBanner url={task.video_url} />}

      <div className="space-y-1.5">
        <div className="text-white font-bold uppercase tracking-wider text-[11px]">
          Описание задачи:
        </div>
        <p className="text-zinc-300">
          В данном задании настраивается автоматический обмен маршрутами между офисами HQ и BR с
          использованием протокола OSPF (Open Shortest Path First) на базе пакета FRRouting (FRR).
        </p>
      </div>

      <div className="space-y-3 pt-2 border-t border-zinc-800/80">
        <div className="text-white font-bold uppercase tracking-wider text-[11px]">
          1. Теоретическая справка: архитектура FRR и требования задания
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          <div className="bg-zinc-900/70 border border-zinc-800 p-3.5 space-y-1.5">
            <div className="text-white font-bold flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
              <span>Файл /etc/frr/daemons</span>
            </div>
            <p className="text-zinc-300 leading-relaxed">
              FRR модульный: по умолчанию запущен только zebra. Для работы OSPF необходимо включить
              демон <code className="text-white font-bold">ospfd=yes</code> в файле{' '}
              <code className="text-zinc-300">/etc/frr/daemons</code>.
            </p>
          </div>

          <div className="bg-zinc-900/70 border border-zinc-800 p-3.5 space-y-1.5">
            <div className="text-white font-bold flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
              <span>Пассивные интерфейсы (Безопасность)</span>
            </div>
            <p className="text-zinc-300 leading-relaxed">
              <code className="text-white font-bold">passive-interface default</code> переводит все
              порты в пассивный режим (нет OSPF Hello). Команда{' '}
              <code className="text-emerald-300 font-bold">no ip ospf passive</code> на gre1 явно
              разрешает OSPF только через туннель.
            </p>
          </div>

          <div className="bg-zinc-900/70 border border-zinc-800 p-3.5 space-y-1.5">
            <div className="text-white font-bold flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
              <span>Анонс сетей: ip ospf area 0</span>
            </div>
            <p className="text-zinc-300 leading-relaxed">
              Чтобы маршрутизатор рассказал удалённому офису о существовании своих локальных сетей
              (VLAN 100, 200, 999 в HQ и enp7s2 в филиале), эти интерфейсы включаются в зону{' '}
              <code className="text-white font-bold">area 0</code>.
            </p>
          </div>

          <div className="bg-zinc-900/70 border border-zinc-800 p-3.5 space-y-1.5">
            <div className="text-white font-bold flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
              <span>Аутентификация паролем</span>
            </div>
            <p className="text-zinc-300 leading-relaxed">
              <code className="text-white font-bold">ip ospf authentication</code> и{' '}
              <code className="text-amber-300 font-bold">ip ospf authentication-key P@ssw0rd</code>{' '}
              задают общий секретный ключ на интерфейсе gre1.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// TASK 8: Branch NAT (nftables)
// ==========================================
export function Task8Assignment({ task }: TaskProps) {
  return (
    <div className="bg-zinc-950 p-5 border border-zinc-800 space-y-5 font-mono text-xs text-zinc-300 leading-relaxed">
      {task.video_url && <VideoBanner url={task.video_url} />}

      <div className="space-y-1.5">
        <div className="text-white font-bold uppercase tracking-wider text-[11px]">
          Описание задачи:
        </div>
        <p className="text-zinc-300">
          В данном задании настраивается механизм динамической трансляции сетевых адресов (Source
          NAT / Masquerade) на пограничных маршрутизаторах{' '}
          <strong className="text-white">HQ-RTR</strong> и{' '}
          <strong className="text-white">BR-RTR</strong>. Благодаря этому все внутренние устройства
          главного офиса и филиала получают доступ к глобальной сети Интернет через провайдера ISP.
        </p>
      </div>

      <div className="space-y-3 pt-2 border-t border-zinc-800/80">
        <div className="text-white font-bold uppercase tracking-wider text-[11px]">
          1. Схема двухуровневой трансляции NAT
        </div>

        <div className="bg-zinc-900/80 border border-zinc-800 p-3.5 space-y-2">
          <div className="font-mono text-xs text-zinc-200 flex items-center gap-2 flex-wrap">
            <span className="bg-zinc-950 px-2 py-0.5 border border-zinc-700 font-bold text-amber-300">
              [HQ-SRV: 192.168.100.2]
            </span>
            <span className="text-zinc-500">→</span>
            <span className="bg-zinc-950 px-2 py-0.5 border border-zinc-700 font-bold text-sky-300">
              [HQ-RTR: NAT enp7s1 172.16.1.2]
            </span>
            <span className="text-zinc-500">→</span>
            <span className="bg-zinc-950 px-2 py-0.5 border border-zinc-700 font-bold text-emerald-300">
              [ISP: Masquerade]
            </span>
            <span className="text-zinc-500">→</span>
            <span className="text-white font-bold">[ИНТЕРНЕТ: ya.ru]</span>
          </div>
          <p className="text-zinc-400 text-xs leading-relaxed">
            Провайдер ISP знает только о стыковочных сетях 172.16.1.0/28 и 172.16.2.0/28.
            Маршрутизаторы офисов подменяют приватные адреса внутренних сетей на свои внешние IP.
            Трафик через gre1 под правило не подпадает, оставаясь прозрачным!
          </p>
        </div>

        <div className="bg-zinc-900/70 border border-zinc-800 p-3.5 space-y-1.5">
          <div className="text-white font-bold flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
            <span>Разбор правила /etc/nftables/nftables.nft</span>
          </div>
          <p className="text-zinc-300 leading-relaxed">
            • <code className="text-white font-bold">oifname &quot;enp7s1&quot;</code> — отслеживает
            только пакеты, уходящие через адаптер enp7s1 в сторону ISP.
            <br />• <code className="text-emerald-300 font-bold">masquerade</code> — подменяет
            приватный адрес клиента на IP-адрес порта enp7s1.
          </p>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// TASK 9: DHCP Server (dnsmasq)
// ==========================================
export function Task9Assignment({ task }: TaskProps) {
  return (
    <div className="bg-zinc-950 p-5 border border-zinc-800 space-y-5 font-mono text-xs text-zinc-300 leading-relaxed">
      {task.video_url && <VideoBanner url={task.video_url} />}

      <div className="space-y-1.5">
        <div className="text-white font-bold uppercase tracking-wider text-[11px]">
          Описание задачи:
        </div>
        <p className="text-zinc-300">
          В данном задании настраивается автоматическая выдача сетевых настроек для клиентских
          рабочих станций главного офиса (HQ-CLI в сегменте VLAN 200) с помощью легковесного сервиса{' '}
          <strong className="text-white">dnsmasq</strong> на маршрутизаторе{' '}
          <strong className="text-white">HQ-RTR</strong>.
        </p>
      </div>

      <div className="space-y-3 pt-2 border-t border-zinc-800/80">
        <div className="text-white font-bold uppercase tracking-wider text-[11px]">
          1. Теоретическая справка: особенности dnsmasq в ALT Linux
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          <div className="bg-zinc-900/70 border border-zinc-800 p-3.5 space-y-1.5">
            <div className="text-white font-bold flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
              <span>Почему port=0?</span>
            </div>
            <p className="text-zinc-300 leading-relaxed">
              dnsmasq умеет работать как DNS-кэш и как DHCP-сервер. За корпоративный DNS отвечает
              BIND на HQ-SRV. Директива <code className="text-white font-bold">port=0</code>{' '}
              полностью отключает DNS, оставляя исключительно службу DHCP.
            </p>
          </div>

          <div className="bg-zinc-900/70 border border-zinc-800 p-3.5 space-y-1.5">
            <div className="text-white font-bold flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
              <span>Зачем AUTO_LOCAL_RESOLVER=no?</span>
            </div>
            <p className="text-zinc-300 leading-relaxed">
              В ALT Linux dnsmasq по умолчанию пытается прописать в{' '}
              <code className="text-zinc-300">/etc/resolv.conf</code> адрес 127.0.0.1. Параметр{' '}
              <code className="text-white font-bold">AUTO_LOCAL_RESOLVER=no</code> в{' '}
              <code className="text-zinc-300">/etc/sysconfig/dnsmasq</code> запрещает это
              вмешательство.
            </p>
          </div>

          <div className="bg-zinc-900/70 border border-zinc-800 p-3.5 space-y-1.5">
            <div className="text-white font-bold flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
              <span>Опция 3: Default Gateway</span>
            </div>
            <p className="text-zinc-300 leading-relaxed">
              <code className="text-white font-bold">dhcp-option=3,192.168.200.1</code> передаёт
              клиентам адрес шлюза по умолчанию HQ-RTR.
            </p>
          </div>

          <div className="bg-zinc-900/70 border border-zinc-800 p-3.5 space-y-1.5">
            <div className="text-white font-bold flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
              <span>Опция 6: DNS Server</span>
            </div>
            <p className="text-zinc-300 leading-relaxed">
              <code className="text-white font-bold">dhcp-option=6,192.168.100.2</code> передаёт
              клиентам адрес корпоративного DNS-сервера HQ-SRV.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// TASK 10: DNS BIND 9
// ==========================================
export function Task10Assignment({ task }: TaskProps) {
  return (
    <div className="bg-zinc-950 p-5 border border-zinc-800 space-y-5 font-mono text-xs text-zinc-300 leading-relaxed">
      {task.video_url && <VideoBanner url={task.video_url} />}

      <div className="space-y-1.5">
        <div className="text-white font-bold uppercase tracking-wider text-[11px]">
          Описание задачи:
        </div>
        <p className="text-zinc-300">
          В данном задании на сервере главного офиса (<strong className="text-white">HQ-SRV</strong>
          ) развёртывается корпоративный DNS-сервер{' '}
          <strong className="text-white">BIND 9 (named)</strong>. Он обеспечивает прямую зону{' '}
          <code className="text-amber-300">.au-team.irpo</code>, обратную зону{' '}
          <code className="text-sky-300">168.192.in-addr.arpa</code> и перенаправляет внешние
          запросы в Интернет через серверы пересылки (Forwarders).
        </p>
      </div>

      <div className="border border-rose-500/40 bg-rose-500/10 p-3.5 space-y-1.5">
        <div className="text-rose-300 font-bold text-xs flex items-center gap-1.5">
          <AlertTriangle className="w-4 h-4 text-rose-400" />
          <span>КРИТИЧЕСКОЕ ПРЕДУПРЕЖДЕНИЕ: Порядок действий и сохранение Интернета</span>
        </div>
        <p className="text-zinc-300 text-xs leading-relaxed">
          <strong className="text-white">Не меняйте DNS до установки пакетов!</strong> Если
          переключить DNS в resolv.conf на 127.0.0.1 до того, как установлены пакеты и запущен BIND,
          сервер полностью потеряет доступ к репозиториям ALT Linux. Сначала выполняем{' '}
          <code className="text-white bg-zinc-900 px-1 border border-zinc-800 font-bold">
            apt-get update &amp;&amp; apt-get install bind bind-utils nano -y
          </code>
          , и только затем переключаем resolv.conf!
        </p>
      </div>

      <div className="space-y-3 pt-2 border-t border-zinc-800/80">
        <div className="text-white font-bold uppercase tracking-wider text-[11px]">
          2. Теоретическая справка: структура BIND в ALT Linux
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          <div className="bg-zinc-900/70 border border-zinc-800 p-3.5 space-y-1.5">
            <div className="text-white font-bold flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
              <span>Прямая и обратная зоны</span>
            </div>
            <p className="text-zinc-300 leading-relaxed">
              Прямая зона (<code className="text-white">zone &quot;au-team.irpo&quot;</code>)
              сопоставляет имена с IP (A-записи). Обратная зона (
              <code className="text-white">zone &quot;168.192.in-addr.arpa&quot;</code>)
              сопоставляет IP с именами (PTR-записи).
            </p>
          </div>

          <div className="bg-zinc-900/70 border border-zinc-800 p-3.5 space-y-1.5">
            <div className="text-white font-bold flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
              <span>Точки в конце имён</span>
            </div>
            <p className="text-zinc-300 leading-relaxed">
              Точка в конце имени (<code className="text-white">hq-srv.au-team.irpo.</code>)
              означает абсолютное FQDN. Без точки BIND допишет имя текущей зоны повторно!
            </p>
          </div>

          <div className="bg-zinc-900/70 border border-zinc-800 p-3.5 space-y-1.5">
            <div className="text-white font-bold flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
              <span>Forwarders и dnssec-validation no</span>
            </div>
            <p className="text-zinc-300 leading-relaxed">
              Запросы во внешний Интернет уходят на Яндекс DNS (77.88.8.7, 77.88.8.3). Опция{' '}
              <code className="text-white font-bold">dnssec-validation no</code> предотвращает
              ошибки SERVFAIL для неподписанной локальной зоны.
            </p>
          </div>

          <div className="bg-zinc-900/70 border border-zinc-800 p-3.5 space-y-1.5">
            <div className="text-white font-bold flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
              <span>Права доступа chown :named</span>
            </div>
            <p className="text-zinc-300 leading-relaxed">
              В ALT Linux демон BIND работает от непривилегированной группы{' '}
              <code className="text-white font-bold">named</code>. Права на созданные файлы зон в{' '}
              <code className="text-zinc-300">/etc/bind/zone/</code> обязательно передаются группе
              named.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// TASK 11: Timezone & System Time
// ==========================================
export function Task11Assignment({ task }: TaskProps) {
  return (
    <div className="bg-zinc-950 p-5 border border-zinc-800 space-y-5 font-mono text-xs text-zinc-300 leading-relaxed">
      {task.video_url && <VideoBanner url={task.video_url} />}

      <div className="space-y-1.5">
        <div className="text-white font-bold uppercase tracking-wider text-[11px]">
          Описание задачи:
        </div>
        <p className="text-zinc-300">
          В данном задании на всех виртуальных машинах инфраструктуры (
          <strong className="text-white">ISP, HQ-RTR, BR-RTR, HQ-SRV, BR-SRV, HQ-CLI</strong>)
          настраивается корректный единый часовой пояс{' '}
          <strong className="text-amber-300">Asia/Novosibirsk (UTC+7)</strong> и проверяется
          синхронизация системного времени.
        </p>
      </div>

      <div className="space-y-3 pt-2 border-t border-zinc-800/80">
        <div className="text-white font-bold uppercase tracking-wider text-[11px]">
          1. Теоретическая справка: как устроено время в Linux
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          <div className="bg-zinc-900/70 border border-zinc-800 p-3.5 space-y-1.5">
            <div className="text-white font-bold flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
              <span>RTC (Hardware Clock) vs System Clock</span>
            </div>
            <p className="text-zinc-300 leading-relaxed">
              Аппаратные часы (RTC) хранят время в UTC. Системные часы ядра Linux начинают отсчёт
              при загрузке на основе RTC и далее поддерживаются таймером процессора.
            </p>
          </div>

          <div className="bg-zinc-900/70 border border-zinc-800 p-3.5 space-y-1.5">
            <div className="text-white font-bold flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
              <span>База данных tzdata и /etc/localtime</span>
            </div>
            <p className="text-zinc-300 leading-relaxed">
              Правила временных зон поставляются пакетом{' '}
              <code className="text-white font-bold">tzdata</code> в каталоге{' '}
              <code className="text-zinc-300">/usr/share/zoneinfo/</code>. Символическая ссылка{' '}
              <code className="text-zinc-300">/etc/localtime</code> указывает на активную зону.
            </p>
          </div>
        </div>

        <div className="bg-zinc-900/70 border border-zinc-800 p-3.5 space-y-1.5">
          <div className="text-white font-bold flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
            <span>Параметры проверки вывода timedatectl</span>
          </div>
          <ul className="text-zinc-300 space-y-1 leading-relaxed">
            <li>
              • <strong className="text-white">Local time:</strong> местное время со смещением +07.
            </li>
            <li>
              • <strong className="text-white">Universal time:</strong> мировое время UTC (разница с
              Local ровно 7 часов).
            </li>
            <li>
              • <strong className="text-white">Time zone:</strong> Asia/Novosibirsk (+07, +0700).
            </li>
            <li>
              • <strong className="text-white">RTC in local TZ: no</strong> — аппаратные часы
              работают в стандартном UTC.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// GENERIC FALLBACK ASSIGNMENT
// ==========================================
export function GenericTaskAssignment({ task }: TaskProps) {
  return (
    <div className="bg-zinc-950 p-5 border border-zinc-800 space-y-4 font-mono text-xs text-zinc-300 leading-relaxed">
      {task.video_url && <VideoBanner url={task.video_url} />}

      <div className="space-y-1.5">
        <div className="text-white font-bold uppercase tracking-wider text-[11px]">
          Описание задачи:
        </div>
        <p className="text-zinc-300 whitespace-pre-line leading-relaxed">
          {task.assignment || task.description}
        </p>
      </div>

      {task.nodes && task.nodes.length > 0 && (
        <div className="space-y-1.5 pt-2 border-t border-zinc-800/80">
          <div className="text-white font-bold uppercase tracking-wider text-[11px]">
            Место выполнения:
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-zinc-400 text-xs">Узлы:</span>
            {task.nodes.map(node => (
              <span
                key={node}
                className="bg-zinc-900 border border-zinc-800 px-2 py-0.5 font-bold text-amber-300 text-xs"
              >
                {node}
              </span>
            ))}
          </div>
        </div>
      )}

      {task.theory && task.theory.length > 0 && (
        <div className="space-y-3 pt-2 border-t border-zinc-800/80">
          <div className="text-white font-bold uppercase tracking-wider text-[11px]">
            Теоретическая справка:
          </div>
          {task.theory.map((item, idx) => (
            <div key={idx} className="bg-zinc-900/70 border border-zinc-800 p-3.5 space-y-1.5">
              <div className="text-white font-bold flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                <span>{item.title}</span>
              </div>
              <p className="text-zinc-300 leading-relaxed whitespace-pre-line text-xs">
                {item.explanation}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ==========================================
// DISPATCHER COMPONENT
// ==========================================
export function Module1AssignmentDispatcher({ task }: TaskProps) {
  switch (task.id) {
    case 'm1-task-1':
      return <Task1Assignment />;
    case 'm1-task-4':
      return <Task4Assignment />;
    case 'm1-task-5':
      return <Task5Assignment />;
    case 'm1-task-6':
      return <Task6Assignment />;
    case 'm1-task-7':
      return <Task7Assignment task={task} />;
    case 'm1-task-8':
      return <Task8Assignment task={task} />;
    case 'm1-task-9':
      return <Task9Assignment task={task} />;
    case 'm1-task-10':
      return <Task10Assignment task={task} />;
    case 'm1-task-11':
      return <Task11Assignment task={task} />;
    default:
      return <GenericTaskAssignment task={task} />;
  }
}
