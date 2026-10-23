import React, { useState } from 'react';
import { Sparkles, X, Loader2, ArrowRight, Lightbulb } from 'lucide-react';
import { Priority } from '../types/todo';

interface SmartBreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
  onTasksGenerated: (
    tasks: Array<{
      title: string;
      category: string;
      priority: Priority;
      daysFromNow: number;
    }>,
    sourceGoal: string
  ) => void;
}

const PRESET_GOALS = [
  'Organizar apresentação de resultados do trimestre',
  'Planejar viagem de férias com a família',
  'Fazer faxina e organização geral da casa',
  'Estruturar rotina de estudos para certificação profissional',
];

export const SmartBreakdownModal: React.FC<SmartBreakdownModalProps> = ({
  isOpen,
  onClose,
  categories,
  onTasksGenerated,
}) => {
  const [goal, setGoal] = useState('');
  const [category, setCategory] = useState(categories[0] || 'Trabalho');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!goal.trim() || isLoading) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/breakdown', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          goal: goal.trim(),
          category,
        }),
      });

      if (!response.ok) {
        throw new Error('Falha ao comunicar com o assistente Gemini.');
      }

      const data = await response.json();
      if (!data.tasks || !Array.isArray(data.tasks) || data.tasks.length === 0) {
        throw new Error('Não foi possível obter subtarefas para este objetivo.');
      }

      onTasksGenerated(data.tasks, goal.trim());
      setGoal('');
      onClose();
    } catch (err: any) {
      console.error('Smart Breakdown error:', err);
      setErrorMessage(
        err.message || 'Ocorreu um erro ao processar. Tente novamente.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPreset = (preset: string) => {
    setGoal(preset);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden transition-all"
        role="dialog"
        aria-modal="true"
        aria-labelledby="breakdown-title"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h2
                id="breakdown-title"
                className="text-base font-bold text-slate-900 dark:text-white"
              >
                Smart Breakdown com IA
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Transforme grandes objetivos em 3 a 5 subtarefas práticas
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Qual é a meta ou projeto principal?
            </label>
            <textarea
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="Ex: Reformular a proposta de vendas da empresa e alinhar com diretoria"
              rows={3}
              className="w-full text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
              autoFocus
            />
          </div>

          {/* Quick Presets */}
          <div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-2 font-medium">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>Ou escolha um exemplo:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_GOALS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className="text-left text-xs px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors border border-transparent hover:border-indigo-200 dark:hover:border-indigo-800"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Category selection for generated tasks */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Categoria padrão para as subtarefas:
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300">
              {errorMessage}
            </div>
          )}

          {/* Modal Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={!goal.trim() || isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm transition-all active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Decompondo com Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Gerar e Adicionar Subtarefas</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
