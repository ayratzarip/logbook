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

  const headers = [
    'id', 'dateTime', 'situationDescription', 'attentionFocus',
    'thoughts', 'bodySensations', 'actions', 'futureActions'
  ];

  const rows = entries.map(entry => [
    sanitizeCsvField(entry.id),
    sanitizeCsvField(format(new Date(entry.dateTime), 'yyyy-MM-dd HH:mm:ss')),
    sanitizeCsvField(entry.situationDescription),
    sanitizeCsvField(entry.attentionFocus),
    sanitizeCsvField(entry.thoughts),
    sanitizeCsvField(entry.bodySensations),
    sanitizeCsvField(entry.actions),
    sanitizeCsvField(entry.futureActions),
  ].join(','));

  const csvContent = [headers.join(','), ...rows].join('\n');
  
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `soft_skills_logbook_export_${format(new Date(), 'yyyyMMdd_HHmmss')}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

