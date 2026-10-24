import { query, getMySqlPool } from './mysql';
import {
  User,
  UserRole,
  Task,
  Submission,
  SubmissionWithDetails,
  ModuleInfo,
  StudentWithStats,
} from './types';
import { MODULES_LIST, TASKS_DATA } from './tasks-data';
import { hashPassword } from './security';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

function mapUserRow(row: RowDataPacket): User {
  return {
    id: row.id,
    username: row.username,
    password_hash: row.password_hash,
    full_name: row.full_name,
    group_name: row.group_name,
    role: row.role as UserRole,
    is_active: Boolean(row.is_active),
    two_factor_enabled: Boolean(row.two_factor_enabled),
    two_factor_secret: row.two_factor_secret || null,
    two_factor_temp_secret: row.two_factor_temp_secret || null,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

function parseJsonField<T>(val: unknown, fallback: T): T {
  if (!val) return fallback;
  if (typeof val === 'object') return val as T;
  try {
    return JSON.parse(String(val)) as T;
  } catch {
    return fallback;
  }
}

function mapTaskRow(row: RowDataPacket): Task {
  return {
    id: row.id,
    slug: row.slug,
    module_id: row.module_id,
    task_number: Number(row.task_number),
    title: row.title,
    module_code: row.module_code,
    description: row.description,
    assignment: row.assignment || undefined,
    video_url: row.video_url || undefined,
    nodes: parseJsonField(row.nodes, []),
    theory: parseJsonField(row.theory, []),
    steps: parseJsonField(row.steps, []),
    script_command: row.script_command || '',
    questions: parseJsonField(row.questions, []),
    max_score: Number(row.max_score || 5),
    order_index: Number(row.order_index || 0),
    is_active: Boolean(row.is_active),
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

function mapSubmissionRow(row: RowDataPacket): Submission {
  return {
    id: row.id,
    user_id: row.user_id,
    task_id: row.task_id,
    log_output: row.log_output || '',
    answers: parseJsonField(row.answers, {}),
    status: row.status,
    score: row.score !== null && row.score !== undefined ? Number(row.score) : null,
    is_passed:
      row.is_passed === null || row.is_passed === undefined ? null : Boolean(row.is_passed),
    feedback: row.feedback || null,
    reviewed_by: row.reviewed_by || null,
    submitted_at: row.submitted_at,
    reviewed_at: row.reviewed_at || null,
    allow_retake: Boolean(row.allow_retake),
  };
}

export const mysqlDb = {
  // Modules
  getAllModules(): ModuleInfo[] {
    return MODULES_LIST;
  },

  getModuleById(id: string): ModuleInfo | null {
    return MODULES_LIST.find(m => m.id === id) || null;
  },

  // Users
  async findUserByUsername(username: string): Promise<User | null> {
    const rows = await query<RowDataPacket[]>(
      'SELECT * FROM users WHERE LOWER(username) = LOWER(?) LIMIT 1',
      [username.trim()]
    );
    if (!rows || rows.length === 0) return null;
    return mapUserRow(rows[0]);
  },

  async findUserById(id: string): Promise<User | null> {
    const rows = await query<RowDataPacket[]>('SELECT * FROM users WHERE id = ? LIMIT 1', [id]);
    if (!rows || rows.length === 0) return null;
    return mapUserRow(rows[0]);
  },

  async setUser2FATempSecret(userId: string, tempSecret: string): Promise<void> {
    await query('UPDATE users SET two_factor_temp_secret = ?, updated_at = ? WHERE id = ?', [
      tempSecret,
      new Date().toISOString(),
      userId,
    ]);
  },

  async confirmUser2FASetup(userId: string, secret: string): Promise<User | null> {
    const now = new Date().toISOString();
    await query(
      'UPDATE users SET two_factor_enabled = 1, two_factor_secret = ?, two_factor_temp_secret = NULL, updated_at = ? WHERE id = ?',
      [secret, now, userId]
    );
    return this.findUserById(userId);
  },

  async resetUser2FA(userId: string): Promise<User | null> {
    const now = new Date().toISOString();
    await query(
      'UPDATE users SET two_factor_enabled = 0, two_factor_secret = NULL, two_factor_temp_secret = NULL, updated_at = ? WHERE id = ?',
      [now, userId]
    );
    return this.findUserById(userId);
  },

  async getAllStudents(): Promise<User[]> {
    const rows = await query<RowDataPacket[]>(
      "SELECT * FROM users WHERE role = 'student' AND is_active = 1 ORDER BY group_name ASC, full_name ASC"
    );
    return rows.map(mapUserRow);
  },

  async getAllStudentsWithStats(): Promise<StudentWithStats[]> {
    const sql = `
      SELECT
        u.*,
        COUNT(s.id) AS submissions_count,
        COUNT(CASE WHEN s.status = 'reviewed' AND s.is_passed = 1 THEN 1 END) AS passed_count,
        COALESCE(SUM(CASE WHEN s.status = 'reviewed' AND s.is_passed = 1 THEN s.score ELSE 0 END), 0) AS total_score
      FROM users u
      LEFT JOIN submissions s ON s.user_id = u.id
      WHERE u.role = 'student'
      GROUP BY u.id
      ORDER BY u.group_name ASC, u.full_name ASC
    `;
    const rows = await query<RowDataPacket[]>(sql);
    return rows.map(row => ({
      ...mapUserRow(row),
      submissions_count: Number(row.submissions_count || 0),
      passed_count: Number(row.passed_count || 0),
      total_score: Number(row.total_score || 0),
    }));
  },

  async createUser(data: {
    username: string;
    password_hash: string;
    full_name: string;
    group_name: string;
    role?: UserRole;
  }): Promise<User> {
    const existing = await this.findUserByUsername(data.username);
    if (existing) {
      throw new Error(`Пользователь с логином "${data.username.trim()}" уже зарегистрирован`);
    }

    const id = `usr-std-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();
    const finalPasswordHash = data.password_hash.startsWith('scrypt$')
      ? data.password_hash.trim()
      : hashPassword(data.password_hash);

    await query(
      `INSERT INTO users (
        id, username, password_hash, full_name, group_name, role, is_active,
        two_factor_enabled, two_factor_secret, two_factor_temp_secret, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, 1, 0, NULL, NULL, ?, ?)`,
      [
        id,
        data.username.trim(),
        finalPasswordHash,
        data.full_name.trim(),
        data.group_name.trim(),
        data.role || 'student',
        now,
        now,
      ]
    );

    const created = await this.findUserById(id);
    if (!created) throw new Error('Не удалось создать пользователя в MySQL');
    return created;
  },

  async createStudentsBatch(
    students: Array<{
      full_name: string;
      group_name: string;
      username?: string;
      password?: string;
    }>
  ): Promise<{ created: User[]; skipped: string[] }> {
    const created: User[] = [];
    const skipped: string[] = [];

    const translitRu = (str: string): string => {
      const map: Record<string, string> = {
        а: 'a',
        б: 'b',
        в: 'v',
        г: 'g',
        д: 'd',
        е: 'e',
        ё: 'e',
        ж: 'zh',
        з: 'z',
        и: 'i',
        й: 'y',
        к: 'k',
        л: 'l',
        м: 'm',
        н: 'n',
        о: 'o',
        п: 'p',
        р: 'r',
        с: 's',
        т: 't',
        у: 'u',
        ф: 'f',
        х: 'kh',
        ц: 'ts',
        ч: 'ch',
        ш: 'sh',
        щ: 'shch',
        ъ: '',
        ы: 'y',
        ь: '',
        э: 'e',
        ю: 'yu',
        я: 'ya',
      };
      return str
        .toLowerCase()
        .split('')
        .map(ch => map[ch] ?? ch)
        .join('')
        .replace(/[^a-z0-9]/g, '');
    };

    const genPassword = (): string => {
      const prefix = Math.random() > 0.5 ? 'stud' : 'exam';
      const num = Math.floor(1000 + Math.random() * 9000);
      return `${prefix}-${num}`;
    };

    for (const item of students) {
      if (!item.full_name || !item.full_name.trim()) continue;

      const groupName = item.group_name?.trim() || 'Без группы';
      let username = item.username?.trim();

      if (!username) {
        const parts = item.full_name.trim().split(/\s+/);
        const lastName = parts[0] || 'student';
        const base = translitRu(lastName) || 'student';
        username = base;

        let existing = await this.findUserByUsername(username);
        if (existing && parts.length > 1) {
          const initial = translitRu(parts[1][0] || '');
          if (initial) {
            username = `${base}.${initial}`;
            existing = await this.findUserByUsername(username);
          }
        }

        let counter = 2;
        while (existing) {
          username = `${base}${counter}`;
          existing = await this.findUserByUsername(username);
          counter++;
        }
      } else {
        const existing = await this.findUserByUsername(username);
        if (existing) {
          skipped.push(`${item.full_name.trim()} (${username} — логин уже занят)`);
          continue;
        }
      }

      const password = item.password?.trim() || genPassword();
      const user = await this.createUser({
        username,
        password_hash: password,
        full_name: item.full_name.trim(),
        group_name: groupName,
        role: 'student',
      });
      created.push(user);
    }

    return { created, skipped };
  },

  async updateUser(
    id: string,
    updates: Partial<
      Pick<User, 'full_name' | 'group_name' | 'username' | 'password_hash' | 'is_active'>
    >
  ): Promise<User | null> {
    const existing = await this.findUserById(id);
    if (!existing) return null;

    if (
      updates.username &&
      updates.username.toLowerCase().trim() !== existing.username.toLowerCase()
    ) {
      const clash = await this.findUserByUsername(updates.username.trim());
      if (clash && clash.id !== id) {
        throw new Error(`Логин "${updates.username.trim()}" уже занят другим пользователем`);
      }
    }

    const fields: string[] = [];
    const params: unknown[] = [];

    if (typeof updates.username === 'string' && updates.username.trim()) {
      fields.push('username = ?');
      params.push(updates.username.trim());
    }
    if (typeof updates.full_name === 'string' && updates.full_name.trim()) {
      fields.push('full_name = ?');
      params.push(updates.full_name.trim());
    }
    if (typeof updates.group_name === 'string' && updates.group_name.trim()) {
      fields.push('group_name = ?');
      params.push(updates.group_name.trim());
    }
    if (typeof updates.is_active === 'boolean') {
      fields.push('is_active = ?');
      params.push(updates.is_active ? 1 : 0);
    }
    if (typeof updates.password_hash === 'string' && updates.password_hash.trim()) {
      fields.push('password_hash = ?');
      params.push(
        updates.password_hash.startsWith('scrypt$')
          ? updates.password_hash.trim()
          : hashPassword(updates.password_hash)
      );
    }

    if (fields.length === 0) return existing;

    fields.push('updated_at = ?');
    params.push(new Date().toISOString());
    params.push(id);

    await query(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, params);
    return this.findUserById(id);
  },

  async updateUserPasswordHash(id: string, hash: string): Promise<void> {
    await query('UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?', [
      hash,
      new Date().toISOString(),
      id,
    ]);
  },

  async deleteUser(id: string): Promise<boolean> {
    const res = await query<ResultSetHeader>('DELETE FROM users WHERE id = ?', [id]);
    return res.affectedRows > 0;
  },

  // Tasks
  async getAllTasks(): Promise<Task[]> {
    const rows = await query<RowDataPacket[]>(
      'SELECT * FROM tasks WHERE is_active = 1 ORDER BY order_index ASC'
    );
    if (!rows || rows.length === 0) {
      return TASKS_DATA;
    }
    return rows.map(mapTaskRow);
  },

  async getTasksByModule(moduleId: string): Promise<Task[]> {
    const rows = await query<RowDataPacket[]>(
      'SELECT * FROM tasks WHERE module_id = ? AND is_active = 1 ORDER BY task_number ASC',
      [moduleId]
    );
    return rows.map(mapTaskRow);
  },

  async getTaskBySlug(slug: string): Promise<Task | null> {
    const rows = await query<RowDataPacket[]>(
      'SELECT * FROM tasks WHERE slug = ? AND is_active = 1 LIMIT 1',
      [slug]
    );
    if (!rows || rows.length === 0) return null;
    return mapTaskRow(rows[0]);
  },

  async getTaskById(id: string): Promise<Task | null> {
    const rows = await query<RowDataPacket[]>(
      'SELECT * FROM tasks WHERE id = ? AND is_active = 1 LIMIT 1',
      [id]
    );
    if (!rows || rows.length === 0) return null;
    return mapTaskRow(rows[0]);
  },

  // Submissions
  async getSubmissionByUserAndTask(userId: string, taskId: string): Promise<Submission | null> {
    const rows = await query<RowDataPacket[]>(
      'SELECT * FROM submissions WHERE user_id = ? AND task_id = ? LIMIT 1',
      [userId, taskId]
    );
    if (!rows || rows.length === 0) return null;
    return mapSubmissionRow(rows[0]);
  },

  async getSubmissionById(id: string): Promise<SubmissionWithDetails | null> {
    const sql = `
      SELECT
        s.*,
        u.full_name AS student_name,
        u.group_name AS student_group,
        t.title AS task_title,
        t.module_code AS task_module,
        t.module_id AS task_module_id,
        t.task_number AS task_number,
        t.slug AS task_slug,
        t.questions AS task_questions,
        rev.full_name AS reviewer_name
      FROM submissions s
      JOIN users u ON u.id = s.user_id
      JOIN tasks t ON t.id = s.task_id
      LEFT JOIN users rev ON rev.id = s.reviewed_by
      WHERE s.id = ?
      LIMIT 1
    `;
    const rows = await query<RowDataPacket[]>(sql, [id]);
    if (!rows || rows.length === 0) return null;

    const row = rows[0];
    const sub = mapSubmissionRow(row);
    return {
      ...sub,
      student_name: row.student_name,
      student_group: row.student_group,
      task_title: row.task_title,
      task_module: row.task_module,
      task_module_id: row.task_module_id,
      task_number: Number(row.task_number),
      task_slug: row.task_slug,
      task_questions: parseJsonField(row.task_questions, []),
      reviewer_name: row.reviewer_name || null,
    };
  },

  async getUserSubmissions(userId: string): Promise<Submission[]> {
    const rows = await query<RowDataPacket[]>(
      'SELECT * FROM submissions WHERE user_id = ? ORDER BY submitted_at DESC',
      [userId]
    );
    return rows.map(mapSubmissionRow);
  },

  async getAllSubmissionsWithDetails(): Promise<SubmissionWithDetails[]> {
    const sql = `
      SELECT
        s.*,
        u.full_name AS student_name,
        u.group_name AS student_group,
        t.title AS task_title,
        t.module_code AS task_module,
        t.module_id AS task_module_id,
        t.task_number AS task_number,
        t.slug AS task_slug,
        t.questions AS task_questions,
        rev.full_name AS reviewer_name
      FROM submissions s
      JOIN users u ON u.id = s.user_id
      JOIN tasks t ON t.id = s.task_id
      LEFT JOIN users rev ON rev.id = s.reviewed_by
      ORDER BY s.submitted_at DESC
    `;
    const rows = await query<RowDataPacket[]>(sql);
    return rows.map(row => {
      const sub = mapSubmissionRow(row);
      return {
        ...sub,
        student_name: row.student_name,
        student_group: row.student_group,
        task_title: row.task_title,
        task_module: row.task_module,
        task_module_id: row.task_module_id,
        task_number: Number(row.task_number),
        task_slug: row.task_slug,
        task_questions: parseJsonField(row.task_questions, []),
        reviewer_name: row.reviewer_name || null,
      };
    });
  },

  async createOrUpdateSubmission(data: {
    userId: string;
    taskId: string;
    logOutput: string;
    answers: Record<string, string>;
  }): Promise<Submission> {
    const existing = await this.getSubmissionByUserAndTask(data.userId, data.taskId);
    if (
      existing &&
      existing.score !== null &&
      existing.score !== undefined &&
      existing.score >= 3 &&
      !existing.allow_retake
    ) {
      throw new Error(
        `Задание уже сдано с положительной оценкой (${existing.score}). Повторное прохождение заблокировано. Пересдача возможна только по согласованию с преподавателем.`
      );
    }

    const subId = existing
      ? existing.id
      : `sub-${Date.now()}-${Math.random().toString(36).substring(2, 7)}-${data.taskId}`;
    const now = new Date().toISOString();

    await query(
      `INSERT INTO submissions (
        id, user_id, task_id, log_output, answers, status, score, is_passed,
        feedback, reviewed_by, submitted_at, reviewed_at, allow_retake
      ) VALUES (?, ?, ?, ?, ?, 'pending', NULL, NULL, NULL, NULL, ?, NULL, 0)
      ON DUPLICATE KEY UPDATE
        log_output = VALUES(log_output),
        answers = VALUES(answers),
        status = 'pending',
        score = NULL,
        is_passed = NULL,
        feedback = NULL,
        reviewed_by = NULL,
        reviewed_at = NULL,
        submitted_at = VALUES(submitted_at),
        allow_retake = 0`,
      [subId, data.userId, data.taskId, data.logOutput, JSON.stringify(data.answers || {}), now]
    );

    const saved = await this.getSubmissionByUserAndTask(data.userId, data.taskId);
    if (!saved) throw new Error('Не удалось сохранить сдачу в MySQL');
    return saved;
  },

  async reviewSubmission(
    submissionId: string,
    reviewerId: string,
    data: {
      score: number | null;
      isPassed: boolean;
      feedback: string;
      allowRetake?: boolean;
    }
  ): Promise<SubmissionWithDetails | null> {
    const now = new Date().toISOString();
    const status = data.isPassed ? 'reviewed' : 'rejected';
    await query(
      `UPDATE submissions SET
        status = ?,
        score = ?,
        feedback = ?,
        is_passed = ?,
        reviewed_by = ?,
        reviewed_at = ?,
        allow_retake = ?
      WHERE id = ?`,
      [
        status,
        data.score,
        data.feedback || '',
        data.isPassed ? 1 : 0,
        reviewerId,
        now,
        data.allowRetake ? 1 : 0,
        submissionId,
      ]
    );

    return this.getSubmissionById(submissionId);
  },

  async setSubmissionRetakePermission(
    submissionId: string,
    allowRetake: boolean
  ): Promise<SubmissionWithDetails | null> {
    await query('UPDATE submissions SET allow_retake = ? WHERE id = ?', [
      allowRetake ? 1 : 0,
      submissionId,
    ]);
    return this.getSubmissionById(submissionId);
  },

  async bulkCloseAllAsFive(
    reviewerId: string,
    options: {
      scope: 'group' | 'all' | 'student';
      groupId?: string;
      studentId?: string;
    }
  ): Promise<{
    count: number;
    studentsCount: number;
    updatedSubmissions: SubmissionWithDetails[];
    updatedStudents: StudentWithStats[];
  }> {
    let targetStudents: User[] = [];
    if (options.scope === 'student' && options.studentId) {
      const student = await this.findUserById(options.studentId);
      if (student && student.role === 'student') targetStudents = [student];
    } else if (options.scope === 'group' && options.groupId) {
      const rows = await query<RowDataPacket[]>(
        "SELECT * FROM users WHERE role = 'student' AND group_name = ?",
        [options.groupId]
      );
      targetStudents = rows.map(mapUserRow);
    } else {
      const rows = await query<RowDataPacket[]>("SELECT * FROM users WHERE role = 'student'");
      targetStudents = rows.map(mapUserRow);
    }

    if (targetStudents.length === 0) {
      return {
        count: 0,
        studentsCount: 0,
        updatedSubmissions: [],
        updatedStudents: [],
      };
    }

    const tasks = await this.getAllTasks();
    const now = new Date().toISOString();
    let affectedCount = 0;

    for (const student of targetStudents) {
      for (const task of tasks) {
        const existing = await this.getSubmissionByUserAndTask(student.id, task.id);
        const subId = existing
          ? existing.id
          : `sub-${Date.now()}-${Math.random().toString(36).substring(2, 7)}-${task.id}`;
        const logOutput =
          existing?.log_output || '[АВТОМАТИЧЕСКАЯ ОЦЕНКА] Работа зачтена на 5 администратором.';

        await query(
          `INSERT INTO submissions (
            id, user_id, task_id, log_output, answers, status,
            score, is_passed, feedback, reviewed_by, submitted_at, reviewed_at, allow_retake
          ) VALUES (?, ?, ?, ?, '{}', 'reviewed', 5, 1, 'Зачтено на 5 (автоматически преподавателем)', ?, ?, ?, 0)
          ON DUPLICATE KEY UPDATE
            status = 'reviewed',
            score = 5,
            is_passed = 1,
            feedback = 'Зачтено на 5 (автоматически преподавателем)',
            reviewed_by = VALUES(reviewed_by),
            reviewed_at = VALUES(reviewed_at),
            allow_retake = 0`,
          [subId, student.id, task.id, logOutput, reviewerId, now, now]
        );
        affectedCount++;
      }
    }

    const allSubs = await this.getAllSubmissionsWithDetails();
    const allStudentsWithStats = await this.getAllStudentsWithStats();

    return {
      count: affectedCount,
      studentsCount: targetStudents.length,
      updatedSubmissions: allSubs,
      updatedStudents: allStudentsWithStats,
    };
  },

  async updateAdminCredentials(data: {
    username?: string;
    password?: string;
    fullName?: string;
  }): Promise<User | null> {
    const adminRows = await query<RowDataPacket[]>(
      "SELECT * FROM users WHERE role = 'admin' LIMIT 1"
    );
    if (!adminRows || adminRows.length === 0) return null;
    const admin = mapUserRow(adminRows[0]);

    if (data.username && data.username.toLowerCase().trim() !== admin.username.toLowerCase()) {
      const clash = await this.findUserByUsername(data.username.trim());
      if (clash && clash.id !== admin.id) {
        throw new Error(`Логин "${data.username.trim()}" уже занят другим пользователем`);
      }
    }

    const fields: string[] = [];
    const params: unknown[] = [];

    if (data.username && data.username.trim()) {
      fields.push('username = ?');
      params.push(data.username.trim());
    }
    if (data.password && data.password.trim()) {
      fields.push('password_hash = ?');
      params.push(hashPassword(data.password.trim()));
    }
    if (data.fullName && data.fullName.trim()) {
      fields.push('full_name = ?');
      params.push(data.fullName.trim());
    }

    if (fields.length > 0) {
      fields.push('updated_at = ?');
      params.push(new Date().toISOString());
      params.push(admin.id);
      await query(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, params);
    }

    return this.findUserById(admin.id);
  },

  async exportStore(): Promise<{ users: User[]; tasks: Task[]; submissions: Submission[] }> {
    const userRows = await query<RowDataPacket[]>('SELECT * FROM users');
    const taskRows = await query<RowDataPacket[]>('SELECT * FROM tasks ORDER BY order_index ASC');
    const subRows = await query<RowDataPacket[]>('SELECT * FROM submissions');

    return {
      users: userRows.map(mapUserRow),
      tasks: taskRows.map(mapTaskRow),
      submissions: subRows.map(mapSubmissionRow),
    };
  },

  async importStore(imported: { users: User[]; submissions: Submission[] }): Promise<void> {
    if (!Array.isArray(imported.users) || !Array.isArray(imported.submissions)) {
      throw new Error('Некорректная структура: отсутствуют массивы users или submissions');
    }

    const pool = getMySqlPool();
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      for (const u of imported.users) {
        await conn.query(
          `INSERT INTO users (
            id, username, password_hash, full_name, group_name, role, is_active,
            two_factor_enabled, two_factor_secret, two_factor_temp_secret, created_at, updated_at
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
      }

      for (const s of imported.submissions) {
        await conn.query(
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
      }

      await conn.commit();
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  },
};
