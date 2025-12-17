import { create } from 'zustand';
import { DiaryEntry } from '@/lib/types/diary';
import { telegramStorageService } from '@/lib/services/telegram-storage';

interface DiaryState {
  entries: DiaryEntry[];
  isLoading: boolean;
  searchQuery: string;
  
  // Actions
  loadEntries: () => Promise<void>;
  addEntry: (entry: Omit<DiaryEntry, 'id'>) => Promise<void>;
  updateEntry: (entry: DiaryEntry) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;
  
  // Computed
  filteredEntries: () => DiaryEntry[];
}

export const useDiaryStore = create<DiaryState>((set, get) => ({
  entries: [],
  isLoading: false,
  searchQuery: '',

  loadEntries: async () => {
    set({ isLoading: true });
    try {
      const entries = await telegramStorageService.getAllEntries();
      set({ entries, isLoading: false });
    } catch (error) {
      console.error('Ошибка загрузки записей:', error);
      set({ isLoading: false });
    }
  },

  addEntry: async (entry) => {
    try {
      await telegramStorageService.insertEntry(entry);
      await get().loadEntries();
    } catch (error) {
      console.error('Ошибка добавления записи:', error);
      throw error;
    }
  },

  updateEntry: async (entry) => {
    try {
      await telegramStorageService.updateEntry(entry);
      await get().loadEntries();
    } catch (error) {
      console.error('Ошибка обновления записи:', error);
      throw error;
    }
  },

  deleteEntry: async (id) => {
    try {
      await telegramStorageService.deleteEntry(id);
      await get().loadEntries();
    } catch (error) {
      console.error('Ошибка удаления записи:', error);
      throw error;
    }
  },

  setSearchQuery: (query) => set({ searchQuery: query }),
  clearSearch: () => set({ searchQuery: '' }),

  filteredEntries: () => {
    const { entries, searchQuery } = get();
    if (!searchQuery.trim()) return entries;
    
    const lowerQuery = searchQuery.toLowerCase();
    const safeInclude = (text?: string) => (text || '').toLowerCase().includes(lowerQuery);

    return entries.filter(entry => 
      safeInclude(entry.situationDescription) ||
      safeInclude(entry.attentionFocus) ||
      safeInclude(entry.thoughts) ||
      safeInclude(entry.bodySensations) ||
      safeInclude(entry.actions) ||
      safeInclude(entry.futureActions)
    );
  },
}));

