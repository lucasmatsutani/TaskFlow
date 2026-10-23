import React from 'react';
import { Search, X, ArrowUpDown, Tag } from 'lucide-react';
import { FilterStatus, SortOption } from '../types/todo';

interface FilterBarProps {
  statusFilter: FilterStatus;
  onChangeStatusFilter: (status: FilterStatus) => void;
  selectedCategory: string;
  onChangeCategory: (category: string) => void;
  categories: string[];
  searchQuery: string;
  onChangeSearchQuery: (query: string) => void;
  sortBy: SortOption;
  onChangeSortBy: (sort: SortOption) => void;
  allCount: number;
  pendingCount: number;
  completedCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  statusFilter,
  onChangeStatusFilter,
  selectedCategory,
  onChangeCategory,
  categories,
  searchQuery,
  onChangeSearchQuery,
  sortBy,
  onChangeSortBy,
  allCount,
  pendingCount,
  completedCount,
}) => {
  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Top Row: Search and Status Tabs */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Status Segmented Control */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200/60 dark:border-slate-700/60 self-start md:self-auto w-full md:w-auto">
          <button
            onClick={() => onChangeStatusFilter('all')}
            className={`flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              statusFilter === 'all'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>Todas</span>
            <span className="text-[11px] font-mono tabular-nums px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
              {allCount}
            </span>
          </button>

          <button
            onClick={() => onChangeStatusFilter('pending')}
            className={`flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              statusFilter === 'pending'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>Pendentes</span>
            <span className="text-[11px] font-mono tabular-nums px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 text-amber-600 dark:text-amber-400 font-bold">
              {pendingCount}
            </span>
          </button>

          <button
            onClick={() => onChangeStatusFilter('completed')}
            className={`flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              statusFilter === 'completed'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>Concluídas</span>
            <span className="text-[11px] font-mono tabular-nums px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 font-bold">
              {completedCount}
            </span>
          </button>
        </div>

        {/* Search Bar & Sort Dropdown */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 md:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onChangeSearchQuery(e.target.value)}
              placeholder="Buscar tarefas ou tags..."
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-7 py-1.5 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
            />
            {searchQuery && (
              <button
                onClick={() => onChangeSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2.5 py-1.5 rounded-xl text-xs text-slate-700 dark:text-slate-300">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => onChangeSortBy(e.target.value as SortOption)}
              className="bg-transparent focus:outline-none cursor-pointer text-xs"
            >
              <option value="dueDate" className="dark:bg-slate-900">
                Prazo de entrega
              </option>
              <option value="priority" className="dark:bg-slate-900">
                Maior prioridade
              </option>
              <option value="createdAt" className="dark:bg-slate-900">
                Mais recentes
              </option>
              <option value="alphabetical" className="dark:bg-slate-900">
                Alfabética (A-Z)
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Pills Strip */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        <span className="text-slate-400 dark:text-slate-500 flex items-center gap-1 mr-1 text-[11px] shrink-0 font-medium">
          <Tag className="w-3 h-3" /> Categorias:
        </span>

        <button
          onClick={() => onChangeCategory('all')}
          className={`px-2.5 py-1 rounded-lg font-medium transition-all shrink-0 ${
            selectedCategory === 'all'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Todas
        </button>

        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onChangeCategory(cat)}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all shrink-0 ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};
