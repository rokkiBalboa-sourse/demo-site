export type UserRole = 'student' | 'admin';

export type SubmissionStatus = 'pending' | 'reviewed' | 'rejected';

export interface User {
  id: string;
  username: string;
  password_hash: string;
  full_name: string;
  group_name: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface StudentWithStats extends User {
  submissions_count: number;
  passed_count: number;
  total_score: number;
}

export interface TaskQuestionOption {
  id: string; // 'A' | 'B' | 'C' | 'D'
  text: string;
}

export interface TaskQuestion {
  id: string;
  text: string;
  placeholder?: string;
  options?: TaskQuestionOption[];
  correct_answer?: string;
}

export interface TaskTheoryBlock {
  title: string;
  explanation: string;
  details?: string[];
}

export interface TaskStep {
  step_number: number;
  node: string;
  title: string;
  explanation: string;
  commands: string;
}

export interface Task {
  id: string;
  slug: string;
  module_id: string; // 'module-1' | 'module-2' | 'module-3'
  task_number: number; // 1..11
  title: string;
  module_code: string; // 'Модуль 1', etc.
  description: string;
  assignment?: string;
  video_url?: string;
  nodes: string[]; // ['ISP', 'HQ-RTR', etc.]
  theory: TaskTheoryBlock[];
  steps: TaskStep[];
  script_command: string;
  questions: TaskQuestion[];
  max_score: number;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ModuleInfo {
  id: string;
  code: string;
  title: string;
  description: string;
  total_tasks: number;
  slug: string;
}

export interface Submission {
  id: string;
  user_id: string;
  task_id: string;
  log_output: string;
  answers: Record<string, string>;
  status: SubmissionStatus;
  score: number | null;
  is_passed: boolean | null;
  feedback: string | null;
  reviewed_by: string | null;
  submitted_at: string;
  reviewed_at: string | null;
  allow_retake?: boolean;
}

export interface SubmissionWithDetails extends Submission {
  student_name: string;
  student_group: string;
  task_title: string;
  task_module: string;
  task_module_id: string;
  task_number: number;
  task_slug: string;
  task_questions?: TaskQuestion[];
  reviewer_name?: string | null;
}

export interface SessionUser {
  id: string;
  username: string;
  full_name: string;
  group_name: string;
  role: UserRole;
}
