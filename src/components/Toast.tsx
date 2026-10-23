import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X, Undo2 } from 'lucide-react';
import { ToastMessage } from '../types/todo';

interface ToastProps {
  toast: ToastMessage | null;
  onDismiss: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      onDismiss();
    }, 4500);

    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-in slide-in-from-bottom-4 fade-in duration-200">
      <div className="bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-3 rounded-2xl shadow-xl flex items-center justify-between gap-3 border border-slate-800 dark:border-slate-200">
        <div className="flex items-center gap-2.5 min-w-0">
          {toast.type === 'warning' ? (
            <AlertCircle className="w-4 h-4 text-amber-400 dark:text-amber-600 shrink-0" />
          ) : toast.type === 'info' ? (
            <Info className="w-4 h-4 text-indigo-400 dark:text-indigo-600 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
          )}
          <span className="text-xs sm:text-sm font-medium leading-tight truncate">
            {toast.message}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {toast.undoAction && (
            <button
              onClick={() => {
                toast.undoAction?.();
                onDismiss();
              }}
              className="flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-lg bg-slate-800 dark:bg-slate-100 hover:bg-slate-700 dark:hover:bg-slate-200 text-indigo-300 dark:text-indigo-600 transition-colors"
            >
              <Undo2 className="w-3 h-3" />
              <span>Desfazer</span>
            </button>
          )}

          <button
            onClick={onDismiss}
            className="p-1 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-100 text-slate-400 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
