'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { exportToCsv } from '@/lib/utils/csv-export';
import { useDiaryStore } from '@/lib/store/diary-store';
import { getTelegramWebApp } from '@/lib/utils/telegram';

export function Header() {
  const entries = useDiaryStore((state) => state.entries);

  const handleExport = () => {
    if (entries.length === 0) {
      const webApp = getTelegramWebApp();
      if (webApp) {
        webApp.showAlert('Нет записей для экспорта');
      } else {
        alert('Нет записей для экспорта');
      }
      return;
    }
    exportToCsv(entries);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 dark:border-gray-700 bg-card-light/80 dark:bg-card-dark/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold text-primary">📔</span>
          <span className="text-lg font-semibold text-text-primary dark:text-white">
            Logbook
          </span>
        </Link>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleExport}
            title="Экспорт в CSV"
          >
            ⬇️
          </Button>
          <Link href="/instructions">
            <Button
              variant="ghost"
              size="sm"
              title="Инструкции"
            >
              ❓
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

