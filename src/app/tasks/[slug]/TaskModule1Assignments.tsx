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
// GENERIC FALLBACK ASSIGNMENT WITH RICH MARKDOWN
// ==========================================

export function formatInline(text: string): React.ReactNode {
  // 1. Split code spans `...`
  const codeParts = text.split(/(`[^`]+`)/g);
  return codeParts.map((part, idx) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      const code = part.slice(1, -1);
      return (
        <code
          key={idx}
          className="text-emerald-400 bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded font-mono text-[11px] font-semibold"
        >
          {code}
        </code>
      );
    }

    // 2. Bold **...**
    const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
    return (
      <React.Fragment key={idx}>
        {boldParts.map((bPart, bIdx) => {
          if (bPart.startsWith('**') && bPart.endsWith('**')) {
            return (
              <strong key={bIdx} className="text-white font-bold">
                {bPart.slice(2, -2)}
              </strong>
            );
          }

          // 3. Links [label](url)
          const linkParts = bPart.split(/(\[[^\]]+\]\([^)]+\))/g);
          return linkParts.map((lPart, lIdx) => {
            const linkMatch = lPart.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
            if (linkMatch) {
              return (
                <a
                  key={lIdx}
                  href={linkMatch[2]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-400 underline hover:text-sky-300 inline-flex items-center gap-0.5 font-bold"
                >
                  <span>{linkMatch[1]}</span>
                  <ExternalLink className="w-3 h-3 inline" />
                </a>
              );
            }
            return lPart;
          });
        })}
      </React.Fragment>
    );
  });
}

export function MarkdownAssignmentContent({ content }: { content: string }) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    // Skip empty lines
    if (!line) {
      i++;
      continue;
    }

    // 0. Horizontal divider
    if (line === '---' || line === '***') {
      elements.push(<hr key={`hr-${i}`} className="border-zinc-800 my-4" />);
      i++;
      continue;
    }

    // 1. Code blocks: ```
    if (line.startsWith('```')) {
      const lang = line.replace(/^```/, '').trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      const code = codeLines.join('\n');
      elements.push(
        <div key={`code-${i}`} className="my-3 border border-zinc-800 bg-zinc-950 rounded overflow-hidden">
          {lang && (
            <div className="bg-zinc-900/90 px-3 py-1 text-[10px] font-mono uppercase text-zinc-400 border-b border-zinc-800">
              {lang}
            </div>
          )}
          <pre className="p-3 text-xs font-mono text-emerald-400 overflow-x-auto leading-relaxed">
            <code>{code}</code>
          </pre>
        </div>
      );
      continue;
    }

    // 2. Headings: #, ##, ###, ####
    if (line.startsWith('#')) {
      const match = line.match(/^(#{1,4})\s+(.+)$/);
      if (match) {
        const level = match[1].length;
        const text = match[2];

        elements.push(
          <div key={`h-${i}`} className="pt-3 pb-1 border-b border-zinc-800/80 flex items-center gap-2 mt-2">
            <span className={`rounded-sm shrink-0 ${level <= 2 ? 'w-2 h-2 bg-sky-400' : 'w-1.5 h-1.5 bg-emerald-400'}`} />
            <h3 className={`font-mono font-bold text-white uppercase tracking-wider ${level <= 2 ? 'text-sm' : 'text-xs'}`}>
              {formatInline(text)}
            </h3>
          </div>
        );
        i++;
        continue;
      }
    }

    // 3. Blockquotes: >
    if (line.startsWith('>')) {
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
          className={`p-3 my-2.5 border text-xs font-mono leading-relaxed rounded ${
            isWarn
              ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
              : 'bg-zinc-900/60 border-zinc-800 text-zinc-300'
          }`}
        >
          {formatInline(quoteText)}
        </div>
      );
      continue;
    }

    // 4. Tables: lines starting with |
    if (line.startsWith('|')) {
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

        // Skip separator row (tableLines[1], like |:---|:---|)
        const dataRows = tableLines.slice(2).map(rowStr =>
          rowStr
            .split('|')
            .filter((_, idx, arr) => idx > 0 && idx < arr.length - 1)
            .map(c => c.trim())
        );

        elements.push(
          <div
            key={`table-${i}`}
            className="overflow-x-auto my-3 border border-zinc-800 bg-zinc-950/80 rounded"
          >
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/90 text-zinc-200">
                  {headerRow.map((h, hIdx) => (
                    <th
                      key={hIdx}
                      className="p-2.5 font-bold border-r border-zinc-800 last:border-r-0 whitespace-nowrap text-zinc-300"
                    >
                      {formatInline(h)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/80">
                {dataRows.map((r, rIdx) => (
                  <tr key={rIdx} className="hover:bg-zinc-900/40 transition-colors">
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

    // 5. Bullet lists: • or -
    if (line.startsWith('•') || line.startsWith('-')) {
      const listItems: string[] = [];
      while (i < lines.length && (lines[i].trim().startsWith('•') || lines[i].trim().startsWith('-'))) {
        listItems.push(lines[i].trim().replace(/^[•-]\s*/, ''));
        i++;
      }

      // Check if all items look like FQDNs
      const allFqdn = listItems.every(item => item.includes('.au-team.irpo') || item.includes('.irpo'));
      if (allFqdn) {
        elements.push(
          <div key={`fqdn-${i}`} className="grid grid-cols-2 sm:grid-cols-3 gap-2 my-2.5">
            {listItems.map((fqdn, fIdx) => (
              <div
                key={fIdx}
                className="bg-zinc-900 border border-zinc-800 px-2.5 py-1.5 text-zinc-200 font-mono text-[11px] flex items-center gap-2 rounded"
              >
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full shrink-0" />
                <span className="font-bold">{fqdn.replace(/`/g, '')}</span>
              </div>
            ))}
          </div>
        );
      } else {
        elements.push(
          <ul key={`list-${i}`} className="space-y-1.5 my-2 pl-1">
            {listItems.map((item, itemIdx) => (
              <li key={itemIdx} className="flex items-start gap-2 text-zinc-300 text-xs leading-relaxed">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-1.5 shrink-0" />
                <span>{formatInline(item)}</span>
              </li>
            ))}
          </ul>
        );
      }
      continue;
    }

    // 6. Regular paragraph
    elements.push(
      <p key={`p-${i}`} className="text-zinc-300 text-xs leading-relaxed my-1.5">
        {formatInline(line)}
      </p>
    );
    i++;
  }

  return <div className="space-y-3">{elements}</div>;
}

