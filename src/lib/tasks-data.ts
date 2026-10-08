import { ModuleInfo, Task } from './types';

export const MODULES_LIST: ModuleInfo[] = [
  {
    id: 'module-1',
    code: 'Модуль 1',
    title: 'Сетевая инфраструктура',
    description: 'Базовая сетевая адресация, подсистема etcnet в ALT Linux, коммутация и VLAN, туннелирование GRE, динамическая маршрутизация OSPF (FRR), DHCP и DNS BIND.',
    total_tasks: 11,
    slug: 'module-1',
  },
  {
    id: 'module-2',
    code: 'Модуль 2',
    title: 'Службы и сервисы',
    description: 'Контроллер домена Samba Active Directory DC, ввод Linux-клиентов, программный RAID 0, сетевая ФС NFS, синхронизация Chrony, автоматизация Ansible, веб-стеки Docker и Apache+MariaDB, обратный прокси Nginx.',
    total_tasks: 11,
    slug: 'module-2',
  },
  {
    id: 'module-3',
    code: 'Модуль 3',
    title: 'Администрирование',
    description: 'Импорт учетных записей в домен, TLS/HTTPS с российскими криптографическими алгоритмами ГОСТ, межсетевой экран nftables, принт-сервер CUPS, централизованный сбор логов rsyslog, мониторинг и Fail2ban.',
    total_tasks: 10,
    slug: 'module-3',
  },
];

