'use client';

import { useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { SearchBar } from '@/components/diary/SearchBar';
import { EntryList } from '@/components/diary/EntryList';
import { Button } from '@/components/ui/button';
import { useDiaryStore } from '@/lib/store/diary-store';
import Link from 'next/link';

export default function Home() {
  const loadEntries = useDiaryStore((state) => state.loadEntries);
  const isLoading = useDiaryStore((state) => state.isLoading);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  return (
    <div className="min-h-screen bg-surface-light dark:bg-surface-dark">
      <Header />
      
      <main className="container mx-auto px-4 py-6 max-w-3xl">
        <div className="mb-6">
          <SearchBar />
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="text-2xl mb-2">⏳</div>
            <p className="text-gray-600 dark:text-gray-400">Загрузка...</p>
          </div>
        ) : (
          <EntryList />
        )}

        {/* FAB кнопка */}
        <Link href="/entry/new">
          <Button
            variant="gradient"
            size="lg"
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow z-50"
          >
            ➕
          </Button>
        </Link>
      </main>
    </div>
  );
}
