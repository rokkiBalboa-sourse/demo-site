import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/auth';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/Button';
import {
  PREPARATION_TOPICS,
  getPreparationTopicBySlug,
} from '@/lib/preparation-data';
import { ProxmoxOverviewContent } from './ProxmoxOverviewContent';
import { StandInstallationContent } from './StandInstallationContent';
import {
  ChevronLeft,
  Video,
  FileText,
  Clock,
  Layers,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  BookOpen,
  DownloadCloud,
  ExternalLink,
} from 'lucide-react';

interface PreparationPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PreparationTopicPage({ params }: PreparationPageProps) {
  const { slug } = await params;
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  const topic = getPreparationTopicBySlug(slug);
  if (!topic) {
    notFound();
  }

  const currentIndex = PREPARATION_TOPICS.findIndex((t) => t.id === topic.id);
  const prevTopic = currentIndex > 0 ? PREPARATION_TOPICS[currentIndex - 1] : null;
  const nextTopic =
    currentIndex < PREPARATION_TOPICS.length - 1
      ? PREPARATION_TOPICS[currentIndex + 1]
      : null;

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col font-mono">
      <Header user={session} />

      <main className="max-w-5xl mx-auto px-4 py-8 flex-1 w-full space-y-6">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <Link
            href="/"
            className="hover:text-white transition flex items-center gap-1 text-zinc-400"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Главная</span>
          </Link>
          <span className="text-zinc-600">/</span>
          <span className="text-zinc-400">Подготовка к работе</span>
          <span className="text-zinc-600">/</span>
          <span className="text-zinc-200 font-bold truncate">{topic.title}</span>
        </div>

        {/* Topic Header Banner */}
        <div className="border border-zinc-800 bg-zinc-900/60 p-6 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold bg-white text-zinc-950 px-2 py-0.5">
                МОДУЛЬ {topic.number}
              </span>
              <span className="text-xs bg-zinc-800 border border-zinc-700 text-zinc-300 px-2 py-0.5">
                {topic.badge}
              </span>
            </div>
            {topic.duration && (
              <div className="flex items-center gap-1.5 text-xs text-zinc-400 bg-zinc-950 border border-zinc-800 px-2.5 py-1">
                <Clock className="w-3.5 h-3.5 text-zinc-400" />
                <span>Время изучения: {topic.duration}</span>
              </div>
            )}
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {topic.title}
          </h1>

          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-3xl">
            {topic.description}
          </p>
        </div>

        {/* Video Material Section */}
        <div className="border border-zinc-800 bg-zinc-900/60 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <Video className="w-4 h-4 text-emerald-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-white">
                Видео-материал
              </h2>
            </div>
            <span className="text-[11px] text-zinc-400">
              {topic.slug === 'stand-installation' ? '04:57 • Full HD 1080p' : 'Медиа-разбор'}
            </span>
          </div>

