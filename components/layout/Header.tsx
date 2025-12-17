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
    <header className="sticky top-0 z-40 border-b border-gray-90/80 bg-gray-100/90 backdrop-blur-lg dark:border-gray-35/80 dark:bg-gray-5/80">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-h2">
          <span className="text-2xl" aria-hidden>
            📔
          </span>
          <span className="text-gray-0 dark:text-gray-100">Записи</span>
        </Link>

        <div className="flex items-center gap-2">
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

