# Инструкция по переходу с JSON-хранилища на MySQL

Данная инструкция описывает процесс перехода платформы **SudoStudy (демонстрационный экзамен)** с локального файлового хранилища (`.data/store.json`) на реляционную СУБД **MySQL / MariaDB**.

---

## 1. Архитектура и особенности реализации

1. **Пул соединений**: Работа с MySQL реализована через производительный пул соединений `mysql2/promise` с поддержкой UTF-8 (`utf8mb4` для корректного отображения кириллицы, спецсимволов и emoji).
2. **Бесшовный переход**:
   - При наличии переменных `MYSQL_DATABASE` / `MYSQL_HOST` / `MYSQL_URL` в файле `.env` приложение автоматически работает с базой данных MySQL.
   - Если переменные окружения отсутствуют, приложение прозрачно использует локальное хранилище `.data/store.json` (zero downtime, безопасность локальной разработки).
3. **Сохранность данных**:
   - Пароли пользователей переносятся в виде безопасных соленых хешей `scrypt`.
   - Полностью сохраняются статусы 2FA, все 32 задания, модули, сданные работы, баллы и рецензии экспертов.

---

## 2. Быстрый старт (миграция за 3 шага)

### Шаг 1. Создание базы данных и пользователя в MySQL

Войдите в консоль MySQL под суперпользователем `root`:

```bash
mysql -u root -p
```

Выполните SQL-команды для создания базы данных и пользователя:

```sql
-- Создание базы данных в кодировке utf8mb4
CREATE DATABASE IF NOT EXISTS `demo_practics`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

-- Создание пользователя (замените 'secure_password' на ваш надёжный пароль)
CREATE USER IF NOT EXISTS 'sudostudy'@'localhost' IDENTIFIED BY 'secure_password';
CREATE USER IF NOT EXISTS 'sudostudy'@'%' IDENTIFIED BY 'secure_password';

-- Предоставление прав
GRANT ALL PRIVILEGES ON `demo_practics`.* TO 'sudostudy'@'localhost';
GRANT ALL PRIVILEGES ON `demo_practics`.* TO 'sudostudy'@'%';
FLUSH PRIVILEGES;

EXIT;
```

---

### Шаг 2. Настройка переменных окружения в `.env`

Создайте или отредактируйте файл `.env` в корне проекта (`/Users/spankmerock/Documents/demo-practics/.env`):

```env
# Включение режима MySQL
USE_MYSQL=true

# Параметры подключения к MySQL
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_USER=sudostudy
MYSQL_PASSWORD=secure_password
MYSQL_DATABASE=demo_practics

# Либо одной строкой:
# MYSQL_URL=mysql://sudostudy:secure_password@127.0.0.1:3306/demo_practics
```

---

### Шаг 3. Запуск автоматического импорта данных

В корне проекта выполните команду миграции:

```bash
npm run db:migrate:mysql
```

#### Что делает скрипт импорта (`scripts/import-json-to-mysql.ts`):

1. Автоматически подключается к MySQL и накатывает схему таблиц из [`scripts/schema.mysql.sql`](file:///Users/spankmerock/Documents/demo-practics/scripts/schema.mysql.sql).
2. Создает таблицы с правильными внешними ключами и индексами:
   - `users` — учетные записи (администраторы, студенты, 2FA-секреты, хеши scrypt).
   - `tasks` — все 32 задания модулей 1, 2 и 3 с вопросами, теорией и шагами проверки.
   - `submissions` — все проверенные и ожидающие проверки работы с оценками и ответами.
3. Читает актуальные данные из `.data/store.json` и переносит их в MySQL через безопасный `UPSERT` (`INSERT ... ON DUPLICATE KEY UPDATE`), что исключает дубликаты.
4. Выводит статистику импортированных записей.

> **Примечание**: Если ваш JSON-файл находится в другом месте (например, архивный бэкап), передайте путь аргументом:
>
> ```bash
> npm run db:migrate:mysql -- /path/to/backup.json
> ```

---

## 3. Проверка успешности миграции

После завершения миграции проверьте наличие данных в MySQL:

```bash
mysql -u sudostudy -p -D demo_practics -e "
SELECT 'Users' as table_name, count(*) as count FROM users
UNION ALL
SELECT 'Tasks', count(*) FROM tasks
UNION ALL
SELECT 'Submissions', count(*) FROM submissions;
"
```

Пример вывода:

```
+-------------+-------+
| table_name  | count |
+-------------+-------+
| Users       | 11    |
| Tasks       | 32    |
| Submissions | 4     |
+-------------+-------+
```

---

## 4. Запуск приложения

Запустите проект в обычном режиме:

```bash
# Для разработки
npm run dev

# Либо для продакшна
npm run build
npm start
```

При запуске приложение автоматически подключится к MySQL. Учетная запись администратора:

- **Логин**: `adm1`
- **Пароль**: `adm123`

---

## 5. Создание резервных копий MySQL

Для создания резервной копии базы данных используйте стандартную утилиту `mysqldump`:

```bash
# Создание дампа в файл
mysqldump -u sudostudy -p demo_practics > backups/mysql_backup_$(date +%Y%m%d_%H%M%S).sql

# Восстановление из дампа
mysql -u sudostudy -p demo_practics < backups/mysql_backup_YYYYMMDD_HHMMSS.sql
```
