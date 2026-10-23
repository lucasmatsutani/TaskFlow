import React, { useState } from 'react';
import { Check, Calendar, Trash2, Edit2, AlertCircle, Clock } from 'lucide-react';
import { Task, Priority } from '../types/todo';
import { formatDueDate, getTodayString } from '../utils/date';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  categories: string[];
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggleComplete,
  onDelete,
  onUpdate,
  categories,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editCategory, setEditCategory] = useState(task.category);
  const [editPriority, setEditPriority] = useState<Priority>(task.priority);
  const [editDueDate, setEditDueDate] = useState(task.dueDate || '');

  const { label: dueDateLabel, isOverdue, isToday } = formatDueDate(task.dueDate);

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTitle.trim()) return;
    onUpdate(task.id, {
      title: editTitle.trim(),
      category: editCategory,
      priority: editPriority,
      dueDate: editDueDate || undefined,
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditTitle(task.title);
    setEditCategory(task.category);
    setEditPriority(task.priority);
    setEditDueDate(task.dueDate || '');
    setIsEditing(false);
  };

  const priorityStyles: Record<Priority, { label: string; textClass: string; dotClass: string }> = {
    high: {
      label: 'Alta',
      textClass: 'text-rose-600 dark:text-rose-400 font-semibold',
      dotClass: 'bg-rose-500',
    },
    medium: {
      label: 'Média',
      textClass: 'text-amber-600 dark:text-amber-400 font-medium',
      dotClass: 'bg-amber-500',
    },
    low: {
      label: 'Baixa',
      textClass: 'text-slate-500 dark:text-slate-400 font-normal',
      dotClass: 'bg-slate-400',
    },
  };

  if (isEditing) {
    return (
      <form
        onSubmit={handleSaveEdit}
        className="p-3.5 bg-slate-50 dark:bg-slate-800/80 border border-indigo-400 dark:border-indigo-600 rounded-xl space-y-3 shadow-xs"
      >
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="w-full text-sm font-medium bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
          autoFocus
        />

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            {/* Category select */}
            <select
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-slate-700 dark:text-slate-300 text-xs"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {/* Priority select */}
            <select
              value={editPriority}
              onChange={(e) => setEditPriority(e.target.value as Priority)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-slate-700 dark:text-slate-300 text-xs"
            >
              <option value="low">Baixa Prioridade</option>
              <option value="medium">Média Prioridade</option>
              <option value="high">Alta Prioridade</option>
            </select>

            {/* Due date input */}
            <input
              type="date"
              value={editDueDate}
              min={getTodayString()}
              onChange={(e) => setEditDueDate(e.target.value)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-slate-700 dark:text-slate-300 text-xs"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-xs"
            >
              Salvar
            </button>
          </div>
        </div>
      </form>
    );
  }

  return (
    <div
      className={`group relative flex items-start gap-3 p-3.5 sm:p-4 rounded-xl border transition-all duration-200 ${
        task.completed
          ? 'bg-slate-50/60 dark:bg-slate-900/40 border-slate-200/50 dark:border-slate-800/50'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs'
      }`}
    >
      {/* Custom Accessible Checkbox */}
      <button
        type="button"
        role="checkbox"
        aria-checked={task.completed}
        onClick={() => onToggleComplete(task.id)}
        className={`mt-0.5 w-5 h-5 rounded-lg flex items-center justify-center transition-all duration-200 shrink-0 ${
          task.completed
            ? 'bg-emerald-600 dark:bg-emerald-500 text-white shadow-xs'
            : 'border-2 border-slate-300 dark:border-slate-600 hover:border-indigo-500 dark:hover:border-indigo-400 bg-transparent'
        }`}
        title={task.completed ? 'Marcar como pendente' : 'Marcar como concluída'}
      >
        {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
      </button>

      {/* Task Content Area */}
      <div className="flex-1 min-w-0 pr-2">
        <p
          onClick={() => onToggleComplete(task.id)}
          className={`text-sm sm:text-base cursor-pointer break-words transition-all duration-200 leading-snug select-none ${
            task.completed
              ? 'line-through text-slate-400 dark:text-slate-500 opacity-60'
              : 'text-slate-900 dark:text-slate-100 font-medium'
          }`}
        >
          {task.title}
        </p>

        {/* Clean Metadata Line (Anti-slop: zero pills, clean text with separators) */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1.5 text-xs text-slate-500 dark:text-slate-400">
          {/* Category */}
          <span className="font-medium text-slate-600 dark:text-slate-300">
            {task.category}
          </span>

          <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">
            ·
          </span>

          {/* Priority with subtle dot */}
          <span className={`flex items-center gap-1.5 ${priorityStyles[task.priority].textClass}`}>
            <span
              className={`w-1.5 h-1.5 rounded-full ${priorityStyles[task.priority].dotClass}`}
            />
            {priorityStyles[task.priority].label}
          </span>

          {/* Due date if exists */}
          {task.dueDate && (
            <>
              <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">
                ·
              </span>
              <span
                className={`flex items-center gap-1 font-mono tabular-nums ${
                  task.completed
                    ? 'text-slate-400 dark:text-slate-500'
                    : isOverdue
                    ? 'text-rose-600 dark:text-rose-400 font-semibold'
                    : isToday
                    ? 'text-amber-600 dark:text-amber-400 font-semibold'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {isOverdue && !task.completed ? (
                  <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                ) : (
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                )}
                {dueDateLabel}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Row Action Buttons (Edit and Delete) */}
      <div className="flex items-center gap-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <button
          onClick={() => setIsEditing(true)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Editar tarefa"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => onDelete(task.id)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
          title="Excluir tarefa"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
