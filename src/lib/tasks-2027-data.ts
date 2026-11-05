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
    title: 'Базовая настройка сети и хостов',
    module_code: 'Модуль 1 (2027)',
    description:
      'Практическое руководство по выполнению базовой настройки сетевой инфраструктуры в ALT Linux: FQDN в домене .au-team.irpo, подсистема etcnet, расчет подсетей RFC 1918, транки и 802.1Q VLAN для сегментов HQ, а также статические маршруты через провайдера ISP и межсетевой экран BR-FW.',
    nodes: ['ISP', 'HQ-RTR', 'HQ-SRV', 'HQ-CLI', 'BR-RTR', 'BR-FW', 'BR-SRV'],
    assignment: `### 1. Как устроена сеть в ALT Linux (подсистема etcnet)

В отличие от Debian/Ubuntu (\`netplan\`, \`/etc/network/interfaces\`) или RHEL (\`NetworkManager\`), в ALT Linux традиционно используется подсистема **etcnet**.
Все настройки интерфейсов хранятся в каталоге \`/etc/net/ifaces/\`. Один интерфейс = одна папка.
Внутри папки интерфейса создаются простые текстовые файлы:
• **options** — тип интерфейса и его свойства (\`TYPE=eth\` для физической карты, \`TYPE=vlan\` для виртуального саб-интерфейса, \`HOST=...\` — физический порт-носитель VLAN, \`VID=...\` — номер тега VLAN).
• **ipv4address** — IP-адрес с префиксом маски (например, \`192.168.100.1/27\`).
• **ipv4route** — статические маршруты или шлюз по умолчанию (\`default via 172.16.1.1\`).
• **resolv.conf** — настройки DNS для данного интерфейса (\`nameserver 77.88.8.8\`, \`search au-team.irpo\`).

---

### 2. Сводная таблица адресации (Таблица 2)

Используйте данную таблицу как эталон при настройке каждого узла:

| Устройство | Интерфейс | IP-адрес / Префикс | Шлюз по умолчанию | DNS-сервер | Описание / Назначение |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **ISP** | ens19 | \`172.16.1.1/28\` | — | — | Линк в сторону HQ-RTR |
| **ISP** | ens20 | \`172.16.2.1/28\` | — | — | Линк в сторону BR-RTR |
| **HQ-RTR** | ens18 | \`172.16.1.2/28\` | \`172.16.1.1\` | \`77.88.8.8\` | Внешний линк к ISP |
| **HQ-RTR** | vlan100 | \`192.168.100.1/27\` | — | — | Сеть серверов HQ (до 32 IP) |
| **HQ-RTR** | vlan200 | \`192.168.200.1/24\` | — | — | Сеть клиентов HQ (от 16 IP) |
| **HQ-RTR** | vlan999 | \`192.168.99.1/29\` | — | — | Сеть управления (до 8 IP) |
| **HQ-SRV** | ens18 | \`192.168.100.2/27\` | \`192.168.100.1\` | \`77.88.8.8\` | Сервер главного офиса HQ |
| **BR-RTR** | ens18 | \`172.16.2.2/28\` | \`172.16.2.1\` | \`77.88.8.8\` | Внешний линк к ISP |
| **BR-RTR** | ens19 | \`172.16.10.1/30\` | — | — | Локальная сеть филиала BR |
| **BR-FW** | ens18 | \`172.16.10.2/30\` | \`172.16.10.1\` | \`77.88.8.8\` | В сторону BR-RTR |
| **BR-FW** | ens19 | \`172.16.20.1/28\` | — | — | В сторону BR-SRV |
| **BR-SRV** | ens18 | \`172.16.20.2/28\` | \`172.16.20.1\` | \`77.88.8.8\` | Сервер филиала BR |

---

### 3. Требования к именам хостов (FQDN)
Настроить системные имена узлов в доменной зоне \`.au-team.irpo\`:
• \`isp.au-team.irpo\`
• \`hq-rtr.au-team.irpo\`
• \`hq-srv.au-team.irpo\`
• \`hq-cli.au-team.irpo\`
• \`br-rtr.au-team.irpo\`
• \`br-fw.au-team.irpo\`
• \`br-srv.au-team.irpo\``,
    theory: [
      {
        title: 'Архитектура подсистемы etcnet в ALT Linux',
        explanation:
          'В ALT Linux традиционно используется подсистема etcnet. Конфигурация каждого интерфейса изолирована в собственном каталоге /etc/net/ifaces/<interface_name>/.',
        details: [
          '/etc/net/ifaces/<iface>/options — свойства интерфейса (TYPE=eth, TYPE=vlan, HOST=..., VID=...).',
          '/etc/net/ifaces/<iface>/ipv4address — назначение IPv4 адреса в CIDR нотации (IP/маска).',
          '/etc/net/ifaces/<iface>/ipv4route — маршруты, включая шлюз по умолчанию: "default via <шлюз>".',
          '/etc/net/ifaces/<iface>/resolv.conf — локальные DNS-серверы и домен поиска: "nameserver ...", "search ...".',
          'Применение изменений выполняется перезапуском сетевой службы: systemctl restart network.',
        ],
      },
      {
        title: 'Установка FQDN и мгновенное обновление оболочки Bash',
        explanation:
          'Команда hostnamectl set-hostname навсегда прописывает FQDN хоста в системе (в /etc/hostname). Конструкция "exec bash" заменяет текущий процесс оболочки на новый, мгновенно обновляя приглашение командной строки (prompt) без необходимости перезагружать ОС или заново подключаться по SSH.',
        details: [
          'hostnamectl set-hostname <fqdn> — изменяет статическое, переходное и красивое имя хоста.',
          'exec bash — заменяет текущий шелл на новый сеанс bash с перечитанным hostname.',
        ],
      },
      {
        title: 'Тегирование 802.1Q (VLAN sub-interfaces) в etcnet',
        explanation:
          'Для создания саб-интерфейсов VLAN поверх транкового физического порта (ens19) создается каталог vlan<VID>. В файле options задаются директивы TYPE=vlan, HOST=ens19 и VID=<номер тега>.',
        details: [
          'HOST=ens19 указывает несущий физический адаптер транка.',
          'VID=100 задает номер тега 802.1Q в Ethernet-фреймах.',
          'Пересылка транзитных пакетов между интерфейсами требует net.ipv4.ip_forward = 1 в /etc/net/sysctl.conf.',
        ],
      },
    ],
    steps: [
      {
        step_number: 1,
        node: 'ISP, HQ-RTR, HQ-SRV, HQ-CLI, BR-RTR, BR-FW, BR-SRV',
        title: 'Шаг 1. Настройка FQDN имён хостов',
        explanation:
          'Команда hostnamectl set-hostname навсегда прописывает имя хоста в системе. Команда exec bash через точку с запятой заменяет текущий процесс оболочки на новый, благодаря чему приглашение командной строки (prompt) обновляется мгновенно без переподключения.',
        commands: `# На узле ISP:
hostnamectl set-hostname isp.au-team.irpo; exec bash

# На узле HQ-RTR:
hostnamectl set-hostname hq-rtr.au-team.irpo; exec bash

# На узле HQ-SRV:
hostnamectl set-hostname hq-srv.au-team.irpo; exec bash

# На узле HQ-CLI:
hostnamectl set-hostname hq-cli.au-team.irpo; exec bash

# На узле BR-RTR:
hostnamectl set-hostname br-rtr.au-team.irpo; exec bash

# На узле BR-FW:
hostnamectl set-hostname br-fw.au-team.irpo; exec bash

# На узле BR-SRV:
hostnamectl set-hostname br-srv.au-team.irpo; exec bash`,
      },
      {
        step_number: 2,
        node: 'ISP',
        title: 'Шаг 2. Настройка сетевых портов и маршрутизации на ISP',
        explanation:
          'Маршрутизатор ISP соединяет два офиса через интерфейсы ens19 (к HQ-RTR) и ens20 (к BR-RTR). Включаем пересылку пакетов net.ipv4.ip_forward = 1.',
        commands: `# 1. Создаем каталоги настроек сразу для двух интерфейсов ens19 и ens20:
mkdir -p /etc/net/ifaces/ens{19,20}

# 2. Указываем тип интерфейсов (TYPE=eth) в оба файла через tee:
echo 'TYPE=eth' | tee /etc/net/ifaces/ens{19,20}/options

# 3. Назначаем статические IP-адреса на каждый интерфейс:
echo '172.16.1.1/28' > /etc/net/ifaces/ens19/ipv4address
echo '172.16.2.1/28' > /etc/net/ifaces/ens20/ipv4address

# 4. Включаем пересылку пакетов (маршрутизацию):
echo "net.ipv4.ip_forward = 1" >> /etc/net/sysctl.conf
sysctl -p

# 5. Применяем настройки и проверяем состояние:
systemctl restart network
clear
ip -c --br a`,
      },
      {
        step_number: 3,
        node: 'HQ-RTR',
        title: 'Шаг 3. Настройка портов и VLAN на центральном маршрутизаторе HQ-RTR',
        explanation:
          'У маршрутизатора HQ есть внешний линк к ISP (ens18) и внутренний транк-порт (ens19), по которому передаются тегированные пакеты VLAN 100, 200 и 999. Также сразу создаем каталог туннеля gre1.',
        commands: `# 1. Создаем каталоги для физических портов, VLAN-интерфейсов и туннеля gre1:
mkdir -p /etc/net/ifaces/{ens{18,19},vlan{100,200,999},gre1}

# 2. Физическим интерфейсам ens18 и ens19 задаем тип Ethernet:
echo 'TYPE=eth' | tee /etc/net/ifaces/ens{18,19}/options

# 3. Настраиваем внешний интерфейс ens18 (в сторону ISP):
echo '172.16.1.2/28' > /etc/net/ifaces/ens18/ipv4address
echo 'default via 172.16.1.1' > /etc/net/ifaces/ens18/ipv4route
echo 'nameserver 77.88.8.8' > /etc/net/ifaces/ens18/resolv.conf

# 4. Настраиваем виртуальные интерфейсы VLAN (100, 200, 999):
echo $'100\n200\n999' | xargs -i bash -c 'echo -e "TYPE=vlan\nHOST=ens19\nVID={}" > /etc/net/ifaces/vlan{}/options'

# 5. Назначаем IP-адреса на созданные VLAN-интерфейсы:
echo '192.168.100.1/27' > /etc/net/ifaces/vlan100/ipv4address
echo '192.168.200.1/24' > /etc/net/ifaces/vlan200/ipv4address
echo '192.168.99.1/29'  > /etc/net/ifaces/vlan999/ipv4address

# 6. Включаем пересылку пакетов (маршрутизацию):
echo "net.ipv4.ip_forward = 1" >> /etc/net/sysctl.conf
sysctl -p

# 7. Применяем настройки и проверяем состояние:
systemctl restart network
clear
ip -c --br a`,
      },
      {
        step_number: 4,
        node: 'HQ-SRV',
        title: 'Шаг 4. Настройка сетевого интерфейса на сервере HQ-SRV',
        explanation:
          'Сервер находится в подсети VLAN 100 и использует адрес 192.168.100.2/27. Шлюзом для него выступает маршрутизатор HQ-RTR (192.168.100.1).',
        commands: `# 1. Указываем тип интерфейса (Ethernet):
mkdir -p /etc/net/ifaces/ens18
echo 'TYPE=eth' > /etc/net/ifaces/ens18/options

# 2. Назначаем IP-адрес сервера:
echo '192.168.100.2/27' > /etc/net/ifaces/ens18/ipv4address

# 3. Указываем шлюз по умолчанию (маршрутизатор HQ-RTR):
echo 'default via 192.168.100.1' > /etc/net/ifaces/ens18/ipv4route

# 4. Указываем DNS-сервер:
echo 'nameserver 77.88.8.8' > /etc/net/ifaces/ens18/resolv.conf

# 5. Применяем параметры и проверяем:
systemctl restart network
clear
ip -c --br a`,
      },
      {
        step_number: 5,
        node: 'BR-RTR',
        title: 'Шаг 5. Настройка портов на маршрутизаторе филиала BR-RTR',
        explanation:
          'Маршрутизатор филиала соединяет локальную сеть филиала (ens19, транзитный линк к BR-FW 172.16.10.0/30) с каналом провайдера (ens18, линк 172.16.2.0/28).',
        commands: `# 1. Создаем каталоги для сетевых портов и туннеля gre1:
mkdir -p /etc/net/ifaces/{ens{18,19},gre1}
echo 'TYPE=eth' | tee /etc/net/ifaces/ens{18,19}/options

# 2. Настраиваем линк к провайдеру ISP:
echo '172.16.2.2/28' > /etc/net/ifaces/ens18/ipv4address
echo 'default via 172.16.2.1' > /etc/net/ifaces/ens18/ipv4route
echo 'nameserver 77.88.8.8' > /etc/net/ifaces/ens18/resolv.conf

# 3. Настраиваем интерфейс к BR-FW:
echo '172.16.10.1/30' > /etc/net/ifaces/ens19/ipv4address

# 4. Включаем пересылку пакетов (маршрутизацию):
echo "net.ipv4.ip_forward = 1" >> /etc/net/sysctl.conf
sysctl -p

# 5. Применяем настройки:
systemctl restart network
clear
ip -c --br a`,
      },
      {
        step_number: 6,
        node: 'BR-FW',
        title: 'Шаг 6. Настройка межсетевого экрана филиала BR-FW',
        explanation:
          'Межсетевой экран соединяет BR-RTR (ens18: 172.16.10.2/30 со шлюзом 172.16.10.1) и сервер филиала BR-SRV (ens19: 172.16.20.1/28). Включаем маршрутизацию пакетов.',
        commands: `# 1. Задаем тип сетевых адаптеров:
mkdir -p /etc/net/ifaces/ens{18,19}
echo 'TYPE=eth' | tee /etc/net/ifaces/ens{18,19}/options

# 2. Назначаем статический IP-адрес к BR-RTR:
echo '172.16.10.2/30' > /etc/net/ifaces/ens18/ipv4address
echo 'default via 172.16.10.1' > /etc/net/ifaces/ens18/ipv4route
echo 'nameserver 77.88.8.8' > /etc/net/ifaces/ens18/resolv.conf

# 3. Настраиваем интерфейс к BR-SRV:
echo '172.16.20.1/28' > /etc/net/ifaces/ens19/ipv4address

# 4. Включаем пересылку пакетов (маршрутизацию):
echo "net.ipv4.ip_forward = 1" >> /etc/net/sysctl.conf
sysctl -p

# 5. Применяем настройки и проверяем состояние:
systemctl restart network
clear
ip -c --br a`,
      },
      {
        step_number: 7,
        node: 'BR-SRV',
        title: 'Шаг 7. Настройка сетевого интерфейса на сервере филиала BR-SRV',
        explanation:
          'Сервер филиала имеет IP-адрес 172.16.20.2/28. Шлюзом по умолчанию является BR-FW (172.16.20.1). Настраиваем домен поиска au-team.irpo и DNS-сервер.',
        commands: `# 1. Задаем тип сетевого адаптера:
mkdir -p /etc/net/ifaces/ens18
echo 'TYPE=eth' > /etc/net/ifaces/ens18/options

# 2. Назначаем статический IP-адрес:
echo '172.16.20.2/28' > /etc/net/ifaces/ens18/ipv4address

# 3. Прописываем маршрутизатор филиала как шлюз по умолчанию:
echo 'default via 172.16.20.1' > /etc/net/ifaces/ens18/ipv4route

# 4. Задаем домен поиска и корпоративный DNS-сервер:
echo $'search au-team.irpo\nnameserver 77.88.8.8' > /etc/net/ifaces/ens18/resolv.conf

# 5. Применяем настройки и проверяем состояние:
systemctl restart network
clear
ip -c --br a`,
      },
      {
        step_number: 8,
        node: 'Все узлы',
        title: 'Шаг 8. Верификация и проверка связности',
        explanation:
          'После завершения конфигурации проверяем статус всех интерфейсов и наличие маршрута по умолчанию.',
        commands: `# Проверка статуса портов (все должны быть UP):
ip -c --br a

# Проверка таблицы маршрутизации (должен быть маршрут default via ...):
ip r

# Проверка доступности шлюзов:
# На HQ-SRV:
ping -c 2 192.168.100.1

# На BR-SRV:
ping -c 2 172.16.20.1`,
      },
    ],
    script_command: 'curl -sSL https://exam.sudostudy.dev/scripts/2027/m1_t1.sh | bash',
    questions: [
      {
        id: 'q1',
        text: 'Где в ALT Linux хранятся конфигурационные каталоги и файлы сетевых интерфейсов подсистемы etcnet?',
        options: [
          { id: 'A', text: '/etc/network/interfaces' },
          { id: 'B', text: '/etc/net/ifaces/' },
          { id: 'C', text: '/etc/sysconfig/network-scripts/' },
          { id: 'D', text: '/etc/netplan/' },
        ],
        correct_answer: 'B',
      },
      {
        id: 'q2',
        text: 'Какие параметры в файле options подсистемы etcnet обязательны для создания виртуального саб-интерфейса 802.1Q (VLAN)?',
        options: [
          { id: 'A', text: 'TYPE=vlan, HOST=<интерфейс_транка>, VID=<номер_тега>' },
          { id: 'B', text: 'TYPE=eth, VLAN=yes, ID=<номер_тега>' },
          { id: 'C', text: 'MODE=vlan, PARENT=<интерфейс>, TAG=<номер_тега>' },
          { id: 'D', text: 'TYPE=trunk, INTERFACE=<интерфейс>, VID=<номер_тега>' },
        ],
        correct_answer: 'A',
      },
      {
        id: 'q3',
        text: 'С какой целью после изменения имени хоста выполняется команда exec bash (например: hostnamectl set-hostname hq-rtr.au-team.irpo; exec bash)?',
        options: [
          { id: 'A', text: 'Для перезапуска сетевой службы network' },
          { id: 'B', text: 'Для сохранения имени хоста в файл /etc/hosts' },
          {
            id: 'C',
            text: 'Для заменяющего запуска нового процесса оболочки и мгновенного обновления prompt без переподключения',
          },
          { id: 'D', text: 'Для автоматической генерации SSH-ключей хоста' },
        ],
        correct_answer: 'C',
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
    title: 'Доступ к сети Интернет на ISP',
    module_code: 'Модуль 1 (2027)',
    description:
      'В данном задании настраивается интернет-провайдер (ISP). Его задача — принимать трафик из локальных сетей офисов (HQ и BR) и выпускать их в глобальную сеть через динамическую трансляцию адресов (NAT / Masquerade) с помощью подсистемы nftables.',
    nodes: ['ISP'],
    assignment: `### Задание 1.2: Доступ к сети Интернет на ISP

В данном задании настраивается интернет-провайдер (ISP). Его задача — принимать трафик из локальных сетей офисов (HQ и BR) и выпускать их в глобальную сеть через динамическую трансляцию адресов (NAT / Masquerade).

**Место выполнения:**
Все команды выполняются на виртуальной машине **ISP** (\`isp.au-team.irpo\`).

---

### 1. Теоретическая справка: что мы настраиваем и зачем?

#### Зачем нужен \`ip_forward = 1\`?
По умолчанию ядро Linux настроено как обычный компьютер (конечный узел): если на его сетевой интерфейс приходит IP-пакет, адресованный не ему, ядро его просто отбрасывает.
Включение директивы \`net.ipv4.ip_forward = 1\` сообщает ядру: *«Ты теперь маршрутизатор, пересылай транзитные пакеты между разными сетевыми интерфейсами»*.

#### Зачем нужен NAT Masquerade?
Сети наших офисов (\`172.16.1.0/28\`, \`172.16.2.0/28\`, \`192.168.x.x\`) относятся к диапазонам приватных IP-адресов ([RFC 1918](https://datatracker.ietf.org/doc/html/rfc1918)). В глобальной сети Интернет эти адреса не маршрутизируются.
Механизм **Masquerade** («Маскарад» / разновидность динамического PAT/NAPT) подменяет обратный «серый» IP-адрес источника в пакете на реальный IP-адрес внешнего интерфейса \`ens18\`, полученный от магистрального интернет-провайдера. Когда из Интернета возвращается ответный пакет, ISP по таблице состояний трансляций возвращает пакет обратно нужному офисному узлу.

---

### 2. Таблица трансляции сетевых адресов (NAT)

| Направление трафика | Входной порт | Адрес источника (Source IP) | Выходной порт | Адрес после трансляции (NAT) | Адрес назначения (Destination) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **HQ → Интернет** | ens19 | 172.16.1.2 (HQ-RTR) | ens18 (WAN) | IP интерфейса ens18 (от провайдера) | 77.88.55.242 (ya.ru) |
| **BR → Интернет** | ens20 | 172.16.2.2 (BR-RTR) | ens18 (WAN) | IP интерфейса ens18 (от провайдера) | 77.88.55.242 (ya.ru) |
| **Ответ из Сети** | ens18 (WAN) | 77.88.55.242 (ya.ru) | ens19 / ens20 | 172.16.1.2 или 172.16.2.2 | Исходный офисный маршрутизатор |

---

### 3. Жизненный цикл пакета при выходе в Интернет
1. **Запрос из офиса**: Маршрутизатор HQ-RTR (172.16.1.2) отправляет пакет на шлюз 172.16.1.1 (ISP):
   \`[Источник: 172.16.1.2] ──► [Назначение: ya.ru]\`
2. **Пересылка на ISP (\`ip_forward = 1\`)**: Пакет поступает на порт \`ens19\`. Ядро Linux определяет, что пакет транзитный, и направляет его на внешний интерфейс \`ens18\`.
3. **Маскарад (\`nftables masquerade\`)**: В цепочке postrouting провайдер подменяет «серый» IP на свой реальный адрес:
   \`[Источник: IP адрес ens18] ──► [Назначение: ya.ru]\`
   *(ISP сохраняет запись в таблице состояний соединений)*.
4. **Возврат ответа**: Сервер в Интернете отвечает на адрес \`ens18\`. ISP находит запись в таблице трансляций, заменяет адрес получателя обратно на \`172.16.1.2\` и отправляет пакет через \`ens19\` в сторону HQ-RTR.`,
    theory: [
      {
        title: 'Маршрутизация транзитных пакетов ядра Linux',
        explanation:
          'Директива net.ipv4.ip_forward управляет способностью ядра пересылать сетевые пакеты между различными физическими и виртуальными сетевыми интерфейсами.',
        details: [
          'Значение 0 (по умолчанию) — режим конечной рабочей станции, транзитные пакеты уничтожаются (drop).',
          'Значение 1 — режим маршрутизатора, пакеты передаются согласно локальной таблице маршрутизации.',
          'В ALT Linux постоянное значение сохраняется в /etc/net/sysctl.conf.',
        ],
      },
      {
        title: 'Межсетевой экран nftables и цепочка postrouting',
        explanation:
          'Подсистема nftables использует хук postrouting подсистемы Netfilter для изменения заголовков пакетов непосредственно перед их передачей в физическую среду передачи данных.',
        details: [
          'Хук postrouting срабатывает после принятия ядром решения о маршрутизации пакета.',
          'Директива oifname "ens18" задает имя выходного (Outbound) интерфейса.',
          'Действие masquerade автоматически выбирает текущий динамический/статический IP выходного порта для подмены.',
        ],
      },
      {
        title: 'Утилита nft и загрузка конфигурации',
        explanation:
          'Утилита nft позволяет компилировать и атомарно применять наборы правил без разрыва существующих соединений.',
        details: [
          'nft flush ruleset — очистка правил в памяти ядра перед повторной загрузкой.',
          'nft -f <файл> — компиляция и атомарное применение конфигурации правил в ядре.',
          'systemctl enable --now nftables — добавление службы nftables в автозагрузку systemd.',
        ],
      },
    ],
    steps: [
      {
        step_number: 1,
        node: 'ISP',
        title: 'Шаг 1. Включение маршрутизации пакетов в ядре',
        explanation:
          'В ALT Linux глобальные системные параметры ядра для сетевой подсистемы задаются в файле /etc/net/sysctl.conf. Включаем пересылку пакетов между ens18, ens19 и ens20.',
        commands: `# Включаем пересылку транзитных пакетов в конфигурации etcnet:
echo "net.ipv4.ip_forward = 1" >> /etc/net/sysctl.conf

# Применяем системные параметры через sysctl:
sysctl -p

# Перезапускаем сетевую подсистему etcnet:
systemctl restart network

# Проверяем значение параметра ядра:
sysctl net.ipv4.ip_forward`,
      },
      {
        step_number: 2,
        node: 'ISP',
        title: 'Шаг 2. Установка и настройка межсетевого экрана nftables',
        explanation:
          'В ALT Linux современным стандартом управления правилами трансляции и межсетевой фильтрации является nftables (пришёл на замену устаревшему iptables). Создаем конфигурацию NAT Masquerade для внешнего интерфейса ens18.',
        commands: `# 1. Обновляем кэш репозиториев и устанавливаем пакет nftables:
apt-get update && apt-get install nftables -y

# 2. Создаем конфигурационный файл правил трансляции /etc/nftables/nftables.nft:
cat << 'EOF' > /etc/nftables/nftables.nft
#!/usr/sbin/nft -f

flush ruleset

table ip nat {
    chain postrouting {
        type nat hook postrouting priority srcnat;
        oifname "ens18" masquerade
    }
}
EOF

# 3. Включаем службу nftables в автозапуск systemd и стартуем её:
systemctl enable --now nftables

# 4. Принудительно очищаем текущие правила и мгновенно применяем конфигурационный файл:
nft flush ruleset
nft -f /etc/nftables/nftables.nft`,
      },
      {
        step_number: 3,
        node: 'ISP, HQ-RTR, BR-RTR',
        title: 'Шаг 3. Проверка работоспособности (Верификация)',
        explanation:
          'Проверяем статус правил трансляции в ядре, статус форвардинга и сквозную связность с глобальным Интернетом.',
        commands: `# 1. Проверяем статус правил трансляции в ядре:
nft list ruleset

# 2. Проверяем статус пересылки транзитных пакетов:
sysctl net.ipv4.ip_forward

# 3. Проверяем доступность внешнего Интернета на самом ISP:
ping -c4 ya.ru

# 4. Проверяем сквозной выход в Интернет с маршрутизаторов HQ-RTR и BR-RTR:
# (На узлах HQ-RTR и BR-RTR):
ping -c4 ya.ru`,
      },
    ],
    script_command: 'curl -sSL https://exam.sudostudy.dev/scripts/2027/m1_t2.sh | bash',
    questions: [
      {
        id: 'q1',
        text: 'Какой параметр ядра Linux отвечает за разрешение пересылки транзитных сетевых пакетов между интерфейсами?',
        options: [
          { id: 'A', text: 'net.ipv4.ip_forward = 1' },
          { id: 'B', text: 'net.ipv4.route_forwarding = enabled' },
          { id: 'C', text: 'net.core.packet_forward = true' },
          { id: 'D', text: 'net.ipv4.conf.all.routing = 1' },
        ],
        correct_answer: 'A',
      },
      {
        id: 'q2',
        text: 'В какой цепочке подсистемы nftables настраивается правило динамической трансляции адресов (Masquerade)?',
        options: [
          { id: 'A', text: 'postrouting' },
          { id: 'B', text: 'prerouting' },
          { id: 'C', text: 'forward' },
          { id: 'D', text: 'output' },
        ],
        correct_answer: 'A',
      },
      {
        id: 'q3',
        text: 'Какое действие в nftables производит подмену адреса источника на реальный IP-адрес исходящего интерфейса?',
        options: [
          { id: 'A', text: 'masquerade' },
          { id: 'B', text: 'dnat' },
          { id: 'C', text: 'redirect' },
          { id: 'D', text: 'accept' },
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
    title: 'Локальные учётные записи и sudo',
    module_code: 'Модуль 1 (2027)',
    description:
      'В данном задании настраиваются системные административные пользователи на серверах и маршрутизаторах с правом выполнения команд суперпользователя (sudo) без ввода пароля.',
    nodes: ['HQ-SRV', 'BR-SRV', 'HQ-RTR', 'BR-RTR'],
    assignment: `### Задание 1.3: Локальные учётные записи и sudo

В данном задании настраиваются системные административные пользователи на серверах и маршрутизаторах с правом выполнения команд суперпользователя (sudo) без ввода пароля.

---

### 1. Теоретическая справка: как работает безопасность в ALT Linux

#### 1. Что такое UID (-u 2027)?
В Linux операционная система различает пользователей не по их текстовым логинам, а по уникальным числовым идентификаторам — **UID (User Identifier)**.
По заданию 2027 года требуется назначить конкретный UID **2027**. Параметр \`-u\` утилиты \`useradd\` принудительно задаёт этот номер при создании пользователя.

#### 2. Зачем нужна утилита chpasswd?
Команда \`passwd\` в консоли требует интерактивного ввода и повторного подтверждения пароля. Конструкция:
\`\`\`bash
echo "user:pass" | chpasswd
\`\`\`
позволяет задать пароль в одну строчку без лишних диалогов, что критически экономит время на демонстрационном экзамене.

#### 3. Что такое группа wheel?
В дистрибутивах семейства ALT Linux (как и в RHEL/CentOS) исторически используется системная группа **wheel**. Члены этой группы наделяются правом повышать свои привилегии до root.
Флаг \`-aG\` в \`usermod\` расшифровывается как:
• \`-a\` (append) — добавить в группу, не удаляя пользователя из остальных его групп;
• \`-G\` (supplementary Group) — указать дополнительную группу.

#### 4. Почему каталог \`/etc/sudoers.d/\`, а не файл \`/etc/sudoers\`?
Вместо небезопасного прямого редактирования основного файла \`/etc/sudoers\` принято создавать отдельные изолированные файлы в каталоге \`/etc/sudoers.d/\`. Директива:
\`\`\`text
WHEEL_USERS ALL=(ALL:ALL) NOPASSWD: ALL
\`\`\`
означает:
• **WHEEL_USERS** — псевдоним (alias) для всех участников группы wheel;
• **ALL=(ALL:ALL)** — на всех хостах, от имени любого пользователя и любой группы;
• **NOPASSWD: ALL** — запуск абсолютно любых команд через sudo без запроса пароля.

---

### 2. Сводные требования по узлам стенда

| Узлы | Имя пользователя | UID | Пароль | Группа | Sudo конфигурация |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **HQ-SRV, BR-SRV** | \`sshuser\` | **2027** | \`P@ssw0rd\` | \`wheel\` | \`/etc/sudoers.d/sshuser\` (\`NOPASSWD\`) |
| **HQ-RTR, BR-RTR** | \`net_admin\` | auto | \`P@ssw0rd\` | \`wheel\` | \`/etc/sudoers.d/net_admin\` (\`NOPASSWD\`) |

*Примечание:* На сетевых сборках маршрутизаторов ALT Linux пакет \`sudo\` изначально не установлен, его требуется доустановить через \`apt-get install sudo -y\`.`,
    theory: [
      {
        title: 'Числовые идентификаторы пользователей (UID)',
        explanation:
          'В Linux каждый пользователь идентифицируется целым числом UID. Значения до 1000 зарезервированы под системные службы, а обычные пользователи начинаются с 1000. Флаг useradd -u позволяет задать точный номер UID.',
        details: [
          'useradd -u 2027 sshuser — создание учетной записи с UID 2027.',
          'Команда id <username> позволяет проверить текущие UID, GID и группы пользователя.',
          'Записи пользователей хранятся в файле /etc/passwd.',
        ],
      },
      {
        title: 'Утилита chpasswd для пакетного задания паролей',
        explanation:
          'Команда chpasswd считывает пары "логин:пароль" из стандартного потока ввода (stdin) и шифрует их в /etc/shadow без интерактивных запросов подтверждения.',
        details: [
          'echo "username:password" | chpasswd — безопасное пакетное изменение пароля.',
          'Не требует ручного ввода и нажатия клавиш подтверждения.',
        ],
      },
      {
        title: 'Административная группа wheel и права sudo',
        explanation:
          'Группа wheel исторически используется в UNIX-системах для обозначения системных операторов с правом вызова sudo/su до суперпользователя root.',
        details: [
          'usermod -aG wheel <user> — безопасное добавление в группу без потери членства в других группах.',
          'Директива WHEEL_USERS ALL=(ALL:ALL) NOPASSWD: ALL разрешает беспарольный запуск любых команд.',
          'Файлы в /etc/sudoers.d/ должны иметь права доступа 0440.',
        ],
      },
    ],
    steps: [
      {
        step_number: 1,
        node: 'HQ-SRV, BR-SRV',
        title: 'Шаг 1. Настройка серверов HQ-SRV и BR-SRV',
        explanation:
          'На обоих серверах создаётся пользователь sshuser с явным идентификатором UID 2027 и беспарольным sudo. Выполните блок сначала на HQ-SRV, затем на BR-SRV.',
        commands: `# 1. Создаем пользователя sshuser с явным указанием UID 2027:
useradd -u 2027 sshuser

# 2. Назначаем пароль P@ssw0rd в неинтерактивном режиме:
echo "sshuser:P@ssw0rd" | chpasswd

# 3. Добавляем пользователя в административную группу wheel:
usermod -aG wheel sshuser

# 4. Разрешаем группе wheel выполнять любые команды через sudo без ввода пароля:
echo "WHEEL_USERS ALL=(ALL:ALL) NOPASSWD: ALL" > /etc/sudoers.d/sshuser

# 5. Проверяем работу: входим под пользователем sshuser:
su -l sshuser

# 6. Проверяем статус суперпользователя:
sudo id

# 7. Возвращаемся обратно под учетную запись root:
exit`,
      },
      {
        step_number: 2,
        node: 'HQ-RTR, BR-RTR',
        title: 'Шаг 2. Настройка маршрутизаторов HQ-RTR и BR-RTR',
        explanation:
          'На маршрутизаторах создаётся пользователь net_admin. На сетевых сборках ALT Linux утилита sudo часто отсутствует по умолчанию, поэтому перед настройкой прав устанавливаем пакет sudo. Выполните блок сначала на HQ-RTR, затем на BR-RTR.',
        commands: `# 1. Создаем пользователя net_admin:
useradd net_admin

# 2. Назначаем пароль P@ssw0rd:
echo "net_admin:P@ssw0rd" | chpasswd

# 3. Добавляем пользователя в группу wheel:
usermod -aG wheel net_admin

# 4. Обновляем репозитории и устанавливаем пакет sudo:
apt-get update && apt-get install sudo -y

# 5. Разрешаем беспарольный sudo для администраторов:
echo "WHEEL_USERS ALL=(ALL:ALL) NOPASSWD: ALL" > /etc/sudoers.d/net_admin

# 6. Проверяем вход под созданным пользователем:
su -l net_admin

# 7. Проверяем привилегии:
sudo id

# 8. Выходим обратно в сессию root:
exit`,
      },
      {
        step_number: 3,
        node: 'HQ-SRV, BR-SRV, HQ-RTR, BR-RTR',
        title: 'Шаг 3. Проверка работоспособности (Верификация)',
        explanation:
          'При выполнении команды sudo id под учётными записями sshuser и net_admin система НЕ должна запрашивать пароль, а в консоли должен отображаться идентификатор uid=0(root).',
        commands: `# На серверах (HQ-SRV, BR-SRV):
id sshuser
su -l sshuser -c "sudo id"

# На маршрутизаторах (HQ-RTR, BR-RTR):
id net_admin
su -l net_admin -c "sudo id"`,
      },
    ],
    script_command: 'curl -sSL https://exam.sudostudy.dev/scripts/2027/m1_t3.sh | bash',
    questions: [
      {
        id: 'q1',
        text: 'Какой параметр утилиты useradd позволяет принудительно задать конкретный числовой идентификатор (UID) создаваемого пользователя (например, 2027)?',
        options: [
          { id: 'A', text: '-u' },
          { id: 'B', text: '-g' },
          { id: 'C', text: '-i' },
          { id: 'D', text: '-U' },
        ],
        correct_answer: 'A',
      },
      {
        id: 'q2',
        text: 'Для чего при добавлении пользователя в группу wheel используется связка флагов -aG в команде usermod -aG wheel <user>?',
        options: [
          {
            id: 'A',
            text: 'Флаг -a (append) добавляет пользователя в группу без удаления из других групп, а -G задает дополнительную группу',
          },
          {
            id: 'B',
            text: 'Флаг -a назначает пользователя администратором группы, а -G отключает запрос пароля',
          },
          {
            id: 'C',
            text: 'Флаг -a активирует автоматическую генерацию пароля, а -G создает домашнюю директорию',
          },
          { id: 'D', text: 'Флаги -aG принудительно изменяют основной (primary) GID пользователя' },
        ],
        correct_answer: 'A',
      },
      {
        id: 'q3',
        text: 'Что означает директива WHEEL_USERS ALL=(ALL:ALL) NOPASSWD: ALL в конфигурационном файле /etc/sudoers.d/?',
        options: [
          {
            id: 'A',
            text: 'Разрешает всем участникам группы wheel выполнять любые команды от имени любого пользователя без запроса пароля',
          },
          {
            id: 'B',
            text: 'Запрещает выполнение sudo пользователям, не входящим в группу wheel',
          },
          {
            id: 'C',
            text: 'Включает обязательное двухфакторное подтверждение пароля для пользователей wheel',
          },
          { id: 'D', text: 'Ограничивает права участников группы wheel только правами на чтение логов' },
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
    title: 'Коммутация и сегментация VLAN в сегменте HQ',
    module_code: 'Модуль 1 (2027)',
    description:
      'Пошаговая настройка режимов Access и Trunk на виртуальных адаптерах Proxmox VE для сегментации трафика VLAN 100, 200 и Router-on-a-Stick на HQ-RTR.',
    nodes: ['HQ-SRV', 'HQ-CLI', 'HQ-RTR'],
    assignment: `### Задание 1.4: Коммутация и сегментация VLAN в сегменте HQ

В данном задании настраивается изоляция сетевого трафика главного офиса (HQ) на уровне гипервизора Proxmox VE.

Задача — изолировать трафик сервера (VLAN 100) и клиентской машины (VLAN 200), а также обеспечить маршрутизацию между ними через единственный сетевой адаптер маршрутизатора HQ-RTR (Router-on-a-Stick).

---

### 1. Как это работает: Access vs Trunk в Proxmox VE

В Proxmox VE виртуальные машины подключаются к виртуальным коммутаторам — мостам Linux Bridge (\`vmbr0\`, \`vmbr1\` и т.д.).

#### 1. Режим Access (Конечные устройства — HQ-SRV и HQ-CLI):
• Мы указываем номер VLAN прямо в окне настроек сетевого адаптера виртуальной машины.
• Сам гипервизор Proxmox автоматически навешивает тег 802.1Q на исходящие пакеты и снимает его с входящих.
• Внутри операционной системы ALT Linux сетевой интерфейс остаётся самым обычным (\`ens18\`), гостевая ОС ничего о тегах не знает.

#### 2. Режим Trunk (Маршрутизатор — HQ-RTR):
• Маршрутизатор должен принимать сразу все тегированные пакеты (VLAN 100, 200 и 999), чтобы пересылать их между подсетями.
• Поэтому в свойствах сетевого адаптера на Proxmox поле «Тег VLAN» оставляется пустым.
• Трафик поступает «как есть» внутрь ОС маршрутизатора, где его разбирают саб-интерфейсы \`vlan100\`, \`vlan200\`, \`vlan999\` (настроенные нами в Задании №1).

---

### 2. Сведения о коммутации (для внесения в отчёт)

| Виртуальная машина | Интерфейс в ОС | Режим работы порта | Номер VLAN (VID) | Назначение сегмента |
| :--- | :--- | :--- | :--- | :--- |
| **HQ-SRV** | \`ens18\` | Access | **100** | Серверный сегмент HQ |
| **HQ-CLI** | \`ens18\` | Access | **200** | Клиентский сегмент HQ |
| **HQ-RTR** | \`ens19\` | Trunk (802.1Q) | **100, 200, 999** | Агрегированный линк Router-on-a-Stick |
| **Управление** | — | Access | **999** | Сегмент управления (Management) |`,
    theory: [
      {
        title: 'Режим Access на виртуальном мосту Proxmox',
        explanation:
          'При назначении VLAN Tag в конфигурации netX гипервизор транслирует нетегированный трафик гостевой ОС в тегированный 802.1Q фрейм и обратно, изолируя ВМ от других широковещательных доменов.',
        details: [
          'Параметр tag=100 привязывает сетевой адаптер к VLAN 100.',
          'В гостевой ОС ALT Linux интерфейс конфигурируется как стандартный ens18 без тегов.',
          'Обеспечивает аппаратную изоляцию трафика на уровне виртуального свитча Linux Bridge.',
        ],
      },
      {
        title: 'Режим Trunk и Router-on-a-Stick',
        explanation:
          'Если поле VLAN Tag не заполнено, порт пропускает тегированный трафик всех VLAN без изменений. Гостевая ОС маршрутизатора разбирает фреймы через 802.1Q саб-интерфейсы.',
        details: [
          'HQ-RTR принимает транковый линк через адаптер net1 (внутри ОС — ens19).',
          'Саб-интерфейсы vlan100, vlan200, vlan999 выступают шлюзами по умолчанию для соответствующих сетей.',
          'Технология Router-on-a-Stick устраняет необходимость выделять отдельный физический/виртуальный порт под каждый сегмент.',
        ],
      },
    ],
    steps: [
      {
        step_number: 1,
        node: 'Proxmox VE (Web GUI / CLI)',
        title: 'Шаг 1. Настройка VLAN на виртуальных адаптерах Proxmox VE',
        explanation:
          'Установите соответствующие теги VLAN в свойствах оборудования ВМ на гипервизоре Proxmox VE (Hardware -> Network Device).',
        commands: `# Настройка через графический интерфейс Proxmox VE:
# 1.1 HQ-SRV (VM 102):
# Вкладка Hardware -> Network Device (net0) -> Edit -> VLAN Tag: 100 -> OK (tag=100)

# 1.2 HQ-CLI (VM 103):
# Вкладка Hardware -> Network Device (net0) -> Edit -> VLAN Tag: 200 -> OK (tag=200)

# 1.3 HQ-RTR (VM 101):
# Вкладка Hardware -> Network Device (net1 / ens19) -> Edit -> VLAN Tag: ОСТАВИТЬ ПУСТЫМ (Trunk)

# Либо через терминал Proxmox VE CLI:
# qm set 102 -net0 virtio,bridge=vmbr1,tag=100
# qm set 103 -net0 virtio,bridge=vmbr1,tag=200`,
      },
      {
        step_number: 2,
        node: 'HQ-SRV',
        title: 'Шаг 2. Проверка связности со шлюзом HQ-RTR (Верификация)',
        explanation:
          'Отправьте ICMP-запросы с сервера HQ-SRV на IP-адрес интерфейса vlan100 маршрутизатора HQ-RTR (192.168.100.1).',
        commands: `# Проверяем доступность шлюза VLAN 100:
ping -c3 192.168.100.1

# Ожидаемый результат:
# 3 packets transmitted, 3 received, 0% packet loss`,
      },
    ],
    script_command: 'curl -sSL https://exam.sudostudy.dev/scripts/2027/m1_t4.sh | bash',
    questions: [
      {
        id: 'q1',
        text: 'В каком режиме работает виртуальный сетевой порт в Proxmox VE, если поле «Тег VLAN» (VLAN Tag) оставлено пустым?',
        options: [
          { id: 'A', text: 'Trunk (пропускает фреймы всех VLAN без фильтрации внутрь гостевой ОС)' },
          { id: 'B', text: 'Access (весь трафик принудительно сбрасывается)' },
          { id: 'C', text: 'Mirroring (режим зеркалирования SPAN)' },
          { id: 'D', text: 'Isolated (порт полностью заблокирован)' },
        ],
        correct_answer: 'A',
      },
      {
        id: 'q2',
        text: 'Какая технология используется на маршрутизаторе HQ-RTR для маршрутизации нескольких VLAN через один физический сетевой адаптер (ens19)?',
        options: [
          {
            id: 'A',
            text: 'Router-on-a-Stick с виртуальными саб-интерфейсами 802.1Q (vlan100, vlan200, vlan999)',
          },
          { id: 'B', text: 'Агрегирование каналов Link Aggregation (LACP / IEEE 802.3ad)' },
          { id: 'C', text: 'Протокол отказоустойчивости виртуального шлюза VRRP' },
          { id: 'D', text: 'Динамическая трансляция сетевых адресов SNAT / Masquerade' },
        ],
        correct_answer: 'A',
      },
      {
        id: 'q3',
        text: 'Знает ли гостевая операционная система (ALT Linux на HQ-SRV или HQ-CLI) о VLAN-тегах при использовании режима Access на стороне гипервизора?',
        options: [
          {
            id: 'A',
            text: 'Нет, Proxmox VE автоматически навешивает тег на выходе и снимает его при передаче в гостевую ОС',
          },
          {
            id: 'B',
            text: 'Да, в гостевой ОС обязательно должен быть сконфигурирован саб-интерфейс vlan100',
          },
          { id: 'C', text: 'Только если в ядре гостевой ОС активирован модуль 8021q' },
          { id: 'D', text: 'Да, пакеты поступают в гостевую систему с двойным тегированием QinQ' },
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
    title: 'Безопасный удаленный доступ (SSH)',
    module_code: 'Модуль 1 (2027)',
    description:
      'Настройка защищённого доступа службы OpenSSH на нестандартном порту 2027, ограничение пользователей через AllowUsers sshuser, лимит попыток и баннер.',
    nodes: ['HQ-SRV', 'BR-SRV'],
    assignment: `### Задание 1.5: Безопасный удаленный доступ (SSH)

В данном задании настраивается защита службы удалённого администрирования OpenSSH на серверах **HQ-SRV** и **BR-SRV**.

---

### 1. Теоретическая справка: безопасность OpenSSH в ALT Linux

> **📍 Особенность ALT Linux:**
> В дистрибутивах ALT Linux конфигурационные файлы демона SSH расположены в каталоге \`/etc/openssh/\` (основной конфигурационный файл — \`/etc/openssh/sshd_config\`), в отличие от Debian/Ubuntu, где используется \`/etc/ssh/\`.

#### Разбор директив конфигурации sshd_config:
• **Port 2027** — смена стандартного порта (по умолчанию 22) на нестандартный порт года проведения чемпионата. Защищает сервис от фонового сканирования ботами в сети.
• **AllowUsers sshuser** — строгий белый список пользователей. Доступ разрешён исключительно пользователю \`sshuser\`. Попытка входа под \`root\` или любыми другими локальными пользователями будет отклонена ещё до проверки пароля.
• **MaxAuthTries 2** — максимальное количество попыток ввода неверного пароля в рамках одной сессии. Если пароль введён неверно 2 раза подряд, SSH-сервер принудительно разрывает соединение (защита от перебора паролей методом brute-force).
• **Banner /etc/openssh/ssh_banner** — путь к текстовому файлу, содержимое которого отображается клиенту до ввода пароля при подключении.

---

### 2. Сводные требования по серверам стенда

| Параметр | Значение | Описание |
| :--- | :--- | :--- |
| **Порт подключения** | \`2027\` | Директива \`Port 2027\` |
| **Разрешённый пользователь** | \`sshuser\` | Директива \`AllowUsers sshuser\` |
| **Попытки ввода пароля** | \`2\` | Директива \`MaxAuthTries 2\` |
| **Текстовый баннер** | \`/etc/openssh/ssh_banner\` | Текст: \`Authorized access only\` |`,
    theory: [
      {
        title: 'Расположение конфигураций OpenSSH в ALT Linux',
        explanation:
          'В ALT Linux все настройки OpenSSH сгруппированы в директории /etc/openssh/, а основной файл конфигурации сервера — /etc/openssh/sshd_config.',
        details: [
          '/etc/openssh/sshd_config — параметры работы демона.',
          '/etc/openssh/ssh_banner — файл предупреждающего баннера до авторизации.',
          'Перезапуск службы: systemctl restart sshd.',
        ],
      },
      {
        title: 'Директивы безопасности sshd_config',
        explanation:
          'Смена порта, ограничение белого списка пользователей и лимитирование попыток парольной аутентификации сводят к минимуму риск компрометации через brute-force.',
        details: [
          'Port 2027 — сокрытие сервиса от стандартного сканирования.',
          'AllowUsers sshuser — блокировка входа всех пользователей, кроме sshuser.',
          'MaxAuthTries 2 — разрыв соединения после двух некорректных попыток.',
        ],
      },
    ],
    steps: [
      {
        step_number: 1,
        node: 'HQ-SRV, BR-SRV',
        title: 'Шаг 1. Конфигурирование службы OpenSSH на HQ-SRV и BR-SRV',
        explanation:
          'Выполните одинаковые действия на обоих серверах стенда: добавьте директивы безопасности в sshd_config, создайте баннер и перезапустите службу sshd.',
        commands: `# 1. Добавляем параметры безопасности в конец конфигурационного файла:
cat << 'EOF' >> /etc/openssh/sshd_config
Port 2027
AllowUsers sshuser
MaxAuthTries 2
Banner /etc/openssh/ssh_banner
EOF

# 2. Создаем файл баннера с текстом предупреждения:
echo "Authorized access only" | tee /etc/openssh/ssh_banner

# 3. Перезапускаем демон OpenSSH:
systemctl restart sshd

# 4. Проверяем статус и прослушивание порта:
systemctl status sshd
ss -tulpn | grep 2027`,
      },
      {
        step_number: 2,
        node: 'HQ-RTR, BR-FW',
        title: 'Шаг 2. Проверка работоспособности (Верификация подключения)',
        explanation:
          'Подключитесь с соседних узлов по порту 2027 под пользователем sshuser и убедитесь в отображении баннера и успешном входе.',
        commands: `# 1. Проверка HQ-SRV с маршрутизатора HQ-RTR:
ssh -p 2027 sshuser@192.168.100.2
# Ожидаемый вывод баннера: Authorized access only
# Пароль: P@ssw0rd
exit

# 2. Проверка BR-SRV с межсетевого экрана BR-FW:
ssh -p 2027 sshuser@172.16.20.2
# Ожидаемый вывод баннера: Authorized access only
# Пароль: P@ssw0rd
exit`,
      },
    ],
    script_command: 'curl -sSL https://exam.sudostudy.dev/scripts/2027/m1_t5.sh | bash',
    questions: [
      {
        id: 'q1',
        text: 'В каком каталоге располагается основной конфигурационный файл sshd_config в дистрибутивах ALT Linux?',
        options: [
          { id: 'A', text: '/etc/openssh/' },
          { id: 'B', text: '/etc/ssh/' },
          { id: 'C', text: '/usr/local/etc/ssh/' },
          { id: 'D', text: '/etc/net/openssh/' },
        ],
        correct_answer: 'A',
      },
      {
        id: 'q2',
        text: 'Какая директива sshd_config задаёт строгий белый список учётных записей, которым разрешён удалённый доступ?',
        options: [
          { id: 'A', text: 'AllowUsers sshuser' },
          { id: 'B', text: 'WhiteListUsers sshuser' },
          { id: 'C', text: 'PermitUserLogin sshuser' },
          { id: 'D', text: 'OnlyUsers sshuser' },
        ],
        correct_answer: 'A',
      },
      {
        id: 'q3',
        text: 'К какому поведению демона sshd приводит параметр MaxAuthTries 2?',
        options: [
          {
            id: 'A',
            text: 'После двух подряд неудачных попыток ввода пароля сессия немедленно и принудительно разрывается сервером',
          },
          {
            id: 'B',
            text: 'Разрешает пользователю не более 2 активных одновременных SSH-соединений',
          },
          {
            id: 'C',
            text: 'Блокирует системную учётную запись на 2 часа',
          },
          { id: 'D', text: 'Ограничивает количество попыток смены пароля' },
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
    title: 'Межофисный защищенный IP-туннель (GRE)',
    module_code: 'Модуль 1 (2027)',
    description:
      'Создание виртуального канала связи Point-to-Point по протоколу GRE (10.10.10.0/30) между маршрутизаторами HQ-RTR и BR-RTR через сеть провайдера ISP.',
    nodes: ['HQ-RTR', 'BR-RTR'],
    assignment: `### Задание 1.6: Межофисный защищенный IP-туннель (GRE)

В данном задании настраивается виртуальный защищённый канал связи типа «точка-точка» (Point-to-Point) между маршрутизаторами центрального офиса (**HQ-RTR**) и филиала (**BR-RTR**) через публичную сеть провайдера (**ISP**).

---

### 1. Теоретическая справка: протокол GRE и адресация

#### Что такое GRE?
GRE (Generic Routing Encapsulation) — протокол туннелирования, который упаковывает сетевые пакеты внутрь стандартных IP-пакетов. В задании разрешён выбор между GRE и IP-in-IP. Мы выбираем GRE, потому что:
• GRE поддерживает передачу **multicast-трафика** (групповой рассылки).
• Это обязательное требование для работы протокола динамической маршрутизации OSPF в следующем Задании №7.

#### Расчёт адресации туннеля (сеть /30):
Для туннелей типа «точка-точка» стандартом является минимально возможная маска \`/30\`:
• Подсеть: \`10.10.10.0/30\`
• Адрес сети: \`10.10.10.0\`
• Первый хост (**HQ-RTR**): \`10.10.10.1\`
• Второй хост (**BR-RTR**): \`10.10.10.2\`
• Широковещательный адрес (Broadcast): \`10.10.10.3\`

---

### 2. Разбор параметров файла options для etcnet

Каталог \`/etc/net/ifaces/gre1/\` подготовлен ещё на этапе Задания №1. Наполняем его конфигурацией:
• **TYPE=iptun** — указывает подсистеме etcnet, что данный интерфейс является виртуальным IP-туннелем.
• **TUNTYPE=gre** — задаёт протокол туннелирования (GRE).
• **TUNLOCAL** — внешний локальный IP-адрес текущего маршрутизатора (на интерфейсе \`ens18\`), смотрящий на провайдера ISP.
• **TUNREMOTE** — внешний IP-адрес удалённого маршрутизатора-партнёра на стороне второго офиса.
• **TUNTTL=64** / **TUNOPTIONS='ttl 64'** — ограничивает время жизни инкапсулирующего IP-заголовка, предотвращая бесконечное зацикливание пакетов.

---

### 3. Сводная таблица параметров туннеля gre1

| Маршрутизатор | Интерфейс | Внешний IP (TUNLOCAL) | Удалённый IP (TUNREMOTE) | Внутренний IP туннеля |
| :--- | :--- | :--- | :--- | :--- |
| **HQ-RTR** | \`gre1\` | \`172.16.1.2\` | \`172.16.2.2\` | \`10.10.10.1/30\` |
| **BR-RTR** | \`gre1\` | \`172.16.2.2\` | \`172.16.1.2\` | \`10.10.10.2/30\` |`,
    theory: [
      {
        title: 'Инкапсуляция GRE (Generic Routing Encapsulation)',
        explanation:
          'GRE оборачивает исходные IP-пакеты в служебный заголовок с протоколом IP 47. Поддержка широковещательного и мультикаст-трафика позволяет строить поверх туннеля протоколы динамической маршрутизации (OSPF, RIP, EIGRP).',
        details: [
          'Протокол транспортного уровня: IP Protocol 47.',
          'В отличие от IP-in-IP, поддерживает передачу multicast-пакетов OSPF (224.0.0.5, 224.0.0.6).',
          'Значение TTL=64 защищает сеть от закольцовывания туннелей.',
        ],
      },
      {
        title: 'Схема адресации Point-to-Point (/30)',
        explanation:
          'Маска /30 (255.255.255.252) выделяет блок из 4 IP-адресов: адрес сети, два адреса хостов для конечных точек линка и широковещательный адрес.',
        details: [
          '10.10.10.0/30 — адрес подсети.',
          '10.10.10.1 — локальный адрес HQ-RTR.',
          '10.10.10.2 — локальный адрес BR-RTR.',
          '10.10.10.3 — broadcast-адрес.',
        ],
      },
      {
        title: 'Управление iptun в ALT Linux etcnet',
        explanation:
          'В etcnet туннели описываются как самостоятельные интерфейсы с параметром TYPE=iptun и директивой TUNTYPE=gre.',
        details: [
          'Каталог /etc/net/ifaces/gre1/ содержит файлы options и ipv4address.',
          'Перезапуск сети: systemctl restart network.',
          'Диагностика состояния: ip -br -c a show gre1.',
        ],
      },
    ],
    steps: [
      {
        step_number: 1,
        node: 'BR-RTR',
        title: 'Шаг 1. Настройка туннеля gre1 на маршрутизаторе филиала (BR-RTR)',
        explanation:
          'Создайте файл options и ipv4address для интерфейса gre1 на BR-RTR и перезапустите сеть.',
        commands: `# 1. Задаем параметры туннеля gre1:
cat << 'EOF' > /etc/net/ifaces/gre1/options
TYPE=iptun
TUNTYPE=gre
TUNLOCAL=172.16.2.2
TUNREMOTE=172.16.1.2
TUNTTL=64
TUNOPTIONS='ttl 64'
EOF

# 2. Назначаем туннельный адрес 10.10.10.2:
echo "10.10.10.2/30" > /etc/net/ifaces/gre1/ipv4address

# 3. Перезапускаем сетевую службу:
systemctl restart network

# 4. Проверяем, что интерфейс gre1 появился и получил адрес:
ip -br -c a`,
      },
      {
        step_number: 2,
        node: 'HQ-RTR',
        title: 'Шаг 2. Настройка туннеля gre1 на маршрутизаторе центрального офиса (HQ-RTR)',
        explanation:
          'Создайте файл options и ipv4address для интерфейса gre1 на HQ-RTR и перезапустите сеть.',
        commands: `# 1. Задаем параметры туннеля gre1:
cat << 'EOF' > /etc/net/ifaces/gre1/options
TYPE=iptun
TUNTYPE=gre
TUNLOCAL=172.16.1.2
TUNREMOTE=172.16.2.2
TUNTTL=64
TUNOPTIONS='ttl 64'
EOF

# 2. Назначаем туннельный адрес 10.10.10.1:
echo "10.10.10.1/30" > /etc/net/ifaces/gre1/ipv4address

# 3. Перезапускаем сетевую службу:
systemctl restart network

# 4. Проверяем состояние интерфейсов:
ip -br -c a`,
      },
      {
        step_number: 3,
        node: 'HQ-RTR, BR-RTR',
        title: 'Шаг 3. Проверка работоспособности (Верификация ICMP Ping)',
        explanation:
          'Проверьте прохождение пакетов по туннелю gre1 с обоих маршрутизаторов.',
        commands: `# 1. Пинг с HQ-RTR в сторону филиала:
ping 10.10.10.2 -c 3
# Ожидаемый вывод: 3 packets transmitted, 3 received, 0% packet loss

# 2. Пинг с BR-RTR в сторону главного офиса:
ping 10.10.10.1 -c 3
# Ожидаемый вывод: 3 packets transmitted, 3 received, 0% packet loss`,
      },
    ],
    script_command: 'curl -sSL https://exam.sudostudy.dev/scripts/2027/m1_t6.sh | bash',
    questions: [
      {
        id: 'q1',
        text: 'Какое ключевое преимущество протокола GRE перед IP-in-IP является решающим для последующей настройки OSPF?',
        options: [
          {
            id: 'A',
            text: 'Поддержка инкапсуляции мультикаст-трафика (Multicast), необходимого для рассылки hello-пакетов OSPF',
          },
          {
            id: 'B',
            text: 'Встроенное асимметричное шифрование трафика открытым ключом RSA',
          },
          { id: 'C', text: 'Нулевой размер служебного оверхеда заголовка' },
          { id: 'D', text: 'Автоматическое присвоение IP-адресов хостам без конфигурации' },
        ],
        correct_answer: 'A',
      },
      {
        id: 'q2',
        text: 'Какая маска подсети является стандартом де-факто для виртуальных линков типа «точка-точка» (Point-to-Point) в IPv4?',
        options: [
          { id: 'A', text: '/30 (предоставляет 2 полезных IP-адреса для хостов)' },
          { id: 'B', text: '/28' },
          { id: 'C', text: '/24' },
          { id: 'D', text: '/32' },
        ],
        correct_answer: 'A',
      },
      {
        id: 'q3',
        text: 'Какое значение параметра TYPE необходимо указать в файле options etcnet для создания виртуального туннельного интерфейса?',
        options: [
          { id: 'A', text: 'TYPE=iptun' },
          { id: 'B', text: 'TYPE=gre' },
          { id: 'C', text: 'TYPE=tunnel' },
          { id: 'D', text: 'TYPE=virtual' },
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