          {topic.slug === 'stand-installation' ? (
            <div className="space-y-4">
              <div className="relative border border-zinc-800 bg-black rounded overflow-hidden shadow-2xl">
                <video
                  controls
                  preload="metadata"
                  className="w-full h-auto aspect-video max-h-[580px] bg-black"
                >
                  <source src="/install.mp4" type="video/mp4" />
                  Ваш браузер не поддерживает встроенное воспроизведение видео.
                </video>
              </div>

              {/* Video Chapters / Timestamps */}
              <div className="border border-zinc-800 bg-zinc-950 p-4 space-y-2">
                <span className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider block">
                  Таймкоды ключевых этапов видео:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-[11px] text-zinc-400">
                  <div className="bg-zinc-900/80 border border-zinc-800 p-2 flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">00:00</span>
                    <span>Скачивание файлов и архива</span>
                  </div>
                  <div className="bg-zinc-900/80 border border-zinc-800 p-2 flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">00:40</span>
                    <span>Настройка ВМ в VMware (RAM, VT-x)</span>
                  </div>
                  <div className="bg-zinc-900/80 border border-zinc-800 p-2 flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">01:25</span>
                    <span>Первый запуск Proxmox VE</span>
                  </div>
                  <div className="bg-zinc-900/80 border border-zinc-800 p-2 flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">02:10</span>
                    <span>Смена и фиксация IP-адреса (dhclient)</span>
                  </div>
                  <div className="bg-zinc-900/80 border border-zinc-800 p-2 flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">03:30</span>
                    <span>Вход в веб-интерфейс (:8006, root/toor)</span>
                  </div>
                  <div className="bg-zinc-900/80 border border-zinc-800 p-2 flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">04:20</span>
                    <span>Проверка сети (ping ya.ru)</span>
                  </div>
                </div>
              </div>

              {/* Dedicated High-Visibility Download Button under Video */}
              <div className="pt-1">
                <a
                  href="https://docker.sudostudy.dev/s/jyta52m4nDy7DCp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-3 p-3.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-sm transition shadow-[0_0_25px_rgba(16,185,129,0.35)] cursor-pointer hover:scale-[1.008]"
                >
                  <DownloadCloud className="w-5 h-5 text-zinc-950" />
                  <span>СКАЧАТЬ СТЕНД И VMWARE WORKSTATION (ОБЛАЧНЫЙ ДИСК)</span>
                  <ExternalLink className="w-4 h-4 text-zinc-950" />
                </a>
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-zinc-800 bg-zinc-950/70 p-10 flex flex-col items-center justify-center text-center space-y-3 min-h-[260px] rounded-sm">
              <div className="w-14 h-14 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400">
                <Video className="w-6 h-6 text-zinc-400" />
              </div>
              <div className="space-y-1 max-w-md">
                <div className="text-sm font-bold text-zinc-200">
                  Видео-материал в процессе подготовки
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Здесь будет размещен обзор рабочего пространства Proxmox.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Text and Theory Material Section */}
        {topic.slug === 'proxmox-overview' ? (
          <ProxmoxOverviewContent />
        ) : topic.slug === 'stand-installation' ? (
          <StandInstallationContent />
        ) : (
          <div className="border border-zinc-800 bg-zinc-900/60 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-white">
                  Тестовый и теоретический материал
                </h2>
              </div>
              <span className="text-[11px] text-zinc-400">Методические указания</span>
            </div>

            {/* Text Content Placeholder */}
            <div className="border-2 border-dashed border-zinc-800 bg-zinc-950/70 p-8 flex flex-col items-center justify-center text-center space-y-3 min-h-[200px] rounded-sm">
              <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400">
                <FileText className="w-5 h-5 text-zinc-400" />
              </div>
              <div className="space-y-1 max-w-md">
                <div className="text-sm font-bold text-zinc-200">
                  Раздел подготавливается преподавателем
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Инструкции, пошаговые примеры, конфигурационные файлы и скриншоты будут добавлены в данный блок.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Bar between topics */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          {prevTopic ? (
            <Link href={`/preparation/${prevTopic.slug}`} className="w-full sm:w-auto">
              <Button
                variant="secondary"
                className="w-full sm:w-auto flex items-center justify-center gap-2 text-xs"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Предыдущий: {prevTopic.title}</span>
              </Button>
            </Link>
          ) : (
            <Link href="/" className="w-full sm:w-auto">
              <Button
                variant="secondary"
                className="w-full sm:w-auto flex items-center justify-center gap-2 text-xs"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>На главную</span>
              </Button>
            </Link>
          )}

          {nextTopic ? (
            <Link href={`/preparation/${nextTopic.slug}`} className="w-full sm:w-auto">
              <Button
                variant="primary"
                className="w-full sm:w-auto flex items-center justify-center gap-2 text-xs"
              >
                <span>Следующий: {nextTopic.title}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          ) : (
            <Link href="/" className="w-full sm:w-auto">
              <Button
                variant="primary"
                className="w-full sm:w-auto flex items-center justify-center gap-2 text-xs"
              >
                <span>К экзаменационным модулям</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          )}
        </div>
      </main>
    </div>
  );
}
