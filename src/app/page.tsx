"use client";

import { useState, Fragment } from "react";
import Image from "next/image";
import { AccordionItem } from "@/components/Accordion";
import CommandBlock from "@/components/CommandBlock";
import { Network, Terminal, ShieldAlert, Cpu, BookOpen, Layers, Download } from "lucide-react";

export default function Home() {
  const [variant, setVariant] = useState<1 | 4>(1);
  return (
    <div className="min-h-screen bg-[#07080c] text-zinc-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Main Content Area */}
      <main className="flex-grow max-w-4xl w-full mx-auto px-6 pt-16 pb-12">
        <div className="flex items-center justify-between mb-8 flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-bold text-zinc-200">Модули обучения</h2>
          </div>
          <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap">
            <div className="flex gap-4 bg-[#0d0e12]/60 p-1.5 rounded-xl border border-zinc-800/80 w-fit flex-shrink-0">
              <button
                onClick={() => setVariant(1)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200 ${
                  variant === 1
                    ? "bg-emerald-500 text-zinc-950 shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                Вариант 1
              </button>
              <button
                onClick={() => setVariant(4)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200 ${
                  variant === 4
                    ? "bg-emerald-500 text-zinc-950 shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                Вариант 4
              </button>
            </div>
            <a
              href={variant === 1 ? "/docs/Отчёт_1.docx" : "/docs/Отчёт_4.docx"}
              download
              className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all duration-200 shadow-sm cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Отчёт</span>
            </a>
          </div>
        </div>

        {/* Level 1: Main Accordion Modules */}
        <div className="space-y-4">
          
          {variant === 1 ? (
            <Fragment key="variant-1">
          {/* MODULE 1 */}
          <AccordionItem title="Модуль 1: Базовое администрирование сетей" level={1}>
            <div className="space-y-4 mt-2">
              <p className="text-sm text-zinc-400 mb-4">
                В этом модуле рассматриваются фундаментальные команды Linux для получения информации о сетевом оборудовании, интерфейсах и управления сетевыми службами в системе с помощью `systemd`.
              </p>

              {/* Level 2: Nested tasks */}
              <AccordionItem title="Задание 1. Произведите базовую настройку устройств" level={2}>
                <div className="space-y-4">
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    Для корректной идентификации устройств в локальной сети лабораторного стенда необходимо установить соответствующие имена хостов (hostname) для каждой виртуальной машины. Используйте команду <code className="text-emerald-400 font-mono text-xs bg-zinc-900/80 px-1.5 py-0.5 rounded border border-zinc-800/80">hostnamectl</code>, после чего обновите сессию терминала с помощью <code className="text-zinc-400 font-mono text-xs">exec bash</code>.
                  </p>

                  <div className="space-y-5">
                    <div className="border border-zinc-800/40 bg-zinc-900/10 p-4 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-zinc-200 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-blue-500" />
                          <span>ISP</span>
                        </span>
                      </div>
                      <CommandBlock command="hostnamectl set-hostname isp.au-team.irpo; exec bash" />
                    </div>

                    <div className="border border-zinc-800/40 bg-zinc-900/10 p-4 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-zinc-200 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span>HQ-RTR</span>
                        </span>
                      </div>
                      <CommandBlock command="hostnamectl set-hostname hq-rtr.au-team.irpo; exec bash" />
                    </div>

                    <div className="border border-zinc-800/40 bg-zinc-900/10 p-4 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-zinc-200 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span>HQ-SRV</span>
                        </span>
                      </div>
                      <CommandBlock command="hostnamectl set-hostname hq-srv.au-team.irpo; exec bash" />
                    </div>

                    <div className="border border-zinc-800/40 bg-zinc-900/10 p-4 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-zinc-200 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span>HQ-CLI</span>
                        </span>
                      </div>
                      <CommandBlock command="hostnamectl set-hostname hq-cli.au-team.irpo; exec bash" />
                    </div>

                    <div className="border border-zinc-800/40 bg-zinc-900/10 p-4 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-zinc-200 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-purple-500" />
                          <span>BR-RTR</span>
                        </span>
                      </div>
                      <CommandBlock command="hostnamectl set-hostname br-rtr.au-team.irpo; exec bash" />
                    </div>

                    <div className="border border-zinc-800/40 bg-zinc-900/10 p-4 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-zinc-200 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-purple-500" />
                          <span>BR-SRV</span>
                        </span>
                      </div>
                      <CommandBlock command="hostnamectl set-hostname br-srv.au-team.irpo; exec bash" />
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="w-full border-t border-zinc-800/80"></div>
                    </div>
                    <div className="relative flex justify-start">
                      <span className="bg-[#0f1115]/30 pr-3 text-sm font-semibold text-emerald-400 uppercase tracking-wider">
                        Настройка сетевых интерфейсов
                      </span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="border border-zinc-800/40 bg-[#0d0e12]/30 p-6 rounded-xl space-y-4">
                      <div className="flex items-center justify-between mb-4 border-b border-zinc-800/60 pb-3">
                        <span className="text-base font-bold text-zinc-100 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                          <span>ISP</span>
                        </span>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">1. Создание директорий конфигурации для enp7s2 и enp7s3:</div>
                          <CommandBlock command="mkdir -p /etc/net/ifaces/enp7s{2,3}" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">2. Указание типа интерфейса (Ethernet) для обоих адаптеров:</div>
                          <CommandBlock command="echo 'TYPE=eth' | tee /etc/net/ifaces/enp7s{2,3}/options" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">3. Назначение IP-адреса на интерфейс enp7s2 (сеть к штаб-квартире):</div>
                          <CommandBlock command="echo '172.16.10.1/28' > /etc/net/ifaces/enp7s2/ipv4address" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">4. Назначение IP-адреса на интерфейс enp7s3 (сеть к филиалу):</div>
                          <CommandBlock command="echo '172.16.20.1/28' > /etc/net/ifaces/enp7s3/ipv4address" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">5. Перезапуск сетевой службы для применения новой конфигурации:</div>
                          <CommandBlock command="systemctl restart network" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">6. Проверка состояния интерфейсов и назначенных адресов:</div>
                          <CommandBlock command="ip -c --br a" />
                        </div>
                      </div>
                    </div>

                    <div className="border border-zinc-800/40 bg-[#0d0e12]/30 p-6 rounded-xl space-y-4">
                      <div className="flex items-center justify-between mb-4 border-b border-zinc-800/60 pb-3">
                        <span className="text-base font-bold text-zinc-100 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                          <span>BR-RTR</span>
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">1. Создание директорий интерфейсов enp7s1, enp7s2 и gre1 (туннель):</div>
                          <CommandBlock command="mkdir -p /etc/net/ifaces/{enp7s{1,2},gre1}" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">2. Указание типа интерфейса (Ethernet) для enp7s1 и enp7s2:</div>
                          <CommandBlock command="echo 'TYPE=eth' | tee /etc/net/ifaces/enp7s{1,2}/options" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">3. Назначение внешнего IP-адреса на интерфейс enp7s1 (к провайдеру):</div>
                          <CommandBlock command="echo '172.16.20.2/28' > /etc/net/ifaces/enp7s1/ipv4address" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">4. Настройка шлюза по умолчанию через ISP:</div>
                          <CommandBlock command="echo 'default via 172.16.20.1' > /etc/net/ifaces/enp7s1/ipv4route" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">5. Указание DNS-сервера (Google DNS):</div>
                          <CommandBlock command="echo 'nameserver 8.8.8.8' > /etc/net/ifaces/enp7s1/resolv.conf" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">6. Назначение внутреннего IP-адреса на интерфейс enp7s2 (локальная сеть филиала):</div>
                          <CommandBlock command="echo '192.168.0.1/28' > /etc/net/ifaces/enp7s2/ipv4address" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">7. Открытие системного sysctl.conf для редактирования (включение IP forwarding):</div>
                          <CommandBlock command="vim /etc/net/sysctl.conf" />
                        </div>
                        <div className="p-4 bg-[#0d0e12]/30 border border-zinc-800/40 rounded-xl space-y-2 text-sm text-zinc-300 leading-relaxed">
                          <div className="font-semibold text-emerald-400">7.1. Включение IP forwarding в vim:</div>
                          <p>Найдите строку <code className="text-zinc-200 bg-zinc-900/60 px-1.5 py-0.5 rounded border border-zinc-800/80 font-mono text-xs">net.ipv4.ip_forward</code>.</p>
                          <p>По умолчанию там стоит значение <code className="text-red-400 font-bold">0</code>. Измените его на <code className="text-emerald-400 font-bold">1</code>.</p>
                          <p className="text-xs text-zinc-500 mt-1">Для начала редактирования нажмите клавишу <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">i</kbd> (режим Insert). Убедитесь, что активна английская раскладка клавиатуры.</p>
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">7.2. Сохранение изменений и выход из редактора vim:</div>
                          <p className="text-xs text-zinc-500 mb-1">Нажмите клавишу <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Esc</kbd>, введите команду ниже и нажмите <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Enter</kbd>:</p>
                          <CommandBlock command=":wq" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">8. Перезапуск сетевой службы для применения настроек:</div>
                          <CommandBlock command="systemctl restart network" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">9. Проверка состояния сетевых адаптеров:</div>
                          <CommandBlock command="ip -c --br a" />
                        </div>
                      </div>
                    </div>

                    <div className="border border-zinc-800/40 bg-[#0d0e12]/30 p-6 rounded-xl space-y-4">
                      <div className="flex items-center justify-between mb-4 border-b border-zinc-800/60 pb-3">
                        <span className="text-base font-bold text-zinc-100 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                          <span>BR-SRV</span>
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">1. Указание типа интерфейса (Ethernet) для enp7s1:</div>
                          <CommandBlock command="echo 'TYPE=eth' > /etc/net/ifaces/enp7s1/options" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">2. Назначение IP-адреса на интерфейс enp7s1:</div>
                          <CommandBlock command="echo '192.168.0.2/28' > /etc/net/ifaces/enp7s1/ipv4address" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">3. Настройка основного шлюза по умолчанию через BR-RTR:</div>
                          <CommandBlock command="echo 'default via 192.168.0.1' > /etc/net/ifaces/enp7s1/ipv4route" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">4. Настройка DNS-резолвера и локального домена поиска:</div>
                          <CommandBlock command={'echo $\'search au-team.irpo\\nnameserver 192.168.100.2\' > /etc/net/ifaces/enp7s1/resolv.conf'} />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">5. Перезапуск сетевой службы для применения новой схемы:</div>
                          <CommandBlock command="systemctl restart network" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">6. Проверка краткого статуса интерфейсов:</div>
                          <CommandBlock command="ip -c --br a" />
                        </div>
                      </div>
                    </div>

                    <div className="border border-zinc-800/40 bg-[#0d0e12]/30 p-6 rounded-xl space-y-4">
                      <div className="flex items-center justify-between mb-4 border-b border-zinc-800/60 pb-3">
                        <span className="text-base font-bold text-zinc-100 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                          <span>HQ-RTR</span>
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">1. Создание директорий для интерфейсов enp7s1, enp7s2, vlan111, vlan211, vlan811 и gre1:</div>
                          <CommandBlock command="mkdir -p /etc/net/ifaces/{enp7s{1,2},vlan{111,211,811},gre1}" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">2. Указание типа интерфейса (Ethernet) для физических адаптеров enp7s1 и enp7s2:</div>
                          <CommandBlock command="echo 'TYPE=eth' | tee /etc/net/ifaces/enp7s{1,2}/options" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">3. Назначение внешнего IP-адреса на enp7s1 (сеть к ISP):</div>
                          <CommandBlock command="echo '172.16.1.2/28' > /etc/net/ifaces/enp7s1/ipv4address" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">4. Настройка шлюза по умолчанию через ISP:</div>
                          <CommandBlock command="echo 'default via 172.16.1.1' > /etc/net/ifaces/enp7s1/ipv4route" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">5. Указание внешнего DNS-сервера (Google DNS):</div>
                          <CommandBlock command="echo 'nameserver 8.8.8.8' > /etc/net/ifaces/enp7s1/resolv.conf" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">6. Генерация файлов настроек для vlan111, vlan211 и vlan811 на интерфейсе enp7s2:</div>
                          <CommandBlock command={'echo $\'111\\n211\\n811\' | xargs -i bash -c \'echo -e "TYPE=vlan\\nHOST=enp7s2\\nVID={}" > /etc/net/ifaces/vlan{}/options\''} />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">7. Проверка конфигурации vlan811 для контроля корректности параметров:</div>
                          <CommandBlock command="cat /etc/net/ifaces/vlan811/options" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">8. Назначение IP-адреса для VLAN 111 (сеть серверов):</div>
                          <CommandBlock command="echo '192.168.100.1/27' > /etc/net/ifaces/vlan111/ipv4address" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">9. Назначение IP-адреса для VLAN 211 (сеть клиентов):</div>
                          <CommandBlock command="echo '192.168.200.1/24' > /etc/net/ifaces/vlan211/ipv4address" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">10. Назначение IP-адреса для VLAN 811 (сеть управления):</div>
                          <CommandBlock command="echo '192.168.99.1/29' > /etc/net/ifaces/vlan811/ipv4address" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">11. Открытие sysctl.conf для редактирования (включение IP forwarding):</div>
                          <CommandBlock command="vim /etc/net/sysctl.conf" />
                        </div>
                        <div className="p-4 bg-[#0d0e12]/30 border border-zinc-800/40 rounded-xl space-y-2 text-sm text-zinc-300 leading-relaxed">
                          <div className="font-semibold text-emerald-400">11.1. Включение IP forwarding в vim:</div>
                          <p>Найдите строку <code className="text-zinc-200 bg-zinc-900/60 px-1.5 py-0.5 rounded border border-zinc-800/80 font-mono text-xs">net.ipv4.ip_forward</code>.</p>
                          <p>По умолчанию там стоит значение <code className="text-red-400 font-bold">0</code>. Измените его на <code className="text-emerald-400 font-bold">1</code>.</p>
                          <p className="text-xs text-zinc-500 mt-1">Для начала редактирования нажмите клавишу <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">i</kbd> (режим Insert). Убедитесь, что активна английская раскладка клавиатуры.</p>
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">11.2. Сохранение изменений и выход из редактора vim:</div>
                          <p className="text-xs text-zinc-500 mb-1">Нажмите клавишу <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Esc</kbd>, введите команду ниже и нажмите <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Enter</kbd>:</p>
                          <CommandBlock command=":wq" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">12. Перезапуск сетевой службы для применения новой схемы:</div>
                          <CommandBlock command="systemctl restart network" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">13. Проверка краткого статуса всех физических и vlan-интерфейсов:</div>
                          <CommandBlock command="ip -c --br a" />
                        </div>
                      </div>
                    </div>

                    <div className="border border-zinc-800/40 bg-[#0d0e12]/30 p-6 rounded-xl space-y-4">
                      <div className="flex items-center justify-between mb-4 border-b border-zinc-800/60 pb-3">
                        <span className="text-base font-bold text-zinc-100 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                          <span>HQ-SRV</span>
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">1. Указание типа интерфейса (Ethernet) для enp7s1:</div>
                          <CommandBlock command="echo 'TYPE=eth' > /etc/net/ifaces/enp7s1/options" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">2. Назначение IP-адреса на интерфейс enp7s1:</div>
                          <CommandBlock command="echo '192.168.100.2/27' > /etc/net/ifaces/enp7s1/ipv4address" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">3. Настройка шлюза по умолчанию через HQ-RTR:</div>
                          <CommandBlock command="echo 'default via 192.168.100.1' > /etc/net/ifaces/enp7s1/ipv4route" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">4. Указание внешнего DNS-сервера (Google DNS) для выхода в интернет:</div>
                          <CommandBlock command="echo 'nameserver 8.8.8.8' > /etc/net/ifaces/enp7s1/resolv.conf" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">5. Перезапуск сетевой службы:</div>
                          <CommandBlock command="systemctl restart network" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">6. Проверка краткого статуса сетевых адаптеров:</div>
                          <CommandBlock command="ip -c --br a" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 border border-red-500/25 bg-red-500/5 rounded-xl text-red-400 mt-4">
                    <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                    <div className="text-sm font-semibold">Сведения об адресах занесите в отчёт</div>
                  </div>
                </div>
              </AccordionItem>

              <AccordionItem title="Задание 2. Настройте доступ к сети Интернет, на маршрутизаторе ISP" level={2}>
                <div className="space-y-5">
                  <div className="flex items-center gap-3 p-4 border border-red-500/20 bg-red-500/5 rounded-xl text-red-400 mb-2">
                    <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm font-semibold">Данные команды выполняются только на маршрутизаторе ISP</span>
                  </div>



                  <div className="space-y-6">
                    <div>
                      <div className="text-xs text-zinc-400 font-semibold mb-1">1. Открываем редактор vim для редактирования системных параметров:</div>
                      <CommandBlock command="vim /etc/net/sysctl.conf" />
                    </div>

                    <div className="p-4 bg-[#0d0e12]/30 border border-zinc-800/40 rounded-xl space-y-2 text-sm text-zinc-300 leading-relaxed">
                      <div className="font-semibold text-emerald-400">2. Включение IP forwarding в vim:</div>
                      <p>Найдите строку <code className="text-zinc-200 bg-zinc-900/60 px-1.5 py-0.5 rounded border border-zinc-800/80 font-mono text-xs">net.ipv4.ip_forward</code>.</p>
                      <p>По умолчанию там стоит значение <code className="text-red-400 font-bold">0</code>. Измените его на <code className="text-emerald-400 font-bold">1</code>.</p>
                      <p className="text-xs text-zinc-500 mt-1">Для начала редактирования нажмите клавишу <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">i</kbd> (режим Insert). Убедитесь, что активна английская раскладка клавиатуры.</p>
                    </div>

                    <div>
                      <div className="text-xs text-zinc-400 font-semibold mb-1">3. Сохранение изменений и выход из редактора vim:</div>
                      <p className="text-xs text-zinc-500 mb-1">Нажмите клавишу <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Esc</kbd>, введите команду ниже и нажмите <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Enter</kbd>:</p>
                      <CommandBlock command=":wq" />
                    </div>

                    <div>
                      <div className="text-xs text-zinc-400 font-semibold mb-1">4. Перезапуск сетевой службы для применения настроек forwarding:</div>
                      <CommandBlock command="systemctl restart network" />
                    </div>

                    <div>
                      <div className="text-xs text-zinc-400 font-semibold mb-1">5. Обновление пакетной базы и установка nftables и текстового редактора nano:</div>
                      <CommandBlock command="apt-get update && apt-get install nftables nano -y" />
                    </div>

                    <div>
                      <div className="text-xs text-zinc-400 font-semibold mb-1">6. Открытие файла конфигурации nftables для редактирования:</div>
                      <CommandBlock command="nano /etc/nftables/nftables.nft" />
                    </div>

                    <div className="p-4 bg-[#0d0e12]/30 border border-zinc-800/40 rounded-xl space-y-3 text-sm text-zinc-300">
                      <div className="font-semibold text-emerald-400">7. Наполнение файла правилами NAT (Masquerade):</div>
                      <p>Удалите всё содержимое файла и вставьте следующие строки:</p>
                      <CommandBlock command={`#!/usr/sbin/nft -f

flush ruleset

table ip nat {
    chain postrouting {
        type nat hook postrouting priority srcnat;
        oifname "enp7s1" masquerade
    }
}`} />
                      <p className="text-xs text-zinc-500 mt-2">После вставки сохраните файл: нажмите <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Ctrl + X</kbd>, затем <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Y</kbd> и подтвердите клавишей <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Enter</kbd>.</p>
                    </div>

                    <div>
                      <div className="text-xs text-zinc-400 font-semibold mb-1">8. Добавление nftables в автозагрузку и немедленный запуск службы:</div>
                      <CommandBlock command="systemctl enable --now nftables" />
                    </div>

                    <div>
                      <div className="text-xs text-zinc-400 font-semibold mb-1">9. Запуск службы nftables:</div>
                      <CommandBlock command="systemctl start nftables" />
                    </div>

                    <div>
                      <div className="text-xs text-zinc-400 font-semibold mb-1">10. Очистка текущих правил фаервола:</div>
                      <CommandBlock command="nft flush ruleset" />
                    </div>

                    <div>
                      <div className="text-xs text-zinc-400 font-semibold mb-1">11. Применение созданных правил NAT из конфигурационного файла:</div>
                      <CommandBlock command="nft -f /etc/nftables/nftables.nft" />
                    </div>

                    <div>
                      <div className="text-xs text-zinc-400 font-semibold mb-1">12. Просмотр активного набора правил nftables (вывод должен соответствовать содержимому файла):</div>
                      <CommandBlock command="nft list ruleset" />
                    </div>

                    <div>
                      <div className="text-xs text-zinc-400 font-semibold mb-1">13. Проверка успешного включения форвардинга пакетов:</div>
                      <CommandBlock command="sysctl net.ipv4.ip_forward" />
                    </div>

                    <div>
                      <div className="text-xs text-zinc-400 font-semibold mb-1">14. Проверка доступности внешних ресурсов интернета:</div>
                      <CommandBlock command="ping -c4 ya.ru" />
                    </div>
                  </div>
                </div>
              </AccordionItem>

              <AccordionItem title="Задание 3. Создайте локальные учетные записи" level={2}>
                <div className="space-y-4">
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    Для обеспечения безопасности и администрирования необходимо создать локальные учетные записи пользователей на узлах лабораторной работы, настроить для них пароли и права выполнения команд суперпользователя через <code className="text-emerald-400 font-mono text-xs bg-zinc-900/80 px-1.5 py-0.5 rounded border border-zinc-800/80">sudo</code>.
                  </p>

                  <div className="space-y-6">
                    {/* HQ-SRV */}
                    <div className="border border-zinc-800/40 bg-[#0d0e12]/30 p-6 rounded-xl space-y-4">
                      <div className="flex items-center justify-between mb-4 border-b border-zinc-800/60 pb-3">
                        <span className="text-base font-bold text-zinc-100 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                          <span>HQ-SRV</span>
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">1. Создание пользователя sshuser с UID 2011:</div>
                          <CommandBlock command="useradd -u 2011 sshuser" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">2. Установка пароля P@ssw0rd для созданного пользователя:</div>
                          <CommandBlock command='echo "sshuser:P@ssw0rd" | chpasswd' />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">3. Добавление пользователя sshuser в привилегированную группу wheel:</div>
                          <CommandBlock command="usermod -aG wheel sshuser" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">4. Разрешение пользователям группы wheel использовать sudo без ввода пароля:</div>
                          <CommandBlock command='echo "WHEEL_USERS ALL=(ALL:ALL) NOPASSWD: ALL" > /etc/sudoers.d/sshuser' />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">5. Вход в интерактивную сессию под именем sshuser:</div>
                          <CommandBlock command="su -l sshuser" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">6. Проверка возможности повышения прав через sudo (должен вернуться root):</div>
                          <CommandBlock command="sudo id" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">7. Выход из сессии пользователя sshuser назад в сессию root:</div>
                          <CommandBlock command="exit" />
                        </div>
                      </div>
                    </div>

                    {/* BR-SRV */}
                    <div className="border border-zinc-800/40 bg-[#0d0e12]/30 p-6 rounded-xl space-y-4">
                      <div className="flex items-center justify-between mb-4 border-b border-zinc-800/60 pb-3">
                        <span className="text-base font-bold text-zinc-100 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                          <span>BR-SRV</span>
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">1. Создание пользователя sshuser с UID 2011:</div>
                          <CommandBlock command="useradd -u 2011 sshuser" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">2. Установка пароля P@ssw0rd для созданного пользователя:</div>
                          <CommandBlock command='echo "sshuser:P@ssw0rd" | chpasswd' />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">3. Добавление пользователя sshuser в привилегированную группу wheel:</div>
                          <CommandBlock command="usermod -aG wheel sshuser" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">4. Разрешение пользователям группы wheel использовать sudo без ввода пароля:</div>
                          <CommandBlock command='echo "WHEEL_USERS ALL=(ALL:ALL) NOPASSWD: ALL" > /etc/sudoers.d/sshuser' />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">5. Вход в интерактивную сессию под именем sshuser:</div>
                          <CommandBlock command="su -l sshuser" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">6. Проверка возможности повышения прав через sudo (должен вернуться root):</div>
                          <CommandBlock command="sudo id" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">7. Выход из сессии пользователя sshuser назад в сессию root:</div>
                          <CommandBlock command="exit" />
                        </div>
                      </div>
                    </div>

                    {/* HQ-RTR */}
                    <div className="border border-zinc-800/40 bg-[#0d0e12]/30 p-6 rounded-xl space-y-4">
                      <div className="flex items-center justify-between mb-4 border-b border-zinc-800/60 pb-3">
                        <span className="text-base font-bold text-zinc-100 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                          <span>HQ-RTR</span>
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">1. Создание пользователя net_admin для управления сетью:</div>
                          <CommandBlock command="useradd net_admin" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">2. Установка пароля P@ssw0rd для созданного пользователя:</div>
                          <CommandBlock command='echo "net_admin:P@ssw0rd" | chpasswd' />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">3. Добавление пользователя net_admin в привилегированную группу wheel:</div>
                          <CommandBlock command="usermod -aG wheel net_admin" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">4. Обновление репозиториев и установка утилиты sudo:</div>
                          <CommandBlock command="apt-get update && apt-get install sudo -y" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">5. Разрешение пользователям группы wheel использовать sudo без ввода пароля:</div>
                          <CommandBlock command='echo "WHEEL_USERS ALL=(ALL:ALL) NOPASSWD: ALL" > /etc/sudoers.d/net_admin' />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">6. Вход в интерактивную сессию под именем net_admin:</div>
                          <CommandBlock command="su -l net_admin" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">7. Проверка прав суперпользователя через sudo:</div>
                          <CommandBlock command="sudo id" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">8. Выход из сессии пользователя net_admin назад в сессию root:</div>
                          <CommandBlock command="exit" />
                        </div>
                      </div>
                    </div>

                    {/* BR-RTR */}
                    <div className="border border-zinc-800/40 bg-[#0d0e12]/30 p-6 rounded-xl space-y-4">
                      <div className="flex items-center justify-between mb-4 border-b border-zinc-800/60 pb-3">
                        <span className="text-base font-bold text-zinc-100 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                          <span>BR-RTR</span>
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">1. Создание пользователя net_admin для управления сетью:</div>
                          <CommandBlock command="useradd net_admin" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">2. Установка пароля P@ssw0rd для созданного пользователя:</div>
                          <CommandBlock command='echo "net_admin:P@ssw0rd" | chpasswd' />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">3. Добавление пользователя net_admin в привилегированную группу wheel:</div>
                          <CommandBlock command="usermod -aG wheel net_admin" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">4. Обновление репозиториев и установка утилиты sudo (с подтверждением):</div>
                          <CommandBlock command="apt-get update && apt-get install sudo" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">5. Разрешение пользователям группы wheel использовать sudo без ввода пароля:</div>
                          <CommandBlock command='echo "WHEEL_USERS ALL=(ALL:ALL) NOPASSWD: ALL" > /etc/sudoers.d/net_admin' />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">6. Вход в интерактивную сессию под именем net_admin:</div>
                          <CommandBlock command="su -l net_admin" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">7. Проверка прав суперпользователя через sudo:</div>
                          <CommandBlock command="sudo id" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionItem>

              <AccordionItem title="Задание 4. Настройте коммутацию в сегменте HQ" level={2}>
                <div className="space-y-4">
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    Для настройки сетевой коммутации в сегменте штаб-квартиры (HQ) необходимо выдать соответствующие VLAN Tag виртуальным хостам в панели управления гипервизором Proxmox VE. Это обеспечит логическую изоляцию сетевых сегментов.
                  </p>

                  <div className="space-y-6">
                    <div className="border border-zinc-800/40 bg-[#0d0e12]/30 p-6 rounded-xl space-y-4">
                      <div className="text-sm font-bold text-zinc-100 border-b border-zinc-800/60 pb-3">
                        Шаг 1. Настройка VLAN Tag для HQ-SRV (VLAN 111)
                      </div>
                      <div className="text-sm text-zinc-300 space-y-2 leading-relaxed">
                        <p>1. В веб-интерфейсе Proxmox VE выберите виртуальную машину <code className="text-emerald-400 font-mono text-xs">HQ-SRV</code> в левом меню.</p>
                        <p>2. Перейдите во вкладку <strong className="text-zinc-200">Hardware</strong> (Оборудование).</p>
                        <p>3. Выберите сетевой адаптер <strong className="text-zinc-200">Network Device (net0)</strong> и дважды кликните по нему для редактирования:</p>
                      </div>

                      {/* next/image component - Static size */}
                      <div className="rounded-xl overflow-hidden border border-zinc-800/80 bg-zinc-950/40 my-4 shadow-inner max-w-[700px] w-full flex-shrink-0">
                        <Image
                          src="/screenshot/vlan1.png"
                          alt="Выбор сетевого устройства в Proxmox"
                          width={700}
                          height={394}
                          className="w-full h-auto object-contain opacity-90 transition-opacity hover:opacity-100 duration-300"
                        />
                      </div>

                      <div className="text-sm text-zinc-300 space-y-2 leading-relaxed pt-2">
                        <p>4. В открывшемся окне параметров найдите поле <strong className="text-zinc-100">VLAN Tag</strong> и укажите значение <code className="text-emerald-400 font-mono text-xs bg-zinc-900/80 px-1.5 py-0.5 rounded border border-zinc-800/80">111</code>.</p>
                        <p>5. Нажмите кнопку <strong className="text-zinc-200">OK</strong> для применения настроек.</p>
                      </div>

                      {/* next/image component - Static size */}
                      <div className="rounded-xl overflow-hidden border border-zinc-800/80 bg-zinc-950/40 my-4 shadow-inner max-w-[700px] w-full flex-shrink-0">
                        <Image
                          src="/screenshot/111.png"
                          alt="Настройка VLAN Tag в Proxmox"
                          width={700}
                          height={394}
                          className="w-full h-auto object-contain opacity-90 transition-opacity hover:opacity-100 duration-300"
                        />
                      </div>
                    </div>

                    <div className="border border-zinc-800/40 bg-[#0d0e12]/30 p-6 rounded-xl space-y-4">
                      <div className="text-sm font-bold text-zinc-100 border-b border-zinc-800/60 pb-3">
                        Шаг 2. Настройка VLAN Tag для HQ-CLI (VLAN 211)
                      </div>
                      <div className="text-sm text-zinc-300 space-y-2 leading-relaxed">
                        <p>1. Перейдите к виртуальной машине <code className="text-emerald-400 font-mono text-xs">HQ-CLI</code> в панели Proxmox VE.</p>
                        <p>2. Перейдите во вкладку <strong className="text-zinc-200">Hardware</strong> → выберите <strong className="text-zinc-200">Network Device (net0)</strong>.</p>
                        <p>3. Выполните аналогичные шаги редактирования сетевых настроек, но укажите значение <strong className="text-zinc-100">VLAN Tag</strong> равным <code className="text-emerald-400 font-mono text-xs bg-zinc-900/80 px-1.5 py-0.5 rounded border border-zinc-800/80">211</code>.</p>
                        <p>4. Нажмите кнопку <strong className="text-zinc-200">OK</strong> для завершения.</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 border border-red-500/25 bg-red-500/5 rounded-xl text-red-400 mt-4">
                    <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                    <div className="text-sm font-semibold">Сведения о настройке коммутации внесите в отчёт</div>
                  </div>
                </div>
              </AccordionItem>

              <AccordionItem title="Задание 5. Настройте безопасный удаленный доступ на серверах" level={2}>
                <div className="space-y-4">
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    Для обеспечения безопасного удаленного управления серверами необходимо настроить службу SSH-доступа (<code className="text-emerald-400 font-mono text-xs bg-zinc-900/80 px-1.5 py-0.5 rounded border border-zinc-800/80">sshd</code>) на нестандартный порт, ограничить список разрешенных пользователей, установить лимит попыток аутентификации и настроить баннер предупреждения при подключении.
                  </p>

                  <div className="space-y-6">
                    {/* HQ-SRV */}
                    <div className="border border-zinc-800/40 bg-[#0d0e12]/30 p-6 rounded-xl space-y-4">
                      <div className="flex items-center justify-between mb-4 border-b border-zinc-800/60 pb-3">
                        <span className="text-base font-bold text-zinc-100 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                          <span>HQ-SRV</span>
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">1. Открытие конфигурационного файла SSH-сервера в редакторе vim:</div>
                          <CommandBlock command="vim /etc/openssh/sshd_config" />
                        </div>

                        <div className="p-4 bg-[#0d0e12]/30 border border-zinc-800/40 rounded-xl space-y-2 text-sm text-zinc-300 leading-relaxed">
                          <div className="font-semibold text-emerald-400">2. Редактирование конфигурации в vim:</div>
                          <p>Впишите в самое начало файла следующие строки:</p>
                          <pre className="p-4 rounded-lg bg-[#050608] border border-zinc-800/60 text-zinc-200 font-mono text-xs leading-relaxed overflow-x-auto select-all my-2">
{`Port 2011
AllowUsers sshuser
MaxAuthTries 2
Banner /etc/openssh/ssh_banner`}
                          </pre>
                          <p className="text-xs text-zinc-500 mt-1">Для начала редактирования нажмите клавишу <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">i</kbd> (режим Insert). Убедитесь, что активна английская раскладка клавиатуры.</p>
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">3. Сохранение изменений и выход из редактора vim:</div>
                          <p className="text-xs text-zinc-500 mb-1">Нажмите клавишу <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Esc</kbd>, введите команду ниже и нажмите <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Enter</kbd>:</p>
                          <CommandBlock command=":wq" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">4. Создание файла приветственного баннера безопасности:</div>
                          <CommandBlock command='echo "Authorized access only" | tee /etc/openssh/ssh_banner' />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">5. Перезапуск службы sshd для применения новых настроек:</div>
                          <CommandBlock command="systemctl restart sshd" />
                        </div>

                        <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl space-y-2 text-sm text-zinc-300">
                          <div className="font-semibold text-emerald-400">6. Проверка соединения (выполняется с маршрутизатора HQ-RTR):</div>
                          <p>Попробуйте подключиться к HQ-SRV по настроенному порту под созданным пользователем:</p>
                          <CommandBlock command="ssh -p 2011 sshuser@192.168.100.2" />
                          <p>После проверки авторизации выйдите из удаленной сессии:</p>
                          <CommandBlock command="exit" />
                        </div>
                      </div>
                    </div>

                    {/* BR-SRV */}
                    <div className="border border-zinc-800/40 bg-[#0d0e12]/30 p-6 rounded-xl space-y-4">
                      <div className="flex items-center justify-between mb-4 border-b border-zinc-800/60 pb-3">
                        <span className="text-base font-bold text-zinc-100 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                          <span>BR-SRV</span>
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">1. Открытие конфигурационного файла SSH-сервера в редакторе vim:</div>
                          <CommandBlock command="vim /etc/openssh/sshd_config" />
                        </div>

                        <div className="p-4 bg-[#0d0e12]/30 border border-zinc-800/40 rounded-xl space-y-2 text-sm text-zinc-300 leading-relaxed">
                          <div className="font-semibold text-emerald-400">2. Редактирование конфигурации в vim:</div>
                          <p>Впишите в самое начало файла следующие строки:</p>
                          <pre className="p-4 rounded-lg bg-[#050608] border border-zinc-800/60 text-zinc-200 font-mono text-xs leading-relaxed overflow-x-auto select-all my-2">
{`Port 2011
AllowUsers sshuser
MaxAuthTries 2
Banner /etc/openssh/ssh_banner`}
                          </pre>
                          <p className="text-xs text-zinc-500 mt-1">Для начала редактирования нажмите клавишу <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">i</kbd> (режим Insert). Убедитесь, что активна английская раскладка клавиатуры.</p>
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">3. Сохранение изменений и выход из редактора vim:</div>
                          <p className="text-xs text-zinc-500 mb-1">Нажмите клавишу <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Esc</kbd>, введите команду ниже и нажмите <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Enter</kbd>:</p>
                          <CommandBlock command=":wq" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">4. Создание файла приветственного баннера безопасности:</div>
                          <CommandBlock command='echo "Authorized access only" | tee /etc/openssh/ssh_banner' />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">5. Перезапуск службы sshd для применения новых настроек:</div>
                          <CommandBlock command="systemctl restart sshd" />
                        </div>

                        <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl space-y-2 text-sm text-zinc-300">
                          <div className="font-semibold text-emerald-400">6. Проверка соединения (выполняется с маршрутизатора BR-RTR):</div>
                          <p>Попробуйте подключиться к BR-SRV по настроенному порту под созданным пользователем:</p>
                          <CommandBlock command="ssh -p 2011 sshuser@192.168.0.2" />
                          <p>После проверки авторизации выйдите из удаленной сессии:</p>
                          <CommandBlock command="exit" />
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </AccordionItem>

              <AccordionItem title="Задание 6. Сконфигурировать IP туннель между офисами" level={2}>
                <div className="space-y-4">
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    Для объединения локальных сетей штаб-квартиры (HQ) и филиала (BR) на маршрутизаторах настраивается туннель GRE (Generic Routing Encapsulation). Это создаст виртуальный интерфейс <code className="text-emerald-400 font-mono text-xs bg-zinc-900/80 px-1.5 py-0.5 rounded border border-zinc-800/80">gre1</code>, поверх которого будет происходить передача трафика между площадками.
                  </p>

                  <div className="space-y-6">
                    {/* BR-RTR */}
                    <div className="border border-zinc-800/40 bg-[#0d0e12]/30 p-6 rounded-xl space-y-4">
                      <div className="flex items-center justify-between mb-4 border-b border-zinc-800/60 pb-3">
                        <span className="text-base font-bold text-zinc-100 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                          <span>BR-RTR</span>
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">1. Открытие конфигурационного файла туннеля в редакторе vim:</div>
                          <CommandBlock command="vim /etc/net/ifaces/gre1/options" />
                        </div>

                        <div className="p-4 bg-[#0d0e12]/30 border border-zinc-800/40 rounded-xl space-y-2 text-sm text-zinc-300 leading-relaxed">
                          <div className="font-semibold text-emerald-400">2. Редактирование конфигурации в vim:</div>
                          <p>Впишите в файл следующие строки:</p>
                          <pre className="p-4 rounded-lg bg-[#050608] border border-zinc-800/60 text-zinc-200 font-mono text-xs leading-relaxed overflow-x-auto select-all my-2">
{`TYPE=iptun
TUNTYPE=gre
TUNLOCAL=172.16.20.2
TUNREMOTE=172.16.10.2
TUNTTL=64
TUNOPTIONS='ttl 64'`}
                          </pre>
                          <p className="text-xs text-zinc-500 mt-1">Для начала редактирования нажмите клавишу <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">i</kbd> (режим Insert). Убедитесь, что активна английская раскладка клавиатуры.</p>
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">3. Сохранение изменений и выход из редактора vim:</div>
                          <p className="text-xs text-zinc-500 mb-1">Нажмите клавишу <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Esc</kbd>, введите команду ниже и нажмите <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Enter</kbd>:</p>
                          <CommandBlock command=":wq" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">4. Назначение IP-адреса на интерфейс gre1:</div>
                          <CommandBlock command='echo "10.10.10.2/30" > /etc/net/ifaces/gre1/ipv4address' />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">5. Перезапуск сетевой службы для применения настроек:</div>
                          <CommandBlock command="systemctl restart network" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">6. Проверка состояния сетевых интерфейсов:</div>
                          <CommandBlock command="ip -br -c a" />
                        </div>
                      </div>
                    </div>

                    {/* HQ-RTR */}
                    <div className="border border-zinc-800/40 bg-[#0d0e12]/30 p-6 rounded-xl space-y-4">
                      <div className="flex items-center justify-between mb-4 border-b border-zinc-800/60 pb-3">
                        <span className="text-base font-bold text-zinc-100 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                          <span>HQ-RTR</span>
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">1. Открытие конфигурационного файла туннеля в редакторе vim:</div>
                          <CommandBlock command="vim /etc/net/ifaces/gre1/options" />
                        </div>

                        <div className="p-4 bg-[#0d0e12]/30 border border-zinc-800/40 rounded-xl space-y-2 text-sm text-zinc-300 leading-relaxed">
                          <div className="font-semibold text-emerald-400">2. Редактирование конфигурации в vim:</div>
                          <p>Впишите в файл следующие строки:</p>
                          <pre className="p-4 rounded-lg bg-[#050608] border border-zinc-800/60 text-zinc-200 font-mono text-xs leading-relaxed overflow-x-auto select-all my-2">
{`TYPE=iptun
TUNTYPE=gre
TUNLOCAL=172.16.10.2
TUNREMOTE=172.16.20.2
TUNTTL=64
TUNOPTIONS='ttl 64'`}
                          </pre>
                          <p className="text-xs text-zinc-500 mt-1">Для начала редактирования нажмите клавишу <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">i</kbd> (режим Insert). Убедитесь, что активна английская раскладка клавиатуры.</p>
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">3. Сохранение изменений и выход из редактора vim:</div>
                          <p className="text-xs text-zinc-500 mb-1">Нажмите клавишу <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Esc</kbd>, введите команду ниже и нажмите <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Enter</kbd>:</p>
                          <CommandBlock command=":wq" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">4. Назначение IP-адреса на интерфейс gre1:</div>
                          <CommandBlock command='echo "10.10.10.1/30" > /etc/net/ifaces/gre1/ipv4address' />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">5. Перезапуск сетевой службы для применения настроек:</div>
                          <CommandBlock command="systemctl restart network" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">6. Проверка состояния сетевых интерфейсов:</div>
                          <CommandBlock command="ip -br -c a" />
                        </div>

                        <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl space-y-2 text-sm text-zinc-300">
                          <div className="font-semibold text-emerald-400">7. Проверка доступности противоположной стороны туннеля (ping на адрес BR-RTR):</div>
                          <p>Отправьте ICMP-запросы для верификации работоспособности канала:</p>
                          <CommandBlock command="ping 10.10.10.2 -c 3" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 border border-red-500/25 bg-red-500/5 rounded-xl text-red-400 mt-4">
                    <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                    <div className="text-sm font-semibold">Сведения о туннеле занесите в отчёт.</div>
                  </div>
                </div>
              </AccordionItem>

              <AccordionItem title="Задание 7. Обеспечьте динамическую маршрутизацию на маршрутизаторах" level={2}>
                <div className="space-y-4">
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    Для автоматического обмена маршрутной информацией между сетями офисов настраивается динамическая маршрутизация. В качестве протокола используется OSPF (Open Shortest Path First) на базе пакета FRRouting (FRR).
                  </p>

                  <div className="space-y-6">
                    {/* HQ-RTR */}
                    <div className="border border-zinc-800/40 bg-[#0d0e12]/30 p-6 rounded-xl space-y-4">
                      <div className="flex items-center justify-between mb-4 border-b border-zinc-800/60 pb-3">
                        <span className="text-base font-bold text-zinc-100 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                          <span>HQ-RTR</span>
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">1. Обновление пакетной базы и установка службы FRRouting:</div>
                          <CommandBlock command="apt-get update && apt-get install frr -y" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">2. Включение службы ospfd в файле демонов FRR и проверка корректности:</div>
                          <CommandBlock command="sed -i 's/ospfd=no/ospfd=yes/' /etc/frr/daemons ; grep ospf /etc/frr/daemons" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">3. Открытие основного конфигурационного файла FRR в редакторе vim:</div>
                          <CommandBlock command="vim /etc/frr/frr.conf" />
                        </div>

                        <div className="p-4 bg-[#0d0e12]/30 border border-zinc-800/40 rounded-xl space-y-2 text-sm text-zinc-300 leading-relaxed">
                          <div className="font-semibold text-emerald-400">4. Редактирование конфигурации в vim:</div>
                          <p>Очистите файл и впишите следующие строки для настройки OSPF:</p>
                          <pre className="p-4 rounded-lg bg-[#050608] border border-zinc-800/60 text-zinc-200 font-mono text-xs leading-relaxed overflow-x-auto select-all my-2">
{`interface gre
 no ip ospf passive
exit
!
interface gre1
 ip ospf area 0
 ip ospf authentication
 ip ospf authentication-key P@ssw0rd
 no ip ospf passive
exit
!
interface vlan111
 ip ospf area 0
exit
!
interface vlan211
 ip ospf area 0
exit
!
interface vlan811
 ip ospf area 0
exit
!
router ospf
 passive-interface default
exit`}
                          </pre>
                          <p className="text-xs text-zinc-500 mt-1">Для начала редактирования нажмите клавишу <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">i</kbd> (режим Insert). Убедитесь, что активна английская раскладка клавиатуры.</p>
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">5. Сохранение изменений и выход из редактора vim:</div>
                          <p className="text-xs text-zinc-500 mb-1">Нажмите клавишу <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Esc</kbd>, введите команду ниже и нажмите <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Enter</kbd>:</p>
                          <CommandBlock command=":wq" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">6. Добавление службы frr в автозагрузку и ее запуск:</div>
                          <CommandBlock command="systemctl enable --now frr" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">7. Перезапуск сетевой службы:</div>
                          <CommandBlock command="systemctl restart network" />
                        </div>
                      </div>
                    </div>

                    {/* BR-RTR */}
                    <div className="border border-zinc-800/40 bg-[#0d0e12]/30 p-6 rounded-xl space-y-4">
                      <div className="flex items-center justify-between mb-4 border-b border-zinc-800/60 pb-3">
                        <span className="text-base font-bold text-zinc-100 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                          <span>BR-RTR</span>
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">1. Обновление пакетной базы и установка службы FRRouting:</div>
                          <CommandBlock command="apt-get update && apt-get install frr -y" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">2. Включение службы ospfd в файле демонов FRR и проверка корректности:</div>
                          <CommandBlock command="sed -i 's/ospfd=no/ospfd=yes/' /etc/frr/daemons ; grep ospf /etc/frr/daemons" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">3. Открытие основного конфигурационного файла FRR в редакторе vim:</div>
                          <CommandBlock command="vim /etc/frr/frr.conf" />
                        </div>

                        <div className="p-4 bg-[#0d0e12]/30 border border-zinc-800/40 rounded-xl space-y-2 text-sm text-zinc-300 leading-relaxed">
                          <div className="font-semibold text-emerald-400">4. Редактирование конфигурации в vim:</div>
                          <p>Очистите файл и впишите следующие строки для настройки OSPF:</p>
                          <pre className="p-4 rounded-lg bg-[#050608] border border-zinc-800/60 text-zinc-200 font-mono text-xs leading-relaxed overflow-x-auto select-all my-2">
{`interface gre
 no ip ospf passive
exit
!
interface gre1
 ip ospf area 0
 ip ospf authentication
 ip ospf authentication-key P@ssw0rd
 no ip ospf passive
exit
!
interface enp7s2
 ip ospf area 0
exit
!
router ospf
 passive-interface default
exit`}
                          </pre>
                          <p className="text-xs text-zinc-500 mt-1">Для начала редактирования нажмите клавишу <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">i</kbd> (режим Insert). Убедитесь, что активна английская раскладка клавиатуры.</p>
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">5. Сохранение изменений и выход из редактора vim:</div>
                          <p className="text-xs text-zinc-500 mb-1">Нажмите клавишу <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Esc</kbd>, введите команду ниже и нажмите <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Enter</kbd>:</p>
                          <CommandBlock command=":wq" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">6. Добавление службы frr в автозагрузку и ее запуск:</div>
                          <CommandBlock command="systemctl enable --now frr" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">7. Перезапуск сетевой службы:</div>
                          <CommandBlock command="systemctl restart network" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 border border-red-500/25 bg-red-500/5 rounded-xl text-red-400 mt-4">
                    <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                    <div className="text-sm font-semibold">Сведения об адресах занесите в отчёт</div>
                  </div>
                </div>
              </AccordionItem>

              <AccordionItem title="Задание 8. Настройка динамической трансляции адресов маршрутизатора" level={2}>
                <div className="space-y-4">
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    Для обеспечения доступа клиентов локальной сети к глобальной сети Интернет на пограничных маршрутизаторах настраивается динамическая трансляция сетевых адресов (NAT/Masquerade) с использованием службы <code className="text-emerald-400 font-mono text-xs bg-zinc-900/80 px-1.5 py-0.5 rounded border border-zinc-800/80">nftables</code>.
                  </p>

                  <div className="space-y-6">
                    {/* HQ-RTR */}
                    <div className="border border-zinc-800/40 bg-[#0d0e12]/30 p-6 rounded-xl space-y-4">
                      <div className="flex items-center justify-between mb-4 border-b border-zinc-800/60 pb-3">
                        <span className="text-base font-bold text-zinc-100 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                          <span>HQ-RTR</span>
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">1. Обновление пакетной базы и установка nftables и редактора nano:</div>
                          <CommandBlock command="apt-get install nftables nano -y" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">2. Открытие конфигурационного файла nftables в редакторе nano:</div>
                          <CommandBlock command="nano /etc/nftables/nftables.nft" />
                        </div>

                        <div className="p-4 bg-[#0d0e12]/30 border border-zinc-800/40 rounded-xl space-y-3 text-sm text-zinc-300">
                          <div className="font-semibold text-emerald-400">3. Наполнение файла правилами NAT (Masquerade):</div>
                          <p>Удалите всё содержимое файла и вставьте следующие строки:</p>
                          <CommandBlock command={`#!/usr/sbin/nft -f
flush ruleset

table ip nat {
    chain postrouting {
        type nat hook postrouting priority srcnat;
        oifname "enp7s1" masquerade
    }
}`} />
                          <p className="text-xs text-zinc-500 mt-2">После вставки сохраните файл: нажмите <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Ctrl + X</kbd>, затем <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Y</kbd> и подтвердите клавишей <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Enter</kbd>.</p>
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">4. Добавление nftables в автозагрузку и запуск службы:</div>
                          <CommandBlock command="systemctl enable --now nftables" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">5. Перезапуск службы nftables для применения новых правил:</div>
                          <CommandBlock command="systemctl restart nftables.service" />
                        </div>
                      </div>
                    </div>

                    {/* BR-RTR */}
                    <div className="border border-zinc-800/40 bg-[#0d0e12]/30 p-6 rounded-xl space-y-4">
                      <div className="flex items-center justify-between mb-4 border-b border-zinc-800/60 pb-3">
                        <span className="text-base font-bold text-zinc-100 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                          <span>BR-RTR</span>
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">1. Обновление пакетной базы и установка nftables и редактора nano:</div>
                          <CommandBlock command="apt-get install nftables nano -y" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">2. Открытие конфигурационного файла nftables в редакторе nano:</div>
                          <CommandBlock command="nano /etc/nftables/nftables.nft" />
                        </div>

                        <div className="p-4 bg-[#0d0e12]/30 border border-zinc-800/40 rounded-xl space-y-3 text-sm text-zinc-300">
                          <div className="font-semibold text-emerald-400">3. Наполнение файла правилами NAT (Masquerade):</div>
                          <p>Удалите всё содержимое файла и вставьте следующие строки:</p>
                          <CommandBlock command={`#!/usr/sbin/nft -f
flush ruleset

table ip nat {
    chain postrouting {
        type nat hook postrouting priority srcnat;
        oifname "enp7s1" masquerade
    }
}`} />
                          <p className="text-xs text-zinc-500 mt-2">После вставки сохраните файл: нажмите <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Ctrl + X</kbd>, затем <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Y</kbd> и подтвердите клавишей <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Enter</kbd>.</p>
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">4. Добавление nftables в автозагрузку и запуск службы:</div>
                          <CommandBlock command="systemctl enable --now nftables" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">5. Перезапуск службы nftables для применения новых правил:</div>
                          <CommandBlock command="systemctl restart nftables.service" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionItem>

              <AccordionItem title="Задание 9. Настройте протокол динамической конфигурации хостов для сети в сторону HQ-CLI" level={2}>
                <div className="space-y-4">
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    Для автоматической выдачи IP-адресов и параметров сети клиенту <code className="text-emerald-400 font-mono text-xs bg-zinc-900/80 px-1.5 py-0.5 rounded border border-zinc-800/80">HQ-CLI</code> на маршрутизаторе <code className="text-emerald-400 font-mono text-xs bg-zinc-900/80 px-1.5 py-0.5 rounded border border-zinc-800/80">HQ-RTR</code> настраивается DHCP-сервер с использованием легковесной службы <code className="text-emerald-400 font-mono text-xs bg-zinc-900/80 px-1.5 py-0.5 rounded border border-zinc-800/80">dnsmasq</code>. Также производится перенос конфигурации DNS на интерфейс VLAN 111.
                  </p>

                  <div className="space-y-6">
                    {/* HQ-RTR */}
                    <div className="border border-zinc-800/40 bg-[#0d0e12]/30 p-6 rounded-xl space-y-4">
                      <div className="flex items-center justify-between mb-4 border-b border-zinc-800/60 pb-3">
                        <span className="text-base font-bold text-zinc-100 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                          <span>HQ-RTR</span>
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div className="relative my-4">
                          <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-zinc-800/45"></div>
                          </div>
                          <div className="relative flex justify-start">
                            <span className="bg-[#0f1115] pr-3 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                              Шаг 1. Перенос настроек DNS
                            </span>
                          </div>
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">1. Установка пакета dnsmasq:</div>
                          <CommandBlock command="apt-get install dnsmasq -y" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">2. Удаление старого конфигурационного файла resolv.conf с внешнего интерфейса enp7s1:</div>
                          <CommandBlock command="rm -f /etc/net/ifaces/enp7s1/resolv.conf" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">3. Создание конфигурации DNS-резолвера для интерфейса vlan111:</div>
                          <CommandBlock command={'echo $\'search au-team.irpo\\nnameserver 192.168.100.2\' > /etc/net/ifaces/vlan111/resolv.conf'} />
                        </div>

                        <div className="relative my-6">
                          <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-zinc-800/45"></div>
                          </div>
                          <div className="relative flex justify-start">
                            <span className="bg-[#0f1115] pr-3 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                              Шаг 2. Настройка DHCP-сервера
                            </span>
                          </div>
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">4. Отключение встроенного локального резолвера dnsmasq для исключения конфликтов:</div>
                          <CommandBlock command="sed -i 's/AUTO_LOCAL_RESOLVER=yes/AUTO_LOCAL_RESOLVER=no/' /etc/sysconfig/dnsmasq ; grep AUTO_LOCAL_RESOLVER /etc/sysconfig/dnsmasq" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">5. Открытие конфигурационного файла dnsmasq в редакторе nano:</div>
                          <CommandBlock command="nano /etc/dnsmasq.conf" />
                        </div>

                        <div className="p-4 bg-[#0d0e12]/30 border border-zinc-800/40 rounded-xl space-y-3 text-sm text-zinc-300">
                          <div className="font-semibold text-emerald-400">6. Наполнение файла конфигурации dnsmasq:</div>
                          <p>В начало файла добавьте следующие строки:</p>
                          <CommandBlock command={`port=0
interface=vlan211
listen-address=192.168.200.1
dhcp-authoritative
dhcp-range=interface:vlan211,192.168.200.2,192.168.200.2,255.255.255.240,6h
dhcp-option=3,192.168.200.1
dhcp-option=6,192.168.100.2
leasefile-ro`} />
                          <p className="text-xs text-zinc-500 mt-2">После вставки сохраните файл: нажмите <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Ctrl + X</kbd>, затем <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Y</kbd> и подтвердите клавишей <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Enter</kbd>.</p>
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">7. Добавление dnsmasq в автозагрузку, его запуск и проверка порта 67 (DHCP):</div>
                          <CommandBlock command="systemctl enable --now dnsmasq ; ss -lun | grep 67" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">8. Перезапуск сетевой службы для применения настроек резолверов:</div>
                          <CommandBlock command="systemctl restart network" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">9. Проверка итогового файла resolv.conf:</div>
                          <CommandBlock command="cat /etc/resolv.conf" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 border border-red-500/25 bg-red-500/5 rounded-xl text-red-400 mt-4">
                    <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                    <div className="text-sm font-semibold">Сведения о настройке протокола занесите в отчёт.</div>
                  </div>
                </div>
              </AccordionItem>

              <AccordionItem title="Задание 10. Настройте инфраструктуру разрешения доменных имён" level={2}>
                <div className="space-y-4">
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    Для настройки локального DNS-сервера в зоне <code className="text-emerald-400 font-mono text-xs bg-zinc-900/80 px-1.5 py-0.5 rounded border border-zinc-800/80">au-team.irpo</code> и обратной зоны <code className="text-emerald-400 font-mono text-xs bg-zinc-900/80 px-1.5 py-0.5 rounded border border-zinc-800/80">168.192.in-addr.arpa</code> на сервере <code className="text-emerald-400 font-mono text-xs bg-zinc-900/80 px-1.5 py-0.5 rounded border border-zinc-800/80">HQ-SRV</code> устанавливается и настраивается служба DNS-сервера <code className="text-emerald-400 font-mono text-xs bg-zinc-900/80 px-1.5 py-0.5 rounded border border-zinc-800/80">bind</code> (named).
                  </p>

                  <div className="space-y-6">
                    {/* HQ-SRV */}
                    <div className="border border-zinc-800/40 bg-[#0d0e12]/30 p-6 rounded-xl space-y-4">
                      <div className="flex items-center justify-between mb-4 border-b border-zinc-800/60 pb-3">
                        <span className="text-base font-bold text-zinc-100 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                          <span>HQ-SRV</span>
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">1. Обновление пакетной базы и установка службы bind, утилит bind-utils и текстового редактора nano:</div>
                          <CommandBlock command="apt-get update && apt-get install bind bind-utils nano -y" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">2. Перенаправление резолвера сетевого интерфейса enp7s1 на локальный адрес 127.0.0.1:</div>
                          <CommandBlock command={'echo $\'search au-team.irpo\\nnameserver 127.0.0.1\' > /etc/net/ifaces/enp7s1/resolv.conf'} />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">3. Генерация ключа rndc для управления DNS-сервером:</div>
                          <CommandBlock command="rndc-confgen -a -c /etc/bind/rndc.key" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">4. Открытие файла глобальной конфигурации bind в редакторе nano:</div>
                          <CommandBlock command="nano /etc/bind/options.conf" />
                        </div>

                        <div className="p-4 bg-[#0d0e12]/30 border border-zinc-800/40 rounded-xl space-y-3 text-sm text-zinc-300">
                          <div className="font-semibold text-emerald-400">5. Редактирование options.conf (Замените всё содержимое файла следующим текстом):</div>
                          <CommandBlock command={`options {
    listen-on { 127.0.0.1; 192.168.100.2; };
    forwarders { 77.88.8.7; 77.88.8.3; };
    recursion yes;
    allow-recursion { any; };
    allow-query { any; };
    dnssec-validation no;
    directory "/etc/bind/zone";
    dump-file "/var/run/named/named_dump.db";
    statistics-file "/var/run/named/named.stats";
    pid-file "/var/run/named/named.pid";
};

logging {
    category default { default_syslog; };
};

zone "au-team.irpo" {
    type master;
    file "au-team.irpo";
};

zone "168.192.in-addr.arpa" {
    type master;
    file "168.192.in-addr.arpa";
};`} />
                          <p className="text-xs text-zinc-500 mt-2">После вставки сохраните файл: нажмите <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Ctrl + X</kbd>, затем <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Y</kbd> и подтвердите клавишей <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Enter</kbd>.</p>
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">6. Копирование шаблона зоны обратного просмотра в качестве основы для зоны au-team.irpo:</div>
                          <CommandBlock command="cp -r /etc/bind/zone/127.in-addr.arpa /etc/bind/zone/au-team.irpo" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">7. Открытие конфигурационного файла зоны au-team.irpo в редакторе nano:</div>
                          <CommandBlock command="nano /etc/bind/zone/au-team.irpo" />
                        </div>

                        <div className="p-4 bg-[#0d0e12]/30 border border-zinc-800/40 rounded-xl space-y-3 text-sm text-zinc-300">
                          <div className="font-semibold text-emerald-400">8. Редактирование файла зоны au-team.irpo (Замените всё содержимое файла следующим текстом):</div>
                          <CommandBlock command={`$TTL 1D
@ IN SOA au-team.irpo. root.au-team.irpo. (
	2025020600
    12H
    1H
    1W
    1H
)
@       IN NS    hq-srv.au-team.irpo.

hq-rtr  IN A     192.168.100.1
hq-srv  IN A     192.168.100.2
hq-cli  IN A     192.168.200.2
br-rtr  IN A     192.168.0.1
br-srv  IN A     192.168.0.2
docker  IN A     172.16.10.1
web     IN A     172.16.20.1`} />
                          <p className="text-xs text-zinc-500 mt-2">После вставки сохраните файл: нажмите <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Ctrl + X</kbd>, затем <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Y</kbd> и подтвердите клавишей <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Enter</kbd>.</p>
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">9. Копирование шаблона зоны обратного просмотра в качестве основы для обратной зоны 168.192.in-addr.arpa:</div>
                          <CommandBlock command="cp -r /etc/bind/zone/127.in-addr.arpa /etc/bind/zone/168.192.in-addr.arpa" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">10. Открытие файла обратной зоны в редакторе nano:</div>
                          <CommandBlock command="nano /etc/bind/zone/168.192.in-addr.arpa" />
                        </div>

                        <div className="p-4 bg-[#0d0e12]/30 border border-zinc-800/40 rounded-xl space-y-3 text-sm text-zinc-300">
                          <div className="font-semibold text-emerald-400">11. Редактирование файла обратной зоны (Замените всё содержимое файла следующим текстом):</div>
                          <CommandBlock command={`$TTL 1D
@ IN SOA au-team.irpo. root.au-team.irpo. (
    2025020600
    12H
    1H
    1W
    1H
)
@       IN NS    au-team.irpo.

1.100   IN PTR   hq-rtr.au-team.irpo.
2.100   IN PTR   hq-srv.au-team.irpo.
2.200   IN PTR   hq-cli.au-team.irpo.`} />
                          <p className="text-xs text-zinc-500 mt-2">После вставки сохраните файл: нажмите <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Ctrl + X</kbd>, затем <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Y</kbd> и подтвердите клавишей <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Enter</kbd>.</p>
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">12. Установка группы-владельца named для созданных файлов зон:</div>
                          <CommandBlock command="chown :named /etc/bind/zone/au-team.irpo /etc/bind/zone/168.192.in-addr.arpa" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">13. Добавление службы bind в автозагрузку и ее запуск:</div>
                          <CommandBlock command="systemctl enable --now bind" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">14. Перезапуск сетевой службы для применения нового резолвера:</div>
                          <CommandBlock command="service network restart" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">15. Перезапуск службы bind для применения файлов зон:</div>
                          <CommandBlock command="systemctl restart bind.service" />
                        </div>

                        <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl space-y-2 text-sm text-zinc-300">
                          <div className="font-semibold text-emerald-400">16. Проверка корректности разрешения имен:</div>
                          <p>Проверка прямого разрешения (получение IP по доменному имени):</p>
                          <CommandBlock command="host br-rtr" />
                          <p>Проверка обратного разрешения (получение имени по IP-адресу):</p>
                          <CommandBlock command="host -t PTR 192.168.100.2" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionItem>

              <AccordionItem title="Задание 11. Настройте часовой пояс на всех устройствах" level={2}>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 border border-emerald-500/20 bg-emerald-500/5 rounded-xl text-emerald-400 mb-2">
                    <Terminal className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm font-semibold">Данные команды выполняются на всех хостах</span>
                  </div>

                  <p className="text-sm text-zinc-300 leading-relaxed">
                    Для обеспечения синхронизации логов и корректной работы планировщиков задач необходимо настроить единый часовой пояс <code className="text-emerald-400 font-mono text-xs bg-zinc-900/80 px-1.5 py-0.5 rounded border border-zinc-800/80">Asia/Novosibirsk</code> на всех виртуальных машинах лабораторного стенда.
                  </p>

                  <div className="space-y-6">
                    <div className="border border-zinc-800/40 bg-[#0d0e12]/30 p-6 rounded-xl space-y-4">
                      <div className="flex items-center justify-between mb-4 border-b border-zinc-800/60 pb-3">
                        <span className="text-base font-bold text-zinc-100 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                          <span>Настройка часового пояса</span>
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">1. Обновление пакетной базы и установка пакета tzdata для работы с часовыми поясами:</div>
                          <CommandBlock command="apt-get update && apt-get install tzdata -y" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">2. Установка часового пояса Asia/Novosibirsk:</div>
                          <CommandBlock command="timedatectl set-timezone Asia/Novosibirsk" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">3. Проверка текущих настроек системного времени и часового пояса:</div>
                          <CommandBlock command="timedatectl" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionItem>
            </div>
          </AccordionItem>

          {/* MODULE 2 */}
          <AccordionItem title="Модуль 2: Инфраструктурные службы и службы каталогов" level={1}>
            <div className="space-y-4 mt-2">
              <p className="text-sm text-zinc-400 mb-4">
                В этом модуле рассматривается настройка контроллера домена Active Directory на базе Samba DC, управление DNS-записями домена, создание пользователей и групп, а также интеграция смежных сетевых сервисов.
              </p>

              {/* Level 2: Nested tasks */}
              <AccordionItem title="Задание 0. Самостоятельно включите SSH доступ на устройствах (ОБЯЗАТЕЛЬНОЕ)" level={2} titleClassName="text-red-500 group-hover:text-red-400">
                <div className="space-y-4">
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    Для обеспечения удаленного управления в рамках лабораторной работы необходимо самостоятельно включить и настроить SSH доступ на следующих виртуальных машинах: <code className="text-zinc-300 font-mono text-xs bg-zinc-900/60 px-1.5 py-0.5 rounded border border-zinc-800/80">HQ-SRV</code>, <code className="text-zinc-300 font-mono text-xs bg-zinc-900/60 px-1.5 py-0.5 rounded border border-zinc-800/80">HQ-RTR</code>, <code className="text-zinc-300 font-mono text-xs bg-zinc-900/60 px-1.5 py-0.5 rounded border border-zinc-800/80">BR-RTR</code> и <code className="text-zinc-300 font-mono text-xs bg-zinc-900/60 px-1.5 py-0.5 rounded border border-zinc-800/80">HQ-CLI</code>.
                  </p>

                  <div className="space-y-6">
                    <div className="border border-zinc-800/40 bg-[#0d0e12]/30 p-6 rounded-xl space-y-4">
                      <div className="text-sm font-bold text-zinc-100 border-b border-zinc-800/60 pb-3">
                        Инструкция по настройке
                      </div>
                      <div className="space-y-4 text-sm text-zinc-300">
                        <p>Выполните следующие шаги на каждой из указанных машин:</p>
                        
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">1. Редактирование конфигурационного файла sshd_config в редакторе vim:</div>
                          <CommandBlock command="vim /etc/openssh/sshd_config" />
                          <p className="text-xs text-zinc-500 mt-2">
                            Для начала редактирования нажмите клавишу <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">i</kbd> (режим Insert). Убедитесь, что активна английская раскладка клавиатуры.
                          </p>
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">2. Найдите строку Port 2026 и замените порт на 2011:</div>
                          <CommandBlock command="Port 2011" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">3. Сохранение конфигурации и выход из vim:</div>
                          <p className="text-xs text-zinc-500 mb-1">Нажмите клавишу <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Esc</kbd>, введите команду ниже и нажмите <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Enter</kbd>:</p>
                          <CommandBlock command=":wq" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">4. Включение службы sshd в автозагрузку и её запуск:</div>
                          <CommandBlock command="systemctl enable --now sshd" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionItem>

              <AccordionItem title="Задание 1. Настройте контроллер домена Samba DC на BR-SRV" level={2}>
                <div className="space-y-4">
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    Для централизованного управления пользователями и компьютерами на сервере <code className="text-emerald-400 font-mono text-xs bg-zinc-900/80 px-1.5 py-0.5 rounded border border-zinc-800/80">BR-SRV</code> развертывается Samba в роли контроллера домена Active Directory, регистрируются DNS-записи для ключевых хостов и создается тестовая структура пользователей и групп.
                  </p>

                  <div className="space-y-6">
                    {/* BR-SRV */}
                    <div className="border border-zinc-800/40 bg-[#0d0e12]/30 p-6 rounded-xl space-y-4">
                      <div className="flex items-center justify-between mb-4 border-b border-zinc-800/60 pb-3">
                        <span className="text-base font-bold text-zinc-100 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                          <span>BR-SRV</span>
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div className="relative my-4">
                          <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-zinc-800/45"></div>
                          </div>
                          <div className="relative flex justify-start">
                            <span className="bg-[#0f1115] pr-3 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                              Шаг 1. Подготовка и развертывание Samba DC
                            </span>
                          </div>
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">1. Добавление IP-адреса DNS-сервера в конфигурацию резолвера сетевого интерфейса enp7s1:</div>
                          <CommandBlock command='echo "nameserver 192.168.1.10" >> /etc/net/ifaces/enp7s1/resolv.conf' />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">2. Перезапуск сетевой службы для применения новой конфигурации:</div>
                          <CommandBlock command="systemctl restart network" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">3. Проверка текущих настроек DNS-клиента:</div>
                          <CommandBlock command="cat /etc/resolv.conf" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">4. Проверка доступности внешней сети (двумя ICMP-запросами):</div>
                          <CommandBlock command="ping ya.ru -c 2" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">5. Установка пакета Samba для развертывания контроллера домена:</div>
                          <CommandBlock command="apt-get update && apt-get install task-samba-dc -y" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">6. Удаление предустановленной стандартной конфигурации Samba:</div>
                          <CommandBlock command="rm -f /etc/samba/smb.conf" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">7. Очистка кэша и старых баз данных Samba перед развертыванием:</div>
                          <CommandBlock command="rm -rf {/var/lib/samba, /var/cache/samba}" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">8. Создание каталога системного общего ресурса sysvol:</div>
                          <CommandBlock command="mkdir -p /var/lib/samba/sysvol" />
                        </div>

                        <div className="p-4 bg-[#0d0e12]/30 border border-zinc-800/40 rounded-xl space-y-2 text-sm text-zinc-300">
                          <div className="font-semibold text-emerald-400">9. Интерактивный запуск мастера развертывания домена:</div>
                          <CommandBlock command="samba-tool domain provision" />
                          <div className="text-xs text-zinc-400 leading-relaxed mt-2 space-y-1">
                            <p>• Везде соглашаемся со значениями по умолчанию (нажимаем <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Enter</kbd>).</p>
                            <p>• Пароль Администратора задаем: <code className="text-zinc-200 bg-zinc-900/60 px-1.5 py-0.5 rounded border border-zinc-800/80 font-mono text-xs">P@ssw0rd</code></p>
                          </div>
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">10. Резервное переименование старой конфигурации Kerberos:</div>
                          <CommandBlock command="mv /etc/krb5.conf /etc/krb5.conf.back" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">11. Копирование сгенерированного файла конфигурации Kerberos из Samba:</div>
                          <CommandBlock command="cp /var/lib/samba/private/krb5.conf /etc/krb5.conf" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">12. Добавление службы samba (AD DC) в автозагрузку и ее немедленный запуск:</div>
                          <CommandBlock command="systemctl enable --now samba" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">13. Проверка текущего статуса запущенной службы Samba:</div>
                          <CommandBlock command="systemctl status samba" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">Для выхода из режима просмотра статуса службы Samba:</div>
                          <p className="text-xs text-zinc-500 mb-1">Нажмите сочетание клавиш <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Ctrl + C</kbd> (нажать 2 раза).</p>
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">14. Проверка общей информации о развернутом домене на локальном интерфейсе:</div>
                          <CommandBlock command="samba-tool domain info 127.0.0.1" />
                        </div>

                        <div className="relative my-6">
                          <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-zinc-800/45"></div>
                          </div>
                          <div className="relative flex justify-start">
                            <span className="bg-[#0f1115] pr-3 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                              Шаг 2. Настройка записей DNS
                            </span>
                          </div>
                        </div>

                        <div className="p-4 bg-[#0d0e12]/30 border border-zinc-800/40 rounded-xl space-y-4">
                          <div className="font-semibold text-emerald-400 text-sm">Добавление А-записей для инфраструктурных узлов в DNS Samba:</div>
                          
                          <div>
                            <div className="text-xs text-zinc-400 mb-1">15. Запись для HQ-SRV (при запросе введите пароль: <code className="text-zinc-300 font-mono text-xs">P@ssw0rd</code>):</div>
                            <CommandBlock command="samba-tool dns add br-srv.au-team.irpo au-team.irpo hq-srv A 192.168.1.10 -U Administrator" />
                          </div>

                          <div>
                            <div className="text-xs text-zinc-400 mb-1">16. Запись для HQ-RTR (при запросе введите пароль: <code className="text-zinc-300 font-mono text-xs">P@ssw0rd</code>):</div>
                            <CommandBlock command="samba-tool dns add br-srv.au-team.irpo au-team.irpo hq-rtr A 192.168.1.1 -U Administrator" />
                          </div>

                          <div>
                            <div className="text-xs text-zinc-400 mb-1">17. Запись для BR-RTR (при запросе введите пароль: <code className="text-zinc-300 font-mono text-xs">P@ssw0rd</code>):</div>
                            <CommandBlock command="samba-tool dns add br-srv.au-team.irpo au-team.irpo br-rtr A 192.168.3.1 -U Administrator" />
                          </div>

                          <div>
                            <div className="text-xs text-zinc-400 mb-1">18. Запись для web.au-team.irpo (при запросе введите пароль: <code className="text-zinc-300 font-mono text-xs">P@ssw0rd</code>):</div>
                            <CommandBlock command="samba-tool dns add br-srv.au-team.irpo au-team.irpo web.au-team.irpo A 172.16.1.1 -U Administrator" />
                          </div>

                          <div>
                            <div className="text-xs text-zinc-400 mb-1">19. Запись для docker.au-team.irpo (при запросе введите пароль: <code className="text-zinc-300 font-mono text-xs">P@ssw0rd</code>):</div>
                            <CommandBlock command="samba-tool dns add br-srv.au-team.irpo au-team.irpo docker.au-team.irpo A 172.16.2.1 -U Administrator" />
                          </div>
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">20. Просмотр всех добавленных DNS-записей зоны для проверки (введите пароль: <code className="text-zinc-300 font-mono text-xs">P@ssw0rd</code>):</div>
                          <CommandBlock command="samba-tool dns query br-srv.au-team.irpo au-team.irpo @ ALL -U administrator" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">21. Перенаправление DNS-клиента enp7s1 на локальную петлю 127.0.0.1:</div>
                          <CommandBlock command="sed -i 's/nameserver 192.168.1.10/nameserver 127.0.0.1/' /etc/net/ifaces/enp7s1/resolv.conf" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">22. Перезапуск сетевой службы для применения изменений:</div>
                          <CommandBlock command="systemctl restart network" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">23. Проверка корректности обновленного файла resolv.conf:</div>
                          <CommandBlock command="cat /etc/resolv.conf" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">24. Инициализация билета Kerberos для Администратора домена (введите пароль: <code className="text-zinc-300 font-mono text-xs">P@ssw0rd</code>):</div>
                          <CommandBlock command="kinit administrator@AU-TEAM.IRPO" />
                        </div>

                        <div className="relative my-6">
                          <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-zinc-800/45"></div>
                          </div>
                          <div className="relative flex justify-start">
                            <span className="bg-[#0f1115] pr-3 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                              Шаг 3. Создание групп и пользователей домена
                            </span>
                          </div>
                        </div>

                        <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl space-y-4">
                          <div className="text-sm font-semibold text-emerald-400">Пакетное создание пользователей:</div>
                          
                          <div>
                            <div className="text-xs text-zinc-400 mb-1">25. Добавление новой группы безопасности hq:</div>
                            <CommandBlock command="samba-tool group add hq" />
                          </div>

                          <div>
                            <div className="text-xs text-zinc-400 mb-1">26. Создание пяти пользователей hquser1–hquser5 с паролем P@ssw0rd:</div>
                            <CommandBlock command="for i in {1..5}; do samba-tool user add hquser$i P@ssw0rd; done" />
                          </div>

                          <div>
                            <div className="text-xs text-zinc-400 mb-1">27. Добавление созданных пользователей в группу hq:</div>
                            <CommandBlock command="for i in {1..5}; do samba-tool group addmembers hq hquser$i; done" />
                          </div>

                          <div>
                            <div className="text-xs text-zinc-400 mb-1">28. Просмотр списка участников группы hq для проверки добавления:</div>
                            <CommandBlock command="samba-tool group listmembers hq" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* HQ-RTR */}
                    <div className="border border-zinc-800/40 bg-[#0d0e12]/30 p-6 rounded-xl space-y-4">
                      <div className="flex items-center justify-between mb-4 border-b border-zinc-800/60 pb-3">
                        <span className="text-base font-bold text-zinc-100 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                          <span>HQ-RTR</span>
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">1. Замена IP-адреса DNS-сервера в файле конфигурации dnsmasq на новый адрес контроллера домена Samba и перезапуск dnsmasq:</div>
                          <CommandBlock command="sed -i 's/192.168.1.10/192.168.3.10/' /etc/dnsmasq.conf; systemctl restart dnsmasq" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">2. Проверка обновленного конфигурационного файла dnsmasq:</div>
                          <CommandBlock command="cat /etc/dnsmasq.conf" />
                        </div>
                      </div>
                    </div>

                    {/* HQ-CLI */}
                    <div className="border border-zinc-800/40 bg-[#0d0e12]/30 p-6 rounded-xl space-y-4">
                      <div className="flex items-center justify-between mb-4 border-b border-zinc-800/60 pb-3">
                        <span className="text-base font-bold text-zinc-100 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                          <span>HQ-CLI</span>
                        </span>
                      </div>

                      <div className="space-y-6">
                        {/* PHASE 1 */}
                        <div className="space-y-4">
                          <div className="relative my-4">
                            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                              <div className="w-full border-t border-zinc-800/45"></div>
                            </div>
                            <div className="relative flex justify-start">
                              <span className="bg-[#0f1115] pr-3 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                                Шаг 1. Ввод в домен Active Directory (Графическая оболочка)
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 p-4 border border-blue-500/20 bg-blue-500/5 rounded-xl text-blue-400 mb-2">
                            <Terminal className="w-5 h-5 flex-shrink-0" />
                            <span className="text-sm font-semibold">Работаем в графической оболочке HQ-CLI (под пользователем user)</span>
                          </div>

                          <div className="rounded-xl overflow-hidden border border-zinc-800/80 bg-zinc-950/40 my-4 shadow-inner max-w-[700px] w-full flex-shrink-0">
                            <Image
                              src="/screenshot/log1.png"
                              alt="Графическая оболочка HQ-CLI"
                              width={700}
                              height={394}
                              className="w-full h-auto object-contain opacity-90 transition-opacity hover:opacity-100 duration-300"
                            />
                          </div>

                          <div className="text-sm text-zinc-300 space-y-2 leading-relaxed">
                            <p>1. Перезагрузите сеть на HQ-CLI, проверьте DNS-сервер и убедитесь, что машина готова к вводу в домен:</p>
                          </div>

                          <div className="grid grid-cols-1 gap-4 my-4">
                            <div className="rounded-xl overflow-hidden border border-zinc-800/80 bg-zinc-950/40 shadow-inner max-w-[700px] w-full flex-shrink-0">
                              <Image
                                src="/screenshot/log2.png"
                                alt="Перезагрузка сети и проверка DNS"
                                width={700}
                                height={394}
                                className="w-full h-auto object-contain opacity-90"
                              />
                            </div>
                            <div className="rounded-xl overflow-hidden border border-zinc-800/80 bg-zinc-950/40 shadow-inner max-w-[700px] w-full flex-shrink-0">
                              <Image
                                src="/screenshot/log3.png"
                                alt="Проверка резолвера DNS"
                                width={700}
                                height={394}
                                className="w-full h-auto object-contain opacity-90"
                              />
                            </div>
                            <div className="rounded-xl overflow-hidden border border-zinc-800/80 bg-zinc-950/40 shadow-inner max-w-[700px] w-full flex-shrink-0">
                              <Image
                                src="/screenshot/log4.png"
                                alt="Готовность к вводу в домен"
                                width={700}
                                height={394}
                                className="w-full h-auto object-contain opacity-90"
                              />
                            </div>
                          </div>

                          <div className="text-sm text-zinc-300 space-y-2 leading-relaxed pt-2">
                            <p>2. Откройте терминал и выполните команду для запуска Центра управления (alterator):</p>
                            <CommandBlock command="acc" />
                            <p className="text-xs text-zinc-500 mt-1">При запросе пароля введите: <code className="text-zinc-300 font-mono text-xs">toor</code></p>
                          </div>

                          <div className="grid grid-cols-1 gap-4 my-4">
                            <div className="rounded-xl overflow-hidden border border-zinc-800/80 bg-zinc-950/40 shadow-inner max-w-[700px] w-full flex-shrink-0">
                              <Image
                                src="/screenshot/log5.png"
                                alt="Запуск alterator-center"
                                width={700}
                                height={394}
                                className="w-full h-auto object-contain opacity-90"
                              />
                            </div>
                            <div className="rounded-xl overflow-hidden border border-zinc-800/80 bg-zinc-950/40 shadow-inner max-w-[700px] w-full flex-shrink-0">
                              <Image
                                src="/screenshot/log6.png"
                                alt="Ввод пароля администратора"
                                width={700}
                                height={394}
                                className="w-full h-auto object-contain opacity-90"
                              />
                            </div>
                          </div>

                          <div className="text-sm text-zinc-300 space-y-2 leading-relaxed pt-2">
                            <p>3. Перейдите во вкладку <strong className="text-zinc-100">Пользователи</strong> (Аутентификация). Поставьте галочку <strong className="text-zinc-100">Домен Active Directory</strong>, нажмите кнопку <strong className="text-zinc-200">Применить</strong> и введите пароль домена: <code className="text-zinc-200 font-mono text-xs bg-zinc-900/60 px-1.5 py-0.5 rounded border border-zinc-800/80">P@ssw0rd</code>.</p>
                            <p>Если настройка выполнена верно, отобразится всплывающее окно: <strong className="text-emerald-400">Добро пожаловать в домен AU-TEAM.IRPO</strong>.</p>
                          </div>

                          <div className="grid grid-cols-1 gap-4 my-4">
                            <div className="rounded-xl overflow-hidden border border-zinc-800/80 bg-zinc-950/40 shadow-inner max-w-[700px] w-full flex-shrink-0">
                              <Image
                                src="/screenshot/log7.png"
                                alt="Выбор типа аутентификации"
                                width={700}
                                height={394}
                                className="w-full h-auto object-contain opacity-90"
                              />
                            </div>
                            <div className="rounded-xl overflow-hidden border border-zinc-800/80 bg-zinc-950/40 shadow-inner max-w-[700px] w-full flex-shrink-0">
                              <Image
                                src="/screenshot/log8.png"
                                alt="Включение Active Directory"
                                width={700}
                                height={394}
                                className="w-full h-auto object-contain opacity-90"
                              />
                            </div>
                            <div className="rounded-xl overflow-hidden border border-zinc-800/80 bg-zinc-950/40 shadow-inner max-w-[700px] w-full flex-shrink-0">
                              <Image
                                src="/screenshot/log9.png"
                                alt="Авторизация администратора домена"
                                width={700}
                                height={394}
                                className="w-full h-auto object-contain opacity-90"
                              />
                            </div>
                            <div className="rounded-xl overflow-hidden border border-zinc-800/80 bg-zinc-950/40 shadow-inner max-w-[700px] w-full flex-shrink-0">
                              <Image
                                src="/screenshot/log10.png"
                                alt="Процесс добавления в домен"
                                width={700}
                                height={394}
                                className="w-full h-auto object-contain opacity-90"
                              />
                            </div>
                            <div className="rounded-xl overflow-hidden border border-zinc-800/80 bg-zinc-950/40 shadow-inner max-w-[700px] w-full flex-shrink-0">
                              <Image
                                src="/screenshot/log11.png"
                                alt="Успешный ввод в домен"
                                width={700}
                                height={394}
                                className="w-full h-auto object-contain opacity-90"
                              />
                            </div>
                          </div>

                          <div className="text-sm text-zinc-300 space-y-2 leading-relaxed pt-2">
                            <p>4. Перезагрузите систему через главное меню: <strong className="text-zinc-100">Меню → Выйти → Перезагрузить</strong>:</p>
                          </div>

                          <div className="grid grid-cols-1 gap-4 my-4">
                            <div className="rounded-xl overflow-hidden border border-zinc-800/80 bg-zinc-950/40 shadow-inner max-w-[700px] w-full flex-shrink-0">
                              <Image
                                src="/screenshot/log12.png"
                                alt="Перезагрузка ОС"
                                width={700}
                                height={394}
                                className="w-full h-auto object-contain opacity-90"
                              />
                            </div>
                            <div className="rounded-xl overflow-hidden border border-zinc-800/80 bg-zinc-950/40 shadow-inner max-w-[700px] w-full flex-shrink-0">
                              <Image
                                src="/screenshot/log13.png"
                                alt="Подтверждение перезагрузки"
                                width={700}
                                height={394}
                                className="w-full h-auto object-contain opacity-90"
                              />
                            </div>
                          </div>

                          <div className="text-sm text-zinc-300 space-y-2 leading-relaxed pt-2">
                            <p>5. На экране входа в систему авторизуйтесь под созданным доменным пользователем:</p>
                            <ul className="list-disc pl-5 space-y-1 text-xs text-zinc-400">
                              <li>Пользователь: <code className="text-zinc-300 font-mono text-xs">hquser1</code></li>
                              <li>Пароль: <code className="text-zinc-300 font-mono text-xs">P@ssw0rd</code></li>
                            </ul>
                          </div>
                        </div>

                        {/* PHASE 2 */}
                        <div className="space-y-4">
                          <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                              <div className="w-full border-t border-zinc-800/45"></div>
                            </div>
                            <div className="relative flex justify-start">
                              <span className="bg-[#0f1115] pr-3 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                                Шаг 2. Настройка ролей и sudo (Консольная оболочка root)
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 p-4 border border-red-500/20 bg-red-500/5 rounded-xl text-red-400 mb-2">
                            <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                            <span className="text-sm font-semibold">Работаем в консольной оболочке HQ-CLI (под пользователем root)</span>
                          </div>

                          <div>
                            <div className="text-xs text-zinc-400 font-semibold mb-1">1. Проверка активности переключателя libnss-role (должна выдать enabled):</div>
                            <CommandBlock command="control libnss-role" />
                          </div>

                          <div>
                            <div className="text-xs text-zinc-400 font-semibold mb-1">2. Связывание доменной группы hq с системной ролью wheel:</div>
                            <CommandBlock command="roleadd hq wheel" />
                          </div>

                          <div>
                            <div className="text-xs text-zinc-400 font-semibold mb-1">3. Предоставление роли wheel прав на выполнение определенных команд (cat, grep, id) без пароля через sudo:</div>
                            <CommandBlock command='echo "WHEEL_USERS ALL=(ALL:ALL) /bin/cat, /bin/grep, /usr/bin/id" >> /etc/sudoers' />
                          </div>

                          <div>
                            <div className="text-xs text-zinc-400 font-semibold mb-1">4. Просмотр последних строк конфигурации sudoers для контроля изменений:</div>
                            <CommandBlock command="tail /etc/sudoers" />
                          </div>
                        </div>

                        {/* PHASE 3 */}
                        <div className="space-y-4">
                          <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                              <div className="w-full border-t border-zinc-800/45"></div>
                            </div>
                            <div className="relative flex justify-start">
                              <span className="bg-[#0f1115] pr-3 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                                Шаг 3. Проверка авторизации и команд sudo (Графическая оболочка)
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 p-4 border border-blue-500/20 bg-blue-500/5 rounded-xl text-blue-400 mb-2">
                            <Terminal className="w-5 h-5 flex-shrink-0" />
                            <span className="text-sm font-semibold">Работаем в графической оболочке HQ-CLI (под пользователем user)</span>
                          </div>

                          <div className="text-sm text-zinc-300 space-y-2 leading-relaxed">
                            <p>1. Снова перезагрузите машину: <strong className="text-zinc-100">Меню → Выйти → Перезагрузить</strong>.</p>
                            <p>2. Логинимся под доменным пользователем:</p>
                            <ul className="list-disc pl-5 space-y-1 text-xs text-zinc-400">
                              <li>Пользователь: <code className="text-zinc-300 font-mono text-xs">hquser1</code></li>
                              <li>Пароль: <code className="text-zinc-300 font-mono text-xs">P@ssw0rd</code></li>
                            </ul>
                            <p className="pt-2">3. Откройте терминал на рабочем столе и выполните проверочные команды:</p>
                          </div>

                          <div>
                            <div className="text-xs text-zinc-400 mb-1">Проверка id (при запросе вводим пароль пользователя):</div>
                            <CommandBlock command="sudo id" />
                          </div>

                          <div>
                            <div className="text-xs text-zinc-400 mb-1">Проверка чтения файла resolv.conf (при запросе вводим пароль пользователя):</div>
                            <CommandBlock command="sudo cat /etc/resolv.conf" />
                          </div>

                          <div>
                            <div className="text-xs text-zinc-400 mb-1">Проверка работы утилиты grep (при запросе вводим пароль пользователя):</div>
                            <CommandBlock command="sudo grep" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionItem>

              <AccordionItem title="Задание 2. Сконфигурируйте файловое хранилище на HQ-SRV" level={2}>
                <div className="space-y-4">
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    Для создания производительного и надежного хранилища данных на сервере <code className="text-emerald-400 font-mono text-xs bg-zinc-900/80 px-1.5 py-0.5 rounded border border-zinc-800/80">HQ-SRV</code> настраивается программный RAID-массив уровня 1 (Mirroring) из нескольких доступных дисков, форматируется в файловую систему ext4 и монтируется в систему с настройкой автоматического подключения.
                  </p>

                  <div className="space-y-6">
                    {/* HQ-SRV */}
                    <div className="border border-zinc-800/40 bg-[#0d0e12]/30 p-6 rounded-xl space-y-4">
                      <div className="flex items-center justify-between mb-4 border-b border-zinc-800/60 pb-3">
                        <span className="text-base font-bold text-zinc-100 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                          <span>HQ-SRV</span>
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">1. Проверка доступных дисков и разделов в системе:</div>
                          <CommandBlock command="lsblk" />
                          <div className="mt-2 text-xs text-zinc-400">
                            Ожидаемый вывод (в системе должно присутствовать 3 диска по 1 ГБ):
                            <pre className="p-3 rounded-lg bg-[#050608] border border-zinc-800/60 text-zinc-300 font-mono text-xs mt-1 overflow-x-auto">
{`sdb 8:16 0 1G 0 disk
sdc 8:32 0 1G 0 disk
sdd 8:48 0 1G 0 disk`}
                            </pre>
                          </div>
                        </div>

                        <div className="p-4 bg-[#0d0e12]/30 border border-zinc-800/40 rounded-xl space-y-2 text-sm text-zinc-300">
                          <div className="font-semibold text-emerald-400">2. Интерактивная разметка дисков в утилите parted:</div>
                          <CommandBlock command="parted /dev/sdb" />
                          <div className="text-xs text-zinc-400 leading-relaxed mt-2 space-y-2">
                            <p>После входа в интерактивный режим parted выполните следующие команды поочередно для разметки <code className="text-zinc-200 bg-zinc-900/60 px-1 py-0.5 rounded border border-zinc-800/80">sdb</code> и <code className="text-zinc-200 bg-zinc-900/60 px-1 py-0.5 rounded border border-zinc-800/80">sdc</code>:</p>
                            <CommandBlock command={`mklabel msdos
mkpart primary ext4 1MiB 100%
set 1 raid on
print
select /dev/sdc
mklabel msdos
mkpart primary ext4 1MiB 100%
set 1 raid on
print
quit`} />
                          </div>
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">3. Создание программного RAID-1 массива (md1) из двух размеченных разделов:</div>
                          <CommandBlock command="mdadm --create --verbose /dev/md1 --level=1 --raid-devices=2 /dev/sdb1 /dev/sdc1" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">4. Сохранение конфигурации RAID-массива в конфигурационный файл для автосборки при загрузке:</div>
                          <CommandBlock command="mdadm --detail --scan --brief >> /etc/mdadm.conf" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">5. Создание таблицы разделов и раздела на RAID-массиве:</div>
                          <CommandBlock command="parted -s /dev/md1 mklabel msdos mkpart primary ext4 1MiB 100%" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">6. Форматирование созданного RAID-массива в файловую систему ext4:</div>
                          <CommandBlock command="mkfs.ext4 /dev/md1" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">7. Создание точки монтирования для RAID-массива:</div>
                          <CommandBlock command="mkdir -p /raid" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">8. Создание резервной копии конфигурационного файла fstab:</div>
                          <CommandBlock command="cp /etc/fstab /etc/fstab.back" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">9. Добавление записи монтирования RAID-массива в автозагрузку (/etc/fstab):</div>
                          <CommandBlock command='echo "/dev/md1 /raid ext4 defaults 0 2" >> /etc/fstab' />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">10. Монтирование всех файловых систем, описанных в fstab:</div>
                          <CommandBlock command="mount -a" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">11. Проверка типов и статуса смонтированных разделов:</div>
                          <CommandBlock command="df -T" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionItem>

              <AccordionItem title="Задание 3. Настройте сервер сетевой файловой системы" level={2}>
                <div className="space-y-4">
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    Для организации сетевого файлового хранилища настраивается служба NFS (Network File System). Общий каталог на сервере <code className="text-emerald-400 font-mono text-xs bg-zinc-900/80 px-1.5 py-0.5 rounded border border-zinc-800/80">HQ-SRV</code> предоставляется в пользование клиенту <code className="text-emerald-400 font-mono text-xs bg-zinc-900/80 px-1.5 py-0.5 rounded border border-zinc-800/80">HQ-CLI</code> с настройкой автоматического монтирования при загрузке.
                  </p>

                  <div className="space-y-6">
                    {/* HQ-SRV */}
                    <div className="border border-zinc-800/40 bg-[#0d0e12]/30 p-6 rounded-xl space-y-4">
                      <div className="flex items-center justify-between mb-4 border-b border-zinc-800/60 pb-3">
                        <span className="text-base font-bold text-zinc-100 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                          <span>HQ-SRV</span>
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">1. Установка пакетов NFS-сервера и вспомогательных утилит:</div>
                          <CommandBlock command="apt-get update && apt-get install nfs-server nfs-utils -y" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">2. Создание сетевой папки на RAID-массиве:</div>
                          <CommandBlock command="mkdir /raid/nfs" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">3. Установка полных прав доступа на созданную папку:</div>
                          <CommandBlock command="chmod 777 /raid/nfs" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">4. Резервное копирование конфигурационного файла экспорта NFS:</div>
                          <CommandBlock command="cp /etc/exports /etc/exports.back" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">5. Разрешение доступа к папке для подсети клиентов с правами записи:</div>
                          <CommandBlock command='echo "/raid/nfs 192.168.2.0/27(rw,no_subtree_check,no_root_squash)" >> /etc/exports' />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">6. Добавление службы nfs-server в автозагрузку и ее запуск:</div>
                          <CommandBlock command="systemctl enable --now nfs-server" />
                        </div>
                      </div>
                    </div>

                    {/* HQ-CLI */}
                    <div className="border border-zinc-800/40 bg-[#0d0e12]/30 p-6 rounded-xl space-y-4">
                      <div className="flex items-center justify-between mb-4 border-b border-zinc-800/60 pb-3">
                        <span className="text-base font-bold text-zinc-100 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                          <span>HQ-CLI</span>
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-3 p-4 border border-red-500/20 bg-red-500/5 rounded-xl text-red-400 mb-2">
                          <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                          <span className="text-sm font-semibold">Работаем в консольной оболочке HQ-CLI (под пользователем root)</span>
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">1. Создание точки монтирования для сетевого хранилища:</div>
                          <CommandBlock command="mkdir /mnt/nfs" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">2. Установка полных прав доступа на точку монтирования:</div>
                          <CommandBlock command="chmod -R 777 /mnt/nfs" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">3. Проверка доступных для монтирования NFS-ресурсов на сервере HQ-SRV:</div>
                          <CommandBlock command="showmount -e hq-srv" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">4. Резервное копирование файла конфигурации fstab:</div>
                          <CommandBlock command="cp /etc/fstab /etc/fstab.back" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">5. Настройка автоматического монтирования сетевой папки при загрузке системы (/etc/fstab):</div>
                          <CommandBlock command='echo "192.168.1.10:/raid/nfs /mnt/nfs nfs rw,soft,_netdev 0 0 " >> /etc/fstab' />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">6. Монтирование файловых систем для проверки внесенной конфигурации:</div>
                          <CommandBlock command="mount -av" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">7. Проверка успешности монтирования и параметров сетевого диска:</div>
                          <CommandBlock command="df -T" />
                        </div>
                      </div>
                    </div>

                    {/* Verification */}
                    <div className="border border-zinc-800/40 bg-zinc-950/10 p-6 rounded-xl space-y-4">
                      <div className="text-sm font-bold text-zinc-200 border-b border-zinc-800/60 pb-3 flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-emerald-400" />
                        <span>Верификация совместного доступа</span>
                      </div>

                      <div className="space-y-4 text-sm text-zinc-300">
                        <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl space-y-3">
                          <div className="font-semibold text-emerald-400">Шаг 1. Действия на клиенте HQ-CLI:</div>
                          <p>Создайте тестовый файл на примонтированном сетевом диске и проверьте права:</p>
                          <CommandBlock command="touch /mnt/nfs/test_file" />
                          <CommandBlock command="ls -l /mnt/nfs/test_file" />
                        </div>

                        <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl space-y-3">
                          <div className="font-semibold text-emerald-400">Шаг 2. Действия на сервере HQ-SRV:</div>
                          <p>Убедитесь, что созданный клиентом файл отображается на локальном RAID-массиве сервера:</p>
                          <CommandBlock command="ls -l /raid/nfs" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionItem>

              <AccordionItem title="Задание 4. Настройте службу сетевого времени на базе сервиса chrony" level={2}>
                <div className="space-y-4">
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    Для обеспечения точной синхронизации времени в локальной сети настраивается служба NTP-клиентов и серверов на базе <code className="text-emerald-400 font-mono text-xs bg-zinc-900/80 px-1.5 py-0.5 rounded border border-zinc-800/80">chrony</code>. Пограничный маршрутизатор <code className="text-emerald-400 font-mono text-xs bg-zinc-900/80 px-1.5 py-0.5 rounded border border-zinc-800/80">ISP</code> настраивается в качестве локального источника точного времени (Stratum 6), а остальные хосты синхронизируются с ним.
                  </p>

                  <div className="space-y-6">
                    {/* ISP */}
                    <div className="border border-zinc-800/40 bg-[#0d0e12]/30 p-6 rounded-xl space-y-4">
                      <div className="flex items-center justify-between mb-4 border-b border-zinc-800/60 pb-3">
                        <span className="text-base font-bold text-zinc-100 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                          <span>ISP</span>
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">1. Разрешение работы chrony в качестве NTP-сервера в системе:</div>
                          <CommandBlock command="control chrony server" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">2. Корректировка параметров пулов времени в файле /etc/chrony.conf:</div>
                          <CommandBlock command="sed -i 's/pool pool.ntp.org iburst/pool pool.ntp.org iburst prefer minstratum 4/' /etc/chrony.conf | grep pool /etc/chrony.conf" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">3. Активация локального stratum 6 для работы без внешнего интернета:</div>
                          <CommandBlock command={'sed -i \'s/\\#local stratum 10/local stratum 6/\' /etc/chrony.conf | grep "local stratum" /etc/chrony.conf'} />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">4. Перезапуск службы chronyd для применения настроек:</div>
                          <CommandBlock command="systemctl restart chronyd" />
                        </div>
                      </div>
                    </div>

                    {/* HQ-SRV, BR-RTR, BR-SRV */}
                    <div className="border border-zinc-800/40 bg-[#0d0e12]/30 p-6 rounded-xl space-y-4">
                      <div className="flex items-center justify-between mb-4 border-b border-zinc-800/60 pb-3">
                        <span className="text-base font-bold text-zinc-100 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                          <span>Клиенты синхронизации (HQ-SRV, BR-RTR, BR-SRV)</span>
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">1. Перенаправление пула времени на локальный адрес ISP (172.16.1.1) и перезапуск службы chronyd:</div>
                          <CommandBlock command="sed -i 's/pool pool.ntp.org iburst/server 172.16.1.1 iburst/' /etc/chrony.conf && systemctl restart chronyd" />
                        </div>

                        <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl space-y-2 text-sm text-zinc-300">
                          <div className="font-semibold text-emerald-400">2. Проверка источников времени (выполняется через 10 секунд после перезапуска):</div>
                          <CommandBlock command="chronyc sources" />
                          <div className="mt-2 text-xs text-zinc-400">
                            Ожидаемый вывод команды (в качестве активного источника должен определиться ISP):
                            <pre className="p-3 rounded-lg bg-[#050608] border border-zinc-800/60 text-zinc-300 font-mono text-xs mt-1 overflow-x-auto">
{`MS Name/IP address         Stratum Poll Reach LastRx Last sample               
===============================================================================
^* 172.16.1.1                    5   6    17     1  +1438ns[  +43us] +/-   38ms`}
                            </pre>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* HQ-CLI */}
                    <div className="border border-zinc-800/40 bg-[#0d0e12]/30 p-6 rounded-xl space-y-4">
                      <div className="flex items-center justify-between mb-4 border-b border-zinc-800/60 pb-3">
                        <span className="text-base font-bold text-zinc-100 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                          <span>HQ-CLI</span>
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">1. Добавление локального NTP-сервера ISP в конец файла конфигурации и перезапуск chronyd:</div>
                          <CommandBlock command='echo "server 172.16.1.1 iburst" >> /etc/chrony.conf && systemctl restart chronyd' />
                        </div>

                        <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl space-y-2 text-sm text-zinc-300">
                          <div className="font-semibold text-emerald-400">2. Проверка источников синхронизации времени (выполняется через 10 секунд):</div>
                          <CommandBlock command="chronyc sources" />
                          <div className="mt-2 text-xs text-zinc-400">
                            Ожидаемый вывод:
                            <pre className="p-3 rounded-lg bg-[#050608] border border-zinc-800/60 text-zinc-300 font-mono text-xs mt-1 overflow-x-auto">
{`MS Name/IP address         Stratum Poll Reach LastRx Last sample               
===============================================================================
^? 192.168.1.1                   0   6    0      -     +0ns[  +0us]  +/-    0ms
^* 172.16.1.1                    5   6    17     1  +1438ns[  +43us] +/-   38ms`}
                            </pre>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionItem>

              <AccordionItem title="Задание 5. Сконфигурируйте ansible на сервере BR-SRV" level={2}>
                <div className="space-y-4">
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    Для автоматизации управления конфигурациями и удаленного администрирования узлов на сервере <code className="text-emerald-400 font-mono text-xs bg-zinc-900/80 px-1.5 py-0.5 rounded border border-zinc-800/80">BR-SRV</code> настраивается система управления конфигурациями <code className="text-emerald-400 font-mono text-xs bg-zinc-900/80 px-1.5 py-0.5 rounded border border-zinc-800/80">Ansible</code>. Настраивается файл инвентаря с реквизитами доступа к остальным узлам лабораторного стенда и отключается строгая проверка SSH-ключей.
                  </p>

                  <div className="space-y-6">
                    {/* BR-SRV */}
                    <div className="border border-zinc-800/40 bg-[#0d0e12]/30 p-6 rounded-xl space-y-4">
                      <div className="flex items-center justify-between mb-4 border-b border-zinc-800/60 pb-3">
                        <span className="text-base font-bold text-zinc-100 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                          <span>BR-SRV</span>
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">1. Установка Ansible и sshpass (для аутентификации по паролю):</div>
                          <CommandBlock command="apt-get install ansible sshpass -y" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">2. Резервное копирование оригинального файла конфигурации Ansible:</div>
                          <CommandBlock command="cp -r /etc/ansible/ansible.cfg /etc/ansible/ansible.cfg.back" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">3. Удаление дефолтного конфигурационного файла для создания чистого:</div>
                          <CommandBlock command="rm -rf /etc/ansible/ansible.cfg" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">4. Открытие нового файла конфигурации Ansible в редакторе vim:</div>
                          <CommandBlock command="vim /etc/ansible/ansible.cfg" />
                        </div>

                        <div className="p-4 bg-[#0d0e12]/30 border border-zinc-800/40 rounded-xl space-y-2 text-sm text-zinc-300 leading-relaxed">
                          <div className="font-semibold text-emerald-400">5. Редактирование конфигурации в vim:</div>
                          <p>Впишите в самое начало файла следующие строки:</p>
                          <pre className="p-4 rounded-lg bg-[#050608] border border-zinc-800/60 text-zinc-200 font-mono text-xs leading-relaxed overflow-x-auto select-all my-2">
{`[defaults]
host_key_checking = False
interpreter_python=/usr/bin/python3
inventory       = /etc/ansible/hosts`}
                          </pre>
                          <p className="text-xs text-zinc-500 mt-1">Для начала редактирования нажмите клавишу <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">i</kbd> (режим Insert). Убедитесь, что активна английская раскладка клавиатуры.</p>
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">6. Сохранение изменений и выход из редактора vim:</div>
                          <p className="text-xs text-zinc-500 mb-1">Нажмите клавишу <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Esc</kbd>, введите команду ниже и нажмите <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Enter</kbd>:</p>
                          <CommandBlock command=":wq" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">7. Открытие файла инвентаря hosts в редакторе vim:</div>
                          <CommandBlock command="vim /etc/ansible/hosts" />
                        </div>

                        <div className="p-4 bg-[#0d0e12]/30 border border-zinc-800/40 rounded-xl space-y-2 text-sm text-zinc-300 leading-relaxed">
                          <div className="font-semibold text-emerald-400">8. Редактирование конфигурации в vim:</div>
                          <p>Впишите в самое начало файла следующие строки:</p>
                          <pre className="p-4 rounded-lg bg-[#050608] border border-zinc-800/60 text-zinc-200 font-mono text-xs leading-relaxed overflow-x-auto select-all my-2">
{`HQ-SRV ansible_user=user ansible_password=resu ansible_port=2011
HQ-RTR ansible_user=net_admin ansible_password=P@ssw0rd ansible_port=2011
BR-RTR ansible_user=net_admin ansible_password=P@ssw0rd ansible_port=2011
HQ-CLI ansible_user=user ansible_password=resu ansible_port=2011`}
                          </pre>
                          <p className="text-xs text-zinc-500 mt-1">Для начала редактирования нажмите клавишу <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">i</kbd> (режим Insert). Убедитесь, что активна английская раскладка клавиатуры.</p>
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">9. Сохранение изменений и выход из редактора vim:</div>
                          <p className="text-xs text-zinc-500 mb-1">Нажмите клавишу <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Esc</kbd>, введите команду ниже и нажмите <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Enter</kbd>:</p>
                          <CommandBlock command=":wq" />
                        </div>

                        <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl space-y-3 text-sm text-zinc-300">
                          <div className="font-semibold text-emerald-400">10. Проверка доступности и состояния SSH-службы на всех настроенных хостах:</div>
                          <p>Запустите команду пингования всех хостов из инвентаря через Ansible:</p>
                          <CommandBlock command="ansible all -m ping" />
                          <div className="mt-2 text-xs text-zinc-400">
                            Ожидаемый ответ от всех хостов (каждый хост должен успешно ответить <code className="text-emerald-400 font-bold">"pong"</code>):
                            <pre className="p-3 rounded-lg bg-[#050608] border border-zinc-800/60 font-mono text-xs mt-1 overflow-x-auto text-emerald-400 font-medium">
{`HQ-SRV | SUCCESS => {
    "changed": false,
    "ping": "pong"
}
HQ-RTR | SUCCESS => {
    "changed": false,
    "ping": "pong"
}
BR-RTR | SUCCESS => {
    "changed": false,
    "ping": "pong"
}
HQ-CLI | SUCCESS => {
    "changed": false,
    "ping": "pong"
}`}
                            </pre>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionItem>

              <AccordionItem title="Задание 6. Разверните веб приложение в docker на сервере BR-SRV" level={2}>
                <div className="space-y-4">
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    Для развертывания веб-приложения на сервере <code className="text-emerald-400 font-mono text-xs bg-zinc-900/80 px-1.5 py-0.5 rounded border border-zinc-800/80">BR-SRV</code> используется технология контейнеризации Docker. Устанавливается Docker Engine, монтируется дистрибутив с архивами образов, загружаются Docker-образы приложения и базы данных, а затем запускается стек через Docker Compose с обеспечением постоянного хранения данных.
                  </p>

                  <div className="space-y-6">
                    {/* BR-SRV */}
                    <div className="border border-zinc-800/40 bg-[#0d0e12]/30 p-6 rounded-xl space-y-4">
                      <div className="flex items-center justify-between mb-4 border-b border-zinc-800/60 pb-3">
                        <span className="text-base font-bold text-zinc-100 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                          <span>BR-SRV</span>
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">1. Установка Docker Engine и плагина Docker Compose:</div>
                          <CommandBlock command="apt-get install docker-engine docker-compose-v2 -y" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">2. Добавление службы Docker в автозагрузку и ее запуск:</div>
                          <CommandBlock command="systemctl enable --now docker.service" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">3. Монтирование ISO-образа/диска для доступа к архивам Docker-образов:</div>
                          <CommandBlock command="mount -o loop /dev/sr0 /mnt/ -v" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">4. Просмотр содержимого каталога с Docker-образами:</div>
                          <CommandBlock command="ls -l /mnt/docker/" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">5. Просмотр файла инструкций readme.txt:</div>
                          <CommandBlock command="cat /mnt/docker/readme.txt" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">6. Импорт Docker-образа веб-приложения из архива:</div>
                          <CommandBlock command="docker load < /mnt/docker/site_latest.tar" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">7. Импорт Docker-образа СУБД MariaDB из архива:</div>
                          <CommandBlock command="docker load < /mnt/docker/mariadb_latest.tar" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">8. Просмотр списка импортированных Docker-образов в системе:</div>
                          <CommandBlock command="docker image ls" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">9. Создание конфигурационного файла docker-compose.yml:</div>
                          <CommandBlock command={`cat << EOF > docker-compose.yml
services:
  database:
    container_name: db
    image: mariadb:latest
    restart: always
    ports: 
      - "3306:3306"
    environment:
      MARIADB_DATABASE: testdb1
      MARIADB_USER: test1c
      MARIADB_PASSWORD: P@ssw0rd
      MARIADB_ROOT_PASSWORD: P@ssw0rd
    volumes:
      - db_data:/var/lib/mysql
      
  app:
    container_name: site
    image: site:latest
    restart: always
    ports: 
      - "8081:8000"
    environment: 
      DB_HOST: database
      DB_PORT: 3306
      DB_NAME: testdb1
      DB_USER: test1c
      DB_PASS: P@ssw0rd
      DB_TYPE: maria
    depends_on: 
      - database
volumes:
  db_data:
EOF`} />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">10. Проверка конфигурации docker-compose на наличие синтаксических ошибок:</div>
                          <CommandBlock command="docker compose config" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">11. Фоновый запуск сервисов приложения и базы данных:</div>
                          <CommandBlock command="docker compose up -d" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">12. Проверка состояния запущенных контейнеров:</div>
                          <CommandBlock command="docker ps" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">13. Проверка прослушивания порта 8080 сетевой службой:</div>
                          <CommandBlock command="ss -ltnp4 | grep 8080" />
                        </div>
                      </div>
                    </div>

                    {/* HQ-CLI Verification */}
                    <div className="border border-zinc-800/40 bg-zinc-950/10 p-6 rounded-xl space-y-4">
                      <div className="text-sm font-bold text-zinc-200 border-b border-zinc-800/60 pb-3 flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-emerald-400" />
                        <span>Верификация веб-приложения с клиента HQ-CLI</span>
                      </div>

                      <div className="space-y-6 text-sm text-zinc-300">
                        <div className="flex items-center gap-3 p-4 border border-blue-500/20 bg-blue-500/5 rounded-xl text-blue-400 mb-2">
                          <Terminal className="w-5 h-5 flex-shrink-0" />
                          <span className="text-sm font-semibold">Работаем в графической оболочке HQ-CLI (под пользователем user)</span>
                        </div>

                        <div className="p-4 bg-[#0d0e12]/30 border border-zinc-800/40 rounded-xl space-y-4">
                          <div className="font-semibold text-emerald-400">Шаг 1. Первичный доступ к веб-странице:</div>
                          <p>Откройте веб-браузер и перейдите по IP-адресу сервера на порт 8081: <code className="text-zinc-200 bg-zinc-900/60 px-1.5 py-0.5 rounded border border-zinc-800/80 font-mono text-xs">http://192.168.3.10:8081/</code></p>
                          
                          <div className="p-4 border border-blue-500/20 bg-blue-500/5 rounded-xl text-blue-400 text-xs">
                            <span className="font-semibold">Пометка:</span> По заданию мы должны попадать на сайт через домен <code className="text-zinc-200 bg-zinc-900/60 px-1 py-0.5 rounded border border-zinc-800/80 font-mono text-xs">docker.au-team.irpo</code>, но мы пока этого сделать не можем, так как у нас не настроен реверс-прокси на <code className="text-zinc-200 bg-zinc-900/60 px-1 py-0.5 rounded border border-zinc-800/80 font-mono text-xs">ISP (nginx)</code> (выполняется в задании №9).
                          </div>

                          <div className="rounded-xl overflow-hidden border border-zinc-800/80 bg-zinc-950/40 my-4 shadow-inner max-w-[700px] w-full flex-shrink-0">
                            <Image
                              src="/screenshot/doc1.png"
                              alt="Первый запуск приложения"
                              width={700}
                              height={394}
                              className="w-full h-auto object-contain opacity-90 transition-opacity hover:opacity-100 duration-300"
                            />
                          </div>
                        </div>

                        <div className="p-4 bg-[#0d0e12]/30 border border-zinc-800/40 rounded-xl space-y-4">
                          <div className="font-semibold text-emerald-400">Шаг 2. Создание записи в базе данных:</div>
                          <p>Заполните форму на сайте произвольными текстовыми данными и сохраните запись:</p>
                          
                          <div className="grid grid-cols-1 gap-4 my-4">
                            <div className="rounded-xl overflow-hidden border border-zinc-800/80 bg-zinc-950/40 shadow-inner max-w-[700px] w-full flex-shrink-0">
                              <Image
                                src="/screenshot/doc2.png"
                                alt="Заполнение формы"
                                width={700}
                                height={394}
                                className="w-full h-auto object-contain opacity-90"
                              />
                            </div>
                            <div className="rounded-xl overflow-hidden border border-zinc-800/80 bg-zinc-950/40 shadow-inner max-w-[700px] w-full flex-shrink-0">
                              <Image
                                src="/screenshot/doc3.png"
                                alt="Подтверждение сохранения"
                                width={700}
                                height={394}
                                className="w-full h-auto object-contain opacity-90"
                              />
                            </div>
                            <div className="rounded-xl overflow-hidden border border-zinc-800/80 bg-zinc-950/40 shadow-inner max-w-[700px] w-full flex-shrink-0">
                              <Image
                                src="/screenshot/doc4.png"
                                alt="Созданная запись"
                                width={700}
                                height={394}
                                className="w-full h-auto object-contain opacity-90"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="p-4 bg-[#0d0e12]/30 border border-zinc-800/40 rounded-xl space-y-4">
                          <div className="font-semibold text-emerald-400">Шаг 3. Симуляция сбоя и удаления контейнеров:</div>
                          <p>На сервере <code className="text-zinc-200 bg-zinc-900/60 px-1 py-0.5 rounded border border-zinc-800/80 font-mono text-xs">BR-SRV</code> принудительно остановите и удалите все активные контейнеры:</p>
                          <CommandBlock command="docker rm -f $(docker ps -qa)" />
                          <p>Обновите страницу в браузере на клиенте <code className="text-zinc-200 bg-zinc-900/60 px-1 py-0.5 rounded border border-zinc-800/80 font-mono text-xs">HQ-CLI</code> и проверьте, что сайт перестал работать:</p>
                          
                          <div className="rounded-xl overflow-hidden border border-zinc-800/80 bg-zinc-950/40 my-4 shadow-inner max-w-[700px] w-full flex-shrink-0">
                            <Image
                              src="/screenshot/doc5.png"
                              alt="Сайт недоступен"
                              width={700}
                              height={394}
                              className="w-full h-auto object-contain opacity-90"
                            />
                          </div>
                        </div>

                        <div className="p-4 bg-[#0d0e12]/30 border border-zinc-800/40 rounded-xl space-y-4">
                          <div className="font-semibold text-emerald-400">Шаг 4. Восстановление работы и проверка сохранности данных:</div>
                          <p>Заново разверните стек Docker Compose на сервере <code className="text-zinc-200 bg-zinc-900/60 px-1 py-0.5 rounded border border-zinc-800/80 font-mono text-xs">BR-SRV</code>:</p>
                          <CommandBlock command="docker compose up -d" />
                          <p>Обновите страницу в веб-клиенте. Сайт должен успешно загрузиться, а созданная вами ранее запись должна остаться на месте благодаря примонтированному тому базы данных:</p>
                          
                          <div className="rounded-xl overflow-hidden border border-zinc-800/80 bg-zinc-950/40 my-4 shadow-inner max-w-[700px] w-full flex-shrink-0">
                            <Image
                              src="/screenshot/doc6.png"
                              alt="Сайт восстановлен, данные сохранены"
                              width={700}
                              height={394}
                              className="w-full h-auto object-contain opacity-90"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionItem>

              <AccordionItem title="Задание 7. Разверните веб приложение на сервере HQ-SRV" level={2}>
                <div className="space-y-4">
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    Для развертывания веб-приложения на сервере <code className="text-emerald-400 font-mono text-xs bg-zinc-900/80 px-1.5 py-0.5 rounded border border-zinc-800/80">HQ-SRV</code> настраивается классический LAMP-стек (Linux, Apache, MariaDB, PHP). Веб-приложение копируется со смонтированного диска, разворачивается локальная база данных из дампа SQL, настраиваются параметры подключения в конфигурации PHP и запускается веб-сервер Apache.
                  </p>

                  <div className="space-y-6">
                    {/* HQ-SRV */}
                    <div className="border border-zinc-800/40 bg-[#0d0e12]/30 p-6 rounded-xl space-y-4">
                      <div className="flex items-center justify-between mb-4 border-b border-zinc-800/60 pb-3">
                        <span className="text-base font-bold text-zinc-100 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                          <span>HQ-SRV</span>
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">1. Монтирование ISO-образа/диска для доступа к исходным файлам сайта:</div>
                          <CommandBlock command="mount -o loop /dev/sr0 /mnt/ -v" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">2. Установка серверного веб-стека (Apache, MariaDB, PHP):</div>
                          <CommandBlock command="apt-get install lamp-server -y" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">3. Копирование PHP-файла приложения в корневой каталог веб-сервера:</div>
                          <CommandBlock command="cp /mnt/web/index.php /var/www/html" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">4. Копирование логотипа веб-приложения:</div>
                          <CommandBlock command="cp /mnt/web/logo.png /var/www/html" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">5. Включение в автозагрузку и немедленный запуск СУБД MariaDB:</div>
                          <CommandBlock command="systemctl enable --now mariadb" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">6. Создание пустой базы данных webdb для приложения:</div>
                          <CommandBlock command='mariadb -e "CREATE DATABASE webdb;"' />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">7. Создание пользователя БД web с паролем P@ssw0rd и предоставление прав:</div>
                          <CommandBlock command={`mariadb -e "
CREATE USER 'web1'@'localhost' IDENTIFIED BY 'P@ssw0rd';
GRANT ALL PRIVILEGES ON webdb.* TO 'web1'@'localhost';
"`} />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">8. Развертывание таблиц и структуры базы данных из дампа SQL:</div>
                          <CommandBlock command="mariadb webdb < /mnt/web/dump.sql" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">9. Проверка успешности импорта и списка таблиц в базе данных:</div>
                          <CommandBlock command='mariadb -e "USE webdb; SHOW TABLES;"' />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">10. Открытие файла конфигурации index.php in редакторе vim:</div>
                          <CommandBlock command="vim /var/www/html/index.php" />
                        </div>

                        <div className="p-4 bg-[#0d0e12]/30 border border-zinc-800/40 rounded-xl space-y-2 text-sm text-zinc-300 leading-relaxed">
                          <div className="font-semibold text-emerald-400">11. Редактирование конфигурации подключения к СУБД в vim:</div>
                          <p>Найдите переменные подключения и впишите следующие параметры:</p>
                          <pre className="p-4 rounded-lg bg-[#050608] border border-zinc-800/60 text-zinc-200 font-mono text-xs leading-relaxed overflow-x-auto select-all my-2">
{`$servername = "localhost";
$username = "web1";
$password = "P@ssw0rd";
$dbname = "webdb";`}
                          </pre>
                          <p className="text-xs text-zinc-500 mt-1">Для начала редактирования нажмите клавишу <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">i</kbd> (режим Insert). Убедитесь, что активна английская раскладка клавиатуры.</p>
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">12. Сохранение изменений и выход из редактора vim:</div>
                          <p className="text-xs text-zinc-500 mb-1">Нажмите клавишу <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Esc</kbd>, введите команду ниже и нажмите <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Enter</kbd>:</p>
                          <CommandBlock command=":wq!" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">13. Включение в автозагрузку и немедленный запуск веб-сервера Apache (httpd2):</div>
                          <CommandBlock command="systemctl enable --now httpd2.service" />
                        </div>
                      </div>
                    </div>

                    {/* HQ-CLI Verification */}
                    <div className="border border-zinc-800/40 bg-zinc-950/10 p-6 rounded-xl space-y-4">
                      <div className="text-sm font-bold text-zinc-200 border-b border-zinc-800/60 pb-3 flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-emerald-400" />
                        <span>Верификация веб-сайта с клиента HQ-CLI</span>
                      </div>

                      <div className="space-y-6 text-sm text-zinc-300">
                        <div className="flex items-center gap-3 p-4 border border-blue-500/20 bg-blue-500/5 rounded-xl text-blue-400 mb-2">
                          <Terminal className="w-5 h-5 flex-shrink-0" />
                          <span className="text-sm font-semibold">Работаем в графической оболочке HQ-CLI (под пользователем user)</span>
                        </div>

                        <div className="p-4 bg-[#0d0e12]/30 border border-zinc-800/40 rounded-xl space-y-4">
                          <div className="font-semibold text-emerald-400">Шаг 1. Проверка доступности веб-сервера:</div>
                          <p>Откройте веб-браузер и введите IP-адрес сервера: <code className="text-zinc-200 bg-zinc-900/60 px-1.5 py-0.5 rounded border border-zinc-800/80 font-mono text-xs">http://192.168.1.10/</code></p>
                          
                          <div className="p-4 border border-blue-500/20 bg-blue-500/5 rounded-xl text-blue-400 text-xs">
                            <span className="font-semibold">Пометка:</span> По заданию мы должны попадать на сайт через домен <code className="text-zinc-200 bg-zinc-900/60 px-1 py-0.5 rounded border border-zinc-800/80 font-mono text-xs">web.au-team.irpo</code> с аутентификацией по паролю, но мы пока этого сделать не можем, так как у нас не настроен реверс-прокси на <code className="text-zinc-200 bg-zinc-900/60 px-1 py-0.5 rounded border border-zinc-800/80 font-mono text-xs">ISP (nginx)</code> (выполняется в задании №9).
                          </div>

                          <div className="rounded-xl overflow-hidden border border-zinc-800/80 bg-zinc-950/40 my-4 shadow-inner max-w-[700px] w-full flex-shrink-0">
                            <Image
                              src="/screenshot/site1.png"
                              alt="Развернутый веб-сайт"
                              width={700}
                              height={394}
                              className="w-full h-auto object-contain opacity-90 transition-opacity hover:opacity-100 duration-300"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionItem>

              <AccordionItem title="Задание 8. На маршрутизаторах сконфигурируйте статическую трансляцию портов" level={2}>
                <div className="space-y-4">
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    Для обеспечения доступа к внутренним веб-сервисам и службам из внешней сети на маршрутизаторах <code className="text-emerald-400 font-mono text-xs bg-zinc-900/80 px-1.5 py-0.5 rounded border border-zinc-800/80">HQ-RTR</code> и <code className="text-purple-400 font-mono text-xs bg-zinc-900/80 px-1.5 py-0.5 rounded border border-zinc-800/80">BR-RTR</code> настраивается статическая трансляция портов (DNAT) с помощью межсетевого экрана <code className="text-emerald-400 font-mono text-xs bg-zinc-900/80 px-1.5 py-0.5 rounded border border-zinc-800/80">nftables</code>. Это перенаправит входящие запросы на соответствующие порты внутренних серверов.
                  </p>

                  <div className="space-y-6">
                    {/* HQ-RTR */}
                    <div className="border border-zinc-800/40 bg-[#0d0e12]/30 p-6 rounded-xl space-y-4">
                      <div className="flex items-center justify-between mb-4 border-b border-zinc-800/60 pb-3">
                        <span className="text-base font-bold text-zinc-100 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                          <span>HQ-RTR</span>
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">1. Добавление цепочки prerouting в таблицу nat для обработки входящего DNAT:</div>
                          <CommandBlock command="nft add chain nat prerouting { type nat hook prerouting priority dstnat \; }" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">2. Проброс SSH-порта 2011 на внутренний сервер HQ-SRV:</div>
                          <CommandBlock command='nft add rule nat prerouting iif "enp7s1" tcp dport 2011 dnat to 192.168.1.10' />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">3. Проброс веб-порта 8081 на внутренний веб-сервер HQ-SRV (порт 80):</div>
                          <CommandBlock command='nft add rule nat prerouting iif "enp7s1" tcp dport 8081 dnat to 192.168.1.10:80' />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">4. Просмотр текущего набора правил nftables для проверки:</div>
                          <CommandBlock command="nft list ruleset" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">5. Сохранение конфигурации nftables в файл для автозапуска при загрузке:</div>
                          <CommandBlock command="nft list ruleset > /etc/nftables/nftables.nft" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">6. Перезапуск службы nftables для проверки корректности сохраненной конфигурации:</div>
                          <CommandBlock command="systemctl restart nftables" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">7. Финальная проверка примененных правил nftables:</div>
                          <CommandBlock command="nft list ruleset" />
                        </div>
                      </div>
                    </div>

                    {/* BR-RTR */}
                    <div className="border border-zinc-800/40 bg-[#0d0e12]/30 p-6 rounded-xl space-y-4">
                      <div className="flex items-center justify-between mb-4 border-b border-zinc-800/60 pb-3">
                        <span className="text-base font-bold text-zinc-100 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                          <span>BR-RTR</span>
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">1. Добавление цепочки prerouting в таблицу nat для обработки входящего DNAT:</div>
                          <CommandBlock command="nft add chain nat prerouting { type nat hook prerouting priority dstnat \; }" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">2. Проброс портов 8081 (веб) и 2011 (SSH) на внутренний сервер BR-SRV (192.168.3.10):</div>
                          <CommandBlock command='nft add rule nat prerouting iif "enp7s1" tcp dport { 8081, 2011 } dnat to 192.168.3.10' />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">3. Просмотр текущего набора правил nftables для проверки:</div>
                          <CommandBlock command="nft list ruleset" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">4. Сохранение конфигурации nftables в файл для автозапуска при загрузке:</div>
                          <CommandBlock command="nft list ruleset > /etc/nftables/nftables.nft" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">5. Перезапуск службы nftables для проверки корректности сохраненной конфигурации:</div>
                          <CommandBlock command="systemctl restart nftables" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">6. Финальная проверка примененных правил nftables:</div>
                          <CommandBlock command="nft list ruleset" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionItem>

              <AccordionItem title="Задание 9. Настройте веб-сервер nginx как обратный прокси-сервер на ISP" level={2}>
                <div className="space-y-4">
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    Для маршрутизации веб-запросов к внутренним сервисам через доменные имена на пограничном маршрутизаторе <code className="text-emerald-400 font-mono text-xs bg-zinc-900/80 px-1.5 py-0.5 rounded border border-zinc-800/80">ISP</code> настраивается веб-сервер <code className="text-emerald-400 font-mono text-xs bg-zinc-900/80 px-1.5 py-0.5 rounded border border-zinc-800/80">Nginx</code> в режиме обратного прокси-сервера (reverse proxy). Создаются виртуальные хосты для доменов <code className="text-zinc-200 bg-zinc-900/60 px-1 py-0.5 rounded border border-zinc-800/80 font-mono text-xs">web.au-team.irpo</code> и <code className="text-zinc-200 bg-zinc-900/60 px-1 py-0.5 rounded border border-zinc-800/80 font-mono text-xs">docker.au-team.irpo</code>, перенаправляющие трафик на соответствующие внутренние порты.
                  </p>

                  <div className="space-y-6">
                    {/* ISP */}
                    <div className="border border-zinc-800/40 bg-[#0d0e12]/30 p-6 rounded-xl space-y-4">
                      <div className="flex items-center justify-between mb-4 border-b border-zinc-800/60 pb-3">
                        <span className="text-base font-bold text-zinc-100 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                          <span>ISP</span>
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">1. Обновление пакетной базы и установка веб-сервера Nginx:</div>
                          <CommandBlock command="apt-get update && apt-get install nginx nano -y" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">2. Открытие нового конфигурационного файла виртуального хоста в редакторе nano:</div>
                          <CommandBlock command="nano /etc/nginx/sites-available.d/r-proxy.conf" />
                        </div>

                        <div className="p-4 bg-[#0d0e12]/30 border border-zinc-800/40 rounded-xl space-y-2 text-sm text-zinc-300 leading-relaxed">
                          <div className="font-semibold text-emerald-400">3. Редактирование конфигурации обратного прокси в nano:</div>
                          <p>Вставьте в файл следующие настройки для перенаправления доменных имен:</p>
                          <pre className="p-4 rounded-lg bg-[#050608] border border-zinc-800/60 text-zinc-200 font-mono text-xs leading-relaxed overflow-x-auto select-all my-2">
{`server {
  listen 80;
  server_name web.au-team.irpo;
  location / {
    proxy_pass http://172.16.1.10:8081;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    auth_basic "Restricted Access";
    auth_basic_user_file /etc/nginx/.htpasswd;
  }
}
server {
  listen 80;
  server_name docker.au-team.irpo;
  location / {
    proxy_pass http://172.16.2.10:8081;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}`}
                          </pre>
                          <p className="text-xs text-zinc-500 mt-2">После вставки сохраните файл: нажмите <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Ctrl + X</kbd>, затем <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Y</kbd> и подтвердите клавишей <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Enter</kbd>.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionItem>

              <AccordionItem title="Задание 10. На маршрутизаторе ISP настройте web-based аутентификацию" level={2}>
                <div className="space-y-4">
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    Для ограничения неавторизованного доступа к внутреннему веб-ресурсу на пограничном маршрутизаторе <code className="text-emerald-400 font-mono text-xs bg-zinc-900/80 px-1.5 py-0.5 rounded border border-zinc-800/80">ISP</code> настраивается базовая HTTP-аутентификация (Basic Auth). Создается символическая ссылка для активации виртуального хоста, генерируется хэш пароля пользователя <code className="text-zinc-200 bg-zinc-900/60 px-1.5 py-0.5 rounded border border-zinc-800/80 font-mono text-xs">Khariton</code> в файле htpasswd и перезапускается служба Nginx.
                  </p>

                  <div className="space-y-6">
                    {/* ISP */}
                    <div className="border border-zinc-800/40 bg-[#0d0e12]/30 p-6 rounded-xl space-y-4">
                      <div className="flex items-center justify-between mb-4 border-b border-zinc-800/60 pb-3">
                        <span className="text-base font-bold text-zinc-100 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                          <span>ISP</span>
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">1. Активация конфигурации обратного прокси через создание символической ссылки:</div>
                          <CommandBlock command="ln -s /etc/nginx/sites-available.d/r-proxy.conf /etc/nginx/sites-enabled.d/" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">2. Тестирование синтаксической корректности конфигурационных файлов Nginx:</div>
                          <CommandBlock command="nginx -t" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">3. Добавление веб-сервера Nginx в автозагрузку и его запуск:</div>
                          <CommandBlock command="systemctl enable --now nginx" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">4. Проверка текущего статуса запущенного веб-сервера Nginx:</div>
                          <CommandBlock command="systemctl status nginx" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">5. Установка утилиты htpasswd для генерации паролей:</div>
                          <CommandBlock command="apt-get install apache2-htpasswd -y" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">6. Создание файла паролей и добавление пользователя Khariton:</div>
                          <CommandBlock command="htpasswd -c /etc/nginx/.htpasswd Khariton" />
                          <div className="mt-1 text-xs text-zinc-500 leading-relaxed">
                            При запросе утилиты введите пароль: <code className="text-zinc-300 font-mono text-xs bg-zinc-900/60 px-1.5 py-0.5 rounded border border-zinc-800/80">P@ssw0rd</code> (потребуется ввести дважды).
                          </div>
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">7. Проверка содержимого сгенерированного файла паролей (просмотр хэша):</div>
                          <CommandBlock command="cat /etc/nginx/.htpasswd" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">8. Повторная валидация конфигурации перед перезапуском:</div>
                          <CommandBlock command="nginx -t" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">9. Перезапуск веб-сервера Nginx для применения настроек авторизации:</div>
                          <CommandBlock command="systemctl restart nginx" />
                        </div>
                      </div>
                    </div>

                    {/* HQ-CLI Verification */}
                    <div className="border border-zinc-800/40 bg-zinc-950/10 p-6 rounded-xl space-y-4">
                      <div className="text-sm font-bold text-zinc-200 border-b border-zinc-800/60 pb-3 flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-emerald-400" />
                        <span>Верификация доступа и авторизации с клиента HQ-CLI</span>
                      </div>

                      <div className="space-y-6 text-sm text-zinc-300">
                        <div className="flex items-center gap-3 p-4 border border-blue-500/20 bg-blue-500/5 rounded-xl text-blue-400 mb-2">
                          <Terminal className="w-5 h-5 flex-shrink-0" />
                          <span className="text-sm font-semibold">Работаем в графической оболочке HQ-CLI (под пользователем user)</span>
                        </div>

                        <div className="p-4 bg-[#0d0e12]/30 border border-zinc-800/40 rounded-xl space-y-4">
                          <div className="font-semibold text-emerald-400">Шаг 1. Доступ к защищенному сайту web.au-team.irpo:</div>
                          <p>Откройте браузер и перейдите по доменному адресу: <code className="text-zinc-200 bg-zinc-900/60 px-1.5 py-0.5 rounded border border-zinc-800/80 font-mono text-xs">http://web.au-team.irpo/</code>. Должно появиться окно ввода логина и пароля.</p>
                          <p className="text-xs text-zinc-400">Используйте учетные данные:</p>
                          <ul className="list-disc pl-5 text-xs text-zinc-400 space-y-1">
                            <li>Логин: <code className="text-zinc-200 font-mono text-xs">Khariton</code></li>
                            <li>Пароль: <code className="text-zinc-200 font-mono text-xs">P@ssw0rd</code></li>
                          </ul>

                          <div className="grid grid-cols-1 gap-4 my-4">
                            <div className="rounded-xl overflow-hidden border border-zinc-800/80 bg-zinc-950/40 shadow-inner max-w-[700px] w-full flex-shrink-0">
                              <Image
                                src="/screenshot/isp1.png"
                                alt="Окно HTTP Basic Auth"
                                width={700}
                                height={394}
                                className="w-full h-auto object-contain opacity-90"
                              />
                            </div>
                            <div className="rounded-xl overflow-hidden border border-zinc-800/80 bg-zinc-950/40 shadow-inner max-w-[700px] w-full flex-shrink-0">
                              <Image
                                src="/screenshot/isp2.png"
                                alt="Успешный вход на сайт"
                                width={700}
                                height={394}
                                className="w-full h-auto object-contain opacity-90"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="p-4 bg-[#0d0e12]/30 border border-zinc-800/40 rounded-xl space-y-4">
                          <div className="font-semibold text-emerald-400">Шаг 2. Доступ к сайту docker.au-team.irpo:</div>
                          <p>Перейдите по доменному адресу: <code className="text-zinc-200 bg-zinc-900/60 px-1.5 py-0.5 rounded border border-zinc-800/80 font-mono text-xs">http://docker.au-team.irpo/</code>. Сайт должен открываться без требования авторизации:</p>

                          <div className="rounded-xl overflow-hidden border border-zinc-800/80 bg-zinc-950/40 my-4 shadow-inner max-w-[700px] w-full flex-shrink-0">
                            <Image
                              src="/screenshot/isp3.png"
                              alt="Успешный вход на docker-сайт"
                              width={700}
                              height={394}
                              className="w-full h-auto object-contain opacity-90 transition-opacity hover:opacity-100 duration-300"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionItem>

              <AccordionItem title="Задание 11. Установите Яндекс Браузер" level={2}>
                <div className="space-y-4">
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    Для обеспечения веб-серфинга и работы с сетевыми ресурсами на клиентской машине <code className="text-emerald-400 font-mono text-xs bg-zinc-900/80 px-1.5 py-0.5 rounded border border-zinc-800/80">HQ-CLI</code> устанавливается отечественный веб-браузер <code className="text-emerald-400 font-mono text-xs bg-zinc-900/80 px-1.5 py-0.5 rounded border border-zinc-800/80">Яндекс Браузер</code>. Выполняется установка пакета, запуск браузера из графического интерфейса и фиксация установленной версии программы.
                  </p>

                  <div className="space-y-6">
                    {/* HQ-CLI Console */}
                    <div className="border border-zinc-800/40 bg-[#0d0e12]/30 p-6 rounded-xl space-y-4">
                      <div className="flex items-center justify-between mb-4 border-b border-zinc-800/60 pb-3">
                        <span className="text-base font-bold text-zinc-100 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                          <span>HQ-CLI (Установка)</span>
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-3 p-4 border border-red-500/20 bg-red-500/5 rounded-xl text-red-400 mb-2">
                          <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                          <span className="text-sm font-semibold">Работаем в консольной оболочке HQ-CLI (под пользователем root)</span>
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">1. Обновление пакетной базы и установка Yandex Browser:</div>
                          <CommandBlock command="apt-get update && apt-get install yandex-browser-stable -y" />
                        </div>
                      </div>
                    </div>

                    {/* HQ-CLI GUI */}
                    <div className="border border-zinc-800/40 bg-zinc-950/10 p-6 rounded-xl space-y-4">
                      <div className="text-sm font-bold text-zinc-200 border-b border-zinc-800/60 pb-3 flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-emerald-400" />
                        <span>Запуск и верификация в графическом интерфейсе</span>
                      </div>

                      <div className="space-y-6 text-sm text-zinc-300">
                        <div className="flex items-center gap-3 p-4 border border-blue-500/20 bg-blue-500/5 rounded-xl text-blue-400 mb-2">
                          <Terminal className="w-5 h-5 flex-shrink-0" />
                          <span className="text-sm font-semibold">Работаем в графической оболочке HQ-CLI (под пользователем user)</span>
                        </div>

                        <div className="p-4 bg-[#0d0e12]/30 border border-zinc-800/40 rounded-xl space-y-4">
                          <div className="font-semibold text-emerald-400">Шаг 1. Запуск браузера:</div>
                          <p>После успешной установки ярлык программы появится в основном меню приложений:</p>
                          <p className="text-xs text-zinc-400 font-semibold"><strong className="text-zinc-200">Меню → Интернет → Yandex Browser</strong></p>

                          <div className="rounded-xl overflow-hidden border border-zinc-800/80 bg-zinc-950/40 my-4 shadow-inner max-w-[700px] w-full flex-shrink-0">
                            <Image
                              src="/screenshot/ya1_updated.png"
                              alt="Ярлык запуска Яндекс Браузера"
                              width={700}
                              height={394}
                              className="w-full h-auto object-contain opacity-90 transition-opacity hover:opacity-100 duration-300"
                            />
                          </div>
                        </div>

                        <div className="p-4 bg-[#0d0e12]/30 border border-zinc-800/40 rounded-xl space-y-4">
                          <div className="font-semibold text-emerald-400">Шаг 2. Проверка установленной версии:</div>
                          <p>В открывшемся браузере перейдите в раздел информации о программе:</p>
                          <p className="text-xs text-zinc-400 font-semibold"><strong className="text-zinc-200">Три полоски (Настройки) → Помощь → О браузере</strong></p>

                          <div className="grid grid-cols-1 gap-4 my-4">
                            <div className="rounded-xl overflow-hidden border border-zinc-800/80 bg-zinc-950/40 shadow-inner max-w-[700px] w-full flex-shrink-0">
                              <Image
                                src="/screenshot/ya2.png"
                                alt="Переход к разделу О Браузере"
                                width={700}
                                height={394}
                                className="w-full h-auto object-contain opacity-90"
                              />
                            </div>
                            <div className="rounded-xl overflow-hidden border border-zinc-800/80 bg-zinc-950/40 shadow-inner max-w-[700px] w-full flex-shrink-0">
                              <Image
                                src="/screenshot/ya3.png"
                                alt="Версия в левом верхнем углу"
                                width={700}
                                height={394}
                                className="w-full h-auto object-contain opacity-90"
                              />
                            </div>
                          </div>

                          <p className="text-xs text-zinc-400 mt-2">
                            Сделайте финальный скриншот окна информации (на котором четко видна версия сборки) и занесите его в отчет.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionItem>
            </div>
          </AccordionItem>
            </Fragment>
          ) : (
            <Fragment key="variant-4">
          {/* MODULE 1 */}
          <AccordionItem title="Модуль 1: Базовое администрирование сетей" level={1}>
            <div className="space-y-4 mt-2">
              <p className="text-sm text-zinc-400 mb-4">
                В этом модуле рассматриваются фундаментальные команды Linux для получения информации о сетевом оборудовании, интерфейсах и управления сетевыми службами в системе с помощью `systemd`.
              </p>

              {/* Level 2: Nested tasks */}
              <AccordionItem title="Задание 1. Произведите базовую настройку устройств" level={2}>
                <div className="space-y-4">
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    Для корректной идентификации устройств в локальной сети лабораторного стенда необходимо установить соответствующие имена хостов (hostname) для каждой виртуальной машины. Используйте команду <code className="text-emerald-400 font-mono text-xs bg-zinc-900/80 px-1.5 py-0.5 rounded border border-zinc-800/80">hostnamectl</code>, после чего обновите сессию терминала с помощью <code className="text-zinc-400 font-mono text-xs">exec bash</code>.
                  </p>

                  <div className="space-y-5">
                    <div className="border border-zinc-800/40 bg-zinc-900/10 p-4 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-zinc-200 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-blue-500" />
                          <span>ISP</span>
                        </span>
                      </div>
                      <CommandBlock command="hostnamectl set-hostname isp.au-team.irpo; exec bash" />
                    </div>

                    <div className="border border-zinc-800/40 bg-zinc-900/10 p-4 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-zinc-200 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span>HQ-RTR</span>
                        </span>
                      </div>
                      <CommandBlock command="hostnamectl set-hostname hq-rtr.au-team.irpo; exec bash" />
                    </div>

                    <div className="border border-zinc-800/40 bg-zinc-900/10 p-4 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-zinc-200 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span>HQ-SRV</span>
                        </span>
                      </div>
                      <CommandBlock command="hostnamectl set-hostname hq-srv.au-team.irpo; exec bash" />
                    </div>

                    <div className="border border-zinc-800/40 bg-zinc-900/10 p-4 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-zinc-200 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span>HQ-CLI</span>
                        </span>
                      </div>
                      <CommandBlock command="hostnamectl set-hostname hq-cli.au-team.irpo; exec bash" />
                    </div>

                    <div className="border border-zinc-800/40 bg-zinc-900/10 p-4 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-zinc-200 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-purple-500" />
                          <span>BR-RTR</span>
                        </span>
                      </div>
                      <CommandBlock command="hostnamectl set-hostname br-rtr.au-team.irpo; exec bash" />
                    </div>

                    <div className="border border-zinc-800/40 bg-zinc-900/10 p-4 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-zinc-200 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-purple-500" />
                          <span>BR-SRV</span>
                        </span>
                      </div>
                      <CommandBlock command="hostnamectl set-hostname br-srv.au-team.irpo; exec bash" />
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="w-full border-t border-zinc-800/80"></div>
                    </div>
                    <div className="relative flex justify-start">
                      <span className="bg-[#0f1115]/30 pr-3 text-sm font-semibold text-emerald-400 uppercase tracking-wider">
                        Настройка сетевых интерфейсов
                      </span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="border border-zinc-800/40 bg-[#0d0e12]/30 p-6 rounded-xl space-y-4">
                      <div className="flex items-center justify-between mb-4 border-b border-zinc-800/60 pb-3">
                        <span className="text-base font-bold text-zinc-100 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                          <span>ISP</span>
                        </span>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">1. Создание директорий конфигурации для enp7s2 и enp7s3:</div>
                          <CommandBlock command="mkdir -p /etc/net/ifaces/enp7s{2,3}" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">2. Указание типа интерфейса (Ethernet) для обоих адаптеров:</div>
                          <CommandBlock command="echo 'TYPE=eth' | tee /etc/net/ifaces/enp7s{2,3}/options" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">3. Назначение IP-адреса на интерфейс enp7s2 (сеть к штаб-квартире):</div>
                          <CommandBlock command="echo '172.16.70.1/28' > /etc/net/ifaces/enp7s2/ipv4address" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">4. Назначение IP-адреса на интерфейс enp7s3 (сеть к филиалу):</div>
                          <CommandBlock command="echo '172.16.80.1/28' > /etc/net/ifaces/enp7s3/ipv4address" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">5. Перезапуск сетевой службы для применения новой конфигурации:</div>
                          <CommandBlock command="systemctl restart network" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">6. Проверка состояния интерфейсов и назначенных адресов:</div>
                          <CommandBlock command="ip -c --br a" />
                        </div>
                      </div>
                    </div>

                    <div className="border border-zinc-800/40 bg-[#0d0e12]/30 p-6 rounded-xl space-y-4">
                      <div className="flex items-center justify-between mb-4 border-b border-zinc-800/60 pb-3">
                        <span className="text-base font-bold text-zinc-100 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                          <span>BR-RTR</span>
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">1. Создание директорий интерфейсов enp7s1, enp7s2 и gre1 (туннель):</div>
                          <CommandBlock command="mkdir -p /etc/net/ifaces/{enp7s{1,2},gre1}" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">2. Указание типа интерфейса (Ethernet) для enp7s1 и enp7s2:</div>
                          <CommandBlock command="echo 'TYPE=eth' | tee /etc/net/ifaces/enp7s{1,2}/options" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">3. Назначение внешнего IP-адреса на интерфейс enp7s1 (к провайдеру):</div>
                          <CommandBlock command="echo '172.16.80.2/28' > /etc/net/ifaces/enp7s1/ipv4address" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">4. Настройка шлюза по умолчанию через ISP:</div>
                          <CommandBlock command="echo 'default via 172.16.80.1' > /etc/net/ifaces/enp7s1/ipv4route" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">5. Указание DNS-сервера (Google DNS):</div>
                          <CommandBlock command="echo 'nameserver 8.8.8.8' > /etc/net/ifaces/enp7s1/resolv.conf" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">6. Назначение внутреннего IP-адреса на интерфейс enp7s2 (локальная сеть филиала):</div>
                          <CommandBlock command="echo '192.168.0.1/28' > /etc/net/ifaces/enp7s2/ipv4address" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">7. Открытие системного sysctl.conf для редактирования (включение IP forwarding):</div>
                          <CommandBlock command="vim /etc/net/sysctl.conf" />
                        </div>
                        <div className="p-4 bg-[#0d0e12]/30 border border-zinc-800/40 rounded-xl space-y-2 text-sm text-zinc-300 leading-relaxed">
                          <div className="font-semibold text-emerald-400">7.1. Включение IP forwarding в vim:</div>
                          <p>Найдите строку <code className="text-zinc-200 bg-zinc-900/60 px-1.5 py-0.5 rounded border border-zinc-800/80 font-mono text-xs">net.ipv4.ip_forward</code>.</p>
                          <p>По умолчанию там стоит значение <code className="text-red-400 font-bold">0</code>. Измените его на <code className="text-emerald-400 font-bold">1</code>.</p>
                          <p className="text-xs text-zinc-500 mt-1">Для начала редактирования нажмите клавишу <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">i</kbd> (режим Insert). Убедитесь, что активна английская раскладка клавиатуры.</p>
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">7.2. Сохранение изменений и выход из редактора vim:</div>
                          <p className="text-xs text-zinc-500 mb-1">Нажмите клавишу <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Esc</kbd>, введите команду ниже и нажмите <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Enter</kbd>:</p>
                          <CommandBlock command=":wq" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">8. Перезапуск сетевой службы для применения настроек:</div>
                          <CommandBlock command="systemctl restart network" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">9. Проверка состояния сетевых адаптеров:</div>
                          <CommandBlock command="ip -c --br a" />
                        </div>
                      </div>
                    </div>

                    <div className="border border-zinc-800/40 bg-[#0d0e12]/30 p-6 rounded-xl space-y-4">
                      <div className="flex items-center justify-between mb-4 border-b border-zinc-800/60 pb-3">
                        <span className="text-base font-bold text-zinc-100 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                          <span>BR-SRV</span>
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">1. Указание типа интерфейса (Ethernet) для enp7s1:</div>
                          <CommandBlock command="echo 'TYPE=eth' > /etc/net/ifaces/enp7s1/options" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">2. Назначение IP-адреса на интерфейс enp7s1:</div>
                          <CommandBlock command="echo '192.168.0.2/28' > /etc/net/ifaces/enp7s1/ipv4address" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">3. Настройка основного шлюза по умолчанию через BR-RTR:</div>
                          <CommandBlock command="echo 'default via 192.168.0.1' > /etc/net/ifaces/enp7s1/ipv4route" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">4. Настройка DNS-резолвера и локального домена поиска:</div>
                          <CommandBlock command={'echo $\'search au-team.irpo\\nnameserver 192.168.100.2\' > /etc/net/ifaces/enp7s1/resolv.conf'} />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">5. Перезапуск сетевой службы для применения новой схемы:</div>
                          <CommandBlock command="systemctl restart network" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">6. Проверка краткого статуса интерфейсов:</div>
                          <CommandBlock command="ip -c --br a" />
                        </div>
                      </div>
                    </div>

                    <div className="border border-zinc-800/40 bg-[#0d0e12]/30 p-6 rounded-xl space-y-4">
                      <div className="flex items-center justify-between mb-4 border-b border-zinc-800/60 pb-3">
                        <span className="text-base font-bold text-zinc-100 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                          <span>HQ-RTR</span>
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">1. Создание директорий для интерфейсов enp7s1, enp7s2, vlan114, vlan214, vlan814 и gre1:</div>
                          <CommandBlock command="mkdir -p /etc/net/ifaces/{enp7s{1,2},vlan{114,214,814},gre1}" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">2. Указание типа интерфейса (Ethernet) для физических адаптеров enp7s1 и enp7s2:</div>
                          <CommandBlock command="echo 'TYPE=eth' | tee /etc/net/ifaces/enp7s{1,2}/options" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">3. Назначение внешнего IP-адреса на enp7s1 (сеть к ISP):</div>
                          <CommandBlock command="echo '172.16.70.2/28' > /etc/net/ifaces/enp7s1/ipv4address" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">4. Настройка шлюза по умолчанию через ISP:</div>
                          <CommandBlock command="echo 'default via 172.16.70.1' > /etc/net/ifaces/enp7s1/ipv4route" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">5. Указание внешнего DNS-сервера (Google DNS):</div>
                          <CommandBlock command="echo 'nameserver 8.8.8.8' > /etc/net/ifaces/enp7s1/resolv.conf" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">6. Генерация файлов настроек для vlan114, vlan214 и vlan814 на интерфейсе enp7s2:</div>
                          <CommandBlock command={'echo $\'114\\n214\\n814\' | xargs -i bash -c \'echo -e "TYPE=vlan\\nHOST=enp7s2\\nVID={}" > /etc/net/ifaces/vlan{}/options\''} />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">7. Проверка конфигурации vlan811 для контроля корректности параметров:</div>
                          <CommandBlock command="cat /etc/net/ifaces/vlan814/options" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">8. Назначение IP-адреса для VLAN 114 (сеть серверов):</div>
                          <CommandBlock command="echo '192.168.100.1/27' > /etc/net/ifaces/vlan114/ipv4address" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">9. Назначение IP-адреса для VLAN 214 (сеть клиентов):</div>
                          <CommandBlock command="echo '192.168.200.1/24' > /etc/net/ifaces/vlan214/ipv4address" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">10. Назначение IP-адреса для VLAN 814 (сеть управления):</div>
                          <CommandBlock command="echo '192.168.99.1/29' > /etc/net/ifaces/vlan814/ipv4address" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">11. Открытие sysctl.conf для редактирования (включение IP forwarding):</div>
                          <CommandBlock command="vim /etc/net/sysctl.conf" />
                        </div>
                        <div className="p-4 bg-[#0d0e12]/30 border border-zinc-800/40 rounded-xl space-y-2 text-sm text-zinc-300 leading-relaxed">
                          <div className="font-semibold text-emerald-400">11.1. Включение IP forwarding в vim:</div>
                          <p>Найдите строку <code className="text-zinc-200 bg-zinc-900/60 px-1.5 py-0.5 rounded border border-zinc-800/80 font-mono text-xs">net.ipv4.ip_forward</code>.</p>
                          <p>По умолчанию там стоит значение <code className="text-red-400 font-bold">0</code>. Измените его на <code className="text-emerald-400 font-bold">1</code>.</p>
                          <p className="text-xs text-zinc-500 mt-1">Для начала редактирования нажмите клавишу <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">i</kbd> (режим Insert). Убедитесь, что активна английская раскладка клавиатуры.</p>
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">11.2. Сохранение изменений и выход из редактора vim:</div>
                          <p className="text-xs text-zinc-500 mb-1">Нажмите клавишу <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Esc</kbd>, введите команду ниже и нажмите <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Enter</kbd>:</p>
                          <CommandBlock command=":wq" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">12. Перезапуск сетевой службы для применения новой схемы:</div>
                          <CommandBlock command="systemctl restart network" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">13. Проверка краткого статуса всех физических и vlan-интерфейсов:</div>
                          <CommandBlock command="ip -c --br a" />
                        </div>
                      </div>
                    </div>

                    <div className="border border-zinc-800/40 bg-[#0d0e12]/30 p-6 rounded-xl space-y-4">
                      <div className="flex items-center justify-between mb-4 border-b border-zinc-800/60 pb-3">
                        <span className="text-base font-bold text-zinc-100 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                          <span>HQ-SRV</span>
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">1. Указание типа интерфейса (Ethernet) для enp7s1:</div>
                          <CommandBlock command="echo 'TYPE=eth' > /etc/net/ifaces/enp7s1/options" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">2. Назначение IP-адреса на интерфейс enp7s1:</div>
                          <CommandBlock command="echo '192.168.100.2/27' > /etc/net/ifaces/enp7s1/ipv4address" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">3. Настройка шлюза по умолчанию через HQ-RTR:</div>
                          <CommandBlock command="echo 'default via 192.168.100.1' > /etc/net/ifaces/enp7s1/ipv4route" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">4. Указание внешнего DNS-сервера (Google DNS) для выхода в интернет:</div>
                          <CommandBlock command="echo 'nameserver 8.8.8.8' > /etc/net/ifaces/enp7s1/resolv.conf" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">5. Перезапуск сетевой службы:</div>
                          <CommandBlock command="systemctl restart network" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">6. Проверка краткого статуса сетевых адаптеров:</div>
                          <CommandBlock command="ip -c --br a" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 border border-red-500/25 bg-red-500/5 rounded-xl text-red-400 mt-4">
                    <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                    <div className="text-sm font-semibold">Сведения об адресах занесите в отчёт</div>
                  </div>
                </div>
              </AccordionItem>

              <AccordionItem title="Задание 2. Настройте доступ к сети Интернет, на маршрутизаторе ISP" level={2}>
                <div className="space-y-5">
                  <div className="flex items-center gap-3 p-4 border border-red-500/20 bg-red-500/5 rounded-xl text-red-400 mb-2">
                    <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm font-semibold">Данные команды выполняются только на маршрутизаторе ISP</span>
                  </div>



                  <div className="space-y-6">
                    <div>
                      <div className="text-xs text-zinc-400 font-semibold mb-1">1. Открываем редактор vim для редактирования системных параметров:</div>
                      <CommandBlock command="vim /etc/net/sysctl.conf" />
                    </div>

                    <div className="p-4 bg-[#0d0e12]/30 border border-zinc-800/40 rounded-xl space-y-2 text-sm text-zinc-300 leading-relaxed">
                      <div className="font-semibold text-emerald-400">2. Включение IP forwarding в vim:</div>
                      <p>Найдите строку <code className="text-zinc-200 bg-zinc-900/60 px-1.5 py-0.5 rounded border border-zinc-800/80 font-mono text-xs">net.ipv4.ip_forward</code>.</p>
                      <p>По умолчанию там стоит значение <code className="text-red-400 font-bold">0</code>. Измените его на <code className="text-emerald-400 font-bold">1</code>.</p>
                      <p className="text-xs text-zinc-500 mt-1">Для начала редактирования нажмите клавишу <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">i</kbd> (режим Insert). Убедитесь, что активна английская раскладка клавиатуры.</p>
                    </div>

                    <div>
                      <div className="text-xs text-zinc-400 font-semibold mb-1">3. Сохранение изменений и выход из редактора vim:</div>
                      <p className="text-xs text-zinc-500 mb-1">Нажмите клавишу <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Esc</kbd>, введите команду ниже и нажмите <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Enter</kbd>:</p>
                      <CommandBlock command=":wq" />
                    </div>

                    <div>
                      <div className="text-xs text-zinc-400 font-semibold mb-1">4. Перезапуск сетевой службы для применения настроек forwarding:</div>
                      <CommandBlock command="systemctl restart network" />
                    </div>

                    <div>
                      <div className="text-xs text-zinc-400 font-semibold mb-1">5. Обновление пакетной базы и установка nftables и текстового редактора nano:</div>
                      <CommandBlock command="apt-get update && apt-get install nftables nano -y" />
                    </div>

                    <div>
                      <div className="text-xs text-zinc-400 font-semibold mb-1">6. Открытие файла конфигурации nftables для редактирования:</div>
                      <CommandBlock command="nano /etc/nftables/nftables.nft" />
                    </div>

                    <div className="p-4 bg-[#0d0e12]/30 border border-zinc-800/40 rounded-xl space-y-3 text-sm text-zinc-300">
                      <div className="font-semibold text-emerald-400">7. Наполнение файла правилами NAT (Masquerade):</div>
                      <p>Удалите всё содержимое файла и вставьте следующие строки:</p>
                      <CommandBlock command={`#!/usr/sbin/nft -f

flush ruleset

table ip nat {
    chain postrouting {
        type nat hook postrouting priority srcnat;
        oifname "enp7s1" masquerade
    }
}`} />
                      <p className="text-xs text-zinc-500 mt-2">После вставки сохраните файл: нажмите <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Ctrl + X</kbd>, затем <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Y</kbd> и подтвердите клавишей <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Enter</kbd>.</p>
                    </div>

                    <div>
                      <div className="text-xs text-zinc-400 font-semibold mb-1">8. Добавление nftables в автозагрузку и немедленный запуск службы:</div>
                      <CommandBlock command="systemctl enable --now nftables" />
                    </div>

                    <div>
                      <div className="text-xs text-zinc-400 font-semibold mb-1">9. Запуск службы nftables:</div>
                      <CommandBlock command="systemctl start nftables" />
                    </div>

                    <div>
                      <div className="text-xs text-zinc-400 font-semibold mb-1">10. Очистка текущих правил фаервола:</div>
                      <CommandBlock command="nft flush ruleset" />
                    </div>

                    <div>
                      <div className="text-xs text-zinc-400 font-semibold mb-1">11. Применение созданных правил NAT из конфигурационного файла:</div>
                      <CommandBlock command="nft -f /etc/nftables/nftables.nft" />
                    </div>

                    <div>
                      <div className="text-xs text-zinc-400 font-semibold mb-1">12. Просмотр активного набора правил nftables (вывод должен соответствовать содержимому файла):</div>
                      <CommandBlock command="nft list ruleset" />
                    </div>

                    <div>
                      <div className="text-xs text-zinc-400 font-semibold mb-1">13. Проверка успешного включения форвардинга пакетов:</div>
                      <CommandBlock command="sysctl net.ipv4.ip_forward" />
                    </div>

                    <div>
                      <div className="text-xs text-zinc-400 font-semibold mb-1">14. Проверка доступности внешних ресурсов интернета:</div>
                      <CommandBlock command="ping -c4 ya.ru" />
                    </div>
                  </div>
                </div>
              </AccordionItem>

              <AccordionItem title="Задание 3. Создайте локальные учетные записи" level={2}>
                <div className="space-y-4">
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    Для обеспечения безопасности и администрирования необходимо создать локальные учетные записи пользователей на узлах лабораторной работы, настроить для них пароли и права выполнения команд суперпользователя через <code className="text-emerald-400 font-mono text-xs bg-zinc-900/80 px-1.5 py-0.5 rounded border border-zinc-800/80">sudo</code>.
                  </p>

                  <div className="space-y-6">
                    {/* HQ-SRV */}
                    <div className="border border-zinc-800/40 bg-[#0d0e12]/30 p-6 rounded-xl space-y-4">
                      <div className="flex items-center justify-between mb-4 border-b border-zinc-800/60 pb-3">
                        <span className="text-base font-bold text-zinc-100 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                          <span>HQ-SRV</span>
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">1. Создание пользователя sshuser с UID 2014:</div>
                          <CommandBlock command="useradd -u 2014 sshuser" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">2. Установка пароля P@ssw0rd для созданного пользователя:</div>
                          <CommandBlock command='echo "sshuser:P@ssw0rd" | chpasswd' />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">3. Добавление пользователя sshuser в привилегированную группу wheel:</div>
                          <CommandBlock command="usermod -aG wheel sshuser" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">4. Разрешение пользователям группы wheel использовать sudo без ввода пароля:</div>
                          <CommandBlock command='echo "WHEEL_USERS ALL=(ALL:ALL) NOPASSWD: ALL" > /etc/sudoers.d/sshuser' />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">5. Вход в интерактивную сессию под именем sshuser:</div>
                          <CommandBlock command="su -l sshuser" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">6. Проверка возможности повышения прав через sudo (должен вернуться root):</div>
                          <CommandBlock command="sudo id" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">7. Выход из сессии пользователя sshuser назад в сессию root:</div>
                          <CommandBlock command="exit" />
                        </div>
                      </div>
                    </div>

                    {/* BR-SRV */}
                    <div className="border border-zinc-800/40 bg-[#0d0e12]/30 p-6 rounded-xl space-y-4">
                      <div className="flex items-center justify-between mb-4 border-b border-zinc-800/60 pb-3">
                        <span className="text-base font-bold text-zinc-100 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                          <span>BR-SRV</span>
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">1. Создание пользователя sshuser с UID 2014:</div>
                          <CommandBlock command="useradd -u 2014 sshuser" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">2. Установка пароля P@ssw0rd для созданного пользователя:</div>
                          <CommandBlock command='echo "sshuser:P@ssw0rd" | chpasswd' />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">3. Добавление пользователя sshuser в привилегированную группу wheel:</div>
                          <CommandBlock command="usermod -aG wheel sshuser" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">4. Разрешение пользователям группы wheel использовать sudo без ввода пароля:</div>
                          <CommandBlock command='echo "WHEEL_USERS ALL=(ALL:ALL) NOPASSWD: ALL" > /etc/sudoers.d/sshuser' />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">5. Вход в интерактивную сессию под именем sshuser:</div>
                          <CommandBlock command="su -l sshuser" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">6. Проверка возможности повышения прав через sudo (должен вернуться root):</div>
                          <CommandBlock command="sudo id" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">7. Выход из сессии пользователя sshuser назад в сессию root:</div>
                          <CommandBlock command="exit" />
                        </div>
                      </div>
                    </div>

                    {/* HQ-RTR */}
                    <div className="border border-zinc-800/40 bg-[#0d0e12]/30 p-6 rounded-xl space-y-4">
                      <div className="flex items-center justify-between mb-4 border-b border-zinc-800/60 pb-3">
                        <span className="text-base font-bold text-zinc-100 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                          <span>HQ-RTR</span>
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">1. Создание пользователя net_admin для управления сетью:</div>
                          <CommandBlock command="useradd net_admin" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">2. Установка пароля P@ssw0rd для созданного пользователя:</div>
                          <CommandBlock command='echo "net_admin:P@ssw0rd" | chpasswd' />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">3. Добавление пользователя net_admin в привилегированную группу wheel:</div>
                          <CommandBlock command="usermod -aG wheel net_admin" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">4. Обновление репозиториев и установка утилиты sudo:</div>
                          <CommandBlock command="apt-get update && apt-get install sudo -y" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">5. Разрешение пользователям группы wheel использовать sudo без ввода пароля:</div>
                          <CommandBlock command='echo "WHEEL_USERS ALL=(ALL:ALL) NOPASSWD: ALL" > /etc/sudoers.d/net_admin' />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">6. Вход в интерактивную сессию под именем net_admin:</div>
                          <CommandBlock command="su -l net_admin" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">7. Проверка прав суперпользователя через sudo:</div>
                          <CommandBlock command="sudo id" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">8. Выход из сессии пользователя net_admin назад в сессию root:</div>
                          <CommandBlock command="exit" />
                        </div>
                      </div>
                    </div>

                    {/* BR-RTR */}
                    <div className="border border-zinc-800/40 bg-[#0d0e12]/30 p-6 rounded-xl space-y-4">
                      <div className="flex items-center justify-between mb-4 border-b border-zinc-800/60 pb-3">
                        <span className="text-base font-bold text-zinc-100 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                          <span>BR-RTR</span>
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">1. Создание пользователя net_admin для управления сетью:</div>
                          <CommandBlock command="useradd net_admin" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">2. Установка пароля P@ssw0rd для созданного пользователя:</div>
                          <CommandBlock command='echo "net_admin:P@ssw0rd" | chpasswd' />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">3. Добавление пользователя net_admin в привилегированную группу wheel:</div>
                          <CommandBlock command="usermod -aG wheel net_admin" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">4. Обновление репозиториев и установка утилиты sudo (с подтверждением):</div>
                          <CommandBlock command="apt-get update && apt-get install sudo" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">5. Разрешение пользователям группы wheel использовать sudo без ввода пароля:</div>
                          <CommandBlock command='echo "WHEEL_USERS ALL=(ALL:ALL) NOPASSWD: ALL" > /etc/sudoers.d/net_admin' />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">6. Вход в интерактивную сессию под именем net_admin:</div>
                          <CommandBlock command="su -l net_admin" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">7. Проверка прав суперпользователя через sudo:</div>
                          <CommandBlock command="sudo id" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionItem>

              <AccordionItem title="Задание 4. Настройте коммутацию в сегменте HQ" level={2}>
                <div className="space-y-4">
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    Для настройки сетевой коммутации в сегменте штаб-квартиры (HQ) необходимо выдать соответствующие VLAN Tag виртуальным хостам в панели управления гипервизором Proxmox VE. Это обеспечит логическую изоляцию сетевых сегментов.
                  </p>

                  <div className="space-y-6">
                    <div className="border border-zinc-800/40 bg-[#0d0e12]/30 p-6 rounded-xl space-y-4">
                      <div className="text-sm font-bold text-zinc-100 border-b border-zinc-800/60 pb-3">
                        Шаг 1. Настройка VLAN Tag для HQ-SRV (VLAN 114)
                      </div>
                      <div className="text-sm text-zinc-300 space-y-2 leading-relaxed">
                        <p>1. В веб-интерфейсе Proxmox VE выберите виртуальную машину <code className="text-emerald-400 font-mono text-xs">HQ-SRV</code> в левом меню.</p>
                        <p>2. Перейдите во вкладку <strong className="text-zinc-200">Hardware</strong> (Оборудование).</p>
                        <p>3. Выберите сетевой адаптер <strong className="text-zinc-200">Network Device (net)</strong> и дважды кликните по нему для редактирования:</p>
                      </div>

                      {/* next/image component - Static size */}
                      <div className="rounded-xl overflow-hidden border border-zinc-800/80 bg-zinc-950/40 my-4 shadow-inner max-w-[700px] w-full flex-shrink-0">
                        <Image
                          src="/screenshot/vlan1.png"
                          alt="Выбор сетевого устройства в Proxmox"
                          width={700}
                          height={394}
                          className="w-full h-auto object-contain opacity-90 transition-opacity hover:opacity-100 duration-300"
                        />
                      </div>

                      <div className="text-sm text-zinc-300 space-y-2 leading-relaxed pt-2">
                        <p>4. В открывшемся окне параметров найдите поле <strong className="text-zinc-100">VLAN Tag</strong> и укажите значение <code className="text-emerald-400 font-mono text-xs bg-zinc-900/80 px-1.5 py-0.5 rounded border border-zinc-800/80">114</code>.</p>
                        <p>5. Нажмите кнопку <strong className="text-zinc-200">OK</strong> для применения настроек.</p>
                      </div>

                      {/* next/image component - Static size */}
                      <div className="rounded-xl overflow-hidden border border-zinc-800/80 bg-zinc-950/40 my-4 shadow-inner max-w-[700px] w-full flex-shrink-0">
                        <Image
                          src="/screenshot/114.png"
                          alt="Настройка VLAN Tag в Proxmox"
                          width={700}
                          height={394}
                          className="w-full h-auto object-contain opacity-90 transition-opacity hover:opacity-100 duration-300"
                        />
                      </div>
                    </div>

                    <div className="border border-zinc-800/40 bg-[#0d0e12]/30 p-6 rounded-xl space-y-4">
                      <div className="text-sm font-bold text-zinc-100 border-b border-zinc-800/60 pb-3">
                        Шаг 2. Настройка VLAN Tag для HQ-CLI (VLAN 214)
                      </div>
                      <div className="text-sm text-zinc-300 space-y-2 leading-relaxed">
                        <p>1. Перейдите к виртуальной машине <code className="text-emerald-400 font-mono text-xs">HQ-CLI</code> в панели Proxmox VE.</p>
                        <p>2. Перейдите во вкладку <strong className="text-zinc-200">Hardware</strong> → выберите <strong className="text-zinc-200">Network Device (net)</strong>.</p>
                        <p>3. Выполните аналогичные шаги редактирования сетевых настроек, но укажите значение <strong className="text-zinc-100">VLAN Tag</strong> равным <code className="text-emerald-400 font-mono text-xs bg-zinc-900/80 px-1.5 py-0.5 rounded border border-zinc-800/80">214</code>.</p>
                        <p>4. Нажмите кнопку <strong className="text-zinc-200">OK</strong> для завершения.</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 border border-red-500/25 bg-red-500/5 rounded-xl text-red-400 mt-4">
                    <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                    <div className="text-sm font-semibold">Сведения о настройке коммутации внесите в отчёт</div>
                  </div>
                </div>
              </AccordionItem>

              <AccordionItem title="Задание 5. Настройте безопасный удаленный доступ на серверах" level={2}>
                <div className="space-y-4">
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    Для обеспечения безопасного удаленного управления серверами необходимо настроить службу SSH-доступа (<code className="text-emerald-400 font-mono text-xs bg-zinc-900/80 px-1.5 py-0.5 rounded border border-zinc-800/80">sshd</code>) на нестандартный порт, ограничить список разрешенных пользователей, установить лимит попыток аутентификации и настроить баннер предупреждения при подключении.
                  </p>

                  <div className="space-y-6">
                    {/* HQ-SRV */}
                    <div className="border border-zinc-800/40 bg-[#0d0e12]/30 p-6 rounded-xl space-y-4">
                      <div className="flex items-center justify-between mb-4 border-b border-zinc-800/60 pb-3">
                        <span className="text-base font-bold text-zinc-100 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                          <span>HQ-SRV</span>
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">1. Открытие конфигурационного файла SSH-сервера в редакторе vim:</div>
                          <CommandBlock command="vim /etc/openssh/sshd_config" />
                        </div>

                        <div className="p-4 bg-[#0d0e12]/30 border border-zinc-800/40 rounded-xl space-y-2 text-sm text-zinc-300 leading-relaxed">
                          <div className="font-semibold text-emerald-400">2. Редактирование конфигурации в vim:</div>
                          <p>Впишите в самое начало файла следующие строки:</p>
                          <pre className="p-4 rounded-lg bg-[#050608] border border-zinc-800/60 text-zinc-200 font-mono text-xs leading-relaxed overflow-x-auto select-all my-2">
{`Port 2014
AllowUsers sshuser
MaxAuthTries 2
Banner /etc/openssh/ssh_banner`}
                          </pre>
                          <p className="text-xs text-zinc-500 mt-1">Для начала редактирования нажмите клавишу <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">i</kbd> (режим Insert). Убедитесь, что активна английская раскладка клавиатуры.</p>
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">3. Сохранение изменений и выход из редактора vim:</div>
                          <p className="text-xs text-zinc-500 mb-1">Нажмите клавишу <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Esc</kbd>, введите команду ниже и нажмите <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Enter</kbd>:</p>
                          <CommandBlock command=":wq" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">4. Создание файла приветственного баннера безопасности:</div>
                          <CommandBlock command='echo "Authorized access only" | tee /etc/openssh/ssh_banner' />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">5. Перезапуск службы sshd для применения новых настроек:</div>
                          <CommandBlock command="systemctl restart sshd" />
                        </div>

                        <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl space-y-2 text-sm text-zinc-300">
                          <div className="font-semibold text-emerald-400">6. Проверка соединения (выполняется с маршрутизатора HQ-RTR):</div>
                          <p>Попробуйте подключиться к HQ-SRV по настроенному порту под созданным пользователем:</p>
                          <CommandBlock command="ssh -p 2014 sshuser@192.168.100.2" />
                          <p>После проверки авторизации выйдите из удаленной сессии:</p>
                          <CommandBlock command="exit" />
                        </div>
                      </div>
                    </div>

                    {/* BR-SRV */}
                    <div className="border border-zinc-800/40 bg-[#0d0e12]/30 p-6 rounded-xl space-y-4">
                      <div className="flex items-center justify-between mb-4 border-b border-zinc-800/60 pb-3">
                        <span className="text-base font-bold text-zinc-100 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                          <span>BR-SRV</span>
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">1. Открытие конфигурационного файла SSH-сервера в редакторе vim:</div>
                          <CommandBlock command="vim /etc/openssh/sshd_config" />
                        </div>

                        <div className="p-4 bg-[#0d0e12]/30 border border-zinc-800/40 rounded-xl space-y-2 text-sm text-zinc-300 leading-relaxed">
                          <div className="font-semibold text-emerald-400">2. Редактирование конфигурации в vim:</div>
                          <p>Впишите в самое начало файла следующие строки:</p>
                          <pre className="p-4 rounded-lg bg-[#050608] border border-zinc-800/60 text-zinc-200 font-mono text-xs leading-relaxed overflow-x-auto select-all my-2">
{`Port 2014
AllowUsers sshuser
MaxAuthTries 2
Banner /etc/openssh/ssh_banner`}
                          </pre>
                          <p className="text-xs text-zinc-500 mt-1">Для начала редактирования нажмите клавишу <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">i</kbd> (режим Insert). Убедитесь, что активна английская раскладка клавиатуры.</p>
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">3. Сохранение изменений и выход из редактора vim:</div>
                          <p className="text-xs text-zinc-500 mb-1">Нажмите клавишу <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Esc</kbd>, введите команду ниже и нажмите <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Enter</kbd>:</p>
                          <CommandBlock command=":wq" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">4. Создание файла приветственного баннера безопасности:</div>
                          <CommandBlock command='echo "Authorized access only" | tee /etc/openssh/ssh_banner' />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">5. Перезапуск службы sshd для применения новых настроек:</div>
                          <CommandBlock command="systemctl restart sshd" />
                        </div>

                        <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl space-y-2 text-sm text-zinc-300">
                          <div className="font-semibold text-emerald-400">6. Проверка соединения (выполняется с маршрутизатора BR-RTR):</div>
                          <p>Попробуйте подключиться к BR-SRV по настроенному порту под созданным пользователем:</p>
                          <CommandBlock command="ssh -p 2014 sshuser@192.168.0.2" />
                          <p>После проверки авторизации выйдите из удаленной сессии:</p>
                          <CommandBlock command="exit" />
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </AccordionItem>

              <AccordionItem title="Задание 6. Сконфигурировать IP туннель между офисами" level={2}>
                <div className="space-y-4">
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    Для объединения локальных сетей штаб-квартиры (HQ) и филиала (BR) на маршрутизаторах настраивается туннель GRE (Generic Routing Encapsulation). Это создаст виртуальный интерфейс <code className="text-emerald-400 font-mono text-xs bg-zinc-900/80 px-1.5 py-0.5 rounded border border-zinc-800/80">gre1</code>, поверх которого будет происходить передача трафика между площадками.
                  </p>

                  <div className="space-y-6">
                    {/* BR-RTR */}
                    <div className="border border-zinc-800/40 bg-[#0d0e12]/30 p-6 rounded-xl space-y-4">
                      <div className="flex items-center justify-between mb-4 border-b border-zinc-800/60 pb-3">
                        <span className="text-base font-bold text-zinc-100 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                          <span>BR-RTR</span>
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">1. Открытие конфигурационного файла туннеля в редакторе vim:</div>
                          <CommandBlock command="vim /etc/net/ifaces/gre1/options" />
                        </div>

                        <div className="p-4 bg-[#0d0e12]/30 border border-zinc-800/40 rounded-xl space-y-2 text-sm text-zinc-300 leading-relaxed">
                          <div className="font-semibold text-emerald-400">2. Редактирование конфигурации в vim:</div>
                          <p>Впишите в файл следующие строки:</p>
                          <pre className="p-4 rounded-lg bg-[#050608] border border-zinc-800/60 text-zinc-200 font-mono text-xs leading-relaxed overflow-x-auto select-all my-2">
{`TYPE=iptun
TUNTYPE=gre
TUNLOCAL=172.16.80.2
TUNREMOTE=172.16.70.2
TUNTTL=64
TUNOPTIONS='ttl 64'`}
                          </pre>
                          <p className="text-xs text-zinc-500 mt-1">Для начала редактирования нажмите клавишу <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">i</kbd> (режим Insert). Убедитесь, что активна английская раскладка клавиатуры.</p>
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">3. Сохранение изменений и выход из редактора vim:</div>
                          <p className="text-xs text-zinc-500 mb-1">Нажмите клавишу <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Esc</kbd>, введите команду ниже и нажмите <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Enter</kbd>:</p>
                          <CommandBlock command=":wq" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">4. Назначение IP-адреса на интерфейс gre1:</div>
                          <CommandBlock command='echo "10.10.10.2/30" > /etc/net/ifaces/gre1/ipv4address' />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">5. Перезапуск сетевой службы для применения настроек:</div>
                          <CommandBlock command="systemctl restart network" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">6. Проверка состояния сетевых интерфейсов:</div>
                          <CommandBlock command="ip -br -c a" />
                        </div>
                      </div>
                    </div>

                    {/* HQ-RTR */}
                    <div className="border border-zinc-800/40 bg-[#0d0e12]/30 p-6 rounded-xl space-y-4">
                      <div className="flex items-center justify-between mb-4 border-b border-zinc-800/60 pb-3">
                        <span className="text-base font-bold text-zinc-100 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                          <span>HQ-RTR</span>
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">1. Открытие конфигурационного файла туннеля в редакторе vim:</div>
                          <CommandBlock command="vim /etc/net/ifaces/gre1/options" />
                        </div>

                        <div className="p-4 bg-[#0d0e12]/30 border border-zinc-800/40 rounded-xl space-y-2 text-sm text-zinc-300 leading-relaxed">
                          <div className="font-semibold text-emerald-400">2. Редактирование конфигурации в vim:</div>
                          <p>Впишите в файл следующие строки:</p>
                          <pre className="p-4 rounded-lg bg-[#050608] border border-zinc-800/60 text-zinc-200 font-mono text-xs leading-relaxed overflow-x-auto select-all my-2">
{`TYPE=iptun
TUNTYPE=gre
TUNLOCAL=172.16.70.2
TUNREMOTE=172.16.80.2
TUNTTL=64
TUNOPTIONS='ttl 64'`}
                          </pre>
                          <p className="text-xs text-zinc-500 mt-1">Для начала редактирования нажмите клавишу <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">i</kbd> (режим Insert). Убедитесь, что активна английская раскладка клавиатуры.</p>
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">3. Сохранение изменений и выход из редактора vim:</div>
                          <p className="text-xs text-zinc-500 mb-1">Нажмите клавишу <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Esc</kbd>, введите команду ниже и нажмите <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Enter</kbd>:</p>
                          <CommandBlock command=":wq" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">4. Назначение IP-адреса на интерфейс gre1:</div>
                          <CommandBlock command='echo "10.10.10.1/30" > /etc/net/ifaces/gre1/ipv4address' />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">5. Перезапуск сетевой службы для применения настроек:</div>
                          <CommandBlock command="systemctl restart network" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">6. Проверка состояния сетевых интерфейсов:</div>
                          <CommandBlock command="ip -br -c a" />
                        </div>

                        <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl space-y-2 text-sm text-zinc-300">
                          <div className="font-semibold text-emerald-400">7. Проверка доступности противоположной стороны туннеля (ping на адрес BR-RTR):</div>
                          <p>Отправьте ICMP-запросы для верификации работоспособности канала:</p>
                          <CommandBlock command="ping 10.10.10.2 -c 3" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 border border-red-500/25 bg-red-500/5 rounded-xl text-red-400 mt-4">
                    <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                    <div className="text-sm font-semibold">Сведения о туннеле занесите в отчёт.</div>
                  </div>
                </div>
              </AccordionItem>

              <AccordionItem title="Задание 7. Обеспечьте динамическую маршрутизацию на маршрутизаторах" level={2}>
                <div className="space-y-4">
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    Для автоматического обмена маршрутной информацией между сетями офисов настраивается динамическая маршрутизация. В качестве протокола используется OSPF (Open Shortest Path First) на базе пакета FRRouting (FRR).
                  </p>

                  <div className="space-y-6">
                    {/* HQ-RTR */}
                    <div className="border border-zinc-800/40 bg-[#0d0e12]/30 p-6 rounded-xl space-y-4">
                      <div className="flex items-center justify-between mb-4 border-b border-zinc-800/60 pb-3">
                        <span className="text-base font-bold text-zinc-100 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                          <span>HQ-RTR</span>
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">1. Обновление пакетной базы и установка службы FRRouting:</div>
                          <CommandBlock command="apt-get update && apt-get install frr -y" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">2. Включение службы ospfd в файле демонов FRR и проверка корректности:</div>
                          <CommandBlock command="sed -i 's/ospfd=no/ospfd=yes/' /etc/frr/daemons ; grep ospf /etc/frr/daemons" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">3. Открытие основного конфигурационного файла FRR в редакторе vim:</div>
                          <CommandBlock command="vim /etc/frr/frr.conf" />
                        </div>

                        <div className="p-4 bg-[#0d0e12]/30 border border-zinc-800/40 rounded-xl space-y-2 text-sm text-zinc-300 leading-relaxed">
                          <div className="font-semibold text-emerald-400">4. Редактирование конфигурации в vim:</div>
                          <p>Очистите файл и впишите следующие строки для настройки OSPF:</p>
                          <pre className="p-4 rounded-lg bg-[#050608] border border-zinc-800/60 text-zinc-200 font-mono text-xs leading-relaxed overflow-x-auto select-all my-2">
{`interface gre
 no ip ospf passive
exit
!
interface gre1
 ip ospf area 0
 ip ospf authentication
 ip ospf authentication-key P@ssw0rd
 no ip ospf passive
exit
!
interface vlan114
 ip ospf area 0
exit
!
interface vlan214
 ip ospf area 0
exit
!
interface vlan814
 ip ospf area 0
exit
!
router ospf
 passive-interface default
exit`}
                          </pre>
                          <p className="text-xs text-zinc-500 mt-1">Для начала редактирования нажмите клавишу <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">i</kbd> (режим Insert). Убедитесь, что активна английская раскладка клавиатуры.</p>
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">5. Сохранение изменений и выход из редактора vim:</div>
                          <p className="text-xs text-zinc-500 mb-1">Нажмите клавишу <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Esc</kbd>, введите команду ниже и нажмите <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Enter</kbd>:</p>
                          <CommandBlock command=":wq" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">6. Добавление службы frr в автозагрузку и ее запуск:</div>
                          <CommandBlock command="systemctl enable --now frr" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">7. Перезапуск сетевой службы:</div>
                          <CommandBlock command="systemctl restart network" />
                        </div>
                      </div>
                    </div>

                    {/* BR-RTR */}
                    <div className="border border-zinc-800/40 bg-[#0d0e12]/30 p-6 rounded-xl space-y-4">
                      <div className="flex items-center justify-between mb-4 border-b border-zinc-800/60 pb-3">
                        <span className="text-base font-bold text-zinc-100 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                          <span>BR-RTR</span>
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">1. Обновление пакетной базы и установка службы FRRouting:</div>
                          <CommandBlock command="apt-get update && apt-get install frr -y" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">2. Включение службы ospfd в файле демонов FRR и проверка корректности:</div>
                          <CommandBlock command="sed -i 's/ospfd=no/ospfd=yes/' /etc/frr/daemons ; grep ospf /etc/frr/daemons" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">3. Открытие основного конфигурационного файла FRR в редакторе vim:</div>
                          <CommandBlock command="vim /etc/frr/frr.conf" />
                        </div>

                        <div className="p-4 bg-[#0d0e12]/30 border border-zinc-800/40 rounded-xl space-y-2 text-sm text-zinc-300 leading-relaxed">
                          <div className="font-semibold text-emerald-400">4. Редактирование конфигурации в vim:</div>
                          <p>Очистите файл и впишите следующие строки для настройки OSPF:</p>
                          <pre className="p-4 rounded-lg bg-[#050608] border border-zinc-800/60 text-zinc-200 font-mono text-xs leading-relaxed overflow-x-auto select-all my-2">
{`interface gre
 no ip ospf passive
exit
!
interface gre1
 ip ospf area 0
 ip ospf authentication
 ip ospf authentication-key P@ssw0rd
 no ip ospf passive
exit
!
interface enp7s2
 ip ospf area 0
exit
!
router ospf
 passive-interface default
exit`}
                          </pre>
                          <p className="text-xs text-zinc-500 mt-1">Для начала редактирования нажмите клавишу <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">i</kbd> (режим Insert). Убедитесь, что активна английская раскладка клавиатуры.</p>
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">5. Сохранение изменений и выход из редактора vim:</div>
                          <p className="text-xs text-zinc-500 mb-1">Нажмите клавишу <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Esc</kbd>, введите команду ниже и нажмите <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Enter</kbd>:</p>
                          <CommandBlock command=":wq" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">6. Добавление службы frr в автозагрузку и ее запуск:</div>
                          <CommandBlock command="systemctl enable --now frr" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">7. Перезапуск сетевой службы:</div>
                          <CommandBlock command="systemctl restart network" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 border border-red-500/25 bg-red-500/5 rounded-xl text-red-400 mt-4">
                    <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                    <div className="text-sm font-semibold">Сведения об адресах занесите в отчёт</div>
                  </div>
                </div>
              </AccordionItem>

              <AccordionItem title="Задание 8. Настройка динамической трансляции адресов маршрутизатора" level={2}>
                <div className="space-y-4">
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    Для обеспечения доступа клиентов локальной сети к глобальной сети Интернет на пограничных маршрутизаторах настраивается динамическая трансляция сетевых адресов (NAT/Masquerade) с использованием службы <code className="text-emerald-400 font-mono text-xs bg-zinc-900/80 px-1.5 py-0.5 rounded border border-zinc-800/80">nftables</code>.
                  </p>

                  <div className="space-y-6">
                    {/* HQ-RTR */}
                    <div className="border border-zinc-800/40 bg-[#0d0e12]/30 p-6 rounded-xl space-y-4">
                      <div className="flex items-center justify-between mb-4 border-b border-zinc-800/60 pb-3">
                        <span className="text-base font-bold text-zinc-100 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                          <span>HQ-RTR</span>
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">1. Обновление пакетной базы и установка nftables и редактора nano:</div>
                          <CommandBlock command="apt-get install nftables nano -y" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">2. Открытие конфигурационного файла nftables в редакторе nano:</div>
                          <CommandBlock command="nano /etc/nftables/nftables.nft" />
                        </div>

                        <div className="p-4 bg-[#0d0e12]/30 border border-zinc-800/40 rounded-xl space-y-3 text-sm text-zinc-300">
                          <div className="font-semibold text-emerald-400">3. Наполнение файла правилами NAT (Masquerade):</div>
                          <p>Удалите всё содержимое файла и вставьте следующие строки:</p>
                          <CommandBlock command={`#!/usr/sbin/nft -f
flush ruleset

table ip nat {
    chain postrouting {
        type nat hook postrouting priority srcnat;
        oifname "enp7s1" masquerade
    }
}`} />
                          <p className="text-xs text-zinc-500 mt-2">После вставки сохраните файл: нажмите <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Ctrl + X</kbd>, затем <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Y</kbd> и подтвердите клавишей <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Enter</kbd>.</p>
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">4. Добавление nftables в автозагрузку и запуск службы:</div>
                          <CommandBlock command="systemctl enable --now nftables" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">5. Перезапуск службы nftables для применения новых правил:</div>
                          <CommandBlock command="systemctl restart nftables.service" />
                        </div>
                      </div>
                    </div>

                    {/* BR-RTR */}
                    <div className="border border-zinc-800/40 bg-[#0d0e12]/30 p-6 rounded-xl space-y-4">
                      <div className="flex items-center justify-between mb-4 border-b border-zinc-800/60 pb-3">
                        <span className="text-base font-bold text-zinc-100 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                          <span>BR-RTR</span>
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">1. Обновление пакетной базы и установка nftables и редактора nano:</div>
                          <CommandBlock command="apt-get install nftables nano -y" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">2. Открытие конфигурационного файла nftables в редакторе nano:</div>
                          <CommandBlock command="nano /etc/nftables/nftables.nft" />
                        </div>

                        <div className="p-4 bg-[#0d0e12]/30 border border-zinc-800/40 rounded-xl space-y-3 text-sm text-zinc-300">
                          <div className="font-semibold text-emerald-400">3. Наполнение файла правилами NAT (Masquerade):</div>
                          <p>Удалите всё содержимое файла и вставьте следующие строки:</p>
                          <CommandBlock command={`#!/usr/sbin/nft -f
flush ruleset

table ip nat {
    chain postrouting {
        type nat hook postrouting priority srcnat;
        oifname "enp7s1" masquerade
    }
}`} />
                          <p className="text-xs text-zinc-500 mt-2">После вставки сохраните файл: нажмите <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Ctrl + X</kbd>, затем <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Y</kbd> и подтвердите клавишей <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Enter</kbd>.</p>
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">4. Добавление nftables в автозагрузку и запуск службы:</div>
                          <CommandBlock command="systemctl enable --now nftables" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">5. Перезапуск службы nftables для применения новых правил:</div>
                          <CommandBlock command="systemctl restart nftables.service" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionItem>

              <AccordionItem title="Задание 9. Настройте протокол динамической конфигурации хостов для сети в сторону HQ-CLI" level={2}>
                <div className="space-y-4">
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    Для автоматической выдачи IP-адресов и параметров сети клиенту <code className="text-emerald-400 font-mono text-xs bg-zinc-900/80 px-1.5 py-0.5 rounded border border-zinc-800/80">HQ-CLI</code> на маршрутизаторе <code className="text-emerald-400 font-mono text-xs bg-zinc-900/80 px-1.5 py-0.5 rounded border border-zinc-800/80">HQ-RTR</code> настраивается DHCP-сервер с использованием легковесной службы <code className="text-emerald-400 font-mono text-xs bg-zinc-900/80 px-1.5 py-0.5 rounded border border-zinc-800/80">dnsmasq</code>. Также производится перенос конфигурации DNS на интерфейс VLAN 111.
                  </p>

                  <div className="space-y-6">
                    {/* HQ-RTR */}
                    <div className="border border-zinc-800/40 bg-[#0d0e12]/30 p-6 rounded-xl space-y-4">
                      <div className="flex items-center justify-between mb-4 border-b border-zinc-800/60 pb-3">
                        <span className="text-base font-bold text-zinc-100 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                          <span>HQ-RTR</span>
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div className="relative my-4">
                          <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-zinc-800/45"></div>
                          </div>
                          <div className="relative flex justify-start">
                            <span className="bg-[#0f1115] pr-3 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                              Шаг 1. Перенос настроек DNS
                            </span>
                          </div>
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">1. Установка пакета dnsmasq:</div>
                          <CommandBlock command="apt-get install dnsmasq -y" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">2. Удаление старого конфигурационного файла resolv.conf с внешнего интерфейса enp7s1:</div>
                          <CommandBlock command="rm -f /etc/net/ifaces/enp7s1/resolv.conf" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">3. Создание конфигурации DNS-резолвера для интерфейса vlan111:</div>
                          <CommandBlock command={'echo $\'search au-team.irpo\\nnameserver 192.168.100.2\' > /etc/net/ifaces/vlan111/resolv.conf'} />
                        </div>

                        <div className="relative my-6">
                          <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-zinc-800/45"></div>
                          </div>
                          <div className="relative flex justify-start">
                            <span className="bg-[#0f1115] pr-3 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                              Шаг 2. Настройка DHCP-сервера
                            </span>
                          </div>
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">4. Отключение встроенного локального резолвера dnsmasq для исключения конфликтов:</div>
                          <CommandBlock command="sed -i 's/AUTO_LOCAL_RESOLVER=yes/AUTO_LOCAL_RESOLVER=no/' /etc/sysconfig/dnsmasq ; grep AUTO_LOCAL_RESOLVER /etc/sysconfig/dnsmasq" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">5. Открытие конфигурационного файла dnsmasq в редакторе nano:</div>
                          <CommandBlock command="nano /etc/dnsmasq.conf" />
                        </div>

                        <div className="p-4 bg-[#0d0e12]/30 border border-zinc-800/40 rounded-xl space-y-3 text-sm text-zinc-300">
                          <div className="font-semibold text-emerald-400">6. Наполнение файла конфигурации dnsmasq:</div>
                          <p>В начало файла добавьте следующие строки:</p>
                          <CommandBlock command={`port=0
interface=vlan214
listen-address=192.168.200.1
dhcp-authoritative
dhcp-range=interface:vlan214,192.168.200.2,192.168.200.2,255.255.255.240,6h
dhcp-option=3,192.168.200.1
dhcp-option=6,192.168.100.2
leasefile-ro`} />
                          <p className="text-xs text-zinc-500 mt-2">После вставки сохраните файл: нажмите <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Ctrl + X</kbd>, затем <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Y</kbd> и подтвердите клавишей <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Enter</kbd>.</p>
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">7. Добавление dnsmasq в автозагрузку, его запуск и проверка порта 67 (DHCP):</div>
                          <CommandBlock command="systemctl enable --now dnsmasq ; ss -lun | grep 67" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">8. Перезапуск сетевой службы для применения настроек резолверов:</div>
                          <CommandBlock command="systemctl restart network" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">9. Проверка итогового файла resolv.conf:</div>
                          <CommandBlock command="cat /etc/resolv.conf" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 border border-red-500/25 bg-red-500/5 rounded-xl text-red-400 mt-4">
                    <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                    <div className="text-sm font-semibold">Сведения о настройке протокола занесите в отчёт.</div>
                  </div>
                </div>
              </AccordionItem>

              <AccordionItem title="Задание 10. Настройте инфраструктуру разрешения доменных имён" level={2}>
                <div className="space-y-4">
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    Для настройки локального DNS-сервера в зоне <code className="text-emerald-400 font-mono text-xs bg-zinc-900/80 px-1.5 py-0.5 rounded border border-zinc-800/80">au-team.irpo</code> и обратной зоны <code className="text-emerald-400 font-mono text-xs bg-zinc-900/80 px-1.5 py-0.5 rounded border border-zinc-800/80">168.192.in-addr.arpa</code> на сервере <code className="text-emerald-400 font-mono text-xs bg-zinc-900/80 px-1.5 py-0.5 rounded border border-zinc-800/80">HQ-SRV</code> устанавливается и настраивается служба DNS-сервера <code className="text-emerald-400 font-mono text-xs bg-zinc-900/80 px-1.5 py-0.5 rounded border border-zinc-800/80">bind</code> (named).
                  </p>

                  <div className="space-y-6">
                    {/* HQ-SRV */}
                    <div className="border border-zinc-800/40 bg-[#0d0e12]/30 p-6 rounded-xl space-y-4">
                      <div className="flex items-center justify-between mb-4 border-b border-zinc-800/60 pb-3">
                        <span className="text-base font-bold text-zinc-100 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                          <span>HQ-SRV</span>
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">1. Обновление пакетной базы и установка службы bind, утилит bind-utils и текстового редактора nano:</div>
                          <CommandBlock command="apt-get update && apt-get install bind bind-utils nano -y" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">2. Перенаправление резолвера сетевого интерфейса enp7s1 на локальный адрес 127.0.0.1:</div>
                          <CommandBlock command={'echo $\'search au-team.irpo\\nnameserver 127.0.0.1\' > /etc/net/ifaces/enp7s1/resolv.conf'} />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">3. Генерация ключа rndc для управления DNS-сервером:</div>
                          <CommandBlock command="rndc-confgen -a -c /etc/bind/rndc.key" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">4. Открытие файла глобальной конфигурации bind в редакторе nano:</div>
                          <CommandBlock command="nano /etc/bind/options.conf" />
                        </div>

                        <div className="p-4 bg-[#0d0e12]/30 border border-zinc-800/40 rounded-xl space-y-3 text-sm text-zinc-300">
                          <div className="font-semibold text-emerald-400">5. Редактирование options.conf (Замените всё содержимое файла следующим текстом):</div>
                          <CommandBlock command={`options {
    listen-on { 127.0.0.1; 192.168.100.2; };
    forwarders { 77.88.8.7; 77.88.8.3; };
    recursion yes;
    allow-recursion { any; };
    allow-query { any; };
    dnssec-validation no;
    directory "/etc/bind/zone";
    dump-file "/var/run/named/named_dump.db";
    statistics-file "/var/run/named/named.stats";
    pid-file "/var/run/named/named.pid";
};

logging {
    category default { default_syslog; };
};

zone "au-team.irpo" {
    type master;
    file "au-team.irpo";
};

zone "168.192.in-addr.arpa" {
    type master;
    file "168.192.in-addr.arpa";
};`} />
                          <p className="text-xs text-zinc-500 mt-2">После вставки сохраните файл: нажмите <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Ctrl + X</kbd>, затем <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Y</kbd> и подтвердите клавишей <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Enter</kbd>.</p>
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">6. Копирование шаблона зоны обратного просмотра в качестве основы для зоны au-team.irpo:</div>
                          <CommandBlock command="cp -r /etc/bind/zone/127.in-addr.arpa /etc/bind/zone/au-team.irpo" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">7. Открытие конфигурационного файла зоны au-team.irpo в редакторе nano:</div>
                          <CommandBlock command="nano /etc/bind/zone/au-team.irpo" />
                        </div>

                        <div className="p-4 bg-[#0d0e12]/30 border border-zinc-800/40 rounded-xl space-y-3 text-sm text-zinc-300">
                          <div className="font-semibold text-emerald-400">8. Редактирование файла зоны au-team.irpo (Замените всё содержимое файла следующим текстом):</div>
                          <CommandBlock command={`$TTL 1D
@ IN SOA au-team.irpo. root.au-team.irpo. (
	2025020600
    12H
    1H
    1W
    1H
)
@       IN NS    hq-srv.au-team.irpo.

hq-rtr  IN A     192.168.100.1
hq-srv  IN A     192.168.100.2
hq-cli  IN A     192.168.200.2
br-rtr  IN A     192.168.0.1
br-srv  IN A     192.168.0.2
docker  IN A     172.16.70.1
web     IN A     172.16.80.1`} />
                          <p className="text-xs text-zinc-500 mt-2">После вставки сохраните файл: нажмите <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Ctrl + X</kbd>, затем <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Y</kbd> и подтвердите клавишей <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Enter</kbd>.</p>
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">9. Копирование шаблона зоны обратного просмотра в качестве основы для обратной зоны 168.192.in-addr.arpa:</div>
                          <CommandBlock command="cp -r /etc/bind/zone/127.in-addr.arpa /etc/bind/zone/168.192.in-addr.arpa" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">10. Открытие файла обратной зоны в редакторе nano:</div>
                          <CommandBlock command="nano /etc/bind/zone/168.192.in-addr.arpa" />
                        </div>

                        <div className="p-4 bg-[#0d0e12]/30 border border-zinc-800/40 rounded-xl space-y-3 text-sm text-zinc-300">
                          <div className="font-semibold text-emerald-400">11. Редактирование файла обратной зоны (Замените всё содержимое файла следующим текстом):</div>
                          <CommandBlock command={`$TTL 1D
@ IN SOA au-team.irpo. root.au-team.irpo. (
    2025020600
    12H
    1H
    1W
    1H
)
@       IN NS    au-team.irpo.

1.100   IN PTR   hq-rtr.au-team.irpo.
2.100   IN PTR   hq-srv.au-team.irpo.
2.200   IN PTR   hq-cli.au-team.irpo.`} />
                          <p className="text-xs text-zinc-500 mt-2">После вставки сохраните файл: нажмите <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Ctrl + X</kbd>, затем <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Y</kbd> и подтвердите клавишей <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Enter</kbd>.</p>
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">12. Установка группы-владельца named для созданных файлов зон:</div>
                          <CommandBlock command="chown :named /etc/bind/zone/au-team.irpo /etc/bind/zone/168.192.in-addr.arpa" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">13. Добавление службы bind в автозагрузку и ее запуск:</div>
                          <CommandBlock command="systemctl enable --now bind" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">14. Перезапуск сетевой службы для применения нового резолвера:</div>
                          <CommandBlock command="service network restart" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">15. Перезапуск службы bind для применения файлов зон:</div>
                          <CommandBlock command="systemctl restart bind.service" />
                        </div>

                        <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl space-y-2 text-sm text-zinc-300">
                          <div className="font-semibold text-emerald-400">16. Проверка корректности разрешения имен:</div>
                          <p>Проверка прямого разрешения (получение IP по доменному имени):</p>
                          <CommandBlock command="host br-rtr" />
                          <p>Проверка обратного разрешения (получение имени по IP-адресу):</p>
                          <CommandBlock command="host -t PTR 192.168.100.2" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionItem>

              <AccordionItem title="Задание 11. Настройте часовой пояс на всех устройствах" level={2}>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 border border-emerald-500/20 bg-emerald-500/5 rounded-xl text-emerald-400 mb-2">
                    <Terminal className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm font-semibold">Данные команды выполняются на всех хостах</span>
                  </div>

                  <p className="text-sm text-zinc-300 leading-relaxed">
                    Для обеспечения синхронизации логов и корректной работы планировщиков задач необходимо настроить единый часовой пояс <code className="text-emerald-400 font-mono text-xs bg-zinc-900/80 px-1.5 py-0.5 rounded border border-zinc-800/80">Asia/Novosibirsk</code> на всех виртуальных машинах лабораторного стенда.
                  </p>

                  <div className="space-y-6">
                    <div className="border border-zinc-800/40 bg-[#0d0e12]/30 p-6 rounded-xl space-y-4">
                      <div className="flex items-center justify-between mb-4 border-b border-zinc-800/60 pb-3">
                        <span className="text-base font-bold text-zinc-100 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                          <span>Настройка часового пояса</span>
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">1. Обновление пакетной базы и установка пакета tzdata для работы с часовыми поясами:</div>
                          <CommandBlock command="apt-get update && apt-get install tzdata -y" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">2. Установка часового пояса Asia/Novosibirsk:</div>
                          <CommandBlock command="timedatectl set-timezone Asia/Novosibirsk" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">3. Проверка текущих настроек системного времени и часового пояса:</div>
                          <CommandBlock command="timedatectl" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionItem>
            </div>
          </AccordionItem>

          {/* MODULE 2 */}
          <AccordionItem title="Модуль 2: Инфраструктурные службы и службы каталогов" level={1}>
            <div className="space-y-4 mt-2">
              <p className="text-sm text-zinc-400 mb-4">
                В этом модуле рассматривается настройка контроллера домена Active Directory на базе Samba DC, управление DNS-записями домена, создание пользователей и групп, а также интеграция смежных сетевых сервисов.
              </p>

              {/* Level 2: Nested tasks */}
              <AccordionItem title="Задание 0. Самостоятельно включите SSH доступ на устройствах (ОБЯЗАТЕЛЬНОЕ)" level={2} titleClassName="text-red-500 group-hover:text-red-400">
                <div className="space-y-4">
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    Для обеспечения удаленного управления в рамках лабораторной работы необходимо самостоятельно включить и настроить SSH доступ на следующих виртуальных машинах: <code className="text-zinc-300 font-mono text-xs bg-zinc-900/60 px-1.5 py-0.5 rounded border border-zinc-800/80">HQ-SRV</code>, <code className="text-zinc-300 font-mono text-xs bg-zinc-900/60 px-1.5 py-0.5 rounded border border-zinc-800/80">HQ-RTR</code>, <code className="text-zinc-300 font-mono text-xs bg-zinc-900/60 px-1.5 py-0.5 rounded border border-zinc-800/80">BR-RTR</code> и <code className="text-zinc-300 font-mono text-xs bg-zinc-900/60 px-1.5 py-0.5 rounded border border-zinc-800/80">HQ-CLI</code>.
                  </p>

                  <div className="space-y-6">
                    <div className="border border-zinc-800/40 bg-[#0d0e12]/30 p-6 rounded-xl space-y-4">
                      <div className="text-sm font-bold text-zinc-100 border-b border-zinc-800/60 pb-3">
                        Инструкция по настройке
                      </div>
                      <div className="space-y-4 text-sm text-zinc-300">
                        <p>Выполните следующие шаги на каждой из указанных машин:</p>
                        
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">1. Редактирование конфигурационного файла sshd_config в редакторе vim:</div>
                          <CommandBlock command="vim /etc/openssh/sshd_config" />
                          <p className="text-xs text-zinc-500 mt-2">
                            Для начала редактирования нажмите клавишу <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">i</kbd> (режим Insert). Убедитесь, что активна английская раскладка клавиатуры.
                          </p>
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">2. Найдите строку Port 2026 и замените порт на 2014:</div>
                          <CommandBlock command="Port 2014" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">3. Сохранение конфигурации и выход из vim:</div>
                          <p className="text-xs text-zinc-500 mb-1">Нажмите клавишу <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Esc</kbd>, введите команду ниже и нажмите <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Enter</kbd>:</p>
                          <CommandBlock command=":wq" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">4. Включение службы sshd в автозагрузку и её запуск:</div>
                          <CommandBlock command="systemctl enable --now sshd" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionItem>

              <AccordionItem title="Задание 1. Настройте контроллер домена Samba DC на BR-SRV" level={2}>
                <div className="space-y-4">
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    Для централизованного управления пользователями и компьютерами на сервере <code className="text-emerald-400 font-mono text-xs bg-zinc-900/80 px-1.5 py-0.5 rounded border border-zinc-800/80">BR-SRV</code> развертывается Samba в роли контроллера домена Active Directory, регистрируются DNS-записи для ключевых хостов и создается тестовая структура пользователей и групп.
                  </p>

                  <div className="space-y-6">
                    {/* BR-SRV */}
                    <div className="border border-zinc-800/40 bg-[#0d0e12]/30 p-6 rounded-xl space-y-4">
                      <div className="flex items-center justify-between mb-4 border-b border-zinc-800/60 pb-3">
                        <span className="text-base font-bold text-zinc-100 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                          <span>BR-SRV</span>
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div className="relative my-4">
                          <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-zinc-800/45"></div>
                          </div>
                          <div className="relative flex justify-start">
                            <span className="bg-[#0f1115] pr-3 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                              Шаг 1. Подготовка и развертывание Samba DC
                            </span>
                          </div>
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">1. Добавление IP-адреса DNS-сервера в конфигурацию резолвера сетевого интерфейса enp7s1:</div>
                          <CommandBlock command='echo "nameserver 192.168.1.10" >> /etc/net/ifaces/enp7s1/resolv.conf' />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">2. Перезапуск сетевой службы для применения новой конфигурации:</div>
                          <CommandBlock command="systemctl restart network" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">3. Проверка текущих настроек DNS-клиента:</div>
                          <CommandBlock command="cat /etc/resolv.conf" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">4. Проверка доступности внешней сети (двумя ICMP-запросами):</div>
                          <CommandBlock command="ping ya.ru -c 2" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">5. Установка пакета Samba для развертывания контроллера домена:</div>
                          <CommandBlock command="apt-get update && apt-get install task-samba-dc -y" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">6. Удаление предустановленной стандартной конфигурации Samba:</div>
                          <CommandBlock command="rm -f /etc/samba/smb.conf" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">7. Очистка кэша и старых баз данных Samba перед развертыванием:</div>
                          <CommandBlock command="rm -rf {/var/lib/samba, /var/cache/samba}" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">8. Создание каталога системного общего ресурса sysvol:</div>
                          <CommandBlock command="mkdir -p /var/lib/samba/sysvol" />
                        </div>

                        <div className="p-4 bg-[#0d0e12]/30 border border-zinc-800/40 rounded-xl space-y-2 text-sm text-zinc-300">
                          <div className="font-semibold text-emerald-400">9. Интерактивный запуск мастера развертывания домена:</div>
                          <CommandBlock command="samba-tool domain provision" />
                          <div className="text-xs text-zinc-400 leading-relaxed mt-2 space-y-1">
                            <p>• Везде соглашаемся со значениями по умолчанию (нажимаем <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Enter</kbd>).</p>
                            <p>• Пароль Администратора задаем: <code className="text-zinc-200 bg-zinc-900/60 px-1.5 py-0.5 rounded border border-zinc-800/80 font-mono text-xs">P@ssw0rd</code></p>
                          </div>
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">10. Резервное переименование старой конфигурации Kerberos:</div>
                          <CommandBlock command="mv /etc/krb5.conf /etc/krb5.conf.back" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">11. Копирование сгенерированного файла конфигурации Kerberos из Samba:</div>
                          <CommandBlock command="cp /var/lib/samba/private/krb5.conf /etc/krb5.conf" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">12. Добавление службы samba (AD DC) в автозагрузку и ее немедленный запуск:</div>
                          <CommandBlock command="systemctl enable --now samba" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">13. Проверка текущего статуса запущенной службы Samba:</div>
                          <CommandBlock command="systemctl status samba" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">Для выхода из режима просмотра статуса службы Samba:</div>
                          <p className="text-xs text-zinc-500 mb-1">Нажмите сочетание клавиш <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Ctrl + C</kbd> (нажать 2 раза).</p>
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">14. Проверка общей информации о развернутом домене на локальном интерфейсе:</div>
                          <CommandBlock command="samba-tool domain info 127.0.0.1" />
                        </div>

                        <div className="relative my-6">
                          <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-zinc-800/45"></div>
                          </div>
                          <div className="relative flex justify-start">
                            <span className="bg-[#0f1115] pr-3 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                              Шаг 2. Настройка записей DNS
                            </span>
                          </div>
                        </div>

                        <div className="p-4 bg-[#0d0e12]/30 border border-zinc-800/40 rounded-xl space-y-4">
                          <div className="font-semibold text-emerald-400 text-sm">Добавление А-записей для инфраструктурных узлов в DNS Samba:</div>
                          
                          <div>
                            <div className="text-xs text-zinc-400 mb-1">15. Запись для HQ-SRV (при запросе введите пароль: <code className="text-zinc-300 font-mono text-xs">P@ssw0rd</code>):</div>
                            <CommandBlock command="samba-tool dns add br-srv.au-team.irpo au-team.irpo hq-srv A 192.168.1.10 -U Administrator" />
                          </div>

                          <div>
                            <div className="text-xs text-zinc-400 mb-1">16. Запись для HQ-RTR (при запросе введите пароль: <code className="text-zinc-300 font-mono text-xs">P@ssw0rd</code>):</div>
                            <CommandBlock command="samba-tool dns add br-srv.au-team.irpo au-team.irpo hq-rtr A 192.168.1.1 -U Administrator" />
                          </div>

                          <div>
                            <div className="text-xs text-zinc-400 mb-1">17. Запись для BR-RTR (при запросе введите пароль: <code className="text-zinc-300 font-mono text-xs">P@ssw0rd</code>):</div>
                            <CommandBlock command="samba-tool dns add br-srv.au-team.irpo au-team.irpo br-rtr A 192.168.3.1 -U Administrator" />
                          </div>

                          <div>
                            <div className="text-xs text-zinc-400 mb-1">18. Запись для web.au-team.irpo (при запросе введите пароль: <code className="text-zinc-300 font-mono text-xs">P@ssw0rd</code>):</div>
                            <CommandBlock command="samba-tool dns add br-srv.au-team.irpo au-team.irpo web.au-team.irpo A 172.16.1.1 -U Administrator" />
                          </div>

                          <div>
                            <div className="text-xs text-zinc-400 mb-1">19. Запись для docker.au-team.irpo (при запросе введите пароль: <code className="text-zinc-300 font-mono text-xs">P@ssw0rd</code>):</div>
                            <CommandBlock command="samba-tool dns add br-srv.au-team.irpo au-team.irpo docker.au-team.irpo A 172.16.2.1 -U Administrator" />
                          </div>
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">20. Просмотр всех добавленных DNS-записей зоны для проверки (введите пароль: <code className="text-zinc-300 font-mono text-xs">P@ssw0rd</code>):</div>
                          <CommandBlock command="samba-tool dns query br-srv.au-team.irpo au-team.irpo @ ALL -U administrator" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">21. Перенаправление DNS-клиента enp7s1 на локальную петлю 127.0.0.1:</div>
                          <CommandBlock command="sed -i 's/nameserver 192.168.1.10/nameserver 127.0.0.1/' /etc/net/ifaces/enp7s1/resolv.conf" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">22. Перезапуск сетевой службы для применения изменений:</div>
                          <CommandBlock command="systemctl restart network" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">23. Проверка корректности обновленного файла resolv.conf:</div>
                          <CommandBlock command="cat /etc/resolv.conf" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">24. Инициализация билета Kerberos для Администратора домена (введите пароль: <code className="text-zinc-300 font-mono text-xs">P@ssw0rd</code>):</div>
                          <CommandBlock command="kinit administrator@AU-TEAM.IRPO" />
                        </div>

                        <div className="relative my-6">
                          <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-zinc-800/45"></div>
                          </div>
                          <div className="relative flex justify-start">
                            <span className="bg-[#0f1115] pr-3 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                              Шаг 3. Создание групп и пользователей домена
                            </span>
                          </div>
                        </div>

                        <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl space-y-4">
                          <div className="text-sm font-semibold text-emerald-400">Пакетное создание пользователей:</div>
                          
                          <div>
                            <div className="text-xs text-zinc-400 mb-1">25. Добавление новой группы безопасности hq:</div>
                            <CommandBlock command="samba-tool group add hq" />
                          </div>

                          <div>
                            <div className="text-xs text-zinc-400 mb-1">26. Создание пяти пользователей hquser1–hquser5 с паролем P@ssw0rd:</div>
                            <CommandBlock command="for i in {1..5}; do samba-tool user add hquser$i P@ssw0rd; done" />
                          </div>

                          <div>
                            <div className="text-xs text-zinc-400 mb-1">27. Добавление созданных пользователей в группу hq:</div>
                            <CommandBlock command="for i in {1..5}; do samba-tool group addmembers hq hquser$i; done" />
                          </div>

                          <div>
                            <div className="text-xs text-zinc-400 mb-1">28. Просмотр списка участников группы hq для проверки добавления:</div>
                            <CommandBlock command="samba-tool group listmembers hq" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* HQ-RTR */}
                    <div className="border border-zinc-800/40 bg-[#0d0e12]/30 p-6 rounded-xl space-y-4">
                      <div className="flex items-center justify-between mb-4 border-b border-zinc-800/60 pb-3">
                        <span className="text-base font-bold text-zinc-100 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                          <span>HQ-RTR</span>
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">1. Замена IP-адреса DNS-сервера в файле конфигурации dnsmasq на новый адрес контроллера домена Samba и перезапуск dnsmasq:</div>
                          <CommandBlock command="sed -i 's/192.168.1.10/192.168.3.10/' /etc/dnsmasq.conf; systemctl restart dnsmasq" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">2. Проверка обновленного конфигурационного файла dnsmasq:</div>
                          <CommandBlock command="cat /etc/dnsmasq.conf" />
                        </div>
                      </div>
                    </div>

                    {/* HQ-CLI */}
                    <div className="border border-zinc-800/40 bg-[#0d0e12]/30 p-6 rounded-xl space-y-4">
                      <div className="flex items-center justify-between mb-4 border-b border-zinc-800/60 pb-3">
                        <span className="text-base font-bold text-zinc-100 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                          <span>HQ-CLI</span>
                        </span>
                      </div>

                      <div className="space-y-6">
                        {/* PHASE 1 */}
                        <div className="space-y-4">
                          <div className="relative my-4">
                            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                              <div className="w-full border-t border-zinc-800/45"></div>
                            </div>
                            <div className="relative flex justify-start">
                              <span className="bg-[#0f1115] pr-3 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                                Шаг 1. Ввод в домен Active Directory (Графическая оболочка)
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 p-4 border border-blue-500/20 bg-blue-500/5 rounded-xl text-blue-400 mb-2">
                            <Terminal className="w-5 h-5 flex-shrink-0" />
                            <span className="text-sm font-semibold">Работаем в графической оболочке HQ-CLI (под пользователем user)</span>
                          </div>

                          <div className="rounded-xl overflow-hidden border border-zinc-800/80 bg-zinc-950/40 my-4 shadow-inner max-w-[700px] w-full flex-shrink-0">
                            <Image
                              src="/screenshot/log1.png"
                              alt="Графическая оболочка HQ-CLI"
                              width={700}
                              height={394}
                              className="w-full h-auto object-contain opacity-90 transition-opacity hover:opacity-100 duration-300"
                            />
                          </div>

                          <div className="text-sm text-zinc-300 space-y-2 leading-relaxed">
                            <p>1. Перезагрузите сеть на HQ-CLI, проверьте DNS-сервер и убедитесь, что машина готова к вводу в домен:</p>
                          </div>

                          <div className="grid grid-cols-1 gap-4 my-4">
                            <div className="rounded-xl overflow-hidden border border-zinc-800/80 bg-zinc-950/40 shadow-inner max-w-[700px] w-full flex-shrink-0">
                              <Image
                                src="/screenshot/log2.png"
                                alt="Перезагрузка сети и проверка DNS"
                                width={700}
                                height={394}
                                className="w-full h-auto object-contain opacity-90"
                              />
                            </div>
                            <div className="rounded-xl overflow-hidden border border-zinc-800/80 bg-zinc-950/40 shadow-inner max-w-[700px] w-full flex-shrink-0">
                              <Image
                                src="/screenshot/log3.png"
                                alt="Проверка резолвера DNS"
                                width={700}
                                height={394}
                                className="w-full h-auto object-contain opacity-90"
                              />
                            </div>
                            <div className="rounded-xl overflow-hidden border border-zinc-800/80 bg-zinc-950/40 shadow-inner max-w-[700px] w-full flex-shrink-0">
                              <Image
                                src="/screenshot/log4.png"
                                alt="Готовность к вводу в домен"
                                width={700}
                                height={394}
                                className="w-full h-auto object-contain opacity-90"
                              />
                            </div>
                          </div>

                          <div className="text-sm text-zinc-300 space-y-2 leading-relaxed pt-2">
                            <p>2. Откройте терминал и выполните команду для запуска Центра управления (alterator):</p>
                            <CommandBlock command="acc" />
                            <p className="text-xs text-zinc-500 mt-1">При запросе пароля введите: <code className="text-zinc-300 font-mono text-xs">toor</code></p>
                          </div>

                          <div className="grid grid-cols-1 gap-4 my-4">
                            <div className="rounded-xl overflow-hidden border border-zinc-800/80 bg-zinc-950/40 shadow-inner max-w-[700px] w-full flex-shrink-0">
                              <Image
                                src="/screenshot/log5.png"
                                alt="Запуск alterator-center"
                                width={700}
                                height={394}
                                className="w-full h-auto object-contain opacity-90"
                              />
                            </div>
                            <div className="rounded-xl overflow-hidden border border-zinc-800/80 bg-zinc-950/40 shadow-inner max-w-[700px] w-full flex-shrink-0">
                              <Image
                                src="/screenshot/log6.png"
                                alt="Ввод пароля администратора"
                                width={700}
                                height={394}
                                className="w-full h-auto object-contain opacity-90"
                              />
                            </div>
                          </div>

                          <div className="text-sm text-zinc-300 space-y-2 leading-relaxed pt-2">
                            <p>3. Перейдите во вкладку <strong className="text-zinc-100">Пользователи</strong> (Аутентификация). Поставьте галочку <strong className="text-zinc-100">Домен Active Directory</strong>, нажмите кнопку <strong className="text-zinc-200">Применить</strong> и введите пароль домена: <code className="text-zinc-200 font-mono text-xs bg-zinc-900/60 px-1.5 py-0.5 rounded border border-zinc-800/80">P@ssw0rd</code>.</p>
                            <p>Если настройка выполнена верно, отобразится всплывающее окно: <strong className="text-emerald-400">Добро пожаловать в домен AU-TEAM.IRPO</strong>.</p>
                          </div>

                          <div className="grid grid-cols-1 gap-4 my-4">
                            <div className="rounded-xl overflow-hidden border border-zinc-800/80 bg-zinc-950/40 shadow-inner max-w-[700px] w-full flex-shrink-0">
                              <Image
                                src="/screenshot/log7.png"
                                alt="Выбор типа аутентификации"
                                width={700}
                                height={394}
                                className="w-full h-auto object-contain opacity-90"
                              />
                            </div>
                            <div className="rounded-xl overflow-hidden border border-zinc-800/80 bg-zinc-950/40 shadow-inner max-w-[700px] w-full flex-shrink-0">
                              <Image
                                src="/screenshot/log8.png"
                                alt="Включение Active Directory"
                                width={700}
                                height={394}
                                className="w-full h-auto object-contain opacity-90"
                              />
                            </div>
                            <div className="rounded-xl overflow-hidden border border-zinc-800/80 bg-zinc-950/40 shadow-inner max-w-[700px] w-full flex-shrink-0">
                              <Image
                                src="/screenshot/log9.png"
                                alt="Авторизация администратора домена"
                                width={700}
                                height={394}
                                className="w-full h-auto object-contain opacity-90"
                              />
                            </div>
                            <div className="rounded-xl overflow-hidden border border-zinc-800/80 bg-zinc-950/40 shadow-inner max-w-[700px] w-full flex-shrink-0">
                              <Image
                                src="/screenshot/log10.png"
                                alt="Процесс добавления в домен"
                                width={700}
                                height={394}
                                className="w-full h-auto object-contain opacity-90"
                              />
                            </div>
                            <div className="rounded-xl overflow-hidden border border-zinc-800/80 bg-zinc-950/40 shadow-inner max-w-[700px] w-full flex-shrink-0">
                              <Image
                                src="/screenshot/log11.png"
                                alt="Успешный ввод в домен"
                                width={700}
                                height={394}
                                className="w-full h-auto object-contain opacity-90"
                              />
                            </div>
                          </div>

                          <div className="text-sm text-zinc-300 space-y-2 leading-relaxed pt-2">
                            <p>4. Перезагрузите систему через главное меню: <strong className="text-zinc-100">Меню → Выйти → Перезагрузить</strong>:</p>
                          </div>

                          <div className="grid grid-cols-1 gap-4 my-4">
                            <div className="rounded-xl overflow-hidden border border-zinc-800/80 bg-zinc-950/40 shadow-inner max-w-[700px] w-full flex-shrink-0">
                              <Image
                                src="/screenshot/log12.png"
                                alt="Перезагрузка ОС"
                                width={700}
                                height={394}
                                className="w-full h-auto object-contain opacity-90"
                              />
                            </div>
                            <div className="rounded-xl overflow-hidden border border-zinc-800/80 bg-zinc-950/40 shadow-inner max-w-[700px] w-full flex-shrink-0">
                              <Image
                                src="/screenshot/log13.png"
                                alt="Подтверждение перезагрузки"
                                width={700}
                                height={394}
                                className="w-full h-auto object-contain opacity-90"
                              />
                            </div>
                          </div>

                          <div className="text-sm text-zinc-300 space-y-2 leading-relaxed pt-2">
                            <p>5. На экране входа в систему авторизуйтесь под созданным доменным пользователем:</p>
                            <ul className="list-disc pl-5 space-y-1 text-xs text-zinc-400">
                              <li>Пользователь: <code className="text-zinc-300 font-mono text-xs">hquser1</code></li>
                              <li>Пароль: <code className="text-zinc-300 font-mono text-xs">P@ssw0rd</code></li>
                            </ul>
                          </div>
                        </div>

                        {/* PHASE 2 */}
                        <div className="space-y-4">
                          <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                              <div className="w-full border-t border-zinc-800/45"></div>
                            </div>
                            <div className="relative flex justify-start">
                              <span className="bg-[#0f1115] pr-3 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                                Шаг 2. Настройка ролей и sudo (Консольная оболочка root)
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 p-4 border border-red-500/20 bg-red-500/5 rounded-xl text-red-400 mb-2">
                            <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                            <span className="text-sm font-semibold">Работаем в консольной оболочке HQ-CLI (под пользователем root)</span>
                          </div>

                          <div>
                            <div className="text-xs text-zinc-400 font-semibold mb-1">1. Проверка активности переключателя libnss-role (должна выдать enabled):</div>
                            <CommandBlock command="control libnss-role" />
                          </div>

                          <div>
                            <div className="text-xs text-zinc-400 font-semibold mb-1">2. Связывание доменной группы hq с системной ролью wheel:</div>
                            <CommandBlock command="roleadd hq wheel" />
                          </div>

                          <div>
                            <div className="text-xs text-zinc-400 font-semibold mb-1">3. Предоставление роли wheel прав на выполнение определенных команд (cat, grep, id) без пароля через sudo:</div>
                            <CommandBlock command='echo "WHEEL_USERS ALL=(ALL:ALL) /bin/cat, /bin/grep, /usr/bin/id" >> /etc/sudoers' />
                          </div>

                          <div>
                            <div className="text-xs text-zinc-400 font-semibold mb-1">4. Просмотр последних строк конфигурации sudoers для контроля изменений:</div>
                            <CommandBlock command="tail /etc/sudoers" />
                          </div>
                        </div>

                        {/* PHASE 3 */}
                        <div className="space-y-4">
                          <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                              <div className="w-full border-t border-zinc-800/45"></div>
                            </div>
                            <div className="relative flex justify-start">
                              <span className="bg-[#0f1115] pr-3 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                                Шаг 3. Проверка авторизации и команд sudo (Графическая оболочка)
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 p-4 border border-blue-500/20 bg-blue-500/5 rounded-xl text-blue-400 mb-2">
                            <Terminal className="w-5 h-5 flex-shrink-0" />
                            <span className="text-sm font-semibold">Работаем в графической оболочке HQ-CLI (под пользователем user)</span>
                          </div>

                          <div className="text-sm text-zinc-300 space-y-2 leading-relaxed">
                            <p>1. Снова перезагрузите машину: <strong className="text-zinc-100">Меню → Выйти → Перезагрузить</strong>.</p>
                            <p>2. Логинимся под доменным пользователем:</p>
                            <ul className="list-disc pl-5 space-y-1 text-xs text-zinc-400">
                              <li>Пользователь: <code className="text-zinc-300 font-mono text-xs">hquser1</code></li>
                              <li>Пароль: <code className="text-zinc-300 font-mono text-xs">P@ssw0rd</code></li>
                            </ul>
                            <p className="pt-2">3. Откройте терминал на рабочем столе и выполните проверочные команды:</p>
                          </div>

                          <div>
                            <div className="text-xs text-zinc-400 mb-1">Проверка id (при запросе вводим пароль пользователя):</div>
                            <CommandBlock command="sudo id" />
                          </div>

                          <div>
                            <div className="text-xs text-zinc-400 mb-1">Проверка чтения файла resolv.conf (при запросе вводим пароль пользователя):</div>
                            <CommandBlock command="sudo cat /etc/resolv.conf" />
                          </div>

                          <div>
                            <div className="text-xs text-zinc-400 mb-1">Проверка работы утилиты grep (при запросе вводим пароль пользователя):</div>
                            <CommandBlock command="sudo grep" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionItem>

              <AccordionItem title="Задание 2. Сконфигурируйте файловое хранилище на HQ-SRV" level={2}>
                <div className="space-y-4">
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    Для создания производительного и надежного хранилища данных на сервере <code className="text-emerald-400 font-mono text-xs bg-zinc-900/80 px-1.5 py-0.5 rounded border border-zinc-800/80">HQ-SRV</code> настраивается программный RAID-массив уровня 5 из трех доступных дисков, форматируется в файловую систему ext4 и монтируется в систему с настройкой автоматического подключения.
                  </p>

                  <div className="space-y-6">
                    {/* HQ-SRV */}
                    <div className="border border-zinc-800/40 bg-[#0d0e12]/30 p-6 rounded-xl space-y-4">
                      <div className="flex items-center justify-between mb-4 border-b border-zinc-800/60 pb-3">
                        <span className="text-base font-bold text-zinc-100 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                          <span>HQ-SRV</span>
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">1. Проверка доступных дисков и разделов в системе:</div>
                          <CommandBlock command="lsblk" />
                          <div className="mt-2 text-xs text-zinc-400">
                            Ожидаемый вывод (в системе должно присутствовать 3 диска по 1 ГБ):
                            <pre className="p-3 rounded-lg bg-[#050608] border border-zinc-800/60 text-zinc-300 font-mono text-xs mt-1 overflow-x-auto">
{`sdb 8:16 0 1G 0 disk
sdc 8:32 0 1G 0 disk
sdd 8:48 0 1G 0 disk`}
                            </pre>
                          </div>
                        </div>

                        <div className="p-4 bg-[#0d0e12]/30 border border-zinc-800/40 rounded-xl space-y-2 text-sm text-zinc-300">
                          <div className="font-semibold text-emerald-400">2. Интерактивная разметка дисков в утилите parted:</div>
                          <CommandBlock command="parted /dev/sdb" />
                          <div className="text-xs text-zinc-400 leading-relaxed mt-2 space-y-2">
                            <p>После входа в интерактивный режим parted выполните следующие команды поочередно для разметки <code className="text-zinc-200 bg-zinc-900/60 px-1 py-0.5 rounded border border-zinc-800/80">sdb</code>, <code className="text-zinc-200 bg-zinc-900/60 px-1 py-0.5 rounded border border-zinc-800/80">sdc</code> и <code className="text-zinc-200 bg-zinc-900/60 px-1 py-0.5 rounded border border-zinc-800/80">sdd</code>:</p>
                            <CommandBlock command={`mklabel msdos
mkpart primary 1MiB 100%
set 1 raid on
print
select /dev/sdc
mklabel msdos
mkpart primary 1MiB 100%
set 1 raid on
print
select /dev/sdd
mklabel msdos
mkpart primary 1MiB 100%
set 1 raid on
print
quit`} />
                          </div>
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">3. Создание программного RAID-5 массива (md4) из трех размеченных разделов:</div>
                          <CommandBlock command="mdadm --create /dev/md4 --level=5 --raid-devices=3 /dev/sdb1 /dev/sdc1 /dev/sdd1" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">4. Инициализация конфигурационного файла mdadm.conf:</div>
                          <CommandBlock command='echo "DEVICE partitions" > /etc/mdadm.conf' />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">5. Сохранение конфигурации RAID-массива в конфигурационный файл для автосборки при загрузке:</div>
                          <CommandBlock command="mdadm --detail --scan --verbose >> /etc/mdadm.conf" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">6. Форматирование созданного RAID-массива в файловую систему ext4:</div>
                          <CommandBlock command="mkfs.ext4 /dev/md4" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">7. Создание точки монтирования для RAID-массива:</div>
                          <CommandBlock command="mkdir -p /raid" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">8. Создание резервной копии конфигурационного файла fstab:</div>
                          <CommandBlock command="cp /etc/fstab /etc/fstab.bak" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">9. Добавление записи монтирования RAID-массива в автозагрузку (/etc/fstab):</div>
                          <CommandBlock command='echo "/dev/md4 /raid ext4 defaults 0 0" >> /etc/fstab' />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">10. Монтирование всех файловых систем, описанных в fstab:</div>
                          <CommandBlock command="mount -a" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">11. Проверка типов и статуса смонтированных разделов:</div>
                          <CommandBlock command="df -Th" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionItem>

              <AccordionItem title="Задание 3. Настройте сервер сетевой файловой системы" level={2}>
                <div className="space-y-4">
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    Для организации сетевого файлового хранилища настраивается служба NFS (Network File System). Общий каталог на сервере <code className="text-emerald-400 font-mono text-xs bg-zinc-900/80 px-1.5 py-0.5 rounded border border-zinc-800/80">HQ-SRV</code> предоставляется в пользование клиенту <code className="text-emerald-400 font-mono text-xs bg-zinc-900/80 px-1.5 py-0.5 rounded border border-zinc-800/80">HQ-CLI</code> с настройкой автоматического монтирования при загрузке.
                  </p>

                  <div className="space-y-6">
                    {/* HQ-SRV */}
                    <div className="border border-zinc-800/40 bg-[#0d0e12]/30 p-6 rounded-xl space-y-4">
                      <div className="flex items-center justify-between mb-4 border-b border-zinc-800/60 pb-3">
                        <span className="text-base font-bold text-zinc-100 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                          <span>HQ-SRV</span>
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">1. Установка пакетов NFS-сервера и вспомогательных утилит:</div>
                          <CommandBlock command="apt-get update && apt-get install nfs-server nfs-utils -y" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">2. Создание сетевой папки на RAID-массиве:</div>
                          <CommandBlock command="mkdir /raid/nfs" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">3. Установка полных прав доступа на созданную папку:</div>
                          <CommandBlock command="chmod 777 /raid/nfs" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">4. Резервное копирование конфигурационного файла экспорта NFS:</div>
                          <CommandBlock command="cp /etc/exports /etc/exports.back" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">5. Разрешение доступа к папке для подсети клиентов с правами записи:</div>
                          <CommandBlock command='echo "/raid/nfs 192.168.2.0/27(rw,no_subtree_check,no_root_squash)" >> /etc/exports' />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">6. Добавление службы nfs-server в автозагрузку и ее запуск:</div>
                          <CommandBlock command="systemctl enable --now nfs-server" />
                        </div>
                      </div>
                    </div>

                    {/* HQ-CLI */}
                    <div className="border border-zinc-800/40 bg-[#0d0e12]/30 p-6 rounded-xl space-y-4">
                      <div className="flex items-center justify-between mb-4 border-b border-zinc-800/60 pb-3">
                        <span className="text-base font-bold text-zinc-100 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                          <span>HQ-CLI</span>
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-3 p-4 border border-red-500/20 bg-red-500/5 rounded-xl text-red-400 mb-2">
                          <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                          <span className="text-sm font-semibold">Работаем в консольной оболочке HQ-CLI (под пользователем root)</span>
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">1. Создание точки монтирования для сетевого хранилища:</div>
                          <CommandBlock command="mkdir /mnt/nfs" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">2. Установка полных прав доступа на точку монтирования:</div>
                          <CommandBlock command="chmod -R 777 /mnt/nfs" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">3. Проверка доступных для монтирования NFS-ресурсов на сервере HQ-SRV:</div>
                          <CommandBlock command="showmount -e hq-srv" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">4. Резервное копирование файла конфигурации fstab:</div>
                          <CommandBlock command="cp /etc/fstab /etc/fstab.back" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">5. Настройка автоматического монтирования сетевой папки при загрузке системы (/etc/fstab):</div>
                          <CommandBlock command='echo "192.168.1.10:/raid/nfs /mnt/nfs nfs rw,soft,_netdev 0 0 " >> /etc/fstab' />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">6. Монтирование файловых систем для проверки внесенной конфигурации:</div>
                          <CommandBlock command="mount -av" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">7. Проверка успешности монтирования и параметров сетевого диска:</div>
                          <CommandBlock command="df -T" />
                        </div>
                      </div>
                    </div>

                    {/* Verification */}
                    <div className="border border-zinc-800/40 bg-zinc-950/10 p-6 rounded-xl space-y-4">
                      <div className="text-sm font-bold text-zinc-200 border-b border-zinc-800/60 pb-3 flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-emerald-400" />
                        <span>Верификация совместного доступа</span>
                      </div>

                      <div className="space-y-4 text-sm text-zinc-300">
                        <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl space-y-3">
                          <div className="font-semibold text-emerald-400">Шаг 1. Действия на клиенте HQ-CLI:</div>
                          <p>Создайте тестовый файл на примонтированном сетевом диске и проверьте права:</p>
                          <CommandBlock command="touch /mnt/nfs/test_file" />
                          <CommandBlock command="ls -l /mnt/nfs/test_file" />
                        </div>

                        <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl space-y-3">
                          <div className="font-semibold text-emerald-400">Шаг 2. Действия на сервере HQ-SRV:</div>
                          <p>Убедитесь, что созданный клиентом файл отображается на локальном RAID-массиве сервера:</p>
                          <CommandBlock command="ls -l /raid/nfs" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionItem>

              <AccordionItem title="Задание 4. Настройте службу сетевого времени на базе сервиса chrony" level={2}>
                <div className="space-y-4">
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    Для обеспечения точной синхронизации времени в локальной сети настраивается служба NTP-клиентов и серверов на базе <code className="text-emerald-400 font-mono text-xs bg-zinc-900/80 px-1.5 py-0.5 rounded border border-zinc-800/80">chrony</code>. Пограничный маршрутизатор <code className="text-emerald-400 font-mono text-xs bg-zinc-900/80 px-1.5 py-0.5 rounded border border-zinc-800/80">ISP</code> настраивается в качестве локального источника точного времени (Stratum 9), а остальные хосты синхронизируются с ним.
                  </p>

                  <div className="space-y-6">
                    {/* ISP */}
                    <div className="border border-zinc-800/40 bg-[#0d0e12]/30 p-6 rounded-xl space-y-4">
                      <div className="flex items-center justify-between mb-4 border-b border-zinc-800/60 pb-3">
                        <span className="text-base font-bold text-zinc-100 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                          <span>ISP</span>
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">1. Разрешение работы chrony в качестве NTP-сервера в системе:</div>
                          <CommandBlock command="control chrony server" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">2. Корректировка параметров пулов времени в файле /etc/chrony.conf:</div>
                          <CommandBlock command="sed -i 's/pool pool.ntp.org iburst/pool pool.ntp.org iburst prefer minstratum 4/' /etc/chrony.conf | grep pool /etc/chrony.conf" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">3. Активация локального stratum 6 для работы без внешнего интернета:</div>
                          <CommandBlock command={'sed -i \'s/\\#local stratum 10/local stratum 9/\' /etc/chrony.conf | grep "local stratum" /etc/chrony.conf'} />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">4. Перезапуск службы chronyd для применения настроек:</div>
                          <CommandBlock command="systemctl restart chronyd" />
                        </div>
                      </div>
                    </div>

                    {/* HQ-SRV, BR-RTR, BR-SRV */}
                    <div className="border border-zinc-800/40 bg-[#0d0e12]/30 p-6 rounded-xl space-y-4">
                      <div className="flex items-center justify-between mb-4 border-b border-zinc-800/60 pb-3">
                        <span className="text-base font-bold text-zinc-100 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                          <span>Клиенты синхронизации (HQ-SRV, BR-RTR, BR-SRV)</span>
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">1. Перенаправление пула времени на локальный адрес ISP (172.16.1.1) и перезапуск службы chronyd:</div>
                          <CommandBlock command="sed -i 's/pool pool.ntp.org iburst/server 172.16.1.1 iburst/' /etc/chrony.conf && systemctl restart chronyd" />
                        </div>

                        <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl space-y-2 text-sm text-zinc-300">
                          <div className="font-semibold text-emerald-400">2. Проверка источников времени (выполняется через 10 секунд после перезапуска):</div>
                          <CommandBlock command="chronyc sources" />
                          <div className="mt-2 text-xs text-zinc-400">
                            Ожидаемый вывод команды (в качестве активного источника должен определиться ISP):
                            <pre className="p-3 rounded-lg bg-[#050608] border border-zinc-800/60 text-zinc-300 font-mono text-xs mt-1 overflow-x-auto">
{`MS Name/IP address         Stratum Poll Reach LastRx Last sample               
===============================================================================
^* 172.16.1.1                    5   6    17     1  +1438ns[  +43us] +/-   38ms`}
                            </pre>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* HQ-CLI */}
                    <div className="border border-zinc-800/40 bg-[#0d0e12]/30 p-6 rounded-xl space-y-4">
                      <div className="flex items-center justify-between mb-4 border-b border-zinc-800/60 pb-3">
                        <span className="text-base font-bold text-zinc-100 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                          <span>HQ-CLI</span>
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">1. Добавление локального NTP-сервера ISP в конец файла конфигурации и перезапуск chronyd:</div>
                          <CommandBlock command='echo "server 172.16.1.1 iburst" >> /etc/chrony.conf && systemctl restart chronyd' />
                        </div>

                        <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl space-y-2 text-sm text-zinc-300">
                          <div className="font-semibold text-emerald-400">2. Проверка источников синхронизации времени (выполняется через 10 секунд):</div>
                          <CommandBlock command="chronyc sources" />
                          <div className="mt-2 text-xs text-zinc-400">
                            Ожидаемый вывод:
                            <pre className="p-3 rounded-lg bg-[#050608] border border-zinc-800/60 text-zinc-300 font-mono text-xs mt-1 overflow-x-auto">
{`MS Name/IP address         Stratum Poll Reach LastRx Last sample               
===============================================================================
^? 192.168.1.1                   0   6    0      -     +0ns[  +0us]  +/-    0ms
^* 172.16.1.1                    5   6    17     1  +1438ns[  +43us] +/-   38ms`}
                            </pre>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionItem>

              <AccordionItem title="Задание 5. Сконфигурируйте ansible на сервере BR-SRV" level={2}>
                <div className="space-y-4">
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    Для автоматизации управления конфигурациями и удаленного администрирования узлов на сервере <code className="text-emerald-400 font-mono text-xs bg-zinc-900/80 px-1.5 py-0.5 rounded border border-zinc-800/80">BR-SRV</code> настраивается система управления конфигурациями <code className="text-emerald-400 font-mono text-xs bg-zinc-900/80 px-1.5 py-0.5 rounded border border-zinc-800/80">Ansible</code>. Настраивается файл инвентаря с реквизитами доступа к остальным узлам лабораторного стенда и отключается строгая проверка SSH-ключей.
                  </p>

                  <div className="space-y-6">
                    {/* BR-SRV */}
                    <div className="border border-zinc-800/40 bg-[#0d0e12]/30 p-6 rounded-xl space-y-4">
                      <div className="flex items-center justify-between mb-4 border-b border-zinc-800/60 pb-3">
                        <span className="text-base font-bold text-zinc-100 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                          <span>BR-SRV</span>
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">1. Установка Ansible и sshpass (для аутентификации по паролю):</div>
                          <CommandBlock command="apt-get install ansible sshpass -y" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">2. Резервное копирование оригинального файла конфигурации Ansible:</div>
                          <CommandBlock command="cp -r /etc/ansible/ansible.cfg /etc/ansible/ansible.cfg.back" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">3. Удаление дефолтного конфигурационного файла для создания чистого:</div>
                          <CommandBlock command="rm -rf /etc/ansible/ansible.cfg" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">4. Открытие нового файла конфигурации Ansible в редакторе vim:</div>
                          <CommandBlock command="vim /etc/ansible/ansible.cfg" />
                        </div>

                        <div className="p-4 bg-[#0d0e12]/30 border border-zinc-800/40 rounded-xl space-y-2 text-sm text-zinc-300 leading-relaxed">
                          <div className="font-semibold text-emerald-400">5. Редактирование конфигурации в vim:</div>
                          <p>Впишите в самое начало файла следующие строки:</p>
                          <pre className="p-4 rounded-lg bg-[#050608] border border-zinc-800/60 text-zinc-200 font-mono text-xs leading-relaxed overflow-x-auto select-all my-2">
{`[defaults]
host_key_checking = False
interpreter_python=/usr/bin/python3
inventory       = /etc/ansible/hosts`}
                          </pre>
                          <p className="text-xs text-zinc-500 mt-1">Для начала редактирования нажмите клавишу <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">i</kbd> (режим Insert). Убедитесь, что активна английская раскладка клавиатуры.</p>
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">6. Сохранение изменений и выход из редактора vim:</div>
                          <p className="text-xs text-zinc-500 mb-1">Нажмите клавишу <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Esc</kbd>, введите команду ниже и нажмите <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Enter</kbd>:</p>
                          <CommandBlock command=":wq" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">7. Открытие файла инвентаря hosts в редакторе vim:</div>
                          <CommandBlock command="vim /etc/ansible/hosts" />
                        </div>

                        <div className="p-4 bg-[#0d0e12]/30 border border-zinc-800/40 rounded-xl space-y-2 text-sm text-zinc-300 leading-relaxed">
                          <div className="font-semibold text-emerald-400">8. Редактирование конфигурации в vim:</div>
                          <p>Впишите в самое начало файла следующие строки:</p>
                          <pre className="p-4 rounded-lg bg-[#050608] border border-zinc-800/60 text-zinc-200 font-mono text-xs leading-relaxed overflow-x-auto select-all my-2">
{`HQ-SRV ansible_user=user ansible_password=resu ansible_port=2014
HQ-RTR ansible_user=net_admin ansible_password=P@ssw0rd ansible_port=2014
BR-RTR ansible_user=net_admin ansible_password=P@ssw0rd ansible_port=2014
HQ-CLI ansible_user=user ansible_password=resu ansible_port=2014`}
                          </pre>
                          <p className="text-xs text-zinc-500 mt-1">Для начала редактирования нажмите клавишу <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">i</kbd> (режим Insert). Убедитесь, что активна английская раскладка клавиатуры.</p>
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">9. Сохранение изменений и выход из редактора vim:</div>
                          <p className="text-xs text-zinc-500 mb-1">Нажмите клавишу <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Esc</kbd>, введите команду ниже и нажмите <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Enter</kbd>:</p>
                          <CommandBlock command=":wq" />
                        </div>

                        <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl space-y-3 text-sm text-zinc-300">
                          <div className="font-semibold text-emerald-400">10. Проверка доступности и состояния SSH-службы на всех настроенных хостах:</div>
                          <p>Запустите команду пингования всех хостов из инвентаря через Ansible:</p>
                          <CommandBlock command="ansible all -m ping" />
                          <div className="mt-2 text-xs text-zinc-400">
                            Ожидаемый ответ от всех хостов (каждый хост должен успешно ответить <code className="text-emerald-400 font-bold">"pong"</code>):
                            <pre className="p-3 rounded-lg bg-[#050608] border border-zinc-800/60 font-mono text-xs mt-1 overflow-x-auto text-emerald-400 font-medium">
{`HQ-SRV | SUCCESS => {
    "changed": false,
    "ping": "pong"
}
HQ-RTR | SUCCESS => {
    "changed": false,
    "ping": "pong"
}
BR-RTR | SUCCESS => {
    "changed": false,
    "ping": "pong"
}
HQ-CLI | SUCCESS => {
    "changed": false,
    "ping": "pong"
}`}
                            </pre>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionItem>

              <AccordionItem title="Задание 6. Разверните веб приложение в docker на сервере BR-SRV" level={2}>
                <div className="space-y-4">
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    Для развертывания веб-приложения на сервере <code className="text-emerald-400 font-mono text-xs bg-zinc-900/80 px-1.5 py-0.5 rounded border border-zinc-800/80">BR-SRV</code> используется технология контейнеризации Docker. Устанавливается Docker Engine, монтируется дистрибутив с архивами образов, загружаются Docker-образы приложения и базы данных, а затем запускается стек через Docker Compose с обеспечением постоянного хранения данных.
                  </p>

                  <div className="space-y-6">
                    {/* BR-SRV */}
                    <div className="border border-zinc-800/40 bg-[#0d0e12]/30 p-6 rounded-xl space-y-4">
                      <div className="flex items-center justify-between mb-4 border-b border-zinc-800/60 pb-3">
                        <span className="text-base font-bold text-zinc-100 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                          <span>BR-SRV</span>
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">1. Установка Docker Engine и плагина Docker Compose:</div>
                          <CommandBlock command="apt-get install docker-engine docker-compose-v2 -y" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">2. Добавление службы Docker в автозагрузку и ее запуск:</div>
                          <CommandBlock command="systemctl enable --now docker.service" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">3. Монтирование ISO-образа/диска для доступа к архивам Docker-образов:</div>
                          <CommandBlock command="mount -o loop /dev/sr0 /mnt/ -v" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">4. Просмотр содержимого каталога с Docker-образами:</div>
                          <CommandBlock command="ls -l /mnt/docker/" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">5. Просмотр файла инструкций readme.txt:</div>
                          <CommandBlock command="cat /mnt/docker/readme.txt" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">6. Импорт Docker-образа веб-приложения из архива:</div>
                          <CommandBlock command="docker load < /mnt/docker/site_latest.tar" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">7. Импорт Docker-образа СУБД MariaDB из архива:</div>
                          <CommandBlock command="docker load < /mnt/docker/mariadb_latest.tar" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">8. Просмотр списка импортированных Docker-образов в системе:</div>
                          <CommandBlock command="docker image ls" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">9. Создание конфигурационного файла docker-compose.yml:</div>
                          <CommandBlock command={`cat << EOF > docker-compose.yml
services:
  database:
    container_name: db
    image: mariadb:latest
    restart: always
    ports: 
      - "3306:3306"
    environment:
      MARIADB_DATABASE: testdb4
      MARIADB_USER: test4c
      MARIADB_PASSWORD: P@ssw0rd
      MARIADB_ROOT_PASSWORD: P@ssw0rd
    volumes:
      - db_data:/var/lib/mysql
      
  app:
    container_name: site
    image: site:latest
    restart: always
    ports: 
      - "8084:8000"
    environment: 
      DB_HOST: database
      DB_PORT: 3306
      DB_NAME: testdb4
      DB_USER: test4c
      DB_PASS: P@ssw0rd
      DB_TYPE: maria
    depends_on: 
      - database
volumes:
  db_data:
EOF`} />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">10. Проверка конфигурации docker-compose на наличие синтаксических ошибок:</div>
                          <CommandBlock command="docker compose config" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">11. Фоновый запуск сервисов приложения и базы данных:</div>
                          <CommandBlock command="docker compose up -d" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">12. Проверка состояния запущенных контейнеров:</div>
                          <CommandBlock command="docker ps" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">13. Проверка прослушивания порта 8084 сетевой службой:</div>
                          <CommandBlock command="ss -ltnp4 | grep 8084" />
                        </div>
                      </div>
                    </div>

                    {/* HQ-CLI Verification */}
                    <div className="border border-zinc-800/40 bg-zinc-950/10 p-6 rounded-xl space-y-4">
                      <div className="text-sm font-bold text-zinc-200 border-b border-zinc-800/60 pb-3 flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-emerald-400" />
                        <span>Верификация веб-приложения с клиента HQ-CLI</span>
                      </div>

                      <div className="space-y-6 text-sm text-zinc-300">
                        <div className="flex items-center gap-3 p-4 border border-blue-500/20 bg-blue-500/5 rounded-xl text-blue-400 mb-2">
                          <Terminal className="w-5 h-5 flex-shrink-0" />
                          <span className="text-sm font-semibold">Работаем в графической оболочке HQ-CLI (под пользователем user)</span>
                        </div>

                        <div className="p-4 bg-[#0d0e12]/30 border border-zinc-800/40 rounded-xl space-y-4">
                          <div className="font-semibold text-emerald-400">Шаг 1. Первичный доступ к веб-странице:</div>
                          <p>Откройте веб-браузер и перейдите по IP-адресу сервера на порт 8084: <code className="text-zinc-200 bg-zinc-900/60 px-1.5 py-0.5 rounded border border-zinc-800/80 font-mono text-xs">http://192.168.3.10:8084/</code></p>
                          
                          <div className="p-4 border border-blue-500/20 bg-blue-500/5 rounded-xl text-blue-400 text-xs">
                            <span className="font-semibold">Пометка:</span> По заданию мы должны попадать на сайт через домен <code className="text-zinc-200 bg-zinc-900/60 px-1 py-0.5 rounded border border-zinc-800/80 font-mono text-xs">docker.au-team.irpo</code>, но мы пока этого сделать не можем, так как у нас не настроен реверс-прокси на <code className="text-zinc-200 bg-zinc-900/60 px-1 py-0.5 rounded border border-zinc-800/80 font-mono text-xs">ISP (nginx)</code> (выполняется в задании №9).
                          </div>

                          <div className="rounded-xl overflow-hidden border border-zinc-800/80 bg-zinc-950/40 my-4 shadow-inner max-w-[700px] w-full flex-shrink-0">
                            <Image
                              src="/screenshot/doc1.png"
                              alt="Первый запуск приложения"
                              width={700}
                              height={394}
                              className="w-full h-auto object-contain opacity-90 transition-opacity hover:opacity-100 duration-300"
                            />
                          </div>
                        </div>

                        <div className="p-4 bg-[#0d0e12]/30 border border-zinc-800/40 rounded-xl space-y-4">
                          <div className="font-semibold text-emerald-400">Шаг 2. Создание записи в базе данных:</div>
                          <p>Заполните форму на сайте произвольными текстовыми данными и сохраните запись:</p>
                          
                          <div className="grid grid-cols-1 gap-4 my-4">
                            <div className="rounded-xl overflow-hidden border border-zinc-800/80 bg-zinc-950/40 shadow-inner max-w-[700px] w-full flex-shrink-0">
                              <Image
                                src="/screenshot/doc2.png"
                                alt="Заполнение формы"
                                width={700}
                                height={394}
                                className="w-full h-auto object-contain opacity-90"
                              />
                            </div>
                            <div className="rounded-xl overflow-hidden border border-zinc-800/80 bg-zinc-950/40 shadow-inner max-w-[700px] w-full flex-shrink-0">
                              <Image
                                src="/screenshot/doc3.png"
                                alt="Подтверждение сохранения"
                                width={700}
                                height={394}
                                className="w-full h-auto object-contain opacity-90"
                              />
                            </div>
                            <div className="rounded-xl overflow-hidden border border-zinc-800/80 bg-zinc-950/40 shadow-inner max-w-[700px] w-full flex-shrink-0">
                              <Image
                                src="/screenshot/doc4.png"
                                alt="Созданная запись"
                                width={700}
                                height={394}
                                className="w-full h-auto object-contain opacity-90"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="p-4 bg-[#0d0e12]/30 border border-zinc-800/40 rounded-xl space-y-4">
                          <div className="font-semibold text-emerald-400">Шаг 3. Симуляция сбоя и удаления контейнеров:</div>
                          <p>На сервере <code className="text-zinc-200 bg-zinc-900/60 px-1 py-0.5 rounded border border-zinc-800/80 font-mono text-xs">BR-SRV</code> принудительно остановите и удалите все активные контейнеры:</p>
                          <CommandBlock command="docker rm -f $(docker ps -qa)" />
                          <p>Обновите страницу в браузере на клиенте <code className="text-zinc-200 bg-zinc-900/60 px-1 py-0.5 rounded border border-zinc-800/80 font-mono text-xs">HQ-CLI</code> и проверьте, что сайт перестал работать:</p>
                          
                          <div className="rounded-xl overflow-hidden border border-zinc-800/80 bg-zinc-950/40 my-4 shadow-inner max-w-[700px] w-full flex-shrink-0">
                            <Image
                              src="/screenshot/doc5.png"
                              alt="Сайт недоступен"
                              width={700}
                              height={394}
                              className="w-full h-auto object-contain opacity-90"
                            />
                          </div>
                        </div>

                        <div className="p-4 bg-[#0d0e12]/30 border border-zinc-800/40 rounded-xl space-y-4">
                          <div className="font-semibold text-emerald-400">Шаг 4. Восстановление работы и проверка сохранности данных:</div>
                          <p>Заново разверните стек Docker Compose на сервере <code className="text-zinc-200 bg-zinc-900/60 px-1 py-0.5 rounded border border-zinc-800/80 font-mono text-xs">BR-SRV</code>:</p>
                          <CommandBlock command="docker compose up -d" />
                          <p>Обновите страницу в веб-клиенте. Сайт должен успешно загрузиться, а созданная вами ранее запись должна остаться на месте благодаря примонтированному тому базы данных:</p>
                          
                          <div className="rounded-xl overflow-hidden border border-zinc-800/80 bg-zinc-950/40 my-4 shadow-inner max-w-[700px] w-full flex-shrink-0">
                            <Image
                              src="/screenshot/doc6.png"
                              alt="Сайт восстановлен, данные сохранены"
                              width={700}
                              height={394}
                              className="w-full h-auto object-contain opacity-90"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionItem>

              <AccordionItem title="Задание 7. Разверните веб приложение на сервере HQ-SRV" level={2}>
                <div className="space-y-4">
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    Для развертывания веб-приложения на сервере <code className="text-emerald-400 font-mono text-xs bg-zinc-900/80 px-1.5 py-0.5 rounded border border-zinc-800/80">HQ-SRV</code> настраивается классический LAMP-стек (Linux, Apache, MariaDB, PHP). Веб-приложение копируется со смонтированного диска, разворачивается локальная база данных из дампа SQL, настраиваются параметры подключения в конфигурации PHP и запускается веб-сервер Apache.
                  </p>

                  <div className="space-y-6">
                    {/* HQ-SRV */}
                    <div className="border border-zinc-800/40 bg-[#0d0e12]/30 p-6 rounded-xl space-y-4">
                      <div className="flex items-center justify-between mb-4 border-b border-zinc-800/60 pb-3">
                        <span className="text-base font-bold text-zinc-100 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                          <span>HQ-SRV</span>
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">1. Монтирование ISO-образа/диска для доступа к исходным файлам сайта:</div>
                          <CommandBlock command="mount -o loop /dev/sr0 /mnt/ -v" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">2. Установка серверного веб-стека (Apache, MariaDB, PHP):</div>
                          <CommandBlock command="apt-get install lamp-server -y" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">3. Копирование PHP-файла приложения в корневой каталог веб-сервера:</div>
                          <CommandBlock command="cp /mnt/web/index.php /var/www/html" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">4. Копирование логотипа веб-приложения:</div>
                          <CommandBlock command="cp /mnt/web/logo.png /var/www/html" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">5. Включение в автозагрузку и немедленный запуск СУБД MariaDB:</div>
                          <CommandBlock command="systemctl enable --now mariadb" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">6. Создание пустой базы данных webdb для приложения:</div>
                          <CommandBlock command='mariadb -e "CREATE DATABASE webdb;"' />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">7. Создание пользователя БД web с паролем P@ssw0rd и предоставление прав:</div>
                          <CommandBlock command={`mariadb -e "
CREATE USER 'web4'@'localhost' IDENTIFIED BY 'P@ssw0rd';
GRANT ALL PRIVILEGES ON webdb.* TO 'web4'@'localhost';
"`} />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">8. Развертывание таблиц и структуры базы данных из дампа SQL:</div>
                          <CommandBlock command="mariadb webdb < /mnt/web/dump.sql" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">9. Проверка успешности импорта и списка таблиц в базе данных:</div>
                          <CommandBlock command='mariadb -e "USE webdb; SHOW TABLES;"' />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">10. Открытие файла конфигурации index.php in редакторе vim:</div>
                          <CommandBlock command="vim /var/www/html/index.php" />
                        </div>

                        <div className="p-4 bg-[#0d0e12]/30 border border-zinc-800/40 rounded-xl space-y-2 text-sm text-zinc-300 leading-relaxed">
                          <div className="font-semibold text-emerald-400">11. Редактирование конфигурации подключения к СУБД в vim:</div>
                          <p>Найдите переменные подключения и впишите следующие параметры:</p>
                          <pre className="p-4 rounded-lg bg-[#050608] border border-zinc-800/60 text-zinc-200 font-mono text-xs leading-relaxed overflow-x-auto select-all my-2">
{`$servername = "localhost";
$username = "web4";
$password = "P@ssw0rd";
$dbname = "webdb";`}
                          </pre>
                          <p className="text-xs text-zinc-500 mt-1">Для начала редактирования нажмите клавишу <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">i</kbd> (режим Insert). Убедитесь, что активна английская раскладка клавиатуры.</p>
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">12. Сохранение изменений и выход из редактора vim:</div>
                          <p className="text-xs text-zinc-500 mb-1">Нажмите клавишу <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Esc</kbd>, введите команду ниже и нажмите <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Enter</kbd>:</p>
                          <CommandBlock command=":wq!" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">13. Включение в автозагрузку и немедленный запуск веб-сервера Apache (httpd2):</div>
                          <CommandBlock command="systemctl enable --now httpd2.service" />
                        </div>
                      </div>
                    </div>

                    {/* HQ-CLI Verification */}
                    <div className="border border-zinc-800/40 bg-zinc-950/10 p-6 rounded-xl space-y-4">
                      <div className="text-sm font-bold text-zinc-200 border-b border-zinc-800/60 pb-3 flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-emerald-400" />
                        <span>Верификация веб-сайта с клиента HQ-CLI</span>
                      </div>

                      <div className="space-y-6 text-sm text-zinc-300">
                        <div className="flex items-center gap-3 p-4 border border-blue-500/20 bg-blue-500/5 rounded-xl text-blue-400 mb-2">
                          <Terminal className="w-5 h-5 flex-shrink-0" />
                          <span className="text-sm font-semibold">Работаем в графической оболочке HQ-CLI (под пользователем user)</span>
                        </div>

                        <div className="p-4 bg-[#0d0e12]/30 border border-zinc-800/40 rounded-xl space-y-4">
                          <div className="font-semibold text-emerald-400">Шаг 1. Проверка доступности веб-сервера:</div>
                          <p>Откройте веб-браузер и введите IP-адрес сервера: <code className="text-zinc-200 bg-zinc-900/60 px-1.5 py-0.5 rounded border border-zinc-800/80 font-mono text-xs">http://192.168.1.10/</code></p>
                          
                          <div className="p-4 border border-blue-500/20 bg-blue-500/5 rounded-xl text-blue-400 text-xs">
                            <span className="font-semibold">Пометка:</span> По заданию мы должны попадать на сайт через домен <code className="text-zinc-200 bg-zinc-900/60 px-1 py-0.5 rounded border border-zinc-800/80 font-mono text-xs">web.au-team.irpo</code> с аутентификацией по паролю, но мы пока этого сделать не можем, так как у нас не настроен реверс-прокси на <code className="text-zinc-200 bg-zinc-900/60 px-1 py-0.5 rounded border border-zinc-800/80 font-mono text-xs">ISP (nginx)</code> (выполняется в задании №9).
                          </div>

                          <div className="rounded-xl overflow-hidden border border-zinc-800/80 bg-zinc-950/40 my-4 shadow-inner max-w-[700px] w-full flex-shrink-0">
                            <Image
                              src="/screenshot/site1.png"
                              alt="Развернутый веб-сайт"
                              width={700}
                              height={394}
                              className="w-full h-auto object-contain opacity-90 transition-opacity hover:opacity-100 duration-300"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionItem>

              <AccordionItem title="Задание 8. На маршрутизаторах сконфигурируйте статическую трансляцию портов" level={2}>
                <div className="space-y-4">
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    Для обеспечения доступа к внутренним веб-сервисам и службам из внешней сети на маршрутизаторах <code className="text-emerald-400 font-mono text-xs bg-zinc-900/80 px-1.5 py-0.5 rounded border border-zinc-800/80">HQ-RTR</code> и <code className="text-purple-400 font-mono text-xs bg-zinc-900/80 px-1.5 py-0.5 rounded border border-zinc-800/80">BR-RTR</code> настраивается статическая трансляция портов (DNAT) с помощью межсетевого экрана <code className="text-emerald-400 font-mono text-xs bg-zinc-900/80 px-1.5 py-0.5 rounded border border-zinc-800/80">nftables</code>. Это перенаправит входящие запросы на соответствующие порты внутренних серверов.
                  </p>

                  <div className="space-y-6">
                    {/* HQ-RTR */}
                    <div className="border border-zinc-800/40 bg-[#0d0e12]/30 p-6 rounded-xl space-y-4">
                      <div className="flex items-center justify-between mb-4 border-b border-zinc-800/60 pb-3">
                        <span className="text-base font-bold text-zinc-100 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                          <span>HQ-RTR</span>
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">1. Добавление цепочки prerouting в таблицу nat для обработки входящего DNAT:</div>
                          <CommandBlock command="nft add chain nat prerouting { type nat hook prerouting priority dstnat \; }" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">2. Проброс SSH-порта 2011 на внутренний сервер HQ-SRV:</div>
                          <CommandBlock command='nft add rule nat prerouting iif "enp7s1" tcp dport 2014 dnat to 192.168.1.10' />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">3. Проброс веб-порта 8081 на внутренний веб-сервер HQ-SRV (порт 80):</div>
                          <CommandBlock command='nft add rule nat prerouting iif "enp7s1" tcp dport 8084 dnat to 192.168.1.10:80' />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">4. Просмотр текущего набора правил nftables для проверки:</div>
                          <CommandBlock command="nft list ruleset" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">5. Сохранение конфигурации nftables в файл для автозапуска при загрузке:</div>
                          <CommandBlock command="nft list ruleset > /etc/nftables/nftables.nft" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">6. Перезапуск службы nftables для проверки корректности сохраненной конфигурации:</div>
                          <CommandBlock command="systemctl restart nftables" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">7. Финальная проверка примененных правил nftables:</div>
                          <CommandBlock command="nft list ruleset" />
                        </div>
                      </div>
                    </div>

                    {/* BR-RTR */}
                    <div className="border border-zinc-800/40 bg-[#0d0e12]/30 p-6 rounded-xl space-y-4">
                      <div className="flex items-center justify-between mb-4 border-b border-zinc-800/60 pb-3">
                        <span className="text-base font-bold text-zinc-100 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                          <span>BR-RTR</span>
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">1. Добавление цепочки prerouting в таблицу nat для обработки входящего DNAT:</div>
                          <CommandBlock command="nft add chain nat prerouting { type nat hook prerouting priority dstnat \; }" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">2. Проброс портов 8084 (веб) и 2014 (SSH) на внутренний сервер BR-SRV (192.168.3.10):</div>
                          <CommandBlock command='nft add rule nat prerouting iif "enp7s1" tcp dport { 8084, 2014 } dnat to 192.168.3.10' />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">3. Просмотр текущего набора правил nftables для проверки:</div>
                          <CommandBlock command="nft list ruleset" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">4. Сохранение конфигурации nftables в файл для автозапуска при загрузке:</div>
                          <CommandBlock command="nft list ruleset > /etc/nftables/nftables.nft" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">5. Перезапуск службы nftables для проверки корректности сохраненной конфигурации:</div>
                          <CommandBlock command="systemctl restart nftables" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">6. Финальная проверка примененных правил nftables:</div>
                          <CommandBlock command="nft list ruleset" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionItem>

              <AccordionItem title="Задание 9. Настройте веб-сервер nginx как обратный прокси-сервер на ISP" level={2}>
                <div className="space-y-4">
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    Для маршрутизации веб-запросов к внутренним сервисам через доменные имена на пограничном маршрутизаторе <code className="text-emerald-400 font-mono text-xs bg-zinc-900/80 px-1.5 py-0.5 rounded border border-zinc-800/80">ISP</code> настраивается веб-сервер <code className="text-emerald-400 font-mono text-xs bg-zinc-900/80 px-1.5 py-0.5 rounded border border-zinc-800/80">Nginx</code> в режиме обратного прокси-сервера (reverse proxy). Создаются виртуальные хосты для доменов <code className="text-zinc-200 bg-zinc-900/60 px-1 py-0.5 rounded border border-zinc-800/80 font-mono text-xs">web.au-team.irpo</code> и <code className="text-zinc-200 bg-zinc-900/60 px-1 py-0.5 rounded border border-zinc-800/80 font-mono text-xs">docker.au-team.irpo</code>, перенаправляющие трафик на соответствующие внутренние порты.
                  </p>

                  <div className="space-y-6">
                    {/* ISP */}
                    <div className="border border-zinc-800/40 bg-[#0d0e12]/30 p-6 rounded-xl space-y-4">
                      <div className="flex items-center justify-between mb-4 border-b border-zinc-800/60 pb-3">
                        <span className="text-base font-bold text-zinc-100 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                          <span>ISP</span>
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">1. Обновление пакетной базы и установка веб-сервера Nginx:</div>
                          <CommandBlock command="apt-get update && apt-get install nginx nano -y" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">2. Открытие нового конфигурационного файла виртуального хоста в редакторе nano:</div>
                          <CommandBlock command="nano /etc/nginx/sites-available.d/r-proxy.conf" />
                        </div>

                        <div className="p-4 bg-[#0d0e12]/30 border border-zinc-800/40 rounded-xl space-y-2 text-sm text-zinc-300 leading-relaxed">
                          <div className="font-semibold text-emerald-400">3. Редактирование конфигурации обратного прокси в nano:</div>
                          <p>Вставьте в файл следующие настройки для перенаправления доменных имен:</p>
                          <pre className="p-4 rounded-lg bg-[#050608] border border-zinc-800/60 text-zinc-200 font-mono text-xs leading-relaxed overflow-x-auto select-all my-2">
{`server {
  listen 80;
  server_name web.au-team.irpo;
  location / {
    proxy_pass http://172.16.1.10:8084;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    auth_basic "Restricted Access";
    auth_basic_user_file /etc/nginx/.htpasswd;
  }
}
server {
  listen 80;
  server_name docker.au-team.irpo;
  location / {
    proxy_pass http://172.16.2.10:8084;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}`}
                          </pre>
                          <p className="text-xs text-zinc-500 mt-2">После вставки сохраните файл: нажмите <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Ctrl + X</kbd>, затем <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Y</kbd> и подтвердите клавишей <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 font-mono text-xs">Enter</kbd>.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionItem>

              <AccordionItem title="Задание 10. На маршрутизаторе ISP настройте web-based аутентификацию" level={2}>
                <div className="space-y-4">
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    Для ограничения неавторизованного доступа к внутреннему веб-ресурсу на пограничном маршрутизаторе <code className="text-emerald-400 font-mono text-xs bg-zinc-900/80 px-1.5 py-0.5 rounded border border-zinc-800/80">ISP</code> настраивается базовая HTTP-аутентификация (Basic Auth). Создается символическая ссылка для активации виртуального хоста, генерируется хэш пароля пользователя <code className="text-zinc-200 bg-zinc-900/60 px-1.5 py-0.5 rounded border border-zinc-800/80 font-mono text-xs">Khariton</code> в файле htpasswd и перезапускается служба Nginx.
                  </p>

                  <div className="space-y-6">
                    {/* ISP */}
                    <div className="border border-zinc-800/40 bg-[#0d0e12]/30 p-6 rounded-xl space-y-4">
                      <div className="flex items-center justify-between mb-4 border-b border-zinc-800/60 pb-3">
                        <span className="text-base font-bold text-zinc-100 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                          <span>ISP</span>
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">1. Активация конфигурации обратного прокси через создание символической ссылки:</div>
                          <CommandBlock command="ln -s /etc/nginx/sites-available.d/r-proxy.conf /etc/nginx/sites-enabled.d/" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">2. Тестирование синтаксической корректности конфигурационных файлов Nginx:</div>
                          <CommandBlock command="nginx -t" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">3. Добавление веб-сервера Nginx в автозагрузку и его запуск:</div>
                          <CommandBlock command="systemctl enable --now nginx" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">4. Проверка текущего статуса запущенного веб-сервера Nginx:</div>
                          <CommandBlock command="systemctl status nginx" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">5. Установка утилиты htpasswd для генерации паролей:</div>
                          <CommandBlock command="apt-get install apache2-htpasswd -y" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">6. Создание файла паролей и добавление пользователя Erofey:</div>
                          <CommandBlock command="htpasswd -c /etc/nginx/.htpasswd Erofey" />
                          <div className="mt-1 text-xs text-zinc-500 leading-relaxed">
                            При запросе утилиты введите пароль: <code className="text-zinc-300 font-mono text-xs bg-zinc-900/60 px-1.5 py-0.5 rounded border border-zinc-800/80">P@ssw0rd</code> (потребуется ввести дважды).
                          </div>
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">7. Проверка содержимого сгенерированного файла паролей (просмотр хэша):</div>
                          <CommandBlock command="cat /etc/nginx/.htpasswd" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">8. Повторная валидация конфигурации перед перезапуском:</div>
                          <CommandBlock command="nginx -t" />
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">9. Перезапуск веб-сервера Nginx для применения настроек авторизации:</div>
                          <CommandBlock command="systemctl restart nginx" />
                        </div>
                      </div>
                    </div>

                    {/* HQ-CLI Verification */}
                    <div className="border border-zinc-800/40 bg-zinc-950/10 p-6 rounded-xl space-y-4">
                      <div className="text-sm font-bold text-zinc-200 border-b border-zinc-800/60 pb-3 flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-emerald-400" />
                        <span>Верификация доступа и авторизации с клиента HQ-CLI</span>
                      </div>

                      <div className="space-y-6 text-sm text-zinc-300">
                        <div className="flex items-center gap-3 p-4 border border-blue-500/20 bg-blue-500/5 rounded-xl text-blue-400 mb-2">
                          <Terminal className="w-5 h-5 flex-shrink-0" />
                          <span className="text-sm font-semibold">Работаем в графической оболочке HQ-CLI (под пользователем user)</span>
                        </div>

                        <div className="p-4 bg-[#0d0e12]/30 border border-zinc-800/40 rounded-xl space-y-4">
                          <div className="font-semibold text-emerald-400">Шаг 1. Доступ к защищенному сайту web.au-team.irpo:</div>
                          <p>Откройте браузер и перейдите по доменному адресу: <code className="text-zinc-200 bg-zinc-900/60 px-1.5 py-0.5 rounded border border-zinc-800/80 font-mono text-xs">http://web.au-team.irpo/</code>. Должно появиться окно ввода логина и пароля.</p>
                          <p className="text-xs text-zinc-400">Используйте учетные данные:</p>
                          <ul className="list-disc pl-5 text-xs text-zinc-400 space-y-1">
                            <li>Логин: <code className="text-zinc-200 font-mono text-xs">Erofey</code></li>
                            <li>Пароль: <code className="text-zinc-200 font-mono text-xs">P@ssw0rd</code></li>
                          </ul>

                          <div className="grid grid-cols-1 gap-4 my-4">
                            <div className="rounded-xl overflow-hidden border border-zinc-800/80 bg-zinc-950/40 shadow-inner max-w-[700px] w-full flex-shrink-0">
                              <Image
                                src="/screenshot/isp1.png"
                                alt="Окно HTTP Basic Auth"
                                width={700}
                                height={394}
                                className="w-full h-auto object-contain opacity-90"
                              />
                            </div>
                            <div className="rounded-xl overflow-hidden border border-zinc-800/80 bg-zinc-950/40 shadow-inner max-w-[700px] w-full flex-shrink-0">
                              <Image
                                src="/screenshot/isp2.png"
                                alt="Успешный вход на сайт"
                                width={700}
                                height={394}
                                className="w-full h-auto object-contain opacity-90"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="p-4 bg-[#0d0e12]/30 border border-zinc-800/40 rounded-xl space-y-4">
                          <div className="font-semibold text-emerald-400">Шаг 2. Доступ к сайту docker.au-team.irpo:</div>
                          <p>Перейдите по доменному адресу: <code className="text-zinc-200 bg-zinc-900/60 px-1.5 py-0.5 rounded border border-zinc-800/80 font-mono text-xs">http://docker.au-team.irpo/</code>. Сайт должен открываться без требования авторизации:</p>

                          <div className="rounded-xl overflow-hidden border border-zinc-800/80 bg-zinc-950/40 my-4 shadow-inner max-w-[700px] w-full flex-shrink-0">
                            <Image
                              src="/screenshot/isp3.png"
                              alt="Успешный вход на docker-сайт"
                              width={700}
                              height={394}
                              className="w-full h-auto object-contain opacity-90 transition-opacity hover:opacity-100 duration-300"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionItem>

              <AccordionItem title="Задание 11. Установите Яндекс Браузер" level={2}>
                <div className="space-y-4">
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    Для обеспечения веб-серфинга и работы с сетевыми ресурсами на клиентской машине <code className="text-emerald-400 font-mono text-xs bg-zinc-900/80 px-1.5 py-0.5 rounded border border-zinc-800/80">HQ-CLI</code> устанавливается отечественный веб-браузер <code className="text-emerald-400 font-mono text-xs bg-zinc-900/80 px-1.5 py-0.5 rounded border border-zinc-800/80">Яндекс Браузер</code>. Выполняется установка пакета, запуск браузера из графического интерфейса и фиксация установленной версии программы.
                  </p>

                  <div className="space-y-6">
                    {/* HQ-CLI Console */}
                    <div className="border border-zinc-800/40 bg-[#0d0e12]/30 p-6 rounded-xl space-y-4">
                      <div className="flex items-center justify-between mb-4 border-b border-zinc-800/60 pb-3">
                        <span className="text-base font-bold text-zinc-100 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                          <span>HQ-CLI (Установка)</span>
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-3 p-4 border border-red-500/20 bg-red-500/5 rounded-xl text-red-400 mb-2">
                          <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                          <span className="text-sm font-semibold">Работаем в консольной оболочке HQ-CLI (под пользователем root)</span>
                        </div>

                        <div>
                          <div className="text-xs text-zinc-400 font-semibold mb-1">1. Обновление пакетной базы и установка Yandex Browser:</div>
                          <CommandBlock command="apt-get update && apt-get install yandex-browser-stable -y" />
                        </div>
                      </div>
                    </div>

                    {/* HQ-CLI GUI */}
                    <div className="border border-zinc-800/40 bg-zinc-950/10 p-6 rounded-xl space-y-4">
                      <div className="text-sm font-bold text-zinc-200 border-b border-zinc-800/60 pb-3 flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-emerald-400" />
                        <span>Запуск и верификация в графическом интерфейсе</span>
                      </div>

                      <div className="space-y-6 text-sm text-zinc-300">
                        <div className="flex items-center gap-3 p-4 border border-blue-500/20 bg-blue-500/5 rounded-xl text-blue-400 mb-2">
                          <Terminal className="w-5 h-5 flex-shrink-0" />
                          <span className="text-sm font-semibold">Работаем в графической оболочке HQ-CLI (под пользователем user)</span>
                        </div>

                        <div className="p-4 bg-[#0d0e12]/30 border border-zinc-800/40 rounded-xl space-y-4">
                          <div className="font-semibold text-emerald-400">Шаг 1. Запуск браузера:</div>
                          <p>После успешной установки ярлык программы появится в основном меню приложений:</p>
                          <p className="text-xs text-zinc-400 font-semibold"><strong className="text-zinc-200">Меню → Интернет → Yandex Browser</strong></p>

                          <div className="rounded-xl overflow-hidden border border-zinc-800/80 bg-zinc-950/40 my-4 shadow-inner max-w-[700px] w-full flex-shrink-0">
                            <Image
                              src="/screenshot/ya1_updated.png"
                              alt="Ярлык запуска Яндекс Браузера"
                              width={700}
                              height={394}
                              className="w-full h-auto object-contain opacity-90 transition-opacity hover:opacity-100 duration-300"
                            />
                          </div>
                        </div>

                        <div className="p-4 bg-[#0d0e12]/30 border border-zinc-800/40 rounded-xl space-y-4">
                          <div className="font-semibold text-emerald-400">Шаг 2. Проверка установленной версии:</div>
                          <p>В открывшемся браузере перейдите в раздел информации о программе:</p>
                          <p className="text-xs text-zinc-400 font-semibold"><strong className="text-zinc-200">Три полоски (Настройки) → Помощь → О браузере</strong></p>

                          <div className="grid grid-cols-1 gap-4 my-4">
                            <div className="rounded-xl overflow-hidden border border-zinc-800/80 bg-zinc-950/40 shadow-inner max-w-[700px] w-full flex-shrink-0">
                              <Image
                                src="/screenshot/ya2.png"
                                alt="Переход к разделу О Браузере"
                                width={700}
                                height={394}
                                className="w-full h-auto object-contain opacity-90"
                              />
                            </div>
                            <div className="rounded-xl overflow-hidden border border-zinc-800/80 bg-zinc-950/40 shadow-inner max-w-[700px] w-full flex-shrink-0">
                              <Image
                                src="/screenshot/ya3.png"
                                alt="Версия в левом верхнем углу"
                                width={700}
                                height={394}
                                className="w-full h-auto object-contain opacity-90"
                              />
                            </div>
                          </div>

                          <p className="text-xs text-zinc-400 mt-2">
                            Сделайте финальный скриншот окна информации (на котором четко видна версия сборки) и занесите его в отчет.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionItem>
            </div>
          </AccordionItem>
            </Fragment>
          )}
        </div>
      </main>

    </div>
  );
}
