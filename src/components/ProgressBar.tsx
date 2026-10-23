import React from 'react';
import { CheckCircle2, Clock, ListTodo } from 'lucide-react';

interface ProgressBarProps {
  completedCount: number;
  totalCount: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  completedCount,
  totalCount,
}) => {
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const pendingCount = totalCount - completedCount;
  const isAllDone = totalCount > 0 && percentage === 100;

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              Progresso Geral
            </span>
            {isAllDone && (
              <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300">
                100% Concluído
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {isAllDone
              ? 'Excelente! Você finalizou todas as tarefas da sua lista.'
              : `${completedCount} de ${totalCount} tarefas finalizadas`}
          </p>
        </div>

        {/* Percentage Display */}
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-slate-900 dark:text-white font-mono tabular-nums tracking-tight">
            {percentage}
          </span>
          <span className="text-sm font-semibold text-slate-400 dark:text-slate-500">
            %
          </span>
        </div>
      </div>

      {/* Progress Track & Animated Fill */}
      <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden relative">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${
            isAllDone
              ? 'bg-emerald-500'
              : 'bg-indigo-600 dark:bg-indigo-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Metric Strip (Clean, unboxed metadata with tabular numbers) */}
      <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs">
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
          <ListTodo className="w-4 h-4 text-slate-400 shrink-0" />
          <span>
            Total: <strong className="font-semibold text-slate-800 dark:text-slate-200 tabular-nums">{totalCount}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
          <Clock className="w-4 h-4 text-amber-500 shrink-0" />
          <span>
            Pendentes: <strong className="font-semibold text-slate-800 dark:text-slate-200 tabular-nums">{pendingCount}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>
            Concluídas: <strong className="font-semibold text-slate-800 dark:text-slate-200 tabular-nums">{completedCount}</strong>
          </span>
        </div>
      </div>
    </div>
  );
};
