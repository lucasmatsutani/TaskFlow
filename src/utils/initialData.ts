import { Task } from '../types/todo';
import { getDateDaysFromNow } from './date';

export const INITIAL_CATEGORIES = [
  'Trabalho',
  'Pessoal',
  'Urgente',
  'Estudos',
  'Saúde',
  'Finanças',
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'sample-1',
    title: 'Finalizar relatório de métricas e indicadores do trimestre',
    category: 'Trabalho',
    priority: 'high',
    dueDate: getDateDaysFromNow(1),
    completed: false,
    createdAt: Date.now() - 3600000 * 24,
  },
  {
    id: 'sample-2',
    title: 'Comprar itens essenciais da despensa para a semana',
    category: 'Pessoal',
    priority: 'medium',
    dueDate: getDateDaysFromNow(0),
    completed: true,
    createdAt: Date.now() - 3600000 * 48,
    completedAt: Date.now() - 3600000 * 2,
  },
  {
    id: 'sample-3',
    title: 'Configurar rotina de backup dos arquivos importantes',
    category: 'Urgente',
    priority: 'high',
    dueDate: getDateDaysFromNow(2),
    completed: false,
    createdAt: Date.now() - 3600000 * 12,
  },
  {
    id: 'sample-4',
    title: 'Treino aeróbico de 30 minutos e hidratação',
    category: 'Saúde',
    priority: 'low',
    dueDate: getDateDaysFromNow(0),
    completed: false,
    createdAt: Date.now() - 3600000 * 5,
  },
];