export function GenericTaskAssignment({ task }: TaskProps) {
  return (
    <div className="bg-zinc-950 p-5 border border-zinc-800 space-y-5 font-mono text-xs text-zinc-300 leading-relaxed rounded">
      {task.video_url && <VideoBanner url={task.video_url} />}

      {/* Описание задачи */}
      <div className="space-y-2">
        <div className="text-white font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
          <span>Описание задачи:</span>
        </div>
        <div className="text-zinc-200 text-xs sm:text-[13px] leading-relaxed bg-zinc-900/60 p-4 border border-zinc-800 rounded">
          {task.description}
        </div>
      </div>

      {/* Место выполнения */}
      {task.nodes && task.nodes.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-zinc-800/80">
          <div className="text-white font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-sky-400 rounded-full" />
            <span>Место выполнения:</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-zinc-400 text-xs">Узлы стенда:</span>
            {task.nodes.map(node => (
              <span
                key={node}
                className="bg-zinc-900 border border-zinc-700/80 px-2.5 py-1 font-bold text-amber-300 text-xs rounded"
              >
                {node}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Спецификация и требования задания (Rich Markdown) */}
      {task.assignment && (
        <div className="space-y-3 pt-2 border-t border-zinc-800/80">
          <MarkdownAssignmentContent content={task.assignment} />
        </div>
      )}

      {/* Теоретическая справка */}
      {task.theory && task.theory.length > 0 && (
        <div className="space-y-3 pt-3 border-t border-zinc-800/80">
          <div className="text-white font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
            <span>Теоретическая справка:</span>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {task.theory.map((item, idx) => (
              <div key={idx} className="bg-zinc-900/70 border border-zinc-800 p-3.5 space-y-1.5 rounded">
                <div className="text-white font-bold flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                  <span>{item.title}</span>
                </div>
                <p className="text-zinc-300 leading-relaxed text-xs">
                  {item.explanation}
                </p>
                {item.details && item.details.length > 0 && (
                  <ul className="space-y-1 pt-1.5 pl-1 border-t border-zinc-800/60">
                    {item.details.map((detail, dIdx) => (
                      <li key={dIdx} className="text-zinc-400 text-[11px] flex items-start gap-1.5">
                        <span className="text-zinc-600">•</span>
                        <span>{formatInline(detail)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// TASK 1 (2027): Network & Hosts Setup
// ==========================================
export function Task1Assignment2027() {
  const vms = [
    { name: 'ISP', vid: '100', fqdn: 'isp.au-team.irpo', role: 'Интернет-провайдер' },
    { name: 'HQ-RTR', vid: '101', fqdn: 'hq-rtr.au-team.irpo', role: 'Маршрутизатор HQ' },
    { name: 'HQ-SRV', vid: '102', fqdn: 'hq-srv.au-team.irpo', role: 'Сервер главного офиса HQ' },
    { name: 'HQ-CLI', vid: '103', fqdn: 'hq-cli.au-team.irpo', role: 'Рабочая станция HQ' },
    { name: 'BR-RTR', vid: '104', fqdn: 'br-rtr.au-team.irpo', role: 'Маршрутизатор филиала BR' },
    { name: 'BR-FW', vid: '105', fqdn: 'br-fw.au-team.irpo', role: 'Межсетевой экран филиала' },
    { name: 'BR-SRV', vid: '106', fqdn: 'br-srv.au-team.irpo', role: 'Сервер филиала BR' },
  ];

  const addresses = [
    { device: 'ISP', iface: 'ens19', ip: '172.16.1.1/28', gw: '—', dns: '—', desc: 'Линк в сторону HQ-RTR' },
    { device: 'ISP', iface: 'ens20', ip: '172.16.2.1/28', gw: '—', dns: '—', desc: 'Линк в сторону BR-RTR' },
    { device: 'HQ-RTR', iface: 'ens18', ip: '172.16.1.2/28', gw: '172.16.1.1', dns: '77.88.8.8', desc: 'Внешний линк к ISP' },
    { device: 'HQ-RTR', iface: 'vlan100', ip: '192.168.100.1/27', gw: '—', dns: '—', desc: 'Сеть серверов HQ (до 32 IP)' },
    { device: 'HQ-RTR', iface: 'vlan200', ip: '192.168.200.1/24', gw: '—', dns: '—', desc: 'Сеть клиентов HQ (от 16 IP)' },
    { device: 'HQ-RTR', iface: 'vlan999', ip: '192.168.99.1/29', gw: '—', dns: '—', desc: 'Сеть управления (до 8 IP)' },
    { device: 'HQ-SRV', iface: 'ens18', ip: '192.168.100.2/27', gw: '192.168.100.1', dns: '77.88.8.8', desc: 'Сервер главного офиса HQ' },
    { device: 'BR-RTR', iface: 'ens18', ip: '172.16.2.2/28', gw: '172.16.2.1', dns: '77.88.8.8', desc: 'Внешний линк к ISP' },
    { device: 'BR-RTR', iface: 'ens19', ip: '172.16.10.1/30', gw: '—', dns: '—', desc: 'Линк к межсетевому экрану BR-FW' },
    { device: 'BR-FW', iface: 'ens18', ip: '172.16.10.2/30', gw: '172.16.10.1', dns: '77.88.8.8', desc: 'В сторону BR-RTR' },
    { device: 'BR-FW', iface: 'ens19', ip: '172.16.20.1/28', gw: '—', dns: '—', desc: 'В сторону сервера BR-SRV' },
    { device: 'BR-SRV', iface: 'ens18', ip: '172.16.20.2/28', gw: '172.16.20.1', dns: '77.88.8.8', desc: 'Сервер филиала BR' },
  ];

  return (
    <div className="bg-zinc-950 p-5 border border-zinc-800 space-y-6 font-mono text-xs text-zinc-300 leading-relaxed rounded">
      {/* 1. Описание задачи */}
      <div className="space-y-2">
        <div className="text-white font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
          <span>Описание задачи:</span>
        </div>
        <div className="text-zinc-200 text-xs sm:text-[13px] leading-relaxed bg-zinc-900/60 p-4 border border-zinc-800 rounded">
          Базовая настройка сетевой инфраструктуры демо-экзамена 2027 года: конфигурация FQDN в домене{' '}
          <code className="text-emerald-400 bg-zinc-900 border border-zinc-800 px-1 py-0.5 rounded">.au-team.irpo</code>,
          расчет и распределение приватных подсетей RFC 1918, настройка сетевых интерфейсов через подсистему{' '}
          <strong className="text-white">etcnet</strong> в ALT Linux, организация 802.1Q саб-интерфейсов VLAN на HQ-RTR
          и установка статических маршрутов по умолчанию и между филиалами.
        </div>
      </div>

      {/* 2. Место выполнения и VID узлов */}
      <div className="space-y-2 pt-2 border-t border-zinc-800/80">
        <div className="text-white font-bold uppercase tracking-wider text-[11px] flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-sky-400 rounded-full" />
            <span>Место выполнения — Виртуальные машины Proxmox VE (2027):</span>
          </div>
          <span className="text-[10px] text-zinc-500 font-normal">7 узлов стенда</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
          {vms.map(vm => (
            <div
              key={vm.vid}
              className="bg-zinc-900/80 border border-zinc-800 p-2.5 rounded hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-white text-xs">{vm.name}</span>
                <span className="px-1.5 py-0.2 bg-zinc-800 text-amber-300 border border-zinc-700 text-[10px] font-bold rounded">
                  VID {vm.vid}
                </span>
              </div>
              <div className="text-emerald-400 text-[11px] font-semibold truncate">{vm.fqdn}</div>
              <div className="text-[10px] text-zinc-400 mt-1 truncate">{vm.role}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Архитектура etcnet */}
      <div className="space-y-2.5 pt-2 border-t border-zinc-800/80">
        <div className="text-white font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
          <span>Архитектура сетевой подсистемы etcnet (/etc/net/ifaces):</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-zinc-900/60 border border-zinc-800 p-3.5 space-y-1.5 rounded">
            <div className="text-white font-bold flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
              <span>Файлы внутри папки интерфейса</span>
            </div>
            <p className="text-zinc-300 text-[11px] leading-relaxed">
              В ALT Linux каждый интерфейс настраивается отдельной папкой в <code className="text-zinc-200">/etc/net/ifaces/&lt;iface&gt;/</code>:
            </p>
            <ul className="text-[11px] text-zinc-300 space-y-1 pl-1">
              <li>• <strong className="text-white">options</strong>: <code className="text-emerald-400">TYPE=eth</code> или <code className="text-emerald-400">TYPE=vlan</code></li>
              <li>• <strong className="text-white">ipv4address</strong>: IP-адрес с префиксом маски, напр. <code className="text-emerald-400">192.168.100.1/27</code></li>
              <li>• <strong className="text-white">ipv4route</strong>: шлюз по умолчанию <code className="text-emerald-400">default via 172.16.1.1</code></li>
              <li>• <strong className="text-white">resolv.conf</strong>: DNS-серверы <code className="text-emerald-400">nameserver 77.88.8.8</code></li>
            </ul>
          </div>

          <div className="bg-zinc-900/60 border border-zinc-800 p-3.5 space-y-1.5 rounded">
            <div className="text-white font-bold flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-sky-400 rounded-full" />
              <span>Настройка 802.1Q саб-интерфейсов VLAN (HQ-RTR)</span>
            </div>
            <p className="text-zinc-300 text-[11px] leading-relaxed">
              Для создания тегированных интерфейсов <code className="text-zinc-200">vlan100</code>, <code className="text-zinc-200">vlan200</code>, <code className="text-zinc-200">vlan999</code>:
            </p>
            <div className="bg-zinc-950 p-2.5 border border-zinc-800 text-[11px] text-zinc-200 font-mono rounded space-y-0.5">
              <div>mkdir -p /etc/net/ifaces/vlan100</div>
              <div>echo -e &quot;TYPE=vlan\nHOST=ens18\nVID=100&quot; &gt; /etc/net/ifaces/vlan100/options</div>
              <div>echo &quot;192.168.100.1/27&quot; &gt; /etc/net/ifaces/vlan100/ipv4address</div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Таблица адресации */}
      <div className="space-y-2 pt-2 border-t border-zinc-800/80">
        <div className="text-white font-bold uppercase tracking-wider text-[11px] flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
            <span>Сводная таблица сетевой адресации (Таблица 2):</span>
          </div>
          <span className="text-[10px] text-zinc-500 font-normal">RFC 1918</span>
        </div>
        <div className="overflow-x-auto border border-zinc-800 rounded">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-zinc-900 text-zinc-300 border-b border-zinc-800 text-[11px]">
                <th className="p-2.5 font-bold">Устройство</th>
                <th className="p-2.5 font-bold">Интерфейс</th>
                <th className="p-2.5 font-bold">IP-адрес / Префикс</th>
                <th className="p-2.5 font-bold">Шлюз по умолч.</th>
                <th className="p-2.5 font-bold">DNS-сервер</th>
                <th className="p-2.5 font-bold">Описание / Назначение</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80 text-[11px]">
              {addresses.map((row, idx) => (
                <tr key={idx} className="hover:bg-zinc-900/40 transition-colors">
                  <td className="p-2.5 font-bold text-white whitespace-nowrap">{row.device}</td>
                  <td className="p-2.5 font-mono text-amber-300 font-semibold">{row.iface}</td>
                  <td className="p-2.5 font-mono text-emerald-400 font-semibold">{row.ip}</td>
                  <td className="p-2.5 font-mono text-zinc-300">{row.gw}</td>
                  <td className="p-2.5 font-mono text-sky-300">{row.dns}</td>
                  <td className="p-2.5 text-zinc-300">{row.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Маршрутизация и требования к связности */}
      <div className="space-y-2 pt-2 border-t border-zinc-800/80">
        <div className="text-white font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
          <span>Статические маршруты и требования к связности:</span>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 p-3 space-y-2 rounded text-[11px]">
          <p className="text-zinc-300">
            Для обеспечения корректной связности между филиалами и выхода в сеть Интернет настройте следующие маршруты:
          </p>
          <ul className="space-y-1 text-zinc-200">
            <li>• <strong className="text-white">HQ-RTR</strong>: шлюз по умолчанию <code className="text-emerald-400">default via 172.16.1.1</code> (в сторону ISP).</li>
            <li>• <strong className="text-white">BR-RTR</strong>: шлюз по умолчанию <code className="text-emerald-400">default via 172.16.2.1</code> (ISP), а также маршрут к серверному сегменту филиала <code className="text-emerald-400">172.16.20.0/28 via 172.16.10.2</code> (через BR-FW).</li>
            <li>• <strong className="text-white">BR-FW</strong>: шлюз по умолчанию <code className="text-emerald-400">default via 172.16.10.1</code> (через BR-RTR).</li>
            <li>• <strong className="text-white">BR-SRV</strong>: шлюз по умолчанию <code className="text-emerald-400">default via 172.16.20.1</code> (через BR-FW).</li>
            <li>• <strong className="text-white">HQ-SRV</strong>: шлюз по умолчанию <code className="text-emerald-400">default via 192.168.100.1</code> (через HQ-RTR).</li>
          </ul>
        </div>
      </div>
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
    case 'm1-2027-task-1':
      return <Task1Assignment2027 />;
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
