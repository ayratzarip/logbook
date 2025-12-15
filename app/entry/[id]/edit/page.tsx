'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { EntryFormStepper } from '@/components/form/EntryFormStepper';
import { DiaryEntry } from '@/lib/types/diary';
import { telegramStorageService } from '@/lib/services/telegram-storage';

export default function EditEntryPage() {
  const params = useParams();
  const [entry, setEntry] = useState<DiaryEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadEntry() {
      try {
        const loadedEntry = await telegramStorageService.getEntry(params.id as string);
        setEntry(loadedEntry);
      } catch (error) {
        console.error('Ошибка загрузки записи:', error);
      } finally {
        setIsLoading(false);
      }
    }

    if (params.id) {
      loadEntry();
    }
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-light dark:bg-surface-dark">
        <Header />
        <div className="container mx-auto px-4 py-12 max-w-3xl">
          <div className="text-center">
            <div className="text-2xl mb-2">⏳</div>
            <p className="text-gray-600 dark:text-gray-400">Загрузка...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-light dark:bg-surface-dark">
      <Header />
      
      <main className="container mx-auto px-4 py-6 max-w-3xl">
        <EntryFormStepper initialEntry={entry} />
      </main>
    </div>
  );
}

