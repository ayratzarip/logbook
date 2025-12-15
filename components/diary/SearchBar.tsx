'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useDiaryStore } from '@/lib/store/diary-store';

export function SearchBar() {
  const [searchValue, setSearchValue] = useState('');
  const setSearchQuery = useDiaryStore((state) => state.setSearchQuery);
  const clearSearch = useDiaryStore((state) => state.clearSearch);

  // Debounce поиска
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue.trim()) {
        setSearchQuery(searchValue);
      } else {
        clearSearch();
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue, setSearchQuery, clearSearch]);

  const handleClear = () => {
    setSearchValue('');
    clearSearch();
  };

  return (
    <div className="relative">
      <Input
        type="text"
        placeholder="Поиск по записям..."
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        className="pl-10 pr-10"
      />
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        🔍
      </div>
      {searchValue && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
        >
          ✕
        </Button>
      )}
    </div>
  );
}

