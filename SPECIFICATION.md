## 1. Контекст, назначение и общие требования

Платформа является вспомогательным инструментом для сайта с решениями Демонстрационного экзамена по специальности 09.02.06 «Сетевое и системное администрирование» (https://demo.sudostudy.dev/).

### Структура модулей и заданий экзамена:

- **Модуль 1: Сетевая инфраструктура** — 11 заданий (1.1–1.11)
- **Модуль 2: Службы каталога и сервисы** — 11 заданий (2.1–2.11)
- **Модуль 3: Безопасность и администрирование** — 10 заданий (3.1–3.10)
  _Всего: 32 практических задания._

### Пользовательский сценарий студента (Student Workflow):

1. **Выбор модуля:** Студент видит 3 модуля с прогресс-барами и выбирает нужный.
2. **Выбор задания:** Внутри модуля открывается список заданий со статусами выполнения.
3. **Изучение описания и теории:** Студент читает контекст задачи и подробное объяснение принципа работы команд (архитектура etcnet, флаги утилит, системные вызовы).
4. **Пошаговое выполнение:** Студент копирует команды для каждого целевого узла (ISP, HQ-RTR, HQ-SRV, BR-RTR) и выполняет их на стенде Proxmox VE.
5. **Проверка скриптом:** Запуск однострочной curl-команды проверки в консоли.
6. **Контрольные вопросы:** Ввод ответов на контрольные вопросы по заданию.
7. **Загрузка логов и отправка:** Вставка сырого вывода из консоли в текстовое поле и отправка отчёта на проверку.

---

## 2. Архитектура и технологический стек

### 2.1. Компоненты системы

1. **Frontend:** Next.js (App Router, React 19, TypeScript).
   - Библиотека компонентов: Kumo UI (строгий минимализм, контрастные границы, моноширинные элементы).
   - Иконки: Lucide React (минималистичные контурные иконки).
   - Стилизация: Tailwind CSS v4 с монохромной кастомной палитрой.
2. **Backend:**
   - Вариант реализации: Node.js (Next.js Route Handlers + Fastify/NestJS при разделении) или Go (Gin/Fiber).
   - Для монорепозитория и простоты развёртывания используется единый сервис на **Next.js App Router** (Node.js LTS) с серверными действиями (Server Actions) и REST API.
   - ORM / Query Builder: Drizzle ORM или Prisma (строгая типизация схемы БД).
3. **Database:** PostgreSQL 16 Alpine.
4. **Proxy / Web Server:** Nginx (или Caddy) для SSL-терминации и отдачи статики / обратного проксирования.

### 2.2. Спецификация Docker Compose (`docker-compose.yml`)

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: sudostudy_db
    restart: unless-stopped
    environment:
      POSTGRES_DB: sudostudy_reports
      POSTGRES_USER: sudostudy_user
      POSTGRES_PASSWORD: ${DB_PASSWORD:-changeme_secure_pass}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql:ro
    ports:
      - '127.0.0.1:5432:5432'
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U sudostudy_user -d sudostudy_reports']
      interval: 5s
      timeout: 5s
      retries: 5
    networks:
      - sudostudy_net

  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: sudostudy_app
    restart: unless-stopped
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://sudostudy_user:${DB_PASSWORD:-changeme_secure_pass}@postgres:5432/sudostudy_reports
      JWT_SECRET: ${JWT_SECRET:-super_secret_jwt_key_min_32_chars}
      NEXTAUTH_URL: ${APP_URL:-http://localhost:3000}
    ports:
      - '3000:3000'
    networks:
      - sudostudy_net

volumes:
  postgres_data:
    driver: local

networks:
  sudostudy_net:
    driver: bridge
```

---

## 3. Схема базы данных (PostgreSQL DDL)

Схема обеспечивает строгую целостность данных, аудит времени отправки и проверки, а также исключает повторную отправку дубликатов отчётов одним студентом по одному заданию через ограничение `UNIQUE (user_id, task_id)`.

```sql
-- 1. Пользовательские перечисления (ENUM)
CREATE TYPE user_role AS ENUM ('student', 'admin');
CREATE TYPE submission_status AS ENUM ('pending', 'reviewed', 'rejected');

-- 2. Таблица пользователей
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(64) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(128) NOT NULL,
    group_name VARCHAR(32) NOT NULL, -- Пустое или 'STAFF' для администраторов
    role user_role NOT NULL DEFAULT 'student',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_group ON users(group_name);
CREATE INDEX idx_users_role ON users(role);

-- 3. Таблица модулей / заданий
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(64) NOT NULL UNIQUE,
    title VARCHAR(128) NOT NULL,
    module_code VARCHAR(32) NOT NULL, -- Например: "Модуль А", "Модуль Б", "Модуль В"
    description TEXT,
    script_command TEXT NOT NULL, -- Однострочный curl-запрос для запуска в Proxmox
    questions JSONB NOT NULL DEFAULT '[]'::jsonb, -- Список контрольных вопросов [{id: "q1", title: "..."}]
    max_score INTEGER NOT NULL DEFAULT 100,
    order_index INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tasks_module ON tasks(module_code);
CREATE INDEX idx_tasks_order ON tasks(order_index);

-- 4. Таблица отправленных отчётов (Submissions)
CREATE TABLE submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE RESTRICT,
    log_output TEXT NOT NULL, -- Невалидированный сырой вывод скрипта из консоли Proxmox
    answers JSONB NOT NULL DEFAULT '{}'::jsonb, -- Ответы на контрольные вопросы { "q1": "192.168.10.1/24", ... }
    status submission_status NOT NULL DEFAULT 'pending',
    score INTEGER CHECK (score IS NULL OR (score >= 0 AND score <= 100)),
    is_passed BOOLEAN DEFAULT NULL, -- Флаг зачёта (true - Зачтено, false - Не зачтено)
    feedback TEXT, -- Текстовый комментарий / замечания преподавателя
    reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMPTZ,

    -- Ограничение: 1 студент может сдать 1 отчёт по конкретному заданию
    CONSTRAINT uq_user_task UNIQUE (user_id, task_id)
);

CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_submissions_user_id ON submissions(user_id);
CREATE INDEX idx_submissions_task_id ON submissions(task_id);
```

---

## 4. Архитектура и структура интерфейсов (Kumo UI)

### 4.1. Общие принципы стилизации

- **Цветовая палитра:**
  - Базовые: `#000000` (чёрный), `#FFFFFF` (белый), оттенки серого `#F4F4F5` (100), `#E4E4E7` (200), `#71717A` (500), `#18181B` (900).
  - Бордеры: `border border-zinc-200` (light) / `border-zinc-800` (dark).
  - Акценты статусов:
    - _На проверке_: Нейтральный контрастный бейдж `bg-zinc-100 text-zinc-900 border border-zinc-300 font-mono text-xs`.
    - _Зачтено_: `bg-black text-white font-mono text-xs` (или высококонтрастный строгий зеленый маркер).
    - _Не зачтено_: `border border-black text-black font-mono text-xs`.
- **Шрифты:**
  - Основной: `Inter` / `Geist Sans`
  - Код, логи, команды, статусы, бейджи: `JetBrains Mono` / `Geist Mono` (`font-mono`).

---

### 4.2. Страница 1: `/login` (Аутентификация)

#### Макет экрана (ASCII Wireframe)

```
+--------------------------------------------------------------+
|                         SUDOSTUDY                            |
|             Демонстрационный экзамен 09.02.06                |
|                                                              |
|              +------------------------------+                |
|              | Вход в систему               |                |
|              |                              |                |
|              | Логин                        |                |
|              | [ student_ivanov           ] |                |
|              |                              |                |
|              | Пароль                       |                |
|              | [ ••••••••••••             ] |                |
|              |                              |                |
|              | [ Войти                    ] |                |
|              +------------------------------+                |
|                                                              |
|  Регистрация закрыта. Учётные записи выдаются преподавателем |
+--------------------------------------------------------------+
```

#### Компоненты Kumo UI:

- `Card`: Строгий прямоугольный контейнер без скруглений и теней (`rounded-none shadow-none border border-zinc-300`).
- `Input`: Поле ввода с моноширинной подсказкой и тонкой границей.
- `Button`: Кнопка первичного действия (`bg-black text-white hover:bg-zinc-800 rounded-none`).
- `Callout` / `Alert`: Информационный баннер при ошибке авторизации.

---

### 4.3. Страница 2: `/tasks/[id]` (Рабочая область студента)

#### Макет экрана (ASCII Wireframe)

```
+-------------------------------------------------------------------------------+
| SUDOSTUDY / Задания / Модуль А: Настройка сетевых интерфейсов и VLAN          |
| Студент: Иванов Иван (Группа: СА-41)                        [ Выйти ]         |
+-------------------------------------------------------------------------------+
|                                                                               |
| СТАТУС: [ НА ПРОВЕРКЕ ]   |  МАКС. БАЛЛ: 100                                  |
|                                                                               |
| 1. СКРИПТ АВТОПРОВЕРКИ В PROXMOX                                              |
| Запустите данную команду в консоли вашей целевой ВМ или гипервизора:          |
| +---------------------------------------------------------------------------+ |
| | curl -sSL https://demo.sudostudy.dev/scripts/check_mod_a.sh | bash [Copy] | |
| +---------------------------------------------------------------------------+ |
|                                                                               |
| 2. ВЫВОД СКРИПТА (LOG / TERMINAL OUTPUT)                                      |
| Скопируйте весь сырой текст из окна терминала и вставьте в поле ниже:        |
| +---------------------------------------------------------------------------+ |
| | [*] Checking bridge vmbr0... OK                                           | |
| | [*] VLAN 10 interface ens18.10 found: inet 192.168.10.1/24                | |
| | [*] Checking FRR OSPF neighbor state... Full/DR                           | |
| | [!] Warning: Firewall policy DROP on FORWARD not strict                   | |
| | ...                                                                       | |
| +---------------------------------------------------------------------------+ |
|                                                                               |
| 3. КОНТРОЛЬНЫЕ ВОПРОСЫ                                                        |
| Вопрос 1: Какой IP-адрес шлюза назначен для зоны DMZ?                         |
| [ 192.168.50.254                                                          ] |
|                                                                               |
| Вопрос 2: По какому протоколу организовано резервирование маршрутизатора?    |
| [ VRRP (Keepalived)                                                       ] |
|                                                                               |
| [ Отправить отчёт на проверку ]                                              |
+-------------------------------------------------------------------------------+
```

#### Компоненты Kumo UI:

- `CodeBlock` / `Snippet`: Компонент с кнопкой быстрого копирования bash-команды в буфер обмена (`navigator.clipboard.writeText`).
- `Textarea` (`font-mono`, фиксированная высота, скроллбар, отключено автоисправление): контейнер для вставки невалидированного сырого вывода Proxmox.
- `Badge`: Отображение текущего статуса (`Черновик`, `На проверке`, `Зачтено`, `Требует доработки`).
- `Form`, `FormField`, `Label`: Структурированная форма ответов на контрольные вопросы.

---

### 4.4. Страница 3: `/admin` (Дашборд проверки преподавателя)

#### Макет экрана (ASCII Wireframe)

```
+-------------------------------------------------------------------------------+
| SUDOSTUDY ADMIN / Панель проверки отчётов                   [Экспорт в CSV]   |
+-------------------------------------------------------------------------------+
| ФИЛЬТРЫ:                                                                      |
| Группа: [ Все группы    v ]   Статус: [ На проверке   v ]   Модуль: [ Все   v]|
+-------------------------------------------------------------------------------+
| ФИО СТУДЕНТА       | ГРУППА | МОДУЛЬ    | ДАТА СДАЧИ   | СТАТУС      | ДЕЙСТВИЕ|
|--------------------+--------+-----------+--------------+-------------+---------|
| Иванов Иван И.     | СА-41  | Модуль А  | 04.10 18:20  | НА ПРОВЕРКЕ | [Проверить]
| Петров Алексей В.  | СА-41  | Модуль А  | 04.10 18:35  | ЗАЧТЕНО (95)| [Открыть]
| Сидоров Денис М.   | СА-42  | Модуль Б  | 04.10 19:10  | НА ПРОВЕРКЕ | [Проверить]
| Смирнов Кирилл П.  | СА-41  | Модуль А  | 04.10 19:40  | НЕ СДАВАЛ   | -       |
+-------------------------------------------------------------------------------+
| Всего отчётов: 4 | Ожидают проверки: 2 | Проверено: 1                         |
+-------------------------------------------------------------------------------+
```

#### Компоненты Kumo UI:

- `Table`, `TableHeader`, `TableRow`, `TableCell`: Монохромная таблица с четким разделением строк (`border-b border-zinc-200`).
- `Select` / `DropdownMenu`: Фильтрация по академическим группам и статусам.
- `Button` (`variant="outline"`): Кнопка «Экспорт в CSV».
- `Badge`: Контрастная индикация статусов без цветного шума.

---

### 4.5. Страница 4: `/admin/submissions/[id]` (Карточка проверки отчёта)

#### Макет экрана (ASCII Wireframe)

```
+-------------------------------------------------------------------------------+
| [<- Назад к списку]   ПРОВЕРКА ОТЧЁТА: Иванов Иван Иванович (СА-41)           |
| Модуль: Модуль А: Настройка сетевых интерфейсов     Дата: 04.10.2026 18:20    |
+-------------------------------------------------------------------------------+
| ВЫВОД СКРИПТА PROXMOX (RAW LOG):                                              |
| +---------------------------------------------------------------------------+ |
| | [2026-10-04 18:18:02] === RUNNING AUTOMATED AUDIT SCRIPT v1.4 ===         | |
| | [*] Host: pve-node-01 | Kernel: 6.8.4-2-pve                               | |
| | [*] Testing /etc/network/interfaces syntax... OK                          | |
| | [*] Interface vmbr0: UP, MTU 1500                                         | |
| | [*] Interface vmbr0.10: IP 192.168.10.1/24 (VLAN Tag: 10)                 | |
| | [*] Ping test to gateway 192.168.10.254: 0% packet loss                   | |
| | [*] OSPF Configuration Check: Area 0.0.0.0, Router-ID 10.0.0.1            | |
| | [+] ALL MANDATORY CHECKS COMPLETED                                        | |
| +---------------------------------------------------------------------------+ |
|                                                                               |
| ОТВЕТЫ НА КОНТРОЛЬНЫЕ ВОПРОСЫ:                                                |
| 1. IP-адрес шлюза зоны DMZ:                                                   |
|    Ответ: 192.168.50.254                                                      |
| 2. Протокол резервирования маршрутизатора:                                    |
|    Ответ: VRRP (Keepalived)                                                   |
|                                                                               |
| ВЕРДИКТ ПРЕПОДАВАТЕЛЯ:                                                        |
| Оценка (0-100):   [ 95 ]            Статус зачёта: [X] Зачтено  [ ] Не зачтено|
|                                                                               |
| Комментарий студенту:                                                         |
| +---------------------------------------------------------------------------+ |
| | Задание выполнено в полном объёме. OSPF настроен корректно.               | |
| | Замечание: в следующий раз не оставляйте пароли в открытом виде в конфиге. | |
| +---------------------------------------------------------------------------+ |
|                                                                               |
| [ Сохранить оценку и отправить результат ]                                   |
+-------------------------------------------------------------------------------+
```

#### Компоненты Kumo UI:

- `TerminalWindow` / `LogViewer`: Черный монохромный блок `bg-zinc-950 text-zinc-100 font-mono text-xs p-4 overflow-x-auto max-h-96 border border-zinc-800`.
- `RadioGroup` / `ToggleGroup`: Переключение решения (Зачтено / На доработку).
- `Input` (тип number): Ввод баллов.
- `Textarea`: Ввод рецензии/комментария преподавателя.

---

## 5. Спецификация экспорта результатов в CSV

### 5.1. Алгоритм формирования сводной ведомости

1. Запрашиваются все активные студенты (`role = 'student'`), отсортированные по `group_name ASC, full_name ASC`.
2. Запрашиваются все активные модули (`tasks`), отсортированные по `order_index ASC`.
3. Строится сводная матрица (Pivot Table), где на пересечении строки студента и столбца задания подставляется:
   - Если отчёт отсутствует: `Не сдавал`
   - Если отчёт в статусе `pending`: `На проверке`
   - Если отчёт проверен: Оценка или статус (например: `95 (Зачтено)` или `Зачтено`).
4. Файл генерируется с разделителем точка с запятой (`;`) и BOM-маркером UTF-8 (`\uFEFF`) для корректного открытия в Microsoft Excel / LibreOffice Calc.

### 5.2. Пример готового CSV-файла (`reports_summary.csv`)

```csv
ФИО;Группа;Модуль 1 (Сети и VLAN);Модуль 2 (Linux & Proxmox);Модуль 3 (Безопасность)
Алексеев Максим Дмитриевич;9СА-421;95 (Зачтено);На проверке;Не сдавал
Борисов Артем Сергеевич;9СА-421;Зачтено (85);Зачтено (90);На проверке
Иванов Иван Иванович;9СА-421;На проверке;Не сдавал;Не сдавал
Петров Алексей Владимирович;9СА-421;Зачтено (100);Зачтено (95);Зачтено (90)
Сидоров Денис Михайлович;9СА-42;Не сдавал;На проверке;Не сдавал
Смирнов Кирилл Павлович;9СА-42;70 (Зачтено);Не зачтено (40);Не сдавал
Федоров Роман Игоревич;9СА-42;На проверке;На проверке;Не сдавал
```
