'use client';

import Link from 'next/link';
import { DiaryEntry } from '@/lib/types/diary';
import { Card } from '@/components/ui/card';
import { formatDateShort } from '@/lib/utils/date';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface EntryCardProps {
  entry: DiaryEntry;
  onDelete?: (id: string) => void;
}

export function EntryCard({ entry, onDelete }: EntryCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  const preview = entry.situationDescription.length > 100
    ? entry.situationDescription.substring(0, 100) + '...'
    : entry.situationDescription;

  return (
    <Card variant="highlight" className="relative cursor-pointer overflow-hidden">
      <div className="absolute inset-y-0 left-0 w-1 bg-brand-70" />

      <Link href={`/entry/${entry.id}`} className="block space-y-3 pl-4">
        <div className="flex items-center gap-2 text-caption">
          <span aria-hidden>🕐</span>
          <span>{formatDateShort(entry.dateTime)}</span>
        </div>

        <div>
          <h3 className="text-h2 text-gray-0 dark:text-gray-100">Ситуация</h3>
          <p className="text-body text-gray-35 dark:text-gray-90 line-clamp-2">
            {preview}
          </p>
        </div>
      </Link>

      <div className="absolute top-3 right-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
          className="h-8 w-8 p-0"
        >
          ⋮
        </Button>
        {showMenu && (
          <div className="absolute right-0 mt-2 w-40 rounded-2xl border border-gray-90 bg-gray-100 p-1 shadow-lg dark:border-gray-35 dark:bg-gray-5 z-10">
            <Link href={`/entry/${entry.id}/edit`}>
              <button className="w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-gray-35 hover:bg-gray-95 dark:text-gray-90 dark:hover:bg-gray-10">
                ✏️ Редактировать
              </button>
            </Link>
            {onDelete && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDelete(entry.id);
                  setShowMenu(false);
                }}
                className="w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-gray-95 dark:text-red-300 dark:hover:bg-gray-10"
              >
                🗑️ Удалить
              </button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}

