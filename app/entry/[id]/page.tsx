'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
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
      <div className="min-h-screen bg-gray-95 dark:bg-brand-10 pb-20">
        <Header title="Запись" showExport={false} showAddToHome={false} />
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

  if (!entry) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-95 dark:bg-brand-10 pb-20">
      <Header title="Запись" showExport={false} showAddToHome={false} />
      
      <main className="container mx-auto px-4 py-4 max-w-3xl">
        <EntryDetail entry={entry} />

        {/* Кнопка редактирования */}
        <div className="mt-6 flex justify-center">
          <Link href={`/entry/${entry.id}/edit`}>
            <Button variant="secondary" className="gap-2">
              <span aria-hidden>✏️</span>
              Редактировать
            </Button>
          </Link>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