export const TASKS_DATA: Task[] = [
  // =========================================================================
  // MODULE 1 (11 TASKS)
  // =========================================================================
  {
    id: 'm1-task-1',
    slug: 'm1-task-1',
    module_id: 'module-1',
    task_number: 1,
    title: 'Базовая настройка сети и хостов',
    module_code: 'Модуль 1',
    description: 'Полное конфигурирование FQDN имён хостов, подсистемы etcnet в ALT Linux, статической IP-адресации RFC 1918 и сетевых маршрутов для всех узлов экзаменационного стенда (ISP, HQ-RTR, HQ-SRV, HQ-CLI, BR-RTR, BR-SRV).',
    nodes: ['ISP', 'HQ-RTR', 'HQ-SRV', 'HQ-CLI', 'BR-RTR', 'BR-SRV'],
    assignment: `1. Базовая настройка устройств и адресация

Имена устройств: Настроить FQDN (полное доменное имя) для всех узлов сети согласно топологии в зоне .au-team.irpo:
• isp.au-team.irpo
• hq-rtr.au-team.irpo
• hq-srv.au-team.irpo
• hq-cli.au-team.irpo
• br-rtr.au-team.irpo
• br-srv.au-team.irpo

Адресация IPv4: Использовать исключительно приватные диапазоны [RFC 1918](https://datatracker.ietf.org/doc/html/rfc1918).

Расчет емкости подсетей:
• VLAN 100 (HQ-SRV): не более 32 адресов → маска /27 (32 адреса, 30 хостов).
• VLAN 200 (HQ-CLI): не менее 16 адресов → маска /24 (256 адресов) или /28 (16 адресов).
• VLAN 999 (Управление): не более 8 адресов → маска /29 (8 адресов, 6 хостов).
• Сеть BR-SRV: не более 16 адресов → маска /28 (16 адресов, 14 хостов).
• Линки ISP: сеть 172.16.1.0/28 (HQ-RTR) и 172.16.2.0/28 (BR-RTR).

Таблица адресации: Сведения об адресах занести в итоговый отчет.`,
    theory: [],
    steps: [
      {
        step_number: 1,
        node: 'ISP, HQ-RTR, HQ-SRV, HQ-CLI, BR-RTR, BR-SRV',
        title: 'Шаг 1. Настройка FQDN имён хостов',
        explanation: 'Команда hostnamectl set-hostname навсегда прописывает имя хоста в системе (в файл /etc/hostname).\n\nКоманда exec bash через точку с запятой заменяет текущий процесс оболочки на новый, благодаря чему приглашение командной строки (prompt) обновляется мгновенно без необходимости перезагружать систему или заново подключаться по SSH.\n\nЗадача: Запустите соответствующую команду на каждой ноде.\nРешение: Выполняемые команды (ISP, HQ-RTR, HQ-SRV, HQ-CLI, BR-RTR, BR-SRV):',
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

# На узле BR-SRV:
hostnamectl set-hostname br-srv.au-team.irpo; exec bash`,
      },
      {
        step_number: 2,
        node: 'ISP',
        title: 'Шаг 2: Конфигурирование сетевых портов',
        explanation: 'Создаем каталоги etcnet, назначаем Ethernet-тип и прописываем адреса стыков к обоим маршрутизаторам.',
        commands: `# 1. Создаем каталоги настроек для enp7s2 и enp7s3:
mkdir -p /etc/net/ifaces/enp7s{2,3}

# 2. Указываем тип интерфейсов (TYPE=eth) в оба файла через tee:
echo 'TYPE=eth' | tee /etc/net/ifaces/enp7s{2,3}/options

# 3. Назначаем статические IP-адреса:
echo '172.16.1.1/28' > /etc/net/ifaces/enp7s2/ipv4address
echo '172.16.2.1/28' > /etc/net/ifaces/enp7s3/ipv4address

# 4. Перезапускаем сетевую службу etcnet и проверяем результат:
systemctl restart network
ip -c --br a`,
      },
      {
        step_number: 3,
        node: 'HQ-RTR',
        title: 'Шаг 3. Настройка внешнего порта на HQ-RTR (линк к ISP)',
        explanation: 'Порт enp7s1 соединяет HQ-RTR с ISP. Задаем IP 172.16.1.2/28, шлюз по умолчанию 172.16.1.1 и проверяем связность утилитой ping.',
        commands: `mkdir -p /etc/net/ifaces/enp7s1
echo 'TYPE=eth' > /etc/net/ifaces/enp7s1/options
echo '172.16.1.2/28' > /etc/net/ifaces/enp7s1/ipv4address
echo 'default via 172.16.1.1' > /etc/net/ifaces/enp7s1/ipv4route
echo 'nameserver 77.88.8.8' > /etc/net/ifaces/enp7s1/resolv.conf
systemctl restart network
ip -c --br a show enp7s1
ping -c 2 172.16.1.1`,
      },
      {
        step_number: 4,
        node: 'HQ-SRV',
        title: 'Шаг 4. Настройка сетевого интерфейса на сервере HQ-SRV',
        explanation: 'Сервер подключен к сети серверов VLAN 100. Задаем IP 192.168.100.2/27 и шлюз 192.168.100.1 (маршрутизатор HQ-RTR).',
        commands: `mkdir -p /etc/net/ifaces/enp7s1
echo 'TYPE=eth' > /etc/net/ifaces/enp7s1/options
echo '192.168.100.2/27' > /etc/net/ifaces/enp7s1/ipv4address
echo 'default via 192.168.100.1' > /etc/net/ifaces/enp7s1/ipv4route
echo 'nameserver 77.88.8.8' > /etc/net/ifaces/enp7s1/resolv.conf
systemctl restart network
ip -c --br a show enp7s1`,
      },
      {
        step_number: 5,
        node: 'BR-RTR',
        title: 'Шаг 5. Настройка портов на маршрутизаторе филиала BR-RTR',
        explanation: 'Настраиваем внешний интерфейс enp7s1 в сторону ISP (172.16.2.2/28, gw 172.16.2.1) и локальный порт enp7s2 (192.168.0.1/28).',
        commands: `mkdir -p /etc/net/ifaces/enp7s{1,2}
echo 'TYPE=eth' | tee /etc/net/ifaces/enp7s{1,2}/options
echo '172.16.2.2/28' > /etc/net/ifaces/enp7s1/ipv4address
echo 'default via 172.16.2.1' > /etc/net/ifaces/enp7s1/ipv4route
echo 'nameserver 77.88.8.8' > /etc/net/ifaces/enp7s1/resolv.conf
echo '192.168.0.1/28' > /etc/net/ifaces/enp7s2/ipv4address
systemctl restart network
ip -c --br a
ping -c 2 172.16.2.1`,
      },
      {
        step_number: 6,
        node: 'BR-SRV',
        title: 'Шаг 6. Настройка сетевого интерфейса на сервере филиала BR-SRV',
        explanation: 'Сервер филиала подключается к локальной сети BR (192.168.0.2/28) со шлюзом по умолчанию 192.168.0.1.',
        commands: `mkdir -p /etc/net/ifaces/enp7s1
echo 'TYPE=eth' > /etc/net/ifaces/enp7s1/options
echo '192.168.0.2/28' > /etc/net/ifaces/enp7s1/ipv4address
echo 'default via 192.168.0.1' > /etc/net/ifaces/enp7s1/ipv4route
echo 'nameserver 77.88.8.8' > /etc/net/ifaces/enp7s1/resolv.conf
systemctl restart network
ip -c --br a show enp7s1
ping -c 2 192.168.0.1`,
      },
    ],
    script_command: 'curl -sSL https://exam.sudostudy.dev/scripts/m1_t1.sh | bash',
    questions: [
      {
        id: 'q1',
        text: 'Где в ALT Linux хранятся конфигурационные файлы сетевых интерфейсов подсистемы etcnet?',
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
        text: 'Какие обязательные параметры должны быть указаны в файле options для корректной работы VLAN-интерфейса?',
        options: [
          { id: 'A', text: 'TYPE=vlan, HOST=<интерфейс>, VID=<номер_vlan>' },
          { id: 'B', text: 'TYPE=eth, VLAN=yes, ID=<номер_vlan>' },
          { id: 'C', text: 'MODE=vlan, PARENT=<интерфейс>, TAG=<номер_vlan>' },
          { id: 'D', text: 'TYPE=trunk, INTERFACE=<интерфейс>, VID=<номер_vlan>' },
        ],
        correct_answer: 'A',
      },
      {
        id: 'q3',
        text: 'Для чего после изменения имени хоста выполняется команда exec bash (например, hostnamectl set-hostname hq-rtr.au-team.irpo; exec bash)?',
        options: [
          { id: 'A', text: 'Для перезапуска сетевой службы network' },
          { id: 'B', text: 'Для сохранения имени хоста в файл /etc/hosts' },
          { id: 'C', text: 'Для заменяющего запуска нового процесса оболочки и немедленного обновления приглашения командной строки (prompt)' },
          { id: 'D', text: 'Для автоматической настройки DNS-суффикса в /etc/resolv.conf' },
        ],
        correct_answer: 'C',
      },
    ],
    max_score: 5,
    order_index: 1,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'm1-task-2',
    slug: 'm1-task-2',
    module_id: 'module-1',
    task_number: 2,
    title: 'Доступ к сети Интернет на ISP',
    module_code: 'Модуль 1',
    description: 'В данном задании настраивается интернет-провайдер (ISP). Его задача — принимать трафик из локальных сетей офисов (HQ и BR) и выпускать их в глобальную сеть через динамическую трансляцию адресов (NAT / Masquerade).',
    video_url: 'https://docker.sudostudy.dev/s/BTRAdw9Ewsczk7d',
    nodes: ['ISP'],
    assignment: `2. Доступ к сети Интернет на ISP

📺 Видео-разбор задания:
Видео-разбор выполнения задания доступен по ссылке: https://docker.sudostudy.dev/s/BTRAdw9Ewsczk7d

В данном задании настраивается интернет-провайдер (ISP). Его задача — принимать трафик из локальных сетей офисов (HQ и BR) и выпускать их в глобальную сеть через динамическую трансляцию адресов (NAT / Masquerade).

Место выполнения:
Все команды выполняются на виртуальной машине ISP (isp.au-team.irpo).

1. Теоретическая справка: что мы настраиваем и зачем?
• Зачем нужен ip_forward = 1?
По умолчанию ядро Linux настроено как обычный компьютер: если на его сетевую карту приходит пакет, адресованный не ему, ядро его просто отбрасывает. Включение директивы net.ipv4.ip_forward = 1 сообщает ядру: «Ты теперь маршрутизатор, пересылай транзитные пакеты между разными интерфейсами».

• Зачем нужен NAT Masquerade?
Сети наших офисов (172.16.1.0/28, 172.16.2.0/28, 192.168.x.x) относятся к приватным диапазонам [RFC 1918](https://datatracker.ietf.org/doc/html/rfc1918). В открытом Интернете эти адреса не маршрутизируются. Механизм Masquerade («Маскарад») подменяет обратный серый адрес пакета на реальный IP-адрес внешнего интерфейса enp7s1, полученный от магистрального провайдера. Когда из Интернета приходит ответ, ISP возвращает пакет обратно нужному офисному серверу.`,
    theory: [],
    steps: [
      {
        step_number: 1,
        node: 'ISP',
        title: 'Шаг 1. Включение маршрутизации пакетов в ядре',
        explanation: `Открываем конфигурационный файл сетевых параметров ядра:
vim /etc/net/sysctl.conf

Памятка по работе в Vim:
• Вход в режим редактирования: нажмите клавишу i.
• Выход в командный режим: нажмите Esc.
• Сохранить и выйти: введите :wq и нажмите Enter (или :q! для отмены и выхода без сохранения).

Находим данную строчку и меняем значение с 0 на 1:
net.ipv4.ip_forward = 1

Как сделать это одной командой без редактора:
echo "net.ipv4.ip_forward = 1" >> /etc/net/sysctl.conf

Перезапускаем сетевую подсистему, чтобы ALT Linux применил новые системные параметры:
systemctl restart network`,
        commands: `echo "net.ipv4.ip_forward = 1" >> /etc/net/sysctl.conf
systemctl restart network`,
      },
      {
        step_number: 2,
        node: 'ISP',
        title: 'Шаг 2. Установка и настройка межсетевого экрана nftables',
        explanation: `В ALT Linux современным стандартом управления правилами трансляции и фильтрации является nftables (пришёл на замену устаревшему iptables).

2.1. Установка пакетов
Обновляем кэш репозиториев и устанавливаем пакет nftables и текстовый редактор nano:
apt-get update && apt-get install nftables nano -y

2.2. Создание файла с правилами трансляции (NAT)
Создаём конфигурационный файл правил /etc/nftables/nftables.nft:
nano /etc/nftables/nftables.nft

Важно: Если в файле присутствует другая конфигурация, полностью её удалите.
Вставляем следующий текст:
#!/usr/sbin/nft -f
flush ruleset
table ip nat {
    chain postrouting {
        type nat hook postrouting priority srcnat;
        oifname "enp7s1" masquerade
    }
}

Разбор каждой строчки конфигурации:
• #!/usr/sbin/nft -f — шебанг, указывающий, что файл является исполняемым сценарием правил nftables.
• flush ruleset — сброс правил. Очищает текущую таблицу в оперативной памяти перед загрузкой, чтобы правила не задваивались при повторном запуске.
• table ip nat { ... } — объявляет таблицу для протокола IPv4 с именем nat.
• chain postrouting { ... } — цепочка пост-маршрутизации. Срабатывает в самый последний момент — когда маршрутизатор уже решил, через какой интерфейс вытолкнуть пакет наружу.
• type nat hook postrouting priority srcnat; — привязывает цепочку к стандартному хуку ядра для подмены адреса источника (srcnat).
• oifname "enp7s1" masquerade — ключевое правило: для всего трафика, уходящего через внешний интерфейс enp7s1 (Outbound Interface Name), включить динамическую маскировку (подмену IP на адрес интерфейса).

2.3. Запуск и добавление в автозагрузку
Чтобы правила не слетели после перезагрузки машины на экзамене, настраиваем автозапуск службы:
systemctl enable --now nftables

Принудительно очищаем текущие правила и загружаем наш файл:
nft flush ruleset
nft -f /etc/nftables/nftables.nft

Что делает nft -f?
Ключ -f (file) компилирует и мгновенно загружает набор правил из указанного текстового файла прямо в ядро Linux.`,
        commands: `apt-get update && apt-get install nftables nano -y
cat << 'EOF' > /etc/nftables/nftables.nft
#!/usr/sbin/nft -f
flush ruleset
table ip nat {
    chain postrouting {
        type nat hook postrouting priority srcnat;
        oifname "enp7s1" masquerade
    }
}
EOF
systemctl enable --now nftables
nft flush ruleset
nft -f /etc/nftables/nftables.nft`,
      },
      {
        step_number: 3,
        node: 'ISP',
        title: 'Шаг 3. Проверка работоспособности (Верификация)',
        explanation: `На демонстрационном экзамене обязательно убедитесь, что всё применилось:

1. Проверяем статус правил в ядре:
nft list ruleset
Что должны увидеть: консоль выведет блок table ip nat ровно с теми строками, которые мы внесли в файл. Если вывод пустой — файл не применился через nft -f.

2. Проверяем статус пересылки пакетов:
sysctl net.ipv4.ip_forward
Что должны увидеть:
net.ipv4.ip_forward = 1

3. Проверяем доступность внешнего Интернета:
ping -c4 ya.ru
Что должны увидеть: успешные ответы (4 packets transmitted, 4 received, 0% packet loss). Это подтверждает, что интерфейс enp7s1 получил IP по DHCP и DNS-резолвинг работает штатно.`,
        commands: `nft list ruleset
sysctl net.ipv4.ip_forward
ping -c 4 ya.ru`,
      },
    ],
    script_command: 'curl -sSL https://exam.sudostudy.dev/scripts/m1_t2.sh | bash',
    questions: [
      {
        id: 'q1',
        text: 'Почему при настройке NAT для доступа в Интернет используется хук postrouting, а не prerouting в цепочке nftables?',
        options: [
          { id: 'A', text: 'Потому что prerouting работает только для входящего трафика, а postrouting — для транзитного трафика IPv6' },
          { id: 'B', text: 'Потому что подмена IP-адреса источника (SNAT / Masquerade) должна происходить после того, как маршрутизатор принял решение о выборе выходного интерфейса' },
          { id: 'C', text: 'Потому что хук postrouting автоматически включает пересылку пакетов в ядре (ip_forward = 1)' },
          { id: 'D', text: 'Порядок применения не имеет значения, эти хуки взаимозаменяемы' },
        ],
        correct_answer: 'B',
      },
      {
        id: 'q2',
        text: 'Какая команда в nftables позволяет принудительно сбросить текущие правила в оперативной памяти и сразу загрузить конфигурацию из файла /etc/nftables/nftables.nft?',
        options: [
          { id: 'A', text: 'systemctl reload etcnet' },
          { id: 'B', text: 'nft flush ruleset && nft -f /etc/nftables/nftables.nft' },
          { id: 'C', text: 'iptables-restore < /etc/nftables/nftables.nft' },
          { id: 'D', text: 'nftables --import /etc/nftables/nftables.nft' },
        ],
        correct_answer: 'B',
      },
      {
        id: 'q3',
        text: 'Каково назначение ключевого правила oifname "enp7s1" masquerade в конфигурации nftables?',
        options: [
          { id: 'A', text: 'Блокировать весь исходящий трафик с интерфейса enp7s1, не относящийся к локальной сети' },
          { id: 'B', text: 'Перенаправлять входящий порт 80 с интерфейса enp7s1 на внутренний сервер' },
          { id: 'C', text: 'Динамически подменять частные (RFC 1918) IP-адреса источника на публичный IP-адрес внешнего интерфейса enp7s1 для пакетов, уходящих в Интернет' },
          { id: 'D', text: 'Назначать интерфейсу enp7s1 статический IP-адрес по протоколу DHCP' },
        ],
        correct_answer: 'C',
      },
    ],
    max_score: 5,
    order_index: 2,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'm1-task-3',
    slug: 'm1-task-3',
    module_id: 'module-1',
    task_number: 3,
    title: 'Локальные учётные записи и sudo',
    module_code: 'Модуль 1',
    description: 'В данном задании настраиваются системные административные пользователи на серверах и маршрутизаторах с правом выполнения команд суперпользователя (sudo) без ввода пароля.',
    video_url: 'https://docker.sudostudy.dev/s/BTRAdw9Ewsczk7d',
    nodes: ['HQ-SRV', 'BR-SRV', 'HQ-RTR', 'BR-RTR'],
    assignment: `3. Локальные учётные записи и sudo

📺 Видео-разбор задания:
Видео-разбор выполнения задания доступен по ссылке: https://docker.sudostudy.dev/s/BTRAdw9Ewsczk7d

В данном задании настраиваются системные административные пользователи на серверах и маршрутизаторах с правом выполнения команд суперпользователя (sudo) без ввода пароля.

1. Теоретическая справка: как работает безопасность в ALT Linux
• 1. Что такое UID (-u 2026)?
В Linux операционная система различает пользователей не по их текстовым логинам, а по уникальным числовым идентификаторам — UID (User Identifier). По заданию требуется назначить конкретный UID 2026. Параметр -u принудительно задаёт этот номер при создании пользователя.

• 2. Зачем нужна утилита chpasswd?
Команда passwd в консоли требует интерактивного ввода и повторного подтверждения пароля. Конструкция echo "user:pass" | chpasswd позволяет задать пароль в одну строчку без лишних диалогов, что критически экономит время на экзамене.

• 3. Что такое группа wheel?
В дистрибутивах семейства ALT Linux (как и в RHEL/CentOS) исторически используется системная группа wheel. Члены этой группы наделяются правом повышать свои привилегии до root. Флаг -aG в usermod расшифровывается как:
-a (append) — добавить в группу, не удаляя пользователя из остальных его групп;
-G (supplementary Group) — указать дополнительную группу.

• 4. Почему каталог /etc/sudoers.d/, а не файл /etc/sudoers?
Вместо небезопасного прямого редактирования основного файла /etc/sudoers принято создавать отдельные файлы в каталоге /etc/sudoers.d/. Директива WHEEL_USERS ALL=(ALL:ALL) NOPASSWD: ALL означает:
WHEEL_USERS — все участники группы wheel;
ALL=(ALL:ALL) — на всех хостах, от имени любого пользователя и любой группы;
NOPASSWD: ALL — запуск любых команд через sudo без запроса пароля.`,
    theory: [
      {
        title: 'Что такое UID (-u 2026)?',
        explanation: 'В Linux операционная система различает пользователей не по их текстовым логинам, а по уникальным числовым идентификаторам — UID (User Identifier). По заданию требуется назначить конкретный UID 2026. Параметр -u принудительно задаёт этот номер при создании пользователя.',
      },
      {
        title: 'Зачем нужна утилита chpasswd?',
        explanation: 'Команда passwd в консоли требует интерактивного ввода и повторного подтверждения пароля. Конструкция echo "user:pass" | chpasswd позволяет задать пароль в одну строчку без лишних диалогов, что критически экономит время на экзамене.',
      },
      {
        title: 'Что такое группа wheel и флаги -aG?',
        explanation: 'В дистрибутивах семейства ALT Linux системная группа wheel наделяется правом повышать привилегии до root. Флаг -a (append) добавляет в группу без удаления из остальных, а -G указывает дополнительную группу.',
      },
      {
        title: 'Архитектура /etc/sudoers.d/ и директива WHEEL_USERS',
        explanation: 'Вместо прямого редактирования /etc/sudoers создаются файлы в /etc/sudoers.d/. Директива WHEEL_USERS ALL=(ALL:ALL) NOPASSWD: ALL разрешает всем участникам группы wheel запуск любых команд от имени любого пользователя без запроса пароля.',
      },
    ],
    steps: [
      {
        step_number: 1,
        node: 'HQ-SRV, BR-SRV',
        title: 'Шаг 1. Настройка серверов HQ-SRV и BR-SRV',
        explanation: `На обоих серверах создаётся пользователь sshuser с идентификатором 2026 и беспарольным sudo.
Команды идентичны для обоих серверов. Выполните приведённый блок сначала на HQ-SRV, а затем на BR-SRV.

1. Создаем пользователя sshuser с явным указанием UID 2026:
useradd -u 2026 sshuser

2. Назначаем пароль P@ssw0rd в неинтерактивном режиме:
echo "sshuser:P@ssw0rd" | chpasswd

3. Добавляем пользователя в административную группу wheel:
usermod -aG wheel sshuser

4. Разрешаем группе wheel выполнять любые команды через sudo без ввода пароля:
echo "WHEEL_USERS ALL=(ALL:ALL) NOPASSWD: ALL" > /etc/sudoers.d/sshuser

5. Проверяем работу: входим под пользователем sshuser:
su -l sshuser

6. Проверяем статус суперпользователя:
sudo id

7. Возвращаемся обратно под учетную запись root:
exit

Что делает su -l sshuser?
Параметр -l (или просто дефис -) запускает полноценную login-оболочку: переходит в домашний каталог пользователя (/home/sshuser) и подгружает его переменные окружения.`,
        commands: `# 1. Создаем пользователя sshuser с явным указанием UID 2026:
useradd -u 2026 sshuser
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
        explanation: `На маршрутизаторах создаётся пользователь net_admin.
Важно для маршрутизаторов: На сетевых/маршрутизаторных сборках ALT Linux утилита sudo часто отсутствует по умолчанию. Поэтому перед настройкой прав обязательно устанавливаем пакет sudo.
Команды идентичны для обоих маршрутизаторов. Выполните приведённый блок сначала на HQ-RTR, а затем на BR-RTR.

1. Создаем пользователя net_admin:
useradd net_admin

2. Назначаем пароль P@ssw0rd:
echo "net_admin:P@ssw0rd" | chpasswd

3. Добавляем пользователя в группу wheel:
usermod -aG wheel net_admin

4. Обновляем репозитории и устанавливаем пакет sudo:
apt-get update && apt-get install sudo -y

5. Разрешаем беспарольный sudo для администраторов:
echo "WHEEL_USERS ALL=(ALL:ALL) NOPASSWD: ALL" > /etc/sudoers.d/net_admin

6. Проверяем вход под созданным пользователем:
su -l net_admin

7. Проверяем привилегии:
sudo id

8. Выходим обратно в сессию root:
exit`,
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
        explanation: `При выполнении команды sudo id под учётными записями sshuser и net_admin:
• Система НЕ должна запрашивать ввод пароля.
• В консоли должен отобразиться идентификатор суперпользователя root: uid=0(root) gid=0(root) groups=0(root)...

Проверить UID созданного пользователя можно командой id <имя>:
• На серверах: id sshuser должен вернуть uid=2026(sshuser).
• На маршрутизаторах: id net_admin должен вернуть наличие группы wheel(10).`,
        commands: `# Проверка на серверах (HQ-SRV, BR-SRV):
id sshuser
su -l sshuser -c "sudo id"

# Проверка на маршрутизаторах (HQ-RTR, BR-RTR):
id net_admin
su -l net_admin -c "sudo id"`,
      },
    ],
    script_command: 'curl -sSL https://exam.sudostudy.dev/scripts/m1_t3.sh | bash',
    questions: [
      {
        id: 'q1',
        text: 'Зачем при создании пользователя sshuser на серверах указывается параметр -u 2026 (useradd -u 2026 sshuser)?',
        options: [
          { id: 'A', text: 'Для назначения пользователю порта подключения SSH 2026' },
          { id: 'B', text: 'Для явного задания числового идентификатора пользователя (UID), требуемого спецификацией' },
          { id: 'C', text: 'Для автоматической генерации 2026-битного пароля' },
          { id: 'D', text: 'Для ограничения срока действия пароля 2026 днями' },
        ],
        correct_answer: 'B',
      },
      {
        id: 'q2',
        text: 'Какое действие выполняет директива WHEEL_USERS ALL=(ALL:ALL) NOPASSWD: ALL в файле /etc/sudoers.d/?',
        options: [
          { id: 'A', text: 'Запрещает выполнение sudo всем участникам группы wheel' },
          { id: 'B', text: 'Разрешает всем участникам группы wheel запуск любых команд от имени суперпользователя без запроса пароля' },
          { id: 'C', text: 'Включает авторизацию по SSH без пароля для всех пользователей' },
          { id: 'D', text: 'Сбрасывает пароль суперпользователя root' },
        ],
        correct_answer: 'B',
      },
      {
        id: 'q3',
        text: 'Почему перед настройкой прав пользователя net_admin на маршрутизаторах HQ-RTR и BR-RTR выполняется apt-get install sudo -y?',
        options: [
          { id: 'A', text: 'На сетевых и маршрутизаторных сборках ALT Linux утилита sudo часто отсутствует в базовом образе' },
          { id: 'B', text: 'Без sudo невозможно выполнить команду chpasswd' },
          { id: 'C', text: 'Для добавления пользователя в группу wheel обязателен пакет sudo' },
          { id: 'D', text: 'Это требование демона маршрутизации FRR' },
        ],
        correct_answer: 'A',
      },
    ],
    max_score: 5,
    order_index: 3,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
    {
    "id": "m1-task-4",
    "slug": "m1-task-4",
    "module_id": "module-1",
    "task_number": 4,
    "title": "Коммутация и сегментация VLAN в сегменте HQ",
    "module_code": "Модуль 1",
    "description": "Изоляция сетевого трафика главного офиса (HQ) на уровне гипервизора Proxmox VE: режим Access для серверов и клиентов (VLAN 100 и 200) и режим Trunk Router-on-a-Stick для HQ-RTR.",
    "assignment": "В данном задании настраивается изоляция сетевого трафика главного офиса (HQ) на уровне гипервизора Proxmox VE.\nЗадача — изолировать трафик сервера (VLAN 100) и клиентской машины (VLAN 200), а также обеспечить маршрутизацию между ними через единственный сетевой адаптер маршрутизатора HQ-RTR (Router-on-a-Stick).\n\n1. Как это работает: Access vs Trunk в Proxmox VE\nВ Proxmox VE виртуальные машины подключаются к виртуальным коммутаторам — мостам Linux Bridge (vmbr0, vmbr1 и т.д.).\n• Режим Access (Конечные устройства — HQ-SRV и HQ-CLI):\nМы указываем номер VLAN прямо в окне настроек сетевого адаптера виртуальной машины.\nСам гипервизор Proxmox автоматически навешивает тег 802.1Q на исходящие пакеты и снимает его с входящих.\nВнутри операционной системы ALT Linux сетевой интерфейс остаётся самым обычным (enp7s1), гостевая ОС ничего о тегах не знает.\n• Режим Trunk (Маршрутизатор — HQ-RTR):\nМаршрутизатор должен принимать сразу все тегированные пакеты (VLAN 100, 200 и 999), чтобы пересылать их между подсетями.\nПоэтому в свойствах сетевого адаптера на Proxmox поле «Тег VLAN» оставляется пустым.\nТрафик поступает «как есть» внутрь ОС маршрутизатора, где его разбирают саб-интерфейсы vlan100, vlan200, vlan999.\n\nШаг 1. Настройка VLAN через веб-интерфейс Proxmox VE\nОткройте веб-интерфейс Proxmox VE в браузере и авторизуйтесь.\n\n1.1. Настройка сервера HQ-SRV (VLAN 100)\n1. В левом дереве ресурсов найдите и выберите виртуальную машину HQ-SRV.\n2. В среднем меню перейдите на вкладку «Оборудование» (Hardware).\n3. В списке устройств найдите строку «Сетевое устройство (net0)» (Network Device (net0)).\n4. Нажмите кнопку «Изменить» (Edit) в верхней панели управления (или дважды кликните по строке адаптера).\n5. В открывшемся окне найдите поле «Тег VLAN» (VLAN Tag) и введите значение: 100\n6. Нажмите кнопку «ОК». В списке оборудования появится параметр tag=100.\n\n1.2. Настройка рабочей станции HQ-CLI (VLAN 200)\n1. В левом дереве ресурсов выберите виртуальную машину HQ-CLI.\n2. Перейдите во вкладку «Оборудование» (Hardware).\n3. Дважды кликните по строке «Сетевое устройство (net0)» (Network Device (net0)).\n4. В поле «Тег VLAN» (VLAN Tag) укажите значение: 200\n5. Нажмите кнопку «ОК». Убедитесь, что у адаптера отображается tag=200.\n\n1.3. Настройка маршрутизатора HQ-RTR (Trunk-порт)\n1. В левом дереве ресурсов выберите виртуальную машину HQ-RTR.\n2. Перейдите во вкладку «Оборудование» (Hardware).\n3. Найдите сетевой адаптер, смотрящий во внутреннюю сеть офиса — «Сетевое устройство (net1)» (внутри системы это порт enp7s2).\n4. Нажмите «Изменить» (Edit).\n5. Поле «Тег VLAN» (VLAN Tag) ОБЯЗАТЕЛЬНО ОСТАВЬТЕ ПУСТЫМ (без тега).\n6. Нажмите кнопку «ОК».\n\nПочему на HQ-RTR поле VLAN оставляется пустым?\nЕсли указать тег, Proxmox отфильтрует остальные сети. Пустое поле превращает виртуальный порт в Trunk: гипервизор пропускает фреймы всех тегов (100, 200, 999) внутрь виртуальной машины, где ими управляет подсистема etcnet.\n\nШаг 2. Сведения о коммутации (для внесения в отчёт)\n• HQ-SRV: интерфейс enp7s1 | адаптер net0 | Режим: Access | VLAN: 100 | Назначение: Серверный сегмент HQ\n• HQ-CLI: интерфейс enp7s1 | адаптер net0 | Режим: Access | VLAN: 200 | Назначение: Клиентский сегмент HQ\n• HQ-RTR: интерфейс enp7s2 | адаптер net1 | Режим: Trunk (802.1Q) | VLAN: 100, 200, 999 | Назначение: Агрегированный линк Router-on-a-Stick\n• Управление: интерфейс — | адаптер — | Режим: Access | VLAN: 999 | Назначение: Сегмент управления (Management)\n\nШаг 3. Проверка работоспособности (Верификация)\n1. Проверка связи HQ-SRV со своим шлюзом (VLAN 100):\nОткройте консоль сервера HQ-SRV и отправьте пинг на адрес виртуального интерфейса маршрутизатора:\nping -c3 192.168.100.1\nЕсли пинг проходит успешно: Proxmox корректно тегирует пакеты меткой 100, а саб-интерфейс vlan100 на HQ-RTR их успешно принимает.\n\n2. Проверка маршрутизации между разными VLAN:\nС того же сервера HQ-SRV отправьте пинг в соседний клиентский VLAN:\nping -c3 192.168.200.1\nУспешный ответ подтверждает, что маршрутизатор HQ-RTR принимает тегированный трафик, распаковывает его и пересылает между виртуальными сетями через один физический порт.",
    "nodes": [
      "HQ-SRV",
      "HQ-CLI",
      "HQ-RTR"
    ],
    "theory": [
      {
        "title": "Access vs Trunk в гипервизоре Proxmox VE",
        "explanation": "В режиме Access гипервизор Proxmox автоматически навешивает 802.1Q тег на исходящие пакеты и снимает на входящих — гостевая ОС работает с нетегированным трафиком. В режиме Trunk поле VLAN Tag оставляется пустым, и все кадры с тегами передаются напрямую в гостевую ОС Router-on-a-Stick."
      }
    ],
    "steps": [
      {
        "step_number": 1,
        "node": "Proxmox VE (GUI)",
        "title": "Настройка VLAN Tag в свойствах адаптеров виртуальных машин",
        "explanation": "В веб-интерфейсе Proxmox VE выполните настройки сетевых устройств:\n1. HQ-SRV: вкладка «Оборудование» -> net0 -> «Изменить» -> VLAN Tag = 100 -> ОК.\n2. HQ-CLI: вкладка «Оборудование» -> net0 -> «Изменить» -> VLAN Tag = 200 -> ОК.\n3. HQ-RTR: вкладка «Оборудование» -> net1 (enp7s2) -> «Изменить» -> VLAN Tag оставить ПУСТЫМ (Trunk) -> ОК.",
        "commands": "# Настройка выполняется через веб-интерфейс Proxmox VE:\n# HQ-SRV  -> net0 -> VLAN Tag = 100\n# HQ-CLI  -> net0 -> VLAN Tag = 200\n# HQ-RTR  -> net1 -> VLAN Tag = (пусто, режим Trunk)"
      },
      {
        "step_number": 2,
        "node": "HQ-SRV",
        "title": "Проверка доступности шлюза и межсегментной маршрутизации",
        "explanation": "С сервера HQ-SRV проверяем:\n1. Связь со своим шлюзом (VLAN 100): ping -c3 192.168.100.1\n2. Маршрутизацию между VLAN в сторону клиентского сегмента: ping -c3 192.168.200.1",
        "commands": "# 1. Проверка доступности шлюза VLAN 100:\nping -c3 192.168.100.1\n\n# 2. Проверка межсегментной маршрутизации в сторону VLAN 200:\nping -c3 192.168.200.1"
      }
    ],
    "script_command": "curl -sSL https://exam.sudostudy.dev/scripts/m1_t4.sh | bash",
    "questions": [
      {
        "id": "q1",
        "text": "Почему на адаптере net1 маршрутизатора HQ-RTR поле VLAN Tag оставляется пустым?",
        "placeholder": "Чтобы порт работал в режиме Trunk и пропускал кадры всех VLAN (100, 200, 999)"
      },
      {
        "id": "q2",
        "text": "Какой режим порта используется для конечных устройств HQ-SRV и HQ-CLI?",
        "placeholder": "Access"
      }
    ],
    "max_score": 5,
    "order_index": 4,
    "is_active": true,
    "created_at": "2026-10-08T06:57:07.862Z",
    "updated_at": "2026-10-08T06:57:07.863Z"
  },
  {
    "id": "m1-task-5",
    "slug": "m1-task-5",
    "module_id": "module-1",
    "task_number": 5,
    "title": "Безопасный удаленный доступ (SSH)",
    "module_code": "Модуль 1",
    "description": "Настройка защиты службы OpenSSH на серверах HQ-SRV и BR-SRV: нестандартный порт 2026, белый список пользователей AllowUsers sshuser, MaxAuthTries 2 и предупреждающий баннер авторизации.",
    "assignment": "В данном задании настраивается защита службы удалённого администрирования OpenSSH на серверах HQ-SRV и BR-SRV.\n\n1. Теоретическая справка: безопасность OpenSSH в ALT Linux\nОсобенность ALT Linux:\nВ дистрибутивах ALT Linux конфигурационные файлы демона SSH расположены в каталоге /etc/openssh/ (файл /etc/openssh/sshd_config), в отличие от Debian/Ubuntu, где используется /etc/ssh/.\n\nРазбор директив конфигурации sshd_config:\n• Port 2026 — смена стандартного порта (по умолчанию 22) на нестандартный. Защищает сервис от фонового сканирования ботами в сети.\n• AllowUsers sshuser — строгий белый список пользователей. Доступ разрешён только пользователю sshuser. Попытка входа под root или другими локальными пользователями будет отклонена ещё до проверки пароля.\n• MaxAuthTries 2 — максимальное количество попыток ввода неверного пароля в рамках одной сессии. Если пароль введён неверно 2 раза подряд, SSH-сервер принудительно разрывает соединение (защита от брутфорса).\n• Banner /etc/openssh/ssh_banner — путь к текстовому файлу, содержимое которого отображается клиенту до ввода пароля при подключении.\n\nШаг 1. Настройка сервера главного офиса (HQ-SRV)\nВыполните настройку под пользователем root на машине HQ-SRV:\n# 1. Открываем конфигурационный файл демона SSH: vim /etc/openssh/sshd_config\nВнесите директивы:\nPort 2026\nAllowUsers sshuser\nMaxAuthTries 2\nBanner /etc/openssh/ssh_banner\n\nКак добавить директивы в конец файла без редактора:\ncat << 'EOF' >> /etc/openssh/sshd_config\nPort 2026\nAllowUsers sshuser\nMaxAuthTries 2\nBanner /etc/openssh/ssh_banner\nEOF\n\nДалее создаём файл баннера с требуемым текстом и перезапускаем службу:\n# 2. Создаем файл баннера с текстом предупреждения:\necho \"Authorized access only\" | tee /etc/openssh/ssh_banner\n# 3. Перезапускаем демон OpenSSH для применения параметров:\nsystemctl restart sshd\n\nШаг 2. Настройка сервера филиала (BR-SRV)\nНа сервере BR-SRV выполняются абсолютно аналогичные действия:\ncat << 'EOF' >> /etc/openssh/sshd_config\nPort 2026\nAllowUsers sshuser\nMaxAuthTries 2\nBanner /etc/openssh/ssh_banner\nEOF\necho \"Authorized access only\" | tee /etc/openssh/ssh_banner\nsystemctl restart sshd\n\nШаг 3. Проверка работоспособности (Верификация)\nДля проверки подключаемся с соседних маршрутизаторов, указав порт подключения через ключ -p:\n1. Проверка HQ-SRV с маршрутизатора HQ-RTR:\nssh -p 2026 sshuser@192.168.100.2\nЧто должно произойти:\nНа экране отобразится строка баннера: Authorized access only\nПоявится запрос пароля (sshuser@192.168.100.2's password:).\nВведите пароль P@ssw0rd — сессия успешно откроется.\nВыйдите из сессии командой: exit\n\n2. Проверка BR-SRV с маршрутизатора BR-RTR:\nssh -p 2026 sshuser@192.168.0.2\nОтображается предупреждение Authorized access only.\nПосле ввода пароля P@ssw0rd вход выполняется успешно. Выйдите: exit\n\n3. Проверка критериев безопасности (Негативные тесты):\nПодключение без указания порта:\nssh sshuser@192.168.100.2 -> Ошибка Connection refused (порт 22 закрыт).\nПопытка входа под root:\nssh -p 2026 root@192.168.100.2 -> Отказ в доступе (Permission denied).",
    "nodes": [
      "HQ-SRV",
      "BR-SRV",
      "HQ-RTR",
      "BR-RTR"
    ],
    "theory": [
      {
        "title": "Конфигурация OpenSSH в ALT Linux (/etc/openssh/sshd_config)",
        "explanation": "В ALT Linux служба sshd конфигурируется в /etc/openssh/sshd_config. Использование директив Port 2026, AllowUsers sshuser, MaxAuthTries 2 и Banner обеспечивает комплексное укрепление безопасности сервера."
      }
    ],
    "steps": [
      {
        "step_number": 1,
        "node": "HQ-SRV",
        "title": "Настройка защищённого демона SSH на HQ-SRV",
        "explanation": "Добавляем директивы Port 2026, AllowUsers sshuser, MaxAuthTries 2 и Banner в /etc/openssh/sshd_config, создаем файл баннера и перезапускаем демон sshd.",
        "commands": "# 1. Добавляем параметры безопасности в sshd_config:\ncat << 'EOF' >> /etc/openssh/sshd_config\nPort 2026\nAllowUsers sshuser\nMaxAuthTries 2\nBanner /etc/openssh/ssh_banner\nEOF\n\n# 2. Создаем файл баннера:\necho \"Authorized access only\" | tee /etc/openssh/ssh_banner\n\n# 3. Перезапускаем службу OpenSSH:\nsystemctl restart sshd"
      },
      {
        "step_number": 2,
        "node": "BR-SRV",
        "title": "Настройка защищённого демона SSH на BR-SRV",
        "explanation": "Аналогичная настройка конфигурации OpenSSH на сервере филиала BR-SRV.",
        "commands": "# 1. Добавляем параметры в sshd_config:\ncat << 'EOF' >> /etc/openssh/sshd_config\nPort 2026\nAllowUsers sshuser\nMaxAuthTries 2\nBanner /etc/openssh/ssh_banner\nEOF\n\n# 2. Создаем файл баннера:\necho \"Authorized access only\" | tee /etc/openssh/ssh_banner\n\n# 3. Перезапускаем службу OpenSSH:\nsystemctl restart sshd"
      },
      {
        "step_number": 3,
        "node": "HQ-RTR, BR-RTR",
        "title": "Верификация подключения и негативные тесты безопасности",
        "explanation": "Проверяем вход с маршрутизаторов по порту 2026 и тестируем отказ при попытке подключения на порт 22 и под пользователем root.",
        "commands": "# 1. Проверка входа с HQ-RTR на HQ-SRV (пароль P@ssw0rd):\nssh -p 2026 sshuser@192.168.100.2\n\n# 2. Проверка входа с BR-RTR на BR-SRV (пароль P@ssw0rd):\nssh -p 2026 sshuser@192.168.0.2\n\n# 3. Негативный тест: порт 22 по умолчанию должен быть закрыт (Connection refused):\nssh sshuser@192.168.100.2\n\n# 4. Негативный тест: вход под root должен быть заблокирован (Permission denied):\nssh -p 2026 root@192.168.100.2"
      }
    ],
    "script_command": "curl -sSL https://exam.sudostudy.dev/scripts/m1_t5.sh | bash",
    "questions": [
      {
        "id": "q1",
        "text": "В каком каталоге располагается sshd_config в дистрибутивах ALT Linux?",
        "placeholder": "/etc/openssh/"
      },
      {
        "id": "q2",
        "text": "Какая директива sshd_config ограничивает количество попыток ввода неверного пароля?",
        "placeholder": "MaxAuthTries 2"
      }
    ],
    "max_score": 5,
    "order_index": 5,
    "is_active": true,
    "created_at": "2026-10-08T06:57:07.863Z",
    "updated_at": "2026-10-08T06:57:07.863Z"
  },
  {
    "id": "m1-task-6",
    "slug": "m1-task-6",
    "module_id": "module-1",
    "task_number": 6,
    "title": "Межофисный защищенный IP-туннель (GRE)",
    "module_code": "Модуль 1",
    "description": "Настройка виртуального защищённого канала связи «точка-точка» (GRE) между пограничными маршрутизаторами HQ-RTR (10.10.10.1/30) и BR-RTR (10.10.10.2/30) через публичную сеть ISP.",
    "assignment": "В данном задании настраивается виртуальный защищённый канал связи типа «точка-точка» (Point-to-Point) между маршрутизаторами центрального офиса (HQ-RTR) и филиала (BR-RTR) через публичную сеть провайдера (ISP).\n\n1. Теоретическая справка: протокол GRE и адресация\nЧто такое GRE?\nGRE (Generic Routing Encapsulation) — протокол туннелирования, который упаковывает сетевые пакеты внутрь стандартных IP-пакетов. В задании разрешён выбор между GRE и IP-in-IP. Мы выбираем GRE, потому что:\n• GRE поддерживает передачу multicast-трафика (групповой рассылки).\n• Это обязательное требование для работы протокола динамической маршрутизации OSPF в следующем задании №7.\n\nРасчёт адресации туннеля (сеть /30):\nДля туннелей типа «точка-точка» стандартом является маска /30:\n• Подсеть: 10.10.10.0/30\n• Адрес сети: 10.10.10.0\n• Первый хост (HQ-RTR): 10.10.10.1\n• Второй хост (BR-RTR): 10.10.10.2\n• Широковещательный адрес (Broadcast): 10.10.10.3\n\n2. Разбор параметров файла options для etcnet\nКаталог /etc/net/ifaces/gre1/ мы подготовили ещё на этапе Задания №1. Теперь наполняем его конфигурацией:\n• TYPE=iptun — указывает подсистеме etcnet, что данный интерфейс является виртуальным IP-туннелем.\n• TUNTYPE=gre — задаёт протокол туннелирования (GRE).\n• TUNLOCAL — внешний локальный IP-адрес текущего маршрутизатора (на интерфейсе enp7s1), смотрящий на провайдера ISP.\n• TUNREMOTE — внешний IP-адрес удалённого маршрутизатора-партнёра на стороне второго офиса.\n• TUNTTL=64 / TUNOPTIONS='ttl 64' — ограничивает время жизни инкапсулирующего заголовка, предотвращая бесконечное зацикливание пакетов.\n\nШаг 1. Настройка маршрутизатора филиала (BR-RTR)\nВыполните команды под root на машине BR-RTR:\ncat << 'EOF' > /etc/net/ifaces/gre1/options\nTYPE=iptun\nTUNTYPE=gre\nTUNLOCAL=172.16.2.2\nTUNREMOTE=172.16.1.2\nTUNTTL=64\nTUNOPTIONS='ttl 64'\nEOF\n\nНазначаем туннельный адрес 10.10.10.2 и перезапускаем сеть:\necho \"10.10.10.2/30\" > /etc/net/ifaces/gre1/ipv4address\nsystemctl restart network\nip -br -c a\n\nШаг 2. Настройка маршрутизатора главного офиса (HQ-RTR)\nВыполните команды под root на машине HQ-RTR:\ncat << 'EOF' > /etc/net/ifaces/gre1/options\nTYPE=iptun\nTUNTYPE=gre\nTUNLOCAL=172.16.1.2\nTUNREMOTE=172.16.2.2\nTUNTTL=64\nTUNOPTIONS='ttl 64'\nEOF\n\nНазначаем первый адрес подсети 10.10.10.1 и перезапускаем сеть:\necho \"10.10.10.1/30\" > /etc/net/ifaces/gre1/ipv4address\nsystemctl restart network\nip -br -c a\n\nШаг 3. Проверка работоспособности (Верификация)\nГлавный критерий корректности туннеля — взаимная доступность его внутренних адресов через пинг.\n1. Пинг с HQ-RTR в сторону филиала:\nping 10.10.10.2 -c 3\n(Ожидаемый вывод: 3 packets transmitted, 3 received, 0% packet loss)\n\n2. Пинг с BR-RTR в сторону главного офиса:\nping 10.10.10.1 -c 3\n\nЧто делать, если пинг туннеля не идёт?\n• Проверьте связь внешних адресов: с HQ-RTR отправьте ping 172.16.2.2. Если недоступен — проверьте шлюз и маршрутизатор ISP.\n• Проверьте правильность TUNLOCAL и TUNREMOTE: они должны быть зеркальны!",
    "nodes": [
      "HQ-RTR",
      "BR-RTR"
    ],
    "theory": [
      {
        "title": "Инкапсуляция GRE и конфигурация iptun в etcnet",
        "explanation": "GRE оборачивает пакеты в IP-протокол 47 с поддержкой Multicast (необходим для OSPF). В etcnet настраиваются параметры TYPE=iptun, TUNTYPE=gre, а также локальный и удаленный публичные IP-адреса."
      }
    ],
    "steps": [
      {
        "step_number": 1,
        "node": "BR-RTR",
        "title": "Настройка параметров туннеля gre1 на маршрутизаторе BR-RTR",
        "explanation": "Вносим параметры связи в /etc/net/ifaces/gre1/options (TUNLOCAL=172.16.2.2, TUNREMOTE=172.16.1.2), назначаем адрес 10.10.10.2/30 и перезапускаем службу network.",
        "commands": "# 1. Конфигурируем параметры GRE-туннеля:\ncat << 'EOF' > /etc/net/ifaces/gre1/options\nTYPE=iptun\nTUNTYPE=gre\nTUNLOCAL=172.16.2.2\nTUNREMOTE=172.16.1.2\nTUNTTL=64\nTUNOPTIONS='ttl 64'\nEOF\n\n# 2. Назначаем туннельный IPv4-адрес:\necho \"10.10.10.2/30\" > /etc/net/ifaces/gre1/ipv4address\n\n# 3. Перезапускаем сеть и проверяем интерфейс:\nsystemctl restart network\nip -br -c a"
      },
      {
        "step_number": 2,
        "node": "HQ-RTR",
        "title": "Настройка параметров туннеля gre1 на маршрутизаторе HQ-RTR",
        "explanation": "Вносим зеркальные параметры туннеля (TUNLOCAL=172.16.1.2, TUNREMOTE=172.16.2.2), назначаем адрес 10.10.10.1/30 и перезапускаем сеть.",
        "commands": "# 1. Задаем параметры туннеля:\ncat << 'EOF' > /etc/net/ifaces/gre1/options\nTYPE=iptun\nTUNTYPE=gre\nTUNLOCAL=172.16.1.2\nTUNREMOTE=172.16.2.2\nTUNTTL=64\nTUNOPTIONS='ttl 64'\nEOF\n\n# 2. Назначаем IPv4-адрес первого хоста:\necho \"10.10.10.1/30\" > /etc/net/ifaces/gre1/ipv4address\n\n# 3. Перезапускаем сеть и проверяем gre1:\nsystemctl restart network\nip -br -c a"
      },
      {
        "step_number": 3,
        "node": "HQ-RTR, BR-RTR",
        "title": "Верификация взаимной доступности туннеля через ICMP",
        "explanation": "Проверяем двустороннюю доступность внутренних IP-адресов туннеля 10.10.10.1 и 10.10.10.2.",
        "commands": "# 1. С HQ-RTR проверяем доступность адреса филиала:\nping 10.10.10.2 -c 3\n\n# 2. С BR-RTR проверяем доступность центрального офиса:\nping 10.10.10.1 -c 3"
      }
    ],
    "script_command": "curl -sSL https://exam.sudostudy.dev/scripts/m1_t6.sh | bash",
    "questions": [
      {
        "id": "q1",
        "text": "Какое главное преимущество протокола GRE перед IP-in-IP для динамической маршрутизации?",
        "placeholder": "Поддержка передачи Multicast-трафика, необходимого для OSPF"
      },
      {
        "id": "q2",
        "text": "Какое значение параметра TYPE необходимо указать в файле options подсистемы etcnet для туннеля?",
        "placeholder": "TYPE=iptun"
      }
    ],
    "max_score": 5,
    "order_index": 6,
    "is_active": true,
    "created_at": "2026-10-08T06:57:07.863Z",
    "updated_at": "2026-10-08T06:57:07.863Z"
  },
  {
    "id": "m1-task-7",
    "slug": "m1-task-7",
    "video_url": "https://docker.sudostudy.dev/s/BTRAdw9Ewsczk7d",
    "module_id": "module-1",
    "task_number": 7,
    "title": "Динамическая маршрутизация Link-State (OSPF в FRR)",
    "module_code": "Модуль 1",
    "description": "Настройка автоматического обмена маршрутами между офисами HQ и BR по протоколу OSPF в пакете FRRouting: изоляция Hello-пакетов только в туннеле gre1, пассивные интерфейсы и аутентификация паролем P@ssw0rd.",
    "assignment": "В данном задании настраивается автоматический обмен маршрутами между офисами HQ и BR с использованием протокола OSPF (Open Shortest Path First) на базе пакета FRRouting (FRR).\n\n1. Теоретическая справка: архитектура FRR и требования задания\n1. Что такое FRR и файл daemons?\nFRR (Free Range Routing) — это современный программный комплекс маршрутизации в Linux, использующий синтаксис команд, аналогичный Cisco IOS. FRR модульный: по умолчанию запущен только менеджер ядра zebra. Для работы OSPF необходимо включить отдельный демон ospfd в конфигурационном файле /etc/frr/daemons.\n\n2. Как выполнить требование: «Разрешите протокол только на интерфейсах туннеля»?\nВ OSPF есть концепция пассивных интерфейсов:\n• Директива passive-interface default в секции router ospf переводит абсолютно все интерфейсы в пассивный режим: через них не отправляются и не принимаются служебные пакеты OSPF Hello (злоумышленник в клиентском VLAN 200 не сможет прикинуться роутером).\n• Команда no ip ospf passive на интерфейсе gre1 явно делает исключение только для туннеля: маршрутизаторы будут искать соседа и строить отношения смежности (Adjacency) исключительно через зашифрованный канал.\n\n3. Зачем прописывать ip ospf area 0 на локальных интерфейсах?\nЧтобы маршрутизатор рассказал удалённому офису о существовании своих локальных сетей (VLAN 100, VLAN 200, VLAN 999 в HQ и enp7s2 в филиале), эти интерфейсы должны быть включены в зону area 0.\n\n4. Парольная защита:\nДиректива ip ospf authentication включает проверку подлинности, а ip ospf authentication-key P@ssw0rd задаёт общий секретный ключ, без которого маршрутизаторы откажутся обмениваться маршрутной информацией.\n\nШаг 1. Настройка маршрутизатора главного офиса (HQ-RTR)\nВыполните команды под root на HQ-RTR:\n# 1. Устанавливаем пакет FRR:\napt-get update && apt-get install frr -y\n\n# 2. Включаем демон ospfd в файле daemons:\nsed -i 's/ospfd=no/ospfd=yes/' /etc/frr/daemons ; grep ospf /etc/frr/daemons\n\n# 3. Конфигурируем /etc/frr/frr.conf:\ncat << 'EOF' > /etc/frr/frr.conf\ninterface gre\n no ip ospf passive\nexit\n!\ninterface gre1\n ip ospf area 0\n ip ospf authentication\n ip ospf authentication-key P@ssw0rd\n no ip ospf passive\nexit\n!\ninterface vlan100\n ip ospf area 0\nexit\n!\ninterface vlan200\n ip ospf area 0\nexit\n!\ninterface vlan999\n ip ospf area 0\nexit\n!\nrouter ospf\n passive-interface default\nexit\nEOF\n\n# 4. Включаем автозапуск и стартуем FRR, перезапускаем сеть:\nsystemctl enable --now frr\nsystemctl restart network\n\nШаг 2. Настройка маршрутизатора филиала (BR-RTR)\nВыполните команды под root на BR-RTR:\n# 1. Устанавливаем пакет FRR:\napt-get update && apt-get install frr -y\n\n# 2. Активируем демон ospfd:\nsed -i 's/ospfd=no/ospfd=yes/' /etc/frr/daemons ; grep ospf /etc/frr/daemons\n\n# 3. Конфигурируем /etc/frr/frr.conf (анонсируем интерфейс филиала enp7s2):\ncat << 'EOF' > /etc/frr/frr.conf\ninterface gre\n no ip ospf passive\nexit\n!\ninterface gre1\n ip ospf area 0\n ip ospf authentication\n ip ospf authentication-key P@ssw0rd\n no ip ospf passive\nexit\n!\ninterface enp7s2\n ip ospf area 0\nexit\n!\nrouter ospf\n passive-interface default\nexit\nEOF\n\n# 4. Запуск FRR и перезапуск сети:\nsystemctl enable --now frr\nsystemctl restart network\n\nШаг 3. Проверка работоспособности (Верификация)\nУтилите FRR требуется около 10–20 секунд после запуска на обмен пакетами Hello и построение топологии.\n1. Проверка OSPF-соседства (Neighbor):\nvtysh -c \"show ip ospf neighbor\"\n(В выводе должна отображаться запись с интерфейсом gre1 и статусом Full/...)\n\n2. Проверка появления динамических маршрутов в ядре:\nip r\n• На HQ-RTR должен появиться маршрут: 192.168.0.0/28 via 10.10.10.2 dev gre1 proto ospf\n• На BR-RTR должны появиться маршруты ко всем сетям HQ (192.168.100.0/27, 192.168.200.0/24, 192.168.99.0/29) через 10.10.10.1 dev gre1 proto ospf.\n\n3. Сквозной пинг между серверами (HQ-SRV ↔ BR-SRV):\nС сервера HQ-SRV отправьте пинг на сервер филиала:\nping -c3 192.168.0.2\n(Пакеты успешно передаются через зашифрованный туннель благодаря OSPF).",
    "nodes": [
      "HQ-RTR",
      "BR-RTR",
      "HQ-SRV"
    ],
    "theory": [
      {
        "title": "Управление FRRouting и параметры OSPFv2",
        "explanation": "FRR управляется через /etc/frr/daemons (активация ospfd=yes) и файл /etc/frr/frr.conf. Директива passive-interface default блокирует отправку Hello-пакетов на всех интерфейсах, а no ip ospf passive явно открывает обмен только по gre1. Локальные интерфейсы подключаются к area 0 для генерации LSA."
      }
    ],
    "steps": [
      {
        "step_number": 1,
        "node": "HQ-RTR",
        "title": "Установка FRR и настройка OSPF на HQ-RTR",
        "explanation": "Устанавливаем frr, включаем ospfd=yes в /etc/frr/daemons, создаем frr.conf с пассивными локальными интерфейсами и OSPF через gre1 с аутентификацией.",
        "commands": "# 1. Устанавливаем FRR:\napt-get update && apt-get install frr -y\n\n# 2. Активируем ospfd:\nsed -i 's/ospfd=no/ospfd=yes/' /etc/frr/daemons ; grep ospf /etc/frr/daemons\n\n# 3. Конфигурируем OSPF процесс и интерфейсы:\ncat << 'EOF' > /etc/frr/frr.conf\ninterface gre\n no ip ospf passive\nexit\n!\ninterface gre1\n ip ospf area 0\n ip ospf authentication\n ip ospf authentication-key P@ssw0rd\n no ip ospf passive\nexit\n!\ninterface vlan100\n ip ospf area 0\nexit\n!\ninterface vlan200\n ip ospf area 0\nexit\n!\ninterface vlan999\n ip ospf area 0\nexit\n!\nrouter ospf\n passive-interface default\nexit\nEOF\n\n# 4. Запускаем службу FRR и перезапускаем сеть:\nsystemctl enable --now frr\nsystemctl restart network"
      },
      {
        "step_number": 2,
        "node": "BR-RTR",
        "title": "Установка FRR и настройка OSPF на BR-RTR",
        "explanation": "Устанавливаем frr на маршрутизаторе филиала BR-RTR, включаем ospfd и конфигурируем OSPF с анонсом сети enp7s2.",
        "commands": "# 1. Устанавливаем FRR:\napt-get update && apt-get install frr -y\n\n# 2. Включаем демон ospfd:\nsed -i 's/ospfd=no/ospfd=yes/' /etc/frr/daemons ; grep ospf /etc/frr/daemons\n\n# 3. Конфигурируем OSPF:\ncat << 'EOF' > /etc/frr/frr.conf\ninterface gre\n no ip ospf passive\nexit\n!\ninterface gre1\n ip ospf area 0\n ip ospf authentication\n ip ospf authentication-key P@ssw0rd\n no ip ospf passive\nexit\n!\ninterface enp7s2\n ip ospf area 0\nexit\n!\nrouter ospf\n passive-interface default\nexit\nEOF\n\n# 4. Стартуем FRR и перезапускаем сеть:\nsystemctl enable --now frr\nsystemctl restart network"
      },
      {
        "step_number": 3,
        "node": "HQ-RTR, BR-RTR, HQ-SRV",
        "title": "Верификация OSPF-соседства, маршрутов и сквозной связности",
        "explanation": "Проверяем соседство в vtysh, наличие OSPF-маршрутов в таблице ядра ip r и отправляем сквозной пинг с HQ-SRV на BR-SRV.",
        "commands": "# 1. Проверка соседства OSPF (статус Full):\nvtysh -c \"show ip ospf neighbor\"\n\n# 2. Проверка динамических маршрутов в ядре:\nip r\n\n# 3. Сквозной пинг между серверами (с HQ-SRV на 192.168.0.2):\nping -c3 192.168.0.2"
      }
    ],
    "script_command": "curl -sSL https://exam.sudostudy.dev/scripts/m1_t7.sh | bash",
    "questions": [
      {
        "id": "q1",
        "text": "Какая директива FRR переводит все интерфейсы в пассивный режим по умолчанию?",
        "placeholder": "passive-interface default"
      },
      {
        "id": "q2",
        "text": "Какое состояние соседа в show ip ospf neighbor свидетельствует об успешной синхронизации баз LSDB?",
        "placeholder": "Full"
      }
    ],
    "max_score": 5,
    "order_index": 7,
    "is_active": true,
    "created_at": "2026-10-08T06:57:07.863Z",
    "updated_at": "2026-10-08T06:57:07.863Z"
  },
  {
    "id": "m1-task-8",
    "slug": "m1-task-8",
    "video_url": "https://docker.sudostudy.dev/s/BTRAdw9Ewsczk7d",
    "module_id": "module-1",
    "task_number": 8,
    "title": "Динамическая трансляция адресов (NAT) на филиалах",
    "module_code": "Модуль 1",
    "description": "Настройка двухуровневой трансляции адресов Source NAT (Masquerade) в nftables на офисных маршрутизаторах HQ-RTR и BR-RTR для прямого выхода в сеть Интернет через провайдера ISP.",
    "assignment": "В данном задании настраивается механизм динамической трансляции сетевых адресов (Source NAT / Masquerade) на пограничных маршрутизаторах HQ-RTR и BR-RTR.\nБлагодаря этому все внутренние устройства главного офиса (серверы VLAN 100, клиенты VLAN 200) и филиала (192.168.0.0/28) получают полноценный доступ к глобальной сети Интернет через провайдера ISP.\n\nМесто выполнения:\nКоманды данного задания выполняются одинаково на обоих маршрутизаторах: HQ-RTR и BR-RTR.\n\n1. Теоретическая справка: зачем нужен NAT на офисных маршрутизаторах?\nВ Задании №2 мы настроили NAT на провайдере ISP. Однако провайдер знает только о напрямую подключённых к нему сетях стыка: 172.16.1.0/28 и 172.16.2.0/28.\nО внутренних подсетях офисов (192.168.100.0/27, 192.168.200.0/24, 192.168.0.0/28) провайдер ISP ничего не знает, так как OSPF настроен только между офисами внутри туннеля.\n\nСхема движения пакета:\n[HQ-SRV / HQ-CLI] -> [HQ-RTR (NAT Masquerade enp7s1)] -> [ISP (NAT Masquerade)] -> [ИНТЕРНЕТ]\n192.168.100.2     -> 172.16.1.2                       -> ya.ru\n\nКогда пакет из внутренней сети офиса уходит в Интернет:\n1. Маршрутизатор HQ-RTR (или BR-RTR) подменяет исходный IP-адрес на свой внешний адрес enp7s1 (172.16.1.2 или 172.16.2.2).\n2. Провайдер ISP принимает этот пакет, маскирует его своим публичным адресом и отправляет в Интернет.\n3. Ответ возвращается по цепочке обратно на конечный компьютер или сервер.\n\nРазбор правила nftables:\n• oifname \"enp7s1\" — отслеживает пакеты, уходящие через сетевой адаптер enp7s1 в сторону провайдера ISP.\n• masquerade — подменяет приватный адрес клиента/сервера (192.168.x.x) на IP-адрес порта enp7s1.\nОбратите внимание: трафик в сторону филиала через интерфейс туннеля gre1 под это правило не подпадает, поэтому межофисная связь остаётся прозрачной и прямой!\n\nШаг 1. Настройка маршрутизатора главного офиса (HQ-RTR)\n# 1. Устанавливаем пакеты межсетевого экрана nftables и редактор nano:\napt-get install nftables nano -y\n\n# 2. Создаем файл правил /etc/nftables/nftables.nft:\ncat << 'EOF' > /etc/nftables/nftables.nft\n#!/usr/sbin/nft -f\nflush ruleset\ntable ip nat {\n    chain postrouting {\n        type nat hook postrouting priority srcnat;\n        oifname \"enp7s1\" masquerade\n    }\n}\nEOF\n\n# 3. Включаем службу nftables в автозапуск и перезапускаем:\nsystemctl enable --now nftables\nsystemctl restart nftables.service\n\nШаг 2. Настройка маршрутизатора филиала (BR-RTR)\nНа маршрутизаторе BR-RTR выполняются абсолютно аналогичные действия:\napt-get install nftables nano -y\ncat << 'EOF' > /etc/nftables/nftables.nft\n#!/usr/sbin/nft -f\nflush ruleset\ntable ip nat {\n    chain postrouting {\n        type nat hook postrouting priority srcnat;\n        oifname \"enp7s1\" masquerade\n    }\n}\nEOF\nsystemctl enable --now nftables\nsystemctl restart nftables.service\n\nШаг 3. Проверка работоспособности (Верификация)\nГлавный критерий выполнения задания — появление доступа в глобальный Интернет на внутренних серверах, которые находятся за маршрутизаторами.\n1. Проверка правил nftables на маршрутизаторах:\nnft list ruleset\n(Должна отобразиться цепочка postrouting с правилом oifname \"enp7s1\" masquerade).\n\n2. Проверка выхода в Интернет с сервера HQ-SRV:\nping -c4 ya.ru (или ping -c4 77.88.8.8)\nОжидаемый результат: 0% packet loss.\n\n3. Проверка выхода в Интернет с сервера филиала BR-SRV:\nping -c4 77.88.8.8",
    "nodes": [
      "HQ-RTR",
      "BR-RTR",
      "HQ-SRV",
      "BR-SRV"
    ],
    "theory": [
      {
        "title": "Механизм Source NAT (Masquerade) в nftables",
        "explanation": "Таблица ip nat с цепочкой postrouting hook postrouting priority srcnat и действием masquerade подменяет адреса исходящих пакетов. Ограничение по oifname \"enp7s1\" сохраняет прямой трафик через туннель gre1."
      }
    ],
    "steps": [
      {
        "step_number": 1,
        "node": "HQ-RTR",
        "title": "Установка и настройка NAT в nftables на HQ-RTR",
        "explanation": "Устанавливаем nftables, записываем конфигурацию маскировки пакетов для выходного порта enp7s1 и запускаем службу.",
        "commands": "# 1. Устанавливаем nftables:\napt-get install nftables nano -y\n\n# 2. Конфигурируем правила NAT:\ncat << 'EOF' > /etc/nftables/nftables.nft\n#!/usr/sbin/nft -f\nflush ruleset\ntable ip nat {\n    chain postrouting {\n        type nat hook postrouting priority srcnat;\n        oifname \"enp7s1\" masquerade\n    }\n}\nEOF\n\n# 3. Включаем автозапуск и перезапускаем службу:\nsystemctl enable --now nftables\nsystemctl restart nftables.service"
      },
      {
        "step_number": 2,
        "node": "BR-RTR",
        "title": "Установка и настройка NAT в nftables на BR-RTR",
        "explanation": "Устанавливаем nftables на маршрутизаторе BR-RTR и применяем аналогичное правило маскировки для интерфейса enp7s1.",
        "commands": "# 1. Устанавливаем nftables:\napt-get install nftables nano -y\n\n# 2. Создаем файл конфигурации:\ncat << 'EOF' > /etc/nftables/nftables.nft\n#!/usr/sbin/nft -f\nflush ruleset\ntable ip nat {\n    chain postrouting {\n        type nat hook postrouting priority srcnat;\n        oifname \"enp7s1\" masquerade\n    }\n}\nEOF\n\n# 3. Включаем автозапуск и применяем правила:\nsystemctl enable --now nftables\nsystemctl restart nftables.service"
      },
      {
        "step_number": 3,
        "node": "HQ-RTR, BR-RTR, HQ-SRV, BR-SRV",
        "title": "Верификация правил nftables и проверка выхода в Интернет",
        "explanation": "Проверяем правила на маршрутизаторах через nft list ruleset и тестируем пинг в Интернет с серверов HQ-SRV и BR-SRV.",
        "commands": "# 1. Просмотр активных правил трансляции на маршрутизаторах:\nnft list ruleset\n\n# 2. Проверка выхода в Интернет с HQ-SRV (Яндекс DNS):\nping -c4 77.88.8.8\n\n# 3. Проверка выхода в Интернет с BR-SRV:\nping -c4 77.88.8.8"
      }
    ],
    "script_command": "curl -sSL https://exam.sudostudy.dev/scripts/m1_t8.sh | bash",
    "questions": [
      {
        "id": "q1",
        "text": "Почему трафик межофисного туннеля gre1 не маскируется правилом nftables?",
        "placeholder": "Действие masquerade ограничено условием oifname \"enp7s1\""
      },
      {
        "id": "q2",
        "text": "Какой хук и приоритет используются в nftables для цепочки Source NAT?",
        "placeholder": "hook postrouting priority srcnat"
      }
    ],
    "max_score": 5,
    "order_index": 8,
    "is_active": true,
    "created_at": "2026-10-08T06:57:07.863Z",
    "updated_at": "2026-10-08T06:57:07.863Z"
  },
  {
    "id": "m1-task-9",
    "slug": "m1-task-9",
    "video_url": "https://docker.sudostudy.dev/s/BTRAdw9Ewsczk7d",
    "module_id": "module-1",
    "task_number": 9,
    "title": "Настройка DHCP-сервера для клиентов (HQ-CLI)",
    "module_code": "Модуль 1",
    "description": "Настройка автоматической выдачи сетевых настроек клиентам VLAN 200 на базе сервиса dnsmasq на маршрутизаторе HQ-RTR (отключение DNS через port=0, выдача шлюза 192.168.200.1 и DNS 192.168.100.2).",
    "assignment": "В данном задании настраивается автоматическая выдача сетевых настроек для клиентских рабочих станций главного офиса (HQ-CLI в сегменте VLAN 200) с помощью легковесного сервиса dnsmasq, развёрнутого на маршрутизаторе HQ-RTR.\n\nМесто выполнения:\nВсе основные настройки выполняются на маршрутизаторе HQ-RTR (hq-rtr.au-team.irpo).\n\n1. Теоретическая справка: особенности dnsmasq в ALT Linux\n1. Почему port=0?\nПакет dnsmasq умеет работать одновременно и как DNS-кэш, и как DHCP-сервер. В нашем задании за корпоративный DNS будет отвечать полноценный сервер BIND на машине HQ-SRV. Директива port=0 полностью отключает модуль DNS, оставляя работать исключительно чистый DHCP-сервер.\n\n2. Зачем нужен AUTO_LOCAL_RESOLVER=no?\nВ дистрибутивах ALT Linux служба dnsmasq по умолчанию пытается перехватить управление файлом /etc/resolv.conf, прописывая туда 127.0.0.1. Директива AUTO_LOCAL_RESOLVER=no в файле /etc/sysconfig/dnsmasq запрещает службе вмешиваться в системные настройки DNS.\n\n3. Стандартные номера опций DHCP (RFC 2132):\n• Опция 3 (dhcp-option=3,...) — адрес маршрутизатора по умолчанию (Router / Default Gateway).\n• Опция 6 (dhcp-option=6,...) — адрес сервера доменных имён (Domain Name Server).\n\nШаг 1. Установка dnsmasq и переключение DNS на HQ-RTR\nМаршрутизатор HQ-RTR переводится с внешнего DNS на внутренний корпоративный сервер главного офиса HQ-SRV (192.168.100.2):\n# 1. Устанавливаем пакет dnsmasq:\napt-get install dnsmasq -y\n# 2. Удаляем старый внешний резолвер с внешнего порта enp7s1:\nrm -f /etc/net/ifaces/enp7s1/resolv.conf\n# 3. Назначаем корпоративный DNS (HQ-SRV) и суффикс au-team.irpo на внутренний интерфейс vlan100:\necho $'search au-team.irpo\\nnameserver 192.168.100.2' > /etc/net/ifaces/vlan100/resolv.conf\n\nШаг 2. Настройка конфигурации DHCP-сервера\nОтключаем авто-резолвер в системном конфигурационном файле:\nsed -i 's/AUTO_LOCAL_RESOLVER=yes/AUTO_LOCAL_RESOLVER=no/' /etc/sysconfig/dnsmasq ; grep AUTO_LOCAL_RESOLVER /etc/sysconfig/dnsmasq\n\nСоздаем конфигурационный файл /etc/dnsmasq.conf:\ncat << 'EOF' > /etc/dnsmasq.conf\nport=0\ninterface=vlan200\nlisten-address=192.168.200.1\ndhcp-authoritative\ndhcp-range=interface:vlan200,192.168.200.2,192.168.200.2,255.255.255.240,6h\ndhcp-option=3,192.168.200.1\ndhcp-option=6,192.168.100.2\nleasefile-ro\nEOF\n\nРазбор параметров конфигурации:\n• port=0 — выключает встроенный DNS-сервер.\n• interface=vlan200 — принимать DHCP-запросы только из клиентской сети VLAN 200.\n• listen-address=192.168.200.1 — IP-адрес шлюза на интерфейсе vlan200.\n• dhcp-authoritative — указывает, что данный сервер является единственным и авторитетным в сегменте.\n• dhcp-range=... — пул выдачи адресов, маска подсети и время аренды (6h = 6 часов).\n• dhcp-option=3,192.168.200.1 — выдавать клиентам адрес шлюза HQ-RTR.\n• dhcp-option=6,192.168.100.2 — выдавать клиентам корпоративный DNS-сервер HQ-SRV.\n• leasefile-ro — предотвращает ошибки записи базы аренды.\n\nШаг 3. Запуск службы и обновление сети\nsystemctl enable --now dnsmasq ; ss -lun | grep 67\nsystemctl restart network\ncat /etc/resolv.conf\n\nШаг 4. Проверка работоспособности (Верификация)\n1. Проверка прослушивания порта DHCP на HQ-RTR:\nss -lun | grep 67 (порт 67/udp в состоянии UNCONN на 192.168.200.1:67).\n2. Проверка системного DNS на HQ-RTR:\ncat /etc/resolv.conf (search au-team.irpo, nameserver 192.168.100.2).\n3. Проверка получения адреса клиентом HQ-CLI:\nНа машине HQ-CLI (в Proxmox сетевой адаптер должен иметь VLAN Tag: 200):\nsystemctl restart network\nip -c --br a (клиент получает IP 192.168.200.2 и шлюз 192.168.200.1).",
    "nodes": [
      "HQ-RTR",
      "HQ-CLI"
    ],
    "theory": [
      {
        "title": "dnsmasq в роли DHCP-сервера и RFC 2132",
        "explanation": "Опция port=0 отключает DNS-резолвер в dnsmasq. Опция AUTO_LOCAL_RESOLVER=no сохраняет системный resolv.conf. Опция 3 передает клиентам маршрутизатор по умолчанию, а опция 6 — IP-адрес DNS-сервера."
      }
    ],
    "steps": [
      {
        "step_number": 1,
        "node": "HQ-RTR",
        "title": "Установка dnsmasq и переключение DNS на HQ-SRV",
        "explanation": "Устанавливаем dnsmasq, удаляем старый резолвер с внешнего порта enp7s1 и направляем запросы на корпоративный DNS HQ-SRV (192.168.100.2) через vlan100.",
        "commands": "# 1. Устанавливаем dnsmasq:\napt-get install dnsmasq -y\n\n# 2. Удаляем старый внешний резолвер с enp7s1:\nrm -f /etc/net/ifaces/enp7s1/resolv.conf\n\n# 3. Назначаем корпоративный DNS HQ-SRV на интерфейс vlan100:\necho $'search au-team.irpo\nnameserver 192.168.100.2' > /etc/net/ifaces/vlan100/resolv.conf"
      },
      {
        "step_number": 2,
        "node": "HQ-RTR",
        "title": "Настройка конфигурации DHCP-сервера (/etc/dnsmasq.conf)",
        "explanation": "Отключаем локальный резолвер в /etc/sysconfig/dnsmasq и создаем конфигурацию для обслуживания клиентов VLAN 200.",
        "commands": "# 1. Отключаем подмену локального DNS:\nsed -i 's/AUTO_LOCAL_RESOLVER=yes/AUTO_LOCAL_RESOLVER=no/' /etc/sysconfig/dnsmasq ; grep AUTO_LOCAL_RESOLVER /etc/sysconfig/dnsmasq\n\n# 2. Записываем конфигурацию dnsmasq:\ncat << 'EOF' > /etc/dnsmasq.conf\nport=0\ninterface=vlan200\nlisten-address=192.168.200.1\ndhcp-authoritative\ndhcp-range=interface:vlan200,192.168.200.2,192.168.200.2,255.255.255.240,6h\ndhcp-option=3,192.168.200.1\ndhcp-option=6,192.168.100.2\nleasefile-ro\nEOF"
      },
      {
        "step_number": 3,
        "node": "HQ-RTR",
        "title": "Запуск службы dnsmasq и обновление сети",
        "explanation": "Включаем автозапуск, стартуем службу dnsmasq, проверяем порт 67/udp и перезапускаем сеть для применения обновленного resolv.conf.",
        "commands": "# 1. Запускаем службу dnsmasq и проверяем UDP-порт 67:\nsystemctl enable --now dnsmasq ; ss -lun | grep 67\n\n# 2. Перезапускаем сеть:\nsystemctl restart network\n\n# 3. Проверяем системный DNS:\ncat /etc/resolv.conf"
      },
      {
        "step_number": 4,
        "node": "HQ-CLI",
        "title": "Проверка получения сетевых настроек клиентом HQ-CLI",
        "explanation": "На клиентской машине HQ-CLI перезапускаем сеть и проверяем получение IP 192.168.200.2 и шлюза по умолчанию.",
        "commands": "# Перезапускаем сеть для запроса аренды по DHCP:\nsystemctl restart network\n\n# Проверяем назначенный IP-адрес:\nip -c --br a"
      }
    ],
    "script_command": "curl -sSL https://exam.sudostudy.dev/scripts/m1_t9.sh | bash",
    "questions": [
      {
        "id": "q1",
        "text": "Зачем в конфигурации dnsmasq.conf указывается опция port=0?",
        "placeholder": "Полностью отключает встроенный DNS-сервер"
      },
      {
        "id": "q2",
        "text": "Какая опция DHCP (RFC 2132) отвечает за передачу адреса шлюза по умолчанию?",
        "placeholder": "dhcp-option=3"
      }
    ],
    "max_score": 5,
    "order_index": 9,
    "is_active": true,
    "created_at": "2026-10-08T06:57:07.863Z",
    "updated_at": "2026-10-08T06:57:07.863Z"
  },
  {
    "id": "m1-task-10",
    "slug": "m1-task-10",
    "video_url": "https://docker.sudostudy.dev/s/BTRAdw9Ewsczk7d",
    "module_id": "module-1",
    "task_number": 10,
    "title": "Инфраструктура службы доменных имён (DNS BIND)",
    "module_code": "Модуль 1",
    "description": "Развёртывание корпоративного DNS-сервера BIND 9 (named) на HQ-SRV: авторитетная прямая зона au-team.irpo, обратная зона 168.192.in-addr.arpa и серверы пересылки forwarders (Яндекс DNS).",
    "assignment": "В данном задании на сервере главного офиса (HQ-SRV) развёртывается корпоративный DNS-сервер BIND 9 (named).\nСервер обеспечивает сопоставление доменных имён в IP-адреса (прямая зона) и IP-адресов в доменные имена (обратная зона PTR) для зоны .au-team.irpo, а также перенаправляет внешние запросы в Интернет через серверы пересылки (Forwarders).\n\nМесто выполнения:\nВсе действия выполняются под пользователем root на сервере HQ-SRV (hq-srv.au-team.irpo).\n\n1. Внимание: порядок действий и потеря Интернета\nОсторожно: не меняйте DNS до установки пакетов!\nЕсли вы переключите DNS в файле resolv.conf на 127.0.0.1 до того, как установите пакеты и запустите службу BIND, на сервере полностью пропадёт доступ в Интернет по доменным именам. В результате команда apt-get не сможет подключиться к репозиториям ALT Linux.\nСтрого соблюдайте порядок: сначала устанавливаем bind bind-utils nano, и только затем переключаем системный резолвер на локальный адрес 127.0.0.1!\n\n2. Теоретическая справка: структура BIND в ALT Linux\n1. Как устроены зоны в файле options.conf?\n• Прямая зона (zone \"au-team.irpo\"): сопоставляет читаемые имена компьютеров (hq-rtr, br-srv) с их IPv4-адресами (записи типа A).\n• Обратная зона (zone \"168.192.in-addr.arpa\"): сопоставляет IP-адрес с именем (записи типа PTR). В обратных зонах октеты сети записываются в обратном порядке. Для сетей 192.168.x.x идентификатором зоны является 168.192.in-addr.arpa.\n• Пересылка (forwarders { 77.88.8.7; 77.88.8.3; };): если клиент запрашивает внешний сайт (например, ya.ru), BIND перенаправляет этот запрос на общедоступные DNS-серверы Яндекса.\n• dnssec-validation no;: отключает проверку DNSSEC. Так как наша зона .au-team.irpo локальная и не подписана в мировом корневом дереве DNS, включенный DNSSEC привёл бы к ошибкам разрешения имён (SERVFAIL).\n\n2. Зачем менять права chown :named?\nВ целях безопасности демон BIND в ALT Linux запускается от имени системного непривилегированного пользователя и группы named. Если файлы созданы пользователем root, демон не сможет их прочитать. Поэтому группе named обязательно передаются права на файлы зон.\n\nШаг 1. Установка пакетов и генерация ключа RNDC\napt-get update && apt-get install bind bind-utils nano -y\necho $'search au-team.irpo\\nnameserver 127.0.0.1' > /etc/net/ifaces/enp7s1/resolv.conf\nrndc-confgen -a -c /etc/bind/rndc.key\n\nШаг 2. Настройка конфигурации BIND (options.conf)\nnano /etc/bind/options.conf\nВставляем конфигурацию:\noptions {\n    listen-on { 127.0.0.1; 192.168.100.2; };\n    forwarders { 77.88.8.7; 77.88.8.3; };\n    recursion yes;\n    allow-recursion { any; };\n    allow-query { any; };\n    dnssec-validation no;\n    directory \"/etc/bind/zone\";\n    dump-file \"/var/run/named/named_dump.db\";\n    statistics-file \"/var/run/named/named.stats\";\n    pid-file \"/var/run/named/named.pid\";\n};\nlogging {\n    category default { default_syslog; };\n};\nzone \"au-team.irpo\" {\n    type master;\n    file \"au-team.irpo\";\n};\nzone \"168.192.in-addr.arpa\" {\n    type master;\n    file \"168.192.in-addr.arpa\";\n};\n\nШаг 3. Настройка файла прямой зоны (au-team.irpo)\nВ файле /etc/bind/zone/au-team.irpo задаем:\n$TTL 1D\n@ IN SOA au-team.irpo. root.au-team.irpo. ( 2025020600 12H 1H 1W 1H )\n@       IN NS   hq-srv.au-team.irpo.\nhq-rtr  IN A    192.168.100.1\nhq-srv  IN A    192.168.100.2\nhq-cli  IN A    192.168.200.2\nbr-rtr  IN A    192.168.0.1\nbr-srv  IN A    192.168.0.2\ndocker  IN A    172.16.1.1\nweb     IN A    172.16.2.1\n\nШаг 4. Настройка файла обратной зоны (168.192.in-addr.arpa)\nВ файле /etc/bind/zone/168.192.in-addr.arpa задаем:\n$TTL 1D\n@ IN SOA au-team.irpo. root.au-team.irpo. ( 2025020600 12H 1H 1W 1H )\n@       IN NS   au-team.irpo.\n1.100   IN PTR  hq-rtr.au-team.irpo.\n2.100   IN PTR  hq-srv.au-team.irpo.\n2.200   IN PTR  hq-cli.au-team.irpo.\n\nШаг 5. Назначение прав и запуск службы BIND\nchown :named /etc/bind/zone/au-team.irpo /etc/bind/zone/168.192.in-addr.arpa\nsystemctl enable --now bind\nservice network restart\nsystemctl restart bind.service\n\nШаг 6. Проверка работоспособности (Верификация)\n1. Прямая зона: host br-rtr -> br-rtr.au-team.irpo has address 192.168.0.1\n2. Обратная зона: host -t PTR 192.168.100.2 -> 2.100.168.192.in-addr.arpa domain name pointer hq-srv.au-team.irpo.\n3. Внешний интернет: host ya.ru -> успешный вывод IP-адресов.",
    "nodes": [
      "HQ-SRV"
    ],
    "theory": [
      {
        "title": "Архитектура BIND 9 и зоны прямой/обратной трансляции",
        "explanation": "Файл /etc/bind/options.conf задает слушающие IP-адреса, forwarders и зоны. Прямая зона содержит записи типа A, обратная зона (in-addr.arpa) содержит PTR записи. Владельцем файлов зон должна быть группа named."
      }
    ],
    "steps": [
      {
        "step_number": 1,
        "node": "HQ-SRV",
        "title": "Установка пакетов BIND и генерация ключа RNDC",
        "explanation": "Устанавливаем bind и bind-utils, направляем локальный резолвер на 127.0.0.1 и генерируем ключ управления RNDC.",
        "commands": "# 1. Устанавливаем BIND и утилиты:\napt-get update && apt-get install bind bind-utils nano -y\n\n# 2. Перенаправляем резолвер на 127.0.0.1:\necho $'search au-team.irpo\nnameserver 127.0.0.1' > /etc/net/ifaces/enp7s1/resolv.conf\n\n# 3. Генерируем ключ управления сервером RNDC:\nrndc-confgen -a -c /etc/bind/rndc.key"
      },
      {
        "step_number": 2,
        "node": "HQ-SRV",
        "title": "Настройка конфигурации BIND (/etc/bind/options.conf)",
        "explanation": "Заполняем options.conf с адресами прослушивания, forwarders на Яндекс DNS и подключением зон au-team.irpo и 168.192.in-addr.arpa.",
        "commands": "cat << 'EOF' > /etc/bind/options.conf\noptions {\n    listen-on { 127.0.0.1; 192.168.100.2; };\n    forwarders { 77.88.8.7; 77.88.8.3; };\n    recursion yes;\n    allow-recursion { any; };\n    allow-query { any; };\n    dnssec-validation no;\n    directory \"/etc/bind/zone\";\n    dump-file \"/var/run/named/named_dump.db\";\n    statistics-file \"/var/run/named/named.stats\";\n    pid-file \"/var/run/named/named.pid\";\n};\n\nlogging {\n    category default { default_syslog; };\n};\n\nzone \"au-team.irpo\" {\n    type master;\n    file \"au-team.irpo\";\n};\n\nzone \"168.192.in-addr.arpa\" {\n    type master;\n    file \"168.192.in-addr.arpa\";\n};\nEOF"
      },
      {
        "step_number": 3,
        "node": "HQ-SRV",
        "title": "Создание файла прямой зоны (/etc/bind/zone/au-team.irpo)",
        "explanation": "Создаем файл прямой зоны с записями SOA, NS и A для всех хостов инфраструктуры.",
        "commands": "cat << 'EOF' > /etc/bind/zone/au-team.irpo\n$TTL 1D\n@ IN SOA au-team.irpo. root.au-team.irpo. (\n    2025020600\n    12H\n    1H\n    1W\n    1H\n)\n@       IN NS   hq-srv.au-team.irpo.\nhq-rtr  IN A    192.168.100.1\nhq-srv  IN A    192.168.100.2\nhq-cli  IN A    192.168.200.2\nbr-rtr  IN A    192.168.0.1\nbr-srv  IN A    192.168.0.2\ndocker  IN A    172.16.1.1\nweb     IN A    172.16.2.1\nEOF"
      },
      {
        "step_number": 4,
        "node": "HQ-SRV",
        "title": "Создание файла обратной зоны (/etc/bind/zone/168.192.in-addr.arpa)",
        "explanation": "Создаем файл обратной зоны с PTR-записями для разрешения IP-адресов серверов и шлюзов.",
        "commands": "cat << 'EOF' > /etc/bind/zone/168.192.in-addr.arpa\n$TTL 1D\n@ IN SOA au-team.irpo. root.au-team.irpo. (\n    2025020600\n    12H\n    1H\n    1W\n    1H\n)\n@       IN NS   au-team.irpo.\n1.100   IN PTR  hq-rtr.au-team.irpo.\n2.100   IN PTR  hq-srv.au-team.irpo.\n2.200   IN PTR  hq-cli.au-team.irpo.\nEOF"
      },
      {
        "step_number": 5,
        "node": "HQ-SRV",
        "title": "Назначение прав группе named и запуск службы",
        "explanation": "Передаем права владения группе named, активируем службу bind, перезапускаем network и named.",
        "commands": "# 1. Передаем права владения системной группе named:\nchown :named /etc/bind/zone/au-team.irpo /etc/bind/zone/168.192.in-addr.arpa\n\n# 2. Включаем автозапуск и стартуем BIND:\nsystemctl enable --now bind\n\n# 3. Перезапускаем сеть:\nservice network restart\n\n# 4. Перезапускаем сервис BIND:\nsystemctl restart bind.service"
      },
      {
        "step_number": 6,
        "node": "HQ-SRV",
        "title": "Верификация разрешения имён утилитой host",
        "explanation": "Выполняем тестовые запросы прямой зоны, обратной зоны и проверяем рекурсию в интернет через forwarders.",
        "commands": "# 1. Проверка разрешения внутреннего имени (прямая зона):\nhost br-rtr\n\n# 2. Проверка обратного разрешения IP в имя (обратная зона):\nhost -t PTR 192.168.100.2\n\n# 3. Проверка внешнего Интернета через серверы пересылки (Forwarders):\nhost ya.ru"
      }
    ],
    "script_command": "curl -sSL https://exam.sudostudy.dev/scripts/m1_t10.sh | bash",
    "questions": [
      {
        "id": "q1",
        "text": "Почему необходимо устанавливать пакеты BIND до переключения resolv.conf на 127.0.0.1?",
        "placeholder": "Иначе пропадет доступ к репозиториям по доменным именам"
      },
      {
        "id": "q2",
        "text": "Какая директива в options.conf задает серверы пересылки внешних DNS-запросов?",
        "placeholder": "forwarders"
      }
    ],
    "max_score": 5,
    "order_index": 10,
    "is_active": true,
    "created_at": "2026-10-08T06:57:07.863Z",
    "updated_at": "2026-10-08T06:57:07.863Z"
  },
  {
    "id": "m1-task-11",
    "slug": "m1-task-11",
    "video_url": "https://docker.sudostudy.dev/s/BTRAdw9Ewsczk7d",
    "module_id": "module-1",
    "task_number": 11,
    "title": "Настройка системного времени и часового пояса",
    "module_code": "Модуль 1",
    "description": "Установка базы данных временных зон tzdata и настройка единого часового пояса Asia/Novosibirsk (UTC+7) на всех узлах инфраструктуры через утилиту timedatectl.",
    "assignment": "В данном задании на всех виртуальных машинах инфраструктуры настраивается корректный часовой пояс (Timezone) и проверяется синхронизация системного времени.\nТочное время и единый часовой пояс критически важны для:\n• Корректного анализа и сопоставления системных журналов (syslog, journalctl) при расследовании инцидентов;\n• Сроков действия цифровых сертификатов (TLS/SSL);\n• Аутентификации и протоколов с временными метками (Kerberos, NTP, токены сессий);\n• Сетевых баз данных и расписаний планировщика cron / systemd-timers.\n\nМесто выполнения:\nДанная операция выполняется под пользователем root на всех виртуальных машинах схемы:\n• ISP (isp.au-team.irpo)\n• HQ-RTR (hq-rtr.au-team.irpo)\n• BR-RTR (br-rtr.au-team.irpo)\n• HQ-SRV (hq-srv.au-team.irpo)\n• BR-SRV (br-srv.au-team.irpo)\n• HQ-CLI (hq-cli.au-team.irpo)\n\n1. Теоретическая справка: как устроено время в Linux\nВ операционных системах Linux сосуществуют два вида часов:\n• Аппаратные часы (RTC / Hardware Clock) — микросхема реального времени на материнской плате, питающаяся от батарейки. Хранят время в шкале UTC.\n• Системные часы (System Clock) — внутреннее программное время ядра Linux. Начинает отсчёт при загрузке системы на основе RTC и далее поддерживается таймером процессора.\n\nРоль базы данных tzdata:\nЧасовой пояс хранится в специальной базе данных IANA Time Zone Database (пакет tzdata в ALT Linux) в каталоге /usr/share/zoneinfo/.\nТекущий часовой пояс определяется ссылкой: /etc/localtime → /usr/share/zoneinfo/Asia/Novosibirsk.\nУправление часовыми поясами осуществляется через утилиту timedatectl.\n\nШаг 1. Установка и обновление базы данных часовых поясов\napt-get update && apt-get install tzdata -y\n\nШаг 2. Установка требуемого часового пояса\ntimedatectl set-timezone Asia/Novosibirsk\n\nКоманда автоматически пересоздает символическую ссылку /etc/localtime и уведомляет systemd.\n(Если в задании требуется другой пояс, найти его можно через timedatectl list-timezones | grep -i <город>).\n\nШаг 3. Проверка текущих параметров времени\ntimedatectl\nОжидаемый вывод:\nLocal time: ... +07\nUniversal time: ... UTC\nRTC time: ... UTC\nTime zone: Asia/Novosibirsk (+07, +0700)\nRTC in local TZ: no",
    "nodes": [
      "ISP",
      "HQ-RTR",
      "BR-RTR",
      "HQ-SRV",
      "BR-SRV",
      "HQ-CLI"
    ],
    "theory": [
      {
        "title": "Утилита timedatectl и база данных tzdata",
        "explanation": "В Linux часовые пояса управляются базой данных IANA tzdata в /usr/share/zoneinfo/. Команда timedatectl set-timezone перенаправляет симлинк /etc/localtime. Системные часы работают в UTC, а местное время вычисляется с учетом часового пояса."
      }
    ],
    "steps": [
      {
        "step_number": 1,
        "node": "Все узлы (ISP, HQ-RTR, BR-RTR, HQ-SRV, BR-SRV, HQ-CLI)",
        "title": "Установка tzdata и применение часового пояса Asia/Novosibirsk",
        "explanation": "Устанавливаем пакет tzdata, выставляем часовой пояс Asia/Novosibirsk и проверяем системный статус времени.",
        "commands": "# 1. Устанавливаем базу часовых поясов:\napt-get update && apt-get install tzdata -y\n\n# 2. Устанавливаем часовой пояс:\ntimedatectl set-timezone Asia/Novosibirsk\n\n# 3. Проверяем параметры времени:\ntimedatectl"
      },
      {
        "step_number": 2,
        "node": "Все узлы",
        "title": "Верификация параметров времени и часового пояса",
        "explanation": "Проверяем параметры в выводе timedatectl:\n• Local time: смещение +07\n• Universal time: мировое время UTC\n• Time zone: Asia/Novosibirsk (+07, +0700)\n• RTC in local TZ: no",
        "commands": "timedatectl"
      }
    ],
    "script_command": "curl -sSL https://exam.sudostudy.dev/scripts/m1_t11.sh | bash",
    "questions": [
      {
        "id": "q1",
        "text": "Какой пакет в ALT Linux содержит базу данных часовых поясов IANA?",
        "placeholder": "tzdata"
      },
      {
        "id": "q2",
        "text": "Какая команда выводит список доступных часовых поясов системы?",
        "placeholder": "timedatectl list-timezones"
      }
    ],
    "max_score": 5,
    "order_index": 11,
    "is_active": true,
    "created_at": "2026-10-08T06:57:07.863Z",
    "updated_at": "2026-10-08T06:57:07.863Z"
  },

  // =========================================================================
  // MODULE 2 (11 TASKS)
  // =========================================================================
  {
    id: 'm2-task-1',
    slug: 'm2-task-1',
    module_id: 'module-2',
    task_number: 1,
    title: 'Контроллер домена Samba DC и ввод клиента HQ-CLI',
    module_code: 'Модуль 2',
    description: 'Развертывание Active Directory Domain Controller на базе Samba 4 на сервере HQ-SRV, генерация домена AU-TEAM.IRPO и ввод рабочей станции HQ-CLI в домен.',
    nodes: ['HQ-SRV', 'HQ-CLI'],
    theory: [
      {
        title: 'Архитектура Samba 4 Active Directory DC',
        explanation: 'Команда samba-tool domain provision генерирует встроенную базу каталога LDAP, сервер аутентификации Kerberos KDC и DNS-бэкенд SAMBA_INTERNAL. Клиенты настраивают авторизацию через winbind/sssd.',
      },
    ],
    steps: [
      {
        step_number: 1,
        node: 'HQ-SRV',
        title: 'Инициализация домена через samba-tool',
        explanation: 'Развертываем новый домен с realm AU-TEAM.IRPO.',
        commands: `samba-tool domain provision --use-rfc2307 --realm=AU-TEAM.IRPO --domain=AU-TEAM --server-role=dc --adminpass='P@ssw0rd2026'
systemctl enable --now samba
smbclient -L localhost -U%`,
      },
    ],
    script_command: 'curl -sSL https://demo.sudostudy.dev/scripts/check_m2_t1.sh | bash',
    questions: [
      { id: 'q1', text: 'Какая команда используется для проверки тикетов Kerberos?', placeholder: 'klist' },
    ],
    max_score: 5,
    order_index: 12,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'm2-task-2',
    slug: 'm2-task-2',
    module_id: 'module-2',
    task_number: 2,
    title: 'Файловое хранилище RAID 0 на сервере HQ-SRV',
    module_code: 'Модуль 2',
    description: 'Создание высокоскоростного программного массива mdadm RAID 0 из двух дополнительных дисков, форматирование в ext4 и автомонтирование в /opt/storage.',
    nodes: ['HQ-SRV'],
    theory: [
      {
        title: 'Организация программных массивов mdadm RAID 0',
        explanation: 'RAID 0 распределяет блоки данных параллельно по всем дискам массива без избыточности. Конфигурация фиксируется в /etc/mdadm.conf, а автоматическое монтирование — в /etc/fstab по UUID.',
      },
    ],
    steps: [
      {
        step_number: 1,
        node: 'HQ-SRV',
        title: 'Создание массива /dev/md0 и форматирование в ext4',
        explanation: 'Инициализируем массив и настраиваем автозапуск.',
        commands: `mdadm --create --verbose /dev/md0 --level=0 --raid-devices=2 /dev/vdb /dev/vdc
mkfs.ext4 -F /dev/md0
mkdir -p /opt/storage
mount /dev/md0 /opt/storage
mdadm --detail --scan >> /etc/mdadm.conf
echo "$(blkid -s UUID -o value /dev/md0) /opt/storage ext4 defaults 0 2" >> /etc/fstab
df -h /opt/storage`,
      },
    ],
    script_command: 'curl -sSL https://demo.sudostudy.dev/scripts/check_m2_t2.sh | bash',
    questions: [
      { id: 'q1', text: 'В чем ключевое ограничение отказоустойчивости RAID 0?', placeholder: 'При выходе из строя хотя бы одного диска массив полностью теряет данные' },
    ],
    max_score: 5,
    order_index: 13,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'm2-task-3',
    slug: 'm2-task-3',
    module_id: 'module-2',
    task_number: 3,
    title: 'Сетевая файловая система NFS на HQ-SRV и HQ-CLI',
    module_code: 'Модуль 2',
    description: 'Экспорт каталога /opt/storage по протоколу Network File System v4 и автоматическое монтирование сетевого ресурса на клиенте HQ-CLI.',
    nodes: ['HQ-SRV', 'HQ-CLI'],
    theory: [
      {
        title: 'Файл /etc/exports и параметры прав rw, sync, no_root_squash',
        explanation: 'Демон nfs-server считывает файл /etc/exports. Опция rw открывает доступ на запись, sync требует синхронной фиксации изменений, no_subtree_check повышает надежность передачи файлов.',
      },
    ],
    steps: [
      {
        step_number: 1,
        node: 'HQ-SRV',
        title: 'Экспорт директории в /etc/exports',
        explanation: 'Предоставляем доступ для подсети клиентов 192.168.200.0/24.',
        commands: `echo '/opt/storage 192.168.200.0/24(rw,sync,no_subtree_check)' >> /etc/exports
exportfs -ra
systemctl enable --now nfs-server
showmount -e localhost`,
      },
    ],
    script_command: 'curl -sSL https://demo.sudostudy.dev/scripts/check_m2_t3.sh | bash',
    questions: [
      { id: 'q1', text: 'Какая команда перечитывает конфигурацию /etc/exports без перезапуска сервера?', placeholder: 'exportfs -ra' },
    ],
    max_score: 5,
    order_index: 14,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'm2-task-4',
    slug: 'm2-task-4',
    module_id: 'module-2',
    task_number: 4,
    title: 'Служба сетевого времени Chrony на ISP',
    module_code: 'Модуль 2',
    description: 'Настройка демона Chrony на пограничном маршрутизаторе ISP в качестве центрального источника времени Stratum 2 для всех узлов сети.',
    nodes: ['ISP', 'HQ-SRV'],
    theory: [
      {
        title: 'Преимущества Chrony над ntpd и директива local stratum',
        explanation: 'Chrony быстрее компенсирует джиттер и задержки в виртуализированных средах. Директива "local stratum 10" позволяет ISP отвечать клиентам даже при отсутствии связи с внешними upstream-серверами.',
      },
    ],
    steps: [
      {
        step_number: 1,
        node: 'ISP',
        title: 'Конфигурирование /etc/chrony.conf на ISP',
        explanation: 'Разрешаем синхронизацию для корпоративных подсетей 172.16.0.0/16.',
        commands: `cat << 'EOF' >> /etc/chrony.conf
allow 172.16.0.0/16
local stratum 8
EOF
systemctl enable --now chronyd
chronyc tracking`,
      },
    ],
    script_command: 'curl -sSL https://demo.sudostudy.dev/scripts/check_m2_t4.sh | bash',
    questions: [
      { id: 'q1', text: 'Какая утилита командной строки используется для мониторинга источников времени в Chrony?', placeholder: 'chronyc sources -v' },
    ],
    max_score: 5,
    order_index: 15,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'm2-task-5',
    slug: 'm2-task-5',
    module_id: 'module-2',
    task_number: 5,
    title: 'Автоматизация с Ansible на сервере BR-SRV',
    module_code: 'Модуль 2',
    description: 'Подготовка управляющего узла Ansible: файл инвентаря hosts, конфигурация ansible.cfg и плейбук автоматического развертывания пакетов.',
    nodes: ['BR-SRV'],
    theory: [
      {
        title: 'Архитектура Ansible и безагентный подход (Agentless)',
        explanation: 'Ansible взаимодействует с узлами через стандартный SSH и встроенный Python. Playbook описывает желаемое состояние системы в формате YAML с соблюдением идемпотентности.',
      },
    ],
    steps: [
      {
        step_number: 1,
        node: 'BR-SRV',
        title: 'Создание инвентаря и запуск ping-теста модулей',
        explanation: 'Проверяем связь со всеми узлами инфраструктуры через ansible all -m ping.',
        commands: `mkdir -p /opt/ansible
cat << 'EOF' > /opt/ansible/hosts
[routers]
hq-rtr ansible_host=192.168.100.1
br-rtr ansible_host=192.168.0.1
[servers]
hq-srv ansible_host=192.168.100.2
br-srv ansible_host=127.0.0.1 ansible_connection=local
EOF
ansible -i /opt/ansible/hosts servers -m ping`,
      },
    ],
    script_command: 'curl -sSL https://demo.sudostudy.dev/scripts/check_m2_t5.sh | bash',
    questions: [
      { id: 'q1', text: 'Какой формат используется для описания сценариев (playbooks) в Ansible?', placeholder: 'YAML' },
    ],
    max_score: 5,
    order_index: 16,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'm2-task-6',
    slug: 'm2-task-6',
    module_id: 'module-2',
    task_number: 6,
    title: 'Веб-приложение в Docker на сервере BR-SRV',
    module_code: 'Модуль 2',
    description: 'Установка Docker Engine, запуск контейнера с изолированным сервисом через Docker Compose и проброс сетевых портов.',
    nodes: ['BR-SRV'],
    theory: [
      {
        title: 'Изоляция пространств имён Linux (Namespaces и Cgroups)',
        explanation: 'Docker изолирует процессы на уровне ядра с помощью PID, NET, IPC и MNT namespaces. Декларативный файл compose.yaml упрощает запуск многоконтейнерных стеков.',
      },
    ],
    steps: [
      {
        step_number: 1,
        node: 'BR-SRV',
        title: 'Создание compose.yaml и запуск контейнера в фоне',
        explanation: 'Запускаем контейнер Nginx на порту 8080.',
        commands: `mkdir -p /opt/docker-app
cat << 'EOF' > /opt/docker-app/docker-compose.yml
services:
  webapp:
    image: nginx:alpine
    container_name: br_web
    restart: always
    ports:
      - "8080:80"
EOF
docker compose -f /opt/docker-app/docker-compose.yml up -d
docker ps`,
      },
    ],
    script_command: 'curl -sSL https://demo.sudostudy.dev/scripts/check_m2_t6.sh | bash',
    questions: [
      { id: 'q1', text: 'Какой флаг в команде docker compose up запускает контейнеры в фоновом режиме?', placeholder: '-d (--detach)' },
    ],
    max_score: 5,
    order_index: 17,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'm2-task-7',
    slug: 'm2-task-7',
    module_id: 'module-2',
    task_number: 7,
    title: 'Веб-приложение Apache + MariaDB на сервере HQ-SRV',
    module_code: 'Модуль 2',
    description: 'Развертывание веб-сервера Apache2 (httpd2) и сервера реляционных баз данных MariaDB, создание базы данных и пользователя.',
    nodes: ['HQ-SRV'],
    theory: [
      {
        title: 'Классический LAMP стек в ALT Linux',
        explanation: 'В ALT Linux веб-сервер Apache имеет имя пакета и службы httpd2. Права доступа к директории /var/www/html/ управляются пользователем и группой _webserver.',
      },
    ],
    steps: [
      {
        step_number: 1,
        node: 'HQ-SRV',
        title: 'Запуск httpd2 и MariaDB с созданием тестовой БД',
        explanation: 'Создаем базу demo_db и пользователя webuser.',
        commands: `systemctl enable --now httpd2 mariadb
mysql -e "CREATE DATABASE demo_db; CREATE USER 'webuser'@'localhost' IDENTIFIED BY 'Secret123!'; GRANT ALL PRIVILEGES ON demo_db.* TO 'webuser'@'localhost';"
echo "<h1>SudoStudy Portal HQ</h1>" > /var/www/html/index.html
curl -s http://localhost/ | grep SudoStudy`,
      },
    ],
    script_command: 'curl -sSL https://demo.sudostudy.dev/scripts/check_m2_t7.sh | bash',
    questions: [
      { id: 'q1', text: 'Какое имя службы носит Apache в дистрибутиве ALT Linux?', placeholder: 'httpd2' },
    ],
    max_score: 5,
    order_index: 18,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'm2-task-8',
    slug: 'm2-task-8',
    module_id: 'module-2',
    task_number: 8,
    title: 'Статический проброс портов (DNAT) на роутерах',
    module_code: 'Модуль 2',
    description: 'Настройка правил PREROUTING в iptables для публикации внутренних веб-сервисов HQ-SRV и BR-SRV во внешнюю сеть.',
    nodes: ['HQ-RTR', 'BR-RTR'],
    theory: [
      {
        title: 'Механизм Destination NAT (DNAT)',
        explanation: 'DNAT переписывает адрес и порт назначения в заголовке входящего IP-пакета до принятия решения о маршрутизации (таблица nat, цепочка PREROUTING).',
      },
    ],
    steps: [
      {
        step_number: 1,
        node: 'HQ-RTR',
        title: 'Проброс порта 80 внешнего интерфейса на веб-сервер HQ-SRV',
        explanation: 'Перенаправляем порт 80 на 192.168.100.2:80.',
        commands: `iptables -t nat -A PREROUTING -p tcp -d 172.16.1.2 --dport 80 -j DNAT --to-destination 192.168.100.2:80
iptables-save > /etc/sysconfig/iptables`,
      },
    ],
    script_command: 'curl -sSL https://demo.sudostudy.dev/scripts/check_m2_t8.sh | bash',
    questions: [
      { id: 'q1', text: 'В какой цепочке таблицы nat выполняется подмена адреса назначения (DNAT)?', placeholder: 'PREROUTING' },
    ],
    max_score: 5,
    order_index: 19,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'm2-task-9',
    slug: 'm2-task-9',
    module_id: 'module-2',
    task_number: 9,
    title: 'Обратный прокси-сервер Nginx на ISP',
    module_code: 'Модуль 2',
    description: 'Настройка обратного прокси Nginx на маршрутизаторе ISP для балансировки и маршрутизации запросов к сервисам hq.au-team.irpo и br.au-team.irpo.',
    nodes: ['ISP'],
    theory: [
      {
        title: 'Директивы proxy_pass и виртуальные хосты server_name',
        explanation: 'Nginx принимает HTTP-запросы на одном внешнем IP и распределяет их по заголовку Host на соответствующие внутренние апстримы.',
      },
    ],
    steps: [
      {
        step_number: 1,
        node: 'ISP',
        title: 'Создание виртуального хоста в /etc/nginx/sites-available/',
        explanation: 'Маршрутизируем запросы на hq-rtr и br-rtr.',
        commands: `cat << 'EOF' > /etc/nginx/sites-available/reverse_proxy.conf
server {
    listen 80;
    server_name hq.au-team.irpo;
    location / {
        proxy_pass http://172.16.1.2;
        proxy_set_header Host $host;
    }
}
EOF
nginx -t && systemctl restart nginx`,
      },
    ],
    script_command: 'curl -sSL https://demo.sudostudy.dev/scripts/check_m2_t9.sh | bash',
    questions: [
      { id: 'q1', text: 'Какая команда проверяет синтаксис конфигурации Nginx?', placeholder: 'nginx -t' },
    ],
    max_score: 5,
    order_index: 20,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'm2-task-10',
    slug: 'm2-task-10',
    module_id: 'module-2',
    task_number: 10,
    title: 'Web-аутентификация в Nginx (.htpasswd)',
    module_code: 'Модуль 2',
    description: 'Защита служебной директории обратного прокси базовой HTTP-аутентификацией (HTTP Basic Auth) с использованием хэшированных паролей htpasswd.',
    nodes: ['ISP'],
    theory: [
      {
        title: 'Механизм HTTP Basic Authentication и директивы auth_basic',
        explanation: 'Директива auth_basic выдает клиенту 401 Unauthorized с заголовком WWW-Authenticate, если не передан правильный Authorization заголовок.',
      },
    ],
    steps: [
      {
        step_number: 1,
        node: 'ISP',
        title: 'Генерация файла .htpasswd и подключение auth_basic в Nginx',
        explanation: 'Создаем учетную запись webadmin.',
        commands: `htpasswd -bc /etc/nginx/.htpasswd webadmin 'P@ssw0rd2026'
chmod 640 /etc/nginx/.htpasswd
chown root:nginx /etc/nginx/.htpasswd
systemctl restart nginx`,
      },
    ],
    script_command: 'curl -sSL https://demo.sudostudy.dev/scripts/check_m2_t10.sh | bash',
    questions: [
      { id: 'q1', text: 'Какой HTTP статус возвращает сервер при отсутствии данных базовой аутентификации?', placeholder: '401 Unauthorized' },
    ],
    max_score: 5,
    order_index: 21,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'm2-task-11',
    slug: 'm2-task-11',
    module_id: 'module-2',
    task_number: 11,
    title: 'Установка Яндекс Браузера на HQ-CLI',
    module_code: 'Модуль 2',
    description: 'Подключение официального репозитория и установка отечественного веб-браузера на клиентскую рабочую станцию под управлением графической среды.',
    nodes: ['HQ-CLI'],
    theory: [
      {
        title: 'Управление пакетами в ALT Linux через APT-RPM',
        explanation: 'ALT Linux использует гибридную пакетную систему APT поверх RPM-пакетов (/etc/apt/sources.list).',
      },
    ],
    steps: [
      {
        step_number: 1,
        node: 'HQ-CLI',
        title: 'Установка пакета yandex-browser-stable',
        explanation: 'Обновляем списки пакетов и производим инсталляцию.',
        commands: `apt-get update
apt-get install -y yandex-browser-stable
which yandex-browser`,
      },
    ],
    script_command: 'curl -sSL https://demo.sudostudy.dev/scripts/check_m2_t11.sh | bash',
    questions: [
      { id: 'q1', text: 'Какая утилита в ALT Linux управляет репозиториями и установкой пакетов?', placeholder: 'apt-get (apt-rpm)' },
    ],
    max_score: 5,
    order_index: 22,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  // =========================================================================
  // MODULE 3 (10 TASKS)
  // =========================================================================
  {
    id: 'm3-task-1',
    slug: 'm3-task-1',
    module_id: 'module-3',
    task_number: 1,
    title: 'Импорт пользователей в домен Samba DC',
    module_code: 'Модуль 3',
    description: 'Массовое создание доменных пользователей и групп подразделений по предоставленному списку CSV через samba-tool.',
    nodes: ['HQ-SRV'],
    theory: [
      {
        title: 'Управление объектами каталога через samba-tool user add',
        explanation: 'Команда samba-tool создает учетную запись пользователя в базе NTDS.dit, генерирует Kerberos принципал и назначает членство в группах безопасности.',
      },
    ],
    steps: [
      {
        step_number: 1,
        node: 'HQ-SRV',
        title: 'Пакетное создание пользователей и групп',
        explanation: 'Создаем группу ОтделИТ и пользователя engineer.',
        commands: `samba-tool group add "ОтделИТ" --description="ИТ персонал"
samba-tool user create engineer 'TempPass2026!' --given-name="Инженер" --surname="Иванов"
samba-tool group addmembers "ОтделИТ" engineer
samba-tool group listmembers "ОтделИТ"`,
      },
    ],
    script_command: 'curl -sSL https://demo.sudostudy.dev/scripts/check_m3_t1.sh | bash',
    questions: [
      { id: 'q1', text: 'Какая подкоманда samba-tool добавляет пользователя в группу?', placeholder: 'samba-tool group addmembers <Group> <User>' },
    ],
    max_score: 5,
    order_index: 23,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'm3-task-2',
    slug: 'm3-task-2',
    module_id: 'module-3',
    task_number: 2,
    title: 'Центр сертификации ГОСТ и HTTPS Nginx',
    module_code: 'Модуль 3',
    description: 'Развертывание локального центра сертификации с использованием криптографических алгоритмов ГОСТ Р 34.12/34.10 и выпуск TLS-сертификатов.',
    nodes: ['HQ-SRV'],
    theory: [
      {
        title: 'Российская криптография в OpenSSL (движок gost)',
        explanation: 'Движок gost в OpenSSL позволяет использовать алгоритмы кузнечик/магма и подпись ГОСТ Р 34.10-2012 для защиты веб-трафика по протоколу TLS.',
      },
    ],
    steps: [
      {
        step_number: 1,
        node: 'HQ-SRV',
        title: 'Генерация сертификата и подключение SSL к сайту',
        explanation: 'Создаем самоподписанный сертификат и настраиваем порт 443.',
        commands: `mkdir -p /etc/ssl/certs /etc/ssl/private
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/ssl/private/web.key -out /etc/ssl/certs/web.crt -subj "/C=RU/O=AU-TEAM/CN=hq.au-team.irpo"
systemctl restart httpd2`,
      },
    ],
    script_command: 'curl -sSL https://demo.sudostudy.dev/scripts/check_m3_t2.sh | bash',
    questions: [
      { id: 'q1', text: 'Какой стандарт ГОСТ регламентирует алгоритм электронной цифровой подписи?', placeholder: 'ГОСТ Р 34.10-2012' },
    ],
    max_score: 5,
    order_index: 24,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'm3-task-3',
    slug: 'm3-task-3',
    module_id: 'module-3',
    task_number: 3,
    title: 'Защищённый IP-туннель и OSPF',
    module_code: 'Модуль 3',
    description: 'Организация криптографической защиты трафика между филиалами с шифрованием канала и передачей маршрутов OSPF.',
    nodes: ['HQ-RTR', 'BR-RTR'],
    theory: [
      {
        title: 'Шифрование туннелей IPsec и WireGuard',
        explanation: 'Криптографическая инкапсуляция защищает транзитные данные от прослушивания и модификации при прохождении через сеть провайдера ISP.',
      },
    ],
    steps: [
      {
        step_number: 1,
        node: 'HQ-RTR',
        title: 'Проверка целостности зашифрованного туннеля',
        explanation: 'Убеждаемся, что шифрованный туннель активен и пакеты OSPF маршрутизируются штатно.',
        commands: `ip link show gre1
vtysh -c "show ip ospf route"`,
      },
    ],
    script_command: 'curl -sSL https://demo.sudostudy.dev/scripts/check_m3_t3.sh | bash',
    questions: [
      { id: 'q1', text: 'Какой протокол IPsec обеспечивает конфиденциальность данных (шифрование)?', placeholder: 'ESP (Encapsulating Security Payload, протокол IP 50)' },
    ],
    max_score: 5,
    order_index: 25,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'm3-task-4',
    slug: 'm3-task-4',
    module_id: 'module-3',
    task_number: 4,
    title: 'Межсетевой экран nftables',
    module_code: 'Модуль 3',
    description: 'Написание правил фильтрации современного пакетного фильтра nftables: состояние соединений (conntrack), защита от спуфинга и блокировка нежелательных портов.',
    nodes: ['HQ-RTR'],
    theory: [
      {
        title: 'Синтаксис и таблицы nftables',
        explanation: 'nftables заменяет устаревший iptables. Правила объединяются в таблицы и цепочки с единым виртуальным процессором фильтрации ядра Linux.',
      },
    ],
    steps: [
      {
        step_number: 1,
        node: 'HQ-RTR',
        title: 'Конфигурация базового набора правил /etc/nftables/nftables.nft',
        explanation: 'Разрешаем established/related трафик и дропаем нелегитимные входящие пакеты.',
        commands: `cat << 'EOF' > /etc/nftables/nftables.nft
table inet filter {
    chain input {
        type filter hook input priority 0; policy drop;
        iif "lo" accept
        ct state established,related accept
        tcp dport 22 accept
        ip protocol icmp accept
    }
}
EOF
nft -f /etc/nftables/nftables.nft
nft list ruleset`,
      },
    ],
    script_command: 'curl -sSL https://demo.sudostudy.dev/scripts/check_m3_t4.sh | bash',
    questions: [
      { id: 'q1', text: 'Какое состояние соединения в conntrack соответствует ответным пакетам уже открытого сеанса?', placeholder: 'established,related' },
    ],
    max_score: 5,
    order_index: 26,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'm3-task-5',
    slug: 'm3-task-5',
    module_id: 'module-3',
    task_number: 5,
    title: 'Принт-сервер CUPS и PDF-принтер',
    module_code: 'Модуль 3',
    description: 'Развертывание службы Common Unix Printing System (CUPS) на HQ-SRV, создание виртуального принтера с выводом в PDF и публикация очереди печати.',
    nodes: ['HQ-SRV'],
    theory: [
      {
        title: 'Архитектура CUPS и протокол IPP',
        explanation: 'CUPS управляет очередями печати через Internet Printing Protocol (порт 631). Виртуальный PDF-принтер перехватывает PostScript/PDF потоки и сохраняет их в локальную директорию пользователя.',
      },
    ],
    steps: [
      {
        step_number: 1,
        node: 'HQ-SRV',
        title: 'Установка и запуск службы cupsd',
        explanation: 'Проверяем статус демона печати.',
        commands: `systemctl enable --now cups
lpstat -r
lpinfo -v | grep -i pdf`,
      },
    ],
    script_command: 'curl -sSL https://demo.sudostudy.dev/scripts/check_m3_t5.sh | bash',
    questions: [
      { id: 'q1', text: 'Какой сетевой TCP-порт по умолчанию использует служба CUPS для веб-интерфейса и печати IPP?', placeholder: '631' },
    ],
    max_score: 5,
    order_index: 27,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'm3-task-6',
    slug: 'm3-task-6',
    module_id: 'module-3',
    task_number: 6,
    title: 'Централизованное логирование rsyslog',
    module_code: 'Модуль 3',
    description: 'Настройка сервера сбора журналов rsyslog на HQ-SRV и отправка логов аутентификации (auth, authpriv) со всех серверов и маршрутизаторов по протоколу UDP/TCP 514.',
    nodes: ['HQ-SRV', 'HQ-RTR'],
    theory: [
      {
        title: 'Уровни важности (Facility и Severity) в протоколе Syslog',
        explanation: 'Syslog категоризирует события по источнику (auth, kern, daemon, local0..local7) и критичности (emerg, alert, crit, err, warning, notice, info, debug).',
      },
    ],
    steps: [
      {
        step_number: 1,
        node: 'HQ-SRV',
        title: 'Включение приема удаленных логов по UDP в /etc/rsyslog.conf',
        explanation: 'Активируем модуль imudp.',
        commands: `sed -i 's/^#*module(load="imudp")/module(load="imudp")/' /etc/rsyslog.conf
sed -i 's/^#*input(type="imudp" port="514")/input(type="imudp" port="514")/' /etc/rsyslog.conf
systemctl restart rsyslog
ss -ulnp | grep 514`,
      },
    ],
    script_command: 'curl -sSL https://demo.sudostudy.dev/scripts/check_m3_t6.sh | bash',
    questions: [
      { id: 'q1', text: 'Какой стандартный порт используется для передачи сообщений протокола Syslog?', placeholder: '514 (UDP / TCP)' },
    ],
    max_score: 5,
    order_index: 28,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'm3-task-7',
    slug: 'm3-task-7',
    module_id: 'module-3',
    task_number: 7,
    title: 'Мониторинг устройств на HQ-SRV',
    module_code: 'Модуль 3',
    description: 'Конфигурирование службы мониторинга состояния сетевых интерфейсов, загрузки процессора и доступности шлюзов через SNMP и Node Exporter.',
    nodes: ['HQ-SRV'],
    theory: [
      {
        title: 'Протокол SNMP (v2c/v3) и экспорт метрик',
        explanation: 'SNMP опрашивает узлы по идентификаторам объектов OID из базы MIB. Демон snmpd на маршрутизаторах предоставляет данные об утилизации портов.',
      },
    ],
    steps: [
      {
        step_number: 1,
        node: 'HQ-SRV',
        title: 'Проверка доступности SNMP агентов',
        explanation: 'Выполняем snmpwalk по community строке public.',
        commands: `snmpwalk -v 2c -c public 192.168.100.1 1.3.6.1.2.1.1.1.0 || true`,
      },
    ],
    script_command: 'curl -sSL https://demo.sudostudy.dev/scripts/check_m3_t7.sh | bash',
    questions: [
      { id: 'q1', text: 'Какая версия SNMP обеспечивает аутентификацию и шифрование данных?', placeholder: 'SNMPv3' },
    ],
    max_score: 5,
    order_index: 29,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'm3-task-8',
    slug: 'm3-task-8',
    module_id: 'module-3',
    task_number: 8,
    title: 'Инвентаризация Ansible (PC-INFO)',
    module_code: 'Модуль 3',
    description: 'Создание автоматизированного скрипта сбора фактов Ansible (Setup module) и генерация сводного отчёта о конфигурации оборудования и ПО рабочих станций.',
    nodes: ['BR-SRV'],
    theory: [
      {
        title: 'Сбор фактов ansible_facts и формирование отчётов через Jinja2',
        explanation: 'Модуль setup автоматически собирает параметры CPU, RAM, дисков и сетевых адаптеров, которые затем шаблонизируются шаблонизатором Jinja2 в итоговый текстовый документ.',
      },
    ],
    steps: [
      {
        step_number: 1,
        node: 'BR-SRV',
        title: 'Сбор информации о хостах в один отчёт',
        explanation: 'Запускаем команду сбора фактов.',
        commands: `ansible -i /opt/ansible/hosts all -m setup -a "filter=ansible_distribution*"`,
      },
    ],
    script_command: 'curl -sSL https://demo.sudostudy.dev/scripts/check_m3_t8.sh | bash',
    questions: [
      { id: 'q1', text: 'Какой встроенный модуль Ansible отвечает за сбор фактов о системе?', placeholder: 'setup' },
    ],
    max_score: 5,
    order_index: 30,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'm3-task-9',
    slug: 'm3-task-9',
    module_id: 'module-3',
    task_number: 9,
    title: 'Защита SSH с помощью Fail2ban',
    module_code: 'Модуль 3',
    description: 'Настройка демона Fail2ban для защиты службы SSH: парсинг логов sshd, обнаружение повторных неудачных попыток входа и автоматическая блокировка IP в iptables/nftables.',
    nodes: ['HQ-SRV'],
    theory: [
      {
        title: 'Принцип работы Fail2ban: фильтры, jail и actions',
        explanation: 'Fail2ban отслеживает файл журнала /var/log/messages (или journald) с помощью регулярных выражений. При превышении maxretry в течение findtime создается временное блокирующее правило на bantime секунд.',
      },
    ],
    steps: [
      {
        step_number: 1,
        node: 'HQ-SRV',
        title: 'Настройка /etc/fail2ban/jail.local для sshd',
        explanation: 'Устанавливаем bantime = 1h и maxretry = 3.',
        commands: `cat << 'EOF' > /etc/fail2ban/jail.local
[sshd]
enabled = true
port = ssh
filter = sshd
maxretry = 3
findtime = 600
bantime = 3600
EOF
systemctl restart fail2ban
fail2ban-client status sshd`,
      },
    ],
    script_command: 'curl -sSL https://demo.sudostudy.dev/scripts/check_m3_t9.sh | bash',
    questions: [
      { id: 'q1', text: 'Какая команда выводит текущее состояние и заблокированные IP-адреса для джейла sshd?', placeholder: 'fail2ban-client status sshd' },
    ],
    max_score: 5,
    order_index: 31,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'm3-task-10',
    slug: 'm3-task-10',
    module_id: 'module-3',
    task_number: 10,
    title: 'Резервное копирование данных',
    module_code: 'Модуль 3',
    description: 'Создание скрипта инкрементного или дифференциального резервного копирования конфигураций /etc и баз данных MariaDB с расписанием в cron.',
    nodes: ['HQ-SRV'],
    theory: [
      {
        title: 'Стратегия 3-2-1 и автоматизация бэкапов через cron',
        explanation: 'Резервные копии упаковываются с помощью tar/gzip со штампом даты и контрольной суммой sha256. Старые копии автоматически ротируются через find -mtime +30 -delete.',
      },
    ],
    steps: [
      {
        step_number: 1,
        node: 'HQ-SRV',
        title: 'Создание скрипта /usr/local/bin/backup.sh и задания cron',
        explanation: 'Создаем резервную копию конфигураций /etc в каталог /opt/backup.',
        commands: `mkdir -p /opt/backup
cat << 'EOF' > /usr/local/bin/backup.sh
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
tar -czf /opt/backup/etc_backup_\$DATE.tar.gz /etc/net /etc/openssh /etc/frr 2>/dev/null
EOF
chmod +x /usr/local/bin/backup.sh
/usr/local/bin/backup.sh
ls -lh /opt/backup/`,
      },
    ],
    script_command: 'curl -sSL https://demo.sudostudy.dev/scripts/check_m3_t10.sh | bash',
    questions: [
      { id: 'q1', text: 'Какой ключ утилиты tar отвечает за архивацию сжатием gzip?', placeholder: '-z (--gzip)' },
    ],
    max_score: 5,
    order_index: 32,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];
