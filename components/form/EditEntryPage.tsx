'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { EntryFormStepper } from '@/components/form/EntryFormStepper';
import { DiaryEntry } from '@/lib/types/diary';
import { telegramStorageService } from '@/lib/services/telegram-storage';
import { waitForTelegramWebApp } from '@/lib/utils/telegram';

export function EditEntryPageClient() {
  const params = useParams();
  const [entry, setEntry] = useState<DiaryEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadEntry() {
      try {
        // Ждем готовности Telegram WebApp
        await waitForTelegramWebApp(3000);
        
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
      <div className="min-h-screen bg-gray-95 dark:bg-brand-10 pb-20">
        <Header title="Редактирование" showExport={false} showAddToHome={false} />
        <div className="container mx-auto px-4 py-12 max-w-3xl">
          <div className="text-center">
            <div className="text-2xl mb-2">⏳</div>
            <p className="text-body">Загрузка...</p>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-95 dark:bg-brand-10 pb-20">
      <Header title="Редактирование" showExport={false} showAddToHome={false} />
      
      <main className="container mx-auto px-4 py-4 max-w-3xl">
        <EntryFormStepper initialEntry={entry} />
      </main>

      <BottomNav />
    </div>
  );
}
