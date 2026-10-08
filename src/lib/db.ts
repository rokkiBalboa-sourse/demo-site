import fs from 'fs';
import path from 'path';
import { User, UserRole, Task, Submission, SubmissionWithDetails, ModuleInfo, StudentWithStats } from './types';
import { MODULES_LIST, TASKS_DATA } from './tasks-data';

// Initial Seed Users
const INITIAL_USERS: User[] = [
  {
    id: 'usr-admin-1',
    username: 'admin',
    password_hash: 'admin123',
    full_name: 'Кузнецов Валерий Сергеевич',
    group_name: 'STAFF',
    role: 'admin',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'usr-std-1',
    username: 'ivanov',
    password_hash: 'student123',
    full_name: 'Иванов Иван Иванович',
    group_name: '9СА-421',
    role: 'student',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'usr-std-2',
    username: 'petrov',
    password_hash: 'student123',
    full_name: 'Петров Алексей Владимирович',
    group_name: '9СА-421',
    role: 'student',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'usr-std-3',
    username: 'alekseev',
    password_hash: 'student123',
    full_name: 'Алексеев Максим Дмитриевич',
    group_name: '9СА-421',
    role: 'student',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'usr-std-4',
    username: 'sidorov',
    password_hash: 'student123',
    full_name: 'Сидоров Денис Михайлович',
    group_name: '9СА-42',
    role: 'student',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'usr-std-5',
    username: 'smirnov',
    password_hash: 'student123',
    full_name: 'Смирнов Кирилл Павлович',
    group_name: '9СА-42',
    role: 'student',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'usr-std-6',
    username: 'fedorov',
    password_hash: 'student123',
    full_name: 'Федоров Роман Игоревич',
    group_name: '9СА-42',
    role: 'student',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const INITIAL_SUBMISSIONS: Submission[] = [
  {
    id: 'sub-sample-1',
    user_id: 'usr-std-2', // petrov
    task_id: 'm1-task-1',
    log_output: `[2026-10-05 08:30:10] === STARTING AUTOMATED CHECK FOR M1 TASK 1 ===
[*] Host: isp.au-team.irpo | Kernel: 6.1.0-alt1
[*] Checking etcnet options for enp7s2 and enp7s3... OK
[*] Checking IP 172.16.1.1/28 on enp7s2... OK
[*] Checking IP 172.16.2.1/28 on enp7s3... OK
[*] Ping test from HQ-RTR (172.16.1.2) to ISP (172.16.1.1)... 0% packet loss
[+] ALL CHECKS PASSED: 5/5 points`,
    answers: {
      q1: '/28 (255.255.255.240)',
      q2: 'ipv4route',
    },
    status: 'reviewed',
    score: 5,
    is_passed: true,
    feedback: 'Отличная работа! Интерфейсы etcnet и FQDN настроены без ошибок.',
    reviewed_by: 'usr-admin-1',
    submitted_at: '2026-10-04T15:35:00.000Z',
    reviewed_at: '2026-10-04T15:40:00.000Z',
  },
  {
    id: 'sub-sample-2',
    user_id: 'usr-std-1', // ivanov
    task_id: 'm1-task-1',
    log_output: `[2026-10-05 08:18:02] === AUDIT: M1 TASK 1 ===
[*] Host: hq-rtr.au-team.irpo
[*] Checking enp7s1 configuration... OK (172.16.1.2/28)
[*] Checking default gateway... 172.16.1.1 OK
[*] Testing reachability... ping OK
[+] Verification successful.`,
    answers: {
      q1: '/28',
      q2: 'ipv4route',
    },
    status: 'pending',
    score: null,
    is_passed: null,
    feedback: null,
    reviewed_by: null,
    submitted_at: '2026-10-04T15:20:00.000Z',
    reviewed_at: null,
  },
  {
    id: 'sub-sample-3',
    user_id: 'usr-std-4', // sidorov
    task_id: 'm2-task-1',
    log_output: `[2026-10-05 09:08:45] === MODULE 2 TASK 1 AUDIT ===
[*] Checking Samba Active Directory DC service... RUNNING
[*] Realm: AU-TEAM.IRPO
[*] Checking SMB share netlogon/sysvol... OK
[*] Checking HQ-CLI domain join status... OK
[+] Domain Controller operational.`,
    answers: {
      q1: 'klist',
    },
    status: 'pending',
    score: null,
    is_passed: null,
    feedback: null,
    reviewed_by: null,
    submitted_at: '2026-10-04T16:10:00.000Z',
    reviewed_at: null,
  },
];

interface LocalStore {
  users: User[];
  tasks: Task[];
  submissions: Submission[];
}

const DATA_DIR = path.join(process.cwd(), '.data');
const DATA_FILE = path.join(DATA_DIR, 'store.json');

function ensureDataFile(): LocalStore {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  const envAdminUser = process.env.ADMIN_USERNAME?.trim();
  const envAdminPass = process.env.ADMIN_PASSWORD?.trim();
  const envAdminName = process.env.ADMIN_NAME?.trim();

  const applyAdminEnv = (users: User[]) => {
    if (!envAdminUser && !envAdminPass && !envAdminName) return;
    const admin = users.find((u) => u.role === 'admin');
    if (admin) {
      if (envAdminUser) admin.username = envAdminUser;
      if (envAdminPass) admin.password_hash = envAdminPass;
      if (envAdminName) admin.full_name = envAdminName;
    }
  };

  // Always sync tasks with TASKS_DATA definition to ensure all 32 tasks and detailed explanations are present
  if (!fs.existsSync(DATA_FILE)) {
    const initialUsers = JSON.parse(JSON.stringify(INITIAL_USERS)) as User[];
    applyAdminEnv(initialUsers);
    const initial: LocalStore = {
      users: initialUsers,
      tasks: TASKS_DATA,
      submissions: INITIAL_SUBMISSIONS,
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }

  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw) as LocalStore;

    // Always sync tasks with latest code definition
    parsed.tasks = TASKS_DATA;

    // Sync admin credentials from env if set
    applyAdminEnv(parsed.users);

    saveStore(parsed);
    return parsed;
  } catch {
    const initialUsers = JSON.parse(JSON.stringify(INITIAL_USERS)) as User[];
    applyAdminEnv(initialUsers);
    const fallback: LocalStore = {
      users: initialUsers,
      tasks: TASKS_DATA,
      submissions: INITIAL_SUBMISSIONS,
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(fallback, null, 2), 'utf-8');
    return fallback;
  }
}

function saveStore(store: LocalStore) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), 'utf-8');
}

