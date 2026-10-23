import { useState, useEffect, useMemo } from 'react';
import { Task, FilterStatus, SortOption, Priority, Theme, ToastMessage } from '../types/todo';
import { INITIAL_TASKS, INITIAL_CATEGORIES } from '../utils/initialData';
import { getDateDaysFromNow } from '../utils/date';

const STORAGE_KEYS = {
  TASKS: 'taskflow_tasks_v1',
  CATEGORIES: 'taskflow_categories_v1',
  THEME: 'taskflow_theme_v1',
};

export function useTaskManager() {
  // Theme state
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Apply theme class to <html>
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Categories state
  const [categories, setCategories] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse saved categories', e);
    }
    return INITIAL_CATEGORIES;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }, [categories]);

  const addCategory = (newCat: string) => {
    const trimmed = newCat.trim();
    if (trimmed && !categories.includes(trimmed)) {
      setCategories((prev) => [...prev, trimmed]);
    }
  };

  // Tasks state
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TASKS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Failed to parse saved tasks', e);
    }
    return INITIAL_TASKS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  }, [tasks]);

  // Toast notifications & Undo
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [lastDeletedTask, setLastDeletedTask] = useState<{ task: Task; index: number } | null>(null);

  // Filters & Sorting state
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('dueDate');

  // Task Actions
  const addTask = (data: {
    title: string;
    category: string;
    priority: Priority;
    dueDate?: string;
  }) => {
    const newTask: Task = {
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: data.title,
      category: data.category,
      priority: data.priority,
      dueDate: data.dueDate,
      completed: false,
      createdAt: Date.now(),
    };

    setTasks((prev) => [newTask, ...prev]);
    setToast({
      id: String(Date.now()),
      message: 'Tarefa adicionada com sucesso!',
      type: 'success',
    });
  };

  const toggleCompleteTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const isNowCompleted = !t.completed;
          return {
            ...t,
            completed: isNowCompleted,
            completedAt: isNowCompleted ? Date.now() : undefined,
          };
        }
        return t;
      })
    );
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
    setToast({
      id: String(Date.now()),
      message: 'Tarefa atualizada.',
      type: 'info',
    });
  };

  const deleteTask = (id: string) => {
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) return;
    const taskToDelete = tasks[index];

    setLastDeletedTask({ task: taskToDelete, index });
    setTasks((prev) => prev.filter((t) => t.id !== id));

    setToast({
      id: String(Date.now()),
      message: `Tarefa "${taskToDelete.title.slice(0, 24)}..." removida.`,
      type: 'info',
      undoAction: () => {
        setTasks((prev) => {
          const next = [...prev];
          next.splice(index, 0, taskToDelete);
          return next;
        });
      },
    });
  };

  const clearCompleted = () => {
    const completedTasks = tasks.filter((t) => t.completed);
    if (completedTasks.length === 0) return;

    setTasks((prev) => prev.filter((t) => !t.completed));
    setToast({
      id: String(Date.now()),
      message: `${completedTasks.length} tarefas concluídas foram limpas.`,
      type: 'info',
    });
  };

  const addSmartBreakdownTasks = (
    generatedTasks: Array<{
      title: string;
      category: string;
      priority: Priority;
      daysFromNow: number;
    }>,
    sourceGoal: string
  ) => {
    const newTasks: Task[] = generatedTasks.map((g, idx) => ({
      id: `ai-${Date.now()}-${idx}`,
      title: g.title,
      category: g.category || 'Trabalho',
      priority: g.priority || 'medium',
      dueDate: getDateDaysFromNow(typeof g.daysFromNow === 'number' ? g.daysFromNow : 3),
      completed: false,
      createdAt: Date.now() + idx,
    }));

    // Ensure category exists
    generatedTasks.forEach((g) => {
      if (g.category) addCategory(g.category);
    });

    setTasks((prev) => [...newTasks, ...prev]);

    setToast({
      id: String(Date.now()),
      message: `✨ ${newTasks.length} subtarefas criadas para "${sourceGoal.slice(0, 26)}..."!`,
      type: 'success',
    });
  };

  // Metrics
  const totalCount = tasks.length;
  const completedCount = useMemo(() => tasks.filter((t) => t.completed).length, [tasks]);
  const pendingCount = totalCount - completedCount;

  // Filtered & Sorted Tasks
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((t) => {
        // Status filter
        if (statusFilter === 'pending' && t.completed) return false;
        if (statusFilter === 'completed' && !t.completed) return false;

        // Category filter
        if (selectedCategory !== 'all' && t.category !== selectedCategory) return false;

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = t.title.toLowerCase().includes(q);
          const matchCategory = t.category.toLowerCase().includes(q);
          if (!matchTitle && !matchCategory) return false;
        }

        return true;
      })
      .sort((a, b) => {
        // Completed tasks naturally sink to bottom if both don't share completed state
        if (a.completed !== b.completed) {
          return a.completed ? 1 : -1;
        }

        if (sortBy === 'priority') {
          const weight: Record<Priority, number> = { high: 3, medium: 2, low: 1 };
          return weight[b.priority] - weight[a.priority];
        }

        if (sortBy === 'dueDate') {
          if (!a.dueDate && !b.dueDate) return b.createdAt - a.createdAt;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return a.dueDate.localeCompare(b.dueDate);
        }

        if (sortBy === 'alphabetical') {
          return a.title.localeCompare(b.title);
        }

        // Default 'createdAt' (newest first)
        return b.createdAt - a.createdAt;
      });
  }, [tasks, statusFilter, selectedCategory, searchQuery, sortBy]);

  return {
    tasks,
    filteredTasks,
    totalCount,
    completedCount,
    pendingCount,
    categories,
    addCategory,
    addTask,
    toggleCompleteTask,
    updateTask,
    deleteTask,
    clearCompleted,
    addSmartBreakdownTasks,
    statusFilter,
    setStatusFilter,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    theme,
    toggleTheme,
    toast,
    dismissToast: () => setToast(null),
  };
}
