'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { exportToCsv } from '@/lib/utils/csv-export';
import { useDiaryStore } from '@/lib/store/diary-store';
import { getTelegramWebApp } from '@/lib/utils/telegram';

interface HeaderProps {
  title?: string;
  showExport?: boolean;
  showAddToHome?: boolean;
}

export function Header({ title = 'Записи', showExport = true, showAddToHome = true }: HeaderProps) {
  const entries = useDiaryStore((state) => state.entries);
  const [canAddToHome, setCanAddToHome] = useState(false);

  useEffect(() => {
    if (showAddToHome) {
      const webApp = getTelegramWebApp();
      if (webApp?.addToHomeScreen && webApp?.checkHomeScreenStatus) {
        webApp.checkHomeScreenStatus((status) => {
          setCanAddToHome(status !== 'added');
        });
      }
    }
  }, [showAddToHome]);

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

  const handleAddToHomeScreen = () => {
    const webApp = getTelegramWebApp();
    if (webApp?.addToHomeScreen) {
      webApp.HapticFeedback.impactOccurred('light');
      webApp.addToHomeScreen();
      setCanAddToHome(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-gray-90/80 bg-gray-100/95 backdrop-blur-lg dark:border-gray-35/80 dark:bg-gray-5/95">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        {/* Левая часть - Добавить ярлык */}
        <div className="flex items-center min-w-[80px]">
          {showAddToHome && canAddToHome && (
            <button
              onClick={handleAddToHomeScreen}
              className="flex flex-col items-center gap-0.5 py-1 px-2 transition-colors"
              title="Добавить на главный экран"
            >
              <span className="text-xl" aria-hidden>📲</span>
              <span className="text-[10px] text-gray-60 whitespace-nowrap">Добавить ярлык</span>
            </button>
          )}
        </div>

        {/* Центр - Заголовок */}
        <h1 className="text-h2 text-gray-0 dark:text-gray-100">
          {title}
        </h1>

        {/* Правая часть - Скачать */}
        <div className="flex items-center min-w-[80px] justify-end">
          {showExport && (
            <button
              onClick={handleExport}
              className="flex flex-col items-center gap-0.5 py-1 px-2 transition-colors"
              title="Экспорт в CSV"
            >
              <span className="text-xl" aria-hidden>⬇️</span>
              <span className="text-[10px] text-gray-60">Скачать</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

