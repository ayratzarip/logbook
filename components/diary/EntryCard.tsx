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
    <Card variant="gradient" className="relative group cursor-pointer hover:shadow-md transition-shadow">
      {/* Цветная полоска слева */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#3A5BA0] to-[#6EC6F5] rounded-l-2xl" />
      
      <Link href={`/entry/${entry.id}`} className="block">
        <div className="pl-4">
          {/* Дата и время */}
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>🕐</span>
            <span>{formatDateShort(entry.dateTime)}</span>
          </div>

          {/* Заголовок и превью */}
          <div>
            <h3 className="font-semibold text-text-primary dark:text-white mb-1">
              Ситуация
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
              {preview}
            </p>
          </div>
        </div>
      </Link>

      {/* Меню действий */}
      <div className="absolute top-2 right-2">
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
          <div className="absolute right-0 mt-1 w-32 bg-card-light dark:bg-card-dark rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
            <Link href={`/entry/${entry.id}/edit`}>
              <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg">
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
                className="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-b-lg"
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

