'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { SearchBar } from '@/components/diary/SearchBar';
import { EntryList } from '@/components/diary/EntryList';
import { Button } from '@/components/ui/button';
import { useDiaryStore } from '@/lib/store/diary-store';
import { getTelegramWebApp } from '@/lib/utils/telegram';
import Link from 'next/link';

export default function Home() {
  const loadEntries = useDiaryStore((state) => state.loadEntries);
  const isLoading = useDiaryStore((state) => state.isLoading);
  const [showAddToHome, setShowAddToHome] = useState(false);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  useEffect(() => {
    const webApp = getTelegramWebApp();
    if (webApp?.addToHomeScreen && webApp?.checkHomeScreenStatus) {
      // Проверяем, добавлено ли приложение на главный экран
      webApp.checkHomeScreenStatus((status) => {
        // Показываем кнопку только если приложение не добавлено
        setShowAddToHome(status !== 'added');
      });
    }
  }, []);

  const handleAddToHomeScreen = () => {
    const webApp = getTelegramWebApp();
    if (webApp?.addToHomeScreen) {
      webApp.HapticFeedback.impactOccurred('light');
      webApp.addToHomeScreen();
      // Скрываем кнопку после нажатия
      setShowAddToHome(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-95 dark:bg-brand-10">
      <Header />
      
      <main className="mx-auto max-w-5xl px-4 py-6 space-y-6">
        <div className="mb-6">
          <SearchBar />
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="text-2xl mb-2">⏳</div>
            <p className="text-body">Загрузка...</p>
          </div>
        ) : (
          <EntryList />
        )}

        {/* Кнопка "Добавить на главный экран" */}
        {showAddToHome && (
          <Button
            variant="secondary"
            size="sm"
            onClick={handleAddToHomeScreen}
            className="fixed bottom-6 left-6 h-12 px-4 rounded-full shadow-lg hover:shadow-xl transition-shadow z-50 flex items-center gap-2"
            title="Добавить на главный экран"
          >
            <span className="text-lg">📲</span>
            <span className="text-sm">На экран</span>
          </Button>
        )}

        {/* FAB кнопка */}
        <Link href="/entry/new">
          <Button
            variant="primary"
            size="lg"
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow z-50 bg-brand-70 text-white! hover:opacity-90 focus-visible:ring-brand-70/40 text-3xl font-light flex items-center justify-center leading-none"
          >
            +
          </Button>
        </Link>
      </main>
    </div>
  );
}
