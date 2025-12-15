'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { EntryDetail } from '@/components/diary/EntryDetail';
import { Button } from '@/components/ui/button';
import { DiaryEntry } from '@/lib/types/diary';
import { telegramStorageService } from '@/lib/services/telegram-storage';
import { getTelegramWebApp } from '@/lib/utils/telegram';
import Link from 'next/link';

export default function EntryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [entry, setEntry] = useState<DiaryEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadEntry() {
      try {
        const loadedEntry = await telegramStorageService.getEntry(params.id as string);
        if (loadedEntry) {
          setEntry(loadedEntry);
        } else {
          const webApp = getTelegramWebApp();
          if (webApp) {
            webApp.showAlert('Запись не найдена', () => {
              router.push('/');
            });
          } else {
            alert('Запись не найдена');
            router.push('/');
          }
        }
      } catch (error) {
        console.error('Ошибка загрузки записи:', error);
      } finally {
        setIsLoading(false);
      }
    }

    if (params.id) {
      loadEntry();
    }
  }, [params.id, router]);

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

  if (!entry) {
    return null;
  }

  return (
    <div className="min-h-screen bg-surface-light dark:bg-surface-dark">
      <Header />
      
      <main className="container mx-auto px-4 py-6 max-w-3xl">
        <EntryDetail entry={entry} />

        {/* FAB кнопка редактирования */}
        <Link href={`/entry/${entry.id}/edit`}>
          <Button
            variant="gradient"
            size="lg"
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow z-50"
          >
            ✏️
          </Button>
        </Link>
      </main>
    </div>
  );
}

