import React, { useState } from 'react';
import { Plus, Calendar, Tag, AlertCircle, ChevronDown } from 'lucide-react';
import { Priority } from '../types/todo';
import { getTodayString, getDateDaysFromNow } from '../utils/date';

interface TaskInputProps {
  categories: string[];
  onAddTask: (task: {
    title: string;
    category: string;
    priority: Priority;
    dueDate?: string;
  }) => void;
  onAddCategory: (category: string) => void;
}

export const TaskInput: React.FC<TaskInputProps> = ({
  categories,
  onAddTask,
  onAddCategory,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(categories[0] || 'Trabalho');
  const [newCategoryInput, setNewCategoryInput] = useState('');
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    let finalCategory = category;
    if (isAddingNewCategory && newCategoryInput.trim()) {
      finalCategory = newCategoryInput.trim();
      onAddCategory(finalCategory);
      setIsAddingNewCategory(false);
      setNewCategoryInput('');
    }

    onAddTask({
      title: title.trim(),
      category: finalCategory,
      priority,
      dueDate: dueDate || undefined,
    });

    // Reset fields
    setTitle('');
    setDueDate('');
    setPriority('medium');
  };

  const handleQuickDate = (days: number | null) => {
    if (days === null) {
      setDueDate('');
    } else {
      setDueDate(getDateDaysFromNow(days));
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm transition-all focus-within:border-indigo-500/80 dark:focus-within:border-indigo-500/80 focus-within:ring-2 focus-within:ring-indigo-500/10"
    >
      {/* Primary Input Line */}
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onFocus={() => setIsExpanded(true)}
          placeholder="Adicionar nova tarefa... (Pressione Enter para salvar)"
          className="flex-1 bg-transparent text-sm sm:text-base text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none"
        />

        <button
          type="submit"
          disabled={!title.trim()}
          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-sm active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span className="hidden sm:inline">Adicionar</span>
        </button>
      </div>

      {/* Expanded Controls: Category, Priority, and Due Date */}
      <div
        className={`pt-3 mt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs transition-all ${
          isExpanded || title.length > 0 ? 'block' : 'hidden sm:flex'
        }`}
      >
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Category Selector */}
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/60 px-2.5 py-1.5 rounded-lg border border-slate-200/80 dark:border-slate-700/80">
            <Tag className="w-3.5 h-3.5 text-slate-400" />
            {isAddingNewCategory ? (
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={newCategoryInput}
                  onChange={(e) => setNewCategoryInput(e.target.value)}
                  placeholder="Nova categoria"
                  className="w-24 bg-transparent text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setIsAddingNewCategory(false)}
                  className="text-slate-400 hover:text-slate-600 text-[10px] font-bold"
                >
                  ✕
                </button>
              </div>
            ) : (
              <select
                value={category}
                onChange={(e) => {
                  if (e.target.value === '__NEW__') {
                    setIsAddingNewCategory(true);
                  } else {
                    setCategory(e.target.value);
                  }
                }}
                className="bg-transparent text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer pr-1"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="dark:bg-slate-900">
                    {cat}
                  </option>
                ))}
                <option value="__NEW__" className="dark:bg-slate-900 font-semibold text-indigo-600">
                  + Criar categoria...
                </option>
              </select>
            )}
          </div>

          {/* Priority Segmented Selector */}
          <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800/60 p-1 rounded-lg border border-slate-200/80 dark:border-slate-700/80">
            <span className="text-[11px] font-medium text-slate-400 px-1.5">
              Prioridade:
            </span>
            <button
              type="button"
              onClick={() => setPriority('low')}
              className={`px-2 py-1 rounded-md font-medium transition-colors ${
                priority === 'low'
                  ? 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Baixa
            </button>
            <button
              type="button"
              onClick={() => setPriority('medium')}
              className={`px-2 py-1 rounded-md font-medium transition-colors ${
                priority === 'medium'
                  ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Média
            </button>
            <button
              type="button"
              onClick={() => setPriority('high')}
              className={`px-2 py-1 rounded-md font-medium transition-colors ${
                priority === 'high'
                  ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Alta
            </button>
          </div>

          {/* Due Date Picker */}
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/60 px-2.5 py-1.5 rounded-lg border border-slate-200/80 dark:border-slate-700/80">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="date"
              value={dueDate}
              min={getTodayString()}
              onChange={(e) => setDueDate(e.target.value)}
              className="bg-transparent text-slate-700 dark:text-slate-200 text-xs focus:outline-none cursor-pointer"
            />
          </div>
        </div>

        {/* Quick Date Shortcuts */}
        <div className="flex items-center gap-1.5 text-slate-400">
          <span className="text-[11px]">Prazo rápido:</span>
          <button
            type="button"
            onClick={() => handleQuickDate(0)}
            className="px-1.5 py-0.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px]"
          >
            Hoje
          </button>
          <button
            type="button"
            onClick={() => handleQuickDate(1)}
            className="px-1.5 py-0.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px]"
          >
            Amanhã
          </button>
          {dueDate && (
            <button
              type="button"
              onClick={() => handleQuickDate(null)}
              className="px-1.5 py-0.5 rounded text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-[11px]"
            >
              Limpar data
            </button>
          )}
        </div>
      </div>
    </form>
  );
};
