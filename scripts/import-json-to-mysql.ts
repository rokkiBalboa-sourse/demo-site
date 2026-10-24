import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
import { TASKS_DATA } from '../src/lib/tasks-data';
import { User, Submission, Task } from '../src/lib/types';

interface JsonStore {
  users: User[];
  tasks?: Task[];
  submissions: Submission[];
}

async function runMigration() {
  const customStorePath = process.argv[2];
  const jsonPath = customStorePath
    ? path.resolve(process.cwd(), customStorePath)
    : path.resolve(process.cwd(), '.data/store.json');

  console.log('====================================================');
  console.log(' SudoStudy: Импорт данных из JSON в MySQL');
  console.log('====================================================');
  console.log(`[*] Файл источника: ${jsonPath}`);

  if (!fs.existsSync(jsonPath)) {
    console.error(`[!] Ошибка: файл хранилища ${jsonPath} не найден!`);
    process.exit(1);
  }

  const rawJson = fs.readFileSync(jsonPath, 'utf-8');
  const storeData: JsonStore = JSON.parse(rawJson);

  const users = storeData.users || [];
  const submissions = storeData.submissions || [];
  const tasks = storeData.tasks && storeData.tasks.length > 0 ? storeData.tasks : TASKS_DATA;

  console.log(
    `[*] Загружено из JSON: ${users.length} пользователей, ${tasks.length} заданий, ${submissions.length} сдач.`
  );

  const connectionConfig = {
    host: process.env.MYSQL_HOST || '127.0.0.1',
    port: parseInt(process.env.MYSQL_PORT || '3306', 10),
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'demo_practics',
    multipleStatements: true,
    charset: 'utf8mb4',
  };

  console.log(
    `[*] Подключение к MySQL: ${connectionConfig.user}@${connectionConfig.host}:${connectionConfig.port}/${connectionConfig.database}`
  );

  let connection: mysql.Connection;
  try {
    // Connect without DB first to ensure DB exists
    const rootConn = await mysql.createConnection({
      host: connectionConfig.host,
      port: connectionConfig.port,
      user: connectionConfig.user,
      password: connectionConfig.password,
      multipleStatements: true,
      charset: 'utf8mb4',
    });

    await rootConn.query(
      `CREATE DATABASE IF NOT EXISTS \`${connectionConfig.database}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
    );
    await rootConn.end();

    // Now connect to target database
    connection = await mysql.createConnection(connectionConfig);
    console.log('[+] Успешное подключение к базе данных MySQL!');
  } catch (err: unknown) {
    console.error('[!] Ошибка подключения к MySQL:', err instanceof Error ? err.message : err);
    console.error('\nУбедитесь, что:');
    console.error('1. Сервер MySQL запущен.');
    console.error(
      '2. Указаны верные переменные окружения: MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE.'
    );
    process.exit(1);
  }

  try {
    // 1. Применяем схему таблиц
    const schemaFile = path.resolve(process.cwd(), 'scripts/schema.mysql.sql');
    if (fs.existsSync(schemaFile)) {
      console.log('[*] Проверка и создание структуры таблиц (users, tasks, submissions)...');
      const schemaSql = fs.readFileSync(schemaFile, 'utf-8');
      await connection.query(schemaSql);
      console.log('[+] Таблицы успешно созданы/проверены.');
    }

    // 2. Импорт заданий (tasks)
    console.log(`[*] Импорт заданий (${tasks.length} шт.)...`);
    for (const task of tasks) {
      await connection.query(
        `INSERT INTO tasks (
          id, slug, module_id, task_number, title, module_code, description,
          assignment, video_url, nodes, theory, steps, script_command, questions,
          max_score, order_index, is_active, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          slug = VALUES(slug),
          module_id = VALUES(module_id),
          task_number = VALUES(task_number),
          title = VALUES(title),
          module_code = VALUES(module_code),
          description = VALUES(description),
          assignment = VALUES(assignment),
          video_url = VALUES(video_url),
          nodes = VALUES(nodes),
          theory = VALUES(theory),
          steps = VALUES(steps),
          script_command = VALUES(script_command),
          questions = VALUES(questions),
          max_score = VALUES(max_score),
          order_index = VALUES(order_index),
          is_active = VALUES(is_active),
          updated_at = VALUES(updated_at)`,
        [
          task.id,
          task.slug,
          task.module_id,
          task.task_number,
          task.title,
          task.module_code,
          task.description,
          task.assignment || null,
          task.video_url || null,
          JSON.stringify(task.nodes || []),
          JSON.stringify(task.theory || []),
          JSON.stringify(task.steps || []),
          task.script_command || null,
          JSON.stringify(task.questions || []),
          task.max_score ?? 5,
          task.order_index ?? 0,
          task.is_active ? 1 : 0,
          task.created_at || new Date().toISOString(),
          task.updated_at || new Date().toISOString(),
        ]
      );
    }
    console.log(`[+] Импортировано заданий: ${tasks.length}`);

    // 3. Импорт пользователей (users)
    console.log(`[*] Импорт пользователей (${users.length} шт.)...`);
    let usersCount = 0;
    for (const u of users) {
      await connection.query(
        `INSERT INTO users (
          id, username, password_hash, full_name, group_name, role, is_active,
          two_factor_enabled, two_factor_secret, two_factor_temp_secret,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          username = VALUES(username),
          password_hash = VALUES(password_hash),
          full_name = VALUES(full_name),
          group_name = VALUES(group_name),
          role = VALUES(role),
          is_active = VALUES(is_active),
          two_factor_enabled = VALUES(two_factor_enabled),
          two_factor_secret = VALUES(two_factor_secret),
          two_factor_temp_secret = VALUES(two_factor_temp_secret),
          updated_at = VALUES(updated_at)`,
        [
          u.id,
          u.username,
          u.password_hash,
          u.full_name,
          u.group_name,
          u.role,
          u.is_active ? 1 : 0,
          u.two_factor_enabled ? 1 : 0,
          u.two_factor_secret || null,
          u.two_factor_temp_secret || null,
          u.created_at || new Date().toISOString(),
          u.updated_at || new Date().toISOString(),
        ]
      );
      usersCount++;
    }
    console.log(`[+] Импортировано пользователей: ${usersCount}`);

    // 4. Импорт сдач (submissions)
    console.log(`[*] Импорт сдач и оценок (${submissions.length} шт.)...`);
    let subsCount = 0;
    for (const s of submissions) {
      await connection.query(
        `INSERT INTO submissions (
          id, user_id, task_id, log_output, answers, status,
          score, is_passed, feedback, reviewed_by, submitted_at, reviewed_at, allow_retake
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          log_output = VALUES(log_output),
          answers = VALUES(answers),
          status = VALUES(status),
          score = VALUES(score),
          is_passed = VALUES(is_passed),
          feedback = VALUES(feedback),
          reviewed_by = VALUES(reviewed_by),
          submitted_at = VALUES(submitted_at),
          reviewed_at = VALUES(reviewed_at),
          allow_retake = VALUES(allow_retake)`,
        [
          s.id,
          s.user_id,
          s.task_id,
          s.log_output || '',
          JSON.stringify(s.answers || {}),
          s.status,
          s.score !== undefined ? s.score : null,
          s.is_passed === true ? 1 : s.is_passed === false ? 0 : null,
          s.feedback || null,
          s.reviewed_by || null,
          s.submitted_at || new Date().toISOString(),
          s.reviewed_at || null,
          s.allow_retake ? 1 : 0,
        ]
      );
      subsCount++;
    }
    console.log(`[+] Импортировано сдач: ${subsCount}`);

    console.log('====================================================');
    console.log(' МИГРАЦИЯ УСПЕШНО ЗАВЕРШЕНА!');
    console.log(` Итого в MySQL (${connectionConfig.database}):`);
    console.log(` - Заданий: ${tasks.length}`);
    console.log(` - Пользователей: ${usersCount}`);
    console.log(` - Сдач и оценок: ${subsCount}`);
    console.log('====================================================');
  } catch (err: unknown) {
    console.error('[!] Ошибка во время выполнения миграции:', err);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

runMigration().catch(err => {
  console.error('Fatal error during migration:', err);
  process.exit(1);
});
