export interface TheorySection {
  id: string;
  module: 'module-1' | 'module-2' | 'module-3';
  moduleTitle: string;
  moduleDescription: string;
  taskNumber: number;
  taskSlug: string;
  number: number;
  title: string;
  summary: string;
  content: string;
  codeBlocks?: { label: string; code: string; language?: string }[];
}

export const ALT_LINUX_THEORY: TheorySection[] = [
  // =========================================================================
  // МОДУЛЬ 1 (ЗАДАНИЯ 1 - 11)
  // =========================================================================
  {
    id: 'm1-task-1',
    module: 'module-1',
    moduleTitle: 'Модуль №1',
    moduleDescription: 'Сетевая инфраструктура',
    taskNumber: 1,
    taskSlug: 'm1-task-1',
    number: 1,
    title: 'Задание №1: Базовая настройка сети и хостов',
    summary: 'Архитектура ALT Linux, репозитории p10, пакетный менеджер APT-RPM, подсистема etcnet, настройка FQDN и адресации RFC 1918.',
    content: `Дистрибутивы семейства **ALT Linux** (разработка «Базальт СПО») построены на полностью независимой российской инфраструктуре, ядре Linux и пакетной базе **Сизиф (Sisyphus)**.

---

## 1. Архитектура дистрибутива и пакетный менеджер APT-RPM

В ALT Linux используется уникальное сочетание высокоуровневого менеджера **APT** и формата пакетов **RPM**:
* **RPM (Red Hat Package Manager):** низкоуровневая утилита. Отвечает за распаковку, верификацию контрольных сумм и хранение базы установленных программ в \`/var/lib/rpm\`. Не умеет скачивать пакеты из сети и автоматически разрешать цепочки зависимостей.
* **APT-RPM:** надстройка над RPM. Анализирует репозитории, строит граф зависимостей, скачивает нужные пакеты и передает их RPM для установки.
* **Среда Hasher:** изолированная сборочная среда в chroot без прав суперпользователя хоста, исключающая влияние установленных пакетов на сборку.

### Репозитории ALT Linux:
* **Sisyphus («Сизиф»):** нестабильный непрерывно обновляемый репозиторий активной разработки.
* **Платформа p10 (Десятая платформа):** стабильный поддерживаемый корпоративный срез. Именно платформа p10 используется на демонстрационном экзамене.
* Источники репозиториев описываются в файле \`/etc/apt/sources.list\` и каталоге \`/etc/apt/sources.list.d/\`.

### Базовые команды управления пакетами:
\`\`\`bash
# 1. Обновление списков пакетов в локальном кэше:
apt-get update

# 2. Поиск пакетов по ключевому слову в описании:
apt-cache search <имя_пакета>

# 3. Установка пакета с автоматическим подтверждением (-y):
apt-get install -y tcpdump bind-utils traceroute

# 4. Просмотр списка всех файлов, установленных пакетом:
rpm -ql <имя_пакета>
\`\`\`

---

## 2. Имена хостов (Hostname) и FQDN

У каждого компьютера в корпоративной сети должно быть уникальное имя. В экзаменационных заданиях требуется задавать **FQDN (Fully Qualified Domain Name)** — полное доменное имя (например, \`hq-rtr.au-team.irpo\`).

### Утилита hostnamectl:
В современных версиях ALT Linux с systemd имя задается утилитой \`hostnamectl\`:
\`\`\`bash
hostnamectl set-hostname hq-rtr.au-team.irpo
\`\`\`
Данная команда навсегда записывает имя в файл \`/etc/hostname\`. Чтобы текущая сессия терминала мгновенно подхватила новое имя без перезагрузки узла, выполняется подмена процесса оболочки:
\`\`\`bash
exec bash
\`\`\`

---

## 3. Сетевая подсистема etcnet в ALT Linux

В отличие от Ubuntu (где используется netplan) или RHEL (NetworkManager), в ALT Linux традиционно используется собственная модульная подсистема **etcnet**.

Все настройки сетевых адаптеров хранятся в каталоге **\`/etc/net/ifaces/\`**. Архитектурный принцип: **один сетевой интерфейс = одна отдельная директория**.

### Структура файлов внутри папки интерфейса (/etc/net/ifaces/<iface>/):

| Имя файла | Назначение | Пример содержимого |
| :--- | :--- | :--- |
| **\`options\`** | Параметры и тип интерфейса | \`TYPE=eth\` / \`BOOTPROTO=static\` |
| **\`ipv4address\`** | Статический IP-адрес с маской в формате CIDR | \`192.168.100.1/27\` |
| **\`ipv4route\`** | Шлюз по умолчанию или маршруты | \`default via 172.16.1.1\` |
| **\`resolv.conf\`** | Локальные DNS-серверы для этого адаптера | \`nameserver 77.88.8.8\` |

### Пример настройки физического интерфейса со статическим IP:
\`\`\`bash
# 1. Создаем каталог сетевого интерфейса:
mkdir -p /etc/net/ifaces/enp7s1

# 2. Объявляем тип интерфейса:
echo "TYPE=eth" > /etc/net/ifaces/enp7s1/options
echo "BOOTPROTO=static" >> /etc/net/ifaces/enp7s1/options

# 3. Назначаем статический IP-адрес:
echo "192.168.100.2/27" > /etc/net/ifaces/enp7s1/ipv4address

# 4. Указываем шлюз по умолчанию (Default Gateway):
echo "default via 192.168.100.1" > /etc/net/ifaces/enp7s1/ipv4route

# 5. Перезапускаем сетевую службу etcnet для применения:
systemctl restart network
\`\`\`

---

## 4. Диагностика сети и анализ подсетей

* **Компактный вывод статуса всех сетевых интерфейсов с цветовой подсветкой:**
\`\`\`bash
ip -c --br a
\`\`\`
*(Флаг \`-c\` раскрашивает состояния: зеленый = UP, красный = DOWN; флаг \`--br\` (brief) формирует компактную таблицу).*

* **Просмотр таблицы маршрутизации:**
\`\`\`bash
ip route show
\`\`\`

* **Расчет параметров подсети утилитой ipcalc:**
\`\`\`bash
ipcalc 192.168.100.0/27
\`\`\`
Утилита покажет адрес сети, сетевую маску, широковещательный адрес (Broadcast) и точный диапазон допустимых хостов.`,
    codeBlocks: [
      {
        label: 'Диагностика сетевого стека ALT Linux одной строкой',
        code: `ip -c --br a\nip route show\nsystemctl status network --no-pager`,
      },
    ],
  },

  // =========================================================================
  // TASK 2: ISP INTERNET ACCESS
  // =========================================================================
  {
    id: 'm1-task-2',
    module: 'module-1',
    moduleTitle: 'Модуль №1',
    moduleDescription: 'Сетевая инфраструктура',
    taskNumber: 2,
    taskSlug: 'm1-task-2',
    number: 2,
    title: 'Задание №2: Доступ к сети Интернет на ISP',
    summary: 'Маршрутизация ядра Linux (net.ipv4.ip_forward), архитектура nftables, трансляция адресов NAT Masquerade и выход филиалов в сеть.',
    content: `Узел **ISP** в топологии экзамена выполняет роль граничного маршрутизатора Интернет-провайдера. Через него маршрутизаторы HQ-RTR и BR-RTR получают связность между собой и выход во внешнюю глобальную сеть.

---

## 1. Включение пересылки пакетов (IP Forwarding) в ядре Linux

По умолчанию из соображений безопасности ядро Linux функционирует в режиме конечной рабочей станции: любые транзитные IP-пакеты, адрес назначения которых не совпадает с IP-адресом самого узла, отбрасываются.

### Как работает параметр net.ipv4.ip_forward:
Когда параметр равен \`1\`, сетевой стек ядра анализирует поле заголовка IP Destination транзитного пакета, сопоставляет его с системной таблицей маршрутизации (\`FIB - Forwarding Information Base\`) и пересылает пакет в соответствующий выходной интерфейс.

### Включение маршрутизации «на лету» (до перезагрузки):
\`\`\`bash
sysctl -w net.ipv4.ip_forward=1
\`\`\`

### Постоянная фиксация параметра в ALT Linux:
Чтобы пересылка пакетов сохранялась после перезагрузки, создается файл в каталоге \`/etc/sysctl.d/\`:
\`\`\`bash
echo "net.ipv4.ip_forward = 1" > /etc/sysctl.d/99-ipforward.conf
sysctl -p /etc/sysctl.d/99-ipforward.conf
\`\`\`

---

## 2. Подсистема nftables и трансляция адресов NAT

В современных дистрибутивах ALT Linux для управления сетевым экраном и трансляцией адресов используется **nftables** (полный отказ от устаревшего iptables).

### Зачем нужен NAT (Network Address Translation)?
Частные диапазоны IPv4-адресов (**RFC 1918**: \`10.0.0.0/8\`, \`172.16.0.0/12\`, \`192.168.0.0/16\`) не маршрутизируются в глобальной сети Интернет. Маршрутизатор ISP производит **Source NAT (SNAT / Masquerade)**: подменяет IP-адрес источника во всех исходящих пакетах на свой собственный публичный внешний адрес.

### Архитектура цепочек nftables:
* **Таблица \`ip nat\`**: содержит правила трансляции сетевых адресов.
* **Цепочка \`postrouting\`** (хук \`postrouting\`, приоритет \`srcnat\` = 100): вызывается **после** принятия решения о маршрутизации непосредственно перед отправкой пакета в физический кабель.

### Пошаговая настройка NAT Masquerade в nftables:
\`\`\`bash
# 1. Создаем таблицу nat для протокола IPv4:
nft add table ip nat

# 2. Создаем цепочку postrouting с хуком srcnat:
nft add chain ip nat postrouting '{ type nat hook postrouting priority srcnat; policy accept; }'

# 3. Добавляем правило динамической маскировки для внешнего сетевого адаптера (например, ens18):
nft add rule ip nat postrouting oifname "ens18" masquerade
\`\`\`

### Сохранение правил и автозагрузка службы:
\`\`\`bash
# Выгружаем текущий ruleset в постоянный файл конфигурации:
nft list ruleset > /etc/nftables/ruleset.nft

# Включаем и перезапускаем службу nftables:
systemctl enable --now nftables
systemctl restart nftables
\`\`\`

---

## 3. Диагностика прохождения трафика через ISP

* **Просмотр текущих таблиц и счетчиков пакетов:**
\`\`\`bash
nft list table ip nat
\`\`\`

* **Проверка доступности публичных DNS-серверов с узлов стенда:**
\`\`\`bash
ping -c 3 77.88.8.8
\`\`\``,
    codeBlocks: [
      {
        label: 'Быстрое развертывание NAT Masquerade в nftables',
        code: `echo "net.ipv4.ip_forward = 1" > /etc/sysctl.d/99-ipforward.conf\nsysctl -p /etc/sysctl.d/99-ipforward.conf\n\nnft add table ip nat\nnft add chain ip nat postrouting '{ type nat hook postrouting priority srcnat; policy accept; }'\nnft add rule ip nat postrouting oifname "ens18" masquerade\nnft list ruleset > /etc/nftables/ruleset.nft\nsystemctl enable --now nftables`,
      },
    ],
  },

  // =========================================================================
  // TASK 3: LOCAL ACCOUNTS AND SUDO
  // =========================================================================
  {
    id: 'm1-task-3',
    module: 'module-1',
    moduleTitle: 'Модуль №1',
    moduleDescription: 'Сетевая инфраструктура',
    taskNumber: 3,
    taskSlug: 'm1-task-3',
    number: 3,
    title: 'Задание №3: Локальные учётные записи и sudo',
    summary: 'Принцип наименьших привилегий, администрирование пользователей и групп, подсистема libnss-role в ALT Linux и белые списки утилит в sudoers.',
    content: `Безопасность любой операционной системы базируется на **принципе наименьших привилегий (Principle of Least Privilege)**: учетной записи предоставляются только те права, которые абсолютно необходимы для выполнения ее прямых обязанностей.

---

## 1. Управление локальными пользователями и группами

* **Создание пользователя с домашним каталогом и оболочкой bash:**
\`\`\`bash
useradd -m -s /bin/bash netadmin
\`\`\`

* **Установка или пакетная смена пароля:**
\`\`\`bash
echo "netadmin:P@ssw0rd" | chpasswd
\`\`\`

* **Добавление пользователя во вторичную административную группу wheel:**
\`\`\`bash
usermod -aG wheel netadmin
\`\`\`

---

## 2. Ролевой механизм libnss-role в ALT Linux

В дистрибутивах ALT Linux для гибкого разграничения прав используется специализированный модуль подсистемы переключения служб имен (NSS) — **\`libnss-role\`**.

### Зачем нужен libnss-role?
Он позволяет связывать доменные или системные группы с локальными ролями Linux без дублирования учетных записей в локальных файлах \`/etc/group\`.

### Активация и использование:
\`\`\`bash
# 1. Включение подсистемы через утилиту control:
control libnss-role enabled

# 2. Связывание группы с ролью wheel:
roleadd hq wheel
\`\`\`

---

## 3. Гранулярное разграничение привилегий в sudoers

Предоставление пользователям неограниченного root-доступа (\`ALL=(ALL) ALL\`) является грубейшим нарушением безопасности. В задании требуется ограничить команды строгим белым списком: разрешить запускать через sudo только утилиты \`cat\`, \`grep\` и \`id\`.

### Почему пути к бинарникам ОБЯЗАТЕЛЬНО должны быть абсолютными?
Если в правиле sudoers указать относительную команду (\`cat\`), злоумышленник может создать собственный исполняемый файл с именем \`cat\` в каталоге \`/tmp\`, подменить переменную окружения \`PATH\` и выполнить произвольный код с правами root. Полные пути (\`/bin/cat\`) исключают эту уязвимость.

### Создание изолированного файла правил в /etc/sudoers.d/:
\`\`\`bash
cat << 'EOF' > /etc/sudoers.d/99-network-policy
Cmnd_Alias NET_TOOLS = /bin/cat, /bin/grep, /usr/bin/id
%wheel ALL=(ALL) NET_TOOLS
EOF

# Обязательно выставляем права 0440 (только чтение root):
chmod 0440 /etc/sudoers.d/99-network-policy

# Проверяем синтаксис sudoers утилитой visudo:
visudo -c -f /etc/sudoers.d/99-network-policy
\`\`\`

При попытке запустить любую другую команду (например, \`sudo ls\` или \`sudo bash\`) система вернет ошибку отказа в доступе.`,
    codeBlocks: [
      {
        label: 'Настройка белого списка sudoers с проверкой синтаксиса',
        code: `control libnss-role enabled\ncat << 'EOF' > /etc/sudoers.d/99-whitelist\nCmnd_Alias SAFE_COMMANDS = /bin/cat, /bin/grep, /usr/bin/id\n%wheel ALL=(ALL) SAFE_COMMANDS\nEOF\nchmod 0440 /etc/sudoers.d/99-whitelist\nvisudo -c`,
      },
    ],
  },

  // =========================================================================
  // TASK 4: VLAN SEGMENTATION
  // =========================================================================
  {
    id: 'm1-task-4',
    module: 'module-1',
    moduleTitle: 'Модуль №1',
    moduleDescription: 'Сетевая инфраструктура',
    taskNumber: 4,
    taskSlug: 'm1-task-4',
    number: 4,
    title: 'Задание №4: Коммутация и сегментация VLAN в сегменте HQ',
    summary: 'Стандарт IEEE 802.1Q, саб-интерфейсы в etcnet, архитектура Router-on-a-Stick и маршрутизация между изолированными сегментами.',
    content: `Сегментация сети на уровне L2 с помощью **VLAN (Virtual Local Area Network)** изолирует широковещательные домены, повышает производительность сети и безопасность данных.

---

## 1. Стандарт IEEE 802.1Q и тегирование трафика

* В стандартный Ethernet-фрейм добавляется 4-байтный тег **802.1Q**, содержащий 12-битный идентификатор **VID (VLAN ID)**. Допустимые номера VLAN: от 1 до 4094.
* **Access-порт:** порт коммутатора, подключенный к конечному устройству (ПК, принтер). Передает нетегированный (untagged) трафик одного конкретного VLAN.
* **Trunk-порт:** порт, по которому передается трафик нескольких VLAN с сохранением тегов.

---

## 2. Архитектура Router-on-a-Stick

Маршрутизатор **HQ-RTR** соединяется с коммутатором одним физическим транковым кабелем. Для каждого VLAN на маршрутизаторе создается логический подинтерфейс (саб-интерфейс). Трафик между подсетями передается через эти подинтерфейсы.

### Сегменты в задании:
* **VLAN 100:** Серверный сегмент HQ-SRV (\`192.168.100.0/27\`).
* **VLAN 200:** Пользовательский сегмент HQ-CLI (\`192.168.200.0/24\`).
* **VLAN 999:** Сегмент сетевого управления (\`192.168.99.0/29\`).

---

## 3. Настройка VLAN саб-интерфейсов в etcnet на HQ-RTR

В ALT Linux подинтерфейс конфигурируется как отдельная папка в \`/etc/net/ifaces/\`.

### Создание саб-интерфейса vlan100:
\`\`\`bash
# 1. Создаем папку саб-интерфейса:
mkdir -p /etc/net/ifaces/vlan100

# 2. Описываем свойства в options:
cat << 'EOF' > /etc/net/ifaces/vlan100/options
TYPE=vlan
HOST=enp7s1
VID=100
BOOTPROTO=static
EOF

# 3. Назначаем IP-адрес шлюза:
echo "192.168.100.1/27" > /etc/net/ifaces/vlan100/ipv4address
\`\`\`

### Создание саб-интерфейса vlan200:
\`\`\`bash
mkdir -p /etc/net/ifaces/vlan200

cat << 'EOF' > /etc/net/ifaces/vlan200/options
TYPE=vlan
HOST=enp7s1
VID=200
BOOTPROTO=static
EOF

echo "192.168.200.1/24" > /etc/net/ifaces/vlan200/ipv4address
\`\`\`

### Применение конфигурации:
\`\`\`bash
systemctl restart network
\`\`\`

---

## 4. Проверка состояния VLAN-интерфейсов

\`\`\`bash
# Просмотр детальных параметров тегирования:
ip -d link show vlan100

# Проверка статуса саб-интерфейсов:
ip -c --br a show "vlan*"
\`\`\``,
    codeBlocks: [
      {
        label: 'Быстрое создание саб-интерфейсов VLAN 100 и 200',
        code: `mkdir -p /etc/net/ifaces/vlan{100,200}\n\necho -e "TYPE=vlan\\nHOST=enp7s1\\nVID=100" > /etc/net/ifaces/vlan100/options\necho "192.168.100.1/27" > /etc/net/ifaces/vlan100/ipv4address\n\necho -e "TYPE=vlan\\nHOST=enp7s1\\nVID=200" > /etc/net/ifaces/vlan200/options\necho "192.168.200.1/24" > /etc/net/ifaces/vlan200/ipv4address\n\nsystemctl restart network`,
      },
    ],
  },

  // =========================================================================
  // TASK 5: SECURE SSH REMOTE ACCESS
  // =========================================================================
  {
    id: 'm1-task-5',
    module: 'module-1',
    moduleTitle: 'Модуль №1',
    moduleDescription: 'Сетевая инфраструктура',
    taskNumber: 5,
    taskSlug: 'm1-task-5',
    number: 5,
    title: 'Задание №5: Безопасный удаленный доступ (SSH)',
    summary: 'Конфигурация OpenSSH демона sshd, харденинг, смена портов, запрет входа root и авторизация по открытым ключам.',
    content: `Протокол **SSH (Secure Shell)** обеспечивает защищенное шифрованное удаленное управление сетевыми узлами и серверами через недоверенную сеть.

---

## 1. Архитектура и харденинг службы OpenSSH (sshd)

Файл конфигурации сервера в ALT Linux расположен по пути **\`/etc/openssh/sshd_config\`**.

### Ключевые практики безопасности (Hardening):
* **Смена стандартного порта (например, на \`2222\`):** устраняет до 95% автоматизированных атак ботнетов и брутфорс-сканеров.
* **Запрет входа root по паролю (\`PermitRootLogin prohibit-password\` или \`no\`):** заставляет администраторов подключаться под личной учетной записью с последующим повышением через sudo (гарантия аудита действий).
* **Ограничение числа попыток (\`MaxAuthTries 3\`):** защищает от перебора паролей.

### Пример настроек в /etc/openssh/sshd_config:
\`\`\`ini
Port 2222
PermitRootLogin prohibit-password
PasswordAuthentication yes
PubkeyAuthentication yes
MaxAuthTries 3
\`\`\`

---

## 2. Беспарольная аутентификация по SSH-ключам

В криптографии с открытым ключом генерируется ключевая пара:
* **Закрытый ключ (Private Key):** хранится только на клиенте в строгом секрете (права \`0600\`).
* **Открытый ключ (Public Key):** передается на целевой сервер и помещается в файл \`~/.ssh/authorized_keys\`.

### Пошаговая настройка:
\`\`\`bash
# 1. Генерация ключа (рекомендуется современный ed25519 или RSA 4096):
ssh-keygen -t ed25519 -N "" -f /root/.ssh/id_ed25519

# 2. Копирование открытого ключа на удаленный сервер:
ssh-copy-id -p 2222 root@192.168.100.2

# 3. Проверка прав файловой системы на целевом сервере (критично для OpenSSH!):
chmod 700 /root/.ssh
chmod 600 /root/.ssh/authorized_keys
\`\`\`

---

## 3. Валидация и перезапуск демона

Перед перезапуском службы обязательно выполняется тестирование синтаксиса:
\`\`\`bash
sshd -t
systemctl restart sshd
systemctl status sshd --no-pager
\`\`\``,
    codeBlocks: [
      {
        label: 'Генерация ключей и безопасная проверка подключения',
        code: `ssh-keygen -t ed25519 -N "" -f /root/.ssh/id_ed25519\nssh-copy-id -p 2222 root@192.168.100.2\nssh -p 2222 -i /root/.ssh/id_ed25519 root@192.168.100.2 "hostname -f"`,
      },
    ],
  },

  // =========================================================================
  // TASK 6: GRE TUNNELING & OPENVPN
  // =========================================================================
  {
    id: 'm1-task-6',
    module: 'module-1',
    moduleTitle: 'Модуль №1',
    moduleDescription: 'Сетевая инфраструктура',
    taskNumber: 6,
    taskSlug: 'm1-task-6',
    number: 6,
    title: 'Задание №6: Межофисный защищенный IP-туннель (GRE)',
    summary: 'L3 туннелирование GRE, расчет MTU 1476 и TCP MSS 1436, настройка etcnet и альтернативный туннель OpenVPN Point-to-Point.',
    content: `**Сетевой туннель** — это виртуальный канал связи между двумя маршрутизаторами, созданный поверх промежуточной сети провайдера (ISP).

---

## 1. Протокол GRE (Generic Routing Encapsulation)

Протокол **GRE (RFC 2784, IP Protocol 47)** инкапсулирует пакеты сетевого уровня внутрь стандартных IP-пакетов.

### Зачем нужен GRE?
* **Передача Broadcast и Multicast трафика:** многие шифрованные туннели (чистый IPsec в транспортном режиме) блокируют мультикаст. GRE полностью прозрачен для Multicast. Это ключевое свойство, делающее GRE фундаментом для протоколов динамической маршрутизации (**OSPF** рассылает Hello-пакеты на мультикаст-адрес \`224.0.0.5\`).

### Расчет MTU и фрагментация:
* Стандартный MTU Ethernet = 1500 байт.
* Заголовок внешнего IP = 20 байт.
* Заголовок протокола GRE = 4 байта.
* **Итоговый MTU туннеля:** $1500 - 24 =$ **1476** байт.
* Чтобы TCP-соединения не зависали из-за фрагментации, TCP MSS clamping задается равным $1476 - 40 =$ **1436** байт.

---

## 2. Настройка туннеля GRE в ALT Linux etcnet

На маршрутизаторах HQ-RTR и BR-RTR создается виртуальный интерфейс \`gre1\`.

### Настройка на HQ-RTR:
\`\`\`bash
mkdir -p /etc/net/ifaces/gre1

cat << 'EOF' > /etc/net/ifaces/gre1/options
TYPE=gre
HOST=enp7s1
tunnel_local=172.16.1.2
tunnel_remote=172.16.2.2
BOOTPROTO=static
EOF

echo "10.10.10.1/30" > /etc/net/ifaces/gre1/ipv4address
systemctl restart network
\`\`\`

### Настройка на BR-RTR:
\`\`\`bash
mkdir -p /etc/net/ifaces/gre1

cat << 'EOF' > /etc/net/ifaces/gre1/options
TYPE=gre
HOST=enp7s1
tunnel_local=172.16.2.2
tunnel_remote=172.16.1.2
BOOTPROTO=static
EOF

echo "10.10.10.2/30" > /etc/net/ifaces/gre1/ipv4address
systemctl restart network
\`\`\`

---

## 3. Альтернатива: Прямой туннель OpenVPN со статическим ключом

Для организации шифрованного канала точка-точка между двумя машинами без PKI:
\`\`\`bash
# 1. Генерация статического ключа:
openvpn --genkey secret /etc/openvpn/static.key
chmod 600 /etc/openvpn/static.key

# 2. Конфигурация сервера (/etc/openvpn/server.conf):
dev tun
proto udp
port 1194
ifconfig 10.8.0.1 10.8.0.2
secret /etc/openvpn/static.key
keepalive 10 60
persist-tun
persist-key
\`\`\``,
    codeBlocks: [
      {
        label: 'Проверка доступности удаленного конца GRE туннеля',
        code: `ip -d link show gre1\nping -c 3 10.10.10.2`,
      },
    ],
  },

  // =========================================================================
  // TASK 7: OSPF IN FRR
  // =========================================================================
  {
    id: 'm1-task-7',
    module: 'module-1',
    moduleTitle: 'Модуль №1',
    moduleDescription: 'Сетевая инфраструктура',
    taskNumber: 7,
    taskSlug: 'm1-task-7',
    number: 7,
    title: 'Задание №7: Динамическая маршрутизация Link-State (OSPF в FRR)',
    summary: 'Протокол OSPFv2, стек FRRouting, построчный разбор команд, конфигурация /etc/frr/frr.conf и интерактивная утилита vtysh.',
    content: `Протокол **OSPF (Open Shortest Path First, RFC 2328)** — это масштабируемый протокол динамической маршрутизации внутреннего шлюза (IGP), работающий на основе отслеживания состояния каналов (Link-State).

Маршрутизаторы OSPF обмениваются объявлениями о состоянии каналов (**LSA**), формируют единую топологическую базу данных (**LSDB**) и рассчитывают кратчайшие пути с помощью алгоритма Дейкстры (**SPF**).

---

## 1. Построчный разбор команд OSPF

* **\`router ospf\`** — инициализирует процесс демона OSPF в операционной системе.
* **\`router-id 1.1.1.1\`** — уникальный 32-битный идентификатор маршрутизатора в автономной системе.
* **\`network 10.10.10.0/30 area 0\`** — активирует OSPF на интерфейсах подсети и включает их в магистральную зону **Area 0 (Backbone)**.
* **\`passive-interface vlan200\`** — объявляет интерфейс пассивным: запрещает рассылку мультикаст Hello-пакетов в сторону пользовательских компьютеров (защита от перехвата и снижения нагрузки), но продолжает анонсировать эту подсеть другим маршрутизаторам.
* **\`interface gre1\`** — вход в контекст настройки конкретного сетевого интерфейса.
* **\`ip ospf authentication message-digest\`** — включает проверку подлинности пакетов OSPF по алгоритму MD5.
* **\`ip ospf message-digest-key 1 md5 P@ssw0rd\`** — задает ID ключа (\`1\`), алгоритм (\`md5\`) и разделяемый секретный пароль.
* **\`ip ospf cost 10\`** — принудительно задает метрику стоимости интерфейса.

---

## 2. Способ 1: Настройка через файл /etc/frr/frr.conf

### Шаг 1. Включение демона ospfd в /etc/frr/daemons:
\`\`\`bash
sed -i 's/ospfd=no/ospfd=yes/' /etc/frr/daemons
\`\`\`

### Шаг 2. Создание файла /etc/frr/frr.conf:
\`\`\`ini
frr version 8.4
frr defaults traditional
hostname hq-rtr.au-team.irpo
log syslog informational
no ip forwarding
no ipv6 forwarding
service integrated-vtysh-config
!
interface gre1
 ip ospf authentication message-digest
 ip ospf message-digest-key 1 md5 P@ssw0rd
!
router ospf
 router-id 1.1.1.1
 passive-interface vlan100
 passive-interface vlan200
 network 10.10.10.0/30 area 0
 network 192.168.100.0/27 area 0
 network 192.168.200.0/24 area 0
!
line vty
!
\`\`\`

### Шаг 3. Перезапуск службы FRR:
\`\`\`bash
systemctl restart frr
systemctl status frr --no-pager
\`\`\`

---

## 3. Способ 2: Интерактивная настройка через утилиту vtysh

\`\`\`bash
vtysh -c "conf t" \
      -c "router ospf" \
      -c "router-id 1.1.1.1" \
      -c "network 10.10.10.0/30 area 0" \
      -c "network 192.168.100.0/27 area 0" \
      -c "passive-interface vlan200" \
      -c "exit" \
      -c "interface gre1" \
      -c "ip ospf authentication message-digest" \
      -c "ip ospf message-digest-key 1 md5 P@ssw0rd" \
      -c "do write memory"
\`\`\`

---

## 4. Диагностика состояния OSPF

* **Проверка установления соседства:**
\`\`\`bash
vtysh -c "show ip ospf neighbor"
\`\`\`
*(Состояние соседа должно быть **Full/DR** или **Full/Backup**)*

* **Просмотр таблицы маршрутов OSPF:**
\`\`\`bash
vtysh -c "show ip route ospf"
\`\`\``,
    codeBlocks: [
      {
        label: 'Быстрая проверка OSPF в FRR',
        code: `vtysh -c "show ip ospf neighbor"\nvtysh -c "show ip route ospf"`,
      },
    ],
  },

  // =========================================================================
  // TASK 8: BRANCH DYNAMIC NAT
  // =========================================================================
  {
    id: 'm1-task-8',
    module: 'module-1',
    moduleTitle: 'Модуль №1',
    moduleDescription: 'Сетевая инфраструктура',
    taskNumber: 8,
    taskSlug: 'm1-task-8',
    number: 8,
    title: 'Задание №8: Динамическая трансляция адресов (NAT) на филиалах',
    summary: 'Трансляция адресов источника (Source NAT / Masquerade) на роутерах HQ-RTR и BR-RTR через nftables, разделение туннельного и интернет-трафика.',
    content: `На маршрутизаторах филиалов **HQ-RTR** и **BR-RTR** необходимо обеспечить доступ клиентов в Интернет при сохранении прямой маршрутизации между филиалами.

---

## 1. Архитектура разделения трафика

* **Корпоративный трафик (HQ $\\leftrightarrow$ BR):** передается между внутренними подсетями через туннель GRE (\`10.10.10.0/30\`) с оригинальными IP-адресами источника (NAT не применяется!).
* **Интернет-трафик:** пакеты, идущие во внешнюю сеть через сетевой порт провайдера (\`enp7s1\`), подвергаются трансляции адресов **Masquerade**.

---

## 2. Настройка nftables на маршрутизаторах филиалов

\`\`\`bash
# 1. Создаем таблицу nat и цепочку postrouting:
nft add table ip nat
nft add chain ip nat postrouting '{ type nat hook postrouting priority srcnat; policy accept; }'

# 2. Добавляем правило маскировки для внешнего интерфейса, смотрящего на провайдера:
nft add rule ip nat postrouting oifname "enp7s1" masquerade

# 3. Сохраняем правила в системный файл:
nft list ruleset > /etc/nftables/ruleset.nft
systemctl enable --now nftables
\`\`\`

---

## 3. Диагностика

* **Просмотр счетчиков транслированных пакетов:**
\`\`\`bash
nft list table ip nat
\`\`\`

* **Проверка выхода в сеть с клиентского узла HQ-CLI:**
\`\`\`bash
ping -c 3 77.88.8.8
\`\`\``,
    codeBlocks: [
      {
        label: 'Применение NAT на маршрутизаторе филиала',
        code: `nft add table ip nat\nnft add chain ip nat postrouting '{ type nat hook postrouting priority srcnat; policy accept; }'\nnft add rule ip nat postrouting oifname "enp7s1" masquerade\nnft list ruleset > /etc/nftables/ruleset.nft\nsystemctl enable --now nftables`,
      },
    ],
  },

  // =========================================================================
  // TASK 9: DHCP SERVER (HQ-CLI)
  // =========================================================================
  {
    id: 'm1-task-9',
    module: 'module-1',
    moduleTitle: 'Модуль №1',
    moduleDescription: 'Сетевая инфраструктура',
    taskNumber: 9,
    taskSlug: 'm1-task-9',
    number: 9,
    title: 'Задание №9: Настройка DHCP-сервера для клиентов (HQ-CLI)',
    summary: 'Механика 4-этапного процесса DORA, демон dnsmasq в ALT Linux, пулы адресов и критически важные опции DHCP 3, 6, 15.',
    content: `Служба **DHCP (Dynamic Host Configuration Protocol)** автоматизирует распределение сетевых настроек среди клиентских компьютеров сети.

---

## 1. Как работает DHCP: процесс DORA

1. **Discover (Обнаружение):** клиент отправляет широковещательный запрос (\`255.255.255.255:67\` по UDP): «Есть ли в сети DHCP-сервер?».
2. **Offer (Предложение):** сервер резервирует свободный IP и предлагает клиенту.
3. **Request (Запрос):** клиент соглашается занять предложенный адрес.
4. **Acknowledge (Подтверждение):** сервер регистрирует аренду (Lease) и передает сетевые опции.

### Ключевые опции DHCP (DHCP Options):
* **Option 3 (Routers):** адрес шлюза по умолчанию (\`192.168.200.1\`).
* **Option 6 (Domain Name Server):** адреса DNS-серверов (\`192.168.100.2\`).
* **Option 15 (Domain Name):** суффикс доменного поиска (\`au-team.irpo\`).

---

## 2. Настройка DHCP в dnsmasq на роутере HQ-RTR

Файл **\`/etc/dnsmasq.conf\`**:
\`\`\`ini
interface=vlan200
dhcp-range=192.168.200.2,192.168.200.254,255.255.255.0,12h
dhcp-option=3,192.168.200.1
dhcp-option=6,192.168.100.2
dhcp-option=15,au-team.irpo
\`\`\`

Применение:
\`\`\`bash
systemctl restart dnsmasq
systemctl status dnsmasq --no-pager
\`\`\`

---

## 3. Проверка на клиенте HQ-CLI

\`\`\`bash
# Запрос аренды адреса по DHCP:
dhcpcd -n vlan200

# Проверка выданного IP:
ip -c --br a show vlan200
\`\`\``,
    codeBlocks: [
      {
        label: 'Быстрая конфигурация dnsmasq для VLAN 200',
        code: `cat << 'EOF' > /etc/dnsmasq.conf\ninterface=vlan200\ndhcp-range=192.168.200.2,192.168.200.254,255.255.255.0,12h\ndhcp-option=3,192.168.200.1\ndhcp-option=6,192.168.100.2\ndhcp-option=15,au-team.irpo\nEOF\nsystemctl restart dnsmasq`,
      },
    ],
  },

  // =========================================================================
  // TASK 10: DNS BIND INFRASTRUCTURE
  // =========================================================================
  {
    id: 'm1-task-10',
    module: 'module-1',
    moduleTitle: 'Модуль №1',
    moduleDescription: 'Сетевая инфраструктура',
    taskNumber: 10,
    taskSlug: 'm1-task-10',
    number: 10,
    title: 'Задание №10: Инфраструктура службы доменных имён (DNS BIND)',
    summary: 'Архитектура BIND 9, chroot-изоляция в /var/lib/bind, прямые и обратные зоны PTR, серверы пересылки (Forwarders) и диагностика через dig.',
    content: `Служба доменных имен **DNS (Domain Name System)** преобразует символьные доменные имена в числовые IP-адреса и наоборот.

---

## 1. Зачем BIND изолируется в chroot в ALT Linux?

По умолчанию в ALT Linux служба BIND 9 функционирует внутри защищенного chroot-каталога **\`/var/lib/bind/\`**.
Если в демоне BIND будет обнаружена уязвимость нулевого дня, атакующий окажется заперт внутри виртуального окружения и не сможет получить доступ к критическим файлам хост-системы (\`/etc/shadow\`, \`/root\`).

---

## 2. Типы ресурсных записей и зон

* **Прямая зона (Forward Zone):** сопоставляет имя хоста с IP-адресом.
  * \`SOA\` — параметры зоны и таймеры обновления.
  * \`NS\` — авторизованный сервер имен зоны.
  * \`A\` — запись IPv4-адреса (\`hq-srv IN A 192.168.100.2\`).
  * \`CNAME\` — каноническое имя (псевдоним).
* **Обратная зона (Reverse Zone \`in-addr.arpa\`):** сопоставляет IP-адрес с именем.
  * \`PTR\` — запись указателя (\`2 IN PTR hq-srv.au-team.irpo.\`). Без PTR-записей Kerberos в Active Directory выдает ошибки аутентификации!
* **Серверы пересылки (Forwarders):** если запрашиваемое имя не входит в локальную зону, запрос пересылается вышестоящим публичным серверам (\`77.88.8.8\`).

---

## 3. Настройка BIND в /etc/bind/named.conf

\`\`\`text
options {
    directory "/var/lib/bind/zone";
    forwarders {
        77.88.8.8;
        77.88.8.7;
    };
    allow-query { any; };
    listen-on { any; };
};
\`\`\`

---

## 4. Диагностика

\`\`\`bash
# Проверка синтаксиса конфигурации:
named-checkconf

# Проверка резолва через утилиту dig:
dig @127.0.0.1 hq-srv.au-team.irpo +short
dig @127.0.0.1 -x 192.168.100.2 +short
\`\`\``,
    codeBlocks: [
      {
        label: 'Проверка работы BIND утилитой dig',
        code: `named-checkconf\ndig @127.0.0.1 hq-srv.au-team.irpo +short\ndig @127.0.0.1 -x 192.168.100.2 +short`,
      },
    ],
  },

  // =========================================================================
  // TASK 11: TIME AND TIMEZONE
  // =========================================================================
  {
    id: 'm1-task-11',
    module: 'module-1',
    moduleTitle: 'Модуль №1',
    moduleDescription: 'Сетевая инфраструктура',
    taskNumber: 11,
    taskSlug: 'm1-task-11',
    number: 11,
    title: 'Задание №11: Настройка системного времени и часового пояса',
    summary: 'Управление системными и аппаратными часами RTC, утилита timedatectl, симлинк /etc/localtime и подготовка к работе Kerberos.',
    content: `Синхронизация системного времени и корректный часовой пояс критически важны для работы распределенных систем: корреляции журналов безопасности rsyslog, проверки сроков SSL-сертификатов и билетной аутентификации Kerberos.

---

## 1. Системные и аппаратные часы в Linux

* **Системные часы (System Time):** отсчитываются ядром операционной системы от момента старта.
* **Аппаратные часы (Hardware Clock / RTC):** микросхема на материнской плате, питающаяся от батарейки.

---

## 2. Утилита timedatectl

* **Просмотр текущего статуса времени:**
\`\`\`bash
timedatectl status
\`\`\`

* **Установка правильного часового пояса (Europe/Moscow):**
\`\`\`bash
timedatectl set-timezone Europe/Moscow
\`\`\`
*(Команда создает символическую ссылку \`/etc/localtime -> /usr/share/zoneinfo/Europe/Moscow\`)*

* **Синхронизация системного времени в аппаратные часы:**
\`\`\`bash
hwclock --systohc
\`\`\``,
    codeBlocks: [
      {
        label: 'Установка часового пояса и синхронизация RTC',
        code: `timedatectl set-timezone Europe/Moscow\nhwclock --systohc\ntimedatectl status`,
      },
    ],
  },

  // =========================================================================
  // МОДУЛЬ 2 (ЗАДАНИЯ 1 - 11)
  // =========================================================================
  {
    "id": "m2-task-1",
    "module": "module-2",
    "moduleTitle": "Модуль №2",
    "moduleDescription": "Службы каталога и сервисы",
    "taskNumber": 1,
    "taskSlug": "m2-task-1",
    "number": 12,
    "title": "Задание №1: Контроллер домена Samba DC и ввод клиента HQ-CLI",
    "summary": "Архитектура Active Directory (LDAP, Kerberos KDC, DNS, SYSVOL), метапакет task-samba-dc, domain provision, ввод через Alterator acc, ролевая модель libnss-role и ограничение sudoers.",
    "content": "**Samba 4 Active Directory Domain Controller (AD DC)** — полноценная реализация служб каталога Microsoft Active Directory в Linux. Она объединяет в себе:\n* **LDAP:** сервер каталогов для хранения информации об объектах (пользователи, группы, компьютеры).\n* **Kerberos KDC:** центр распределения ключей для сквозной безопасной аутентификации без передачи пароля по сети.\n* **Samba Internal DNS:** встроенный DNS-сервер для обслуживания ресурсных записей домена и SRV-записей (`_ldap._tcp`, `_kerberos._tcp`).\n* **SYSVOL:** общедоступная сетевая папка репликации групповых политик.\n\n---\n\n## 1. Порядок развёртывания Samba DC на сервере BR-SRV\n\n1. **Установка пакетов ДО изменения DNS:**\n   ```bash\n   apt-get update && apt-get install task-samba-dc -y\n   ```\n   > ⚠️ **Важно:** Сначала обязательно устанавливаются пакеты, и только потом настраивается DNS! Иначе сервер потеряет связь с репозиториями в Интернете.\n\n2. **Инициализация (Provisioning) домена:**\n   ```bash\n   rm -f /etc/samba/smb.conf\n   rm -rf {/var/lib/samba, /var/cache/samba}\n   mkdir -p /var/lib/samba/sysvol\n   samba-tool domain provision\n   ```\n   Параметры: Realm `AU-TEAM.IRPO`, Domain `AU-TEAM`, Role `dc`, DNS `SAMBA_INTERNAL`, Пароль `P@ssw0rd`.\n\n3. **Конфигурация Kerberos и запуск:**\n   ```bash\n   mv /etc/krb5.conf /etc/krb5.conf.back\n   cp /var/lib/samba/private/krb5.conf /etc/krb5.conf\n   systemctl enable --now samba\n   ```\n\n4. **Добавление DNS A-записей хостов и сервисов:**\n   ```bash\n   samba-tool dns add br-srv.au-team.irpo au-team.irpo hq-srv A 192.168.1.10 -U Administrator\n   samba-tool dns add br-srv.au-team.irpo au-team.irpo hq-rtr A 192.168.1.1 -U Administrator\n   samba-tool dns add br-srv.au-team.irpo au-team.irpo br-rtr A 192.168.3.1 -U Administrator\n   samba-tool dns add br-srv.au-team.irpo au-team.irpo web.au-team.irpo A 172.16.1.1 -U Administrator\n   samba-tool dns add br-srv.au-team.irpo au-team.irpo docker.au-team.irpo A 172.16.2.1 -U Administrator\n   ```\n\n5. **Создание группы hq и пользователей:**\n   ```bash\n   samba-tool group add hq\n   for i in {1..5}; do samba-tool user add hquser$i P@ssw0rd; done\n   for i in {1..5}; do samba-tool group addmembers hq hquser$i; done\n   ```\n\n---\n\n## 2. Механизм ролей libnss-role и ограничение sudo на HQ-CLI\n\nВ ALT Linux для сопоставления доменных групп Active Directory с локальными системными группами используется подсистема **`libnss-role`**:\n```bash\nroleadd hq wheel\necho \"WHEEL_USERS ALL=(ALL:ALL) /bin/cat, /bin/grep, /usr/bin/id\" >> /etc/sudoers\n```\nКоманда связывает доменную группу `hq` с привилегированной ролью `wheel`, а строка в `/etc/sudoers` ограничивает запуск суперпользовательских команд исключительно белым списком утилит (`cat`, `grep`, `id`).",
    "codeBlocks": [
      {
        "label": "Инициализация Samba DC и делегирование libnss-role",
        "code": "samba-tool domain provision --domain=AU-TEAM --realm=AU-TEAM.IRPO --server-role=dc --dns-backend=SAMBA_INTERNAL --adminpass=P@ssw0rd\n\n# На клиенте HQ-CLI:\nroleadd hq wheel\necho \"WHEEL_USERS ALL=(ALL:ALL) /bin/cat, /bin/grep, /usr/bin/id\" >> /etc/sudoers"
      }
    ]
  },

  {
    "id": "m2-task-2",
    "module": "module-2",
    "moduleTitle": "Модуль №2",
    "moduleDescription": "Службы каталога и сервисы",
    "taskNumber": 2,
    "taskSlug": "m2-task-2",
    "number": 13,
    "title": "Задание №2: Файловое хранилище RAID 0 на сервере HQ-SRV",
    "summary": "Архитектура RAID 0 (Stripe), разметка parted с флагом raid on, объединение mdadm, /etc/mdadm.conf и постоянное автомонтирование в /etc/fstab.",
    "content": "Программный массив **RAID 0 (Stripe / Чередование)** объединяет два физических накопителя в единый логический том:\n* **Суммирование объёма:** 1 Гб + 1 Гб ≈ 2 Гб полезного пространства.\n* **Увеличение скорости:** параллельная запись и чтение блоков на оба диска ускоряет операции почти в 2 раза.\n* **Нулевая избыточность:** при выходе из строя любого из дисков разрушается весь массив и теряются все данные!\n\n---\n\n## 1. Разметка разделов через parted\n\nНа каждом накопителе (/dev/sdb и /dev/sdc) создается таблица разделов MBR и раздел на 100% объема с флагом `raid on`:\n```bash\nparted /dev/sdb --script mklabel msdos mkpart primary 1MiB 100% set 1 raid on\nparted /dev/sdc --script mklabel msdos mkpart primary 1MiB 100% set 1 raid on\n```\n\n---\n\n## 2. Создание и фиксация массива mdadm\n\n```bash\n# 1. Сборка массива уровня 0:\nmdadm --create /dev/md0 --level=0 --raid-devices=2 /dev/sdb1 /dev/sdc1\n\n# 2. Сканирование и запись метаданных в конфигурационный файл:\nmdadm --detail --scan >> /etc/mdadm.conf\n\n# 3. Создание файловой системы:\nmkfs.ext4 /dev/md0\n\n# 4. Настройка автомонтирования в /etc/fstab:\nmkdir /raid\necho \"/dev/md0 /raid ext4 defaults 0 0\" >> /etc/fstab\nmount -av\n```",
    "codeBlocks": [
      {
        "label": "Создание и фиксация RAID 0 на HQ-SRV",
        "code": "mdadm --create /dev/md0 --level=0 --raid-devices=2 /dev/sdb1 /dev/sdc1\nmdadm --detail --scan >> /etc/mdadm.conf\nmkfs.ext4 /dev/md0\necho \"/dev/md0 /raid ext4 defaults 0 0\" >> /etc/fstab\nmount -av"
      }
    ]
  },

  {
    "id": "m2-task-3",
    "module": "module-2",
    "moduleTitle": "Модуль №2",
    "moduleDescription": "Службы каталога и сервисы",
    "taskNumber": 3,
    "taskSlug": "m2-task-3",
    "number": 14,
    "title": "Задание №3: Сетевая файловая система NFS на HQ-SRV и HQ-CLI",
    "summary": "Протокол NFS, служба nfs-server, экспорт /etc/exports для подсети клиентов 192.168.2.0/27, проверка showmount и опция автомонтирования _netdev.",
    "content": "Сетевая файловая система **NFS (Network File System)** обеспечивает удалённый доступ к файловым ресурсам по локальной сети:\n\n---\n\n## 1. Параметры экспорта в /etc/exports (HQ-SRV)\n\n```text\n/raid/nfs 192.168.2.0/27(rw,no_subtree_check,no_root_squash)\n```\n* **`rw`:** полный доступ на чтение и запись.\n* **`no_subtree_check`:** отключение проверки поддеревьев (повышает скорость и надежность работы с файлами).\n* **`no_root_squash`:** сохранение привилегий суперпользователя root клиента на сервере.\n* **`192.168.2.0/27`:** ограничение доступа только подсетью рабочих станций HQ-CLI.\n\n---\n\n## 2. Параметры монтирования в /etc/fstab (HQ-CLI)\n\n```text\n192.168.1.10:/raid/nfs /mnt/nfs nfs rw,soft,_netdev 0 0\n```\n* **`soft`:** режим мягкой обработки ошибок (клиент не зависает при разрыве сетевого линка).\n* **`_netdev`:** гарантирует, что система попытается примонтировать сетевой том только после полной инициализации сетевых интерфейсов.",
    "codeBlocks": [
      {
        "label": "Экспорт NFS на HQ-SRV и монтирование на HQ-CLI",
        "code": "# HQ-SRV:\necho \"/raid/nfs 192.168.2.0/27(rw,no_subtree_check,no_root_squash)\" >> /etc/exports\nsystemctl enable --now nfs-server\n\n# HQ-CLI:\necho \"192.168.1.10:/raid/nfs /mnt/nfs nfs rw,soft,_netdev 0 0\" >> /etc/fstab\nmount -av"
      }
    ]
  },

  {
    "id": "m2-task-4",
    "module": "module-2",
    "moduleTitle": "Модуль №2",
    "moduleDescription": "Службы каталога и сервисы",
    "taskNumber": 4,
    "taskSlug": "m2-task-4",
    "number": 15,
    "title": "Задание №4: Служба сетевого времени Chrony на ISP",
    "summary": "Иерархия слоев Stratum в протоколе NTP, подсистема control chrony server, директивы pool prefer minstratum 4, local stratum 5 и утилита chronyc.",
    "content": "Служба **Chrony** обеспечивает синхронизацию системных часов узлов сети:\n\n---\n\n## 1. Архитектура уровней Stratum\n\n* **Stratum 0:** физические эталонные часы (атомные стандарты, GPS/ГЛОНАСС).\n* **Stratum 1–4:** вышестоящие пулы серверов интернета (`pool.ntp.org`).\n* **Stratum 5:** маршрутизатор **ISP**. За счёт директивы `local stratum 5` маршрутизатор объявляет себя доверенным источником даже при временном обрыве внешнего канала связи.\n* **Stratum 6:** внутренние клиенты (HQ-SRV, BR-RTR, BR-SRV, HQ-CLI).\n\n---\n\n## 2. Команды управления Chrony в ALT Linux\n\n```bash\n# 1. Открытие сокета NTP для обслуживания сети:\ncontrol chrony server\n\n# 2. Проверка источников синхронизации:\nchronyc sources\n# Символ ^* подтверждает, что источник выбран активным системным пиром!\n\n# 3. Просмотр детального статуса стратума:\nchronyc tracking\n```",
    "codeBlocks": [
      {
        "label": "Настройка сервера ISP и клиентов Chrony",
        "code": "# ISP:\ncontrol chrony server\nsed -i 's/#local stratum 10/local stratum 5/' /etc/chrony.conf\nsystemctl restart chronyd\n\n# Клиенты:\nsed -i 's/pool pool.ntp.org iburst/server 172.16.1.1 iburst/' /etc/chrony.conf\nsystemctl restart chronyd"
      }
    ]
  },

  {
    "id": "m2-task-5",
    "module": "module-2",
    "moduleTitle": "Модуль №2",
    "moduleDescription": "Службы каталога и сервисы",
    "taskNumber": 5,
    "taskSlug": "m2-task-5",
    "number": 16,
    "title": "Задание №5: Автоматизация с Ansible на сервере BR-SRV",
    "summary": "Безагентная архитектура Ansible, утилита sshpass, активация OpenSSH на порту 2026, параметры host_key_checking = False и ad-hoc модуль ping.",
    "content": "**Ansible** — безагентная (Agentless) система управления конфигурациями:\n* Не требует установки клиентских демонов на управляемые машины.\n* Управление выполняется через стандартный протокол SSH с вызовом интерпретатора Python.\n* Утилита **`sshpass`** позволяет передавать пароли учётных записей в сессию SSH в автоматическом неинтерактивном режиме.\n\n---\n\n## 1. Предварительное включение OpenSSH на порту 2026\n\nНа машинах HQ-RTR, BR-RTR и HQ-CLI служба OpenSSH настраивается на прослушивание порта 2026:\n```bash\ngrep -q \"^Port 2026\" /etc/openssh/sshd_config || sed -i '1i Port 2026' /etc/openssh/sshd_config\nsystemctl enable --now sshd\nsystemctl restart sshd\n```\n\n---\n\n## 2. Конфигурация Control Node на BR-SRV\n\nФайл **`/etc/ansible/ansible.cfg`**:\n```ini\n[defaults]\nhost_key_checking = False\ninterpreter_python = /usr/bin/python3\ninventory = /etc/ansible/hosts\n```\n\nФайл **`/etc/ansible/hosts`**:\n```ini\nHQ-SRV ansible_user=user ansible_password=resu ansible_port=2026\nHQ-RTR ansible_user=net_admin ansible_password=P@ssw0rd ansible_port=2026\nBR-RTR ansible_user=net_admin ansible_password=P@ssw0rd ansible_port=2026\nHQ-CLI ansible_user=user ansible_password=resu ansible_port=2026\n```\n\nКоманда проверки: `ansible all -m ping`.",
    "codeBlocks": [
      {
        "label": "Проверка инвентаря Ansible через ping-модуль",
        "code": "ansible all -m ping"
      }
    ]
  },

  {
    "id": "m2-task-6",
    "module": "module-2",
    "moduleTitle": "Модуль №2",
    "moduleDescription": "Службы каталога и сервисы",
    "taskNumber": 6,
    "taskSlug": "m2-task-6",
    "number": 17,
    "title": "Задание №6: Веб-приложение в Docker на сервере BR-SRV",
    "summary": "Docker Compose v2, монтирование Additional.iso, импорт tar-образов через docker load, именованный том db_data и имя контейнера tespapp.",
    "content": "Двухзвенный стек контейнеров развёртывается через современный плагин **Docker Compose v2**:\n\n---\n\n## 1. Архитектура сервисов docker-compose.yml\n\n* **СУБД (сервис database, контейнер `db`):** образ `mariadb:latest`, порт 3306, том `db_data:/var/lib/mysql`.\n* **Веб-приложение (сервис app, контейнер `tespapp`):** образ `site:latest`, проброс порта `8080:8000`, директива `depends_on: database`.\n\n> ⚠️ **Обратите внимание на имя:** контейнер приложения строго должен называться `tespapp` (по регламенту задания).\n\n---\n\n## 2. Персистентность данных (Docker Volumes)\n\nИменованный том **`db_data`** сохраняет файлы базы данных на хосте. При принудительной остановке и удалении контейнеров:\n```bash\ndocker rm -f $(docker ps -qa)\ndocker compose up -d\n```\nвсе ранее внесенные записи в СУБД сохраняются в полном объеме.",
    "codeBlocks": [
      {
        "label": "Запуск и проверка стека Docker Compose",
        "code": "docker compose up -d\ndocker ps\nss -ltnp4 | grep 8080"
      }
    ]
  },

  {
    "id": "m2-task-7",
    "module": "module-2",
    "moduleTitle": "Модуль №2",
    "moduleDescription": "Службы каталога и сервисы",
    "taskNumber": 7,
    "taskSlug": "m2-task-7",
    "number": 18,
    "title": "Задание №7: Веб-приложение Apache + MariaDB на сервере HQ-SRV",
    "summary": "Стек LAMP в ALT Linux (служба httpd2.service), метапакет lamp-server, импорт дампа dump.sql и настройка подключения index.php.",
    "content": "Классический веб-стек **LAMP (Linux, Apache, MariaDB, PHP)** на сервере HQ-SRV:\n\n---\n\n## 1. Особенности стека в ALT Linux\n\n* Пакет и служба веб-сервера Apache называются **`httpd2`** (`httpd2.service`).\n* Метапакет **`lamp-server`** устанавливает сразу Apache, интерпретатор PHP с расширениями `php-mysqli` и сервер СУБД MariaDB.\n* Корневая директория размещения веб-контента: **`/var/www/html/`**.\n\n---\n\n## 2. База данных и приложение\n\n1. Создание БД и пользователя:\n   ```sql\n   CREATE DATABASE webdb;\n   CREATE USER 'web'@'localhost' IDENTIFIED BY 'P@ssw0rd';\n   GRANT ALL PRIVILEGES ON webdb.* TO 'web'@'localhost';\n   FLUSH PRIVILEGES;\n   ```\n2. Импорт дампа:\n   ```bash\n   mariadb webdb < /mnt/web/dump.sql\n   ```\n3. Реквизиты подключения в `/var/www/html/index.php`:\n   `$servername = \"localhost\"; $username = \"web\"; $password = \"P@ssw0rd\"; $dbname = \"webdb\";`",
    "codeBlocks": [
      {
        "label": "Установка и активация стека LAMP на HQ-SRV",
        "code": "apt-get install lamp-server -y\nsystemctl enable --now mariadb httpd2.service\nmariadb webdb < /mnt/web/dump.sql"
      }
    ]
  },

  {
    "id": "m2-task-8",
    "module": "module-2",
    "moduleTitle": "Модуль №2",
    "moduleDescription": "Службы каталога и сервисы",
    "taskNumber": 8,
    "taskSlug": "m2-task-8",
    "number": 19,
    "title": "Задание №8: Статический проброс портов (DNAT) на роутерах",
    "summary": "Destination NAT в nftables, цепочка prerouting таблицы nat, приоритет dstnat, проброс портов 8080 и 2026 и проверка с узла ISP.",
    "content": "**Destination NAT (DNAT / Port Forwarding)** подменяет адрес и порт назначения входящих извне пакетов:\n\n---\n\n## 1. Синтаксис цепочек prerouting в nftables\n\n```bash\nnft add chain nat prerouting { type nat hook prerouting priority dstnat \\; }\n```\nХук `prerouting` срабатывает до принятия решения о маршрутизации. Пакеты, адресованные внешнему интерфейсу роутера (`iif \"enp7s1\"`), перенаправляются на целевые адреса внутренних серверов.\n\n---\n\n## 2. Правила проброса на роутерах\n\n* **HQ-RTR:**\n  ```bash\n  nft add rule nat prerouting iif \"enp7s1\" tcp dport 2026 dnat to 192.168.1.10\n  nft add rule nat prerouting iif \"enp7s1\" tcp dport 8080 dnat to 192.168.1.10:80\n  ```\n* **BR-RTR (набор портов set):**\n  ```bash\n  nft add rule nat prerouting iif \"enp7s1\" tcp dport { 8080, 2026 } dnat to 192.168.3.10\n  ```\n* **Фиксация конфигурации:**\n  ```bash\n  nft list ruleset > /etc/nftables/nftables.nft\n  systemctl restart nftables\n  ```",
    "codeBlocks": [
      {
        "label": "Правила DNAT в nftables",
        "code": "nft add chain nat prerouting { type nat hook prerouting priority dstnat \\; }\nnft add rule nat prerouting iif \"enp7s1\" tcp dport 8080 dnat to 192.168.1.10:80\nnft list ruleset > /etc/nftables/nftables.nft"
      }
    ]
  },

  {
    "id": "m2-task-9",
    "module": "module-2",
    "moduleTitle": "Модуль №2",
    "moduleDescription": "Службы каталога и сервисы",
    "taskNumber": 9,
    "taskSlug": "m2-task-9",
    "number": 20,
    "title": "Задание №9: Обратный прокси-сервер Nginx на ISP",
    "summary": "Архитектура Reverse Proxy, маршрутизация по server_name, директива proxy_pass, проксирование заголовков Host и X-Real-IP.",
    "content": "**Обратный прокси-сервер (Reverse Proxy)** принимает запросы клиентов на стандартный порт 80 и маршрутизирует их на внутренние филиалы:\n\n---\n\n## 1. Разделение сайтов по server_name\n\nВ конфигурации `/etc/nginx/sites-available.d/r-proxy.conf`:\n* **web.au-team.irpo:** пересылается на `http://172.16.1.10:8080` (через DNAT на HQ-RTR попадает в Apache на HQ-SRV). Включена базовая аутентификация `auth_basic`.\n* **docker.au-team.irpo:** пересылается на `http://172.16.2.10:8080` (через DNAT на BR-RTR попадает в контейнер tespapp на BR-SRV).\n\n---\n\n## 2. Активация виртуальных хостов в ALT Linux\n\n```bash\nln -s /etc/nginx/sites-available.d/r-proxy.conf /etc/nginx/sites-enabled.d/\nnginx -t\nsystemctl enable --now nginx\n```",
    "codeBlocks": [
      {
        "label": "Конфигурация Reverse Proxy в Nginx",
        "code": "server {\n    listen 80;\n    server_name docker.au-team.irpo;\n    location / {\n        proxy_pass http://172.16.2.10:8080;\n        proxy_set_header Host $host;\n    }\n}"
      }
    ]
  },

  {
    "id": "m2-task-10",
    "module": "module-2",
    "moduleTitle": "Модуль №2",
    "moduleDescription": "Службы каталога и сервисы",
    "taskNumber": 10,
    "taskSlug": "m2-task-10",
    "number": 21,
    "title": "Задание №10: Web-аутентификация в Nginx (.htpasswd)",
    "summary": "Протокол HTTP Basic Authentication (RFC 7617), утилита apache2-htpasswd, хэширование паролей APR1, директивы auth_basic и auth_basic_user_file.",
    "content": "**HTTP Basic Authentication** ограничивает доступ к веб-странице на уровне протокола HTTP:\n\n---\n\n## 1. Процедура авторизации\n\n1. При первом обращении Nginx отвечает кодом **`401 Unauthorized`** с заголовком `WWW-Authenticate: Basic realm=\"Restricted Access\"`.\n2. Браузер перехватывает ответ и отображает диалоговое окно логина и пароля.\n3. Клиент передает учетные данные в заголовке `Authorization: Basic <base64>`.\n4. Сервер сверяет хэш пароля с файлом `/etc/nginx/.htpasswd`.\n\n---\n\n## 2. Утилита htpasswd в ALT Linux\n\nПакет в ALT Linux: **`apache2-htpasswd`**.\n```bash\napt-get install apache2-htpasswd -y\n\n# Создание файла (-c) в неинтерактивном пакетном режиме (-b):\nhtpasswd -b -c /etc/nginx/.htpasswd WEB P@ssw0rd\n\n# Перезапуск службы:\nnginx -t && systemctl restart nginx\n```",
    "codeBlocks": [
      {
        "label": "Создание .htpasswd и перезапуск Nginx",
        "code": "htpasswd -b -c /etc/nginx/.htpasswd WEB P@ssw0rd\nnginx -t && systemctl restart nginx"
      }
    ]
  },

  {
    "id": "m2-task-11",
    "module": "module-2",
    "moduleTitle": "Модуль №2",
    "moduleDescription": "Службы каталога и сервисы",
    "taskNumber": 11,
    "taskSlug": "m2-task-11",
    "number": 22,
    "title": "Задание №11: Установка Яндекс Браузера на HQ-CLI",
    "summary": "Пакет yandex-browser-stable в репозиториях ALT Linux, проверка rpm -qa, запуск из GUI (XFCE/MATE) и обязательные материалы экзаменационного отчета.",
    "content": "На рабочей станции **HQ-CLI** устанавливается отечественный **«Яндекс Браузер»**:\n\n---\n\n## 1. Установка из репозиториев ALT Linux\n\n```bash\napt-get update\napt-get install yandex-browser-stable -y\n```\nПакет автоматически регистрирует ярлык запуска в меню приложений (категория «Интернет» / «Сеть»).\n\n---\n\n## 2. Требования к оформлению отчета\n\nПо регламенту экзамена: *«Установку браузера отметьте в отчёте»*:\n1. Текстовый вывод команды проверки пакета в RPM-базе:\n   ```bash\n   rpm -qa | grep yandex-browser\n   ```\n2. Скриншот окна браузера со страницей «О программе» (Меню → Справка → О браузере) либо скриншот с открытым сайтом `http://web.au-team.irpo/`.",
    "codeBlocks": [
      {
        "label": "Проверка установки Яндекс Браузера",
        "code": "rpm -qa | grep yandex-browser\nwhich yandex-browser-stable\nyandex-browser-stable --version"
      }
    ]
  },
  // =========================================================================
  // МОДУЛЬ 3 (ЗАДАНИЯ 1 - 10)
  // =========================================================================
{
  "id": "m3-task-1",
  "module": "module-3",
  "moduleTitle": "Модуль №3",
  "moduleDescription": "Информационная безопасность и расширенные сервисы",
  "taskNumber": 1,
  "taskSlug": "m3-task-1",
  "number": 23,
  "title": "Задание №1: Импорт пользователей в домен au-team.irpo",
  "summary": "Автоматизированный пакетный импорт пользователей в Samba DC из CSV, нормализация кодировок (iconv), создание подразделений (OU) и проверка входа через GUI на HQ-CLI.",
  "content": "В корпоративных инфраструктурах ручное заведение десятков и сотен учетных записей неэффективно и чревато ошибками. Для этого используются скрипты автоматизированного импорта на базе **samba-tool** и структурированных файлов CSV.\n\n---\n\n## 1. Обработка файлов и нормализация кодировки\n\nФайлы выгрузки (например, из 1C или кадровых систем) часто содержат невидимые служебные байты:\n* **UTF-8 BOM (Byte Order Mark, `\\xEF\\xBB\\xBF`):** приводит к тому, что первое поле первой строки воспринимается со сбоями.\n* Символы возврата каретки Windows (`\\r`, CRLF).\n\nДля гарантированной очистки используется утилита **iconv**:\n```bash\niconv -f UTF-8 -t UTF-8//IGNORE /mnt/Users.csv > /root/users_fix.csv\n```\nФлаг `//IGNORE` отбрасывает любые невалидные последовательности байтов.\n\n---\n\n## 2. Разбор логики скрипта import.sh\n\n```bash\nwhile IFS=';' read -r name fam role phone ou street zip city country pass; do\n  username=\"${fam}.${name:0:1}\"\n  samba-tool user create \"${username,,}\" \"P@ssw0rd1\" \\\n    --given-name=\"$fam\" --surname=\"$name\" \\\n    --job-title=\"$role\" --telephone-number=\"$phone\"\n  [[ -n \"$ou\" ]] && samba-tool ou create \"OU=$ou\" 2>/dev/null\n  [[ -n \"$ou\" ]] && samba-tool user move \"${username,,}\" \"OU=$ou\" 2>/dev/null\ndone < /root/users_fix.csv\n```\n\n* **`IFS=';'`**: внутренний разделитель полей bash, задающий точку с запятой.\n* **`${name:0:1}`**: извлечение подстроки — 1 символ имени, начиная с нулевого смещения.\n* **`${username,,}`**: синтаксис bash 4+ для перевода строки строго в нижний регистр.\n* **`2>/dev/null`**: подавление вывода ошибок (если OU уже создано на предыдущей итерации цикла).\n\n---\n\n## 3. Диагностика и проверка учетных записей\n\n* Просмотр списка всех пользователей: `samba-tool user list`\n* Подробные атрибуты конкретной учетной записи: `samba-tool user show ivanov.i`",
  "codeBlocks": [
    {
      "label": "Скрипт импорта пользователей в Samba DC",
      "code": "iconv -f UTF-8 -t UTF-8//IGNORE /mnt/Users.csv > /root/users_fix.csv\ncat << \"EOF\" > /root/import.sh\n#!/bin/bash\nwhile IFS=';' read -r name fam role phone ou street zip city country pass; do\nusername=\"$fam\".\"${name:0:1}\"\nsamba-tool user create \"${username,,}\" \"P@ssw0rd1\" --given-name=\"$fam\" --surname=\"$name\" --job-title=\"$role\" --telephone-number=\"$phone\"\n[[ -n \"$ou\" ]] && samba-tool ou create \"OU=$ou\" 2>/dev/null\n[[ -n \"$ou\" ]] && samba-tool user move \"${username,,}\" \"OU=$ou\" 2>/dev/null\ndone < /root/users_fix.csv\nEOF\nbash /root/import.sh"
    }
  ]
},

{
  "id": "m3-task-2",
  "module": "module-3",
  "moduleTitle": "Модуль №3",
  "moduleDescription": "Информационная безопасность и расширенные сервисы",
  "taskNumber": 2,
  "taskSlug": "m3-task-2",
  "number": 24,
  "title": "Задание №2: Настройка центра сертификации ГОСТ и HTTPS в Nginx",
  "summary": "Отечественные криптографические алгоритмы ГОСТ Р 34.12-2015 и 34.11-2012, openssl-gost-engine, выпуск сертификатов на 30 дней, СКЗИ КриптоПро CSP на клиенте.",
  "content": "В рамках требований безопасности критической информационной инфраструктуры (КИИ) РФ веб-сервисы переводятся на использование криптографических стандартов **ГОСТ**.\n\n---\n\n## 1. Модуль ГОСТ-движка OpenSSL (openssl-gost-engine)\n\nСтандартный OpenSSL не поддерживает алгоритмы ГОСТ «из коробки». В ALT Linux устанавливается и активируется специальный модуль расширения:\n```bash\napt-get install openssl openssl-engines openssl-gost-engine -y\ncontrol openssl-gost enabled\nopenssl engine\n```\nАлгоритм открытого ключа: **`gost2012_256`** (ГОСТ Р 34.10-2012 с длиной ключа 256 бит).\nХэш-функция: **`md_gost12_256`** (Стрибог, ГОСТ Р 34.11-2012).\n\n---\n\n## 2. Центр сертификации и выпуск сертификатов\n\n1. **Корневой CA:** создается закрытый ключ и самоподписанный сертификат сроком действия 90 дней с Common Name: `ROOT-CA.AU-TEAM.IRPO`.\n2. **Серверные сертификаты:** создаются ключи и запросы (CSR), после чего корневой CA подписывает их **строго на 30 дней**:\n   ```bash\n   openssl x509 -req -in web.au-team.irpo.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out web.au-team.irpo.crt -days 30\n   ```\n\n---\n\n## 3. Настройка Nginx и СКЗИ КриптоПро CSP\n\nВ Nginx активируются ГОСТ-шифры:\n```nginx\nssl_ciphers GOST2012-GOST8912-GOST8912;\nssl_protocols TLSv1.2;\nssl_prefer_server_ciphers on;\n```\nНа клиентской машине HQ-CLI корневой сертификат копируется в `/etc/pki/ca-trust/source/anchors/`, выполняется `update-ca-trust extract`, а в СКЗИ «КриптоПро CSP» обеспечивается доверие сертификату.",
  "codeBlocks": [
    {
      "label": "Генерация ключа и сертификата ГОСТ на 30 дней",
      "code": "openssl genpkey -algorithm gost2012_256 -pkeyopt paramset:A -out web.au-team.irpo.key\nopenssl req -new -md_gost12_256 -key web.au-team.irpo.key -out web.au-team.irpo.csr\nopenssl x509 -req -in web.au-team.irpo.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out web.au-team.irpo.crt -days 30"
    }
  ]
},

{
  "id": "m3-task-3",
  "module": "module-3",
  "moduleTitle": "Модуль №3",
  "moduleDescription": "Информационная безопасность и расширенные сервисы",
  "taskNumber": 3,
  "taskSlug": "m3-task-3",
  "number": 25,
  "title": "Задание №3: Защищённый шифрованный IP-туннель OpenVPN и OSPF",
  "summary": "Замена открытого туннеля GRE на защищенный L3 OpenVPN с предварительным ключом (static.key) и шифрованием AES-256-CBC, переключение интерфейса в FRR OSPF.",
  "content": "Протокол **GRE** (Generic Routing Encapsulation) обеспечивает инкапсуляцию сетевых пакетов, но не предоставляет шифрования данных. При прохождении через сеть провайдера трафик уязвим для перехвата.\n\n---\n\n## 1. Режим OpenVPN Point-to-Point со Static Key\n\nДля межсетевого объединения двух офисных маршрутизаторов оптимален режим P2P со статическим ключом:\n* Не требует развертывания сложной инфраструктуры открытых ключей (PKI/CA).\n* Использует симметричное шифрование **AES-256-CBC**.\n* Создает L3-интерфейс **`tun0`**, полностью прозрачный для протокола динамической маршрутизации OSPF.\n\nГенерация ключа на HQ-RTR:\n```bash\nopenvpn --genkey secret /etc/openvpn/keys/static.key\nchmod og-rw /etc/openvpn/keys/static.key\n```\n\n---\n\n## 2. Конфигурация tun0 и удаление GRE\n\n* На HQ-RTR (сервер): IP `192.168.5.1`, peer `192.168.5.2`.\n* На BR-RTR (клиент): IP `192.168.5.2`, peer `192.168.5.1`, `remote 172.16.1.10`.\n* Старый интерфейс `/etc/net/ifaces/gre1/` удаляется, чтобы предотвратить дублирование маршрутов.\n\n---\n\n## 3. Обновление динамической маршрутизации FRR OSPF\n\nВ конфигурации `/etc/frr/frr.conf` выполняется замена интерфейса:\n```bash\nsed -i 's/interface gre1/interface tun0/' /etc/frr/frr.conf\nsystemctl restart frr\n```\nПроверка соседства: `vtysh -c \"show ip ospf neighbor\"` (статус `Full/-`).",
  "codeBlocks": [
    {
      "label": "Конфигурация сервера OpenVPN /etc/openvpn/server/tun0.conf",
      "code": "dev tun0\ncipher AES-256-CBC\nauth-nocache\nifconfig 192.168.5.1 192.168.5.2\nsecret /etc/openvpn/keys/static.key"
    }
  ]
},

{
  "id": "m3-task-4",
  "module": "module-3",
  "moduleTitle": "Модуль №3",
  "moduleDescription": "Информационная безопасность и расширенные сервисы",
  "taskNumber": 4,
  "taskSlug": "m3-task-4",
  "number": 26,
  "title": "Задание №4: Межсетевой экран nftables на маршрутизаторах HQ-RTR и BR-RTR",
  "summary": "Подсистема пакетной фильтрации nftables, таблица inet filter, хук input, отслеживание состояний conntrack, белые списки протоколов и изоляция внешнего IPv4.",
  "content": "**nftables** — современный высокопроизводительный фреймворк фильтрации пакетов в ядре Linux, пришедший на смену iptables/ip6tables. Он объединяет работу с IPv4 и IPv6 в единое семейство адресов **`inet`**.\n\n---\n\n## 1. Структура таблицы inet filter\n\nКонфигурация добавляется в начало файлов `/etc/nftables/hq-rtr.nft` и `/etc/nftables/br-rtr.nft`:\n```text\ntable inet filter {\n    chain input {\n        type filter hook input priority filter;\n        ...\n    }\n}\n```\nХук **`input`** перехватывает все пакеты, предназначенные непосредственно локальному маршрутизатору.\n\n---\n\n## 2. Разбор ключевых правил\n\n* **`ct state {established, related} accept;`** — разрешает ответы на уже установленные соединения, инициированные маршрутизатором или прошедшие через него.\n* **`udp dport 53`**, **`tcp dport 80, 443`**, **`tcp dport 123`** — разрешение легитимных протоколов DNS, HTTP, HTTPS, NTP.\n* **`ip protocol {gre, icmp, ospf}`** и **`udp dport 500`** — разрешение межсетевых туннелей, ICMP-диагностики, OSPF-маршрутизации и IPsec IKE.\n* **`ip saddr {192.168.100.0/27, 192.168.200.0/28, 192.168.30.0/28} accept;`** — полный доступ из доверенных офисных сегментов.\n* **`ip version 4 drop;`** — сброс всех остальных входящих пакетов из недоверенной сети Интернет.\n\nПросмотр активных правил: `nft list ruleset`.",
  "codeBlocks": [
    {
      "label": "Таблица inet filter в /etc/nftables/hq-rtr.nft",
      "code": "table inet filter {\n    chain input {\n        type filter hook input priority filter;\n        udp dport 53 accept;\n        tcp dport 80 accept;\n        tcp dport 443 accept;\n        tcp dport 123 accept;\n        ct state {established, related} accept;\n        ip protocol gre accept;\n        ip protocol icmp accept;\n        ip protocol ospf accept;\n        udp dport 500 accept;\n        ip saddr 192.168.100.0/27 accept;\n        ip saddr 192.168.200.0/28 accept;\n        ip saddr 192.168.30.0/28 accept;\n        ip version 4 drop;\n    }\n}"
    }
  ]
},

{
  "id": "m3-task-5",
  "module": "module-3",
  "moduleTitle": "Модуль №3",
  "moduleDescription": "Информационная безопасность и расширенные сервисы",
  "taskNumber": 5,
  "taskSlug": "m3-task-5",
  "number": 27,
  "title": "Задание №5: Настройка принт-сервера CUPS",
  "summary": "Служба печати Common Unix Printing System (CUPS), порт 631, виртуальный PDF-принтер cups-pdf, сетевой доступ и подключение из GUI на HQ-CLI.",
  "content": "**CUPS (Common Unix Printing System)** — стандартная модульная система управления печатью для Unix-подобных операционных систем, использующая протокол **IPP (Internet Printing Protocol)**.\n\n---\n\n## 1. Установка и сетевой доступ\n\nВ ALT Linux устанавливаются пакеты `cups` и `cups-pdf` (виртуальный принтер, преобразующий задания печати в файлы PDF):\n```bash\napt-get install cups cups-pdf -y\n```\nПо умолчанию демон слушает только локальный интерфейс: `Listen localhost:631`. Для сетевого использования адрес заменяется на интерфейс сервера:\n```text\nListen 192.168.1.10:631\n```\n\n---\n\n## 2. Разграничение доступа в cupsd.conf\n\nДля публикации принтеров и разрешения удаленного доступа клиентским машинам в секции `<Location />`, `<Location /admin>` и `<Location /admin/conf>` добавляются директивы:\n```text\nOrder allow,deny\nAllow all\n```\n\n---\n\n## 3. Диагностика и подключение\n\n* Проверка прослушивания сокета: `ss -ltnp4 | grep 631`\n* На рабочей станции HQ-CLI в графической панели «Параметры печати» выбирается «Поиск сетевого принтера» по IP-адресу `192.168.1.10`.",
  "codeBlocks": [
    {
      "label": "Настройка /etc/cups/cupsd.conf и перезапуск",
      "code": "sed -i 's/Listen localhost:631/Listen 192.168.1.10:631/' /etc/cups/cupsd.conf\nsystemctl enable --now cups\nsystemctl restart cups\nss -ltnp4 | grep 631"
    }
  ]
},

{
  "id": "m3-task-6",
  "module": "module-3",
  "moduleTitle": "Модуль №3",
  "moduleDescription": "Информационная безопасность и расширенные сервисы",
  "taskNumber": 6,
  "taskSlug": "m3-task-6",
  "number": 28,
  "title": "Задание №6: Централизованное логирование rsyslog и ротация logrotate",
  "summary": "Централизованный сбор системных событий по протоколу Syslog, связка systemd-journald и rsyslog, фильтр *.warn, динамические пути /opt/%HOSTNAME%/ и еженедельный logrotate.",
  "content": "Централизованный сбор логов критически важен для аудита информационной безопасности, обнаружения инцидентов и расследования сбоев сетевой инфраструктуры.\n\n---\n\n## 1. Настройка клиентов (HQ-RTR, BR-RTR, BR-SRV)\n\n1. Включается форвардинг событий не ниже уровня **warning** из `journald` в `syslog`:\n   ```text\n   ForwardToSyslog=yes\n   MaxLevelSyslog=warning\n   ```\n2. В `/etc/rsyslog.d/00_common.conf` раскомментируются модули `imjournal` и `imuxsock`.\n3. Создается правило пересылки на сервер: `echo \"*.warn @192.168.1.10\" > /etc/rsyslog.d/10_to_server.conf`.\n\n---\n\n## 2. Настройка сервера сбора логов HQ-SRV\n\n1. Устанавливается модуль прослушивания сети: `rsyslog-classic rsyslog-server-listen`.\n2. Создается динамический шаблон сохранения:\n   ```text\n   $template DynFile,\"/opt/%HOSTNAME%/%PROGRAMNAME%.log\"\n   *.* ?DynFile\n   & stop\n   ```\n3. Сервер изолируется от записи собственных логов в `/opt` путем комментирования модуля `imuxsock` в `/etc/rsyslog.d/10_classic.conf`.\n\n---\n\n## 3. Ротация логов logrotate и cron\n\nДля предотвращения переполнения диска настраивается еженедельная ротация:\n```text\n/opt/**/*.log {\n    weekly\n    missingok\n    notifempty\n    compress\n    minsize 10M\n}\n```\nВ `crontab` суперпользователя добавляется запуск: `0 0 * * 0 /usr/sbin/logrotate /etc/logrotate.d/rsyslog`.",
  "codeBlocks": [
    {
      "label": "Шаблон распределения логов на HQ-SRV",
      "code": "cat << \"EOF\" > /etc/rsyslog.d/91_template.conf\n$template DynFile,\"/opt/%HOSTNAME%/%PROGRAMNAME%.log\"\n*.* ?DynFile\n& stop\nEOF\nsystemctl restart rsyslogd"
    }
  ]
},

{
  "id": "m3-task-7",
  "module": "module-3",
  "moduleTitle": "Модуль №3",
  "moduleDescription": "Информационная безопасность и расширенные сервисы",
  "taskNumber": 7,
  "taskSlug": "m3-task-7",
  "number": 29,
  "title": "Задание №7: Мониторинг устройств с помощью открытого ПО",
  "summary": "Стек мониторинга Prometheus + Node Exporter + Grafana, pull-модель сбора метрик, DNS CNAME mon, популярный дашборд 1860 для визуализации CPU, RAM и дисков.",
  "content": "Современный мониторинг Linux-инфраструктуры строится на открытом стеке **Prometheus** (сервер сбора метрик с time-series БД) и **Grafana** (веб-визуализация).\n\n---\n\n## 1. Архитектура решения\n\n* **Node Exporter (порт TCP 9100):** легковесный агент, опрашивающий метрики ОС ядра Linux (`/proc`, `/sys`).\n* **Prometheus (порт TCP 9090):** периодически опрашивает агенты (pull-модель) с заданным интервалом `scrape_interval: 5s`.\n* **Grafana (порт TCP 3000):** выполняет PromQL-запросы к Prometheus и строит интерактивные графики.\n\n---\n\n## 2. Конфигурация Prometheus targets\n\nВ `/etc/prometheus/prometheus.yml` добавляются целевые узлы:\n```yaml\nscrape_configs:\n  - job_name: 'prometheus'\n    static_configs:\n      - targets: ['localhost:9090']\n  - job_name: hq-srv\n    static_configs:\n      - targets: ['192.168.1.10:9100']\n  - job_name: br-srv\n    static_configs:\n      - targets: ['192.168.3.10:9100']\n```\n\n---\n\n## 3. Сетевые имена и дашборд 1860\n\n* В DNS Samba создается CNAME-запись: `mon.au-team.irpo -> hq-srv.au-team.irpo`.\n* В Grafana подключается источник Prometheus (`http://192.168.1.10:9090`).\n* Импортируется официальный дашборд **1860 (Node Exporter Full)**, предоставляющий готовые панели загрузки CPU, RAM, I/O и сетевого трафика.",
  "codeBlocks": [
    {
      "label": "Добавление CNAME-записи mon в Samba DNS",
      "code": "samba-tool dns add br-srv.au-team.irpo au-team.irpo mon CNAME hq-srv.au-team.irpo -U Administrator\nsamba-tool dns query br-srv.au-team.irpo au-team.irpo mon CNAME -U administrator"
    }
  ]
},

{
  "id": "m3-task-8",
  "module": "module-3",
  "moduleTitle": "Модуль №3",
  "moduleDescription": "Информационная безопасность и расширенные сервисы",
  "taskNumber": 8,
  "taskSlug": "m3-task-8",
  "number": 30,
  "title": "Задание №8: Инвентаризация рабочих мест через Ansible на BR-SRV",
  "summary": "Автоматизация сбора параметров узлов через Ansible facts, структура плейбуков YAML, директива delegate_to: localhost и генерация отчетов в каталоге PC-INFO.",
  "content": "**Ansible** — инструмент безагентной автоматизации конфигураций, использующий существующий транспорт SSH и язык разметки YAML.\n\n---\n\n## 1. Механизм сбора фактов (gather_facts)\n\nПри выполнении плейбука с параметром `gather_facts: true` Ansible автоматически запускает модуль **setup**, опрашивающий систему целевого хоста:\n* **`ansible_hostname`**: короткое имя машины.\n* **`ansible_default_ipv4.address`**: основной IP-адрес шлюза/интерфейса.\n* **`ansible_memtotal_mb`**, **`ansible_processor_vcpus`**: аппаратные характеристики.\n\n---\n\n## 2. Создание отчетов на локальном управляющем узле\n\nОбычно задачи в Ansible выполняются на удаленных узлах из секции `hosts`. Чтобы сохранить файл отчета на сервере управления (BR-SRV), применяется директива **`delegate_to: localhost`**:\n```yaml\n- name: \"Creating a data file\"\n  copy:\n    dest: /etc/ansible/PC-INFO/{{ ansible_hostname }}.yml\n    content: |\n      Hostname: {{ ansible_hostname }}\n      IP_Address: {{ ansible_default_ipv4.address }}\n  delegate_to: localhost\n```\n\n---\n\n## 3. Валидация и запуск\n\n* Проверка синтаксиса: `ansible-playbook --syntax-check get_hostname_address.yml`\n* Выполнение: `ansible-playbook get_hostname_address.yml`\n* Проверка файлов: `cat /etc/ansible/PC-INFO/hq-srv.yml`",
  "codeBlocks": [
    {
      "label": "Плейбук инвентаризации get_hostname_address.yml",
      "code": "cat << \"EOF\" > /etc/ansible/get_hostname_address.yml\n---\n- name: \"Get data from hosts\"\n  gather_facts: true\n  hosts:\n    - HQ-SRV\n    - HQ-CLI\n  tasks:\n    - name: \"Creating a data file\"\n      copy:\n        dest: /etc/ansible/PC-INFO/{{ ansible_hostname }}.yml\n        content: |\n          Hostname: {{ ansible_hostname }}\n          IP_Address: {{ ansible_default_ipv4.address }}\n      delegate_to: localhost\nEOF\nansible-playbook --syntax-check /etc/ansible/get_hostname_address.yml"
    }
  ]
},

{
  "id": "m3-task-9",
  "module": "module-3",
  "moduleTitle": "Модуль №3",
  "moduleDescription": "Информационная безопасность и расширенные сервисы",
  "taskNumber": 9,
  "taskSlug": "m3-task-9",
  "number": 31,
  "title": "Задание №9: Защита службы SSH с помощью Fail2ban на HQ-SRV",
  "summary": "Предотвращение атак перебора паролей (Brute Force), изолятор sshd в jail.d, интеграция с systemd-journald через python3-module-systemd, временная блокировка на 1 минуту.",
  "content": "**Fail2ban** сканирует журналы системных служб на наличие признаков атак перебора аутентификации и автоматически модифицирует правила межсетевого экрана (nftables/iptables), временно блокируя подозрительные IP-адреса.\n\n---\n\n## 1. Интеграция с systemd-journald в ALT Linux\n\nВ современных системах без классического `syslog.log` логи ведутся в бинарном журнале systemd. Для чтения логов напрямую из журнала устанавливается модуль:\n```bash\napt-get install fail2ban python3-module-systemd -y\nsed -i 's/before = paths-altlinux.conf/before = paths-altlinux-systemd.conf/' /etc/fail2ban/jail.conf\n```\n\n---\n\n## 2. Настройка изолятора /etc/fail2ban/jail.d/sshd.conf\n\n```ini\n[sshd]\nenabled = true\nport = 2026\nfilter = sshd\nbackend = systemd\nmaxretry = 3\nbantime = 1m\n```\n\n* **`port = 2026`**: нестандартный порт SSH, настроенный в Модуле №1.\n* **`backend = systemd`**: эффективное чтение событий OpenSSH из сокета журнала.\n* **`maxretry = 3`**: лимит неудачных попыток входа до срабатывания защиты.\n* **`bantime = 1m`**: время действия временной блокировки (1 минута).\n\n---\n\n## 3. Управление и статус\n\n* Просмотр заблокированных адресов: `fail2ban-client status sshd`\n* Ручной разбан (при необходимости): `fail2ban-client set sshd unbanip <IP>`",
  "codeBlocks": [
    {
      "label": "Конфигурация изолятора sshd",
      "code": "cat << \"EOF\" > /etc/fail2ban/jail.d/sshd.conf\n[sshd]\nenabled = true\nport = 2026\nfilter = sshd\nbackend = systemd\nmaxretry = 3\nbantime = 1m\nEOF\nsystemctl enable --now fail2ban\nfail2ban-client status sshd"
    }
  ]
},

{
  "id": "m3-task-10",
  "module": "module-3",
  "moduleTitle": "Модуль №3",
  "moduleDescription": "Информационная безопасность и расширенные сервисы",
  "taskNumber": 10,
  "taskSlug": "m3-task-10",
  "number": 32,
  "title": "Задание №10: Резервное копирование данных HQ-SRV на узел хранения HQ-CLI",
  "summary": "Отечественная СРК «Кибер Бэкап» 17.4, модуль ядра snapapi, Management Server (порт 9877) и Storage Node, организация irpo, планы бэкапа etc_backup и webdb_backup.",
  "content": "**«Кибер Бэкап»** (ранее Acronis Защита Данных) — ведущее отечественное решение резервного копирования и восстановления данных корпоративного уровня, включенное в реестр отечественного ПО.\n\n---\n\n## 1. Архитектура компонентов\n\n* **Сервер управления (Management Server):** центральный узел координации, хранящий БД политик и предоставляющий веб-консоль управления по защищенному протоколу HTTPS (порт **TCP 9877**).\n* **Агент для Linux (snapapi):** драйвер ядра для создания консистентных «горячих» снимков файловой системы. Требует сборки под актуальное ядро (`kernel-source-6.1`, `gcc`, `make`).\n* **Узел хранения (Storage Node):** выделенный сервер/машина (HQ-CLI), принимающий и архивирующий резервные копии в каталог `/backup` (хранилище `backup_dir`).\n* **Агент СУБД MySQL/MariaDB:** осуществляет консистентное копирование баз данных без остановки сервиса.\n\n---\n\n## 2. Веб-консоль и планы резервного копирования\n\n1. Доступ к панели: `https://hq-srv.au-team.irpo:9877` (учетные данные: `root` / `toor`).\n2. Создается организация **`irpo`**, в которую добавляется администратор **`irpoadmin`** (пароль `P@ssw0rd`).\n3. Регистрируется узел хранения на HQ-CLI с путем к локальной папке `/backup`.\n4. Настраиваются два плана защиты для сервера HQ-SRV:\n   * **`etc_backup`**: резервное копирование конфигурационной директории `/etc`.\n   * **`webdb_backup`**: консистентное резервное копирование экземпляра СУБД MySQL/MariaDB.",
  "codeBlocks": [
    {
      "label": "Подготовка ядра и установка Management Server на HQ-SRV",
      "code": "apt-get update && apt-get install kernel-source-6.1 kernel-headers-modules-un-def gcc make kmod-sign -y\nupdate-kernel -y\nuseradd irpoadmin && echo \"P@ssw0rd\" | passwd --stdin irpoadmin 2>/dev/null || passwd irpoadmin\n/mnt/cyberbackup_17.4.36200.x86_64 --skip-prereq-check --nodeps"
    }
  ]
},
];
