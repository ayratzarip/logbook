'use client';

import { useDiaryStore } from '@/lib/store/diary-store';
import { EntryCard } from './EntryCard';
import { Card } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { getTelegramWebApp } from '@/lib/utils/telegram';

export function EntryList() {
  const filteredEntries = useDiaryStore((state) => state.filteredEntries());
  const deleteEntry = useDiaryStore((state) => state.deleteEntry);
  const router = useRouter();

  const handleDelete = async (id: string) => {
    const webApp = getTelegramWebApp();
    
    const confirmed = webApp && typeof webApp.showConfirm === 'function'
      ? await new Promise<boolean>((resolve) => {
          webApp.showConfirm('Вы уверены, что хотите удалить эту запись?', (confirmed) => {
            resolve(confirmed);
          });
        })
      : window.confirm('Вы уверены, что хотите удалить эту запись?');

    if (confirmed) {
      try {
        await deleteEntry(id);
        if (webApp?.HapticFeedback?.notificationOccurred) {
          webApp.HapticFeedback.notificationOccurred('success');
        }
      } catch (error) {
        console.error('Ошибка удаления записи:', error);
        if (webApp && typeof webApp.showAlert === 'function') {
          webApp.showAlert('Не удалось удалить запись');
        } else {
          alert('Не удалось удалить запись');
        }
      }
    }
  };

  if (filteredEntries.length === 0) {
    return (
      <Card className="py-10 text-center">
        <div className="mb-4 text-5xl" aria-hidden>
          📝
        </div>
        <h3 className="text-h2 text-gray-0 dark:text-gray-100">Нет записей</h3>
        <p className="mt-2 text-caption">
          Создайте первую запись, чтобы начать вести дневник
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {filteredEntries.map((entry) => (
        <EntryCard
          key={entry.id}
          entry={entry}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}

