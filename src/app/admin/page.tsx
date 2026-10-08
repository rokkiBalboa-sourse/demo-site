import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { Header } from '@/components/Header';
import { AdminDashboardClient } from './AdminDashboardClient';

export default async function AdminPage() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  if (session.role !== 'admin') {
    redirect('/');
  }

  const submissions = await db.getAllSubmissionsWithDetails();
  const tasks = await db.getAllTasks();
  const modules = db.getAllModules();
  const students = await db.getAllStudentsWithStats();

  // Extract unique groups
  const groupsSet = new Set<string>();
  for (const s of students) {
    if (s.group_name && s.group_name !== 'STAFF') {
      groupsSet.add(s.group_name);
    }
  }
  const availableGroups = Array.from(groupsSet).sort();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <Header user={session} />

      <main className="max-w-6xl mx-auto px-4 py-6 flex-1 w-full">
        <AdminDashboardClient
          submissions={submissions}
          tasks={tasks}
          modules={modules}
          availableGroups={availableGroups}
          students={students}
        />
      </main>
    </div>
  );
}
