import { Task } from './types';

export const TASKS_2027_DATA: Task[] = [
  // =========================================================================
  // MODULE 1 (2027) - СЕТЕВАЯ ИНФРАСТРУКТУРА И ВИРТУАЛИЗАЦИЯ (11 TASKS)
  // =========================================================================
  {
    id: 'm1-2027-task-1',
    slug: 'm1-2027-task-1',
    module_id: 'module-1-2027',
    task_number: 1,
    title: 'Топология сети и базовая адресация IPv4/IPv6',
    module_code: 'Модуль 1 (2027)',
    description:
      'Конфигурирование сетевых интерфейсов узлов стенда Proxmox VE, настройка FQDN в домене .au-team.irpo, статической маршрутизации и двойного стека IPv4/IPv6 для маршрутизаторов и серверов.',
    nodes: ['ISP', 'HQ-RTR', 'HQ-SRV', 'HQ-CLI', 'BR-RTR', 'BR-SRV'],
    assignment: `### Задание 1.1 (2027): Сетевая адресация и хосты

1. **FQDN и имена узлов**:
   Настроить системные имена хостов согласно схеме:
   • \`isp.au-team.irpo\`
   • \`hq-rtr.au-team.irpo\`
   • \`hq-srv.au-team.irpo\`
   • \`hq-cli.au-team.irpo\`
   • \`br-rtr.au-team.irpo\`
   • \`br-srv.au-team.irpo\`

2. **Адресация IPv4 и IPv6**:
   • Для соединений WAN использовать префикс \`172.16.0.0/30\` и IPv6 \`2001:db8:1::/64\`.
   • Для локальных сетей офиса HQ использовать подсеть \`192.168.10.0/24\`.
   • Для филиала BR использовать подсеть \`192.168.20.0/24\`.`,
    theory: [
      {
        title: 'Управление сетью в ALT Linux через etcnet',
        explanation:
          'В ALT Linux подсистема etcnet использует директории в /etc/net/ifaces/<iface> для хранения конфигурационных файлов options, ipv4address и ipv4route.',
        details: [
          'Файл options определяет тип интерфейса (BOOTPROTO=static).',
          'Файл ipv4address задает IP с маской CIDR.',
          'Команда перезапуска: systemctl restart network.',
        ],
      },
    ],
    steps: [
      {
        step_number: 1,
        node: 'HQ-RTR',
        title: 'Настройка имени хоста и адресов',
        explanation: 'Устанавливаем FQDN и настраиваем интерфейсы.',
        commands: 'hostnamectl set-hostname hq-rtr.au-team.irpo\nsystemctl restart network',
      },
    ],
    script_command: '/root/scripts/check-m1-2027-task1.sh',
    questions: [
      {
        id: 'q1',
        text: 'Какой конфигурационный файл в etcnet определяет статический IP-адрес интерфейса?',
        options: [
          { id: 'A', text: 'ipv4address' },
          { id: 'B', text: 'interfaces' },
          { id: 'C', text: 'ifcfg-eth0' },
          { id: 'D', text: 'network.conf' },
        ],
        correct_answer: 'A',
      },
      {
        id: 'q2',
        text: 'Какой протокол обеспечивает параллельную работу стеков IPv4 и IPv6?',
        options: [
          { id: 'A', text: 'Dual Stack (двойной стек)' },
          { id: 'B', text: 'NAT64' },
          { id: 'C', text: '6to4 Tunneling' },
          { id: 'D', text: 'ISATAP' },
        ],
        correct_answer: 'A',
      },
    ],
    max_score: 5,
    order_index: 101,
    is_active: true,
    year: 2027,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'm1-2027-task-2',
    slug: 'm1-2027-task-2',
    module_id: 'module-1-2027',
    task_number: 2,
    title: 'Виртуальные мосты Linux Bridge и VLAN Trunking',
    module_code: 'Модуль 1 (2027)',
    description:
      'Создание и изоляция сегментов сети с помощью Linux Bridge и 802.1Q тегирования (VLAN 10 — управление, VLAN 20 — серверы, VLAN 30 — рабочие места).',
    nodes: ['HQ-RTR', 'HQ-SRV', 'HQ-CLI'],
    assignment: `Создать виртуальные мосты vmbr10, vmbr20, vmbr30 и транковые интерфейсы с тегами 802.1Q на маршрутизаторе HQ-RTR.`,
    theory: [
      {
        title: 'Тегирование 802.1Q и Linux Bridges',
        explanation:
          'Мосты Linux Bridge позволяют объединять виртуальные интерфейсы KVM и физические адаптеры в единый L2-домен.',
      },
    ],
    steps: [
      {
        step_number: 1,
        node: 'HQ-RTR',
        title: 'Создание подынтерфейсов VLAN',
        explanation: 'Создаем директории интерфейсов в /etc/net/ifaces.',
        commands: 'mkdir -p /etc/net/ifaces/eth1.10\necho "TYPE=vlan" > /etc/net/ifaces/eth1.10/options',
      },
    ],
    script_command: '/root/scripts/check-m1-2027-task2.sh',
    questions: [
      {
        id: 'q1',
        text: 'Какой стандарт регламентирует тегирование Ethernet-кадров метками VLAN?',
        options: [
          { id: 'A', text: 'IEEE 802.1Q' },
          { id: 'B', text: 'IEEE 802.3ad' },
          { id: 'C', text: 'IEEE 802.1D' },
          { id: 'D', text: 'IEEE 802.1X' },
        ],
        correct_answer: 'A',
      },
    ],
    max_score: 5,
    order_index: 102,
    is_active: true,
    year: 2027,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'm1-2027-task-3',
    slug: 'm1-2027-task-3',
    module_id: 'module-1-2027',
    task_number: 3,
    title: 'Динамическая маршрутизация OSPFv3 (FRRouting)',
    module_code: 'Модуль 1 (2027)',
    description:
      'Развертывание демона FRR (FRRouting), анонсирование внутренних сетей офиса и филиала по протоколу OSPFv3 в единой зоне Area 0.',
    nodes: ['ISP', 'HQ-RTR', 'BR-RTR'],
    assignment: `Настроить процесс OSPFv3 в пакете frr для автоматического распространения маршрутов между HQ-RTR и BR-RTR через магистраль ISP.`,
    theory: [
      {
        title: 'Протокол OSPFv3',
        explanation:
          'OSPFv3 поддерживает маршрутизацию IPv4 и IPv6, аутентификацию на базе IPsec и работу через независимые каналы связи.',
      },
    ],
    steps: [
      {
        step_number: 1,
        node: 'HQ-RTR',
        title: 'Включение демона ospf6d',
        explanation: 'Активируем ospf6d в /etc/frr/daemons.',
        commands: 'sed -i "s/ospf6d=no/ospf6d=yes/" /etc/frr/daemons\nsystemctl restart frr',
      },
    ],
    script_command: '/root/scripts/check-m1-2027-task3.sh',
    questions: [
      {
        id: 'q1',
        text: 'Какая служебная утилита предоставляет интерактивную консоль управления FRRouting?',
        options: [
          { id: 'A', text: 'vtysh' },
          { id: 'B', text: 'frrcli' },
          { id: 'C', text: 'routerctl' },
          { id: 'D', text: 'ip route' },
        ],
        correct_answer: 'A',
      },
    ],
    max_score: 5,
    order_index: 103,
    is_active: true,
    year: 2027,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'm1-2027-task-4',
    slug: 'm1-2027-task-4',
    module_id: 'module-1-2027',
    task_number: 4,
    title: 'Агрегирование интерфейсов LACP (IEEE 802.3ad)',
    module_code: 'Модуль 1 (2027)',
    description:
      'Объединение сетевых адаптеров сервера HQ-SRV в отказоустойчивую группу bond0 по протоколу LACP с балансировкой нагрузки Layer 3+4.',
    nodes: ['HQ-SRV', 'HQ-RTR'],
    assignment: `Сконфигурировать интерфейс bond0 с режимом mode 4 (802.3ad) и хеш-политикой layer3+4.`,
    theory: [
      {
        title: 'Bonding и LACP',
        explanation:
          'Link Aggregation Control Protocol (802.3ad) обеспечивает суммирование пропускной способности и резервирование линков.',
      },
    ],
    steps: [
      {
        step_number: 1,
        node: 'HQ-SRV',
        title: 'Настройка bond0 в etcnet',
        explanation: 'Создаем конфигурацию bond0.',
        commands: 'echo "TYPE=bond\nBONDOPTIONS=\'mode=4 xmit_hash_policy=layer3+4\'" > /etc/net/ifaces/bond0/options',
      },
    ],
    script_command: '/root/scripts/check-m1-2027-task4.sh',
    questions: [
      {
        id: 'q1',
        text: 'Какой номер режима (mode) соответствует протоколу IEEE 802.3ad LACP?',
        options: [
          { id: 'A', text: '4' },
          { id: 'B', text: '1' },
          { id: 'C', text: '0' },
          { id: 'D', text: '6' },
        ],
        correct_answer: 'A',
      },
    ],
    max_score: 5,
    order_index: 104,
    is_active: true,
    year: 2027,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'm1-2027-task-5',
    slug: 'm1-2027-task-5',
    module_id: 'module-1-2027',
    task_number: 5,
    title: 'Отказоустойчивый шлюз VRRP (Keepalived)',
    module_code: 'Модуль 1 (2027)',
    description:
      'Организация плавающего виртуального IP-адреса шлюза по умолчанию (Virtual Router Redundancy Protocol) между резервными маршрутизаторами.',
    nodes: ['HQ-RTR', 'BR-RTR'],
    assignment: `Настроить службу keepalived для поддержания виртуального шлюза 192.168.10.254 с приоритетами Master (100) и Backup (90).`,
    theory: [
      {
        title: 'Принцип работы VRRP',
        explanation:
          'VRRP позволяет назначать один IP-адрес группе маршрутизаторов, где при падении Master управление перехватывает Backup.',
      },
    ],
    steps: [
      {
        step_number: 1,
        node: 'HQ-RTR',
        title: 'Установка и запуск Keepalived',
        explanation: 'Конфигурируем /etc/keepalived/keepalived.conf.',
        commands: 'systemctl enable --now keepalived',
      },
    ],
    script_command: '/root/scripts/check-m1-2027-task5.sh',
    questions: [
      {
        id: 'q1',
        text: 'Какой мультикаст-адрес использует протокол VRRPv2 для рассылки объявлений?',
        options: [
          { id: 'A', text: '224.0.0.18' },
          { id: 'B', text: '224.0.0.5' },
          { id: 'C', text: '224.0.0.9' },
          { id: 'D', text: '239.255.255.250' },
        ],
        correct_answer: 'A',
      },
    ],
    max_score: 5,
    order_index: 105,
    is_active: true,
    year: 2027,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'm1-2027-task-6',
    slug: 'm1-2027-task-6',
    module_id: 'module-1-2027',
    task_number: 6,
    title: 'Межсетевое туннелирование WireGuard Site-to-Site',
    module_code: 'Модуль 1 (2027)',
    description:
      'Создание зашифрованного туннеля WireGuard между центральным офисом и филиалом с криптографической аутентификацией открытыми ключами.',
    nodes: ['HQ-RTR', 'BR-RTR'],
    assignment: `Создать интерфейсы wg0 на HQ-RTR и BR-RTR, сгенерировать ключевые пары и обеспечить прохождение трафика через туннель.`,
    theory: [
      {
        title: 'VPN WireGuard',
        explanation:
          'WireGuard функционирует внутри ядра Linux, используя современные алгоритмы ChaCha20, Curve25519 и BLAKE2s.',
      },
    ],
    steps: [
      {
        step_number: 1,
        node: 'HQ-RTR',
        title: 'Генерация ключей',
        explanation: 'Создаем пару ключей wireguard.',
        commands: 'wg genkey | tee /etc/wireguard/privatekey | wg pubkey > /etc/wireguard/publickey',
      },
    ],
    script_command: '/root/scripts/check-m1-2027-task6.sh',
    questions: [
      {
        id: 'q1',
        text: 'Какой транспортный протокол и уровень использует WireGuard?',
        options: [
          { id: 'A', text: 'UDP (транспортный уровень L4)' },
          { id: 'B', text: 'TCP' },
          { id: 'C', text: 'SCTP' },
          { id: 'D', text: 'ESP/AH' },
        ],
        correct_answer: 'A',
      },
    ],
    max_score: 5,
    order_index: 106,
    is_active: true,
    year: 2027,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'm1-2027-task-7',
    slug: 'm1-2027-task-7',
    module_id: 'module-1-2027',
    task_number: 7,
    title: 'Служба DHCP с пулами адресов и резервацией',
    module_code: 'Модуль 1 (2027)',
    description:
      'Развертывание Kea DHCP / ISC DHCP сервера на HQ-SRV, выдача адресов рабочим станциям с привязкой шлюза и DNS-серверов.',
    nodes: ['HQ-SRV', 'HQ-CLI'],
    assignment: `Настроить DHCP-пул 192.168.10.100 - 192.168.10.200 и зарезервировать статический IP для MAC-адреса HQ-CLI.`,
    theory: [
      {
        title: 'Протокол DHCP',
        explanation:
          'Процесс выдачи параметров DORA (Discover, Offer, Request, Acknowledge) на портах UDP 67/68.',
      },
    ],
    steps: [
      {
        step_number: 1,
        node: 'HQ-SRV',
        title: 'Запуск DHCP',
        explanation: 'Активируем демон dhcpd.',
        commands: 'systemctl enable --now dhcpd',
      },
    ],
    script_command: '/root/scripts/check-m1-2027-task7.sh',
    questions: [
      {
        id: 'q1',
        text: 'На каких UDP-портах функционируют DHCP-клиент и DHCP-сервер?',
        options: [
          { id: 'A', text: 'Клиент 68, Сервер 67' },
          { id: 'B', text: 'Клиент 53, Сервер 53' },
          { id: 'C', text: 'Клиент 123, Сервер 123' },
          { id: 'D', text: 'Клиент 80, Сервер 8080' },
        ],
        correct_answer: 'A',
      },
    ],
    max_score: 5,
    order_index: 107,
    is_active: true,
    year: 2027,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'm1-2027-task-8',
    slug: 'm1-2027-task-8',
    module_id: 'module-1-2027',
    task_number: 8,
    title: 'DNS BIND 9 с прямой/обратной зоной и DNSSEC',
    module_code: 'Модуль 1 (2027)',
    description:
      'Конфигурирование BIND 9 на HQ-SRV: обслуживание авторитетной зоны au-team.irpo, обратной зоны in-addr.arpa и настройка пересылки forwarders.',
    nodes: ['HQ-SRV', 'HQ-CLI'],
    assignment: `Настроить named.conf, создать файлы зон, проверить работу через dig и nslookup.`,
    theory: [
      {
        title: 'Служба DNS BIND',
        explanation:
          'BIND 9 обеспечивает трансляцию доменных имен в IP-адреса, кэширование и защиту подлинности через DNSSEC.',
      },
    ],
    steps: [
      {
        step_number: 1,
        node: 'HQ-SRV',
        title: 'Проверка синтаксиса зон',
        explanation: 'Используем утилиту named-checkzone.',
        commands: 'named-checkconf && named-checkzone au-team.irpo /var/lib/bind/zone/au-team.irpo',
      },
    ],
    script_command: '/root/scripts/check-m1-2027-task8.sh',
    questions: [
      {
        id: 'q1',
        text: 'Какая ресурсная запись DNS связывает доменное имя с IPv4-адресом?',
        options: [
          { id: 'A', text: 'A' },
          { id: 'B', text: 'AAAA' },
          { id: 'C', text: 'PTR' },
          { id: 'D', text: 'CNAME' },
        ],
        correct_answer: 'A',
      },
    ],
    max_score: 5,
    order_index: 108,
    is_active: true,
    year: 2027,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'm1-2027-task-9',
    slug: 'm1-2027-task-9',
    module_id: 'module-1-2027',
    task_number: 9,
    title: 'Трансляция сетевых адресов SNAT / DNAT (nftables)',
    module_code: 'Модуль 1 (2027)',
    description:
      'Настройка правил маскарадинга (masquerade) для выхода локальных сетей в интернет и проброса портов (Port Forwarding) к внутреннему веб-серверу.',
    nodes: ['HQ-RTR'],
    assignment: `Написать правила nftables в таблице nat: masquerade на интерфейсе WAN и dnat для порта 443 на внутренний сервер HQ-SRV.`,
    theory: [
      {
        title: 'Фреймворк nftables',
        explanation:
          'nftables заменил устаревший iptables, объединяя таблицы ip, ip6, arp и bridge с оптимизированной виртуальной машиной классификации пакетов.',
      },
    ],
    steps: [
      {
        step_number: 1,
        node: 'HQ-RTR',
        title: 'Применение правил NAT',
        explanation: 'Сохраняем правила в /etc/nftables/nat.nft.',
        commands: 'nft add rule ip nat postrouting oifname "eth0" masquerade',
      },
    ],
    script_command: '/root/scripts/check-m1-2027-task9.sh',
    questions: [
      {
        id: 'q1',
        text: 'В какой цепочке (chain) nftables выполняется исходящая трансляция SNAT / Masquerade?',
        options: [
          { id: 'A', text: 'postrouting' },
          { id: 'B', text: 'prerouting' },
          { id: 'C', text: 'input' },
          { id: 'D', text: 'forward' },
        ],
        correct_answer: 'A',
      },
    ],
    max_score: 5,
    order_index: 109,
    is_active: true,
    year: 2027,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'm1-2027-task-10',
    slug: 'm1-2027-task-10',
    module_id: 'module-1-2027',
    task_number: 10,
    title: 'Диагностика и сквозная связность стенда',
    module_code: 'Модуль 1 (2027)',
    description:
      'Комплексное тестирование доступности всех узлов по ICMP и TCP, проверка MTU, задержек и отсутствия петель маршрутизации.',
    nodes: ['HQ-CLI', 'BR-SRV', 'ISP'],
    assignment: `Выполнить сквозной traceroute между клиентом филиала и главным сервером, убедившись в корректности прохождения туннелей.`,
    theory: [
      {
        title: 'Диагностика L3/L4 связности',
        explanation:
          'Использование утилит ping, traceroute, mtr и tcpdump для выявления узких мест и блокировок в межсетевых экранах.',
      },
    ],
    steps: [
      {
        step_number: 1,
        node: 'HQ-CLI',
        title: 'Тест доступности',
        explanation: 'Пинг до узлов стенда.',
        commands: 'ping -c 3 192.168.20.10',
      },
    ],
    script_command: '/root/scripts/check-m1-2027-task10.sh',
    questions: [
      {
        id: 'q1',
        text: 'Какое поле в заголовке IPv4 декрементируется каждым маршрутизатором для предотвращения зацикливания пакетов?',
        options: [
          { id: 'A', text: 'TTL (Time to Live)' },
          { id: 'B', text: 'TOS (Type of Service)' },
          { id: 'C', text: 'Checksum' },
          { id: 'D', text: 'Identification' },
        ],
        correct_answer: 'A',
      },
    ],
    max_score: 5,
    order_index: 110,
    is_active: true,
    year: 2027,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'm1-2027-task-11',
    slug: 'm1-2027-task-11',
    module_id: 'module-1-2027',
    task_number: 11,
    title: 'Контрольный аудит модуля 1 (Сетевая инфраструктура)',
    module_code: 'Модуль 1 (2027)',
    description:
      'Автоматизированный аудит выполнения всех требований первого модуля: проверка интерфейсов, OSPF, LACP, VRRP, WireGuard, DNS и DHCP.',
    nodes: ['HQ-RTR', 'HQ-SRV', 'BR-RTR', 'BR-SRV'],
    assignment: `Запустить итоговый верификационный скрипт аудита Модуля 1 на всех узлах и сдать консольный отчет.`,
    theory: [
      {
        title: 'Критерии оценивания Модуля 1 (2027)',
        explanation:
          'Оценивается корректность применения параметров, устойчивость к сбоям интерфейсов и непрерывность передачи данных.',
      },
    ],
    steps: [
      {
        step_number: 1,
        node: 'HQ-RTR',
        title: 'Запуск скрипта аудита',
        explanation: 'Запуск проверочного скрипта.',
        commands: 'bash /root/scripts/check-m1-2027-task11.sh',
      },
    ],
    script_command: '/root/scripts/check-m1-2027-task11.sh',
    questions: [
      {
        id: 'q1',
        text: 'Что является подтверждением успешного завершения аудита модуля?',
        options: [
          { id: 'A', text: 'Статус [ OK ] по всем пунктам проверки в консольном логе' },
          { id: 'B', text: 'Отсутствие сетевых ошибок в dmesg' },
          { id: 'C', text: 'Перезагрузка виртуальной машины' },
          { id: 'D', text: 'Наличие свободного места на диске' },
        ],
        correct_answer: 'A',
      },
    ],
    max_score: 5,
    order_index: 111,
    is_active: true,
    year: 2027,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  // =========================================================================
  // MODULE 2 (2027) - СЕТЕВЫЕ СЕРВИСЫ И ДОМЕННЫЕ СЛУЖБЫ (11 TASKS)
  // =========================================================================
  {
    id: 'm2-2027-task-1',
    slug: 'm2-2027-task-1',
    module_id: 'module-2-2027',
    task_number: 1,
    title: 'Развертывание службы каталогов FreeIPA / Samba 4 AD DC',
    module_code: 'Модуль 2 (2027)',
    description:
      'Инициализация контроллера домена AU-TEAM.IRPO с внутренним LDAP, Kerberos KDC и поддержкой групповых политик GPO.',
    nodes: ['HQ-SRV'],
    assignment: `Развернуть доменную службу на HQ-SRV, настроить администратора домена и проверить отклик Kerberos.`,
    theory: [
      {
        title: 'Службы каталогов в Linux',
        explanation:
          'Samba AD DC и FreeIPA обеспечивают централизованное управление пользователями, правами и сквозной аутентификацией.',
      },
    ],
    steps: [
      {
        step_number: 1,
        node: 'HQ-SRV',
        title: 'Инициализация домена',
        explanation: 'Команда samba-tool domain provision.',
        commands: 'samba-tool domain provision --domain=AU-TEAM --realm=AU-TEAM.IRPO --server-role=dc',
      },
    ],
    script_command: '/root/scripts/check-m2-2027-task1.sh',
    questions: [
      {
        id: 'q1',
        text: 'Какой сетевой порт TCP/UDP по умолчанию используется службой каталогов LDAP?',
        options: [
          { id: 'A', text: '389' },
          { id: 'B', text: '636' },
          { id: 'C', text: '88' },
          { id: 'D', text: '445' },
        ],
        correct_answer: 'A',
      },
    ],
    max_score: 5,
    order_index: 112,
    is_active: true,
    year: 2027,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'm2-2027-task-2',
    slug: 'm2-2027-task-2',
    module_id: 'module-2-2027',
    task_number: 2,
    title: 'Интеграция Linux-клиентов и Kerberos SSO',
    module_code: 'Модуль 2 (2027)',
    description:
      'Ввод рабочей станции HQ-CLI в домен с помощью SSSD, настройка PAM-модулей и автоматического создания домашних каталогов (pam_mkhomedir).',
    nodes: ['HQ-CLI', 'HQ-SRV'],
    assignment: `Ввести HQ-CLI в домен, протестировать получение тикета kinit и вход доменным пользователем.`,
    theory: [
      {
        title: 'SSSD (System Security Services Daemon)',
        explanation:
          'SSSD кэширует учетные записи и обеспечивает бесшовный вход в систему даже при временной недоступности контроллера домена.',
      },
    ],
    steps: [
      {
        step_number: 1,
        node: 'HQ-CLI',
        title: 'Ввод в домен',
        explanation: 'Используем sssd и realm join.',
        commands: 'realm join -U Administrator au-team.irpo',
      },
    ],
    script_command: '/root/scripts/check-m2-2027-task2.sh',
    questions: [
      {
        id: 'q1',
        text: 'Какая команда используется для получения тикета Kerberos TGT в консоли Linux?',
        options: [
          { id: 'A', text: 'kinit' },
          { id: 'B', text: 'klist' },
          { id: 'C', text: 'kdestroy' },
          { id: 'D', text: 'ktutil' },
        ],
        correct_answer: 'A',
      },
    ],
    max_score: 5,
    order_index: 113,
    is_active: true,
    year: 2027,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'm2-2027-task-3',
    slug: 'm2-2027-task-3',
    module_id: 'module-2-2027',
    task_number: 3,
    title: 'Программный массив RAID и LVM-тома для хранилищ',
    module_code: 'Модуль 2 (2027)',
    description:
      'Создание массива RAID 1 (зеркалирование) с помощью mdadm, разметка физических томов PV, группы VG и логических томов LV с возможностью онлайн-расширения.',
    nodes: ['HQ-SRV'],
    assignment: `Собрать массив /dev/md0 из двух дисков, создать VG data_vg и логический том storage_lv с файловой системой ext4.`,
    theory: [
      {
        title: 'LVM и mdadm',
        explanation:
          'LVM позволяет гибко выделять дисковое пространство, создавать снапшоты и объединять несколько физических дисков в пулы.',
      },
    ],
    steps: [
      {
        step_number: 1,
        node: 'HQ-SRV',
        title: 'Создание массива',
        explanation: 'Создаем mdadm массив.',
        commands: 'mdadm --create /dev/md0 --level=1 --raid-devices=2 /dev/sdb /dev/sdc',
      },
    ],
    script_command: '/root/scripts/check-m2-2027-task3.sh',
    questions: [
      {
        id: 'q1',
        text: 'Какая утилита Linux отвечает за управление программными RAID-массивами?',
        options: [
          { id: 'A', text: 'mdadm' },
          { id: 'B', text: 'fdisk' },
          { id: 'C', text: 'parted' },
          { id: 'D', text: 'mkfs' },
        ],
        correct_answer: 'A',
      },
    ],
    max_score: 5,
    order_index: 114,
    is_active: true,
    year: 2027,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'm2-2027-task-4',
    slug: 'm2-2027-task-4',
    module_id: 'module-2-2027',
    task_number: 4,
    title: 'Сетевая файловая система NFSv4 с разграничением прав',
    module_code: 'Модуль 2 (2027)',
    description:
      'Публикация сетевого ресурса /srv/nfs/shared на HQ-SRV по протоколу NFSv4, монтирование на клиентах и изоляция доступа по подсетям.',
    nodes: ['HQ-SRV', 'HQ-CLI', 'BR-SRV'],
    assignment: `Настроить /etc/exports для разрешения rw доступа из локальной сети HQ и ro из сети BR.`,
    theory: [
      {
        title: 'Протокол NFSv4',
        explanation:
          'NFSv4 работает через единый порт TCP 2049, поддерживает псевдофайловую систему и интеграцию с Kerberos (krb5p).',
      },
    ],
    steps: [
      {
        step_number: 1,
        node: 'HQ-SRV',
        title: 'Экспорт каталога',
        explanation: 'Применяем экспорт через exportfs.',
        commands: 'exportfs -rav && systemctl restart nfs-server',
      },
    ],
    script_command: '/root/scripts/check-m2-2027-task4.sh',
    questions: [
      {
        id: 'q1',
        text: 'Какой порт TCP использует сервер NFS версии 4 для всех операций обмена?',
        options: [
          { id: 'A', text: '2049' },
          { id: 'B', text: '111' },
          { id: 'C', text: '445' },
          { id: 'D', text: '873' },
        ],
        correct_answer: 'A',
      },
    ],
    max_score: 5,
    order_index: 115,
    is_active: true,
    year: 2027,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'm2-2027-task-5',
    slug: 'm2-2027-task-5',
    module_id: 'module-2-2027',
    task_number: 5,
    title: 'Синхронизация времени Chrony NTP в домене',
    module_code: 'Модуль 2 (2027)',
    description:
      'Настройка HQ-SRV в качестве источника точного времени Stratum 2 для всех узлов экзаменационного стенда с защитой от рассинхронизации Kerberos.',
    nodes: ['HQ-SRV', 'HQ-RTR', 'BR-RTR', 'HQ-CLI'],
    assignment: `Настроить /etc/chrony/chrony.conf: разрешить подсети allow 192.168.0.0/16, настроить клиентов на синхронизацию с 192.168.10.10.`,
    theory: [
      {
        title: 'Синхронизация времени в доменной среде',
        explanation:
          'Kerberos допускает максимальное расхождение времени между клиентом и KDC не более 300 секунд (5 минут).',
      },
    ],
    steps: [
      {
        step_number: 1,
        node: 'HQ-SRV',
        title: 'Проверка источников Chrony',
        explanation: 'Команда chronyc sources.',
        commands: 'chronyc sources -v',
      },
    ],
    script_command: '/root/scripts/check-m2-2027-task5.sh',
    questions: [
      {
        id: 'q1',
        text: 'Какое максимальное расхождение системного времени по умолчанию допускается протоколом Kerberos?',
        options: [
          { id: 'A', text: '5 минут (300 секунд)' },
          { id: 'B', text: '1 минута' },
          { id: 'C', text: '30 секунд' },
          { id: 'D', text: '1 час' },
        ],
        correct_answer: 'A',
      },
    ],
    max_score: 5,
    order_index: 116,
    is_active: true,
    year: 2027,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'm2-2027-task-6',
    slug: 'm2-2027-task-6',
    module_id: 'module-2-2027',
    task_number: 6,
    title: 'Контейнеризация сервисов с помощью Podman',
    module_code: 'Модуль 2 (2027)',
    description:
      'Развертывание бездемонного контейнерного окружения Podman: запуск веб-приложения в изолированном пространстве имен без прав root (Rootless).',
    nodes: ['HQ-SRV'],
    assignment: `Создать systemd-юнит для автоматического запуска контейнера web-app при загрузке системы через podman generate systemd.`,
    theory: [
      {
        title: 'Rootless Podman',
        explanation:
          'Podman не требует фонового сервиса с правами суперпользователя, в отличие от Docker, что снижает риски эскалации привилегий.',
      },
    ],
    steps: [
      {
        step_number: 1,
        node: 'HQ-SRV',
        title: 'Запуск контейнера Podman',
        explanation: 'Запуск контейнера.',
        commands: 'podman run -d --name web-service -p 8080:80 nginx:alpine',
      },
    ],
    script_command: '/root/scripts/check-m2-2027-task6.sh',
    questions: [
      {
        id: 'q1',
        text: 'Какое ключевое архитектурное преимущество имеет Podman перед Docker?',
        options: [
          { id: 'A', text: 'Отсутствие центрального фонового демона и поддержка Rootless-режима' },
          { id: 'B', text: 'Только текстовый формат образов' },
          { id: 'C', text: 'Отказ от пространств имен Linux' },
          { id: 'D', text: 'Невозможность публикации портов' },
        ],
        correct_answer: 'A',
      },
    ],
    max_score: 5,
    order_index: 117,
    is_active: true,
    year: 2027,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'm2-2027-task-7',
    slug: 'm2-2027-task-7',
    module_id: 'module-2-2027',
    task_number: 7,
    title: 'Балансировка нагрузки и реверс-прокси NGINX',
    module_code: 'Модуль 2 (2027)',
    description:
      'Конфигурирование веб-сервера NGINX как обратного прокси с пулом серверов upstream, распределением запросов Round-Robin и кэшированием.',
    nodes: ['HQ-SRV'],
    assignment: `Настроить блок upstream backend_cluster и директиву proxy_pass на порту 80/443.`,
    theory: [
      {
        title: 'Обратный прокси NGINX',
        explanation:
          'NGINX принимает клиентские запросы и распределяет их между бэкенд-сервисами, терминализуя SSL/TLS и кэшируя статику.',
      },
    ],
    steps: [
      {
        step_number: 1,
        node: 'HQ-SRV',
        title: 'Проверка конфигурации',
        explanation: 'Проверяем nginx.conf.',
        commands: 'nginx -t && systemctl reload nginx',
      },
    ],
    script_command: '/root/scripts/check-m2-2027-task7.sh',
    questions: [
      {
        id: 'q1',
        text: 'Какая директива NGINX описывает группу вышестоящих серверов для балансировки нагрузки?',
        options: [
          { id: 'A', text: 'upstream' },
          { id: 'B', text: 'balancer' },
          { id: 'C', text: 'cluster' },
          { id: 'D', text: 'backends' },
        ],
        correct_answer: 'A',
      },
    ],
    max_score: 5,
    order_index: 118,
    is_active: true,
    year: 2027,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'm2-2027-task-8',
    slug: 'm2-2027-task-8',
    module_id: 'module-2-2027',
    task_number: 8,
    title: 'Отказоустойчивая база данных PostgreSQL (Master-Replica)',
    module_code: 'Модуль 2 (2027)',
    description:
      'Настройка потоковой репликации (Streaming Replication) СУБД PostgreSQL между основным узлом HQ-SRV и резервным BR-SRV.',
    nodes: ['HQ-SRV', 'BR-SRV'],
    assignment: `Сконфигурировать pg_hba.conf, включить wal_level = replica, создать пользователя репликации и клонировать базу с помощью pg_basebackup.`,
    theory: [
      {
        title: 'Потоковая репликация PostgreSQL',
        explanation:
          'Потоковая репликация передает записи WAL (Write-Ahead Logging) с первичного узла на реплику в режиме реального времени.',
      },
    ],
    steps: [
      {
        step_number: 1,
        node: 'BR-SRV',
        title: 'Клонирование базы через pg_basebackup',
        explanation: 'Создаем резервную копию со структурой реплики.',
        commands: 'pg_basebackup -h 192.168.10.10 -D /var/lib/pgsql/data -U replicator -P -R',
      },
    ],
    script_command: '/root/scripts/check-m2-2027-task8.sh',
    questions: [
      {
        id: 'q1',
        text: 'Какой параметр в postgresql.conf должен иметь значение replica или logical для работы репликации?',
        options: [
          { id: 'A', text: 'wal_level' },
          { id: 'B', text: 'replication_mode' },
          { id: 'C', text: 'archive_mode' },
          { id: 'D', text: 'max_connections' },
        ],
        correct_answer: 'A',
      },
    ],
    max_score: 5,
    order_index: 119,
    is_active: true,
    year: 2027,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'm2-2027-task-9',
    slug: 'm2-2027-task-9',
    module_id: 'module-2-2027',
    task_number: 9,
    title: 'Автоматизация конфигураций Ansible Playbooks',
    module_code: 'Модуль 2 (2027)',
    description:
      'Написание сценария Ansible Playbook для автоматической установки и проверки пакетов на всех Linux-узлах стенда.',
    nodes: ['BR-SRV', 'HQ-RTR', 'HQ-SRV', 'HQ-CLI'],
    assignment: `Создать плейбук site.yml на BR-SRV: установка пакетов curl, htop, настройка часового пояса Europe/Moscow.`,
    theory: [
      {
        title: 'Оркестрация Ansible',
        explanation:
          'Ansible выполняет идемпотентные модули через протокол SSH, обеспечивая повторяемость состояния инфраструктуры.',
      },
    ],
    steps: [
      {
        step_number: 1,
        node: 'BR-SRV',
        title: 'Запуск плейбука',
        explanation: 'Команда ansible-playbook.',
        commands: 'ansible-playbook -i inventory.ini site.yml',
      },
    ],
    script_command: '/root/scripts/check-m2-2027-task9.sh',
    questions: [
      {
        id: 'q1',
        text: 'Какое свойство сценариев Ansible гарантирует одинаковый результат вне зависимости от количества запусков?',
        options: [
          { id: 'A', text: 'Идемпотентность (Idempotence)' },
          { id: 'B', text: 'Инвариантность' },
          { id: 'C', text: 'Рекурсивность' },
          { id: 'D', text: 'Атомарность' },
        ],
        correct_answer: 'A',
      },
    ],
    max_score: 5,
    order_index: 120,
    is_active: true,
    year: 2027,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'm2-2027-task-10',
    slug: 'm2-2027-task-10',
    module_id: 'module-2-2027',
    task_number: 10,
    title: 'Веб-портал мониторинга и администрирования',
    module_code: 'Модуль 2 (2027)',
    description:
      'Развертывание веб-интерфейса Cockpit для удаленного управления серверами и просмотром аппаратных ресурсов.',
    nodes: ['HQ-SRV'],
    assignment: `Включить сокет cockpit.socket на порту 9090 и предоставить доступ для администратора домена.`,
    theory: [
      {
        title: 'Веб-консоль Cockpit',
        explanation:
          'Cockpit предоставляет веб-интерфейс для администрирования Linux: просмотр журналов, управление сетью, дисками и контейнерами.',
      },
    ],
    steps: [
      {
        step_number: 1,
        node: 'HQ-SRV',
        title: 'Включение Cockpit',
        explanation: 'Запуск cockpit.socket.',
        commands: 'systemctl enable --now cockpit.socket',
      },
    ],
    script_command: '/root/scripts/check-m2-2027-task10.sh',
    questions: [
      {
        id: 'q1',
        text: 'На каком сетевом порту по умолчанию принимает соединения веб-консоль Cockpit?',
        options: [
          { id: 'A', text: '9090' },
          { id: 'B', text: '8080' },
          { id: 'C', text: '443' },
          { id: 'D', text: '10000' },
        ],
        correct_answer: 'A',
      },
    ],
    max_score: 5,
    order_index: 121,
    is_active: true,
    year: 2027,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'm2-2027-task-11',
    slug: 'm2-2027-task-11',
    module_id: 'module-2-2027',
    task_number: 11,
    title: 'Итоговый аудит модуля 2 (Сетевые службы и сервисы)',
    module_code: 'Модуль 2 (2027)',
    description:
      'Комплексная автоматизированная проверка готовности доменной инфраструктуры, СУБД, веб-сервисов, NFS и Ansible.',
    nodes: ['HQ-SRV', 'HQ-CLI', 'BR-SRV'],
    assignment: `Выполнить скрипт аудита Модуля 2 и отправить протокол валидации.`,
    theory: [
      {
        title: 'Критерии оценивания Модуля 2 (2027)',
        explanation:
          'Проверяется целостность репликации базы данных, корректность монтирования сетевых ресурсов и автоматизация.',
      },
    ],
    steps: [
      {
        step_number: 1,
        node: 'HQ-SRV',
        title: 'Запуск скрипта аудита',
        explanation: 'Запуск проверки.',
        commands: 'bash /root/scripts/check-m2-2027-task11.sh',
      },
    ],
    script_command: '/root/scripts/check-m2-2027-task11.sh',
    questions: [
      {
        id: 'q1',
        text: 'Что удостоверяет соответствие выполненного модуля требованиям экзамена?',
        options: [
          { id: 'A', text: 'Успешное прохождение всех автоматизированных тестов скрипта проверки' },
          { id: 'B', text: 'Отсутствие предупреждений компилятора' },
          { id: 'C', text: 'Наличие свободного ОЗУ' },
          { id: 'D', text: 'Завершение сессии SSH' },
        ],
        correct_answer: 'A',
      },
    ],
    max_score: 5,
    order_index: 122,
    is_active: true,
    year: 2027,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  // =========================================================================
  // MODULE 3 (2027) - ИНФОРМАЦИОННАЯ БЕЗОПАСНОСТЬ И МОНИТОРИНГ (10 TASKS)
  // =========================================================================
  {
    id: 'm3-2027-task-1',
    slug: 'm3-2027-task-1',
    module_id: 'module-3-2027',
    task_number: 1,
    title: 'Сертификаты TLS/HTTPS с российской ГОСТ криптографией',
    module_code: 'Модуль 3 (2027)',
    description:
      'Генерация корневого центра сертификации (CA) и выпуск сертификатов веб-сервера по ГОСТ Р 34.12-2015 (Магма/Кузнечик) через OpenSSL с движком gost.',
    nodes: ['HQ-SRV'],
    assignment: `Создать удостоверяющий центр с алгоритмом ГОСТ, подписать сертификат для au-team.irpo и подключить в веб-сервер.`,
    theory: [
      {
        title: 'ГОСТ криптография в Linux',
        explanation:
          'Модуль openssl-gost обеспечивает реализацию отечественных стандартов электронной подписи ГОСТ Р 34.10-2012 и хэширования ГОСТ Р 34.11-2012.',
      },
    ],
    steps: [
      {
        step_number: 1,
        node: 'HQ-SRV',
        title: 'Проверка движка ГОСТ в OpenSSL',
        explanation: 'Команда openssl ciphers.',
        commands: 'openssl ciphers | grep -i gost',
      },
    ],
    script_command: '/root/scripts/check-m3-2027-task1.sh',
    questions: [
      {
        id: 'q1',
        text: 'Какой российский стандарт регламентирует функцию формирования и проверки электронной подписи?',
        options: [
          { id: 'A', text: 'ГОСТ Р 34.10-2012' },
          { id: 'B', text: 'ГОСТ Р 34.11-2012' },
          { id: 'C', text: 'ГОСТ Р 34.12-2015' },
          { id: 'D', text: 'ГОСТ 28147-89' },
        ],
        correct_answer: 'A',
      },
    ],
    max_score: 5,
    order_index: 123,
    is_active: true,
    year: 2027,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'm3-2027-task-2',
    slug: 'm3-2027-task-2',
    module_id: 'module-3-2027',
    task_number: 2,
    title: 'Межсетевой экран и фильтрация трафика nftables',
    module_code: 'Модуль 3 (2027)',
    description:
      'Политика безопасности Drop by Default: разрешение только установленных соединений (ct state established,related), защита от сканирования портов и SYN-флуда.',
    nodes: ['HQ-RTR'],
    assignment: `Настроить базовую цепочку input с политикой drop и разрешением ICMP, SSH и Established-сессий.`,
    theory: [
      {
        title: 'Фильтрация на базе состояний (Stateful Firewall)',
        explanation:
          'Межсетевой экран отслеживает состояние TCP/UDP сессий в conntrack и пропускает ответные пакеты без открытия лишних портов.',
      },
    ],
    steps: [
      {
        step_number: 1,
        node: 'HQ-RTR',
        title: 'Применение правил фильтрации',
        explanation: 'Сохранение правил в /etc/nftables.conf.',
        commands: 'nft list ruleset',
      },
    ],
    script_command: '/root/scripts/check-m3-2027-task2.sh',
    questions: [
      {
        id: 'q1',
        text: 'Какое состояние соединения указывает на пакет, относящийся к уже открытой сессии?',
        options: [
          { id: 'A', text: 'established' },
          { id: 'B', text: 'new' },
          { id: 'C', text: 'invalid' },
          { id: 'D', text: 'untracked' },
        ],
        correct_answer: 'A',
      },
    ],
    max_score: 5,
    order_index: 124,
    is_active: true,
    year: 2027,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'm3-2027-task-3',
    slug: 'm3-2027-task-3',
    module_id: 'module-3-2027',
    task_number: 3,
    title: 'Система обнаружения вторжений Suricata IDS',
    module_code: 'Модуль 3 (2027)',
    description:
      'Развертывание сигнатурной системы обнаружения атак Suricata IDS на внешнем интерфейсе маршрутизатора HQ-RTR и детектирование атак сканирования Nmap.',
    nodes: ['HQ-RTR'],
    assignment: `Установить Suricata, обновить правила через suricata-update и проверить генерацию событий в /var/log/suricata/fast.log.`,
    theory: [
      {
        title: 'Системы IDS/IPS Suricata',
        explanation:
          'Suricata выполняет глубокий анализ пакетов (DPI), сопоставляя сигнатуры угроз с сетевыми потоками в режиме реального времени.',
      },
    ],
    steps: [
      {
        step_number: 1,
        node: 'HQ-RTR',
        title: 'Запуск Suricata',
        explanation: 'Активируем демон suricata.',
        commands: 'systemctl enable --now suricata',
      },
    ],
    script_command: '/root/scripts/check-m3-2027-task3.sh',
    questions: [
      {
        id: 'q1',
        text: 'В каком лог-файле Suricata фиксируются текстовые предупреждения об обнаруженных угрозах?',
        options: [
          { id: 'A', text: 'fast.log' },
          { id: 'B', text: 'eve.json' },
          { id: 'C', text: 'suricata.log' },
          { id: 'D', text: 'alerts.txt' },
        ],
        correct_answer: 'A',
      },
    ],
    max_score: 5,
    order_index: 125,
    is_active: true,
    year: 2027,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'm3-2027-task-4',
    slug: 'm3-2027-task-4',
    module_id: 'module-3-2027',
    task_number: 4,
    title: 'Защита от подбора паролей Fail2ban',
    module_code: 'Модуль 3 (2027)',
    description:
      'Автоматическая блокировка IP-адресов злоумышленников при 3 неудачных попытках аутентификации по протоколу SSH на 1 час.',
    nodes: ['HQ-SRV', 'HQ-RTR'],
    assignment: `Сконфигурировать jail.local: filter = sshd, maxretry = 3, bantime = 3600.`,
    theory: [
      {
        title: 'Демон Fail2ban',
        explanation:
          'Fail2ban сканирует журналы auth.log и динамически добавляет правила блокировки в nftables/iptables при обнаружении аномалий.',
      },
    ],
    steps: [
      {
        step_number: 1,
        node: 'HQ-SRV',
        title: 'Проверка статуса джейла',
        explanation: 'Команда fail2ban-client status.',
        commands: 'fail2ban-client status sshd',
      },
    ],
    script_command: '/root/scripts/check-m3-2027-task4.sh',
    questions: [
      {
        id: 'q1',
        text: 'Какая директива в конфигурации Fail2ban задает продолжительность блокировки адреса в секундах?',
        options: [
          { id: 'A', text: 'bantime' },
          { id: 'B', text: 'findtime' },
          { id: 'C', text: 'maxretry' },
          { id: 'D', text: 'timeout' },
        ],
        correct_answer: 'A',
      },
    ],
    max_score: 5,
    order_index: 126,
    is_active: true,
    year: 2027,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'm3-2027-task-5',
    slug: 'm3-2027-task-5',
    module_id: 'module-3-2027',
    task_number: 5,
    title: 'Сбор и централизация системных журналов Rsyslog',
    module_code: 'Модуль 3 (2027)',
    description:
      'Организация сервера сбора журналов (Log Server) на BR-SRV по протоколу TCP 514 с шифрованием и разделением логов по папкам хостов.',
    nodes: ['BR-SRV', 'HQ-SRV', 'HQ-RTR'],
    assignment: `Настроить rsyslog на прием логов от узлов стенда и запись в шаблоны /var/log/remote/%HOSTNAME%/%PROGRAMNAME%.log.`,
    theory: [
      {
        title: 'Протокол Syslog (RFC 5424)',
        explanation:
          'Стандарт передачи событий безопасности с классификацией по уровню важности (Facility) и критичности (Severity).',
      },
    ],
    steps: [
      {
        step_number: 1,
        node: 'BR-SRV',
        title: 'Включение приема TCP-логов',
        explanation: 'Раскомментировать module(load="imtcp").',
        commands: 'systemctl restart rsyslog && ss -ltnp | grep 514',
      },
    ],
    script_command: '/root/scripts/check-m3-2027-task5.sh',
    questions: [
      {
        id: 'q1',
        text: 'Какой сетевой порт TCP/UDP стандартизирован для службы Syslog?',
        options: [
          { id: 'A', text: '514' },
          { id: 'B', text: '601' },
          { id: 'C', text: '162' },
          { id: 'D', text: '123' },
        ],
        correct_answer: 'A',
      },
    ],
    max_score: 5,
    order_index: 127,
    is_active: true,
    year: 2027,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'm3-2027-task-6',
    slug: 'm3-2027-task-6',
    module_id: 'module-3-2027',
    task_number: 6,
    title: 'Мониторинг метрик узлов Prometheus + Node Exporter',
    module_code: 'Модуль 3 (2027)',
    description:
      'Установка и запуск агента node_exporter на серверах и настройка сервера сбора временных рядов Prometheus на BR-SRV.',
    nodes: ['BR-SRV', 'HQ-SRV'],
    assignment: `Сконфигурировать prometheus.yml: добавить scrape_configs для сбора метрик с 192.168.10.10:9100 каждые 15 секунд.`,
    theory: [
      {
        title: 'Архитектура Prometheus',
        explanation:
          'Prometheus работает по pull-модели, периодически опрашивая HTTP-эндпоинты экспортеров и сохраняя метрики в TSDB.',
      },
    ],
    steps: [
      {
        step_number: 1,
        node: 'BR-SRV',
        title: 'Запуск Prometheus',
        explanation: 'Активация prometheus.service.',
        commands: 'systemctl enable --now prometheus',
      },
    ],
    script_command: '/root/scripts/check-m3-2027-task6.sh',
    questions: [
      {
        id: 'q1',
        text: 'На каком стандартном порту Node Exporter отдает системные метрики в формате Prometheus?',
        options: [
          { id: 'A', text: '9100' },
          { id: 'B', text: '9090' },
          { id: 'C', text: '3000' },
          { id: 'D', text: '8086' },
        ],
        correct_answer: 'A',
      },
    ],
    max_score: 5,
    order_index: 128,
    is_active: true,
    year: 2027,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'm3-2027-task-7',
    slug: 'm3-2027-task-7',
    module_id: 'module-3-2027',
    task_number: 7,
    title: 'Визуализация состояния инфраструктуры в Grafana',
    module_code: 'Модуль 3 (2027)',
    description:
      'Подключение источника данных Prometheus в Grafana, импорт дашборда мониторинга нагрузки CPU, RAM, дисков и сетевого трафика.',
    nodes: ['BR-SRV'],
    assignment: `Развернуть Grafana на порту 3000, добавить Data Source http://localhost:9090 и настроить оповещения (Alerts).`,
    theory: [
      {
        title: 'Платформа Grafana',
        explanation:
          'Grafana позволяет строить интерактивные панели мониторинга на основе запросов PromQL и отправлять алерты администраторам.',
      },
    ],
    steps: [
      {
        step_number: 1,
        node: 'BR-SRV',
        title: 'Запуск Grafana',
        explanation: 'Запуск grafana-server.',
        commands: 'systemctl enable --now grafana-server',
      },
    ],
    script_command: '/root/scripts/check-m3-2027-task7.sh',
    questions: [
      {
        id: 'q1',
        text: 'Какой стандартный порт HTTP использует веб-интерфейс Grafana?',
        options: [
          { id: 'A', text: '3000' },
          { id: 'B', text: '8080' },
          { id: 'C', text: '9090' },
          { id: 'D', text: '5000' },
        ],
        correct_answer: 'A',
      },
    ],
    max_score: 5,
    order_index: 129,
    is_active: true,
    year: 2027,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'm3-2027-task-8',
    slug: 'm3-2027-task-8',
    module_id: 'module-3-2027',
    task_number: 8,
    title: 'Аудит информационной безопасности OpenSCAP',
    module_code: 'Модуль 3 (2027)',
    description:
      'Сканирование операционной системы утилитой oscap на соответствие профилям безопасности ГОСТ и рекомендациям регуляторов.',
    nodes: ['HQ-SRV'],
    assignment: `Выполнить аудит командой oscap xccdf eval с генерацией HTML-отчета соответствия в /var/www/html/report.html.`,
    theory: [
      {
        title: 'Фреймворк OpenSCAP',
        explanation:
          'OpenSCAP предоставляет стандартизированные методы оценки соответствия параметров ОС требованиям безопасности (SCAP).',
      },
    ],
    steps: [
      {
        step_number: 1,
        node: 'HQ-SRV',
        title: 'Запуск аудита oscap',
        explanation: 'Генерация отчета.',
        commands: 'oscap xccdf eval --report /root/scap-report.html /usr/share/xml/scap/ssg/content/ssg-altlinux-ds.xml',
      },
    ],
    script_command: '/root/scripts/check-m3-2027-task8.sh',
    questions: [
      {
        id: 'q1',
        text: 'Какой ключ утилиты oscap генерирует подробный отчет проверки в формате HTML?',
        options: [
          { id: 'A', text: '--report' },
          { id: 'B', text: '--html' },
          { id: 'C', text: '--output' },
          { id: 'D', text: '--web' },
        ],
        correct_answer: 'A',
      },
    ],
    max_score: 5,
    order_index: 130,
    is_active: true,
    year: 2027,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'm3-2027-task-9',
    slug: 'm3-2027-task-9',
    module_id: 'module-3-2027',
    task_number: 9,
    title: 'Резервное копирование конфигураций и баз данных',
    module_code: 'Модуль 3 (2027)',
    description:
      'Создание автоматического скрипта создания инкрементальных резервных копий каталога /etc и дампов баз данных с ротацией в течение 7 дней.',
    nodes: ['HQ-SRV', 'BR-SRV'],
    assignment: `Настроить cron-задание /etc/cron.daily/backup-system с отправкой архивов на узел хранения.`,
    theory: [
      {
        title: 'Стратегия 3-2-1 резервного копирования',
        explanation:
          'Правило 3-2-1 предполагает хранение не менее 3 копий на 2 разных носителях, при этом 1 копия должна храниться изолированно.',
      },
    ],
    steps: [
      {
        step_number: 1,
        node: 'HQ-SRV',
        title: 'Проверка скрипта бэкапа',
        explanation: 'Ручной запуск скрипта.',
        commands: 'bash /usr/local/bin/backup-job.sh',
      },
    ],
    script_command: '/root/scripts/check-m3-2027-task9.sh',
    questions: [
      {
        id: 'q1',
        text: 'Какая утилита Linux обеспечивает эффективное инкрементальное копирование файлов с дедупликацией по протоколу SSH?',
        options: [
          { id: 'A', text: 'rsync' },
          { id: 'B', text: 'scp' },
          { id: 'C', text: 'ftp' },
          { id: 'D', text: 'wget' },
        ],
        correct_answer: 'A',
      },
    ],
    max_score: 5,
    order_index: 131,
    is_active: true,
    year: 2027,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'm3-2027-task-10',
    slug: 'm3-2027-task-10',
    module_id: 'module-3-2027',
    task_number: 10,
    title: 'Комплексный аудит безопасности и сдача экзамена (2027)',
    module_code: 'Модуль 3 (2027)',
    description:
      'Итоговое тестирование защищенности информационной системы стенда 2027 года: TLS ГОСТ, правила nftables, журналы rsyslog, мониторинг и бэкапы.',
    nodes: ['HQ-RTR', 'HQ-SRV', 'HQ-CLI', 'BR-RTR', 'BR-SRV'],
    assignment: `Запустить финальный валидатор Модуля 3, дождаться статуса PASS по всем проверкам и прикрепить консольный лог.`,
    theory: [
      {
        title: 'Финальная аттестация 2027',
        explanation:
          'Комплексная оценка инфраструктуры 2027: сетевая связность, отказоустойчивость сервисов и соответствие стандартам ИБ.',
      },
    ],
    steps: [
      {
        step_number: 1,
        node: 'HQ-SRV',
        title: 'Запуск финальной проверки',
        explanation: 'Финальный аудит безопасности.',
        commands: 'bash /root/scripts/check-m3-2027-task10.sh',
      },
    ],
    script_command: '/root/scripts/check-m3-2027-task10.sh',
    questions: [
      {
        id: 'q1',
        text: 'Какое действие завершает сдачу демонстрационного экзамена студентом?',
        options: [
          { id: 'A', text: 'Отправка консольного лога отчета и ответов на вопросы в системе SudoStudy' },
          { id: 'B', text: 'Удаление виртуальных машин Proxmox' },
          { id: 'C', text: 'Сброс паролей пользователей' },
          { id: 'D', text: 'Отключение питания сервера' },
        ],
        correct_answer: 'A',
      },
    ],
    max_score: 5,
    order_index: 132,
    is_active: true,
    year: 2027,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];