export const db = {
  // Modules
  getAllModules(): ModuleInfo[] {
    return MODULES_LIST;
  },

  getModuleById(id: string): ModuleInfo | null {
    return MODULES_LIST.find((m) => m.id === id) || null;
  },

  // Users
  async findUserByUsername(username: string): Promise<User | null> {
    const store = ensureDataFile();
    const user = store.users.find((u) => u.username.toLowerCase() === username.toLowerCase());
    return user || null;
  },

  async findUserById(id: string): Promise<User | null> {
    const store = ensureDataFile();
    return store.users.find((u) => u.id === id) || null;
  },

  async getAllStudents(): Promise<User[]> {
    const store = ensureDataFile();
    return store.users
      .filter((u) => u.role === 'student' && u.is_active)
      .sort((a, b) => {
        if (a.group_name !== b.group_name) {
          return a.group_name.localeCompare(b.group_name);
        }
        return a.full_name.localeCompare(b.full_name);
      });
  },

  async getAllStudentsWithStats(): Promise<StudentWithStats[]> {
    const store = ensureDataFile();
    const students = store.users.filter((u) => u.role === 'student');

    return students
      .map((std) => {
        const subs = store.submissions.filter((s) => s.user_id === std.id);
        const passed = subs.filter((s) => s.status === 'reviewed' && s.is_passed);
        const totalScore = passed.reduce((acc, s) => acc + (s.score || 0), 0);
        return {
          ...std,
          submissions_count: subs.length,
          passed_count: passed.length,
          total_score: totalScore,
        };
      })
      .sort((a, b) => {
        if (a.group_name !== b.group_name) {
          return a.group_name.localeCompare(b.group_name);
        }
        return a.full_name.localeCompare(b.full_name);
      });
  },

  async createUser(data: {
    username: string;
    password_hash: string;
    full_name: string;
    group_name: string;
    role?: UserRole;
  }): Promise<User> {
    const store = ensureDataFile();
    const existing = store.users.find((u) => u.username.toLowerCase() === data.username.toLowerCase().trim());
    if (existing) {
      throw new Error(`Пользователь с логином "${data.username.trim()}" уже зарегистрирован`);
    }

    const newUser: User = {
      id: `usr-std-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      username: data.username.trim(),
      password_hash: data.password_hash.trim(),
      full_name: data.full_name.trim(),
      group_name: data.group_name.trim(),
      role: data.role || 'student',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    store.users.push(newUser);
    saveStore(store);
    return newUser;
  },

  async createStudentsBatch(students: Array<{
    full_name: string;
    group_name: string;
    username?: string;
    password?: string;
  }>): Promise<{ created: User[]; skipped: string[] }> {
    const store = ensureDataFile();
    const created: User[] = [];
    const skipped: string[] = [];

    const translitRu = (str: string): string => {
      const map: Record<string, string> = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e',
        'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
        'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
        'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch',
        'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
      };
      return str.toLowerCase().split('').map(ch => map[ch] ?? ch).join('').replace(/[^a-z0-9]/g, '');
    };

    const genUsername = (fullName: string): string => {
      const parts = fullName.trim().split(/\s+/);
      const lastName = parts[0] || 'student';
      const base = translitRu(lastName) || 'student';

      const exists = (uName: string) => store.users.some(u => u.username.toLowerCase() === uName.toLowerCase());
      if (!exists(base)) return base;

      if (parts.length > 1) {
        const initial = translitRu(parts[1][0] || '');
        if (initial && !exists(`${base}.${initial}`)) {
          return `${base}.${initial}`;
        }
      }

      let counter = 2;
      while (exists(`${base}${counter}`)) {
        counter++;
      }
      return `${base}${counter}`;
    };

    const genPassword = (): string => {
      const prefix = Math.random() > 0.5 ? 'stud' : 'exam';
      const num = Math.floor(1000 + Math.random() * 9000);
      return `${prefix}-${num}`;
    };

    for (const item of students) {
      if (!item.full_name || !item.full_name.trim()) continue;

      const groupName = item.group_name?.trim() || 'Без группы';
      const username = item.username?.trim() || genUsername(item.full_name);
      const existing = store.users.find((u) => u.username.toLowerCase() === username.toLowerCase());
      if (existing) {
        skipped.push(`${item.full_name.trim()} (${username} — логин уже занят)`);
        continue;
      }

      const password = item.password?.trim() || genPassword();
      const newUser: User = {
        id: `usr-std-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        username,
        password_hash: password,
        full_name: item.full_name.trim(),
        group_name: groupName,
        role: 'student',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      store.users.push(newUser);
      created.push(newUser);
    }

    if (created.length > 0) {
      saveStore(store);
    }

    return { created, skipped };
  },

  async updateUser(
    id: string,
    updates: Partial<Pick<User, 'full_name' | 'group_name' | 'username' | 'password_hash' | 'is_active'>>
  ): Promise<User | null> {
    const store = ensureDataFile();
    const idx = store.users.findIndex((u) => u.id === id);
    if (idx === -1) return null;

    if (updates.username && updates.username.toLowerCase().trim() !== store.users[idx].username.toLowerCase()) {
      const clash = store.users.find(
        (u) => u.id !== id && u.username.toLowerCase() === updates.username!.toLowerCase().trim()
      );
      if (clash) {
        throw new Error(`Логин "${updates.username.trim()}" уже занят другим пользователем`);
      }
    }

    store.users[idx] = {
      ...store.users[idx],
      ...updates,
      ...(updates.username ? { username: updates.username.trim() } : {}),
      ...(updates.full_name ? { full_name: updates.full_name.trim() } : {}),
      ...(updates.group_name ? { group_name: updates.group_name.trim() } : {}),
      ...(updates.password_hash ? { password_hash: updates.password_hash.trim() } : {}),
      updated_at: new Date().toISOString(),
    };
    saveStore(store);
    return store.users[idx];
  },

  async deleteUser(id: string): Promise<boolean> {
    const store = ensureDataFile();
    const idx = store.users.findIndex((u) => u.id === id);
    if (idx === -1) return false;

    store.users.splice(idx, 1);
    store.submissions = store.submissions.filter((s) => s.user_id !== id);
    saveStore(store);
    return true;
  },

  // Tasks
  async getAllTasks(): Promise<Task[]> {
    const store = ensureDataFile();
    return store.tasks.filter((t) => t.is_active).sort((a, b) => a.order_index - b.order_index);
  },

  async getTasksByModule(moduleId: string): Promise<Task[]> {
    const store = ensureDataFile();
    return store.tasks
      .filter((t) => t.module_id === moduleId && t.is_active)
      .sort((a, b) => a.task_number - b.task_number);
  },

  async getTaskBySlug(slug: string): Promise<Task | null> {
    const store = ensureDataFile();
    return store.tasks.find((t) => t.slug === slug && t.is_active) || null;
  },

  async getTaskById(id: string): Promise<Task | null> {
    const store = ensureDataFile();
    return store.tasks.find((t) => t.id === id) || null;
  },

  // Submissions
  async getSubmissionByUserAndTask(userId: string, taskId: string): Promise<Submission | null> {
    const store = ensureDataFile();
    return store.submissions.find((s) => s.user_id === userId && s.task_id === taskId) || null;
  },

  async getSubmissionById(id: string): Promise<SubmissionWithDetails | null> {
    const store = ensureDataFile();
    const sub = store.submissions.find((s) => s.id === id);
    if (!sub) return null;

    const student = store.users.find((u) => u.id === sub.user_id);
    const task = store.tasks.find((t) => t.id === sub.task_id);
    const reviewer = sub.reviewed_by ? store.users.find((u) => u.id === sub.reviewed_by) : null;

    return {
      ...sub,
      student_name: student?.full_name || 'Неизвестный студент',
      student_group: student?.group_name || '—',
      task_title: task?.title || 'Задание',
      task_module: task?.module_code || 'Модуль',
      task_module_id: task?.module_id || 'module-1',
      task_number: task?.task_number || 1,
      task_slug: task?.slug || '',
      task_questions: task?.questions,
      reviewer_name: reviewer?.full_name || null,
    };
  },

  async getAllSubmissionsWithDetails(): Promise<SubmissionWithDetails[]> {
    const store = ensureDataFile();
    return store.submissions.map((sub) => {
      const student = store.users.find((u) => u.id === sub.user_id);
      const task = store.tasks.find((t) => t.id === sub.task_id);
      const reviewer = sub.reviewed_by ? store.users.find((u) => u.id === sub.reviewed_by) : null;

      return {
        ...sub,
        student_name: student?.full_name || 'Неизвестный',
        student_group: student?.group_name || '—',
        task_title: task?.title || 'Задание',
        task_module: task?.module_code || 'Модуль',
        task_module_id: task?.module_id || 'module-1',
        task_number: task?.task_number || 1,
        task_slug: task?.slug || '',
        reviewer_name: reviewer?.full_name || null,
      };
    }).sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime());
  },

  async getUserSubmissions(userId: string): Promise<Submission[]> {
    const store = ensureDataFile();
    return store.submissions.filter((s) => s.user_id === userId);
  },

  async createOrUpdateSubmission(data: {
    userId: string;
    taskId: string;
    logOutput: string;
    answers: Record<string, string>;
  }): Promise<Submission> {
    const store = ensureDataFile();
    const existingIndex = store.submissions.findIndex(
      (s) => s.user_id === data.userId && s.task_id === data.taskId
    );

    const now = new Date().toISOString();

    if (existingIndex >= 0) {
      store.submissions[existingIndex] = {
        ...store.submissions[existingIndex],
        log_output: data.logOutput,
        answers: data.answers,
        status: 'pending',
        score: null,
        is_passed: null,
        submitted_at: now,
      };
      saveStore(store);
      return store.submissions[existingIndex];
    } else {
      const newSubmission: Submission = {
        id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        user_id: data.userId,
        task_id: data.taskId,
        log_output: data.logOutput,
        answers: data.answers,
        status: 'pending',
        score: null,
        is_passed: null,
        feedback: null,
        reviewed_by: null,
        submitted_at: now,
        reviewed_at: null,
      };
      store.submissions.push(newSubmission);
      saveStore(store);
      return newSubmission;
    }
  },

  async reviewSubmission(
    submissionId: string,
    reviewerId: string,
    data: {
      score: number | null;
      isPassed: boolean;
      feedback: string;
    }
  ): Promise<SubmissionWithDetails | null> {
    const store = ensureDataFile();
    const index = store.submissions.findIndex((s) => s.id === submissionId);
    if (index === -1) return null;

    store.submissions[index] = {
      ...store.submissions[index],
      score: data.score,
      is_passed: data.isPassed,
      feedback: data.feedback,
      status: data.isPassed ? 'reviewed' : 'rejected',
      reviewed_by: reviewerId,
      reviewed_at: new Date().toISOString(),
    };

    saveStore(store);
    return this.getSubmissionById(submissionId);
  },

  async updateAdminCredentials(data: {
    username?: string;
    password?: string;
    fullName?: string;
  }): Promise<User | null> {
    const store = ensureDataFile();
    const adminIndex = store.users.findIndex((u) => u.role === 'admin');
    if (adminIndex === -1) return null;

    if (data.username && data.username.toLowerCase().trim() !== store.users[adminIndex].username.toLowerCase()) {
      const clash = store.users.find(
        (u, idx) => idx !== adminIndex && u.username.toLowerCase() === data.username!.toLowerCase().trim()
      );
      if (clash) {
        throw new Error(`Логин "${data.username.trim()}" уже занят другим пользователем`);
      }
      store.users[adminIndex].username = data.username.trim();
    }

    if (data.password && data.password.trim()) {
      store.users[adminIndex].password_hash = data.password.trim();
    }

    if (data.fullName && data.fullName.trim()) {
      store.users[adminIndex].full_name = data.fullName.trim();
    }

    store.users[adminIndex].updated_at = new Date().toISOString();
    saveStore(store);
    return store.users[adminIndex];
  },

  async exportStore(): Promise<LocalStore> {
    return ensureDataFile();
  },

  async importStore(imported: { users: User[]; submissions: Submission[] }): Promise<void> {
    const store = ensureDataFile();
    if (!Array.isArray(imported.users) || !Array.isArray(imported.submissions)) {
      throw new Error('Некорректная структура файла резервной копии: отсутствуют массивы users или submissions');
    }

    // Backup current file before overriding
    const backupFile = path.join(DATA_DIR, `store.backup-${Date.now()}.json`);
    fs.writeFileSync(backupFile, JSON.stringify(store, null, 2), 'utf-8');

    store.users = imported.users;
    store.submissions = imported.submissions;
    store.tasks = TASKS_DATA;
    saveStore(store);
  },
};
