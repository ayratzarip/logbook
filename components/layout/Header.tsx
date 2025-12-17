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
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        {/* Левая часть - Добавить на экран */}
        <div className="flex items-center">
          {showAddToHome && canAddToHome && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleAddToHomeScreen}
              title="Добавить на главный экран"
              className="gap-1"
            >
              <span aria-hidden>🏠</span>
              <span className="text-xs">На экран</span>
            </Button>
          )}
        </div>

        {/* Центр - Заголовок */}
        <h1 className="text-h2 text-gray-0 dark:text-gray-100 absolute left-1/2 -translate-x-1/2">
          {title}
        </h1>

        {/* Правая часть - Экспорт */}
        <div className="flex items-center">
          {showExport && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExport}
              title="Экспорт в CSV"
            >
              <span aria-hidden>⬇️</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

