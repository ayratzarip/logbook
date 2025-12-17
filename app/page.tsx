'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { SearchBar } from '@/components/diary/SearchBar';
import { EntryList } from '@/components/diary/EntryList';
import { useDiaryStore } from '@/lib/store/diary-store';
import { waitForTelegramWebApp } from '@/lib/utils/telegram';

export default function Home() {
  const loadEntries = useDiaryStore((state) => state.loadEntries);
  const isLoading = useDiaryStore((state) => state.isLoading);
  const [isTelegramReady, setIsTelegramReady] = useState(false);

  useEffect(() => {
    async function initializeAndLoad() {
      try {
        // Ждем готовности Telegram WebApp перед загрузкой данных
        // Это особенно важно для CloudStorage, который может быть недоступен сразу
        await waitForTelegramWebApp(3000);
        setIsTelegramReady(true);
        
        // Небольшая задержка для гарантии полной инициализации CloudStorage
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Теперь безопасно загружаем данные
        loadEntries();
      } catch (error) {
        console.error('[Home] Ошибка инициализации:', error);
        // Продолжаем работу даже при ошибке
        setIsTelegramReady(true);
        loadEntries();
      }
    }

    initializeAndLoad();
  }, [loadEntries]);

  return (
    <div className="min-h-screen bg-gray-95 dark:bg-brand-10 pb-20">
      <Header title="Записи" />
      
      <main className="mx-auto max-w-5xl px-4 py-4 space-y-4">
        <SearchBar />

        {isLoading ? (
          <div className="text-center py-12">
            <div className="text-2xl mb-2">⏳</div>
            <p className="text-body">Загрузка...</p>
          </div>
        ) : (
          <EntryList />
        )}
      </main>

      <BottomNav />
    </div>
  );
}
