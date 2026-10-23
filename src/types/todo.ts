export type Priority = 'high' | 'medium' | 'low';

export type FilterStatus = 'all' | 'pending' | 'completed';

export type SortOption = 'createdAt' | 'dueDate' | 'priority' | 'alphabetical';

export interface Task {
  id: string;
  title: string;
  category: string;
  priority: Priority;
  dueDate?: string; // Formato YYYY-MM-DD
  completed: boolean;
  createdAt: number;
  completedAt?: number;
}

export type Theme = 'light' | 'dark';

export interface ToastMessage {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'warning';
  undoAction?: () => void;
}
