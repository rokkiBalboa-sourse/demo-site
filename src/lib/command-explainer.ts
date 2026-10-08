export interface CommandFlagExplanation {
  flag: string;
  name: string;
  description: string;
  whyNeeded: string;
}

export interface SingleCommandAnalysis {
  raw: string;
  binary: string;
  title: string;
  purpose: string;
  howItWorks: string;
  flags: CommandFlagExplanation[];
}

// Knowledge base of known utilities and their flags
interface ToolPattern {
  name: string;
  binary: string;
  purpose: string;
  howItWorks: string;
  flagRules: {
    match: (cmd: string, arg: string) => boolean;
    flag: string;
    name: string;
    description: string;
    whyNeeded: string;
  }[];
}

const TOOL_PATTERNS: ToolPattern[] = [
  {
    binary: 'hostnamectl',
    name: 'Управление именем узла в systemd',
    purpose: 'Просмотр и персистентное изменение сетевого имени (hostname) хоста.',
    howItWorks: 'Записывает имя хоста в файл /etc/hostname и уведомляет демон systemd-hostnamed через системную шину D-Bus, обновляя имя в ядре.',
    flagRules: [
      {
        match: (c) => c.includes('set-hostname'),
        flag: 'set-hostname <FQDN>',
        name: 'Установка сетевого имени',
        description: 'Устанавливает полное доменное имя (FQDN) компьютера в формате host.domain.',
        whyNeeded: 'Необходимо для уникальной идентификации узла в сети и корректной работы служб Kerberos, DNS и почты.',
      },
      {
        match: (c) => c.includes('status'),
        flag: 'status',
        name: 'Просмотр статуса',
        description: 'Отображает текущее имя, архитектуру, версию ядра и виртуализацию.',
        whyNeeded: 'Позволяет проверить применение настроек без перезагрузки системы.',
      },
    ],
  },
  {
    binary: 'exec bash',
    name: 'Подмена процесса текущей оболочки',
    purpose: 'Мгновенное обновление сессии терминала без перезагрузки и повторного входа по SSH.',
    howItWorks: 'Системный вызов execve() заменяет тело текущего процесса Bash новым экземпляром. Процесс считывает обновленный /etc/hostname и перерисовывает строку приглашения ($PS1).',
    flagRules: [
      {
        match: () => true,
        flag: 'exec bash',
        name: 'Перезапуск окружения',
        description: 'Замещает текущий процесс оболочки новым процессом Bash.',
        whyNeeded: 'Предотвращает ошибки оператора, гарантируя отображение правильного имени хоста в приглашении командной строки.',
      },
    ],
  },
  {
    binary: 'mkdir',
    name: 'Создание каталогов в файловой системе',
    purpose: 'Создание директорий для конфигурационных файлов etcnet, ключей и точек монтирования.',
    howItWorks: 'Вызывает системный вызов mkdir(). При наличии флага -p рекурсивно проверяет и создает всю цепочку недостающих директорий.',
    flagRules: [
      {
        match: (c) => c.includes('-p'),
        flag: '-p (--parents)',
        name: 'Создание родительских каталогов',
        description: 'Создает все отсутствующие промежуточные каталоги в указанном пути и не завершается ошибкой, если каталог уже существует.',
        whyNeeded: 'Обеспечивает идемпотентность выполнения скрипта настройки при повторном запуске.',
      },
      {
        match: (c) => /\{.*\}/.test(c),
        flag: '{1,2} (Brace expansion)',
        name: 'Раскрытие фигурных скобок',
        description: 'Механизм оболочки Bash, генерирующий несколько аргументов из списка в фигурных скобках.',
        whyNeeded: 'Позволяет одной командой создать каталоги сразу для нескольких сетевых интерфейсов (например, enp7s2 и enp7s3).',
      },
    ],
  },
  {
    binary: 'ip',
    name: 'Управление сетевым стеком ядра Linux (iproute2)',
    purpose: 'Аудит и настройка сетевых адресов, маршрутов, VLAN и туннелей.',
    howItWorks: 'Взаимодействует напрямую с подсистемой Netlink ядра Linux через сокеты AF_NETLINK.',
    flagRules: [
      {
        match: (c) => c.includes('-c'),
        flag: '-c (--color)',
        name: 'Цветовая индикация',
        description: 'Подсвечивает состояние интерфейсов цветом (зеленый = UP, красный = DOWN).',
        whyNeeded: 'Позволяет администратору мгновенно визуально выявить упавшие сетевые адаптеры.',
      },
      {
        match: (c) => c.includes('--br'),
        flag: '--br (--brief)',
        name: 'Краткий табличный вывод',
        description: 'Формирует компактную таблицу из трех колонок: Имя интерфейса | Статус | IP-адрес.',
        whyNeeded: 'Устраняет визуальный шум и длинные портянки служебных флагов.',
      },
      {
        match: (c) => /\ba\b|\baddr\b/.test(c),
        flag: 'a / addr',
        name: 'Управление адресами',
        description: 'Команда работы с IPv4 и IPv6 адресами на интерфейсах.',
        whyNeeded: 'Используется для проверки правильности назначенных IP-адресов и масок подсетей.',
      },
      {
        match: (c) => /\br\b|\broute\b/.test(c),
        flag: 'r / route',
        name: 'Таблица маршрутизации',
        description: 'Просмотр и управление системной таблицей маршрутизации (FIB).',
        whyNeeded: 'Необходимо для проверки наличия шлюза по умолчанию (default) и маршрутов OSPF.',
      },
      {
        match: (c) => c.includes('-d'),
        flag: '-d (--details)',
        name: 'Детальные параметры L2',
        description: 'Выводит расширенные свойства линка (VLAN ID, протокол туннелирования, флаги).',
        whyNeeded: 'Критично для проверки корректности тегирования 802.1Q и параметров GRE-туннеля.',
      },
    ],
  },
  {
    binary: 'sysctl',
    name: 'Настройка параметров ядра Linux в реальном времени',
    purpose: 'Включение маршрутизации IP-пакетов и оптимизация сетевого стека.',
    howItWorks: 'Модифицирует виртуальные файлы в каталоге /proc/sys/net/ipv4/ без перезагрузки системы.',
    flagRules: [
      {
        match: (c) => c.includes('-w'),
        flag: '-w (write)',
        name: 'Запись параметра',
        description: 'Устанавливает новое значение параметра ядра "на лету".',
        whyNeeded: 'Позволяет включить маршрутизацию мгновенно для немедленного тестирования.',
      },
      {
        match: (c) => c.includes('-p'),
        flag: '-p (load file)',
        name: 'Загрузка из файла',
        description: 'Считывает и применяет все параметры из указанного конфигурационного файла /etc/sysctl.d/.',
        whyNeeded: 'Гарантирует, что параметры маршрутизации сохранятся после перезагрузки узла.',
      },
      {
        match: (c) => c.includes('net.ipv4.ip_forward'),
        flag: 'net.ipv4.ip_forward=1',
        name: 'Пересылка IP-пакетов',
        description: 'Переводит ядро Linux из режима конечного хоста в режим маршрутизатора.',
        whyNeeded: 'Без этого параметра ядро сбрасывает любые транзитные пакеты между интерфейсами.',
      },
    ],
  },
  {
    binary: 'nft',
    name: 'Межсетевой экран и трансляция адресов (nftables)',
    purpose: 'Организация динамического NAT (Masquerade), проброса портов (DNAT) и фильтрации трафика.',
    howItWorks: 'Компилирует правила в байт-код виртуальной машины nftables в ядре Linux, обеспечивая максимальную скорость обработки пакетов.',
    flagRules: [
      {
        match: (c) => c.includes('add table'),
        flag: 'add table ip nat',
        name: 'Создание таблицы NAT',
        description: 'Создает таблицу семейства ip (IPv4) с именем nat.',
        whyNeeded: 'Таблицы группируют цепочки и правила по функциональному назначению.',
      },
      {
        match: (c) => c.includes('hook postrouting'),
        flag: 'hook postrouting priority srcnat',
        name: 'Хук postrouting (исходящий трафик)',
        description: 'Встраивает цепочку в точку ядра ПОСЛЕ принятия решения о маршрутизации.',
        whyNeeded: 'Именно здесь выполняется подмена адреса источника (Masquerade / SNAT) перед отправкой в кабель.',
      },
      {
        match: (c) => c.includes('hook prerouting'),
        flag: 'hook prerouting priority dstnat',
        name: 'Хук prerouting (входящий трафик)',
        description: 'Встраивает цепочку в точку ядра ДО маршрутизации пакета.',
        whyNeeded: 'Необходимо для проброса портов (DNAT): ядро меняет адрес назначения до выбора пути.',
      },
      {
        match: (c) => c.includes('oifname'),
        flag: 'oifname "<интерфейс>"',
        name: 'Исходящий интерфейс',
        description: 'Фильтрует пакеты, покидающие узел через указанный сетевой адаптер (Out Interface Name).',
        whyNeeded: 'Ограничивает маскировку только трафиком, уходящим во внешнюю сеть интернет-провайдера.',
      },
      {
        match: (c) => c.includes('masquerade'),
        flag: 'masquerade',
        name: 'Динамическая маскировка IP',
        description: 'Подменяет адрес источника пакета на текущий динамический IP-адрес интерфейса выхода.',
        whyNeeded: 'Позволяет всей локальной сети выходить в Интернет через один внешний адрес маршрутизатора.',
      },
      {
        match: (c) => c.includes('dnat to'),
        flag: 'dnat to <IP>:<порт>',
        name: 'Destination NAT (проброс порта)',
        description: 'Подменяет IP-адрес и порт назначения входящего пакета на адрес внутреннего сервера.',
        whyNeeded: 'Дает внешним пользователям доступ к внутренним веб-серверам, изолированным за NAT.',
      },
      {
        match: (c) => c.includes('list ruleset'),
        flag: 'list ruleset',
        name: 'Вывод всех правил',
        description: 'Отображает полный дамп текущих активных таблиц, цепочек и счетчиков в nftables.',
        whyNeeded: 'Используется для проверки применения конфигурации и экспорта правил в файл.',
      },
      {
        match: (c) => c.includes('flush ruleset'),
        flag: 'flush ruleset',
        name: 'Сброс всех правил',
        description: 'Полностью очищает все таблицы, цепочки и правила nftables из оперативной памяти ядра.',
        whyNeeded: 'Гарантирует чистое состояние перед загрузкой конфигурационного файла, предотвращая дублирование правил.',
      },
      {
        match: (c) => c.includes('-f'),
        flag: '-f <файл> (--file)',
        name: 'Загрузка набора правил из файла',
        description: 'Компилирует и атомарно применяет правила из указанного конфигурационного файла напрямую в ядро Linux.',
        whyNeeded: 'Позволяет моментально активировать правила без перезагрузки узла и сервисов.',
      },
    ],
  },
  {
    binary: 'useradd',
    name: 'Создание локального пользователя Linux',
    purpose: 'Регистрация новой учетной записи операционной системы.',
    howItWorks: 'Добавляет запись в /etc/passwd, генерирует строку в /etc/shadow и создает домашнюю директорию.',
    flagRules: [
      {
        match: (c) => c.includes('-m'),
        flag: '-m (--create-home)',
        name: 'Создание домашней папки',
        description: 'Автоматически создает каталог /home/<имя_пользователя> и копирует файлы инициализации из /etc/skel.',
        whyNeeded: 'Без домашней папки пользователь не сможет войти в графическую среду и сохранять профиль.',
      },
      {
        match: (c) => c.includes('-s'),
        flag: '-s <оболочка> (--shell)',
        name: 'Командная оболочка',
        description: 'Назначает командный интерпретатор (обычно /bin/bash).',
        whyNeeded: 'Предоставляет пользователю полноценную интерактивную оболочку с историей и автодополнением.',
      },
    ],
  },
  {
    binary: 'usermod',
    name: 'Модификация учетной записи пользователя',
    purpose: 'Изменение параметров, добавление в группы и блокировка.',
    howItWorks: 'Обновляет системный файл /etc/group.',
    flagRules: [
      {
        match: (c) => c.includes('-aG') || (c.includes('-a') && c.includes('-G')),
        flag: '-aG <группа> (--append --groups)',
        name: 'Добавление во вторичную группу',
        description: 'Включает пользователя в дополнительную группу (например, wheel) БЕЗ исключения из существующих.',
        whyNeeded: 'Критично: пропуск флага -a (append) приведет к удалению пользователя из всех остальных групп!',
      },
    ],
  },
  {
    binary: 'control',
    name: 'Подсистема контроля безопасности ALT Linux',
    purpose: 'Управление разрешениями и режимами системных демонов и механизмов ядра.',
    howItWorks: 'Модифицирует права доступа, системные скрипты и конфигурации в подсистеме /etc/control.d/.',
    flagRules: [
      {
        match: (c) => c.includes('libnss-role'),
        flag: 'libnss-role enabled',
        name: 'Включение ролевой модели',
        description: 'Активирует трансляцию групп каталога Active Directory в системные роли Linux.',
        whyNeeded: 'Позволяет раздавать права sudo доменным учетным записям без создания локальных дубликатов.',
      },
    ],
  },
  {
    binary: 'roleadd',
    name: 'Связывание ролей в ALT Linux (libnss-role)',
    purpose: 'Назначение локальной роли группе домена Active Directory.',
    howItWorks: 'Создает запись соответствия между доменной группой и локальной группой Linux в базе NSS.',
    flagRules: [
      {
        match: () => true,
        flag: 'roleadd <доменная_группа> <локальная_группа>',
        name: 'Маппинг ролей',
        description: 'Связывает доменную группу (например, hq) с системной ролью (например, wheel).',
        whyNeeded: 'Участники доменной группы мгновенно получают административные права группы wheel.',
      },
    ],
  },
  {
    binary: 'visudo',
    name: 'Безопасное редактирование и аудит sudoers',
    purpose: 'Проверка синтаксиса файлов правил повышения привилегий.',
    howItWorks: 'Парсит структуру правил с помощью лексера sudo и блокирует сохранение при наличии синтаксических ошибок.',
    flagRules: [
      {
        match: (c) => c.includes('-c'),
        flag: '-c (--check)',
        name: 'Проверка синтаксиса',
        description: 'Валидирует файлы конфигурации sudoers без открытия интерактивного редактора.',
        whyNeeded: 'Предотвращает фатальные ошибки синтаксиса, которые могут заблокировать root-доступ в системе.',
      },
      {
        match: (c) => c.includes('-f'),
        flag: '-f <файл>',
        name: 'Указание файла правил',
        description: 'Проверяет конкретный изолированный файл политик в каталоге /etc/sudoers.d/.',
        whyNeeded: 'Позволяет проверить добавленную политику до ее применения.',
      },
    ],
  },
  {
    binary: 'ssh-keygen',
    name: 'Генератор криптографических ключей OpenSSH',
    purpose: 'Создание ключевых пар для беспарольной аутентификации.',
    howItWorks: 'Генерирует пару асимметричных ключей: закрытый ключ (хранится у клиента) и открытый ключ (.pub).',
    flagRules: [
      {
        match: (c) => c.includes('-t'),
        flag: '-t <алгоритм>',
        name: 'Выбор типа ключа',
        description: 'Задает криптографический алгоритм (ed25519 — современная эллиптическая кривая, rsa — классический).',
        whyNeeded: 'Ed25519 обеспечивает максимальную скорость работы и криптостойкость при компактном размере ключа.',
      },
      {
        match: (c) => c.includes('-N'),
        flag: '-N "" (passphrase)',
        name: 'Пустая кодовая фраза',
        description: 'Создает ключ без защитного пароля.',
        whyNeeded: 'Необходимо для беспарольной автоматизации в фоновых скриптах и плейбуках Ansible.',
      },
      {
        match: (c) => c.includes('-f'),
        flag: '-f <путь>',
        name: 'Имя выходного файла',
        description: 'Путь для сохранения сгенерированного закрытого ключа (по умолчанию ~/.ssh/id_ed25519).',
        whyNeeded: 'Предотвращает случайную перезапись существующих пользовательских ключей.',
      },
    ],
  },
  {
    binary: 'ssh-copy-id',
    name: 'Копирование открытого ключа на удаленный хост',
    purpose: 'Установка открытого ключа в authorized_keys удаленного сервера.',
    howItWorks: 'Подключается по SSH, создает директорию ~/.ssh с правами 0700 и дописывает открытый ключ в ~/.ssh/authorized_keys с правами 0600.',
    flagRules: [
      {
        match: (c) => c.includes('-p'),
        flag: '-p <порт>',
        name: 'Порт подключения SSH',
        description: 'Указывает нестандартный порт сервера (например, 2222).',
        whyNeeded: 'Обязательно, если стандартный порт 22 изменен в целях безопасности (харденинга).',
      },
    ],
  },
  {
    binary: 'vtysh',
    name: 'Универсальная оболочка стека FRRouting (FRR)',
    purpose: 'Управление процессами динамической маршрутизации OSPF, BGP, RIP.',
    howItWorks: 'Подключается через UNIX-сокет к демонам FRR (zebra, ospfd) и транслирует конфигурационные команды в стиле Cisco IOS.',
    flagRules: [
      {
        match: (c) => c.includes('-c'),
        flag: '-c "<команда>"',
        name: 'Выполнение одной команды',
        description: 'Исполняет указанную директиву CLI FRR из Bash без входа в интерактивную сессию.',
        whyNeeded: 'Позволяет автоматизировать настройку OSPF в скриптах и проверять таблицы маршрутизации одной строкой.',
      },
    ],
  },
  {
    binary: 'samba-tool',
    name: 'Утилита администрирования Samba Active Directory DC',
    purpose: 'Инициализация домена, управление пользователями, группами и политиками.',
    howItWorks: 'Взаимодействует с внутренней базой данных LDB/LDAP Самбы и настраивает параметры доменного контроллера.',
    flagRules: [
      {
        match: (c) => c.includes('domain provision'),
        flag: 'domain provision',
        name: 'Инициализация контроллера домена',
        description: 'Создает новую структуру каталога Active Directory с базовыми объектами и сертификатами.',
        whyNeeded: 'Базовая операция превращения сервера в Domain Controller.',
      },
      {
        match: (c) => c.includes('--realm'),
        flag: '--realm=<REALM>',
        name: 'Область Kerberos Realm',
        description: 'Полное доменное имя области Kerberos (строго заглавными буквами, например AU-TEAM.IRPO).',
        whyNeeded: 'Kerberos чувствителен к регистру: несовпадение регистра приведет к отказу в выдаче тикетов TGT.',
      },
      {
        match: (c) => c.includes('--server-role=dc'),
        flag: '--server-role=dc',
        name: 'Роль контроллера домена',
        description: 'Назначает сервер контроллером домена (Domain Controller).',
        whyNeeded: 'Определяет запуск служб KDC, LDAP и внутренней репликации.',
      },
      {
        match: (c) => c.includes('--dns-backend'),
        flag: '--dns-backend=SAMBA_INTERNAL',
        name: 'Встроенный DNS-сервер',
        description: 'Использует встроенный DNS-демон Самбы для автоматической регистрации доменных SRV-записей.',
        whyNeeded: 'Упрощает стендовое развертывание без необходимости интеграции с BIND DLZ.',
      },
      {
        match: (c) => c.includes('passwordsettings set'),
        flag: 'passwordsettings set',
        name: 'Политика сложности паролей',
        description: 'Управляет минимальной длиной, историей и сроком действия доменных паролей.',
        whyNeeded: 'На учебном стенде позволяет снять жесткие ограничения для удобства тестирования.',
      },
    ],
  },
  {
    binary: 'mdadm',
    name: 'Управление программными RAID-массивами в Linux',
    purpose: 'Сборка, мониторинг и обслуживание многодисковых массивов (md).',
    howItWorks: 'Взаимодействует с драйвером Multiple Devices (MD) ядра Linux, создавая виртуальное блочное устройство /dev/mdX.',
    flagRules: [
      {
        match: (c) => c.includes('--create'),
        flag: '--create /dev/mdX',
        name: 'Создание нового массива',
        description: 'Инициализирует создание виртуального блочного RAID-устройства.',
        whyNeeded: 'Объединяет физические диски в единый логический том.',
      },
      {
        match: (c) => c.includes('--level=0') || c.includes('-l 0'),
        flag: '--level=0 (Stripe)',
        name: 'Уровень RAID 0 (Чередование)',
        description: 'Разбивает данные на блоки и записывает параллельно на все диски массива без избыточности.',
        whyNeeded: 'Обеспечивает максимальную скорость ввода-вывода и 100% суммарного объема дисков.',
      },
      {
        match: (c) => c.includes('--level=1') || c.includes('-l 1'),
        flag: '--level=1 (Mirror)',
        name: 'Уровень RAID 1 (Зеркалирование)',
        description: 'Дублирует данные идентично на оба накопителя.',
        whyNeeded: 'Обеспечивает высокую отказоустойчивость при отказе одного из физических дисков.',
      },
      {
        match: (c) => c.includes('--raid-devices'),
        flag: '--raid-devices=N',
        name: 'Количество активных дисков',
        description: 'Задает число физических накопителей, входящих в массив.',
        whyNeeded: 'Ядро резервирует ровно указанное количество блочных устройств.',
      },
      {
        match: (c) => c.includes('--detail --scan'),
        flag: '--detail --scan',
        name: 'Сканирование метаданных массива',
        description: 'Генерирует строку идентификации массива (UUID) для файла /etc/mdadm.conf.',
        whyNeeded: 'Гарантирует автоматическую сборку массива ядром при перезагрузке системы.',
      },
    ],
  },
  {
    binary: 'exportfs',
    name: 'Управление экспортом сетевой файловой системы NFS',
    purpose: 'Применение и аудит экспортируемых сетевых директорий.',
    howItWorks: 'Уведомляет демон nfs-server и модуль ядра о доступных клиентских сетевых путях из файла /etc/exports.',
    flagRules: [
      {
        match: (c) => c.includes('-r'),
        flag: '-r (--reexport)',
        name: 'Повторный экспорт',
        description: 'Синхронизирует текущую таблицу экспорта с содержимым файла /etc/exports.',
        whyNeeded: 'Позволяет применить новые общие папки без перезапуска всей службы nfs-server.',
      },
      {
        match: (c) => c.includes('-a'),
        flag: '-a (--all)',
        name: 'Экспорт всех папок',
        description: 'Применяет операцию ко всем записям таблицы экспорта.',
        whyNeeded: 'Гарантирует, что ни одна сетевая папка не будет упущена.',
      },
      {
        match: (c) => c.includes('-v'),
        flag: '-v (--verbose)',
        name: 'Подробный вывод',
        description: 'Отображает полный список экспортируемых каталогов со всеми примененными опциями безопасности.',
        whyNeeded: 'Позволяет оператору убедиться в правильности прав (rw, sync, no_root_squash).',
      },
    ],
  },
  {
    binary: 'docker',
    name: 'Платформа контейнеризации Docker',
    purpose: 'Сборка, запуск и изоляция веб-приложений в контейнерах.',
    howItWorks: 'Использует механизмы пространств имен (Namespaces) и контрольных групп (Cgroups) ядра Linux.',
    flagRules: [
      {
        match: (c) => c.includes('build'),
        flag: 'build -t <тег> .',
        name: 'Сборка контейнерного образа',
        description: 'Интерпретирует инструкции Dockerfile в текущей папке и формирует неизменяемый образ.',
        whyNeeded: 'Упаковывает приложение со всеми необходимыми библиотеками и веб-сервером в один артефакт.',
      },
      {
        match: (c) => c.includes('-d'),
        flag: '-d (--detach)',
        name: 'Фоновый режим демона',
        description: 'Запускает контейнер в фоновом режиме, освобождая терминал.',
        whyNeeded: 'Позволяет веб-приложению работать как постоянная фоновая системная служба.',
      },
      {
        match: (c) => c.includes('-p'),
        flag: '-p <внешний_порт>:<внутренний_порт>',
        name: 'Проброс сетевого порта',
        description: 'Связывает порт хостовой операционной системы с портом внутри контейнера (например, 8080:80).',
        whyNeeded: 'Позволяет внешним клиентам обращаться к веб-серверу контейнера через IP-адрес хоста.',
      },
      {
        match: (c) => c.includes('--restart=always'),
        flag: '--restart=always',
        name: 'Автоматический перезапуск',
        description: 'Перезапускает контейнер при системных сбоях и при перезагрузке операционной системы.',
        whyNeeded: 'Обеспечивает непрерывную доступность сервиса без ручного вмешательства администратора.',
      },
    ],
  },
  {
    binary: 'ping',
    name: 'Утилита диагностики сетевой связности ICMP',
    purpose: 'Проверка доступности удаленного хоста и измерение задержки прохождения пакетов (RTT).',
    howItWorks: 'Отправляет сетевые пакеты протокола ICMP типа Echo Request (тип 8) и ожидает ответа Echo Reply (тип 0).',
    flagRules: [
      {
        match: (c) => c.includes('-c'),
        flag: '-c <число> (--count)',
        name: 'Количество пакетов',
        description: 'Ограничивает количество отправляемых запросов (по умолчанию в Linux пинг идет бесконечно).',
        whyNeeded: 'Предотвращает зависание автоматизированных скриптов и терминала.',
      },
    ],
  },
  {
    binary: 'apt-get',
    name: 'Пакетный менеджер APT-RPM в ALT Linux',
    purpose: 'Обновление списков репозиториев, установка, удаление и разрешение зависимостей пакетов.',
    howItWorks: 'Строит дерево зависимостей, скачивает необходимые RPM-пакеты и передает их утилите RPM для распаковки.',
    flagRules: [
      {
        match: (c) => c.includes('update'),
        flag: 'update',
        name: 'Актуализация метаданных',
        description: 'Считывает свежие индексы доступных пакетов с зеркал репозиториев платформы p10.',
        whyNeeded: 'Обязательно перед установкой любого нового ПО, чтобы не получить ошибку 404 на устаревшие версии.',
      },
      {
        match: (c) => c.includes('-y'),
        flag: '-y (--yes)',
        name: 'Автоматическое согласие',
        description: 'Автоматически отвечает "Да" на запросы подтверждения занимаемого дискового пространства.',
        whyNeeded: 'Позволяет скриптам выполнять установку в неинтерактивном режиме.',
      },
    ],
  },
  {
    binary: 'mount',
    name: 'Монтирование файловых систем в дерево каталогов',
    purpose: 'Подключение локальных блочных накопителей (RAID) и сетевых файловых систем (NFS).',
    howItWorks: 'Связывает файловую структуру целевого устройства с существующей директорией-точкой монтирования.',
    flagRules: [
      {
        match: (c) => c.includes('-t'),
        flag: '-t <тип_ФС>',
        name: 'Тип файловой системы',
        description: 'Явное указание драйвера ФС (например, nfs4 для сетевой ФС или ext4 для дискового тома).',
        whyNeeded: 'Предотвращает ошибки автоопределения и гарантирует использование актуальной версии протокола.',
      },
      {
        match: (c) => c.includes('-a'),
        flag: '-a (--all)',
        name: 'Монтирование всех записей',
        description: 'Принудительно монтирует все записи, описанные в конфигурационном файле /etc/fstab.',
        whyNeeded: 'Позволяет проверить корректность fstab без перезагрузки системы.',
      },
    ],
  },
  {
    binary: 'blkid',
    name: 'Идентификация атрибутов блочных устройств',
    purpose: 'Определение UUID, меток и типов файловых систем дисков и RAID-массивов.',
    howItWorks: 'Считывает суперблоки и метаданные непосредственно с дисковых накопителей.',
    flagRules: [
      {
        match: (c) => c.includes('-s UUID'),
        flag: '-s UUID -o value',
        name: 'Извлечение UUID тома',
        description: 'Выводит только значение уникального 128-битного идентификатора UUID без лишнего текста.',
        whyNeeded: 'Монтирование по UUID в /etc/fstab защищает от смены букв дисков (/dev/sdb на /dev/sdc) при ребуте.',
      },
    ],
  },
  {
    binary: 'timedatectl',
    name: 'Управление системным временем и часовым поясом',
    purpose: 'Настройка часового пояса, синхронизации NTP и сверка аппаратных часов RTC.',
    howItWorks: 'Взаимодействует с демоном systemd-timedated через D-Bus.',
    flagRules: [
      {
        match: (c) => c.includes('set-timezone'),
        flag: 'set-timezone <Зона>',
        name: 'Установка часового пояса',
        description: 'Создает символическую ссылку /etc/localtime на файл зоны в /usr/share/zoneinfo/ (Europe/Moscow).',
        whyNeeded: 'Критично для правильного отображения времени в журналах безопасности и работы Kerberos.',
      },
    ],
  },
  {
    binary: 'hwclock',
    name: 'Синхронизация аппаратных часов (RTC)',
    purpose: 'Синхронизация времени между ядром операционной системы и микросхемой материнской платы.',
    howItWorks: 'Считывает или записывает время в регистры CMOS через драйвер /dev/rtc0.',
    flagRules: [
      {
        match: (c) => c.includes('--systohc'),
        flag: '--systohc (System to Hardware Clock)',
        name: 'Запись системного времени в RTC',
        description: 'Сбрасывает текущее точное время ядра Linux в энергонезависимые аппаратные часы.',
        whyNeeded: 'Гарантирует, что при выключении питания или перезагрузке время на сервере не собьется.',
      },
    ],
  },
  {
    binary: 'dig',
    name: 'Утилита опроса DNS-серверов (Domain Information Groper)',
    purpose: 'Тестирование разрешения доменных имен, прямых и обратных зон DNS.',
    howItWorks: 'Формирует стандартные запросы DNS по протоколу UDP на порт 53 и выводит ответ сервера.',
    flagRules: [
      {
        match: (c) => c.includes('@'),
        flag: '@<DNS-сервер>',
        name: 'Адрес опрашиваемого DNS-сервера',
        description: 'Принудительно направляет запрос конкретному серверу (например, @127.0.0.1) в обход /etc/resolv.conf.',
        whyNeeded: 'Позволяет тестировать локальный BIND до того, как он назначен системным резолвером.',
      },
      {
        match: (c) => c.includes('+short'),
        flag: '+short',
        name: 'Краткий ответ',
        description: 'Отключает вывод служебных комментариев, выводя только IP-адрес или имя.',
        whyNeeded: 'Удобно для быстрой верификации в консоли и парсинга в скриптах.',
      },
      {
        match: (c) => c.includes('-x'),
        flag: '-x <IP> (Reverse lookup)',
        name: 'Обратный запрос (PTR)',
        description: 'Преобразует IP-адрес в имя в доменном пространстве in-addr.arpa.',
        whyNeeded: 'Проверяет правильность настройки обратной зоны PTR, необходимой для Kerberos AD.',
      },
    ],
  },
  {
    binary: 'chronyc',
    name: 'Интерфейс командной строки демона времени Chrony',
    purpose: 'Мониторинг источников времени, рассинхронизации и системного дрейфа.',
    howItWorks: 'Подключается к локальному демону chronyd через UNIX-сокет /var/run/chrony/chronyd.sock.',
    flagRules: [
      {
        match: (c) => c.includes('sources'),
        flag: 'sources -v',
        name: 'Таблица источников времени',
        description: 'Отображает все вышестоящие NTP-серверы, их стратум, задержку и значок * у ведущего сервера.',
        whyNeeded: 'Главный диагностический инструмент для подтверждения синхронизации времени на узле ISP.',
      },
      {
        match: (c) => c.includes('tracking'),
        flag: 'tracking',
        name: 'Параметры точности и дрейфа',
        description: 'Выводит системное смещение (System time offset), дрейф частоты и абсолютную погрешность.',
        whyNeeded: 'Показывает, насколько системные часы соответствуют эталонному мировому времени.',
      },
    ],
  },
  {
    binary: 'ansible',
    name: 'Система автоматизации и оркестрации Ansible',
    purpose: 'Выполнение ad-hoc команд и плейбуков на группе управляемых серверов.',
    howItWorks: 'Подключается к узлам из инвентаря по протоколу SSH, передает скомпилированные модули Python и исполняет их.',
    flagRules: [
      {
        match: (c) => c.includes('-m'),
        flag: '-m <модуль>',
        name: 'Вызываемый модуль',
        description: 'Имя модуля Ansible (ping для проверки связи, apt_rpm для пакетов, command для bash-команд).',
        whyNeeded: 'Модули обеспечивают идемпотентность выполнения действий в целевой ОС.',
      },
      {
        match: (c) => c.includes('-a'),
        flag: '-a "<аргументы>"',
        name: 'Параметры модуля',
        description: 'Строка аргументов, передаваемая в выбранный модуль.',
        whyNeeded: 'Задает конкретные действия (например, "name=tcpdump state=present").',
      },
    ],
  },
  {
    binary: 'systemctl',
    name: 'Управление системными службами systemd',
    purpose: 'Запуск, остановка, перезапуск и включение автозагрузки демонов.',
    howItWorks: 'Отправляет команды менеджеру инициализации PID 1 через сокет D-Bus.',
    flagRules: [
      {
        match: (c) => c.includes('enable --now') || (c.includes('enable') && c.includes('--now')),
        flag: 'enable --now <служба>',
        name: 'Включение автозагрузки и немедленный запуск',
        description: 'Создает символическую ссылку в /etc/systemd/system/multi-user.target.wants/ и мгновенно стартует сервис.',
        whyNeeded: 'Заменяет две последовательные команды (enable + start) одной атомарной операцией.',
      },
      {
        match: (c) => c.includes('restart'),
        flag: 'restart <служба>',
        name: 'Перезапуск службы',
        description: 'Останавливает процесс демона и запускает его заново с перечитыванием конфигураций.',
        whyNeeded: 'Необходимо после любого изменения конфигурационных файлов сервиса.',
      },
      {
        match: (c) => c.includes('status'),
        flag: 'status <служба>',
        name: 'Просмотр состояния службы',
        description: 'Выводит статус активности (active/running), PID процесса и последние строки системного журнала.',
        whyNeeded: 'Главный диагностический инструмент для проверки успешности запуска сервиса.',
      },
    ],
  },
  {
    binary: 'tee',
    name: 'Утилита разветвления стандартного вывода (tee)',
    purpose: 'Одновременная запись переданного потока данных в один или несколько файлов и вывод в консоль.',
    howItWorks: 'Считывает данные из стандартного потока ввода (stdin) и параллельно дублирует их в стандартный вывод (stdout) и во все файлы, переданные в качестве аргументов.',
    flagRules: [
      {
        match: () => true,
        flag: 'tee <файл1> [файл2...]',
        name: 'Мультипликация записи',
        description: 'Записывает входные данные сразу в несколько целевых файлов конфигурации.',
        whyNeeded: 'В связке с раскрытием фигурных скобок Bash enp7s{2,3} позволяет одной командой наполнить файлы options для нескольких интерфейсов.',
      },
    ],
  },
  {
    binary: 'echo',
    name: 'Генерация содержимого конфигурационных файлов (echo)',
    purpose: 'Запись директив подсистемы etcnet через перенаправление потока вывода (> и >>).',
    howItWorks: 'Команда оболочки выводит строковые аргументы в stdout. Символ > создает или перезаписывает целевой файл конфигурации в /etc/net/ifaces/.',
    flagRules: [
      {
        match: (c) => c.includes('TYPE=eth'),
        flag: "'TYPE=eth'",
        name: 'Тип сетевого интерфейса',
        description: 'Указывает подсистеме etcnet, что интерфейс является стандартным физическим адаптером Ethernet.',
        whyNeeded: 'Обязательный параметр в файле options для корректной инициализации порта сетевым стеком.',
      },
      {
        match: (c) => c.includes('ipv4address'),
        flag: '> ipv4address',
        name: 'Файл IPv4-адреса',
        description: 'Задает статический IP-адрес и маску в формате CIDR (например, 172.16.1.1/28).',
        whyNeeded: 'Служба network считывает значение и применяет адрес к интерфейсу при запуске.',
      },
      {
        match: (c) => c.includes('ipv4route'),
        flag: '> ipv4route',
        name: 'Файл маршрутов и шлюза',
        description: 'Содержит маршруты или шлюз по умолчанию в формате "default via <IP>".',
        whyNeeded: 'Определяет таблицу маршрутизации для отправки пакетов за пределы локального сегмента.',
      },
      {
        match: (c) => c.includes('resolv.conf'),
        flag: '> resolv.conf',
        name: 'Настройки DNS интерфейса',
        description: 'Задает адрес резолвера DNS (nameserver <IP>) для сетевого подключения.',
        whyNeeded: 'Обеспечивает разрешение доменных имен в IP-адреса через указанный DNS-сервер.',
      },
    ],
  },
  {
    binary: 'ping',
    name: 'Диагностика сетевой связности по протоколу ICMP',
    purpose: 'Проверка доступности удаленного узла и целостности сетевого маршрута.',
    howItWorks: 'Отправляет пакеты ICMP Echo Request целевому хосту и замеряет время прихода ответов Echo Reply.',
    flagRules: [
      {
        match: (c) => c.includes('-c'),
        flag: '-c <N> (--count)',
        name: 'Ограничение количества пакетов',
        description: 'Отправляет ровно N проверочных запросов и автоматически завершает выполнение.',
        whyNeeded: 'Предотвращает бесконечное зависание в терминале и скриптах автоматической проверки.',
      },
    ],
  },
];

