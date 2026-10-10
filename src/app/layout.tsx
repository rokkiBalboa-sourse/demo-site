import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SUDOSTUDY // Интерактивная отчётность 09.02.06',
  description:
    'Платформа сдачи отчётов, автоматизированного сбора логов выполнения и учёта успеваемости студентов ДЭ 09.02.06',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="dark h-full antialiased">
      <body className="min-h-full flex flex-col font-sans bg-zinc-950 text-zinc-100 selection:bg-zinc-100 selection:text-zinc-950">
        {children}
      </body>
    </html>
  );
}
