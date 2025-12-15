import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export function formatDateShort(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'dd.MM.yyyy HH:mm', { locale: ru });
}

export function formatDateLong(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'dd MMMM yyyy, HH:mm', { locale: ru });
}

