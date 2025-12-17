import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export function formatDateShort(date: Date | string): string {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return '';
    return format(dateObj, 'dd.MM.yyyy HH:mm', { locale: ru });
  } catch (e) {
    console.error('Date formatting error:', e);
    return '';
  }
}

export function formatDateLong(date: Date | string): string {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return '';
    return format(dateObj, 'dd MMMM yyyy, HH:mm', { locale: ru });
  } catch (e) {
    console.error('Date formatting error:', e);
    return '';
  }
}

