'use client';

import { DiaryEntry } from '@/lib/types/diary';
import { DetailCard } from './DetailCard';
import { formatDateLong } from '@/lib/utils/date';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface EntryDetailProps {
  entry: DiaryEntry;
}

export function EntryDetail({ entry }: EntryDetailProps) {
  const router = useRouter();

  return (
    <div className="space-y-4">
      <DetailCard
        icon="🕐"
        title="Дата и время записи"
        content={formatDateLong(entry.dateTime)}
      />
      <DetailCard
        icon="📝"
        title="Описание ситуации"
        content={entry.situationDescription}
      />
      <DetailCard
        icon="🎯"
        title="Фокус внимания"
        content={entry.attentionFocus}
      />
      <DetailCard
        icon="🧠"
        title="Мысли"
        content={entry.thoughts}
      />
      <DetailCard
        icon="💪"
        title="Телесные ощущения"
        content={entry.bodySensations}
      />
      <DetailCard
        icon="🏃"
        title="Действия"
        content={entry.actions}
      />
      <DetailCard
        icon="💡"
        title="Что делать в будущем"
        content={entry.futureActions}
      />
    </div>
  );
}

