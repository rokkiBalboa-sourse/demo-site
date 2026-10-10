export interface PreparationTopic {
  id: string;
  slug: string;
  number: number;
  title: string;
  description: string;
  duration?: string;
  badge?: string;
}

export const PREPARATION_TOPICS: PreparationTopic[] = [
  {
    id: 'proxmox-overview',
    slug: 'proxmox-overview',
    number: 1,
    title: 'Знакомство с Proxmox',
    description:
      'Интерфейс гипервизора Proxmox VE, управление питанием узлов и подключение к консолям.',
    duration: '~10 мин',
    badge: 'Стенд & Топология',
  },
  {
    id: 'stand-installation',
    slug: 'stand-installation',
    number: 2,
    title: 'Установка стенда',
    description:
      'Пошаговая инструкция по развёртыванию виртуального стенда на домашнем ПК для самостоятельной подготовки.',
    duration: '~25 мин',
    badge: 'Домашняя практика',
  },
  {
    id: 'report-guide',
    slug: 'report-guide',
    number: 3,
    title: 'Как заполнить отчёт',
    description:
      'Регламент сдачи заданий: порядок выполнения команд, запуск проверочного скрипта и отправка на проверку.',
    duration: '~5 мин',
    badge: 'Регламент сдачи',
  },
];

export function getPreparationTopicBySlug(slug: string): PreparationTopic | undefined {
  return PREPARATION_TOPICS.find(t => t.slug === slug);
}
