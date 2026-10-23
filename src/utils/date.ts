/**
 * Utilitários para formatação e cálculo de datas em português
 */

export function getTodayString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDateDaysFromNow(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDueDate(dateString?: string): {
  label: string;
  isOverdue: boolean;
  isToday: boolean;
} {
  if (!dateString) {
    return { label: 'Sem prazo', isOverdue: false, isToday: false };
  }

  const [year, month, day] = dateString.split('-').map(Number);
  const dueDate = new Date(year, month - 1, day);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffTime = dueDate.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      label: diffDays === -1 ? 'Ontem (Vencida)' : `${Math.abs(diffDays)}d atrás (Vencida)`,
      isOverdue: true,
      isToday: false,
    };
  }

  if (diffDays === 0) {
    return { label: 'Hoje', isOverdue: false, isToday: true };
  }

  if (diffDays === 1) {
    return { label: 'Amanhã', isOverdue: false, isToday: false };
  }

  if (diffDays < 7) {
    const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    return { label: `${weekdays[dueDate.getDay()]} (${diffDays}d)`, isOverdue: false, isToday: false };
  }

  const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  return {
    label: `${day} de ${months[dueDate.getMonth()]}`,
    isOverdue: false,
    isToday: false,
  };
}
