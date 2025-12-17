import { DiaryEntry } from '@/lib/types/diary';
import { format } from 'date-fns';

function sanitizeCsvField(text: string): string {
  if (text.includes(',') || text.includes('"') || text.includes('\n')) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

export function exportToCsv(entries: DiaryEntry[]): void {
  if (entries.length === 0) return;

  // Русские заголовки для лучшей читаемости
  const headers = [
    'ID',
    'Дата и время',
    'Описание ситуации',
    'Фокус внимания',
    'Мысли',
    'Телесные ощущения',
    'Действия и результат',
    'Что делать в будущем'
  ];

  const rows = entries.map(entry => [
    sanitizeCsvField(entry.id),
    sanitizeCsvField(format(new Date(entry.dateTime), 'dd.MM.yyyy HH:mm')),
    sanitizeCsvField(entry.situationDescription),
    sanitizeCsvField(entry.attentionFocus),
    sanitizeCsvField(entry.thoughts),
    sanitizeCsvField(entry.bodySensations),
    sanitizeCsvField(entry.actions),
    sanitizeCsvField(entry.futureActions),
  ].join(','));

  const csvContent = [headers.join(','), ...rows].join('\n');
  
  // BOM для правильного отображения кириллицы в Excel
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `soft_skills_logbook_export_${format(new Date(), 'yyyyMMdd_HHmmss')}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