// Helper to analyze a single line or command
export function analyzeCommandLine(cmd: string): SingleCommandAnalysis | null {
  const trimmed = cmd.trim();
  if (!trimmed || trimmed.startsWith('#')) return null;

  // Find matching tool pattern
  for (const tool of TOOL_PATTERNS) {
    if (
      trimmed.startsWith(tool.binary) ||
      trimmed.includes(` ${tool.binary} `) ||
      trimmed.startsWith(`/${tool.binary}`) ||
      (tool.binary === 'exec bash' && trimmed.includes('exec bash'))
    ) {
      const activeFlags: CommandFlagExplanation[] = [];
      for (const rule of tool.flagRules) {
        if (rule.match(trimmed, '')) {
          activeFlags.push({
            flag: rule.flag,
            name: rule.name,
            description: rule.description,
            whyNeeded: rule.whyNeeded,
          });
        }
      }

      return {
        raw: trimmed,
        binary: tool.binary,
        title: tool.name,
        purpose: tool.purpose,
        howItWorks: tool.howItWorks,
        flags: activeFlags,
      };
    }
  }

  // Fallback generic command parser
  const parts = trimmed.split(/\s+/);
  const binaryName = parts[0]?.replace(/^.*\//, '') || 'команда';

  return {
    raw: trimmed,
    binary: binaryName,
    title: `Системная команда ${binaryName}`,
    purpose: `Выполнение операции ${binaryName} в среде ALT Linux.`,
    howItWorks: 'Исполняется командным интерпретатором Bash в контексте прав текущего пользователя.',
    flags: [],
  };
}

// Helper to analyze full command blocks
export function analyzeCommandBlock(commandsText: string): SingleCommandAnalysis[] {
  if (!commandsText) return [];
  const lines = commandsText.split('\n');
  const results: SingleCommandAnalysis[] = [];
  const seenBinaries = new Set<string>();

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    // Check if the line as a whole matches a pattern
    const fullAnalysis = analyzeCommandLine(trimmed);
    if (fullAnalysis && !seenBinaries.has(fullAnalysis.binary)) {
      seenBinaries.add(fullAnalysis.binary);
      results.push(fullAnalysis);
    }

    // Also check piped segments (e.g. echo ... | tee ...)
    if (trimmed.includes('|')) {
      const parts = trimmed.split('|');
      for (const part of parts) {
        const sub = part.trim();
        if (!sub) continue;
        const subAnalysis = analyzeCommandLine(sub);
        if (subAnalysis && !seenBinaries.has(subAnalysis.binary)) {
          seenBinaries.add(subAnalysis.binary);
          results.push(subAnalysis);
        }
      }
    }
  }

  return results;
}
