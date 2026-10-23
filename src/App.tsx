import React, { useState } from 'react';
import { useTaskManager } from './hooks/useTaskManager';
import { Header } from './components/Header';
import { ProgressBar } from './components/ProgressBar';
import { TaskInput } from './components/TaskInput';
import { FilterBar } from './components/FilterBar';
import { TaskItem } from './components/TaskItem';
import { SmartBreakdownModal } from './components/SmartBreakdownModal';
import { Toast } from './components/Toast';
import { Sparkles, CheckCheck, ListFilter, Trash2 } from 'lucide-react';

export default function App() {
  const {
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
    dismissToast,
  } = useTaskManager();

  const [isBreakdownOpen, setIsBreakdownOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors selection:bg-indigo-500/20">
      {/* Top Navbar */}
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenSmartBreakdown={() => setIsBreakdownOpen(true)}
        completedCount={completedCount}
        totalCount={totalCount}
      />

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Progress Tracker Card */}
        <ProgressBar
          completedCount={completedCount}
          totalCount={totalCount}
        />

        {/* AI Quick Prompt Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/10 dark:bg-indigo-500/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-semibold text-indigo-950 dark:text-indigo-200">
                Tem uma meta grande ou projeto complexo?
              </p>
              <p className="text-xs text-indigo-700/80 dark:text-indigo-300/70">
                Use o Gemini para sugerir de 3 a 5 passos práticos instantaneamente.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsBreakdownOpen(true)}
            className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs transition-colors shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Usar Smart Breakdown</span>
          </button>
        </div>

        {/* Add New Task Form */}
        <section aria-label="Adicionar nova tarefa">
          <TaskInput
            categories={categories}
            onAddTask={addTask}
            onAddCategory={addCategory}
          />
        </section>

        {/* Filters, Categories & Sorting */}
        <section aria-label="Filtros e ordenação" className="pt-2">
          <FilterBar
            statusFilter={statusFilter}
            onChangeStatusFilter={setStatusFilter}
            selectedCategory={selectedCategory}
            onChangeCategory={setSelectedCategory}
            categories={categories}
            searchQuery={searchQuery}
            onChangeSearchQuery={setSearchQuery}
            sortBy={sortBy}
            onChangeSortBy={setSortBy}
            allCount={totalCount}
            pendingCount={pendingCount}
            completedCount={completedCount}
          />
        </section>

        {/* Task List Section */}
        <section aria-label="Lista de tarefas" className="space-y-2 pt-2">
          {filteredTasks.length > 0 ? (
            <div className="space-y-2">
              {filteredTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggleComplete={toggleCompleteTask}
                  onDelete={deleteTask}
                  onUpdate={updateTask}
                  categories={categories}
                />
              ))}
            </div>
          ) : (
            /* Clean Empty State */
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
                <ListFilter className="w-6 h-6 stroke-[1.5]" />
              </div>
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">
                {searchQuery || selectedCategory !== 'all' || statusFilter !== 'all'
                  ? 'Nenhuma tarefa encontrada com os filtros atuais'
                  : 'Sua lista de tarefas está vazia'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-4">
                {searchQuery || selectedCategory !== 'all' || statusFilter !== 'all'
                  ? 'Tente ajustar ou limpar a busca e categorias selecionadas para ver mais itens.'
                  : 'Adicione uma nova tarefa acima ou experimente o Smart Breakdown para gerar passos automáticos.'}
              </p>

              {(searchQuery || selectedCategory !== 'all' || statusFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setStatusFilter('all');
                  }}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                >
                  Limpar todos os filtros
                </button>
              )}
            </div>
          )}

          {/* List Footer Info & Clear Completed Button */}
          {completedCount > 0 && (
            <div className="flex items-center justify-between pt-4 px-2 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-900">
              <span className="flex items-center gap-1.5">
                <CheckCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>
                  {completedCount} {completedCount === 1 ? 'tarefa concluída' : 'tarefas concluídas'}
                </span>
              </span>

              <button
                onClick={clearCompleted}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Limpar concluídas</span>
              </button>
            </div>
          )}
        </section>
      </main>

      {/* Smart Breakdown AI Modal */}
      <SmartBreakdownModal
        isOpen={isBreakdownOpen}
        onClose={() => setIsBreakdownOpen(false)}
        categories={categories}
        onTasksGenerated={addSmartBreakdownTasks}
      />

      {/* Global Toast Notification */}
      <Toast toast={toast} onDismiss={dismissToast} />
    </div>
  );
}
