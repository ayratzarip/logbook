'use client';

import { useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { SearchBar } from '@/components/diary/SearchBar';
import { EntryList } from '@/components/diary/EntryList';
import { useDiaryStore } from '@/lib/store/diary-store';

export default function Home() {
  const loadEntries = useDiaryStore((state) => state.loadEntries);
  const isLoading = useDiaryStore((state) => state.isLoading);

  useEffect(() => {
    loadEntries();
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
